import FarmForm from "../components/FarmForm"

const Farms = () => {
    return (
        <div className="w-full min-h-screen bg-[#a7d8f5] flex flex-col justify-between">
            {/* Hero Section - Farms Style */}
            <div className="flex flex-col md:flex-row items-center justify-center w-full px-8 pt-20 pb-8 flex-1 relative">
                {/* Floating Tomatoes */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute left-1/3 top-10 text-5xl rotate-[-10deg] opacity-80 blur-sm animate-pulse">🍅</div>
                    <div className="absolute right-20 top-0 text-4xl rotate-[15deg] opacity-80 blur-sm animate-pulse">🍅</div>
                    <div className="absolute right-40 bottom-32 text-6xl rotate-[-5deg] opacity-80 blur-sm animate-pulse">🍅</div>
                    <div className="absolute left-1/2 bottom-10 text-5xl rotate-[8deg] opacity-80 blur-sm animate-pulse">🍅</div>
                    <div className="absolute left-1/5 bottom-10 text-5xl rotate-[6deg] opacity-80 blur-sm animate-pulse">🍅</div>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center z-10">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-[#2d3e3e] drop-shadow-lg text-center tracking-wide" style={{ fontFamily: 'Fredoka One, sans-serif' }}>
                        Farm Your Tokens
                    </h1>
                    <p className="text-xl text-[#2d3e3e] mt-4 text-center">
                        Stake your LP tokens to earn high rewards.
                    </p>
                </div>
            </div>

            {/* Farm Management Section */}
            <div className="flex flex-col items-center justify-center w-full py-8">
                <div className="flex flex-col md:flex-row gap-6 w-full max-w-3xl justify-center">
                    <div className="bg-[#f6f6f6] rounded-2xl shadow-md flex-1 p-6 flex flex-col justify-between min-w-[250px]">
                        <h3 className="text-xl font-bold text-black mb-2">Stake LP Tokens</h3>
                        <p className="text-[#b0c4d4] mb-4">Deposit your liquidity provider tokens to earn FARM rewards.</p>
                        <FarmForm />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Farms