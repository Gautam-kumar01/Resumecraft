
import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import { Plus, FileText, Trash2, Edit, ExternalLink, Download } from 'lucide-react';

const Dashboard = () => {
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchResumes = async () => {
            try {
                const { data } = await api.get('/resumes');
                setResumes(data);
            } catch (error) {
                console.error('Failed to fetch resumes', error);
            } finally {
                setLoading(false);
            }
        };

        fetchResumes();
    }, []);

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
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">My Resumes</h1>
                    <p className="mt-1 text-slate-500">Manage your resumes and portfolios.</p>
                </div>
                <button
                    onClick={createResume}
                    className="flex items-center space-x-2 bg-primary hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-medium transition-all shadow-lg shadow-blue-500/30"
                >
                    <Plus className="h-5 w-5" />
                    <span>Create New</span>
                </button>
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
