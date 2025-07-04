import { useState } from 'react';

const NavBar = () => {
    const [darkMode, setDarkMode] = useState(false);

    const handleToggle = () => {
        setDarkMode((prev) => !prev);
        // Placeholder: add dark mode logic here
    };

    return (
        <header className="w-full bg-[#fafafa] flex items-center justify-between px-8 py-4 shadow-none">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
                {/* Placeholder for RabbitSwap logo */}
                <span className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center">
                    {/* Replace with SVG for real logo */}
                    <span className="text-3xl">🍅</span>
                </span>
                <span className="text-2xl font-bold text-blue-400">FarmrSwap</span>
            </div>
            {/* Navigation */}
            <nav className="flex gap-10 text-lg font-medium text-gray-700">
                <span className="font-bold text-black flex items-center gap-1">TRADE</span>
                <span className="flex items-center gap-1">POOL</span>
                <span className="flex items-center gap-1">FARM</span>
            </nav>
            {/* Connect Button and Theme Toggle */}
            <div className="flex items-center gap-4">
                <button className="bg-blue-200 hover:bg-blue-300 transition px-8 py-2 rounded-full text-lg font-medium text-black shadow-none">Connect</button>
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
            </div>
        </header>
    )
}

export default NavBar