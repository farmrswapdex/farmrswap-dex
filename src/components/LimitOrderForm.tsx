import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { TOKENS } from '../lib/constants';
import TokenSelector from './TokenSelector';

interface Token {
    symbol: string;
    name: string;
    address: string;
    decimals: number;
    logoURI: string;
    color: string;
}

const LimitOrderForm = () => {
    const { openConnectModal } = useConnectModal();
    const { isConnected } = useAccount();

    const [fromToken, setFromToken] = useState<Token | null>(TOKENS.BLOCKX);
    const [toToken, setToToken] = useState<Token | null>(null);
    const [fromAmount, setFromAmount] = useState('');
    const [limitPrice, setLimitPrice] = useState('');
    const [toAmount, setToAmount] = useState('');

    console.log(setToAmount)

    const handleFromAmountChange = (value: string) => {
        setFromAmount(value);
        // TODO: Add logic to calculate estimated toAmount based on limitPrice
    };

    const handleLimitPriceChange = (value: string) => {
        setLimitPrice(value);
        // TODO: Add logic to calculate estimated toAmount based on limitPrice
    };

    const handleTokenSelect = (token: Token, isFromToken: boolean) => {
        if (isFromToken) {
            setFromToken(token);
            if (toToken?.symbol === token.symbol) {
                setToToken(fromToken);
            }
        } else {
            setToToken(token);
            if (fromToken?.symbol === token.symbol) {
                setFromToken(toToken);
            }
        }
    };

    const handlePlaceLimitOrder = () => {
        if (!isConnected) {
            openConnectModal?.();
            return;
        }

        // TODO: Implement actual limit order placement logic
        console.log('Placing Limit Order:', {
            fromToken,
            toToken,
            fromAmount,
            limitPrice,
            toAmount
        });
    };

    const canPlaceOrder = fromToken && toToken && fromAmount && limitPrice && parseFloat(fromAmount) > 0 && parseFloat(limitPrice) > 0;

    return (
        <div className="w-max bg-[#f6f6f6] backdrop-blur-sm rounded-3xl shadow-lg p-0 flex flex-col items-center">

            {/* Limit Order Box */}
            <div className="w-full bg-[#f6f6f6] rounded-2xl p-0 flex flex-col gap-0">
                {/* Sell Section */}
                <div className="flex flex-col gap-1 border-b border-gray-200 px-6 py-4">
                    <span className="text-lg font-semibold text-gray-700 mb-1">Sell</span>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={fromAmount}
                            onChange={(e) => handleFromAmountChange(e.target.value)}
                            placeholder="0.0"
                            className="flex-1 bg-transparent text-2xl font-semibold text-black outline-none placeholder-gray-400"
                        />
                        <TokenSelector
                            selectedToken={fromToken}
                            onTokenSelect={(token) => handleTokenSelect(token, true)}
                        />
                    </div>
                    <span className="text-right text-sm text-gray-400 pr-2">~$0.00</span>
                </div>

                {/* Limit Price Section */}
                <div className="flex flex-col gap-1 border-b border-gray-200 px-6 py-4">
                    <span className="text-lg font-semibold text-gray-700 mb-1">Limit Price</span>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={limitPrice}
                            onChange={(e) => handleLimitPriceChange(e.target.value)}
                            placeholder="0.0"
                            className="flex-1 bg-transparent text-2xl font-semibold text-black outline-none placeholder-gray-400"
                        />
                        <span className="text-xl font-semibold text-black">{toToken?.symbol || 'Select Token'}</span>
                    </div>
                    <span className="text-right text-sm text-gray-400 pr-2">Price per {fromToken?.symbol}</span>
                </div>

                {/* Buy Section */}
                <div className="flex flex-col gap-1 px-6 py-4">
                    <span className="text-lg font-semibold text-gray-700 mb-1">Buy (Estimated)</span>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={toAmount}
                            readOnly
                            placeholder="0.0"
                            className="flex-1 bg-transparent text-2xl font-semibold text-black outline-none placeholder-gray-400"
                        />
                        <TokenSelector
                            selectedToken={toToken}
                            onTokenSelect={(token) => handleTokenSelect(token, false)}
                        />
                    </div>
                    <span className="text-right text-sm text-gray-400 pr-2">~$0.00</span>
                </div>
            </div>

            {/* Place Limit Order Button */}
            <button
                onClick={handlePlaceLimitOrder}
                disabled={!canPlaceOrder}
                className={`w-full mt-8 py-4 rounded-full text-xl font-bold shadow-md transition-all duration-200 ${canPlaceOrder
                    ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transform hover:scale-[1.02]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
            >
                {!isConnected ? 'Connect Wallet' : 'Place Limit Order'}
            </button>
        </div>
    );
};

export default LimitOrderForm;