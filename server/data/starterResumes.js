
const starterResumes = [
    {
        id: 'google-engineer',
        role: 'Software Engineer',
        title: 'Google Elite Blueprint',
        industry: 'Technology',
        targetCompanies: ['Google', 'Meta', 'Netflix', 'Microsoft'],
        description: 'Optimized for high-performance engineering roles at top-tier tech giants.',
        templateId: 'modern',
        imageUrl: 'https://images.unsplash.com/photo-1573163281530-5be9c89b75a8?q=80&w=800&auto=format&fit=crop',
        skills: [
            'JavaScript (ES6+)', 'React.js', 'Node.js', 'TypeScript', 'MongoDB',
            'Docker', 'Kubernetes', 'AWS', 'System Design', 'Agile Methodology',
            'Advanced Algorithms', 'Scalable Architecture'
        ],
        summary: 'Passionate and challenge-driven Software Engineer with 3+ years of experience in building scalable web applications. Proficient in modern JavaScript frameworks and cloud-native architectures.',
        experience: [
            {
                company: 'Global Tech Hub',
                position: 'Senior Software Engineer',
                startDate: '2021-01',
                endDate: 'Present',
                description: 'Migrated monolithic architecture to microservices, reducing deployment time by 60% and improving scalability.'
            }
        ],
        education: [
            {
                institution: 'State Technical University',
                degree: 'B.S. in Computer Science',
                startDate: '2016',
                endDate: '2020',
                description: 'First Class Honors. Focus on Distributed Systems.'
            }
        ]
    },
    {
        id: 'amazon-data',
        role: 'Data Scientist',
        title: 'Amazon Data Mastery',
        industry: 'Analytics & AI',
        targetCompanies: ['Amazon', 'Tesla', 'OpenAI', 'NVIDIA'],
        description: 'Master-level template for roles in AI, Machine Learning, and Big Data Analytics.',
        templateId: 'modern',
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
        skills: [
            'Python', 'SQL', 'TensorFlow', 'PyTorch',
            'Scikit-Learn', 'Pandas', 'Spark', 'Tableau', 'BigQuery',
            'Deep Learning', 'Natural Language Processing', 'Data Engineering'
        ],
        summary: 'Data Scientist with a strong background in statistical analysis and machine learning. Experienced in transforming complex data sets into actionable business insights.',
        experience: [
            {
                company: 'DeepData Labs',
                position: 'AI Research Associate',
                startDate: '2020-06',
                endDate: 'Present',
                description: 'Orchestrated the development of a churn prediction model with 92% accuracy.'
            }
        ]
    },
    {
        id: 'apple-designer',
        role: 'UX/UI Designer',
        title: 'Apple Visual Artisan',
        industry: 'Design',
        targetCompanies: ['Apple', 'Airbnb', 'Adobe', 'Uber'],
        description: 'Visual-focused template emphasizing user-centric design and aesthetic precision.',
        templateId: 'visual',
        imageUrl: 'https://images.unsplash.com/photo-1586717791821-3f44a563dc4c?q=80&w=800&auto=format&fit=crop',
        skills: [
            'Figma', 'Adobe XD', 'Prototyping', 'Design Systems', 'Visual Hierarchy',
            'User Testing', 'Micro-interactions', 'Icon Design', 'Layout Optimization'
        ],
        summary: 'Detail-oriented UX/UI Designer dedicated to creating seamless digital experiences. Proven ability to translate complex user needs into beautiful, functional interfaces.',
        experience: [
            {
                company: 'PixelPerfect Agency',
                position: 'Senior Product Designer',
                startDate: '2021-04',
                endDate: 'Present',
                description: 'Led the redesign of a major fintech app, resulting in a 40% increase in user engagement and 20% faster workflow.'
            }
        ]
    },
    {
        id: 'microsoft-finance',
        role: 'Finance Analyst',
        title: 'Microsoft Core Finance',
        industry: 'Finance',
        targetCompanies: ['Goldman Sachs', 'J.P. Morgan', 'Morgan Stanley', 'Microsoft'],
        description: 'Professional template for high-stakes roles in Investment Banking and Financial Analysis.',
        templateId: 'elegant',
        imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800&auto=format&fit=crop',
        skills: [
            'Financial Modeling', 'Excel (VBA)', 'SQL', 'Valuation Analysis',
            'Strategic Planning', 'Report Writing', 'Corporate Finance', 'Capital Markets'
        ],
        summary: 'Analytical Finance Professional with expertise in financial modeling and strategic planning. Committed to delivering accurate data-driven insights for investment decisions.',
        experience: [
            {
                company: 'WallStreet Partners',
                position: 'Investment Analyst',
                startDate: '2021-02',
                endDate: 'Present',
                description: 'Analyzed portfolio performance for high-net-worth clients, consistently exceeding quarterly targets by 15%.'
            }
        ]
    },
    {
        id: 'netflix-marketing',
        role: 'Marketing Manager',
        title: 'Netflix Growth Strategy',
        industry: 'Marketing',
        targetCompanies: ['HubSpot', 'Nike', 'Coca-Cola', 'Google', 'Netflix'],
        description: 'Dynamic template for leaders in Digital Marketing, Brand Growth, and Strategy.',
        templateId: 'visual',
        imageUrl: 'https://images.unsplash.com/photo-1551288560-66936b61ee2b?q=80&w=800&auto=format&fit=crop',
        skills: [
            'SEO/SEM', 'Content Strategy', 'Google Ads', 'Analytics',
            'Brand Management', 'Copywriting', 'CRM Management', 'Lead Generation'
        ],
        summary: 'Innovative Marketing Manager with 5+ years of experience in driving customer acquisition and brand awareness through multi-channel digital strategies.',
        experience: [
            {
                company: 'Vanguard Growth',
                position: 'Marketing Lead',
                startDate: '2019-10',
                endDate: 'Present',
                description: 'Increased organic traffic by 150% and reduced CPA by 30% through targeted performance marketing campaigns.'
            }
        ]
    }
];

module.exports = starterResumes;
