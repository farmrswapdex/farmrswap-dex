import { MaxUint256 } from 'ethers';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { erc20Abi, parseUnits } from 'viem';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { FactoryContract, PairContract, RouterContract } from '../lib/config';
import { parseAmount } from '../lib/quoteCalculator';

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

    const [amountA, setAmountA] = useState('');
    const [amountB, setAmountB] = useState('');

    const [needsApprovalA, setNeedsApprovalA] = useState(false);
    const [needsApprovalB, setNeedsApprovalB] = useState(false);
    const [isApprovingA, setIsApprovingA] = useState(false);
    const [isApprovingB, setIsApprovingB] = useState(false);

    const { data: pairAddress } = useReadContract({
        ...FactoryContract,
        functionName: 'getPair',
        args: [tokenA.address as `0x${string}`, tokenB.address as `0x${string}`],
    });

    const { data: reserves } = useReadContract({
        abi: PairContract.abi,
        address: pairAddress as `0x${string}`,
        functionName: 'getReserves',
        query: { enabled: !!pairAddress },
    });

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
            const requiredAmount = parseUnits(amountA, tokenA.decimals);
            setNeedsApprovalA(allowanceA < requiredAmount);
        } else {
            setNeedsApprovalA(false);
        }
    }, [amountA, tokenA, allowanceA]);

    useEffect(() => {
        if (tokenB.symbol !== 'ETH' && amountB && allowanceB !== undefined) {
            const requiredAmount = parseUnits(amountB, tokenB.decimals);
            setNeedsApprovalB(allowanceB < requiredAmount);
        } else {
            setNeedsApprovalB(false);
        }
    }, [amountB, tokenB, allowanceB]);

    const handleAmountAChange = (value: string) => {
        const parsedValue = parseAmount(value, tokenA.decimals);
        setAmountA(parsedValue);
        if (reserves && parsedValue) {
            const amountADesired = parseUnits(parsedValue, tokenA.decimals);
            const [reserveA, reserveB] = reserves;
            const amountBOptimal = (amountADesired * reserveB) / reserveA;
            setAmountB(parseAmount(amountBOptimal.toString(), tokenB.decimals));
        } else {
            setAmountB('');
        }
    };

    const handleAmountBChange = (value: string) => {
        const parsedValue = parseAmount(value, tokenB.decimals);
        setAmountB(parsedValue);
        if (reserves && parsedValue) {
            const amountBDesired = parseUnits(parsedValue, tokenB.decimals);
            const [reserveA, reserveB] = reserves;
            const amountAOptimal = (amountBDesired * reserveA) / reserveB;
            setAmountA(parseAmount(amountAOptimal.toString(), tokenA.decimals));
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
                return `Approval failed: ${err.message}`;
            },
        });
    };

    const handleAddLiquidity = async () => {
        if (!address || !amountA || !amountB) return;

        const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 20); // 20 minutes deadline

        const amountADesired = parseUnits(amountA, tokenA.decimals);
        const amountBDesired = parseUnits(amountB, tokenB.decimals);

        // Note: Slippage is not implemented for simplicity, using desired amounts as minimum.
        const amountAMin = amountADesired;
        const amountBMin = amountBDesired;

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
                    tokenA.address as `0x${string}`,
                    tokenB.address as `0x${string}`,
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

    const getActionButton = () => {
        const buttonClass = "w-full py-3 rounded-xl text-lg font-bold text-white transition-all disabled:bg-gray-500 disabled:cursor-not-allowed";
        if (needsApprovalA) {
            return <button onClick={() => handleApprove(tokenA, setIsApprovingA, refetchAllowanceA)} disabled={isApprovingA} className={`${buttonClass} bg-blue-600 hover:bg-blue-700`}>Approve {tokenA.symbol}</button>;
        }
        if (needsApprovalB) {
            return <button onClick={() => handleApprove(tokenB, setIsApprovingB, refetchAllowanceB)} disabled={isApprovingB} className={`${buttonClass} bg-blue-600 hover:bg-blue-700`}>Approve {tokenB.symbol}</button>;
        }
        return <button onClick={handleAddLiquidity} disabled={!amountA || !amountB || isApprovingA || isApprovingB} className={`${buttonClass} bg-blue-600 hover:bg-blue-700`}>Add Liquidity</button>;
    };

    return (
        <div className="w-full flex flex-col gap-4">
            <div className="bg-white bg-opacity-50 backdrop-blur-sm rounded-2xl p-4 flex flex-col gap-1">
                <span className="text-base md:text-lg font-semibold text-gray-700 mb-1">Amount for {tokenA.symbol}</span>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={amountA}
                        onChange={(e) => handleAmountAChange(e.target.value)}
                        placeholder="0.0"
                        className="flex-1 bg-transparent text-xl md:text-2xl font-semibold text-black outline-none placeholder-gray-400"
                    />
                    <div className="flex items-center gap-2">
                        <img src={tokenA.logoURI} alt={tokenA.symbol} className="w-8 h-8 rounded-full" />
                        <span className="font-bold text-lg">{tokenA.symbol}</span>
                    </div>
                </div>
            </div>
            <div className="bg-white bg-opacity-50 backdrop-blur-sm rounded-2xl p-4 flex flex-col gap-1">
                <span className="text-base md:text-lg font-semibold text-gray-700 mb-1">Amount for {tokenB.symbol}</span>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={amountB}
                        onChange={(e) => handleAmountBChange(e.target.value)}
                        placeholder="0.0"
                        className="flex-1 bg-transparent text-xl md:text-2xl font-semibold text-black outline-none placeholder-gray-400"
                    />
                    <div className="flex items-center gap-2">
                        <img src={tokenB.logoURI} alt={tokenB.symbol} className="w-8 h-8 rounded-full" />
                        <span className="font-bold text-lg">{tokenB.symbol}</span>
                    </div>
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

export default AddLiquidityForm;
