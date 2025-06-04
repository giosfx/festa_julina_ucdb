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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ParticipantesService } from './participantes.service';
import { CreateParticipanteDto, UpdateParticipanteDto } from '@repo/shared';

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
  @ApiOperation({ summary: 'Atualizar participante' })
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
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateParticipanteDto: UpdateParticipanteDto,
  ) {
    return this.participantesService.update(id, updateParticipanteDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover participante' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Participante removido com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Participante não encontrado',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.participantesService.remove(id);
  }
}
