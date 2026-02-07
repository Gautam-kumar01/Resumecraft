
const starterResumes = [
    {
        id: 'google-engineer',
        role: 'Software Engineer',
        title: 'Google Elite L5 Blueprint',
        industry: 'Technology',
        targetCompanies: ['Google', 'Meta', 'Netflix', 'Microsoft'],
        description: 'Engineered for high-complexity software roles at Google and top-tier silicon valley giants.',
        templateId: 'modern',
        imageUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=800&auto=format&fit=crop',
        personalInfo: {
            fullName: 'Alexander Miller',
            email: 'alex.miller@example.com',
            phone: '+1 (555) 000-1111',
            address: 'Mountain View, CA',
            linkedin: 'linkedin.com/in/alexmiller',
            github: 'github.com/alex-dev'
        },
        skills: [
            'Go', 'C++', 'System Design', 'GCP', 'Kubernetes', 'Microservices',
            'Distributed Systems', 'Java', 'Python', 'React', 'NoSQL', 'Agile'
        ],
        summary: 'Senior Software Engineer with 8+ years of experience specialized in building large-scale distributed systems and cloud infrastructure. Proven track record of improving system latency by 40% and managing teams of 12+ developers.',
        experience: [
            {
                company: 'CloudScale Solutions',
                position: 'Senior Systems Architect',
                startDate: '2020-03',
                endDate: 'Present',
                description: 'Led the migration of a global streaming platform to a multi-cloud architecture. Implemented automated scaling protocols that reduced operational costs by $2M annually.'
            },
            {
                company: 'TechFlow Systems',
                position: 'Software Engineer II',
                startDate: '2017-06',
                endDate: '2020-02',
                description: 'Developed core backend APIs processing 500k+ requests/sec using Go and gRPC. Optimized database queries which improved data retrieval speeds by 35%.'
            },
            {
                company: 'Innovate AI',
                position: 'Full Stack Intern',
                startDate: '2016-01',
                endDate: '2016-12',
                description: 'Built a real-time data visualization dashboard using React and Socket.io, currently used by 200+ enterprise clients.'
            }
        ],
        education: [
            {
                institution: 'MIT',
                degree: 'M.S. in Computer Science',
                startDate: '2014',
                endDate: '2016',
                description: 'Thesis focusing on Distributed Consensus Algorithms.'
            }
        ],
        projects: [
            {
                name: 'OpenSource Distributed KV Store',
                description: 'A robust, high-availability key-value store built in C++ using the Raft consensus protocol.',
                link: 'github.com/alex-dev/kvstore',
                technologies: ['C++', 'gRPC', 'Protobuf']
            }
        ]
    },
    {
        id: 'amazon-data',
        role: 'Senior Data Scientist',
        title: 'Amazon ML Research Lead',
        industry: 'Analytics & AI',
        targetCompanies: ['Amazon', 'Tesla', 'OpenAI', 'NVIDIA'],
        description: 'The definitive blueprint for Data Science and Machine Learning roles at Amazon AWS and Alexa AI.',
        templateId: 'modern',
        imageUrl: 'https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?q=80&w=800&auto=format&fit=crop',
        personalInfo: {
            fullName: 'Sarah Chen',
            email: 'schen.data@example.com',
            phone: '+1 (555) 222-3333',
            address: 'Seattle, WA',
            linkedin: 'linkedin.com/in/sarahchen-data'
        },
        skills: [
            'Python', 'PyTorch', 'TensorFlow', 'SQL (Redshift)', 'AWS SageMaker',
            'Apache Spark', 'NLP', 'Computer Vision', 'MLOps', 'BigQuery', 'Tableau'
        ],
        summary: 'Accomplished Data Scientist with a focus on Deep Learning and predictive modeling. Expert at leveraging big data to drive customer engagement and optimize logistic supply chains.',
        experience: [
            {
                company: 'Logistics AI',
                position: 'Lead Data Scientist',
                startDate: '2019-11',
                endDate: 'Present',
                description: 'Developed a predictive maintenance model for a fleet of 5,000+ delivery vehicles, reducing downtime by 22% using LSTM networks.'
            },
            {
                company: 'MarketInsights Corp',
                position: 'Senior Data Analyst',
                startDate: '2016-08',
                endDate: '2019-10',
                description: 'Automated the sentiment analysis of 1M+ daily social media mentions, providing direct strategic insights to the C-suite for brand pivoting.'
            }
        ],
        education: [
            {
                institution: 'Stanford University',
                degree: 'PhD in Statistics',
                startDate: '2012',
                endDate: '2016',
                description: 'Research centered on High-Dimensional Data Analysis.'
            }
        ]
    },
    {
        id: 'apple-designer',
        role: 'Product Designer',
        title: 'Apple Visual Artisan',
        industry: 'Design',
        targetCompanies: ['Apple', 'Airbnb', 'Adobe', 'Uber'],
        description: 'Elite visual design template following the Apple Human Interface Guidelines strictly.',
        templateId: 'visual',
        imageUrl: 'https://images.unsplash.com/photo-1512418490241-537a8a242c31?q=80&w=800&auto=format&fit=crop',
        personalInfo: {
            fullName: 'Isabella Rossi',
            email: 'isabella.design@example.com',
            linkedin: 'linkedin.com/in/rossidesign',
            website: 'isabelladesign.io'
        },
        skills: [
            'Figma', 'Sketch', 'Principle', 'Design Systems', 'Interface Design',
            'Prototyping', 'User Research', 'Typography', 'Motion Graphics', 'SwiftUI'
        ],
        summary: 'Product Designer with a philosophy of "Simplicity is the Ultimate Sophistication." Specialist in creating pixel-perfect mobile and desktop interfaces that users love.',
        experience: [
            {
                company: 'Creative Studio X',
                position: 'Senior UI/UX Designer',
                startDate: '2021-01',
                endDate: 'Present',
                description: 'Revamped the user interface for a top-tier banking app, leading to a 4.8 star rating on the App Store and a 15% increase in daily active users.'
            },
            {
                company: 'AppVentures Inc',
                position: 'Visual Designer',
                startDate: '2018-05',
                endDate: '2020-12',
                description: 'Created an award-winning design system used across 5 distinct product lines, ensuring 100% brand consistency and 30% faster dev-handoff.'
            }
        ],
        education: [
            {
                institution: 'RISD',
                degree: 'BFA in Graphic Design',
                startDate: '2014',
                endDate: '2018'
            }
        ]
    },
    {
        id: 'microsoft-finance',
        role: 'Investment Analyst',
        title: 'MSFT Core Finance Portfolio',
        industry: 'Finance',
        targetCompanies: ['Goldman Sachs', 'J.P. Morgan', 'Morgan Stanley', 'Microsoft'],
        description: 'Prestigious finance-focused blueprint for Investment Banking and Financial Planning.',
        templateId: 'elegant',
        imageUrl: 'https://images.unsplash.com/photo-1454165833767-027ffea9e78b?q=80&w=800&auto=format&fit=crop',
        personalInfo: {
            fullName: 'Jameson Thorne',
            email: 'jameson.thorne@example.com',
            phone: '+1 (555) 999-8800',
            address: 'New York, NY',
            linkedin: 'linkedin.com/in/jamesonfinance'
        },
        skills: [
            'Financial Modeling', 'Excel (Advanced)', 'DCF Valuation', 'M&A',
            'Risk Management', 'Asset Allocation', 'Python for Finance', 'Bloomberg', 'SAP'
        ],
        summary: 'Strategic Financial Analyst with a focus on M&A valuation and corporate treasury. Expert at preparing board-level financial reports and managing multi-million dollar asset portfolios.',
        experience: [
            {
                company: 'HedgeLink Equity',
                position: 'Lead Portfolio Analyst',
                startDate: '2020-02',
                endDate: 'Present',
                description: 'Managed a portfolio with $500M AUM, consistently outperforming the S&P 500 index by 8% through rigorous quantitative analysis.'
            },
            {
                company: 'Gotham Wealth',
                position: 'Junior Investment Associate',
                startDate: '2017-09',
                endDate: '2020-01',
                description: 'Assisted in the valuation of 5 major acquisition targets, performing comprehensive du-diligence and financial projections.'
            }
        ]
    }
];

module.exports = starterResumes;
