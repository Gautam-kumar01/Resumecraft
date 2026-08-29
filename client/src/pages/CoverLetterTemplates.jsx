
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import SEO from '../components/SEO';
import { Sparkles, ArrowRight, Mail, FileText, Send, Brain, Plus, X, Wand2 } from 'lucide-react';

const CoverLetterTemplates = () => {
    const [starters, setStarters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(null);
    const [showAiModal, setShowAiModal] = useState(false);
    const [aiData, setAiData] = useState({
        jobRole: '',
        companyName: '',
        jobDescription: '',
        tone: 'Professional'
    });
    const [generatingAi, setGeneratingAi] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStarters = async () => {
            try {
                const { data } = await api.get('/cover-letters/starters');
                if (Array.isArray(data)) {
                    setStarters(data);
                } else {
                    setStarters([
                        {
                            id: 'software-engineer-cl',
                            role: 'Software Engineer',
                            industry: 'Technology',
                            description: 'A clean, impact-oriented cover letter template for software engineers.',
                            imageUrl: '/images/ai-resume-builder-dashboard.webp',
                            content: { title: 'Software Engineer Blueprint' }
                        }
                    ]);
                }
            } catch (error) {
                console.error('Failed to fetch starters', error);
                // Fallback starters if API fails
                setStarters([
                    {
                        id: 'software-engineer-cl',
                        role: 'Software Engineer',
                        industry: 'Technology',
                        description: 'A clean, impact-oriented cover letter template for software engineers.',
                        imageUrl: '/images/ai-resume-builder-dashboard.webp',
                        content: { title: 'Software Engineer Blueprint' }
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchStarters();
    }, []);

    const handleUseTemplate = async (template) => {
        setCreating(template.id);
        try {
            const { ...coverLetterData } = template;
            const { data } = await api.post('/cover-letters', {
                ...coverLetterData.content,
                title: template.title || `${template.role} Cover Letter`
            });
            navigate(`/cover-letter-editor/${data._id}`);
        } catch (error) {
            console.error('Failed to create cover letter from template', error);
            if (error.response && error.response.status === 401) {
                navigate('/login');
            } else {
                alert('Something went wrong. Please try again later.');
            }
        } finally {
            setCreating(null);
        }
    };

    const handleCreateScratch = async () => {
        setCreating('scratch');
        try {
            const { data } = await api.post('/cover-letters', { title: 'Untitled Cover Letter' });
            navigate(`/cover-letter-editor/${data._id}`);
        } catch (error) {
            console.error('Failed to create blank cover letter', error);
            if (error.response && error.response.status === 401) {
                navigate('/login');
            } else {
                alert('Something went wrong. Please try again later.');
            }
        } finally {
            setCreating(null);
        }
    };

    const handleAiGenerate = async (e) => {
        e.preventDefault();
        setGeneratingAi(true);
        try {
            const { data: aiContent } = await api.post('/ai/generate-cover-letter', aiData);
            const { data } = await api.post('/cover-letters', {
                ...aiContent,
                title: `AI Generated: ${aiData.jobRole}`,
                companyName: aiData.companyName
            });
            navigate(`/cover-letter-editor/${data._id}`);
        } catch (error) {
            console.error('Failed to generate AI cover letter', error);
            if (error.response && error.response.status === 401) {
                navigate('/login');
            } else {
                alert('Something went wrong. Please try again later.');
            }
        } finally {
            setGeneratingAi(false);
            setShowAiModal(false);
        }
    };

    if (loading) {
        return (
            <>
                <SEO
                    title="Free Cover Letter Maker Online | Professional Templates & AI Builder"
                    description="Create a job-winning cover letter in minutes with our free online cover letter maker. Use professional templates or generate a custom letter with AI."
                />
                <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                </div>
            </>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <SEO
                title="Free Cover Letter Maker Online | Professional Templates & AI Builder"
                description="Create a job-winning cover letter in minutes with our free online cover letter maker. Use professional templates or generate a custom letter with AI."
            />
            
            {/* Header Section */}
            <div className="text-center mb-16">
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

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
                <button
                    onClick={() => setShowAiModal(true)}
                    className="flex items-center space-x-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-orange-500/20 hover:scale-105 transition-all"
                >
                    <Brain className="h-5 w-5" />
                    <span>Create with AI</span>
                </button>
                <button
                    onClick={handleCreateScratch}
                    disabled={creating === 'scratch'}
                    className="flex items-center space-x-3 bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all shadow-sm"
                >
                    {creating === 'scratch' ? <div className="w-5 h-5 border-2 border-slate-900/20 border-t-slate-900 rounded-full animate-spin" /> : <Plus className="h-5 w-5" />}
                    <span>Create from Scratch</span>
                </button>
            </div>

            {/* Templates Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {starters.map((template) => (
                    <div key={template.id} className="group glass-effect rounded-[2.5rem] border border-white/80 hover:border-orange-500/40 transition-all duration-500 hover:shadow-2xl overflow-hidden flex flex-col h-full">
                        <div className="h-48 relative overflow-hidden shrink-0">
                            <img
                                src={template.imageUrl || '/images/ai-resume-builder-dashboard.webp'}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                alt={template.role}
                                onError={(e) => {
                                    if (e.currentTarget.dataset.fallback === 'true') return;
                                    e.currentTarget.dataset.fallback = 'true';
                                    e.currentTarget.src = '/images/ai-resume-builder-dashboard.webp';
                                    e.currentTarget.className = 'w-full h-full object-cover opacity-50';
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                            <div className="absolute bottom-4 left-6">
                                <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                    {template.industry}
                                </span>
                            </div>
                        </div>

                        <div className="p-8 flex flex-col flex-1">
                            <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-orange-500 transition-colors">{template.role}</h3>
                            <p className="text-slate-500 text-sm mb-8 line-clamp-2">
                                {template.description}
                            </p>

                            <button
                                onClick={() => handleUseTemplate(template)}
                                disabled={creating === template.id}
                                className="mt-auto w-full flex items-center justify-center space-x-3 bg-slate-900 hover:bg-orange-500 text-white py-4 rounded-xl font-bold transition-all disabled:opacity-50"
                            >
                                {creating === template.id ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Mail className="h-4 w-4" />
                                        <span>Use Template</span>
                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* AI Generation Modal */}
            {showAiModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative">
                        <button 
                            onClick={() => setShowAiModal(false)}
                            className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors"
                        >
                            <X className="h-5 w-5 text-slate-400" />
                        </button>

                        <div className="p-8">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="p-2 bg-orange-500/10 rounded-lg">
                                    <Brain className="h-6 w-6 text-orange-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900">AI Cover Letter</h2>
                            </div>

                            <form onSubmit={handleAiGenerate} className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Target Job Role</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. Senior Software Engineer"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                                        value={aiData.jobRole}
                                        onChange={(e) => setAiData({...aiData, jobRole: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Company Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Google"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                                        value={aiData.companyName}
                                        onChange={(e) => setAiData({...aiData, companyName: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Job Description / Requirements (Optional)</label>
                                    <textarea
                                        rows="3"
                                        placeholder="Paste key requirements to tailor the letter..."
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all resize-none"
                                        value={aiData.jobDescription}
                                        onChange={(e) => setAiData({...aiData, jobDescription: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tone</label>
                                    <select
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                                        value={aiData.tone}
                                        onChange={(e) => setAiData({...aiData, tone: e.target.value})}
                                    >
                                        <option value="Professional">Professional</option>
                                        <option value="Creative">Creative</option>
                                        <option value="Enthusiastic">Enthusiastic</option>
                                        <option value="Confident">Confident</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    disabled={generatingAi}
                                    className="w-full flex items-center justify-center space-x-3 bg-slate-900 hover:bg-orange-500 text-white py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-orange-500/20 disabled:opacity-50"
                                >
                                    {generatingAi ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>AI is writing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Wand2 className="h-5 w-5" />
                                            <span>Generate with AI</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CoverLetterTemplates;
