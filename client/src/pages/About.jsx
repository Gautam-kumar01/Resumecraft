
import React from 'react';
import {
    Code2,
    Globe,
    Cpu,
    Layers,
    Sparkles,
    Github,
    Linkedin,
    Mail,
    Terminal,
    Database,
    Layout,
    CheckCircle2
} from 'lucide-react';
import SEO from '../components/SEO';
import { motion } from 'framer-motion';

const About = () => {
    const skills = [
        { name: 'Java', level: 'Expert', icon: <Cpu className="text-red-500" /> },
        { name: 'Python', level: 'Advanced', icon: <Terminal className="text-blue-500" /> },
        { name: 'JavaScript', level: 'Expert', icon: <Code2 className="text-yellow-500" /> },
        { name: 'TypeScript', level: 'Advanced', icon: <Globe className="text-blue-400" /> },
        { name: 'React', level: 'Expert', icon: <Layers className="text-cyan-400" /> },
        { name: 'Node.js', level: 'Advanced', icon: <Database className="text-green-500" /> },
        { name: 'MongoDB', level: 'Advanced', icon: <Database className="text-emerald-500" /> },
        { name: 'Tailwind CSS', level: 'Expert', icon: <Layout className="text-sky-400" /> }
    ];

    return (
        <div className="min-h-screen pt-32 pb-24 bg-white dark:bg-slate-900 font-sans">
            <SEO 
                title="Founder | Gautam Kumar - ResumeCraft" 
                description="The journey of Gautam Kumar, a Full Stack Developer building the future of AI-powered career tools."
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-600 text-xs font-bold uppercase tracking-widest mb-6">
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>Innovator & Architect</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">
                            Gautam <span className="text-orange-500">Kumar</span>
                        </h1>
                        <div className="space-y-6 text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-light">
                            <p>
                                I am a <span className="font-bold text-slate-900 dark:text-white">Full Stack Developer</span> and software architect with a deep-rooted passion for algorithmic efficiency and clean code. My coding journey is driven by the thrill of turning complex logic into seamless, user-centric experiences.
                            </p>
                            <p>
                                I specialize in building high-performance systems using <span className="text-orange-500 font-medium">Java, Python, and modern JavaScript</span> ecosystems. For me, coding isn't just about syntax—it's about solving real-world problems with elegant, scalable engineering. From designing low-latency backend APIs to crafting high-fidelity React interfaces, I thrive in the space where logic meets design.
                            </p>
                        </div>
                        <div className="flex space-x-4 mt-10">
                            <a href="https://github.com/Gautam-kumar01" className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl hover:text-orange-500 transition-all hover:scale-110">
                                <Github className="h-6 w-6" />
                            </a>
                            <a href="https://linkedin.com" className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl hover:text-orange-500 transition-all hover:scale-110">
                                <Linkedin className="h-6 w-6" />
                            </a>
                            <a href="mailto:support.resumecraft@gmail.com" className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl hover:text-orange-500 transition-all hover:scale-110">
                                <Mail className="h-6 w-6" />
                            </a>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ 
                            opacity: 1, 
                            scale: 1,
                            y: [0, -10, 0]
                        }}
                        transition={{ 
                            duration: 0.8,
                            y: {
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }
                        }}
                        className="relative flex justify-center"
                    >
                        {/* Circular Animated Glow */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-orange-500 via-purple-500 to-orange-600 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                        
                        <div className="relative h-80 w-80 md:h-[450px] md:w-[450px] rounded-full p-2 bg-gradient-to-tr from-orange-500 to-purple-600 shadow-2xl">
                            <div className="h-full w-full rounded-full overflow-hidden border-4 border-white dark:border-slate-800 bg-white dark:bg-slate-800">
                                <img
                                    src="/images/gautam.jpg"
                                    alt="Gautam Kumar"
                                    className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-110"
                                    onError={(e) => {
                                        e.target.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop";
                                    }}
                                />
                            </div>
                        </div>
                        
                        {/* Status Indicator with Audio Visualizer Style */}
                        <div className="absolute -bottom-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-6 py-3 rounded-full border border-orange-500/20 shadow-2xl flex items-center space-x-4">
                            <div className="flex items-end space-x-1 h-4">
                                <motion.div animate={{ height: [4, 16, 8, 12, 4] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1 bg-green-500 rounded-full"></motion.div>
                                <motion.div animate={{ height: [8, 4, 16, 6, 8] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1 bg-green-500 rounded-full"></motion.div>
                                <motion.div animate={{ height: [12, 8, 4, 16, 12] }} transition={{ repeat: Infinity, duration: 1.2 }} className="w-1 bg-green-500 rounded-full"></motion.div>
                            </div>
                            <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Always Live</span>
                        </div>
                    </motion.div>
                </div>

                {/* My Journey */}
                <div className="mb-32 pt-20 border-t border-slate-100 dark:border-slate-800">
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-16 text-center">Architecting the Journey</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="group bg-slate-50 dark:bg-slate-800/50 p-12 rounded-[3rem] border border-slate-100 dark:border-slate-700 hover:border-orange-500/30 transition-all">
                            <div className="text-orange-500 font-black text-7xl mb-8 opacity-10 group-hover:opacity-30 transition-opacity">01</div>
                            <h3 className="text-2xl font-bold mb-4 dark:text-white">The Engineering Spark</h3>
                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                                It began with a fascination for how code can bridge the gap between imagination and reality. Mastering Java and Python was just the first step in a lifelong commitment to technical excellence.
                            </p>
                        </div>
                        <div className="group bg-slate-900 p-12 rounded-[3rem] text-white shadow-2xl shadow-orange-500/10">
                            <div className="text-white font-black text-7xl mb-8 opacity-5 group-hover:opacity-20 transition-opacity">02</div>
                            <h3 className="text-2xl font-bold mb-4">Building ResumeCraft</h3>
                            <p className="text-slate-400 leading-relaxed">
                                I applied my Full Stack expertise to solve a universal pain point. By integrating advanced AI models with clean, modular architecture, I built a platform that handles complex logic so users don't have to.
                            </p>
                        </div>
                        <div className="group bg-slate-50 dark:bg-slate-800/50 p-12 rounded-[3rem] border border-slate-100 dark:border-slate-700 hover:border-orange-500/30 transition-all">
                            <div className="text-orange-500 font-black text-7xl mb-8 opacity-10 group-hover:opacity-30 transition-opacity">03</div>
                            <h3 className="text-2xl font-bold mb-4 dark:text-white">Pushing Boundaries</h3>
                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                                The future is about more than just tools—it's about intelligent ecosystems. I'm currently scaling the platform with cutting-edge AI integrations and ultra-modern UI frameworks.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Technical Ecosystem Section */}
                <div className="bg-slate-950 rounded-[5rem] p-12 md:p-24 text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/10 blur-[120px] rounded-full"></div>
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-600/10 blur-[100px] rounded-full"></div>
                    
                    <div className="relative z-10">
                        <div className="text-center mb-20">
                            <h2 className="text-4xl md:text-6xl font-black mb-8 italic tracking-tighter">Code is my <span className="text-orange-500">Craft.</span></h2>
                            <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
                                Behind every button on ResumeCraft is a meticulously designed technical ecosystem built for speed, security, and scalability.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {skills.map((skill, idx) => (
                                <motion.div 
                                    key={idx}
                                    whileHover={{ y: -10, scale: 1.02 }}
                                    className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] flex flex-col items-center text-center group transition-all"
                                >
                                    <div className="mb-6 text-4xl group-hover:scale-125 transition-transform duration-500">{skill.icon}</div>
                                    <h4 className="font-bold text-xl mb-2">{skill.name}</h4>
                                    <div className="h-1 w-12 bg-orange-500/50 rounded-full mb-3"></div>
                                    <span className="text-[10px] uppercase font-black tracking-widest text-slate-500 group-hover:text-orange-500">{skill.level}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Closing Commitment */}
                <div className="mt-32 text-center max-w-4xl mx-auto py-20 px-8 bg-orange-500/5 rounded-[4rem] border border-orange-500/10">
                    <div className="flex justify-center space-x-2 mb-10">
                        <div className="h-2 w-2 bg-orange-500 rounded-full animate-bounce"></div>
                        <div className="h-2 w-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="h-2 w-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-8">Engineering for the Next Decade</h2>
                    <p className="text-xl text-slate-600 dark:text-slate-400 font-light leading-relaxed italic">
                        "I don't just write code; I architect solutions that empower ambition. ResumeCraft is the embodiment of my passion for technical perfection."
                    </p>
                    <div className="mt-12 text-sm font-bold text-orange-600 uppercase tracking-widest">— Gautam Kumar</div>
                </div>
            </div>
        </div>
    );
};

export default About;
