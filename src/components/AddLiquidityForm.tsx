import React from 'react';

const AddLiquidityForm = () => {
    return (
        <div className="mt-4 p-4 bg-[#1a2538] rounded-lg">
            <h4 className="text-white text-lg mb-2">Add Liquidity</h4>
            <div className="mb-4">
                <label htmlFor="tokenA" className="block text-[#b0c4d4] text-sm font-bold mb-2">Token A</label>
                <input
                    type="text"
                    id="tokenA"
                    placeholder="Enter amount"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-[#e0e7ef]"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="tokenB" className="block text-[#b0c4d4] text-sm font-bold mb-2">Token B</label>
                <input
                    type="text"
                    id="tokenB"
                    placeholder="Enter amount"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-[#e0e7ef]"
                />
            </div>
            <button className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-md w-full transition">
                Add Liquidity
            </button>
        </div>
    );
};

export default AddLiquidityForm;