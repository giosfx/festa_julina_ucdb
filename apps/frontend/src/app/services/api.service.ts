/**
 * Serviço base para comunicação com a API do backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: Record<string, unknown>;
  requiresAuth?: boolean;
}

class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

class APIService {
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async makeRequest<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const { method = 'GET', headers = {}, body, requiresAuth = false } = config;

    const url = `${API_BASE_URL}${endpoint}`;

    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };

    if (requiresAuth) {
      Object.assign(requestHeaders, this.getAuthHeaders());
    }

    const requestConfig: RequestInit = {
      method,
      headers: requestHeaders,
    };

    if (body && method !== 'GET') {
      requestConfig.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, requestConfig);

      if (!response.ok) {
        let errorMessage = 'Erro na requisição';
        let errorCode: string | undefined;

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
          errorCode = errorData.error;
        } catch {
          // Se não conseguir parsear o erro, usar mensagens padrão
          if (response.status === 401) {
            errorMessage = 'Não autorizado. Faça login novamente.';
          } else if (response.status === 403) {
            errorMessage =
              'Acesso negado. Você não tem permissão para esta ação.';
          } else if (response.status === 404) {
            errorMessage = 'Recurso não encontrado.';
          } else if (response.status >= 500) {
            errorMessage =
              'Erro interno do servidor. Tente novamente mais tarde.';
          }
        }

        throw new APIError(errorMessage, response.status, errorCode);
      }

      return response.json();
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }

      throw new APIError(
        'Erro de conexão com o servidor. Verifique sua conexão com a internet.',
        0
      );
    }
  }

  // Métodos de conveniência
  async get<T>(endpoint: string, requiresAuth = false): Promise<T> {
    return this.makeRequest<T>(endpoint, { method: 'GET', requiresAuth });
  }

  async post<T, D = Record<string, unknown>>(
    endpoint: string,
    data: D,
    requiresAuth = false
  ): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: data as unknown as Record<string, unknown>,
      requiresAuth,
    });
  }

  async put<T, D = Record<string, unknown>>(
    endpoint: string,
    data: D,
    requiresAuth = false
  ): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      body: data as unknown as Record<string, unknown>,
      requiresAuth,
    });
  }

  async delete<T>(endpoint: string, requiresAuth = false): Promise<T> {
    return this.makeRequest<T>(endpoint, { method: 'DELETE', requiresAuth });
  }
}

export const apiService = new APIService();
export { APIError };
