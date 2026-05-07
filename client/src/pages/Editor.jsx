import { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import ResumePreview from '../components/ResumePreview';
import LoginModal from '../components/LoginModal';
import SEO from '../components/SEO';
import { Save, Download, Eye, ArrowLeft, Plus, Trash2, User, Upload, Sparkles, FileText, Smartphone, Briefcase, GraduationCap, Code, Folder, Layout } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


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
    const [isMobilePreview, setIsMobilePreview] = useState(false);

    // AI State
    const [aiJobRole, setAiJobRole] = useState('');
    const [aiLoading, setAiLoading] = useState(false);
    const [aiSuggestions, setAiSuggestions] = useState(null);

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
        const newArray = [...(resume[section] || [])];
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
        const newArray = [...(resume[section] || [])];
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
        <motion.div 
            initial={{ opacity: 0, rotateY: 15, perspective: 1200 }}
            animate={{ opacity: 1, rotateY: 0 }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            className="flex flex-col md:flex-row md:h-[calc(100vh-64px)] h-screen overflow-hidden relative bg-slate-50 font-sans"
        >
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

            {/* Main Content Area */}
            <div className="flex-1 flex flex-row h-full overflow-hidden relative">

                {/* Form Area - Now on the left with horizontal tabs */}
                <div className={`md:w-1/2 bg-white border-r border-slate-200 h-full flex flex-col transition-all duration-300 ${isMobilePreview ? 'hidden md:flex' : 'flex-1'}`}>
                    
                    {/* Header with Navigation */}
                    <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 p-3 md:p-4 flex items-center justify-between">
                        <button 
                            onClick={() => navigate(user ? '/dashboard' : '/')} 
                            className="flex items-center text-slate-500 hover:text-slate-900 transition-colors font-medium text-sm group"
                        >
                            <ArrowLeft className="h-4 w-4 mr-1.5" /> 
                            {user ? 'Dashboard' : 'Home'}
                        </button>
                        
                        <div className="flex items-center space-x-2">
                            <button onClick={handleSave} disabled={saving} className="flex items-center px-3 py-1.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all text-xs font-bold shadow-sm">
                                <Save className="h-3 w-3 mr-1.5" />
                                {saving ? '...' : 'Save'}
                            </button>
                            <button onClick={handleDownload} disabled={downloading} className="flex items-center px-3 py-1.5 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all text-xs font-bold shadow-lg shadow-orange-200">
                                <Download className="h-3 w-3 mr-1.5" />
                                {downloading ? '...' : 'PDF'}
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        <div className="p-4 md:p-8 pt-6 max-w-2xl mx-auto w-full space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Resume Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g. My Modern Resume"
                                    value={resume.title}
                                    onChange={(e) => setResume({ ...resume, title: e.target.value })}
                                    className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-orange-500 rounded-2xl outline-none transition-all font-bold text-slate-800"
                                />
                            </div>

                            {/* Section Navigation - Back to Horizontal Tabs for better mobile layout */}
                            <div className="sticky top-[-1px] z-10 py-2 -mx-4 px-4 bg-white/95 backdrop-blur-sm">
                                <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
                                    {[
                                        { id: 'ai', icon: <Sparkles className="h-3.5 w-3.5 mr-1.5" />, label: 'AI' },
                                        { id: 'personal', icon: <User className="h-3.5 w-3.5 mr-1.5" />, label: 'Personal' },
                                        { id: 'summary', icon: <FileText className="h-3.5 w-3.5 mr-1.5" />, label: 'Summary' },
                                        { id: 'experience', icon: <Briefcase className="h-3.5 w-3.5 mr-1.5" />, label: 'Jobs' },
                                        { id: 'education', icon: <GraduationCap className="h-3.5 w-3.5 mr-1.5" />, label: 'Edu' },
                                        { id: 'skills', icon: <Code className="h-3.5 w-3.5 mr-1.5" />, label: 'Skills' },
                                        { id: 'projects', icon: <Folder className="h-3.5 w-3.5 mr-1.5" />, label: 'Projects' },
                                        { id: 'templates', icon: <Layout className="h-3.5 w-3.5 mr-1.5" />, label: 'Design' }
                                    ].map(sec => (
                                        <button
                                            key={sec.id}
                                            onClick={() => setActiveSection(sec.id)}
                                            className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap flex items-center transition-all ${activeSection === sec.id
                                                ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
                                                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                                                }`}
                                        >
                                            {sec.icon}
                                            {sec.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Animated Form Sections */}
                            <div className="pb-24 md:pb-8">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeSection}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="space-y-8"
                                    >
                                    {activeSection === 'ai' && (
                                        <div className="space-y-6">
                                            <div className="glass-effect bg-gradient-to-br from-orange-500/20 via-rose-500/10 to-white rounded-3xl p-8 text-slate-800 shadow-xl relative overflow-hidden group border-2 border-orange-100/50">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                                                <div className="relative z-10">
                                                    <div className="flex items-center space-x-2 mb-4">
                                                        <div className="bg-orange-500 p-2 rounded-xl shadow-lg shadow-orange-200">
                                                            <Sparkles className="h-5 w-5 text-white" />
                                                        </div>
                                                        <h3 className="text-xl font-black text-slate-900">AI Career Coach</h3>
                                                    </div>
                                                    <p className="text-slate-600 text-sm mb-8 leading-relaxed font-medium">
                                                        Describe your target role, and our advanced AI will craft a high-impact professional summary and targeted experience for you.
                                                    </p>
                                                    <div className="flex flex-col space-y-3">
                                                        <input
                                                            type="text"
                                                            placeholder="Target Role (e.g. Senior Product Designer)"
                                                            value={aiJobRole}
                                                            onChange={(e) => setAiJobRole(e.target.value)}
                                                            className="w-full px-5 py-4 rounded-2xl text-slate-900 bg-white/80 backdrop-blur-md border-2 border-orange-100 shadow-inner focus:ring-4 focus:ring-orange-400/20 focus:border-orange-500 outline-none font-bold placeholder:text-slate-400"
                                                            onKeyDown={(e) => e.key === 'Enter' && handleAIGenerate()}
                                                        />
                                                        <button
                                                            onClick={handleAIGenerate}
                                                            disabled={aiLoading}
                                                            className="w-full bg-orange-500 text-white px-6 py-4 rounded-2xl font-black hover:bg-orange-600 disabled:opacity-50 transition-all shadow-lg shadow-orange-200 active:scale-[0.98] flex items-center justify-center"
                                                        >
                                                            {aiLoading ? (
                                                                <>
                                                                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-3"></div>
                                                                    Analyzing...
                                                                </>
                                                            ) : 'Generate Content'}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {aiSuggestions && (
                                                <div className="space-y-6">
                                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 border-2 border-slate-100 rounded-3xl bg-slate-50/50">
                                                        <div className="flex justify-between items-start mb-4">
                                                            <div className="flex items-center text-slate-800"><FileText className="h-4 w-4 mr-2" /><h4 className="font-black text-sm uppercase tracking-wider">Suggested Summary</h4></div>
                                                            <button onClick={() => applySuggestion('summary', aiSuggestions.summary)} className="text-xs bg-slate-900 text-white px-4 py-1.5 rounded-full font-bold hover:bg-slate-700 transition-colors">Apply</button>
                                                        </div>
                                                        <p className="text-sm text-slate-600 leading-relaxed font-medium">{aiSuggestions.summary}</p>
                                                    </motion.div>

                                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="p-6 border-2 border-slate-100 rounded-3xl bg-slate-50/50">
                                                        <div className="flex justify-between items-start mb-4">
                                                            <div className="flex items-center text-slate-800"><Sparkles className="h-4 w-4 mr-2" /><h4 className="font-black text-sm uppercase tracking-wider">Suggested Skills</h4></div>
                                                            <button onClick={() => applySuggestion('skills', aiSuggestions.skills)} className="text-xs bg-slate-900 text-white px-4 py-1.5 rounded-full font-bold hover:bg-slate-700 transition-colors">Add All</button>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {aiSuggestions.skills.map((skill, i) => (
                                                                <span key={i} className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 shadow-sm">{skill}</span>
                                                            ))}
                                                        </div>
                                                    </motion.div>

                                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="p-6 border-2 border-slate-100 rounded-3xl bg-slate-50/50">
                                                        <div className="flex justify-between items-start mb-4">
                                                            <div className="flex items-center text-slate-800"><Briefcase className="h-4 w-4 mr-2" /><h4 className="font-black text-sm uppercase tracking-wider">Experience Bullets</h4></div>
                                                            <button onClick={() => applySuggestion('experience', aiSuggestions.bullets)} className="text-xs bg-slate-900 text-white px-4 py-1.5 rounded-full font-bold hover:bg-slate-700 transition-colors">Add as Role</button>
                                                        </div>
                                                        <ul className="space-y-3">
                                                            {aiSuggestions.bullets.map((bullet, i) => (
                                                                <li key={i} className="flex items-start text-sm text-slate-600 font-medium leading-relaxed">
                                                                    <div className="h-1.5 w-1.5 bg-orange-500 rounded-full mt-1.5 mr-3 shrink-0"></div>
                                                                    {bullet}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </motion.div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {activeSection === 'templates' && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {[
                                                { id: 'modern', name: 'Modern', desc: 'Sleek & Clean' },
                                                { id: 'visual', name: 'High-Impact', desc: 'Creative Sidebar' },
                                                { id: 'elegant', name: 'Elegant', desc: 'Classic Serif' },
                                                { id: 'government', name: 'Formal', desc: 'Strict Standard' },
                                                { id: 'internship', name: 'Academic', desc: 'Education Focus' }
                                            ].map(tpl => (
                                                <button
                                                    key={tpl.id}
                                                    onClick={() => setResume({ ...resume, templateId: tpl.id })}
                                                    className={`group p-5 rounded-3xl border-2 text-left transition-all ${resume.templateId === tpl.id
                                                        ? 'border-orange-500 bg-orange-50 ring-4 ring-orange-100 shadow-xl'
                                                        : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="font-black text-slate-900 text-sm tracking-wide">{tpl.name}</span>
                                                        {resume.templateId === tpl.id && (
                                                            <div className="bg-orange-500 text-white p-1.5 rounded-full shadow-lg shadow-orange-200"><Eye className="h-3 w-3" /></div>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-slate-500 font-medium">{tpl.desc}</p>
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {activeSection === 'personal' && (
                                        <div className="space-y-8">
                                            <div className="flex flex-col sm:flex-row items-center sm:space-x-8 space-y-4 sm:space-y-0">
                                                <div className="relative group shrink-0">
                                                    <div className="w-28 h-28 rounded-3xl border-4 border-slate-50 bg-slate-50 flex items-center justify-center overflow-hidden shadow-xl transition-all group-hover:scale-105 group-hover:rotate-3">
                                                        {resume.personalInfo?.profilePicture ? (
                                                            <img src={resume.personalInfo.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <User className="h-12 w-12 text-slate-300" />
                                                        )}
                                                    </div>
                                                    <label className="absolute -bottom-2 -right-2 p-2.5 bg-orange-500 text-white rounded-2xl cursor-pointer hover:bg-orange-600 transition-all shadow-xl active:scale-90">
                                                        <Upload className="h-4 w-4" />
                                                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                                    </label>
                                                </div>
                                                <div className="text-center sm:text-left space-y-1">
                                                    <p className="text-base font-black text-slate-900 tracking-wide">Professional Photo</p>
                                                    <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-[200px]">A high-quality headshot increases response rates by 20%.</p>
                                                    {resume.personalInfo?.profilePicture && (
                                                        <button onClick={() => handleChange('personalInfo', 'profilePicture', null)} className="text-xs text-red-500 font-black hover:underline mt-2">Remove photo</button>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="sm:col-span-2">
                                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 mb-1 block">Full Name</label>
                                                    <input placeholder="Gautam Kumar" value={resume.personalInfo?.fullName || ''} onChange={(e) => handleChange('personalInfo', 'fullName', e.target.value)} className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-orange-500 rounded-2xl transition-all font-bold" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 mb-1 block">Email</label>
                                                    <input placeholder="hello@example.com" value={resume.personalInfo?.email || ''} onChange={(e) => handleChange('personalInfo', 'email', e.target.value)} className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-orange-500 rounded-2xl transition-all font-bold" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 mb-1 block">Phone</label>
                                                    <input placeholder="+91 98765 43210" value={resume.personalInfo?.phone || ''} onChange={(e) => handleChange('personalInfo', 'phone', e.target.value)} className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-orange-500 rounded-2xl transition-all font-bold" />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 mb-1 block">Location</label>
                                                    <input placeholder="New Delhi, India" value={resume.personalInfo?.address || ''} onChange={(e) => handleChange('personalInfo', 'address', e.target.value)} className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-orange-500 rounded-2xl transition-all font-bold" />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeSection === 'summary' && (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-black text-slate-900 tracking-wide">Professional Summary</h3>
                                                <div className="bg-orange-50 text-orange-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Recommended</div>
                                            </div>
                                            <textarea
                                                rows={8}
                                                value={resume.summary || ''}
                                                onChange={(e) => setResume({ ...resume, summary: e.target.value })}
                                                className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-orange-500 rounded-3xl outline-none transition-all font-medium text-slate-700 leading-relaxed text-sm"
                                                placeholder="Seasoned software engineer with 5+ years of experience in..."
                                            />
                                        </div>
                                    )}

                                    {activeSection === 'experience' && (
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-center bg-white sticky top-0 py-2 z-10">
                                                <h3 className="text-lg font-black text-slate-900 tracking-wide">Work History</h3>
                                                <button onClick={() => addItem('experience', { company: '', position: '', startDate: '', endDate: '', description: '' })} className="bg-orange-500 text-white px-4 py-2 rounded-xl font-bold hover:bg-orange-600 transition-all text-xs flex items-center shadow-lg shadow-orange-100 active:scale-95">
                                                    <Plus className="h-4 w-4 mr-1" /> Add Role
                                                </button>
                                            </div>
                                            <div className="space-y-4">
                                                {resume.experience?.map((exp, index) => (
                                                    <motion.div 
                                                        key={index} 
                                                        layout
                                                        initial={{ opacity: 0, scale: 0.95 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        className="p-6 bg-white border-2 border-slate-100 rounded-3xl space-y-4 relative group shadow-sm hover:shadow-md transition-all"
                                                    >
                                                        <button onClick={() => removeItem('experience', index)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-xl">
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                                                            <input placeholder="Company" value={exp.company} onChange={(e) => handleArrayChange('experience', index, 'company', e.target.value)} className="px-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-orange-500 rounded-xl font-bold text-sm transition-all outline-none" />
                                                            <input placeholder="Role" value={exp.position} onChange={(e) => handleArrayChange('experience', index, 'position', e.target.value)} className="px-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-orange-500 rounded-xl font-bold text-sm transition-all outline-none" />
                                                            <input placeholder="Start Date" value={exp.startDate} onChange={(e) => handleArrayChange('experience', index, 'startDate', e.target.value)} className="px-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-orange-500 rounded-xl font-bold text-sm transition-all outline-none" />
                                                            <input placeholder="End Date" value={exp.endDate} onChange={(e) => handleArrayChange('experience', index, 'endDate', e.target.value)} className="px-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-orange-500 rounded-xl font-bold text-sm transition-all outline-none" />
                                                        </div>
                                                        <textarea placeholder="Key accomplishments and responsibilities..." rows={4} value={exp.description} onChange={(e) => handleArrayChange('experience', index, 'description', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-orange-500 rounded-xl font-medium text-sm transition-all outline-none leading-relaxed" />
                                                    </motion.div>
                                                ))}
                                                {resume.experience?.length === 0 && (
                                                    <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-3xl">
                                                        <Briefcase className="h-10 w-10 text-slate-200 mx-auto mb-4" />
                                                        <p className="text-sm font-bold text-slate-400">No experience added yet.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Repeat similar styling for other sections... */}
                                    {activeSection === 'education' && (
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-center bg-white sticky top-0 py-2 z-10">
                                                <h3 className="text-lg font-black text-slate-900 tracking-wide">Education</h3>
                                                <button onClick={() => addItem('education', { school: '', degree: '', startDate: '', endDate: '', description: '' })} className="bg-orange-500 text-white px-4 py-2 rounded-xl font-bold hover:bg-orange-600 transition-all text-xs flex items-center shadow-lg shadow-orange-100 active:scale-95">
                                                    <Plus className="h-4 w-4 mr-1" /> Add Education
                                                </button>
                                            </div>
                                            <div className="space-y-4">
                                                {resume.education?.map((edu, index) => (
                                                    <motion.div layout key={index} className="p-6 bg-white border-2 border-slate-100 rounded-3xl space-y-4 relative group shadow-sm hover:shadow-md transition-all">
                                                        <button onClick={() => removeItem('education', index)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-xl">
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                                                            <input placeholder="Institution" value={edu.school} onChange={(e) => handleArrayChange('education', index, 'school', e.target.value)} className="px-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-orange-500 rounded-xl font-bold text-sm transition-all outline-none" />
                                                            <input placeholder="Degree" value={edu.degree} onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)} className="px-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-orange-500 rounded-xl font-bold text-sm transition-all outline-none" />
                                                            <input placeholder="Start Date" value={edu.startDate} onChange={(e) => handleArrayChange('education', index, 'startDate', e.target.value)} className="px-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-orange-500 rounded-xl font-bold text-sm transition-all outline-none" />
                                                            <input placeholder="End Date" value={edu.endDate} onChange={(e) => handleArrayChange('education', index, 'endDate', e.target.value)} className="px-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-orange-500 rounded-xl font-bold text-sm transition-all outline-none" />
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {activeSection === 'skills' && (
                                        <div className="space-y-6">
                                            <h3 className="text-lg font-black text-slate-900 tracking-wide">Technical Skills</h3>
                                            <div className="p-8 bg-slate-50 rounded-[2.5rem] border-2 border-transparent focus-within:bg-white focus-within:border-orange-500 transition-all">
                                                <p className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-[0.2em] text-center">Separate skills with commas</p>
                                                <textarea
                                                    rows={6}
                                                    value={resume.skills?.join(', ') || ''}
                                                    onChange={(e) => setResume({ ...resume, skills: e.target.value.split(',').map(s => s.trim()) })}
                                                    className="w-full bg-transparent outline-none font-bold text-slate-800 text-center leading-loose text-lg"
                                                    placeholder="React, Node.js, Python, Figma..."
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {activeSection === 'projects' && (
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-center bg-white sticky top-0 py-2 z-10">
                                                <h3 className="text-lg font-black text-slate-900 tracking-wide">Key Projects</h3>
                                                <button onClick={() => addItem('projects', { name: '', description: '', link: '' })} className="bg-orange-500 text-white px-4 py-2 rounded-xl font-bold hover:bg-orange-600 transition-all text-xs flex items-center shadow-lg shadow-orange-100 active:scale-95">
                                                    <Plus className="h-4 w-4 mr-1" /> Add Project
                                                </button>
                                            </div>
                                            <div className="space-y-4">
                                                {resume.projects?.map((proj, index) => (
                                                    <motion.div layout key={index} className="p-6 bg-white border-2 border-slate-100 rounded-3xl space-y-4 relative group shadow-sm hover:shadow-md transition-all">
                                                        <button onClick={() => removeItem('projects', index)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-xl">
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                                                            <input placeholder="Project Name" value={proj.name} onChange={(e) => handleArrayChange('projects', index, 'name', e.target.value)} className="px-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-orange-500 rounded-xl font-bold text-sm transition-all outline-none" />
                                                            <input placeholder="Link (Optional)" value={proj.link} onChange={(e) => handleArrayChange('projects', index, 'link', e.target.value)} className="px-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-orange-500 rounded-xl font-bold text-sm transition-all outline-none" />
                                                        </div>
                                                        <textarea placeholder="Tell us about the project's impact..." rows={3} value={proj.description} onChange={(e) => handleArrayChange('projects', index, 'description', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-orange-500 rounded-xl font-medium text-sm transition-all outline-none leading-relaxed" />
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Mobile Mini Preview - Now on the right with better width */}
                <div 
                    className={`md:hidden bg-slate-50 border-l border-slate-200 overflow-y-auto cursor-pointer relative transition-all duration-300 ${isMobilePreview ? 'w-full' : 'w-[160px] shrink-0 shadow-[-10px_0_15px_rgba(0,0,0,0.02)]'}`}
                    onClick={() => !isMobilePreview && setIsMobilePreview(true)}
                >
                    {isMobilePreview && (
                        <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-100 p-3 flex items-center justify-between">
                            <button 
                                onClick={(e) => { e.stopPropagation(); setIsMobilePreview(false); }}
                                className="flex items-center text-slate-600 font-bold text-sm"
                            >
                                <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Edit
                            </button>
                            <div className="flex space-x-2">
                                <button onClick={(e) => { e.stopPropagation(); handleSave(); }} disabled={saving} className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold">
                                    {saving ? '...' : 'Save'}
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); handleDownload(); }} disabled={downloading} className="px-3 py-1.5 bg-orange-500 text-white rounded-lg text-xs font-bold">
                                    {downloading ? '...' : 'PDF'}
                                </button>
                            </div>
                        </div>
                    )}
                    {!isMobilePreview && (
                        <div className="sticky top-0 z-10 bg-slate-200/80 backdrop-blur-sm p-1.5 text-center">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Live Preview</span>
                        </div>
                    )}
                    <div className={`${isMobilePreview ? 'flex items-start justify-center p-4' : 'p-2'}`}>
                        <div 
                            className="resume-print-area bg-white shadow-lg origin-top-left"
                            style={{
                                width: '210mm',
                                minHeight: '297mm',
                                transform: isMobilePreview 
                                    ? `scale(${Math.min((window.innerWidth - 32) / 793, 0.55)})` 
                                    : `scale(${144 / 793})`, // Better scale for 160px width
                                transformOrigin: isMobilePreview ? 'top center' : 'top left',
                            }}
                            id={`resume-preview-${resume.templateId || 'modern'}`}
                        >
                            <ResumePreview resume={resume} />
                        </div>
                    </div>
                    {!isMobilePreview && (
                        <div className="sticky bottom-0 bg-gradient-to-t from-slate-100 to-transparent p-3 text-center">
                            <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest animate-pulse">Tap to view</span>
                        </div>
                    )}
                </div>

                {/* Desktop Preview Area - right side on desktop only */}
                <div className="hidden md:flex md:w-1/2 bg-slate-50 h-full overflow-y-auto items-start justify-center p-12">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        id={`resume-preview-desktop-${resume.templateId || 'modern'}`} 
                        className="resume-print-area w-full max-w-[210mm] bg-white shadow-2xl min-h-[297mm] origin-top transform transition-transform"
                        style={{
                            transform: `scale(${window.innerWidth < 1024 ? 0.8 : 0.95})`,
                            transformOrigin: 'top center'
                        }}
                    >
                        <ResumePreview resume={resume} />
                    </motion.div>
                </div>
            </div>
        </div>

            {/* Mobile Bottom Action Bar - Save & Download only */}
            <div className={`md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-2xl border-t border-slate-200 p-3 flex items-center justify-center space-x-3 ${isMobilePreview ? 'hidden' : ''}`}>
                <button 
                    onClick={handleSave} 
                    disabled={saving}
                    className="flex-1 max-w-[140px] py-2.5 bg-slate-900 text-white rounded-xl shadow-lg flex items-center justify-center active:scale-95 transition-all disabled:opacity-50 text-xs font-bold"
                >
                    <Save className="h-4 w-4 mr-1.5" />
                    {saving ? 'Saving...' : 'Save'}
                </button>
                <button 
                    onClick={handleDownload} 
                    disabled={downloading}
                    className="flex-1 max-w-[140px] py-2.5 bg-orange-500 text-white rounded-xl shadow-lg shadow-orange-200 flex items-center justify-center active:scale-95 transition-all disabled:opacity-50 text-xs font-bold"
                >
                    <Download className={`h-4 w-4 mr-1.5 ${downloading ? 'animate-bounce' : ''}`} />
                    {downloading ? 'Processing...' : 'Download'}
                </button>
            </div>
        </motion.div>
    );
};

export default Editor;
