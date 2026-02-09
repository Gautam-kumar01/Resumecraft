
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import ResumePreview from '../components/ResumePreview';
import { Save, Download, Eye, ArrowLeft, Plus, Trash2, User, Upload } from 'lucide-react';
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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 1024 * 1024) { // 1MB limit for Base64 storage
                alert("File size too large. Please select an image under 1MB.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                handleChange('personalInfo', 'profilePicture', reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDownload = async () => {
        const templateId = resume.templateId || 'modern';
        const elementId = `resume-preview-${templateId}`;
        const input = document.getElementById(elementId);
        
        if (!input) {
            console.error(`Resume preview element not found: #${elementId}`);
            alert("Could not find resume preview. Please refresh the page and try again.");
            return;
        }

        setDownloading(true);
        
        // Direct local generation (Backend PDF generation is disabled on Vercel)
        try {
            console.log("Starting local PDF generation...");
            
            // Clone the element to isolate it from page scaling/layout issues
            const clone = input.cloneNode(true);
            
            // Create a container for the clone that mimics A4 dimensions
            const container = document.createElement('div');
            container.style.position = 'fixed';
            container.style.top = '0'; // Changed from -10000px to avoid viewport issues
            container.style.left = '0';
            container.style.width = '210mm'; // Exact A4 width
            container.style.zIndex = '-9999'; // Behind everything
            container.style.background = 'white';
            // Remove any transform scaling that might be on parent elements
            container.style.transform = 'none';
            
            container.appendChild(clone);
            document.body.appendChild(container);

            // Wait a moment for images to settle in the clone
            await new Promise(resolve => setTimeout(resolve, 800));

            const canvas = await html2canvas(clone, { 
                scale: 2, // High quality
                useCORS: true, // Allow cross-origin images
                logging: false,
                backgroundColor: '#ffffff',
                windowWidth: container.scrollWidth,
                windowHeight: container.scrollHeight,
                scrollX: 0,
                scrollY: 0,
                x: 0,
                y: 0
            });

            // Cleanup clone
            document.body.removeChild(container);

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${resume.title || 'resume'}.pdf`);
            
            console.log("Local PDF generated successfully.");
        } catch (fallbackErr) {
            console.error("Local PDF Error:", fallbackErr);
            alert(`Download failed: ${fallbackErr.message || "Unknown error"}. Please try a different browser.`);
        }
        
        setDownloading(false);
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
                    {['personal', 'summary', 'experience', 'education', 'skills', 'projects', 'templates'].map(sec => (
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
                    {activeSection === 'templates' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-slate-900">Choose Resume Template</h3>
                            <div className="grid grid-cols-1 gap-4">
                                {[
                                    { id: 'modern', name: 'Professional Modern', desc: 'Sleek two-column layout with a clean header.' },
                                    { id: 'visual', name: 'High-Impact Visual', desc: 'Eye-catching design with progress bars and bold sidebar.' },
                                    { id: 'elegant', name: 'Classic Elegant', desc: 'Minimalist single-column serif design for senior roles.' }
                                ].map(tpl => (
                                    <button
                                        key={tpl.id}
                                        onClick={() => setResume({ ...resume, templateId: tpl.id })}
                                        className={`p-6 rounded-2xl border-2 text-left transition-all ${resume.templateId === tpl.id
                                            ? 'border-primary bg-primary/5 ring-4 ring-primary/5'
                                            : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                                            }`}
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-bold text-slate-900">{tpl.name}</span>
                                            {resume.templateId === tpl.id && (
                                                <div className="bg-primary text-white p-1 rounded-full"><Eye className="h-3 w-3" /></div>
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-500">{tpl.desc}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    {activeSection === 'personal' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-slate-900">Personal Information</h3>

                            {/* Photo Upload */}
                            <div className="flex items-center space-x-6">
                                <div className="relative group shrink-0">
                                    <div className="w-24 h-24 rounded-full border-2 border-slate-100 bg-slate-50 flex items-center justify-center overflow-hidden">
                                        {resume.personalInfo?.profilePicture ? (
                                            <img src={resume.personalInfo.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="h-10 w-10 text-slate-300" />
                                        )}
                                    </div>
                                    <label className="absolute bottom-0 right-0 p-1.5 bg-primary text-white rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-lg">
                                        <Upload className="h-3.5 w-3.5" />
                                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                    </label>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-semibold text-slate-900">Profile Photo</p>
                                    <p className="text-xs text-slate-500">Upload a professional headshot. Max 1MB.</p>
                                    {resume.personalInfo?.profilePicture && (
                                        <button
                                            onClick={() => handleChange('personalInfo', 'profilePicture', null)}
                                            className="text-xs text-red-500 font-medium hover:underline"
                                        >
                                            Remove photo
                                        </button>
                                    )}
                                </div>
                            </div>

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
