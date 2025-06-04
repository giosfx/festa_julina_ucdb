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
  @ApiOperation({ summary: 'Criar novo participante' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Participante criado com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'CPF já cadastrado',
  })
  create(@Body() createParticipanteDto: CreateParticipanteDto) {
    return this.participantesService.create(createParticipanteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os participantes' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Lista de participantes' })
  findAll() {
    return this.participantesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar participante por ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Participante encontrado',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Participante não encontrado',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.participantesService.findOne(id);
  }

  @Get('cpf/:cpf')
  @ApiOperation({ summary: 'Buscar participante por CPF' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Participante encontrado',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Participante não encontrado',
  })
  findByCpf(@Param('cpf') cpf: string) {
    return this.participantesService.findByCpf(cpf);
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
