import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthGuard extends PassportAuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    // Você pode customizar o tratamento de erro aqui
    if (err || !user) {
      throw err || new UnauthorizedException('Token inválido ou expirado');
    }

    // Valida formato do usuário (4 dígitos)
    if (user?.username && !/^\d{4}$/.test(String(user.username))) {
      throw new UnauthorizedException('Usuário deve ter 4 dígitos');
    }

    return user;
  }
}
