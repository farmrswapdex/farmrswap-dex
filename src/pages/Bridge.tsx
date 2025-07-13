import Footer from "../components/Footer";
import { Wallet, ArrowRight } from "lucide-react";
import { useAccount, useConnect } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';

const Bridge = () => {
    const { isConnected } = useAccount();
    const { openConnectModal } = useConnectModal();

    return (
        <div className="w-full min-h-screen bg-[#a7d8f5] flex flex-col justify-between">
            <div className="flex flex-col items-center justify-center flex-1 w-full px-4 pt-20 pb-8">
                <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8 flex flex-col gap-6">
                    {/* Tabs and Wallet Icon */}
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex gap-2">
                            <button className="px-6 py-2 rounded-full font-semibold text-[#2d3e3e] bg-[#f6f6f6] shadow border border-gray-200 focus:outline-none">Deposit</button>
                            <button className="px-6 py-2 rounded-full font-semibold text-[#b0c4d4] bg-transparent">Withdraw</button>
                        </div>
                        <button className="p-2 rounded-full hover:bg-[#f6f6f6] transition border border-gray-200">
                            <Wallet className="w-6 h-6 text-[#2d3e3e]" />
                        </button>
                    </div>

                    {/* Chain Selection */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex flex-col flex-1">
                            <span className="text-[#b0c4d4] text-sm mb-1">From</span>
                            <div className="flex items-center gap-2 bg-[#f6f6f6] rounded-full px-4 py-2 w-full">
                                <span className="w-6 h-6 rounded-full flex items-center justify-center bg-[#7c6dfa]"><img src="https://cryptologos.cc/logos/ethereum-eth-logo.png" alt="Ethereum" className="w-5 h-5" /></span>
                                <span className="font-semibold text-[#2d3e3e] text-base">Ethereum</span>
                            </div>
                        </div>
                        <ArrowRight className="w-6 h-6 text-[#b0c4d4] mx-2" />
                        <div className="flex flex-col flex-1">
                            <span className="text-[#b0c4d4] text-sm mb-1">To</span>
                            <div className="flex items-center gap-2 bg-[#f6f6f6] rounded-full px-4 py-2 w-full">
                                <span className="w-6 h-6 rounded-full flex items-center justify-center bg-black"><img src="https://cryptologos.cc/logos/viction-vic-logo.png" alt="Viction" className="w-5 h-5" /></span>
                                <span className="font-semibold text-[#2d3e3e] text-base">BLOCKX</span>
                            </div>
                        </div>
                    </div>

                    {/* You Send */}
                    <div className="bg-[#f6f6f6] rounded-xl p-5 flex flex-col gap-2">
                        <span className="font-bold text-[#2d3e3e] text-lg mb-1">You Send</span>
                        <div className="flex items-center gap-3">
                            <span className="w-12 h-12 rounded-full flex items-center justify-center bg-white border border-gray-200">
                                <img src="https://cryptologos.cc/logos/tether-usdt-logo.png" alt="USDT" className="w-8 h-8" />
                                <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png" alt="ETH" className="w-4 h-4 absolute ml-6 mt-6" style={{ marginLeft: '-18px', marginTop: '18px' }} />
                            </span>
                            <span className="font-semibold text-[#2d3e3e] text-base">USDT</span>
                            <div className="flex-1"></div>
                            <span className="text-3xl font-bold text-[#b0c4d4] select-none">0</span>
                        </div>
                    </div>

                    {/* You Receive */}
                    <div className="bg-[#f6f6f6] rounded-xl p-5 flex flex-col gap-2">
                        <span className="font-bold text-[#2d3e3e] text-lg mb-1">You Receive</span>
                        <div className="flex items-center gap-3">
                            <span className="w-12 h-12 rounded-full flex items-center justify-center bg-white border border-gray-200">
                                <img src="https://cryptologos.cc/logos/tether-usdt-logo.png" alt="USDT" className="w-8 h-8" />
                                <img src="https://cryptologos.cc/logos/viction-vic-logo.png" alt="VIC" className="w-4 h-4 absolute ml-6 mt-6" style={{ marginLeft: '-18px', marginTop: '18px' }} />
                            </span>
                            <span className="font-semibold text-[#2d3e3e] text-base">USDT</span>
                        </div>
                    </div>

                    {/* CTA Button */}
                    {isConnected ? (
                        <button className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl py-4 rounded-full shadow transition" onClick={() => {/* bridge logic here */ }}>
                            Bridge
                        </button>
                    ) : (
                        <button className="w-full mt-2 bg-blue-200 hover:bg-blue-300 text-[#2d3e3e] font-bold text-xl py-4 rounded-full shadow transition" onClick={openConnectModal}>
                            Connect Wallet
                        </button>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Bridge;