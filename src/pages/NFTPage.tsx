import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useState } from 'react';

const NFTPage = () => {
	const { openConnectModal } = useConnectModal();
	const { isConnected } = useAccount();
	const [isMinting, setIsMinting] = useState(false);
	const [mintSuccess, setMintSuccess] = useState(false);
	const [txHash, setTxHash] = useState('');

	const handleMint = async () => {
		if (!isConnected) {
			openConnectModal?.();
			return;
		}
		setIsMinting(true);
		setMintSuccess(false);
		// Mock minting process
		console.log('Minting NFT...');
		await new Promise(resolve => setTimeout(resolve, 2000));
		setIsMinting(false);
		setMintSuccess(true);
		const mockTxHash = '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
		setTxHash(mockTxHash);
		console.log(`Mint successful, tx hash: ${mockTxHash}`);
	};

	return (
		<div className="w-full min-h-screen bg-[#a7d8f5]">
			{/* Floating Tomatoes Background - reusing from other pages */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-[10%] left-[15%] text-5xl rotate-[-10deg] opacity-20 blur-sm animate-pulse">🍅</div>
				<div className="absolute top-[5%] right-[10%] text-4xl rotate-[15deg] opacity-20 blur-sm animate-pulse">🍅</div>
				<div className="absolute bottom-[20%] right-[15%] text-6xl rotate-[-5deg] opacity-20 blur-sm animate-pulse">🍅</div>
				<div className="absolute bottom-[10%] left-[45%] text-5xl rotate-[8deg] opacity-20 blur-sm animate-pulse">🍅</div>
			</div>

			<div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
				<div className="w-full max-w-md backdrop-blur-lg rounded-2xl shadow-lg p-8 flex flex-col items-center bg-white/50 text-center">
					<h2 className="text-4xl font-bold text-gray-800 mb-4" style={{ fontFamily: "Fredoka One, sans-serif" }}>Mint a Farmr NFT</h2>
					<p className="text-gray-600">Get your unique Farmr NFT and join the community!</p>

						<div className="flex justify-center rounded-lg">
							<iframe
								src="https://lottie.host/embed/c73a7da7-1e70-4636-8322-575f1376bb2e/u7JGvit7Kl.lottie"
								className="w-64 h-64 border-0"
								title="Growing Tomatoes Animation"
							></iframe>
						</div>

					<div className="w-full mt-2">
						{!isConnected ? (
							<button onClick={openConnectModal} className="w-full py-3 rounded-xl text-lg font-bold transition-all duration-200 bg-blue-600 text-white hover:bg-blue-700">
								Connect Wallet to Mint
							</button>
						) : (
							<button
								onClick={handleMint}
								disabled={isMinting}
								className="w-full py-3 rounded-xl text-lg font-bold transition-all duration-200 bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
							>
								{isMinting ? 'Minting...' : 'Mint Now'}
							</button>
						)}
					</div>

					{mintSuccess && (
						<div className="mt-6 text-green-700 bg-green-100/50 rounded-xl p-4 w-full">
							<p className="font-bold">Mint Successful!</p>
							<p className="text-sm">Your NFT has been minted.</p>
							<a
								href={`https://etherscan.io/tx/${txHash}`}
								target="_blank"
								rel="noopener noreferrer"
								className="text-xs text-blue-600 hover:underline mt-2 block"
							>
								View on Etherscan
							</a>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default NFTPage;
