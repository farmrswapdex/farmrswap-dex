import ProjectCard from '../components/Launchpad/ProjectCard';

const projects = [
    { id: 1, name: 'Project 1', description: 'This is the first project' },
    { id: 2, name: 'Project 2', description: 'This is the second project' },
    { id: 3, name: 'Project 3', description: 'This is the third project' },
];

const Launchpad = () => {
    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">Launchpad</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>
        </div>
    );
};

export default Launchpad;
