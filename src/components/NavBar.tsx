import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const NavBar = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const { openConnectModal } = useConnectModal();
    const handleToggle = () => {
        setDarkMode((prev) => !prev);
        // Placeholder: add dark mode logic here
    };

    return (
        <header className="w-full flex items-center justify-between px-4 md:px-8 py-4 shadow-none relative z-20">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
                {/* Placeholder for RabbitSwap logo */}
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
                <Link to="/swap" className="font-bold text-[#b3b9d8] flex items-center gap-1 hover:text-red-400">TRADE</Link>
                <Link to="/pools" className="flex text-[#b3b9d8] items-center gap-1 hover:text-red-400">POOL</Link>
                <Link to="/farms" className="flex items-center text-[#b3b9d8] gap-1 hover:text-red-400">FARM</Link>
            </nav>
            {/* Connect Button and Theme Toggle */}
            <div className="flex items-center gap-2 md:gap-4">
                <button
                    onClick={handleToggle}
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 bg-white hover:bg-gray-100 transition"
                    aria-label="Toggle dark mode"
                >
                    {darkMode ? (
                        // Moon icon
                        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" /></svg>
                    ) : (
                        // Sun icon
                        <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 6.95l-1.41-1.41M6.34 6.34L4.93 4.93m12.02 0l-1.41 1.41M6.34 17.66l-1.41 1.41" /></svg>
                    )}
                </button>
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