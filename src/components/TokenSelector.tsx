import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useTokenStore } from '../store/useTokenStore';
import { formatNumber } from '../lib/quoteCalculator';

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
    onClick: () => void;
    disabled?: boolean;
}

const TokenSelector = ({ selectedToken, onClick, disabled = false }: TokenSelectorProps) => {
    const { userTokens } = useTokenStore();
    const balance = userTokens.find(t => t.address === selectedToken?.address)?.balance;

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button
                    onClick={() => !disabled && onClick()}
                    disabled={disabled}
                    className={`flex items-center bg-white rounded-full px-2 sm:px-3 py-2 gap-1 sm:gap-2 shadow-md font-semibold text-black border border-gray-200 transition-all duration-200 ${disabled
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-gray-50 hover:shadow-lg cursor-pointer'
                        }`}
                >
                    {selectedToken ? (
                        <>
                            <span
                                className="w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: selectedToken.color }}
                            >
                                <img
                                    src={selectedToken.logoURI}
                                    alt={selectedToken.symbol}
                                    className="w-4 h-4 md:w-5 md:h-5 rounded-full"
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
                            </span>
                            <div className="flex flex-col items-start">
                                <span className="text-xs sm:text-sm md:text-base">{selectedToken.symbol}</span>
                                {balance && (
                                    <span className="text-xs text-gray-500">
                                        {formatNumber(balance, 4)}
                                    </span>
                                )}
                            </div>
                        </>
                    ) : (
                        <span className="text-xs sm:text-sm md:text-base">Select token</span>
                    )}
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </DropdownMenu.Trigger>
        </DropdownMenu.Root>
    );
};

export default TokenSelector;
