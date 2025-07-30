import { MaxUint256 } from 'ethers';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { erc20Abi, formatUnits, parseUnits } from 'viem';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { FactoryContract, PairContract, RouterContract } from '../lib/config';
import { sortTokens } from '../lib/utils';

interface Token {
    symbol: string;
    name: string;
    address: string;
    decimals: number;
    logoURI: string;
    color: string;
}

interface RemoveLiquidityFormProps {
    tokenA: Token;
    tokenB: Token;
    onBack: () => void;
}

const RemoveLiquidityForm = ({ tokenA, tokenB, onBack }: RemoveLiquidityFormProps) => {
    const { address } = useAccount();
    const { writeContractAsync } = useWriteContract();

    const [lpAmount, setLpAmount] = useState('');
    const [percentage, setPercentage] = useState(50);
    const [needsApproval, setNeedsApproval] = useState(false);
    const [isApproving, setIsApproving] = useState(false);

    const [sortedTokenA, sortedTokenB] = useMemo(() => sortTokens(tokenA, tokenB), [tokenA, tokenB]);

    const { data: pairAddress } = useReadContract({
        ...FactoryContract,
        functionName: 'getPair',
        args: [sortedTokenA.address as `0x${string}`, sortedTokenB.address as `0x${string}`],
    });

    const { data: lpBalance, refetch: refetchLpBalance } = useReadContract({
        abi: PairContract.abi,
        address: pairAddress as `0x${string}`,
        functionName: 'balanceOf',
        args: [address!],
        query: { enabled: !!address && !!pairAddress },
    });

    const { data: lpTotalSupply, refetch: refetchLpTotalSupply } = useReadContract({
        abi: PairContract.abi,
        address: pairAddress as `0x${string}`,
        functionName: 'totalSupply',
        query: { enabled: !!pairAddress },
    });

    const { data: reserves, refetch: refetchReserves } = useReadContract({
        abi: PairContract.abi,
        address: pairAddress as `0x${string}`,
        functionName: 'getReserves',
        query: { enabled: !!pairAddress },
    });

    const { data: allowance, refetch: refetchAllowance } = useReadContract({
        abi: PairContract.abi,
        address: pairAddress as `0x${string}`,
        functionName: 'allowance',
        args: [address!, RouterContract.address],
        query: { enabled: !!address && !!pairAddress },
    });

    useEffect(() => {
        if (allowance !== undefined && lpAmount && parseFloat(lpAmount) > 0) {
            const requiredAmount = parseUnits(lpAmount, 18); // LP tokens have 18 decimals
            setNeedsApproval(allowance < requiredAmount);
        } else {
            setNeedsApproval(false);
        }
    }, [lpAmount, allowance]);

    useEffect(() => {
        if (lpBalance) {
            const calculatedAmount = (lpBalance * BigInt(percentage)) / 100n;
            setLpAmount(formatUnits(calculatedAmount, 18));
        }
    }, [percentage, lpBalance]);

    const handleLpAmountChange = (value: string) => {
        setLpAmount(value);
        if (lpBalance && lpBalance > 0n) {
            try {
                const parsedAmount = parseUnits(value, 18);
                if (parsedAmount <= lpBalance) {
                    const newPercentage = Number((parsedAmount * 10000n) / lpBalance) / 100;
                    setPercentage(Math.min(newPercentage, 100));
                } else {
                    setPercentage(100);
                }
            } catch {
                setPercentage(0);
            }
        } else {
            setPercentage(0);
        }
    };

    const handleApprove = async () => {
        if (!address || !pairAddress) return;
        setIsApproving(true);
        const promise = writeContractAsync({
            address: pairAddress as `0x${string}`,
            abi: erc20Abi,
            functionName: 'approve',
            args: [RouterContract.address, MaxUint256],
        });
        toast.promise(promise, {
            loading: `Approving LP Tokens...`,
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

    const handleRemoveLiquidity = async () => {
        if (!address || !lpAmount) return;

        const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 20); // 20 minutes deadline
        const liquidity = parseUnits(lpAmount, 18);

        const amountAMin = 0n; // Simplified: no slippage
        const amountBMin = 0n; // Simplified: no slippage

        let promise;
        if (tokenA.symbol === 'ETH' || tokenB.symbol === 'ETH') {
            const [token, amountTokenMin] = tokenA.symbol === 'ETH' ? [tokenB, amountBMin] : [tokenA, amountAMin];
            const amountETHMin = tokenA.symbol === 'ETH' ? amountAMin : amountBMin;

            promise = writeContractAsync({
                address: RouterContract.address,
                abi: RouterContract.abi,
                functionName: 'removeLiquidityETH',
                args: [token.address as `0x${string}`, liquidity, amountTokenMin, amountETHMin, address, deadline],
            });
        } else {
            promise = writeContractAsync({
                address: RouterContract.address,
                abi: RouterContract.abi,
                functionName: 'removeLiquidity',
                args: [
                    sortedTokenA.address as `0x${string}`,
                    sortedTokenB.address as `0x${string}`,
                    liquidity,
                    amountAMin,
                    amountBMin,
                    address,
                    deadline,
                ],
            });
        }

        toast.promise(promise, {
            loading: 'Removing liquidity...',
            success: () => {
                refetchLpBalance();
                refetchLpTotalSupply();
                refetchReserves();
                setLpAmount('');
                return 'Liquidity removed successfully!';
            },
            error: (err) => `Failed to remove liquidity: ${err.message}`,
        });
    };

    const getEstimatedAmounts = () => {
        if (!lpAmount || !lpTotalSupply || !reserves || lpTotalSupply === 0n || parseFloat(lpAmount) <= 0) {
            return { amountA: '0.0', amountB: '0.0' };
        }
        try {
            const liquidity = parseUnits(lpAmount, 18);
            const [reserveA, reserveB] = tokenA.address.toLowerCase() < tokenB.address.toLowerCase() ? reserves : [reserves[1], reserves[0]];
            const amountA = (liquidity * reserveA) / lpTotalSupply;
            const amountB = (liquidity * reserveB) / lpTotalSupply;
            return {
                amountA: formatUnits(amountA, tokenA.decimals),
                amountB: formatUnits(amountB, tokenB.decimals),
            };
        } catch {
            return { amountA: '0.0', amountB: '0.0' };
        }
    };

    const { amountA: estimatedA, amountB: estimatedB } = getEstimatedAmounts();
    const isRemoveDisabled = !lpAmount || parseFloat(lpAmount) <= 0 || needsApproval || isApproving;

    return (
        <div className="w-full flex flex-col gap-4">
            <div className="bg-white bg-opacity-50 backdrop-blur-sm rounded-2xl p-4 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                    <span className="text-base md:text-lg font-semibold text-gray-700">Amount to Remove</span>
                    <span className="font-bold text-lg text-blue-600">{percentage.toFixed(0)}%</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="100"
                    step="0.1"
                    value={percentage}
                    onChange={(e) => setPercentage(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-2">
                    <input
                        type="text"
                        value={lpAmount}
                        onChange={(e) => handleLpAmountChange(e.target.value)}
                        placeholder="0.0"
                        className="flex-1 bg-transparent text-xl md:text-2xl font-semibold text-black outline-none placeholder-gray-400"
                    />
                    <span className="font-bold text-lg text-gray-600">LP Tokens</span>
                </div>
                <div className="text-sm text-gray-600 text-right">
                    Balance: {lpBalance ? parseFloat(formatUnits(lpBalance, 18)).toFixed(6) : '0.0'}
                </div>
                {needsApproval && (
                    <button
                        onClick={handleApprove}
                        disabled={isApproving}
                        className="w-full mt-2 py-2 rounded-xl text-md font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all disabled:bg-gray-500"
                    >
                        {isApproving ? 'Approving...' : 'Approve LP Tokens'}
                    </button>
                )}
            </div>

            <div className="text-center text-2xl font-bold text-gray-500 my-2">↓</div>

            <div className="bg-white bg-opacity-50 backdrop-blur-sm rounded-2xl p-4 flex flex-col gap-2">
                <span className="text-base md:text-lg font-semibold text-gray-700 mb-1">You will receive (estimate)</span>
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <img src={tokenA.logoURI} alt={tokenA.symbol} className="w-8 h-8 rounded-full" />
                        <span className="font-bold text-lg">{tokenA.symbol}</span>
                    </div>
                    <span className="text-xl md:text-2xl font-semibold text-black">{parseFloat(estimatedA).toFixed(4)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <img src={tokenB.logoURI} alt={tokenB.symbol} className="w-8 h-8 rounded-full" />
                        <span className="font-bold text-lg">{tokenB.symbol}</span>
                    </div>
                    <span className="text-xl md:text-2xl font-semibold text-black">{parseFloat(estimatedB).toFixed(4)}</span>
                </div>
            </div>

            <div className="flex gap-4 mt-4">
                <button onClick={onBack} className="flex-1 py-3 rounded-xl text-lg font-bold bg-gray-200 text-gray-800 hover:bg-gray-300 transition-all">Back</button>
                <div className="flex-1">
                    <button
                        onClick={handleRemoveLiquidity}
                        disabled={isRemoveDisabled}
                        className="w-full py-3 rounded-xl text-lg font-bold text-white transition-all disabled:bg-gray-500 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700"
                    >
                        Remove Liquidity
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RemoveLiquidityForm;
