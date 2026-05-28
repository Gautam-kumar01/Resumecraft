import React from 'react';
import SEO from '../components/SEO';
import OptimizedImage from '../components/OptimizedImage';
import { Link } from 'react-router-dom';

const ResumeBuilderDashboard = () => {
    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-16 dark:bg-slate-950">
            <SEO
                title="Free AI Resume Builder Dashboard | ResumeCraft"
                description="Explore the free AI resume builder dashboard by ResumeCraft. Create ATS-friendly resumes in minutes with our modern, premium interface."
                keywords="AI resume builder dashboard, free resume builder, online cv maker, ATS friendly resume, professional resume templates"
                url="/resume-builder-dashboard"
                image="https://resumecraft.co.in/images/ai-resume-builder-dashboard.webp"
            />
            
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                        Free AI Resume Builder Dashboard
                    </h1>
                    <p className="mt-4 text-xl text-slate-600 dark:text-slate-300">
                        Create your professional, ATS-optimized resume in minutes using our intuitive, smart dashboard.
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-8">
                    <OptimizedImage
                        src="/images/ai-resume-builder-dashboard.webp"
                        alt="ResumeCraft AI resume builder dashboard with ATS-friendly resume editor"
                        caption="AI Resume Builder dashboard preview with ATS optimization."
                        width={1200}
                        height={630}
                        priority={true}
                        className="shadow-lg"
                    />

                    <div className="mt-12 grid gap-8 md:grid-cols-2">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                Why Choose Our AI Dashboard?
                            </h2>
                            <p className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed">
                                Our dashboard is designed for speed and precision. Unlike traditional builders, we use an AI-first approach to ensure your skills are perfectly aligned with job descriptions. The dark glassmorphism UI provides a premium, distraction-free environment for you to craft the perfect CV.
                            </p>
                            <ul className="mt-6 space-y-3 text-slate-600 dark:text-slate-300">
                                <li className="flex items-center gap-3">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400">✓</span>
                                    Real-time ATS scoring
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400">✓</span>
                                    Smart AI suggestions for bullet points
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400">✓</span>
                                    Instant PDF export with one click
                                </li>
                            </ul>
                        </div>
                        <div className="flex flex-col justify-center rounded-xl bg-slate-50 p-6 dark:bg-slate-800/50">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Ready to start?</h3>
                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                Join thousands of professionals who have already upgraded their careers.
                            </p>
                            <div className="mt-6 flex flex-col gap-3">
                                <Link to="/register" className="inline-flex w-full items-center justify-center rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-orange-600">
                                    Build My Resume Now
                                </Link>
                                <Link to="/free-resume-templates" className="inline-flex w-full items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 transition-all hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800">
                                    Browse Templates
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeBuilderDashboard;
