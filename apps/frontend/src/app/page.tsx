'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import LoginForm from './components/LoginForm';
import type { LoginFormData } from './types/auth';

export default function LoginPage() {
  const { login, error, isLoading, isAuthenticated, user } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch
  } = useForm<LoginFormData>({
    mode: 'onChange',
    defaultValues: {
      user: '',
      password: ''
    }
  });

  // Redirecionar para dashboard se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated && user) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, user, router]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      // O redirecionamento é feito pelo useEffect acima
    } catch (err) {
      // Error é tratado pelo hook useAuth
      console.error('Erro no login:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="min-h-screen flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md mx-auto">
          {/* Material Design Card with elevation */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Header Section with improved spacing */}
            <div className="px-6 pt-8 pb-6 text-center bg-gradient-to-b from-primary/5 to-transparent">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-white text-3xl font-bold">FJ</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">
                Festa Julina UCDB
              </h1>
              <p className="text-gray-600 text-sm leading-relaxed">
                Faça login para acessar o sistema
              </p>
            </div>

            {/* Form Section with proper padding */}
            <div className="px-6 pb-8">
              <LoginForm
                onSubmit={handleSubmit(onSubmit)}
                register={register}
                errors={errors}
                isLoading={isLoading}
                isValid={isValid}
                watch={watch}
              />

              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Section */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center">
                Sistema desenvolvido para a UCDB
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
