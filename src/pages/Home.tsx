import Footer from "../components/Footer"
import NavBar from "../components/NavBar"
import { Link } from "react-router-dom"

const Home = () => {
    return (
        <div className="w-full min-h-screen bg-[#a7d8f5] flex flex-col justify-between">
            <NavBar />
            {/* Hero Section - FarmrSwap Style */}
            <div className="flex flex-col md:flex-row items-center justify-between w-full px-8 pt-20 pb-8 flex-1 relative">
                {/* Tomato Farmer (left) */}
                <div className="flex-1 flex flex-col items-center md:items-start z-10">
                    <span className="text-[10rem] md:text-[14rem]">🍅</span>
                    {/* You can replace the emoji with an SVG for a real mascot */}
                </div>

                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute left-1/3 top-10 text-5xl rotate-[-10deg] opacity-80 blur-sm animate-pulse">🍅</div>
                    <div className="absolute right-20 top-0 text-4xl rotate-[15deg] opacity-80 blur-sm animate-pulse">🍅</div>
                    <div className="absolute right-40 bottom-32 text-6xl rotate-[-5deg] opacity-80 blur-sm animate-pulse">🍅</div>
                    <div className="absolute left-1/2 bottom-10 text-5xl rotate-[8deg] opacity-80 blur-sm animate-pulse">🍅</div>
                    <div className="absolute left-1/5 bottom-10 text-5xl rotate-[6deg] opacity-80 blur-sm animate-pulse">🍅</div>
                </div>
                {/* Floating Tomatoes */}

                {/* Slogan (right) */}
                <div className="flex-1 flex flex-col items-center md:items-end justify-center z-10">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-[#2d3e3e] drop-shadow-lg text-right tracking-wide" style={{ fontFamily: 'Fredoka One, sans-serif' }}>
                        SWAP.<br />
                        STAKE AND EARN. WIN.
                    </h1>
                </div>
            </div>
            {/* Get Started Section */}
            <div className="flex flex-col items-center justify-center w-full py-8">
                <Link to="/swap">
                    <button className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-10 rounded-md text-lg mb-4 transition">Get started</button>
                </Link>
            </div>
            {/* Features Section */}
            <div className="w-full px-8 pb-12 flex flex-col items-center">
                <div className="flex flex-col md:flex-row gap-6 w-full max-w-3xl justify-center">
                    <div className="bg-[#22314a] rounded-2xl shadow-md flex-1 p-6 flex flex-col justify-between min-w-[250px]">
                        <h3 className="text-xl font-bold text-white mb-2">Swap Tokens</h3>
                        <p className="text-[#b0c4d4] mb-4">Buy, sell, and explore tokens on FarmrSwap.</p>
                    </div>
                    <div className="bg-[#22314a] rounded-2xl shadow-md flex-1 p-6 flex flex-col justify-between min-w-[250px]">
                        <h3 className="text-xl font-bold text-white mb-2">Stake</h3>
                        <p className="text-[#b0c4d4] mb-4">Stake your tokens to earn a share of trading fees from all DEX trades.</p>
                    </div>
                </div>
                <div className="flex justify-center w-full max-w-3xl mt-6">
                    <div className="bg-[#22314a] rounded-2xl shadow-md w-full p-6 flex flex-col justify-between min-w-[250px]">
                        <h3 className="text-xl font-bold text-white mb-2">Earn</h3>
                        <p className="text-[#b0c4d4] mb-4">Provide liquidity to pools and earn swap fees on FarmrSwap.</p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Home