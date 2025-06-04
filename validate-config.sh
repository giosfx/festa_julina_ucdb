#!/bin/bash

# Script de validação das configurações de deploy
# Verifica se todos os arquivos e configurações estão corretos

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

# Contadores
ERRORS=0
WARNINGS=0
CHECKS=0

# Função para verificar arquivo
check_file() {
    local file="$1"
    local description="$2"
    CHECKS=$((CHECKS + 1))
    
    if [ -f "$file" ]; then
        log "✅ $description: $file"
    else
        error "❌ $description: $file (não encontrado)"
        ERRORS=$((ERRORS + 1))
    fi
}

# Função para verificar conteúdo
check_content() {
    local file="$1"
    local pattern="$2"
    local description="$3"
    CHECKS=$((CHECKS + 1))
    
    if [ -f "$file" ] && grep -q "$pattern" "$file"; then
        log "✅ $description"
    else
        error "❌ $description"
        ERRORS=$((ERRORS + 1))
    fi
}

# Função para verificar variável de exemplo
check_env_var() {
    local file="$1"
    local var="$2"
    local expected_pattern="$3"
    local description="$4"
    CHECKS=$((CHECKS + 1))
    
    if [ -f "$file" ] && grep -q "^$var.*$expected_pattern" "$file"; then
        log "✅ $description"
    else
        warn "⚠️  $description"
        WARNINGS=$((WARNINGS + 1))
    fi
}

# Função para verificar permissões
check_permissions() {
    local file="$1"
    local description="$2"
    CHECKS=$((CHECKS + 1))
    
    if [ -f "$file" ] && [ -x "$file" ]; then
        log "✅ $description: executável"
    else
        warn "⚠️  $description: não executável"
        WARNINGS=$((WARNINGS + 1))
    fi
}

echo "🔍 Iniciando validação das configurações de deploy..."
echo "=================================================="

# 1. Verificar arquivos principais
log "📁 Verificando arquivos principais..."
check_file "DockerfileBackend" "Dockerfile do Backend"
check_file "DockerfileFrontend" "Dockerfile do Frontend"
check_file ".dockerignore" "Docker ignore"
check_file "docker-compose.yml" "Docker Compose (dev)"
check_file "docker-compose.prod.yml" "Docker Compose (prod)"

# 2. Verificar pipelines
log "🔄 Verificando pipelines..."
check_file "azure-pipelines-ci.yml" "Pipeline CI"
check_file "azure-pipelines-cd.yml" "Pipeline CD"

# 3. Verificar scripts
log "📜 Verificando scripts..."
check_file "deploy.sh" "Script de deploy"
check_file "test-docker-build.sh" "Script de teste"
check_permissions "deploy.sh" "Deploy script"
check_permissions "test-docker-build.sh" "Test script"

# 4. Verificar configurações
log "⚙️  Verificando configurações..."
check_file "nginx.conf" "Configuração Nginx"
check_file ".env.prod.example" "Exemplo de variáveis"

# 5. Verificar documentação
log "📚 Verificando documentação..."
check_file "DEPLOY.md" "Documentação de deploy"
check_file "DEPLOY_QUICKSTART.md" "Guia rápido"
check_file "NGINX_CONFIG.md" "Documentação Nginx"

# 6. Verificar conteúdo dos Dockerfiles
log "🐳 Verificando conteúdo dos Dockerfiles..."
check_content "DockerfileBackend" "FROM node:18-alpine" "Dockerfile Backend usa Node 18"
check_content "DockerfileBackend" "EXPOSE 3001" "Dockerfile Backend expõe porta 3001"
check_content "DockerfileFrontend" "FROM node:18-alpine" "Dockerfile Frontend usa Node 18"
check_content "DockerfileFrontend" "EXPOSE 3000" "Dockerfile Frontend expõe porta 3000"

# 7. Verificar configuração Next.js
log "⚛️  Verificando configuração Next.js..."
check_content "apps/frontend/next.config.ts" "output.*standalone" "Next.js configurado para standalone"

# 8. Verificar health checks
log "🏥 Verificando health checks..."
check_content "apps/backend/src/app.controller.ts" "@Get.*health" "Backend tem endpoint de health"
check_file "apps/frontend/src/app/api/health/route.ts" "Frontend health endpoint"

# 9. Verificar variáveis de ambiente
log "🔧 Verificando variáveis de ambiente..."
check_env_var ".env.prod.example" "NEXTAUTH_URL" "app-pais.ucdb.br/festa-julina" "NEXTAUTH_URL atualizada"
check_env_var ".env.prod.example" "NEXT_PUBLIC_URL_BASE" "app-pais.ucdb.br/festa-julina/api/v1" "NEXT_PUBLIC_URL_BASE atualizada"

# 10. Verificar configuração Nginx
log "🌐 Verificando configuração Nginx..."
check_content "nginx.conf" "app-pais.ucdb.br/festa-julina" "Nginx server_name correto"
check_content "nginx.conf" "172.17.0.1:3000" "Nginx proxy para frontend"
check_content "nginx.conf" "172.17.0.1:3001" "Nginx proxy para backend"
check_content "nginx.conf" "/api/v1/" "Nginx rota para API"

# 11. Verificar pipelines
log "🚀 Verificando pipelines..."
check_content "azure-pipelines-ci.yml" "festajulina-backend" "Pipeline CI com nome correto do backend"
check_content "azure-pipelines-ci.yml" "festajulina-frontend" "Pipeline CI com nome correto do frontend"
check_content "azure-pipelines-cd.yml" "festajulina" "Pipeline CD com environment correto"

# 12. Verificar dependências do projeto
log "📦 Verificando dependências..."
check_file "package.json" "Package.json raiz"
check_file "pnpm-lock.yaml" "Lock file do pnpm"
check_file "apps/backend/package.json" "Package.json do backend"
check_file "apps/frontend/package.json" "Package.json do frontend"

# 13. Verificar estrutura de pastas
log "📂 Verificando estrutura..."
check_file "apps/backend/src/main.ts" "Main do backend"
check_file "apps/frontend/src/app/layout.tsx" "Layout do frontend"
check_file "apps/backend/prisma/schema.prisma" "Schema do Prisma"

echo ""
echo "=================================================="
log "📊 Resumo da validação:"
echo "   ✅ Verificações passaram: $((CHECKS - ERRORS - WARNINGS))"
if [ $WARNINGS -gt 0 ]; then
    warn "   ⚠️  Warnings: $WARNINGS"
fi
if [ $ERRORS -gt 0 ]; then
    error "   ❌ Erros: $ERRORS"
fi
echo "   📋 Total de verificações: $CHECKS"

# Verificações adicionais
echo ""
log "🔧 Verificações adicionais recomendadas:"
info "   • Configurar variable groups no Azure DevOps (azure, festajulina)"
info "   • Configurar service connection para ACR"
info "   • Criar environment 'festajulina' no Azure DevOps"
info "   • Copiar .env.prod.example para .env.prod e configurar"
info "   • Testar builds localmente: ./test-docker-build.sh --test"

# Status final
echo ""
if [ $ERRORS -eq 0 ]; then
    log "🎉 Validação concluída! Projeto pronto para deploy."
    exit 0
else
    error "❌ Validação falhou. Corrija os erros antes do deploy."
    exit 1
fi
