import {
  Controller,
  Get,
  Post,
  UseGuards,
  Body,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthPayload } from '../auth/auth.service';

@ApiTags('test-auth')
@Controller('test-auth')
export class TestAuthController {
  @Get('public')
  @ApiOperation({ summary: 'Rota pública (sem autenticação)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Acesso público permitido',
  })
  publicRoute() {
    return {
      message: 'Esta é uma rota pública - não requer autenticação',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('protected')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Rota protegida (requer autenticação)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuário autenticado com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token inválido ou não fornecido',
  })
  protectedRoute(@CurrentUser() user: AuthPayload) {
    return {
      message: 'Esta é uma rota protegida - requer autenticação',
      user: {
        username: user.username,
        name: user.name,
        email: user.email,
        roles: user.roles,
      },
      timestamp: new Date().toISOString(),
    };
  }

  @Get('admin-only')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Rota apenas para administradores' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Acesso de administrador permitido',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token inválido ou não fornecido',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Usuário não tem permissão de administrador',
  })
  adminOnlyRoute(@CurrentUser() user: AuthPayload) {
    return {
      message: 'Esta rota é apenas para administradores',
      admin: {
        username: user.username,
        name: user.name,
        roles: user.roles,
      },
      timestamp: new Date().toISOString(),
    };
  }

  @Get('user-info')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Informações do usuário logado' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Informações do usuário',
  })
  getUserInfo(@CurrentUser() user: AuthPayload) {
    return {
      userId: user.userId,
      username: user.username,
      name: user.name,
      email: user.email,
      roles: user.roles,
      isAdmin: user.roles.includes('admin'),
      isModerator: user.roles.includes('moderator'),
      hasValidFormat: /^\d{4}$/.test(user.username),
    };
  }

  @Post('validate-format')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Valida formato do usuário (4 dígitos)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Formato validado',
  })
  validateUserFormat(
    @CurrentUser() user: AuthPayload,
    @Body() body: { testUsername?: string },
  ) {
    const usernameToTest = body.testUsername || user.username;
    const isValid = /^\d{4}$/.test(usernameToTest);

    return {
      username: usernameToTest,
      isValid,
      pattern: '^\\d{4}$',
      explanation: 'Username deve ter exatamente 4 dígitos',
      currentUser: user.username,
      currentUserValid: /^\d{4}$/.test(user.username),
    };
  }

  @Post('validate-format-public')
  @ApiOperation({ summary: 'Valida formato do usuário (4 dígitos) - Público' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Formato validado',
  })
  validateUserFormatPublic(@Body() body: { username: string }) {
    const isValid = /^\d{4}$/.test(body.username);

    return {
      username: body.username,
      isValid,
      pattern: '^\\d{4}$',
      explanation: 'Username deve ter exatamente 4 dígitos',
      message: isValid ? 'Formato válido' : 'Formato inválido',
    };
  }
}
