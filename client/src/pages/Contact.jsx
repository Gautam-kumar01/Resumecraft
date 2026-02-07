
import React from 'react';
import { Mail, Github, Linkedin, User, Code } from 'lucide-react';

const Contact = () => {
    return (
        <div className="min-h-screen pt-24 pb-16 bg-slate-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                    <div className="grid md:grid-cols-2">
                        {/* Profile Section */}
                        <div className="p-12 bg-slate-900 text-white">
                            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-rose-500 to-indigo-600 p-1 mb-8">
                                <div className="w-full h-full rounded-[20px] bg-slate-900 flex items-center justify-center">
                                    <User className="h-16 w-16 text-rose-500" />
                                </div>
                            </div>
                            <h1 className="text-3xl font-extrabold mb-2 text-white">Gautam Kumar</h1>
                            <p className="text-rose-400 font-bold tracking-widest text-sm uppercase mb-6 flex items-center">
                                <Code className="h-4 w-4 mr-2" />
                                Full Stack Developer
                            </p>
                            <p className="text-slate-400 leading-relaxed mb-8">
                                Passionate developer dedicated to building high-quality web applications that solve real-world problems. Lead developer and visionary behind ResumeCraft.
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-white/10 p-2 rounded-lg">
                                        <Mail className="h-5 w-5 text-rose-400" />
                                    </div>
                                    <span className="text-slate-200">gautamkr192007@gmail.com</span>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="bg-white/10 p-2 rounded-lg">
                                        <Github className="h-5 w-5 text-slate-300" />
                                    </div>
                                    <span className="text-slate-200">github.com/Gautam-kumar01</span>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form placeholder/Info */}
                        <div className="p-12">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Get In Touch</h2>
                            <p className="text-slate-600 mb-8">
                                Have a question or want to collaborate? Feel free to reach out via email or social media. I'm always open to discussing new projects and creative ideas.
                            </p>

                            <div className="space-y-6">
                                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                                    <h4 className="font-bold text-slate-900 mb-2 italic">Support Hours</h4>
                                    <p className="text-slate-500 text-sm">Monday — Friday: 9am - 6pm IST</p>
                                </div>
                                <a
                                    href="mailto:gautamkr192007@gmail.com"
                                    className="w-full inline-flex items-center justify-center px-8 py-4 bg-rose-500 text-white rounded-xl font-bold hover:bg-rose-600 transition-all shadow-lg shadow-rose-200"
                                >
                                    Send me an Email
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
