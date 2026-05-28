import React from 'react';
import SEO from '../components/SEO';
import OptimizedImage from '../components/OptimizedImage';
import { Link } from 'react-router-dom';

const AtsResumeCheckerPreview = () => {
    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-16 dark:bg-slate-950">
            <SEO
                title="ATS Resume Checker Preview & Score Calculator | ResumeCraft"
                description="Preview our ATS resume checker. Optimize your CV with our free online tool to beat applicant tracking systems and land more interviews."
                keywords="ATS resume checker, ATS score, free ATS checker online, applicant tracking system, resume optimization"
                url="/ats-resume-checker-preview"
                image="https://resumecraft.co.in/images/free-online-resume-maker.webp"
            />
            
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                        ATS Resume Checker Preview
                    </h1>
                    <p className="mt-4 text-xl text-slate-600 dark:text-slate-300">
                        Maximize your interview chances by passing the Applicant Tracking System (ATS) with flying colors.
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-8">
                    <OptimizedImage
                        src="/images/free-online-resume-maker.webp"
                        alt="ATS Resume Checker UI preview showing mobile and desktop devices with resume score"
                        caption="ATS Resume Checker interface showing real-time score optimization on mobile and desktop."
                        width={1200}
                        height={630}
                        priority={true}
                        className="shadow-lg"
                    />

                    <div className="mt-12 grid gap-8 md:grid-cols-2">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                Beat the Bots. Land the Job.
                            </h2>
                            <p className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed">
                                Over 75% of resumes are rejected by an ATS before a human even sees them. Our advanced ATS Resume Checker scans your content against job descriptions, identifying missing keywords and formatting errors.
                            </p>
                            <ul className="mt-6 space-y-3 text-slate-600 dark:text-slate-300">
                                <li className="flex items-center gap-3">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400">✓</span>
                                    Keyword gap analysis
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400">✓</span>
                                    Action verb recommendations
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400">✓</span>
                                    Readability and formatting checks
                                </li>
                            </ul>
                        </div>
                        <div className="flex flex-col justify-center rounded-xl bg-slate-50 p-6 dark:bg-slate-800/50">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Check Your Score</h3>
                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                Upload your existing resume or build a new one to see your instant ATS match rate.
                            </p>
                            <div className="mt-6 flex flex-col gap-3">
                                <Link to="/register" className="inline-flex w-full items-center justify-center rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-orange-600">
                                    Scan My Resume
                                </Link>
                                <Link to="/resume-builder-dashboard" className="inline-flex w-full items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 transition-all hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800">
                                    View Dashboard
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AtsResumeCheckerPreview;
