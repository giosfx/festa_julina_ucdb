# 🎪 Sistema Festa Julina - Monorepo

Monorepo desenvolvido com **Turborepo** para sistema de gestão de festa julina.

## 🏗️ Arquitetura

Este monorepo inclui as seguintes aplicações e pacotes:

### 📱 Aplicações

- `frontend`: Aplicação **Next.js** (TypeScript) - Interface do usuário
- `backend`: API **NestJS** (TypeScript) - Servidor e lógica de negócio

### 📦 Pacotes Compartilhados

- `@repo/ui`: Biblioteca de componentes React compartilhados
- `@repo/eslint-config`: Configurações ESLint (Next.js, NestJS, base)
- `@repo/typescript-config`: Configurações TypeScript compartilhadas

## 🚀 Como usar

### Pré-requisitos

- Node.js >= 18
- pnpm >= 9.0.0

### Instalação

```bash
# Clone o repositório
git clone <repo-url>
cd festa_julina_ucdb

# Instale as dependências
pnpm install
```

### Desenvolvimento

```bash
# Executar todas as aplicações em modo desenvolvimento
pnpm dev

# Executar apenas o frontend (porta 3000)
pnpm dev:frontend

# Executar apenas o backend (porta 3001)
pnpm dev:backend
```

### Produção

```bash
# Build de todas as aplicações
pnpm build

# Executar em produção
pnpm start
```

### Scripts Úteis

```bash
# Linting
pnpm lint              # Verificar todos os projetos
pnpm lint:fix          # Corrigir problemas automaticamente

# Formatação
pnpm format            # Formatar todo o código
pnpm format:check      # Verificar formatação

# Testes
pnpm test              # Executar todos os testes
pnpm test:e2e          # Executar testes E2E

# Verificação de tipos
pnpm check-types       # Verificar TypeScript

# Limpeza
pnpm clean             # Limpar builds e caches
```

## 🌐 URLs das Aplicações

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001
- **API Docs**: http://localhost:3001/api/docs

## 🛠️ Tecnologias Utilizadas

### Frontend

- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **ESLint + Prettier** - Code quality

### Backend

- **NestJS** - Framework Node.js
- **TypeScript** - Tipagem estática
- **Swagger** - Documentação da API
- **Class Validator** - Validação de dados
- **Jest** - Testes

### DevOps

- **Turborepo** - Build system e monorepo
- **pnpm** - Gerenciador de pacotes
- **ESLint** - Linting compartilhado
- **Prettier** - Formatação de código

## 📁 Estrutura do Projeto

```
festa_julina_ucdb/
├── apps/
│   ├── frontend/          # Next.js app
│   └── backend/           # NestJS API
├── packages/
│   ├── ui/                # Componentes compartilhados
│   ├── eslint-config/     # Configurações ESLint
│   └── typescript-config/ # Configurações TypeScript
├── .env.example           # Variáveis de ambiente
├── turbo.json            # Configuração Turborepo
└── pnpm-workspace.yaml   # Configuração workspace
```

## 🔧 Configuração de Ambiente

Copie o arquivo `.env.example` para `.env` e configure as variáveis necessárias:

```bash
cp .env.example .env
```

## 🚀 Deploy

### Vercel (Recomendado para Frontend)

- Conecte seu repositório ao Vercel
- Configure build command: `pnpm build --filter=frontend`
- Configure output directory: `apps/frontend/.next`

### Backend Deploy

- Configure as variáveis de ambiente em produção
- Build command: `pnpm build --filter=backend`
- Start command: `pnpm start --filter=backend`

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

Turborepo can use a technique known as [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

```
cd my-turborepo
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
npx turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.com/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.com/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.com/docs/reference/configuration)
- [CLI Usage](https://turborepo.com/docs/reference/command-line-reference)
