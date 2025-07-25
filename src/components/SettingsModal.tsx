import { useEffect, useRef } from 'react';
import useIsMobile from '../lib/useIsMobile';

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
    const isMobile = useIsMobile();

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

    const content = (
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
    );

    if (isMobile) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
                <div
                    ref={modalRef}
                    className="bg-white rounded-2xl shadow-xl w-11/12 max-w-sm p-6"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-800">Settings</h3>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                    {content}
                </div>
            </div>
        );
    }

    return (
        <div ref={modalRef} className={`absolute z-50 bg-white rounded-2xl shadow-xl w-80 p-4 ${className}`} onClick={(e) => e.stopPropagation()}>
            {content}
        </div>
    );
};

export default SettingsModal;
