# 🚀 Guia Rápido de Deploy - Festa Julina UCDB

## ⚡ Quick Start

### 1. Configuração Inicial

```bash
# Copie o arquivo de exemplo
cp .env.prod.example .env.prod

# Configure as variáveis de ambiente
nano .env.prod
```

### 2. Deploy Rápido

```bash
# Deploy com a tag mais recente
./deploy.sh deploy

# Ou com tag específica
./deploy.sh deploy -t v1.2.3
```

### 3. Verificação

```bash
# Verificar status
./deploy.sh status

# Verificar health
./deploy.sh health

# Ver logs
./deploy.sh logs
```

## 📁 Estrutura de Arquivos

```
├── DockerfileBackend          # Dockerfile do NestJS
├── DockerfileFrontend         # Dockerfile do Next.js
├── docker-compose.yml         # Desenvolvimento local
├── docker-compose.prod.yml    # Produção
├── deploy.sh                  # Script de deploy
├── test-docker-build.sh       # Testes locais
├── nginx.conf                 # Reverse proxy
├── .env.prod.example          # Exemplo de variáveis
├── azure-pipelines-ci.yml     # Pipeline CI
├── azure-pipelines-cd.yml     # Pipeline CD
└── DEPLOY.md                  # Documentação completa
```

## 🔧 Comandos Essenciais

### Deploy e Gerenciamento

```bash
./deploy.sh deploy -t latest    # Deploy
./deploy.sh stop               # Parar serviços
./deploy.sh restart            # Reiniciar
./deploy.sh cleanup            # Limpar imagens antigas
```

### Monitoramento

```bash
./deploy.sh status             # Status dos containers
./deploy.sh health             # Health check
./deploy.sh logs backend       # Logs do backend
./deploy.sh logs frontend      # Logs do frontend
```

### Testes Locais

```bash
./test-docker-build.sh                    # Teste básico
./test-docker-build.sh --parallel --test  # Teste completo
```

## 🌐 URLs de Produção

- **Aplicação**: https://app-pais.ucdb.br/festa-julina
- **API**: https://app-pais.ucdb.br/festa-julina/api/v1
- **Health Checks**:
  - Backend: https://app-pais.ucdb.br/festa-julina/health
  - Frontend: https://app-pais.ucdb.br/festa-julina/api/health

## ⚙️ Variáveis Principais

### Backend

```env
DATABASE_URL=postgresql://user:pass@host:5432/db
```

### Frontend

```env
NEXTAUTH_URL=https://app-pais.ucdb.br/festa-julina
NEXTAUTH_SECRET=sua-chave-secreta
NEXT_PUBLIC_URL_BASE=https://app-pais.ucdb.br/festa-julina/api/v1
```

### Keycloak

```env
KEYCLOAK_CLIENT_ID=festajulina-frontend
KEYCLOAK_CLIENT_SECRET=client-secret
KEYCLOAK_ISSUER=https://keycloak.ucdb.br/realms/realm
```

## 🔍 Troubleshooting

### Container não inicia

```bash
# Ver logs detalhados
docker logs festajulina-backend
docker logs festajulina-frontend

# Verificar configurações
./deploy.sh status
```

### Problemas de conectividade

```bash
# Testar health checks
curl http://localhost:3001/health
curl http://localhost:3000/api/health

# Verificar rede
docker network ls
```

### Reset completo

```bash
./deploy.sh stop
docker system prune -f
./deploy.sh deploy
```

## 📈 Monitoramento

### Métricas básicas

```bash
# Uso de recursos
docker stats

# Logs em tempo real
./deploy.sh logs

# Health status
./deploy.sh health
```

### Backup (implementar)

```bash
# TODO: Implementar backup do banco
./deploy.sh backup
```

## 🆘 Suporte

- 📖 Documentação completa: [DEPLOY.md](./DEPLOY.md)
- 🔧 Configuração Azure: Veja seção "Variable Groups" no DEPLOY.md
- 🐛 Issues: Verifique logs com `./deploy.sh logs`

---

**⚠️ Importante**: Sempre teste localmente antes do deploy em produção!
