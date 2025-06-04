'use client';

import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import { ConfirmationModal } from '../components/Modal';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { participantesService, type Participante } from '../services/participantes.service';
import { ingressosService } from '../services/ingressos.service';
import { APIError } from '../services/api.service';

function DashboardContent() {
  const { user } = useAuth();

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
  const handleSearch = async (query: string, type: 'ra' | 'rf' | 'cpf' | 'nome') => {
    setIsSearching(true);
    setSearchError('');
    setSearchResults([]);

    try {
      const results = await participantesService.buscarParticipantes({
        query,
        type,
      });
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

  return (<div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
    <Header showLogout={true} />

    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Check-in - Festa Julina UCDB
            </h1>            <div className="text-sm text-gray-600 space-y-1">
              <p>Usuário: {user?.username}</p>
              {user?.email && <p>Email: {user.email}</p>}
              <p className="text-xs">Roles: {user?.roles.join(', ') || 'Nenhuma'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Sistema Online</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Buscar Participante
        </h2>
        <SearchBar onSearch={handleSearch} isLoading={isSearching} />

        {searchError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{searchError}</p>
          </div>
        )}
      </div>

      {(searchResults.length > 0 || isSearching) && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Resultados da Busca
          </h3>            <SearchResults
            results={searchResults}
            isLoading={isSearching}
            onComprarIngresso={handleConfirmTicketPurchase}
          />
        </div>
      )}        {showConfirmModal && confirmAction && (
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
        />
      )}
    </div>
  </div>);
}

export default function Dashboard() {
  return (
    <ProtectedRoute requiredRoles={['ADMIN', 'OPERADOR']}>
      <DashboardContent />
    </ProtectedRoute>
  );
}
