import { useState } from 'react';
import { Mail, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email) return;
        setStatus('loading');
        setTimeout(() => {
            setStatus('success');
            setEmail('');
        }, 1500);
    };

    return (
        <div className="relative overflow-hidden rounded-[2rem] bg-slate-900 dark:bg-slate-800/80 text-white p-8 md:p-12 border border-slate-800 dark:border-slate-700 shadow-2xl">
            {/* Background glowing effects */}
            <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-orange-500/10 blur-[100px] rounded-full"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-orange-400/10 blur-[80px] rounded-full"></div>

            <div className="relative z-10 max-w-3xl mx-auto text-center">
                <div className="inline-flex p-3 bg-orange-500/10 text-orange-400 rounded-2xl mb-6 border border-orange-500/20">
                    <Mail className="h-6 w-6" />
                </div>
                
                <h3 className="text-2xl md:text-3xl font-black mb-3 tracking-tight">
                    Get Weekly Resume & Career Tips
                </h3>
                
                <p className="text-slate-400 dark:text-slate-300 text-sm md:text-base max-w-xl mx-auto mb-8 leading-relaxed">
                    Receive ATS optimization tips, resume strategies, interview advice, and career growth insights.
                </p>

                <AnimatePresence mode="wait">
                    {status === 'success' ? (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 max-w-md mx-auto flex items-center justify-center space-x-3 text-green-400"
                        >
                            <CheckCircle2 className="h-5 w-5 shrink-0" />
                            <span className="font-bold text-sm">Successfully subscribed! Welcome aboard.</span>
                        </motion.div>
                    ) : (
                        <motion.form 
                            onSubmit={handleSubmit}
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                        >
                            <div className="relative flex-grow">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <input
                                    type="email"
                                    required
                                    placeholder="Enter your email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 dark:border-slate-700 rounded-xl py-3.5 pl-12 pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all placeholder:text-slate-500"
                                    disabled={status === 'loading'}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold px-6 py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 flex items-center justify-center space-x-2 shrink-0 disabled:opacity-50"
                            >
                                {status === 'loading' ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <span>Subscribe</span>
                                )}
                            </button>
                        </motion.form>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Newsletter;
