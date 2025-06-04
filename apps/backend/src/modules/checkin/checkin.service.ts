import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Checkin } from '@prisma/client';

@Injectable()
export class CheckinService {
  constructor(private prisma: PrismaService) {}

  async realizarCheckin(participanteId: number, funcionario: string): Promise<Checkin> {
    // Verificar se o participante existe
    const participante = await this.prisma.participante.findUnique({
      where: { id: participanteId },
      include: {
        checkins: true,
      },
    });

    if (!participante) {
      throw new NotFoundException(
        `Participante com ID ${participanteId} não encontrado`,
      );
    }

    // Verificar se o participante já realizou 2 check-ins
    if (participante.checkins.length >= 2) {
      throw new BadRequestException(
        'Participante já realizou o número máximo de check-ins permitidos (2)',
      );
    }

    // Registrar o check-in
    return this.prisma.checkin.create({
      data: {
        participanteId,
        dataCheckin: new Date(),
        funcionarioCheckin: funcionario,
      },
    });
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

    return this.prisma.checkin.findMany({
      where: { participanteId },
      include: { participante: true },
      orderBy: { dataCheckin: 'desc' },
    });
  }

  async verificarStatusCheckin(participanteId: number) {
    const participante = await this.prisma.participante.findUnique({
      where: { id: participanteId },
      include: {
        checkins: {
          orderBy: { dataCheckin: 'desc' },
        },
      },
    });

    if (!participante) {
      throw new NotFoundException(
        `Participante com ID ${participanteId} não encontrado`,
      );
    }

    return {
      participante,
      totalCheckins: participante.checkins.length,
      checkinsRealizados: participante.checkins,
      podeRealizarCheckin: participante.checkins.length < 2,
    };
  }
}
