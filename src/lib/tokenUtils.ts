import { readContracts } from '@wagmi/core';
import { erc20Abi, isAddress } from 'viem';
import { config } from './wagmi';

interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoURI: string;
  color: string;
}

export const isValidTokenAddress = (address: string): boolean => {
  return isAddress(address);
};

export const fetchTokenMetadata = async (address: string): Promise<Token | null> => {
  if (!isValidTokenAddress(address)) {
    return null;
  }

  try {
    const contracts = [
      {
        address: address as `0x${string}`,
        abi: erc20Abi,
        functionName: 'name',
      },
      {
        address: address as `0x${string}`,
        abi: erc20Abi,
        functionName: 'symbol',
      },
      {
        address: address as `0x${string}`,
        abi: erc20Abi,
        functionName: 'decimals',
      },
    ];

    const results = await readContracts(config, { contracts });

    const [nameResult, symbolResult, decimalsResult] = results;

    if (
      nameResult.status === 'success' &&
      symbolResult.status === 'success' &&
      decimalsResult.status === 'success'
    ) {
      return {
        address,
        name: nameResult.result as string,
        symbol: symbolResult.result as string,
        decimals: decimalsResult.result as number,
        logoURI: '/tokens/generic.png', // Default logo
        color: '#64748B', // Default color
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching token metadata:', error);
    return null;
  }
};