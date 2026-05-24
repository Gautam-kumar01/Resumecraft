import { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import ResumePreview from '../components/ResumePreview';
import LoginModal from '../components/LoginModal';
import SEO from '../components/SEO';
import { Save, Download, Eye, ArrowLeft, Plus, Trash2, User, Upload, Sparkles, FileText, Briefcase, GraduationCap, Code, Folder, Layout, ChevronDown, ChevronUp, GripVertical, Settings } from 'lucide-react';
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
    <div className="border border-slate-200 rounded-2xl bg-white mb-4 overflow-hidden shadow-sm hover:shadow-md transition-all">
        <button 
            onClick={onToggle}
            className="w-full flex items-center justify-between p-5 bg-white hover:bg-slate-50 transition-colors"
        >
            <div className="flex items-center space-x-3 text-slate-900 font-bold text-lg">
                <div className="p-2 bg-orange-50 text-orange-500 rounded-xl">
                    {icon}
                </div>
                <span>{title}</span>
            </div>
            {isOpen ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
        </button>
        <AnimatePresence>
            {isOpen && (
                <MotionDiv
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-slate-100"
                >
                    <div className="p-6">
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
    const [isMobilePreview, setIsMobilePreview] = useState(false);
    const [isFullscreenPreview, setIsFullscreenPreview] = useState(false);
    
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
                    setResume(data);
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
                        setResume(JSON.parse(savedDraft));
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
    }, [isMobilePreview]);

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

            const clone = sourceEl.cloneNode(true);
            [clone, ...clone.querySelectorAll('*')].forEach(el => {
                el.style.transform = 'none';
                el.style.transition = 'none';
                el.style.animation = 'none';
                if (window.getComputedStyle(el).letterSpacing !== 'normal') {
                    el.style.letterSpacing = 'normal';
                }
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

    return (
        <MotionDiv 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-row h-[100dvh] overflow-hidden bg-slate-50 font-sans"
        >
            <SEO title={resume.title ? `${resume.title} - Editor` : "Resume Editor"} />
            <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onSuccess={handleLoginSuccess} title="🎉 Your resume is ready!" subtitle="Login or sign up to download and save your resume." />

            {/* Left Panel: Form & Editor */}
            <div className="w-[50%] md:w-[45%] lg:w-[40%] bg-slate-50 border-r border-slate-200 h-full flex flex-col z-10">
                
                {/* Header */}
                <div className="bg-white border-b border-slate-200 p-3 md:p-4 flex items-center justify-between shrink-0 shadow-sm z-20 relative">
                    <button onClick={() => navigate(user ? '/dashboard' : '/')} className="flex items-center text-slate-500 hover:text-orange-500 transition-colors font-bold text-sm">
                        <ArrowLeft className="h-4 w-4 mr-1 md:mr-2" /> 
                        <span className="hidden sm:inline">{user ? 'Dashboard' : 'Home'}</span>
                    </button>
                    <div className="flex items-center space-x-2 md:space-x-3">
                        <button onClick={() => setIsFullscreenPreview(!isFullscreenPreview)} className="hidden md:flex items-center px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors">
                            {isFullscreenPreview ? <Layout className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                            {isFullscreenPreview ? 'Show Editor' : 'Full Preview'}
                        </button>
                        <button onClick={() => setIsMobilePreview(true)} className="md:hidden flex items-center px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg font-bold text-xs">
                            <Eye className="h-3 w-3 mr-1.5" /> Fullscreen
                        </button>
                        <button onClick={handleSave} disabled={saving} className="flex items-center px-3 py-1.5 md:px-4 md:py-2 bg-slate-900 text-white rounded-lg md:rounded-xl hover:bg-slate-800 transition-colors font-bold shadow-sm disabled:opacity-70 text-xs md:text-sm">
                            <Save className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" /> {saving ? 'Saving...' : 'Save'}
                        </button>
                        <button onClick={handleDownload} disabled={downloading} className="flex items-center px-3 py-1.5 md:px-4 md:py-2 bg-orange-500 text-white rounded-lg md:rounded-xl hover:bg-orange-600 transition-colors font-bold shadow-sm disabled:opacity-70 text-xs md:text-sm">
                            <Download className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" /> {downloading ? 'Downloading...' : 'Download PDF'}
                        </button>
                    </div>
                </div>

                {/* Main Scrollable Form Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6 scroll-smooth bg-[#f8fafc]">
                    
                    {/* Document Title */}
                    <div className="mb-6">
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
                                        const val = e.target.value.trim();
                                        if (val && !resume.skills?.includes(val)) {
                                            setResume(prev => ({ ...prev, skills: [...(prev.skills || []), val] }));
                                        }
                                        e.target.value = '';
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

                    {/* Templates */}
                    <AccordionItem 
                        title="Templates" 
                        icon={<Layout className="h-5 w-5" />}
                        isOpen={openSection === 'templates'} 
                        onToggle={() => setOpenSection(openSection === 'templates' ? '' : 'templates')}
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { id: 'executive', name: 'Executive', desc: 'Premium Corporate' },
                                { id: 'modern', name: 'Modern', desc: 'Sleek & Clean' },
                                { id: 'visual', name: 'High-Impact', desc: 'Creative Sidebar' },
                                { id: 'elegant', name: 'Elegant', desc: 'Classic Serif' },
                                { id: 'government', name: 'Formal', desc: 'Strict Standard' },
                                { id: 'internship', name: 'Academic', desc: 'Education Focus' }
                            ].map(tpl => (
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

                    {/* Bottom Padding */}
                    <div className="h-24 md:h-8"></div>
                </div>
            </div>

            {/* Right Panel: Live Scaling Workspace Preview */}
            <div 
                ref={previewContainerRef}
                className={`w-[50%] md:w-[55%] lg:w-[60%] bg-slate-400 h-full overflow-y-auto flex justify-center py-4 md:py-10 relative transition-all duration-500 ${isMobilePreview ? 'absolute inset-0 z-50 !h-[100dvh]' : 'flex'}`}
            >
                {!isMobilePreview && (
                    <button
                        onClick={handleDownload}
                        disabled={downloading}
                        className="absolute top-4 right-4 z-20 flex items-center px-4 py-2 bg-orange-500 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-orange-600 transition-colors disabled:opacity-70"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        {downloading ? 'Downloading...' : 'Download PDF'}
                    </button>
                )}

                {/* Mobile Preview Header */}
                {isMobilePreview && (
                    <div className="fixed top-0 left-0 right-0 bg-slate-900 text-white p-4 flex justify-between items-center z-50 shadow-lg">
                        <button onClick={() => setIsMobilePreview(false)} className="flex items-center text-sm font-bold">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Editor
                        </button>
                        <button onClick={handleDownload} disabled={downloading} className="flex items-center text-sm font-bold bg-orange-500 px-4 py-1.5 rounded-lg disabled:opacity-70">
                            <Download className="w-4 h-4 mr-2" /> {downloading ? 'Downloading...' : 'Download PDF'}
                        </button>
                    </div>
                )}

                <div 
                    className={`resume-print-area bg-white shadow-2xl origin-top transition-transform duration-300 ease-out ${isMobilePreview ? 'mt-12' : ''}`}
                    style={{
                        width: '794px',
                        minHeight: '1123px',
                        transform: `scale(${previewScale})`,
                        marginBottom: `${1123 * previewScale - 1123 + 40}px` // Compensate for scaled height padding
                    }}
                >
                    <ResumePreview resume={resume} />
                </div>
            </div>

        </MotionDiv>
    );
};

export default Editor;
