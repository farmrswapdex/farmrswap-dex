const FeatureCard = ({ title, description, emoji }: { title: string, description: string, emoji: string }) => (
    <div className="bg-white/50 backdrop-blur-lg rounded-2xl shadow-md p-6 mx-4 w-64 h-56 flex flex-col justify-between transform hover:scale-105 transition-transform duration-300 border border-white/30">
        <div>
            <span className="text-5xl">{emoji}</span>
            <h3 className="text-2xl font-bold text-[#22314a] mt-4 mb-2">{title}</h3>
            <p className="text-[#3e526a]">{description}</p>
        </div>
    </div>
);

export default FeatureCard