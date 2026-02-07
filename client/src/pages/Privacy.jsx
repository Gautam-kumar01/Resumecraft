
import React from 'react';
import { ShieldCheck, Lock, Eye, Database } from 'lucide-react';

const Privacy = () => {
    return (
        <div className="min-h-screen pt-24 pb-16 bg-slate-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-3xl shadow-xl p-12 border border-slate-100">
                    <div className="flex items-center space-x-4 mb-8">
                        <div className="bg-rose-100 p-3 rounded-2xl">
                            <ShieldCheck className="h-8 w-8 text-rose-600" />
                        </div>
                        <h1 className="text-4xl font-extrabold text-slate-900">Privacy Policy</h1>
                    </div>

                    <div className="space-y-8 text-slate-600 leading-relaxed">
                        <section>
                            <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center">
                                <Database className="h-5 w-5 mr-3 text-rose-500" />
                                Data Collection
                            </h3>
                            <p>We collect minimal data required to build your professional resume. This includes your name, email address (exclusively Gmail), and the professional details you choose to enter into your resume templates.</p>
                        </section>

                        <section>
                            <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center">
                                <Lock className="h-5 w-5 mr-3 text-purple-500" />
                                Data Security
                            </h3>
                            <p>Your data is encrypted and stored securely. We do not sell your personal data to third parties. Profile pictures are stored as Base64 strings to ensure portability and immediate rendering in your PDF downloads.</p>
                        </section>

                        <section>
                            <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center">
                                <Eye className="h-5 w-5 mr-3 text-indigo-500" />
                                Cookies & Tracking
                            </h3>
                            <p>We use essential cookies to maintain your login session. No aggressive marketing tracking is utilized. Our goal is to provide a clean, "ad-free" resume building experience.</p>
                        </section>

                        <section className="bg-slate-50 p-6 rounded-2xl border border-slate-100 italic">
                            <p className="text-sm">Last Updated: February 2026. For privacy concerns, please contact the lead developer at gautamkr192007@gmail.com.</p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
