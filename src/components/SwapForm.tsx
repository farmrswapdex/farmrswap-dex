import { useConnectModal } from "@rainbow-me/rainbowkit";

const SwapForm = () => {
    const { openConnectModal } = useConnectModal();

    return (
        <div className="w-full max-w-md bg-white/60 rounded-3xl shadow-lg p-8 flex flex-col items-center">
            {/* Tabs */}
            <div className="flex items-center gap-6 mb-6 w-full">
                <span className="text-3xl font-bold text-black">Swap</span>
                <span className="text-3xl font-bold text-gray-300">Limit</span>
                <span className="ml-auto text-2xl text-gray-400 cursor-pointer">
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-sliders"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
                </span>
            </div>
            {/* Swap Box */}
            <div className="w-full bg-[#f6f6f6] rounded-2xl p-6 flex flex-col gap-4">
                {/* Sell Section */}
                <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-semibold text-gray-700">Sell</span>
                    <span className="text-2xl text-gray-300">0</span>
                </div>
                <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center bg-white rounded-full px-4 py-2 gap-2 shadow">
                        <span className="w-7 h-7 rounded-full bg-black flex items-center justify-center">
                            {/* Placeholder for VIC token icon */}
                            <span className="block w-5 h-5 bg-yellow-400 rounded-full"></span>
                        </span>
                        <span className="font-semibold text-black">VIC</span>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                </div>
                {/* Arrow Divider */}
                <div className="flex items-center justify-center my-2">
                    <div className="w-full h-0.5 bg-gray-200 relative">
                        <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-white rounded-full p-2 shadow flex items-center justify-center">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7H5" /></svg>
                        </span>
                    </div>
                </div>
                {/* Buy Section */}
                <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-semibold text-gray-700">Buy</span>
                    <span className="text-2xl text-gray-300">0</span>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center bg-yellow-300 rounded-full px-4 py-2 gap-2 shadow font-semibold text-black">
                        Select token
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                </div>
            </div>
            {/* Connect Wallet Button */}
            <button onClick={openConnectModal} className="w-full mt-8 py-4 rounded-full bg-blue-200 text-xl font-bold text-black shadow-md hover:bg-blue-300 transition">
                Connect Wallet
            </button>
        </div>
    );
};

export default SwapForm;
