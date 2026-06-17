import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { roleTemplates } from '../data/roleTemplates';
import SEO from '../components/SEO';
import api from '../api/axios';
import { 
    Sparkles, 
    ArrowRight, 
    Briefcase, 
    GraduationCap, 
    ShieldCheck, 
    Target, 
    CheckCircle2, 
    Code2, 
    BookOpen, 
    ChevronRight, 
    Building2 
} from 'lucide-react';
import { motion } from 'framer-motion';

const RoleTemplate = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [creating, setCreating] = useState(false);

    // Find the matching template data
    const template = roleTemplates.find(t => t.slug === slug);

    if (!template) {
        return (
            <div className="min-h-screen pt-32 pb-24 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900">
                <h1 className="text-3xl font-black mb-4 dark:text-white">Template Not Found</h1>
                <p className="text-slate-600 dark:text-slate-400 mb-8">We couldn't find the resume template you're looking for.</p>
                <Link to="/templates" className="bg-orange-500 text-white px-6 py-3 rounded-full font-bold hover:bg-orange-600 transition-colors">
                    Browse All Templates
                </Link>
            </div>
        );
    }

    const handleUseTemplate = async () => {
        setCreating(true);
        try {
            // Build the pre-filled resume structure dynamically based on the template
            const resumeData = {
                title: `${template.roleName} - ResumeCraft Blueprint`,
                templateId: 'modern',
                summary: template.sampleSummary,
                skills: template.sampleSkills,
                experience: template.sampleExperience.map(exp => ({
                    company: exp.company,
                    position: exp.position,
                    startDate: exp.duration.split(' - ')[0],
                    endDate: exp.duration.split(' - ')[1] || 'Present',
                    description: exp.bullets.join('\n')
                })),
                education: [
                    {
                        institution: 'University / College Name',
                        degree: template.slug === 'fresher' ? 'B.S. in Computer Science / Relevant Field' : 'Bachelor / Master Degree',
                        startDate: '2018',
                        endDate: '2022'
                    }
                ],
                projects: template.slug === 'fresher' ? [
                    {
                        title: 'Academic Capstone Project: E-Commerce Storefront',
                        description: 'Developed a full-stack e-commerce web application using React, Node.js, and MongoDB, enabling user authentication and product cart features. Simulated payment gateways.'
                    }
                ] : []
            };

            const { data } = await api.post('/resumes', resumeData);
            navigate(`/editor/${data._id}`);
        } catch (error) {
            console.error('Failed to create resume from role-specific template', error);
            if (error.response && error.response.status === 401) {
                // Store intended template slug in session storage to redirect back after login
                sessionStorage.setItem('redirectAfterLogin', `/resume-template/${slug}`);
                navigate('/login');
            } else {
                alert('Something went wrong. Please try again later.');
            }
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-24 bg-white dark:bg-slate-900 font-sans">
            <SEO 
                title={template.title}
                description={template.description}
                keywords={template.keywords}
                image={template.imageUrl}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero / Header Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-600 text-xs font-bold uppercase tracking-widest mb-6">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Role-Specific AI Blueprint</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
                        Free <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">{template.roleName}</span> Resume Template
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
                        {template.subheading}
                    </p>
                </div>

                {/* Main Content: Split Preview and CTA */}
                <div className="grid lg:grid-cols-12 gap-12 items-start mb-24">
                    {/* Left Side: Dynamic Resume Preview Sheet */}
                    <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-2xl p-8 md:p-12">
                        {/* Fake Document Header */}
                        <div className="border-b border-slate-100 dark:border-slate-700 pb-8 mb-8">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">
                                        Your Name
                                    </div>
                                    <div className="text-lg font-bold text-orange-500 uppercase tracking-wider mb-4">
                                        {template.roleName}
                                    </div>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                                        <span>email@example.com</span>
                                        <span>•</span>
                                        <span>+1 (555) 123-4567</span>
                                        <span>•</span>
                                        <span>City, Country</span>
                                    </div>
                                </div>
                                <div className="h-14 w-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                                    <Code2 className="h-7 w-7 text-orange-500" />
                                </div>
                            </div>
                        </div>

                        {/* Fake Summary Section */}
                        <div className="mb-8">
                            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-3 pb-1.5 border-b border-slate-100 dark:border-slate-700">
                                Professional Summary
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                {template.sampleSummary}
                            </p>
                        </div>

                        {/* Fake Skills Section */}
                        <div className="mb-8">
                            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-3 pb-1.5 border-b border-slate-100 dark:border-slate-700">
                                Core Competencies
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {template.sampleSkills.map((skill, index) => (
                                    <span key={index} className="bg-slate-100 dark:bg-slate-700/50 text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Fake Experience Section */}
                        <div>
                            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4 pb-1.5 border-b border-slate-100 dark:border-slate-700">
                                Professional Experience
                            </h3>
                            <div className="space-y-6">
                                {template.sampleExperience.map((exp, index) => (
                                    <div key={index} className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-0.5 before:bg-orange-500/30">
                                        <div className="absolute left-[-4px] top-1.5 h-2.5 w-2.5 rounded-full bg-orange-500"></div>
                                        <div className="flex justify-between items-baseline mb-2">
                                            <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                                                {exp.position}
                                            </h4>
                                            <span className="text-xs font-bold text-slate-400">
                                                {exp.duration}
                                            </span>
                                        </div>
                                        <div className="text-xs font-bold text-orange-500 mb-3 flex items-center">
                                            <Building2 className="h-3.5 w-3.5 mr-1" />
                                            {exp.company}
                                        </div>
                                        <ul className="space-y-2">
                                            {exp.bullets.map((bullet, bulletIndex) => (
                                                <li key={bulletIndex} className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed list-disc list-inside">
                                                    {bullet}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Action CTA Card */}
                    <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-24">
                        <div className="bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden border border-slate-800">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[80px] rounded-full"></div>
                            
                            <div className="relative z-10">
                                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-white text-[10px] font-bold uppercase tracking-wider mb-6">
                                    <ShieldCheck className="h-3.5 w-3.5 text-green-400" />
                                    <span>ATS Score: 98/100</span>
                                </div>

                                <h2 className="text-3xl font-black mb-4 tracking-tight">
                                    Ready to Build?
                                </h2>
                                <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                                    This blueprint has been vetted by recruitment teams in the <strong className="text-white">{template.industry}</strong> industry. Optimize your skills and land interviews at your target companies.
                                </p>

                                {/* Target Companies */}
                                <div className="mb-8 border-t border-white/10 pt-6">
                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center">
                                        <Target className="h-3.5 w-3.5 mr-1.5 text-orange-500" />
                                        Target Corporations
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {template.targetCompanies.map((company, index) => (
                                            <span key={index} className="inline-flex items-center px-3 py-1.5 rounded-xl bg-white/5 text-white text-[10px] font-bold border border-white/10">
                                                {company}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Use Template Button */}
                                <button
                                    onClick={handleUseTemplate}
                                    disabled={creating}
                                    className="w-full flex items-center justify-center space-x-3 bg-orange-500 hover:bg-orange-600 text-white py-5 rounded-2xl font-black transition-all transform active:scale-[0.98] disabled:opacity-50 text-xs uppercase tracking-widest"
                                >
                                    {creating ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <Sparkles className="h-4 w-4" />
                                            <span>Use This Blueprint</span>
                                            <ArrowRight className="h-4 w-4" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Quick Statistics/Proof */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 grid grid-cols-2 gap-4">
                            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm">
                                <div className="text-2xl font-black text-orange-500 mb-1">100%</div>
                                <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Free & No Watermark</div>
                            </div>
                            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm">
                                <div className="text-2xl font-black text-orange-500 mb-1">ATS</div>
                                <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Parser Optimized</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Guide Section */}
                <section className="bg-slate-50 dark:bg-slate-800/40 rounded-[3rem] p-10 md:p-16 border border-slate-100 dark:border-slate-800 mb-16">
                    <div className="max-w-4xl">
                        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-600 text-xs font-bold uppercase tracking-widest mb-6">
                            <BookOpen className="h-3.5 w-3.5" />
                            <span>Writing Tutorial</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">
                            {template.guide.title}
                        </h2>
                        
                        <div className="space-y-8">
                            {template.guide.sections.map((section, index) => (
                                <div key={index} className="space-y-3">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
                                        <ChevronRight className="h-5 w-5 text-orange-500 mr-2 shrink-0" />
                                        {section.title}
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed pl-7">
                                        {section.content}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default RoleTemplate;
