import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { formatUnits, type Address } from "viem";
import { useAccount, useReadContract } from "wagmi";
import { Inbox } from "lucide-react";
import FarmForm from "../components/FarmForm";
import { FactoryContract, FarmrLPStaking } from "../lib/config";
import { TOKENS } from "../lib/constants";
import { formatNumber } from "../lib/quoteCalculator";
import FloatingTomatoes from "../components/FloatingTomatoes";

interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoURI: string;
  color: string;
}

interface FarmPool {
  id: string;
  name: string;
  lpToken: Token;
  token0: Token;
  token1: Token;
  stakingContractAddress: `0x${string}`;
  stakingContractAbi: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
  apr: string;
  totalStaked: string;
}

const Farms = () => {
  const { openConnectModal } = useConnectModal();
  const { address, isConnected } = useAccount();
  const [selectedPool, setSelectedPool] = useState<FarmPool | null>(null);

  // Get FARMR-WBLOCX pair address
  const { data: farmrWblocxPairAddress } = useReadContract({
    ...FactoryContract,
    functionName: "getPair",
    args: [TOKENS.FARMR.address as Address, TOKENS.WBLOCX.address as Address],
  });

  // Get total staked (TVL) from the staking contract
  const { data: totalStakedData } = useReadContract({
    abi: FarmrLPStaking.abi,
    address: FarmrLPStaking.address as Address,
    functionName: "totalSupply",
  });

  // Get total tokens stake count
  const { data: totalTokensStakeCountData } = useReadContract({
    abi: FarmrLPStaking.abi,
    address: FarmrLPStaking.address as Address,
    functionName: "totalTokensStakeCount",
  });

  // Define farm pools
  const farmPools: FarmPool[] = [
    {
      id: "farmr-wblocx",
      name: "FARMR-WBLOCX LP",
      lpToken: {
        symbol: "FARMR-WBLOCX LP",
        name: "FARMR-WBLOCX Liquidity Pool Token",
        address:
          (farmrWblocxPairAddress as Address) ||
          "0x0000000000000000000000000000000000000000",
        decimals: 18,
        logoURI: TOKENS.FARMR.logoURI,
        color: "",
      },
      token0: TOKENS.FARMR,
      token1: TOKENS.WBLOCX,
      stakingContractAddress: FarmrLPStaking.address as Address,
      stakingContractAbi: FarmrLPStaking.abi,
      apr: "10%",
      totalStaked: "0",
    },
  ];

  const FarmPoolCard = ({ pool }: { pool: FarmPool }) => {
    const { data: userStakedData } = useReadContract({
      abi: pool.stakingContractAbi,
      address: pool.stakingContractAddress,
      functionName: "balanceOf",
      args: [address!],
      query: {
        enabled: !!address && !!pool.stakingContractAddress,
      },
    });

    const { data: userEarnedData } = useReadContract({
      abi: pool.stakingContractAbi,
      address: pool.stakingContractAddress,
      functionName: "calculateReward",
      args: [address!],
      query: {
        enabled: !!address && !!pool.stakingContractAddress,
      },
    });

    const formattedUserStaked = userStakedData
      ? formatNumber(formatUnits(userStakedData as unknown as bigint, 18), 6)
      : "0";

    const formattedUserEarned = userEarnedData
      ? formatNumber(formatUnits(userEarnedData as unknown as bigint, 18), 6)
      : "0";

    const pairExists =
      pool.lpToken.address !== "0x0000000000000000000000000000000000000000";
    const isDeployed = !!pool.stakingContractAddress;

    return (
      <div
        className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-lg transition-all cursor-pointer border border-gray-100 hover:border-blue-200"
        onClick={() => {
          if (!isConnected) {
            openConnectModal?.();
          } else if (pairExists && isDeployed) {
            setSelectedPool(pool);
          }
        }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4 flex-1 w-full sm:w-auto">
            <div className="relative flex-shrink-0">
              <div className="flex -space-x-2 sm:-space-x-3">
                <img
                  src={pool.token0.logoURI}
                  alt={pool.token0.symbol}
                  className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border-3 border-white shadow-md"
                />
                <img
                  src={pool.token1.logoURI}
                  alt={pool.token1.symbol}
                  className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border-3 border-white shadow-md"
                />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <p className="font-bold text-lg sm:text-xl text-gray-800">
                  {pool.token0.symbol}/{pool.token1.symbol}
                </p>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg">
                  {pool.apr} APY
                </span>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <span className="text-gray-500">TVL:</span>
                  <span className="font-bold text-gray-800 truncate">
                    {totalStakedData
                      ? formatNumber(
                          formatUnits(totalStakedData as unknown as bigint, 18),
                          2
                        )
                      : "0"}{" "}
                    <span className="hidden sm:inline">FARMR </span>LP
                  </span>
                </div>
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <span className="text-gray-500 hidden sm:inline">
                    All Time Staked:
                  </span>
                  <span className="text-gray-500 sm:hidden">All Time:</span>
                  <span className="font-bold text-gray-800 truncate">
                    {totalTokensStakeCountData
                      ? formatNumber(
                          formatUnits(
                            totalTokensStakeCountData as unknown as bigint,
                            18
                          ),
                          2
                        )
                      : "0"}{" "}
                    LP
                  </span>
                </div>
                {isConnected && isDeployed && (
                  <>
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      <span className="text-gray-500 hidden sm:inline">
                        Your Stake:
                      </span>
                      <span className="text-gray-500 sm:hidden">Staked:</span>
                      <span className="font-bold text-blue-600 truncate">
                        {formattedUserStaked}{" "}
                        <span className="hidden sm:inline">FARMR </span>LP
                      </span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      <span className="text-gray-500 hidden sm:inline">
                        Earnings:
                      </span>
                      <span className="text-gray-500 sm:hidden">Earned:</span>
                      <span className="font-bold text-green-600 truncate">
                        {formattedUserEarned} FARMR
                      </span>
                    </div>
                  </>
                )}
              </div>
              {!pairExists && (
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-orange-50 text-orange-600 text-xs font-medium rounded-lg border border-orange-200">
                  ⚠️ Pool doesn't exist. Add liquidity first!
                </div>
              )}
              {!isDeployed && pairExists && (
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-yellow-50 text-yellow-600 text-xs font-medium rounded-lg border border-yellow-200">
                  🚧 Coming Soon!
                </div>
              )}
            </div>
          </div>
          <button
            className={`font-bold px-5 sm:px-7 py-3 sm:py-3.5 rounded-xl transition-all whitespace-nowrap w-full sm:w-auto text-sm sm:text-base ${
              !isConnected || !pairExists || !isDeployed
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-[#7db9de] to-[#5a9fc7] text-white hover:from-[#6ba8cd] hover:to-[#4a8fb7] shadow-md hover:shadow-lg"
            }`}
            disabled={!pairExists || !isDeployed}
          >
            {!isConnected
              ? "Connect"
              : !pairExists
              ? "No Pool"
              : !isDeployed
              ? "Soon"
              : parseFloat(formattedUserStaked) > 0
              ? "Manage"
              : "Stake"}
          </button>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (!isConnected) {
      return (
        <div className="text-center flex flex-col items-center">
          <p className="text-gray-600 mb-6">
            Connect your wallet to view and manage farm pools.
          </p>
          <button
            onClick={openConnectModal}
            className="w-full max-w-xs py-3 rounded-xl text-lg font-bold transition-all duration-200 bg-blue-600 text-white hover:bg-blue-700"
          >
            Connect Wallet
          </button>
        </div>
      );
    }

    if (selectedPool) {
      return (
        <div className="w-full max-w-3xl mx-auto">
          <button
            onClick={() => setSelectedPool(null)}
            className="mb-6 text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Pools
          </button>

          <div className="bg-white/30 backdrop-blur-md rounded-3xl shadow-lg border border-white/20 ring-1 ring-white/10 overflow-hidden">
            <div className="relative bg-white/10 backdrop-blur-lg p-4 sm:p-6 border-b border-white/20">
              {/* Subtle glass gradient overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#7db9de]/30 to-[#a7d8f5]/30 opacity-70"></div>
              {/* Soft top highlight */}
              <div className="pointer-events-none absolute -top-8 left-0 right-0 h-16 bg-white/30 blur-2xl opacity-40"></div>
              {/* Mobile APY pill pinned to top-right */}
              <span className="sm:hidden absolute right-4 top-4 inline-flex items-center px-2 py-0.5 rounded-md bg-white/60 backdrop-blur-sm text-green-700 text-[10px] font-semibold shadow-sm">
                {selectedPool.apr} APY
              </span>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 sm:gap-4 flex-1">
                  <div className="flex -space-x-2 sm:-space-x-3 flex-shrink-0">
                    <img
                      src={selectedPool.token0.logoURI}
                      alt={selectedPool.token0.symbol}
                      className="w-8 h-8 sm:w-16 sm:h-16 rounded-full border-3 sm:border-4 border-white/50 shadow-lg"
                    />
                    <img
                      src={selectedPool.token1.logoURI}
                      alt={selectedPool.token1.symbol}
                      className="w-8 h-8 sm:w-16 sm:h-16 rounded-full border-3 sm:border-4 border-white/50 shadow-lg"
                    />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">
                      {selectedPool.token0.symbol}/{selectedPool.token1.symbol}{" "}
                      Farm
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-700">
                      Stake LP tokens to earn FARMR rewards
                    </p>
                  </div>
                </div>
                <div className="hidden sm:block bg-white/30 backdrop-blur-md rounded-xl px-4 py-2 shadow-sm border border-white/20">
                  <p className="text-xs text-gray-600 mb-0.5">APY</p>
                  <p className="text-2xl font-bold text-green-600">
                    {selectedPool.apr}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <FarmForm
                lpToken={selectedPool.lpToken}
                stakingContractAddress={selectedPool.stakingContractAddress}
                stakingContractAbi={selectedPool.stakingContractAbi}
              />
            </div>
          </div>
        </div>
      );
    }

    if (farmPools.length > 0) {
      return (
        <div className="w-full mt-4 space-y-4">
          {farmPools.map((pool) => (
            <FarmPoolCard key={pool.id} pool={pool} />
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
          <div className="text-lg text-gray-700 mb-2 text-center">
            No farm pools available yet.
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#a7d8f5] flex flex-col relative">
      <FloatingTomatoes />
      <div className="w-full max-w-6xl mx-auto pt-6 md:pt-12 pb-8 px-4 flex-grow z-10">
        {!selectedPool && (
          <>
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-[#7db9de] to-[#a7d8f5] rounded-3xl p-8 md:p-10 mb-8 shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                <div className="flex-1">
                  <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-sm">
                    Farm $FARMR Rewards
                  </h1>
                  <p className="text-lg md:text-xl text-white/95 mb-3">
                    Stake your LP tokens and earn 10% APY in FARMR tokens
                  </p>
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>
                      Non‑custodial • Permissionless • On‑chain rewards
                    </span>
                  </div>
                </div>
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-8 py-6 text-center shadow-lg border border-white/20">
                  <p className="text-sm text-gray-600 mb-2 font-medium">
                    Total Value Locked
                  </p>
                  <p className="text-4xl font-bold text-[#7db9de] mb-1">
                    {totalStakedData
                      ? formatNumber(
                          formatUnits(totalStakedData as unknown as bigint, 18),
                          2
                        )
                      : "0"}
                  </p>
                  <p className="text-xs text-gray-500">FARMR LP Tokens</p>
                </div>
              </div>
            </div>

            <div className="text-xl text-gray-700 font-semibold mb-6">
              Available Pools ({farmPools.length})
            </div>
          </>
        )}
        {renderContent()}
      </div>
    </div>
  );
};

export default Farms;
