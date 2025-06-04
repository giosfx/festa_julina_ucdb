'use client';

import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  showLogout?: boolean;
}

export default function Header({ showLogout = false }: HeaderProps) {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <header className="shadow-sm border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center h-16">
          {/* Apenas Badge do Sistema */}
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white text-lg font-bold">FJ</span>
              </div>
              <div className="hidden sm:flex items-center space-x-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></div>
                  Sistema Online
                </span>
              </div>
            </div>
          </div>

          {/* Ações do Header */}
          {showLogout && (
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="btn-modern bg-gray-100 hover:bg-gray-200 text-gray-700 min-h-[48px] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                aria-label="Fazer logout"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
