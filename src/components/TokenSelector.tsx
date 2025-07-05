import { useState, useRef, useEffect } from 'react';
import { TOKEN_LIST } from '../lib/constants';

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
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const filteredTokens = TOKEN_LIST.filter(token =>
        token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleTokenSelect = (token: Token) => {
        onTokenSelect(token);
        setIsOpen(false);
        setSearchTerm('');
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={`flex items-center bg-white rounded-full px-4 py-2 gap-2 shadow-md font-semibold text-black border border-gray-200 transition-all duration-200 ${disabled
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
                                        target.nextElementSibling?.classList.remove('hidden');
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

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg border border-gray-200 z-50 max-h-80 overflow-hidden">
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
                    <div className="max-h-60 overflow-y-auto">
                        {filteredTokens.map((token) => (
                            <button
                                key={token.address}
                                onClick={() => handleTokenSelect(token)}
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
                                                target.nextElementSibling?.classList.remove('hidden');
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
            )}
        </div>
    );
};

export default TokenSelector; 