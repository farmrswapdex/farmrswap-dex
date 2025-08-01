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
        symbol: 'HAWK',
        name: 'HAWK Token',
        address: '0xEB638EDAA8D6A64C72d130392C29530fdC1B7444',
        decimals: 18,
        logoURI: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5ilNmaZUzgdvi3pPnSqEpLBY1lb2eUX-N_Q&s',
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
