'use client';

import { useState } from 'react';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import { ConfirmationModal } from '../components/Modal';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { participantesService, type Participante } from '../services/participantes.service';
import { ingressosService } from '../services/ingressos.service';
import { APIError } from '../services/api.service';

function DashboardContent() {
  // Estados da busca
  const [searchResults, setSearchResults] = useState<Participante[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string>('');

  // Estados do modal de confirmação
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    participanteId: string;
    participanteNome: string;
    quantidade: number;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Função de busca integrada com o backend
  const handleSearch = async (query: string) => {
    setIsSearching(true);
    setSearchError('');
    setSearchResults([]);

    try {
      const results = await participantesService.buscarParticipantes(query);
      setSearchResults(results);
    } catch (error) {
      if (error instanceof APIError) {
        setSearchError(error.message);
      } else {
        setSearchError('Erro ao buscar participantes. Tente novamente.');
      }
      console.error('Erro na busca:', error);
    } finally {
      setIsSearching(false);
    }
  };
  // Função para confirmar compra de ingresso
  const handleConfirmTicketPurchase = async (participanteId: string, quantidade: number) => {
    const participante = searchResults.find(p => p.id === participanteId);
    if (!participante) return;

    setConfirmAction({
      participanteId,
      participanteNome: participante.nome,
      quantidade
    });
    setShowConfirmModal(true);
  };

  // Função para processar a compra de ingresso usando o backend
  const handleProcessTicketPurchase = async () => {
    if (!confirmAction) return;

    setIsProcessing(true);

    try {
      await ingressosService.comprarIngresso({
        participanteId: confirmAction.participanteId,
        quantidade: confirmAction.quantidade,
      });

      // Atualizar o estado local
      setSearchResults(prev =>
        prev.map(p =>
          p.id === confirmAction.participanteId
            ? { ...p, ingressosComprados: p.ingressosComprados + confirmAction.quantidade }
            : p
        )
      );

      setShowConfirmModal(false);
      setConfirmAction(null);
      alert(`Ingresso(s) registrado(s) com sucesso para ${confirmAction.participanteNome}!`);
    } catch (error) {
      console.error('Erro ao processar compra:', error);
      if (error instanceof APIError) {
        alert(`Erro ao registrar ingresso: ${error.message}`);
      } else {
        alert('Erro ao registrar ingresso. Tente novamente.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (<div className="min-h-screen bg-gray-50">
    <Header showLogout={true} />

    <main className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Status do Sistema Badge */}
      <div className="flex justify-end mb-6">
        <div className="flex items-center space-x-2 text-sm bg-green-50 px-4 py-2 rounded-xl border border-green-200 shadow-sm">
          <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-700 font-medium">Sistema Online</span>
        </div>
      </div>

      {/* Search Section com melhor espaçamento */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            Buscar Participante
          </h2>
          <p className="text-gray-600 ml-14 mb-2">
            Digite o RA, RF, CPF ou nome do participante para buscar
          </p>
        </div>
        <div className="px-4">
          <SearchBar onSearch={handleSearch} isLoading={isSearching} />
        </div>

        {searchError && (
          <div className="mt-8 p-5 bg-red-50 border border-red-200 rounded-xl mx-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-red-700 text-sm font-medium">{searchError}</p>
            </div>
          </div>
        )}
      </div>

      {/* Results Section */}
      {(searchResults.length > 0 || isSearching) && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            Resultados da Busca
          </h3>
          <SearchResults
            results={searchResults}
            isLoading={isSearching}
            onComprarIngresso={handleConfirmTicketPurchase}
          />
        </div>
      )}

      {/* Modal de Confirmação */}
      {showConfirmModal && confirmAction && (
        <ConfirmationModal
          isOpen={true}
          title="Confirmar Compra de Ingresso"
          message={`Confirma a compra de ${confirmAction.quantidade} ingresso(s) para ${confirmAction.participanteNome}?`}
          onConfirm={handleProcessTicketPurchase}
          onClose={() => {
            setShowConfirmModal(false);
            setConfirmAction(null);
          }}
          isLoading={isProcessing}
          confirmText="Confirmar Compra"
          cancelText="Cancelar"
          type="info"
        />
      )}
    </main>
  </div>);
}

export default function Dashboard() {
  return (
    <ProtectedRoute requiredRoles={['ADMIN', 'OPERADOR']}>
      <DashboardContent />
    </ProtectedRoute>
  );
}
