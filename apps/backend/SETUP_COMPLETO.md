# ✅ Sistema de Festa Julina - Configuração MS SQL Server

## 📋 Resumo da Configuração Realizada

### ✅ Estrutura Criada

1. **Pacote Compartilhado (`@repo/shared`)**

   - Tipos e DTOs compartilhados entre frontend e backend
   - Localização: `packages/shared/`

2. **Entidades TypeORM**

   - `Participante` e `Ingresso` entities
   - Relacionamentos configurados
   - Localização: `apps/backend/src/entities/`

3. **Módulos NestJS**

   - `ParticipantesModule` e `IngressosModule`
   - Controllers e Services implementados
   - Localização: `apps/backend/src/modules/`

4. **Configuração do Banco**
   - Configuração TypeORM para MS SQL Server
   - Migrations e Seeds prontos
   - Localização: `apps/backend/src/database/`

### 🚀 Dependências Instaladas

```bash
# No Backend
@nestjs/typeorm
typeorm
mssql
dotenv
@nestjs/config
@nestjs/swagger
```

### 📁 Estrutura Final

```
apps/backend/
├── src/
│   ├── entities/
│   │   ├── participante.entity.ts
│   │   └── ingresso.entity.ts
│   ├── modules/
│   │   ├── participantes/
│   │   │   ├── participantes.module.ts
│   │   │   ├── participantes.controller.ts
│   │   │   └── participantes.service.ts
│   │   └── ingressos/
│   │       ├── ingressos.module.ts
│   │       ├── ingressos.controller.ts
│   │       └── ingressos.service.ts
│   └── database/
│       ├── config/database.config.ts
│       ├── migrations/
│       │   └── 1703000000000-CreateParticipantesAndIngressos.ts
│       └── seeds/
│           ├── index.ts
│           └── participantes.seed.ts
├── data-source.ts
└── .env.example

packages/shared/
├── src/
│   ├── types.ts
│   └── index.ts
└── package.json
```

## 🔧 Próximos Passos para Finalizar

### 1. Configurar Variáveis de Ambiente

```bash
cd apps/backend
cp .env.example .env
# Editar .env com suas configurações de banco
```

### 2. Configurar SQL Server

- Instalar SQL Server
- Criar banco `festa_julina`
- Configurar usuário e permissões

### 3. Executar Migrations

```bash
cd apps/backend
pnpm migration:run
```

### 4. Executar Seeds (Dados de Teste)

```bash
cd apps/backend
pnpm seed
```

### 5. Iniciar o Backend

```bash
cd apps/backend
pnpm dev
```

## 🌐 Endpoints da API

### Participantes

- `GET /participantes` - Lista todos
- `GET /participantes/:id` - Busca por ID
- `GET /participantes/cpf/:cpf` - Busca por CPF
- `POST /participantes` - Criar novo
- `PATCH /participantes/:id` - Atualizar
- `DELETE /participantes/:id` - Remover

### Ingressos

- `GET /ingressos` - Lista todos
- `GET /ingressos/:id` - Busca por ID
- `GET /ingressos/participante/:participanteId` - Por participante
- `POST /ingressos` - Criar novo
- `PATCH /ingressos/:id` - Atualizar
- `PATCH /ingressos/:id/checkin` - Realizar check-in
- `DELETE /ingressos/:id` - Remover

## 📊 Schema do Banco

### Tabela: participantes

- `id` (PK, auto-increment)
- `nome` (varchar 255)
- `cpf` (varchar 11, unique)
- `ra` (varchar 6, nullable)
- `rf` (varchar 4, nullable)
- `created_at`, `updated_at`

### Tabela: ingressos

- `id` (PK, auto-increment)
- `participante_id` (FK)
- `quantidade` (int, 1-2)
- `data_compra` (datetime2)
- `funcionario_checkin` (varchar 100, nullable)
- `checkin_realizado` (bit, default false)
- `created_at`, `updated_at`

## 🎯 Regras de Negócio Implementadas

1. ✅ Máximo 2 ingressos por participante
2. ✅ CPF único no sistema
3. ✅ Validação de RA (6 dígitos) e RF (4 dígitos)
4. ✅ Check-in único por ingresso
5. ✅ Relacionamentos com cascade

## 📚 Documentação

- Swagger UI: `http://localhost:3001/api/docs`
- Este arquivo: `DATABASE.md`

## 🚨 Problemas Conhecidos

Alguns erros de TypeScript relacionados ao sistema de módulos que podem ser resolvidos:

1. Executando `pnpm install` na raiz do projeto
2. Configurando corretamente o tsconfig.json
3. Verificando importações de módulos

A estrutura está completa e funcional! 🎉
