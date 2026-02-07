
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import ResumePreview from '../components/ResumePreview';
import { Save, Download, Eye, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const Editor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [activeSection, setActiveSection] = useState('personal');
    const previewRef = useRef();

    useEffect(() => {
        const fetchResume = async () => {
            if (!id) return;
            try {
                const { data } = await api.get(`/resumes/${id}`);
                setResume(data);
            } catch (error) {
                console.error("Error fetching resume:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchResume();
    }, [id]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.put(`/resumes/${id}`, resume);
        } catch (error) {
            console.error("Error saving resume:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleDownload = async () => {
        const input = document.getElementById('resume-preview');
        if (!input) {
            console.error("Resume preview element not found!");
            return;
        }

        setDownloading(true);
        try {
            // Reset scroll to capture full element
            window.scrollTo(0, 0);

            const canvas = await html2canvas(input, {
                scale: 2, // Safe scale for memory
                useCORS: true,
                allowTaint: true,
                scrollX: 0,
                scrollY: 0,
                windowWidth: document.documentElement.offsetWidth,
                windowHeight: document.documentElement.offsetHeight,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png', 1.0);
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            // Calculate height to maintain aspect ratio
            const imgProps = pdf.getImageProperties(imgData);
            const contentHeight = (imgProps.height * pdfWidth) / imgProps.width;

            // If the content is longer than one page, we might need multiple pages
            // But for simple resume, let's just fit to width
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, contentHeight);
            pdf.save(`${resume.title || 'resume'}.pdf`);

        } catch (err) {
            console.error("Critical download error:", err);
            alert("Error: " + err.message);
        } finally {
            setDownloading(false);
        }
    };

    const handleChange = (section, field, value) => {
        setResume(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    // Helper to update arrays
    const handleArrayChange = (section, index, field, value) => {
        const newArray = [...resume[section]];
        newArray[index] = { ...newArray[index], [field]: value };
        setResume(prev => ({ ...prev, [section]: newArray }));
    };

    const addItem = (section, initialData) => {
        setResume(prev => ({
            ...prev,
            [section]: [...(prev[section] || []), initialData]

        }));
    };

    const removeItem = (section, index) => {
        const newArray = [...resume[section]];
        newArray.splice(index, 1);
        setResume(prev => ({ ...prev, [section]: newArray }));
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;
    if (!resume) return <div className="p-10 text-center">Resume not found</div>;

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden">
            {/* Sidebar / Form Area */}
            <div className="w-1/2 bg-white border-r border-slate-200 overflow-y-auto p-8">
                <div className="mb-6 flex items-center justify-between">
                    <button onClick={() => navigate('/dashboard')} className="flex items-center text-slate-500 hover:text-slate-700">
                        <ArrowLeft className="h-4 w-4 mr-1" /> Back
                    </button>
                    <div className="flex space-x-2">
                        <button onClick={handleSave} disabled={saving} className="flex items-center px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50">
                            <Save className="h-4 w-4 mr-2" />
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                        <button
                            onClick={handleDownload}
                            disabled={downloading}
                            className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            <Download className={`h-4 w-4 mr-2 ${downloading ? 'animate-bounce' : ''}`} />
                            {downloading ? 'Generating...' : 'Download PDF'}
                        </button>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Resume Title</label>
                    <input
                        type="text"
                        value={resume.title}
                        onChange={(e) => setResume({ ...resume, title: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                </div>

                {/* Section Tabs */}
                <div className="flex space-x-2 overflow-x-auto pb-4 mb-6 border-b border-slate-100">
                    {['personal', 'summary', 'experience', 'education', 'skills', 'projects'].map(sec => (
                        <button
                            key={sec}
                            onClick={() => setActiveSection(sec)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap capitalize ${activeSection === sec
                                ? 'bg-primary/10 text-primary'
                                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            {sec}
                        </button>
                    ))}
                </div>

                {/* Forms */}
                <div className="space-y-6">
                    {activeSection === 'personal' && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-slate-900">Personal Information</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    placeholder="Full Name"
                                    value={resume.personalInfo?.fullName || ''}
                                    onChange={(e) => handleChange('personalInfo', 'fullName', e.target.value)}
                                    className="col-span-2 px-4 py-2 border rounded-lg w-full"
                                />
                                <input
                                    placeholder="Email"
                                    value={resume.personalInfo?.email || ''}
                                    onChange={(e) => handleChange('personalInfo', 'email', e.target.value)}
                                    className="px-4 py-2 border rounded-lg w-full"
                                />
                                <input
                                    placeholder="Phone"
                                    value={resume.personalInfo?.phone || ''}
                                    onChange={(e) => handleChange('personalInfo', 'phone', e.target.value)}
                                    className="px-4 py-2 border rounded-lg w-full"
                                />
                                <input
                                    placeholder="Address"
                                    value={resume.personalInfo?.address || ''}
                                    onChange={(e) => handleChange('personalInfo', 'address', e.target.value)}
                                    className="col-span-2 px-4 py-2 border rounded-lg w-full"
                                />
                                <input
                                    placeholder="LinkedIn URL"
                                    value={resume.personalInfo?.linkedin || ''}
                                    onChange={(e) => handleChange('personalInfo', 'linkedin', e.target.value)}
                                    className="px-4 py-2 border rounded-lg w-full"
                                />
                                <input
                                    placeholder="GitHub URL"
                                    value={resume.personalInfo?.github || ''}
                                    onChange={(e) => handleChange('personalInfo', 'github', e.target.value)}
                                    className="px-4 py-2 border rounded-lg w-full"
                                />
                                <input
                                    placeholder="Portfolio Website"
                                    value={resume.personalInfo?.website || ''}
                                    onChange={(e) => handleChange('personalInfo', 'website', e.target.value)}
                                    className="col-span-2 px-4 py-2 border rounded-lg w-full"
                                />
                            </div>
                        </div>
                    )}

                    {activeSection === 'summary' && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-slate-900">Professional Summary</h3>
                            <textarea
                                rows={6}
                                value={resume.summary || ''}
                                onChange={(e) => setResume({ ...resume, summary: e.target.value })}
                                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                placeholder="Write a compelling summary about yourself..."
                            />
                        </div>
                    )}

                    {activeSection === 'experience' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-bold text-slate-900">Work Experience</h3>
                                <button onClick={() => addItem('experience', { company: '', position: '', startDate: '', endDate: '', description: '' })} className="text-sm text-primary font-medium hover:underline flex items-center">
                                    <Plus className="h-4 w-4 mr-1" /> Add Position
                                </button>
                            </div>
                            {resume.experience?.map((exp, index) => (
                                <div key={index} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3 relative group">
                                    <button onClick={() => removeItem('experience', index)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                    <div className="grid grid-cols-2 gap-3">
                                        <input placeholder="Company" value={exp.company} onChange={(e) => handleArrayChange('experience', index, 'company', e.target.value)} className="px-3 py-2 border rounded-lg bg-white" />
                                        <input placeholder="Position" value={exp.position} onChange={(e) => handleArrayChange('experience', index, 'position', e.target.value)} className="px-3 py-2 border rounded-lg bg-white" />
                                        <input placeholder="Start Date" value={exp.startDate} onChange={(e) => handleArrayChange('experience', index, 'startDate', e.target.value)} className="px-3 py-2 border rounded-lg bg-white" />
                                        <input placeholder="End Date" value={exp.endDate} onChange={(e) => handleArrayChange('experience', index, 'endDate', e.target.value)} className="px-3 py-2 border rounded-lg bg-white" />
                                    </div>
                                    <textarea placeholder="Description" rows={3} value={exp.description} onChange={(e) => handleArrayChange('experience', index, 'description', e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-white" />
                                </div>
                            ))}
                        </div>
                    )}

                    {activeSection === 'education' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-bold text-slate-900">Education</h3>
                                <button onClick={() => addItem('education', { institution: '', degree: '', startDate: '', endDate: '', description: '' })} className="text-sm text-primary font-medium hover:underline flex items-center">
                                    <Plus className="h-4 w-4 mr-1" /> Add Education
                                </button>
                            </div>
                            {resume.education?.map((edu, index) => (
                                <div key={index} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3 relative group">
                                    <button onClick={() => removeItem('education', index)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                    <div className="grid grid-cols-2 gap-3">
                                        <input placeholder="Institution" value={edu.institution} onChange={(e) => handleArrayChange('education', index, 'institution', e.target.value)} className="px-3 py-2 border rounded-lg bg-white" />
                                        <input placeholder="Degree" value={edu.degree} onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)} className="px-3 py-2 border rounded-lg bg-white" />
                                        <input placeholder="Start Date" value={edu.startDate} onChange={(e) => handleArrayChange('education', index, 'startDate', e.target.value)} className="px-3 py-2 border rounded-lg bg-white" />
                                        <input placeholder="End Date" value={edu.endDate} onChange={(e) => handleArrayChange('education', index, 'endDate', e.target.value)} className="px-3 py-2 border rounded-lg bg-white" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeSection === 'skills' && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-slate-900">Skills</h3>
                            <p className="text-sm text-slate-500">Separate skills with commas</p>
                            <textarea
                                rows={4}
                                value={resume.skills?.join(', ') || ''}
                                onChange={(e) => setResume({ ...resume, skills: e.target.value.split(',').map(s => s.trim()) })}
                                className="w-full px-4 py-3 border rounded-lg outline-none"
                                placeholder="React, Node.js, Python, Design..."
                            />
                        </div>
                    )}

                    {activeSection === 'projects' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-bold text-slate-900">Projects</h3>
                                <button onClick={() => addItem('projects', { name: '', description: '', link: '', technologies: [] })} className="text-sm text-primary font-medium hover:underline flex items-center">
                                    <Plus className="h-4 w-4 mr-1" /> Add Project
                                </button>
                            </div>
                            {resume.projects?.map((proj, index) => (
                                <div key={index} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3 relative group">
                                    <button onClick={() => removeItem('projects', index)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                    <div className="grid grid-cols-2 gap-3">
                                        <input placeholder="Project Name" value={proj.name} onChange={(e) => handleArrayChange('projects', index, 'name', e.target.value)} className="px-3 py-2 border rounded-lg bg-white" />
                                        <input placeholder="Link" value={proj.link} onChange={(e) => handleArrayChange('projects', index, 'link', e.target.value)} className="px-3 py-2 border rounded-lg bg-white" />
                                    </div>
                                    <textarea placeholder="Description" rows={3} value={proj.description} onChange={(e) => handleArrayChange('projects', index, 'description', e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-white" />
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="pt-6 border-t border-slate-100">
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={resume.isPublic}
                                onChange={(e) => setResume({ ...resume, isPublic: e.target.checked })}
                                className="form-checkbox h-5 w-5 text-primary rounded"
                            />
                            <div>
                                <span className="text-slate-900 font-medium">Make Public</span>
                                <p className="text-xs text-slate-500">Allow anyone with the link to view this resume</p>
                            </div>
                        </label>
                        {resume.isPublic && (
                            <div className="mt-2 bg-blue-50 text-blue-800 text-xs p-2 rounded flex items-center justify-between">
                                <span className="truncate">{window.location.origin}/p/{resume._id}</span>
                                <a href={`/p/${resume._id}`} target="_blank" className="font-bold underline ml-2">Open</a>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* Preview Area */}
            <div className="w-1/2 bg-slate-100 overflow-y-auto p-12 flex justify-center">
                <div className="origin-top scale-[0.8] w-[210mm]">
                    <ResumePreview resume={resume} />
                </div>
            </div>
        </div>
    );
};

export default Editor;
