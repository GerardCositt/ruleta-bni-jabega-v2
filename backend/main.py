from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import random
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import engine, Base, get_db
from models import Miembro, Ganador
from schemas import (
    Miembro as MiembroSchema, MiembroCreate, MiembroUpdate,
    Ganador as GanadorSchema, GanadorCreate,
    Estadistica, SorteoRequest, SorteoResponse,
    AuthRequest, AuthResponse
)
from auth import (
    verify_admin_password, verify_backdoor_password,
    create_access_token, verify_token
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(
    title="Ruleta de Sorteos BNI Jábega API",
    description="API para ruleta de sorteos BNI Jábega",
    version="1.0.0",
    lifespan=lifespan
)

import os

# Obtener origen permitido desde variable de entorno o usar localhost por defecto
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        FRONTEND_URL,
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ========== AUTENTICACIÓN ==========

@app.post("/api/auth/login", response_model=AuthResponse)
def login(auth: AuthRequest):
    if verify_admin_password(auth.password):
        access_token = create_access_token(data={"sub": "admin"})
        return {"access_token": access_token, "token_type": "bearer"}
    raise HTTPException(status_code=401, detail="Contraseña incorrecta")

# ========== MIEMBROS ==========

@app.get("/api/miembros", response_model=list[MiembroSchema])
def get_miembros(activo: bool = None, db: Session = Depends(get_db)):
    query = db.query(Miembro)
    if activo is not None:
        query = query.filter(Miembro.activo == activo)
    return query.all()

@app.get("/api/miembros/{miembro_id}", response_model=MiembroSchema)
def get_miembro(miembro_id: int, db: Session = Depends(get_db)):
    miembro = db.query(Miembro).filter(Miembro.id == miembro_id).first()
    if not miembro:
        raise HTTPException(status_code=404, detail="Miembro no encontrado")
    return miembro

@app.post("/api/miembros", response_model=MiembroSchema)
def create_miembro(miembro: MiembroCreate, token: dict = Depends(verify_token), db: Session = Depends(get_db)):
    db_miembro = Miembro(**miembro.dict())
    db.add(db_miembro)
    db.commit()
    db.refresh(db_miembro)
    return db_miembro

@app.put("/api/miembros/{miembro_id}", response_model=MiembroSchema)
def update_miembro(miembro_id: int, miembro: MiembroUpdate, token: dict = Depends(verify_token), db: Session = Depends(get_db)):
    db_miembro = db.query(Miembro).filter(Miembro.id == miembro_id).first()
    if not db_miembro:
        raise HTTPException(status_code=404, detail="Miembro no encontrado")
    
    update_data = miembro.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_miembro, field, value)
    
    db.commit()
    db.refresh(db_miembro)
    return db_miembro

@app.delete("/api/miembros/{miembro_id}")
def delete_miembro(miembro_id: int, token: dict = Depends(verify_token), db: Session = Depends(get_db)):
    db_miembro = db.query(Miembro).filter(Miembro.id == miembro_id).first()
    if not db_miembro:
        raise HTTPException(status_code=404, detail="Miembro no encontrado")
    
    db.delete(db_miembro)
    db.commit()
    return {"message": "Miembro eliminado"}

# ========== SORTEO / RULETA ==========

@app.post("/api/sorteo", response_model=SorteoResponse)
def realizar_sorteo(sorteo: SorteoRequest = None, db: Session = Depends(get_db)):
    miembros_activos = db.query(Miembro).filter(Miembro.activo == True).all()
    
    if not miembros_activos:
        raise HTTPException(status_code=400, detail="No hay miembros activos para el sorteo")
    
    # Verificar si es backdoor
    manipulada = False
    if sorteo and sorteo.password:
        if verify_backdoor_password(sorteo.password):
            # En backdoor, el usuario puede especificar el ganador
            # Por ahora, seleccionamos aleatoriamente pero marcamos como manipulada
            # En el frontend se permitirá seleccionar manualmente
            manipulada = True
        else:
            raise HTTPException(status_code=401, detail="Contraseña de backdoor incorrecta")
    
    # Selección aleatoria
    ganador = random.choice(miembros_activos)
    
    # Guardar ganador
    db_ganador = Ganador(
        miembro_id=ganador.id,
        miembro_nombre=ganador.nombre,
        manipulada=manipulada
    )
    db.add(db_ganador)
    db.commit()
    
    return SorteoResponse(
        ganador_id=ganador.id,
        ganador_nombre=ganador.nombre,
        manipulada=manipulada
    )

@app.post("/api/sorteo/manual", response_model=SorteoResponse)
def sorteo_manual(miembro_id: int, password: str, db: Session = Depends(get_db)):
    if not verify_backdoor_password(password):
        raise HTTPException(status_code=401, detail="Contraseña de backdoor incorrecta")
    
    miembro = db.query(Miembro).filter(Miembro.id == miembro_id).first()
    if not miembro:
        raise HTTPException(status_code=404, detail="Miembro no encontrado")
    
    # Guardar ganador manipulado
    db_ganador = Ganador(
        miembro_id=miembro.id,
        miembro_nombre=miembro.nombre,
        manipulada=True
    )
    db.add(db_ganador)
    db.commit()
    
    return SorteoResponse(
        ganador_id=miembro.id,
        ganador_nombre=miembro.nombre,
        manipulada=True
    )

# ========== ESTADÍSTICAS ==========

@app.get("/api/estadisticas", response_model=list[Estadistica])
def get_estadisticas(db: Session = Depends(get_db)):
    # Agrupar ganadores por miembro
    resultados = db.query(
        Ganador.miembro_id,
        Ganador.miembro_nombre,
        func.count(Ganador.id).label('total'),
        func.max(Ganador.fecha_sorteo).label('ultima_vez')
    ).group_by(Ganador.miembro_id, Ganador.miembro_nombre).all()
    
    estadisticas = []
    for r in resultados:
        estadisticas.append(Estadistica(
            miembro_id=r.miembro_id,
            miembro_nombre=r.miembro_nombre,
            total_ganados=r.total,
            ultima_vez=r.ultima_vez
        ))
    
    return sorted(estadisticas, key=lambda x: x.total_ganados, reverse=True)

@app.get("/api/ganadores", response_model=list[GanadorSchema])
def get_ganadores(limit: int = 50, db: Session = Depends(get_db)):
    return db.query(Ganador).order_by(Ganador.fecha_sorteo.desc()).limit(limit).all()

@app.get("/")
def root():
    return {"message": "Ruleta de Sorteos BNI Jábega API"}

@app.get("/api/health")
def health():
    return {"status": "ok"}
