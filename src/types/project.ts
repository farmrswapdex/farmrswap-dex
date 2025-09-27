export interface Project {
    id: string;
    name: string;
    description: string;
    image: string;
    category: string;
    status: 'Live' | 'Upcoming' | 'Ended';
    token: {
        name: string;
        symbol: string;
        price: string;
        totalSupply: string;
        decimals: number;
    };
    sale: {
        softCap: string;
        hardCap: string;
        raised: string;
        startTime: string;
        endTime: string;
        minContribution: string;
        maxContribution: string;
    };
    features: string[];
}

export const projects: Project[] = [
    {
        id: '1',
        name: 'GreenYield Protocol',
        description: 'Sustainable DeFi farming with carbon-neutral yield strategies. Earn rewards while supporting environmental initiatives through verified green bonds and renewable energy projects.',
        image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop&crop=center',
        category: 'Sustainability',
        status: 'Live',
        token: {
            name: 'GreenYield Token',
            symbol: 'GYT',
            price: '1 ETH = 1000 GYT',
            totalSupply: '10,000,000 GYT',
            decimals: 18,
        },
        sale: {
            softCap: '100 ETH',
            hardCap: '500 ETH',
            raised: '250 ETH',
            startTime: '2025-01-15T12:00:00Z',
            endTime: '2025-02-15T12:00:00Z',
            minContribution: '0.1 ETH',
            maxContribution: '10 ETH',
        },
        features: [
            'Carbon-neutral yield farming',
            'Verified green bond integration',
            'Renewable energy project support',
            'Community governance',
            'Transparent impact reporting'
        ]
    },
    {
        id: '2',
        name: 'MetaVault',
        description: 'Next-generation cross-chain asset management platform. Seamlessly manage your portfolio across multiple blockchains with advanced risk management and automated rebalancing.',
        image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop&crop=center',
        category: 'Infrastructure',
        status: 'Upcoming',
        token: {
            name: 'MetaVault Token',
            symbol: 'MVT',
            price: '1 ETH = 500 MVT',
            totalSupply: '50,000,000 MVT',
            decimals: 18,
        },
        sale: {
            softCap: '200 ETH',
            hardCap: '1000 ETH',
            raised: '0 ETH',
            startTime: '2025-02-01T12:00:00Z',
            endTime: '2025-03-01T12:00:00Z',
            minContribution: '0.5 ETH',
            maxContribution: '20 ETH',
        },
        features: [
            'Multi-chain portfolio management',
            'Advanced risk analytics',
            'Automated rebalancing',
            'Institutional-grade security',
            'Cross-chain bridge integration'
        ]
    },
    {
        id: '3',
        name: 'QuantumSwap',
        description: 'Revolutionary DEX with quantum-resistant security and zero-slippage trading. Experience lightning-fast swaps with institutional-grade security and MEV protection.',
        image: 'https://images.unsplash.com/photo-1639322537504-6427a16b0a28?w=800&h=400&fit=crop&crop=center',
        category: 'DEX',
        status: 'Live',
        token: {
            name: 'QuantumSwap Token',
            symbol: 'QST',
            price: '1 ETH = 2000 QST',
            totalSupply: '25,000,000 QST',
            decimals: 18,
        },
        sale: {
            softCap: '150 ETH',
            hardCap: '750 ETH',
            raised: '400 ETH',
            startTime: '2025-01-01T12:00:00Z',
            endTime: '2025-01-31T12:00:00Z',
            minContribution: '0.2 ETH',
            maxContribution: '15 ETH',
        },
        features: [
            'Quantum-resistant security',
            'Zero-slippage trading',
            'MEV protection',
            'Institutional-grade security',
            'Lightning-fast execution'
        ]
    },
    {
        id: '4',
        name: 'NexusDAO',
        description: 'Community-driven governance platform for decentralized decision making. Participate in protocol upgrades, treasury management, and ecosystem development through innovative voting mechanisms.',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop&crop=center',
        category: 'Governance',
        status: 'Upcoming',
        token: {
            name: 'NexusDAO Token',
            symbol: 'NDT',
            price: '1 ETH = 800 NDT',
            totalSupply: '100,000,000 NDT',
            decimals: 18,
        },
        sale: {
            softCap: '300 ETH',
            hardCap: '1500 ETH',
            raised: '0 ETH',
            startTime: '2025-03-01T12:00:00Z',
            endTime: '2025-04-01T12:00:00Z',
            minContribution: '1 ETH',
            maxContribution: '50 ETH',
        },
        features: [
            'Decentralized governance',
            'Treasury management',
            'Protocol upgrade voting',
            'Community proposals',
            'Transparent decision making'
        ]
    },
    {
        id: '5',
        name: 'StellarLend',
        description: 'Peer-to-peer lending protocol with dynamic interest rates and flexible collateral options. Borrow and lend digital assets with competitive rates and transparent risk assessment.',
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop&crop=center',
        category: 'Lending',
        status: 'Live',
        token: {
            name: 'StellarLend Token',
            symbol: 'SLT',
            price: '1 ETH = 1500 SLT',
            totalSupply: '75,000,000 SLT',
            decimals: 18,
        },
        sale: {
            softCap: '250 ETH',
            hardCap: '1200 ETH',
            raised: '600 ETH',
            startTime: '2025-01-10T12:00:00Z',
            endTime: '2025-02-10T12:00:00Z',
            minContribution: '0.3 ETH',
            maxContribution: '25 ETH',
        },
        features: [
            'Dynamic interest rates',
            'Flexible collateral options',
            'Risk assessment tools',
            'Peer-to-peer lending',
            'Competitive rates'
        ]
    },
    {
        id: '6',
        name: 'CryptoCraft',
        description: 'Gaming-focused DeFi ecosystem where players can earn, trade, and stake in-game assets. Bridge the gap between traditional gaming and decentralized finance.',
        image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=400&fit=crop&crop=center',
        category: 'Gaming',
        status: 'Upcoming',
        token: {
            name: 'CryptoCraft Token',
            symbol: 'CCT',
            price: '1 ETH = 3000 CCT',
            totalSupply: '200,000,000 CCT',
            decimals: 18,
        },
        sale: {
            softCap: '400 ETH',
            hardCap: '2000 ETH',
            raised: '0 ETH',
            startTime: '2025-04-01T12:00:00Z',
            endTime: '2025-05-01T12:00:00Z',
            minContribution: '0.1 ETH',
            maxContribution: '30 ETH',
        },
        features: [
            'In-game asset trading',
            'Play-to-earn mechanics',
            'NFT integration',
            'Gaming tournaments',
            'DeFi yield farming'
        ]
    }
];

export const getProjectById = (id: string): Project | undefined => {
    return projects.find(project => project.id === id);
};
