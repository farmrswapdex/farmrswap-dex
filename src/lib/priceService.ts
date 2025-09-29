import { TOKENS } from './constants';

// A mapping from chain names to CoinGecko asset platform IDs
const networkToAssetPlatform: { [key: string]: string; } = {
    'homestead': 'ethereum',
    'mainnet': 'ethereum',
    'ethereum': 'ethereum',
    'sepolia': 'ethereum', // Sepolia uses ethereum platform for price data
    'polygon': 'polygon-pos',
    'arbitrum': 'arbitrum-one',
    'arbitrum-one': 'arbitrum-one',
    'bsc': 'binance-smart-chain',
    'avalanche': 'avalanche',
    'optimism': 'optimistic-ethereum',
};

// Native token addresses that should be treated as the chain's native currency
const NATIVE_TOKEN_ADDRESSES = [
    '0x0000000000000000000000000000000000000000',
    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
];

interface TokenPrices {
    [key: string]: {
        usd: number;
    };
}

interface PriceResult {
    [address: string]: number;
}

/**
 * Fetches the USD price for a list of token contract addresses on a given network.
 * @param tokenAddresses - An array of token contract addresses.
 * @param network - The name of the network (e.g., 'mainnet', 'sepolia').
 * @returns A promise that resolves to a map of token addresses to their USD prices.
 */
export const getTokenPrices = async (
    tokenAddresses: string[],
    network: string
): Promise<PriceResult> => {
    // Validate inputs
    if (!tokenAddresses || tokenAddresses.length === 0) {
        return {};
    }

    const assetPlatform = networkToAssetPlatform[network.toLowerCase()];
    if (!assetPlatform) {
        console.warn(`Unsupported network for price fetching: ${network}`);
        return {};
    }

    // Normalize addresses to lowercase for consistent handling
    const normalizedAddresses = tokenAddresses.map(addr => addr.toLowerCase());

    // Identify native token addresses
    const nativeAddresses = normalizedAddresses.filter(addr =>
        NATIVE_TOKEN_ADDRESSES.includes(addr)
    );

    // Get non-native token addresses
    const nonNativeAddresses = normalizedAddresses.filter(addr =>
        !NATIVE_TOKEN_ADDRESSES.includes(addr)
    );

    const prices: PriceResult = {};

    try {
        // Fetch prices for non-native tokens
        if (nonNativeAddresses.length > 0) {
            const contractPrices = await fetchContractPrices(nonNativeAddresses, assetPlatform);
            Object.assign(prices, contractPrices);
        }

        // Handle native token pricing
        if (nativeAddresses.length > 0) {
            const nativePrice = await fetchNativeTokenPrice(network, assetPlatform);
            if (nativePrice !== null) {
                nativeAddresses.forEach(addr => {
                    prices[addr] = nativePrice;
                });
            }
        }

        return prices;
    } catch (error) {
        console.error("Failed to fetch token prices:", error);
        return {};
    }
};

/**
 * Fetches prices for contract addresses using CoinGecko's token price API
 */
async function fetchContractPrices(addresses: string[], assetPlatform: string): Promise<PriceResult> {
    if (addresses.length === 0) return {};

    // CoinGecko has a limit on the number of addresses per request (usually 250)
    const BATCH_SIZE = 250;
    const prices: PriceResult = {};

    for (let i = 0; i < addresses.length; i += BATCH_SIZE) {
        const batch = addresses.slice(i, i + BATCH_SIZE);
        const url = `https://api.coingecko.com/api/v3/simple/token_price/${assetPlatform}?contract_addresses=${batch.join(',')}&vs_currencies=usd`;

        try {
            const response = await fetch(url, {
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                if (response.status === 429) {
                    // Rate limiting - wait and retry
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    i -= BATCH_SIZE; // Retry this batch
                    continue;
                }
                throw new Error(`CoinGecko API failed with status: ${response.status}`);
            }

            const data: TokenPrices = await response.json();

            // Process the response data
            for (const [address, priceData] of Object.entries(data)) {
                if (priceData?.usd && typeof priceData.usd === 'number') {
                    prices[address.toLowerCase()] = priceData.usd;
                }
            }
        } catch (error) {
            console.error(`Failed to fetch batch starting at index ${i}:`, error);
            // Continue with other batches
        }
    }

    return prices;
}

/**
 * Fetches the native token price for a given network
 */
async function fetchNativeTokenPrice(network: string, assetPlatform: string): Promise<number | null> {
    // Map networks to their native token CoinGecko IDs
    const nativeTokenIds: { [key: string]: string; } = {
        'ethereum': 'ethereum',
        'homestead': 'ethereum',
        'mainnet': 'ethereum',
        'sepolia': 'ethereum',
        'polygon': 'matic-network',
        'arbitrum': 'ethereum', // Arbitrum uses ETH as native token
        'arbitrum-one': 'ethereum',
        'bsc': 'binancecoin',
        'avalanche': 'avalanche-2',
        'optimism': 'ethereum', // Optimism uses ETH as native token
    };

    const nativeTokenId = nativeTokenIds[network.toLowerCase()];
    if (!nativeTokenId) {
        // Fallback: try to use WBLOCX if available
        if (TOKENS?.WBLOCX?.address) {
            try {
                const contractPrices = await fetchContractPrices([TOKENS.WBLOCX.address.toLowerCase()], assetPlatform);
                return contractPrices[TOKENS.WBLOCX.address.toLowerCase()] || null;
            } catch (error) {
                console.error("Failed to fetch WBLOCX price as native token fallback:", error);
            }
        }
        return null;
    }

    try {
        const url = `https://api.coingecko.com/api/v3/simple/price?ids=${nativeTokenId}&vs_currencies=usd`;
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`CoinGecko API failed with status: ${response.status}`);
        }

        const data = await response.json();
        return data[nativeTokenId]?.usd || null;
    } catch (error) {
        console.error(`Failed to fetch native token price for ${network}:`, error);
        return null;
    }
}

/**
 * Helper function to get a single token price
 */
export const getTokenPrice = async (tokenAddress: string, network: string): Promise<number | null> => {
    const prices = await getTokenPrices([tokenAddress], network);
    return prices[tokenAddress.toLowerCase()] || null;
};