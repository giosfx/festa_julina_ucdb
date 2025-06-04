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
  Request,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ParticipantesService } from './participantes.service';
import { CreateParticipanteDto, UpdateParticipanteDto } from '@repo/shared';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthPayload } from '../auth/auth.service';

@ApiTags('participantes')
@Controller('participantes')
export class ParticipantesController {
  constructor(private readonly participantesService: ParticipantesService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar novo participante (requer autenticação)' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Participante criado com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'CPF já cadastrado',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token inválido ou não fornecido',
  })
  create(
    @Body() createParticipanteDto: CreateParticipanteDto,
    @CurrentUser() user: AuthPayload,
  ) {
    console.log(`Usuário ${user.username} criando novo participante`);
    return this.participantesService.create(createParticipanteDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Listar todos os participantes ou buscar por query (requer autenticação)',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Lista de participantes' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token inválido ou não fornecido',
  })
  findAll(@CurrentUser() user: AuthPayload, @Query('q') query?: string) {
    if (query) {
      console.log(
        `Usuário ${user.username} buscando participantes com query: ${query}`,
      );
      return this.participantesService.searchUnified(query);
    }
    console.log(`Usuário ${user.username} listando participantes`);
    return this.participantesService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar participante por ID (requer autenticação)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Participante encontrado',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Participante não encontrado',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token inválido ou não fornecido',
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthPayload,
  ) {
    console.log(`Usuário ${user.username} buscando participante ${id}`);
    return this.participantesService.findOne(id);
  }

  @Get('cpf/:cpf')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar participante por CPF (requer autenticação)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Participante encontrado',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Participante não encontrado',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token inválido ou não fornecido',
  })
  findByCpf(@Param('cpf') cpf: string, @CurrentUser() user: AuthPayload) {
    console.log(`Usuário ${user.username} buscando participante por CPF`);
    return this.participantesService.findByCpf(cpf);
  }

  @Get('ra/:ra')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar participante por RA (requer autenticação)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Participante encontrado',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Participante não encontrado',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token inválido ou não fornecido',
  })
  findByRa(@Param('ra') ra: string, @CurrentUser() user: AuthPayload) {
    console.log(`Usuário ${user.username} buscando participante por RA`);
    return this.participantesService.findByRa(ra);
  }

  @Get('rf/:rf')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar participante por RF (requer autenticação)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Participante encontrado',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Participante não encontrado',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token inválido ou não fornecido',
  })
  findByRf(@Param('rf') rf: string, @CurrentUser() user: AuthPayload) {
    console.log(`Usuário ${user.username} buscando participante por RF`);
    return this.participantesService.findByRf(rf);
  }

  @Get('nome/:nome')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar participantes por nome (requer autenticação)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de participantes encontrados',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token inválido ou não fornecido',
  })
  findByNome(@Param('nome') nome: string, @CurrentUser() user: AuthPayload) {
    console.log(`Usuário ${user.username} buscando participantes por nome`);
    return this.participantesService.findByNome(nome);
  }

  @Get('search')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Busca unificada por RA, RF, CPF ou nome usando query parameter (requer autenticação)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de participantes encontrados',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token inválido ou não fornecido',
  })
  searchByQuery(
    @Query('query') query: string,
    @CurrentUser() user: AuthPayload,
  ) {
    console.log(
      `Usuário ${user.username} fazendo busca unificada com query: ${query}`,
    );
    return this.participantesService.searchUnified(query);
  }

  @Get('search/:query')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Busca inteligente por RA, RF, CPF ou nome (requer autenticação)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de participantes encontrados',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token inválido ou não fornecido',
  })
  search(@Param('query') query: string, @CurrentUser() user: AuthPayload) {
    console.log(`Usuário ${user.username} fazendo busca inteligente`);
    return this.participantesService.search(query);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar participante (requer autenticação)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Participante atualizado com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Participante não encontrado',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'CPF já cadastrado',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token inválido ou não fornecido',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateParticipanteDto: UpdateParticipanteDto,
    @CurrentUser() user: AuthPayload,
  ) {
    console.log(`Usuário ${user.username} atualizando participante ${id}`);
    return this.participantesService.update(id, updateParticipanteDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover participante (apenas administradores)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Participante removido com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Participante não encontrado',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token inválido ou não fornecido',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Acesso negado - apenas administradores',
  })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthPayload,
  ) {
    console.log(`Admin ${user.username} removendo participante ${id}`);
    return this.participantesService.remove(id);
  }
}
