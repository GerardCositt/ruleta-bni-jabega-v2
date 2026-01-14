#!/usr/bin/env python3
"""
Script para crear 40 usuarios de demostración
"""
import sys
from pathlib import Path

# Agregar el directorio actual al path
sys.path.insert(0, str(Path(__file__).parent))

from database import SessionLocal
from models import Miembro

# Nombres de demostración
nombres_demo = [
    "Juan Pérez", "María García", "Carlos López", "Ana Martínez", "Pedro Sánchez",
    "Laura Fernández", "Miguel Rodríguez", "Carmen Gómez", "David Torres", "Isabel Díaz",
    "José Ruiz", "Elena Moreno", "Francisco Jiménez", "Lucía Hernández", "Antonio Muñoz",
    "Sofía Álvarez", "Manuel Romero", "Paula Gutiérrez", "Javier Navarro", "Marta Domínguez",
    "Roberto Morales", "Cristina Ramos", "Daniel Gil", "Natalia Serrano", "Álvaro Blanco",
    "Andrea Suárez", "Fernando Castro", "Beatriz Ortega", "Rubén Delgado", "Eva Marín",
    "Sergio Peña", "Claudia Ramírez", "Alejandro Vega", "Patricia Flores", "Raúl Herrera",
    "Monica Campos", "Adrián Vargas", "Silvia Reyes", "Óscar Núñez", "Teresa Medina"
]

def crear_usuarios_demo():
    db = SessionLocal()
    try:
        # Verificar cuántos usuarios ya existen
        usuarios_existentes = db.query(Miembro).count()
        print(f"Usuarios existentes: {usuarios_existentes}")
        
        # Crear los 40 usuarios
        usuarios_creados = 0
        for nombre in nombres_demo:
            # Verificar si ya existe
            existe = db.query(Miembro).filter(Miembro.nombre == nombre).first()
            if not existe:
                nuevo_miembro = Miembro(nombre=nombre, activo=True)
                db.add(nuevo_miembro)
                usuarios_creados += 1
            else:
                print(f"  - {nombre} ya existe, omitido")
        
        db.commit()
        print(f"\n✓ {usuarios_creados} usuarios de demostración creados exitosamente")
        print(f"Total de usuarios en la base de datos: {db.query(Miembro).count()}")
        
    except Exception as e:
        db.rollback()
        print(f"Error al crear usuarios: {e}")
        return False
    finally:
        db.close()
    
    return True

if __name__ == "__main__":
    print("Creando 40 usuarios de demostración...")
    print("-" * 50)
    crear_usuarios_demo()
