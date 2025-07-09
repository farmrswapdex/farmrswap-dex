import { ConnectButton, useConnectModal } from '@rainbow-me/rainbowkit';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { openConnectModal } = useConnectModal();


    return (
        <header className="w-full flex items-center justify-between px-4 md:px-8 py-4 shadow-none relative z-20">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
                {/* Placeholder for FarmrSwap logo */}
                <Link to="/" className="flex items-center gap-1">
                    <span className="w-12 h-12 rounded-full flex items-center justify-center">
                        {/* Replace with SVG for real logo */}
                        <span className="text-3xl">🍅</span>
                    </span>
                    <span className="text-2xl font-bold text-white">FarmrSwap</span>
                </Link>
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
            {/* Navigation */}
            <nav className="hidden md:flex gap-24 text-lg font-medium text-gray-700">
                {/* <Link to="/swap" className="font-bold text-[#b3b9d8] flex items-center gap-1 hover:text-red-400">TRADE</Link> */}
                <Link to="/pools" className="flex text-[#b3b9d8] items-center gap-1 hover:text-red-400">POOL</Link>
                <Link to="/farms" className="flex items-center text-[#b3b9d8] gap-1 hover:text-red-400">FARM</Link>
            </nav>
            {/* Connect Button and Theme Toggle */}
            <div className="flex items-center gap-2 md:gap-4">
                <button onClick={openConnectModal} className="transition px-4 md:px-8 py-2 rounded-full text-lg font-medium text-black shadow-none"><ConnectButton /></button>
            </div>
            {/* Mobile menu */}
            {menuOpen && (
                <nav className="absolute top-full left-0 w-full bg-[#232c48] flex flex-col items-center gap-4 py-6 md:hidden shadow-2xl animate-fade-in z-30">
                    <Link to="/swap" className="font-bold text-[#b3b9d8] flex items-center gap-1 hover:text-red-400 text-lg" onClick={() => setMenuOpen(false)}>TRADE</Link>
                    <Link to="/pool" className="flex text-[#b3b9d8] items-center gap-1 hover:text-red-400 text-lg" onClick={() => setMenuOpen(false)}>POOL</Link>
                    <Link to="/farms" className="flex items-center text-[#b3b9d8] gap-1 hover:text-red-400 text-lg" onClick={() => setMenuOpen(false)}>FARM</Link>
                </nav>
            )}
        </header>
    )
}

export default NavBar