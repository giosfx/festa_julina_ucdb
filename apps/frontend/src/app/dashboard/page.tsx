'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Dashboard() {
    const { user, logout, isLoading, isAuthenticated } = useAuth();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && !isLoading && !isAuthenticated) {
            router.push('/');
        }
    }, [mounted, isLoading, isAuthenticated, router]);

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    if (!mounted || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <LoadingSpinner />
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-semibold text-foreground">
                                Festa Julina UCDB
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-sm text-gray-600">
                                Olá, <span className="font-medium">{user.name || user.username}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="bg-secondary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-secondary-dark transition-colors"
                            >
                                Sair
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-8">
                    {/* Welcome Section */}
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <h2 className="text-2xl font-bold text-foreground mb-4">
                            Bem-vindo ao Sistema de Gerenciamento
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Sistema para gerenciamento da Festa Julina UCDB 2025
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="bg-primary-light p-4 rounded-lg">
                                <h3 className="font-semibold text-primary mb-2">Seu Perfil</h3>
                                <p className="text-sm text-gray-600">Usuário: {user.username}</p>
                                {user.email && (
                                    <p className="text-sm text-gray-600">Email: {user.email}</p>
                                )}
                                <p className="text-sm text-gray-600">
                                    Roles: {user.roles.join(', ') || 'Nenhuma'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-center w-12 h-12 bg-primary-light rounded-lg mb-4">
                                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                                Ingressos
                            </h3>
                            <p className="text-gray-600 text-sm mb-4">
                                Gerenciar vendas e controle de ingressos
                            </p>
                            <button className="w-full bg-primary text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-primary-dark transition-colors">
                                Acessar
                            </button>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-center w-12 h-12 bg-primary-light rounded-lg mb-4">
                                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                                Participantes
                            </h3>
                            <p className="text-gray-600 text-sm mb-4">
                                Gerenciar cadastro de participantes
                            </p>
                            <button className="w-full bg-primary text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-primary-dark transition-colors">
                                Acessar
                            </button>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-center w-12 h-12 bg-primary-light rounded-lg mb-4">
                                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                                Relatórios
                            </h3>
                            <p className="text-gray-600 text-sm mb-4">
                                Visualizar relatórios e estatísticas
                            </p>
                            <button className="w-full bg-primary text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-primary-dark transition-colors">
                                Acessar
                            </button>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-foreground mb-4">
                            Estatísticas Rápidas
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="text-2xl font-bold text-primary">0</div>
                                <div className="text-sm text-gray-600">Ingressos Vendidos</div>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="text-2xl font-bold text-primary">0</div>
                                <div className="text-sm text-gray-600">Participantes</div>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="text-2xl font-bold text-secondary">R$ 0,00</div>
                                <div className="text-sm text-gray-600">Receita Total</div>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="text-2xl font-bold text-primary">0</div>
                                <div className="text-sm text-gray-600">Eventos Ativos</div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
