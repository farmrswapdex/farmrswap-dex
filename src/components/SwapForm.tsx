import { useConnectModal } from "@rainbow-me/rainbowkit";
import { Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { TOKENS } from '../lib/constants';
import debounce from '../lib/debounce';
import { calculateQuote, formatNumber, parseAmount } from '../lib/quoteCalculator';
import TokenSelector from './TokenSelector';
import LimitOrderForm from './LimitOrderForm'; // Import the LimitOrderForm

interface Token {
    symbol: string;
    name: string;
    address: string;
    decimals: number;
    logoURI: string;
    color: string;
}

const SwapForm = () => {
    const { openConnectModal } = useConnectModal();
    const { isConnected } = useAccount();

    const [fromToken, setFromToken] = useState<Token | null>(TOKENS.BLOCKX);
    const [toToken, setToToken] = useState<Token | null>(null);
    const [fromAmount, setFromAmount] = useState('');
    const [toAmount, setToAmount] = useState('');
    const [quote, setQuote] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);
    const [activeTab, setActiveTab] = useState<'swap' | 'limit'>('swap'); // New state for active tab

    // Debounced quote calculation
    const debouncedQuoteCalculation = debounce(async (fromToken: Token, toToken: Token, amount: string) => {
        if (!fromToken || !toToken || !amount || parseFloat(amount) <= 0) {
            setQuote(null);
            return;
        }

        setIsLoading(true);
        try {
            const result = await calculateQuote({
                fromToken: fromToken.symbol,
                toToken: toToken.symbol,
                amount
            });
            setQuote(result);
        } catch (error) {
            console.error('Error calculating quote:', error);
            setQuote(null);
        } finally {
            setIsLoading(false);
        }
    }, 500);

    // Calculate quote when inputs change
    useEffect(() => {
        if (activeTab === 'swap' && fromToken && toToken && fromAmount) {
            debouncedQuoteCalculation(fromToken, toToken, fromAmount);
        } else {
            setQuote(null);
        }
    }, [fromToken, toToken, fromAmount, activeTab]);

    // Update to amount when quote changes
    useEffect(() => {
        if (quote && !isFlipped) {
            setToAmount(quote.outputAmount);
        }
    }, [quote, isFlipped]);

    const handleFromAmountChange = (value: string) => {
        const parsed = parseAmount(value, fromToken?.decimals || 18);
        setFromAmount(parsed);
        setIsFlipped(false);
    };

    const handleToAmountChange = (value: string) => {
        const parsed = parseAmount(value, toToken?.decimals || 18);
        setToAmount(parsed);
        setIsFlipped(true);
    };

    const handleTokenSelect = (token: Token, isFromToken: boolean) => {
        if (isFromToken) {
            setFromToken(token);
            if (toToken?.symbol === token.symbol) {
                setToToken(fromToken);
            }
        } else {
            setToToken(token);
            if (fromToken?.symbol === token.symbol) {
                setFromToken(toToken);
            }
        }
    };

    const handleSwapTokens = () => {
        if (fromToken && toToken) {
            setFromToken(toToken);
            setToToken(fromToken);
            setFromAmount(toAmount);
            setToAmount(fromAmount);
            setIsFlipped(false);
        }
    };

    const handleSwap = () => {
        if (!isConnected) {
            openConnectModal?.();
            return;
        }

        // TODO: Implement actual swap logic
        console.log('Swapping:', {
            fromToken,
            toToken,
            fromAmount,
            toAmount,
            quote
        });
    };

    const canSwap = fromToken && toToken && fromAmount && toAmount && quote && !isLoading;

    // Placeholder for dollar equivalent - needs actual price oracle integration
    const fromAmountInUsd = fromAmount ? (parseFloat(fromAmount) * 0.001).toFixed(2) : '0.00'; // Example: 1 VIC = $0.001
    const toAmountInUsd = toAmount ? (parseFloat(toAmount) * 0.001).toFixed(2) : '0.00'; // Example: 1 TOKEN = $0.001

    return (
        <div className="w-max bg-[#f6f6f6] backdrop-blur-sm rounded-3xl shadow-lg p-0 flex flex-col items-center">
            {/* Tabs */}
            <div className="flex items-center gap-6 mb-2 w-full px-8 pt-8">
                <span
                    className={`text-3xl font-bold cursor-pointer transition-colors ${activeTab === 'swap' ? 'text-black' : 'text-gray-300 hover:text-black'}`}
                    onClick={() => setActiveTab('swap')}
                >
                    Swap
                </span>
                <span
                    className={`text-3xl font-bold cursor-pointer transition-colors ${activeTab === 'limit' ? 'text-black' : 'text-gray-300 hover:text-black'}`}
                    onClick={() => setActiveTab('limit')}
                >
                    Limit
                </span>
                <span className="ml-auto text-2xl text-gray-400 cursor-pointer hover:text-gray-600 transition-colors">
                    <Settings />
                </span>
            </div>

            {activeTab === 'swap' ? (
                <div className="w-full bg-[#f6f6f6] rounded-2xl p-0 flex flex-col gap-0">
                    {/* Sell Section */}
                    <div className="flex flex-col gap-1 border-b border-gray-200 px-6 py-4">
                        <span className="text-lg font-semibold text-gray-700 mb-1">Sell</span>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={fromAmount}
                                onChange={(e) => handleFromAmountChange(e.target.value)}
                                placeholder="0.0"
                                className="flex-1 bg-transparent text-2xl font-semibold text-black outline-none placeholder-gray-400"
                            />
                            <TokenSelector
                                selectedToken={fromToken}
                                onTokenSelect={(token) => handleTokenSelect(token, true)}
                            />
                        </div>
                        <span className="text-right text-sm text-gray-400 pr-2">~${fromAmountInUsd}</span>
                    </div>

                    {/* Arrow Divider with Swap Button */}
                    <div className="flex items-center justify-center -my-2">
                        <button
                            onClick={handleSwapTokens}
                            className="bg-white rounded-full p-2 shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200 z-10"
                        >
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                            </svg>
                        </button>
                    </div>

                    {/* Buy Section */}
                    <div className="flex flex-col gap-1 px-6 py-4">
                        <span className="text-lg font-semibold text-gray-700 mb-1">Buy</span>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={toAmount}
                                onChange={(e) => handleToAmountChange(e.target.value)}
                                placeholder="0.0"
                                className="flex-1 bg-transparent text-2xl font-semibold text-black outline-none placeholder-gray-400"
                            />
                            <TokenSelector
                                selectedToken={toToken}
                                onTokenSelect={(token) => handleTokenSelect(token, false)}
                            />
                        </div>
                        <span className="text-right text-sm text-gray-400 pr-2">~${toAmountInUsd}</span>
                    </div>

                    {/* Quote Information */}
                    {quote && (
                        <div className="mx-6 mb-4 mt-2 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-600">Rate</span>
                                <span className="text-sm font-medium">
                                    1 {fromToken?.symbol} = {formatNumber((parseFloat(quote.outputAmount) / parseFloat(quote.inputAmount)).toString(), 6)} {toToken?.symbol}
                                </span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-600">Price Impact</span>
                                <span className="text-sm font-medium">{quote.priceImpact.toFixed(2)}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Fee</span>
                                <span className="text-sm font-medium">{quote.fee}%</span>
                            </div>
                        </div>
                    )}
                    {/* Swap Button */}
                    <button
                        onClick={handleSwap}
                        disabled={!canSwap}
                        className={`w-full mt-8 py-4 rounded-full text-xl font-bold shadow-md transition-all duration-200 ${canSwap
                            ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transform hover:scale-[1.02]'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        {isLoading ? 'Calculating...' : !isConnected ? 'Connect Wallet' : 'Swap'}
                    </button>
                </div>
            ) : (
                <LimitOrderForm />
            )}
        </div>
    );
};

export default SwapForm;
