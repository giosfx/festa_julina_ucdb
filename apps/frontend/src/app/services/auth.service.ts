import type {
  LoginFormData,
  AuthResponse,
  KeycloakUserInfo,
  User,
} from '../types/auth';
import { apiService, APIError } from './api.service';

// Configurações do Keycloak - Para obter token diretamente do Keycloak
const KEYCLOAK_CONFIG = {
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'https://login.ucdb.br',
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'Festa Julina UCDB',
  clientId:
    process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID ||
    'festa_julina_ucdb_client_dev',
  clientSecret:
    process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET ||
    'pgGBhfVARWhvoe5wug1AIfSrQcdVYZ2U',
};

class AuthService {
  private getTokenUrl(): string {
    return `${KEYCLOAK_CONFIG.url}/realms/${KEYCLOAK_CONFIG.realm}/protocol/openid-connect/token`;
  }

  private getUserInfoUrl(): string {
    return `${KEYCLOAK_CONFIG.url}/realms/${KEYCLOAK_CONFIG.realm}/protocol/openid-connect/userinfo`;
  }

  private getLogoutUrl(): string {
    return `${KEYCLOAK_CONFIG.url}/realms/${KEYCLOAK_CONFIG.realm}/protocol/openid-connect/logout`;
  }
  async login(credentials: LoginFormData): Promise<AuthResponse> {
    try {
      // 1. Primeiro, obter token do Keycloak
      const keycloakToken = await this.getKeycloakToken(credentials);

      // 2. Usar o token do Keycloak para fazer login no nosso backend
      const backendResponse = await apiService.post<{
        access_token: string;
        user: {
          userId: string;
          username: string;
          email: string;
          name: string;
          roles: string[];
        };
      }>('/auth/login', {
        keycloakToken: keycloakToken.access_token,
      });

      // 3. Transformar resposta para o formato esperado
      return {
        access_token: backendResponse.access_token,
        refresh_token: keycloakToken.refresh_token,
        expires_in: keycloakToken.expires_in,
        user: {
          id: backendResponse.user.userId,
          username: backendResponse.user.username,
          name: backendResponse.user.name,
          email: backendResponse.user.email,
          roles: backendResponse.user.roles,
        },
      };
    } catch (error) {
      if (error instanceof APIError) {
        throw new AuthError(error.message, error.code, error.status);
      }
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError('Erro de conexão com o servidor de autenticação');
    }
  }

  private async getKeycloakToken(credentials: LoginFormData): Promise<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
  }> {
    const response = await fetch(this.getTokenUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'password',
        client_id: KEYCLOAK_CONFIG.clientId,
        client_secret: KEYCLOAK_CONFIG.clientSecret,
        username: credentials.user,
        password: credentials.password,
        scope: 'openid profile email',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new AuthError(
        error.error_description || 'Falha na autenticação',
        error.error,
        response.status
      );
    }

    return response.json();
  }
  async getUserInfo(accessToken: string): Promise<KeycloakUserInfo> {
    const response = await fetch(this.getUserInfoUrl(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new AuthError('Falha ao obter informações do usuário');
    }

    return response.json();
  }

  async validateToken(): Promise<boolean> {
    try {
      await apiService.get('/auth/validate', true);
      return true;
    } catch {
      return false;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await apiService.get<{
        userId: string;
        username: string;
        email: string;
        name: string;
        roles: string[];
      }>('/auth/profile', true);

      return {
        id: response.userId,
        username: response.username,
        name: response.name,
        email: response.email,
        roles: response.roles,
      };
    } catch {
      return null;
    }
  }
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      // 1. Renovar token no Keycloak
      const response = await fetch(this.getTokenUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: KEYCLOAK_CONFIG.clientId,
          client_secret: KEYCLOAK_CONFIG.clientSecret,
          refresh_token: refreshToken,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new AuthError(
          errorData.error_description || 'Falha ao renovar token',
          errorData.error,
          response.status
        );
      }

      const tokenData = await response.json();

      // 2. Fazer login no backend com o novo token
      const backendResponse = await apiService.post<{
        access_token: string;
        user: {
          userId: string;
          username: string;
          email: string;
          name: string;
          roles: string[];
        };
      }>('/auth/login', {
        keycloakToken: tokenData.access_token,
      });

      return {
        access_token: backendResponse.access_token,
        refresh_token: tokenData.refresh_token,
        expires_in: tokenData.expires_in,
        user: {
          id: backendResponse.user.userId,
          username: backendResponse.user.username,
          name: backendResponse.user.name,
          email: backendResponse.user.email,
          roles: backendResponse.user.roles,
        },
      };
    } catch (_) {
      if (_ instanceof APIError) {
        throw new AuthError(_.message, _.code, _.status);
      }
      if (_ instanceof AuthError) {
        throw _;
      }
      throw new AuthError('Erro ao renovar token de acesso');
    }
  }

  async logout(refreshToken: string): Promise<void> {
    try {
      await fetch(this.getLogoutUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: KEYCLOAK_CONFIG.clientId,
          client_secret: KEYCLOAK_CONFIG.clientSecret,
          refresh_token: refreshToken,
        }),
      });
    } catch (e) {
      console.error('Erro ao fazer logout:', e);
      // Não lançar erro aqui para não bloquear o logout local
    }
  }

  // Validação local do token
  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  }

  // Gerenciamento de tokens no localStorage
  saveTokens(response: AuthResponse): void {
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('refresh_token', response.refresh_token);
    localStorage.setItem('user', JSON.stringify(response.user));
    localStorage.setItem(
      'token_expires_at',
      String(Date.now() + response.expires_in * 1000)
    );
  }
  getStoredTokens(): {
    accessToken: string | null;
    refreshToken: string | null;
    user: User | null;
  } {
    return {
      accessToken: localStorage.getItem('access_token'),
      refreshToken: localStorage.getItem('refresh_token'),
      user: localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user')!)
        : null,
    };
  }

  clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('token_expires_at');
  }
  isAuthenticated(): boolean {
    const { accessToken } = this.getStoredTokens();
    return accessToken !== null && !this.isTokenExpired(accessToken);
  }

  async isAuthenticatedAsync(): Promise<boolean> {
    const { accessToken } = this.getStoredTokens();
    if (!accessToken || this.isTokenExpired(accessToken)) {
      return false;
    }

    // Validar com o backend
    return await this.validateToken();
  }
}

class AuthError extends Error {
  constructor(
    message: string,
    public code?: string,
    public status?: number
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

export const authService = new AuthService();
export { AuthError };
