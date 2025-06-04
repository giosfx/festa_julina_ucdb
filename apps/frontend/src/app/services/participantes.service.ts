import { apiService } from './api.service';

export interface Participante {
  id: string;
  nome: string;
  ra?: string;
  rf?: string;
  cpf: string;
  tipo: 'academico' | 'funcionario';
  ingressosComprados: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ParticipanteCreateData {
  nome: string;
  ra?: string;
  rf?: string;
  cpf: string;
  tipo: 'academico' | 'funcionario';
}

class ParticipantesService {
  async buscarParticipantes(query: string): Promise<Participante[]> {
    const searchParams = new URLSearchParams({
      query: query,
    });

    return apiService.get<Participante[]>(
      `/participantes/search?${searchParams.toString()}`,
      true
    );
  }

  async obterParticipante(id: string): Promise<Participante> {
    return apiService.get<Participante>(`/participantes/${id}`, true);
  }

  async criarParticipante(data: ParticipanteCreateData): Promise<Participante> {
    return apiService.post<Participante>('/participantes', data, true);
  }

  async atualizarParticipante(
    id: string,
    data: Partial<ParticipanteCreateData>
  ): Promise<Participante> {
    return apiService.put<Participante>(`/participantes/${id}`, data, true);
  }

  async excluirParticipante(id: string): Promise<void> {
    await apiService.delete(`/participantes/${id}`, true);
  }

  async listarTodos(): Promise<Participante[]> {
    return apiService.get<Participante[]>('/participantes', true);
  }
}

export const participantesService = new ParticipantesService();
