
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Save, Download, ArrowLeft, Send, User, Building, Calendar, FileText, Type, Wand2, Sparkles, Brain } from 'lucide-react';

const CoverLetterEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [coverLetter, setCoverLetter] = useState({
        title: 'Untitled Cover Letter',
        recipientName: '',
        companyName: '',
        companyAddress: '',
        date: new Date().toLocaleDateString(),
        subject: '',
        salutation: '',
        introduction: '',
        bodyParagraph1: '',
        bodyParagraph2: '',
        conclusion: '',
        closing: '',
        userName: '',
        userTitle: ''
    });

    useEffect(() => {
        if (id) {
            const fetchCoverLetter = async () => {
                try {
                    const { data } = await api.get(`/cover-letters/${id}`);
                    setCoverLetter(data);
                } catch (error) {
                    console.error('Failed to fetch cover letter', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchCoverLetter();
        } else {
            setLoading(false);
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCoverLetter(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            if (id) {
                await api.put(`/cover-letters/${id}`, coverLetter);
            } else {
                const { data } = await api.post('/cover-letters', coverLetter);
                navigate(`/cover-letter-editor/${data._id}`);
            }
        } catch (error) {
            console.error('Failed to save cover letter', error);
        } finally {
            setSaving(false);
        }
    };

    const handleDownload = () => {
        window.print();
    };

    const handleAiRewrite = async (section) => {
        const sectionLabels = {
            introduction: 'Introduction',
            bodyParagraph1: 'Experience Paragraph',
            bodyParagraph2: 'Company Fit Paragraph',
            conclusion: 'Conclusion'
        };

        try {
            const { data } = await api.post('/ai/generate-cover-letter', {
                jobRole: coverLetter.userTitle || 'Professional',
                companyName: coverLetter.companyName,
                tone: 'Professional',
                section: section // Customizing the prompt for specific section if needed
            });

            // The AI currently returns a full object, we can pick the relevant part or 
            // since our AI endpoint returns a full structure, we'll just use the specific part
            if (data[section]) {
                setCoverLetter(prev => ({ ...prev, [section]: data[section] }));
            } else {
                // If the AI returns a generic response, use the corresponding field
                setCoverLetter(prev => ({ ...prev, [section]: data.introduction || data.bodyParagraph1 || data.conclusion }));
            }
        } catch (error) {
            console.error(`Failed to rewrite ${section}`, error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Toolbar */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-4 mb-8 no-print">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                        <button 
                            onClick={() => navigate('/dashboard')}
                            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5 text-slate-600" />
                        </button>
                        <input
                            type="text"
                            name="title"
                            value={coverLetter.title}
                            onChange={handleChange}
                            className="text-xl font-bold text-slate-900 bg-transparent border-none focus:ring-0 w-full md:w-64"
                            placeholder="Cover Letter Title"
                        />
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center space-x-2 px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all disabled:opacity-50"
                        >
                            <Save className="h-4 w-4" />
                            <span>{saving ? 'Saving...' : 'Save'}</span>
                        </button>
                        <button
                            onClick={handleDownload}
                            className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
                        >
                            <Download className="h-4 w-4" />
                            <span>Download PDF</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12">
                {/* Editor Side */}
                <div className="space-y-8 no-print">
                    <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="p-2 bg-orange-500/10 rounded-lg">
                                <User className="h-5 w-5 text-orange-600" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">Personal & Recipient Info</h2>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Your Name</label>
                                <input
                                    type="text"
                                    name="userName"
                                    value={coverLetter.userName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 transition-all"
                                    placeholder="Alex Dev"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Your Title</label>
                                <input
                                    type="text"
                                    name="userTitle"
                                    value={coverLetter.userTitle}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 transition-all"
                                    placeholder="Software Engineer"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Recipient Name</label>
                                <input
                                    type="text"
                                    name="recipientName"
                                    value={coverLetter.recipientName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 transition-all"
                                    placeholder="Hiring Manager"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Company Name</label>
                                <input
                                    type="text"
                                    name="companyName"
                                    value={coverLetter.companyName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 transition-all"
                                    placeholder="Tech Corp"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Company Address</label>
                                <input
                                    type="text"
                                    name="companyAddress"
                                    value={coverLetter.companyAddress}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 transition-all"
                                    placeholder="123 Innovation Way, CA"
                                />
                            </div>
                        </div>
                    </section>

                    <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="p-2 bg-orange-500/10 rounded-lg">
                                <FileText className="h-5 w-5 text-orange-600" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">Content</h2>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={coverLetter.subject}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 transition-all font-bold"
                                    placeholder="Application for Software Engineer"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Salutation</label>
                                <input
                                    type="text"
                                    name="salutation"
                                    value={coverLetter.salutation}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 transition-all"
                                    placeholder="Dear Hiring Manager,"
                                />
                            </div>
                            <div className="relative group/field">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Introduction</label>
                                    <button 
                                        onClick={() => handleAiRewrite('introduction')}
                                        className="text-[10px] font-bold text-orange-600 hover:text-orange-700 flex items-center space-x-1 opacity-0 group-hover/field:opacity-100 transition-opacity"
                                    >
                                        <Wand2 className="h-3 w-3" />
                                        <span>AI Rewrite</span>
                                    </button>
                                </div>
                                <textarea
                                    name="introduction"
                                    value={coverLetter.introduction}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 transition-all resize-none"
                                    placeholder="I am writing to express my interest..."
                                />
                            </div>
                            <div className="relative group/field">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Body Paragraph 1 (Experience)</label>
                                    <button 
                                        onClick={() => handleAiRewrite('bodyParagraph1')}
                                        className="text-[10px] font-bold text-orange-600 hover:text-orange-700 flex items-center space-x-1 opacity-0 group-hover/field:opacity-100 transition-opacity"
                                    >
                                        <Wand2 className="h-3 w-3" />
                                        <span>AI Rewrite</span>
                                    </button>
                                </div>
                                <textarea
                                    name="bodyParagraph1"
                                    value={coverLetter.bodyParagraph1}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 transition-all resize-none"
                                    placeholder="In my previous role..."
                                />
                            </div>
                            <div className="relative group/field">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Body Paragraph 2 (Why This Company?)</label>
                                    <button 
                                        onClick={() => handleAiRewrite('bodyParagraph2')}
                                        className="text-[10px] font-bold text-orange-600 hover:text-orange-700 flex items-center space-x-1 opacity-0 group-hover/field:opacity-100 transition-opacity"
                                    >
                                        <Wand2 className="h-3 w-3" />
                                        <span>AI Rewrite</span>
                                    </button>
                                </div>
                                <textarea
                                    name="bodyParagraph2"
                                    value={coverLetter.bodyParagraph2}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 transition-all resize-none"
                                    placeholder="Your company stands out because..."
                                />
                            </div>
                            <div className="relative group/field">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Conclusion</label>
                                    <button 
                                        onClick={() => handleAiRewrite('conclusion')}
                                        className="text-[10px] font-bold text-orange-600 hover:text-orange-700 flex items-center space-x-1 opacity-0 group-hover/field:opacity-100 transition-opacity"
                                    >
                                        <Wand2 className="h-3 w-3" />
                                        <span>AI Rewrite</span>
                                    </button>
                                </div>
                                <textarea
                                    name="conclusion"
                                    value={coverLetter.conclusion}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 transition-all resize-none"
                                    placeholder="Thank you for your time and consideration..."
                                />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Closing</label>
                                    <input
                                        type="text"
                                        name="closing"
                                        value={coverLetter.closing}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 transition-all"
                                        placeholder="Sincerely,"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Preview Side */}
                <div className="sticky top-28 h-fit">
                    <div id="cover-letter-preview" className="bg-white p-12 shadow-2xl rounded-sm min-h-[1056px] w-full text-slate-800 font-serif print:shadow-none print:p-0 print:m-0">
                        <div className="mb-12">
                            <h1 className="text-4xl font-bold text-slate-900 mb-1">{coverLetter.userName || 'Your Name'}</h1>
                            <p className="text-lg text-slate-600">{coverLetter.userTitle || 'Professional Title'}</p>
                        </div>

                        <div className="mb-8">
                            <p className="mb-1">{coverLetter.date}</p>
                        </div>

                        <div className="mb-8">
                            <p className="font-bold">{coverLetter.recipientName || 'Recipient Name'}</p>
                            <p>{coverLetter.companyName || 'Company Name'}</p>
                            <p>{coverLetter.companyAddress || 'Company Address'}</p>
                        </div>

                        <div className="mb-8 font-bold border-b-2 border-slate-900 pb-2">
                            {coverLetter.subject ? `RE: ${coverLetter.subject}` : 'Subject Line'}
                        </div>

                        <div className="space-y-6 text-justify leading-relaxed">
                            <p>{coverLetter.salutation || 'Dear Hiring Manager,'}</p>
                            <p>{coverLetter.introduction || 'Click to edit your introduction...'}</p>
                            <p>{coverLetter.bodyParagraph1 || 'Click to edit your first paragraph...'}</p>
                            <p>{coverLetter.bodyParagraph2 || 'Click to edit your second paragraph...'}</p>
                            <p>{coverLetter.conclusion || 'Click to edit your conclusion...'}</p>
                        </div>

                        <div className="mt-12">
                            <p>{coverLetter.closing || 'Sincerely,'}</p>
                            <div className="mt-8">
                                <p className="font-bold text-xl font-sans text-slate-400 opacity-20 uppercase tracking-[0.2em] mb-2 select-none">Signature</p>
                                <p className="font-bold">{coverLetter.userName || 'Your Name'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoverLetterEditor;
