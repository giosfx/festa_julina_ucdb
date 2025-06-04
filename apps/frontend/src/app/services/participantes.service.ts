import { apiService } from './api.service';

export interface Participante {
  id: string;
  nome: string;
  ra?: string;
  rf?: string;
  cpf: string;
  tipo: 'academico' | 'funcionario';
  checkinsRealizados: number;
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

export interface ParticipanteSearchParams {
  query: string;
}

class ParticipantesService {
  async buscarParticipantes(
    params: ParticipanteSearchParams
  ): Promise<Participante[]> {
    // Usando o endpoint correto com parâmetro de rota, não query parameter
    return apiService.get<Participante[]>(
      `/participantes/search/${encodeURIComponent(params.query)}`,
      true
    );
  }

  async obterParticipante(id: string): Promise<Participante> {
    return apiService.get<Participante>(`/participantes/${id}`, true);
  }

  async criarParticipante(data: ParticipanteCreateData): Promise<Participante> {
    return apiService.post<Participante, ParticipanteCreateData>(
      '/participantes',
      data,
      true
    );
  }

  async atualizarParticipante(
    id: string,
    data: Partial<ParticipanteCreateData>
  ): Promise<Participante> {
    return apiService.put<Participante, Partial<ParticipanteCreateData>>(
      `/participantes/${id}`,
      data,
      true
    );
  }

  async excluirParticipante(id: string): Promise<void> {
    await apiService.delete(`/participantes/${id}`, true);
  }

  async listarTodos(): Promise<Participante[]> {
    return apiService.get<Participante[]>('/participantes', true);
  }
}

export const participantesService = new ParticipantesService();
