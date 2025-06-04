import { apiService } from './api.service';

export interface Checkin {
  id: number;
  participanteId: number;
  dataCheckin: string;
  funcionarioCheckin: string;
}

export interface CheckinResponse {
  id: number;
  participanteId: number;
  dataCheckin: string;
  funcionarioCheckin: string;
}

export interface StatusCheckin {
  participante: {
    id: number;
    nome: string;
    cpf: string;
    ra?: string;
    rf?: string;
  };
  totalCheckins: number;
  checkinsRealizados: Checkin[];
  podeRealizarCheckin: boolean;
}

class CheckinService {
  /**
   * Realiza check-in de um participante
   * @param participanteId ID do participante
   * @returns Resposta com status do check-in
   */
  async realizarCheckin(participanteId: string): Promise<CheckinResponse> {
    return apiService.post<CheckinResponse>(
      `/checkins/${participanteId}`,
      {},
      true
    );
  }

  /**
   * Lista check-ins de um participante
   * @param participanteId ID do participante
   * @returns Lista de check-ins do participante
   */
  async listarCheckinsParticipante(participanteId: string): Promise<Checkin[]> {
    return apiService.get<Checkin[]>(
      `/checkins/participante/${participanteId}`,
      true
    );
  }

  /**
   * Verifica status de check-in de um participante
   * @param participanteId ID do participante
   * @returns Status de check-in do participante
   */
  async verificarStatusCheckin(participanteId: string): Promise<StatusCheckin> {
    return apiService.get<StatusCheckin>(
      `/checkins/status/${participanteId}`,
      true
    );
  }
}

export const checkinService = new CheckinService();
