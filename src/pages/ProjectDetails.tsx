import { useParams } from 'react-router-dom';
import SaleWidget from '../components/Launchpad/SaleWidget';

const ProjectDetails = () => {
    const { id } = useParams();

    // Dummy data for the project
    const project = {
        name: `Project ${id}`,
        token: {
            name: 'Token',
            symbol: 'TKN',
            price: '1 ETH = 1000 TKN',
        },
        sale: {
            softCap: '100 ETH',
            hardCap: '500 ETH',
            raised: '250 ETH',
            startTime: '2025-10-01T12:00:00Z',
            endTime: '2025-10-10T12:00:00Z',
        },
    };

    const progress = (parseFloat(project.sale.raised) / parseFloat(project.sale.hardCap)) * 100;

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">{project.name}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-2xl font-bold mb-4">Sale Details</h2>
                    <p><strong>Token:</strong> {project.token.name} ({project.token.symbol})</p>
                    <p><strong>Price:</strong> {project.token.price}</p>
                    <p><strong>Soft Cap:</strong> {project.sale.softCap}</p>
                    <p><strong>Hard Cap:</strong> {project.sale.hardCap}</p>
                    <p><strong>Start Time:</strong> {new Date(project.sale.startTime).toLocaleString()}</p>
                    <p><strong>End Time:</strong> {new Date(project.sale.endTime).toLocaleString()}</p>
                    <div className="mt-4">
                        <h3 className="text-lg font-bold">Progress</h3>
                        <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                            <div
                                className="bg-blue-500 h-4 rounded-full"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{project.sale.raised} raised of {project.sale.hardCap}</p>
                    </div>
                </div>
                <div>
                    <SaleWidget />
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;
