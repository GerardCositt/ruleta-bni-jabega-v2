# Guía de Despliegue - Ruleta BNI Jábega

## 🚀 Despliegue Rápido (Recomendado)

### Paso 1: Subir a GitHub

```bash
# Inicializar git (si no está inicializado)
git init
git add .
git commit -m "Initial commit - Ruleta BNI Jábega"

# Crear repositorio en GitHub y luego:
git remote add origin https://github.com/TU_USUARIO/ruleta-bni-jabega.git
git branch -M main
git push -u origin main
```

### Paso 2: Desplegar Backend en Railway (Gratis)

1. Ve a [railway.app](https://railway.app)
2. Inicia sesión con GitHub
3. Click en "New Project" → "Deploy from GitHub repo"
4. Selecciona tu repositorio
5. En "Settings" → "Root Directory" → pon: `backend`
6. En "Variables" agrega:
   ```
   ADMIN_PASSWORD=tu_contraseña_segura
   BACKDOOR_PASSWORD=tu_contraseña_backdoor
   SECRET_KEY=genera-una-clave-secreta-aleatoria-aqui
   ALGORITHM=HS256
   FRONTEND_URL=https://tu-frontend.vercel.app
   ```
7. Railway detectará automáticamente Python y desplegará
8. Copia la URL que te da Railway (ej: `https://ruleta-bni.railway.app`)

### Paso 3: Desplegar Frontend en Vercel (Gratis)

1. Ve a [vercel.com](https://vercel.com)
2. Inicia sesión con GitHub
3. Click en "Add New Project"
4. Importa tu repositorio
5. Configura:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. En "Environment Variables" agrega:
   ```
   VITE_API_URL=https://tu-backend.railway.app
   ```
   (Usa la URL que te dio Railway)
7. Click "Deploy"
8. Vercel te dará una URL (ej: `https://ruleta-bni.vercel.app`)

### Paso 4: Actualizar CORS del Backend

1. Vuelve a Railway
2. En "Variables" actualiza:
   ```
   FRONTEND_URL=https://tu-frontend.vercel.app
   ```
3. Railway reiniciará automáticamente

## ✅ Verificación

1. Abre la URL de Vercel en tu navegador
2. Deberías ver la ruleta funcionando
3. Prueba agregar miembros desde Admin
4. Prueba hacer un sorteo

## 🔄 Actualizaciones Futuras

Cada vez que hagas `git push`:
- **Vercel** se actualizará automáticamente
- **Railway** se actualizará automáticamente

## 💡 Alternativas

### Netlify (Frontend)
- Similar a Vercel
- Usa `netlify.toml` que ya está configurado

### Render (Backend)
- Alternativa a Railway
- Similar proceso de configuración

## 🆘 Solución de Problemas

### CORS Error
- Verifica que `FRONTEND_URL` en Railway coincida con tu URL de Vercel

### API no responde
- Verifica que `VITE_API_URL` en Vercel coincida con tu URL de Railway
- Revisa los logs en Railway

### Base de datos
- Railway usa SQLite por defecto
- Para producción, considera PostgreSQL (Railway lo ofrece)
