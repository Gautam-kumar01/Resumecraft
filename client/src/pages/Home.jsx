
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
import { motion, AnimatePresence } from 'framer-motion';
import FeatureShowcase from '../components/FeatureShowcase';
import OptimizedImage from '../components/OptimizedImage';

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
            title: '',
            </section>

            {/* Core Value Props */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
                    <h2 className="text-3xl lg:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                        Create a resume that gets results
                    </h2>
                    <p className="text-lg text-slate-600 font-medium">Choose a template and get hired by top companies.</p>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Award className="h-8 w-8 text-orange-500" />,
                                title: "Recruiter-Approved Resume",
                                description: "We work with recruiters to design resume templates that format automatically and bypass ATS filters."
                            },
                            {
                                icon: <Clock className="h-8 w-8 text-orange-600" />,
                                title: "Finish Your Resume in 15 Minutes",
                                description: "ResumeCraft helps you tackle your work experience by suggesting what you did at your previous jobs."
                            },
                            {
                                icon: <Target className="h-8 w-8 text-orange-500" />,
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
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-50/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                                6 features to boost your <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">job search success</span>
                            </h2>
                            <p className="text-lg text-slate-600 max-w-2xl font-medium">
                                Powerful tools designed to help you build, optimize, and track your professional identity.
                            </p>
                        </div>
                        <div className="h-1 w-24 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mb-2 hidden md:block"></div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <FileText className="w-8 h-8" />,
                                title: "35+ Template Designs",
                                text: "Extensive library of high-fidelity, MNC-focused resume layouts.",
                                color: "from-orange-500 to-orange-600",
                                lightColor: "bg-orange-50",
                                textColor: "text-orange-600"
                            },
                            {
                                icon: <Cpu className="w-8 h-8" />,
                                title: "Enhance with AI",
                                text: "AI-powered suggestions for your bullets and professional summary.",
                                color: "from-orange-400 to-orange-500",
                                lightColor: "bg-orange-100",
                                textColor: "text-orange-600"
                            },
                            {
                                icon: <Eye className="w-8 h-8" />,
                                title: "Resume Review",
                                text: "Instant feedback on your resume clarity, grammar, and ATS impact.",
                                color: "from-orange-500 to-orange-700",
                                lightColor: "bg-orange-50",
                                textColor: "text-orange-500"
                            },
                            {
                                icon: <MessageSquare className="w-8 h-8" />,
                                title: "AI Cover Letter Builder",
                                text: "Generate matching cover letters in seconds with our smart engine.",
                                color: "from-orange-400 to-orange-500",
                                lightColor: "bg-orange-50",
                                textColor: "text-orange-600"
                            },
                            {
                                icon: <Globe className="w-8 h-8" />,
                                title: "Resume Website",
                                text: "Host your professional portfolio with a unique, shareable public link.",
                                color: "from-orange-500 to-orange-600",
                                lightColor: "bg-orange-100",
                                textColor: "text-orange-500"
                            },
                            {
                                icon: <BarChart3 className="w-8 h-8" />,
                                title: "Resume Tracking",
                                text: "Insights into how many people viewed your professional profile.",
                                color: "from-orange-600 to-orange-700",
                                lightColor: "bg-orange-50",
                                textColor: "text-orange-600"
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

            <AnimatePresence>
                {showcaseOpen && (
                    <FeatureShowcase
                        isOpen={showcaseOpen}
                        onClose={() => setShowcaseOpen(false)}
                        initialFeature={activeFeature}
                    />
                )}
            </AnimatePresence>

            {/* FAQ Section */}
            <section className="py-24 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl lg:text-5xl font-black text-slate-900 mb-12 text-center tracking-tight">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-6">
                        {[
                            {
                                q: "Is this resume builder really free?",
                                a: "Yes, ResumeCraft is a 100% free resume maker online. You can create, edit, and download your professional resume in PDF format without any hidden charges or subscriptions."
                            },
                            {
                                q: "What is an ATS-friendly resume?",
                                a: "An ATS-friendly resume is designed to be easily read by Applicant Tracking Systems (ATS) used by major MNCs. Our templates use standard fonts and layouts to ensure your resume passes these filters successfully."
                            },
                            {
                                q: "Can I create a cover letter here?",
                                a: "Absolutely! We provide an AI-powered cover letter builder that matches your resume design, ensuring a consistent and professional look for your entire application."
                            },
                            {
                                q: "Do I need to sign up to use the resume maker?",
                                a: "You can start building your resume as a guest, but we recommend creating a free account to save your progress and access your resumes from any device."
                            },
                            {
                                q: "How many resume templates do you offer?",
                                a: "We offer over 35+ professional, recruiter-approved resume templates designed for various industries including IT, Marketing, Finance, and for freshers."
                            }
                        ].map((faq, i) => (
                            <div key={i} className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-orange-200 transition-all">
                                <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-start">
                                    <span className="text-orange-500 mr-3">Q.</span>
                                    {faq.q}
                                </h3>
                                <p className="text-slate-600 leading-relaxed pl-8">
                                    {faq.a}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Partners / Companies Section */}
            <section className="py-24 bg-slate-900 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-orange-500 blur-[120px]"></div>
                    <div className="absolute bottom-0 left-0 w-1/2 h-full bg-orange-600 blur-[120px]"></div>
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
        </motion.div>
    );
};

export default Home;
