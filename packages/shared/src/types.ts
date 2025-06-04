import 'reflect-metadata';
import { IsNotEmpty, IsString, Length, IsOptional } from 'class-validator';

export class Participante {
  id!: number;

  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString({ message: 'Nome deve ser uma string' })
  nome!: string;

  @IsNotEmpty({ message: 'CPF é obrigatório' })
  @IsString({ message: 'CPF deve ser uma string' })
  @Length(11, 11, { message: 'CPF deve ter exatamente 11 dígitos' })
  cpf!: string;

  @IsOptional()
  @IsString({ message: 'RA deve ser uma string' })
  @Length(6, 6, { message: 'RA deve ter exatamente 6 dígitos' })
  ra?: string;

  @IsOptional()
  @IsString({ message: 'RF deve ser uma string' })
  @Length(4, 4, { message: 'RF deve ter exatamente 4 dígitos' })
  rf?: string;

  ingressos?: Ingresso[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class Ingresso {
  id!: number;
  participanteId!: number;
  participante?: Participante;
  quantidade!: number;
  dataCompra!: Date;
  funcionarioCheckin?: string;
  checkinRealizado!: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateParticipanteDto {
  nome: string;
  cpf: string;
  ra?: string;
  rf?: string;
}

export interface UpdateParticipanteDto extends Partial<CreateParticipanteDto> {}

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
