'use client';

import { useState, useCallback } from 'react';
import {
  checkinService,
  type StatusCheckin,
} from '../services/checkin.service';
import { APIError } from '../services/api.service';

interface UseCheckinReturn {
  isLoading: boolean;
  error: string | null;
  checkinStatus: StatusCheckin | null;
  verificarStatusCheckin: (participanteId: string) => Promise<void>;
  realizarCheckin: (participanteId: string) => Promise<boolean>;
  clearError: () => void;
}

export function useCheckin(): UseCheckinReturn {
  const [checkinStatus, setCheckinStatus] = useState<StatusCheckin | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verificarStatusCheckin = useCallback(async (participanteId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const status =
        await checkinService.verificarStatusCheckin(participanteId);
      setCheckinStatus(status);
    } catch (err) {
      const errorMessage =
        err instanceof APIError
          ? err.message
          : 'Erro ao verificar status de check-in. Tente novamente.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const realizarCheckin = useCallback(
    async (participanteId: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        const novoCheckin =
          await checkinService.realizarCheckin(participanteId);

        // Atualizar o status após o check-in
        if (novoCheckin) {
          const statusAtualizado =
            await checkinService.verificarStatusCheckin(participanteId);
          setCheckinStatus(statusAtualizado);
          return true;
        }

        return false;
      } catch (err) {
        const errorMessage =
          err instanceof APIError
            ? err.message
            : 'Erro ao realizar check-in. Tente novamente.';
        setError(errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    checkinStatus,
    verificarStatusCheckin,
    realizarCheckin,
    clearError,
  };
}
