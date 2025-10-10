
import { Link } from 'react-router-dom';
import './Home.css';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <main className="container md:max-w-[80%] xl:max-w-[90%] mx-auto p-4">
      <section className="pt-5 lg:pt-8 md:grid grid-cols-2">
        <div className="">
          <div>
            <h1 className="text-4xl font-semibold my-3">
              Juice Up Your DeFi: Swap, Stake & Harvest
            </h1>
            <p className="text-[rgb(94,94,94)]">
              The freshest DEX experience in BLOCX & across chains — FarmrSwap brings powerful token swaps, yield farming,
              and staking to wherever farmers roam. Built for speed, simplicity, and juicy rewards.
            </p>
            <br />
            <p className="text-[rgb(94,94,94)]">
              Whether you're new to DeFi or a seasoned yield chaser, FarmrSwap makes it easy to swap assets, earn passive
              income, and cultivate your portfolio in fertile soil.
            </p>
            <div className="bg-black rounded-full flex items-center gap-3 p-2 mt-6 w-fit">
              <a href="https://x.com/farmrswap" target="_blank" rel="noopener noreferrer" className="sc-gbWBZM kXnzTH">
                <svg
                  viewBox="0 0 32 32" role="img" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6"
                  fill="rgb(152,161,192)">
                  <title>Twitter</title>
                  <path
                    d="M31.2746 5.92398C30.7719 6.14694 30.2551 6.33512 29.727 6.4879C30.3522 5.7808 30.8289 4.9488 31.1199 4.03835C31.1851 3.83427 31.1175 3.61089 30.9498 3.47742C30.7822 3.34385 30.5495 3.32785 30.365 3.43716C29.2434 4.10235 28.0334 4.58039 26.7647 4.85993C25.4866 3.6111 23.7508 2.90039 21.9563 2.90039C18.1684 2.90039 15.0867 5.98199 15.0867 9.76975C15.0867 10.0681 15.1056 10.3647 15.143 10.6573C10.4426 10.2446 6.07276 7.9343 3.07198 4.25337C2.96504 4.12217 2.80029 4.05146 2.63162 4.06498C2.46285 4.0782 2.31121 4.17337 2.22595 4.31964C1.61733 5.36398 1.29557 6.5584 1.29557 7.77368C1.29557 9.4289 1.88654 10.9994 2.93046 12.2265C2.61304 12.1166 2.30502 11.9792 2.01103 11.816C1.8532 11.7282 1.66058 11.7295 1.50378 11.8194C1.34687 11.9093 1.2485 12.0747 1.24437 12.2554C1.24365 12.2859 1.24365 12.3163 1.24365 12.3472C1.24365 14.8179 2.5734 17.0423 4.60644 18.2547C4.43178 18.2373 4.25722 18.212 4.0838 18.1788C3.90502 18.1447 3.72117 18.2073 3.6006 18.3437C3.47983 18.4799 3.43988 18.6699 3.49552 18.8433C4.24804 21.1927 6.18548 22.9208 8.52767 23.4477C6.58507 24.6644 4.36355 25.3017 2.03147 25.3017C1.54486 25.3017 1.05547 25.2731 0.5765 25.2165C0.338565 25.1882 0.111055 25.3287 0.0300229 25.5549C-0.0510093 25.7813 0.0348745 26.0337 0.2373 26.1634C3.23322 28.0844 6.69738 29.0997 10.2551 29.0997C17.249 29.0997 21.6242 25.8016 24.063 23.0349C27.104 19.585 28.8481 15.0186 28.8481 10.5067C28.8481 10.3182 28.8452 10.1278 28.8394 9.93812C30.0392 9.03417 31.0722 7.94018 31.9128 6.68279C32.0404 6.49182 32.0266 6.23943 31.8787 6.06364C31.731 5.88774 31.4848 5.83087 31.2746 5.92398Z">
                  </path>
                </svg>
              </a>
              <a href="https://t.me/farmrswap" target="_blank" rel="noopener noreferrer" className="sc-gbWBZM kXnzTH">
                <svg
                  viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" height="24" width="24"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                  <g id="SVGRepo_iconCarrier">
                    <path fillRule="evenodd" clipRule="evenodd"
                      d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM12.3583 9.38244C11.3857 9.787 9.44177 10.6243 6.52657 11.8944C6.05318 12.0827 5.8052 12.2669 5.78263 12.4469C5.74448 12.7513 6.12559 12.8711 6.64455 13.0343C6.71515 13.0565 6.78829 13.0795 6.86327 13.1038C7.37385 13.2698 8.06068 13.464 8.41773 13.4717C8.74161 13.4787 9.1031 13.3452 9.50219 13.0711C12.226 11.2325 13.632 10.3032 13.7202 10.2831C13.7825 10.269 13.8688 10.2512 13.9273 10.3032C13.9858 10.3552 13.98 10.4536 13.9738 10.48C13.9361 10.641 12.4401 12.0318 11.6659 12.7515C11.4246 12.9759 11.2534 13.135 11.2184 13.1714C11.14 13.2528 11.0601 13.3298 10.9833 13.4038C10.509 13.8611 10.1532 14.204 11.003 14.764C11.4114 15.0331 11.7381 15.2556 12.0641 15.4776C12.4201 15.7201 12.7752 15.9619 13.2347 16.2631C13.3517 16.3398 13.4635 16.4195 13.5724 16.4971C13.9867 16.7925 14.3589 17.0579 14.8188 17.0155C15.086 16.991 15.362 16.7397 15.5022 15.9903C15.8335 14.2193 16.4847 10.382 16.6352 8.80081C16.6484 8.66228 16.6318 8.48498 16.6185 8.40715C16.6051 8.32932 16.5773 8.21842 16.4761 8.13633C16.3563 8.03911 16.1714 8.01861 16.0886 8.02C15.7125 8.0267 15.1354 8.22735 12.3583 9.38244Z"
                      fill="#98a1c0"></path>
                  </g>
                </svg>
              </a>
              <Link to="/swap?inputCurrency=BLOCX&outputCurrency=FARMR" className="sc-cfWevs jNnCvO sc-gFVvzn sc-iLyOTd sc-fgzRQT enpjmC gTNPVH ACIug">
                <p className="bg-[rgb(40,182,226)] text-white px-4 py-1 rounded-full font-semibold">
                  Get FARMR
                </p>
              </Link>
            </div>
          </div>
        </div>
        <div className="">
          <img src="https://res.cloudinary.com/dma1c8i6n/image/upload/v1753230763/farmrunner_bsuz1b.png" className="w-[800px] custom-bounce-box md:m-0 md:pb-5 sm:pb-10" alt="" />
        </div>
      </section>

      <section className="flex justify-center mt-[-50px]">
        <div className="flex flex-col items-center justify-center mb-10 mt-5">
          <div className="sc-eZNQZU eeTebd">
            <a className="bg-[rgb(24,32,53)] block w-fit p-4 rounded-3xl z-10 relative"
              href="https://farmrswap.gitbook.io/docs">
              <p className="text-white">Read Docs</p>
            </a>
          </div>
          <div className="flex items-center gap-2 mt-4 relative">
            <a href="#" className="text-xl">Learn more</a>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="sc-fQQAXF cyWZuN">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="8 12 12 16 16 12"></polyline>
              <line x1="12" y1="8" x2="12" y2="16"></line>
            </svg>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-6">
          <Link to="/swap"
            className="flex flex-col justify-between text-white min-h-[212px] md:min-h-[360px] bg-[rgb(24,32,53)] bg-no-repeat bg-right-center bg-[length:auto_100%] border border-transparent rounded-[24px] p-8 transition-[border] duration-250 hover:border-1 hover:border-[rgba(255,255,255,0.07)]!"
            style={{
              backgroundImage: "url('https://res.cloudinary.com/dma1c8i6n/image/upload/v1753230762/buigjuicyswaptokens_eqso1x.png')",
              backgroundPosition: 'right center',
              backgroundSize: 'auto 100%',
              textDecoration: 'none'
            }}>
            <div>
              <div className="font-semibold text-2xl">Swap tokens</div>
              <p className="mt-4">Buy, sell, and explore tokens on Farmrswap.</p>
            </div>
            <div>
              <p className="text-[rgb(40,182,226)] font-semibold">
                Trade Tokens
              </p>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Link to="/farms"
            className="flex flex-col justify-between text-white min-h-[212px] bg-[rgb(24,32,53)] bg-no-repeat bg-right bg-[length:auto_100%] border border-[rgba(255,255,255,0.07)] rounded-[24px] p-8 transition-[border] duration-250"
            style={{ textDecoration: 'none' }}>
            <div className="flex items-center justify-between">
              <div className="font-semibold text-2xl">Stake FARMR</div>
              <svg viewBox="0 0 24 24" width="48" xmlns="http://www.w3.org/2000/svg" fill="#28b6e2">
                <path fillRule="evenodd" clipRule="evenodd"
                  d="M3.757 7.483l.363.246c.612.263 1.472.04 2.111-.6.653-.652.871-1.533.583-2.147l-.227-.325-.002-.002c-.586-.586-1.694-.427-2.475.354-.78.78-.94 1.888-.354 2.474zM7.999 3.24l.002.003c.311.312.534.66.684 1.023l10.456 15.66L3.42 9.604a3.134 3.134 0 01-1.077-.706c-.837-.838-1.032-1.945-.901-2.862.13-.916.588-1.775 1.255-2.442.667-.667 1.526-1.124 2.442-1.255.916-.13 2.023.064 2.86.901H8zm-.353 5.304c.342-.342.629-.735.845-1.16l4.373 6.265-6.329-4.285a4.59 4.59 0 001.11-.82zM20.96 6.393l-1 5-1.96-.393 1-5 1.96.393zM3.33 17l6 1L9 19.973l-6-1L3.33 17z">
                </path>
              </svg>
            </div>
            <div>
              <p className="text-[rgb(155,155,155)]">
                Staking your FARMR tokens is the simplest way to earn passive rewards on FarmrSwap.
              </p>
              <p className="text-[rgb(40,182,226)] font-semibold mt-4">Stake now</p>
            </div>
          </Link>

          <Link to="/pools"
            className="flex flex-col justify-between text-white min-h-[212px] bg-[rgb(24,32,53)] bg-no-repeat bg-right bg-[length:auto_100%] border border-[rgba(255,255,255,0.07)] rounded-[24px] p-8 transition-[border] duration-250"
            style={{ textDecoration: 'none' }}>
            <div className="flex items-center justify-between">
              <div className="font-semibold text-2xl">Earn</div>
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
                stroke="#28b6e2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
              </svg>
            </div>
            <div>
              <p className="text-[rgb(155,155,155)]">
                Provide liquidity to pools on Farmrswap, earn swap fees and stake LP tokens in the farms to earn extra
                FARMR rewards.
              </p>
              <p className="text-[rgb(40,182,226)] font-semibold mt-4">
                View Top Pools
              </p>
            </div>
          </Link>

          <a href='https://farmrswap.gitbook.io/docs/launchpad/launchpad-overview' target='_blank' rel="noreferrer"
            className="flex flex-col justify-between text-white min-h-[212px] bg-[rgb(24,32,53)] bg-no-repeat bg-right bg-[length:auto_100%] border border-[rgba(255,255,255,0.07)] rounded-[24px] p-8 transition-[border] duration-250"
            style={{ textDecoration: 'none' }}>
            <div className="flex items-center justify-between">
              <div className="font-semibold text-2xl">Launchpad</div>
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="-36 0 24 24" height="48"
                width="200px" xmlns="http://www.w3.org/2000/svg" color="#28b6e2">
                <path fill="none" d="M0 0h24v24H0z"></path>
                <path
                  d="M9.19 6.35c-2.04 2.29-3.44 5.58-3.57 5.89L2 10.69l4.05-4.05c.47-.47 1.15-.68 1.81-.55l1.33.26zM11.17 17s3.74-1.55 5.89-3.7c5.4-5.4 4.5-9.62 4.21-10.57-.95-.3-5.17-1.19-10.57 4.21C8.55 9.09 7 12.83 7 12.83L11.17 17zm6.48-2.19c-2.29 2.04-5.58 3.44-5.89 3.57L13.31 22l4.05-4.05c.47-.47.68-1.15.55-1.81l-.26-1.33zM9 18c0 .83-.34 1.58-.88 2.12C6.94 21.3 2 22 2 22s.7-4.94 1.88-6.12A2.996 2.996 0 0 1 9 18zm4-9c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z">
                </path>
              </svg>
            </div>
            <div>
              <p className="text-[rgb(155,155,155)]">
                Dive into select launches or IDOs on Farmrswap. The Farmrswap launchpad will cater to utility-first projects.
              </p>
              <p className="text-[rgb(40,182,226)] font-semibold mt-4">
                Apply now
              </p>
            </div>
          </a>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default Home;
