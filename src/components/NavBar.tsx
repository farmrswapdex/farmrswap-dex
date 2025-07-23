import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import SearchModal from './SearchModal';

const NavLinks = ({ className }: { className?: string }) => (
    <>
        <NavLink to="/pools" className={({ isActive }) => `flex text-slate-600 items-center gap-1 hover:text-red-400 ${isActive ? 'p-2 font-bold rounded-lg bg-black bg-opacity-5' : ''} ${className}`}>Pool</NavLink>
    </>
);

const NavBar = () => {
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

    return (
        <header className="w-full flex items-center justify-between px-4 md:px-8 py-4 shadow-none relative z-20 bg-[#a7d8f5]">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
                <Link to="/" className="flex items-center gap-1">
                    <img src="/farmrpng.png" alt="FarmrSwap Logo" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full" />
                </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex flex-1 items-center justify-start ml-8 mr-4">
                <nav className="flex gap-8 text-lg font-medium text-gray-700">
                    <NavLinks />
                </nav>
            </div>

            {/* Desktop Connect Button */}
            <div className="hidden md:flex items-center">
                <ConnectButton />
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden flex items-center ml-2">
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                        <button
                            className="flex items-center justify-center p-2 rounded-full hover:bg-white/10 focus:outline-none"
                            aria-label="Open navigation menu"
                        >
                            <Menu className="w-7 h-7 text-black" />
                        </button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content
                        align="end"
                        sideOffset={10}
                        className="bg-[#232c48] text-white rounded-lg shadow-2xl w-56 py-2 z-30 animate-fade-in"
                    >
                        <DropdownMenu.Item asChild>
                            <NavLink to="/" className={({ isActive }) => `flex items-center gap-2 px-4 py-2 text-lg hover:bg-white/10 ${isActive ? 'text-red-400' : 'text-[#b3b9d8]'}`}>Swap</NavLink>
                        </DropdownMenu.Item>
                        <DropdownMenu.Item asChild>
                            <NavLink to="/pools" className={({ isActive }) => `flex items-center gap-2 px-4 py-2 text-lg hover:bg-white/10 ${isActive ? 'text-red-400' : 'text-[#b3b9d8]'}`}>Pool</NavLink>
                        </DropdownMenu.Item>
                        <DropdownMenu.Separator className="h-[1px] bg-gray-700 my-2" />
                        <DropdownMenu.Item onSelect={(e) => e.preventDefault()} className="px-4 py-2">
                            <div className="flex justify-center">
                                <ConnectButton />
                            </div>
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
            </div>
            <SearchModal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} />
        </header>
    );
};

export default NavBar;

