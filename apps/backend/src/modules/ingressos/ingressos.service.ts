import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateIngressoDto, UpdateIngressoDto } from '@repo/shared';
import { Ingresso } from '@prisma/client';

@Injectable()
export class IngressosService {
  constructor(private prisma: PrismaService) {}

  async create(createIngressoDto: CreateIngressoDto): Promise<Ingresso> {
    // Verificar se o participante existe
    const participante = await this.prisma.participante.findUnique({
      where: { id: createIngressoDto.participanteId },
    });

    if (!participante) {
      throw new NotFoundException(
        `Participante com ID ${createIngressoDto.participanteId} não encontrado`,
      );
    }

    // Verificar se a quantidade está dentro do limite
    if (createIngressoDto.quantidade < 1 || createIngressoDto.quantidade > 2) {
      throw new BadRequestException(
        'Quantidade deve ser entre 1 e 2 ingressos',
      );
    }

    // Verificar se o participante já tem ingressos
    const existingIngressos = await this.prisma.ingresso.findMany({
      where: { participanteId: createIngressoDto.participanteId },
    });

    const totalQuantidade = existingIngressos.reduce(
      (sum, ingresso: { quantidade: number }) => sum + ingresso.quantidade,
      0,
    );

    if (totalQuantidade + createIngressoDto.quantidade > 2) {
      throw new BadRequestException(
        'Participante não pode ter mais de 2 ingressos no total',
      );
    }

    return this.prisma.ingresso.create({
      data: {
        ...createIngressoDto,
        dataCompra: new Date(),
        checkinRealizado: false,
      },
    });
  }

  async findAll() {
    return this.prisma.ingresso.findMany({
      include: { participante: true },
    });
  }

  async findOne(id: number) {
    const ingresso = await this.prisma.ingresso.findUnique({
      where: { id },
      include: { participante: true },
    });

    if (!ingresso) {
      throw new NotFoundException(`Ingresso com ID ${id} não encontrado`);
    }

    return ingresso;
  }

  async findByParticipante(participanteId: number) {
    // Verificar se o participante existe
    const participante = await this.prisma.participante.findUnique({
      where: { id: participanteId },
    });

    if (!participante) {
      throw new NotFoundException(
        `Participante com ID ${participanteId} não encontrado`,
      );
    }

    return this.prisma.ingresso.findMany({
      where: { participanteId },
      include: { participante: true },
    });
  }

  async update(id: number, updateIngressoDto: UpdateIngressoDto) {
    const ingresso = await this.findOne(id);

    // Se estiver atualizando a quantidade, verificar limites
    if (updateIngressoDto.quantidade !== undefined) {
      if (
        updateIngressoDto.quantidade < 1 ||
        updateIngressoDto.quantidade > 2
      ) {
        throw new BadRequestException(
          'Quantidade deve ser entre 1 e 2 ingressos',
        );
      }

      // Verificar se o participante não excederá o limite total
      const otherIngressos = await this.prisma.ingresso.findMany({
        where: {
          participanteId: ingresso.participanteId,
          id: { not: id },
        },
      });

      const totalQuantidade = otherIngressos.reduce(
        (sum, ing: { quantidade: number }) => sum + ing.quantidade,
        0,
      );

      if (totalQuantidade + updateIngressoDto.quantidade > 2) {
        throw new BadRequestException(
          'Participante não pode ter mais de 2 ingressos no total',
        );
      }
    }

    return this.prisma.ingresso.update({
      where: { id },
      data: updateIngressoDto,
    });
  }

  async realizarCheckin(id: number, funcionario: string) {
    const ingresso = await this.findOne(id);

    if (ingresso.checkinRealizado) {
      throw new BadRequestException(
        'Check-in já foi realizado para este ingresso',
      );
    }

    return this.prisma.ingresso.update({
      where: { id },
      data: {
        checkinRealizado: true,
        funcionarioCheckin: funcionario,
      },
    });
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id); // Verificar se existe
    await this.prisma.ingresso.delete({
      where: { id },
    });
  }
}
