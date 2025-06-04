'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';

export default function UnauthorizedPage() {
    const router = useRouter();
    const { user, logout } = useAuth();

    const handleGoBack = () => {
        router.back();
    };

    const handleGoHome = () => {
        router.push('/dashboard');
    };

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                        className="w-8 h-8 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                    </svg>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Acesso Negado
                </h1>

                <p className="text-gray-600 mb-6">
                    Você não tem permissão para acessar esta página.
                    {user && (
                        <>
                            <br />
                            <span className="text-sm mt-2 block">
                                Usuário: {user.username} | Roles: {user.roles.join(', ') || 'Nenhuma'}
                            </span>
                        </>
                    )}
                </p>

                <div className="space-y-3">
                    <button
                        onClick={handleGoBack}
                        className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Voltar
                    </button>

                    <button
                        onClick={handleGoHome}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Ir para Dashboard
                    </button>

                    <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Fazer Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
