
const FarmForm = () => {
    return (
        <div className="mt-4 p-4 bg-[#1a2538] rounded-lg">
            <h4 className="text-white text-lg mb-2">Stake LP Tokens</h4>
            <div className="mb-4">
                <label htmlFor="lpTokenStake" className="block text-[#b0c4d4] text-sm font-bold mb-2">LP Tokens to Stake</label>
                <input
                    type="text"
                    id="lpTokenStake"
                    placeholder="Enter amount of LP tokens to stake"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-[#e0e7ef]"
                />
            </div>
            <button className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-md w-full transition">
                Stake LP Tokens
            </button>
        </div>
    );
};

export default FarmForm;