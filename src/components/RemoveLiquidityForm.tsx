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
        if (allowance !== undefined && lpAmount) {
            const requiredAmount = parseUnits(lpAmount, 18); // LP tokens have 18 decimals
            setNeedsApproval(allowance < requiredAmount);
        } else {
            setNeedsApproval(false);
        }
    }, [lpAmount, allowance]);

    useEffect(() => {
        if (lpBalance) {
            const calculatedAmount = (BigInt(lpBalance.toString()) * BigInt(percentage)) / 100n;
            setLpAmount(formatUnits(calculatedAmount, 18));
        }
    }, [percentage, lpBalance]);

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

        // Note: Slippage is not implemented for simplicity, using 0 as minimum.
        const amountAMin = 0n;
        const amountBMin = 0n;

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
        if (!lpAmount || !lpTotalSupply || !reserves || lpTotalSupply === 0n) return { amountA: '0.0', amountB: '0.0' };
        const liquidity = parseUnits(lpAmount, 18);
        const [reserveA, reserveB] = tokenA.address.toLowerCase() < tokenB.address.toLowerCase() ? reserves : [reserves[1], reserves[0]];
        const amountA = (liquidity * reserveA) / lpTotalSupply;
        const amountB = (liquidity * reserveB) / lpTotalSupply;
        return {
            amountA: formatUnits(amountA, tokenA.decimals),
            amountB: formatUnits(amountB, tokenB.decimals),
        };
    };

    const { amountA: estimatedA, amountB: estimatedB } = getEstimatedAmounts();

    const getActionButton = () => {
        const buttonClass = "w-full py-3 rounded-xl text-lg font-bold text-white transition-all disabled:bg-gray-500 disabled:cursor-not-allowed";
        if (needsApproval) {
            return <button onClick={handleApprove} disabled={isApproving} className={`${buttonClass} bg-blue-600 hover:bg-blue-700`}>Approve LP Tokens</button>;
        }
        return <button onClick={handleRemoveLiquidity} disabled={!lpAmount || isApproving || lpAmount === '0' || parseFloat(lpAmount) === 0} className={`${buttonClass} bg-blue-600 hover:bg-blue-700`}>Remove Liquidity</button>;
    };

    return (
        <div className="w-full flex flex-col gap-4">
            <div className="bg-white bg-opacity-50 backdrop-blur-sm rounded-2xl p-4 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                    <span className="text-base md:text-lg font-semibold text-gray-700">Amount to Remove</span>
                    <span className="font-bold text-lg text-blue-600">{percentage}%</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={percentage}
                    onChange={(e) => setPercentage(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-2">
                    <input
                        type="text"
                        value={lpAmount}
                        onChange={(e) => setLpAmount(e.target.value)}
                        placeholder="0.0"
                        className="flex-1 bg-transparent text-xl md:text-2xl font-semibold text-black outline-none placeholder-gray-400"
                    />
                    <span className="font-bold text-lg text-gray-600">LP Tokens</span>
                </div>
                 <div className="text-sm text-gray-600 text-right">
                    Balance: {lpBalance ? parseFloat(formatUnits(lpBalance, 18)).toFixed(6) : '0.0'}
                </div>
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
                    {getActionButton()}
                </div>
            </div>
        </div>
    );
};

export default RemoveLiquidityForm;
