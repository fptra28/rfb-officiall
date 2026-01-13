import React, { useState, useEffect, useRef } from 'react';

interface ModalPopupProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
    panelClassName?: string;
    watermarkSrc?: string;
    watermarkAlt?: string;
}

export default function ModalPopup({ isOpen, onClose, children, title, panelClassName, watermarkSrc, watermarkAlt }: ModalPopupProps) {
    const [visible, setVisible] = useState(isOpen);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            setVisible(true);
        } else {
            const timeout = setTimeout(() => setVisible(false), 300);
            return () => clearTimeout(timeout);
        }
    }, [isOpen]);

    // Detect click outside modal
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    if (!visible) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-3 transition-opacity duration-300 ${
                isOpen ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={handleOverlayClick}
        >
            <div
                ref={modalRef}
                className={`bg-white rounded-lg shadow-lg w-full p-6 relative transform transition-all duration-300 ${panelClassName ?? 'max-w-md'} ${
                    isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                {watermarkSrc && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden rounded-lg">
                        <img
                            src={watermarkSrc}
                            alt={watermarkAlt ?? ''}
                            className="max-w-[75%] max-h-[75%] opacity-[0.07] select-none"
                        />
                    </div>
                )}
                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-black text-2xl z-10"
                    onClick={onClose}
                >
                    &times;
                </button>
                {title && <h2 className="text-xl font-semibold mb-4 text-center relative z-10">{title}</h2>}
                <div className="text-gray-700 relative z-10">{children}</div>
            </div>
        </div>
    );
}
