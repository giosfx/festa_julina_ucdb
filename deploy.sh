#!/bin/bash

# Script de deploy para produção
# Este script automatiza o processo de deploy usando docker-compose

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

# Configurações padrão
REGISTRY_SERVER=${REGISTRY_SERVER:-"admucdbcr.azurecr.io"}
IMAGE_TAG=${IMAGE_TAG:-"latest"}
COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env.prod"

# Função para mostrar ajuda
show_help() {
    echo "Uso: $0 [OPÇÕES] COMANDO"
    echo ""
    echo "COMANDOS:"
    echo "  deploy      Deploy da aplicação"
    echo "  stop        Para todos os serviços"
    echo "  restart     Reinicia todos os serviços"
    echo "  logs        Mostra logs dos serviços"
    echo "  status      Mostra status dos containers"
    echo "  health      Verifica health dos serviços"
    echo "  backup      Faz backup do banco de dados"
    echo "  cleanup     Remove imagens antigas"
    echo ""
    echo "OPÇÕES:"
    echo "  -t, --tag TAG           Tag da imagem (padrão: latest)"
    echo "  -r, --registry URL      URL do registry (padrão: admucdbcr.azurecr.io)"
    echo "  -e, --env-file FILE     Arquivo de variáveis (padrão: .env.prod)"
    echo "  -f, --file FILE         Arquivo docker-compose (padrão: docker-compose.prod.yml)"
    echo "  -h, --help              Mostra esta ajuda"
    echo ""
    echo "EXEMPLOS:"
    echo "  $0 deploy -t v1.2.3"
    echo "  $0 logs backend"
    echo "  $0 health"
}

# Função para verificar pré-requisitos
check_prerequisites() {
    # Verificar se Docker está executando
    if ! docker ps >/dev/null 2>&1; then
        error "Docker não está executando"
        exit 1
    fi

    # Verificar se docker-compose está disponível
    if ! command -v docker-compose >/dev/null 2>&1; then
        error "docker-compose não está instalado"
        exit 1
    fi

    # Verificar se arquivo de compose existe
    if [ ! -f "$COMPOSE_FILE" ]; then
        error "Arquivo docker-compose não encontrado: $COMPOSE_FILE"
        exit 1
    fi

    # Verificar se arquivo .env existe
    if [ ! -f "$ENV_FILE" ]; then
        warn "Arquivo de ambiente não encontrado: $ENV_FILE"
        warn "Certifique-se de que as variáveis estão configuradas"
    fi
}

# Função para fazer login no registry
docker_login() {
    log "Fazendo login no Azure Container Registry..."
    if ! docker login "$REGISTRY_SERVER"; then
        error "Falha no login do Docker registry"
        exit 1
    fi
}

# Função para pull das imagens
pull_images() {
    log "Baixando imagens do registry..."
    
    export REGISTRY_SERVER="$REGISTRY_SERVER"
    export IMAGE_TAG="$IMAGE_TAG"
    
    if ! docker-compose -f "$COMPOSE_FILE" pull; then
        error "Falha ao baixar imagens"
        exit 1
    fi
}

# Função para deploy
deploy() {
    log "Iniciando deploy da aplicação..."
    
    check_prerequisites
    docker_login
    pull_images
    
    log "Parando serviços existentes..."
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" down
    
    log "Iniciando novos serviços..."
    export REGISTRY_SERVER="$REGISTRY_SERVER"
    export IMAGE_TAG="$IMAGE_TAG"
    
    if ! docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d; then
        error "Falha no deploy"
        exit 1
    fi
    
    log "Aguardando serviços iniciarem..."
    sleep 10
    
    log "Verificando status dos serviços..."
    docker-compose -f "$COMPOSE_FILE" ps
    
    log "✅ Deploy concluído com sucesso!"
    info "Acesse:"
    info "  Frontend: http://localhost:3000"
    info "  Backend: http://localhost:3001"
}

# Função para parar serviços
stop() {
    log "Parando todos os serviços..."
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" down
    log "✅ Serviços parados"
}

# Função para reiniciar serviços
restart() {
    log "Reiniciando serviços..."
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" restart
    log "✅ Serviços reiniciados"
}

# Função para mostrar logs
show_logs() {
    local service="$1"
    if [ -n "$service" ]; then
        log "Mostrando logs do serviço: $service"
        docker-compose -f "$COMPOSE_FILE" logs -f "$service"
    else
        log "Mostrando logs de todos os serviços"
        docker-compose -f "$COMPOSE_FILE" logs -f
    fi
}

# Função para mostrar status
show_status() {
    log "Status dos containers:"
    docker-compose -f "$COMPOSE_FILE" ps
    
    echo ""
    log "Uso de recursos:"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}" $(docker-compose -f "$COMPOSE_FILE" ps -q) 2>/dev/null || true
}

# Função para verificar health
check_health() {
    log "Verificando health dos serviços..."
    
    # Health check do backend
    if curl -f -s http://localhost:3001/health >/dev/null 2>&1; then
        log "✅ Backend está saudável"
    else
        error "❌ Backend não está respondendo"
    fi
    
    # Health check do frontend
    if curl -f -s http://localhost:3000/api/health >/dev/null 2>&1; then
        log "✅ Frontend está saudável"
    else
        error "❌ Frontend não está respondendo"
    fi
}

# Função para backup
backup() {
    log "Funcionalidade de backup não implementada ainda"
    warn "Implemente esta função conforme sua estratégia de backup"
}

# Função para limpeza
cleanup() {
    log "Removendo imagens antigas..."
    
    # Remove imagens antigas (mantém as 3 mais recentes)
    docker images "$REGISTRY_SERVER/festajulina-backend" --format "{{.ID}} {{.Tag}}" | tail -n +4 | awk '{print $1}' | xargs -r docker rmi 2>/dev/null || true
    docker images "$REGISTRY_SERVER/festajulina-frontend" --format "{{.ID}} {{.Tag}}" | tail -n +4 | awk '{print $1}' | xargs -r docker rmi 2>/dev/null || true
    
    # Remove imagens órfãs
    docker image prune -f
    
    log "✅ Limpeza concluída"
}

# Parse dos argumentos
while [[ $# -gt 0 ]]; do
    case $1 in
        -t|--tag)
            IMAGE_TAG="$2"
            shift 2
            ;;
        -r|--registry)
            REGISTRY_SERVER="$2"
            shift 2
            ;;
        -e|--env-file)
            ENV_FILE="$2"
            shift 2
            ;;
        -f|--file)
            COMPOSE_FILE="$2"
            shift 2
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        deploy|stop|restart|logs|status|health|backup|cleanup)
            COMMAND="$1"
            shift
            ;;
        *)
            SERVICE="$1"
            shift
            ;;
    esac
done

# Verificar se comando foi fornecido
if [ -z "$COMMAND" ]; then
    error "Comando não especificado"
    show_help
    exit 1
fi

# Executar comando
case "$COMMAND" in
    deploy)
        deploy
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    logs)
        show_logs "$SERVICE"
        ;;
    status)
        show_status
        ;;
    health)
        check_health
        ;;
    backup)
        backup
        ;;
    cleanup)
        cleanup
        ;;
    *)
        error "Comando inválido: $COMMAND"
        show_help
        exit 1
        ;;
esac
