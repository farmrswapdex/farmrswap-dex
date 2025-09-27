import VestingSchedule from '../components/Launchpad/VestingSchedule';

const projects = [
    {
        id: 1,
        name: 'Project 1',
        claimed: '500 TKN',
        claimable: '500 TKN',
        vesting: [
            { date: '2025-11-01', amount: '250 TKN' },
            { date: '2025-12-01', amount: '250 TKN' },
        ],
    },
    {
        id: 2,
        name: 'Project 2',
        claimed: '1000 TKN',
        claimable: '0 TKN',
        vesting: [],
    },
];

const Claim = () => {
    const handleClaim = (projectId: number) => {
        alert(`Claiming tokens for project ${projectId}`);
    };

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">Claim Tokens</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {projects.map((project) => (
                    <div key={project.id} className="border rounded-lg p-4">
                        <h2 className="text-xl font-bold mb-4">{project.name}</h2>
                        <p><strong>Claimed:</strong> {project.claimed}</p>
                        <p><strong>Claimable:</strong> {project.claimable}</p>
                        <VestingSchedule vesting={project.vesting} />
                        <button
                            onClick={() => handleClaim(project.id)}
                            className="bg-blue-500 text-white rounded-lg px-4 py-2 mt-4"
                            disabled={project.claimable === '0 TKN'}
                        >
                            Claim
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Claim;
