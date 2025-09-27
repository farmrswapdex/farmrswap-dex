import { useState } from 'react';
import LaunchpadLayout from '../components/Launchpad/LaunchpadLayout';

const Create = () => {
    const [formData, setFormData] = useState({
        // Basic Information
        projectName: '',
        projectDescription: '',
        projectWebsite: '',
        projectLogo: '',
        category: '',

        // Token Information
        tokenName: '',
        tokenSymbol: '',
        tokenDecimals: 18,
        totalSupply: '',
        tokenPrice: '',

        // Sale Information
        softCap: '',
        hardCap: '',
        minContribution: '',
        maxContribution: '',
        startDate: '',
        endDate: '',

        // Vesting Information
        vestingEnabled: false,
        vestingDuration: '',
        vestingCliff: '',

        // Additional Information
        whitelistRequired: false,
        kycRequired: false,
        features: [''],
        socialLinks: {
            twitter: '',
            telegram: '',
            discord: '',
            github: ''
        }
    });

    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 4;

    const handleInputChange = (field: string, value: string | number | boolean) => {
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...(prev[parent as keyof typeof prev] as Record<string, string> || {}),
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const handleFeatureChange = (index: number, value: string) => {
        const newFeatures = [...formData.features];
        newFeatures[index] = value;
        setFormData(prev => ({
            ...prev,
            features: newFeatures
        }));
    };

    const addFeature = () => {
        setFormData(prev => ({
            ...prev,
            features: [...prev.features, '']
        }));
    };

    const removeFeature = (index: number) => {
        const newFeatures = formData.features.filter((_, i) => i !== index);
        setFormData(prev => ({
            ...prev,
            features: newFeatures
        }));
    };

    const nextStep = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Project data:', formData);
        // Here you would typically submit to your backend
        alert('Project created successfully! (This is a demo)');
    };

    const categories = [
        'DeFi', 'NFT', 'Gaming', 'Infrastructure', 'Governance',
        'Lending', 'DEX', 'Yield Farming', 'Cross-chain', 'Other'
    ];

    const StepIndicator = () => (
        <div className="flex items-center justify-center mb-8">
            {Array.from({ length: totalSteps }, (_, i) => (
                <div key={i} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${i + 1 <= currentStep
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                        }`}>
                        {i + 1}
                    </div>
                    {i < totalSteps - 1 && (
                        <div className={`w-16 h-1 mx-2 ${i + 1 < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                            }`} />
                    )}
                </div>
            ))}
        </div>
    );

    const Step1 = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h2>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Name *</label>
                <input
                    type="text"
                    value={formData.projectName}
                    onChange={(e) => handleInputChange('projectName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your project name"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Description *</label>
                <textarea
                    value={formData.projectDescription}
                    onChange={(e) => handleInputChange('projectDescription', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe your project in detail"
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Website</label>
                    <input
                        type="url"
                        value={formData.projectWebsite}
                        onChange={(e) => handleInputChange('projectWebsite', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://yourproject.com"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    >
                        <option value="">Select a category</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Logo URL</label>
                <input
                    type="url"
                    value={formData.projectLogo}
                    onChange={(e) => handleInputChange('projectLogo', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://yourproject.com/logo.png"
                />
            </div>
        </div>
    );

    const Step2 = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Token Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Token Name *</label>
                    <input
                        type="text"
                        value={formData.tokenName}
                        onChange={(e) => handleInputChange('tokenName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., GreenYield Token"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Token Symbol *</label>
                    <input
                        type="text"
                        value={formData.tokenSymbol}
                        onChange={(e) => handleInputChange('tokenSymbol', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., GYT"
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Decimals</label>
                    <input
                        type="number"
                        value={formData.tokenDecimals}
                        onChange={(e) => handleInputChange('tokenDecimals', parseInt(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                        max="18"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Supply *</label>
                    <input
                        type="text"
                        value={formData.totalSupply}
                        onChange={(e) => handleInputChange('totalSupply', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 1000000000"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Token Price *</label>
                    <input
                        type="text"
                        value={formData.tokenPrice}
                        onChange={(e) => handleInputChange('tokenPrice', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 1 ETH = 1000 TOKENS"
                        required
                    />
                </div>
            </div>
        </div>
    );

    const Step3 = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Sale Configuration</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Soft Cap (ETH) *</label>
                    <input
                        type="text"
                        value={formData.softCap}
                        onChange={(e) => handleInputChange('softCap', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 100"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hard Cap (ETH) *</label>
                    <input
                        type="text"
                        value={formData.hardCap}
                        onChange={(e) => handleInputChange('hardCap', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 500"
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Min Contribution (ETH) *</label>
                    <input
                        type="text"
                        value={formData.minContribution}
                        onChange={(e) => handleInputChange('minContribution', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 0.1"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Contribution (ETH) *</label>
                    <input
                        type="text"
                        value={formData.maxContribution}
                        onChange={(e) => handleInputChange('maxContribution', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 10"
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                    <input
                        type="datetime-local"
                        value={formData.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
                    <input
                        type="datetime-local"
                        value={formData.endDate}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    />
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="whitelistRequired"
                        checked={formData.whitelistRequired}
                        onChange={(e) => handleInputChange('whitelistRequired', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="whitelistRequired" className="ml-2 text-sm text-gray-700">
                        Require whitelist for participation
                    </label>
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="kycRequired"
                        checked={formData.kycRequired}
                        onChange={(e) => handleInputChange('kycRequired', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="kycRequired" className="ml-2 text-sm text-gray-700">
                        Require KYC verification
                    </label>
                </div>
            </div>
        </div>
    );

    const Step4 = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Information</h2>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Key Features</label>
                {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                        <input
                            type="text"
                            value={feature}
                            onChange={(e) => handleFeatureChange(index, e.target.value)}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter a key feature"
                        />
                        <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="px-3 py-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addFeature}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                    + Add Feature
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                    <input
                        type="url"
                        value={formData.socialLinks.twitter}
                        onChange={(e) => handleInputChange('socialLinks.twitter', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://twitter.com/yourproject"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Telegram</label>
                    <input
                        type="url"
                        value={formData.socialLinks.telegram}
                        onChange={(e) => handleInputChange('socialLinks.telegram', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://t.me/yourproject"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Discord</label>
                    <input
                        type="url"
                        value={formData.socialLinks.discord}
                        onChange={(e) => handleInputChange('socialLinks.discord', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://discord.gg/yourproject"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">GitHub</label>
                    <input
                        type="url"
                        value={formData.socialLinks.github}
                        onChange={(e) => handleInputChange('socialLinks.github', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://github.com/yourproject"
                    />
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Vesting Configuration</h3>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="vestingEnabled"
                        checked={formData.vestingEnabled}
                        onChange={(e) => handleInputChange('vestingEnabled', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="vestingEnabled" className="ml-2 text-sm text-gray-700">
                        Enable token vesting
                    </label>
                </div>

                {formData.vestingEnabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Vesting Duration (days)</label>
                            <input
                                type="number"
                                value={formData.vestingDuration}
                                onChange={(e) => handleInputChange('vestingDuration', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., 365"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Cliff Period (days)</label>
                            <input
                                type="number"
                                value={formData.vestingCliff}
                                onChange={(e) => handleInputChange('vestingCliff', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., 90"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const renderStep = () => {
        switch (currentStep) {
            case 1: return <Step1 />;
            case 2: return <Step2 />;
            case 3: return <Step3 />;
            case 4: return <Step4 />;
            default: return <Step1 />;
        }
    };

    return (
        <LaunchpadLayout>
            <div className="container mx-auto py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create a New Project</h1>
                        <p className="text-gray-600">Launch your token on FarmrSwap Launchpad</p>
                    </div>

                    <StepIndicator />

                    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                        {renderStep()}

                        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={prevStep}
                                disabled={currentStep === 1}
                                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${currentStep === 1
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                Previous
                            </button>

                            <div className="flex gap-4">
                                {currentStep < totalSteps ? (
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold"
                                    >
                                        Next
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-semibold"
                                    >
                                        Create Project
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </LaunchpadLayout>
    );
};

export default Create;