import Footer from "../components/Footer"
import SwapForm from '../components/SwapForm';

const Swap = () => {
    return (
        <div className="w-full min-h-screen bg-[#a7d8f5] flex flex-col justify-between">
            {/* Hero Section - Swap Style */}
            <div className="flex flex-col md:flex-row items-center justify-center w-full px-8 pt-20 pb-8 flex-1 relative">
                {/* Floating Tomatoes */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute left-1/3 top-10 text-5xl rotate-[-10deg] opacity-80 blur-sm animate-pulse">🍅</div>
                    <div className="absolute right-20 top-0 text-4xl rotate-[15deg] opacity-80 blur-sm animate-pulse">🍅</div>
                    <div className="absolute right-40 bottom-32 text-6xl rotate-[-5deg] opacity-80 blur-sm animate-pulse">🍅</div>
                    <div className="absolute left-1/2 bottom-10 text-5xl rotate-[8deg] opacity-80 blur-sm animate-pulse">🍅</div>
                    <div className="absolute left-1/5 bottom-10 text-5xl rotate-[6deg] opacity-80 blur-sm animate-pulse">🍅</div>
                </div>
            </div>

            {/* Swap Form Section */}
            <div className="flex flex-col items-center justify-center w-full py-8">
                <div className="flex flex-col md:flex-row gap-6 w-full max-w-3xl justify-center">
                    <div className="flex-1 p-6 flex flex-col items-center min-w-[250px]">
                        <SwapForm />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Swap;
