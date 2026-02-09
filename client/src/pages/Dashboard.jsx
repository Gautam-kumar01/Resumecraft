
import { useState, useEffect, useContext, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import { Plus, FileText, Trash2, Edit, ExternalLink, Download, Sparkles, ArrowRight, Copy, Search, Filter, BarChart, Briefcase } from 'lucide-react';

const Dashboard = () => {
    const [resumes, setResumes] = useState([]);
    const [starters, setStarters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(null);
    
    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIndustry, setSelectedIndustry] = useState('All');
    const [selectedExperience, setSelectedExperience] = useState('All');
    const [minAtsScore, setMinAtsScore] = useState(0);

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resumesRes, startersRes] = await Promise.all([
                    api.get('/resumes'),
                    api.get('/resumes/starters')
                ]);
                setResumes(resumesRes.data);
                setStarters(startersRes.data);
            } catch (error) {
                console.error('Failed to fetch data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Extract unique values for filters
    const industries = useMemo(() => {
        const unique = new Set(starters.map(s => s.industry).filter(Boolean));
        return ['All', ...Array.from(unique)];
    }, [starters]);

    const experienceLevels = useMemo(() => {
        const unique = new Set(starters.map(s => s.experienceLevel).filter(Boolean));
        return ['All', ...Array.from(unique)];
    }, [starters]);

    const filteredStarters = useMemo(() => {
        return starters.filter(template => {
            const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  template.targetCompanies.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
                                  template.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
            
            const matchesIndustry = selectedIndustry === 'All' || template.industry === selectedIndustry;
            const matchesExperience = selectedExperience === 'All' || template.experienceLevel === selectedExperience;
            const matchesAts = (template.atsScore || 0) >= minAtsScore;

            return matchesSearch && matchesIndustry && matchesExperience && matchesAts;
        });
    }, [starters, searchQuery, selectedIndustry, selectedExperience, minAtsScore]);

    const useTemplate = async (template) => {
        setCreating(template.id);
        try {
            const { id, targetCompanies, imageUrl, ...resumeData } = template;
            const { data } = await api.post('/resumes', resumeData);
            navigate(`/editor/${data._id}`);
        } catch (error) {
            console.error('Failed to create resume from template', error);
        } finally {
            setCreating(null);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this resume?')) {
            try {
                await api.delete(`/resumes/${id}`);
                setResumes(resumes.filter(resume => resume._id !== id));
            } catch (error) {
                console.error('Failed to delete resume', error);
            }
        }
    };

    const handleDuplicate = async (resume) => {
        try {
            const { data } = await api.post('/resumes', {
                title: `Copy of ${resume.title}`,
                templateId: resume.templateId,
                personalInfo: resume.personalInfo,
                summary: resume.summary,
                education: resume.education,
                experience: resume.experience,
                skills: resume.skills,
                projects: resume.projects
            });
            navigate(`/editor/${data._id}`);
        } catch (error) {
            console.error('Failed to duplicate resume', error);
        }
    };

    const createResume = async () => {
        try {
            const { data } = await api.post('/resumes', { title: 'Untitled Resume' });
            navigate(`/editor/${data._id}`);
        } catch (error) {
            console.error('Failed to create resume', error);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* MNC Blueprints Quick Start */}
            <div className="mb-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 flex items-center">
                            <Sparkles className="h-5 w-5 mr-2 text-primary" />
                            MNC Resume Blueprints
                        </h2>
                        <p className="text-sm text-slate-500">Pick a high-performance blueprint to get hired at top MNCs.</p>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search roles, companies..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                        </div>

                        {/* Industry Filter */}
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <select
                                value={selectedIndustry}
                                onChange={(e) => setSelectedIndustry(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none bg-white cursor-pointer"
                            >
                                {industries.map(ind => (
                                    <option key={ind} value={ind}>{ind === 'All' ? 'All Industries' : ind}</option>
                                ))}
                            </select>
                        </div>

                        {/* Experience Filter */}
                        <div className="relative">
                            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <select
                                value={selectedExperience}
                                onChange={(e) => setSelectedExperience(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none bg-white cursor-pointer"
                            >
                                {experienceLevels.map(exp => (
                                    <option key={exp} value={exp}>{exp === 'All' ? 'All Experience Levels' : exp}</option>
                                ))}
                            </select>
                        </div>

                        {/* ATS Score Filter */}
                        <div className="relative">
                            <BarChart className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <select
                                value={minAtsScore}
                                onChange={(e) => setMinAtsScore(Number(e.target.value))}
                                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none bg-white cursor-pointer"
                            >
                                <option value={0}>Any ATS Score</option>
                                <option value={80}>80+ Score</option>
                                <option value={90}>90+ Score</option>
                                <option value={95}>95+ Score</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredStarters.map((template) => (
                        <button
                            key={template.id}
                            onClick={() => useTemplate(template)}
                            className="group relative flex flex-col bg-white rounded-3xl border border-slate-200 hover:border-primary/40 transition-all text-left overflow-hidden hover:shadow-2xl hover:-translate-y-2 h-[480px]"
                        >
                            {/* Visual Resume Mockup Header */}
                            <div className="h-64 w-full relative overflow-hidden bg-slate-900">
                                <img
                                    src={template.imageUrl || 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=800&auto=format&fit=crop'}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-60 group-hover:opacity-80"
                                    alt={template.title}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent"></div>

                                {/* Glassmorphism Mini-Card Overlay */}
                                <div className="absolute inset-0 p-4 flex flex-col justify-end">
                                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                                                    <Sparkles className="h-3 w-3 text-primary" />
                                                </div>
                                                <span className="text-[9px] font-black text-white uppercase tracking-widest">AI Engineered</span>
                                            </div>
                                            {template.atsScore && (
                                                <span className="text-[10px] font-bold text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded border border-green-400/20">
                                                    {template.atsScore} ATS
                                                </span>
                                            )}
                                        </div>
                                        <div className="space-y-1.5">
                                            <div className="h-1 w-full bg-white/20 rounded-full"></div>
                                            <div className="h-1 w-2/3 bg-white/10 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Industry Spotlight */}
                                <div className="absolute top-4 left-4 flex flex-col gap-2">
                                    <span className="self-start text-[9px] font-black text-white bg-slate-900/80 px-2 py-1 rounded-lg border border-white/10 uppercase tracking-tighter backdrop-blur-sm">
                                        {template.industry}
                                    </span>
                                    {template.experienceLevel && (
                                        <span className="self-start text-[9px] font-bold text-slate-200 bg-white/10 px-2 py-1 rounded-lg border border-white/5 backdrop-blur-sm">
                                            {template.experienceLevel}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="p-5 flex flex-col flex-1">
                                <div className="mb-4">
                                    <h3 className="text-sm font-black text-slate-900 leading-tight group-hover:text-primary transition-colors line-clamp-2">{template.title}</h3>
                                    <p className="text-[10px] text-slate-500 mt-2 line-clamp-2 font-medium">{template.description}</p>
                                </div>

                                {/* "See Inside" - Pre-filled Data Preview */}
                                <div className="mt-auto space-y-4">
                                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="flex flex-wrap gap-1.5">
                                            {template.skills.slice(0, 3).map((skill, i) => (
                                                <span key={i} className="text-[9px] font-bold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded-lg shadow-sm">
                                                    {skill}
                                                </span>
                                            ))}
                                            {template.skills.length > 3 && <span className="text-[9px] font-bold text-slate-400">+{template.skills.length - 3}</span>}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex -space-x-2">
                                            {template.targetCompanies.slice(0, 3).map((c, i) => (
                                                <div key={i} className="w-7 h-7 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center text-[10px] font-black text-slate-900 shadow-lg overflow-hidden">
                                                    {c[0]}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="bg-primary/10 p-2 rounded-full group-hover:bg-primary transition-colors">
                                            <Plus className="h-4 w-4 text-primary group-hover:text-white transition-colors" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {creating === template.id && (
                                <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-xl flex items-center justify-center z-20">
                                    <div className="flex flex-col items-center">
                                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                                        <span className="text-xs font-black text-white uppercase tracking-[0.2em] animate-pulse">Syncing AI Data...</span>
                                    </div>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex justify-between items-center mb-8 pt-8 border-t border-slate-100">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">My Resumes</h1>
                    <p className="mt-1 text-slate-500">Your personalized professional collection.</p>
                </div>
                <div className="flex space-x-4">
                    <button
                        onClick={createResume}
                        className="flex items-center space-x-2 bg-primary hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-medium transition-all shadow-lg shadow-blue-500/30"
                    >
                        <Plus className="h-5 w-5" />
                        <span>Create Blank</span>
                    </button>
                </div>
            </div>

            {resumes.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                        <FileText className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">No resumes yet</h3>
                    <p className="mt-1 text-slate-500 max-w-sm mx-auto">
                        Get started by creating your first professional resume. It only takes a few minutes.
                    </p>
                    <div className="mt-6">
                        <button
                            onClick={createResume}
                            className="text-primary hover:text-blue-700 font-medium"
                        >
                            Create one now &rarr;
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resumes.map((resume) => (
                        <div key={resume._id} className="group bg-white rounded-2xl border border-slate-200 hover:border-primary/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                            <div className="h-40 bg-slate-100 relative items-center justify-center flex">
                                {/* Placeholder for preview image */}
                                <FileText className="h-12 w-12 text-slate-300 group-hover:text-primary/50 transition-colors" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-bold text-slate-900 truncate pr-4">{resume.title}</h3>
                                    {resume.isPublic && (
                                        <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">Public</span>
                                    )}
                                </div>
                                <p className="text-sm text-slate-500 mb-6">Last updated: {new Date(resume.updatedAt).toLocaleDateString()}</p>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                    <div className="flex space-x-2">
                                        <Link
                                            to={`/editor/${resume._id}`}
                                            className="p-2 text-slate-500 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit className="h-5 w-5" />
                                        </Link>
                                        <button
                                            onClick={() => handleDuplicate(resume)}
                                            className="p-2 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                            title="Duplicate"
                                        >
                                            <Copy className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(resume._id)}
                                            className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>

                                    <div className="flex space-x-2">
                                        {resume.isPublic && (
                                            <Link
                                                to={`/p/${resume._id}`}
                                                target="_blank"
                                                className="p-2 text-slate-500 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                                                title="View Public Link"
                                            >
                                                <ExternalLink className="h-5 w-5" />
                                            </Link>
                                        )}
                                        <Link
                                            to={`/editor/${resume._id}`}
                                            className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                            title="Download (open in editor to export)"
                                        >
                                            <Download className="h-5 w-5" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
