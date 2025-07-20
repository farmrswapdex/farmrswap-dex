import * as Tabs from '@radix-ui/react-tabs';
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { MaxUint256 } from 'ethers';
import { ArrowDown, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { erc20Abi, formatUnits, parseUnits } from 'viem';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { RouterContract, Weth9Contract } from '../lib/config';
import { NATIVE_TOKEN, TOKENS } from '../lib/constants';
import { formatNumber, parseAmount } from '../lib/quoteCalculator';
import LimitOrderForm from './LimitOrderForm';
import SettingsModal from './SettingsModal';
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
    const [fromToken, setFromToken] = useState<Token | null>(NATIVE_TOKEN);
    const [toToken, setToToken] = useState<Token | null>(TOKENS.FARMR);
    const [fromAmount, setFromAmount] = useState('');
    const [toAmount, setToAmount] = useState('');
    const [activeTab, setActiveTab] = useState<'swap' | 'limit'>('swap');

    // Swap-specific state
    const [isFlipped, setIsFlipped] = useState(false);
    const [amountsSwapped, setAmountsSwapped] = useState(false);
    const [needsApproval, setNeedsApproval] = useState(false);
    const [isApproving, setIsApproving] = useState(false);

    // Settings
    const [slippage, setSlippage] = useState(0.5);
    const [deadline, setDeadline] = useState(20);

    // Limit-order-specific state
    const [limitPrice, setLimitPrice] = useState('');

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [selectingFor, setSelectingFor] = useState<'from' | 'to' | null>(null);

    const { data: allowance, refetch: refetchAllowance } = useReadContract({
        abi: erc20Abi,
        address: fromToken?.address as `0x${string}` | undefined,
        functionName: 'allowance',
        args: [address!, RouterContract.address],
        query: {
            enabled: !!address && !!fromToken && fromToken.symbol !== 'ETH',
        },
    });

    const path = [
        fromToken?.symbol === 'ETH' ? Weth9Contract.address : fromToken?.address as `0x${string}`,
        toToken?.symbol === 'ETH' ? Weth9Contract.address : toToken?.address as `0x${string}`
    ].filter(Boolean);

    const { data: amountsOutData, isLoading: isLoadingAmountsOut, error: amountsOutError } = useReadContract({
        address: RouterContract.address,
        abi: RouterContract.abi,
        functionName: 'getAmountsOut',
        args: [
            parseUnits(fromAmount || '0', fromToken?.decimals || 18),
            path as [`0x${string}`, `0x${string}`]
        ],
        query: {
            enabled: !isFlipped && !!fromToken && !!toToken && !!fromAmount && parseFloat(fromAmount) > 0 && path.length === 2,
        }
    });

    const { data: amountsInData, isLoading: isLoadingAmountsIn, error: amountsInError } = useReadContract({
        address: RouterContract.address,
        abi: RouterContract.abi,
        functionName: 'getAmountsIn',
        args: [
            parseUnits(toAmount || '0', toToken?.decimals || 18),
            path as [`0x${string}`, `0x${string}`]
        ],
        query: {
            enabled: isFlipped && !!fromToken && !!toToken && !!toAmount && parseFloat(toAmount) > 0 && path.length === 2,
        }
    });

    const isLoading = isLoadingAmountsOut || isLoadingAmountsIn;

    useEffect(() => {
        if (amountsOutError || amountsInError) {
            console.error("Error fetching amounts:", amountsOutError || amountsInError);
            toast.error("Could not fetch price.");
        }
    }, [amountsOutError, amountsInError]);

    useEffect(() => {
        if (!isFlipped && amountsOutData && toToken) {
            const formattedAmount = formatUnits(amountsOutData[1], toToken.decimals);
            setToAmount(formattedAmount);
        }
    }, [amountsOutData, isFlipped, toToken]);

    useEffect(() => {
        if (isFlipped && amountsInData && fromToken) {
            const formattedAmount = formatUnits(amountsInData[0], fromToken.decimals);
            setFromAmount(formattedAmount);
        }
    }, [amountsInData, isFlipped, fromToken]);


    useEffect(() => {
        if (fromToken && fromToken.symbol !== 'ETH' && fromAmount && allowance !== undefined) {
            const amount = parseUnits(fromAmount, fromToken.decimals);
            setNeedsApproval(allowance < amount);
        } else {
            setNeedsApproval(false);
        }
    }, [fromAmount, fromToken, allowance]);


    // Handle body scroll when modal is open
    useEffect(() => {
        if (isModalOpen || isSettingsModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        // Cleanup on unmount
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isModalOpen, isSettingsModalOpen]);

    // Calculate estimated toAmount for limit order
    useEffect(() => {
        if (activeTab === 'limit' && fromAmount && limitPrice) {
            const amount = parseFloat(fromAmount) * parseFloat(limitPrice);
            setToAmount(isNaN(amount) ? '' : amount.toString());
        } else if (activeTab === 'swap') {
            // Reset toAmount when switching back to swap unless there's a quote
            if (!isLoading && !amountsInData && !amountsOutData) {
                setToAmount('');
            }
        }
    }, [fromAmount, limitPrice, activeTab, isLoading, amountsInData, amountsOutData]);

    useEffect(() => {
        if (error) {
            toast.error(error.name);
        }
    }, [error])

    const handleFromAmountChange = (value: string) => {
        const parsed = parseAmount(value, fromToken?.decimals || 18);
        setFromAmount(parsed);
        if (isFlipped) {
            setToAmount('');
        }
        setIsFlipped(false);
        setAmountsSwapped(false);
    };

    const handleToAmountChange = (value: string) => {
        const parsed = parseAmount(value, toToken?.decimals || 18);
        setToAmount(parsed);
        if (!isFlipped) {
            setFromAmount('');
        }
        setIsFlipped(true);
        setAmountsSwapped(false);
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
            setIsFlipped(false);
        }
    };

    const handleApprove = async () => {
        if (!fromToken || !address) return;

        setIsApproving(true);
        const promise = writeContractAsync({
            address: fromToken.address as `0x${string}`,
            abi: erc20Abi,
            functionName: 'approve',
            args: [RouterContract.address, MaxUint256],
        });

        toast.promise(promise, {
            loading: `Approving ${fromToken.symbol}...`,
            success: () => {
                refetchAllowance();
                setIsApproving(false);
                return 'Approval successful!';
            },
            error: (err) => {
                setIsApproving(false);
                return `Approval failed: ${err.message}`;
            },
        });
    };


    const handleSwap = async () => {
        if (!fromToken || !toToken || !fromAmount || !toAmount || !address) {
            return;
        }

        const deadlineTimestamp = BigInt(Math.floor(Date.now() / 1000) + 60 * deadline);
        const wethAddress = Weth9Contract.address;
        const swapPath = [
            fromToken.symbol === 'ETH' ? wethAddress : fromToken.address,
            toToken.symbol === 'ETH' ? wethAddress : toToken.address
        ].map(a => a as `0x${string}`);

        let value: bigint | undefined = undefined;

        // Type-safe functionName and args
        if (isFlipped) { // Exact output
            const amountOut = parseUnits(toAmount, toToken.decimals);
            const amountInMax = parseUnits((parseFloat(fromAmount) * (1 + slippage / 100)).toFixed(fromToken.decimals), fromToken.decimals);

            if (fromToken.symbol === 'ETH') {
                // swapETHForExactTokens(uint amountOut, address[] path, address to, uint deadline)
                const functionName: 'swapETHForExactTokens' = 'swapETHForExactTokens';
                const args: [bigint, readonly `0x${string}`[], `0x${string}`, bigint] = [
                    amountOut,
                    swapPath,
                    address as `0x${string}`,
                    deadlineTimestamp
                ];
                value = amountInMax;
                const promise = writeContractAsync({
                    address: RouterContract.address,
                    abi: RouterContract.abi,
                    functionName,
                    args,
                    value,
                });
                toast.promise(promise, {
                    loading: 'Submitting transaction...',
                    success: 'Swap successful!',
                    error: 'Swap failed.',
                });
                return;
            } else if (toToken.symbol === 'ETH') {
                // swapTokensForExactETH(uint amountOut, uint amountInMax, address[] path, address to, uint deadline)
                const functionName: 'swapTokensForExactETH' = 'swapTokensForExactETH';
                const args: [bigint, bigint, readonly `0x${string}`[], `0x${string}`, bigint] = [
                    amountOut,
                    amountInMax,
                    swapPath,
                    address as `0x${string}`,
                    deadlineTimestamp
                ];
                const promise = writeContractAsync({
                    address: RouterContract.address,
                    abi: RouterContract.abi,
                    functionName,
                    args,
                });
                toast.promise(promise, {
                    loading: 'Submitting transaction...',
                    success: 'Swap successful!',
                    error: 'Swap failed.',
                });
                return;
            } else {
                // swapTokensForExactTokens(uint amountOut, uint amountInMax, address[] path, address to, uint deadline)
                const functionName: 'swapTokensForExactTokens' = 'swapTokensForExactTokens';
                const args: [bigint, bigint, readonly `0x${string}`[], `0x${string}`, bigint] = [
                    amountOut,
                    amountInMax,
                    swapPath,
                    address as `0x${string}`,
                    deadlineTimestamp
                ];
                const promise = writeContractAsync({
                    address: RouterContract.address,
                    abi: RouterContract.abi,
                    functionName,
                    args,
                });
                toast.promise(promise, {
                    loading: 'Submitting transaction...',
                    success: 'Swap successful!',
                    error: 'Swap failed.',
                });
                return;
            }
        } else { // Exact input
            const amountIn = parseUnits(fromAmount, fromToken.decimals);
            const amountOutMin = parseUnits((parseFloat(toAmount) * (1 - slippage / 100)).toFixed(toToken.decimals), toToken.decimals);

            if (fromToken.symbol === 'ETH') {
                // swapExactETHForTokens(uint amountOutMin, address[] path, address to, uint deadline)
                const functionName: 'swapExactETHForTokens' = 'swapExactETHForTokens';
                const args: [bigint, readonly `0x${string}`[], `0x${string}`, bigint] = [
                    amountOutMin,
                    swapPath,
                    address as `0x${string}`,
                    deadlineTimestamp
                ];
                value = amountIn;
                const promise = writeContractAsync({
                    address: RouterContract.address,
                    abi: RouterContract.abi,
                    functionName,
                    args,
                    value,
                });
                toast.promise(promise, {
                    loading: 'Submitting transaction...',
                    success: 'Swap successful!',
                    error: 'Swap failed.',
                });
                return;
            } else if (toToken.symbol === 'ETH') {
                // swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] path, address to, uint deadline)
                const functionName: 'swapExactTokensForETH' = 'swapExactTokensForETH';
                const args: [bigint, bigint, readonly `0x${string}`[], `0x${string}`, bigint] = [
                    amountIn,
                    amountOutMin,
                    swapPath,
                    address as `0x${string}`,
                    deadlineTimestamp
                ];
                const promise = writeContractAsync({
                    address: RouterContract.address,
                    abi: RouterContract.abi,
                    functionName,
                    args,
                });
                toast.promise(promise, {
                    loading: 'Submitting transaction...',
                    success: 'Swap successful!',
                    error: 'Swap failed.',
                });
                return;
            } else {
                // swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] path, address to, uint deadline)
                const functionName: 'swapExactTokensForTokens' = 'swapExactTokensForTokens';
                const args: [bigint, bigint, readonly `0x${string}`[], `0x${string}`, bigint] = [
                    amountIn,
                    amountOutMin,
                    swapPath,
                    address as `0x${string}`,
                    deadlineTimestamp
                ];
                const promise = writeContractAsync({
                    address: RouterContract.address,
                    abi: RouterContract.abi,
                    functionName,
                    args,
                });
                toast.promise(promise, {
                    loading: 'Submitting transaction...',
                    success: 'Swap successful!',
                    error: 'Swap failed.',
                });
                return;
            }
        }
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

    const canSwap = fromToken && toToken && fromAmount && toAmount && !isLoading;
    const canPlaceOrder = fromToken && toToken && fromAmount && limitPrice && parseFloat(fromAmount) > 0 && parseFloat(limitPrice) > 0;

    const fromAmountInUsd = fromAmount ? (parseFloat(fromAmount) * 0.001).toFixed(2) : '0.00';
    const toAmountInUsd = toAmount ? (parseFloat(toAmount) * 0.001).toFixed(2) : '0.00';

    const getButtonText = () => {
        if (!isConnected) return 'Connect Wallet';
        if (activeTab === 'swap') {
            if (isLoading) return 'Calculating...';
            if (needsApproval) return `Approve ${fromToken?.symbol}`;
            return 'Swap';
        }
        return 'Place Limit Order';
    };

    const isButtonDisabled = () => {
        if (!isConnected) return false; // Always enabled to connect
        if (activeTab === 'swap') {
            if (needsApproval) return isApproving;
            return !canSwap || isApproving;
        }
        if (activeTab === 'limit') return !canPlaceOrder;
        return true;
    };

    const handleButtonClick = () => {
        if (!isConnected) {
            openConnectModal?.();
            return;
        }
        if (activeTab === 'swap') {
            if (needsApproval) {
                handleApprove();
            } else {
                handleSwap();
            }
        }
        if (activeTab === 'limit') handlePlaceLimitOrder();
    };

    const minimumReceived = () => {
        if (!toAmount || isFlipped || isLoading) return null;
        const minReceived = parseFloat(toAmount) * (1 - slippage / 100);
        return formatNumber(minReceived.toString(), 6);
    }

    const getRate = () => {
        if (!fromAmount || !toAmount || parseFloat(fromAmount) <= 0 || parseFloat(toAmount) <= 0) {
            return null;
        }
        if (isFlipped) {
            return parseFloat(fromAmount) / parseFloat(toAmount);
        }
        return parseFloat(toAmount) / parseFloat(fromAmount);
    }
    const rate = getRate();

    return (
        <>
            <div className="flex flex-col items-center w-full">
                <Tabs.Root
                    value={activeTab}
                    onValueChange={(value) => setActiveTab(value as 'swap' | 'limit')}
                    className="w-full max-w-lg flex flex-col"
                >
                    <div className="backdrop-blur-lg rounded-md shadow-lg p-0 flex flex-col items-center w-full pb-3">
                        <Tabs.List className="flex items-center gap-4 md:gap-6 mb-2 w-full px-4 md:px-8 pt-4 md:pt-8">
                            <Tabs.Trigger
                                value="swap"
                                className="text-xl md:text-3xl font-bold cursor-default transition-colors data-[state=active]:text-black data-[state=inactive]:text-gray-300 hover:text-black focus:outline-none"
                            >
                                Swap
                            </Tabs.Trigger>
                            {/* <Tabs.Trigger
                                value="limit"
                                className="text-xl md:text-3xl font-bold cursor-pointer transition-colors data-[state=active]:text-black data-[state=inactive]:text-gray-300 hover:text-black focus:outline-none"
                            >
                                Limit
                            </Tabs.Trigger> */}
                            <span className="ml-auto text-xl md:text-2xl text-gray-400 cursor-pointer hover:text-gray-600 transition-colors" onClick={() => setIsSettingsModalOpen(true)}>
                                <Settings />
                            </span>
                        </Tabs.List>

                        <Tabs.Content value="swap">
                            <div className="w-full p-4 flex flex-col gap-2">
                                <div className="relative">
                                    <div className="flex flex-col gap-2 w-full">
                                        <div className="bg-white bg-opacity-50 backdrop-blur-sm rounded-2xl p-4 flex flex-col gap-1">
                                            <span className="text-base md:text-lg font-semibold text-gray-700 mb-1">Sell</span>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    value={fromAmount}
                                                    onChange={(e) => handleFromAmountChange(e.target.value)}
                                                    placeholder="0.0"
                                                    className="flex-1 bg-transparent text-xl md:text-2xl font-semibold text-black outline-none placeholder-gray-400"
                                                />
                                                <TokenSelector
                                                    selectedToken={fromToken}
                                                    onClick={() => openModal('from')}
                                                />
                                            </div>
                                            <span className="text-right text-sm text-gray-400 pr-2">~${fromAmountInUsd}</span>
                                        </div>
                                        <div className="bg-white bg-opacity-50 backdrop-blur-sm rounded-2xl p-4 flex flex-col gap-1">
                                            <span className="text-base md:text-lg font-semibold text-gray-700 mb-1">Buy</span>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    value={toAmount}
                                                    onChange={(e) => handleToAmountChange(e.target.value)}
                                                    placeholder="0.0"
                                                    className="flex-1 bg-transparent text-xl md:text-2xl font-semibold text-black outline-none placeholder-gray-400"
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

                                {rate && !isLoading && (
                                    <div className="mt-2 p-4 bg-white bg-opacity-50 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs md:text-sm text-gray-600">Rate</span>
                                            <span className="text-xs md:text-sm font-medium">
                                                1 {isFlipped ? toToken?.symbol : fromToken?.symbol} = {formatNumber(rate.toString(), 6)} {isFlipped ? fromToken?.symbol : toToken?.symbol}
                                            </span>
                                        </div>
                                        {!isFlipped && minimumReceived() && (
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-xs md:text-sm text-gray-600">Minimum Received</span>
                                                <span className="text-xs md:text-sm font-medium">{minimumReceived()} {toToken?.symbol}</span>
                                            </div>
                                        )}
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
                        className={`w-full mt-6 py-4 rounded-full text-lg md:text-xl font-bold shadow-md transition-all duration-200 ${!isButtonDisabled()
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
            <SettingsModal
                isOpen={isSettingsModalOpen}
                onClose={() => setIsSettingsModalOpen(false)}
                slippage={slippage}
                setSlippage={setSlippage}
                deadline={deadline}
                setDeadline={setDeadline}
            />
        </>
    );
};

export default SwapForm;