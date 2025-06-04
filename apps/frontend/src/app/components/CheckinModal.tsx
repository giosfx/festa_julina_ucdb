'use client';

import { useState, useEffect } from 'react';
import { Modal, Button } from '../components/ui';
import { useCheckin } from '../hooks/useCheckin';

interface CheckinModalProps {
    isOpen: boolean;
    onClose: () => void;
    participante: {
        id: string;
        nome: string;
        ra?: string;
        rf?: string;
        cpf: string;
    } | null;
}

export function CheckinModal({ isOpen, onClose, participante }: CheckinModalProps) {
    const {
        isLoading,
        error,
        checkinStatus,
        verificarStatusCheckin,
        realizarCheckin,
        clearError
    } = useCheckin();

    const [processando, setProcessando] = useState(false);
    const [mensagemSucesso, setMensagemSucesso] = useState('');

    // Limpar estado quando o modal é fechado
    const handleClose = () => {
        setMensagemSucesso('');
        clearError();
        onClose();
    };

    // Verificar status do participante quando o modal é aberto
    useEffect(() => {
        if (isOpen && participante) {
            verificarStatusCheckin(participante.id);
        }
    }, [isOpen, participante, verificarStatusCheckin]);

    // Realizar check-in
    const handleRealizarCheckin = async () => {
        if (!participante) return;

        setProcessando(true);
        try {
            const sucesso = await realizarCheckin(participante.id);
            if (sucesso) {
                setMensagemSucesso('Check-in realizado com sucesso!');
                // Atualizar status após check-in
                await verificarStatusCheckin(participante.id);
            }
        } finally {
            setProcessando(false);
        }
    };

    // Se o modal não está aberto ou não há participante, não renderiza nada
    if (!isOpen || !participante) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Check-in de Participante"
        >
            <div className="p-6">
                {/* Informações do participante */}
                <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{participante.nome}</h3>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {participante.ra && (
                            <span className="text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded-md">
                                RA: {participante.ra}
                            </span>
                        )}
                        {participante.rf && (
                            <span className="text-sm bg-green-50 text-green-700 px-2 py-1 rounded-md">
                                RF: {participante.rf}
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-600">CPF: {participante.cpf}</p>
                </div>

                {/* Status do check-in */}
                {checkinStatus && (
                    <div className="mb-4 bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h4 className="font-medium text-blue-800 mb-2">Status de Check-in</h4>
                        <div className="text-sm text-blue-700">
                            <p>Total de check-ins realizados: {checkinStatus.totalCheckins} de 2</p>
                            {checkinStatus.checkinsRealizados.length > 0 && (
                                <div className="mt-2">
                                    <p className="font-medium mb-1">Histórico de check-ins:</p>
                                    {checkinStatus.checkinsRealizados.map((checkin, index) => (
                                        <p key={checkin.id} className="text-sm">
                                            {index + 1}º check-in: {new Date(checkin.dataCheckin).toLocaleDateString('pt-BR')} às {new Date(checkin.dataCheckin).toLocaleTimeString('pt-BR')}
                                        </p>
                                    ))}
                                </div>
                            )}
                            <p className="mt-2 font-medium">
                                {checkinStatus.podeRealizarCheckin
                                    ? '✅ Participante pode realizar check-in'
                                    : '❌ Participante já realizou todos os check-ins permitidos'}
                            </p>
                        </div>
                    </div>
                )}

                {/* Mensagem de sucesso */}
                {mensagemSucesso && (
                    <div className="mb-4 bg-green-50 text-green-700 p-3 rounded-lg border border-green-100">
                        {mensagemSucesso}
                    </div>
                )}

                {/* Mensagem de erro */}
                {error && (
                    <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg border border-red-100">
                        {error}
                    </div>
                )}

                {/* Botões de ação */}
                <div className="flex gap-3 mt-6">
                    <Button
                        variant="secondary"
                        onClick={handleClose}
                        className="flex-1"
                    >
                        Fechar
                    </Button>

                    {checkinStatus?.podeRealizarCheckin && (
                        <Button
                            variant="primary"
                            onClick={handleRealizarCheckin}
                            disabled={processando}
                            isLoading={processando}
                            className="flex-1"
                        >
                            Realizar Check-in
                        </Button>
                    )}
                </div>
            </div>
        </Modal>
    );
}
