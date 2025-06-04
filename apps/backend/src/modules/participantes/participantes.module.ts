import { Module } from '@nestjs/common';
import { ParticipantesController } from './participantes.controller';
import { ParticipantesService } from './participantes.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ParticipantesController],
  providers: [ParticipantesService],
  exports: [ParticipantesService],
})
export class ParticipantesModule {}
