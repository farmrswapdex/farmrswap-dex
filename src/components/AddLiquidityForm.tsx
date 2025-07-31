import { MaxUint256 } from 'ethers';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { erc20Abi, parseUnits, formatUnits } from 'viem';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { FactoryContract, PairContract, RouterContract } from '../lib/config';
import { formatNumber, parseAmount } from '../lib/quoteCalculator';
import { useTokenStore } from '../store/useTokenStore';
import { sortTokens } from '../lib/utils';
import Decimal from 'decimal.js';

interface Token {
    symbol: string;
    name: string;
    address: string;
    decimals: number;
    logoURI: string;
    color: string;
}

interface AddLiquidityFormProps {
    tokenA: Token;
    tokenB: Token;
    onBack: () => void;
}

const AddLiquidityForm = ({ tokenA, tokenB, onBack }: AddLiquidityFormProps) => {
    const { address } = useAccount();
    const { writeContractAsync } = useWriteContract();
    const { userTokens, fetchUserTokens } = useTokenStore();

    const [amountA, setAmountA] = useState('');
    const [amountB, setAmountB] = useState('');

    const [needsApprovalA, setNeedsApprovalA] = useState(false);
    const [needsApprovalB, setNeedsApprovalB] = useState(false);
    const [isApprovingA, setIsApprovingA] = useState(false);
    const [isApprovingB, setIsApprovingB] = useState(false);

    useEffect(() => {
        if (address) {
            fetchUserTokens(address);
        }
    }, [address, fetchUserTokens]);

    const tokenABalance = userTokens.find(t => t.address === tokenA.address)?.balance || '0';
    const tokenBBalance = userTokens.find(t => t.address === tokenB.address)?.balance || '0';

    const [sortedTokenA, sortedTokenB] = useMemo(() => sortTokens(tokenA, tokenB), [tokenA, tokenB]);

    const { data: pairAddress } = useReadContract({
        ...FactoryContract,
        functionName: 'getPair',
        args: [sortedTokenA.address as `0x${string}`, sortedTokenB.address as `0x${string}`],
    });

    const { data: reservesResult } = useReadContract({
        abi: PairContract.abi,
        address: pairAddress as `0x${string}`,
        functionName: 'getReserves',
        query: { enabled: !!pairAddress },
    });

    const reserves = reservesResult as [bigint, bigint, number] | undefined;

    const { data: allowanceA, refetch: refetchAllowanceA } = useReadContract({
        abi: erc20Abi,
        address: tokenA.address as `0x${string}`,
        functionName: 'allowance',
        args: [address!, RouterContract.address],
        query: { enabled: !!address && tokenA.symbol !== 'ETH' },
    });

    const { data: allowanceB, refetch: refetchAllowanceB } = useReadContract({
        abi: erc20Abi,
        address: tokenB.address as `0x${string}`,
        functionName: 'allowance',
        args: [address!, RouterContract.address],
        query: { enabled: !!address && tokenB.symbol !== 'ETH' },
    });

    useEffect(() => {
        if (tokenA.symbol !== 'ETH' && amountA && allowanceA !== undefined) {
            try {
                const requiredAmount = parseUnits(amountA, tokenA.decimals);
                setNeedsApprovalA(allowanceA < requiredAmount);
            } catch (e) {
                // Ignore invalid number format for this check
            }
        } else {
            setNeedsApprovalA(false);
        }
    }, [amountA, tokenA, allowanceA]);

    useEffect(() => {
        if (tokenB.symbol !== 'ETH' && amountB && allowanceB !== undefined) {
            try {
                const requiredAmount = parseUnits(amountB, tokenB.decimals);
                setNeedsApprovalB(allowanceB < requiredAmount);
            } catch (e) {
                // Ignore invalid number format for this check
            }
        } else {
            setNeedsApprovalB(false);
        }
    }, [amountB, tokenB, allowanceB]);

    const handleAmountAChange = (value: string) => {
        const parsedValue = parseAmount(value, tokenA.decimals);
        setAmountA(parsedValue);

        if (reserves && parsedValue && !isNaN(parseFloat(parsedValue))) {
            const [reserveA, reserveB] = tokenA.address.toLowerCase() < tokenB.address.toLowerCase() ? reserves : [reserves[1], reserves[0]];
            
            if (reserveA > 0n) {
                const amountADesired = new Decimal(parsedValue).times(new Decimal(10).pow(tokenA.decimals));
                const reserveADecimal = new Decimal(reserveA.toString());
                const reserveBDecimal = new Decimal(reserveB.toString());

                const amountBOptimal = amountADesired.times(reserveBDecimal).dividedBy(reserveADecimal);
                
                setAmountB(amountBOptimal.dividedBy(new Decimal(10).pow(tokenB.decimals)).toDecimalPlaces(tokenB.decimals).toString());
            }
        } else {
            setAmountB('');
        }
    };

    const handleAmountBChange = (value: string) => {
        const parsedValue = parseAmount(value, tokenB.decimals);
        setAmountB(parsedValue);

        if (reserves && parsedValue && !isNaN(parseFloat(parsedValue))) {
            const [reserveA, reserveB] = tokenA.address.toLowerCase() < tokenB.address.toLowerCase() ? reserves : [reserves[1], reserves[0]];

            if (reserveB > 0n) {
                const amountBDesired = new Decimal(parsedValue).times(new Decimal(10).pow(tokenB.decimals));
                const reserveADecimal = new Decimal(reserveA.toString());
                const reserveBDecimal = new Decimal(reserveB.toString());

                const amountAOptimal = amountBDesired.times(reserveADecimal).dividedBy(reserveBDecimal);

                setAmountA(amountAOptimal.dividedBy(new Decimal(10).pow(tokenA.decimals)).toDecimalPlaces(tokenA.decimals).toString());
            }
        } else {
            setAmountA('');
        }
    };

    const handleApprove = async (token: Token, setApproving: (isApproving: boolean) => void, refetch: () => void) => {
        if (!address) return;
        setApproving(true);
        const promise = writeContractAsync({
            address: token.address as `0x${string}`,
            abi: erc20Abi,
            functionName: 'approve',
            args: [RouterContract.address, MaxUint256],
        });
        toast.promise(promise, {
            loading: `Approving ${token.symbol}...`,
            success: () => {
                refetch();
                setApproving(false);
                return 'Approval successful!';
            },
            error: (err) => {
                setApproving(false);
                return `Approval failed: ${err.name}`;
            },
        });
    };

    const handleAddLiquidity = async () => {
        if (!address || !amountA || !amountB) return;

        const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 20); // 20 minutes deadline

        const amountADesired = parseUnits(amountA, tokenA.decimals);
        const amountBDesired = parseUnits(amountB, tokenB.decimals);

        const amountAMin = amountADesired; // Simplified: no slippage
        const amountBMin = amountBDesired; // Simplified: no slippage

        let promise;
        if (tokenA.symbol === 'ETH' || tokenB.symbol === 'ETH') {
            const [token, amountTokenDesired, amountTokenMin, amountETHMin, value] =
                tokenA.symbol === 'ETH'
                    ? [tokenB, amountBDesired, amountBMin, amountAMin, amountADesired]
                    : [tokenA, amountADesired, amountAMin, amountBMin, amountBDesired];

            promise = writeContractAsync({
                address: RouterContract.address,
                abi: RouterContract.abi,
                functionName: 'addLiquidityETH',
                args: [token.address as `0x${string}`, amountTokenDesired, amountTokenMin, amountETHMin, address, deadline],
                value: value,
            });
        } else {
            promise = writeContractAsync({
                address: RouterContract.address,
                abi: RouterContract.abi,
                functionName: 'addLiquidity',
                args: [
                    sortedTokenA.address as `0x${string}`,
                    sortedTokenB.address as `0x${string}`,
                    amountADesired,
                    amountBDesired,
                    amountAMin,
                    amountBMin,
                    address,
                    deadline,
                ],
            });
        }

        toast.promise(promise, {
            loading: 'Adding liquidity...',
            success: 'Liquidity added successfully!',
            error: (err) => `Failed to add liquidity: ${err.message}`,
        });
    };

    const isAddLiquidityDisabled = !amountA || !amountB || needsApprovalA || needsApprovalB || isApprovingA || isApprovingB;

    return (
        <div className="w-full flex flex-col gap-4">
            <div className="bg-white bg-opacity-50 backdrop-blur-sm rounded-2xl p-4 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                    <span className="text-base md:text-lg font-semibold text-gray-700">Amount for {tokenA.symbol}</span>
                    <div className="text-sm text-gray-500">
                        Balance: {formatNumber(tokenABalance, 4)}
                        <button
                            onClick={() => handleAmountAChange(tokenABalance)}
                            className="ml-2 text-blue-600 hover:text-blue-800 font-semibold"
                        >
                            Max
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={amountA}
                        onChange={(e) => handleAmountAChange(e.target.value)}
                        placeholder="0.0"
                        className="flex-1 bg-transparent text-xl md:text-2xl font-semibold text-black outline-none placeholder-gray-400 min-w-0"
                    />
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <img src={tokenA.logoURI} alt={tokenA.symbol} className="w-8 h-8 rounded-full" />
                        <span className="font-bold text-lg">{tokenA.symbol}</span>
                    </div>
                </div>
                {needsApprovalA && (
                    <button
                        onClick={() => handleApprove(tokenA, setIsApprovingA, refetchAllowanceA)}
                        disabled={isApprovingA}
                        className="w-full mt-2 py-2 rounded-xl text-md font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all disabled:bg-gray-500"
                    >
                        {isApprovingA ? 'Approving...' : `Approve ${tokenA.symbol}`}
                    </button>
                )}
            </div>

            <div className="bg-white bg-opacity-50 backdrop-blur-sm rounded-2xl p-4 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                    <span className="text-base md:text-lg font-semibold text-gray-700">Amount for {tokenB.symbol}</span>
                    <div className="text-sm text-gray-500">
                        Balance: {formatNumber(tokenBBalance, 4)}
                        <button
                            onClick={() => handleAmountBChange(tokenBBalance)}
                            className="ml-2 text-blue-600 hover:text-blue-800 font-semibold"
                        >
                            Max
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={amountB}
                        onChange={(e) => handleAmountBChange(e.target.value)}
                        placeholder="0.0"
                        className="flex-1 bg-transparent text-xl md:text-2xl font-semibold text-black outline-none placeholder-gray-400 min-w-0"
                    />
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <img src={tokenB.logoURI} alt={tokenB.symbol} className="w-8 h-8 rounded-full" />
                        <span className="font-bold text-lg">{tokenB.symbol}</span>
                    </div>
                </div>
                {needsApprovalB && (
                    <button
                        onClick={() => handleApprove(tokenB, setIsApprovingB, refetchAllowanceB)}
                        disabled={isApprovingB}
                        className="w-full mt-2 py-2 rounded-xl text-md font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all disabled:bg-gray-500"
                    >
                        {isApprovingB ? 'Approving...' : `Approve ${tokenB.symbol}`}
                    </button>
                )}
            </div>

            <div className="flex gap-4 mt-4">
                <button onClick={onBack} className="flex-1 py-3 rounded-xl text-lg font-bold bg-gray-200 text-gray-800 hover:bg-gray-300 transition-all">Back</button>
                <div className="flex-1">
                    <button
                        onClick={handleAddLiquidity}
                        disabled={isAddLiquidityDisabled}
                        className="w-full py-3 rounded-xl text-lg font-bold text-white transition-all disabled:bg-gray-500 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700"
                    >
                        Add Liquidity
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddLiquidityForm;
