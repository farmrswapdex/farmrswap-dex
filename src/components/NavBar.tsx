import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const NavBar = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <header className="bg-[rgb(30,29,45)] p-4 py-2 flex items-center justify-between fixed w-full top-0 z-40">
      <div className="flex items-center gap-1">
        <Link to="/">
          <img src="https://res.cloudinary.com/dma1c8i6n/image/upload/v1753230759/logo_falwsb.png" className="w-8" alt="logo" />
        </Link>
        <div className="text-[rgb(152,161,192)] text-2xl font-semibold">Farmrswap</div>
      </div>

      <nav className="hidden md:flex items-center gap-12 text-white">
        <NavLink to="/swap" className="flex items-center gap-1">
          <img src="https://res.cloudinary.com/dma1c8i6n/image/upload/v1753230758/001-up-and-down_rl8pjs.png" alt="" />
          <span className="font-bold">Swap</span>
        </NavLink>
        <NavLink to="/pools" className="flex items-center gap-1">
          <img src="https://res.cloudinary.com/dma1c8i6n/image/upload/v1753230758/002-drops_iwjyhf.png" alt="" />
          <span className="font-bold">Liquidity</span>
        </NavLink>
        <NavLink to="/farms" className="flex items-center gap-1">
          <img src="https://res.cloudinary.com/dma1c8i6n/image/upload/v1753230758/003-piggy-bank_a18vpu.png" alt="" />
          <span className="font-bold">Stake</span>
        </NavLink>
        <NavLink to="/mint" className="flex items-center gap-1">
          <img src="https://res.cloudinary.com/dma1c8i6n/image/upload/v1753230759/leaf_bu9iiv.png" alt="" /> <span className="font-bold">Mint NFT</span>
        </NavLink>
      </nav>

      <div className="flex items-center gap-2">
        <div className="hidden md:flex">
          <ConnectButton />
        </div>

        <div className="md:hidden flex justify-end w-full" onClick={toggleNav}>
          <button className="focus:outline-none cursor-pointer" aria-label="Open menu" id="toggleBtn">
            {isNavOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-[#fff]"
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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#fff]" fill="none" viewBox="0 0 20 20"
                stroke="currentColor">
                <line x1="4" y1="7" x2="16" y2="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="4" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="4" y1="17" x2="16" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className={`${isNavOpen ? 'block' : 'hidden'} md:hidden absolute top-full left-0 w-full bg-[rgb(30,29,45)] z-20`}>
        <div className="p-4 text-[#171717] font-semibold">
          <NavLink to="/swap" onClick={() => setIsNavOpen(false)} className="flex items-center gap-1 bg-white rounded mb-6 p-2">
            <img src="https://res.cloudinary.com/dma1c8i6n/image/upload/v1753230758/001-up-and-down_rl8pjs.png" alt="" />
            <span>Swap</span>
          </NavLink>
          <NavLink to="/pools" onClick={() => setIsNavOpen(false)} className="flex items-center gap-1 bg-white rounded mb-6 p-2">
            <img src="https://res.cloudinary.com/dma1c8i6n/image/upload/v1753230758/002-drops_iwjyhf.png" alt="" />
            <span>Liquidity</span>
          </NavLink>
          <NavLink to="/farms" onClick={() => setIsNavOpen(false)} className="flex items-center gap-1 bg-white rounded mb-6 p-2">
            <img src="https://res.cloudinary.com/dma1c8i6n/image/upload/v1753230758/003-piggy-bank_a18vpu.png" alt="" />
            <span>Stake</span>
          </NavLink>
          <NavLink to="/mint" onClick={() => setIsNavOpen(false)} className="flex items-center gap-1 bg-white rounded mb-6 p-2">
            <img src="https://res.cloudinary.com/dma1c8i6n/image/upload/v1753230759/leaf_bu9iiv.png" alt="" /> <span>Mint NFT</span>
          </NavLink>
          <div className="flex justify-center mt-4">
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;