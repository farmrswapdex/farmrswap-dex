import { MaxUint256 } from 'ethers';

const uint256Max = MaxUint256;

const feeToSpacing = {
    3000: 60,
    500: 10
}

// forge inspect UniswapV3Pool bytecode| xargs cast keccak
const poolCodeHash = "0x9dc805423bd1664a6a73b31955de538c338bac1f5c61beb8f4635be5032076a2";

export const farmrSwapLogo = "https://res.cloudinary.com/dma1c8i6n/image/upload/f_auto,q_auto/farmr_coin_j5gfsd"


// Token definitions for Monad testnet
export const TOKENS = {
    WETH: {
        symbol: 'WETH',
        name: 'Wrapped Ether',
        address: '0x4200000000000000000000000000000000000006',
        decimals: 18,
        logoURI: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
        color: '#627EEA'
    },
    USDC: {
        symbol: 'USDC',
        name: 'USD Coin',
        address: '0x176211869cA2b568f2A7D4EE941E073a821EE1ff',
        decimals: 6,
        logoURI: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
        color: '#2775CA'
    },
    BLOCX: {
        symbol: 'BLOCX',
        name: 'BLOCX Token',
        address: '0x0000000000000000000000000000000000000000', // Placeholder address
        decimals: 18,
        logoURI: 'https://res.cloudinary.com/dma1c8i6n/image/upload/f_auto,q_auto/blocxcoin_nhozz7',
        color: '#FFD700'
    },
    TOMATO: {
        symbol: 'TOMATO',
        name: 'Tomato Token',
        address: '0x0000000000000000000000000000000000000001', // Placeholder address
        decimals: 18,
        logoURI: 'https://via.placeholder.com/32/FF6347/000000?text=🍅',
        color: '#FF6347'
    }
};

export const TOKEN_LIST = Object.values(TOKENS);

export { uint256Max, feeToSpacing, poolCodeHash };