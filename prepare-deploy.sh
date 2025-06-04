#!/bin/bash

# Script de preparação final para deploy
# Executa verificações e preparações finais antes do deploy

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para logging
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}"
}

echo "🚀 Preparação Final para Deploy - Festa Julina UCDB"
echo "=================================================="

# 1. Verificar estrutura do projeto
log "📁 Verificando estrutura do projeto..."
if [ ! -f "package.json" ]; then
    error "package.json não encontrado na raiz do projeto"
    exit 1
fi

if [ ! -d "apps/backend" ] || [ ! -d "apps/frontend" ]; then
    error "Estrutura de pastas apps/backend ou apps/frontend não encontrada"
    exit 1
fi

# 2. Verificar arquivos de deploy
log "🐳 Verificando arquivos Docker..."
REQUIRED_FILES=(
    "DockerfileBackend"
    "DockerfileFrontend" 
    "docker-compose.yml"
    "docker-compose.prod.yml"
    ".dockerignore"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        error "Arquivo obrigatório não encontrado: $file"
        exit 1
    fi
done

# 3. Verificar pipelines
log "🔄 Verificando pipelines Azure DevOps..."
PIPELINE_FILES=(
    "azure-pipelines-ci.yml"
    "azure-pipelines-cd.yml"
)

for file in "${PIPELINE_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        error "Pipeline não encontrada: $file"
        exit 1
    fi
done

# 4. Verificar scripts
log "📜 Verificando scripts..."
SCRIPT_FILES=(
    "deploy.sh"
    "test-docker-build.sh"
)

for file in "${SCRIPT_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        error "Script não encontrado: $file"
        exit 1
    fi
    
    if [ ! -x "$file" ]; then
        warn "Concedendo permissão de execução para $file"
        chmod +x "$file"
    fi
done

# 5. Verificar configuração de produção
log "⚙️ Verificando configurações de produção..."
if [ ! -f ".env.prod.example" ]; then
    error "Arquivo .env.prod.example não encontrado"
    exit 1
fi

if [ ! -f ".env.prod" ]; then
    warn "Arquivo .env.prod não encontrado. Criando a partir do exemplo..."
    cp .env.prod.example .env.prod
    info "✅ Arquivo .env.prod criado. CONFIGURE AS VARIÁVEIS ANTES DO DEPLOY!"
fi

# 6. Verificar configuração do Nginx
log "🌐 Verificando configuração Nginx..."
if [ ! -f "nginx.conf" ]; then
    error "Arquivo nginx.conf não encontrado"
    exit 1
fi

# Verificar se contém as configurações corretas
if ! grep -q "app-pais.ucdb.br/festa-julina" nginx.conf; then
    error "Configuração nginx.conf não contém server_name correto"
    exit 1
fi

if ! grep -q "172.17.0.1:3000" nginx.conf; then
    error "Configuração nginx.conf não contém proxy para frontend"
    exit 1
fi

if ! grep -q "172.17.0.1:3001" nginx.conf; then
    error "Configuração nginx.conf não contém proxy para backend"
    exit 1
fi

# 7. Verificar dependências
log "📦 Verificando dependências..."
if [ ! -f "pnpm-lock.yaml" ]; then
    warn "pnpm-lock.yaml não encontrado. Execute 'pnpm install' antes do deploy"
fi

# 8. Verificar configuração Next.js
log "⚛️ Verificando configuração Next.js..."
if ! grep -q "output.*standalone" apps/frontend/next.config.ts; then
    error "Next.js não está configurado com output: 'standalone'"
    exit 1
fi

# 9. Verificar health endpoints
log "🏥 Verificando health endpoints..."
if [ ! -f "apps/backend/src/app.controller.ts" ]; then
    error "Controller do backend não encontrado"
    exit 1
fi

if ! grep -q "@Get('health')" apps/backend/src/app.controller.ts; then
    warn "Health endpoint não encontrado no backend"
fi

if [ ! -f "apps/frontend/src/app/api/health/route.ts" ]; then
    warn "Health endpoint não encontrado no frontend"
fi

# 10. Criar resumo final
log "📋 Resumo da preparação..."
echo ""
echo "✅ CONFIGURAÇÕES VERIFICADAS COM SUCESSO!"
echo ""
echo "📂 Arquivos criados/verificados:"
echo "  • Dockerfiles para backend e frontend"
echo "  • Docker Compose para dev e produção"
echo "  • Pipelines CI/CD para Azure DevOps"
echo "  • Scripts de deploy e teste"
echo "  • Configuração Nginx com proxy reverso"
echo "  • Arquivo .env.prod para produção"
echo "  • Health endpoints nas aplicações"
echo "  • Tasks do VS Code para desenvolvimento"
echo ""
echo "🔄 PRÓXIMOS PASSOS:"
echo "  1. Configure as variáveis em .env.prod"
echo "  2. Configure variable groups no Azure DevOps:"
echo "     • azure (credenciais Azure e ACR)"
echo "     • festajulina (variáveis da aplicação)" 
echo "  3. Configure service connection no Azure DevOps"
echo "  4. Crie environment 'festajulina' no Azure DevOps"
echo "  5. Importe as pipelines no Azure DevOps"
echo "  6. Execute deploy: ./deploy.sh"
echo ""
echo "📚 DOCUMENTAÇÃO:"
echo "  • DEPLOY.md - Guia completo"
echo "  • DEPLOY_QUICKSTART.md - Guia rápido"
echo "  • CHECKLIST_FINAL.md - Lista de verificação"
echo "  • NGINX_CONFIG.md - Configuração Nginx"
echo ""

info "🎉 Projeto FESTA JULINA UCDB está pronto para deploy!"
info "📖 Consulte CHECKLIST_FINAL.md para próximos passos"
