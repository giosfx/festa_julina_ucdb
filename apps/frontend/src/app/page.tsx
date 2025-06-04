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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
      <div className="w-full max-w-md">
        <div className="card">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">FJ</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Festa Julina UCDB
            </h1>
            <p className="text-muted-foreground text-sm">
              Faça login para acessar o sistema
            </p>
          </div>

          <LoginForm
            onSubmit={handleSubmit(onSubmit)}
            register={register}
            errors={errors}
            isLoading={isLoading}
            isValid={isValid}
            watch={watch}
          />

          {error && (
            <div className="mt-4 p-3 bg-error/10 border border-error/20 rounded-md">
              <p className="text-error text-sm text-center">{error}</p>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              Sistema desenvolvido para a UCDB
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
