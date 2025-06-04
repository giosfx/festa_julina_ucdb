'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services/auth.service';

interface AuthInterceptorProps {
    children: React.ReactNode;
}

export function AuthInterceptor({ children }: AuthInterceptorProps) {
    const router = useRouter();

    useEffect(() => {
        // Interceptar erros de autenticação globalmente
        const originalFetch = window.fetch;

        window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
            const response = await originalFetch(input, init);

            // Se receber 401, tentar refresh token ou fazer logout
            if (response.status === 401) {
                const { refreshToken } = authService.getStoredTokens();

                if (refreshToken) {
                    try {
                        // Tentar renovar o token
                        const newAuth = await authService.refreshToken(refreshToken);
                        authService.saveTokens(newAuth);

                        // Refazer a requisição original com o novo token
                        if (init?.headers) {
                            const headers = new Headers(init.headers);
                            headers.set('Authorization', `Bearer ${newAuth.access_token}`);
                            init.headers = headers;
                        }

                        return originalFetch(input, init);
                    } catch (error) {
                        // Se refresh falhar, fazer logout
                        authService.clearTokens();
                        router.push('/');
                    }
                } else {
                    // Sem refresh token, fazer logout
                    authService.clearTokens();
                    router.push('/');
                }
            }

            return response;
        };

        // Limpar interceptador quando componente for desmontado
        return () => {
            window.fetch = originalFetch;
        };
    }, [router]);

    return <>{children}</>;
}
