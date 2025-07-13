import { TOKEN_LIST } from '../lib/constants';
import { useState } from 'react';

interface Token {
    symbol: string;
    name: string;
    address: string;
    decimals: number;
    logoURI: string;
    color: string;
}

interface TokenModalProps {
    isOpen: boolean;
    onClose: () => void;
    onTokenSelect: (token: Token) => void;
}

// testing testing testing testing

const TokenModal = ({ isOpen, onClose, onTokenSelect }: TokenModalProps) => {
    const [searchTerm, setSearchTerm] = useState('');

    if (!isOpen) return null;

    const filteredTokens = TOKEN_LIST.filter(token =>
        token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleTokenClick = (token: Token) => {
        onTokenSelect(token);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center rounded-3xl" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-200">
                    <input
                        type="text"
                        placeholder="Search tokens..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        autoFocus
                    />
                </div>
                <div className="max-h-96 overflow-y-auto">
                    {filteredTokens.map((token) => (
                        <button
                            key={token.address}
                            onClick={() => handleTokenClick(token)}
                            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                        >
                            <span
                                className="w-8 h-8 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: token.color }}
                            >
                                {token.symbol === 'VIC' ? (
                                    <span className="block w-6 h-6 bg-yellow-400 rounded-full"></span>
                                ) : token.symbol === 'TOMATO' ? (
                                    <span className="text-sm">🍅</span>
                                ) : (
                                    <img
                                        src={token.logoURI}
                                        alt={token.symbol}
                                        className="w-6 h-6 rounded-full"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                            const parent = target.parentElement;
                                            if (parent) {
                                                const textSpan = document.createElement('span');
                                                textSpan.innerText = token.symbol.charAt(0);
                                                parent.appendChild(textSpan);
                                            }
                                        }}
                                    />
                                )}
                            </span>
                            <div className="flex flex-col items-start">
                                <span className="font-semibold text-black">{token.symbol}</span>
                                <span className="text-sm text-gray-500">{token.name}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TokenModal;