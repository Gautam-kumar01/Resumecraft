
import React from 'react';
import { Mail, Github, Linkedin, Code, Globe } from 'lucide-react';
import SEO from '../components/SEO';
import Logo from '../components/Logo';

const Contact = () => {
    return (
        <div className="min-h-screen pt-24 pb-16 bg-white">
            <SEO 
                title="Contact Us" 
                description="Get in touch with the ResumeCraft team. We are here to help you with any questions or support."
            />
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="rounded-3xl overflow-hidden border border-orange-100 shadow-xl">
                    <div className="bg-gradient-to-br from-orange-50 via-white to-orange-100 p-12">
                        <div className="flex items-center justify-between mb-8">
                            <Logo size="lg" />
                            <div className="flex items-center space-x-3 text-orange-600">
                                <Globe className="h-5 w-5" />
                                <span className="font-bold tracking-widest uppercase text-sm">Full Stack Developer</span>
                            </div>
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-900 mb-3">Gautam Kumar</h1>
                        <div className="flex flex-wrap gap-2 mb-6">
                            <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-200 text-xs font-bold">Java</span>
                            <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-200 text-xs font-bold">Python</span>
                            <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-200 text-xs font-bold">JavaScript</span>
                            <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-200 text-xs font-bold">TypeScript</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed mb-6">
                            I design and build end‑to‑end web solutions that are fast, reliable, and user‑centric. From scalable APIs to polished interfaces, I bring ideas to production with clean architecture, robust testing, and thoughtful developer experience.
                        </p>
                        <p className="text-slate-700 leading-relaxed">
                            I specialize in modern JavaScript/TypeScript ecosystems, Python services, and enterprise‑grade Java. I care deeply about performance, accessibility, and maintainability, shipping features with strong CI/CD and observability in place.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-0">
                        <div className="p-12 bg-white">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">About Me</h2>
                            <div className="space-y-4">
                                <p className="text-slate-700">
                                    I work across the stack: front‑end frameworks, backend services, databases, and cloud deployments. I enjoy collaborating on challenging problems and crafting delightful developer tooling.
                                </p>
                                <div className="flex items-center space-x-4">
                                    <Code className="h-5 w-5 text-orange-600" />
                                    <span className="text-slate-800 font-bold">Java • Python • JavaScript • TypeScript</span>
                                </div>
                            </div>

                            <div className="mt-10 space-y-4">
                                <h3 className="font-bold text-slate-900">Contact</h3>
                                <div className="space-y-3">
                                    <a href="mailto:gautamkr192007@gmail.com" className="flex items-center space-x-3 text-slate-700 hover:text-orange-600 transition">
                                        <Mail className="h-5 w-5 text-orange-600" />
                                        <span>gautamkr192007@gmail.com</span>
                                    </a>
                                    <a href="https://github.com/Gautam-kumar01" target="_blank" rel="noreferrer" className="flex items-center space-x-3 text-slate-700 hover:text-orange-600 transition">
                                        <Github className="h-5 w-5 text-slate-800" />
                                        <span>github.com/Gautam-kumar01</span>
                                    </a>
                                    <a href="https://www.linkedin.com/in/gautam-kumar-7332a2284" target="_blank" rel="noreferrer" className="flex items-center space-x-3 text-slate-700 hover:text-orange-600 transition">
                                        <Linkedin className="h-5 w-5 text-slate-800" />
                                        <span>LinkedIn</span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="p-12 bg-orange-50 border-l border-orange-100">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Multilingual</h2>
                            <div className="space-y-6">
                                <div className="p-6 rounded-2xl bg-white border border-orange-100">
                                    <h4 className="font-bold text-orange-700 mb-2">English</h4>
                                    <p className="text-slate-700 text-sm">
                                        Full‑stack developer delivering robust, scalable applications with clean code, strong testing, and modern DevOps practices.
                                    </p>
                                </div>
                                <div className="p-6 rounded-2xl bg-white border border-orange-100">
                                    <h4 className="font-bold text-orange-700 mb-2">हिंदी</h4>
                                    <p className="text-slate-700 text-sm">
                                        मैं एक फुल‑स्टैक डेवलपर हूं जो भरोसेमंद और स्केलेबल वेब एप्लिकेशन बनाता हूं, साफ कोड और आधुनिक प्रैक्टिस के साथ।
                                    </p>
                                </div>
                                <div className="p-6 rounded-2xl bg-white border border-orange-100">
                                    <h4 className="font-bold text-orange-700 mb-2">Español</h4>
                                    <p className="text-slate-700 text-sm">
                                        Desarrollador full‑stack que entrega aplicaciones escalables y confiables con arquitectura limpia y buenas prácticas.
                                    </p>
                                </div>
                                <div className="p-6 rounded-2xl bg-white border border-orange-100">
                                    <h4 className="font-bold text-orange-700 mb-2">Français</h4>
                                    <p className="text-slate-700 text-sm">
                                        Développeur full‑stack livrant des applications performantes et maintenables avec une architecture soignée.
                                    </p>
                                </div>
                            </div>
                            <div className="mt-8">
                                <a
                                    href="mailto:gautamkr192007@gmail.com"
                                    className="inline-flex items-center justify-center px-6 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition shadow-lg shadow-orange-200"
                                >
                                    Get in Touch
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
