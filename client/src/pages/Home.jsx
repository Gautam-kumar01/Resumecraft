
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import {
    FileText,
    Award,
    Clock,
    Target,
    Star,
    CheckCircle2,
    Cpu,
    Eye,
    Globe,
    BarChart3,
    MessageSquare,
    ChevronRight
} from 'lucide-react';
import Logo from '../components/Logo';
import { motion } from 'framer-motion';
import FeatureShowcase from '../components/FeatureShowcase';

const Home = () => {
    const navigate = useNavigate();
    const [showcaseOpen, setShowcaseOpen] = useState(false);
    const [activeFeature, setActiveFeature] = useState(0);

    const openFeature = (index) => {
        setActiveFeature(index);
        setShowcaseOpen(true);
    };

    const handleCreateNew = () => {
        const emptyData = {
            title: 'Untitled Resume',
            personalInfo: {
                fullName: '',
                email: '',
                phone: '',
                address: '',
                linkedin: '',
                website: '',
                profilePicture: ''
            },
            summary: '',
            experience: [],
            education: [],
            skills: [],
            projects: [],
            templateId: 'modern'
        };
        localStorage.setItem('guest_resume_draft', JSON.stringify(emptyData));
        navigate('/editor');
    };

    const handleBlueprintClick = (card) => {
        const initialData = {
            title: `${card.company} ${card.role} Blueprint`,
            personalInfo: {
                fullName: `Alex ${card.company} Candidate`,
                profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
                email: `alex.${card.company.toLowerCase()}@example.com`,
                phone: '+1 (555) 000-0000',
                address: 'San Francisco, CA',
                linkedin: `linkedin.com/in/alex-${card.company.toLowerCase()}`,
                github: `github.com/alex-${card.company.toLowerCase()}`,
                website: `alex-${card.company.toLowerCase()}.dev`
            },
            summary: `Aspiring ${card.role} with a passion for ${card.skills.join(', ')}. Ready to contribute to ${card.company}'s innovative projects.`,
            experience: [
                {
                    company: card.company,
                    position: card.role,
                    startDate: '2023',
                    endDate: 'Present',
                    description: `Working as a ${card.role} at ${card.company}. Leveraging skills in ${card.skills.join(', ')} to deliver high-impact solutions.`
                }
            ],
            education: [
                {
                    institution: 'University of Technology',
                    degree: 'Bachelor of Science in Computer Science',
                    startDate: '2019',
                    endDate: '2023'
                }
            ],
            skills: card.skills,
            projects: [],
            templateId: 'modern'
        };
        localStorage.setItem('guest_resume_draft', JSON.stringify(initialData));
        navigate('/editor');
    };

    const mncCards = [
        { company: 'Google', role: 'Software Engineer', skills: ['Go', 'Distributed Systems', 'Cloud'], image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800' },
        { company: 'Amazon', role: 'AI Engineer', skills: ['Python', 'LLMs', 'SageMaker'], image: 'https://images.unsplash.com/photo-1551288560-66936b61ee2b?auto=format&fit=crop&q=80&w=800' },
        { company: 'Microsoft', role: 'Product Manager', skills: ['Roadmaps', 'Analytics', 'Stakeholders'], image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800' },
        { company: 'Apple', role: 'Designer', skills: ['Figma', 'HIG', 'Prototyping'], image: 'https://images.unsplash.com/photo-1512484776495-a09d92e8a9ec?auto=format&fit=crop&q=80&w=800' },
        { company: 'Netflix', role: 'Data Scientist', skills: ['PySpark', 'AB Testing', 'ML'], image: 'https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&q=80&w=800' },
        { company: 'Meta', role: 'Software Engineer', skills: ['React', 'GraphQL', 'Hack'], image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800' },
        { company: 'Tesla', role: 'AI Engineer', skills: ['C++', 'Vision', 'Robotics'], image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800' },
        { company: 'Adobe', role: 'Designer', skills: ['Illustrator', 'After Effects', 'Brand'], image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=800' }
    ];

    return (
        <div className="bg-white">
            <SEO 
                title="Free Resume Builder & Resume Making Online Tool" 
                description="The best free resume making online tool. Build your professional resume in minutes with our AI resume builder. ATS-friendly templates approved by top MNCs."
            />
            {/* Hero Section */}
            <section className="relative pt-20 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-600 font-medium text-sm mb-6">
                                <Award className="h-4 w-4" />
                                <span>#1 Resume Making Online Tool</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-6">
                                Free Online <br />
                                <span className="bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                    Resume Builder.
                                </span>
                            </h1>
                            <p className="text-xl text-slate-600 mb-10 max-w-lg leading-relaxed">
                                Experience the easiest <strong>resume making online</strong>. Use our <strong>AI resume builder</strong> with recruiter-approved templates to create your professional CV in minutes.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={handleCreateNew}
                                    className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center group"
                                >
                                    Create new resume
                                    <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <Link
                                    to="/templates"
                                    className="px-8 py-4 bg-white text-slate-900 border-2 border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center"
                                >
                                    Choose a template
                                </Link>
                            </div>

                            {/* Trustpilot-style Rating */}
                            <div className="mt-12 flex items-center space-x-4">
                                <div className="flex items-center space-x-1">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <div key={s} className="bg-emerald-500 p-1 rounded-sm">
                                            <Star className="h-4 w-4 text-white fill-white" />
                                        </div>
                                    ))}
                                </div>
                                <div className="text-slate-900 font-bold">Excellent</div>
                                <div className="text-slate-500 text-sm">
                                    <span className="font-bold text-slate-700">4.5</span> out of 5 based on 15,884 reviews
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -top-20 -right-20 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl animate-blob"></div>
                            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-blob [animation-delay:2s]"></div>

                            <motion.div 
                                whileHover={{ scale: 1.02, rotate: 0 }}
                                onClick={handleCreateNew}
                                className="relative glass-effect p-4 rounded-3xl border border-white shadow-2xl rotate-2 cursor-pointer transition-all duration-500"
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800"
                                    alt="Resume Preview"
                                    className="rounded-2xl shadow-lg border border-slate-100"
                                />
                                <div className="absolute -left-10 bottom-20 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 animate-bounce [animation-duration:3s]">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-green-100 p-2 rounded-full">
                                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">ATS Friendly Score</p>
                                            <p className="text-xs text-slate-500">98% Optimization Complete</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* MNC Resume Blueprints */}
            <section className="py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
                    <h2 className="text-3xl lg:text-5xl font-extrabold text-slate-900">MNC Resume Blueprints</h2>
                    <p className="text-slate-600 mt-3">Premium, recruiter-tested layouts inspired by Google, Amazon, Microsoft, Netflix, Apple, Meta, Tesla, Adobe.</p>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {mncCards.map((card, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -6, scale: 1.01 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                className="relative bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden group cursor-pointer"
                                onClick={() => handleBlueprintClick(card)}
                            >
                                <div className="h-40 bg-slate-900 relative overflow-hidden">
                                    <img 
                                        src={card.image} 
                                        alt={card.company} 
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                                        onError={(e) => {
                                            e.target.src = 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=800&auto=format&fit=crop';
                                            e.target.className = "w-full h-full object-cover opacity-40";
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
                                    <div className="absolute inset-0 p-4 flex items-end">
                                        <div className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3">
                                            <div className="h-2 w-full bg-white/20 rounded-full mb-1"></div>
                                            <div className="h-2 w-2/3 bg-white/10 rounded-full"></div>
                                        </div>
                                    </div>
                                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 text-slate-900 text-xs font-bold">{card.company}</div>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-black text-slate-900">{card.role}</h3>
                                        <div className="flex -space-x-2">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-black">{card.company[0]}</div>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {card.skills.map((s, i) => (
                                            <span key={i} className="text-[10px] font-bold text-slate-700 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg">{s}</span>
                                        ))}
                                    </div>
                                    <div className="mt-6">
                                        <div className="relative h-24 rounded-xl border border-slate-200 overflow-hidden bg-white">
                                            <img src={card.image} alt="Resume" className="w-full h-full object-cover resume-scroll" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Animated Resume Showcase */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
                    <p className="text-3xl lg:text-5xl font-extrabold text-slate-900">Design Your Resume. Impress Recruiters. Get Hired.</p>
                    <p className="text-slate-600 mt-4 text-lg">Smart templates. Real-time preview. ATS-friendly formats.</p>
                </div>
                <div className="marquee-wrapper">
                    <div className="marquee-track">
                        {[...mncCards, ...mncCards].map((card, i) => (
                            <div 
                                key={i} 
                                className="mx-4 w-72 flex-shrink-0 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden cursor-pointer hover:border-primary/50 transition-colors"
                                onClick={() => handleBlueprintClick(card)}
                            >
                                <div className="h-40 bg-slate-900 relative overflow-hidden">
                                    <img 
                                        src={card.image} 
                                        alt={card.company} 
                                        className="w-full h-full object-cover opacity-80" 
                                        onError={(e) => {
                                            e.target.src = 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=800&auto=format&fit=crop';
                                            e.target.className = "w-full h-full object-cover opacity-40";
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
                                </div>
                                <div className="p-4">
                                    <div className="h-24 rounded-xl border border-slate-200 overflow-hidden bg-white">
                                        <img src={card.image} alt="Resume" className="w-full h-full object-cover resume-scroll" />
                                    </div>
                                    <div className="mt-3 text-sm font-bold text-slate-900">{card.company} • {card.role} (Accepted)</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Core Value Props */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
                    <h2 className="text-3xl lg:text-5xl font-extrabold text-slate-900 mb-4">
                        Create a resume that gets results
                    </h2>
                    <p className="text-lg text-slate-600">Choose a template and get hired by top companies.</p>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Award className="h-8 w-8 text-rose-500" />,
                                title: "Recruiter-Approved Resume",
                                description: "We work with recruiters to design resume templates that format automatically and bypass ATS filters."
                            },
                            {
                                icon: <Clock className="h-8 w-8 text-purple-600" />,
                                title: "Finish Your Resume in 15 Minutes",
                                description: "ResumeCraft helps you tackle your work experience by suggesting what you did at your previous jobs."
                            },
                            {
                                icon: <Target className="h-8 w-8 text-indigo-600" />,
                                title: "Land an Interview",
                                description: "We suggest critical skills for your industry. We've helped over a million people land high-paying interviews."
                            }
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                                <div className="mb-6">{item.icon}</div>
                                <h3 className="text-xl font-bold text-slate-900 mb-4">{item.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6 Features to boost your job search */}
            <section className="py-24 bg-white relative overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                                6 features to boost your <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">job search success</span>
                            </h2>
                            <p className="text-lg text-slate-600 max-w-2xl">
                                Powerful tools designed to help you build, optimize, and track your professional identity.
                            </p>
                        </div>
                        <div className="h-1 w-24 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full mb-2 hidden md:block"></div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <FileText className="w-8 h-8" />,
                                title: "35+ Template Designs",
                                text: "Extensive library of high-fidelity, MNC-focused resume layouts.",
                                color: "from-rose-500 to-rose-600",
                                lightColor: "bg-rose-50",
                                textColor: "text-rose-600"
                            },
                            {
                                icon: <Cpu className="w-8 h-8" />,
                                title: "Enhance with AI",
                                text: "AI-powered suggestions for your bullets and professional summary.",
                                color: "from-purple-500 to-purple-600",
                                lightColor: "bg-purple-50",
                                textColor: "text-purple-600"
                            },
                            {
                                icon: <Eye className="w-8 h-8" />,
                                title: "Resume Review",
                                text: "Instant feedback on your resume clarity, grammar, and ATS impact.",
                                color: "from-indigo-500 to-indigo-600",
                                lightColor: "bg-indigo-50",
                                textColor: "text-indigo-600"
                            },
                            {
                                icon: <MessageSquare className="w-8 h-8" />,
                                title: "AI Cover Letter Builder",
                                text: "Generate matching cover letters in seconds with our smart engine.",
                                color: "from-rose-500 to-rose-600",
                                lightColor: "bg-rose-50",
                                textColor: "text-rose-600"
                            },
                            {
                                icon: <Globe className="w-8 h-8" />,
                                title: "Resume Website",
                                text: "Host your professional portfolio with a unique, shareable public link.",
                                color: "from-purple-500 to-purple-600",
                                lightColor: "bg-purple-50",
                                textColor: "text-purple-600"
                            },
                            {
                                icon: <BarChart3 className="w-8 h-8" />,
                                title: "Resume Tracking",
                                text: "Insights into how many people viewed your professional profile.",
                                color: "from-indigo-500 to-indigo-600",
                                lightColor: "bg-indigo-50",
                                textColor: "text-indigo-600"
                            }
                        ].map((item, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -8, scale: 1.02 }}
                                onClick={() => openFeature(i)}
                                className="group relative flex flex-col items-start p-8 rounded-[32px] bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 cursor-pointer overflow-hidden"
                            >
                                {/* Glassmorphism background effect on hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 backdrop-blur-[2px]"></div>
                                
                                {/* Background Glow */}
                                <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br ${item.color}`}></div>

                                <div className={`mb-8 p-4 rounded-2xl ${item.lightColor} ${item.textColor} group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm relative z-10`}>
                                    {item.icon}
                                </div>
                                
                                <h3 className="text-2xl font-bold text-slate-900 mb-4 relative z-10 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-900 group-hover:to-slate-600 transition-all duration-300">
                                    {item.title}
                                </h3>
                                
                                <p className="text-slate-600 leading-relaxed mb-8 relative z-10">
                                    {item.text}
                                </p>
                                
                                <div className="mt-auto flex items-center font-bold text-sm text-slate-400 group-hover:text-slate-900 transition-colors relative z-10">
                                    <span className="mr-2">Explore Workspace</span>
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>

                                {/* Premium Ripple/Glow Border Effect */}
                                <div className={`absolute inset-0 border-2 border-transparent group-hover:border-slate-100/50 rounded-[32px] transition-all duration-500`}></div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <FeatureShowcase 
                isOpen={showcaseOpen} 
                onClose={() => setShowcaseOpen(false)} 
                initialFeature={activeFeature} 
            />

            {/* Partners / Companies Section */}
            <section className="py-24 bg-slate-900 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-500 blur-[120px]"></div>
                    <div className="absolute bottom-0 left-0 w-1/2 h-full bg-rose-500 blur-[120px]"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <p className="text-center text-slate-400 font-medium mb-12 uppercase tracking-widest text-sm">
                        Our customers have been hired by
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center text-center">
                        <div className="text-white text-2xl font-bold opacity-60 hover:opacity-100 transition-opacity">HDFC Bank</div>
                        <div className="text-white text-2xl font-bold opacity-60 hover:opacity-100 transition-opacity">Tech Mahindra</div>
                        <div className="text-white text-2xl font-bold opacity-60 hover:opacity-100 transition-opacity">Genpact</div>
                        <div className="text-white text-2xl font-bold opacity-60 hover:opacity-100 transition-opacity">Accenture</div>
                        <div className="text-white text-2xl font-bold opacity-60 hover:opacity-100 transition-opacity">Deloitte</div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white pt-24 pb-12 border-t border-slate-100 text-slate-600">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
                        <div className="col-span-2">
                            <Logo size="md" className="mb-6" />
                            <p className="max-w-xs mb-6">
                                The world's most intuitive resume builder designed to help you land your dream job at record speed.
                            </p>
                            <div className="flex space-x-4">
                                {/* Social icons placeholders */}
                                <div className="h-10 w-10 bg-slate-100 rounded-full"></div>
                                <div className="h-10 w-10 bg-slate-100 rounded-full"></div>
                                <div className="h-10 w-10 bg-slate-100 rounded-full"></div>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 mb-6">About Us</h4>
                            <ul className="space-y-4">
                                <li><Link to="/terms">Terms & Conditions</Link></li>
                                <li><Link to="/privacy">Privacy Policy</Link></li>
                                <li><Link to="/terms">Affiliates</Link></li>
                                <li><Link to="/contact">Contact Us</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 mb-6">Resources</h4>
                            <ul className="space-y-4">
                                <li><Link to="/terms">Faqs</Link></li>
                                <li><Link to="/terms">Accessibility</Link></li>
                                <li><Link to="/privacy">Cookies Policy</Link></li>
                                <li><Link to="/terms">Sitemap</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 mb-6">Product</h4>
                            <ul className="space-y-4">
                                <li><Link to="/register">AI Resume Builder</Link></li>
                                <li><Link to="/login">Pricing</Link></li>
                                <li><Link to="/templates">MNC Templates</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-12 border-t border-slate-100">
                        <p className="text-xs text-slate-400 mb-6 leading-relaxed italic">
                            1 Based on a survey of 300 respondents who reported finding a job with ResumeCraft's help. Calculation was made based on the average time it took respondents to get hired.
                        </p>
                        <div className="flex flex-col md:flex-row justify-between items-center text-sm gap-4">
                            <p>©2026, NOW Limited. All rights reserved.</p>
                            <div className="flex space-x-6">
                                <Link to="#">Twitter</Link>
                                <Link to="#">LinkedIn</Link>
                                <Link to="#">YouTube</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
