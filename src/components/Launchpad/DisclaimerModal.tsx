import { useState } from 'react';

interface DisclaimerModalProps {
    isOpen: boolean;
    onAgree: () => void;
}

const DisclaimerModal = ({ isOpen, onAgree }: DisclaimerModalProps) => {
    const [isAgreed, setIsAgreed] = useState(false);

    if (!isOpen) return null;

    const handleAgree = () => {
        if (isAgreed) {
            onAgree();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Launchpad Disclaimer</h2>
                        <p className="text-gray-600">Please read and agree to the following disclaimer before proceeding.</p>
                    </div>

                    {/* Disclaimer Content */}
                    <div className="bg-gray-50 rounded-lg p-6 mb-8">
                        <p className="text-gray-700 mb-4">
                            By using <span className="font-semibold text-orange-600">FarmrSwap Launchpad</span>, you acknowledge and agree that:
                        </p>

                        <ul className="space-y-3 text-gray-700">
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                                </svg>
                                <span><strong>Cryptocurrency investments carry high risk</strong> and may result in significant financial loss</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                                </svg>
                                <span><strong>You should only invest what you can afford to lose</strong> without affecting your essential needs</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                                </svg>
                                <span><strong>You will comply with all applicable laws and regulations</strong> in your jurisdiction</span>
                            </li>
                        </ul>
                    </div>

                    {/* Agreement Checkbox */}
                    <div className="mb-8">
                        <label className="flex items-start cursor-pointer group">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    checked={isAgreed}
                                    onChange={(e) => setIsAgreed(e.target.checked)}
                                    className="sr-only"
                                />
                                <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-200 ${isAgreed
                                    ? 'bg-orange-600 border-orange-600'
                                    : 'border-gray-300 group-hover:border-orange-400'
                                    }`}>
                                    {isAgreed && (
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                            <span className="ml-3 text-gray-700 text-sm leading-relaxed">
                                I have read, understood, and agree to the above disclaimer and terms of use for the FarmrSwap Launchpad platform.
                            </span>
                        </label>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={handleAgree}
                            disabled={!isAgreed}
                            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${isAgreed
                                ? 'bg-orange-600 text-white hover:bg-orange-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            I Agree & Continue
                        </button>
                        <button
                            onClick={() => window.history.back()}
                            className="flex-1 px-6 py-3 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200"
                        >
                            Go Back
                        </button>
                    </div>

                    {/* Footer Note */}
                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-500">
                            By continuing, you confirm that you are of legal age and have the capacity to enter into this agreement.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DisclaimerModal;
