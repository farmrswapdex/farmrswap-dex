import * as Tabs from '@radix-ui/react-tabs';
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { ArrowDown, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAccount, useWriteContract } from 'wagmi';
import { parseUnits } from 'viem';
import { RouterContract } from '../lib/config';
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
    const { address, isConnected } = useAccount();
    const { writeContractAsync, error } = useWriteContract();

    // Common state for both forms
    const [fromToken, setFromToken] = useState<Token | null>(TOKENS.BLOCX);
    const [toToken, setToToken] = useState<Token | null>(TOKENS.FARMR);
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

    // Handle body scroll when modal is open
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        // Cleanup on unmount
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isModalOpen]);

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

    useEffect(() => {
        if (error) {
            toast.error(error.name);
        }
    }, [error])

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

    const handleSwap = async () => {
        if (!fromToken || !toToken || !fromAmount || !quote || !address) {
            return;
        }

        const amountIn = parseUnits(fromAmount, fromToken.decimals);
        // Slippage of 0.5%
        const amountOutMin = parseUnits(
            (parseFloat(quote.outputAmount) * 0.995).toFixed(toToken.decimals),
            toToken.decimals
        );

        const promise = writeContractAsync({
            address: RouterContract.address,
            abi: RouterContract.abi,
            functionName: 'swapExactTokensForTokens',
            args: [
                amountIn,
                amountOutMin,
                [fromToken.address as `0x${string}`, toToken.address as `0x${string}`],
                address,
                BigInt(Math.floor(Date.now() / 1000) + 60 * 20), // 20 minute deadline
            ],
        });

        toast.promise(promise, {
            loading: 'Submitting transaction...',
            success: 'Swap successful!',
            error: 'Swap failed.',
        });
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
                <Tabs.Root
                    value={activeTab}
                    onValueChange={(value) => setActiveTab(value as 'swap' | 'limit')}
                    className="w-max flex flex-col"
                >
                    <div className="backdrop-blur-lg rounded-md shadow-lg p-0 flex flex-col items-center w-[700px] pb-3">
                        <Tabs.List className="flex items-center gap-6 mb-2 w-full px-8 pt-8">
                            <Tabs.Trigger
                                value="swap"
                                className="text-3xl font-bold cursor-pointer transition-colors data-[state=active]:text-black data-[state=inactive]:text-gray-300 hover:text-black focus:outline-none"
                            >
                                Swap
                            </Tabs.Trigger>
                            <Tabs.Trigger
                                value="limit"
                                className="text-3xl font-bold cursor-pointer transition-colors data-[state=active]:text-black data-[state=inactive]:text-gray-300 hover:text-black focus:outline-none"
                            >
                                Limit
                            </Tabs.Trigger>
                            <span className="ml-auto text-2xl text-gray-400 cursor-pointer hover:text-gray-600 transition-colors">
                                <Settings />
                            </span>
                        </Tabs.List>

                        <Tabs.Content value="swap">
                            <div className="w-full p-4 flex flex-col gap-2">
                                <div className="relative">
                                    <div className="flex flex-col gap-2 w-[580px]">
                                        <div className="bg-white bg-opacity-50 backdrop-blur-sm rounded-2xl p-4 flex flex-col gap-1">
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
                                        <div className="bg-white bg-opacity-50 backdrop-blur-sm rounded-2xl p-4 flex flex-col gap-1">
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
                                    </div>
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                                        <button
                                            onClick={handleSwapTokens}
                                            disabled={amountsSwapped || !fromToken || !toToken}
                                            className="bg-white rounded-full p-2 shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ArrowDown className="w-5 h-5 text-gray-400" />
                                        </button>
                                    </div>
                                </div>

                                {quote && (
                                    <div className="mt-2 p-4 bg-white bg-opacity-50 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm">
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
                        </Tabs.Content>
                        <Tabs.Content value="limit">
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
                        </Tabs.Content>
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
                </Tabs.Root>
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
