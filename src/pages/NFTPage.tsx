import FloatingTomatoes from '../components/FloatingTomatoes';
import NFTMintForm from '../components/NFTMintForm';

const NFTPage = () => {
    return (
        <div className="w-full min-h-screen bg-[#a7d8f5] flex flex-col relative">
            <FloatingTomatoes />
            <div className="relative z-10 w-full max-w-4xl mx-auto pt-8 md:pt-16 pb-8 px-4 flex-grow flex items-center justify-start flex-col">
                <NFTMintForm />
            </div>
        </div>
    );
};

export default NFTPage;