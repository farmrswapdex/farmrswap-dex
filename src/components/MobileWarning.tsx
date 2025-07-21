import { Monitor, Smartphone } from 'lucide-react';

const MobileWarning = () => {
    return (
        <div className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm text-center">
                <div className="flex justify-center items-center gap-4 mb-6">
                    <Smartphone className="w-12 h-12 text-red-500" />
                    <Monitor className="w-16 h-16 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">Desktop Experience Recommended</h2>
                <p className="text-gray-600">
                    For the best experience, please view this site on a desktop device.
                </p>
            </div>
        </div>
    );
};

export default MobileWarning;
