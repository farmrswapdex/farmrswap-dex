export const sortTokens = (tokenA: any, tokenB: any) => {
  if (tokenA.address.toLowerCase() < tokenB.address.toLowerCase()) {
    return [tokenA, tokenB];
  }
  return [tokenB, tokenA];
};
