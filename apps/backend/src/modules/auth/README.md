# Autenticação Keycloak - Festa Julina UCDB

## Configuração

### Variáveis de Ambiente

Adicione as seguintes variáveis ao arquivo `.env`:

```env
# Keycloak Configuration
KEYCLOAK_URL=https://login.ucdb.br/
KEYCLOAK_REALM=Festa Julina UCDB
KEYCLOAK_CLIENT_ID=festa_julina_ucdb_client_dev
KEYCLOAK_CLIENT_SECRET=pgGBhfVARWhvoe5wug1AIfSrQcdVYZ2U

# JWT Configuration
JWT_SECRET=sua_chave_secreta_jwt_aqui
JWT_EXPIRES_IN=24h
```

## Fluxo de Autenticação

1. **Login via Keycloak**: O usuário se autentica no Keycloak e obtém um token
2. **Validação**: O backend valida o token Keycloak e verifica se o usuário tem 4 dígitos
3. **JWT Interno**: O backend gera um JWT interno para uso nas requisições
4. **Autorização**: As rotas protegidas verificam o JWT e roles do usuário

## Endpoints de Autenticação

### POST /auth/login

Faz login usando token do Keycloak

**Body:**

```json
{
  "keycloakToken": "token_obtido_do_keycloak"
}
```

**Response:**

```json
{
  "access_token": "jwt_token_interno",
  "user": {
    "userId": "keycloak_user_id",
    "username": "1234",
    "email": "usuario@ucdb.br",
    "name": "Nome do Usuário",
    "roles": ["user", "admin"]
  }
}
```

### GET /auth/profile

Retorna dados do usuário logado (requer autenticação)

**Headers:**

```
Authorization: Bearer <jwt_token>
```

### GET /auth/validate

Valida se o token está válido

## Proteção de Rotas

### 1. Middleware de Autenticação JWT

```typescript
import { AuthGuard } from '../auth/guards/auth.guard';

@UseGuards(AuthGuard)
@Get('protected')
protectedRoute(@CurrentUser() user: AuthPayload) {
  return { message: 'Rota protegida', user };
}
```

### 2. Proteção por Roles

```typescript
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(AuthGuard, RolesGuard)
@Roles('admin')
@Delete(':id')
adminOnlyRoute(@CurrentUser() user: AuthPayload) {
  return { message: 'Apenas administradores' };
}
```

### 3. Validação de Usuário (4 dígitos)

O sistema automaticamente valida que o `preferred_username` do Keycloak seja um número de 4 dígitos. Usuários que não atendam a este critério não conseguirão se autenticar.

## Decorators Disponíveis

### @CurrentUser()

Obtém os dados do usuário logado:

```typescript
@Get('me')
@UseGuards(AuthGuard)
getMe(@CurrentUser() user: AuthPayload) {
  return user;
}
```

### @Roles(...roles)

Define quais roles podem acessar a rota:

```typescript
@Roles('admin', 'moderator')
@UseGuards(AuthGuard, RolesGuard)
adminRoute() {
  // Apenas usuários com role 'admin' ou 'moderator'
}
```

## Guards Disponíveis

### AuthGuard

- Valida JWT token
- Verifica se usuário tem 4 dígitos
- Adiciona dados do usuário à requisição

### RolesGuard

- Verifica se usuário tem as roles necessárias
- Deve ser usado junto com AuthGuard
- Usa metadata definida pelo decorator @Roles

## Tipos TypeScript

```typescript
export interface AuthPayload {
  userId: string; // ID do usuário no Keycloak
  username: string; // Username (4 dígitos)
  email: string; // Email do usuário
  name: string; // Nome completo
  roles: string[]; // Roles do usuário
}

export interface KeycloakUser {
  sub: string;
  preferred_username: string;
  name: string;
  email: string;
  realm_access: {
    roles: string[];
  };
}
```

## Exemplo de Uso Completo

```typescript
@Controller('exemplo')
export class ExemploController {
  // Rota pública
  @Get('public')
  publicRoute() {
    return { message: 'Rota pública' };
  }

  // Rota que requer autenticação
  @Get('private')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  privateRoute(@CurrentUser() user: AuthPayload) {
    return {
      message: 'Rota privada',
      user: user.username,
    };
  }

  // Rota apenas para administradores
  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  adminRoute(@Param('id') id: string, @CurrentUser() user: AuthPayload) {
    return {
      message: `Admin ${user.username} deletando ${id}`,
    };
  }
}
```

## Swagger/OpenAPI

As rotas protegidas automaticamente aparecem com o cadeado no Swagger UI quando você usa o decorator `@ApiBearerAuth()`.

Para testar no Swagger:

1. Faça login via `/auth/login`
2. Copie o `access_token` da resposta
3. Clique no botão "Authorize" no Swagger UI
4. Cole o token no campo "Bearer token"

## Tratamento de Erros

- `401 Unauthorized`: Token inválido, expirado ou não fornecido
- `403 Forbidden`: Usuário autenticado mas sem permissão (role)
- `400 Bad Request`: Formato de usuário inválido (não tem 4 dígitos)
