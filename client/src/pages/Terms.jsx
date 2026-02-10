
import React from 'react';
import { ShieldCheck, Scale, FileText, Lock } from 'lucide-react';
import SEO from '../components/SEO';

const Terms = () => {
    return (
        <div className="min-h-screen pt-24 pb-16 bg-slate-50">
            <SEO 
                title="Terms & Conditions" 
                description="Read our Terms and Conditions to understand your rights and responsibilities when using ResumeCraft."
            />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-3xl shadow-xl p-12 border border-slate-100">
                    <div className="flex items-center space-x-4 mb-8">
                        <div className="bg-purple-100 p-3 rounded-2xl">
                            <Scale className="h-8 w-8 text-purple-600" />
                        </div>
                        <h1 className="text-4xl font-extrabold text-slate-900">Terms & Conditions</h1>
                    </div>

                    <div className="space-y-8 text-slate-600 leading-relaxed">
                        <section>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">1. Acceptance of Terms</h3>
                            <p>By accessing and using ResumeCraft, you agree to comply with and be bound by these Terms and Conditions. Our services are designed to provide professional resume-building tools for individual career advancement.</p>
                        </section>

                        <section>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">2. User Conduct</h3>
                            <p>You agree to use our platform only for lawful purposes. You are responsible for the accuracy of any content you upload, including personal information, work experience, and profile pictures.</p>
                        </section>

                        <section>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">3. Subscription & Termination</h3>
                            <p>We reserve the right to modify or terminate access to our premium features at any time. Users using disposable email services will be blocked to maintain platform integrity.</p>
                        </section>

                        <section className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <h3 className="text-xl font-bold text-slate-900 mb-3 italic">Intellectual Property</h3>
                            <p className="text-sm">The templates, AI logic, and brand "ResumeCraft" are the exclusive property of our development team. Any unauthorized replication of our high-end templates is strictly prohibited.</p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Terms;
