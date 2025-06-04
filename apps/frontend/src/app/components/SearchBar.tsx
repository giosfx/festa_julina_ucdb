'use client';

import { useState, useCallback } from 'react';
import { format } from '../utils';

interface SearchBarProps {
    onSearch: (query: string) => void;
    isLoading?: boolean;
}

export default function SearchBar({ onSearch, isLoading = false }: SearchBarProps) {
    const [query, setQuery] = useState('');

    const handleInputChange = useCallback((value: string) => {
        // Tentar aplicar formatação automaticamente baseado no conteúdo
        if (/^\d+$/.test(value)) {
            // Se for somente números
            if (value.length <= 6) {
                // Provavelmente é um RA
                setQuery(format.formatRA(value));
            } else if (value.length <= 11) {
                // Provavelmente é um CPF
                setQuery(format.formatCPF(value));
            } else {
                setQuery(value);
            }
        } else {
            // Texto comum (nome ou outro)
            setQuery(value);
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query.trim());
        }
    };

    return (
        <div className="space-y-6">
            {/* Campo de busca unificado */}
            <form onSubmit={handleSubmit} className="form-group">
                <div>
                    <label htmlFor="search-input" className="block text-sm font-medium text-gray-700 mb-3">
                        Busca unificada
                    </label>
                    <div className="flex gap-4">
                        <div className="flex-1 relative">
                            <input
                                id="search-input"
                                type="text"
                                value={query}
                                onChange={(e) => handleInputChange(e.target.value)}
                                placeholder="Digite RA, RF, CPF ou nome do participante"
                                className={`input-modern w-full min-h-[56px] px-6 py-4 ${isLoading ? 'opacity-50' : ''}`}
                                disabled={isLoading}
                                autoComplete="off"
                            />
                            {/* Indicador de loading no input */}
                            {isLoading && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    <svg className="w-5 h-5 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={!query.trim() || isLoading}
                            className={`btn-modern min-h-[56px] px-8 py-4 rounded-2xl font-medium transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl active:scale-[0.98] ${!query.trim() || isLoading
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                                : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
                                }`}
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <span className="hidden sm:inline">Buscar</span>
                        </button>
                    </div>
                </div>

                {/* Dicas sobre a busca */}
                <div className="text-xs text-gray-600 mt-3 bg-blue-50 p-3 rounded-xl border border-blue-100">
                    <p className="font-medium text-blue-700 mb-1">Dicas de busca:</p>
                    <ul className="list-disc list-inside space-y-1 text-blue-600">
                        <li>RA: 6 dígitos (ex: 123456)</li>
                        <li>RF: 4 dígitos (ex: 1234)</li>
                        <li>CPF: com ou sem pontuação (ex: 123.456.789-00)</li>
                        <li>Nome: digite pelo menos 3 caracteres</li>
                    </ul>
                </div>
            </form>
        </div>
    );
}
