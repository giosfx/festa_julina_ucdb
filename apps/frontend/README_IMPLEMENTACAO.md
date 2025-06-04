# Frontend - Festa Julina UCDB

Sistema frontend para gerenciamento da Festa Julina UCDB, desenvolvido com Next.js, TypeScript e PWA capabilities.

## 🎯 Status da Implementação

### ✅ Concluído

1. **PWA Configuration**

   - Manifest.json configurado com cores institucionais
   - Service Worker configurado via next-pwa
   - Ícones SVG personalizados (192x192, 512x512, favicon)
   - Metadados apropriados para instalação

2. **Design System**

   - CSS Variables com cores institucionais:
     - Primary: #333399 (azul institucional)
     - Secondary: #FF3300 (vermelho institucional)
   - Design responsivo mobile-first
   - Componentes reutilizáveis (LoginForm, LoadingSpinner, Notification)

3. **Autenticação com Keycloak**

   - Configuração do Keycloak para UCDB:
     - URL: https://login.ucdb.br
     - Realm: "Festa Julina UCDB"
     - Client: festa_julina_ucdb_client_dev
   - AuthService completo com TypeScript
   - Hook useAuth para gerenciamento de estado
   - Token management (access/refresh tokens)
   - Validação e renovação automática de tokens

4. **Formulário de Login**

   - Campo usuário (4 dígitos numéricos)
   - Campo senha com toggle de visibilidade
   - Validação em tempo real com react-hook-form
   - Estados de loading e error handling
   - Formatação automática de entrada

5. **Roteamento e Navegação**

   - Página de login (/)
   - Dashboard (/dashboard)
   - Redirecionamento automático após login
   - Proteção de rotas autenticadas

6. **Internacionalização**
   - Todo o sistema em Português-BR
   - Mensagens de erro em português
   - Interface completamente localizada

### 🔄 Em Andamento

1. **Sistema de Notificações**
   - Componente Notification criado
   - Hook useNotifications implementado
   - NotificationContainer para múltiplas notificações

### ⏳ Próximos Passos

1. **Integração Backend**

   - Conectar com API NestJS do backend
   - Implementar endpoints de ingressos e participantes
   - Sincronizar dados em tempo real

2. **Funcionalidades do Dashboard**

   - Módulo de Ingressos
   - Módulo de Participantes
   - Relatórios e estatísticas
   - Gráficos e visualizações

3. **Melhorias UX/UI**

   - Animações e transições
   - Feedback visual aprimorado
   - Acessibilidade (WCAG 2.1)

4. **Funcionalidades PWA**
   - Funcionamento offline
   - Cache inteligente
   - Push notifications
   - Sincronização em background

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- pnpm (gerenciador de pacotes do monorepo)

### Instalação

```bash
# No root do monorepo
pnpm install

# Navegue para o frontend
cd apps/frontend

# Copie o arquivo de ambiente
cp .env.example .env.local

# Execute o servidor de desenvolvimento
pnpm dev
```

### Variáveis de Ambiente

```bash
# .env.local
NEXT_PUBLIC_KEYCLOAK_URL=https://login.ucdb.br
NEXT_PUBLIC_KEYCLOAK_REALM=Festa Julina UCDB
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=festa_julina_ucdb_client_dev
NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET=pgGBhfVARWhvoe5wug1AIfSrQcdVYZ2U
```

## 🛠️ Tecnologias Utilizadas

- **Framework**: Next.js 15.3.3 (App Router)
- **Linguagem**: TypeScript
- **Styling**: CSS Modules + CSS Variables
- **Forms**: React Hook Form + Hookform Resolvers
- **PWA**: next-pwa + Workbox
- **Autenticação**: Keycloak (OAuth2/OIDC)
- **Build Tool**: Turbopack (Next.js)

## 📁 Estrutura do Projeto

```
src/app/
├── components/          # Componentes reutilizáveis
│   ├── LoginForm.tsx
│   ├── LoadingSpinner.tsx
│   ├── Notification.tsx
│   └── NotificationContainer.tsx
├── hooks/              # Custom hooks
│   ├── useAuth.ts
│   └── useNotifications.ts
├── services/           # Serviços de API
│   └── auth.service.ts
├── types/              # Definições TypeScript
│   └── auth.ts
├── constants/          # Constantes da aplicação
│   └── index.ts
├── utils/              # Funções utilitárias
│   └── index.ts
├── dashboard/          # Página do dashboard
│   └── page.tsx
├── layout.tsx          # Layout principal
├── page.tsx           # Página de login
└── globals.css        # Estilos globais
```

## 🔐 Configuração Keycloak

O sistema está configurado para funcionar com o Keycloak da UCDB:

- **Servidor**: https://login.ucdb.br
- **Realm**: "Festa Julina UCDB"
- **Client ID**: festa_julina_ucdb_client_dev
- **Tipo**: Confidential Client
- **Fluxos**: Authorization Code + Resource Owner Password

## 📱 PWA Features

- **Instalável**: Pode ser instalado como app nativo
- **Responsivo**: Design mobile-first
- **Offline-ready**: Service Worker configurado
- **Fast**: Otimizado com Turbopack
- **Accessible**: Semântica HTML adequada

## 🎨 Design System

### Cores Institucionais

```css
:root {
  --primary: #333399; /* Azul UCDB */
  --primary-dark: #2a2a80;
  --primary-light: #e6e6f7;
  --secondary: #ff3300; /* Vermelho UCDB */
  --secondary-dark: #e02e00;
  --secondary-light: #ffe6e0;
}
```

### Breakpoints

```css
/* Mobile First */
--mobile: 320px;
--tablet: 768px;
--desktop: 1024px;
--wide: 1200px;
```

## 🧪 Testes

Para executar testes:

```bash
# Executar todos os testes
pnpm test

# Executar testes em modo watch
pnpm test:watch

# Coverage report
pnpm test:coverage
```

## 📈 Performance

- **Lighthouse Score**: 95+ (target)
- **Core Web Vitals**: Green
- **Bundle Size**: Otimizado com code splitting
- **Loading Time**: < 2s (first paint)

## 🤝 Contribuição

1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é propriedade da UCDB (Universidade Católica Dom Bosco).

## 📞 Suporte

Para suporte técnico, entre em contato com a equipe de desenvolvimento da UCDB.

---

**Sistema Festa Julina UCDB 2025** - Desenvolvido com ❤️ para a comunidade UCDB
