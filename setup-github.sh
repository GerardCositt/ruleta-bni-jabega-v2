#!/bin/bash

# Script para inicializar y subir el proyecto a GitHub
# Ejecuta: bash setup-github.sh

echo "🚀 Configurando proyecto para GitHub..."

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar si git está instalado
if ! command -v git &> /dev/null; then
    echo "❌ Git no está instalado. Por favor instálalo primero."
    exit 1
fi

# Verificar si estamos en un repositorio git
if [ -d ".git" ]; then
    echo -e "${YELLOW}⚠️  Ya existe un repositorio git. Continuando...${NC}"
else
    echo "📦 Inicializando repositorio git..."
    git init
fi

# Agregar todos los archivos
echo "📝 Agregando archivos..."
git add .

# Hacer commit inicial
echo "💾 Creando commit inicial..."
git commit -m "Initial commit - Ruleta BNI Jábega" || {
    echo -e "${YELLOW}⚠️  No hay cambios para commitear o ya existe un commit${NC}"
}

echo ""
echo -e "${GREEN}✅ Proyecto preparado para GitHub${NC}"
echo ""
echo "📋 Próximos pasos:"
echo ""
echo "1. Crea un repositorio en GitHub:"
echo "   - Ve a https://github.com/new"
echo "   - Nombre: ruleta-bni-jabega (o el que prefieras)"
echo "   - NO inicialices con README, .gitignore o licencia"
echo "   - Click en 'Create repository'"
echo ""
echo "2. Ejecuta estos comandos (GitHub te los mostrará después de crear el repo):"
echo ""
echo "   git remote add origin https://github.com/TU_USUARIO/ruleta-bni-jabega.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "   (Reemplaza TU_USUARIO con tu usuario de GitHub)"
echo ""
echo "3. O si prefieres usar SSH:"
echo ""
echo "   git remote add origin git@github.com:TU_USUARIO/ruleta-bni-jabega.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "📖 Para desplegar, consulta DEPLOY.md"
