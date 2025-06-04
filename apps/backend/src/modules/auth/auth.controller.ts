import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guards/roles.guard';
import { AuthPayload } from './auth.service';

export class LoginDto {
  keycloakToken: string;
}

interface RequestWithUser extends Request {
  user: AuthPayload;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.keycloakToken);
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  getProfile(@Request() req: RequestWithUser) {
    return req.user;
  }

  @Get('admin-only')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  adminOnly(@Request() req: RequestWithUser) {
    return {
      message: 'Esta rota é apenas para administradores',
      user: req.user,
    };
  }

  @Get('validate')
  @UseGuards(AuthGuard)
  validateToken(@Request() req: RequestWithUser) {
    return {
      valid: true,
      user: req.user,
    };
  }
}
