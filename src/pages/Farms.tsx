const Farms = () => {
  return (
    <div className="w-full min-h-screen bg-[#a7d8f5] flex flex-col items-center justify-center relative">
      {/* Floating Tomatoes for visual consistency */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-1/3 top-10 text-5xl rotate-[-10deg] opacity-80 blur-sm animate-pulse">
          🍅
        </div>
        <div className="absolute right-20 top-0 text-4xl rotate-[15deg] opacity-80 blur-sm animate-pulse">
          🍅
        </div>
        <div className="absolute right-40 bottom-32 text-6xl rotate-[-5deg] opacity-80 blur-sm animate-pulse">
          🍅
        </div>
        <div className="absolute left-1/2 bottom-10 text-5xl rotate-[8deg] opacity-80 blur-sm animate-pulse">
          🍅
        </div>
        <div className="absolute left-1/5 bottom-10 text-5xl rotate-[6deg] opacity-80 blur-sm animate-pulse">
          🍅
        </div>
      </div>

      {/* Centered "Coming Soon" content */}
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center max-w-md mx-4 border-4 border-[#a7d8f5] z-10">
        <div className="flex justify-center mb-2">
          <iframe
            src="https://lottie.host/embed/0307a1e3-2772-4711-8a4c-4bfdce32d882/0lH2dvOUS9.lottie"
            className="w-45 h-45 border-0"
            title="Growing Tomatoes Animation"
          ></iframe>
        </div>
        <h2
          className="text-3xl md:text-4xl font-extrabold text-[#2d3e3e] mb-4"
          style={{ fontFamily: "Fredoka One, sans-serif" }}
        >
          Coming Soon!
        </h2>
        <p className="text-lg text-[#666] mb-6">
          We're working hard to bring you amazing farming and staking
          features. Stay tuned!
        </p>
      </div>
    </div>
  );
};

export default Farms;
