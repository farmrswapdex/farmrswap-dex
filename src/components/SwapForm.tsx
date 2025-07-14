import { useConnectModal } from "@rainbow-me/rainbowkit";
import { Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { TOKENS } from '../lib/constants';
import debounce from '../lib/debounce';
import { calculateQuote, formatNumber, parseAmount } from '../lib/quoteCalculator';
import LimitOrderForm from './LimitOrderForm';
import TokenModal from "./TokenModal";
import TokenSelector from './TokenSelector';

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

    // Common state for both forms
    const [fromToken, setFromToken] = useState<Token | null>(TOKENS.BLOCX);
    const [toToken, setToToken] = useState<Token | null>(null);
    const [fromAmount, setFromAmount] = useState('');
    const [toAmount, setToAmount] = useState('');
    const [activeTab, setActiveTab] = useState<'swap' | 'limit'>('swap');

    // Swap-specific state
    const [quote, setQuote] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);
    const [amountsSwapped, setAmountsSwapped] = useState(false);

    // Limit-order-specific state
    const [limitPrice, setLimitPrice] = useState('');

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectingFor, setSelectingFor] = useState<'from' | 'to' | null>(null);

    // Calculate estimated toAmount for limit order
    useEffect(() => {
        if (activeTab === 'limit' && fromAmount && limitPrice) {
            const amount = parseFloat(fromAmount) * parseFloat(limitPrice);
            setToAmount(isNaN(amount) ? '' : amount.toString());
        } else if (activeTab === 'swap') {
            // Reset toAmount when switching back to swap unless there's a quote
            if (!quote) {
                setToAmount('');
            }
        }
    }, [fromAmount, limitPrice, activeTab, quote]);


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

    useEffect(() => {
        if (activeTab === 'swap' && fromToken && toToken && fromAmount) {
            debouncedQuoteCalculation(fromToken, toToken, fromAmount);
        } else {
            setQuote(null);
        }
    }, [fromToken, toToken, fromAmount, activeTab]);

    useEffect(() => {
        if (quote && !isFlipped) {
            setToAmount(quote.outputAmount);
        }
    }, [quote, isFlipped]);

    const handleFromAmountChange = (value: string) => {
        const parsed = parseAmount(value, fromToken?.decimals || 18);
        setFromAmount(parsed);
        if (activeTab === 'swap') {
            setIsFlipped(false);
            setAmountsSwapped(false);
        }
    };

    const handleToAmountChange = (value: string) => {
        const parsed = parseAmount(value, toToken?.decimals || 18);
        setToAmount(parsed);
        if (activeTab === 'swap') {
            setIsFlipped(true);
            setAmountsSwapped(false);
        }
    };

    const handleLimitPriceChange = (value: string) => {
        setLimitPrice(value);
    };

    const handleTokenSelect = (token: Token, isFromToken: boolean) => {
        setAmountsSwapped(false);
        if (isFromToken) {
            if (toToken?.symbol === token.symbol) {
                const currentFromToken = fromToken;
                setFromToken(toToken);
                setToToken(currentFromToken);
            } else {
                setFromToken(token);
            }
        } else {
            if (fromToken?.symbol === token.symbol) {
                const currentToToken = toToken;
                setToToken(fromToken);
                setFromToken(currentToToken);
            } else {
                setToToken(token);
            }
        }
    };

    const handleSwapTokens = () => {
        if (fromToken && toToken) {
            const newFromToken = toToken;
            const newToToken = fromToken;
            const newFromAmount = toAmount;
            const newToAmount = fromAmount;

            setFromToken(newFromToken);
            setToToken(newToToken);
            setFromAmount(newFromAmount);
            setToAmount(newToAmount);

            setAmountsSwapped(true);

            if (activeTab === 'swap') {
                setIsFlipped(false);
            }
        }
    };

    const handleSwap = () => {
        console.log('Swapping:', { fromToken, toToken, fromAmount, toAmount, quote });
    };

    const handlePlaceLimitOrder = () => {
        console.log('Placing Limit Order:', { fromToken, toToken, fromAmount, limitPrice, toAmount });
    };

    const openModal = (selection: 'from' | 'to') => {
        setSelectingFor(selection);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectingFor(null);
    };

    const handleTokenSelectFromModal = (token: Token) => {
        if (selectingFor === 'from') {
            handleTokenSelect(token, true);
        } else if (selectingFor === 'to') {
            handleTokenSelect(token, false);
        }
        closeModal();
    };

    const canSwap = fromToken && toToken && fromAmount && toAmount && quote && !isLoading;
    const canPlaceOrder = fromToken && toToken && fromAmount && limitPrice && parseFloat(fromAmount) > 0 && parseFloat(limitPrice) > 0;

    const fromAmountInUsd = fromAmount ? (parseFloat(fromAmount) * 0.001).toFixed(2) : '0.00';
    const toAmountInUsd = toAmount ? (parseFloat(toAmount) * 0.001).toFixed(2) : '0.00';

    const getButtonText = () => {
        if (!isConnected) return 'Connect Wallet';
        if (activeTab === 'swap') {
            return isLoading ? 'Calculating...' : 'Swap';
        }
        return 'Place Limit Order';
    };

    const isButtonDisabled = () => {
        if (!isConnected) return false; // Always enabled to connect
        if (activeTab === 'swap') return !canSwap;
        if (activeTab === 'limit') return !canPlaceOrder;
        return true;
    };

    const handleButtonClick = () => {
        if (!isConnected) {
            openConnectModal?.();
            return;
        }
        if (activeTab === 'swap') handleSwap();
        if (activeTab === 'limit') handlePlaceLimitOrder();
    };

    return (
        <>
            <div className="flex flex-col items-center w-full">
                <div className="w-max flex flex-col">
                    <div className="bg-[#f6f6f6] backdrop-blur-sm rounded-md shadow-lg p-0 flex flex-col items-center">
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
                                            onClick={() => openModal('from')}
                                        />
                                    </div>
                                    <span className="text-right text-sm text-gray-400 pr-2">~${fromAmountInUsd}</span>
                                </div>

                                <div className="flex items-center justify-center -my-2">
                                    <button
                                        onClick={handleSwapTokens}
                                        disabled={amountsSwapped || !fromToken || !toToken}
                                        className="bg-white rounded-full p-2 shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200 z-10 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                        </svg>
                                    </button>
                                </div>

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
                                            onClick={() => openModal('to')}
                                        />
                                    </div>
                                    <span className="text-right text-sm text-gray-400 pr-2">~${toAmountInUsd}</span>
                                </div>

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
                            </div>
                        ) : (
                            <LimitOrderForm
                                fromToken={fromToken}
                                toToken={toToken}
                                fromAmount={fromAmount}
                                limitPrice={limitPrice}
                                toAmount={toAmount}
                                handleFromAmountChange={handleFromAmountChange}
                                handleLimitPriceChange={handleLimitPriceChange}
                                onFromTokenSelectClick={() => openModal('from')}
                                onToTokenSelectClick={() => openModal('to')}
                            />
                        )}
                    </div>

                    <button
                        onClick={handleButtonClick}
                        disabled={isButtonDisabled()}
                        className={`w-full mt-6 py-4 rounded-full text-xl font-bold shadow-md transition-all duration-200 ${!isButtonDisabled()
                            ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transform hover:scale-[1.02]'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        {getButtonText()}
                    </button>
                </div>
            </div>
            <TokenModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onTokenSelect={handleTokenSelectFromModal}
            />
        </>
    );
};

export default SwapForm;