import { Link } from 'react-router-dom';

const UserDashboard = () => {
    // Dummy data for the user
    const user = {
        kycStatus: 'Approved',
        participatedProjects: [
            { id: 1, name: 'Project 1', amount: '1000 TKN' },
            { id: 2, name: 'Project 2', amount: '500 TKN' },
        ],
        pendingClaims: [
            { id: 1, name: 'Project 1', amount: '500 TKN' },
        ],
    };

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">User Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-2xl font-bold mb-4">KYC Status</h2>
                    <p>{user.kycStatus}</p>
                </div>
                <div>
                    <h2 className="text-2xl font-bold mb-4">Whitelist Registration</h2>
                    <Link to="/whitelist" className="text-blue-500 hover:underline">
                        Apply for Whitelist
                    </Link>
                </div>
            </div>
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Participated Projects</h2>
                <ul>
                    {user.participatedProjects.map((project) => (
                        <li key={project.id} className="flex justify-between">
                            <span>{project.name}</span>
                            <span>{project.amount}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Pending Claims</h2>
                <ul>
                    {user.pendingClaims.map((claim) => (
                        <li key={claim.id} className="flex justify-between">
                            <span>{claim.name}</span>
                            <span>{claim.amount}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default UserDashboard;
