import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { defineChain } from 'viem/utils';
import { http } from "wagmi";

// Define your custom chain
const customChain = defineChain({
    id: 879151, // Your chain ID
    name: 'BLOCX. Mainnet',
    nativeCurrency: {
        decimals: 18,
        name: 'BLOCX',
        symbol: 'BLOCX',
    },
    rpcUrls: {
        default: {
            http: ['https://rpc.blocxscan.com'],
        },
        public: {
            http: ['https://rpc.blocxscan.com'],
        },
    },
    blockExplorers: {
        default: { name: 'Blocx Explorer', url: 'https://blocxscan.com/' },
    },
});

export const config = getDefaultConfig({
    appName: "FarmrSwap",
    projectId: "8X1df9Wbcqj6A7LWG71Ra5yLYj-1eL7y",
    chains: [customChain],
    transports: {
        [customChain.id]: http(),
    }
});
