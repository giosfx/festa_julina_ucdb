'use client';

import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  title?: string;
  showLogout?: boolean;
}

export default function Header({ title = 'Festa Julina UCDB', showLogout = false }: HeaderProps) {
  const { logout, user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <header className="bg-white shadow-sm border-b border-border sticky top-0 z-50">
      <div className="container">
        <div className="flex justify-between items-center h-16">
          {/* Logo e Título */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white text-lg font-bold">FJ</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                {title}
              </h1>
              {user && (
                <p className="text-xs text-muted-foreground">
                  Usuário: {user.user}
                </p>
              )}
            </div>
          </div>

          {/* Ações do Header */}
          {showLogout && (
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="btn btn-secondary text-sm px-3 py-2"
                aria-label="Fazer logout"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
