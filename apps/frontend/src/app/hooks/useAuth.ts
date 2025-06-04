'use client';

import { useState, useEffect, useCallback } from 'react';
import { authService, AuthError } from '../services/auth.service';
import type { User, LoginFormData } from '../types/auth';

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginFormData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Verificar se o usuário já está autenticado ao carregar a página
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const isAuth = authService.isAuthenticated();
        if (isAuth) {
          // Validar com o backend e obter dados atualizados
          const isValidOnServer = await authService.isAuthenticatedAsync();
          if (isValidOnServer) {
            const userData = await authService.getCurrentUser();
            if (userData) {
              setUser(userData);
              setIsAuthenticated(true);
            } else {
              // Se não conseguir obter dados do usuário, limpar tokens
              authService.clearTokens();
            }
          } else {
            // Token inválido no servidor, limpar tokens
            authService.clearTokens();
          }
        }
      } catch (err) {
        console.error('Erro ao verificar status de autenticação:', err);
        authService.clearTokens();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Função de login
  const login = useCallback(async (credentials: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login(credentials);
      authService.saveTokens(response);

      setUser(response.user);
      setIsAuthenticated(true);
    } catch (err) {
      const errorMessage =
        err instanceof AuthError
          ? err.message
          : 'Falha no login. Verifique suas credenciais e tente novamente.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Função de logout
  const logout = useCallback(async () => {
    setIsLoading(true);

    try {
      const { refreshToken } = authService.getStoredTokens();
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch (err) {
      console.error('Erro ao fazer logout no servidor:', err);
    } finally {
      authService.clearTokens();
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  }, []);

  // Limpar erro
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    clearError,
  };
}
