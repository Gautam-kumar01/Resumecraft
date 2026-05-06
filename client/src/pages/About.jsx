
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
        <div className="min-h-screen pt-32 pb-24 bg-white dark:bg-slate-900">
            <SEO 
                title="About the Founder | Gautam Kumar" 
                description="Learn about the journey behind ResumeCraft and the full-stack expertise of Gautam Kumar."
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
                            <span>The Visionary Behind ResumeCraft</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">
                            Gautam <span className="text-orange-500">Kumar</span>
                        </h1>
                        <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                            I am a **Full Stack Developer** dedicated to building tools that empower people. My journey with ResumeCraft started with a simple mission: to make high-end, professional career tools accessible to everyone in India and beyond.
                        </p>
                        <div className="flex space-x-4">
                            <a href="https://github.com/Gautam-kumar01" className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl hover:text-orange-500 transition-colors">
                                <Github className="h-6 w-6" />
                            </a>
                            <a href="https://linkedin.com" className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl hover:text-orange-500 transition-colors">
                                <Linkedin className="h-6 w-6" />
                            </a>
                            <a href="mailto:support.resumecraft@gmail.com" className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl hover:text-orange-500 transition-colors">
                                <Mail className="h-6 w-6" />
                            </a>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl shadow-orange-500/20 border-8 border-white dark:border-slate-800">
                            <img 
                                src="/images/gautam.jpg" 
                                alt="Gautam Kumar" 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop";
                                }}
                            />
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute -bottom-6 -right-6 bg-orange-500 text-white p-8 rounded-3xl shadow-xl hidden md:block">
                            <div className="text-4xl font-black">50+</div>
                            <div className="text-xs uppercase font-bold tracking-widest opacity-80">Projects Delivered</div>
                        </div>
                    </motion.div>
                </div>

                {/* My Journey */}
                <div className="mb-32">
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-16 text-center">My Journey</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-700">
                            <div className="text-orange-500 font-black text-6xl mb-6 opacity-20">01</div>
                            <h3 className="text-xl font-bold mb-4 dark:text-white">The Spark</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                                Started as a curious coder exploring Java and Python, I realized that the gap between talent and opportunity often comes down to presentation.
                            </p>
                        </div>
                        <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white">
                            <div className="text-white font-black text-6xl mb-6 opacity-10">02</div>
                            <h3 className="text-xl font-bold mb-4">Building ResumeCraft</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                I combined my love for Full Stack development and AI to create a platform that handles the heavy lifting of resume writing for users.
                            </p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-700">
                            <div className="text-orange-500 font-black text-6xl mb-6 opacity-20">03</div>
                            <h3 className="text-xl font-bold mb-4 dark:text-white">The Future</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                                Constantly evolving the platform with new AI models and premium templates to ensure our users always stay ahead of the curve.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Skills Section */}
                <div className="bg-slate-900 rounded-[4rem] p-12 md:p-20 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent"></div>
                    <div className="relative z-10">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-black mb-6">Technical Arsenal</h2>
                            <p className="text-slate-400 max-w-xl mx-auto">Mastering the technologies that power the modern web.</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {skills.map((skill, idx) => (
                                <motion.div 
                                    key={idx}
                                    whileHover={{ y: -5 }}
                                    className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl flex flex-col items-center text-center"
                                >
                                    <div className="mb-4 text-3xl">{skill.icon}</div>
                                    <h4 className="font-bold text-lg mb-1">{skill.name}</h4>
                                    <span className="text-[10px] uppercase font-bold tracking-widest text-orange-500">{skill.level}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Closing Statement */}
                <div className="mt-32 text-center max-w-3xl mx-auto">
                    <CheckCircle2 className="h-16 w-16 text-orange-500 mx-auto mb-8" />
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">Committed to Excellence</h2>
                    <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
                        Whether it's writing clean Java code or designing pixel-perfect React interfaces, I believe in quality above all else. ResumeCraft is a reflection of that commitment.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About;
