'use client';

import { useState, useCallback } from 'react';
import { format } from '../utils';

type SearchType = 'ra' | 'rf' | 'cpf' | 'nome';

interface SearchBarProps {
    onSearch: (query: string, type: SearchType) => void;
    isLoading?: boolean;
}

export default function SearchBar({ onSearch, isLoading = false }: SearchBarProps) {
    const [query, setQuery] = useState('');
    const [searchType, setSearchType] = useState<SearchType>('ra');

    const handleInputChange = useCallback((value: string) => {
        let formattedValue = value;

        // Aplicar formatação baseada no tipo de busca
        switch (searchType) {
            case 'ra':
                formattedValue = format.formatRA(value);
                break;
            case 'rf':
                formattedValue = format.formatRF(value);
                break;
            case 'cpf':
                formattedValue = format.formatCPF(value);
                break;
            case 'nome':
                formattedValue = value; // Sem formatação para nome
                break;
        }

        setQuery(formattedValue);
    }, [searchType]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query.trim(), searchType);
        }
    };

    const getPlaceholder = () => {
        switch (searchType) {
            case 'ra':
                return '000000 (6 dígitos)';
            case 'rf':
                return '0000 (4 dígitos)';
            case 'cpf':
                return '000.000.000-00';
            case 'nome':
                return 'Digite o nome para buscar';
            default:
                return 'Digite para buscar';
        }
    };

    const getInputMode = () => {
        return ['ra', 'rf', 'cpf'].includes(searchType) ? 'numeric' : 'text';
    };

    const getMaxLength = () => {
        switch (searchType) {
            case 'ra':
                return 6;
            case 'rf':
                return 4;
            case 'cpf':
                return 14; // Com máscaras: 000.000.000-00
            default:
                return undefined;
        }
    };

    return (
        <div className="card">
            <div className="space-y-4">
                {/* Seletor de tipo de busca */}
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Tipo de busca
                    </label>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {[
                            { value: 'ra', label: 'RA (6 dígitos)' },
                            { value: 'rf', label: 'RF (4 dígitos)' },
                            { value: 'cpf', label: 'CPF' },
                            { value: 'nome', label: 'Nome' },
                        ].map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    setSearchType(option.value as SearchType);
                                    setQuery(''); // Limpar query ao trocar tipo
                                }}
                                className={`btn text-xs px-3 py-2 ${searchType === option.value
                                    ? 'btn-primary'
                                    : 'bg-muted text-muted-foreground border-border hover:bg-muted/80'
                                    }`}
                                disabled={isLoading}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Campo de busca */}
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label htmlFor="search-input" className="block text-sm font-medium text-foreground mb-2">
                            {searchType === 'nome' ? 'Nome do participante' : `${searchType.toUpperCase()}`}
                        </label>
                        <div className="flex space-x-2">
                            <input
                                id="search-input"
                                type="text"
                                value={query}
                                onChange={(e) => handleInputChange(e.target.value)}
                                placeholder={getPlaceholder()}
                                className="input flex-1 focus-ring"
                                disabled={isLoading}
                                inputMode={getInputMode()}
                                maxLength={getMaxLength()}
                                autoComplete="off"
                            />
                            <button
                                type="submit"
                                disabled={!query.trim() || isLoading}
                                className="btn btn-primary px-6 focus-ring"
                            >
                                {isLoading ? (
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
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
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                )}
                                <span className="sr-only">Buscar</span>
                            </button>
                        </div>
                    </div>

                    {/* Dicas de validação */}
                    <div className="text-xs text-muted-foreground">
                        {searchType === 'ra' && query && (
                            <p>{query.length}/6 dígitos {query.length === 6 ? '✓' : ''}</p>
                        )}
                        {searchType === 'rf' && query && (
                            <p>{query.length}/4 dígitos {query.length === 4 ? '✓' : ''}</p>
                        )}
                        {searchType === 'cpf' && query && (
                            <p>{format.validateCPF(query) ? '✓ CPF válido' : 'CPF inválido'}</p>
                        )}
                        {searchType === 'nome' && query && (
                            <p>{query.length >= 2 ? '✓ Busca por nome' : 'Digite pelo menos 2 caracteres'}</p>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
