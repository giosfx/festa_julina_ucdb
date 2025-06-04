import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthPayload } from '../auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = this.extractTokenFromHeader(req);

    if (token) {
      try {
        const payload = await this.jwtService.verifyAsync<AuthPayload>(token, {
          secret: this.configService.get<string>('JWT_SECRET'),
        });

        // Valida formato do usuário (4 dígitos)
        if (!/^\d{4}$/.test(payload.username)) {
          throw new UnauthorizedException('Usuário deve ter 4 dígitos');
        }

        // Adiciona o usuário à requisição
        (req as any).user = payload;
      } catch (error) {
        // Token inválido, mas não bloqueia a requisição
        // Apenas não adiciona o usuário
        console.warn(
          'Token inválido:',
          error instanceof Error ? error.message : 'Erro desconhecido',
        );
      }
    }

    next();
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
