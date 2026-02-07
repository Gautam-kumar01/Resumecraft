
import { Link } from 'react-router-dom';
import {
    FileText,
    Zap,
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

const Home = () => {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="relative pt-20 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-600 font-medium text-sm mb-6">
                                <Award className="h-4 w-4" />
                                <span>India's Top Resume Templates</span>
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-6">
                                Get the job <br />
                                <span className="bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                    2x as fast.
                                </span>
                            </h1>
                            <p className="text-xl text-slate-600 mb-10 max-w-lg leading-relaxed">
                                Use recruiter-approved templates and step-by-step content recommendations to create a new resume or optimize your current one.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    to="/register"
                                    className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center group"
                                >
                                    Create new resume
                                    <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link
                                    to="/login"
                                    className="px-8 py-4 bg-white text-slate-900 border-2 border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center"
                                >
                                    Optimize my resume
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

                            <div className="relative glass-effect p-4 rounded-3xl border border-white shadow-2xl rotate-2">
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
                            </div>
                        </div>
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
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                    <h2 className="text-4xl font-extrabold text-slate-900 mb-4">6 features to boost your job search</h2>
                    <div className="h-2 w-24 bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 rounded-full"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <FileText className="text-rose-500" />,
                                title: "35+ Template Designs",
                                text: "Extensive library of high-fidelity, MNC-focused resume layouts."
                            },
                            {
                                icon: <Cpu className="text-purple-600" />,
                                title: "Enhance with AI",
                                text: "AI-powered suggestions for your bullets and professional summary."
                            },
                            {
                                icon: <Eye className="text-indigo-600" />,
                                title: "Resume Review",
                                text: "Instant feedback on your resume clarity, grammar, and ATS impact."
                            },
                            {
                                icon: <MessageSquare className="text-rose-500" />,
                                title: "AI Cover Letter Builder",
                                text: "Generate matching cover letters in seconds with our smart engine."
                            },
                            {
                                icon: <Globe className="text-purple-600" />,
                                title: "Resume Website",
                                text: "Host your professional portfolio with a unique, shareable public link."
                            },
                            {
                                icon: <BarChart3 className="text-indigo-600" />,
                                title: "Resume Tracking",
                                text: "Insights into how many people viewed your professional profile."
                            }
                        ].map((feature, i) => (
                            <div key={i} className="flex items-start space-x-5 p-6 rounded-2xl border border-slate-50 hover:bg-slate-50 transition-colors group">
                                <div className="bg-white p-3 rounded-xl shadow-md border border-slate-100 group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg text-slate-900 mb-1">{feature.title}</h4>
                                    <p className="text-slate-500 text-sm leading-relaxed">{feature.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-16 text-center">
                        <Link to="/register" className="inline-flex items-center px-8 py-4 bg-rose-500 text-white rounded-xl font-bold hover:bg-rose-600 transition-all shadow-lg shadow-rose-200">
                            Choose a template
                        </Link>
                    </div>
                </div>
            </section>

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
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
                                ResumeCraft
                            </h3>
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
                                <li><Link to="#">Terms & Conditions</Link></li>
                                <li><Link to="#">Privacy Policy</Link></li>
                                <li><Link to="#">Affiliates</Link></li>
                                <li><Link to="#">Contact Us</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 mb-6">Resources</h4>
                            <ul className="space-y-4">
                                <li><Link to="#">Faqs</Link></li>
                                <li><Link to="#">Accessibility</Link></li>
                                <li><Link to="#">Cookies Policy</Link></li>
                                <li><Link to="#">Sitemap</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 mb-6">Product</h4>
                            <ul className="space-y-4">
                                <li><Link to="#">AI Resume Builder</Link></li>
                                <li><Link to="#">Pricing</Link></li>
                                <li><Link to="#">MNC Templates</Link></li>
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
