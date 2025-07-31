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
        address: '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9',
        decimals: 18,
        logoURI: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
        color: ''
    },
    USDC: {
        symbol: 'USDC',
        name: 'USD Coin',
        address: '0xe679510e3b614c1DfcfdA519ce9859D982dA7799',
        decimals: 6,
        logoURI: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
        color: ''
    },
    BLOCX: {
        symbol: 'BLOCX',
        name: 'BLOCX Token',
        address: '0xcBFbd38167519F4DCcfF1dbd48304a4FC8d4De32', // Placeholder address
        decimals: 18,
        logoURI: 'https://res.cloudinary.com/dma1c8i6n/image/upload/f_auto,q_auto/blocxcoin_nhozz7',
        color: ''
    },
    FARMR: {
        symbol: 'FARMR',
        name: 'FARMR Token',
        address: '0xb3bCB0ee6253F981A6e09044D6B2868b284a0113',
        decimals: 18,
        logoURI: 'https://res.cloudinary.com/dma1c8i6n/image/upload/f_auto,q_auto/farmr_coin_j5gfsd',
        color: ''
    }
};

export const NATIVE_TOKEN = {
    symbol: 'ETH',
    name: 'Ether',
    address: '0x0000000000000000000000000000000000000000', // Native token address
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    color: '#627EEA'
}

export const TOKEN_LIST = Object.values(TOKENS);

export { feeToSpacing, uint256Max };
