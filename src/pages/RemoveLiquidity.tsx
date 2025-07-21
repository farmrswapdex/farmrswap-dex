import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import MobileWarning from '../components/MobileWarning';
import RemoveLiquidityComponent from '../components/RemoveLiquidity';

const RemoveLiquidityPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { position } = location.state || {};

    if (!position) {
        // If no position is passed in state, redirect to the pools page
        return <Navigate to="/pools" replace />;
    }

    return (
        <div className="w-full min-h-screen bg-[#a7d8f5]">
            <MobileWarning />
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
                <div className="w-full max-w-lg backdrop-blur-lg rounded-2xl shadow-lg p-6 flex flex-col items-center bg-white/50">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Remove Liquidity</h2>
                    <p className="text-gray-600 mb-6">From {position.tokenA.symbol}/{position.tokenB.symbol} Pool</p>
                    <RemoveLiquidityComponent
                        tokenA={position.tokenA}
                        tokenB={position.tokenB}
                        onBack={() => navigate('/pools')}
                    />
                </div>
            </div>
        </div>
    );
};

export default RemoveLiquidityPage;