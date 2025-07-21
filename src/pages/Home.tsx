import { Link } from "react-router-dom";
import FeatureCard from "../components/FeatureCard";

const features = [
    {
        title: "Instant Swaps",
        description: "Exchange tokens in a flash with our optimized routing.",
        emoji: "🔄",
    },
    {
        title: "Lucrative Farms",
        description: "Stake your assets and watch your harvest grow with high APYs.",
        emoji: "🌾",
    },
    {
        title: "Deep Liquidity",
        description: "Provide liquidity to earn fees and support the ecosystem.",
        emoji: "💧",
    },
    {
        title: "Secure & Reliable",
        description: "Audited contracts and a commitment to your security.",
        emoji: "🛡️",
    }
];

const Home = () => {
    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-[#a7d8f5] to-[#d1e8f7] flex flex-col justify-between overflow-hidden">

            {/* Hero Section */}
            <div className="relative flex flex-col items-center justify-center text-center px-4 pt-24 pb-16 flex-1">
                {/* Floating Tomatoes */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute left-1/3 top-10 text-5xl rotate-[-10deg] opacity-80 blur-sm animate-pulse">🍅</div>
                    <div className="absolute right-20 top-0 text-4xl rotate-[15deg] opacity-80 blur-sm animate-pulse">🍅</div>
                    <div className="absolute right-40 bottom-32 text-6xl rotate-[-5deg] opacity-80 blur-sm animate-pulse">🍅</div>
                    <div className="absolute left-1/2 bottom-10 text-5xl rotate-[8deg] opacity-80 blur-sm animate-pulse">🍅</div>
                    <div className="absolute left-1/5 bottom-10 text-5xl rotate-[6deg] opacity-80 blur-sm animate-pulse">🍅</div>
                </div>
                <div className="bg-white/30 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-lg animate-fade-in-up border border-white/20 z-10">
                    <h1 className="text-5xl md:text-7xl font-extrabold text-[#2d3e3e] drop-shadow-lg tracking-tight" style={{ fontFamily: 'Fredoka One, sans-serif' }}>
                        The Future of Farming is Here.
                    </h1>
                    <p className="text-xl md:text-2xl text-[#2d3e3e] mt-6 max-w-2xl mx-auto">
                        Swap, stake, and earn with FarmrSwap – the most rewarding DeFi experience.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
                        <Link to="/swap">
                            <button className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-10 rounded-full text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg w-full sm:w-auto">
                                Launch App
                            </button>
                        </Link>
                        <Link to="/pools">
                            <button className="bg-transparent hover:bg-white/20 text-blue-600 font-semibold py-3 px-10 rounded-full text-lg transition-all duration-300 border border-blue-600 w-full sm:w-auto">
                                Get Started
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Sliding Cards Section */}
            <div className="w-full py-12 flex flex-col items-center bg-white/20 backdrop-blur-sm">
                <h2 className="text-4xl font-bold text-[#2d3e3e] mb-10">Why You'll Love FarmrSwap</h2>
                <div className="w-full max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, i) => (
                            <FeatureCard
                                key={i}
                                title={feature.title}
                                description={feature.description}
                                emoji={feature.emoji}
                            />
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
};


export default Home;