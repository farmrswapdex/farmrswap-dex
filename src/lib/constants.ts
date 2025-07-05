import { MaxUint256 } from 'ethers';

const uint256Max = MaxUint256;

const feeToSpacing = {
    3000: 60,
    500: 10
}

// forge inspect UniswapV3Pool bytecode| xargs cast keccak
const poolCodeHash = "0x9dc805423bd1664a6a73b31955de538c338bac1f5c61beb8f4635be5032076a2";

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
    VIC: {
        symbol: 'VIC',
        name: 'Victory Token',
        address: '0x0000000000000000000000000000000000000000', // Placeholder address
        decimals: 18,
        logoURI: 'https://via.placeholder.com/32/FFD700/000000?text=VIC',
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