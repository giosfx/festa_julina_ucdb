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
            <div className="space-y-2">
                <label
                    htmlFor="user"
                    className="block text-sm font-medium text-gray-700 mb-2"
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
                    className={`w-full px-4 py-3 border rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white ${errors.user ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                        }`}
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
                    <div className="flex items-center mt-2">
                        <svg className="w-4 h-4 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm text-red-600 font-medium">{errors.user.message}</p>
                    </div>
                )}
                <div className="mt-2 flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                        {userValue ? `${userValue.length}/4 dígitos` : '0/4 dígitos'}
                    </span>
                    {userValue && userValue.length === 4 && (
                        <span className="text-xs text-green-600 font-medium flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Válido
                        </span>
                    )}
                </div>
            </div>

            {/* Campo Senha */}
            <div className="space-y-2">
                <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    Senha
                </label>
                <div className="relative">
                    <input
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
                        className={`w-full px-4 py-3 pr-12 border rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                            }`}
                        disabled={isLoading}
                        autoComplete="current-password"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-md hover:bg-gray-100"
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
                    <div className="flex items-center mt-2">
                        <svg className="w-4 h-4 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm text-red-600 font-medium">{errors.password.message}</p>
                    </div>
                )}
                {passwordValue && (
                    <div className="mt-2 flex items-center">
                        {passwordValue.length >= VALIDATION.PASSWORD_MIN_LENGTH ? (
                            <span className="text-xs text-green-600 font-medium flex items-center">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Senha válida
                            </span>
                        ) : (
                            <span className="text-xs text-gray-500">
                                {passwordValue.length}/{VALIDATION.PASSWORD_MIN_LENGTH} caracteres mínimos
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Botão de Submit */}
            <button
                type="submit"
                disabled={!isValid || isLoading}
                className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center min-h-[48px] ${!isValid || isLoading
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-primary to-primary-dark text-white hover:from-primary-dark hover:to-primary-dark shadow-md hover:shadow-lg active:scale-[0.98]'
                    }`}
            >
                {isLoading ? (
                    <div className="flex items-center justify-center">
                        <LoadingSpinner size="sm" color="white" className="mr-2" />
                        <span>Entrando...</span>
                    </div>
                ) : (
                    <span>Entrar</span>
                )}
            </button>

            {/* Link para recuperar senha */}
            <div className="text-center pt-2">
                <button
                    type="button"
                    className="text-sm text-primary hover:text-primary-dark transition-colors font-medium hover:underline"
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
