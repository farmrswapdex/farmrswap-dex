import { getCreate2Address, keccak256, solidityPacked } from 'ethers';
import { poolCodeHash } from './constants';

const sortTokens = (tokenA: string, tokenB: string) => {
    return tokenA.toLowerCase() < tokenB.toLowerCase() ? [tokenA, tokenB] : [tokenB, tokenA];
}

const computePoolAddress = (factory: string, tokenA: string, tokenB: string, fee: number) => {
    [tokenA, tokenB] = sortTokens(tokenA, tokenB);

    return getCreate2Address(
        factory,
        keccak256(
            solidityPacked(
                ['address', 'address', 'uint24'],
                [tokenA, tokenB, fee]
            )),
        poolCodeHash
    );
}

export default computePoolAddress;