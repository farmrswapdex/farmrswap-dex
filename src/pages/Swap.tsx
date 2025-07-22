import SwapForm from '../components/SwapForm';


const FloatingTomatoes = () => {
    return (
        <>
            {/* Floating Tomatoes Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] left-[15%] text-5xl rotate-[-10deg] opacity-20 blur-sm animate-pulse">🍅</div>
                <div className="absolute top-[5%] right-[10%] text-4xl rotate-[15deg] opacity-20 blur-sm animate-pulse">🍅</div>
                <div className="absolute bottom-[20%] right-[15%] text-6xl rotate-[-5deg] opacity-20 blur-sm animate-pulse">🍅</div>
                <div className="absolute bottom-[10%] left-[45%] text-5xl rotate-[8deg] opacity-20 blur-sm animate-pulse">🍅</div>
                <div className="absolute bottom-[30%] left-[5%] text-5xl rotate-[6deg] opacity-20 blur-sm animate-pulse">🍅</div>
                <div className="absolute top-[50%] right-[30%] text-7xl rotate-[25deg] opacity-20 blur-sm animate-pulse">🍅</div>
                <div className="absolute top-[70%] left-[10%] text-3xl rotate-[-15deg] opacity-20 blur-sm animate-pulse">🍅</div>
                <div className="absolute top-[30%] right-[40%] text-4xl rotate-[20deg] opacity-20 blur-sm animate-pulse">🍅</div>
                <div className="absolute bottom-[5%] left-[25%] text-6xl rotate-[-20deg] opacity-20 blur-sm animate-pulse">🍅</div>
            </div>
        </>
    )
}


const Swap = () => {
    return (
        <div className="w-full min-h-screen bg-[#a7d8f5] flex flex-col">
            <FloatingTomatoes />
            <div className="relative z-10 w-full max-w-4xl mx-auto pt-8 md:pt-16 pb-8 px-4 flex-grow flex items-center justify-start flex-col">
                <SwapForm />
            </div>
        </div>
    );
};

export default Swap;