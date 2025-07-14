import { ConnectButton, useConnectModal } from '@rainbow-me/rainbowkit';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import SearchModal from './SearchModal';

const NavBar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const { openConnectModal } = useConnectModal();

    return (
        <header className="w-full flex items-center justify-between px-4 md:px-8 py-4 shadow-none relative z-20 bg-[#a7d8f5]">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
                <Link to="/" className="flex items-center gap-1">
                    <span className="w-12 h-12 rounded-full flex items-center justify-center">
                        <span className="text-3xl">🍅</span>
                    </span>
                </Link>
            </div>
            {/* Desktop Navigation and Search */}
            <div className="hidden md:flex flex-1 items-center justify-between ml-8 mr-4">
                <nav className="flex gap-12 text-lg font-medium text-gray-700">
                    {/* <Link to="/swap" className="font-bold text-slate-600 flex items-center gap-1 hover:text-red-400">Trade</Link> */}
                    <NavLink to="/pools" className={({ isActive }) => `flex text-slate-600 items-center gap-1 hover:text-red-400 ${isActive ? 'p-2 font-bold rounded-lg bg-black bg-opacity-5' : ''}`}>Pool</NavLink>
                    <NavLink to="/explore" className={({ isActive }) => `flex text-slate-600 items-center gap-1 hover:text-red-400 ${isActive ? 'p-2 font-bold rounded-lg bg-black bg-opacity-5' : ''}`}>Explore</NavLink>
                    <NavLink to="/bridge" className={({ isActive }) => `flex text-slate-600 items-center gap-1 hover:text-red-400 ${isActive ? 'p-2 font-bold rounded-lg bg-black bg-opacity-5' : ''}`}>Bridge</NavLink>
                    {/* <Link to="/farms" className="flex text-slate-600 items-center gap-1 hover:text-red-400">Farms</Link> */}
                </nav>
                <button
                    onClick={() => setIsSearchModalOpen(true)}
                    className="flex items-center max-w-md text-left px-4 py-2 text-gray-400 bg-[#2d3748] rounded-full hover:bg-[#4a5568] transition border border-gray-700 relative"
                >
                    <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    <span className="flex-1">Search tokens and pools</span>
                    <span className="ml-2 px-2 py-0.5 rounded bg-[#23232b] border border-gray-700 text-gray-400 text-xs font-mono">/</span>
                </button>
            </div>
            {/* Connect Button */}
            <div className="flex items-center gap-2 md:gap-4">
                <button onClick={openConnectModal} className="transition px-4 md:px-8 py-2 rounded-full text-lg font-medium text-black shadow-none"><ConnectButton /></button>
            </div>
            {/* Hamburger for mobile */}
            <button
                className="md:hidden flex items-center justify-center p-2 rounded-full hover:bg-white/10 focus:outline-none"
                onClick={() => setMenuOpen((open) => !open)}
                aria-label="Open navigation menu"
            >
                {menuOpen ? (
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
                )}
            </button>
            <button
                onClick={() => setIsSearchModalOpen(true)}
                className="md:hidden flex items-center justify-center p-2 rounded-full hover:bg-white/10 focus:outline-none"
                aria-label="Search"
            >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </button>
            {/* Mobile menu */}
            {menuOpen && (
                <nav className="absolute top-full left-0 w-full bg-[#232c48] flex flex-col items-center gap-4 py-6 md:hidden shadow-2xl animate-fade-in z-30">
                    <NavLink to="/swap" className={({ isActive }) => `font-bold text-lg flex items-center gap-1 hover:text-red-400 ${isActive ? 'text-red-400' : 'text-[#b3b9d8]'}`} onClick={() => setMenuOpen(false)}>TRADE</NavLink>
                    <NavLink to="/pools" className={({ isActive }) => `text-lg flex items-center gap-1 hover:text-red-400 ${isActive ? 'text-red-400' : 'text-[#b3b9d8]'}`} onClick={() => setMenuOpen(false)}>POOL</NavLink>
                    <NavLink to="/farms" className={({ isActive }) => `text-lg flex items-center gap-1 hover:text-red-400 ${isActive ? 'text-red-400' : 'text-[#b3b9d8]'}`} onClick={() => setMenuOpen(false)}>FARM</NavLink>
                </nav>
            )}
            <SearchModal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} />
        </header>
    )
}

export default NavBar