import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer
            className="flex-col-reverse flex md:grid md:grid-cols-2 justify-between text-white min-h-[212px] bg-[rgb(24,32,53)] bg-no-repeat bg-right bg-[length:auto_100%] border border-[rgba(255,255,255,0.07)] rounded-[24px] p-8 py-12 transition-[border] duration-250 my-8 md:my-16 mx-auto w-full max-w-[90%]">
            <div>
                <div className="flex items-center gap-1">
                    <img src="https://res.cloudinary.com/dma1c8i6n/image/upload/v1753230758/logo2_cfsxph.png" className="w-16" alt="" />
                    <div className="text-[rgb(152,161,192)] text-2xl font-semibold">Farmrswap</div>
                </div>
                <div className="flex items-center gap-4 my-4">
                    <a href="https://x.com/farmrswap" target="_blank" rel="noopener noreferrer" className="sc-gYmrxV dSObhH">
                        <svg
                            viewBox="0 0 32 32" role="img" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8"
                            fill="rgb(152,161,192)">
                            <title>Twitter</title>
                            <path
                                d="M31.2746 5.92398C30.7719 6.14694 30.2551 6.33512 29.727 6.4879C30.3522 5.7808 30.8289 4.9488 31.1199 4.03835C31.1851 3.83427 31.1175 3.61089 30.9498 3.47742C30.7822 3.34385 30.5495 3.32785 30.365 3.43716C29.2434 4.10235 28.0334 4.58039 26.7647 4.85993C25.4866 3.6111 23.7508 2.90039 21.9563 2.90039C18.1684 2.90039 15.0867 5.98199 15.0867 9.76975C15.0867 10.0681 15.1056 10.3647 15.143 10.6573C10.4426 10.2446 6.07276 7.9343 3.07198 4.25337C2.96504 4.12217 2.80029 4.05146 2.63162 4.06498C2.46285 4.0782 2.31121 4.17337 2.22595 4.31964C1.61733 5.36398 1.29557 6.5584 1.29557 7.77368C1.29557 9.4289 1.88654 10.9994 2.93046 12.2265C2.61304 12.1166 2.30502 11.9792 2.01103 11.816C1.8532 11.7282 1.66058 11.7295 1.50378 11.8194C1.34687 11.9093 1.2485 12.0747 1.24437 12.2554C1.24365 12.2859 1.24365 12.3163 1.24365 12.3472C1.24365 14.8179 2.5734 17.0423 4.60644 18.2547C4.43178 18.2373 4.25722 18.212 4.0838 18.1788C3.90502 18.1447 3.72117 18.2073 3.6006 18.3437C3.47983 18.4799 3.43988 18.6699 3.49552 18.8433C4.24804 21.1927 6.18548 22.9208 8.52767 23.4477C6.58507 24.6644 4.36355 25.3017 2.03147 25.3017C1.54486 25.3017 1.05547 25.2731 0.5765 25.2165C0.338565 25.1882 0.111055 25.3287 0.0300229 25.5549C-0.0510093 25.7813 0.0348745 26.0337 0.2373 26.1634C3.23322 28.0844 6.69738 29.0997 10.2551 29.0997C17.249 29.0997 21.6242 25.8016 24.063 23.0349C27.104 19.585 28.8481 15.0186 28.8481 10.5067C28.8481 10.3182 28.8452 10.1278 28.8394 9.93812C30.0392 9.03417 31.0722 7.94018 31.9128 6.68279C32.0404 6.49182 32.0266 6.23943 31.8787 6.06364C31.731 5.88774 31.4848 5.83087 31.2746 5.92398Z">
                            </path>
                        </svg>
                    </a>
                    <a href="https://t.me/farmrswap" target="_blank" rel="noopener noreferrer" className="sc-gYmrxV dSObhH">
                        <svg
                            viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" height="36" width="36" className="h-10 w-10"
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
                </div>
                <p className="text-[rgb(94,94,94)]">© 2025 Farmrswap Team</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 md:mb-0">
                <div className="text-[rgb(155,155,155)] space-y-2">
                    <span className="text-white font-semibold">App</span>
                    <Link className="block" to="/swap">Swap</Link>
                    <Link className="block" to="/pools">Liquidity &amp; Pools</Link>
                    <Link className="block" to="/farms">Farms</Link>
                </div>
                <div className="text-[rgb(155,155,155)] space-y-2">
                    <span className="text-white font-semibold">Info</span>
                    <a className="block" href="https://farmrswap.gitbook.io/docs" target="_blank" rel="noreferrer">Docs</a>
                    <a className="block" href="https://t.me/farmrswap" target="_blank" rel="noreferrer">Contact Us</a>
                </div>
                <div className="text-[rgb(155,155,155)] space-y-2">
                    <span className="text-white font-semibold">Community</span>
                    <a className="block" href="https://x.com/farmrswap" target="_blank" rel="noreferrer">Twitter</a>
                    <a className="block" href="https://t.me/farmrswap" target="_blank" rel="noreferrer">Telegram</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;