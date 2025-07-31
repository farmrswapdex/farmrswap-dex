import { useState, useEffect, useMemo } from 'react';
import { useAccount, useReadContracts } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useNavigate } from 'react-router-dom';
import { formatUnits } from 'viem';
import { Inbox } from 'lucide-react';

import { TOKENS } from '../lib/constants';
import { FactoryContract, PairContract } from '../lib/config';
import { sortTokens } from '../lib/utils';
import FloatingTomatoes from '../components/FloatingTomatoes';

// Token type
interface Token {
    symbol: string;
    name: string;
    address: string;
    decimals: number;
    logoURI: string;
    color: string;
}

interface UserPosition {
    tokenA: Token;
    tokenB: Token;
    lpBalance: bigint;
    pairAddress: `0x${string}`;
}

// Generate all unique pairs of tokens
const allTokenValues = Object.values(TOKENS);
const allTokenPairs = allTokenValues.flatMap((tokenA, i) =>
    allTokenValues.slice(i + 1).map(tokenB => [tokenA, tokenB])
);

const Pools = () => {
    const { address, isConnected } = useAccount();
    const { openConnectModal } = useConnectModal();
    const navigate = useNavigate();
    const [positions, setPositions] = useState<UserPosition[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // 1. Get pair addresses for all possible token pairs
    const { data: pairAddressesData, isFetched: arePairAddressesFetched } = useReadContracts({
        contracts: allTokenPairs.map(([tokenA, tokenB]) => {
            const [sortedTokenA, sortedTokenB] = sortTokens(tokenA, tokenB);
            return {
                ...FactoryContract,
                functionName: 'getPair',
                args: [sortedTokenA.address as `0x${string}`, sortedTokenB.address as `0x${string}`],
            };
        }),
        query: { enabled: isConnected },
    });

    // 2. Get LP token balances for all valid pairs
    const validPairs = useMemo(() => (
        arePairAddressesFetched && pairAddressesData
            ? allTokenPairs.map((tokens, i) => ({
                tokens,
                pairAddress: pairAddressesData[i].result,
            })).filter(p => p.pairAddress && p.pairAddress !== '0x0000000000000000000000000000000000000000')
            : []
    ), [arePairAddressesFetched, pairAddressesData]);

    const { data: lpBalancesData, isFetched: areLpBalancesFetched } = useReadContracts({
        contracts: validPairs.map(p => ({
            abi: PairContract.abi,
            address: p.pairAddress as `0x${string}`,
            functionName: 'balanceOf',
            args: [address!],
        })),
        query: { enabled: isConnected && validPairs.length > 0 },
    });

    useEffect(() => {
        if (areLpBalancesFetched && lpBalancesData) {
            const userPositions = validPairs
                .map((p, i) => {
                    const [tokenA, tokenB] = sortTokens(p.tokens[0], p.tokens[1]);
                    return {
                        tokenA,
                        tokenB,
                        pairAddress: p.pairAddress as `0x${string}`,
                        lpBalance: lpBalancesData[i].status === 'success' ? (lpBalancesData[i].result as bigint) : 0n,
                    };
                })
                .filter(p => p.lpBalance && p.lpBalance > 0n);

            setPositions(userPositions);
            setIsLoading(false);
        } else if (arePairAddressesFetched && validPairs.length === 0) {
            setIsLoading(false);
            setPositions([]);
        }
    }, [arePairAddressesFetched, areLpBalancesFetched, lpBalancesData, validPairs]);

    const handlePositionClick = (position: UserPosition) => {
        navigate('/remove', { state: { position } });
    };

    const renderContent = () => {
        if (!isConnected) {
            return (
                <div className="text-center flex flex-col items-center">
                    <p className="text-gray-600 mb-6">Connect your wallet to view your liquidity positions.</p>
                    <button onClick={openConnectModal} className="w-full max-w-xs py-3 rounded-xl text-lg font-bold transition-all duration-200 bg-blue-600 text-white hover:bg-blue-700">
                        Connect Wallet
                    </button>
                </div>
            );
        }

        if (isLoading) {
            return <p className="text-center text-gray-600">Loading your positions...</p>;
        }

        if (positions.length > 0) {
            return (
                <div className="w-full mt-4 space-y-4">
                    {positions.map((position) => (
                        <div
                            key={position.pairAddress}
                            className="bg-white/70 p-4 rounded-xl shadow-md flex items-center justify-between cursor-pointer hover:bg-white/90 transition-colors"
                            onClick={() => handlePositionClick(position)}
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex -space-x-4">
                                    <img src={position.tokenA.logoURI} alt={position.tokenA.symbol} className="w-10 h-10 rounded-full border-2 border-white" />
                                    <img src={position.tokenB.logoURI} alt={position.tokenB.symbol} className="w-10 h-10 rounded-full border-2 border-white" />
                                </div>
                                <div>
                                    <p className="font-bold text-lg text-gray-800">{position.tokenA.symbol}/{position.tokenB.symbol}</p>
                                    <p className="text-sm text-gray-600">LP Tokens: {parseFloat(formatUnits(position.lpBalance, 18)).toFixed(6)}</p>
                                </div>
                            </div>
                            <button className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                Manage
                            </button>
                        </div>
                    ))}
                </div>
            );
        }

        return (
            <div className="flex-1 flex flex-col items-center justify-center px-4 mt-8">
                <div className="w-full max-w-2xl bg-[#f6f6f6]/50 rounded-2xl shadow-md flex flex-col items-center justify-center p-12 min-h-[260px]">
                    <div className="mb-6 text-gray-500">
                        <Inbox size={50} />
                    </div>
                    <div className="text-lg text-gray-700 mb-2 text-center">Your active liquidity positions will appear here.</div>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full min-h-screen bg-[#a7d8f5] flex flex-col relative">
            <FloatingTomatoes />
            <div className="w-full max-w-4xl mx-auto pt-8 md:pt-16 pb-8 px-4 flex-grow z-10">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight">
                        Pools
                    </h1>
                    <button
                        onClick={() => navigate('/add')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition text-lg w-full sm:w-auto"
                    >
                        + New Position
                    </button>
                </div>
                <div className="text-xl text-gray-700 font-medium mb-4">Your positions ({positions.length})</div>
                {renderContent()}
            </div>
        </div>
    )
}

export default Pools;

