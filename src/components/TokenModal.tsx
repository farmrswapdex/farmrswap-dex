import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import { TOKEN_LIST } from '../lib/constants';

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

const TokenModal = ({ isOpen, onClose, onTokenSelect }: TokenModalProps) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTokens = TOKEN_LIST.filter(token =>
        token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleTokenClick = (token: Token) => {
        onTokenSelect(token);
        onClose();
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 z-50" />
                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-lg w-full max-w-md mx-4 z-50">
                    <Dialog.Title className="sr-only">Select a token</Dialog.Title>
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
                                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 rounded-full"
                            >
                                <span
                                    className="w-8 h-8 rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: token.color }}
                                >
                                    <img
                                        src={token.logoURI}
                                        alt={token.symbol}
                                        className="w-6 h-6 rounded-full"
                                    />
                                </span>
                                <div className="flex flex-col items-start">
                                    <span className="font-semibold text-black">{token.symbol}</span>
                                    <span className="text-sm text-gray-500">{token.name}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default TokenModal;
