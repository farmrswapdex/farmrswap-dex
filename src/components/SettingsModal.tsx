import { X } from 'lucide-react';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    slippage: number;
    setSlippage: (value: number) => void;
    deadline: number;
    setDeadline: (value: number) => void;
}

const SettingsModal = ({ isOpen, onClose, slippage, setSlippage, deadline, setDeadline }: SettingsModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 mx-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-2">Slippage Tolerance</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={slippage}
                                onChange={(e) => setSlippage(parseFloat(e.target.value))}
                                className="w-full px-4 py-2 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="0.5"
                            />
                            <span className="text-lg text-gray-500">%</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-2">Transaction Deadline</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={deadline}
                                onChange={(e) => setDeadline(parseInt(e.target.value, 10))}
                                className="w-full px-4 py-2 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="20"
                            />
                            <span className="text-lg text-gray-500">minutes</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
