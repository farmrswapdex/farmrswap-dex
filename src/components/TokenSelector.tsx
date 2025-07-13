import { useState } from 'react';
import TokenModal from './TokenModal';

interface Token {
    symbol: string;
    name: string;
    address: string;
    decimals: number;
    logoURI: string;
    color: string;
}

interface TokenSelectorProps {
    selectedToken: Token | null;
    onTokenSelect: (token: Token) => void;
    disabled?: boolean;
}

const TokenSelector = ({ selectedToken, onTokenSelect, disabled = false }: TokenSelectorProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleTokenSelect = (token: Token) => {
        onTokenSelect(token);
        setIsModalOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => !disabled && setIsModalOpen(true)}
                disabled={disabled}
                className={`flex items-center bg-white rounded-full px-4 py-2 gap-2 shadow-md font-semibold text-black border border-gray-200 transition-all duration-200 ${
                    disabled
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-gray-50 hover:shadow-lg cursor-pointer'
                }`}
            >
                {selectedToken ? (
                    <>
                        <span
                            className="w-7 h-7 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: selectedToken.color }}
                        >
                            {selectedToken.symbol === 'VIC' ? (
                                <span className="block w-5 h-5 bg-yellow-400 rounded-full"></span>
                            ) : selectedToken.symbol === 'TOMATO' ? (
                                <span className="text-sm">🍅</span>
                            ) : (
                                <img
                                    src={selectedToken.logoURI}
                                    alt={selectedToken.symbol}
                                    className="w-5 h-5 rounded-full"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        const parent = target.parentElement;
                                        if (parent) {
                                            const textSpan = document.createElement('span');
                                            textSpan.innerText = selectedToken.symbol.charAt(0);
                                            parent.appendChild(textSpan);
                                        }
                                    }}
                                />
                            )}
                        </span>
                        <span>{selectedToken.symbol}</span>
                    </>
                ) : (
                    <span>Select token</span>
                )}
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <TokenModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onTokenSelect={handleTokenSelect}
            />
        </div>
    );
};

export default TokenSelector; 