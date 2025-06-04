import { VALIDATION } from '../constants';

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

  /**
   * Formata RA (6 dígitos numéricos)
   */
  formatRA: (input: string): string => {
    return input.replace(/\D/g, '').slice(0, 6);
  },

  /**
   * Formata RF (4 dígitos numéricos)
   */
  formatRF: (input: string): string => {
    return input.replace(/\D/g, '').slice(0, 4);
  },

  /**
   * Formata CPF com máscara
   */
  formatCPF: (input: string): string => {
    const numbers = input.replace(/\D/g, '').slice(0, 11);
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6)
      return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9)
      return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9)}`;
  },

  /**
   * Valida CPF
   */
  validateCPF: (cpf: string): boolean => {
    const numbers = cpf.replace(/\D/g, '');

    if (numbers.length !== 11) return false;

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(numbers)) return false;

    // Validação do primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(numbers[i]) * (10 - i);
    }
    let digit1 = 11 - (sum % 11);
    if (digit1 >= 10) digit1 = 0;

    if (parseInt(numbers[9]) !== digit1) return false;

    // Validação do segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(numbers[i]) * (11 - i);
    }
    let digit2 = 11 - (sum % 11);
    if (digit2 >= 10) digit2 = 0;

    return parseInt(numbers[10]) === digit2;
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
