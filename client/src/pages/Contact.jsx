
import React from 'react';
import { Mail, MessageSquare, ShieldCheck, Clock, Zap } from 'lucide-react';
import SEO from '../components/SEO';
import { motion } from 'framer-motion';

const Contact = () => {
    return (
        <div className="min-h-screen pt-32 pb-24 bg-slate-50 dark:bg-slate-900">
            <SEO 
                title="Support & Contact | ResumeCraft" 
                description="Get in touch with the ResumeCraft support team. We're here to help you build the perfect resume and land your dream job."
            />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-20">
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
                        We're here to <span className="text-orange-500">help you win.</span>
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Have questions about our AI builder or need career advice? Our support team is ready to assist you 24/7.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Contact Info Cards */}
                    <div className="space-y-6">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm"
                        >
                            <div className="flex items-center space-x-6">
                                <div className="h-16 w-16 bg-orange-500/10 rounded-2xl flex items-center justify-center shrink-0">
                                    <Mail className="h-8 w-8 text-orange-500" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Email Support</h3>
                                    <a href="mailto:support.resumecraft@gmail.com" className="text-2xl font-black text-slate-900 dark:text-white hover:text-orange-500 transition-colors break-all">
                                        support.resumecraft@gmail.com
                                    </a>
                                </div>
                            </div>
                        </motion.div>

                        <div className="grid sm:grid-cols-2 gap-6">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm"
                            >
                                <Clock className="h-8 w-8 text-blue-500 mb-4" />
                                <h4 className="font-bold text-slate-900 dark:text-white mb-2">Response Time</h4>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">We typically respond to all inquiries within 2-4 business hours.</p>
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm"
                            >
                                <ShieldCheck className="h-8 w-8 text-green-500 mb-4" />
                                <h4 className="font-bold text-slate-900 dark:text-white mb-2">Privacy First</h4>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">Your data and resumes are encrypted and never shared with third parties.</p>
                            </motion.div>
                        </div>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-slate-900 dark:bg-orange-600 p-10 rounded-[2.5rem] text-white overflow-hidden relative"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                            <h3 className="text-2xl font-bold mb-4 relative z-10">Join 10,000+ Users</h3>
                            <p className="text-slate-300 dark:text-orange-50 mb-8 relative z-10">Start building your professional future today with our industry-leading AI tools.</p>
                            <Zap className="h-12 w-12 text-orange-500 dark:text-white mb-6 opacity-50" />
                        </motion.div>
                    </div>

                    {/* Contact Form Placeholder / Message */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white dark:bg-slate-800 p-10 md:p-12 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-xl"
                    >
                        <div className="flex items-center space-x-3 mb-8">
                            <MessageSquare className="h-6 w-6 text-orange-500" />
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Send us a message</h2>
                        </div>

                        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Full Name</label>
                                    <input 
                                        type="text" 
                                        className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all dark:text-white"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Email Address</label>
                                    <input 
                                        type="email" 
                                        className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all dark:text-white"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Subject</label>
                                <select className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all dark:text-white">
                                    <option>General Inquiry</option>
                                    <option>Technical Support</option>
                                    <option>Resume Review Request</option>
                                    <option>Billing Question</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Message</label>
                                <textarea 
                                    rows="5"
                                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all dark:text-white resize-none"
                                    placeholder="How can we help you?"
                                ></textarea>
                            </div>
                            <button 
                                className="w-full py-5 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-orange-600/20 active:scale-[0.98]"
                                onClick={() => window.location.href = 'mailto:support.resumecraft@gmail.com'}
                            >
                                Send Message
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
