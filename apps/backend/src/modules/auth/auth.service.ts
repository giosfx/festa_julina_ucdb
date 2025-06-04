import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

export interface KeycloakUser {
  sub: string;
  preferred_username: string;
  name: string;
  email: string;
  realm_access: {
    roles: string[];
  };
  resource_access?: {
    [key: string]: {
      roles: string[];
    };
  };
}

export interface AuthPayload {
  userId: string;
  username: string;
  email: string;
  name: string;
  roles: string[];
}

@Injectable()
export class AuthService {
  private readonly keycloakUrl: string;
  private readonly realm: string;
  private readonly clientId: string;
  private readonly clientSecret: string;
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.keycloakUrl = this.configService.get<string>('KEYCLOAK_URL') || '';
    this.realm = this.configService.get<string>('KEYCLOAK_REALM') || '';
    this.clientId = this.configService.get<string>('KEYCLOAK_CLIENT_ID') || '';
    this.clientSecret =
      this.configService.get<string>('KEYCLOAK_CLIENT_SECRET') || '';
  }

  async validateKeycloakToken(token: string): Promise<KeycloakUser> {
    try {
      const response = await axios.post(
        `${this.keycloakUrl}/realms/${encodeURIComponent(this.realm)}/protocol/openid-connect/userinfo`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data as KeycloakUser;
    } catch (error) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }

  async introspectToken(token: string): Promise<any> {
    try {
      const response = await axios.post(
        `${this.keycloakUrl}/realms/${encodeURIComponent(this.realm)}/protocol/openid-connect/token/introspect`,
        new URLSearchParams({
          token,
          client_id: this.clientId,
          client_secret: this.clientSecret,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      if (!response.data.active) {
        throw new UnauthorizedException('Token inativo');
      }

      return response.data;
    } catch (error) {
      throw new UnauthorizedException('Erro ao validar token');
    }
  }

  async generateJwtToken(user: KeycloakUser): Promise<string> {
    const payload: AuthPayload = {
      userId: user.sub,
      username: user.preferred_username,
      email: user.email,
      name: user.name,
      roles: user.realm_access?.roles || [],
    };

    return this.jwtService.sign(payload);
  }

  validateUserFormat(username: string): boolean {
    // Valida se o usuário tem 4 dígitos
    const userRegex = /^\d{4}$/;
    return userRegex.test(username);
  }

  async validateUser(keycloakToken: string): Promise<AuthPayload> {
    // Valida o token no Keycloak
    const keycloakUser = await this.validateKeycloakToken(keycloakToken);

    // Valida o formato do usuário (4 dígitos)
    if (!this.validateUserFormat(keycloakUser.preferred_username)) {
      throw new UnauthorizedException('Usuário deve ter 4 dígitos');
    }

    // Retorna os dados do usuário
    return {
      userId: keycloakUser.sub,
      username: keycloakUser.preferred_username,
      email: keycloakUser.email,
      name: keycloakUser.name,
      roles: keycloakUser.realm_access?.roles || [],
    };
  }

  async login(
    keycloakToken: string,
  ): Promise<{ access_token: string; user: AuthPayload }> {
    const user = await this.validateUser(keycloakToken);
    const access_token = await this.generateJwtToken({
      sub: user.userId,
      preferred_username: user.username,
      email: user.email,
      name: user.name,
      realm_access: { roles: user.roles },
    });

    return {
      access_token,
      user,
    };
  }
}
