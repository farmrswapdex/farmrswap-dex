import { useParams } from 'react-router-dom';
import SaleWidget from '../components/Launchpad/SaleWidget';
import LaunchpadLayout from '../components/Launchpad/LaunchpadLayout';
import type { Project } from '../types/project';
import { getProjectById } from '../types/project';

interface ProjectDetailsProps {
    project?: Project;
}

const ProjectDetails = ({ project: propProject }: ProjectDetailsProps) => {
    const { id } = useParams();

    // Use prop project if provided, otherwise fetch by ID
    const project = propProject || getProjectById(id || '1');

    if (!project) {
        return (
            <LaunchpadLayout>
                <div className="container mx-auto py-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
                        <p className="text-gray-600">The project you're looking for doesn't exist.</p>
                    </div>
                </div>
            </LaunchpadLayout>
        );
    }

    const progress = (parseFloat(project.sale.raised) / parseFloat(project.sale.hardCap)) * 100;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Live':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'Upcoming':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Ended':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <LaunchpadLayout>
            <div className="container mx-auto py-8">
                {/* Hero Section */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 mb-8">
                    {/* Project Image */}
                    <div className="relative h-64 md:h-80 overflow-hidden">
                        <img
                            src={project.image}
                            alt={project.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute top-6 right-6">
                            <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(project.status)}`}>
                                {project.status}
                            </span>
                        </div>
                        <div className="absolute top-6 left-6">
                            <span className="px-4 py-2 rounded-full text-sm font-medium bg-black/20 text-white backdrop-blur-sm">
                                {project.category}
                            </span>
                        </div>
                        <div className="absolute bottom-6 left-6 right-6">
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{project.name}</h1>
                            <p className="text-white/90 text-lg">{project.description}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Project Information */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Token Details Card */}
                        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                                Token Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-600 mb-1">Token Name</p>
                                    <p className="font-semibold text-gray-900">{project.token.name}</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-600 mb-1">Symbol</p>
                                    <p className="font-semibold text-gray-900">{project.token.symbol}</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-600 mb-1">Price</p>
                                    <p className="font-semibold text-gray-900">{project.token.price}</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-600 mb-1">Total Supply</p>
                                    <p className="font-semibold text-gray-900">{project.token.totalSupply}</p>
                                </div>
                            </div>
                        </div>

                        {/* Sale Progress Card */}
                        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                <svg className="w-6 h-6 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                Sale Progress
                            </h2>

                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-gray-700">Progress</span>
                                    <span className="text-sm font-medium text-gray-700">{progress.toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
                                    <span>{project.sale.raised} raised</span>
                                    <span>{project.sale.hardCap} goal</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-600 mb-1">Soft Cap</p>
                                    <p className="font-semibold text-gray-900">{project.sale.softCap}</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-600 mb-1">Hard Cap</p>
                                    <p className="font-semibold text-gray-900">{project.sale.hardCap}</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-600 mb-1">Min Contribution</p>
                                    <p className="font-semibold text-gray-900">{project.sale.minContribution}</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-600 mb-1">Max Contribution</p>
                                    <p className="font-semibold text-gray-900">{project.sale.maxContribution}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sale Widget Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8">
                            <SaleWidget />
                        </div>
                    </div>
                </div>
            </div>
        </LaunchpadLayout>
    );
};

export default ProjectDetails;
