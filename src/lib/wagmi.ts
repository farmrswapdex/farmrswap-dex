import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { defineChain } from "viem";

const blocxMainnet = defineChain({
    id: 86996,
    name: "BLOCX Mainnet",
    nativeCurrency: {
        decimals: 18,
        name: "BLOCX",
        symbol: "BLOCX",
    },
    rpcUrls: {
        default: {
            http: ["https://rpc.blocxscan.com"],
        },
    },
    blockExplorers: {
        default: {
            name: "BLOCX Explorer",
            url: "https://blocxscan.com",
        },
    },
});

export const config = getDefaultConfig({
    appName: "FarmrSwap",
    projectId: "13e76db15cd90ceba29a7a96ecb52519",
    chains: [blocxMainnet],
    transports: {
        [blocxMainnet.id]: http(),
    },
});