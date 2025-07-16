import * as Form from '@radix-ui/react-form';
import TokenSelector from './TokenSelector';

interface Token {
    symbol: string;
    name: string;
    address: string;
    decimals: number;
    logoURI: string;
    color: string;
}

interface LimitOrderFormProps {
    fromToken: Token | null;
    toToken: Token | null;
    fromAmount: string;
    limitPrice: string;
    toAmount: string;
    handleFromAmountChange: (value: string) => void;
    handleLimitPriceChange: (value: string) => void;
    onFromTokenSelectClick: () => void;
    onToTokenSelectClick: () => void;
}

const LimitOrderForm = ({
    fromToken,
    toToken,
    fromAmount,
    limitPrice,
    toAmount,
    handleFromAmountChange,
    handleLimitPriceChange,
    onFromTokenSelectClick,
    onToTokenSelectClick,
}: LimitOrderFormProps) => {
    return (
        <Form.Root className="w-full bg-[#f6f6f6] rounded-2xl p-0 flex flex-col gap-0">
            {/* Sell Section */}
            <Form.Field name="fromAmount" className="flex flex-col gap-1 border-b border-gray-200 px-6 py-4">
                <Form.Label className="text-lg font-semibold text-gray-700 mb-1">Sell</Form.Label>
                <div className="flex items-center gap-2">
                    <Form.Control asChild>
                        <input
                            type="text"
                            value={fromAmount}
                            onChange={(e) => handleFromAmountChange(e.target.value)}
                            placeholder="0.0"
                            className="flex-1 bg-transparent text-2xl font-semibold text-black outline-none placeholder-gray-400"
                        />
                    </Form.Control>
                    <TokenSelector
                        selectedToken={fromToken}
                        onClick={onFromTokenSelectClick}
                    />
                </div>
                <span className="text-right text-sm text-gray-400 pr-2">~$0.00</span>
            </Form.Field>

            {/* Limit Price Section */}
            <Form.Field name="limitPrice" className="flex flex-col gap-1 border-b border-gray-200 px-6 py-4">
                <Form.Label className="text-lg font-semibold text-gray-700 mb-1">Limit Price</Form.Label>
                <div className="flex items-center gap-2">
                    <Form.Control asChild>
                        <input
                            type="text"
                            value={limitPrice}
                            onChange={(e) => handleLimitPriceChange(e.target.value)}
                            placeholder="0.0"
                            className="flex-1 bg-transparent text-2xl font-semibold text-black outline-none placeholder-gray-400"
                        />
                    </Form.Control>
                    <span className="text-xl font-semibold text-black">{toToken?.symbol || 'Select Token'}</span>
                </div>
                <span className="text-right text-sm text-gray-400 pr-2">Price per {fromToken?.symbol}</span>
            </Form.Field>

            {/* Buy Section */}
            <Form.Field name="toAmount" className="flex flex-col gap-1 px-6 py-4">
                <Form.Label className="text-lg font-semibold text-gray-700 mb-1">Buy (Estimated)</Form.Label>
                <div className="flex items-center gap-2">
                    <Form.Control asChild>
                        <input
                            type="text"
                            value={toAmount}
                            readOnly
                            placeholder="0.0"
                            className="flex-1 bg-transparent text-2xl font-semibold text-black outline-none placeholder-gray-400"
                        />
                    </Form.Control>
                    <TokenSelector
                        selectedToken={toToken}
                        onClick={onToTokenSelectClick}
                    />
                </div>
                <span className="text-right text-sm text-gray-400 pr-2">~$0.00</span>
            </Form.Field>
        </Form.Root>
    );
};

export default LimitOrderForm;
