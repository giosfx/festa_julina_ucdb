import { Module } from '@nestjs/common';
import { IngressosController } from './ingressos.controller';
import { IngressosService } from './ingressos.service';
import { ParticipantesModule } from '../participantes/participantes.module';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [ParticipantesModule, PrismaModule],
  controllers: [IngressosController],
  providers: [IngressosService],
})
export class IngressosModule {}
