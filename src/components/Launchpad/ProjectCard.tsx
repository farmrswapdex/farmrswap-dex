import { Link } from 'react-router-dom';
import type { Project } from '../../types/project';

const ProjectCard = ({ project }: { project: Project; }) => {
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
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group">
            {/* Image Container */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(project.status)}`}>
                        {project.status}
                    </span>
                </div>
                <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-black/20 text-white backdrop-blur-sm">
                        {project.category}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {project.name}
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                    {project.description}
                </p>

                {/* Action Button */}
                <Link
                    to={`/launchpad/${project.id}`}
                    className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                    View Project
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </div>
        </div>
    );
};

export default ProjectCard;
