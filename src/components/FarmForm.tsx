import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { erc20Abi, formatUnits, parseUnits, type Address } from "viem";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { formatNumber, parseAmount } from "../lib/quoteCalculator";
import { useTokenStore } from "../store/useTokenStore";

interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoURI: string;
  color: string;
}

interface FarmFormProps {
  lpToken: Token;
  stakingContractAddress: Address;
  stakingContractAbi: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
}

// Shorten and humanize wallet/chain errors for toasts
const friendlyError = (err: unknown): string => {
  const anyErr = err as any;
  const short = anyErr?.shortMessage || anyErr?.cause?.shortMessage;
  const code = anyErr?.code ?? anyErr?.cause?.code;
  let msg: string =
    short || anyErr?.cause?.message || anyErr?.message || String(err) || "";

  const lower = (msg || "").toLowerCase();
  if (
    code === 4001 ||
    lower.includes("user rejected") ||
    lower.includes("user denied") ||
    lower.includes("action rejected") ||
    lower.includes("rejected the request") ||
    lower.includes("request rejected")
  )
    return "Transaction cancelled.";
  if (lower.includes("insufficient funds"))
    return "Insufficient funds for gas/value.";
  if (lower.includes("execution reverted"))
    return "Transaction failed: execution reverted.";
  if (lower.includes("nonce too low")) return "Nonce too low.";
  if (lower.includes("underpriced"))
    return "Replacement transaction underpriced.";

  // Trim overly long messages
  if (!msg) return "Transaction failed.";
  return msg.length > 160 ? msg.slice(0, 160) + "…" : msg;
};

