import { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import ResumePreview from '../components/ResumePreview';
import LoginModal from '../components/LoginModal';
import SEO from '../components/SEO';
import { Save, Download, Eye, ArrowLeft, Plus, Trash2, User, Upload, Sparkles } from 'lucide-react';


const initialResumeState = {
    title: '',
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

    // AI State
    const [aiJobRole, setAiJobRole] = useState('');
    const [aiLoading, setAiLoading] = useState(false);
    const [aiSuggestions, setAiSuggestions] = useState(null);

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
        setDownloading(true);
        try {
            await document.fonts.ready;

            // Get the source resume content
            const sourceEl = document.querySelector('.resume-print-area');
            if (!sourceEl) throw new Error('Resume content not found');

            // A4 at 96 DPI = 794 x 1123 px
            const A4_W = 794;

            // ─── Build off-screen container ───────────────────────────────────────
            const offscreen = document.createElement('div');
            offscreen.style.cssText = [
                'position:fixed',
                'top:0',
                'left:-9999px',
                `width:${A4_W}px`,
                'background:#fff',
                'z-index:-9999',
                'transform:none',
                'overflow:visible',
            ].join(';');
            document.body.appendChild(offscreen);

            // Deep-clone the resume into the off-screen container
            const clone = sourceEl.cloneNode(true);
            // Strip any scale transforms from the clone and all its children
            [clone, ...clone.querySelectorAll('*')].forEach(el => {
                el.style.transform = 'none';
                el.style.transition = 'none';
                el.style.animation = 'none';
                
                // Fix for overlapping text in html2canvas: 
                // Sometimes it miscalculates letter-spacing or word-spacing
                if (window.getComputedStyle(el).letterSpacing !== 'normal') {
                    el.style.letterSpacing = 'normal';
                }
                
                // html2canvas struggles with text-justify
                if (window.getComputedStyle(el).textAlign === 'justify') {
                    el.style.textAlign = 'left';
                }
            });
            clone.style.width = `${A4_W}px`;
            clone.style.minHeight = 'auto';
            clone.style.boxShadow = 'none';
            clone.style.margin = '0';
            clone.style.padding = '0';
            offscreen.appendChild(clone);

            // Wait for images and fonts to definitely load
            await document.fonts.ready;
            await new Promise(r => setTimeout(r, 1200));

            // ─── Capture with html2canvas ──────────────────────────────────────────
            const canvas = await html2canvas(offscreen, {
                scale: 4, // Even higher resolution
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false,
                width: A4_W,
                height: offscreen.scrollHeight,
                windowWidth: 1400, // Force a desktop-like viewport width for style calculations
                scrollX: 0,
                scrollY: 0,
                imageTimeout: 30000,
                onclone: (clonedDoc) => {
                    // Force a deep reset of all text-related styles that cause overlapping
                    const all = clonedDoc.getElementsByTagName('*');
                    for (let i = 0; i < all.length; i++) {
                        const el = all[i];
                        
                        // Disable advanced typography features that canvas renderers often fail at
                        el.style.fontVariantLigatures = 'none';
                        el.style.fontKerning = 'none';
                        el.style.textRendering = 'optimizeLegibility'; 
                        el.style.WebkitFontSmoothing = 'antialiased';
                        
                        // Reduced to prevent excessive text expansion that causes extra pages
                        el.style.letterSpacing = 'normal'; 
                        el.style.wordSpacing = 'normal';
                        el.style.fontFeatureSettings = '"kern" 0, "liga" 0, "clig" 0, "calt" 0';
                        
                        // Ensure text-justify is off as it's a major cause of character drift
                        if (el.style.textAlign === 'justify' || window.getComputedStyle(el).textAlign === 'justify') {
                            el.style.textAlign = 'left';
                        }

                        // Maintain consistent line height for all text containers - but not too big
                        if (['P', 'LI', 'SPAN', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(el.tagName)) {
                            el.style.lineHeight = '1.4'; 
                        }

                        // Force standard font sizes if they were shrunk by mobile CSS
                        if (el.classList.contains('text-xs')) el.style.fontSize = '13px';
                        if (el.classList.contains('text-sm')) el.style.fontSize = '15px';
                        if (el.classList.contains('text-base')) el.style.fontSize = '17px';
                        if (el.classList.contains('text-lg')) el.style.fontSize = '19px';
                        if (el.classList.contains('text-xl')) el.style.fontSize = '22px';
                        if (el.classList.contains('text-2xl')) el.style.fontSize = '26px';
                        if (el.classList.contains('text-3xl')) el.style.fontSize = '32px';
                        if (el.classList.contains('text-4xl')) el.style.fontSize = '40px';
                        if (el.classList.contains('text-5xl')) el.style.fontSize = '50px';
                    }
                }
            });

            // Cleanup off-screen node
            document.body.removeChild(offscreen);

            // ─── Build PDF ────────────────────────────────────────────────────────
            const imgData = canvas.toDataURL('image/jpeg', 0.98);
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

            const pageW = pdf.internal.pageSize.getWidth();   // 210 mm
            const pageH = pdf.internal.pageSize.getHeight();  // 297 mm
            let imgH  = (canvas.height / canvas.width) * pageW;

            // Fit to single page if it's close enough (up to 1.3 pages)
            // This satisfies the user's request "adjust in single page"
            if (imgH > pageH && imgH < pageH * 1.3) {
                pdf.addImage(imgData, 'JPEG', 0, 0, pageW, pageH, '', 'FAST');
            } else {
                // If it's way too long, use multiple pages
                let remaining = imgH;
                let yOffset   = 0;
                while (remaining > 0) {
                    if (yOffset > 0) pdf.addPage();
                    pdf.addImage(imgData, 'JPEG', 0, -yOffset, pageW, imgH, '', 'FAST');
                    yOffset   += pageH;
                    remaining -= pageH;
                }
            }

            pdf.save(`${resume.title || 'Resume'}.pdf`);
            setDownloading(false);
        } catch (err) {
            console.error('PDF Export Error:', err);
            alert(`Download failed: ${err.message}`);
            setDownloading(false);
        }
    };

    const handleDownload = async () => {
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

    const handleAIGenerate = async () => {
        if (!aiJobRole.trim()) return alert("Please enter a job role");

        setAiLoading(true);
        try {
            console.log("Requesting AI suggestions for:", aiJobRole);
            const { data } = await api.post('/ai/suggest', { jobRole: aiJobRole });
            console.log("AI Suggestions received:", data);
            setAiSuggestions(data);
        } catch (error) {
            console.error("AI Error Full Object:", error);
            const message = error.response?.data?.message || error.message || "Failed to generate suggestions";
            const details = error.response?.data?.error || "";
            alert(`${message}${details ? `: ${details}` : ""}. Please check if your server is running and your API key is valid.`);
        } finally {
            setAiLoading(false);
        }
    };

    const applySuggestion = (type, data) => {
        if (type === 'summary') {
            setResume(prev => ({ ...prev, summary: data }));
        } else if (type === 'skills') {
            setResume(prev => ({ ...prev, skills: [...(prev.skills || []), ...data] }));
        } else if (type === 'experience') {
            // Add as a new experience entry draft
            addItem('experience', {
                company: 'Sample Company',
                position: aiJobRole,
                startDate: '202X',
                endDate: 'Present',
                description: data.map(b => `• ${b}`).join('\n')
            });
        }
        alert("Applied to resume!");
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
                            className="flex-1 md:flex-none justify-center flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
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
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                    />
                </div>

                {/* Section Tabs */}
                <div className="flex space-x-2 overflow-x-auto pb-4 mb-6 border-b border-slate-100 no-scrollbar">
                    {['ai', 'personal', 'summary', 'experience', 'education', 'skills', 'projects', 'templates'].map(sec => (
                        <button
                            key={sec}
                            onClick={() => setActiveSection(sec)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap capitalize flex items-center ${activeSection === sec
                                ? 'bg-orange-100 text-orange-600'
                                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            {sec === 'ai' && <Sparkles className="h-3 w-3 mr-1" />}
                            {sec === 'ai' ? 'AI Assistant' : sec}
                        </button>
                    ))}
                </div>

                {/* Forms */}
                <div className="space-y-6">
                    {activeSection === 'ai' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-gradient-to-r from-orange-500 to-orange-700 rounded-2xl p-6 text-white shadow-lg">
                                <h3 className="text-xl font-bold mb-2 flex items-center">
                                    <Sparkles className="h-5 w-5 mr-2" /> AI Resume Assistant
                                </h3>
                                <p className="text-orange-50 text-sm mb-6">
                                    Enter your target job role, and our AI will generate professional summaries, skills, and bullet points for you.
                                </p>

                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        placeholder="e.g. Full Stack Developer, Accountant"
                                        value={aiJobRole}
                                        onChange={(e) => setAiJobRole(e.target.value)}
                                        className="flex-1 px-4 py-3 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-white/50"
                                        onKeyDown={(e) => e.key === 'Enter' && handleAIGenerate()}
                                    />
                                    <button
                                        onClick={handleAIGenerate}
                                        disabled={aiLoading}
                                        className="bg-white text-orange-600 px-6 py-3 rounded-xl font-bold hover:bg-orange-50 disabled:opacity-50 transition-colors"
                                    >
                                        {aiLoading ? 'Thinking...' : 'Generate'}
                                    </button>
                                </div>
                            </div>

                            {aiSuggestions && (
                                <div className="space-y-6">
                                    {/* Summary Suggestion */}
                                    <div className="p-5 border border-slate-200 rounded-xl bg-slate-50">
                                        <div className="flex justify-between items-start mb-3">
                                            <h4 className="font-bold text-slate-800">Suggested Summary</h4>
                                            <button onClick={() => applySuggestion('summary', aiSuggestions.summary)} className="text-xs bg-slate-900 text-white px-3 py-1 rounded-full hover:bg-slate-700">Apply</button>
                                        </div>
                                        <p className="text-sm text-slate-600 leading-relaxed">{aiSuggestions.summary}</p>
                                    </div>

                                    {/* Skills Suggestion */}
                                    <div className="p-5 border border-slate-200 rounded-xl bg-slate-50">
                                        <div className="flex justify-between items-start mb-3">
                                            <h4 className="font-bold text-slate-800">Suggested Skills</h4>
                                            <button onClick={() => applySuggestion('skills', aiSuggestions.skills)} className="text-xs bg-slate-900 text-white px-3 py-1 rounded-full hover:bg-slate-700">Add All</button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {aiSuggestions.skills.map((skill, i) => (
                                                <span key={i} className="px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-600">{skill}</span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Graphic Bullet Points */}
                                    <div className="p-5 border border-slate-200 rounded-xl bg-slate-50">
                                        <div className="flex justify-between items-start mb-3">
                                            <h4 className="font-bold text-slate-800">Sample Accomplishments</h4>
                                            <button onClick={() => applySuggestion('experience', aiSuggestions.bullets)} className="text-xs bg-slate-900 text-white px-3 py-1 rounded-full hover:bg-slate-700">Add as Experience</button>
                                        </div>
                                        <ul className="list-disc pl-5 space-y-2">
                                            {aiSuggestions.bullets.map((bullet, i) => (
                                                <li key={i} className="text-sm text-slate-600">{bullet}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {activeSection === 'templates' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-slate-900">Choose Resume Template</h3>
                            <div className="grid grid-cols-1 gap-4">
                                {[
                                    { id: 'modern', name: 'Professional Modern', desc: 'Sleek two-column layout with a clean header.' },
                                    { id: 'visual', name: 'High-Impact Visual', desc: 'Eye-catching design with progress bars and bold sidebar.' },
                                    { id: 'elegant', name: 'Classic Elegant', desc: 'Minimalist single-column serif design for senior roles.' },
                                    { id: 'government', name: 'Government Standard', desc: 'Strict, formal, and authoritative format for public sector jobs.' },
                                    { id: 'internship', name: 'Internship Ready', desc: 'Clean layout emphasizing education and skills for students.' }
                                ].map(tpl => (
                                    <button
                                        key={tpl.id}
                                        onClick={() => setResume({ ...resume, templateId: tpl.id })}
                                        className={`p-6 rounded-2xl border-2 text-left transition-all ${resume.templateId === tpl.id
                                            ? 'border-orange-500 bg-orange-50 ring-4 ring-orange-100'
                                            : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                                            }`}
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-bold text-slate-900">{tpl.name}</span>
                                            {resume.templateId === tpl.id && (
                                                <div className="bg-orange-500 text-white p-1 rounded-full"><Eye className="h-3 w-3" /></div>
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
                                    <label className="absolute bottom-0 right-0 p-1.5 bg-orange-500 text-white rounded-full cursor-pointer hover:bg-orange-600 transition-colors shadow-lg">
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
                                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                                placeholder="Write a compelling summary about yourself..."
                            />
                        </div>
                    )}

                    {activeSection === 'experience' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-bold text-slate-900">Work Experience</h3>
                                <button onClick={() => addItem('experience', { company: '', position: '', startDate: '', endDate: '', description: '' })} className="text-sm text-orange-600 font-medium hover:underline flex items-center">
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
                                <button onClick={() => addItem('education', { school: '', degree: '', startDate: '', endDate: '', description: '' })} className="text-sm text-orange-600 font-medium hover:underline flex items-center">
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
                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500 outline-none"
                                    placeholder="Java, Python, React, Team Leadership..."
                                />
                            </div>
                        </div>
                    )}

                    {activeSection === 'projects' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-bold text-slate-900">Projects</h3>
                                <button onClick={() => addItem('projects', { name: '', description: '', link: '' })} className="text-sm text-orange-600 font-medium hover:underline flex items-center">
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
                <div id={`resume-preview-${resume.templateId || 'modern'}`} className="resume-print-area w-full max-w-[210mm] bg-white shadow-xl min-h-[297mm] origin-top transform scale-[0.6] sm:scale-[0.7] md:scale-[0.8] lg:scale-[0.9] xl:scale-100 transition-transform">
                    <ResumePreview resume={resume} />
                </div>
            </div>
        </div>
    );
};

export default Editor;
