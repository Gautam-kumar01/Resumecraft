
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import SEO from '../components/SEO';
import { Sparkles, ArrowRight, Globe, ShieldCheck, Mail, FileText, Send } from 'lucide-react';

const CoverLetterTemplates = () => {
    const [starters, setStarters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStarters = async () => {
            try {
                const { data } = await api.get('/cover-letters/starters');
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
            const { id, ...coverLetterData } = template;
            const { data } = await api.post('/cover-letters', coverLetterData.content);
            navigate(`/cover-letter-editor/${data._id}`);
        } catch (error) {
            console.error('Failed to create cover letter from template', error);
        } finally {
            setCreating(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <SEO
                title="Professional Cover Letter Templates | ResumeCraft"
                description="Choose from our collection of professional cover letter templates. Tailored for various industries and optimized to get you noticed."
            />
            <div className="text-center mb-20">
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-600 text-xs font-bold uppercase tracking-widest mb-6">
                    <Send className="h-3.5 w-3.5" />
                    <span>Get Noticed Faster</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
                    Premium <span className="bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 bg-clip-text text-transparent">Cover Letter</span> Blueprints
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                    Professionally crafted templates that tell your story and highlight your unique value proposition to recruiters.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
                {starters.map((template) => (
                    <div key={template.id} className="group flex flex-col md:flex-row glass-effect rounded-[2.5rem] border border-white/80 hover:border-orange-500/40 transition-all duration-700 hover:shadow-2xl hover:shadow-orange-500/10 overflow-hidden">

                        {/* Visual Preview Side */}
                        <div className="md:w-[45%] h-64 md:h-auto p-0 relative overflow-hidden shrink-0">
                            <img
                                src={template.imageUrl}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                                alt={template.role}
                            />
                            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 blur-[80px] rounded-full group-hover:bg-orange-500/30 transition-colors duration-700"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80"></div>

                            <div className="absolute bottom-10 left-10 z-10">
                                <div className="text-white/50 text-[10px] font-bold uppercase tracking-wider mb-2">Industry</div>
                                <div className="inline-flex items-center px-4 py-2 rounded-2xl bg-white/10 border border-white/20 text-white text-[11px] font-bold backdrop-blur-md">
                                    {template.industry}
                                </div>
                            </div>
                        </div>

                        {/* Content Side */}
                        <div className="md:w-[55%] p-10 md:p-12 flex flex-col justify-between bg-white/40">
                            <div>
                                <h3 className="text-3xl font-black text-slate-900 mb-3 group-hover:text-orange-500 transition-colors duration-500 tracking-tight">{template.role}</h3>
                                <p className="text-slate-500 text-sm mb-8 leading-relaxed font-medium">
                                    {template.description}
                                </p>

                                <div className="mb-10">
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center">
                                        <FileText className="h-3.5 w-3.5 mr-1.5 text-orange-500" />
                                        Key Highlights
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center text-xs text-slate-600">
                                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-2"></div>
                                            Professional formatting
                                        </div>
                                        <div className="flex items-center text-xs text-slate-600">
                                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-2"></div>
                                            Impact-oriented language
                                        </div>
                                        <div className="flex items-center text-xs text-slate-600">
                                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-2"></div>
                                            Easy to customize
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => useTemplate(template)}
                                disabled={creating === template.id}
                                className="w-full flex items-center justify-center space-x-3 bg-slate-950 hover:bg-orange-500 text-white py-5 rounded-[1.25rem] font-black transition-all transform active:scale-[0.97] disabled:opacity-50 shadow-2xl shadow-slate-950/20 hover:shadow-orange-500/30 text-xs uppercase tracking-widest"
                            >
                                {creating === template.id ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <Mail className="h-4 w-4" />
                                        <span>Use This Template</span>
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

export default CoverLetterTemplates;
