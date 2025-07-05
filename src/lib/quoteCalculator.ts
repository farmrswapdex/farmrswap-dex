
interface QuoteParams {
    fromToken: string;
    toToken: string;
    amount: string;
}

interface QuoteResult {
    inputAmount: string;
    outputAmount: string;
    priceImpact: number;
    fee: number;
    route: string[];
}

// Mock quote calculation - in a real implementation, this would call the DEX contract
export const calculateQuote = async ({ fromToken, toToken, amount }: QuoteParams): Promise<QuoteResult | null> => {
    if (!amount || parseFloat(amount) <= 0) {
        return null;
    }

    // Mock exchange rates (in a real app, these would come from price feeds)
    const mockRates: { [key: string]: number } = {
        'WETH': 2000, // $2000 per ETH
        'USDC': 1,    // $1 per USDC
        'VIC': 0.5,   // $0.5 per VIC
        'TOMATO': 0.1 // $0.1 per TOMATO
    };

    const fromRate = mockRates[fromToken] || 1;
    const toRate = mockRates[toToken] || 1;

    const inputAmountUSD = parseFloat(amount) * fromRate;
    const outputAmountUSD = inputAmountUSD * 0.997; // 0.3% fee
    const outputAmount = (outputAmountUSD / toRate).toString();

    const priceImpact = 0.1; // Mock price impact
    const fee = 0.3; // 0.3% fee

    return {
        inputAmount: amount,
        outputAmount,
        priceImpact,
        fee,
        route: [fromToken, toToken]
    };
};

// Format number with appropriate decimals
export const formatNumber = (value: string, decimals: number = 6): string => {
    const num = parseFloat(value);
    if (isNaN(num)) return '0';

    if (num === 0) return '0';

    if (num < 0.000001) return '<0.000001';

    return num.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: decimals
    });
};

// Parse user input and convert to proper decimal format
export const parseAmount = (value: string, decimals: number): string => {
    if (!value) return '0';

    // Remove any non-numeric characters except decimal point
    const cleanValue = value.replace(/[^0-9.]/g, '');

    // Ensure only one decimal point
    const parts = cleanValue.split('.');
    if (parts.length > 2) return parts[0] + '.' + parts.slice(1).join('');

    // Limit decimal places
    if (parts.length === 2 && parts[1].length > decimals) {
        return parts[0] + '.' + parts[1].substring(0, decimals);
    }

    return cleanValue;
}; 