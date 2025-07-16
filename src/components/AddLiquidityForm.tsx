import * as Form from '@radix-ui/react-form';

const AddLiquidityForm = () => {
    return (
        <Form.Root className="mt-4 p-4 bg-[#1a2538] rounded-lg">
            <h4 className="text-white text-lg mb-2">Add Liquidity</h4>
            <Form.Field name="tokenA" className="mb-4">
                <div className="flex items-baseline justify-between">
                    <Form.Label className="block text-[#b0c4d4] text-sm font-bold mb-2">Token A</Form.Label>
                </div>
                <Form.Control asChild>
                    <input
                        type="text"
                        placeholder="Enter amount"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-[#e0e7ef]"
                    />
                </Form.Control>
            </Form.Field>
            <Form.Field name="tokenB" className="mb-4">
                <div className="flex items-baseline justify-between">
                    <Form.Label className="block text-[#b0c4d4] text-sm font-bold mb-2">Token B</Form.Label>
                </div>
                <Form.Control asChild>
                    <input
                        type="text"
                        placeholder="Enter amount"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-[#e0e7ef]"
                    />
                </Form.Control>
            </Form.Field>
            <Form.Submit asChild>
                <button className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-md w-full transition">
                    Add Liquidity
                </button>
            </Form.Submit>
        </Form.Root>
    );
};

export default AddLiquidityForm;