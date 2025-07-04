import NavBar from '../components/NavBar';
import SwapForm from '../components/SwapForm';

const Swap = () => {
    return (
        <div className="min-h-screen bg-[#a7d8f5] flex flex-col">
            <NavBar />
            <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-7xl mx-auto px-8 pt-12 pb-8 flex-1 relative">
                {/* Tomato Farmer (left) */}
                <div className="flex-1 flex flex-col items-center md:items-start z-10">
                    <span className="text-[10rem] md:text-[14rem]">🍅</span>
                </div>
                {/* Floating Tomatoes */}
                <div className="absolute left-1/3 top-10 text-5xl rotate-[-10deg] opacity-80">🍅</div>
                <div className="absolute right-20 top-0 text-4xl rotate-[15deg] opacity-80">🍅</div>
                <div className="absolute right-40 bottom-32 text-6xl rotate-[-5deg] opacity-80">🍅</div>
                <div className="absolute left-1/2 bottom-10 text-5xl rotate-[8deg] opacity-80">🍅</div>
                {/* Slogan and SwapForm (right) */}
                <div className="flex-1 flex flex-col items-center md:items-end justify-center z-10 gap-8">
                    <div className="w-full max-w-md">
                        <SwapForm />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Swap;
