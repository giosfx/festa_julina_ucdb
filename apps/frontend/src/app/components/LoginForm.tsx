'use client';

import { useState } from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form';
import LoadingSpinner from './LoadingSpinner';
import { VALIDATION, ERROR_MESSAGES } from '../constants';
import { format } from '../utils';
import type { LoginFormData } from '../types/auth';

interface LoginFormProps {
    onSubmit: () => void;
    register: UseFormRegister<LoginFormData>;
    errors: FieldErrors<LoginFormData>;
    isLoading: boolean;
    isValid: boolean;
    watch: UseFormWatch<LoginFormData>;
}

export default function LoginForm({
    onSubmit,
    register,
    errors,
    isLoading,
    isValid,
    watch
}: LoginFormProps) {
    const [showPassword, setShowPassword] = useState(false);
    const userValue = watch('user');
    const passwordValue = watch('password');

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            {/* Campo Usuário */}
            <div>
                <label
                    htmlFor="user"
                    className="block text-sm font-medium text-foreground mb-2"
                >
                    Usuário (4 dígitos)
                </label>                <input
                    {...register('user', {
                        required: ERROR_MESSAGES.REQUIRED_FIELD,
                        pattern: {
                            value: /^\d{4}$/,
                            message: ERROR_MESSAGES.INVALID_USER
                        },
                        maxLength: {
                            value: VALIDATION.USER_LENGTH,
                            message: ERROR_MESSAGES.INVALID_USER
                        }
                    })}
                    type="text"
                    id="user"
                    placeholder="0000"
                    maxLength={VALIDATION.USER_LENGTH}
                    className={`input focus-ring ${errors.user ? 'border-error' : ''}`}
                    disabled={isLoading}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="username"
                    onChange={(e) => {
                        const formatted = format.formatUserInput(e.target.value);
                        e.target.value = formatted;
                    }}
                />
                {errors.user && (
                    <p className="mt-1 text-sm text-error">{errors.user.message}</p>
                )}
                <div className="mt-1 text-xs text-muted-foreground">
                    {userValue ? `${userValue.length}/4 dígitos` : '0/4 dígitos'}
                </div>
            </div>

            {/* Campo Senha */}
            <div>
                <label
                    htmlFor="password"
                    className="block text-sm font-medium text-foreground mb-2"
                >
                    Senha
                </label>
                <div className="relative">                    <input
                    {...register('password', {
                        required: ERROR_MESSAGES.REQUIRED_FIELD,
                        minLength: {
                            value: VALIDATION.PASSWORD_MIN_LENGTH,
                            message: ERROR_MESSAGES.PASSWORD_TOO_SHORT
                        }
                    })}
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    placeholder="Digite sua senha"
                    className={`input focus-ring pr-12 ${errors.password ? 'border-error' : ''}`}
                    disabled={isLoading}
                    autoComplete="current-password"
                />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        disabled={isLoading}
                        aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    >
                        {showPassword ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.05 8.05m1.878 1.828c-.274-.274-.566-.513-.88-.717M12 3c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21l-6-6m-2-2l-4-4m6 6L9 9" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        )}
                    </button>
                </div>
                {errors.password && (
                    <p className="mt-1 text-sm text-error">{errors.password.message}</p>
                )}                {passwordValue && (
                    <div className="mt-1 text-xs text-muted-foreground">
                        {passwordValue.length >= VALIDATION.PASSWORD_MIN_LENGTH ? '✓ Senha válida' : `${passwordValue.length}/${VALIDATION.PASSWORD_MIN_LENGTH} caracteres mínimos`}
                    </div>
                )}
            </div>

            {/* Botão de Submit */}
            <button
                type="submit"
                disabled={!isValid || isLoading}
                className="btn btn-primary w-full focus-ring"
            >
                {isLoading ? (
                    <div className="flex items-center justify-center">
                        <LoadingSpinner size="sm" color="white" className="mr-2" />
                        Entrando...
                    </div>
                ) : (
                    'Entrar'
                )}
            </button>

            {/* Link para recuperar senha */}
            <div className="text-center">
                <button
                    type="button"
                    className="text-sm text-primary hover:text-primary-dark transition-colors underline"
                    disabled={isLoading}
                    onClick={() => {
                        // TODO: Implementar recuperação de senha
                        alert('Funcionalidade de recuperação de senha será implementada');
                    }}
                >
                    Esqueceu sua senha?
                </button>
            </div>
        </form>
    );
}
