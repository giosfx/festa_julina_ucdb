import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { AuthService, KeycloakUser } from '../auth.service';

@Injectable()
export class KeycloakStrategy extends PassportStrategy(Strategy, 'keycloak') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(req: any): Promise<KeycloakUser> {
    const token = this.extractTokenFromHeader(req);

    if (!token) {
      throw new UnauthorizedException('Token não fornecido');
    }

    try {
      const user = await this.authService.validateKeycloakToken(token);

      // Valida formato do usuário
      if (!this.authService.validateUserFormat(user.preferred_username)) {
        throw new UnauthorizedException('Usuário deve ter 4 dígitos');
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException('Token Keycloak inválido');
    }
  }

  private extractTokenFromHeader(req: any): string | undefined {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
