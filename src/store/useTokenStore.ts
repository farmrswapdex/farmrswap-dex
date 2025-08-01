import { readContracts } from '@wagmi/core';
import { erc20Abi, formatUnits } from 'viem';
import { create } from 'zustand';
import { TOKEN_LIST, NATIVE_TOKEN } from '../lib/constants';
import { config } from '../lib/wagmi';

interface Token {
    symbol: string;
    name: string;
    address: string;
    decimals: number;
    logoURI: string;
    color: string;
}

interface UserToken extends Token {
    balance: string;
}

interface TokenStoreState {
    userTokens: UserToken[];
    fetchUserTokens: (address: `0x${string}` | undefined) => Promise<void>;
    loading: boolean;
}

export const useTokenStore = create<TokenStoreState>((set) => ({
    userTokens: [],
    loading: false,

    fetchUserTokens: async (address) => {
        if (!address) {
            set({ userTokens: [], loading: false });
            return;
        }

        set({ loading: true });

        try {
            // Get ETH balance from wagmi config
            const { getBalance } = await import('@wagmi/core');
            const ethBalance = await getBalance(config, { address });
            
            const tokenContracts = TOKEN_LIST.map(token => ({
                address: token.address as `0x${string}`,
                abi: erc20Abi,
                functionName: 'balanceOf',
                args: [address],
            }));

            const balances = await readContracts(config, {
                contracts: tokenContracts,
            });

            // Create user tokens list starting with native token
            const userTokens = [
                // Add native token first
                { 
                    ...NATIVE_TOKEN, 
                    balance: formatUnits(ethBalance.value, 18) 
                },
                // Add other tokens
                ...TOKEN_LIST.map((token, index) => {
                    const balanceResult = balances[index];
                    const balance = balanceResult.status === 'success'
                        ? formatUnits(BigInt(balanceResult.result), token.decimals)
                        : '0';
                    return { ...token, balance };
                })
            ];

            set({ userTokens, loading: false });
        } catch (error) {
            console.error("Error fetching token balances:", error);
            set({ loading: false });
        }
    },
}));
