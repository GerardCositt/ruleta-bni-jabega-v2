from sqlalchemy import Column, Integer, String, DateTime, Boolean
from datetime import datetime
from database import Base

class Miembro(Base):
    __tablename__ = "miembros"
    
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(255), nullable=False, index=True)
    activo = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
class Ganador(Base):
    __tablename__ = "ganadores"
    
    id = Column(Integer, primary_key=True, index=True)
    miembro_id = Column(Integer, nullable=False, index=True)
    miembro_nombre = Column(String(255), nullable=False)
    fecha_sorteo = Column(DateTime, default=datetime.utcnow, index=True)
    manipulada = Column(Boolean, default=False)  # Si fue manipulada desde backdoor