const FarmForm = ({
  lpToken,
  stakingContractAddress,
  stakingContractAbi,
}: FarmFormProps) => {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const { fetchUserTokens } = useTokenStore();

  const [stakeAmount, setStakeAmount] = useState("");
  const [unstakeAmount, setUnstakeAmount] = useState("");
  const [activeTab, setActiveTab] = useState<"stake" | "unstake">("stake");

  const [needsApproval, setNeedsApproval] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [approvalHash, setApprovalHash] = useState<`0x${string}`>();
  const [isStaking, setIsStaking] = useState(false);
  const [stakingHash, setStakingHash] = useState<`0x${string}`>();
  const [isUnstaking, setIsUnstaking] = useState(false);
  const [unstakingHash, setUnstakingHash] = useState<`0x${string}`>();
  const [approvalToastId, setApprovalToastId] = useState<string>();
  const [stakingToastId, setStakingToastId] = useState<string>();
  const [unstakingToastId, setUnstakingToastId] = useState<string>();
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimHash, setClaimHash] = useState<`0x${string}`>();
  const [claimToastId, setClaimToastId] = useState<string>();

  // Read staking token address from contract
  const { data: stakingTokenAddress } = useReadContract({
    abi: stakingContractAbi,
    address: stakingContractAddress,
    functionName: "stakingToken",
  });

  // Get LP token balance from user's wallet
  const { data: lpTokenBalanceData } = useReadContract({
    abi: erc20Abi,
    address: stakingTokenAddress as unknown as Address,
    functionName: "balanceOf",
    args: [address!],
    query: { enabled: !!address && !!stakingTokenAddress },
  });

  const lpTokenBalance = lpTokenBalanceData
    ? formatUnits(lpTokenBalanceData as bigint, lpToken.decimals)
    : "0";

  // Get allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    abi: erc20Abi,
    address: stakingTokenAddress as unknown as Address,
    functionName: "allowance",
    args: [address!, stakingContractAddress],
    query: { enabled: !!address && !!stakingTokenAddress },
  });

  // Get staked balance
  const { data: stakedBalance, refetch: refetchStakedBalance } =
    useReadContract({
      abi: stakingContractAbi,
      address: stakingContractAddress,
      functionName: "balanceOf",
      args: [address!],
      query: { enabled: !!address },
    });

  // Get pending rewards
  const { data: pendingRewards, refetch: refetchPendingRewards } =
    useReadContract({
      abi: stakingContractAbi,
      address: stakingContractAddress,
      functionName: "calculateReward",
      args: [address!],
      query: { enabled: !!address },
    });

  // Get staking status
  const { data: stakingStatus } = useReadContract({
    abi: stakingContractAbi,
    address: stakingContractAddress,
    functionName: "stakingStatus",
    query: { enabled: !!address },
  });

  const {
    isLoading: isConfirmingApproval,
    isSuccess: isApproved,
    isError: isApprovalError,
  } = useWaitForTransactionReceipt({
    hash: approvalHash,
  });

  const {
    isLoading: isConfirmingStaking,
    isSuccess: isStakingComplete,
    isError: isStakingError,
  } = useWaitForTransactionReceipt({
    hash: stakingHash,
  });

  const {
    isLoading: isConfirmingUnstaking,
    isSuccess: isUnstakingComplete,
    isError: isUnstakingError,
  } = useWaitForTransactionReceipt({
    hash: unstakingHash,
  });

  const {
    isLoading: isConfirmingClaim,
    isSuccess: isClaimComplete,
    isError: isClaimError,
  } = useWaitForTransactionReceipt({ hash: claimHash });

  useEffect(() => {
    if (isApproved && approvalHash) {
      setIsApproving(false);
      setApprovalHash(undefined);
      if (approvalToastId) {
        toast.dismiss(approvalToastId);
        setApprovalToastId(undefined);
      }
      refetchAllowance();
      toast.success("Approval successful!", { duration: 4000 });
      fetchUserTokens(address!);
    }
  }, [isApproved, approvalHash, address, fetchUserTokens, approvalToastId]);

  useEffect(() => {
    if (isApprovalError && approvalHash) {
      setIsApproving(false);
      setApprovalHash(undefined);
      if (approvalToastId) {
        toast.dismiss(approvalToastId);
        setApprovalToastId(undefined);
      }
      toast.error("Approval failed on-chain.", { duration: 4000 });
    }
  }, [isApprovalError, approvalHash, approvalToastId]);

  useEffect(() => {
    if (isStakingComplete && stakingHash) {
      setIsStaking(false);
      setStakingHash(undefined);
      if (stakingToastId) {
        toast.dismiss(stakingToastId);
        setStakingToastId(undefined);
      }
      toast.success("Staking successful!", { duration: 4000 });
      fetchUserTokens(address!);
      refetchStakedBalance();
      refetchPendingRewards();
      setStakeAmount("");
    }
  }, [
    isStakingComplete,
    stakingHash,
    address,
    fetchUserTokens,
    stakingToastId,
  ]);

  useEffect(() => {
    if (isStakingError && stakingHash) {
      setIsStaking(false);
      setStakingHash(undefined);
      if (stakingToastId) {
        toast.dismiss(stakingToastId);
        setStakingToastId(undefined);
      }
      toast.error("Staking failed on-chain.", { duration: 4000 });
    }
  }, [isStakingError, stakingHash, stakingToastId]);

  useEffect(() => {
    if (isUnstakingComplete && unstakingHash) {
      setIsUnstaking(false);
      setUnstakingHash(undefined);
      if (unstakingToastId) {
        toast.dismiss(unstakingToastId);
        setUnstakingToastId(undefined);
      }
      toast.success("Withdraw successful!", { duration: 4000 });
      fetchUserTokens(address!);
      refetchStakedBalance();
      refetchPendingRewards();
      setUnstakeAmount("");
    }
  }, [
    isUnstakingComplete,
    unstakingHash,
    address,
    fetchUserTokens,
    unstakingToastId,
  ]);

  useEffect(() => {
    if (isUnstakingError && unstakingHash) {
      setIsUnstaking(false);
      setUnstakingHash(undefined);
      if (unstakingToastId) {
        toast.dismiss(unstakingToastId);
        setUnstakingToastId(undefined);
      }
      toast.error("Withdraw failed on-chain.", { duration: 4000 });
    }
  }, [isUnstakingError, unstakingHash, unstakingToastId]);

  useEffect(() => {
    if (isClaimComplete && claimHash) {
      setIsClaiming(false);
      setClaimHash(undefined);
      if (claimToastId) {
        toast.dismiss(claimToastId);
        setClaimToastId(undefined);
      }
      toast.success("Rewards claimed!", { duration: 4000 });
      fetchUserTokens(address!);
      refetchPendingRewards();
    }
  }, [
    isClaimComplete,
    claimHash,
    claimToastId,
    address,
    fetchUserTokens,
    refetchPendingRewards,
  ]);

  useEffect(() => {
    if (isClaimError && claimHash) {
      setIsClaiming(false);
      setClaimHash(undefined);
      if (claimToastId) {
        toast.dismiss(claimToastId);
        setClaimToastId(undefined);
      }
      toast.error("Claim failed on-chain.", { duration: 4000 });
    }
  }, [isClaimError, claimHash, claimToastId]);

  useEffect(() => {
    if (stakeAmount && allowance !== undefined) {
      try {
        const amount = parseUnits(stakeAmount, lpToken.decimals);
        setNeedsApproval(allowance < amount);
      } catch {
        setNeedsApproval(false);
      }
    } else {
      setNeedsApproval(false);
    }
  }, [stakeAmount, lpToken.decimals, allowance]);

  const handleStakeAmountChange = (value: string) => {
    const parsed = parseAmount(value, lpToken.decimals);
    setStakeAmount(parsed);
  };

  const handleUnstakeAmountChange = (value: string) => {
    const parsed = parseAmount(value, lpToken.decimals);
    setUnstakeAmount(parsed);
  };

  const handleApprove = async () => {
    if (!address || !stakingTokenAddress || !stakeAmount) return;

    try {
      setIsApproving(true);
      const amount = parseUnits(stakeAmount, lpToken.decimals);

      const hash = await writeContractAsync({
        address: stakingTokenAddress as unknown as Address,
        abi: erc20Abi,
        functionName: "approve",
        args: [stakingContractAddress, amount],
      });

      setApprovalHash(hash as `0x${string}`);
      const toastId = toast.loading(
        `Approving ${stakeAmount} ${lpToken.symbol}... Please wait for confirmation.`
      );
      setApprovalToastId(toastId);
    } catch (err: unknown) {
      setIsApproving(false);
      toast.error(`Approval failed: ${friendlyError(err)}`, { duration: 4000 });
    }
  };

  const handleStake = async () => {
    if (!address || !stakeAmount) return;

    try {
      setIsStaking(true);
      const amount = parseUnits(stakeAmount, lpToken.decimals);

      const hash = await writeContractAsync({
        address: stakingContractAddress,
        abi: stakingContractAbi,
        functionName: "stake",
        args: [amount],
      });

      setStakingHash(hash as `0x${string}`);
      const toastId = toast.loading("Staking... Please wait for confirmation.");
      setStakingToastId(toastId);
    } catch (err: unknown) {
      setIsStaking(false);
      toast.error(`Staking failed: ${friendlyError(err)}`, { duration: 4000 });
    }
  };

  const handleUnstake = async () => {
    if (!address || !unstakeAmount) return;

    try {
      setIsUnstaking(true);
      const amount = parseUnits(unstakeAmount, lpToken.decimals);

      const hash = await writeContractAsync({
        address: stakingContractAddress,
        abi: stakingContractAbi,
        functionName: "withdraw",
        args: [amount],
      });

      setUnstakingHash(hash as `0x${string}`);
      const toastId = toast.loading(
        "Unstaking... Please wait for confirmation."
      );
      setUnstakingToastId(toastId);
    } catch (err: unknown) {
      setIsUnstaking(false);
      toast.error(`Withdraw failed: ${friendlyError(err)}`, { duration: 4000 });
    }
  };

  const handleClaimRewards = async () => {
    if (!address) return;

    try {
      setIsClaiming(true);
      const hash = await writeContractAsync({
        address: stakingContractAddress,
        abi: stakingContractAbi,
        functionName: "getReward",
        args: [],
      });

      setClaimHash(hash as `0x${string}`);
      const toastId = toast.loading(
        "Claiming rewards... Please wait for confirmation."
      );
      setClaimToastId(toastId);
    } catch (err: unknown) {
      setIsClaiming(false);
      toast.error(`Claim failed: ${friendlyError(err)}`, { duration: 4000 });
    }
  };

  const hasInsufficientStakeBalance = () => {
    if (!stakeAmount || !lpTokenBalance) return false;
    return parseFloat(stakeAmount) > parseFloat(lpTokenBalance);
  };

  const hasInsufficientUnstakeBalance = () => {
    if (!unstakeAmount || !stakedBalance) return false;
    const stakedBalanceFormatted = formatUnits(
      stakedBalance as unknown as bigint,
      lpToken.decimals
    );
    return parseFloat(unstakeAmount) > parseFloat(stakedBalanceFormatted);
  };

  const formattedStakedBalance = stakedBalance
    ? formatNumber(
        formatUnits(stakedBalance as unknown as bigint, lpToken.decimals),
        6
      )
    : "0";

  const formattedPendingRewards = pendingRewards
    ? formatNumber(formatUnits(pendingRewards as unknown as bigint, 18), 6)
    : "0";

  // Boolean for safe conditional rendering of claim button
  const hasClaimableRewards =
    pendingRewards !== undefined && (pendingRewards as unknown as bigint) > 0n;

  return (
    <div className="w-full flex flex-col gap-5">
      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-3 sm:p-4 rounded-xl border border-blue-100">
          <p className="text-xs text-blue-600 mb-1 sm:mb-2 font-medium">
            Your Stake
          </p>
          <p className="text-lg sm:text-xl font-bold text-blue-900 break-words">
            {formattedStakedBalance}
          </p>
          <p className="text-xs text-blue-600 mt-1">{lpToken.symbol}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100/50 p-3 sm:p-4 rounded-xl border border-green-100">
          <p className="text-xs text-green-600 mb-1 sm:mb-2 font-medium">
            Rewards Earned
          </p>
          <p className="text-lg sm:text-xl font-bold text-green-900 break-words">
            {formattedPendingRewards}
          </p>
          <p className="text-xs text-green-600 mt-1">FARMR</p>
        </div>
      </div>

      {/* Staking Status Indicator */}
      {stakingStatus !== undefined && (
        <div
          className={`${
            stakingStatus ? "hidden sm:flex" : "flex"
          } p-3 rounded-xl border items-center justify-center gap-2 ${
            stakingStatus
              ? "bg-green-50 border-green-200"
              : "bg-yellow-50 border-yellow-200"
          }`}
        >
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              stakingStatus ? "bg-green-500 animate-pulse" : "bg-yellow-500"
            }`}
          ></div>
          <p
            className={`text-sm font-medium ${
              stakingStatus ? "text-green-700" : "text-yellow-700"
            }`}
          >
            {stakingStatus ? "Staking is Live" : "Staking Not Active"}
          </p>
        </div>
      )}

      {hasClaimableRewards ? (
        <button
          onClick={handleClaimRewards}
          disabled={isClaiming || isConfirmingClaim}
          className={`relative overflow-hidden w-full py-4 rounded-xl text-base font-bold text-white transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg ${
            isClaiming || isConfirmingClaim
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          }`}
        >
          {/* Animated tomato overlays: drift across with varied timing */}
          <span
            aria-hidden
            className="pointer-events-none absolute top-1/4 opacity-20 sm:opacity-25 text-xl select-none tomato-run-ltr z-0"
            style={{ animationDelay: "-3s, -0.4s" }}
          >
            🍅
          </span>
          <span
            aria-hidden
            className="pointer-events-none absolute top-1/2 opacity-20 sm:opacity-25 text-2xl select-none tomato-run-rtl z-0"
            style={{ animationDelay: "-5s, -0.7s" }}
          >
            🍅
          </span>
          <span
            aria-hidden
            className="pointer-events-none absolute top-3/4 opacity-20 sm:opacity-25 text-lg select-none tomato-run-ltr-slow z-0"
            style={{ animationDelay: "-8s, -0.2s" }}
          >
            🍅
          </span>
          <span
            aria-hidden
            className="pointer-events-none absolute top-[18%] opacity-20 sm:opacity-25 text-lg select-none tomato-run-rtl-slow z-0"
            style={{ animationDelay: "-6s, -0.6s" }}
          >
            🍅
          </span>
          <span
            aria-hidden
            className="pointer-events-none absolute top-[82%] opacity-20 sm:opacity-25 text-xl select-none tomato-run-ltr z-0"
            style={{ animationDelay: "-9s, -0.5s" }}
          >
            🍅
          </span>
          {/* Additional tomatoes for richer motion */}
          <span
            aria-hidden
            className="pointer-events-none absolute top-[35%] opacity-20 sm:opacity-25 text-xl select-none tomato-run-rtl z-0"
            style={{ animationDelay: "-7s, -0.3s" }}
          >
            🍅
          </span>
          <span
            aria-hidden
            className="pointer-events-none absolute top-[65%] opacity-20 sm:opacity-25 text-2xl select-none tomato-run-ltr-slow z-0"
            style={{ animationDelay: "-4s, -0.9s" }}
          >
            🍅
          </span>

          <span className="relative z-10 text-sm sm:text-base">
            {isClaiming || isConfirmingClaim ? "Claiming..." : "Claim"}
          </span>
          <span className="relative z-10 text-sm sm:text-base">
            {` ${formattedPendingRewards} FARMR `}
          </span>
          <span className="relative z-10 text-sm sm:text-base">Rewards</span>
        </button>
      ) : null}

      {/* Tab Selector */}
      <div className="flex gap-2 bg-gray-100 p-1.5 rounded-xl border border-gray-200">
        <button
          onClick={() => setActiveTab("stake")}
          className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${
            activeTab === "stake"
              ? "bg-gradient-to-r from-[#7db9de] to-[#5a9fc7] text-white shadow-md"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
          }`}
        >
          Stake LP Tokens
        </button>
        <button
          onClick={() => setActiveTab("unstake")}
          className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${
            activeTab === "unstake"
              ? "bg-gradient-to-r from-[#7db9de] to-[#5a9fc7] text-white shadow-md"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
          }`}
        >
          Withdraw
        </button>
      </div>

      {/* Stake Tab */}
      {activeTab === "stake" && (
        <div className="flex flex-col gap-4">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-semibold text-gray-700">
                From
              </label>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                Balance:{" "}
                <span className="font-semibold text-gray-700">
                  {formatNumber(lpTokenBalance, 4)}
                </span>
                <button
                  onClick={() =>
                    handleStakeAmountChange(
                      (parseFloat(lpTokenBalance) * 0.25).toString()
                    )
                  }
                  className="ml-2 text-blue-600 hover:text-blue-700 font-bold"
                >
                  25%
                </button>
                <button
                  onClick={() =>
                    handleStakeAmountChange(
                      (parseFloat(lpTokenBalance) * 0.5).toString()
                    )
                  }
                  className="text-blue-600 hover:text-blue-700 font-bold"
                >
                  50%
                </button>
                <button
                  onClick={() => handleStakeAmountChange(lpTokenBalance)}
                  className="text-blue-600 hover:text-blue-700 font-bold"
                >
                  Max
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 bg-white rounded-lg p-2 sm:p-3 border border-gray-200">
              <img
                src={lpToken.logoURI}
                alt={lpToken.symbol}
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex-shrink-0"
              />
              <span className="font-bold text-sm sm:text-base text-gray-800 truncate">
                {lpToken.symbol}
              </span>
              <input
                type="text"
                value={stakeAmount}
                onChange={(e) => handleStakeAmountChange(e.target.value)}
                placeholder="0"
                className="flex-1 text-right text-lg sm:text-xl font-bold text-gray-800 bg-transparent outline-none min-w-0"
              />
            </div>
          </div>

          {needsApproval ? (
            <button
              onClick={handleApprove}
              disabled={isApproving || isConfirmingApproval}
              className="w-full py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-[#7db9de] to-[#5a9fc7] hover:from-[#6ba8cd] hover:to-[#4a8fb7] transition-all disabled:bg-gray-300 disabled:from-gray-300 disabled:to-gray-300 disabled:opacity-50 shadow-md hover:shadow-lg"
            >
              {isApproving || isConfirmingApproval
                ? "Approving..."
                : `Approve ${lpToken.symbol}`}
            </button>
          ) : (
            <button
              onClick={handleStake}
              disabled={
                !stakeAmount ||
                isStaking ||
                isConfirmingStaking ||
                hasInsufficientStakeBalance()
              }
              className="w-full py-4 rounded-xl text-base font-bold text-white transition-all disabled:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50 bg-gradient-to-r from-[#7db9de] to-[#5a9fc7] hover:from-[#6ba8cd] hover:to-[#4a8fb7] shadow-md hover:shadow-lg"
            >
              {isStaking || isConfirmingStaking
                ? "Staking..."
                : hasInsufficientStakeBalance()
                ? "Insufficient Balance"
                : "Stake"}
            </button>
          )}
        </div>
      )}

      {/* Unstake Tab */}
      {activeTab === "unstake" && (
        <div className="flex flex-col gap-4">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-semibold text-gray-700">
                From Staked
              </label>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                Staked:{" "}
                <span className="font-semibold text-gray-700">
                  {formattedStakedBalance}
                </span>
                <button
                  onClick={() =>
                    handleUnstakeAmountChange(
                      stakedBalance
                        ? (
                            parseFloat(
                              formatUnits(
                                stakedBalance as unknown as bigint,
                                lpToken.decimals
                              )
                            ) * 0.25
                          ).toString()
                        : "0"
                    )
                  }
                  className="ml-2 text-blue-600 hover:text-blue-700 font-bold"
                >
                  25%
                </button>
                <button
                  onClick={() =>
                    handleUnstakeAmountChange(
                      stakedBalance
                        ? (
                            parseFloat(
                              formatUnits(
                                stakedBalance as unknown as bigint,
                                lpToken.decimals
                              )
                            ) * 0.5
                          ).toString()
                        : "0"
                    )
                  }
                  className="text-blue-600 hover:text-blue-700 font-bold"
                >
                  50%
                </button>
                <button
                  onClick={() =>
                    handleUnstakeAmountChange(
                      stakedBalance
                        ? formatUnits(
                            stakedBalance as unknown as bigint,
                            lpToken.decimals
                          )
                        : "0"
                    )
                  }
                  className="text-blue-600 hover:text-blue-700 font-bold"
                >
                  Max
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 bg-white rounded-lg p-2 sm:p-3 border border-gray-200">
              <img
                src={lpToken.logoURI}
                alt={lpToken.symbol}
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex-shrink-0"
              />
              <span className="font-bold text-sm sm:text-base text-gray-800 truncate">
                {lpToken.symbol}
              </span>
              <input
                type="text"
                value={unstakeAmount}
                onChange={(e) => handleUnstakeAmountChange(e.target.value)}
                placeholder="0"
                className="flex-1 text-right text-lg sm:text-xl font-bold text-gray-800 bg-transparent outline-none min-w-0"
              />
            </div>
          </div>

          <button
            onClick={handleUnstake}
            disabled={
              !unstakeAmount ||
              isUnstaking ||
              isConfirmingUnstaking ||
              hasInsufficientUnstakeBalance()
            }
            className="w-full py-4 rounded-xl text-base font-bold text-white transition-all disabled:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50 bg-gradient-to-r from-[#7db9de] to-[#5a9fc7] hover:from-[#6ba8cd] hover:to-[#4a8fb7] shadow-md hover:shadow-lg"
          >
            {isUnstaking || isConfirmingUnstaking
              ? "Withdrawing..."
              : hasInsufficientUnstakeBalance()
              ? "Insufficient Staked Balance"
              : "Withdraw"}
          </button>
        </div>
      )}
    </div>
  );
};

export default FarmForm;
