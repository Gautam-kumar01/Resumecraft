import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, FileText, Cpu, Eye, MessageSquare, Globe, BarChart3, 
  ChevronRight, Sparkles, CheckCircle2, Layout, Search, 
  ArrowRight, Mail, PieChart, TrendingUp, Users, Zap
} from 'lucide-react';

const FeatureShowcase = ({ isOpen, onClose, initialFeature = 0 }) => {
  const [activeFeature, setActiveFeature] = useState(initialFeature);

  const features = [
    {
      id: 0,
      title: "35+ Template Designs",
      icon: <FileText className="w-6 h-6" />,
      color: "from-rose-500 to-rose-600",
      description: "Extensive library of high-fidelity, MNC-focused resume layouts."
    },
    {
      id: 1,
      title: "Enhance with AI",
      icon: <Cpu className="w-6 h-6" />,
      color: "from-purple-500 to-purple-600",
      description: "AI-powered suggestions for your bullets and professional summary."
    },
    {
      id: 2,
      title: "Resume Review",
      icon: <Eye className="w-6 h-6" />,
      color: "from-indigo-500 to-indigo-600",
      description: "Instant feedback on your resume clarity, grammar, and ATS impact."
    },
    {
      id: 3,
      title: "AI Cover Letter Builder",
      icon: <MessageSquare className="w-6 h-6" />,
      color: "from-rose-500 to-rose-600",
      description: "Generate matching cover letters in seconds with our smart engine."
    },
    {
      id: 4,
      title: "Resume Website",
      icon: <Globe className="w-6 h-6" />,
      color: "from-purple-500 to-purple-600",
      description: "Host your professional portfolio with a unique, shareable public link."
    },
    {
      id: 5,
      title: "Resume Tracking",
      icon: <BarChart3 className="w-6 h-6" />,
      color: "from-indigo-500 to-indigo-600",
      description: "Insights into how many people viewed your professional profile."
    }
  ];

  useEffect(() => {
    if (isOpen) {
      setActiveFeature(initialFeature);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, initialFeature]);

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: 20,
      transition: { duration: 0.3 }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          {/* Overlay */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-7xl h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white/20"
          >
            {/* Sidebar */}
            <div className="w-full md:w-80 bg-slate-50 border-r border-slate-100 flex flex-col shrink-0">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-slate-900">Features</span>
                </div>
                <button onClick={onClose} className="md:hidden p-2 hover:bg-slate-200 rounded-full transition-colors">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {features.map((feature) => (
                  <button
                    key={feature.id}
                    onClick={() => setActiveFeature(feature.id)}
                    className={`w-full flex items-center space-x-4 p-4 rounded-2xl transition-all duration-300 text-left group ${
                      activeFeature === feature.id 
                        ? 'bg-white shadow-lg shadow-slate-200/50 scale-[1.02] border border-slate-100' 
                        : 'hover:bg-slate-100/80 text-slate-500'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl bg-gradient-to-br ${feature.color} text-white shadow-lg shadow-current/10 group-hover:scale-110 transition-transform duration-300`}>
                      {feature.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-bold text-sm truncate ${activeFeature === feature.id ? 'text-slate-900' : 'text-slate-600'}`}>
                        {feature.title}
                      </div>
                      {activeFeature === feature.id && (
                        <motion.div 
                          layoutId="activeIndicator"
                          className="text-[10px] text-slate-400 font-medium mt-0.5"
                        >
                          ACTIVE WORKSPACE
                        </motion.div>
                      )}
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${activeFeature === feature.id ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'}`} />
                  </button>
                ))}
              </div>

              <div className="p-6 border-t border-slate-100 bg-white/50">
                <button 
                  onClick={onClose}
                  className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center justify-center space-x-2"
                >
                  <span>Close Workspace</span>
                </button>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden relative bg-white flex flex-col">
              {/* Top Header (Desktop) */}
              <div className="hidden md:flex p-6 border-b border-slate-50 justify-between items-center bg-white/80 backdrop-blur-sm z-10">
                <div className="flex items-center space-x-4">
                  <h2 className="text-xl font-extrabold text-slate-900">
                    {features[activeFeature].title}
                  </h2>
                  <div className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Premium Feature
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 rounded-full transition-all group"
                >
                  <X className="w-6 h-6 text-slate-400 group-hover:text-slate-900 transition-colors" />
                </button>
              </div>

              {/* Workspace Render */}
              <div className="flex-1 overflow-y-auto bg-slate-50/30 p-4 md:p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeFeature}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="h-full"
                  >
                    {renderWorkspace(activeFeature)}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const renderWorkspace = (id) => {
  switch (id) {
    case 0: return <TemplateWorkspace />;
    case 1: return <AIWorkspace />;
    case 2: return <ReviewWorkspace />;
    case 3: return <CoverLetterWorkspace />;
    case 4: return <WebsiteWorkspace />;
    case 5: return <TrackingWorkspace />;
    default: return null;
  }
};

/* --- Workspace Sub-components --- */

const TemplateWorkspace = () => {
  const [selected, setSelected] = useState('modern');
  const templates = [
    { id: 'modern', name: 'Modern Professional', img: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400' },
    { id: 'visual', name: 'Creative Visual', img: 'https://images.unsplash.com/photo-1512484776495-a09d92e8a9ec?w=400' },
    { id: 'elegant', name: 'Wall Street Elegant', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400' },
    { id: 'minimal', name: 'Clean Minimalist', img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400' },
    { id: 'tech', name: 'Tech Optimized', img: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=400' },
    { id: 'exec', name: 'Executive Suite', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Choose your blueprint</h3>
          <p className="text-slate-500">Select from 35+ recruiter-approved designs optimized for ATS.</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100">
          <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold">Professional</button>
          <button className="px-4 py-2 text-slate-500 rounded-lg text-sm font-bold hover:bg-slate-50">Creative</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => setSelected(t.id)}
            className={`group relative rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-300 ${
              selected === t.id ? 'border-rose-500 shadow-xl shadow-rose-500/10 scale-[1.02]' : 'border-transparent hover:border-slate-200'
            }`}
          >
            <div className="aspect-[3/4] overflow-hidden bg-slate-200">
              <img src={t.img} alt={t.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <button className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  Preview Template
                </button>
              </div>
            </div>
            <div className="p-4 bg-white border-t border-slate-100">
              <div className="font-bold text-slate-900">{t.name}</div>
              <div className="text-xs text-slate-400 mt-1 flex items-center">
                <CheckCircle2 className="w-3 h-3 mr-1 text-green-500" /> ATS Optimized
              </div>
            </div>
            {selected === t.id && (
              <div className="absolute top-4 right-4 bg-rose-500 text-white p-1.5 rounded-full shadow-lg">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const AIWorkspace = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Hello! I'm your AI career assistant. I can help you optimize your bullet points or write a powerful professional summary. What would you like to work on?" }
  ]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState('');

  const simulateAI = async () => {
    if (!input.trim()) return;
    
    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setTyping(true);

    try {
      // Basic logic to handle specific keywords for Software Engineer
      let aiResponse = "";
      const lowerMsg = userMessage.toLowerCase();

      if (lowerMsg.includes('software engineer') || lowerMsg.includes('swe') || lowerMsg.includes('developer')) {
        aiResponse = "As a Software Engineer, your resume should highlight technical impact. I recommend using metrics like 'Reduced latency by 30%' or 'Scaled system to handle 1M+ requests'. Would you like me to help rewrite a specific bullet point with these metrics?";
      } else if (lowerMsg.includes('summary') || lowerMsg.includes('summarize')) {
        aiResponse = "A powerful professional summary should be concise. For example: 'Innovative Software Engineer with 5+ years of experience in full-stack development and cloud architecture. Proven track record of optimizing system performance and leading cross-functional teams.' Does this match your profile?";
      } else if (lowerMsg.includes('project') || lowerMsg.includes('description')) {
        aiResponse = "For project descriptions, use the STAR method (Situation, Task, Action, Result). For your software projects, focus on the tech stack and the specific problem you solved. For example: 'Built a real-time analytics dashboard using React and Node.js, resulting in a 20% increase in data visibility for stakeholders.'";
      } else {
        aiResponse = "That's a great question. To give you the best career strategy, could you tell me more about your target role or a specific part of your resume you'd like to improve?";
      }

      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
        setTyping(false);
      }, 1000);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: "I'm having trouble connecting right now, but I can still give you general advice: Always quantify your achievements!" }]);
      setTyping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col space-y-6">
      <div className="flex-1 bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden flex flex-col relative group">
        {/* Shimmer effect overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity duration-1000">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-100 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
        </div>

        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50 backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-600/20 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-lg">AI Career Strategist</div>
              <div className="text-[10px] text-green-500 font-bold flex items-center tracking-widest">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span> SYSTEM ONLINE
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth">
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] p-6 rounded-[24px] shadow-sm ${
                m.role === 'user' 
                  ? 'bg-slate-900 text-white rounded-tr-none shadow-xl shadow-slate-900/10' 
                  : 'bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100'
              }`}>
                <p className="text-sm leading-relaxed font-medium">{m.content}</p>
              </div>
            </motion.div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="bg-slate-50 p-6 rounded-[24px] rounded-tl-none border border-slate-100 flex space-x-2">
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 bg-purple-400 rounded-full"></motion.div>
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 bg-purple-400 rounded-full"></motion.div>
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 bg-purple-400 rounded-full"></motion.div>
              </div>
            </div>
          )}
        </div>

        <div className="p-8 border-t border-slate-50 bg-white">
          <div className="relative group">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="E.g. 'Help me optimize my project bullet points'..." 
              className="w-full pl-8 pr-16 py-5 bg-slate-50 border-2 border-transparent focus:border-purple-100 focus:bg-white rounded-[24px] outline-none text-sm font-medium transition-all duration-300"
              onKeyPress={(e) => e.key === 'Enter' && simulateAI()}
            />
            <button 
              onClick={simulateAI}
              className="absolute right-3 top-3 bottom-3 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl shadow-lg shadow-purple-600/30 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center"
            >
              <Zap className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['Fix Grammar', 'Add Metrics', 'Power Verbs', 'Summarize'].map((action) => (
          <button 
            key={action} 
            onClick={() => {
              setInput(`Can you help me ${action.toLowerCase()} my resume?`);
            }}
            className="p-4 bg-white rounded-2xl border border-slate-100 text-xs font-bold text-slate-600 hover:border-purple-200 hover:bg-purple-50 transition-all flex flex-col items-center space-y-2"
          >
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span>{action}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const ReviewWorkspace = () => {
  const score = 84;
  return (
    <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
          <h4 className="text-lg font-bold text-slate-900 mb-6">Overall Score</h4>
          <div className="relative w-40 h-40">
            <svg className="w-full h-full rotate-[-90deg]">
              <circle cx="80" cy="80" r="70" fill="none" stroke="#f1f5f9" strokeWidth="12" />
              <motion.circle 
                cx="80" cy="80" r="70" fill="none" stroke="url(#scoreGradient)" strokeWidth="12" strokeLinecap="round"
                initial={{ strokeDasharray: "0 440" }}
                animate={{ strokeDasharray: `${(score / 100) * 440} 440` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-slate-900">{score}</span>
              <span className="text-[10px] font-bold text-slate-400">EXCELLENT</span>
            </div>
          </div>
          <p className="mt-6 text-sm text-slate-500">Your resume is better than 84% of candidates in your field.</p>
        </div>

        <div className="bg-slate-900 p-6 rounded-3xl text-white overflow-hidden relative">
          <div className="relative z-10">
            <h4 className="font-bold mb-2">ATS Checker</h4>
            <p className="text-xs text-slate-400 mb-4">We've identified 4 keywords missing from your profile.</p>
            <div className="flex flex-wrap gap-2">
              {['Kubernetes', 'CI/CD', 'Leadership', 'Scale'].map(tag => (
                <span key={tag} className="px-3 py-1 bg-white/10 rounded-lg text-[10px] font-bold">+ {tag}</span>
              ))}
            </div>
          </div>
          <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-rose-500/20 rounded-full blur-2xl"></div>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <h4 className="text-lg font-bold text-slate-900">Improvement Tips</h4>
        {[
          { title: "Quantify your impact", desc: "Add more metrics to your experience section to show results.", status: "Needs Work", color: "rose" },
          { title: "Strong Action Verbs", desc: "You've used 'Responsible for' 3 times. Try 'Spearheaded' or 'Orchestrated'.", status: "Critical", color: "amber" },
          { title: "Section Order", desc: "Your skills section should be more prominent for technical roles.", status: "Suggestion", color: "indigo" },
          { title: "Formatting Consistency", desc: "Date formats are consistent throughout the document.", status: "Perfect", color: "emerald" },
        ].map((tip, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-slate-100 flex items-start space-x-4 hover:shadow-md transition-shadow"
          >
            <div className={`p-2 rounded-xl bg-${tip.color}-50 text-${tip.color}-500 shrink-0`}>
              {tip.status === 'Perfect' ? <CheckCircle2 className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-slate-900">{tip.title}</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded bg-${tip.color}-50 text-${tip.color}-600 uppercase`}>{tip.status}</span>
              </div>
              <p className="text-sm text-slate-500">{tip.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const CoverLetterWorkspace = () => {
  const [step, setStep] = useState(1);
  const [activeTone, setActiveTone] = useState('Professional');
  
  const tones = [
    { name: 'Professional', icon: <Award className="w-4 h-4" /> },
    { name: 'Enthusiastic', icon: <Sparkles className="w-4 h-4" /> },
    { name: 'Creative', icon: <Zap className="w-4 h-4" /> },
    { name: 'Concise', icon: <Target className="w-4 h-4" /> }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 bg-white/50 p-2 rounded-2xl backdrop-blur-sm">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-500 ${
              step >= s 
                ? 'bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-500/20 scale-110' 
                : 'bg-slate-100 text-slate-400'
            }`}>
              {step > s ? <CheckCircle2 className="w-6 h-6" /> : `0${s}`}
            </div>
            {s < 3 && (
              <div className="flex-1 mx-4 h-1 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: "0%" }}
                  animate={{ width: step > s ? "100%" : "0%" }}
                  className="h-full bg-rose-500"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex-1 min-h-0">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1" 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: -20 }} 
              className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 space-y-8"
            >
              <div className="space-y-2">
                <h4 className="text-3xl font-black text-slate-900 tracking-tight">Job Intelligence</h4>
                <p className="text-slate-500">Our AI will tailor your letter to these specific details.</p>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">Target Role</label>
                  <input 
                    placeholder="e.g. Senior Frontend Architect at Vercel" 
                    className="w-full px-8 py-5 bg-slate-50 rounded-[24px] outline-none focus:ring-2 focus:ring-rose-500/10 focus:bg-white border-2 border-transparent focus:border-rose-100 transition-all font-medium" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">Job Requirements</label>
                  <textarea 
                    rows={6} 
                    placeholder="Paste the key requirements from the job posting..." 
                    className="w-full px-8 py-5 bg-slate-50 rounded-[32px] outline-none focus:ring-2 focus:ring-rose-500/10 focus:bg-white border-2 border-transparent focus:border-rose-100 transition-all font-medium resize-none" 
                  />
                </div>
              </div>

              <button 
                onClick={() => setStep(2)} 
                className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-bold text-lg hover:bg-slate-800 transition-all flex items-center justify-center group shadow-xl shadow-slate-900/10"
              >
                Continue to Personality
                <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2" 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: -20 }} 
              className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 text-center space-y-10"
            >
              <div className="space-y-4">
                <div className="w-24 h-24 bg-gradient-to-br from-rose-50 to-rose-100 rounded-3xl flex items-center justify-center mx-auto shadow-inner group">
                  <Mail className="w-12 h-12 text-rose-500 group-hover:scale-110 transition-transform" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-3xl font-black text-slate-900">Define Your Tone</h4>
                  <p className="text-slate-500">How should you come across to the hiring team?</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {tones.map(tone => (
                  <button 
                    key={tone.name} 
                    onClick={() => {
                      setActiveTone(tone.name);
                      setStep(3);
                    }} 
                    className={`p-8 rounded-[32px] font-bold text-lg transition-all flex flex-col items-center space-y-4 border-2 ${
                      activeTone === tone.name 
                        ? 'bg-rose-500 text-white border-rose-400 shadow-xl shadow-rose-500/20' 
                        : 'bg-slate-50 text-slate-600 border-transparent hover:border-rose-200 hover:bg-white'
                    }`}
                  >
                    <div className={`p-3 rounded-2xl ${activeTone === tone.name ? 'bg-white/20' : 'bg-white shadow-sm'}`}>
                      {tone.icon}
                    </div>
                    <span>{tone.name}</span>
                  </button>
                ))}
              </div>
              
              <button 
                onClick={() => setStep(1)} 
                className="text-slate-400 font-bold text-sm hover:text-slate-900 transition-colors uppercase tracking-widest"
              >
                ← Back to Job Details
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3" 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              className="space-y-8"
            >
              <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 space-y-8">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <h4 className="text-2xl font-black text-slate-900">Final Masterpiece</h4>
                    <p className="text-slate-500 text-sm">Generated with <span className="text-rose-500 font-bold">{activeTone}</span> tone</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-4 hover:bg-slate-50 rounded-2xl transition-all group border border-slate-100">
                      <Sparkles className="w-5 h-5 text-slate-400 group-hover:text-rose-500" />
                    </button>
                  </div>
                </div>

                <div className="p-10 bg-slate-50 rounded-[32px] border border-slate-100 font-serif text-slate-700 leading-relaxed whitespace-pre-line text-lg relative group">
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="px-3 py-1 bg-white rounded-full text-[10px] font-bold text-slate-400 shadow-sm border border-slate-100">EDITABLE DRAFT</span>
                  </div>
                  Dear Hiring Manager,

                  I am writing to express my strong interest in the Senior Frontend Architect position. With over 8 years of experience building scalable web applications and leading engineering teams, I am confident in my ability to drive technical excellence at Vercel.

                  My background in performance optimization and design systems aligns perfectly with your requirements for...
                  
                  [AI Content Continued with precision...]
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => setStep(1)} 
                    className="flex-1 py-5 bg-slate-100 text-slate-900 rounded-[24px] font-bold hover:bg-slate-200 transition-all"
                  >
                    Regenerate
                  </button>
                  <button className="flex-[2] py-5 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-[24px] font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-rose-500/20">
                    Use This Cover Letter
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const WebsiteWorkspace = () => {
  const [activeSection, setActiveSection] = useState('home');
  return (
    <div className="flex flex-col h-full space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Portfolio Website</h3>
          <p className="text-slate-500 text-sm">Convert your resume into a stunning personal website in one click.</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-6 py-2.5 bg-white border border-slate-200 text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all flex items-center">
            <Layout className="w-4 h-4 mr-2" /> Change Theme
          </button>
          <button className="px-6 py-2.5 bg-purple-600 text-white rounded-xl font-bold text-sm hover:bg-purple-700 transition-all shadow-lg shadow-purple-600/20 flex items-center">
            <Globe className="w-4 h-4 mr-2" /> Publish Site
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-8 min-h-0">
        <div className="w-64 space-y-6 overflow-y-auto pr-4">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Site Structure</span>
            {['Home', 'Experience', 'Projects', 'Skills', 'Contact'].map(item => (
              <button 
                key={item} 
                onClick={() => setActiveSection(item.toLowerCase())}
                className={`w-full flex justify-between items-center p-3 rounded-xl font-bold text-sm transition-all ${
                  activeSection === item.toLowerCase() ? 'bg-white text-purple-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                {item}
                <div className="w-2 h-2 rounded-full bg-slate-200"></div>
              </button>
            ))}
          </div>
          
          <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl text-white">
            <div className="text-xs text-slate-400 mb-1">Your URL</div>
            <div className="font-mono text-sm mb-4 truncate">resumecraft.io/alex-vance</div>
            <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-all">Copy Link</button>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-t-[40px] shadow-2xl border-x border-t border-slate-100 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
            <div className="flex space-x-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-400"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
            </div>
            <div className="px-4 py-1.5 bg-white rounded-lg text-[10px] text-slate-400 font-mono shadow-sm">https://resumecraft.io/alex-vance</div>
            <div className="w-10"></div>
          </div>
          <div className="flex-1 overflow-y-auto p-12 text-center">
            <motion.div 
              key={activeSection}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto space-y-8"
            >
              <div className="w-32 h-32 bg-slate-100 rounded-full mx-auto overflow-hidden">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200" alt="Profile" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-slate-900 mb-2">Alex Vance</h1>
                <p className="text-xl text-purple-600 font-bold">Principal AI Infrastructure Engineer</p>
              </div>
              <p className="text-slate-500 leading-relaxed text-lg italic">"Building the future of scalable intelligence, one node at a time."</p>
              
              <div className="grid grid-cols-2 gap-6 pt-12">
                <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 text-left">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
                    <Zap className="w-6 h-6 text-amber-500" />
                  </div>
                  <h4 className="font-bold text-slate-900">Core Expertise</h4>
                  <p className="text-sm text-slate-500 mt-2">Specialized in distributed systems and LLM inference optimization.</p>
                </div>
                <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 text-left">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
                    <Globe className="w-6 h-6 text-indigo-500" />
                  </div>
                  <h4 className="font-bold text-slate-900">Global Reach</h4>
                  <p className="text-sm text-slate-500 mt-2">Delivered solutions used by 5M+ users across 40 countries.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TrackingWorkspace = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Views', value: '1,284', change: '+12%', icon: <Eye className="w-5 h-5" />, color: 'rose' },
          { label: 'Unique Visitors', value: '856', change: '+8%', icon: <Users className="w-5 h-5" />, color: 'indigo' },
          { label: 'Resume Downloads', value: '42', change: '+24%', icon: <Download className="w-5 h-5" />, color: 'emerald' },
          { label: 'Avg. Time Spent', value: '2m 45s', change: '-5%', icon: <TrendingUp className="w-5 h-5" />, color: 'purple' },
        ].map((stat, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100"
          >
            <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 text-${stat.color}-500 flex items-center justify-center mb-4 shadow-sm`}>
              {stat.icon}
            </div>
            <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</div>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-black text-slate-900">{stat.value}</div>
              <div className={`text-xs font-bold mb-1 ${stat.change.startsWith('+') ? 'text-green-500' : 'text-rose-500'}`}>
                {stat.change}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-10">
            <h4 className="text-xl font-bold text-slate-900">View Activity</h4>
            <select className="bg-slate-50 border-none rounded-xl px-4 py-2 text-xs font-bold outline-none">
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between gap-2 px-2">
            {[40, 65, 35, 90, 55, 75, 45, 85, 30, 60, 95, 40].map((h, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ duration: 1, delay: i * 0.05, ease: "easeOut" }}
                className="flex-1 bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t-lg relative group"
              >
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-2 py-1 rounded text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  {Math.floor(h * 1.5)}
                </div>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-between mt-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
            <span>Jan</span>
            <span>Mar</span>
            <span>May</span>
            <span>Jul</span>
            <span>Sep</span>
            <span>Nov</span>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 flex flex-col">
          <h4 className="text-xl font-bold text-slate-900 mb-8">Visitor Sources</h4>
          <div className="flex-1 flex flex-col justify-center space-y-6">
            {[
              { label: 'LinkedIn', value: 65, color: 'bg-indigo-500' },
              { label: 'Direct Link', value: 20, color: 'bg-purple-500' },
              { label: 'Search', value: 10, color: 'bg-rose-500' },
              { label: 'Other', value: 5, color: 'bg-slate-200' },
            ].map((source, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-slate-600">{source.label}</span>
                  <span className="font-black text-slate-900">{source.value}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${source.value}%` }}
                    transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                    className={`h-full ${source.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
          <button className="mt-8 w-full py-4 bg-slate-50 text-slate-900 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-all flex items-center justify-center">
            View Full Report <ChevronRight className="ml-2 w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeatureShowcase;
