import { MaxUint256 } from 'ethers';

const uint256Max = MaxUint256;

const feeToSpacing = {
    3000: 60,
    500: 10
};

// Token definitions for Sepolia testnet
export const TOKENS = {
    WBLOCX: {
        symbol: 'WBLOCX',
        name: 'Wrapped BLOCX',
        address: '0xEc124821C7A324dfc4BF8D9bd4B6f5522842988E',
        decimals: 18,
        logoURI: 'https://res.cloudinary.com/dma1c8i6n/image/upload/f_auto,q_auto/blocxcoin_nhozz7',
        color: '#1E90FF'
    },
    FARMR: {
        symbol: 'FARMR',
        name: 'test FARMR Token',
        address: '0x6565ddb196392D387e88E0A85e688d1d750CF4A9',
        decimals: 18,
        logoURI: 'https://res.cloudinary.com/dma1c8i6n/image/upload/f_auto,q_auto/farmr_coin_j5gfsd',
        color: ''
    },
    USDC: {
        symbol: 'USDC',
        name: 'test USDC Token',
        address: '0x2bc2C528879A025f7e97e68b5142410fF719606B',
        decimals: 6,
        logoURI: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
        color: ''
    },
};

export const NATIVE_TOKEN = {
    symbol: 'BLOCX',
    name: 'BLOCX Token',
    address: '0x0000000000000000000000000000000000000000', // Native token address
    decimals: 18,
    logoURI: 'https://res.cloudinary.com/dma1c8i6n/image/upload/f_auto,q_auto/blocxcoin_nhozz7',
    color: '#1E90FF'
};

export const TOKEN_LIST = Object.values(TOKENS);

export { feeToSpacing, uint256Max };