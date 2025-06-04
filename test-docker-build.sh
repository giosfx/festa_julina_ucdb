#!/bin/bash

# Script para testar builds Docker localmente
# Este script simula o que será executado nas pipelines Azure DevOps

set -e

echo "🚀 Iniciando testes de build Docker..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Verificar se está no diretório correto
if [ ! -f "package.json" ] || [ ! -f "DockerfileBackend" ] || [ ! -f "DockerfileFrontend" ]; then
    error "Execute este script no diretório raiz do projeto (onde estão os Dockerfiles)"
    exit 1
fi

# Definir variáveis
BUILD_NUMBER=${BUILD_NUMBER:-"local-$(date +%s)"}
PROJECT_NAME="festajulina"

log "Build Number: $BUILD_NUMBER"
log "Project Name: $PROJECT_NAME"

# Função para build do backend
build_backend() {
    log "🔨 Construindo imagem do backend..."
    
    if docker build -f DockerfileBackend -t ${PROJECT_NAME}-backend:${BUILD_NUMBER} .; then
        log "✅ Backend build concluído com sucesso!"
        
        # Testar se a imagem foi criada corretamente
        if docker images | grep -q "${PROJECT_NAME}-backend.*${BUILD_NUMBER}"; then
            log "✅ Imagem do backend verificada"
        else
            error "❌ Imagem do backend não encontrada"
            return 1
        fi
    else
        error "❌ Falha no build do backend"
        return 1
    fi
}

# Função para build do frontend
build_frontend() {
    log "🔨 Construindo imagem do frontend..."
    
    if docker build -f DockerfileFrontend -t ${PROJECT_NAME}-frontend:${BUILD_NUMBER} .; then
        log "✅ Frontend build concluído com sucesso!"
        
        # Testar se a imagem foi criada corretamente
        if docker images | grep -q "${PROJECT_NAME}-frontend.*${BUILD_NUMBER}"; then
            log "✅ Imagem do frontend verificada"
        else
            error "❌ Imagem do frontend não encontrada"
            return 1
        fi
    else
        error "❌ Falha no build do frontend"
        return 1
    fi
}

# Função para teste rápido dos containers
test_containers() {
    log "🧪 Testando containers..."
    
    # Teste do backend
    log "Testando container do backend..."
    if docker run --rm -d --name test-backend-${BUILD_NUMBER} -p 3001:3001 ${PROJECT_NAME}-backend:${BUILD_NUMBER}; then
        sleep 5
        if docker ps | grep -q "test-backend-${BUILD_NUMBER}"; then
            log "✅ Container do backend está executando"
            docker stop test-backend-${BUILD_NUMBER} || true
        else
            error "❌ Container do backend não está executando"
            docker logs test-backend-${BUILD_NUMBER} || true
            docker stop test-backend-${BUILD_NUMBER} || true
            return 1
        fi
    else
        error "❌ Falha ao iniciar container do backend"
        return 1
    fi
    
    # Teste do frontend
    log "Testando container do frontend..."
    if docker run --rm -d --name test-frontend-${BUILD_NUMBER} -p 3000:3000 ${PROJECT_NAME}-frontend:${BUILD_NUMBER}; then
        sleep 5
        if docker ps | grep -q "test-frontend-${BUILD_NUMBER}"; then
            log "✅ Container do frontend está executando"
            docker stop test-frontend-${BUILD_NUMBER} || true
        else
            error "❌ Container do frontend não está executando"
            docker logs test-frontend-${BUILD_NUMBER} || true
            docker stop test-frontend-${BUILD_NUMBER} || true
            return 1
        fi
    else
        error "❌ Falha ao iniciar container do frontend"
        return 1
    fi
}

# Função para limpeza
cleanup() {
    log "🧹 Limpando recursos de teste..."
    docker stop test-backend-${BUILD_NUMBER} 2>/dev/null || true
    docker stop test-frontend-${BUILD_NUMBER} 2>/dev/null || true
    docker rmi ${PROJECT_NAME}-backend:${BUILD_NUMBER} 2>/dev/null || true
    docker rmi ${PROJECT_NAME}-frontend:${BUILD_NUMBER} 2>/dev/null || true
    log "✅ Limpeza concluída"
}

# Função principal
main() {
    # Verificar se Docker está executando
    if ! docker ps >/dev/null 2>&1; then
        error "Docker não está executando. Inicie o Docker e tente novamente."
        exit 1
    fi
    
    log "Iniciando processo de build e teste..."
    
    # Build em paralelo (simular pipeline)
    if [ "$1" = "--parallel" ]; then
        log "Executando builds em paralelo..."
        build_backend &
        BACKEND_PID=$!
        build_frontend &
        FRONTEND_PID=$!
        
        wait $BACKEND_PID
        BACKEND_STATUS=$?
        wait $FRONTEND_PID
        FRONTEND_STATUS=$?
        
        if [ $BACKEND_STATUS -ne 0 ] || [ $FRONTEND_STATUS -ne 0 ]; then
            error "Um ou mais builds falharam"
            cleanup
            exit 1
        fi
    else
        log "Executando builds sequencialmente..."
        build_backend
        build_frontend
    fi
    
    # Testar containers se solicitado
    if [ "$2" = "--test" ] || [ "$1" = "--test" ]; then
        test_containers
    fi
    
    log "🎉 Todos os builds concluídos com sucesso!"
    log "Imagens criadas:"
    docker images | grep "${PROJECT_NAME}.*${BUILD_NUMBER}"
    
    # Perguntar se quer fazer limpeza
    if [ "$3" != "--no-cleanup" ] && [ "$2" != "--no-cleanup" ] && [ "$1" != "--no-cleanup" ]; then
        echo
        read -p "Deseja remover as imagens de teste? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            cleanup
        else
            log "Imagens mantidas para inspeção manual"
        fi
    fi
}

# Tratamento de sinais para limpeza
trap cleanup EXIT INT TERM

# Verificar argumentos
case "$1" in
    --help|-h)
        echo "Uso: $0 [--parallel] [--test] [--no-cleanup]"
        echo ""
        echo "Opções:"
        echo "  --parallel    Executa builds em paralelo (simula pipeline Azure)"
        echo "  --test        Testa os containers após o build"
        echo "  --no-cleanup  Não remove as imagens após o teste"
        echo "  --help        Mostra esta ajuda"
        echo ""
        echo "Exemplos:"
        echo "  $0                           # Build sequencial simples"
        echo "  $0 --parallel --test         # Build paralelo com teste"
        echo "  $0 --test --no-cleanup       # Build com teste, mantém imagens"
        exit 0
        ;;
esac

# Executar função principal
main "$@"
