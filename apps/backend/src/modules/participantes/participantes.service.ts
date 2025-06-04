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
      include: { checkins: true },
    });
  }

  async findOne(id: number): Promise<Participante> {
    const participante = await this.prisma.participante.findUnique({
      where: { id },
      include: { checkins: true },
    });

    if (!participante) {
      throw new NotFoundException(`Participante com ID ${id} não encontrado`);
    }

    return participante;
  }

  async findByCpf(cpf: string): Promise<Participante> {
    const participante = await this.prisma.participante.findUnique({
      where: { cpf },
      include: { checkins: true },
    });

    if (!participante) {
      throw new NotFoundException(`Participante com CPF ${cpf} não encontrado`);
    }

    return participante;
  }

  async findByRa(ra: string): Promise<Participante> {
    const participante = await this.prisma.participante.findFirst({
      where: { ra },
      include: { checkins: true },
    });

    if (!participante) {
      throw new NotFoundException(`Participante com RA ${ra} não encontrado`);
    }

    return participante;
  }

  async findByRf(rf: string): Promise<Participante> {
    const participante = await this.prisma.participante.findFirst({
      where: { rf },
      include: { checkins: true },
    });

    if (!participante) {
      throw new NotFoundException(`Participante com RF ${rf} não encontrado`);
    }

    return participante;
  }

  async findByNome(nome: string): Promise<Participante[]> {
    return this.prisma.participante.findMany({
      where: {
        nome: {
          contains: nome,
        },
      },
      include: { checkins: true },
    });
  }

  async search(query: string): Promise<Participante[]> {
    // Determinar tipo de busca baseado no comprimento e formato
    if (/^\d{11}$/.test(query)) {
      // CPF (11 dígitos)
      try {
        const participante = await this.findByCpf(query);
        return [participante];
      } catch {
        return [];
      }
    } else if (/^\d{6}$/.test(query)) {
      // RA (6 dígitos)
      try {
        const participante = await this.findByRa(query);
        return [participante];
      } catch {
        return [];
      }
    } else if (/^\d{4}$/.test(query)) {
      // RF (4 dígitos)
      try {
        const participante = await this.findByRf(query);
        return [participante];
      } catch {
        return [];
      }
    } else {
      // Busca por nome (string parcial)
      return this.findByNome(query);
    }
  }

  async searchUnified(query: string): Promise<Participante[]> {
    // Remove espaços da query
    const cleanQuery = query.trim();

    // Se a query está vazia, retorna lista vazia
    if (!cleanQuery) {
      return [];
    }

    // Remove formatação de CPF (pontos e hífen) para comparação
    const numericQuery = cleanQuery.replace(/\D/g, '');

    // Busca em paralelo por todos os campos possíveis
    const searchPromises = [];

    // Se parece com CPF (11 dígitos) - aceita formatado ou não
    if (/^\d{11}$/.test(numericQuery)) {
      searchPromises.push(
        this.prisma.participante.findMany({
          where: { cpf: numericQuery },
          include: { checkins: true },
        }),
      );
    }

    // Se parece com RA (6 dígitos)
    if (/^\d{6}$/.test(numericQuery)) {
      searchPromises.push(
        this.prisma.participante.findMany({
          where: { ra: numericQuery },
          include: { checkins: true },
        }),
      );
    }

    // Se parece com RF (4 dígitos)
    if (/^\d{4}$/.test(numericQuery)) {
      searchPromises.push(
        this.prisma.participante.findMany({
          where: { rf: numericQuery },
          include: { checkins: true },
        }),
      );
    }

    // Busca por nome (sempre incluída se não for apenas números)
    if (!/^\d+$/.test(cleanQuery) || cleanQuery.length < 4) {
      searchPromises.push(
        this.prisma.participante.findMany({
          where: {
            nome: {
              contains: cleanQuery,
            },
          },
          include: { checkins: true },
        }),
      );
    }

    // Executa todas as buscas em paralelo
    const results = await Promise.all(searchPromises);

    // Combina todos os resultados e remove duplicatas
    const allResults = results.flat();
    const uniqueResults = allResults.filter(
      (participante, index, self) =>
        index === self.findIndex((p) => p.id === participante.id),
    );

    return uniqueResults;
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
