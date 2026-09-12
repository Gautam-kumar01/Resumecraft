import { additionalRoleTemplates } from './additionalRoleTemplates';

export const roleTemplates = [
    ...additionalRoleTemplates,
    {
        slug: 'software-engineer',
        roleName: 'Software Engineer',
        title: 'Free Software Engineer Resume Template & AI Builder',
        description: 'Create an ATS-friendly Software Engineer resume in minutes. Recruiters-approved coding CV template with AI-powered section writer, MNC-ready formatting, and free PDF download.',
        keywords: 'software engineer resume template, developer resume builder, coding CV online, tech resume maker, software developer CV format, free programmer resume',
        heading: 'Software Engineer Resume Blueprint',
        subheading: 'Recruiter-approved technical template designed to pass ATS screening and land coding interviews at leading companies like Google, Meta, and Amazon.',
        imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
        industry: 'Technology',
        targetCompanies: ['Google', 'Meta', 'Amazon', 'Microsoft'],
        sampleSummary: 'Innovative Software Engineer with 4+ years of professional experience building high-performance web applications and distributed systems. Expert in React.js, Node.js, and cloud architecture (AWS), with a proven track record of reducing API latency, streamlining database queries, and leading agile development teams.',
        sampleSkills: [
            'JavaScript / TypeScript', 'React / Next.js', 'Node.js / Express', 'Python / Django',
            'SQL (PostgreSQL) / NoSQL', 'System Design & APIs', 'Docker / Kubernetes', 'AWS / Cloud Services'
        ],
        sampleExperience: [
            {
                position: 'Senior Software Engineer',
                company: 'TechStream Solutions',
                duration: '2023 - Present',
                bullets: [
                    'Architected a microservices backend using Node.js and Express, improving overall API processing latency by 45% for 1M+ active monthly users.',
                    'Led the migration of a legacy frontend application to React & Tailwind CSS, boosting Core Web Vitals performance scores from 50 to 92.',
                    'Implemented CI/CD deployment pipelines using Github Actions and Docker, reducing build-to-deploy times from 45 minutes to under 8 minutes.'
                ]
            },
            {
                position: 'Full Stack Developer',
                company: 'AppForge Studios',
                duration: '2021 - 2023',
                bullets: [
                    'Collaborated with a cross-functional team of 6 to build and scale a B2B SaaS dashboard, generating $80k in new annual recurring revenue.',
                    'Optimized database queries in PostgreSQL, eliminating redundant lookups and reducing database CPU consumption by 30%.'
                ]
            }
        ],
        guide: {
            title: 'How to Write a Software Engineer Resume',
            sections: [
                {
                    title: '1. Focus on Tech Stack & Impact',
                    content: 'Recruiters scan software engineer resumes to see your exact technologies. List your programming languages and frameworks clearly. More importantly, don\'t just list what you did; highlight the impact. Use metrics like "reduced page load by 30%" or "scaled microservice to handle 10k requests/sec".'
                },
                {
                    title: '2. List Professional Projects',
                    content: 'A software developer\'s best proof of ability is code. Create a dedicated "Projects" section linking to your GitHub profile and live deployments. Include a bullet describing the architecture, tech stack, and what the project solved.'
                },
                {
                    title: '3. Keep the Layout Clean (No Graphs)',
                    content: 'Avoid using rating graphics or skill bars (e.g. "React: 4/5 stars"). ATS parsers cannot read visual graphics and might discard your application. List your technical skills in plain text grouped logically.'
                }
            ]
        }
    },
    {
        slug: 'data-analyst',
        roleName: 'Data Analyst',
        title: 'Free Data Analyst Resume Template & AI Builder',
        description: 'Build a professional Data Analyst resume. ATS-compliant layout optimized for data analytics, business intelligence, SQL, and Python roles. Create and download for free.',
        keywords: 'data analyst resume, business intelligence CV template, data scientist resume maker, SQL analyst CV format, dashboard designer resume',
        heading: 'Data Analyst Resume Blueprint',
        subheading: 'High-performance analytical template optimized for business intelligence, data modeling, and reporting roles at leading financial and tech enterprises.',
        imageUrl: 'https://images.unsplash.com/photo-1551288560-66936b61ee2b?q=80&w=800&auto=format&fit=crop',
        industry: 'Data & Analytics',
        targetCompanies: ['Uber', 'JPMorgan', 'Airbnb', 'Accenture'],
        sampleSummary: 'Detail-oriented Data Analyst with 3+ years of experience translating complex datasets into actionable business strategies. Expert in SQL, Python, and Tableau, with a proven ability to design automated dashboards, perform statistical analysis, and deliver executive-level presentations that drive business growth.',
        sampleSkills: [
            'SQL (PostgreSQL / Redshift)', 'Python (Pandas / NumPy)', 'Tableau / Power BI', 'Data Modeling & ETL',
            'A/B Testing & Statistics', 'Excel (Advanced / VBA)', 'Google Analytics', 'Data Governance'
        ],
        sampleExperience: [
            {
                position: 'Senior Data Analyst',
                company: 'MarketScale Metrics',
                duration: '2023 - Present',
                bullets: [
                    'Designed and deployed interactive Tableau dashboards for executive leadership, reducing weekly reporting turnaround time by 15 hours.',
                    'Wrote complex SQL pipelines to analyze customer funnel performance, identifying leakage points and improving conversion by 12%.',
                    'Spearheaded A/B testing frameworks for new product features, providing statistical significance analyses that guided product roadmap decisions.'
                ]
            },
            {
                position: 'Business Intelligence Analyst',
                company: 'RetailPulse Inc.',
                duration: '2021 - 2023',
                bullets: [
                    'Built automated python scripts to clean and ingest product sales data, increasing data ingestion accuracy by 98%.',
                    'Analyzed historical sales patterns to optimize inventory management, saving the company $14k in quarterly warehousing costs.'
                ]
            }
        ],
        guide: {
            title: 'How to Write a Data Analyst Resume',
            sections: [
                {
                    title: '1. Emphasize SQL & Dashboard Tools',
                    content: 'SQL is the most important skill for a data analyst. Make sure your experience bullets mention the databases you worked with (e.g. Redshift, PostgreSQL) and how you query data. Highlight dashboard tools like Tableau, Power BI, or Looker.'
                },
                {
                    title: '2. Quantify Business Outcomes',
                    content: 'Data analysts are hired to solve business problems. Show how your data insights led to action: Did you save costs? Increase revenue? Streamline operations? Use statements like "uncovered insights that grew user retention by 8%".'
                },
                {
                    title: '3. Detail Your ETL Experience',
                    content: 'Recruiters want analysts who can clean and model data, not just write reports. Mention how you handle data ingestion, ETL pipelines, and scripting in Python or R.'
                }
            ]
        }
    },
    {
        slug: 'marketing-manager',
        roleName: 'Marketing Manager',
        title: 'Free Marketing Manager Resume Template & AI Builder',
        description: 'Build a premium Marketing Manager resume. Optimized template for digital marketing, growth, SEO, and brand strategy. Customize and download instantly.',
        keywords: 'marketing manager resume, digital marketing CV template, growth marketer CV builder, SEO manager resume online, brand strategist CV format',
        heading: 'Marketing Manager Resume Blueprint',
        subheading: 'High-impact campaign-focused blueprint designed to showcase lead generation, brand growth, digital ads, and customer acquisition strategies.',
        imageUrl: 'https://images.unsplash.com/photo-1557838923-2985c318be48?q=80&w=800&auto=format&fit=crop',
        industry: 'Marketing & Sales',
        targetCompanies: ['Netflix', 'Spotify', 'Disney', 'HubSpot'],
        sampleSummary: 'Dynamic Marketing Manager with 5+ years of experience leading cross-functional teams to design and execute multi-channel digital campaigns. Expert in growth hacking, SEO, email automation, and performance marketing, with a history of scaling organic web traffic and improving ROAS across B2B and B2C landscapes.',
        sampleSkills: [
            'Digital Campaign Strategy', 'SEO & Content Marketing', 'Performance Ads (Meta / Google)', 'Marketing Automation',
            'Google Analytics / HubSpot', 'Brand Development', 'Budget Management', 'Conversion Rate Optimization (CRO)'
        ],
        sampleExperience: [
            {
                position: 'Growth Marketing Manager',
                company: 'CloudSphere SaaS',
                duration: '2022 - Present',
                bullets: [
                    'Managed a $120k annual ad budget across Meta and Google, increasing return on ad spend (ROAS) by 35% and cutting cost per acquisition (CPA) by 20%.',
                    'Designed a comprehensive SEO strategy that increased organic search traffic by 150% in 12 months, placing 45+ target keywords on page 1.',
                    'Led a team of 4 content creators and copywriters to scale the corporate newsletter, growing subscribers from 10k to 55k with a 28% open rate.'
                ]
            },
            {
                position: 'Digital Marketer',
                company: 'Vanguard Retail',
                duration: '2020 - 2022',
                bullets: [
                    'Coordinated influencer marketing campaigns that generated over 2M impressions and grew social media community followers by 45%.',
                    'A/B tested email subject lines and layout templates, increasing click-through rates by 18% and generating $25k in direct revenue.'
                ]
            }
        ],
        guide: {
            title: 'How to Write a Marketing Manager Resume',
            sections: [
                {
                    title: '1. Prove Performance with Marketing Metrics',
                    content: 'Marketing is numbers-driven. Recruiters want to see how you moved key performance indicators (KPIs). Include clear statistics: mention your budget sizes, conversion rate percentages, ROAS improvements, and cost per acquisition (CPA).'
                },
                {
                    title: '2. Specify Your Channels and Core Tools',
                    content: 'Outline the marketing channels you specialize in (e.g. Paid Search, Paid Social, SEO, Email) and the exact tools you use (e.g. HubSpot, Marketo, Salesforce, Google Ads, Semrush).'
                },
                {
                    title: '3. Highlight Leadership and Budget Management',
                    content: 'As a manager, you need to prove you can lead teams and manage resources. Showcase how you collaborated with designers, developers, and agency partners, and mention your budget management capabilities.'
                }
            ]
        }
    },
    {
        slug: 'fresher',
        roleName: 'Fresher / Entry-Level',
        title: 'Free Fresher Resume Template & AI Builder for Graduates',
        description: 'First job resume template for freshers and college graduates. Write a professional entry-level CV showing academic projects and skills. 100% free download.',
        keywords: 'fresher resume template, entry level CV builder, college graduate resume maker, no experience resume format, first job CV online',
        heading: 'Fresher & Graduate Resume Blueprint',
        subheading: 'Recruiter-tested entry-level layout designed to emphasize academic achievements, technical skills, and personal projects in the absence of corporate history.',
        imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop',
        industry: 'General & Entry-Level',
        targetCompanies: ['Infosys', 'Wipro', 'TCS', 'Cognizant'],
        sampleSummary: 'Ambitious and fast-learning Computer Science graduate seeking an entry-level software development role. Equipped with solid fundamentals in object-oriented programming, data structures, and web development, along with a passion for building clean code demonstrated through multiple academic and open-source projects.',
        sampleSkills: [
            'Java / Python / C++', 'HTML5 / CSS3 / JavaScript', 'React Basics & Git', 'SQL Database Fundamentals',
            'Problem Solving / DSA', 'Agile Teamwork', 'Technical Documentation', 'Continuous Learning'
        ],
        sampleExperience: [
            {
                position: 'Academic Capstone Project: E-Commerce Storefront',
                company: 'University Technical Project',
                duration: '6 Months (2025)',
                bullets: [
                    'Developed a full-stack e-commerce web application using React, Node.js, and MongoDB, enabling user authentication and product cart features.',
                    'Implemented payment gateway simulation using Stripe API, testing checkout workflows across multiple test credit cards.',
                    'Hosted the live application on Vercel and GitHub, maintaining version control with git and collaborating with 2 classmates.'
                ]
            },
            {
                position: 'Coding Coordinator / Volunteer',
                company: 'University Computer Society',
                duration: '2024 - 2025',
                bullets: [
                    'Organized weekly coding challenges and competitive programming sessions for over 150 college freshmen, improving peer programming skills.',
                    'Assisted in setting up the registration website for the national hackathon event, managing database entry records.'
                ]
            }
        ],
        guide: {
            title: 'How to Write a Fresher / Entry-Level Resume',
            sections: [
                {
                    title: '1. Put Projects & Education at the Top',
                    content: 'Since you don\'t have formal corporate experience, place your Education and Projects sections near the top of your resume. Highlight your degree details, relevant coursework, certifications, and GPA (if above 8.0/10.0).'
                },
                {
                    title: '2. Detail Your Practical Projects',
                    content: 'Your projects serve as proof of your skills. Treat them like jobs: name the project, list the technologies used, and write bullet points explaining what you built, the challenges you overcame, and the results.'
                },
                {
                    title: '3. Highlight Transferable Leadership & Soft Skills',
                    content: 'Participating in college clubs, student government, volunteering, or hackathons showcases teamwork, communication, and time management. Include an "Extracurriculars" or "Leadership" section to highlight these soft skills.'
                }
            ]
        }
    },
    {
        slug: 'teacher',
        roleName: 'Teacher / Educator',
        title: 'Free Teacher Resume Template & AI Builder',
        description: 'Create a professional Teacher resume. Recruiter-approved layout optimized for educators, lecturers, and primary/secondary school teachers. Free download.',
        keywords: 'teacher resume template, educator CV maker, school teacher resume, lecturer CV format, academic resume online',
        heading: 'Teacher & Educator Resume Blueprint',
        subheading: 'Professional academic layout designed to highlight classroom management, lesson planning, student success, and educational credentials.',
        imageUrl: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=800&auto=format&fit=crop',
        industry: 'Education & Academia',
        targetCompanies: ['Primary Schools', 'Secondary Schools', 'International Schools', 'Online Academies'],
        sampleSummary: 'Dedicated and student-focused Educator with 5+ years of classroom experience teaching high school English literature and composition. Expert at developing interactive lesson plans, managing diverse classroom behaviors, incorporating educational technology, and collaborating with parents to support student achievement.',
        sampleSkills: [
            'Curriculum Development', 'Classroom Management', 'Student Assessment & Grading', 'Interactive Lesson Planning',
            'Educational Software (Canvas)', 'Special Education Adaptations', 'Parent-Teacher Communication', 'Differentiated Instruction'
        ],
        sampleExperience: [
            {
                position: 'Secondary English Teacher',
                company: 'Maplewood High School',
                duration: '2022 - Present',
                bullets: [
                    'Designed and taught English literature curriculum for 5 classes of 30+ students, improving grade average scores by 15% over two terms.',
                    'Integrated Google Classroom and Canva for Education to deliver hybrid interactive learning, increasing student engagement metrics.',
                    'Initiated an after-school reading club for struggling students, boosting standardized reading exam pass rates by 22%.'
                ]
            },
            {
                position: 'Primary School Teacher',
                company: 'Sunnyvale Elementary',
                duration: '2019 - 2022',
                bullets: [
                    'Developed custom lesson plans for core subjects (English, Science, Math) matching state education standards.',
                    'Facilitated monthly parent-teacher conferences, maintaining a 96% positive feedback rate regarding student behavioral adjustments.'
                ]
            }
        ],
        guide: {
            title: 'How to Write a Teacher / Educator Resume',
            sections: [
                {
                    title: '1. Detail Classroom and Curriculum Skills',
                    content: 'Highlight your pedagogical skills. Mention terms like differentiated instruction, classroom management, standardized assessment, lesson planning, and state standard alignment.'
                },
                {
                    title: '2. Quantify Student Achievement and Growth',
                    content: 'Whenever possible, show results. Have your students improved test scores? Did you start a successful club? Did you integrate technology that improved grading efficiency? Use numbers to prove your classroom impact.'
                },
                {
                    title: '3. List Certifications & State Licenses Clearly',
                    content: 'Education is a highly certified field. Place your licenses (e.g. State Teaching Credentials, TESOL/TEFL) in a prominent "Certifications & Licenses" section so hiring managers can verify your credentials instantly.'
                }
            ]
        }
    },
    {
        slug: 'frontend-developer',
        roleName: 'Frontend Developer',
        title: 'Free Frontend Developer Resume Template & AI Builder',
        description: 'Create a focused frontend developer resume with projects, UI performance wins, JavaScript skills, and an ATS-readable format.',
        keywords: 'frontend developer resume template, frontend engineer CV, React developer resume, web developer resume format',
        heading: 'Frontend Developer Resume Blueprint',
        subheading: 'A project-first resume structure for frontend developers who want to show interface quality, performance improvements, and practical JavaScript experience.',
        imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop',
        industry: 'Web & Product Engineering',
        targetCompanies: ['Product teams', 'SaaS teams', 'Agencies', 'Startups'],
        sampleSummary: 'Frontend Developer who builds accessible, responsive interfaces with React, TypeScript, and modern CSS. Strong at translating product requirements into maintainable components, improving Core Web Vitals, and collaborating with design and backend teams.',
        sampleSkills: ['React', 'TypeScript', 'JavaScript', 'CSS / Tailwind', 'Accessibility', 'Testing', 'Performance', 'Git'],
        sampleExperience: [{ position: 'Frontend Developer', company: 'Product Studio', duration: '2023 - Present', bullets: ['Built reusable React components for customer-facing workflows, reducing duplicate UI code across product surfaces.', 'Improved page performance by auditing bundle size, image loading, and rendering bottlenecks.', 'Partnered with designers and API developers to deliver responsive features with accessible keyboard interactions.'] }],
        guide: { title: 'How to Write a Frontend Developer Resume', sections: [{ title: '1. Show interfaces you built', content: 'Use projects and experience bullets to explain the product surface, your contribution, and the technologies you used.' }, { title: '2. Include accessibility and performance', content: 'Mention measurable improvements such as faster page loads, better Core Web Vitals, accessibility fixes, or reduced bundle size when you have evidence.' }, { title: '3. Link to proof', content: 'Add a working portfolio or GitHub link and make sure the projects are easy to review.' }] }
    },
    {
        slug: 'backend-developer',
        roleName: 'Backend Developer',
        title: 'Free Backend Developer Resume Template & AI Builder',
        description: 'Build a backend developer resume focused on APIs, databases, reliability, cloud systems, and measurable engineering outcomes.',
        keywords: 'backend developer resume template, API developer CV, Node.js developer resume, backend engineer resume format',
        heading: 'Backend Developer Resume Blueprint',
        subheading: 'A clear technical layout for backend engineers who want to communicate architecture decisions, reliability work, data systems, and delivery impact.',
        imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop',
        industry: 'Backend & Platform Engineering',
        targetCompanies: ['Platform teams', 'Fintech teams', 'SaaS teams', 'Infrastructure teams'],
        sampleSummary: 'Backend Developer experienced in designing APIs, data models, and background workflows with Node.js, Python, and SQL. Focused on dependable services, clear observability, and pragmatic system design that supports product growth.',
        sampleSkills: ['Node.js', 'Python', 'REST APIs', 'PostgreSQL', 'Redis', 'Docker', 'Cloud Services', 'Observability'],
        sampleExperience: [{ position: 'Backend Developer', company: 'Cloud Products Team', duration: '2022 - Present', bullets: ['Designed REST endpoints and validation rules for a multi-tenant product workflow.', 'Optimized database queries and indexes after profiling slow requests in production.', 'Added structured logs and health checks that shortened incident investigation time.'] }],
        guide: { title: 'How to Write a Backend Developer Resume', sections: [{ title: '1. Explain system responsibility', content: 'Name the service, workflow, or data problem you owned instead of listing technologies without context.' }, { title: '2. Show reliability work', content: 'Mention testing, monitoring, error handling, performance, migrations, and security practices that you actually implemented.' }, { title: '3. Use concrete scale carefully', content: 'Include request volume, latency, data size, or uptime only when you can support the number.' }] }
    },
    {
        slug: 'product-manager',
        roleName: 'Product Manager',
        title: 'Free Product Manager Resume Template & AI Builder',
        description: 'Create a product manager resume that connects customer problems, product decisions, launches, experiments, and business outcomes.',
        keywords: 'product manager resume template, PM resume format, product management CV, associate product manager resume',
        heading: 'Product Manager Resume Blueprint',
        subheading: 'A concise product-management format for showing discovery, prioritization, cross-functional leadership, launches, and measurable outcomes.',
        imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=800&auto=format&fit=crop',
        industry: 'Product Management',
        targetCompanies: ['B2B SaaS', 'Consumer apps', 'Fintech', 'Digital services'],
        sampleSummary: 'Product Manager who turns customer research and business goals into focused roadmaps, testable experiments, and shipped improvements. Comfortable working across engineering, design, sales, and operations to move products forward.',
        sampleSkills: ['Product Discovery', 'Roadmapping', 'User Research', 'Prioritization', 'Analytics', 'Experimentation', 'Stakeholder Management', 'Agile Delivery'],
        sampleExperience: [{ position: 'Product Manager', company: 'Digital Product Team', duration: '2023 - Present', bullets: ['Synthesized customer interviews and product analytics into a prioritized quarterly roadmap.', 'Worked with design and engineering to launch an onboarding improvement and monitor adoption.', 'Defined success metrics for experiments and shared concise decision notes with stakeholders.'] }],
        guide: { title: 'How to Write a Product Manager Resume', sections: [{ title: '1. Lead with product outcomes', content: 'Describe the customer problem, the decision you made, and what changed after the launch or experiment.' }, { title: '2. Show cross-functional leadership', content: 'Make your collaboration with engineering, design, sales, and operations visible through specific examples.' }, { title: '3. Keep strategy concrete', content: 'Replace broad phrases such as strategic thinker with the product decisions and trade-offs you handled.' }] }
    },
    {
        slug: 'hr-manager',
        roleName: 'HR Manager',
        title: 'Free HR Manager Resume Template & AI Builder',
        description: 'Build an HR manager resume around hiring operations, employee experience, policies, learning, and measurable people outcomes.',
        keywords: 'HR manager resume template, human resources CV format, HR generalist resume, people operations resume',
        heading: 'HR Manager Resume Blueprint',
        subheading: 'A people-focused resume structure for HR professionals who want to show hiring, policy, employee experience, compliance, and stakeholder impact.',
        imageUrl: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=800&auto=format&fit=crop',
        industry: 'Human Resources',
        targetCompanies: ['People teams', 'Growing businesses', 'Operations teams', 'Nonprofits'],
        sampleSummary: 'HR Manager with experience supporting hiring, onboarding, employee relations, and people programs across growing teams. Builds clear processes, partners with managers, and uses practical reporting to improve employee experience and operational consistency.',
        sampleSkills: ['Recruitment', 'Onboarding', 'Employee Relations', 'HR Operations', 'Policy Writing', 'People Analytics', 'Learning Programs', 'HRIS'],
        sampleExperience: [{ position: 'HR Manager', company: 'Growing Services Company', duration: '2022 - Present', bullets: ['Standardized onboarding checklists and manager resources for new hires across multiple teams.', 'Partnered with department leads on hiring plans, interview structure, and candidate communication.', 'Maintained people operations documentation and recurring reports for leadership review.'] }],
        guide: { title: 'How to Write an HR Manager Resume', sections: [{ title: '1. Show the people process', content: 'Explain the hiring, onboarding, employee-support, or learning process you improved and who it served.' }, { title: '2. Balance empathy and operations', content: 'Strong HR resumes show both relationship skills and dependable systems, documentation, and follow-through.' }, { title: '3. Protect confidential information', content: 'Use aggregated or anonymized outcomes and never include private employee details in your resume.' }] }
    }

];
