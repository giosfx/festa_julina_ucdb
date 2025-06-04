# 🚀 Checklist Final de Deploy - Festa Julina UCDB

## ✅ Configurações Completadas

### 📁 Arquivos Docker
- [x] DockerfileBackend - Multi-stage build com Node.js 18 Alpine
- [x] DockerfileFrontend - Multi-stage build com Next.js standalone
- [x] docker-compose.yml - Ambiente de desenvolvimento
- [x] docker-compose.prod.yml - Ambiente de produção
- [x] .dockerignore - Otimização do build

### 🔄 Pipelines Azure DevOps
- [x] azure-pipelines-ci.yml - Pipeline de CI com builds paralelos
- [x] azure-pipelines-cd.yml - Pipeline de CD com deploy automatizado

### 🌐 Configuração Nginx
- [x] nginx.conf - Proxy reverso com SSL, CORS, rate limiting
- [x] Configuração para app-pais.ucdb.br/festa-julina
- [x] Proxy para frontend (172.17.0.1:3000) e backend (172.17.0.1:3001)

### 🛠️ Scripts de Automação
- [x] deploy.sh - Script de deploy em produção
- [x] test-docker-build.sh - Teste local dos builds
- [x] validate-config.sh - Validação das configurações

### 📖 Documentação
- [x] DEPLOY.md - Guia completo de deploy
- [x] DEPLOY_QUICKSTART.md - Guia rápido
- [x] NGINX_CONFIG.md - Documentação do Nginx

### ⚡ VS Code
- [x] tasks.json - Tarefas para desenvolvimento e deploy
- [x] launch.json - Configurações de debug

### 🔧 Configurações da Aplicação
- [x] next.config.ts - Output standalone para Docker
- [x] Health endpoints - /health (backend) e /api/health (frontend)
- [x] .env.prod.example - Template de variáveis de produção

## 🔄 Próximos Passos (Azure DevOps)

### 1. Configurar Variable Groups
```bash
# No Azure DevOps, criar os variable groups:
# 1. "azure" com variáveis do Azure
# 2. "festajulina" com variáveis específicas do projeto
```

**Variable Group: azure**
- `AZURE_SUBSCRIPTION`: ID da subscription Azure
- `REGISTRY_SERVER`: admucdbcr.azurecr.io
- `REGISTRY_USERNAME`: Username do ACR
- `REGISTRY_PASSWORD`: Password do ACR

**Variable Group: festajulina**
- `DATABASE_URL`: String de conexão PostgreSQL
- `NEXTAUTH_SECRET`: Chave secreta do NextAuth
- `KEYCLOAK_CLIENT_SECRET`: Secret do Keycloak
- `REDIS_URL`: URL do Redis (se usado)

### 2. Configurar Service Connection
- Criar service connection para Azure Container Registry
- Nome: `azure-container-registry`
- Registry: `admucdbcr.azurecr.io`

### 3. Criar Environment
- No Azure DevOps, criar environment: `festajulina`
- Configurar approvals se necessário

### 4. Importar Pipelines
```bash
# Importar no Azure DevOps:
# - azure-pipelines-ci.yml (CI Pipeline)
# - azure-pipelines-cd.yml (CD Pipeline)
```

## 🧪 Testes Locais

### 1. Testar Builds Docker (quando Docker estiver disponível)
```bash
./test-docker-build.sh --test
```

### 2. Testar Ambiente de Desenvolvimento
```bash
# Usar VS Code Tasks ou:
pnpm install
pnpm dev
```

### 3. Testar Configuração de Produção
```bash
# Copiar e configurar variáveis
cp .env.prod.example .env.prod
# Editar .env.prod com valores reais

# Testar com docker-compose
docker-compose -f docker-compose.prod.yml up -d
```

## 🔍 Validação Final

### Antes do Deploy
- [ ] Copiar `.env.prod.example` para `.env.prod`
- [ ] Configurar todas as variáveis em `.env.prod`
- [ ] Testar builds localmente (se Docker disponível)
- [ ] Configurar variable groups no Azure DevOps
- [ ] Configurar service connection no Azure DevOps
- [ ] Criar environment no Azure DevOps
- [ ] Importar pipelines no Azure DevOps

### Após o Deploy
- [ ] Verificar se as aplicações estão rodando
- [ ] Testar health endpoints: 
  - https://app-pais.ucdb.br/festa-julina/api/health
  - https://app-pais.ucdb.br/festa-julina/api/v1/health
- [ ] Verificar logs das aplicações
- [ ] Testar funcionalidades principais

## 📞 Comandos Úteis

### Desenvolvimento
```bash
# Instalar dependências
pnpm install

# Executar em desenvolvimento
pnpm dev

# Build do projeto
pnpm build

# Executar testes
pnpm test
```

### Docker (quando disponível)
```bash
# Desenvolvimento
docker-compose up -d

# Produção
docker-compose -f docker-compose.prod.yml up -d

# Ver logs
docker-compose logs -f

# Parar containers
docker-compose down
```

### Deploy
```bash
# Deploy completo
./deploy.sh

# Apenas validar configurações
./validate-config.sh
```

## 🎯 Status Atual

**✅ PROJETO PRONTO PARA DEPLOY**

Todas as configurações foram criadas e o projeto está preparado para:
1. Deploy local com Docker
2. Deploy automatizado via Azure DevOps
3. Desenvolvimento local
4. Testes e validação

**Falta apenas:**
- Configurar Azure DevOps (variable groups, service connection, environment)
- Configurar variáveis de produção em `.env.prod`
- Docker disponível para testes locais
