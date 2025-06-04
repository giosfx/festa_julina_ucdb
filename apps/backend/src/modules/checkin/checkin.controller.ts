import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { CheckinService } from './checkin.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Check-in')
@Controller('checkins')
export class CheckinController {
  constructor(private readonly checkinService: CheckinService) {}

  @Post(':participanteId')
  @ApiOperation({
    summary: 'Realizar check-in de um participante (requer autenticação)',
  })
  @ApiResponse({ status: 201, description: 'Check-in realizado com sucesso' })
  @ApiResponse({
    status: 400,
    description: 'Participante já realizou o número máximo de check-ins',
  })
  @ApiResponse({ status: 404, description: 'Participante não encontrado' })
  @UseGuards(AuthGuard)
  async realizarCheckin(
    @Param('participanteId', ParseIntPipe) participanteId: number,
    @Request() req: any,
  ) {
    const funcionario =
      req.user.email || req.user.username || 'Usuário do sistema';
    return this.checkinService.realizarCheckin(participanteId, funcionario);
  }

  @Get('participante/:participanteId')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Listar check-ins de um participante (requer autenticação)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de check-ins do participante',
  })
  @ApiResponse({ status: 404, description: 'Participante não encontrado' })
  async findByParticipante(
    @Param('participanteId', ParseIntPipe) participanteId: number,
  ) {
    return this.checkinService.findByParticipante(participanteId);
  }

  @Get('status/:participanteId')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary:
      'Verificar status de check-in de um participante (requer autenticação)',
  })
  @ApiResponse({
    status: 200,
    description: 'Status de check-in do participante',
  })
  @ApiResponse({ status: 404, description: 'Participante não encontrado' })
  async verificarStatusCheckin(
    @Param('participanteId', ParseIntPipe) participanteId: number,
  ) {
    return this.checkinService.verificarStatusCheckin(participanteId);
  }
}
