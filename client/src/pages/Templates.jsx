
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Sparkles, ArrowRight, Brain, Zap, Briefcase, Globe, Target, ShieldCheck } from 'lucide-react';

const Templates = () => {
    const [starters, setStarters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStarters = async () => {
            try {
                const { data } = await api.get('/resumes/starters');
                setStarters(data);
            } catch (error) {
                console.error('Failed to fetch starters', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStarters();
    }, []);

    const useTemplate = async (template) => {
        setCreating(template.id);
        try {
            const { id, targetCompanies, ...resumeData } = template;
            const { data } = await api.post('/resumes', resumeData);
            navigate(`/editor/${data._id}`);
        } catch (error) {
            console.error('Failed to create resume from template', error);
        } finally {
            setCreating(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-20">
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-bold uppercase tracking-widest mb-6">
                    <Globe className="h-3.5 w-3.5" />
                    <span>MNC Standard Blueprint</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
                    Win at <span className="bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent">Global Scale</span>
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                    Industry-ready resumes designed to bypass ATS systems and impress recruiters at world-leading corporations.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
                {starters.map((template) => (
                    <div key={template.id} className="group flex flex-col md:flex-row glass-effect rounded-[2.5rem] border border-white/80 hover:border-primary/40 transition-all duration-700 hover:shadow-2xl hover:shadow-primary/10 overflow-hidden">

                        {/* Visual Preview Side */}
                        <div className={`md:w-[45%] p-10 flex flex-col justify-between relative overflow-hidden shrink-0 ${template.templateId === 'visual' ? 'bg-slate-900' :
                                template.templateId === 'elegant' ? 'bg-indigo-50' : 'bg-slate-100'
                            }`}>
                            {/* Animated light effect */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full group-hover:bg-primary/20 transition-colors duration-700"></div>

                            <div className="relative z-10 w-full h-40 border-2 border-slate-200/50 rounded-xl bg-white shadow-sm overflow-hidden p-4">
                                {template.templateId === 'visual' ? (
                                    <div className="flex h-full gap-2">
                                        <div className="w-1/3 bg-slate-900 rounded-lg flex flex-col p-2 space-y-2">
                                            <div className="w-8 h-8 rounded-full bg-slate-800"></div>
                                            <div className="h-1 w-full bg-slate-800 rounded"></div>
                                            <div className="h-1 w-2/3 bg-slate-800 rounded"></div>
                                        </div>
                                        <div className="flex-1 space-y-3">
                                            <div className="h-2 w-full bg-slate-100 rounded"></div>
                                            <div className="h-2 w-3/4 bg-slate-100 rounded"></div>
                                            <div className="h-10 w-full bg-rose-50 rounded-lg border border-rose-100"></div>
                                        </div>
                                    </div>
                                ) : template.templateId === 'elegant' ? (
                                    <div className="flex flex-col items-center h-full space-y-4 pt-4">
                                        <div className="h-3 w-3/4 bg-slate-100 rounded mx-auto"></div>
                                        <div className="h-2 w-1/2 bg-slate-50 rounded mx-auto"></div>
                                        <div className="space-y-2 w-full">
                                            <div className="h-1 w-full bg-slate-50 rounded"></div>
                                            <div className="h-1 w-full bg-slate-50 rounded"></div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex justify-between border-b pb-2">
                                            <div className="space-y-2">
                                                <div className="h-3 w-20 bg-slate-100 rounded"></div>
                                                <div className="h-2 w-12 bg-slate-50 rounded"></div>
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-slate-100"></div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="h-1 w-full bg-slate-50 rounded"></div>
                                            <div className="h-1 w-full bg-slate-50 rounded"></div>
                                            <div className="h-1 w-2/3 bg-slate-50 rounded"></div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="relative z-10">
                                <div className={`text-[10px] font-bold uppercase tracking-wider mb-3 ${template.templateId === 'visual' ? 'text-white/50' : 'text-slate-400'}`}>Core Industry</div>
                                <div className={`inline-flex items-center px-4 py-2 rounded-2xl text-[11px] font-bold whitespace-nowrap ${template.templateId === 'visual' ? 'bg-white/10 border border-white/10 text-white' : 'bg-slate-900/5 text-slate-700'
                                    }`}>
                                    {template.industry}
                                </div>
                            </div>
                        </div>

                        {/* Content Side */}
                        <div className="md:w-[55%] p-10 md:p-12 flex flex-col justify-between bg-white/40">
                            <div>
                                <h3 className="text-3xl font-black text-slate-900 mb-3 group-hover:text-primary transition-colors duration-500 tracking-tight">{template.role}</h3>
                                <p className="text-slate-500 text-sm mb-8 leading-relaxed font-medium">
                                    {template.description}
                                </p>

                                <div className="mb-10">
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center">
                                        <ShieldCheck className="h-3.5 w-3.5 mr-1.5 text-accent" />
                                        Target Global MNCs
                                    </div>
                                    <div className="flex flex-wrap gap-2.5">
                                        {template.targetCompanies?.map((company, idx) => (
                                            <span key={idx} className="inline-flex items-center px-3 py-1.5 rounded-xl bg-slate-900/5 text-slate-700 text-[10px] font-black border border-slate-200/50">
                                                {company}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-10">
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">MNC Success Skills</div>
                                    <div className="flex flex-wrap gap-2">
                                        {template.skills.slice(0, 4).map((skill, idx) => (
                                            <span key={idx} className="bg-primary/5 text-primary px-3 py-1.5 rounded-xl text-[10px] font-bold border border-primary/10">
                                                {skill}
                                            </span>
                                        ))}
                                        <span className="text-slate-400 text-[10px] font-black py-1.5">+{template.skills.length - 4}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => useTemplate(template)}
                                disabled={creating === template.id}
                                className="w-full flex items-center justify-center space-x-3 bg-slate-950 hover:bg-primary text-white py-5 rounded-[1.25rem] font-black transition-all transform active:scale-[0.97] disabled:opacity-50 shadow-2xl shadow-slate-950/20 hover:shadow-primary/30 text-xs uppercase tracking-widest"
                            >
                                {creating === template.id ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <Sparkles className="h-4 w-4" />
                                        <span>Use This Blueprint</span>
                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Templates;
