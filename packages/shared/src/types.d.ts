import 'reflect-metadata';
export declare class Participante {
    id: number;
    nome: string;
    cpf: string;
    ra?: string;
    rf?: string;
    ingressos?: Ingresso[];
    createdAt?: Date;
    updatedAt?: Date;
}
export declare class Ingresso {
    id: number;
    participanteId: number;
    participante?: Participante;
    quantidade: number;
    dataCompra: Date;
    funcionarioCheckin?: string;
    checkinRealizado: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface CreateParticipanteDto {
    nome: string;
    cpf: string;
    ra?: string;
    rf?: string;
}
export interface UpdateParticipanteDto extends Partial<CreateParticipanteDto> {
}
export interface CreateIngressoDto {
    participanteId: number;
    quantidade: number;
}
export interface UpdateIngressoDto extends Partial<CreateIngressoDto> {
    funcionarioCheckin?: string;
    checkinRealizado?: boolean;
}
export interface ParticipanteResponse extends Participante {
    ingressos: Ingresso[];
}
export interface IngressoResponse extends Ingresso {
    participante: Participante;
}
