from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class MiembroBase(BaseModel):
    nombre: str
    activo: bool = True

class MiembroCreate(MiembroBase):
    pass

class MiembroUpdate(BaseModel):
    nombre: Optional[str] = None
    activo: Optional[bool] = None

class Miembro(MiembroBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class GanadorBase(BaseModel):
    miembro_id: int
    miembro_nombre: str

class GanadorCreate(GanadorBase):
    manipulada: bool = False

class Ganador(GanadorBase):
    id: int
    fecha_sorteo: datetime
    manipulada: bool
    
    class Config:
        from_attributes = True

class Estadistica(BaseModel):
    miembro_id: int
    miembro_nombre: str
    total_ganados: int
    ultima_vez: Optional[datetime] = None

class SorteoRequest(BaseModel):
    password: Optional[str] = None  # Para backdoor

class SorteoResponse(BaseModel):
    ganador_id: int
    ganador_nombre: str
    manipulada: bool = False

class AuthRequest(BaseModel):
    password: str

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
