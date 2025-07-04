const Footer = () => {
    return (
        <footer className="w-full bg-[#1a2340] py-12 px-4 flex flex-col items-center">
            <div className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-start bg-[#232c48] rounded-3xl p-10 gap-10">
                {/* Left: Logo, Brand, Socials */}
                <div className="flex flex-col gap-6 min-w-[220px]">
                    <div className="flex items-center gap-4">
                        {/* Placeholder for SpookySwap logo */}
                        <span className="w-16 h-16 rounded-full bg-[#2c365a] flex items-center justify-center">
                            <span className="text-4xl">🍅</span>
                        </span>
                        <span className="text-3xl font-bold text-[#b3b9d8]">FarmrSwap</span>
                    </div>
                    <div className="flex gap-4 text-[#8b92b7] text-3xl">
                        <span className="hover:text-white cursor-pointer">🕹️</span>
                        <span className="hover:text-white cursor-pointer">🐦</span>
                    </div>
                    <span className="text-[#6c7393] text-sm mt-4">© {new Date().getFullYear()} FarmrSwap Team</span>
                </div>
                {/* Right: Columns */}
                <div className="flex flex-1 justify-between flex-wrap gap-8">
                    <div className="min-w-[120px]">
                        <div className="font-bold text-[#b3b9d8] mb-3">App</div>
                        <ul className="space-y-1 text-[#b3b9d8]">
                            <li className="hover:text-white cursor-pointer">Swap</li>
                            <li className="hover:text-white cursor-pointer">Liquidity & Pools</li>
                            <li className="hover:text-white cursor-pointer">Farms</li>
                        </ul>
                    </div>
                    <div className="min-w-[120px]">
                        <div className="font-bold text-[#b3b9d8] mb-3">Community</div>
                        <ul className="space-y-1 text-[#b3b9d8]">
                            <li className="hover:text-white cursor-pointer">Twitter</li>
                        </ul>
                    </div>
                    <div className="min-w-[120px]">
                        <div className="font-bold text-[#b3b9d8] mb-3">Participate</div>
                        <ul className="space-y-1 text-[#b3b9d8]">
                            <li className="hover:text-white cursor-pointer">Vote</li>
                            <li className="hover:text-white cursor-pointer">Apply for Collab</li>
                            <li className="hover:text-white cursor-pointer">Apply for Token Listing</li>
                            <li className="hover:text-white cursor-pointer">Apply for Farm</li>
                            <li className="hover:text-white cursor-pointer">Bug Bounty</li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;