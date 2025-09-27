import { Link } from 'react-router-dom';
import LaunchpadLayout from '../components/Launchpad/LaunchpadLayout';

const UserDashboard = () => {
    // Enhanced dummy data for the user
    const user = {
        address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        kycStatus: 'Approved',
        whitelistStatus: 'Active',
        totalInvested: '2.5 ETH',
        totalEarned: '1.2 ETH',
        participatedProjects: [
            {
                id: 1,
                name: 'GreenYield Protocol',
                symbol: 'GYT',
                amount: '1000 GYT',
                investedAmount: '1.0 ETH',
                currentValue: '1.2 ETH',
                status: 'Active',
                vestingEnd: '2025-06-15',
                progress: 60
            },
            {
                id: 2,
                name: 'QuantumSwap',
                symbol: 'QST',
                amount: '2000 QST',
                investedAmount: '1.5 ETH',
                currentValue: '0.8 ETH',
                status: 'Completed',
                vestingEnd: '2025-03-20',
                progress: 100
            },
        ],
        pendingClaims: [
            {
                id: 1,
                name: 'GreenYield Protocol',
                symbol: 'GYT',
                amount: '500 GYT',
                claimableDate: '2025-02-15',
                value: '0.6 ETH'
            },
        ],
        recentActivity: [
            { id: 1, type: 'Investment', project: 'GreenYield Protocol', amount: '1.0 ETH', date: '2025-01-15', status: 'Completed' },
            { id: 2, type: 'Claim', project: 'QuantumSwap', amount: '200 QST', date: '2025-01-10', status: 'Completed' },
            { id: 3, type: 'Investment', project: 'QuantumSwap', amount: '1.5 ETH', date: '2025-01-05', status: 'Completed' },
        ]
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Approved':
            case 'Active':
            case 'Completed':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <LaunchpadLayout>
            <div className="container mx-auto py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">User Dashboard</h1>
                    <p className="text-gray-600">Manage your investments and track your portfolio</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total Invested</p>
                                <p className="text-2xl font-bold text-gray-900">{user.totalInvested}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total Earned</p>
                                <p className="text-2xl font-bold text-green-600">{user.totalEarned}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Active Projects</p>
                                <p className="text-2xl font-bold text-gray-900">{user.participatedProjects.filter(p => p.status === 'Active').length}</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Pending Claims</p>
                                <p className="text-2xl font-bold text-orange-600">{user.pendingClaims.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Account Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            KYC Status
                        </h2>
                        <div className="flex items-center justify-between">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(user.kycStatus)}`}>
                                {user.kycStatus}
                            </span>
                            <span className="text-sm text-gray-500">Verified</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Whitelist Status
                        </h2>
                        <div className="flex items-center justify-between">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(user.whitelistStatus)}`}>
                                {user.whitelistStatus}
                            </span>
                            <Link to="/whitelist" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                Manage
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Participated Projects */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        Participated Projects
                    </h2>
                    <div className="space-y-4">
                        {user.participatedProjects.map((project) => (
                            <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{project.name}</h3>
                                        <p className="text-sm text-gray-600">{project.symbol}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(project.status)}`}>
                                        {project.status}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-600">Amount</p>
                                        <p className="font-semibold">{project.amount}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Invested</p>
                                        <p className="font-semibold">{project.investedAmount}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Current Value</p>
                                        <p className={`font-semibold ${project.currentValue > project.investedAmount ? 'text-green-600' : 'text-red-600'}`}>
                                            {project.currentValue}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Vesting Progress</p>
                                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full"
                                                style={{ width: `${project.progress}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">{project.progress}%</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pending Claims */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Pending Claims
                    </h2>
                    {user.pendingClaims.length > 0 ? (
                        <div className="space-y-4">
                            {user.pendingClaims.map((claim) => (
                                <div key={claim.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{claim.name}</h3>
                                            <p className="text-sm text-gray-600">{claim.symbol}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900">{claim.amount}</p>
                                            <p className="text-sm text-gray-600">Value: {claim.value}</p>
                                        </div>
                                    </div>
                                    <div className="mt-3 flex items-center justify-between">
                                        <span className="text-sm text-gray-600">
                                            Claimable: {new Date(claim.claimableDate).toLocaleDateString()}
                                        </span>
                                        <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium">
                                            Claim Now
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">No pending claims</p>
                    )}
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Recent Activity
                    </h2>
                    <div className="space-y-3">
                        {user.recentActivity.map((activity) => (
                            <div key={activity.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                                <div className="flex items-center">
                                    <div className={`w-2 h-2 rounded-full mr-3 ${activity.type === 'Investment' ? 'bg-blue-500' : 'bg-green-500'
                                        }`}></div>
                                    <div>
                                        <p className="font-medium text-gray-900">{activity.type} - {activity.project}</p>
                                        <p className="text-sm text-gray-600">{activity.amount}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-600">{new Date(activity.date).toLocaleDateString()}</p>
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(activity.status)}`}>
                                        {activity.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </LaunchpadLayout>
    );
};

export default UserDashboard;
