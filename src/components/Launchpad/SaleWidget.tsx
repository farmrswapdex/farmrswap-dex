import { useState } from 'react';

const SaleWidget = () => {
    const [amount, setAmount] = useState('');

    const handleBuy = () => {
        alert(`You bought ${amount} tokens!`);
    };

    return (
        <div className="border rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4">Buy Tokens</h2>
            <div className="mb-4">
                <p>Token Price: 1 ETH = 1000 TKN</p>
                <p>Your Allocation: 500 TKN</p>
            </div>
            <div className="flex items-center gap-4">
                <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Amount"
                    className="border rounded-lg p-2 w-full"
                />
                <button onClick={handleBuy} className="bg-blue-500 text-white rounded-lg px-4 py-2">
                    Buy
                </button>
            </div>
        </div>
    );
};

export default SaleWidget;
