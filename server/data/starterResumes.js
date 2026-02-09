
const starterResumes = [
    {
        id: 'google-L5-engineer',
        role: 'Senior Software Engineer',
        title: 'Google AI-Optimized L5 Blueprint',
        industry: 'Technology',
        experienceLevel: 'Senior',
        atsScore: 98,
        targetCompanies: ['Google', 'DeepMind', 'OpenAI'],
        description: 'Elite technical blueprint optimized for Google L5+ roles. Features AI-centric wording and architecture-heavy highlights.',
        templateId: 'modern',
        imageUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=800&auto=format&fit=crop',
        personalInfo: {
            fullName: 'David "AI" Harrison',
            email: 'david.h@google-alumni.com',
            phone: '+1 (415) 555-9000',
            address: 'Palo Alto, CA',
            linkedin: 'linkedin.com/in/david-ai-harrison',
            github: 'github.com/david-h-ai'
        },
        skills: [
            'Deep Learning', 'PyTorch', 'Large Language Models (LLMs)', 'System Design',
            'Go', 'GCP Vertex AI', 'Distributed Training', 'TensorFlow', 'Kubernetes'
        ],
        summary: 'Pioneering Senior Software Engineer with a decade of experience in AI-driven infrastructure. Specialized in optimizing inference latency for billion-parameter models and leading cross-functional teams at world-class research labs.',
        experience: [
            {
                company: 'Neural Arch Systems',
                position: 'Principal AI Infrastructure Engineer',
                startDate: '2021-05',
                endDate: 'Present',
                description: 'Orchestrated the development of a distributed training framework that increased throughput by 300%. Integrated Vertex AI pipelines to automate model deployment across 4 global regions.'
            },
            {
                company: 'Search Engine Giant',
                position: 'Senior Software Engineer (L5)',
                startDate: '2018-02',
                endDate: '2021-04',
                description: 'Core contributor to the ranking latency reduction project, shaving 45ms off global P99 latency. Managed a team of 8 engineers focusing on high-throughput C++ services.'
            }
        ],
        education: [
            {
                institution: 'Stanford University',
                degree: 'M.S. in Computer Science (AI Specialization)',
                startDate: '2016',
                endDate: '2018'
            }
        ]
    },
    {
        id: 'amazon-data',
        role: 'Senior Data Scientist',
        title: 'Amazon ML Research Lead',
        industry: 'Analytics & AI',
        experienceLevel: 'Senior',
        atsScore: 97,
        targetCompanies: ['Amazon', 'Tesla', 'NVIDIA'],
        description: 'High-performance blueprint for Data Science and ML roles at Amazon AWS and Alexa AI.',
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
            'Apache Spark', 'NLP', 'Computer Vision', 'MLOps'
        ],
        summary: 'Accomplished Data Scientist with a focus on Deep Learning and predictive modeling. Expert at leveraging big data to drive customer engagement and optimize logistic supply chains.',
        experience: [
            {
                company: 'Logistics AI',
                position: 'Lead Data Scientist',
                startDate: '2019-11',
                endDate: 'Present',
                description: 'Developed a predictive maintenance model for a fleet of 5,000+ delivery vehicles, reducing downtime by 22% using LSTM networks.'
            }
        ],
        education: [
            {
                institution: 'Stanford University',
                degree: 'PhD in Statistics',
                startDate: '2012',
                endDate: '2016'
            }
        ]
    },
    {
        id: 'apple-designer',
        role: 'Product Designer',
        title: 'Apple Visual Artisan',
        industry: 'Design',
        experienceLevel: 'Mid-Senior',
        atsScore: 95,
        targetCompanies: ['Apple', 'Airbnb', 'Adobe'],
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
            'Figma', 'Sketch', 'Design Systems', 'Interface Design',
            'Prototyping', 'User Research', 'Motion Graphics', 'SwiftUI'
        ],
        summary: 'Product Designer with a philosophy of "Simplicity is the Ultimate Sophistication." Specialist in creating pixel-perfect mobile and desktop interfaces.',
        experience: [
            {
                company: 'Creative Studio X',
                position: 'Senior UI/UX Designer',
                startDate: '2021-01',
                endDate: 'Present',
                description: 'Revamped the user interface for a top-tier banking app, leading to a 4.8 star rating and 15% increase in DAU.'
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
        experienceLevel: 'Mid-Level',
        atsScore: 96,
        targetCompanies: ['Goldman Sachs', 'Morgan Stanley', 'Microsoft'],
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
            'Risk Management', 'Asset Allocation', 'Python for Finance'
        ],
        summary: 'Strategic Financial Analyst with a focus on M&A valuation and corporate treasury. Expert at preparing board-level financial reports.',
        experience: [
            {
                company: 'HedgeLink Equity',
                position: 'Lead Portfolio Analyst',
                startDate: '2020-02',
                endDate: 'Present',
                description: 'Managed a portfolio with $500M AUM, consistently outperforming the S&P 500 index by 8%.'
            }
        ]
    },
    {
        id: 'netflix-marketing',
        role: 'Marketing Lead',
        title: 'Netflix Growth Strategy',
        industry: 'Marketing',
        experienceLevel: 'Senior',
        atsScore: 94,
        targetCompanies: ['Netflix', 'Spotify', 'Disney+'],
        description: 'High-impact blueprint for growth marketing and content strategy at major streaming giants.',
        templateId: 'visual',
        imageUrl: 'https://images.unsplash.com/photo-1551288560-66936b61ee2b?q=80&w=800&auto=format&fit=crop',
        personalInfo: {
            fullName: 'Marcus Vane',
            email: 'marcus.v@netflix-standard.com',
            linkedin: 'linkedin.com/in/marcusgrowth'
        },
        skills: [
            'Content Strategy', 'Growth Hacking', 'A/B Testing', 'Retention Analysis',
            'SQL', 'Tableau', 'Social Ad Optimization', 'Brand Management'
        ],
        summary: 'Dynamic Marketing professional specializing in subscription-based growth and viral content strategies. Proven track record of reducing churn by 12% in competitive markets.',
        experience: [
            {
                company: 'Streamify Global',
                position: 'Director of Growth',
                startDate: '2019-06',
                endDate: 'Present',
                description: 'Led a cross-functional team of 15 to launch a new Tier-2 market division, acquiring 2M users within the first 6 months.'
            }
        ],
        education: [
            {
                institution: 'Wharton School',
                degree: 'MBA in Marketing',
                startDate: '2017',
                endDate: '2019'
            }
        ]
    },
    {
        id: 'meta-engineer',
        role: 'Software Engineer',
        title: 'Meta Full-Stack Architect',
        industry: 'Technology',
        experienceLevel: 'Mid-Senior',
        atsScore: 99,
        targetCompanies: ['Meta', 'Uber', 'Twitter'],
        description: 'Optimized for high-velocity engineering cultures. Highlights React, GraphQL, and large-scale system architecture.',
        templateId: 'modern',
        imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop',
        personalInfo: {
            fullName: 'Jordan Lee',
            email: 'jordan.lee@meta-example.com',
            linkedin: 'linkedin.com/in/jordanlee-dev'
        },
        skills: [
            'React', 'GraphQL', 'Hack/PHP', 'Relay', 'System Design',
            'Cassandra', 'Memcached', 'CI/CD Pipelines'
        ],
        summary: 'Full Stack Engineer with deep expertise in the React ecosystem and graph-based data layers. Passionate about building scalable, user-centric interfaces serving millions of daily active users.',
        experience: [
            {
                company: 'Social Connect Inc.',
                position: 'Senior Frontend Engineer',
                startDate: '2020-03',
                endDate: 'Present',
                description: 'Rebuilt the core messaging infrastructure using GraphQL and Relay, reducing data fetching latency by 40%.'
            }
        ],
        education: [
            {
                institution: 'UC Berkeley',
                degree: 'B.S. Electrical Engineering & CS',
                startDate: '2015',
                endDate: '2019'
            }
        ]
    },
    {
        id: 'tesla-ai',
        role: 'AI Engineer',
        title: 'Tesla Autopilot Vision',
        industry: 'Automotive & AI',
        experienceLevel: 'Mid-Level',
        atsScore: 96,
        targetCompanies: ['Tesla', 'Waymo', 'Rivian'],
        description: 'Engineering blueprint for computer vision and robotics. Emphasizes C++, real-time systems, and deep learning.',
        templateId: 'minimalist',
        imageUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981d?q=80&w=800&auto=format&fit=crop',
        personalInfo: {
            fullName: 'Alex Musk',
            email: 'alex.m@tesla-example.com',
            linkedin: 'linkedin.com/in/alexmusk-ai'
        },
        skills: [
            'C++', 'Computer Vision', 'PyTorch', 'CUDA', 'ROS',
            'SLAM', 'Sensor Fusion', 'Real-time Systems'
        ],
        summary: 'Robotics and AI Engineer focused on autonomous systems. Experienced in deploying deep learning models to edge devices with strict latency constraints.',
        experience: [
            {
                company: 'Future Drive Labs',
                position: 'Computer Vision Engineer',
                startDate: '2021-01',
                endDate: 'Present',
                description: 'Implemented a novel object detection pipeline for autonomous navigation, improving pedestrian detection accuracy by 15% in low-light conditions.'
            }
        ],
        education: [
            {
                institution: 'MIT',
                degree: 'M.S. Robotics',
                startDate: '2018',
                endDate: '2020'
            }
        ]
    },
    {
        id: 'adobe-creative',
        role: 'Creative Director',
        title: 'Adobe Creative Suite Lead',
        industry: 'Design',
        experienceLevel: 'Senior',
        atsScore: 97,
        targetCompanies: ['Adobe', 'Canva', 'Pinterest'],
        description: 'Visual-heavy blueprint for creative directors and illustrators. Showcases brand strategy and tool mastery.',
        templateId: 'visual',
        imageUrl: 'https://images.unsplash.com/photo-1529336953121-a52d210b15e6?q=80&w=800&auto=format&fit=crop',
        personalInfo: {
            fullName: 'Elena Design',
            email: 'elena.d@adobe-example.com',
            linkedin: 'linkedin.com/in/elenadesign'
        },
        skills: [
            'Adobe Illustrator', 'After Effects', 'Brand Strategy', 'Typography',
            'Creative Direction', 'User Experience', 'Marketing Design'
        ],
        summary: 'Award-winning Creative Director with a passion for storytelling through visual media. Expert in leading design teams to deliver cohesive brand identities across digital and print channels.',
        experience: [
            {
                company: 'Brand Zenith',
                position: 'Art Director',
                startDate: '2019-05',
                endDate: 'Present',
                description: 'Oversaw the rebranding of a Fortune 500 company, coordinating a team of 12 designers and illustrators to deliver a unified visual language.'
            }
        ],
        education: [
            {
                institution: 'CalArts',
                degree: 'BFA Graphic Design',
                startDate: '2015',
                endDate: '2019'
            }
        ]
    },
    {
        id: 'ibm-cloud',
        role: 'Cloud Architect',
        title: 'IBM Enterprise Cloud',
        industry: 'Technology',
        experienceLevel: 'Senior',
        atsScore: 93,
        targetCompanies: ['IBM', 'Oracle', 'Red Hat'],
        description: 'Enterprise-grade blueprint for Cloud Architects. Focuses on hybrid cloud, security, and legacy modernization.',
        templateId: 'modern',
        imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
        personalInfo: {
            fullName: 'Robert Cloud',
            email: 'robert.c@ibm-example.com',
            linkedin: 'linkedin.com/in/robertcloud'
        },
        skills: [
            'Hybrid Cloud', 'Red Hat OpenShift', 'IBM Cloud', 'Security Compliance',
            'Enterprise Architecture', 'Mainframe Modernization', 'Kubernetes'
        ],
        summary: 'Enterprise Cloud Architect with 15 years of experience in modernizing legacy systems. Specialized in hybrid cloud deployments for banking and healthcare sectors.',
        experience: [
            {
                company: 'Global Systems Corp',
                position: 'Lead Cloud Architect',
                startDate: '2018-04',
                endDate: 'Present',
                description: 'Led the migration of 200+ mission-critical applications to a hybrid cloud environment, reducing operational costs by 35%.'
            }
        ]
    },
    {
        id: 'uber-ops',
        role: 'Operations Manager',
        title: 'Uber City Operations',
        industry: 'Management',
        experienceLevel: 'Mid-Senior',
        atsScore: 94,
        targetCompanies: ['Uber', 'Lyft', 'DoorDash'],
        description: 'Fast-paced operations blueprint. Highlights logistics, driver acquisition, and marketplace balancing.',
        templateId: 'modern',
        imageUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=800&auto=format&fit=crop',
        personalInfo: {
            fullName: 'Anita Operations',
            email: 'anita.o@uber-example.com',
            linkedin: 'linkedin.com/in/anitaops'
        },
        skills: [
            'Marketplace Dynamics', 'SQL', 'Supply Chain Management', 'Driver Acquisition',
            'Process Optimization', 'P&L Management', 'Data Analysis'
        ],
        summary: 'Operations Manager with a track record of scaling marketplace liquidity. Expert at balancing supply and demand in hyper-local markets.',
        experience: [
            {
                company: 'RideShare Co.',
                position: 'City Manager',
                startDate: '2019-08',
                endDate: 'Present',
                description: 'Managed P&L for a major metropolitan region, increasing ride volume by 40% year-over-year while maintaining driver satisfaction.'
            }
        ]
    },
    {
        id: 'airbnb-product',
        role: 'Product Manager',
        title: 'Airbnb Host Experience',
        industry: 'Product',
        experienceLevel: 'Mid-Senior',
        atsScore: 96,
        targetCompanies: ['Airbnb', 'Expedia', 'Booking.com'],
        description: 'User-centric product management blueprint. Focuses on community building, trust, and safety features.',
        templateId: 'minimalist',
        imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop',
        personalInfo: {
            fullName: 'Michael Guest',
            email: 'michael.g@airbnb-example.com',
            linkedin: 'linkedin.com/in/michaelguest-pm'
        },
        skills: [
            'Product Strategy', 'User Research', 'A/B Testing', 'Community Growth',
            'Marketplace Trust', 'Agile Methodologies', 'Data Analytics'
        ],
        summary: 'Product Manager passionate about building trust in the sharing economy. Experienced in launching features that enhance host-guest interactions and safety.',
        experience: [
            {
                company: 'TravelConnect',
                position: 'Senior Product Manager',
                startDate: '2020-01',
                endDate: 'Present',
                description: 'Launched a new "Super Host" program that increased host retention by 25% and improved guest satisfaction scores by 15%.'
            }
        ]
    },
    {
        id: 'goldman-analyst',
        role: 'Investment Banker',
        title: 'Goldman Sachs M&A',
        industry: 'Finance',
        experienceLevel: 'Entry-Level',
        atsScore: 98,
        targetCompanies: ['Goldman Sachs', 'JPMorgan', 'Citi'],
        description: 'Standard Wall Street blueprint. Conservative layout, dense content, optimized for high-finance recruiting.',
        templateId: 'elegant',
        imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
        personalInfo: {
            fullName: 'William Street',
            email: 'william.s@goldman-example.com',
            linkedin: 'linkedin.com/in/williamstreet'
        },
        skills: [
            'Financial Modeling', 'LBO Analysis', 'Valuation Multiples', 'Pitch Books',
            'Bloomberg Terminal', 'Capital Markets', 'Accounting'
        ],
        summary: 'Diligent Investment Banking Analyst with a strong foundation in financial accounting and corporate valuation. Graduated Summa Cum Laude from Wharton.',
        experience: [
            {
                company: 'Boutique Advisory Partners',
                position: 'Investment Banking Analyst',
                startDate: '2022-06',
                endDate: 'Present',
                description: 'Supported senior bankers on 3 closed M&A transactions totaling $1.2B in value. Built comprehensive LBO models for prospective buy-side clients.'
            }
        ]
    }
];

module.exports = starterResumes;
