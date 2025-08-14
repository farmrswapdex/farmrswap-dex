import { useConnectModal } from '@rainbow-me/rainbowkit';
import {
	useAccount,
	useWriteContract,
	useWaitForTransactionReceipt,
	useReadContract,
} from 'wagmi';
import { useState, useEffect } from 'react';
import { NFTMint } from '../lib/config';
import { TOKENS } from '../lib/constants';
import { erc20Abi, parseUnits } from 'viem';
import { MaxUint256 } from 'ethers';
import { toast } from 'react-hot-toast';

const NFTMintForm = () => {
	const { openConnectModal } = useConnectModal();
	const { address, isConnected } = useAccount();
	const { data: hash, error, isPending, writeContract } = useWriteContract();
	const { isLoading: isConfirming, isSuccess: isConfirmed } =
		useWaitForTransactionReceipt({
			hash,
		});

	const [mintAmount] = useState(1);
	const payToken = TOKENS.USDC;
	const [needsApproval, setNeedsApproval] = useState(false);
	const [isApproving, setIsApproving] = useState(false);
	const [approvalHash, setApprovalHash] = useState<`0x${string}` | undefined>();

	const { isLoading: isConfirmingApproval, isSuccess: isApproved } =
		useWaitForTransactionReceipt({
			hash: approvalHash,
		});

	const mintPrice = 100; // 100 USDC
	const mintPriceWei = parseUnits(mintPrice.toString(), payToken.decimals);

	const { data: allowance, refetch: refetchAllowance } = useReadContract({
		abi: erc20Abi,
		address: payToken.address as `0x${string}`,
		functionName: "allowance",
		args: [address!, NFTMint.address as `0x${string}`],
		query: {
			enabled: !!address,
		},
	});

	useEffect(() => {
		if (allowance !== undefined) {
			setNeedsApproval(allowance < mintPriceWei);
		} else {
			setNeedsApproval(false);
		}
	}, [allowance, mintPriceWei]);

	useEffect(() => {
		if (hash && isApproving) {
			setApprovalHash(hash);
		}
	}, [hash, isApproving]);

	useEffect(() => {
		if (isApproved && approvalHash) {
			setIsApproving(false);
			setApprovalHash(undefined);
			refetchAllowance();
		}
	}, [isApproved, approvalHash, refetchAllowance]);

	const handleApprove = async () => {
		if (!address) return;

		try {
			setIsApproving(true);
			writeContract({
				address: payToken.address as `0x${string}`,
				abi: erc20Abi,
				functionName: "approve",
				args: [NFTMint.address as `0x${string}`, MaxUint256],
			});
		} catch (err: any) {
			setIsApproving(false);
			toast.error(`Approval failed: ${err.message || err.name}`);
		}
	};

	const handleMint = async () => {
		if (!isConnected) {
			openConnectModal?.();
			return;
		}

		if (needsApproval) {
			handleApprove();
			return;
		}

		writeContract({
			abi: NFTMint.abi,
			address: NFTMint.address as `0x${string}`,
			functionName: 'mint',
			args: [BigInt(mintAmount)],
		});
	};

	useEffect(() => {
		if (isConfirmed) {
			toast.success('success');
		}
	}, [isConfirmed]);

	useEffect(() => {
		if (error) {
			toast.error(error.message);
		}
	}, [error]);

	const getButtonText = () => {
		if (!isConnected) return "Connect Wallet to Mint";
		if (isApproving || isConfirmingApproval) return `Approving ${payToken.symbol}...`;
		if (needsApproval) return `Approve ${payToken.symbol}`;
		if (isPending) return 'Confirming...';
		if (isConfirming) return 'Minting...';
		return `Mint Now`;
	}

	return (
		<>
			<div className="w-full max-w-md bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl p-8 flex flex-col items-center text-center px-4 sm:px-6 lg:px-8 mx-auto lg:max-w-4xl">
				<h2
					className="text-4xl font-extrabold text-gray-800 mb-3"
					style={{ fontFamily: 'Fredoka One, sans-serif' }}
				>
					Mint a Farmr NFT
				</h2>
				<p className="text-gray-600 mb-6">
					Become a part of the FarmrSwap community by minting your unique NFT!
				</p>

				<div className="flex justify-center rounded-lg mb-6">
					<iframe
						src="https://lottie.host/embed/c73a7da7-1e70-4636-8322-575f1376bb2e/u7JGvit7Kl.lottie"
						className="w-72 h-72 border-0"
						title="NFT Animation"
					></iframe>
				</div>

				<div className="w-full bg-white bg-opacity-50 backdrop-blur-sm p-4 sm:p-6 lg:p-6 rounded-xl relative">
					<div className="flex items-center justify-between mb-3">
						<span className="text-sm sm:text-base font-semibold text-gray-600">
							Price
						</span>
					</div>
					<div className="flex items-center gap-3 lg:gap-4">
						<input
							type="text"
							value={mintPrice}
							disabled
							className="flex-1 bg-transparent text-2xl sm:text-3xl lg:text-4xl font-bold text-black placeholder-black outline-none focus:placeholder-black transition-colors min-w-0"
						/>
						<div className="flex items-center gap-2">
							<img src={payToken.logoURI} alt={payToken.name} className="w-8 h-8 rounded-full" />
							<span className="font-bold text-lg">{payToken.symbol}</span>
						</div>
					</div>
				</div>

				<div className="w-full mt-2">
					<button
						onClick={handleMint}
						disabled={isPending || isConfirming || isApproving || isConfirmingApproval}
						className="w-full py-3 rounded-xl text-lg font-bold transition-all duration-300 bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
					>
						{getButtonText()}
					</button>
				</div>

				{isConfirmed && (
					<div className="mt-6 text-green-800 bg-green-100 rounded-xl p-4 w-full animate-fade-in">
						<p className="font-bold text-lg">Transaction Successful!</p>
						<a
							href={`https://sepolia.etherscan.io/tx/${hash}`}
							target="_blank"
							rel="noopener noreferrer"
							className="text-xs text-blue-600 hover:underline"
						>
							View on Etherscan
						</a>
					</div>
				)}

				{error && (
					<div className="mt-6 text-red-800 bg-red-100 rounded-xl p-4 w-full animate-fade-in">
						<p className="font-bold text-lg">Error</p>
						<p className="text-sm">
							{(error as { shortMessage?: string }).shortMessage || error.message}
						</p>
					</div>
				)}
			</div>
		</>
	);
};

export default NFTMintForm;