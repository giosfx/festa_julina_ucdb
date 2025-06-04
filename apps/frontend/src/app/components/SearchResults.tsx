'use client';

import { useState } from 'react';
import type { Participante } from '../services/participantes.service';

interface ParticipanteCardProps {
    participante: Participante;
    onComprarIngresso: (participanteId: string, quantidade: number) => Promise<void>;
    isLoading?: boolean;
}

function ParticipanteCard({ participante, onComprarIngresso, isLoading = false }: ParticipanteCardProps) {
    const [quantidade, setQuantidade] = useState(1);
    const [comprando, setComprando] = useState(false);

    const handleComprar = async () => {
        if (comprando || isLoading) return;

        setComprando(true);
        try {
            await onComprarIngresso(participante.id, quantidade);
            setQuantidade(1); // Reset quantidade após compra
        } finally {
            setComprando(false);
        }
    };

    const canBuyMore = participante.ingressosComprados < 2;
    const maxQuantidade = Math.min(2 - participante.ingressosComprados, 2);

    return (
        <div className="card">
            <div className="space-y-4">
                {/* Informações do participante */}
                <div>
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="font-semibold text-foreground text-lg">
                                {participante.nome}
                            </h3>
                            <div className="mt-1 space-y-1">
                                <div className="flex items-center space-x-2">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${participante.tipo === 'academico'
                                        ? 'bg-primary/10 text-primary'
                                        : 'bg-secondary/10 text-secondary'
                                        }`}>
                                        {participante.tipo === 'academico' ? 'Acadêmico' : 'Funcionário'}
                                    </span>
                                    {participante.ra && (
                                        <span className="text-sm text-muted-foreground">
                                            RA: {participante.ra}
                                        </span>
                                    )}
                                    {participante.rf && (
                                        <span className="text-sm text-muted-foreground">
                                            RF: {participante.rf}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    CPF: {participante.cpf}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status dos ingressos */}
                <div className="bg-muted/50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">
                            Ingressos já comprados:
                        </span>
                        <span className={`font-bold ${participante.ingressosComprados >= 2 ? 'text-warning' : 'text-success'
                            }`}>
                            {participante.ingressosComprados}/2
                        </span>
                    </div>
                    {participante.ingressosComprados >= 2 && (
                        <p className="text-xs text-warning mt-1">
                            Limite máximo de ingressos atingido
                        </p>
                    )}
                </div>

                {/* Seção de compra */}
                {canBuyMore && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label htmlFor={`quantidade-${participante.id}`} className="text-sm font-medium text-foreground">
                                Quantidade de ingressos:
                            </label>
                            <div className="flex items-center space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                                    disabled={quantidade <= 1 || comprando || isLoading}
                                    className="w-8 h-8 rounded-md bg-muted border border-border flex items-center justify-center hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    -
                                </button>
                                <input
                                    id={`quantidade-${participante.id}`}
                                    type="number"
                                    min="1"
                                    max={maxQuantidade}
                                    value={quantidade}
                                    onChange={(e) => {
                                        const value = parseInt(e.target.value) || 1;
                                        setQuantidade(Math.min(Math.max(1, value), maxQuantidade));
                                    }}
                                    className="w-16 text-center input py-1"
                                    disabled={comprando || isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setQuantidade(Math.min(maxQuantidade, quantidade + 1))}
                                    disabled={quantidade >= maxQuantidade || comprando || isLoading}
                                    className="w-8 h-8 rounded-md bg-muted border border-border flex items-center justify-center hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={handleComprar}
                            disabled={comprando || isLoading}
                            className="btn btn-primary w-full focus-ring"
                        >
                            {comprando ? (
                                <div className="flex items-center justify-center">
                                    <svg className="w-4 h-4 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    Registrando...
                                </div>
                            ) : (
                                `Registrar ${quantidade} ingresso${quantidade > 1 ? 's' : ''}`
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

interface SearchResultsProps {
    results: Participante[];
    isLoading?: boolean;
    error?: string;
    onComprarIngresso: (participanteId: string, quantidade: number) => Promise<void>;
}

export default function SearchResults({
    results,
    isLoading = false,
    error,
    onComprarIngresso
}: SearchResultsProps) {
    if (error) {
        return (
            <div className="card">
                <div className="text-center py-6">
                    <div className="w-12 h-12 mx-auto mb-4 bg-error/10 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2">Erro na busca</h3>
                    <p className="text-sm text-error">{error}</p>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="card animate-pulse">
                        <div className="space-y-3">
                            <div className="h-4 bg-muted rounded w-3/4"></div>
                            <div className="h-3 bg-muted rounded w-1/2"></div>
                            <div className="h-3 bg-muted rounded w-2/3"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (results.length === 0) {
        return (
            <div className="card">
                <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2">
                        Nenhum resultado encontrado
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Tente refinar sua busca ou verificar os dados informados.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">
                    {results.length} resultado{results.length > 1 ? 's' : ''} encontrado{results.length > 1 ? 's' : ''}
                </h2>
            </div>

            {results.map((participante) => (
                <ParticipanteCard
                    key={participante.id}
                    participante={participante}
                    onComprarIngresso={onComprarIngresso}
                    isLoading={isLoading}
                />
            ))}
        </div>
    );
}
