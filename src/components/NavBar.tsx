import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const NavBar = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const location = useLocation();

  const toggleNav = () => {
    if (isMenuVisible) {
      setIsNavOpen(false);
      setTimeout(() => {
        setIsMenuVisible(false);
      }, 200); // Match fadeOut duration
    } else {
      setIsMenuVisible(true);
      setIsNavOpen(true);
    }
  };

  const isSelected = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-[rgb(30,29,45)] backdrop-blur-md bg-opacity-95 p-4 py-2 flex items-center justify-between fixed w-full top-0 z-40 border-b border-white/5">
      <div className="flex items-center gap-1">
        <Link to="/" className="transition-transform hover:scale-105">
          <img src="https://res.cloudinary.com/dma1c8i6n/image/upload/v1753230759/logo_falwsb.png" className="w-8" alt="logo" />
        </Link>
        <div className="text-[rgb(152,161,192)] text-2xl font-semibold">Farmrswap</div>
      </div>

      <nav className="hidden md:flex items-center gap-8 text-white">
        <NavLink
          to="/swap"
          className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 group ${isSelected('/swap')
            ? 'text-white'
            : 'hover:bg-white/10 text-white/70 hover:text-white hover:scale-105'
            }`}
        >
          <img src="https://res.cloudinary.com/dma1c8i6n/image/upload/v1753230758/001-up-and-down_rl8pjs.png" alt="" className="w-5 h-5 relative z-10" />
          <span className="font-semibold relative z-10">Swap</span>
          {isSelected('/swap') && (
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
          )}
        </NavLink>

        <NavLink
          to="/pools"
          className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 group ${isSelected('/pools')
            ? 'text-white'
            : 'hover:bg-white/10 text-white/70 hover:text-white hover:scale-105'
            }`}
        >
          <img src="https://res.cloudinary.com/dma1c8i6n/image/upload/v1753230758/002-drops_iwjyhf.png" alt="" className="w-5 h-5 relative z-10" />
          <span className="font-semibold relative z-10">Liquidity</span>
          {isSelected('/pools') && (
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
          )}
        </NavLink>

        <NavLink
          to="/farms"
          className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 group ${isSelected('/farms')
            ? 'text-white'
            : 'hover:bg-white/10 text-white/70 hover:text-white hover:scale-105'
            }`}
        >
          <img src="https://res.cloudinary.com/dma1c8i6n/image/upload/v1753230758/003-piggy-bank_a18vpu.png" alt="" className="w-5 h-5 relative z-10" />
          <span className="font-semibold relative z-10">Farm</span>
          {isSelected('/farms') && (
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
          )}
        </NavLink>


      </nav>

      <div className="flex items-center gap-2">
        <div className="hidden md:flex">
          <ConnectButton showBalance={false} />
        </div>

        <div className="md:hidden flex justify-end w-full" onClick={toggleNav}>
          <button className="focus:outline-none cursor-pointer transition-transform hover:scale-110" aria-label="Open menu" id="toggleBtn">
            {isNavOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-[#fff] transition-transform duration-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <line
                  x1="6"
                  y1="6"
                  x2="18"
                  y2="18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <line
                  x1="6"
                  y1="18"
                  x2="18"
                  y2="6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#fff] transition-transform duration-200" fill="none" viewBox="0 0 20 20"
                stroke="currentColor">
                <line x1="4" y1="7" x2="16" y2="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="4" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="4" y1="17" x2="16" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {isMenuVisible && (
        <div className={`md:hidden absolute top-full left-0 w-full bg-[rgb(30,29,45)] backdrop-blur-md bg-opacity-95 z-20 border-b border-white/5 ${isNavOpen ? 'animate-fadeIn' : 'animate-fadeOut'}`}>
          <div className="p-4 text-[#171717] font-semibold">
            <NavLink
              to="/swap"
              onClick={toggleNav}
              className={`relative flex items-center gap-2 rounded-xl mb-4 p-3 transition-all duration-300 ${isSelected('/swap')
                ? 'bg-blue-100 text-blue-700'
                : 'bg-white hover:bg-gray-50 hover:scale-105 hover:shadow-md'
                }`}
            >
              <img src="https://res.cloudinary.com/dma1c8i6n/image/upload/v1753230758/001-up-and-down_rl8pjs.png" alt="" className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Swap</span>
            </NavLink>

            <NavLink
              to="/pools"
              onClick={toggleNav}
              className={`relative flex items-center gap-2 rounded-xl mb-4 p-3 transition-all duration-300 ${isSelected('/pools')
                ? 'bg-blue-100 text-blue-700'
                : 'bg-white hover:bg-gray-50 hover:scale-105 hover:shadow-md'
                }`}
            >
              <img src="https://res.cloudinary.com/dma1c8i6n/image/upload/v1753230758/002-drops_iwjyhf.png" alt="" className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Liquidity</span>
            </NavLink>

            <NavLink
              to="/farms"
              onClick={toggleNav}
              className={`relative flex items-center gap-2 rounded-xl mb-4 p-3 transition-all duration-300 ${isSelected('/farms')
                ? 'bg-blue-100 text-blue-700'
                : 'bg-white hover:bg-gray-50 hover:scale-105 hover:shadow-md'
                }`}
            >
              <img src="https://res.cloudinary.com/dma1c8i6n/image/upload/v1753230758/003-piggy-bank_a18vpu.png" alt="" className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Farm</span>
            </NavLink>

            <div className="flex justify-center mt-6">
              <ConnectButton />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;