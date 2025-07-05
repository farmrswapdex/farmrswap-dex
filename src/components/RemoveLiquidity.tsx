import React from 'react';

const RemoveLiquidity = () => {
    return (
        <div className="mt-4 p-4 bg-[#1a2538] rounded-lg">
            <h4 className="text-white text-lg mb-2">Remove Liquidity</h4>
            <div className="mb-4">
                <label htmlFor="lpTokens" className="block text-[#b0c4d4] text-sm font-bold mb-2">LP Tokens</label>
                <input
                    type="text"
                    id="lpTokens"
                    placeholder="Enter amount of LP tokens"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-[#e0e7ef]"
                />
            </div>
            <button className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-md w-full transition">
                Remove Liquidity
            </button>
        </div>
    );
};

export default RemoveLiquidity;