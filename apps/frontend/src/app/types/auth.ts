export interface LoginFormData {
  user: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  roles: string[];
  name?: string;
  email?: string;
}

export interface KeycloakUserInfo {
  sub: string;
  preferred_username: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  email?: string;
  email_verified?: boolean;
  realm_access?: {
    roles: string[];
  };
  resource_access?: {
    [key: string]: {
      roles: string[];
    };
  };
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
  expires_in: number;
}

export interface AuthError {
  message: string;
  code?: string;
  status?: number;
}
