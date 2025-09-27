import { useState } from 'react';

const WhitelistForm = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        alert(`You have applied to the whitelist with email: ${email}`);
    };

    return (
        <form onSubmit={handleSubmit} className="border rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4">Whitelist Registration</h2>
            <div className="mb-4">
                <label htmlFor="email" className="block mb-1">Email</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border rounded-lg p-2 w-full"
                    required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="message" className="block mb-1">Message (Optional)</label>
                <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="border rounded-lg p-2 w-full"
                ></textarea>
            </div>
            <button type="submit" className="bg-blue-500 text-white rounded-lg px-4 py-2">
                Apply
            </button>
        </form>
    );
};

export default WhitelistForm;
