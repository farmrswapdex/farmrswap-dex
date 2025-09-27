import WhitelistForm from '../components/Launchpad/WhitelistForm';
import LaunchpadLayout from '../components/Launchpad/LaunchpadLayout';

const Whitelist = () => {
    return (
        <LaunchpadLayout>
            <div className="container mx-auto py-8">
                <h1 className="text-3xl font-bold mb-8">Whitelist Registration</h1>
                <WhitelistForm />
            </div>
        </LaunchpadLayout>
    );
};

export default Whitelist;