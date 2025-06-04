# Guia de Teste - Autenticação Keycloak

## Configuração do Ambiente

1. **Configure as variáveis de ambiente** no arquivo `.env`:

```env
# Keycloak Configuration
KEYCLOAK_URL=https://login.ucdb.br/
KEYCLOAK_REALM=Festa Julina UCDB
KEYCLOAK_CLIENT_ID=festa_julina_ucdb_client_dev
KEYCLOAK_CLIENT_SECRET=pgGBhfVARWhvoe5wug1AIfSrQcdVYZ2U

# JWT Configuration
JWT_SECRET=sua_chave_secreta_jwt_muito_segura_aqui
JWT_EXPIRES_IN=24h
```

2. **Inicie o servidor**:

```bash
cd apps/backend
npm run dev
```

3. **Acesse o Swagger**: http://localhost:3001/api

## Fluxo de Teste Completo

### 1. Testar Rota Pública

```bash
# GET /test-auth/public
curl -X GET "http://localhost:3001/test-auth/public"
```

**Resposta esperada:**

```json
{
  "message": "Esta é uma rota pública - não requer autenticação",
  "timestamp": "2025-06-03T..."
}
```

### 2. Obter Token do Keycloak

**Opção A: Via Interface Web do Keycloak**

1. Acesse: https://login.ucdb.br/realms/Festa%20Julina%20UCDB/account
2. Faça login com suas credenciais UCDB
3. Na seção "Personal info" ou usando ferramentas de desenvolvedor, capture o token

**Opção B: Via API do Keycloak (se disponível)**

```bash
curl -X POST "https://login.ucdb.br/realms/Festa%20Julina%20UCDB/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=password&client_id=festa_julina_ucdb_client_dev&client_secret=pgGBhfVARWhvoe5wug1AIfSrQcdVYZ2U&username=1234&password=sua_senha"
```

### 3. Fazer Login na API

```bash
curl -X POST "http://localhost:3001/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "keycloakToken": "SEU_TOKEN_KEYCLOAK_AQUI"
  }'
```

**Resposta esperada:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "userId": "keycloak-user-id",
    "username": "1234",
    "email": "usuario@ucdb.br",
    "name": "Nome do Usuário",
    "roles": ["user"]
  }
}
```

### 4. Testar Rotas Protegidas

**Use o `access_token` obtido no passo anterior:**

```bash
# Definir token como variável
TOKEN="SEU_JWT_TOKEN_AQUI"

# Testar rota protegida
curl -X GET "http://localhost:3001/test-auth/protected" \
  -H "Authorization: Bearer $TOKEN"

# Testar informações do usuário
curl -X GET "http://localhost:3001/test-auth/user-info" \
  -H "Authorization: Bearer $TOKEN"

# Testar validação de perfil
curl -X GET "http://localhost:3001/auth/profile" \
  -H "Authorization: Bearer $TOKEN"
```

### 5. Testar Rotas de Administrador

```bash
# Esta rota vai retornar 403 se o usuário não tiver role 'admin'
curl -X GET "http://localhost:3001/test-auth/admin-only" \
  -H "Authorization: Bearer $TOKEN"
```

### 6. Testar Validação de Formato de Usuário

```bash
# Validar formato do usuário atual
curl -X POST "http://localhost:3001/test-auth/validate-format" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'

# Testar com um username específico
curl -X POST "http://localhost:3001/test-auth/validate-format" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "testUsername": "1234"
  }'
```

## Testando com Diferentes Cenários

### Cenário 1: Usuário com formato inválido

Se o usuário no Keycloak não tiver exatamente 4 dígitos, o login falhará:

```json
{
  "statusCode": 401,
  "message": "Usuário deve ter 4 dígitos",
  "error": "Unauthorized"
}
```

### Cenário 2: Token inválido ou expirado

```bash
curl -X GET "http://localhost:3001/auth/profile" \
  -H "Authorization: Bearer token_invalido"
```

**Resposta:**

```json
{
  "statusCode": 401,
  "message": "Token inválido ou expirado",
  "error": "Unauthorized"
}
```

### Cenário 3: Acesso negado por role

```bash
# Usuário sem role 'admin' tentando acessar rota de admin
curl -X GET "http://localhost:3001/test-auth/admin-only" \
  -H "Authorization: Bearer $TOKEN"
```

**Resposta:**

```json
{
  "statusCode": 403,
  "message": "Forbidden resource",
  "error": "Forbidden"
}
```

## Exemplo de Uso no Frontend

```javascript
// 1. Login
const loginResponse = await fetch('/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    keycloakToken: keycloakAccessToken,
  }),
});

const { access_token, user } = await loginResponse.json();

// 2. Salvar token (localStorage, sessionStorage, etc.)
localStorage.setItem('authToken', access_token);

// 3. Usar em requisições subsequentes
const protectedResponse = await fetch('/test-auth/protected', {
  headers: {
    Authorization: `Bearer ${access_token}`,
  },
});

// 4. Verificar se ainda está autenticado
const validateResponse = await fetch('/auth/validate', {
  headers: {
    Authorization: `Bearer ${access_token}`,
  },
});
```

## Troubleshooting

### Erro: "Cannot find module"

Certifique-se de que todas as dependências foram instaladas:

```bash
cd apps/backend
pnpm install
```

### Erro: "KEYCLOAK_URL is not defined"

Verifique se o arquivo `.env` está na pasta correta e contém todas as variáveis necessárias.

### Erro: "Token inválido ou expirado"

1. Verifique se o token do Keycloak ainda é válido
2. Confirme se as configurações do Keycloak estão corretas
3. Verifique se o usuário tem exatamente 4 dígitos no username

### Erro: "Forbidden resource"

O usuário não tem a role necessária para acessar a rota. Verifique as roles no Keycloak.

## Estrutura de Resposta da API

### Login Bem-sucedido

```json
{
  "access_token": "string",
  "user": {
    "userId": "string",
    "username": "string (4 dígitos)",
    "email": "string",
    "name": "string",
    "roles": ["string"]
  }
}
```

### Informações do Usuário

```json
{
  "userId": "string",
  "username": "string",
  "name": "string",
  "email": "string",
  "roles": ["string"],
  "isAdmin": boolean,
  "isModerator": boolean,
  "hasValidFormat": boolean
}
```
