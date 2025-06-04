import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateParticipanteDto, UpdateParticipanteDto } from '@repo/shared';
import { Participante } from '@prisma/client';

@Injectable()
export class ParticipantesService {
  constructor(private prisma: PrismaService) {}

  async create(
    createParticipanteDto: CreateParticipanteDto,
  ): Promise<Participante> {
    // Verificar se CPF já existe
    const existingParticipante = await this.prisma.participante.findUnique({
      where: { cpf: createParticipanteDto.cpf },
    });

    if (existingParticipante) {
      throw new ConflictException('CPF já cadastrado');
    }

    return this.prisma.participante.create({
      data: createParticipanteDto,
    });
  }

  async findAll(): Promise<Participante[]> {
    return this.prisma.participante.findMany({
      include: { ingressos: true },
    });
  }

  async findOne(id: number): Promise<Participante> {
    const participante = await this.prisma.participante.findUnique({
      where: { id },
      include: { ingressos: true },
    });

    if (!participante) {
      throw new NotFoundException(`Participante com ID ${id} não encontrado`);
    }

    return participante;
  }

  async findByCpf(cpf: string): Promise<Participante> {
    const participante = await this.prisma.participante.findUnique({
      where: { cpf },
      include: { ingressos: true },
    });

    if (!participante) {
      throw new NotFoundException(`Participante com CPF ${cpf} não encontrado`);
    }

    return participante;
  }

  async update(
    id: number,
    updateParticipanteDto: UpdateParticipanteDto,
  ): Promise<Participante> {
    const participante = await this.findOne(id);

    // Se estiver atualizando o CPF, verificar se não existe outro com o mesmo CPF
    if (
      updateParticipanteDto.cpf &&
      updateParticipanteDto.cpf !== participante.cpf
    ) {
      const existingParticipante = await this.prisma.participante.findUnique({
        where: { cpf: updateParticipanteDto.cpf },
      });

      if (existingParticipante) {
        throw new ConflictException('CPF já cadastrado');
      }
    }

    return this.prisma.participante.update({
      where: { id },
      data: updateParticipanteDto,
    });
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id); // Verificar se existe
    await this.prisma.participante.delete({
      where: { id },
    });
  }
}
