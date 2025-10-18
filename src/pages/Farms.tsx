import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { formatUnits, type Address } from "viem";
import { useAccount, useReadContract } from "wagmi";
import { Inbox } from "lucide-react";
import FarmForm from "../components/FarmForm";
import { FactoryContract, STAKING_REWARDS_ABI } from "../lib/config";
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
    args: [
      TOKENS.FARMR.address as Address,
      TOKENS.WBLOCX.address as Address,
    ],
  });

  // Define farm pools
  const farmPools: FarmPool[] = [
    {
      id: "farmr-wblocx",
      name: "FARMR-WBLOCX LP",
      lpToken: {
        symbol: "FARMR-WBLOCX LP",
        name: "FARMR-WBLOCX Liquidity Pool Token",
        address: (farmrWblocxPairAddress as Address) || "0x0000000000000000000000000000000000000000",
        decimals: 18,
        logoURI: TOKENS.FARMR.logoURI,
        color: "",
      },
      token0: TOKENS.FARMR,
      token1: TOKENS.WBLOCX,
      stakingContractAddress: STAKING_REWARDS_ABI.address as Address,
      stakingContractAbi: STAKING_REWARDS_ABI.abi,
      apr: "TBD",
      totalStaked: "0",
    },
  ];

  const FarmPoolCard = ({ pool }: { pool: FarmPool; }) => {
    const { data: totalStakedData } = useReadContract({
      abi: pool.stakingContractAbi,
      address: pool.stakingContractAddress,
      functionName: "totalSupply",
      query: {
        enabled: pool.stakingContractAddress !== STAKING_REWARDS_ABI.address,
      },
    });

    const { data: userStakedData } = useReadContract({
      abi: pool.stakingContractAbi,
      address: pool.stakingContractAddress,
      functionName: "balanceOf",
      args: [address!],
      query: {
        enabled: !!address && pool.stakingContractAddress !== STAKING_REWARDS_ABI.address,
      },
    });

    const { data: userEarnedData } = useReadContract({
      abi: pool.stakingContractAbi,
      address: pool.stakingContractAddress,
      functionName: "earned",
      args: [address!],
      query: {
        enabled: !!address && pool.stakingContractAddress !== STAKING_REWARDS_ABI.address,
      },
    });

    const formattedTotalStaked = totalStakedData
      ? formatNumber(formatUnits(totalStakedData as unknown as bigint, 18), 2)
      : "0";

    const formattedUserStaked = userStakedData
      ? formatNumber(formatUnits(userStakedData as unknown as bigint, 18), 6)
      : "0";

    const formattedUserEarned = userEarnedData
      ? formatNumber(formatUnits(userEarnedData as unknown as bigint, 18), 6)
      : "0";

    const pairExists = pool.lpToken.address !== "0x0000000000000000000000000000000000000000";
    const isDeployed = pool.stakingContractAddress !== STAKING_REWARDS_ABI.address;

    return (
      <div
        className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100"
        onClick={() => {
          if (!isConnected) {
            openConnectModal?.();
          } else if (pairExists && isDeployed) {
            setSelectedPool(pool);
          }
        }}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex -space-x-3">
              <img
                src={pool.token0.logoURI}
                alt={pool.token0.symbol}
                className="w-12 h-12 rounded-full border-3 border-white shadow-sm"
              />
              <img
                src={pool.token1.logoURI}
                alt={pool.token1.symbol}
                className="w-12 h-12 rounded-full border-3 border-white shadow-sm"
              />
            </div>
            <div className="flex-1">
              <p className="font-bold text-xl text-gray-800 mb-2">
                {pool.token0.symbol}/{pool.token1.symbol}
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="text-gray-600">
                  APR: <span className="font-bold text-green-600">{pool.apr}</span>
                </span>
                <span className="text-gray-600">
                  TVL: <span className="font-bold text-gray-800">{formattedTotalStaked}</span>
                </span>
                {isConnected && isDeployed && (
                  <>
                    <span className="text-gray-600">
                      Your Stake: <span className="font-bold text-blue-600">{formattedUserStaked}</span>
                    </span>
                    <span className="text-gray-600">
                      Earned: <span className="font-bold text-green-600">{formattedUserEarned}</span>
                    </span>
                  </>
                )}
              </div>
              {!pairExists && (
                <p className="text-xs text-orange-600 mt-2">⚠️ Pool doesn't exist. Add liquidity first!</p>
              )}
              {!isDeployed && pairExists && (
                <p className="text-xs text-yellow-600 mt-2">🚧 Coming Soon!</p>
              )}
            </div>
          </div>
          <button
            className={`font-bold px-6 py-3 rounded-xl transition-all ${!isConnected || !pairExists || !isDeployed
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-sm hover:shadow-md"
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

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  <img
                    src={selectedPool.token0.logoURI}
                    alt={selectedPool.token0.symbol}
                    className="w-14 h-14 rounded-full border-3 border-white shadow-sm"
                  />
                  <img
                    src={selectedPool.token1.logoURI}
                    alt={selectedPool.token1.symbol}
                    className="w-14 h-14 rounded-full border-3 border-white shadow-sm"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">
                    {selectedPool.token0.symbol}/{selectedPool.token1.symbol}
                  </h2>
                  <p className="text-sm text-gray-600">Stake LP tokens to earn FARMR rewards</p>
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
            <div className="bg-gradient-to-r from-[#7db9de] to-[#a7d8f5] rounded-3xl p-8 mb-8 shadow-lg relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                    Stake LP Tokens
                    <br />
                    to Earn Rewards
                  </h1>
                  <p className="text-lg text-white/90">
                    Provide liquidity and stake LP tokens to earn FARMR
                  </p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-8 py-4 text-center">
                  <p className="text-sm text-white/90 mb-1">Total Value Locked</p>
                  <p className="text-3xl font-bold text-white">-</p>
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
