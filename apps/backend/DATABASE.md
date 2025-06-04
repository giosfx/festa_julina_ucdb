# Backend - Sistema de Festa Julina

## Configuração do Banco de Dados

Este projeto está configurado para usar MS SQL Server com as seguintes tabelas:

### Participantes

- `id` (PK, auto-increment)
- `nome` (varchar 255)
- `cpf` (varchar 11, unique)
- `ra` (varchar 6, nullable)
- `rf` (varchar 4, nullable)
- `created_at` (datetime2)
- `updated_at` (datetime2)

### Ingressos

- `id` (PK, auto-increment)
- `participante_id` (FK para participantes)
- `quantidade` (int, entre 1 e 2)
- `data_compra` (datetime2)
- `funcionario_checkin` (varchar 100, nullable)
- `checkin_realizado` (bit, default false)
- `created_at` (datetime2)
- `updated_at` (datetime2)

## Configuração do Ambiente

1. Copie o arquivo `.env.example` para `.env`
2. Configure as variáveis de ambiente do banco de dados:

```env
DB_HOST=localhost
DB_PORT=1433
DB_USERNAME=sa
DB_PASSWORD=sua_senha_aqui
DB_DATABASE=festa_julina
NODE_ENV=development
PORT=3001
```

## Scripts Disponíveis

### Desenvolvimento

```bash
pnpm dev          # Inicia o servidor em modo desenvolvimento
pnpm start        # Inicia o servidor
pnpm build        # Compila o projeto
```

### Banco de Dados

```bash
pnpm migration:run     # Executa as migrations
pnpm migration:revert  # Reverte a última migration
pnpm migration:show    # Mostra status das migrations
pnpm seed              # Executa os seeds (dados de teste)
```

### Testes e Qualidade

```bash
pnpm test         # Executa os testes
pnpm lint         # Verifica código com ESLint
pnpm format       # Formata código com Prettier
```

## API Endpoints

### Participantes

- `GET /participantes` - Lista todos os participantes
- `GET /participantes/:id` - Busca participante por ID
- `GET /participantes/cpf/:cpf` - Busca participante por CPF
- `POST /participantes` - Cria novo participante
- `PATCH /participantes/:id` - Atualiza participante
- `DELETE /participantes/:id` - Remove participante

### Ingressos

- `GET /ingressos` - Lista todos os ingressos
- `GET /ingressos/:id` - Busca ingresso por ID
- `GET /ingressos/participante/:participanteId` - Busca ingressos por participante
- `POST /ingressos` - Cria novo ingresso
- `PATCH /ingressos/:id` - Atualiza ingresso
- `PATCH /ingressos/:id/checkin` - Realiza check-in
- `DELETE /ingressos/:id` - Remove ingresso

## Regras de Negócio

1. Cada participante pode ter no máximo 2 ingressos
2. CPF deve ser único no sistema
3. RA é obrigatório para estudantes (6 dígitos)
4. RF é obrigatório para funcionários (4 dígitos)
5. Check-in só pode ser realizado uma vez por ingresso

## Documentação da API

Após iniciar o servidor, acesse:

- Swagger UI: `http://localhost:3001/api`
- JSON Schema: `http://localhost:3001/api-json`
