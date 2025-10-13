import { useConnectModal } from "@rainbow-me/rainbowkit";
import { MaxUint256 } from "ethers";
import { ArrowDown, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { erc20Abi, formatUnits, parseUnits } from "viem";
import {
	useAccount,
	useReadContract,
	useWaitForTransactionReceipt,
	useWriteContract,
} from "wagmi";
import { useSearchParams } from "react-router-dom";
import { RouterContract, Weth9Contract } from "../lib/config";
import { NATIVE_TOKEN, TOKENS, TOKEN_LIST } from "../lib/constants";
import { formatNumber, parseAmount, toSignificantFigures } from "../lib/quoteCalculator";
import { getTokenPrices } from "../lib/priceService";
import { useTokenStore } from "../store/useTokenStore";
import SettingsModal from "./SettingsModal";
import TokenModal from "./TokenModal";
import TokenSelector from "./TokenSelector";

interface Token {
	symbol: string;
	name: string;
	address: string;
	decimals: number;
	logoURI: string;
	color: string;
}

const SwapForm = () => {
	const { openConnectModal } = useConnectModal();
	const { address, isConnected, chain } = useAccount();
	const { writeContractAsync, error } = useWriteContract();
	const {
		userTokens,
		fetchUserTokens,
		loading: tokensLoading,
	} = useTokenStore();
	const [searchParams] = useSearchParams();

	// Common state for both forms
	const [fromToken, setFromToken] = useState<Token>(NATIVE_TOKEN);
	const [toToken, setToToken] = useState<Token>(TOKENS.FARMR);
	const [fromAmount, setFromAmount] = useState<string>();
	const [toAmount, setToAmount] = useState<string>();
	const [tokenPrices, setTokenPrices] = useState<{ [address: string]: number; }>({});

	// Swap-specific state
	const [isFlipped, setIsFlipped] = useState(false);
	const [amountsSwapped, setAmountsSwapped] = useState(false);
	const [needsApproval, setNeedsApproval] = useState(false);
	const [isApproving, setIsApproving] = useState(false);
	const [approvalHash, setApprovalHash] = useState<`0x${string}`>();
	const [swapHash, setSwapHash] = useState<`0x${string}`>();
	const [isSwapping, setIsSwapping] = useState(false);
	const [approvalToastId, setApprovalToastId] = useState<string>();
	const [swapToastId, setSwapToastId] = useState<string>();

	// Settings
	const [slippage, setSlippage] = useState(0.5);
	const [deadline, setDeadline] = useState(20);

	// Modal state
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
	const [selectingFor, setSelectingFor] = useState<"from" | "to" | null>(null);

	// Wait for approval confirmation
	const { isLoading: isConfirmingApproval, isSuccess: isApproved } =
		useWaitForTransactionReceipt({
			hash: approvalHash,
		});

	// Wait for swap confirmation
	const { isLoading: isConfirmingSwap, isSuccess: isSwapComplete } =
		useWaitForTransactionReceipt({
			hash: swapHash,
		});

	// Handle URL parameters for initial token selection
	useEffect(() => {
		const inputCurrency = searchParams.get('inputCurrency');
		const outputCurrency = searchParams.get('outputCurrency');

		// Helper function to find token by symbol or address
		const findToken = (currency: string): Token | null => {
			const currencyUpper = currency.toUpperCase();

			// Check if it's the native token
			if (currencyUpper === 'BLOCX' || currencyUpper === 'ETH') {
				return NATIVE_TOKEN;
			}

			// Check predefined tokens by symbol
			const allTokens = [NATIVE_TOKEN, ...TOKEN_LIST];
			const tokenBySymbol = allTokens.find(
				t => t.symbol.toUpperCase() === currencyUpper
			);
			if (tokenBySymbol) return tokenBySymbol;

			// Check by address (case-insensitive)
			const tokenByAddress = allTokens.find(
				t => t.address.toLowerCase() === currency.toLowerCase()
			);
			if (tokenByAddress) return tokenByAddress;

			return null;
		};

		if (inputCurrency) {
			const token = findToken(inputCurrency);
			if (token) setFromToken(token);
		}

		if (outputCurrency) {
			const token = findToken(outputCurrency);
			if (token) setToToken(token);
		}
	}, [searchParams]);

	// Update approval state when confirmation completes
	useEffect(() => {
		const fetchPrices = async () => {
			if (!fromToken || !toToken || !chain) return;

			const addresses = [
				fromToken.address,
				toToken.address,
			];

			// Remove duplicates
			const uniqueAddresses = [...new Set(addresses)];

			const prices = await getTokenPrices(uniqueAddresses, chain.name);
			setTokenPrices(prices);
		};

		fetchPrices();
	}, [fromToken, toToken, chain]);

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

	// Handle swap success
	useEffect(() => {
		if (isSwapComplete && swapHash) {
			setIsSwapping(false);
			setSwapHash(undefined);
			if (swapToastId) {
				toast.dismiss(swapToastId);
				setSwapToastId(undefined);
			}
			toast.success("Swap successful!");
			fetchUserTokens(address!);
			// Reset form
			setFromAmount("");
			setToAmount("");
		}
	}, [isSwapComplete, swapHash, address, fetchUserTokens, swapToastId]);

	useEffect(() => {
		if (isConnected && address) {
			fetchUserTokens(address);
		}
	}, [isConnected, address, fetchUserTokens]);

	const fromTokenBalance =
		userTokens.find((t) => t.address === fromToken?.address)?.balance || "0";

	// Check if this is a WBLOCX -> BLOCX swap (needs approval for WBLOCX contract)
	const isWblocxToBlocx = fromToken?.symbol === "WBLOCX" && toToken?.symbol === "BLOCX";

	const { data: allowance, refetch: refetchAllowance } = useReadContract({
		abi: erc20Abi,
		address: fromToken?.address as `0x${string}` | undefined,
		functionName: "allowance",
		args: [address!, isWblocxToBlocx ? Weth9Contract.address : RouterContract.address],
		query: {
			enabled: !!address && !!fromToken && fromToken.symbol !== "BLOCX",
		},
	});

	const path = [
		fromToken?.symbol === "BLOCX"
			? Weth9Contract.address
			: (fromToken?.address as `0x${string}`),
		toToken?.symbol === "BLOCX"
			? Weth9Contract.address
			: (toToken?.address as `0x${string}`),
	].filter(Boolean);

	// Check if this is a direct BLOCX <-> WBLOCX swap (1:1 rate, no router needed)
	const isBlocxWblocxSwap =
		(fromToken?.symbol === "BLOCX" && toToken?.symbol === "WBLOCX") ||
		(fromToken?.symbol === "WBLOCX" && toToken?.symbol === "BLOCX");

	const { data: amountsOutData, isLoading: isLoadingAmountsOut, error: amountsOutError, } = useReadContract({
		address: RouterContract.address,
		abi: RouterContract.abi,
		functionName: "getAmountsOut",
		args: [
			parseUnits(fromAmount || "0", fromToken?.decimals || 18),
			path as [`0x${string}`, `0x${string}`],
		],
		query: {
			enabled:
				!isFlipped &&
				!!fromToken &&
				!!toToken &&
				fromToken.address !== toToken.address &&
				!isBlocxWblocxSwap &&
				!!fromAmount &&
				parseFloat(fromAmount) > 0 &&
				path.length === 2,
		},
	});

	useEffect(() => {
		if (!isFlipped && fromAmount && parseFloat(fromAmount) > 0) {
			console.log("Debug: getAmountsOut call args:", {
				amountIn: parseUnits(fromAmount, fromToken?.decimals || 18).toString(),
				path: path,
			});
		}
	}, [fromAmount, fromToken, path, isFlipped]);

	const { data: amountsInData, isLoading: isLoadingAmountsIn, error: amountsInError, } = useReadContract({
		address: RouterContract.address,
		abi: RouterContract.abi,
		functionName: "getAmountsIn",
		args: [
			parseUnits(toAmount || "0", toToken?.decimals || 18),
			path as [`0x${string}`, `0x${string}`],
		],
		query: {
			enabled:
				isFlipped &&
				!!fromToken &&
				!!toToken &&
				fromToken.address !== toToken.address &&
				!isBlocxWblocxSwap &&
				!!toAmount &&
				parseFloat(toAmount) > 0 &&
				path.length === 2,
		},
	});

	useEffect(() => {
		if (isFlipped && toAmount && parseFloat(toAmount) > 0) {
			console.log("Debug: getAmountsIn call args:", {
				amountOut: parseUnits(toAmount, toToken?.decimals || 18).toString(),
				path: path,
			});
		}
	}, [toAmount, toToken, path, isFlipped]);

	const isLoading = isLoadingAmountsOut || isLoadingAmountsIn;

	useEffect(() => {
		if (amountsOutError || amountsInError) {
			console.error(
				"Error fetching amounts:",
				amountsOutError || amountsInError
			);
			toast.error("Could not fetch price.");
		}
	}, [amountsOutError, amountsInError]);

	useEffect(() => {
		if (!isFlipped && amountsOutData && toToken) {
			console.log("Debug: getAmountsOut raw output:", amountsOutData);
			const formattedAmount = formatUnits(amountsOutData[1], toToken.decimals);
			const capped = toSignificantFigures(formattedAmount, 3);
			console.log(`Debug: Setting toAmount (exact input) to: ${capped}`);
			setToAmount(capped);
		}
	}, [amountsOutData, isFlipped, toToken]);

	useEffect(() => {
		if (isFlipped && amountsInData && fromToken) {
			console.log("Debug: getAmountsIn raw output:", amountsInData);
			const formattedAmount = formatUnits(amountsInData[0], fromToken.decimals);
			const capped = toSignificantFigures(formattedAmount, 3);
			console.log(`Debug: Setting fromAmount (exact output) to: ${capped}`);
			setFromAmount(capped);
		}
	}, [amountsInData, isFlipped, fromToken]);

	// Handle 1:1 conversion for BLOCX <-> WBLOCX swaps
	useEffect(() => {
		if (isBlocxWblocxSwap && fromAmount && !isFlipped) {
			// For BLOCX <-> WBLOCX, it's always 1:1
			setToAmount(fromAmount);
		} else if (isBlocxWblocxSwap && toAmount && isFlipped) {
			// For exact output, set fromAmount = toAmount
			setFromAmount(toAmount);
		}
	}, [isBlocxWblocxSwap, fromAmount, toAmount, isFlipped]);

	// Check approval needs with refetch after successful approval
	useEffect(() => {
		if (
			fromToken &&
			fromToken.symbol !== "BLOCX" &&
			fromAmount &&
			allowance !== undefined
		) {
			const amount = parseUnits(fromAmount, fromToken.decimals);
			setNeedsApproval(allowance < amount);
		} else {
			setNeedsApproval(false);
		}
	}, [fromAmount, fromToken, allowance]);

	// Handle body scroll when modal is open
	useEffect(() => {
		if (isModalOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "auto";
		}
		// Cleanup on unmount
		return () => {
			document.body.style.overflow = "auto";
		};
	}, [isModalOpen]);

	useEffect(() => {
		// Reset toAmount when there is no quote (but not for BLOCX <-> WBLOCX swaps)
		if (!isLoading && !amountsInData && !amountsOutData && !isBlocxWblocxSwap) {
			setToAmount("");
		}
	}, [fromAmount, isLoading, amountsInData, amountsOutData, isBlocxWblocxSwap]);

	useEffect(() => {
		if (error) {
			toast.error("an error occurred");
			// toast.error(error.name);
		}
	}, [error]);

	const handleFromAmountChange = (value: string) => {
		const parsed = parseAmount(value, fromToken?.decimals || 18);
		const capped = toSignificantFigures(parsed, 3);
		setFromAmount(capped);
		if (isFlipped) {
			setToAmount("");
		}
		setIsFlipped(false);
		setAmountsSwapped(false);
	};

	const handleToAmountChange = (value: string) => {
		const parsed = parseAmount(value, toToken?.decimals || 18);
		const capped = toSignificantFigures(parsed, 3);
		setToAmount(capped);
		if (!isFlipped) {
			setFromAmount("");
		}
		setIsFlipped(true);
		setAmountsSwapped(false);
	};

	const handleTokenSelect = (token: Token, isFromToken: boolean) => {
		setAmountsSwapped(false);
		if (isFromToken) {
			if (toToken?.address === token.address) {
				const currentFromToken = fromToken;
				setFromToken(toToken);
				setToToken(currentFromToken);
			} else {
				setFromToken(token);
			}
		} else {
			if (fromToken?.address === token.address) {
				const currentToToken = toToken;
				setToToken(fromToken);
				setFromToken(currentToToken);
			} else {
				setToToken(token);
			}
		}
	};

	const handleSwapTokens = () => {
		if (fromToken && toToken) {
			const newFromToken = toToken;
			const newToToken = fromToken;
			const newFromAmount = toAmount;
			const newToAmount = fromAmount;

			setFromToken(newFromToken);
			setToToken(newToToken);
			setFromAmount(newFromAmount);
			setToAmount(newToAmount);

			setAmountsSwapped(true);
			setIsFlipped(false);
		}
	};

	const handleApprove = async () => {
		if (!fromToken || !address) return;

		try {
			setIsApproving(true);
			// For WBLOCX -> BLOCX, approve WBLOCX contract. Otherwise approve Router.
			const spenderAddress = isWblocxToBlocx ? Weth9Contract.address : RouterContract.address;
			const hash = await writeContractAsync({
				address: fromToken.address as `0x${string}`,
				abi: erc20Abi,
				functionName: "approve",
				args: [spenderAddress, MaxUint256],
			});

			setApprovalHash(hash);
			const toastId = toast.loading(
				`Approving ${fromToken.symbol}... Please wait for confirmation.`
			);
			setApprovalToastId(toastId);
		} catch (err: unknown) {
			setIsApproving(false);
			const errorMessage = err instanceof Error ? err.message : 'Unknown error';
			toast.error(`Approval failed`);
			console.log(`Approval failed: ${errorMessage}`);
		}
	};

	const handleSwap = async () => {
		if (!fromToken || !toToken || !fromAmount || !toAmount || !address) {
			return;
		}

		// Check for insufficient balance
		if (hasInsufficientBalance()) {
			toast.error(`Insufficient ${fromToken.symbol} balance`);
			return;
		}

		try {
			setIsSwapping(true);
			let hash: `0x${string}`;

			// Special case: Direct BLOCX <-> WBLOCX swap using deposit/withdraw
			const isBlocxToWblocx = fromToken.symbol === "BLOCX" && toToken.symbol === "WBLOCX";
			const isWblocxToBlocx = fromToken.symbol === "WBLOCX" && toToken.symbol === "BLOCX";

			if (isBlocxToWblocx) {
				// BLOCX -> WBLOCX: Call deposit() on WBLOCX contract
				const amountIn = parseUnits(fromAmount, fromToken.decimals);
				hash = await writeContractAsync({
					address: Weth9Contract.address,
					abi: Weth9Contract.abi,
					functionName: "deposit",
					value: amountIn,
				});
			} else if (isWblocxToBlocx) {
				// WBLOCX -> BLOCX: Call withdraw() on WBLOCX contract
				const amountIn = parseUnits(fromAmount, fromToken.decimals);
				hash = await writeContractAsync({
					address: Weth9Contract.address,
					abi: Weth9Contract.abi,
					functionName: "withdraw",
					args: [amountIn],
				});
			} else {
				// Regular swap through router
				const deadlineTimestamp = BigInt(
					Math.floor(Date.now() / 1000) + 60 * deadline
				);
				const wethAddress = Weth9Contract.address;
				const swapPath = [
					fromToken.symbol === "BLOCX" ? wethAddress : fromToken.address,
					toToken.symbol === "BLOCX" ? wethAddress : toToken.address,
				].map((a) => a as `0x${string}`);

				let value: bigint | undefined = undefined;

				// Type-safe functionName and args
				if (isFlipped) {
					// Exact output
					const amountOut = parseUnits(toAmount, toToken.decimals);
					const amountInMax = parseUnits(
						(parseFloat(fromAmount) * (1 + slippage / 100)).toFixed(
							fromToken.decimals
						),
						fromToken.decimals
					);

					if (fromToken.symbol === "BLOCX") {
						// swapETHForExactTokens(uint amountOut, address[] path, address to, uint deadline)
						const functionName = "swapETHForExactTokens";
						const args: [
							bigint,
							readonly `0x${string}`[],
							`0x${string}`,
							bigint
						] = [
								amountOut,
								swapPath,
								address as `0x${string}`,
								deadlineTimestamp,
							];
						value = amountInMax;
						hash = await writeContractAsync({
							address: RouterContract.address,
							abi: RouterContract.abi,
							functionName,
							args,
							value,
						});
					} else if (toToken.symbol === "BLOCX") {
						// swapTokensForExactETH(uint amountOut, uint amountInMax, address[] path, address to, uint deadline)
						const functionName = "swapTokensForExactETH";
						const args: [
							bigint,
							bigint,
							readonly `0x${string}`[],
							`0x${string}`,
							bigint
						] = [
								amountOut,
								amountInMax,
								swapPath,
								address as `0x${string}`,
								deadlineTimestamp,
							];
						hash = await writeContractAsync({
							address: RouterContract.address,
							abi: RouterContract.abi,
							functionName,
							args,
						});
					} else {
						// swapTokensForExactTokens(uint amountOut, uint amountInMax, address[] path, address to, uint deadline)
						const functionName =
							"swapTokensForExactTokens";
						const args: [
							bigint,
							bigint,
							readonly `0x${string}`[],
							`0x${string}`,
							bigint
						] = [
								amountOut,
								amountInMax,
								swapPath,
								address as `0x${string}`,
								deadlineTimestamp,
							];
						hash = await writeContractAsync({
							address: RouterContract.address,
							abi: RouterContract.abi,
							functionName,
							args,
						});
					}
				} else {
					// Exact input
					const amountIn = parseUnits(fromAmount, fromToken.decimals);
					const amountOutMin = parseUnits(
						(parseFloat(toAmount) * (1 - slippage / 100)).toFixed(
							toToken.decimals
						),
						toToken.decimals
					);

					if (fromToken.symbol === "BLOCX") {
						// swapExactETHForTokens(uint amountOutMin, address[] path, address to, uint deadline)
						const functionName = "swapExactETHForTokens";
						const args: [
							bigint,
							readonly `0x${string}`[],
							`0x${string}`,
							bigint
						] = [
								amountOutMin,
								swapPath,
								address as `0x${string}`,
								deadlineTimestamp,
							];
						value = amountIn;
						hash = await writeContractAsync({
							address: RouterContract.address,
							abi: RouterContract.abi,
							functionName,
							args,
							value,
						});
					} else if (toToken.symbol === "BLOCX") {
						// swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] path, address to, uint deadline)
						const functionName = "swapExactTokensForETH";
						const args: [
							bigint,
							bigint,
							readonly `0x${string}`[],
							`0x${string}`,
							bigint
						] = [
								amountIn,
								amountOutMin,
								swapPath,
								address as `0x${string}`,
								deadlineTimestamp,
							];
						hash = await writeContractAsync({
							address: RouterContract.address,
							abi: RouterContract.abi,
							functionName,
							args,
						});
					} else {
						// swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] path, address to, uint deadline)
						const functionName =
							"swapExactTokensForTokens";
						const args: [
							bigint,
							bigint,
							readonly `0x${string}`[],
							`0x${string}`,
							bigint
						] = [
								amountIn,
								amountOutMin,
								swapPath,
								address as `0x${string}`,
								deadlineTimestamp,
							];
						hash = await writeContractAsync({
							address: RouterContract.address,
							abi: RouterContract.abi,
							functionName,
							args,
						});
					}
				}
			}

			setSwapHash(hash);
			const toastId = toast.loading(
				"Swapping... Please wait for confirmation."
			);
			setSwapToastId(toastId);
		} catch (err: unknown) {
			setIsSwapping(false);
			const errorMessage = err instanceof Error ? err.message : 'Unknown error';
			toast.error(`Swap failed`);
			console.error(`Swap failed: ${errorMessage}`);
		}
	};

	const openModal = (selection: "from" | "to") => {
		setSelectingFor(selection);
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setSelectingFor(null);
	};

	const handleTokenSelectFromModal = (token: Token) => {
		if (selectingFor === "from") {
			handleTokenSelect(token, true);
		} else if (selectingFor === "to") {
			handleTokenSelect(token, false);
		}
		closeModal();
	};

	// Check if user has sufficient balance
	const hasInsufficientBalance = () => {
		if (!fromToken || !fromAmount || !fromTokenBalance) return false;
		return parseFloat(fromAmount) > parseFloat(fromTokenBalance);
	};

	const canSwap =
		fromToken &&
		toToken &&
		fromAmount &&
		toAmount &&
		!isLoading &&
		!hasInsufficientBalance();

	const fromTokenPrice = fromToken ? tokenPrices[fromToken.address.toLowerCase()] || 0 : 0;
	const toTokenPrice = toToken ? tokenPrices[toToken.address.toLowerCase()] || 0 : 0;

	const fromAmountInUsd = fromAmount
		? (parseFloat(fromAmount) * fromTokenPrice).toFixed(2)
		: "0.00";
	const toAmountInUsd = toAmount
		? (parseFloat(toAmount) * toTokenPrice).toFixed(2)
		: "0.00";

	const getButtonText = () => {
		if (!isConnected) return "Connect Wallet";
		if (tokensLoading) return "Loading Balances...";
		if (isLoading) return "Calculating...";
		if (fromToken.address === toToken.address) return "Tokens cannot be the same";
		if (hasInsufficientBalance()) return "Insufficient Balance";
		if (isApproving || isConfirmingApproval)
			return `Approving ${fromToken?.symbol}...`;
		if (needsApproval) return `Approve ${fromToken?.symbol}`;
		if (isSwapping || isConfirmingSwap) return "Swapping...";
		return "Swap";
	};

	const isButtonDisabled = () => {
		if (!isConnected) return false; // Always enabled to connect
		if (fromToken.address === toToken.address) return true;
		if (hasInsufficientBalance()) return true; // Disable if insufficient balance
		if (needsApproval) return isApproving || isConfirmingApproval;
		return (
			!canSwap ||
			isApproving ||
			isConfirmingApproval ||
			isSwapping ||
			isConfirmingSwap ||
			tokensLoading
		);
	};

	const handleButtonClick = () => {
		if (!isConnected) {
			openConnectModal?.();
			return;
		}
		if (needsApproval) {
			handleApprove();
		} else {
			handleSwap();
		}
	};

	const minimumReceived = () => {
		if (!toAmount || isFlipped || isLoading) return null;
		const minReceived = parseFloat(toAmount) * (1 - slippage / 100);
		return formatNumber(minReceived.toString(), 6);
	};

	const getRate = () => {
		if (
			!fromAmount ||
			!toAmount ||
			parseFloat(fromAmount) <= 0 ||
			parseFloat(toAmount) <= 0
		) {
			return null;
		}
		if (isFlipped) {
			return parseFloat(fromAmount) / parseFloat(toAmount);
		}
		return parseFloat(toAmount) / parseFloat(fromAmount);
	};
	const rate = getRate();

	return (
		<>
			<div className="flex flex-col items-center w-full px-4 sm:px-6 lg:px-8 max-w-md mx-auto lg:max-w-4xl">
				<div className="w-full max-w-xs sm:max-w-2xl flex flex-col items-center">
					{/* Main Swap Container - Keep your existing backdrop blur styling */}
					<div className="backdrop-blur-lg bg-white/20 rounded-2xl lg:rounded-2xl shadow-xl border border-white/40 overflow-hidden w-full">
						{/* Header Section - Maintain your current header */}
						<div className="p-4 sm:p-6 lg:p-8">
							<div className="flex items-center justify-between w-full">
								<div className="text-xl sm:text-2xl font-bold cursor-default transition-all duration-200 text-black px-2 py-1">
									Swap
								</div>
								<div className="relative">
									<button
										className="text-xl sm:text-2xl text-gray-400 cursor-pointer hover:text-gray-600 p-3 rounded-full transition-all duration-200 focus:outline-none active:scale-95 touch-manipulation"
										onClick={() => setIsSettingsModalOpen((prev) => !prev)}
									>
										<Settings className="w-5 h-5 sm:w-6 sm:h-6" />
									</button>
									<SettingsModal
										isOpen={isSettingsModalOpen}
										onClose={() => setIsSettingsModalOpen(false)}
										slippage={slippage}
										setSlippage={setSlippage}
										deadline={deadline}
										setDeadline={setDeadline}
										className="absolute top-full right-0 mt-2 z-50"
									/>
								</div>
							</div>
						</div>

						<div className="flex flex-col mx-auto">
							{/* Sell Section */}
							<div className="bg-white bg-opacity-50 backdrop-blur-sm p-4 sm:p-6 lg:p-6 rounded-xl relative">
								<div className="flex items-center justify-between mb-3">
									<span className="text-sm sm:text-base font-semibold text-gray-600">
										Sell
									</span>
									<div className="text-sm text-gray-500">
										<button
											onClick={() => handleFromAmountChange(fromTokenBalance)}
											className="ml-2 text-blue-600 hover:text-blue-800 font-semibold"
										>
											Max
										</button>
									</div>
								</div>
								<div className="flex items-center gap-3 lg:gap-4">
									<input
										type="text"
										value={fromAmount}
										onChange={(e) => handleFromAmountChange(e.target.value)}
										placeholder="0.0"
										inputMode="decimal"
										autoComplete="off"
										spellCheck="false"
										className="flex-1 bg-transparent text-2xl sm:text-3xl lg:text-4xl font-bold text-black placeholder-black outline-none focus:placeholder-black transition-colors min-w-0"
									/>
									<TokenSelector
										selectedToken={fromToken || null}
										onClick={() => openModal("from")}
									/>
								</div>
								<div className="mt-3 text-right h-5">
									{fromAmount && (
										<span className="text-sm text-gray-400 pr-2">
											~${fromAmountInUsd}
										</span>
									)}
								</div>

								<button
									onClick={handleSwapTokens}
									disabled={amountsSwapped || !fromToken || !toToken}
									aria-label="Swap tokens"
									className="absolute left-1/2 bottom-[-40px] z-10 -translate-x-1/2 bg-white rounded-full p-3 lg:p-4 shadow-lg border-2 border-white/20 transition-all duration-200 hover:bg-gray-50 hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 touch-manipulation"
								>
									<ArrowDown className="w-4 h-4 lg:w-6 lg:h-6 text-gray-600" />
								</button>
							</div>

							{/* Buy Section */}
							<div className="bg-white bg-opacity-50 backdrop-blur-sm p-4 sm:p-6 lg:p-6 rounded-xl mt-8">
								<div className="flex items-center justify-between mb-3">
									<span className="text-sm sm:text-base font-semibold text-gray-600">
										Buy
									</span>
								</div>
								{isLoading && (
									<div className="flex items-center gap-2 mb-2">
										<div className="w-4 h-4 border-2 border-gray-400/30 border-t-gray-600 rounded-full animate-spin" />
										<span className="text-xs text-gray-600">
											Calculating...
										</span>
									</div>
								)}
								<div className="flex items-center gap-3 lg:gap-4">
									<input
										type="text"
										value={toAmount}
										onChange={(e) => handleToAmountChange(e.target.value)}
										placeholder="0.0"
										inputMode="decimal"
										autoComplete="off"
										spellCheck="false"
										className="flex-1 bg-transparent text-2xl sm:text-3xl lg:text-4xl font-bold text-black placeholder-black outline-none focus:placeholder-black transition-colors min-w-0"
									/>
									<TokenSelector
										selectedToken={toToken}
										onClick={() => openModal("to")}
									/>
								</div>
								<div className="mt-3 text-right h-5">
									{toAmount && (
										<span className="text-sm text-gray-400">
											~${toAmountInUsd}
										</span>
									)}
								</div>
							</div>

							{/* Rate Section */}
							{rate && !isLoading && (
								<div className="bg-white/30 backdrop-blur-sm border-t border-white/20 p-4 sm:p-6 mt-1">
									<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
										<span className="text-xs md:text-sm font-medium text-gray-600">
											Rate
										</span>
										<span className="text-xs md:text-sm font-bold">
											1 {isFlipped ? toToken?.symbol : fromToken?.symbol} ={" "}
											{formatNumber(rate.toString(), 6)}{" "}
											{isFlipped ? fromToken?.symbol : toToken?.symbol}
										</span>
									</div>
									{!isFlipped && minimumReceived() && (
										<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2 border-t border-white/20 mt-2">
											<span className="text-xs md:text-sm font-medium text-gray-600">
												Minimum Received
											</span>
											<span className="text-xs md:text-sm font-bold">
												{minimumReceived()} {toToken?.symbol}
											</span>
										</div>
									)}
								</div>
							)}
						</div>
					</div>

					<button
						onClick={handleButtonClick}
						disabled={isButtonDisabled()}
						className={`w-full mt-4 py-3 sm:py-4 rounded-full text-lg md:text-xl font-bold shadow-md transition-all duration-200 ${!isButtonDisabled()
							? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transform hover:scale-[1.02]"
							: "bg-gray-300 text-gray-500 cursor-not-allowed"
							}`}
					>
						{getButtonText()}
					</button>
				</div>
			</div>

			<TokenModal
				isOpen={isModalOpen}
				onClose={closeModal}
				onTokenSelect={handleTokenSelectFromModal}
			/>
		</>
	);
};

export default SwapForm;
