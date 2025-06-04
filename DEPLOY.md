# Deploy e CI/CD - Festa Julina UCDB

Este documento descreve como configurar e usar as pipelines de CI/CD para o projeto Festa Julina UCDB.

## Arquivos Criados

### Dockerfiles

- **`DockerfileBackend`**: Dockerfile para o backend NestJS
- **`DockerfileFrontend`**: Dockerfile para o frontend Next.js
- **`.dockerignore`**: Arquivo para otimizar o processo de build do Docker

### Pipelines Azure DevOps

- **`azure-pipelines-ci.yml`**: Pipeline de Continuous Integration (CI)
- **`azure-pipelines-cd.yml`**: Pipeline de Continuous Deployment (CD)

## Configuração Necessária no Azure DevOps

### 1. Variable Groups

Você precisa criar os seguintes variable groups no Azure DevOps:

#### Variable Group: `azure`

- `registry_server`: URL do Azure Container Registry (ex: `admucdbcr.azurecr.io`)

#### Variable Group: `festajulina`

- `DATABASE_URL`: String de conexão com o banco de dados
- `NEXTAUTH_URL`: URL base do NextAuth (ex: `https://app-pais.ucdb.br/festa-julina`)
- `NEXTAUTH_SECRET`: Secret do NextAuth (deve ser uma string aleatória segura)
- `NEXT_PUBLIC_URL_BASE`: URL base da API (ex: `https://app-pais.ucdb.br/festa-julina/api/v1`)
- `KEYCLOAK_CLIENT_ID`: ID do client no Keycloak
- `KEYCLOAK_CLIENT_SECRET`: Secret do client no Keycloak
- `KEYCLOAK_ISSUER`: URL do issuer do Keycloak

### 2. Service Connections

Configure as seguintes service connections:

#### Azure Container Registry

- **Name**: `admucdbcr.azurecr.io`
- **Type**: Azure Container Registry
- Configure com as credenciais do seu ACR

### 3. Environments

Crie o environment `festajulina` no Azure DevOps para o deployment.

### 4. Agent Pools

Configure os seguintes agent pools:

- **`ucdb-linux`**: Para build do backend
- **`Azure-UCDB`**: Para deployment
- **`ubuntu-latest`**: Para build do frontend (VM hosted)

## Como Usar

### Pipeline de CI (azure-pipelines-ci.yml)

A pipeline de CI é executada automaticamente quando:

- Há push ou merge na branch `main`
- Não há mudanças apenas nos arquivos de pipeline

**O que ela faz:**

1. **Building Backend**: Constrói e publica a imagem Docker do backend
2. **Building Frontend**: Constrói e publica a imagem Docker do frontend

### Pipeline de CD (azure-pipelines-cd.yml)

A pipeline de CD é executada automaticamente quando:

- A pipeline de CI é concluída com sucesso na branch `main`

**O que ela faz:**

1. **Deploy Backend**:
   - Para e remove o container anterior
   - Executa novo container com a imagem mais recente
   - Expõe na porta 3001
2. **Deploy Frontend**:
   - Para e remove o container anterior
   - Executa novo container com a imagem mais recente
   - Expõe na porta 3000

## Estrutura dos Dockerfiles

### Backend (NestJS)

- **Base**: Node.js 18 Alpine
- **Build**: Multi-stage com otimizações
- **Porta**: 3001
- **Prisma**: Cliente gerado durante o build
- **Produção**: Executa com usuário não-root

### Frontend (Next.js)

- **Base**: Node.js 18 Alpine
- **Build**: Multi-stage com standalone output
- **Porta**: 3000
- **PWA**: Suporte a Progressive Web App
- **Produção**: Executa com usuário não-root

## Configurações Importantes

### Next.js Standalone Output

O `next.config.ts` foi configurado com `output: 'standalone'` para otimizar o Docker build.

### Variáveis de Ambiente

#### Backend

- `DATABASE_URL`: Configurada via pipeline
- `NODE_ENV`: Definida como "production"
- `PORT`: Definida como 3001

#### Frontend

- `NEXTAUTH_URL`: URL de autenticação
- `NEXTAUTH_SECRET`: Secret de autenticação
- `NEXT_PUBLIC_URL_BASE`: URL da API
- `KEYCLOAK_*`: Configurações do Keycloak
- `NODE_ENV`: Definida como "production"
- `PORT`: Definida como 3000

## Monitoramento

Após o deployment, você pode verificar o status dos containers:

```bash
docker ps
```

Para ver logs:

```bash
# Backend
docker logs festajulina-backend

# Frontend
docker logs festajulina-frontend
```

## Troubleshooting

### Problemas Comuns

1. **Build falha**: Verifique se todas as dependências estão no `package.json`
2. **Container não inicia**: Verifique as variáveis de ambiente
3. **Prisma erro**: Verifique se `DATABASE_URL` está configurada corretamente
4. **Autenticação falha**: Verifique as configurações do Keycloak

### Logs Úteis

Para debug, acesse os logs dos containers em produção:

```bash
# Ver todos os containers
docker ps -a

# Logs do backend
docker logs -f festajulina-backend

# Logs do frontend
docker logs -f festajulina-frontend
```

## Segurança

- Containers executam com usuários não-root
- Imagens baseadas em Alpine Linux (menores e mais seguras)
- Variáveis sensíveis configuradas via Azure DevOps Variable Groups
- Multi-stage builds para imagens otimizadas

## Arquivos Adicionais

### Scripts de Automação

- **`deploy.sh`**: Script completo para deploy em produção
- **`test-docker-build.sh`**: Script para testar builds localmente

### Docker Compose

- **`docker-compose.yml`**: Para desenvolvimento local
- **`docker-compose.prod.yml`**: Para produção

### Configurações

- **`.env.prod.example`**: Exemplo de variáveis de ambiente
- **`nginx.conf`**: Configuração de reverse proxy (opcional)

### Health Checks

- Backend: `GET /health`
- Frontend: `GET /api/health`

## Comandos Úteis

### Script de Deploy

```bash
# Deploy com tag específica
./deploy.sh deploy -t v1.0.0

# Ver logs do backend
./deploy.sh logs backend

# Verificar status
./deploy.sh status

# Health check
./deploy.sh health

# Parar todos os serviços
./deploy.sh stop
```

### Testes Locais

```bash
# Teste básico
./test-docker-build.sh

# Teste em paralelo com verificação
./test-docker-build.sh --parallel --test

# Manter imagens para debug
./test-docker-build.sh --test --no-cleanup
```
