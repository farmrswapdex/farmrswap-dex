import { MaxUint256 } from 'ethers';

const uint256Max = MaxUint256;

const feeToSpacing = {
    3000: 60,
    500: 10
}

// Token definitions for Sepolia testnet
export const TOKENS = {
    WBLOCX: {
        symbol: 'WBLOCX',
        name: 'Wrapped BLOCX',
        address: '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9',
        decimals: 18,
        logoURI: 'https://res.cloudinary.com/dma1c8i6n/image/upload/f_auto,q_auto/blocxcoin_nhozz7',
        color: '#1E90FF'
    },
    USDC: {
        symbol: 'USDC',
        name: 'USD Coin',
        address: '0xe679510e3b614c1DfcfdA519ce9859D982dA7799',
        decimals: 6,
        logoURI: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
        color: ''
    },
    USDT: {
        symbol: 'USDT',
        name: 'Tether',
        address: '0xcBFbd38167519F4DCcfF1dbd48304a4FC8d4De32',
        decimals: 18,
        logoURI: 'https://s2.coinmarketcap.com/static/img/coins/200x200/825.png',
        color: ''
    },
    FARMR: {
        symbol: 'FARMR',
        name: 'FARMR Token',
        address: '0xb3bCB0ee6253F981A6e09044D6B2868b284a0113',
        decimals: 18,
        logoURI: 'https://res.cloudinary.com/dma1c8i6n/image/upload/f_auto,q_auto/farmr_coin_j5gfsd',
        color: ''
    },
    HAWK: {
        symbol: 'PUMP',
        name: 'Pump',
        address: '0xEDEc9DED06B2935F81f0e8815eCcdcd986B5a40B',
        decimals: 18,
        logoURI: 'https://s3.coinmarketcap.com/static-gravity/image/671df5275f824476bde27e42354a3359.jpg',
        color: ''
    }
};

export const NATIVE_TOKEN = {
    symbol: 'BLOCX',
    name: 'BLOCX Token',
    address: '0x0000000000000000000000000000000000000000', // Native token address
    decimals: 18,
    logoURI: 'https://res.cloudinary.com/dma1c8i6n/image/upload/f_auto,q_auto/blocxcoin_nhozz7',
    color: '#1E90FF'
}

export const TOKEN_LIST = Object.values(TOKENS);

export { feeToSpacing, uint256Max };
