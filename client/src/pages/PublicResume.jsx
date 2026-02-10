
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import ResumePreview from '../components/ResumePreview';

const PublicResume = () => {
    const { id } = useParams();
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchResume = async () => {
            try {
                // If the route is specifically public, we might need a different API endpoint that doesn't check auth
                // But for now, we recycled the getResumeById which checks Auth if it's protected?
                // Wait, getResumeById checks if user is owner.
                // We need a strictly public endpoint.
                const { data } = await api.get(`/resumes/public/${id}`);
                setResume(data);
            } catch (error) {
                console.error("Error fetching public resume:", error);
                setError("Resume not found or is private.");
            } finally {
                setLoading(false);
            }
        };

        fetchResume();
    }, [id]);

    if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

    if (error) return (
        <div className="flex h-screen items-center justify-center flex-col">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Oops!</h1>
            <p className="text-slate-600">{error}</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-100 py-10 flex flex-col items-center overflow-x-auto">
            <div className="w-[210mm] shrink-0 bg-white shadow-lg mx-auto">
                <ResumePreview resume={resume} />
                <div className="text-center py-8 text-slate-500 text-sm bg-slate-100">
                    Created with <a href="/" className="text-primary font-bold">ResumeCraft</a>
                </div>
            </div>
        </div>
    );
};

export default PublicResume;
