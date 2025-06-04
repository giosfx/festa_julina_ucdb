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
        <div className="card bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="p-6 space-y-6">
                {/* Informações do participante */}
                <div>
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-lg mb-3">
                                {participante.nome}
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center flex-wrap gap-3">
                                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${participante.tipo === 'academico'
                                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                        : 'bg-green-100 text-green-800 border border-green-200'
                                        }`}>
                                        {participante.tipo === 'academico' ? '🎓 Acadêmico' : '👨‍💼 Funcionário'}
                                    </span>
                                    {participante.ra && (
                                        <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
                                            RA: {participante.ra}
                                        </span>
                                    )}
                                    {participante.rf && (
                                        <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
                                            RF: {participante.rf}
                                        </span>
                                    )}
                                </div>
                                <div className="mt-2">
                                    <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
                                        📄 CPF: {participante.cpf}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status dos ingressos com melhor design */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-2xl border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-900 flex items-center">
                            <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
                                🎫
                            </div>
                            Ingressos comprados:
                        </span>
                        <span className={`font-bold text-xl px-3 py-1 rounded-xl ${participante.ingressosComprados >= 2
                            ? 'text-amber-700 bg-amber-100 border border-amber-200'
                            : 'text-green-700 bg-green-100 border border-green-200'
                            }`}>
                            {participante.ingressosComprados}/2
                        </span>
                    </div>
                    {participante.ingressosComprados >= 2 && (
                        <div className="flex items-center mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                            <svg className="w-5 h-5 text-amber-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <p className="text-sm text-amber-700 font-medium">
                                ⚠️ Limite máximo de ingressos atingido
                            </p>
                        </div>
                    )}
                </div>

                {/* Seção de compra modernizada */}
                {canBuyMore && (
                    <div className="space-y-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <label htmlFor={`quantidade-${participante.id}`} className="text-sm font-medium text-gray-900 flex items-center">
                                <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
                                    💳
                                </div>
                                Quantidade:
                            </label>
                            <div className="flex items-center space-x-3 bg-gray-50 p-2 rounded-xl border border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                                    disabled={quantidade <= 1 || comprando || isLoading}
                                    className="btn-modern w-10 h-10 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    −
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
                                    className="input-modern w-16 text-center py-2 px-3 bg-white"
                                    disabled={comprando || isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setQuantidade(Math.min(maxQuantidade, quantidade + 1))}
                                    disabled={quantidade >= maxQuantidade || comprando || isLoading}
                                    className="btn-modern w-10 h-10 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={handleComprar}
                            disabled={comprando || isLoading}
                            className="btn-modern w-full min-h-[56px] bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-[0.98] focus:ring-2 focus:ring-green-500/20"
                        >
                            {comprando ? (
                                <div className="flex items-center justify-center">
                                    <svg className="w-5 h-5 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
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
                                <>
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Registrar {quantidade} ingresso{quantidade > 1 ? 's' : ''}
                                </>
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
            <div className="bg-white rounded-2xl shadow-xl border border-red-200 overflow-hidden">
                <div className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">❌ Erro na busca</h3>
                    <p className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg border border-red-200">{error}</p>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="card bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-pulse">
                        <div className="p-6 space-y-4">
                            <div className="h-6 bg-gray-200 rounded-lg w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
                            <div className="h-4 bg-gray-200 rounded-lg w-2/3"></div>
                            <div className="h-16 bg-gray-200 rounded-xl w-full"></div>
                            <div className="h-12 bg-gray-200 rounded-xl w-full"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (results.length === 0) {
        return (
            <div className="card bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-8 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                        🔍 Nenhum resultado encontrado
                    </h3>
                    <p className="text-sm text-gray-600 max-w-sm mx-auto leading-relaxed">
                        Tente refinar sua busca ou verificar os dados informados. Certifique-se de que os dados estão corretos.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="card flex items-center justify-between bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    {results.length} resultado{results.length > 1 ? 's' : ''} encontrado{results.length > 1 ? 's' : ''}
                </h2>
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></div>
                    🎫 Sistema Ativo
                </span>
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
