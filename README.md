# Ruleta de Sorteos BNI Jábega

Aplicación web para realizar sorteos en reuniones BNI con ruleta animada, efectos visuales y gestión completa de miembros.

## 🎯 Características

- 🎰 Ruleta animada con nombres centrados en cada segmento
- 🌊 Fondo de mar con olas animadas estilo Málaga
- 🎉 Confeti multicolor al seleccionar ganador
- 🚤 Jábega con persona remando (masculino/femenino según nombre)
- 📊 Estadísticas de ganadores
- 👥 Panel de administración para gestionar miembros
- 🔐 Puerta trasera para manipular resultados

## 🚀 Despliegue en la Web

### Opción 1: Vercel (Recomendado - Gratis)

#### Frontend (Vercel)
1. Sube el proyecto a GitHub
2. Ve a [vercel.com](https://vercel.com) y conéctate con GitHub
3. Importa el repositorio
4. Configura:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Agrega variable de entorno:
   - `VITE_API_URL`: URL de tu backend (ej: `https://tu-backend.railway.app`)

#### Backend (Railway - Gratis)
1. Ve a [railway.app](https://railway.app) y conéctate con GitHub
2. Crea un nuevo proyecto desde GitHub
3. Selecciona el repositorio y el directorio `backend`
4. Configura las variables de entorno:
   - `ADMIN_PASSWORD`: tu contraseña de admin
   - `BACKDOOR_PASSWORD`: tu contraseña de backdoor
   - `SECRET_KEY`: una clave secreta aleatoria
   - `ALGORITHM`: `HS256`
5. Railway detectará automáticamente Python y ejecutará `uvicorn main:app`

### Opción 2: Netlify + Render

#### Frontend (Netlify)
1. Sube a GitHub
2. Ve a [netlify.com](https://netlify.com)
3. Conecta el repositorio
4. Configura:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`

#### Backend (Render)
1. Ve a [render.com](https://render.com)
2. Crea un nuevo Web Service
3. Conecta tu repositorio de GitHub
4. Configura:
   - **Root Directory**: `backend`
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Agrega las variables de entorno necesarias

## 📦 Instalación Local

### Requisitos
- Python 3.8+
- Node.js 16+
- npm o yarn

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edita .env con tus contraseñas
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🔧 Configuración

### Variables de Entorno (Backend)

Crea un archivo `.env` en `backend/`:

```env
ADMIN_PASSWORD=tu_contraseña_admin
BACKDOOR_PASSWORD=tu_contraseña_backdoor
SECRET_KEY=tu-clave-secreta-super-segura
ALGORITHM=HS256
```

### Variables de Entorno (Frontend)

Crea un archivo `.env` en `frontend/` para producción:

```env
VITE_API_URL=https://tu-backend.railway.app
```

## 📝 Uso

1. Accede a la aplicación web
2. Ve a **Admin** para gestionar miembros (contraseña por defecto: `admin`)
3. Agrega los miembros que participarán
4. Usa la ruleta principal para realizar sorteos
5. Ve a **Estadísticas** para ver el historial
6. Usa la puerta trasera (🔐) para manipular resultados si es necesario

## 🛠️ Tecnologías

- **Backend**: FastAPI, SQLAlchemy, SQLite
- **Frontend**: React, TypeScript, Vite
- **Animaciones**: CSS, canvas-confetti
- **Base de datos**: SQLite (se puede cambiar a PostgreSQL en producción)

## 📄 Licencia

Este proyecto es de uso privado para BNI.

## 🤝 Contribuciones

Este es un proyecto privado. Para cambios, contacta al administrador.
