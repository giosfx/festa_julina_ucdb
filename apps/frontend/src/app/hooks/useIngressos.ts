'use client';

import { useState, useCallback } from 'react';
import {
  ingressosService,
  type Ingresso,
  type IngressoCreateData,
} from '../services/ingressos.service';
import { APIError } from '../services/api.service';

interface UseIngressosReturn {
  ingressos: Ingresso[];
  isLoading: boolean;
  error: string | null;
  comprarIngresso: (data: IngressoCreateData) => Promise<Ingresso | null>;
  listarIngressos: () => Promise<void>;
  cancelarIngresso: (id: string) => Promise<boolean>;
  clearError: () => void;
}

export function useIngressos(): UseIngressosReturn {
  const [ingressos, setIngressos] = useState<Ingresso[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const comprarIngresso = useCallback(
    async (data: IngressoCreateData): Promise<Ingresso | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const novoIngresso = await ingressosService.comprarIngresso(data);
        setIngressos(prev => [...prev, novoIngresso]);
        return novoIngresso;
      } catch (err) {
        const errorMessage =
          err instanceof APIError
            ? err.message
            : 'Erro ao comprar ingresso. Tente novamente.';
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const listarIngressos = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const lista = await ingressosService.listarIngressos();
      setIngressos(lista);
    } catch (err) {
      const errorMessage =
        err instanceof APIError
          ? err.message
          : 'Erro ao carregar ingressos. Tente novamente.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cancelarIngresso = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await ingressosService.cancelarIngresso(id);
      setIngressos(prev =>
        prev.map(ingresso =>
          ingresso.id === id
            ? { ...ingresso, status: 'cancelado' as const }
            : ingresso
        )
      );
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof APIError
          ? err.message
          : 'Erro ao cancelar ingresso. Tente novamente.';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    ingressos,
    isLoading,
    error,
    comprarIngresso,
    listarIngressos,
    cancelarIngresso,
    clearError,
  };
}
