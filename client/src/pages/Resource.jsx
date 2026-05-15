
import { useParams, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { 
    FileText, 
    BookOpen, 
    Lightbulb, 
    Target, 
    CheckCircle2, 
    ArrowRight,
    Search,
    Users,
    Briefcase,
    Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

const resourceContent = {
    'resume-formats': {
        title: 'Professional Resume Formats',
        description: 'Choose the right layout to showcase your career progression and skills effectively.',
        icon: <FileText className="h-8 w-8 text-orange-500" />,
        sections: [
            {
                title: 'Chronological Resume',
                content: 'The most popular format, focusing on your work history in reverse-chronological order. Ideal for those with a steady career path.',
                points: ['Focuses on career growth', 'Preferred by most recruiters', 'Best for established professionals']
            },
            {
                title: 'Functional Resume',
                content: 'Focuses on skills and abilities rather than chronological work history. Best for career changers or those with employment gaps.',
                points: ['Highlights transferable skills', 'De-emphasizes dates', 'Good for entry-level candidates']
            },
            {
                title: 'Combination (Hybrid) Resume',
                content: 'Combines the best of both worlds: a skills-focused section followed by a chronological work history.',
                points: ['Shows both skills and experience', 'Very versatile', 'Perfect for senior roles']
            }
        ]
    },
    'resume-examples': {
        title: 'High-Impact Resume Examples',
        description: 'Get inspired by real-world resume samples that successfully landed interviews at top MNCs.',
        icon: <BookOpen className="h-8 w-8 text-blue-500" />,
        sections: [
            {
                title: 'Software Engineer',
                content: 'Focused on tech stack, projects, and quantifiable achievements in agile environments.',
                points: ['Tech stack highlights', 'GitHub/Portfolio links', 'System design experience']
            },
            {
                title: 'Marketing Manager',
                content: 'Highlights campaign results, ROI, and brand growth metrics.',
                points: ['Data-driven results', 'Growth percentages', 'Multi-channel expertise']
            },
            {
                title: 'Product Manager',
                content: 'Showcases leadership, roadmap planning, and cross-functional collaboration.',
                points: ['Product lifecycle', 'Stakeholder management', 'User-centric approach']
            }
        ]
    },
    'how-to-write-a-resume': {
        title: 'The Ultimate Guide: How To Write A Resume in 2026',
        description: 'Learn how to create a professional, job-winning resume that beats ATS filters and impresses top MNC recruiters. Our comprehensive guide covers everything from keywords to layout.',
        icon: <Lightbulb className="h-8 w-8 text-yellow-500" />,
        sections: [
            {
                title: '1. Master the ATS (Applicant Tracking System)',
                content: 'Most MNCs use software to scan resumes before a human ever sees them. To pass, you must use standard headings, avoid complex graphics, and include industry-specific keywords found in the job description.',
                points: ['Use standard fonts like Inter or Arial', 'Incorporate keywords naturally', 'Avoid images or icons for critical info']
            },
            {
                title: '2. The "Power Summary" Technique',
                content: 'Your summary is your elevator pitch. Instead of saying "looking for a job," focus on what you offer. Mention years of experience, top 3 skills, and your biggest professional achievement with data.',
                points: ['Start with your professional title', 'Include a measurable achievement (e.g., 20% growth)', 'Keep it under 4 sentences']
            },
            {
                title: '3. Experience: Focus on Impact, Not Tasks',
                content: 'Recruiters don\'t want to see a list of your daily chores. They want to see results. Use action verbs like "Spearheaded," "Engineered," or "Optimized" followed by the specific outcome of your work.',
                points: ['Use the STAR method (Situation, Task, Action, Result)', 'Include numbers, percentages, and currencies', 'Start every bullet with a strong action verb']
            },
            {
                title: '4. Skill Section Optimization',
                content: 'Divide your skills into "Hard Skills" (technical) and "Soft Skills" (interpersonal). This makes your resume readable and ensures you hit the technical keyword requirements of the job.',
                points: ['Group skills by category', 'Include proficiency levels if relevant', 'Match skills to the specific job post']
            },
            {
                title: '5. Resume vs. CV: Know the Difference',
                content: 'In India, "Resume" and "CV" are often used interchangeably, but a Resume is typically 1-2 pages for private sector jobs, while a CV is a detailed multi-page document for academic or research roles.',
                points: ['Stick to 1 page if experience < 5 years', 'Focus on relevance over length', 'Use MNC-ready clean layouts']
            }
        ]
    },
    'career-advice': {
        title: 'Expert Career Advice',
        description: 'Strategies to navigate your career path and land your dream job in today\'s competitive market.',
        icon: <Target className="h-8 w-8 text-green-500" />,
        sections: [
            {
                title: 'Networking Strategies',
                content: 'Learn how to leverage LinkedIn and informational interviews to find hidden job opportunities.',
                points: ['Personalized outreach', 'Value-first approach', 'Follow-up etiquette']
            },
            {
                title: 'Personal Branding',
                content: 'How to position yourself as an authority in your field through social media and projects.',
                points: ['Consistent online presence', 'Showcasing expertise', 'Content creation']
            },
            {
                title: 'Salary Negotiation',
                content: 'Tips on how to research market rates and advocate for the compensation you deserve.',
                points: ['Market research tools', 'Know your walk-away point', 'Focus on total package']
            }
        ]
    },
    'interview-tips': {
        title: 'Master Your Next Interview',
        description: 'Proven techniques to handle tough questions and leave a lasting positive impression.',
        icon: <Zap className="h-8 w-8 text-purple-500" />,
        sections: [
            {
                title: 'Behavioral Questions',
                content: 'Master the STAR technique (Situation, Task, Action, Result) for "Tell me about a time..." questions.',
                points: ['Be specific', 'Focus on your contribution', 'Always end with a positive result']
            },
            {
                title: 'Researching the Company',
                content: 'What to look for beyond the "About Us" page to show you\'re truly interested.',
                points: ['Recent news/funding', 'Company culture/values', 'Competitor analysis']
            },
            {
                title: 'Questions to Ask Them',
                content: 'Stand out by asking high-level questions that show your strategic thinking.',
                points: ['Team challenges', 'Success metrics for the role', 'Future vision']
            }
        ]
    }
};

const Resource = () => {
    const { slug } = useParams();
    const content = resourceContent[slug] || resourceContent['resume-formats'];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-16 pb-24">
            <SEO 
                title={`${content.title} | ResumeCraft Resources`}
                description={content.description}
            />
            
            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 md:p-16 border border-white dark:border-slate-700 shadow-xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
                    
                    <div className="relative z-10">
                        <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-700 w-fit rounded-2xl shadow-sm">
                            {content.icon}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
                            {content.title}
                        </h1>
                        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
                            {content.description}
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Content Sections */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {content.sections.map((section, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all"
                        >
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{section.title}</h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                                {section.content}
                            </p>
                            <ul className="space-y-4">
                                {section.points.map((point, pIdx) => (
                                    <li key={pIdx} className="flex items-start space-x-3 text-sm text-slate-500 dark:text-slate-400">
                                        <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* Call to Action */}
                <div className="mt-16 bg-slate-900 dark:bg-orange-600 rounded-[2.5rem] p-10 md:p-16 text-center text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to apply these tips?</h2>
                        <p className="text-lg text-slate-300 dark:text-orange-50 mb-10 max-w-2xl mx-auto">
                            Start building your professional resume or cover letter today with our AI-powered editor.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link 
                                to="/templates" 
                                className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-orange-500/20"
                            >
                                Build My Resume
                            </Link>
                            <Link 
                                to="/cover-letter-templates" 
                                className="px-8 py-4 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition-all"
                            >
                                Create Cover Letter
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Related Links */}
                <div className="mt-24">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Other Resources</h2>
                    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(resourceContent)
                            .filter(([key]) => key !== slug)
                            .map(([key, value]) => (
                                <Link 
                                    key={key} 
                                    to={`/resource/${key}`}
                                    className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-orange-500 transition-all group"
                                >
                                    <div className="mb-4">{value.icon}</div>
                                    <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors">{value.title}</h4>
                                    <div className="mt-4 flex items-center text-xs font-bold text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white">
                                        <span>Read Guide</span>
                                        <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Link>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Resource;
