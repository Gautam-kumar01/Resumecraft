import { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import ResumePreview from '../components/ResumePreview';
import LoginModal from '../components/LoginModal';
import SEO from '../components/SEO';
import { Save, Download, Eye, ArrowLeft, Plus, Trash2, User, Sparkles, FileText, Briefcase, GraduationCap, Code, Folder, Layout, ChevronDown, ChevronUp, GripVertical, Menu, Palette, PencilLine, Minus, Award, X, Maximize2, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

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
    certifications: [],
    templateId: 'modern'
};

const modules = {
    toolbar: [
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['clean']
    ],
};

const MotionDiv = motion.div;

const templateOptions = [
    { id: 'executive', name: 'Executive', desc: 'Premium Corporate' },
    { id: 'modern', name: 'Modern', desc: 'Sleek & Clean' },
    { id: 'visual', name: 'High-Impact', desc: 'Creative Sidebar' },
    { id: 'elegant', name: 'Elegant', desc: 'Classic Serif' },
    { id: 'government', name: 'Formal', desc: 'Strict Standard' },
    { id: 'internship', name: 'Academic', desc: 'Education Focus' }
];

const mobileTabs = [
    { id: 'edit', label: 'Edit', icon: PencilLine },
    { id: 'templates', label: 'Templates', icon: Palette },
    { id: 'preview', label: 'Preview', icon: Eye },
    { id: 'download', label: 'Download', icon: Download }
];

const getPdfFileName = (title) => {
    const safeTitle = (title || 'Resume')
        .replace(/[\\/:*?"<>|]+/g, '-')
        .replace(/\s+/g, ' ')
        .trim();

    return `${safeTitle || 'Resume'}.pdf`;
};

const waitForImages = async (element) => {
    const images = [...element.querySelectorAll('img')];

    await Promise.all(images.map((img) => {
        if (img.complete) return Promise.resolve();

        return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
        });
    }));
};

const isDefaultResumeTitle = (title) => title?.trim().toLowerCase() === 'untitled resume';

const AccordionItem = ({ title, icon, isOpen, onToggle, children }) => (
    <div className="border border-white/70 rounded-[18px] md:rounded-[20px] bg-white/95 mb-2.5 md:mb-4 overflow-hidden shadow-[0_10px_24px_rgba(15,23,42,0.055)] ring-1 ring-slate-900/[0.03] transition-all">
        <button 
            onClick={onToggle}
            className="w-full flex items-center justify-between px-3.5 py-3 md:p-5 bg-white/90 hover:bg-slate-50 transition-colors"
        >
            <div className="flex items-center space-x-2.5 md:space-x-3 text-slate-900 font-bold text-[14px] md:text-lg">
                <div className="p-1.5 md:p-2 bg-orange-50 text-orange-500 rounded-xl md:rounded-2xl">
                    {icon}
                </div>
                <span>{title}</span>
            </div>
            {isOpen ? <ChevronUp className="h-4 w-4 md:h-5 md:w-5 text-slate-400" /> : <ChevronDown className="h-4 w-4 md:h-5 md:w-5 text-slate-400" />}
        </button>
        <AnimatePresence>
            {isOpen && (
                <MotionDiv
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-slate-100"
                >
                    <div className="p-3.5 md:p-6">
                        {children}
                    </div>
                </MotionDiv>
            )}
        </AnimatePresence>
    </div>
);

const Editor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [openSection, setOpenSection] = useState('personal');
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [pendingAction, setPendingAction] = useState(null); 
    const [activeMobileTab, setActiveMobileTab] = useState('edit');
    const [isFullscreenPreview, setIsFullscreenPreview] = useState(false);
    const [isPreviewSheetOpen, setIsPreviewSheetOpen] = useState(false);
    const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);
    const [mobileZoom, setMobileZoom] = useState(1);
    
    const previewContainerRef = useRef(null);
    const [previewScale, setPreviewScale] = useState(1);

    // AI State
    const [aiJobRole, setAiJobRole] = useState('');
    const [aiLoading, setAiLoading] = useState(false);
    const [aiSuggestions, setAiSuggestions] = useState(null);

    useEffect(() => {
        const fetchResume = async () => {
            if (id) {
                try {
                    const { data } = await api.get(`/resumes/${id}`);
                    setResume({ ...data, certifications: data.certifications || [] });
                } catch (error) {
                    console.error("Error fetching resume:", error);
                    navigate('/dashboard');
                } finally {
                    setLoading(false);
                }
            } else {
                const savedDraft = localStorage.getItem('guest_resume_draft');
                if (savedDraft) {
                    try {
                        const parsedDraft = JSON.parse(savedDraft);
                        setResume({ ...parsedDraft, certifications: parsedDraft.certifications || [] });
                    } catch {
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

    useEffect(() => {
        if (!id && resume) {
            localStorage.setItem('guest_resume_draft', JSON.stringify(resume));
        }
    }, [resume, id]);

    // Update preview scale based on container width
    useEffect(() => {
        const updateScale = () => {
            if (previewContainerRef.current) {
                const containerWidth = previewContainerRef.current.offsetWidth;
                const containerHeight = previewContainerRef.current.offsetHeight;
                
                // A4 dimensions at 96dpi are 794x1123
                const scaleW = (containerWidth - 64) / 794; // 32px padding on each side
                const scaleH = (containerHeight - 64) / 1123;
                
                // Use the smaller scale to ensure it fits completely
                setPreviewScale(Math.min(scaleW, scaleH, 1.2)); // Cap at 1.2x scale
            }
        };

        updateScale();
        window.addEventListener('resize', updateScale);
        return () => window.removeEventListener('resize', updateScale);
    }, [activeMobileTab, isPreviewSheetOpen, isPreviewExpanded]);

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
        if (downloading) return;

        setDownloading(true);
        let offscreen = null;
        try {
            await document.fonts?.ready;
            const sourceEl = document.querySelector('.resume-print-area');
            if (!sourceEl) throw new Error('Resume content not found');

            const A4_W = 794;
            offscreen = document.createElement('div');
            offscreen.style.cssText = [
                'position:fixed', 'top:0', 'left:-9999px', `width:${A4_W}px`,
                'background:#fff', 'z-index:-9999', 'transform:none', 'overflow:visible',
            ].join(';');
            document.body.appendChild(offscreen);

            /** @type {HTMLElement} */
            const clone = (sourceEl.cloneNode(true));
            [clone, ...clone.querySelectorAll('*')].forEach(/** @type {any} */ (el) => {
                if (el.style) {
                    el.style.transform = 'none';
                    el.style.transition = 'none';
                    el.style.animation = 'none';
                    if (window.getComputedStyle(el).letterSpacing !== 'normal') {
                        el.style.letterSpacing = 'normal';
                    }
                    if (window.getComputedStyle(el).textAlign === 'justify') {
                        el.style.textAlign = 'left';
                    }
                }
            });
            clone.style.width = `${A4_W}px`;
            clone.style.minHeight = 'auto';
            clone.style.boxShadow = 'none';
            clone.style.margin = '0';
            clone.style.padding = '0';
            offscreen.appendChild(clone);

            await document.fonts?.ready;
            await waitForImages(clone);
            await new Promise(r => setTimeout(r, 300));

            const canvas = await html2canvas(offscreen, {
                scale: 4, // Higher resolution for crisp text
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false,
                width: A4_W,
                height: offscreen.scrollHeight,
                windowWidth: 1400, 
                scrollX: 0,
                scrollY: 0,
            });

            offscreen.remove();
            offscreen = null;

            const imgData = canvas.toDataURL('image/jpeg', 0.98);
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

            const pageW = pdf.internal.pageSize.getWidth();
            const pageH = pdf.internal.pageSize.getHeight();
            let imgH  = (canvas.height / canvas.width) * pageW;

            if (imgH > pageH && imgH < pageH * 1.3) {
                pdf.addImage(imgData, 'JPEG', 0, 0, pageW, pageH, '', 'FAST');
            } else {
                let remaining = imgH;
                let yOffset = 0;
                while (remaining > 0) {
                    if (yOffset > 0) pdf.addPage();
                    pdf.addImage(imgData, 'JPEG', 0, -yOffset, pageW, imgH, '', 'FAST');
                    yOffset += pageH;
                    remaining -= pageH;
                }
            }

            pdf.save(getPdfFileName(resume.title));
        } catch (err) {
            console.error('PDF Export Error:', err);
            alert(`Download failed: ${err.message}`);
        } finally {
            offscreen?.remove();
            setDownloading(false);
        }
    };

    const handleDownload = async () => {
        await performDownload();
    };

    const handleLoginSuccess = async () => {
        setSaving(true);
        try {
            const { data } = await api.post('/resumes', resume);
            localStorage.removeItem('guest_resume_draft');
            window.history.replaceState(null, '', `/editor/${data._id}`);
            if (pendingAction === 'download') {
                await performDownload();
            }
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

    const onDragEnd = (result, section) => {
        if (!result.destination) return;
        const items = Array.from(resume[section] || []);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setResume(prev => ({ ...prev, [section]: items }));
    };

    const handleAIGenerate = async () => {
        if (!aiJobRole.trim()) return alert("Please enter a job role");

        setAiLoading(true);
        try {
            const { data } = await api.post('/ai/suggest', { jobRole: aiJobRole });
            setAiSuggestions(data);
        } catch (error) {
            console.error("AI Error Full Object:", error);
            const message = error.response?.data?.message || error.message || "Failed to generate suggestions";
            let details = error.response?.data?.error || "";
            if (typeof details === 'object') details = JSON.stringify(details);
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
            const bulletsHtml = `<ul>${data.map(b => `<li>${b}</li>`).join('')}</ul>`;
            addItem('experience', {
                company: 'Sample Company',
                position: aiJobRole,
                startDate: '202X',
                endDate: 'Present',
                description: bulletsHtml
            });
        }
        alert("Applied to resume!");
    };

    if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full"></div></div>;
    if (!resume) return <div className="p-10 text-center">Resume not found</div>;

    const activeTemplate = templateOptions.find(tpl => tpl.id === resume.templateId) || templateOptions[1];
    const previewTransformScale = previewScale * mobileZoom;
    const canZoomOut = mobileZoom > 0.75;
    const canZoomIn = mobileZoom < 1.35;
    const previewName = resume.personalInfo?.fullName || 'Your Name';
    const previewTitle = isDefaultResumeTitle(resume.title) || !resume.title?.trim() ? 'Resume Preview' : resume.title.trim();
    const openPreviewSheet = () => {
        setIsPreviewSheetOpen(true);
        setActiveMobileTab('preview');
    };
    const closePreviewSheet = () => {
        setIsPreviewSheetOpen(false);
        setIsPreviewExpanded(false);
        setActiveMobileTab('edit');
    };

    return (
        <MotionDiv 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[80] flex flex-col md:flex-row h-[100dvh] overflow-hidden bg-[linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] font-sans text-slate-900"
        >
            <SEO title={resume.title ? `${resume.title} - Editor` : "Resume Editor"} />
            <div className="fixed -left-[9999px] top-0 w-[794px] bg-white pointer-events-none" aria-hidden="true">
                <div className="resume-print-area bg-white" style={{ width: '794px', minHeight: '1123px' }}>
                    <ResumePreview resume={resume} />
                </div>
            </div>
            <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onSuccess={handleLoginSuccess} title="Your resume is ready!" subtitle="Login or sign up to download and save your resume." />

            {/* Left Panel: Form & Editor */}
            <div className={`${activeMobileTab === 'edit' ? 'flex' : 'hidden'} md:flex ${isFullscreenPreview ? 'md:hidden' : ''} w-full md:w-[45%] lg:w-[40%] bg-transparent md:bg-slate-50/95 md:border-r md:border-slate-200 h-full flex-col z-10`}>
                
                {/* Header */}
                <div className="bg-white/85 backdrop-blur-xl border-b border-white/70 px-4 py-3 md:p-4 flex items-center justify-between shrink-0 shadow-[0_8px_30px_rgba(15,23,42,0.06)] z-20 relative">
                    <button onClick={() => navigate(user ? '/dashboard' : '/')} className="flex items-center gap-2 text-slate-600 hover:text-orange-500 transition-colors font-black text-sm">
                        <span className="h-9 w-9 rounded-2xl bg-slate-100 flex items-center justify-center">
                            <ArrowLeft className="h-4 w-4" />
                        </span>
                        <span className="tracking-tight">ResumeCraft</span>
                    </button>
                    <div className="flex items-center space-x-2 md:space-x-3">
                        <button onClick={() => setIsFullscreenPreview(!isFullscreenPreview)} className="hidden md:flex items-center px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors">
                            {isFullscreenPreview ? <Layout className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                            {isFullscreenPreview ? 'Show Editor' : 'Full Preview'}
                        </button>
                        <button onClick={handleSave} disabled={saving} aria-label="Save resume" className="flex h-10 w-10 md:w-auto items-center justify-center md:px-4 md:py-2 bg-slate-900 text-white rounded-2xl md:rounded-xl hover:bg-slate-800 transition-colors font-bold shadow-sm disabled:opacity-70 text-xs md:text-sm">
                            <Save className="h-4 w-4 md:mr-2" /> <span className="hidden md:inline">{saving ? 'Saving...' : 'Save'}</span>
                        </button>
                        <button onClick={() => setActiveMobileTab('download')} className="md:hidden flex h-10 w-10 items-center justify-center bg-white text-slate-700 rounded-2xl border border-slate-200 shadow-sm" aria-label="Open actions">
                            <Menu className="h-4 w-4" />
                        </button>
                        <button onClick={handleDownload} disabled={downloading} className="hidden md:flex items-center px-3 py-1.5 md:px-4 md:py-2 bg-orange-500 text-white rounded-lg md:rounded-xl hover:bg-orange-600 transition-colors font-bold shadow-sm disabled:opacity-70 text-xs md:text-sm">
                            <Download className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" /> {downloading ? 'Downloading...' : 'Download PDF'}
                        </button>
                    </div>
                </div>

                {/* Main Scrollable Form Area */}
                <div className="flex-1 overflow-y-auto px-4 pt-4 pb-[calc(8.75rem+env(safe-area-inset-bottom))] md:p-6 lg:p-8 space-y-4 md:space-y-6 scroll-smooth bg-transparent md:bg-[#f8fafc]">
                    
                    {/* Document Title */}
                    <div className="mb-4 md:mb-6">
                        <input
                            type="text"
                            placeholder="Add headline, e.g. Software Engineer"
                            value={isDefaultResumeTitle(resume.title) ? '' : resume.title}
                            onChange={(e) => setResume({ ...resume, title: e.target.value })}
                            className="w-full bg-transparent text-2xl md:text-3xl font-black text-slate-900 border-none outline-none placeholder:text-slate-300"
                        />
                    </div>

                    {/* AI Coach */}
                    <AccordionItem 
                        title="AI Career Coach" 
                        icon={<Sparkles className="h-5 w-5" />}
                        isOpen={openSection === 'ai'} 
                        onToggle={() => setOpenSection(openSection === 'ai' ? '' : 'ai')}
                    >
                        <div className="space-y-4">
                            <p className="text-slate-600 text-sm mb-2 font-medium">
                                Describe your target role, and our AI will craft a high-impact summary and bullets.
                            </p>
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    placeholder="e.g. Senior Frontend Engineer"
                                    value={aiJobRole}
                                    onChange={(e) => setAiJobRole(e.target.value)}
                                    className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none font-medium"
                                    onKeyDown={(e) => e.key === 'Enter' && handleAIGenerate()}
                                />
                                <button
                                    onClick={handleAIGenerate}
                                    disabled={aiLoading}
                                    className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-colors disabled:opacity-50"
                                >
                                    {aiLoading ? '...' : 'Generate'}
                                </button>
                            </div>
                            {aiSuggestions && (
                                <div className="space-y-4 mt-6 border-t border-slate-100 pt-6">
                                    <div className="bg-orange-50 p-4 rounded-xl">
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="font-bold text-orange-900">Summary</h4>
                                            <button onClick={() => applySuggestion('summary', aiSuggestions.summary)} className="text-xs bg-orange-200 text-orange-900 px-3 py-1 rounded-full font-bold hover:bg-orange-300">Apply</button>
                                        </div>
                                        <p className="text-sm text-orange-800">{aiSuggestions.summary}</p>
                                    </div>
                                    <div className="bg-orange-50 p-4 rounded-xl">
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="font-bold text-orange-900">Skills</h4>
                                            <button onClick={() => applySuggestion('skills', aiSuggestions.skills)} className="text-xs bg-orange-200 text-orange-900 px-3 py-1 rounded-full font-bold hover:bg-orange-300">Add</button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {aiSuggestions.skills.map((s, i) => <span key={i} className="text-xs bg-white px-2 py-1 rounded shadow-sm">{s}</span>)}
                                        </div>
                                    </div>
                                    <div className="bg-orange-50 p-4 rounded-xl">
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="font-bold text-orange-900">Experience Bullets</h4>
                                            <button onClick={() => applySuggestion('experience', aiSuggestions.bullets)} className="text-xs bg-orange-200 text-orange-900 px-3 py-1 rounded-full font-bold hover:bg-orange-300">Add as Role</button>
                                        </div>
                                        <ul className="text-sm text-orange-800 space-y-1 list-disc pl-4">
                                            {aiSuggestions.bullets.map((b, i) => <li key={i}>{b}</li>)}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    </AccordionItem>

                    {/* Personal Details */}
                    <AccordionItem 
                        title="Personal Details" 
                        icon={<User className="h-5 w-5" />}
                        isOpen={openSection === 'personal'} 
                        onToggle={() => setOpenSection(openSection === 'personal' ? '' : 'personal')}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2 flex items-center space-x-6 mb-4">
                                <div className="w-24 h-24 rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-slate-300 relative group">
                                    {resume.personalInfo?.profilePicture ? (
                                        <>
                                            <img src={resume.personalInfo.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center">
                                                <Trash2 className="text-white h-6 w-6 cursor-pointer" onClick={() => handleChange('personalInfo', 'profilePicture', '')} />
                                            </div>
                                        </>
                                    ) : (
                                        <User className="h-8 w-8 text-slate-400" />
                                    )}
                                </div>
                                <div>
                                    <label className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold text-sm cursor-pointer hover:bg-slate-50 shadow-sm">
                                        Upload Photo
                                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                    </label>
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Full Name</label>
                                <input value={resume.personalInfo?.fullName || ''} onChange={(e) => handleChange('personalInfo', 'fullName', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-orange-500 rounded-xl outline-none font-medium" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Email</label>
                                <input value={resume.personalInfo?.email || ''} onChange={(e) => handleChange('personalInfo', 'email', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-orange-500 rounded-xl outline-none font-medium" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Phone</label>
                                <input value={resume.personalInfo?.phone || ''} onChange={(e) => handleChange('personalInfo', 'phone', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-orange-500 rounded-xl outline-none font-medium" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Address</label>
                                <input value={resume.personalInfo?.address || ''} onChange={(e) => handleChange('personalInfo', 'address', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-orange-500 rounded-xl outline-none font-medium" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">LinkedIn URL</label>
                                <input value={resume.personalInfo?.linkedin || ''} onChange={(e) => handleChange('personalInfo', 'linkedin', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-orange-500 rounded-xl outline-none font-medium" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">GitHub / Website</label>
                                <input value={resume.personalInfo?.github || ''} onChange={(e) => handleChange('personalInfo', 'github', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-orange-500 rounded-xl outline-none font-medium" />
                            </div>
                        </div>
                    </AccordionItem>

                    {/* Professional Summary */}
                    <AccordionItem 
                        title="Professional Summary" 
                        icon={<FileText className="h-5 w-5" />}
                        isOpen={openSection === 'summary'} 
                        onToggle={() => setOpenSection(openSection === 'summary' ? '' : 'summary')}
                    >
                        <div className="quill-container">
                            <ReactQuill 
                                theme="snow" 
                                value={resume.summary || ''} 
                                onChange={(val) => setResume({ ...resume, summary: val })}
                                modules={modules}
                                className="bg-white rounded-xl overflow-hidden"
                            />
                        </div>
                    </AccordionItem>

                    {/* Experience with Drag & Drop */}
                    <AccordionItem 
                        title="Work Experience" 
                        icon={<Briefcase className="h-5 w-5" />}
                        isOpen={openSection === 'experience'} 
                        onToggle={() => setOpenSection(openSection === 'experience' ? '' : 'experience')}
                    >
                        <DragDropContext onDragEnd={(result) => onDragEnd(result, 'experience')}>
                            <Droppable droppableId="experience-list">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                                        {resume.experience?.map((exp, index) => (
                                            <Draggable key={`exp-${index}`} draggableId={`exp-${index}`} index={index}>
                                                {(provided, snapshot) => (
                                                    <div 
                                                        ref={provided.innerRef} 
                                                        {...provided.draggableProps} 
                                                        className={`p-5 bg-slate-50 border ${snapshot.isDragging ? 'border-orange-500 shadow-xl' : 'border-slate-200'} rounded-2xl relative group`}
                                                    >
                                                        <div {...provided.dragHandleProps} className="absolute top-4 right-12 text-slate-400 hover:text-slate-600 cursor-grab">
                                                            <GripVertical className="h-5 w-5" />
                                                        </div>
                                                        <button onClick={() => removeItem('experience', index)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500">
                                                            <Trash2 className="h-5 w-5" />
                                                        </button>
                                                        
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                                            <div>
                                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Job Title</label>
                                                                <input value={exp.position} onChange={(e) => handleArrayChange('experience', index, 'position', e.target.value)} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-orange-500 font-medium" />
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Company</label>
                                                                <input value={exp.company} onChange={(e) => handleArrayChange('experience', index, 'company', e.target.value)} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-orange-500 font-medium" />
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Start Date</label>
                                                                <input value={exp.startDate} onChange={(e) => handleArrayChange('experience', index, 'startDate', e.target.value)} placeholder="e.g. Jan 2020" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-orange-500 font-medium" />
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">End Date</label>
                                                                <input value={exp.endDate} onChange={(e) => handleArrayChange('experience', index, 'endDate', e.target.value)} placeholder="e.g. Present" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-orange-500 font-medium" />
                                                            </div>
                                                            <div className="md:col-span-2">
                                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
                                                                <div className="quill-container-small">
                                                                    <ReactQuill 
                                                                        theme="snow" 
                                                                        value={exp.description || ''} 
                                                                        onChange={(val) => handleArrayChange('experience', index, 'description', val)}
                                                                        modules={modules}
                                                                        className="bg-white rounded-lg"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                        <button onClick={() => addItem('experience', { company: '', position: '', startDate: '', endDate: '', description: '' })} className="mt-4 w-full py-3 border-2 border-dashed border-orange-200 text-orange-600 rounded-xl font-bold hover:bg-orange-50 hover:border-orange-300 transition-colors flex items-center justify-center">
                            <Plus className="h-4 w-4 mr-2" /> Add Experience
                        </button>
                    </AccordionItem>

                    {/* Education with Drag & Drop */}
                    <AccordionItem 
                        title="Education" 
                        icon={<GraduationCap className="h-5 w-5" />}
                        isOpen={openSection === 'education'} 
                        onToggle={() => setOpenSection(openSection === 'education' ? '' : 'education')}
                    >
                        <DragDropContext onDragEnd={(result) => onDragEnd(result, 'education')}>
                            <Droppable droppableId="education-list">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                                        {resume.education?.map((edu, index) => (
                                            <Draggable key={`edu-${index}`} draggableId={`edu-${index}`} index={index}>
                                                {(provided, snapshot) => (
                                                    <div 
                                                        ref={provided.innerRef} 
                                                        {...provided.draggableProps} 
                                                        className={`p-5 bg-slate-50 border ${snapshot.isDragging ? 'border-orange-500 shadow-xl' : 'border-slate-200'} rounded-2xl relative group`}
                                                    >
                                                        <div {...provided.dragHandleProps} className="absolute top-4 right-12 text-slate-400 hover:text-slate-600 cursor-grab">
                                                            <GripVertical className="h-5 w-5" />
                                                        </div>
                                                        <button onClick={() => removeItem('education', index)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500">
                                                            <Trash2 className="h-5 w-5" />
                                                        </button>
                                                        
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                                            <div>
                                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Degree</label>
                                                                <input value={edu.degree} onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-orange-500 font-medium" />
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">School/University</label>
                                                                <input value={edu.school} onChange={(e) => handleArrayChange('education', index, 'school', e.target.value)} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-orange-500 font-medium" />
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Start Date</label>
                                                                <input value={edu.startDate} onChange={(e) => handleArrayChange('education', index, 'startDate', e.target.value)} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-orange-500 font-medium" />
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">End Date</label>
                                                                <input value={edu.endDate} onChange={(e) => handleArrayChange('education', index, 'endDate', e.target.value)} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-orange-500 font-medium" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                        <button onClick={() => addItem('education', { school: '', degree: '', startDate: '', endDate: '' })} className="mt-4 w-full py-3 border-2 border-dashed border-orange-200 text-orange-600 rounded-xl font-bold hover:bg-orange-50 hover:border-orange-300 transition-colors flex items-center justify-center">
                            <Plus className="h-4 w-4 mr-2" /> Add Education
                        </button>
                    </AccordionItem>

                    {/* Projects with Drag & Drop */}
                    <AccordionItem 
                        title="Projects" 
                        icon={<Folder className="h-5 w-5" />}
                        isOpen={openSection === 'projects'} 
                        onToggle={() => setOpenSection(openSection === 'projects' ? '' : 'projects')}
                    >
                         <DragDropContext onDragEnd={(result) => onDragEnd(result, 'projects')}>
                            <Droppable droppableId="projects-list">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                                        {resume.projects?.map((proj, index) => (
                                            <Draggable key={`proj-${index}`} draggableId={`proj-${index}`} index={index}>
                                                {(provided, snapshot) => (
                                                    <div 
                                                        ref={provided.innerRef} 
                                                        {...provided.draggableProps} 
                                                        className={`p-5 bg-slate-50 border ${snapshot.isDragging ? 'border-orange-500 shadow-xl' : 'border-slate-200'} rounded-2xl relative group`}
                                                    >
                                                        <div {...provided.dragHandleProps} className="absolute top-4 right-12 text-slate-400 hover:text-slate-600 cursor-grab">
                                                            <GripVertical className="h-5 w-5" />
                                                        </div>
                                                        <button onClick={() => removeItem('projects', index)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500">
                                                            <Trash2 className="h-5 w-5" />
                                                        </button>
                                                        
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                                            <div>
                                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Project Name</label>
                                                                <input value={proj.name} onChange={(e) => handleArrayChange('projects', index, 'name', e.target.value)} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-orange-500 font-medium" />
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Link / URL</label>
                                                                <input value={proj.link} onChange={(e) => handleArrayChange('projects', index, 'link', e.target.value)} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-orange-500 font-medium" />
                                                            </div>
                                                            <div className="md:col-span-2">
                                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
                                                                <div className="quill-container-small">
                                                                    <ReactQuill 
                                                                        theme="snow" 
                                                                        value={proj.description || ''} 
                                                                        onChange={(val) => handleArrayChange('projects', index, 'description', val)}
                                                                        modules={modules}
                                                                        className="bg-white rounded-lg"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                        <button onClick={() => addItem('projects', { name: '', link: '', description: '' })} className="mt-4 w-full py-3 border-2 border-dashed border-orange-200 text-orange-600 rounded-xl font-bold hover:bg-orange-50 hover:border-orange-300 transition-colors flex items-center justify-center">
                            <Plus className="h-4 w-4 mr-2" /> Add Project
                        </button>
                    </AccordionItem>

                    {/* Skills */}
                    <AccordionItem 
                        title="Skills" 
                        icon={<Code className="h-5 w-5" />}
                        isOpen={openSection === 'skills'} 
                        onToggle={() => setOpenSection(openSection === 'skills' ? '' : 'skills')}
                    >
                        <div className="space-y-4">
                            <p className="text-sm text-slate-500 font-medium mb-4">Enter a skill and press comma or enter.</p>
                            <input
                                type="text"
                                placeholder="React, Node.js, Python..."
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ',') {
                                        e.preventDefault();
                                        const target = /** @type {HTMLInputElement} */ (e.target);
                                        const val = target.value.trim();
                                        if (val && !resume.skills?.includes(val)) {
                                            setResume(prev => ({ ...prev, skills: [...(prev.skills || []), val] }));
                                        }
                                        target.value = '';
                                    }
                                }}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-orange-500 rounded-xl outline-none font-medium mb-4"
                            />
                            <DragDropContext onDragEnd={(result) => onDragEnd(result, 'skills')}>
                                <Droppable droppableId="skills-list" direction="horizontal">
                                    {(provided) => (
                                        <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-wrap gap-2">
                                            {resume.skills?.map((skill, index) => (
                                                <Draggable key={`skill-${skill}-${index}`} draggableId={`skill-${skill}-${index}`} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={`flex items-center px-3 py-1.5 bg-white border ${snapshot.isDragging ? 'border-orange-500 shadow-md' : 'border-slate-200'} rounded-lg group`}
                                                        >
                                                            <span className="text-sm font-bold text-slate-700 mr-2">{skill}</span>
                                                            <button onClick={() => removeItem('skills', index)} className="text-slate-400 hover:text-red-500">
                                                                <Trash2 className="h-3 w-3" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        </div>
                    </AccordionItem>

                    {/* Certifications with Drag & Drop */}
                    <AccordionItem 
                        title="Certifications" 
                        icon={<Award className="h-5 w-5" />}
                        isOpen={openSection === 'certifications'} 
                        onToggle={() => setOpenSection(openSection === 'certifications' ? '' : 'certifications')}
                    >
                        <DragDropContext onDragEnd={(result) => onDragEnd(result, 'certifications')}>
                            <Droppable droppableId="certifications-list">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                                        {(resume.certifications || []).map((cert, index) => (
                                            <Draggable key={`cert-${index}`} draggableId={`cert-${index}`} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        className={`p-4 md:p-5 bg-slate-50 border ${snapshot.isDragging ? 'border-orange-500 shadow-xl' : 'border-slate-200'} rounded-2xl relative group`}
                                                    >
                                                        <div {...provided.dragHandleProps} className="absolute top-4 right-12 text-slate-400 hover:text-slate-600 cursor-grab">
                                                            <GripVertical className="h-5 w-5" />
                                                        </div>
                                                        <button onClick={() => removeItem('certifications', index)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500">
                                                            <Trash2 className="h-5 w-5" />
                                                        </button>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                                            <div>
                                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Certification</label>
                                                                <input value={cert.name || ''} onChange={(e) => handleArrayChange('certifications', index, 'name', e.target.value)} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-orange-500 font-medium" />
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Issuer</label>
                                                                <input value={cert.issuer || ''} onChange={(e) => handleArrayChange('certifications', index, 'issuer', e.target.value)} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-orange-500 font-medium" />
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Date</label>
                                                                <input value={cert.date || ''} onChange={(e) => handleArrayChange('certifications', index, 'date', e.target.value)} placeholder="e.g. Mar 2026" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-orange-500 font-medium" />
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Credential Link</label>
                                                                <input value={cert.link || ''} onChange={(e) => handleArrayChange('certifications', index, 'link', e.target.value)} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-orange-500 font-medium" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                        <button onClick={() => addItem('certifications', { name: '', issuer: '', date: '', link: '' })} className="mt-4 w-full py-3 border-2 border-dashed border-orange-200 text-orange-600 rounded-xl font-bold hover:bg-orange-50 hover:border-orange-300 transition-colors flex items-center justify-center">
                            <Plus className="h-4 w-4 mr-2" /> Add Certification
                        </button>
                    </AccordionItem>

                    {/* Templates */}
                    <div className="hidden md:block">
                    <AccordionItem 
                        title="Templates" 
                        icon={<Layout className="h-5 w-5" />}
                        isOpen={openSection === 'templates'} 
                        onToggle={() => setOpenSection(openSection === 'templates' ? '' : 'templates')}
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {templateOptions.map(tpl => (
                                <button
                                    key={tpl.id}
                                    onClick={() => setResume({ ...resume, templateId: tpl.id })}
                                    className={`group p-4 rounded-xl border-2 text-left transition-all ${resume.templateId === tpl.id
                                        ? 'border-orange-500 bg-orange-50 shadow-md'
                                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                        }`}
                                >
                                    <div className="font-bold text-slate-900 text-sm mb-1">{tpl.name}</div>
                                    <p className="text-xs text-slate-500 font-medium">{tpl.desc}</p>
                                </button>
                            ))}
                        </div>
                    </AccordionItem>
                    </div>

                    {/* Bottom Padding */}
                    <div className="h-24 md:h-8"></div>
                </div>
            </div>

            {/* Desktop / Tablet Preview */}
            <div
                ref={previewContainerRef}
                className={`hidden md:flex ${isFullscreenPreview ? 'md:w-full' : 'md:w-[55%] lg:w-[60%]'} bg-slate-300 h-full overflow-y-auto justify-center px-4 py-6 md:py-10 relative transition-all duration-500`}
            >
                <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="hidden md:flex absolute top-4 right-4 z-20 items-center px-4 py-2 bg-orange-500 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-orange-600 transition-colors disabled:opacity-70"
                >
                    <Download className="w-4 h-4 mr-2" />
                    {downloading ? 'Downloading...' : 'Download PDF'}
                </button>
                <div
                    className="bg-white shadow-2xl origin-top transition-transform duration-300 ease-out"
                    style={{
                        width: '794px',
                        minHeight: '1123px',
                        transform: `scale(${previewTransformScale})`,
                        marginBottom: `${1123 * previewTransformScale - 1123 + 120}px`
                    }}
                >
                    <ResumePreview resume={resume} />
                </div>
            </div>

            <button
                onClick={handleDownload}
                disabled={downloading}
                className="hidden md:flex fixed right-6 bottom-6 z-[90] items-center px-5 py-3 bg-orange-500 text-white rounded-2xl font-black text-sm shadow-[0_18px_45px_rgba(249,115,22,0.35)] hover:bg-orange-600 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0"
            >
                <Download className="w-4 h-4 mr-2" />
                {downloading ? 'Downloading...' : 'Download PDF'}
            </button>

            {/* Mobile Templates */}
            <div className={`${activeMobileTab === 'templates' ? 'flex' : 'hidden'} md:hidden h-full w-full flex-col overflow-y-auto px-4 pt-5 pb-[calc(7rem+env(safe-area-inset-bottom))]`}>
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-500 mb-1">Templates</p>
                        <h1 className="text-2xl font-black text-slate-950 tracking-tight">Pick a style</h1>
                    </div>
                    <button onClick={handleSave} className="h-10 w-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm" aria-label="Save resume">
                        <Save className="h-4 w-4 text-slate-700" />
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {templateOptions.map(tpl => (
                        <button
                            key={tpl.id}
                            onClick={() => setResume({ ...resume, templateId: tpl.id })}
                            className={`min-h-36 rounded-[20px] border p-4 text-left shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition-all ${resume.templateId === tpl.id ? 'border-orange-500 bg-orange-50 ring-4 ring-orange-100' : 'border-white bg-white'}`}
                        >
                            <div className="h-16 rounded-xl bg-slate-100 mb-4 overflow-hidden p-2">
                                <div className="h-2 w-2/3 rounded-full bg-slate-300 mb-2"></div>
                                <div className="space-y-1.5">
                                    <div className="h-1.5 rounded-full bg-slate-200"></div>
                                    <div className="h-1.5 w-4/5 rounded-full bg-slate-200"></div>
                                    <div className="h-1.5 w-3/5 rounded-full bg-slate-200"></div>
                                </div>
                            </div>
                            <div className="font-black text-slate-900 text-sm">{tpl.name}</div>
                            <p className="text-xs text-slate-500 font-bold mt-1">{tpl.desc}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Mobile Download */}
            <div className={`${activeMobileTab === 'download' ? 'flex' : 'hidden'} md:hidden h-full w-full flex-col justify-between px-4 pt-6 pb-[calc(7rem+env(safe-area-inset-bottom))]`}>
                <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-500 mb-2">Export</p>
                    <h1 className="text-3xl font-black text-slate-950 tracking-tight mb-3">Ready when you are.</h1>
                    <p className="text-sm font-medium text-slate-500 leading-relaxed">Save your latest edits, preview the final page, or download a polished PDF.</p>
                </div>
                <div className="rounded-[24px] bg-white/95 border border-white p-5 shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
                    <div className="flex items-center gap-4 mb-5">
                        <div className="h-16 w-12 rounded-lg bg-slate-100 border border-slate-200 shadow-inner"></div>
                        <div className="min-w-0">
                            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">PDF File</p>
                            <p className="font-black text-slate-900 truncate">{getPdfFileName(resume.title)}</p>
                            <p className="text-xs font-bold text-slate-500 mt-1">Template: {activeTemplate.name}</p>
                        </div>
                    </div>
                    <button onClick={handleDownload} disabled={downloading} className="w-full h-14 rounded-2xl bg-orange-500 text-white font-black shadow-lg shadow-orange-500/20 hover:bg-orange-600 disabled:opacity-70 flex items-center justify-center">
                        <Download className="h-5 w-5 mr-2" /> {downloading ? 'Downloading...' : 'Download PDF'}
                    </button>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                        <button onClick={openPreviewSheet} className="h-12 rounded-2xl bg-slate-100 text-slate-800 font-black">Preview</button>
                        <button onClick={handleSave} disabled={saving} className="h-12 rounded-2xl bg-slate-900 text-white font-black disabled:opacity-70">{saving ? 'Saving...' : 'Save'}</button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {activeMobileTab === 'edit' && !isPreviewSheetOpen && (
                    <MotionDiv
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 14 }}
                        transition={{ type: 'spring', stiffness: 340, damping: 30 }}
                        className="md:hidden fixed left-4 right-4 bottom-[calc(4.85rem+env(safe-area-inset-bottom))] z-30"
                    >
                        <button
                            onClick={openPreviewSheet}
                            className="w-full rounded-[20px] bg-white/92 backdrop-blur-xl border border-white shadow-[0_18px_45px_rgba(15,23,42,0.14)] px-3 py-2.5 flex items-center gap-3 text-left"
                        >
                            <div className="h-12 w-9 rounded-lg bg-slate-100 border border-slate-200 p-1 shadow-inner shrink-0">
                                <div className="h-1.5 w-5 rounded-full bg-slate-300 mb-1.5"></div>
                                <div className="space-y-1">
                                    <div className="h-1 rounded-full bg-slate-200"></div>
                                    <div className="h-1 w-4/5 rounded-full bg-slate-200"></div>
                                    <div className="h-1 w-3/5 rounded-full bg-slate-200"></div>
                                </div>
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="text-sm font-black text-slate-900 truncate">{previewName}</div>
                                <div className="text-xs font-bold text-slate-500 truncate">{previewTitle}</div>
                            </div>
                            <div className="h-9 px-3 rounded-2xl bg-orange-50 text-orange-600 font-black text-xs flex items-center shrink-0">
                                <Eye className="h-3.5 w-3.5 mr-1.5" /> Preview
                            </div>
                        </button>
                    </MotionDiv>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isPreviewSheetOpen && (
                    <MotionDiv
                        className="md:hidden fixed inset-0 z-50 bg-slate-950/35 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closePreviewSheet}
                    >
                        <MotionDiv
                            drag="y"
                            dragConstraints={{ top: 0, bottom: 0 }}
                            dragElastic={{ top: 0.04, bottom: 0.18 }}
                            onDragEnd={(_, info) => {
                                if (info.offset.y > 110 || info.velocity.y > 700) closePreviewSheet();
                            }}
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
                            onClick={(event) => event.stopPropagation()}
                            className={`${isPreviewExpanded ? 'inset-0 rounded-none' : 'left-0 right-0 bottom-0 h-[82dvh] rounded-t-[30px]'} fixed bg-slate-200 shadow-[0_-24px_80px_rgba(15,23,42,0.28)] overflow-hidden`}
                        >
                            <div className="h-full flex flex-col">
                                <div className="bg-white/90 backdrop-blur-xl border-b border-white px-4 pt-2.5 pb-3 shrink-0">
                                    <div className="mx-auto mb-2 h-1.5 w-12 rounded-full bg-slate-300"></div>
                                    <div className="flex items-center justify-between gap-2">
                                        <button onClick={closePreviewSheet} className="h-10 w-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center" aria-label="Close preview">
                                            <X className="h-4 w-4" />
                                        </button>
                                        <div className="min-w-0 text-center">
                                            <div className="text-sm font-black text-slate-950 truncate">Live Preview</div>
                                            <div className="text-[11px] font-bold text-slate-500 truncate">{activeTemplate.name} template</div>
                                        </div>
                                        <button onClick={() => setIsPreviewExpanded(prev => !prev)} className="h-10 w-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center" aria-label={isPreviewExpanded ? 'Collapse preview' : 'Expand preview'}>
                                            {isPreviewExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    <div className="mt-3 flex items-center justify-center gap-2">
                                        <button onClick={() => canZoomOut && setMobileZoom(v => Math.max(0.75, +(v - 0.1).toFixed(2)))} disabled={!canZoomOut} className="h-9 w-9 rounded-2xl bg-white border border-slate-200 text-slate-700 disabled:opacity-40 flex items-center justify-center shadow-sm">
                                            <Minus className="h-4 w-4" />
                                        </button>
                                        <span className="h-9 min-w-14 px-3 rounded-2xl bg-white border border-slate-200 text-xs font-black text-slate-600 flex items-center justify-center shadow-sm">{Math.round(mobileZoom * 100)}%</span>
                                        <button onClick={() => canZoomIn && setMobileZoom(v => Math.min(1.35, +(v + 0.1).toFixed(2)))} disabled={!canZoomIn} className="h-9 w-9 rounded-2xl bg-white border border-slate-200 text-slate-700 disabled:opacity-40 flex items-center justify-center shadow-sm">
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                <div ref={previewContainerRef} className="flex-1 overflow-y-auto flex justify-center px-4 py-5 bg-slate-300">
                                    <div
                                        className="bg-white shadow-2xl origin-top transition-transform duration-300 ease-out"
                                        style={{
                                            width: '794px',
                                            minHeight: '1123px',
                                            transform: `scale(${previewTransformScale})`,
                                            marginBottom: `${1123 * previewTransformScale - 1123 + 110}px`
                                        }}
                                    >
                                        <ResumePreview resume={resume} />
                                    </div>
                                </div>

                                <div className="bg-white/92 backdrop-blur-xl border-t border-white px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] grid grid-cols-2 gap-3 shrink-0">
                                    <button onClick={closePreviewSheet} className="h-12 rounded-2xl bg-slate-100 text-slate-800 font-black">Edit</button>
                                    <button onClick={handleDownload} disabled={downloading} className="h-12 rounded-2xl bg-orange-500 text-white font-black shadow-lg shadow-orange-500/20 disabled:opacity-70 flex items-center justify-center">
                                        <Download className="h-4 w-4 mr-2" /> {downloading ? 'Downloading...' : 'Download PDF'}
                                    </button>
                                </div>
                            </div>
                        </MotionDiv>
                    </MotionDiv>
                )}
            </AnimatePresence>

            <nav className="md:hidden fixed left-3 right-3 bottom-2 z-40 rounded-[20px] bg-white/90 backdrop-blur-xl border border-white shadow-[0_18px_50px_rgba(15,23,42,0.16)] px-1.5 py-1.5 pb-[calc(0.35rem+env(safe-area-inset-bottom))]">
                <div className="grid grid-cols-4 gap-1">
                    {mobileTabs.map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeMobileTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => tab.id === 'preview' ? openPreviewSheet() : setActiveMobileTab(tab.id)}
                                className={`h-11 rounded-2xl flex flex-col items-center justify-center gap-0.5 text-[10px] font-black transition-all ${isActive ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-slate-500 hover:bg-slate-100'}`}
                            >
                                <Icon className="h-3.5 w-3.5" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </nav>

        </MotionDiv>
    );
};

export default Editor;
