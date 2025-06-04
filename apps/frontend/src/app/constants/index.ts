// Cores institucionais
export const COLORS = {
  PRIMARY: '#333399',
  SECONDARY: '#FF3300',
  PRIMARY_DARK: '#262673',
  PRIMARY_LIGHT: '#5050b3',
  SECONDARY_DARK: '#cc2800',
  SECONDARY_LIGHT: '#ff5533',
} as const;

// Configurações da aplicação
export const APP_CONFIG = {
  NAME: 'Festa Julina UCDB',
  SHORT_NAME: 'Festa Julina',
  DESCRIPTION: 'Sistema de gerenciamento da Festa Julina UCDB',
  VERSION: '1.0.0',
  AUTHOR: 'UCDB',
} as const;

// Configurações de validação
export const VALIDATION = {
  USER_LENGTH: 4,
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 128,
} as const;

// Breakpoints responsivos (mobile-first)
export const BREAKPOINTS = {
  XS: '320px', // Mobile pequeno
  SM: '480px', // Mobile grande
  MD: '768px', // Tablet
  LG: '1024px', // Desktop
  XL: '1280px', // Desktop grande
  XXL: '1536px', // Desktop extra grande
} as const;

// Mensagens de erro padrão
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'Este campo é obrigatório',
  INVALID_USER: 'Usuário deve conter exatamente 4 dígitos numéricos',
  PASSWORD_TOO_SHORT: `Senha deve ter pelo menos ${VALIDATION.PASSWORD_MIN_LENGTH} caracteres`,
  LOGIN_FAILED: 'Falha no login. Verifique suas credenciais e tente novamente.',
  NETWORK_ERROR: 'Erro de conexão. Verifique sua internet e tente novamente.',
  SERVER_ERROR: 'Erro interno do servidor. Tente novamente em alguns minutos.',
} as const;

// URLs da API (serão sobrescritas pelas variáveis de ambiente)
export const API_URLS = {
  KEYCLOAK_BASE:
    process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'http://localhost:8080',
  BACKEND_BASE: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
} as const;
