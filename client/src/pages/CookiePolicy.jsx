import React from 'react';
import { Cookie, Database, Lock, Settings, ShieldCheck } from 'lucide-react';
import SEO from '../components/SEO';

const CookiePolicy = () => {
    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-16">
            <SEO
                title="Cookie Policy"
                description="Learn how ResumeCraft uses cookies and local storage to provide a secure, personalized resume building experience."
            />
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-xl sm:p-12">
                    <div className="mb-8 flex items-center space-x-4">
                        <div className="rounded-2xl bg-orange-100 p-3">
                            <Cookie className="h-8 w-8 text-orange-600" />
                        </div>
                        <h1 className="text-4xl font-extrabold text-slate-900">Cookie Policy</h1>
                    </div>

                    <div className="space-y-8 leading-relaxed text-slate-600">
                        <section>
                            <h3 className="mb-3 flex items-center text-xl font-bold text-slate-900">
                                <ShieldCheck className="mr-3 h-5 w-5 text-orange-500" />
                                Why We Use Cookies
                            </h3>
                            <p>
                                ResumeCraft uses essential cookies and browser storage to operate core features, keep your account secure, remember your cookie consent, and make the resume builder work smoothly across visits.
                            </p>
                        </section>

                        <section>
                            <h3 className="mb-3 flex items-center text-xl font-bold text-slate-900">
                                <Lock className="mr-3 h-5 w-5 text-orange-500" />
                                Essential Cookies
                            </h3>
                            <p>
                                Essential cookies support login sessions, authentication, security checks, and basic application preferences. These are required for ResumeCraft to function correctly.
                            </p>
                        </section>

                        <section>
                            <h3 className="mb-3 flex items-center text-xl font-bold text-slate-900">
                                <Database className="mr-3 h-5 w-5 text-orange-500" />
                                Local Storage
                            </h3>
                            <p>
                                We may use browser local storage to remember your cookie consent choice and preserve editor preferences. This information stays in your browser unless you clear your site data.
                            </p>
                        </section>

                        <section>
                            <h3 className="mb-3 flex items-center text-xl font-bold text-slate-900">
                                <Settings className="mr-3 h-5 w-5 text-orange-500" />
                                Managing Cookies
                            </h3>
                            <p>
                                You can manage or delete cookies through your browser settings at any time. Blocking essential cookies may prevent login, resume editing, or other secured features from working properly.
                            </p>
                        </section>

                        <section className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
                            <p className="text-sm italic">
                                Last Updated: May 2026. For questions about this Cookie Policy, contact us at support.resumecraft@gmail.com.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CookiePolicy;
