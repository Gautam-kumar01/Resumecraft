import { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import ResumePreview from '../components/ResumePreview';
import LoginModal from '../components/LoginModal';
import SEO from '../components/SEO';
import { Save, Download, Eye, ArrowLeft, Plus, Trash2, User, Upload } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const initialResumeState = {
    title: 'My Resume',
    personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        address: '',
        linkedin: '',
        github: '',
        website: '',
        profilePicture: ''
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    templateId: 'modern'
};

const Editor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [activeSection, setActiveSection] = useState('personal');
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [pendingAction, setPendingAction] = useState(null); // 'download' or 'save'
    
    const previewRef = useRef();

    // Load resume data
    useEffect(() => {
        const fetchResume = async () => {
            if (id) {
                // Editing existing resume from backend
                try {
                    const { data } = await api.get(`/resumes/${id}`);
                    setResume(data);
                } catch (error) {
                    console.error("Error fetching resume:", error);
                    navigate('/dashboard');
                } finally {
                    setLoading(false);
                }
            } else {
                // Guest mode or creating new
                const savedDraft = localStorage.getItem('guest_resume_draft');
                if (savedDraft) {
                    try {
                        setResume(JSON.parse(savedDraft));
                    } catch (e) {
                        setResume(initialResumeState);
                    }
                } else {
                    setResume(initialResumeState);
                }
                setLoading(false);
            }
        };

        fetchResume();
    }, [id, navigate]);

    // Auto-save to local storage for guests
    useEffect(() => {
        if (!id && resume) {
            localStorage.setItem('guest_resume_draft', JSON.stringify(resume));
        }
    }, [resume, id]);

    const handleSave = async () => {
        if (!user) {
            setPendingAction('save');
            setShowLoginModal(true);
            return;
        }

        setSaving(true);
        try {
            if (id) {
                await api.put(`/resumes/${id}`, resume);
            } else {
                const { data } = await api.post('/resumes', resume);
                // Clear draft and navigate to new ID
                localStorage.removeItem('guest_resume_draft');
                navigate(`/editor/${data._id}`, { replace: true });
            }
        } catch (error) {
            console.error("Error saving resume:", error);
        } finally {
            setSaving(false);
        }
    };

    const performDownload = async () => {
        const templateId = resume.templateId || 'modern';
        const elementId = `resume-preview-${templateId}`;
        const input = document.getElementById(elementId);
        
        if (!input) {
            console.error(`Resume preview element not found: #${elementId}`);
            alert("Could not find resume preview. Please refresh the page and try again.");
            return;
        }

        setDownloading(true);
        
        try {
            console.log("Starting local PDF generation...");
            
            // Create a temporary container for the clone
            const container = document.createElement('div');
            container.style.position = 'absolute';
            container.style.left = '-9999px';
            container.style.top = '0';
            container.style.width = '794px'; // A4 width at 96 DPI
            document.body.appendChild(container);

            const clone = input.cloneNode(true);
            // Remove the ID to avoid duplicates
            clone.removeAttribute('id');
            // Force styles on clone
            clone.style.width = '794px';
            clone.style.height = 'auto';
            clone.style.margin = '0';
            clone.style.padding = '40px';
            clone.style.display = 'block';
            clone.style.backgroundColor = 'white';
            
            container.appendChild(clone);

            // Wait for images and fonts to settle
            await new Promise(resolve => setTimeout(resolve, 1000));

            const canvas = await html2canvas(clone, { 
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                windowWidth: 794,
                onclone: (clonedDoc) => {
                     // Force fonts to be visible and fix overlapping
                     const style = clonedDoc.createElement('style');
                     style.innerHTML = `
                         * { 
                             -webkit-print-color-adjust: exact !important;
                             color-adjust: exact !important;
                             text-rendering: optimizeLegibility !important;
                         }
                         h1, h2, h3, h4, h5, h6, p, span, div {
                             letter-spacing: normal !important;
                             word-spacing: normal !important;
                         }
                         .tracking-widest { letter-spacing: 0.1em !important; }
                          .tracking-tight { letter-spacing: -0.01em !important; }
                          .tracking-tighter { letter-spacing: -0.02em !important; }
                          .tracking-\[0\.2em\] { letter-spacing: 0.2em !important; }
                          .tracking-\[0\.3em\] { letter-spacing: 0.3em !important; }
                          .tracking-\[0\.4em\] { letter-spacing: 0.4em !important; }
                         .whitespace-pre-wrap { white-space: pre-wrap !important; }
                          .grid { display: grid !important; }
                          .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
                          .col-span-2 { grid-column: span 2 / span 2 !important; }
                          .flex { display: flex !important; }
                          .flex-wrap { flex-wrap: wrap !important; }
                          .gap-2 { gap: 0.5rem !important; }
                          .gap-4 { gap: 1rem !important; }
                          .gap-6 { gap: 1.5rem !important; }
                          .gap-12 { gap: 3rem !important; }
                      `;
                     clonedDoc.head.appendChild(style);
                 }
            });

            document.body.removeChild(container);

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            // Calculate height to maintain aspect ratio
            const imgHeight = (canvas.height * pdfWidth) / canvas.width;
            
            // If the resume is longer than one page, we might need multiple pages
            // But for now, let's ensure it fits or scales
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight > pdfHeight ? pdfHeight : imgHeight);
            pdf.save(`${resume.title || 'resume'}.pdf`);
            
            console.log("Local PDF generated successfully.");
        } catch (fallbackErr) {
            console.error("Local PDF Error:", fallbackErr);
            alert(`Download failed: ${fallbackErr.message || "Unknown error"}. Please try a different browser.`);
        }
        
        setDownloading(false);
    };

    const handleDownload = async () => {
        if (!user) {
            setPendingAction('download');
            setShowLoginModal(true);
            return;
        }
        await performDownload();
    };

    const handleLoginSuccess = async () => {
        // User just logged in. 
        // 1. Save the guest resume to backend to create a record
        // 2. Perform the pending action (download or just save)
        
        setSaving(true);
        try {
            // Create the resume in backend
            const { data } = await api.post('/resumes', resume);
            
            // Clear local draft
            localStorage.removeItem('guest_resume_draft');
            
            // Update URL without page reload
            window.history.replaceState(null, '', `/editor/${data._id}`);
            
            // If pending action was download, do it now
            if (pendingAction === 'download') {
                await performDownload();
            }
            
            // Navigate to proper URL (this might cause re-render but that's fine)
             navigate(`/editor/${data._id}`, { replace: true });
             
        } catch (error) {
            console.error("Error syncing guest resume:", error);
            alert("Resume saved locally but failed to sync. Please try saving again.");
        } finally {
            setSaving(false);
            setPendingAction(null);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 1024 * 1024) { 
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

    const handleChange = (section, field, value) => {
        setResume(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

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
        <div className="flex flex-col md:flex-row md:h-[calc(100vh-64px)] h-auto overflow-y-auto md:overflow-hidden relative">
            <SEO 
                title={resume.title ? `${resume.title} - Editor` : "Resume Editor"} 
                description="Edit and customize your professional resume. Choose from multiple ATS-friendly templates."
            />
            <LoginModal 
                isOpen={showLoginModal} 
                onClose={() => setShowLoginModal(false)}
                onSuccess={handleLoginSuccess}
                title="🎉 Your resume is ready!"
                subtitle="Login or sign up to download and save your resume."
            />

            {/* Sidebar / Form Area */}
            <div className="w-full md:w-1/2 bg-white border-r border-slate-200 overflow-y-auto p-4 md:p-8 h-auto md:h-full order-2 md:order-1">
                <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <button onClick={() => navigate(user ? '/dashboard' : '/')} className="flex items-center text-slate-500 hover:text-slate-700">
                        <ArrowLeft className="h-4 w-4 mr-1" /> {user ? 'Dashboard' : 'Home'}
                    </button>
                    <div className="flex space-x-2 w-full md:w-auto">
                        <button onClick={handleSave} disabled={saving} className="flex-1 md:flex-none justify-center flex items-center px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50">
                            <Save className="h-4 w-4 mr-2" />
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                        <button
                            onClick={handleDownload}
                            disabled={downloading}
                            className="flex-1 md:flex-none justify-center flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
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
                <div className="flex space-x-2 overflow-x-auto pb-4 mb-6 border-b border-slate-100 no-scrollbar">
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
                                <button onClick={() => addItem('education', { school: '', degree: '', startDate: '', endDate: '', description: '' })} className="text-sm text-primary font-medium hover:underline flex items-center">
                                    <Plus className="h-4 w-4 mr-1" /> Add Education
                                </button>
                            </div>
                            {resume.education?.map((edu, index) => (
                                <div key={index} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3 relative group">
                                    <button onClick={() => removeItem('education', index)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                    <div className="grid grid-cols-2 gap-3">
                                        <input placeholder="School" value={edu.school} onChange={(e) => handleArrayChange('education', index, 'school', e.target.value)} className="px-3 py-2 border rounded-lg bg-white" />
                                        <input placeholder="Degree" value={edu.degree} onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)} className="px-3 py-2 border rounded-lg bg-white" />
                                        <input placeholder="Start Date" value={edu.startDate} onChange={(e) => handleArrayChange('education', index, 'startDate', e.target.value)} className="px-3 py-2 border rounded-lg bg-white" />
                                        <input placeholder="End Date" value={edu.endDate} onChange={(e) => handleArrayChange('education', index, 'endDate', e.target.value)} className="px-3 py-2 border rounded-lg bg-white" />
                                    </div>
                                    <textarea placeholder="Description" rows={3} value={edu.description} onChange={(e) => handleArrayChange('education', index, 'description', e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-white" />
                                </div>
                            ))}
                        </div>
                    )}

                    {activeSection === 'skills' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-slate-900">Skills</h3>
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <p className="text-sm text-slate-500 mb-2">Separate skills with commas</p>
                                <textarea
                                    rows={4}
                                    value={resume.skills?.join(', ') || ''}
                                    onChange={(e) => setResume({ ...resume, skills: e.target.value.split(',').map(s => s.trim()) })}
                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    placeholder="Java, Python, React, Team Leadership..."
                                />
                            </div>
                        </div>
                    )}

                    {activeSection === 'projects' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-bold text-slate-900">Projects</h3>
                                <button onClick={() => addItem('projects', { name: '', description: '', link: '' })} className="text-sm text-primary font-medium hover:underline flex items-center">
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
                                        <input placeholder="Link (Optional)" value={proj.link} onChange={(e) => handleArrayChange('projects', index, 'link', e.target.value)} className="px-3 py-2 border rounded-lg bg-white" />
                                    </div>
                                    <textarea placeholder="Description" rows={3} value={proj.description} onChange={(e) => handleArrayChange('projects', index, 'description', e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-white" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Preview Area */}
            <div className="w-full md:w-1/2 bg-slate-100 p-4 md:p-8 h-[50vh] md:h-full overflow-y-auto flex items-start justify-center order-1 md:order-2">
                <div id={`resume-preview-${resume.templateId || 'modern'}`} className="w-full max-w-[210mm] bg-white shadow-xl min-h-[297mm] origin-top transform scale-[0.6] sm:scale-[0.7] md:scale-[0.8] lg:scale-[0.9] xl:scale-100 transition-transform">
                    <ResumePreview resume={resume} />
                </div>
            </div>
        </div>
    );
};

export default Editor;
