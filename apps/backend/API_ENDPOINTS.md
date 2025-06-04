# API Endpoints - Sistema de Festa Julina

Este documento descreve todos os endpoints disponíveis na API do sistema.

## Autenticação

### POST /auth/login

**Status: ✅ IMPLEMENTADO**

- **Descrição**: Realiza login com integração Keycloak
- **Body**:
  ```json
  {
    "keycloakToken": "string"
  }
  ```
- **Resposta**: Token JWT e dados do usuário

### GET /auth/profile

- **Descrição**: Retorna perfil do usuário autenticado
- **Autenticação**: Bearer Token obrigatório

### GET /auth/validate

- **Descrição**: Valida token de autenticação
- **Autenticação**: Bearer Token obrigatório

---

## Participantes

### GET /participantes

**Status: ✅ IMPLEMENTADO**

- **Descrição**: Lista todos os participantes
- **Resposta**: Array de participantes com ingressos

### GET /participantes/:id

**Status: ✅ IMPLEMENTADO**

- **Descrição**: Busca participante por ID
- **Parâmetros**: `id` (number)

### GET /participantes/cpf/:cpf

**Status: ✅ IMPLEMENTADO**

- **Descrição**: Busca participante por CPF (11 dígitos)
- **Parâmetros**: `cpf` (string - 11 dígitos)

### GET /participantes/ra/:ra

**Status: ✅ IMPLEMENTADO**

- **Descrição**: Busca participante por RA (6 dígitos)
- **Parâmetros**: `ra` (string - 6 dígitos)

### GET /participantes/rf/:rf

**Status: ✅ IMPLEMENTADO**

- **Descrição**: Busca participante por RF (4 dígitos)
- **Parâmetros**: `rf` (string - 4 dígitos)

### GET /participantes/nome/:nome

**Status: ✅ IMPLEMENTADO**

- **Descrição**: Busca participantes por nome (busca parcial)
- **Parâmetros**: `nome` (string - busca parcial no nome)

### GET /participantes/search/:query

**Status: ✅ IMPLEMENTADO**

- **Descrição**: Busca inteligente que identifica automaticamente o tipo:
  - 11 dígitos → Busca por CPF
  - 6 dígitos → Busca por RA
  - 4 dígitos → Busca por RF
  - Outros → Busca por nome (parcial)
- **Parâmetros**: `query` (string)

### POST /participantes

**Status: ✅ IMPLEMENTADO**

- **Descrição**: Cria novo participante
- **Body**:
  ```json
  {
    "nome": "string",
    "cpf": "string (11 dígitos)",
    "ra": "string (6 dígitos, opcional)",
    "rf": "string (4 dígitos, opcional)"
  }
  ```

### PATCH /participantes/:id

**Status: ✅ IMPLEMENTADO**

- **Descrição**: Atualiza participante
- **Autenticação**: Bearer Token obrigatório
- **Parâmetros**: `id` (number)

### DELETE /participantes/:id

**Status: ✅ IMPLEMENTADO**

- **Descrição**: Remove participante (apenas administradores)
- **Autenticação**: Bearer Token obrigatório + Role 'admin'
- **Parâmetros**: `id` (number)

---

## Ingressos

### POST /ingressos

**Status: ✅ IMPLEMENTADO**

- **Descrição**: Registra compra de ingressos
- **Validações**:
  - Máximo 2 ingressos por participante
  - Quantidade entre 1 e 2
  - Registro automático de data/hora
- **Body**:
  ```json
  {
    "participanteId": "number",
    "quantidade": "number (1-2)"
  }
  ```

### GET /ingressos

**Status: ✅ IMPLEMENTADO**

- **Descrição**: Lista todos os ingressos

### GET /ingressos/:id

**Status: ✅ IMPLEMENTADO**

- **Descrição**: Busca ingresso por ID
- **Parâmetros**: `id` (number)

### GET /ingressos/participante/:participanteId

**Status: ✅ IMPLEMENTADO**

- **Descrição**: Busca ingressos por participante
- **Parâmetros**: `participanteId` (number)

### PATCH /ingressos/:id/checkin

**Status: ✅ IMPLEMENTADO**

- **Descrição**: Realiza check-in do ingresso
- **Autenticação**: Bearer Token obrigatório
- **Funcionalidades**:
  - Automaticamente registra o funcionário logado como responsável pelo check-in
  - Previne check-in duplicado
  - Marca data/hora do check-in
- **Parâmetros**: `id` (number)

### PATCH /ingressos/:id

**Status: ✅ IMPLEMENTADO**

- **Descrição**: Atualiza ingresso
- **Parâmetros**: `id` (number)

### DELETE /ingressos/:id

**Status: ✅ IMPLEMENTADO**

- **Descrição**: Remove ingresso
- **Parâmetros**: `id` (number)

---

## Validações e Regras de Negócio

### Participantes

- CPF deve ter exatamente 11 dígitos e ser único
- RA deve ter exatamente 6 dígitos (opcional)
- RF deve ter exatamente 4 dígitos (opcional)
- Nome é obrigatório

### Ingressos

- Máximo 2 ingressos por participante
- Quantidade deve ser entre 1 e 2
- Check-in só pode ser feito uma vez por ingresso
- Check-in registra automaticamente o funcionário autenticado
- Data de compra é registrada automaticamente

### Autenticação

- Login via Keycloak obrigatório
- Check-in de ingressos requer autenticação
- Operações administrativas requerem role 'admin'

---

## Códigos de Status HTTP

- **200**: Sucesso
- **201**: Criado com sucesso
- **400**: Dados inválidos ou regra de negócio violada
- **401**: Token inválido ou não fornecido
- **403**: Acesso negado (falta de permissão)
- **404**: Recurso não encontrado
- **409**: Conflito (ex: CPF já cadastrado)

---

## Estrutura do Banco de Dados

### Tabela: participantes

- `id` (INT, PK, Auto-increment)
- `nome` (VARCHAR(255), NOT NULL)
- `cpf` (VARCHAR(11), UNIQUE, NOT NULL)
- `ra` (VARCHAR(6), NULLABLE)
- `rf` (VARCHAR(4), NULLABLE)
- `created_at` (DATETIME2)
- `updated_at` (DATETIME2)

### Tabela: ingressos

- `id` (INT, PK, Auto-increment)
- `participante_id` (INT, FK → participantes.id)
- `quantidade` (INT, NOT NULL)
- `data_compra` (DATETIME2, NOT NULL)
- `funcionario_checkin` (VARCHAR(100), NULLABLE)
- `checkin_realizado` (BOOLEAN, DEFAULT false)
- `created_at` (DATETIME2)
- `updated_at` (DATETIME2)

---

## Todos os Requisitos Implementados ✅

1. **✅ /auth/login (POST)** - Integração com Keycloak
2. **✅ /participantes (GET)** - Busca por:
   - ✅ ra (6 dígitos) - `/participantes/ra/:ra`
   - ✅ rf (4 dígitos) - `/participantes/rf/:rf`
   - ✅ cpf (11 dígitos) - `/participantes/cpf/:cpf`
   - ✅ nome (string parcial) - `/participantes/nome/:nome`
   - ✅ Busca inteligente - `/participantes/search/:query`
3. **✅ /ingressos (POST)** - Registrar compra:
   - ✅ Validação de máximo 2 ingressos
   - ✅ Registro de data/hora
   - ✅ Associação com funcionário no check-in
4. **✅ /ingressos/{id}/checkin (PATCH)** - Marcar check-in com autenticação
