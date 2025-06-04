'use client';

import { useState, useCallback } from 'react';
import {
  participantesService,
  type Participante,
  type ParticipanteSearchParams,
} from '../services/participantes.service';
import { APIError } from '../services/api.service';

interface UseParticipantesReturn {
  participantes: Participante[];
  isLoading: boolean;
  error: string | null;
  searchParticipantes: (params: ParticipanteSearchParams) => Promise<void>;
  clearResults: () => void;
  clearError: () => void;
}

export function useParticipantes(): UseParticipantesReturn {
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchParticipantes = useCallback(
    async (params: ParticipanteSearchParams) => {
      setIsLoading(true);
      setError(null);

      try {
        const results = await participantesService.buscarParticipantes(params);
        setParticipantes(results);
      } catch (err) {
        const errorMessage =
          err instanceof APIError
            ? err.message
            : 'Erro ao buscar participantes. Tente novamente.';
        setError(errorMessage);
        setParticipantes([]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const clearResults = useCallback(() => {
    setParticipantes([]);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    participantes,
    isLoading,
    error,
    searchParticipantes,
    clearResults,
    clearError,
  };
}
