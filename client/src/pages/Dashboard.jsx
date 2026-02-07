
import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import { Plus, FileText, Trash2, Edit, ExternalLink, Download, Sparkles } from 'lucide-react';

const Dashboard = () => {
    const [resumes, setResumes] = useState([]);
    const [starters, setStarters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(null);
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
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 flex items-center">
                            <Sparkles className="h-5 w-5 mr-2 text-primary" />
                            MNC Resume Blueprints
                        </h2>
                        <p className="text-sm text-slate-500">Pick a high-performance blueprint to get hired at top MNCs.</p>
                    </div>
                    <Link to="/templates" className="text-sm font-bold text-primary hover:underline">View All &rarr;</Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {starters.slice(0, 4).map((template) => (
                        <button
                            key={template.id}
                            onClick={() => useTemplate(template)}
                            className="group relative flex flex-col bg-white rounded-3xl border border-slate-200 hover:border-primary/40 transition-all text-left overflow-hidden hover:shadow-2xl hover:-translate-y-2 h-[420px]"
                        >
                            {/* Visual Resume Preview Header */}
                            <div className="h-48 w-full relative bg-slate-50 p-4 border-b border-slate-100">
                                <div className="w-full h-full rounded-xl bg-white shadow-sm border border-slate-200/50 p-4 relative overflow-hidden">
                                    {/* Mini Resume Skeleton */}
                                    <div className="flex gap-2 mb-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 shrink-0"></div>
                                        <div className="flex-1 space-y-1.5">
                                            <div className="h-2 w-2/3 bg-slate-200 rounded"></div>
                                            <div className="h-1.5 w-1/2 bg-slate-100 rounded"></div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-1 w-full bg-slate-50 rounded"></div>
                                        <div className="h-1 w-full bg-slate-50 rounded"></div>
                                        <div className="h-1 w-3/4 bg-slate-50 rounded"></div>
                                    </div>

                                    {/* Company Badge Overlay */}
                                    <div className="absolute top-4 right-4 h-6 w-12 bg-slate-900 rounded flex items-center justify-center opacity-10 group-hover:opacity-100 transition-opacity">
                                        <span className="text-[8px] font-black text-white">{template.targetCompanies[0]}</span>
                                    </div>

                                    {/* Industry Spotlight */}
                                    <div className="absolute bottom-4 left-4">
                                        <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-1 rounded-lg">
                                            {template.industry}
                                        </span>
                                    </div>
                                </div>
                                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary to-purple-600"></div>
                            </div>

                            <div className="p-6 flex flex-col flex-1">
                                <div className="mb-4">
                                    <h3 className="text-lg font-black text-slate-900 leading-tight group-hover:text-primary transition-colors">{template.title}</h3>
                                    <p className="text-xs text-slate-500 mt-2 line-clamp-2">{template.description}</p>
                                </div>

                                {/* "See Inside" - Pre-filled Data Preview */}
                                <div className="mt-auto space-y-4">
                                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Internal Blueprints</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {template.skills.slice(0, 4).map((skill, i) => (
                                                <span key={i} className="text-[9px] font-bold text-slate-600 bg-white border border-slate-200 px-1.5 py-0.5 rounded-md">
                                                    {skill}
                                                </span>
                                            ))}
                                            <span className="text-[9px] font-bold text-slate-400">+{template.skills.length - 4} more</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex -space-x-2">
                                            {template.targetCompanies.slice(0, 3).map((c, i) => (
                                                <div key={i} className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[8px] font-black text-slate-100 shadow-sm overflow-hidden bg-slate-900">
                                                    {c[0]}
                                                </div>
                                            ))}
                                        </div>
                                        <span className="text-[10px] font-black text-primary uppercase tracking-tighter">Use Blueprint &rarr;</span>
                                    </div>
                                </div>
                            </div>

                            {creating === template.id && (
                                <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-20">
                                    <div className="flex flex-col items-center">
                                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
                                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest animate-pulse">Cloning Blueprint...</span>
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
                        <div key={resume._id} className="group bg-white rounded-2xl border border-slate-200 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 overflow-hidden">
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
