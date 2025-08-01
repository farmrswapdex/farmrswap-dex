import { MaxUint256 } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { erc20Abi, parseUnits } from "viem";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import {
  FactoryContract,
  PairContract,
  RouterContract,
  Weth9Contract,
} from "../lib/config";
import { formatNumber, parseAmount } from "../lib/quoteCalculator";
import { useTokenStore } from "../store/useTokenStore";
import { NATIVE_TOKEN } from "../lib/constants";
import { sortTokens } from "../lib/utils";
import Decimal from "decimal.js";

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

const AddLiquidityForm = ({
  tokenA,
  tokenB,
  onBack,
}: AddLiquidityFormProps) => {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const { userTokens, fetchUserTokens } = useTokenStore();

  const [amountA, setAmountA] = useState("");
  const [amountB, setAmountB] = useState("");

  const [needsApprovalA, setNeedsApprovalA] = useState(false);
  const [needsApprovalB, setNeedsApprovalB] = useState(false);
  const [isApprovingA, setIsApprovingA] = useState(false);
  const [isApprovingB, setIsApprovingB] = useState(false);

  useEffect(() => {
    if (address) {
      fetchUserTokens(address);
    }
  }, [address, fetchUserTokens]);

  const tokenABalance =
    userTokens.find((t) => t.address === tokenA.address)?.balance || "0";
  const tokenBBalance =
    userTokens.find((t) => t.address === tokenB.address)?.balance || "0";

  // Check if token is native (ETH on Sepolia, BLOCX on BLOCX chain)
  const isTokenANative =
    tokenA.address === "0x0000000000000000000000000000000000000000" ||
    tokenA.symbol === "BLOCX";
  const isTokenBNative =
    tokenB.address === "0x0000000000000000000000000000000000000000" ||
    tokenB.symbol === "BLOCX";

  // Convert native token addresses to WBLOCX for pool lookup
  const poolTokenA = isTokenANative
    ? { ...tokenA, address: Weth9Contract.address }
    : tokenA;
  const poolTokenB = isTokenBNative
    ? { ...tokenB, address: Weth9Contract.address }
    : tokenB;

  const [sortedTokenA, sortedTokenB] = useMemo(
    () => sortTokens(poolTokenA, poolTokenB),
    [poolTokenA, poolTokenB]
  );

  const { data: pairAddress } = useReadContract({
    ...FactoryContract,
    functionName: "getPair",
    args: [
      sortedTokenA.address as `0x${string}`,
      sortedTokenB.address as `0x${string}`,
    ],
  });

  const pairExists =
    pairAddress && pairAddress !== "0x0000000000000000000000000000000000000000";

  const { data: reservesResult } = useReadContract({
    abi: PairContract.abi,
    address: pairAddress as `0x${string}`,
    functionName: "getReserves",
    query: { enabled: !!pairExists },
  });

  const reserves = reservesResult as [bigint, bigint, number] | undefined;

  const { data: allowanceA, refetch: refetchAllowanceA } = useReadContract({
    abi: erc20Abi,
    address: tokenA.address as `0x${string}`,
    functionName: "allowance",
    args: [address!, RouterContract.address],
    query: { enabled: !!address && !isTokenANative },
  });

  const { data: allowanceB, refetch: refetchAllowanceB } = useReadContract({
    abi: erc20Abi,
    address: tokenB.address as `0x${string}`,
    functionName: "allowance",
    args: [address!, RouterContract.address],
    query: { enabled: !!address && !isTokenBNative },
  });

  useEffect(() => {
    if (!isTokenANative && amountA && allowanceA !== undefined) {
      try {
        const requiredAmount = parseUnits(amountA, tokenA.decimals);
        setNeedsApprovalA(allowanceA < requiredAmount);
      } catch (e) {}
    } else {
      setNeedsApprovalA(false);
    }
  }, [amountA, tokenA, allowanceA, isTokenANative]);

  useEffect(() => {
    if (!isTokenBNative && amountB && allowanceB !== undefined) {
      try {
        const requiredAmount = parseUnits(amountB, tokenB.decimals);
        setNeedsApprovalB(allowanceB < requiredAmount);
      } catch (e) {
        // Ignore invalid number format for this check
      }
    } else {
      setNeedsApprovalB(false);
    }
  }, [amountB, tokenB, allowanceB, isTokenBNative]);

  const handleAmountAChange = (value: string) => {
    const parsedValue = parseAmount(value, tokenA.decimals);
    setAmountA(parsedValue);

    // Only auto-calculate amountB if pool exists (has reserves)
    if (reserves && parsedValue && !isNaN(parseFloat(parsedValue))) {
      // Need to determine which reserve corresponds to which token
      // considering we might be dealing with WBLOCX instead of native
      const [reserve0, reserve1] = reserves;

      // Determine correct reserve order based on sorted pool tokens
      const isTokenAFirst =
        poolTokenA.address.toLowerCase() < poolTokenB.address.toLowerCase();
      const [reserveA, reserveB] = isTokenAFirst
        ? [reserve0, reserve1]
        : [reserve1, reserve0];

      if (reserveA > 0n && reserveB > 0n) {
        const amountADesired = new Decimal(parsedValue).times(
          new Decimal(10).pow(tokenA.decimals)
        );
        const reserveADecimal = new Decimal(reserveA.toString());
        const reserveBDecimal = new Decimal(reserveB.toString());

        const amountBOptimal = amountADesired
          .times(reserveBDecimal)
          .dividedBy(reserveADecimal);

        setAmountB(
          amountBOptimal
            .dividedBy(new Decimal(10).pow(tokenB.decimals))
            .toDecimalPlaces(tokenB.decimals)
            .toString()
        );
      }
      // For new pools, allow free input of both amounts
    } else if (
      !reserves ||
      (reserves && reserves[0] === 0n && reserves[1] === 0n)
    ) {
      // Don't auto-clear amountB for new pools
    } else {
      setAmountB("");
    }
  };

  const handleAmountBChange = (value: string) => {
    const parsedValue = parseAmount(value, tokenB.decimals);
    setAmountB(parsedValue);

    // Only auto-calculate amountA if pool exists (has reserves)
    if (reserves && parsedValue && !isNaN(parseFloat(parsedValue))) {
      // Need to determine which reserve corresponds to which token
      // considering we might be dealing with WBLOCX instead of native
      const [reserve0, reserve1] = reserves;

      // Determine correct reserve order based on sorted pool tokens
      const isTokenAFirst =
        poolTokenA.address.toLowerCase() < poolTokenB.address.toLowerCase();
      const [reserveA, reserveB] = isTokenAFirst
        ? [reserve0, reserve1]
        : [reserve1, reserve0];

      if (reserveA > 0n && reserveB > 0n) {
        const amountBDesired = new Decimal(parsedValue).times(
          new Decimal(10).pow(tokenB.decimals)
        );
        const reserveADecimal = new Decimal(reserveA.toString());
        const reserveBDecimal = new Decimal(reserveB.toString());

        const amountAOptimal = amountBDesired
          .times(reserveADecimal)
          .dividedBy(reserveBDecimal);

        setAmountA(
          amountAOptimal
            .dividedBy(new Decimal(10).pow(tokenA.decimals))
            .toDecimalPlaces(tokenA.decimals)
            .toString()
        );
      }
      // For new pools, allow free input of both amounts
    } else if (
      !reserves ||
      (reserves && reserves[0] === 0n && reserves[1] === 0n)
    ) {
      // Don't auto-clear amountA for new pools
    } else {
      setAmountA("");
    }
  };

  const handleApprove = async (
    token: Token,
    setApproving: (isApproving: boolean) => void,
    refetch: () => void
  ) => {
    if (!address) return;
    setApproving(true);
    const promise = writeContractAsync({
      address: token.address as `0x${string}`,
      abi: erc20Abi,
      functionName: "approve",
      args: [RouterContract.address, MaxUint256],
    });
    toast.promise(promise, {
      loading: `Approving ${token.symbol}...`,
      success: () => {
        refetch();
        setApproving(false);
        return "Approval successful!";
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

    // Add 0.5% slippage tolerance
    const slippageTolerance = 0.995; // 99.5% of desired amount (0.5% slippage)
    const amountAMin = BigInt(
      Math.floor(Number(amountADesired) * slippageTolerance)
    );
    const amountBMin = BigInt(
      Math.floor(Number(amountBDesired) * slippageTolerance)
    );

    let promise;
    if (isTokenANative || isTokenBNative) {
      const [token, amountTokenDesired, amountTokenMin, amountETHMin, value] =
        isTokenANative
          ? [tokenB, amountBDesired, amountBMin, amountAMin, amountADesired]
          : [tokenA, amountADesired, amountAMin, amountBMin, amountBDesired];

      promise = writeContractAsync({
        address: RouterContract.address,
        abi: RouterContract.abi,
        functionName: "addLiquidityETH",
        args: [
          token.address as `0x${string}`,
          amountTokenDesired,
          amountTokenMin,
          amountETHMin,
          address,
          deadline,
        ],
        value: value,
      });
    } else {
      // For token-token pairs, we need to use the correct order
      const [token0, token1] =
        sortedTokenA.address.toLowerCase() < sortedTokenB.address.toLowerCase()
          ? [sortedTokenA, sortedTokenB]
          : [sortedTokenB, sortedTokenA];

      const [amount0Desired, amount1Desired, amount0Min, amount1Min] =
        token0.address === tokenA.address
          ? [amountADesired, amountBDesired, amountAMin, amountBMin]
          : [amountBDesired, amountADesired, amountBMin, amountAMin];

      promise = writeContractAsync({
        address: RouterContract.address,
        abi: RouterContract.abi,
        functionName: "addLiquidity",
        args: [
          token0.address as `0x${string}`,
          token1.address as `0x${string}`,
          amount0Desired,
          amount1Desired,
          amount0Min,
          amount1Min,
          address,
          deadline,
        ],
      });
    }

    toast.promise(promise, {
      loading: "Adding liquidity...",
      success: "Liquidity added successfully!",
      error: (err) => `Failed to add liquidity: ${err.message}`,
    });
  };

  const isAddLiquidityDisabled =
    !amountA ||
    !amountB ||
    needsApprovalA ||
    needsApprovalB ||
    isApprovingA ||
    isApprovingB;

  // Calculate initial prices and pool share
  const isNewPool =
    !pairExists ||
    !reserves ||
    (reserves && reserves[0] === 0n && reserves[1] === 0n);

  const initialPrices = useMemo(() => {
    if (
      !amountA ||
      !amountB ||
      parseFloat(amountA) === 0 ||
      parseFloat(amountB) === 0
    ) {
      return { priceAPerB: "0", priceBPerA: "0" };
    }

    const amountADecimal = new Decimal(amountA);
    const amountBDecimal = new Decimal(amountB);

    const priceAPerB = amountBDecimal
      .dividedBy(amountADecimal)
      .toDecimalPlaces(6)
      .toString();
    const priceBPerA = amountADecimal
      .dividedBy(amountBDecimal)
      .toDecimalPlaces(6)
      .toString();

    return { priceAPerB, priceBPerA };
  }, [amountA, amountB]);

  const poolShare = useMemo(() => {
    if (isNewPool) {
      return "100";
    }

    if (!reserves || !amountA || !amountB) {
      return "0";
    }

    // Use the same logic as in handleAmountChange functions
    const [reserve0, reserve1] = reserves;
    const isTokenAFirst =
      poolTokenA.address.toLowerCase() < poolTokenB.address.toLowerCase();
    const [reserveA, reserveB] = isTokenAFirst
      ? [reserve0, reserve1]
      : [reserve1, reserve0];

    if (reserveA === 0n || reserveB === 0n) {
      return "100";
    }

    try {
      const amountABigInt = parseUnits(amountA, tokenA.decimals);
      const amountBBigInt = parseUnits(amountB, tokenB.decimals);

      // Calculate share based on the minimum ratio
      const shareA = new Decimal(amountABigInt.toString())
        .times(100)
        .dividedBy(
          new Decimal(reserveA.toString()).plus(amountABigInt.toString())
        );
      const shareB = new Decimal(amountBBigInt.toString())
        .times(100)
        .dividedBy(
          new Decimal(reserveB.toString()).plus(amountBBigInt.toString())
        );

      return Decimal.min(shareA, shareB).toDecimalPlaces(2).toString();
    } catch (e) {
      return "0";
    }
  }, [
    reserves,
    amountA,
    amountB,
    tokenA,
    tokenB,
    poolTokenA,
    poolTokenB,
    isNewPool,
  ]);

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="bg-white bg-opacity-50 backdrop-blur-sm rounded-2xl p-4 flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="text-base md:text-lg font-semibold text-gray-700">
            Amount for {tokenA.symbol}
          </span>
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
            <img
              src={tokenA.logoURI}
              alt={tokenA.symbol}
              className="w-8 h-8 rounded-full"
            />
            <span className="font-bold text-lg">{tokenA.symbol}</span>
          </div>
        </div>
        {needsApprovalA && (
          <button
            onClick={() =>
              handleApprove(tokenA, setIsApprovingA, refetchAllowanceA)
            }
            disabled={isApprovingA}
            className="w-full mt-2 py-2 rounded-xl text-md font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all disabled:bg-gray-500"
          >
            {isApprovingA ? "Approving..." : `Approve ${tokenA.symbol}`}
          </button>
        )}
      </div>

      <div className="bg-white bg-opacity-50 backdrop-blur-sm rounded-2xl p-4 flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="text-base md:text-lg font-semibold text-gray-700">
            Amount for {tokenB.symbol}
          </span>
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
            <img
              src={tokenB.logoURI}
              alt={tokenB.symbol}
              className="w-8 h-8 rounded-full"
            />
            <span className="font-bold text-lg">{tokenB.symbol}</span>
          </div>
        </div>
        {needsApprovalB && (
          <button
            onClick={() =>
              handleApprove(tokenB, setIsApprovingB, refetchAllowanceB)
            }
            disabled={isApprovingB}
            className="w-full mt-2 py-2 rounded-xl text-md font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all disabled:bg-gray-500"
          >
            {isApprovingB ? "Approving..." : `Approve ${tokenB.symbol}`}
          </button>
        )}
      </div>

      {/* Price and Pool Share Information */}
      {amountA &&
        amountB &&
        parseFloat(amountA) > 0 &&
        parseFloat(amountB) > 0 && (
          <div className="bg-white bg-opacity-50 backdrop-blur-sm rounded-2xl p-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Pool Information
            </h3>

            {isNewPool && (
              <div className="text-sm text-orange-600 mb-3 font-medium">
                ⚠️ You are the first liquidity provider for this pool
              </div>
            )}

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Initial Price:</span>
                <div className="text-right">
                  <div className="font-medium text-gray-800">
                    1 {tokenA.symbol} = {initialPrices.priceAPerB}{" "}
                    {tokenB.symbol}
                  </div>
                  <div className="text-xs text-gray-600">
                    1 {tokenB.symbol} = {initialPrices.priceBPerA}{" "}
                    {tokenA.symbol}
                  </div>
                </div>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Your Pool Share:</span>
                <span className="font-medium text-gray-800">{poolShare}%</span>
              </div>

              {isNewPool && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                  You are setting the initial price for this pool. Please ensure
                  the amounts reflect the desired exchange rate.
                </div>
              )}
            </div>
          </div>
        )}

      <div className="flex gap-4 mt-4">
        <button
          onClick={onBack}
          className="flex-1 py-3 rounded-xl text-lg font-bold bg-gray-200 text-gray-800 hover:bg-gray-300 transition-all"
        >
          Back
        </button>
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
