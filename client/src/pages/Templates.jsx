
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Sparkles, ArrowRight, Brain, Zap, Briefcase } from 'lucide-react';

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
            // Remove the id from the template object so backend handles creation
            const { id, ...resumeData } = template;
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
            <div className="text-center mb-16">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
                    Choose an <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Industry-Ready</span> Template
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                    Power your career with expert-recommended skills and content tailored for top-tier companies.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {starters.map((template) => (
                    <div key={template.id} className="group relative glass-effect rounded-3xl p-8 border border-white/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 overflow-hidden">
                        {/* Decorative Gradient */}
                        <div className="absolute top-0 right-0 -translate-x-[-20%] -translate-y-[20%] w-32 h-32 bg-primary/10 blur-3xl rounded-full group-hover:bg-primary/20 transition-colors"></div>

                        <div className="relative z-10">
                            <div className="bg-primary/10 text-primary w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border border-primary/20">
                                {template.id === 'software-engineer' ? <Zap className="h-6 w-6" /> :
                                    template.id === 'data-scientist' ? <Brain className="h-6 w-6" /> :
                                        <Briefcase className="h-6 w-6" />}
                            </div>

                            <h3 className="text-2xl font-bold text-slate-900 mb-2">{template.role}</h3>
                            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                                {template.description}
                            </p>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center text-xs font-semibold text-primary uppercase tracking-wider">
                                    <Sparkles className="h-4 w-4 mr-2" />
                                    Recommended Skills
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {template.skills.slice(0, 6).map((skill, idx) => (
                                        <span key={idx} className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-medium border border-slate-200">
                                            {skill}
                                        </span>
                                    ))}
                                    {template.skills.length > 6 && (
                                        <span className="text-slate-400 text-xs py-1">+{template.skills.length - 6} more</span>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={() => useTemplate(template)}
                                disabled={creating === template.id}
                                className="w-full flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-bold transition-all group-hover:translate-y-[-2px] disabled:opacity-50"
                            >
                                {creating === template.id ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <span>Use This Template</span>
                                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
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
