import Footer from "../components/Footer"
import NavBar from "../components/NavBar"
import { Link } from "react-router-dom"

const Home = () => {
    return (
        <div className="w-full min-h-screen bg-[#a7d8f5] flex flex-col justify-between overflow-hidden">
            <NavBar />
            {/* Hero Section - FarmrSwap Style */}
            <div className="flex flex-col md:flex-row items-center justify-between w-full px-8 pt-20 pb-8 flex-1 relative">
                {/* Tomato Farmer (left) */}
                <div className="flex-1 flex flex-col items-center md:items-start z-10 animate-fade-in-left">
                    <span className="text-[10rem] md:text-[14rem] transform hover:scale-110 transition-transform duration-300">🍅</span>
                    {/* You can replace the emoji with an SVG for a real mascot */}
                </div>

                {/* Floating Tomatoes */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute left-1/3 top-10 text-5xl rotate-[-10deg] opacity-80 blur-sm animate-float-1">🍅</div>
                    <div className="absolute right-20 top-0 text-4xl rotate-[15deg] opacity-80 blur-sm animate-float-2">🍅</div>
                    <div className="absolute right-40 bottom-32 text-6xl rotate-[-5deg] opacity-80 blur-sm animate-float-3">🍅</div>
                    <div className="absolute left-1/2 bottom-10 text-5xl rotate-[8deg] opacity-80 blur-sm animate-float-4">🍅</div>
                    <div className="absolute left-1/5 bottom-10 text-5xl rotate-[6deg] opacity-80 blur-sm animate-float-5">🍅</div>
                </div>

                {/* Slogan (right) */}
                <div className="flex-1 flex flex-col items-center md:items-end justify-center z-10 animate-fade-in-right">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-[#2d3e3e] drop-shadow-lg text-right tracking-wide" style={{ fontFamily: 'Fredoka One, sans-serif' }}>
                        SWAP.<br />
                        STAKE AND EARN.<br />
                        WIN.
                    </h1>
                    <p className="text-xl md:text-2xl text-[#2d3e3e] mt-4 text-right max-w-md">
                        Your hub for seamless token swaps, staking, and rewarding liquidity provision.
                    </p>
                </div>
            </div>
            {/* Get Started Section */}
            <div className="flex flex-col items-center justify-center w-full py-8 animate-fade-in-up">
                <Link to="/swap">
                    <button className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-10 rounded-md text-lg mb-4 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                        Get started
                    </button>
                </Link>
            </div>
            {/* Features Section */}
            <div className="w-full px-8 pb-12 flex flex-col items-center">
                <h2 className="text-4xl font-bold text-[#2d3e3e] mb-10 animate-fade-in">Why FarmrSwap?</h2>
                <div className="flex flex-col md:flex-row gap-6 w-full max-w-5xl justify-center">
                    <div className="bg-[#22314a] rounded-2xl shadow-md flex-1 p-6 flex flex-col justify-between min-w-[250px] transform hover:scale-105 transition-transform duration-300 animate-fade-in-up delay-100">
                        <h3 className="text-xl font-bold text-white mb-2">Swap Tokens Instantly</h3>
                        <p className="text-[#b0c4d4] mb-4">
                            Effortlessly exchange any token with minimal fees and fast transactions.
                        </p>
                        <Link to="/swap" className="text-blue-400 hover:text-blue-300 transition-colors">Learn More &rarr;</Link>
                    </div>
                    <div className="bg-[#22314a] rounded-2xl shadow-md flex-1 p-6 flex flex-col justify-between min-w-[250px] transform hover:scale-105 transition-transform duration-300 animate-fade-in-up delay-200">
                        <h3 className="text-xl font-bold text-white mb-2">Stake & Earn Passive Income</h3>
                        <p className="text-[#b0c4d4] mb-4">
                            Maximize your holdings with attractive APYs.
                        </p>
                        <Link to="/farms" className="text-blue-400 hover:text-blue-300 transition-colors">Start Staking &rarr;</Link>
                    </div>
                    <div className="bg-[#22314a] rounded-2xl shadow-md flex-1 p-6 flex flex-col justify-between min-w-[250px] transform hover:scale-105 transition-transform duration-300 animate-fade-in-up delay-300">
                        <h3 className="text-xl font-bold text-white mb-2">Provide Liquidity & Get Rewarded</h3>
                        <p className="text-[#b0c4d4] mb-4">
                            Become a liquidity provider and earn swap fees on every trade that utilizes your provided assets.
                        </p>
                        <Link to="/pools" className="text-blue-400 hover:text-blue-300 transition-colors">Add Liquidity &rarr;</Link>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Home