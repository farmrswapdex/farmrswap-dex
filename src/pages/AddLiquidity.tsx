import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import AddLiquidityForm from '../components/AddLiquidityForm';
import TokenModal from '../components/TokenModal';
import TokenSelector from '../components/TokenSelector';
import { NATIVE_TOKEN } from '../lib/constants';

// Token type
interface Token {
    symbol: string;
    name: string;
    address: string;
    decimals: number;
    logoURI: string;
    color: string;
}

const AddLiquidity = () => {
    const { openConnectModal } = useConnectModal();
    const { isConnected } = useAccount();
    const [step, setStep] = useState(1);
    const [tokenA, setTokenA] = useState<Token | null>(NATIVE_TOKEN);
    const [tokenB, setTokenB] = useState<Token | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectingFor, setSelectingFor] = useState<'A' | 'B' | null>(null);

    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isModalOpen]);

    const openModal = (which: 'A' | 'B') => {
        setSelectingFor(which);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectingFor(null);
    };

    const handleTokenSelect = (token: Token) => {
        if (selectingFor === 'A') {
            if (tokenB?.symbol === token.symbol) {
                setTokenB(tokenA);
            }
            setTokenA(token);
        } else if (selectingFor === 'B') {
            if (tokenA?.symbol === token.symbol) {
                setTokenA(tokenB);
            }
            setTokenB(token);
        }
        closeModal();
    };

    const handleContinue = () => {
        if (tokenA && tokenB && tokenA.symbol !== tokenB.symbol) {
            setStep(2);
        }
    };

    const handleBack = () => setStep(1);

    const getStep1Button = () => {
        const buttonClass = "w-full mt-4 py-3 rounded-xl text-lg font-bold transition-all duration-200";
        if (!isConnected) {
            return <button onClick={openConnectModal} className={`${buttonClass} bg-blue-600 text-white hover:bg-blue-700`}>Connect Wallet</button>;
        }
        return <button
            className={`${buttonClass} ${tokenA && tokenB && tokenA.symbol !== tokenB.symbol ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            disabled={!(tokenA && tokenB && tokenA.symbol !== tokenB.symbol)}
            onClick={handleContinue}
        >
            Continue
        </button>;
    }

    return (
        <div className="w-full min-h-screen bg-[#a7d8f5]">
            {/* Floating Tomatoes Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] left-[15%] text-5xl rotate-[-10deg] opacity-20 blur-sm animate-pulse">🍅</div>
                <div className="absolute top-[5%] right-[10%] text-4xl rotate-[15deg] opacity-20 blur-sm animate-pulse">🍅</div>
                <div className="absolute bottom-[20%] right-[15%] text-6xl rotate-[-5deg] opacity-20 blur-sm animate-pulse">🍅</div>
                <div className="absolute bottom-[10%] left-[45%] text-5xl rotate-[8deg] opacity-20 blur-sm animate-pulse">🍅</div>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
                <div className="w-full max-w-lg backdrop-blur-lg rounded-2xl shadow-lg p-6 flex flex-col items-center bg-white/50">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Add Liquidity</h2>
                    <p className="text-gray-600 mb-6">Provide liquidity to earn fees.</p>

                    {/* Stepper */}
                    <div className="w-full flex items-center justify-center gap-8 mb-8">
                        <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold ${step === 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>1</div>
                            <span className={`font-semibold text-base ${step === 1 ? 'text-gray-800' : 'text-gray-500'}`}>Select Pair</span>
                        </div>
                        <div className={`flex-1 h-1 rounded-full ${step === 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                        <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold ${step === 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>2</div>
                            <span className={`font-semibold text-base ${step === 2 ? 'text-gray-800' : 'text-gray-500'}`}>Add Amounts</span>
                        </div>
                    </div>

                    {step === 1 && (
                        <div className="w-full flex flex-col gap-4">
                            <p className="text-center text-gray-700 mb-2">Choose the two tokens you want to provide liquidity for.</p>
                            <div className="flex items-center justify-center gap-4">
                                <TokenSelector
                                    selectedToken={tokenA}
                                    onClick={() => openModal('A')}
                                />
                                <span className="text-2xl font-bold text-gray-500">+</span>
                                <TokenSelector
                                    selectedToken={tokenB}
                                    onClick={() => openModal('B')}
                                />
                            </div>
                            <div className="bg-blue-100/50 text-blue-800 text-sm rounded-xl px-4 py-3 mt-4 text-center">
                                All pools have a fixed 0.3% fee for providing liquidity.
                            </div>
                            {getStep1Button()}
                        </div>
                    )}

                    {step === 2 && tokenA && tokenB && (
                        <AddLiquidityForm
                            tokenA={tokenA}
                            tokenB={tokenB}
                            onBack={handleBack}
                        />
                    )}
                </div>
            </div>
            <TokenModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onTokenSelect={handleTokenSelect}
            />
        </div>
    );
};

export default AddLiquidity;
