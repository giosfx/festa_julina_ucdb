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
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar novo ingresso (requer autenticação)' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Ingresso criado com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos ou limite excedido',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token inválido ou não fornecido',
  })
  create(
    @Body() createIngressoDto: CreateIngressoDto,
    @CurrentUser() user: AuthPayload,
  ) {
    console.log(`Usuário ${user.username} criando novo ingresso`);
    return this.ingressosService.create(createIngressoDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todos os ingressos (requer autenticação)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Lista de ingressos' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token inválido ou não fornecido',
  })
  findAll(@CurrentUser() user: AuthPayload) {
    console.log(`Usuário ${user.username} listando ingressos`);
    return this.ingressosService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar ingresso por ID (requer autenticação)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Ingresso encontrado' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Ingresso não encontrado',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token inválido ou não fornecido',
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthPayload,
  ) {
    console.log(`Usuário ${user.username} buscando ingresso ${id}`);
    return this.ingressosService.findOne(id);
  }

  @Get('participante/:participanteId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar ingressos por participante (requer autenticação)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ingressos do participante',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Participante não encontrado',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token inválido ou não fornecido',
  })
  findByParticipante(
    @Param('participanteId', ParseIntPipe) participanteId: number,
    @CurrentUser() user: AuthPayload,
  ) {
    console.log(
      `Usuário ${user.username} buscando ingressos do participante ${participanteId}`,
    );
    return this.ingressosService.findByParticipante(participanteId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar ingresso (requer autenticação)' })
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
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token inválido ou não fornecido',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateIngressoDto: UpdateIngressoDto,
    @CurrentUser() user: AuthPayload,
  ) {
    console.log(`Usuário ${user.username} atualizando ingresso ${id}`);
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
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover ingresso (requer autenticação)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ingresso removido com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Ingresso não encontrado',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token inválido ou não fornecido',
  })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthPayload,
  ) {
    console.log(`Usuário ${user.username} removendo ingresso ${id}`);
    return this.ingressosService.remove(id);
  }
}
