import { useEffect, useRef } from 'react';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    slippage: number;
    setSlippage: (value: number) => void;
    deadline: number;
    setDeadline: (value: number) => void;
    className?: string;
}

const SettingsModal = ({ isOpen, onClose, slippage, setSlippage, deadline, setDeadline, className }: SettingsModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div ref={modalRef} className={`absolute z-50 bg-white rounded-2xl shadow-xl w-80 p-4 ${className}`} onClick={(e) => e.stopPropagation()}>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Slippage Tolerance</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            value={slippage}
                            onChange={(e) => setSlippage(parseFloat(e.target.value))}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="0.5"
                        />
                        <span className="text-sm text-gray-500">%</span>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Transaction Deadline</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            value={deadline}
                            onChange={(e) => setDeadline(parseInt(e.target.value, 10))}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="20"
                        />
                        <span className="text-sm text-gray-500">minutes</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;