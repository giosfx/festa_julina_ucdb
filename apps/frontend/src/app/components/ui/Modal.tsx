'use client';

import React, { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({
    isOpen,
    onClose,
    title,
    children,
    maxWidth = 'md',
}: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    // Fechar ao clicar fora do modal
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            // Prevenir scroll no background
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    // Fechar ao pressionar ESC
    useEffect(() => {
        function handleEscKey(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                onClose();
            }
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscKey);
        }

        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [isOpen, onClose]);

    // Não renderizar se o modal estiver fechado
    if (!isOpen) return null;

    // Tamanhos do modal
    const maxWidthClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
    };

    // Renderizar o modal em um portal
    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 transition-opacity">
            <div
                ref={modalRef}
                className={`w-full ${maxWidthClasses[maxWidth]} bg-white rounded-lg shadow-xl overflow-hidden transform transition-all`}
            >
                {title && (
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                    </div>
                )}

                {children}
            </div>
        </div>,
        document.body
    );
}
