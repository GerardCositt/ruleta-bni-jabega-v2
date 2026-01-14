@echo off
REM Script para Windows - Inicializar y subir el proyecto a GitHub

echo 🚀 Configurando proyecto para GitHub...

REM Verificar si git está instalado
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Git no está instalado. Por favor instálalo primero.
    exit /b 1
)

REM Verificar si estamos en un repositorio git
if exist ".git" (
    echo ⚠️  Ya existe un repositorio git. Continuando...
) else (
    echo 📦 Inicializando repositorio git...
    git init
)

REM Agregar todos los archivos
echo 📝 Agregando archivos...
git add .

REM Hacer commit inicial
echo 💾 Creando commit inicial...
git commit -m "Initial commit - Ruleta BNI Jábega"
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  No hay cambios para commitear o ya existe un commit
)

echo.
echo ✅ Proyecto preparado para GitHub
echo.
echo 📋 Próximos pasos:
echo.
echo 1. Crea un repositorio en GitHub:
echo    - Ve a https://github.com/new
echo    - Nombre: ruleta-bni-jabega (o el que prefieras)
echo    - NO inicialices con README, .gitignore o licencia
echo    - Click en 'Create repository'
echo.
echo 2. Ejecuta estos comandos (GitHub te los mostrará después de crear el repo):
echo.
echo    git remote add origin https://github.com/TU_USUARIO/ruleta-bni-jabega.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo    (Reemplaza TU_USUARIO con tu usuario de GitHub)
echo.
echo 📖 Para desplegar, consulta DEPLOY.md
pause
