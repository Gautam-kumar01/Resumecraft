
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import SEO from '../components/SEO';
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
                if (Array.isArray(data)) {
                    setStarters(data);
                } else {
                    setStarters([]);
                }
            } catch (error) {
                console.error('Failed to fetch starters', error);
                setStarters([]);
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
            if (error.response && error.response.status === 401) {
                navigate('/login');
            } else {
                alert('Something went wrong. Please try again later.');
            }
        } finally {
            setCreating(null);
        }
    };

    if (loading) {
        return (
            <>
                <SEO
                    title="Free Resume Templates & Formats | Online CV Maker & AI Builder"
                    description="Browse the best free resume templates and formats. ATS-friendly, MNC-ready layouts for freshers and experienced professionals. Build your CV online for free."
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
                title="Free Resume Templates & Formats | Online CV Maker & AI Builder"
                description="Browse the best free resume templates and formats. ATS-friendly, MNC-ready layouts for freshers and experienced professionals. Build your CV online for free."
            />
            <div className="text-center mb-20">
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-600 text-xs font-bold uppercase tracking-widest mb-6">
                    <Globe className="h-3.5 w-3.5" />
                    <span>MNC Standard Blueprint</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
                    Best Free <span className="bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 bg-clip-text text-transparent">Resume Templates</span> & Formats
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                    Industry-ready templates designed for <strong>online resume making</strong>. Bypass ATS systems and impress recruiters at world-leading corporations.
                </p>
            </div>

            {/* Popular Role-Specific Templates Banner/List */}
            <div className="mb-16 bg-gradient-to-br from-orange-50 to-white dark:from-slate-800/40 dark:to-slate-900 border border-orange-100 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-12 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 blur-[80px] rounded-full"></div>
                <div className="relative z-10 max-w-3xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
                        Looking for a Role-Specific Blueprint?
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base mb-8">
                        Explore our customized, ATS-vetted resume templates pre-filled with industry-specific skills and achievements.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        {[
                            { name: 'Software Engineer', slug: 'software-engineer' },
                            { name: 'Data Analyst', slug: 'data-analyst' },
                            { name: 'Marketing Manager', slug: 'marketing-manager' },
                            { name: 'Fresher / Graduate', slug: 'fresher' },
                            { name: 'Teacher / Educator', slug: 'teacher' }
                        ].map((role) => (
                            <Link 
                                key={role.slug}
                                to={`/resume-template/${role.slug}`}
                                className="px-5 py-3 bg-white dark:bg-slate-800 hover:bg-orange-500 hover:text-white text-slate-700 dark:text-slate-300 rounded-2xl font-bold text-xs border border-slate-200/50 dark:border-slate-700 hover:border-orange-500 transition-all shadow-sm"
                            >
                                {role.name} Template →
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
                {starters.map((template) => (
                    <div key={template.id} className="group flex flex-col md:flex-row glass-effect rounded-[2.5rem] border border-white/80 hover:border-orange-500/40 transition-all duration-700 hover:shadow-2xl hover:shadow-orange-500/10 overflow-hidden">

                        {/* Visual Preview Side */}
                        <div className="md:w-[45%] h-64 md:h-auto p-0 relative overflow-hidden shrink-0">
                            <img
                                src={template.imageUrl || 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=800&auto=format&fit=crop'}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                                alt={template.role}
                                onError={(e) => {
                                    e.currentTarget.src = 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=800&auto=format&fit=crop';
                                    e.currentTarget.className = "w-full h-full object-cover opacity-50";
                                }}
                            />
                            {/* Animated light effect */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 blur-[80px] rounded-full group-hover:bg-orange-500/30 transition-colors duration-700"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80"></div>

                            <div className="absolute bottom-10 left-10 z-10">
                                <div className="text-white/50 text-[10px] font-bold uppercase tracking-wider mb-2">Core Industry</div>
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
                                        <ShieldCheck className="h-3.5 w-3.5 mr-1.5 text-orange-500" />
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
                                            <span key={idx} className="bg-orange-500/5 text-orange-600 px-3 py-1.5 rounded-xl text-[10px] font-bold border border-orange-500/10">
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
                                className="w-full flex items-center justify-center space-x-3 bg-slate-950 hover:bg-orange-500 text-white py-5 rounded-[1.25rem] font-black transition-all transform active:scale-[0.97] disabled:opacity-50 shadow-2xl shadow-slate-950/20 hover:shadow-orange-500/30 text-xs uppercase tracking-widest"
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
