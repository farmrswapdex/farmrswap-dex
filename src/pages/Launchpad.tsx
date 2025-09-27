import { useState, useEffect } from 'react';
import ProjectCard from '../components/Launchpad/ProjectCard';
import LaunchpadLayout from '../components/Launchpad/LaunchpadLayout';
import DisclaimerModal from '../components/Launchpad/DisclaimerModal';
import { projects } from '../types/project';

const Launchpad = () => {
    const [showDisclaimer, setShowDisclaimer] = useState(false);
    const [hasAgreed, setHasAgreed] = useState(false);

    useEffect(() => {
        // Check if user has already agreed to disclaimer
        const agreed = localStorage.getItem('farmrswap-launchpad-disclaimer-agreed');
        if (agreed === 'true') {
            setHasAgreed(true);
        } else {
            setShowDisclaimer(true);
        }
    }, []);

    const handleAgree = () => {
        localStorage.setItem('farmrswap-launchpad-disclaimer-agreed', 'true');
        setHasAgreed(true);
        setShowDisclaimer(false);
    };

    if (!hasAgreed) {
        return <DisclaimerModal isOpen={showDisclaimer} onAgree={handleAgree} />;
    }

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
