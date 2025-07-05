import { Github, Twitter } from "lucide-react";

const Footer = () => {
    return (
        <footer className="w-full bg-[#a7d8f5] py-12 px-4 flex flex-col items-center">
            <div className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-start bg-[#232c48] rounded-3xl p-10 gap-10">
                {/* Left: Logo, Brand, Socials */}
                <div className="flex flex-col gap-6 min-w-[220px]">
                    <div className="flex items-center gap-4">
                        {/* Placeholder for FarmrSwap logo */}
                        <span className="w-16 h-16 rounded-full bg-[#2c365a] flex items-center justify-center">
                            <span className="text-4xl">🍅</span>
                        </span>
                        <span className="text-3xl font-bold text-[#b3b9d8]">FarmrSwap</span>
                    </div>
                    <div className="flex gap-4 text-[#8b92b7] text-3xl">
                        <span className="hover:text-white cursor-pointer">
                            <a href="https://github.com/farmrswap" target="_blank" rel="noopener noreferrer" className="hover:text-white cursor-pointer">
                                <Github />
                            </a>
                        </span>
                        <span className="hover:text-white cursor-pointer">
                            <a href="https://x.com/farmrswap" target="_blank" rel="noopener noreferrer" className="hover:text-white cursor-pointer">
                                <Twitter />
                            </a>
                        </span>

                    </div>
                    <span className="text-[#6c7393] text-sm mt-4">© {new Date().getFullYear()} FarmrSwap Team</span>
                </div>
                {/* Right: Columns */}
                <div className="flex flex-1 justify-between flex-wrap gap-8">
                    <div className="min-w-[120px]">
                        <div className="font-bold text-[#b3b9d8] mb-3">Trade</div>
                        <ul className="space-y-1 text-[#b3b9d8]">
                            <li className="hover:text-white cursor-pointer">Swap</li>
                            <li className="hover:text-white cursor-pointer">Pools</li>
                            <li className="hover:text-white cursor-pointer">Charts</li>
                        </ul>
                    </div>
                    <div className="min-w-[120px]">
                        <div className="font-bold text-[#b3b9d8] mb-3">Earn</div>
                        <ul className="space-y-1 text-[#b3b9d8]">
                            <li className="hover:text-white cursor-pointer">Farms</li>
                            <li className="hover:text-white cursor-pointer">Staking</li>
                            <li className="hover:text-white cursor-pointer">Launchpad</li>
                        </ul>
                    </div>
                    <div className="min-w-[120px]">
                        <div className="font-bold text-[#b3b9d8] mb-3">Community</div>
                        <ul className="space-y-1 text-[#b3b9d8]">
                            <li className="hover:text-white cursor-pointer">Docs</li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;