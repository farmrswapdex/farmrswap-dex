import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
    return (
        <div className="border rounded-lg p-4">
            <h2 className="text-xl font-bold">{project.name}</h2>
            <p>{project.description}</p>
            <Link to={`/launchpad/${project.id}`} className="text-blue-500 hover:underline">
                View Project
            </Link>
        </div>
    );
};

export default ProjectCard;
