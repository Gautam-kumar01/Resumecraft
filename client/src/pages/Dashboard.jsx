
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {starters.slice(0, 5).map((template) => (
                        <button
                            key={template.id}
                            onClick={() => useTemplate(template)}
                            className="group relative flex flex-col bg-white rounded-2xl border border-slate-200 hover:border-primary/50 transition-all text-left overflow-hidden hover:shadow-xl hover:-translate-y-1"
                        >
                            <div className="h-32 w-full relative">
                                <img src={template.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt={template.title} />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                                <div className="absolute bottom-3 left-3">
                                    <span className="text-[10px] font-black text-white px-2 py-1 bg-primary/80 rounded uppercase tracking-tighter">
                                        {template.industry}
                                    </span>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{template.title}</h3>
                                <p className="text-[10px] text-slate-500 mt-1">Hits: {template.targetCompanies.slice(0, 2).join(', ')}</p>
                            </div>
                            {creating === template.id && (
                                <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-20">
                                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
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
