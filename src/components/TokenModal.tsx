import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import { TOKEN_LIST } from '../lib/constants';
import useIsMobile from '../lib/useIsMobile';

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
    const isMobile = useIsMobile();

    const filteredTokens = TOKEN_LIST.filter(token =>
        token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleTokenClick = (token: Token) => {
        onTokenSelect(token);
        onClose();
    };

    const modalClasses = isMobile
        ? "fixed bottom-0 left-0 right-0 bg-[rgb(24,32,53)] rounded-t-2xl shadow-lg w-full max-w-2xl mx-auto z-50 border-t border-x border-[rgba(255,255,255,0.07)] max-h-[95vh] h-[500px] flex flex-col data-[state=open]:animate-slide-up data-[state=closed]:animate-slide-down"
        : "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[rgb(24,32,53)] rounded-2xl shadow-lg w-full max-w-md mx-4 z-50 border border-[rgba(255,255,255,0.07)] max-h-[90vh] flex flex-col";


    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 z-50" />
                <Dialog.Content className={modalClasses}>
                    <Dialog.Title className="sr-only">Select a token</Dialog.Title>
                    <div className="p-4 border-b border-[rgba(255,255,255,0.07)] flex-shrink-0">
                        <input
                            type="text"
                            placeholder="Search tokens"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 bg-[rgb(24,32,53)] text-white placeholder:text-[rgb(152,161,192)] border border-[rgba(255,255,255,0.07)] rounded-full focus:outline-none focus:ring-2 focus:ring-[rgb(40,182,226)] focus:border-[rgb(40,182,226)] transition-colors"
                            autoFocus
                        />
                    </div>
                    <div className="px-4 pt-4 pb-2 flex-shrink-0">
                        <span className="block text-[rgb(152,161,192)] text-xs font-semibold mb-2">Tokens</span>
                    </div>
                    <div className="flex-1 min-h-0 overflow-y-auto px-2 pb-4">
                        {filteredTokens.map((token) => (
                            <button
                                key={token.address}
                                onClick={() => handleTokenClick(token)}
                                className="w-full flex items-center gap-3 py-3 px-2 rounded-xl hover:bg-[rgb(40,182,226)/.08] transition-colors mb-1"
                            >
                                <span
                                    className="w-9 h-9 rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: token.color || 'rgba(255,255,255,0.07)' }}
                                >
                                    <img
                                        src={token.logoURI}
                                        alt={token.symbol}
                                        className="w-7 h-7 rounded-full"
                                    />
                                </span>
                                <div className="flex flex-col items-start">
                                    <span className="font-semibold text-white text-base leading-tight">{token.name}</span>
                                    <span className="text-xs text-[rgb(152,161,192)] leading-tight">{token.symbol}</span>
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
