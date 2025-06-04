import { VALIDATION, ERROR_MESSAGES } from '../constants';

// Utilitários de validação
export const validation = {
  /**
   * Valida se o usuário tem exatamente 4 dígitos numéricos
   */
  isValidUser: (user: string): boolean => {
    const userRegex = /^\d{4}$/;
    return userRegex.test(user);
  },

  /**
   * Valida se a senha atende aos critérios mínimos
   */
  isValidPassword: (password: string): boolean => {
    return password.length >= VALIDATION.PASSWORD_MIN_LENGTH;
  },

  /**
   * Valida se o email tem formato válido
   */
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
};

// Utilitários de formatação
export const format = {
  /**
   * Formata o input do usuário para manter apenas dígitos
   */
  formatUserInput: (input: string): string => {
    return input.replace(/\D/g, '').slice(0, VALIDATION.USER_LENGTH);
  },

  /**
   * Formata nome para primeira letra maiúscula
   */
  formatName: (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  },

  /**
   * Formata data para formato brasileiro
   */
  formatDate: (date: Date): string => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  },

  /**
   * Formata hora para formato brasileiro
   */
  formatTime: (date: Date): string => {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  },
};

// Utilitários de classe CSS
export const cn = (
  ...classes: (string | undefined | null | false)[]
): string => {
  return classes.filter(Boolean).join(' ');
};

// Utilitários de debounce
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Utilitários de localStorage com tratamento de erro
export const storage = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      if (typeof window === 'undefined') return defaultValue || null;
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch {
      return defaultValue || null;
    }
  },

  set: <T>(key: string, value: T): boolean => {
    try {
      if (typeof window === 'undefined') return false;
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  remove: (key: string): boolean => {
    try {
      if (typeof window === 'undefined') return false;
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },

  clear: (): boolean => {
    try {
      if (typeof window === 'undefined') return false;
      localStorage.clear();
      return true;
    } catch {
      return false;
    }
  },
};

// Utilitário para detectar dispositivo móvel
export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
};

// Utilitário para detectar se está online
export const isOnline = (): boolean => {
  if (typeof navigator === 'undefined') return true;
  return navigator.onLine;
};
