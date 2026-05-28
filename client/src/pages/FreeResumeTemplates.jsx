import React from 'react';
import SEO from '../components/SEO';
import OptimizedImage from '../components/OptimizedImage';
import { Link } from 'react-router-dom';

const FreeResumeTemplates = () => {
    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-16 dark:bg-slate-950">
            <SEO
                title="Free ATS-Friendly Resume Templates 2026 | ResumeCraft"
                description="Browse our premium gallery of free ATS-friendly resume templates. Designed by HR experts, our templates ensure you pass the screening software."
                keywords="free resume templates, ATS friendly resume templates, professional resume formats, premium cv templates online"
                url="/free-resume-templates"
                image="https://resumecraft.co.in/images/ats-friendly-resume-template.webp"
            />
            
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                        Free ATS-Friendly Resume Templates
                    </h1>
                    <p className="mt-4 text-xl text-slate-600 dark:text-slate-300">
                        Stand out with beautifully designed, professionally structured templates that beat the ATS.
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-8">
                    <OptimizedImage
                        src="/images/ats-friendly-resume-template.webp"
                        alt="Gallery of professional free ATS-friendly resume templates inside ResumeCraft"
                        caption="A collection of professional ATS-friendly resume templates in dark mode."
                        width={1200}
                        height={630}
                        priority={true}
                        className="shadow-lg"
                    />

                    <div className="mt-12 grid gap-8 md:grid-cols-2">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                Templates That Get You Hired
                            </h2>
                            <p className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed">
                                Never worry about bad formatting again. Our resume templates have been rigorously tested against top applicant tracking systems (Workday, Taleo, Greenhouse). Each template balances aesthetic appeal with perfect machine readability.
                            </p>
                            <ul className="mt-6 space-y-3 text-slate-600 dark:text-slate-300">
                                <li className="flex items-center gap-3">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400">✓</span>
                                    100% Free to use and download
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400">✓</span>
                                    Customizable colors and typography
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400">✓</span>
                                    ATS-optimized structural code
                                </li>
                            </ul>
                        </div>
                        <div className="flex flex-col justify-center rounded-xl bg-slate-50 p-6 dark:bg-slate-800/50">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Pick a Template</h3>
                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                Find the perfect design that matches your industry and experience level.
                            </p>
                            <div className="mt-6 flex flex-col gap-3">
                                <Link to="/templates" className="inline-flex w-full items-center justify-center rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-orange-600">
                                    Browse All Templates
                                </Link>
                                <Link to="/resume-builder-dashboard" className="inline-flex w-full items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 transition-all hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800">
                                    Go to Dashboard
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FreeResumeTemplates;
