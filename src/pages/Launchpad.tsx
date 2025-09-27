import ProjectCard from '../components/Launchpad/ProjectCard';
import LaunchpadLayout from '../components/Launchpad/LaunchpadLayout';
import { projects } from '../types/project';

const Launchpad = () => {
    return (
        <LaunchpadLayout>
            <div className="container mx-auto py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            </div>
        </LaunchpadLayout>
    );
};

export default Launchpad;
