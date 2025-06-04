'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRoles?: string[];
    redirectTo?: string;
}

export function ProtectedRoute({
    children,
    requiredRoles = [],
    redirectTo = '/'
}: ProtectedRouteProps) {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && !isLoading) {
            if (!isAuthenticated) {
                router.push(redirectTo);
                return;
            }

            // // Verificar roles se especificadas
            // if (requiredRoles.length > 0 && user) {
            //     const hasRequiredRole = requiredRoles.some(role =>
            //         user.roles.includes(role)
            //     );

            //     if (!hasRequiredRole) {
            //         router.push('/unauthorized');
            //         return;
            //     }
            // }
        }
    }, [mounted, isAuthenticated, isLoading, user, requiredRoles, router, redirectTo]);

    // Mostra loading enquanto não montou ou está carregando
    if (!mounted || isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    // Não renderiza nada se não autenticado ou sem permissão ->  || (requiredRoles.length > 0 && user && !requiredRoles.some(role => user.roles.includes(role)))
    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}
