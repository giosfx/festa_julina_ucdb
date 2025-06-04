import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { IngressosService } from './ingressos.service';
import { CreateIngressoDto, UpdateIngressoDto } from '@repo/shared';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthPayload } from '../auth/auth.service';

@ApiTags('ingressos')
@Controller('ingressos')
export class IngressosController {
  constructor(private readonly ingressosService: IngressosService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo ingresso' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Ingresso criado com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos ou limite excedido',
  })
  create(@Body() createIngressoDto: CreateIngressoDto) {
    return this.ingressosService.create(createIngressoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os ingressos' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Lista de ingressos' })
  findAll() {
    return this.ingressosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar ingresso por ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Ingresso encontrado' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Ingresso não encontrado',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ingressosService.findOne(id);
  }

  @Get('participante/:participanteId')
  @ApiOperation({ summary: 'Buscar ingressos por participante' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ingressos do participante',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Participante não encontrado',
  })
  findByParticipante(
    @Param('participanteId', ParseIntPipe) participanteId: number,
  ) {
    return this.ingressosService.findByParticipante(participanteId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar ingresso' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ingresso atualizado com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Ingresso não encontrado',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos ou limite excedido',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateIngressoDto: UpdateIngressoDto,
  ) {
    return this.ingressosService.update(id, updateIngressoDto);
  }

  @Patch(':id/checkin')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Realizar check-in do ingresso (requer autenticação)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Check-in realizado com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Ingresso não encontrado',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Check-in já foi realizado',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token inválido ou não fornecido',
  })
  realizarCheckin(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthPayload,
  ) {
    // Usar o username do usuário autenticado como funcionário
    return this.ingressosService.realizarCheckin(id, user.username);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover ingresso' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ingresso removido com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Ingresso não encontrado',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ingressosService.remove(id);
  }
}
