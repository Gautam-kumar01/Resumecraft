
const starterResumes = [
    {
        id: 'software-engineer',
        role: 'Software Engineer',
        title: 'Full Stack Developer Starter',
        industry: 'Technology',
        targetCompanies: ['Google', 'Meta', 'Netflix', 'Microsoft'],
        description: 'Optimized for high-performance engineering roles at top-tier tech giants.',
        templateId: 'modern',
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
        id: 'data-scientist',
        role: 'Data Scientist',
        title: 'AI & Data Science Specialist',
        industry: 'Analytics & AI',
        targetCompanies: ['Amazon', 'Tesla', 'OpenAI', 'NVIDIA'],
        description: 'Master-level template for roles in AI, Machine Learning, and Big Data Analytics.',
        templateId: 'modern',
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
        id: 'ux-designer',
        role: 'UX/UI Designer',
        title: 'Creative Product Designer',
        industry: 'Design',
        targetCompanies: ['Apple', 'Airbnb', 'Adobe', 'Uber'],
        description: 'Visual-focused template emphasizing user-centric design and aesthetic precision.',
        templateId: 'visual',
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
        id: 'finance-analyst',
        role: 'Finance Analyst',
        title: 'Investment & Finance Starter',
        industry: 'Finance',
        targetCompanies: ['Goldman Sachs', 'J.P. Morgan', 'Morgan Stanley'],
        description: 'Professional template for high-stakes roles in Investment Banking and Financial Analysis.',
        templateId: 'elegant',
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
        id: 'marketing-manager',
        role: 'Marketing Manager',
        title: 'Growth & Brand Strategist',
        industry: 'Marketing',
        targetCompanies: ['HubSpot', 'Nike', 'Coca-Cola', 'Google'],
        description: 'Dynamic template for leaders in Digital Marketing, Brand Growth, and Strategy.',
        templateId: 'visual',
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
