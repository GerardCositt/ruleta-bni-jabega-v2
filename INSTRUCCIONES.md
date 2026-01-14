# Instrucciones de Instalación y Uso

## Instalación

### Backend

1. Navega a la carpeta backend:
```bash
cd backend
```

2. Crea un entorno virtual:
```bash
python3 -m venv venv
```

3. Activa el entorno virtual:
```bash
# macOS/Linux:
source venv/bin/activate

# Windows:
venv\Scripts\activate
```

4. Instala las dependencias:
```bash
pip install -r requirements.txt
```

5. El archivo `.env` ya está creado con las contraseñas por defecto:
   - Admin: `admin`
   - Backdoor: `backdoor123`

6. Inicia el servidor:
```bash
uvicorn main:app --reload
```

El backend estará disponible en `http://localhost:8000`

### Frontend

1. Navega a la carpeta frontend:
```bash
cd frontend
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

## Uso

### Primera vez

1. Abre el navegador en `http://localhost:5173`
2. Ve a **Admin** (enlace en la barra de navegación)
3. Ingresa la contraseña: `admin`
4. Agrega los miembros que participarán en los sorteos
5. Activa/desactiva miembros según necesites

### Realizar un sorteo

1. Ve a la página principal (Ruleta)
2. Haz clic en **"Girar Ruleta"**
3. La ruleta girará y seleccionará un ganador aleatorio
4. El ganador se mostrará en pantalla

### Ver estadísticas

1. Ve a **Estadísticas** en la barra de navegación
2. Verás:
   - Ranking de ganadores (quién ha ganado más veces)
   - Historial reciente de sorteos
   - Indicador si algún sorteo fue manipulado

### Puerta trasera (Manipular ganador)

1. Haz clic en el icono 🔐 en la barra de navegación
2. Ingresa la contraseña: `backdoor123`
3. Selecciona el miembro que quieres que gane
4. Confirma con la contraseña de backdoor
5. El ganador será forzado (se marcará como "manipulada" en las estadísticas)

## Cambiar contraseñas

Edita el archivo `backend/.env`:
```
ADMIN_PASSWORD=tu_nueva_contraseña_admin
BACKDOOR_PASSWORD=tu_nueva_contraseña_backdoor
```

Reinicia el servidor backend para aplicar los cambios.

## Notas

- Los miembros inactivos no aparecerán en la ruleta
- Todos los sorteos se guardan en la base de datos
- Las estadísticas se actualizan automáticamente
- La base de datos SQLite se crea automáticamente en `backend/ruleta_bni.db`
