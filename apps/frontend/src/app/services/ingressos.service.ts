import { apiService } from './api.service';

export interface Ingresso {
  id: string;
  participanteId: string;
  quantidade: number;
  valor: number;
  dataCompra: string;
  status: 'ativo' | 'cancelado' | 'usado';
  participante?: {
    nome: string;
    ra?: string;
    rf?: string;
    cpf: string;
    tipo: 'academico' | 'funcionario';
  };
}

export interface IngressoCreateData {
  participanteId: string;
  quantidade: number;
}

export interface IngressoStats {
  totalVendidos: number;
  totalArrecadado: number;
  ingressosAcademicos: number;
  ingressosFuncionarios: number;
  vendasPorDia: Array<{
    data: string;
    quantidade: number;
    valor: number;
  }>;
}

class IngressosService {
  async comprarIngresso(data: IngressoCreateData): Promise<Ingresso> {
    return apiService.post<Ingresso, IngressoCreateData>(
      '/ingressos',
      data,
      true
    );
  }

  async listarIngressos(): Promise<Ingresso[]> {
    return apiService.get<Ingresso[]>('/ingressos', true);
  }

  async obterIngresso(id: string): Promise<Ingresso> {
    return apiService.get<Ingresso>(`/ingressos/${id}`, true);
  }

  async cancelarIngresso(id: string): Promise<Ingresso> {
    return apiService.put<Ingresso>(`/ingressos/${id}/cancelar`, {}, true);
  }

  async marcarComoUsado(id: string): Promise<Ingresso> {
    return apiService.put<Ingresso>(`/ingressos/${id}/usar`, {}, true);
  }

  async obterEstatisticas(): Promise<IngressoStats> {
    return apiService.get<IngressoStats>('/ingressos/stats', true);
  }

  async listarIngressosParticipante(
    participanteId: string
  ): Promise<Ingresso[]> {
    return apiService.get<Ingresso[]>(
      `/ingressos/participante/${participanteId}`,
      true
    );
  }

  async validarIngresso(codigo: string): Promise<{
    valido: boolean;
    ingresso?: Ingresso;
    mensagem: string;
  }> {
    return apiService.post<{
      valido: boolean;
      ingresso?: Ingresso;
      mensagem: string;
    }>('/ingressos/validar', { codigo }, true);
  }
}

export const ingressosService = new IngressosService();
