import { MaxUint256 } from "ethers";
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

const FarmForm = ({
    lpToken,
    stakingContractAddress,
    stakingContractAbi,
}: FarmFormProps) => {
    const { address } = useAccount();
    const { writeContractAsync } = useWriteContract();
    const { userTokens, fetchUserTokens } = useTokenStore();

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

    // Get LP token balance
    const lpTokenBalance =
        userTokens.find((t) => t.address === lpToken.address)?.balance || "0";

    // Get allowance
    const { data: allowance, refetch: refetchAllowance } = useReadContract({
        abi: erc20Abi,
        address: lpToken.address as `0x${string}`,
        functionName: "allowance",
        args: [address!, stakingContractAddress],
        query: { enabled: !!address },
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
            functionName: "earned",
            args: [address!],
            query: { enabled: !!address },
        });

    const { isLoading: isConfirmingApproval, isSuccess: isApproved } =
        useWaitForTransactionReceipt({
            hash: approvalHash,
        });

    const { isLoading: isConfirmingStaking, isSuccess: isStakingComplete } =
        useWaitForTransactionReceipt({
            hash: stakingHash,
        });

    const { isLoading: isConfirmingUnstaking, isSuccess: isUnstakingComplete } =
        useWaitForTransactionReceipt({
            hash: unstakingHash,
        });

    useEffect(() => {
        if (isApproved && approvalHash) {
            setIsApproving(false);
            setApprovalHash(undefined);
            if (approvalToastId) {
                toast.dismiss(approvalToastId);
                setApprovalToastId(undefined);
            }
            refetchAllowance();
            toast.success("Approval successful!");
            fetchUserTokens(address!);
        }
    }, [isApproved, approvalHash, address, fetchUserTokens, approvalToastId]);

    useEffect(() => {
        if (isStakingComplete && stakingHash) {
            setIsStaking(false);
            setStakingHash(undefined);
            if (stakingToastId) {
                toast.dismiss(stakingToastId);
                setStakingToastId(undefined);
            }
            toast.success("Staking successful!");
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
        if (isUnstakingComplete && unstakingHash) {
            setIsUnstaking(false);
            setUnstakingHash(undefined);
            if (unstakingToastId) {
                toast.dismiss(unstakingToastId);
                setUnstakingToastId(undefined);
            }
            toast.success("Unstaking successful!");
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
        if (!address) return;

        try {
            setIsApproving(true);
            const hash = await writeContractAsync({
                address: lpToken.address as `0x${string}`,
                abi: erc20Abi,
                functionName: "approve",
                args: [stakingContractAddress, MaxUint256],
            });

            setApprovalHash(hash as `0x${string}`);
            const toastId = toast.loading(
                `Approving ${lpToken.symbol}... Please wait for confirmation.`
            );
            setApprovalToastId(toastId);
        } catch (err: unknown) {
            setIsApproving(false);
            const errorMessage =
                err instanceof Error ? err.message : "Unknown error";
            toast.error(`Approval failed: ${errorMessage}`);
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
            const toastId = toast.loading(
                "Staking... Please wait for confirmation."
            );
            setStakingToastId(toastId);
        } catch (err: unknown) {
            setIsStaking(false);
            const errorMessage =
                err instanceof Error ? err.message : "Unknown error";
            toast.error(`Staking failed: ${errorMessage}`);
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
            const errorMessage =
                err instanceof Error ? err.message : "Unknown error";
            toast.error(`Unstaking failed: ${errorMessage}`);
        }
    };

    const handleClaimRewards = async () => {
        if (!address) return;

        try {
            await writeContractAsync({
                address: stakingContractAddress,
                abi: stakingContractAbi,
                functionName: "getReward",
                args: [],
            });

            toast.loading("Claiming rewards... Please wait for confirmation.");
        } catch (err: unknown) {
            const errorMessage =
                err instanceof Error ? err.message : "Unknown error";
            toast.error(`Claim failed: ${errorMessage}`);
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

    return (
        <div className="w-full flex flex-col gap-5">
            {/* Stats Section */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 rounded-xl border border-blue-100">
                    <p className="text-xs text-blue-600 mb-2 font-medium">Staked Balance</p>
                    <p className="text-xl font-bold text-blue-900">
                        {formattedStakedBalance}
                    </p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100/50 p-4 rounded-xl border border-green-100">
                    <p className="text-xs text-green-600 mb-2 font-medium">Pending Rewards</p>
                    <p className="text-xl font-bold text-green-900">
                        {formattedPendingRewards} FARMR
                    </p>
                </div>
            </div>

            {pendingRewards && (pendingRewards as unknown as bigint) > 0n && (
                <button
                    onClick={handleClaimRewards}
                    className="w-full py-3.5 rounded-xl text-base font-bold text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all shadow-sm hover:shadow-md"
                >
                    Claim Rewards
                </button>
            )}

            {/* Tab Selector */}
            <div className="flex gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                <button
                    onClick={() => setActiveTab("stake")}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === "stake"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                        }`}
                >
                    Stake
                </button>
                <button
                    onClick={() => setActiveTab("unstake")}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === "unstake"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
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
                            <div className="text-sm text-gray-500">
                                Balance: <span className="font-semibold text-gray-700">{formatNumber(lpTokenBalance, 4)}</span>
                                <button
                                    onClick={() => handleStakeAmountChange(lpTokenBalance)}
                                    className="ml-2 text-blue-600 hover:text-blue-700 font-bold"
                                >
                                    Max
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-200">
                            <img
                                src={lpToken.logoURI}
                                alt={lpToken.symbol}
                                className="w-8 h-8 rounded-full"
                            />
                            <span className="font-bold text-gray-800">{lpToken.symbol}</span>
                            <input
                                type="text"
                                value={stakeAmount}
                                onChange={(e) => handleStakeAmountChange(e.target.value)}
                                placeholder="0"
                                className="flex-1 text-right text-xl font-bold text-gray-800 bg-transparent outline-none"
                            />
                        </div>
                    </div>

                    {needsApproval ? (
                        <button
                            onClick={handleApprove}
                            disabled={isApproving || isConfirmingApproval}
                            className="w-full py-3.5 rounded-xl text-base font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all disabled:bg-gray-300 disabled:from-gray-300 disabled:to-gray-300 shadow-sm hover:shadow-md"
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
                            className="w-full py-3.5 rounded-xl text-base font-bold text-white transition-all disabled:bg-gray-300 disabled:cursor-not-allowed bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-sm hover:shadow-md"
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
                            <div className="text-sm text-gray-500">
                                Staked: <span className="font-semibold text-gray-700">{formattedStakedBalance}</span>
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
                                    className="ml-2 text-blue-600 hover:text-blue-700 font-bold"
                                >
                                    Max
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-200">
                            <img
                                src={lpToken.logoURI}
                                alt={lpToken.symbol}
                                className="w-8 h-8 rounded-full"
                            />
                            <span className="font-bold text-gray-800">{lpToken.symbol}</span>
                            <input
                                type="text"
                                value={unstakeAmount}
                                onChange={(e) => handleUnstakeAmountChange(e.target.value)}
                                placeholder="0"
                                className="flex-1 text-right text-xl font-bold text-gray-800 bg-transparent outline-none"
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
                        className="w-full py-3.5 rounded-xl text-base font-bold text-white transition-all disabled:bg-gray-300 disabled:cursor-not-allowed bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-sm hover:shadow-md"
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
