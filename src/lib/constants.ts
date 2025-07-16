import { MaxUint256 } from 'ethers';

const uint256Max = MaxUint256;

const feeToSpacing = {
    3000: 60,
    500: 10
}

// Token definitions for Sepolia testnet
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
        color: '#121214'
    },
    FARMR: {
        symbol: 'FARMR',
        name: 'FARMR Token',
        address: '0x0000000000000000000000000000000000000001', // Placeholder address
        decimals: 18,
        logoURI: 'https://res.cloudinary.com/dma1c8i6n/image/upload/f_auto,q_auto/farmr_coin_j5gfsd',
        color: '#FF6347'
    }
};

export const TOKEN_LIST = Object.values(TOKENS);

export { feeToSpacing, uint256Max };
