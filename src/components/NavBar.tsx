import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ConnectButton, useConnectModal } from '@rainbow-me/rainbowkit';
import { Menu, Search } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import SearchModal from './SearchModal';

const NavBar = () => {
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const { openConnectModal } = useConnectModal();

    return (
        <header className="w-full flex items-center justify-between px-4 md:px-8 py-4 shadow-none relative z-20 bg-[#a7d8f5]">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
                <Link to="/" className="flex items-center gap-1">
                    <img src="/farmrpng.png" alt="FarmrSwap Logo" className="w-12 h-12 rounded-full" />
                </Link>
            </div>
            {/* Desktop Navigation and Search */}
            <div className="hidden md:flex flex-1 items-center justify-between ml-8 mr-4">
                <nav className="flex gap-12 text-lg font-medium text-gray-700">
                    <NavLink to="/pools" className={({ isActive }) => `flex text-slate-600 items-center gap-1 hover:text-red-400 ${isActive ? 'p-2 font-bold rounded-lg bg-black bg-opacity-5' : ''}`}>Pool</NavLink>
                    <NavLink to="/explore" className={({ isActive }) => `flex text-slate-600 items-center gap-1 hover:text-red-400 ${isActive ? 'p-2 font-bold rounded-lg bg-black bg-opacity-5' : ''}`}>Explore</NavLink>
                    <NavLink to="/bridge" className={({ isActive }) => `flex text-slate-600 items-center gap-1 hover:text-red-400 ${isActive ? 'p-2 font-bold rounded-lg bg-black bg-opacity-5' : ''}`}>Bridge</NavLink>
                </nav>
                <button
                    onClick={() => setIsSearchModalOpen(true)}
                    className="flex items-center max-w-md text-left px-4 py-2 text-gray-400 bg-[#2d3748] rounded-full hover:bg-[#4a5568] transition border border-gray-700 relative"
                >
                    <Search className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="flex-1">Search tokens and pools</span>
                    <span className="ml-2 px-2 py-0.5 rounded bg-[#23232b] border border-gray-700 text-gray-400 text-xs font-mono">/</span>
                </button>
            </div>
            {/* Connect Button */}
            <div className="flex items-center gap-2 md:gap-4">
                <button onClick={openConnectModal} className="transition px-4 md:px-8 py-2 rounded-full text-lg font-medium text-black shadow-none"><ConnectButton /></button>
            </div>
            {/* Mobile Menu and Search */}
            <div className="md:hidden flex items-center gap-2">
                <button
                    onClick={() => setIsSearchModalOpen(true)}
                    className="flex items-center justify-center p-2 rounded-full hover:bg-white/10 focus:outline-none"
                    aria-label="Search"
                >
                    <Search className="w-6 h-6 text-white" />
                </button>
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                        <button
                            className="flex items-center justify-center p-2 rounded-full hover:bg-white/10 focus:outline-none"
                            aria-label="Open navigation menu"
                        >
                            <Menu className="w-7 h-7 text-white" />
                        </button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content
                        align="end"
                        sideOffset={10}
                        className="bg-[#232c48] text-white rounded-lg shadow-2xl w-48 py-2 z-30 animate-fade-in"
                    >
                        <DropdownMenu.Item asChild>
                            <NavLink to="/swap" className={({ isActive }) => `block px-4 py-2 text-lg font-bold hover:bg-white/10 ${isActive ? 'text-red-400' : 'text-[#b3b9d8]'}`}>TRADE</NavLink>
                        </DropdownMenu.Item>
                        <DropdownMenu.Item asChild>
                            <NavLink to="/pools" className={({ isActive }) => `block px-4 py-2 text-lg hover:bg-white/10 ${isActive ? 'text-red-400' : 'text-[#b3b9d8]'}`}>POOL</NavLink>
                        </DropdownMenu.Item>
                        <DropdownMenu.Item asChild>
                            <NavLink to="/farms" className={({ isActive }) => `block px-4 py-2 text-lg hover:bg-white/10 ${isActive ? 'text-red-400' : 'text-[#b3b9d8]'}`}>FARM</NavLink>
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
            </div>
            <SearchModal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} />
        </header>
    )
}

export default NavBar;
