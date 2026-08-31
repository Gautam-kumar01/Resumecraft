import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Check,
  FileText,
  GraduationCap,
  LoaderCircle,
  Sparkles,
  Upload,
  UserRound,
  X,
} from 'lucide-react';
import api from '../api/axios';
import { createEmptyResume, EXPERIENCE_LEVELS, TARGET_ROLES, TEMPLATE_OPTIONS } from '../data/resumeBuilder';
import { trackEvent } from '../utils/analytics';

const MotionDiv = motion.div;

const inputClass = 'w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100';
const labelClass = 'mb-1.5 block text-xs font-black uppercase tracking-[0.14em] text-slate-500';

const emptyContent = { education: '', skills: '', experience: '', projects: '', certifications: '', achievements: '' };

const parseList = (value) => String(value || '')
  .split(/[\n,]/)
  .map((item) => item.trim())
  .filter(Boolean);

const toHtmlList = (value) => {
  const items = String(value || '').split('\n').map((item) => item.trim()).filter(Boolean);
  return items.length ? `<ul>${items.map((item) => `<li>${item.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</li>`).join('')}</ul>` : '';
};

const ResumeOnboarding = ({ isOpen, onClose, onOpenEditor }) => {
  const [mode, setMode] = useState('choose');
  const [step, setStep] = useState(1);
  const [targetRole, setTargetRole] = useState('');
  const [personalInfo, setPersonalInfo] = useState({ fullName: '', email: '', phone: '', address: '', linkedin: '', github: '', website: '' });
  const [experienceLevel, setExperienceLevel] = useState('');
  const [content, setContent] = useState(emptyContent);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [importError, setImportError] = useState('');
  const [aiUnavailable, setAiUnavailable] = useState(false);
  const fileInputRef = useRef(null);

  const reset = () => {
    setMode('choose');
    setStep(1);
    setTargetRole('');
    setPersonalInfo({ fullName: '', email: '', phone: '', address: '', linkedin: '', github: '', website: '' });
    setExperienceLevel('');
    setContent(emptyContent);
    setSelectedTemplate('modern');
    setUploading(false);
    setUploadedFile(null);
    setImportError('');
    setAiUnavailable(false);
  };

  const close = () => {
    reset();
    onClose();
  };

  const openMode = (nextMode) => {
    setMode(nextMode);
    trackEvent(nextMode === 'ai' ? 'ai_builder_started' : nextMode === 'scratch' ? 'scratch_builder_started' : 'resume_builder_started', { source: 'homepage' });
    if (nextMode === 'upload') window.setTimeout(() => fileInputRef.current?.click(), 0);
  };

  const persistDraft = (draft, eventName = 'resume_builder_started') => {
    localStorage.setItem('guest_resume_draft', JSON.stringify(draft));
    trackEvent(eventName, { source: 'onboarding', template_id: draft.templateId || 'modern' });
    onOpenEditor(draft);
    close();
  };

  const handleAiFinish = async () => {
    setUploading(true);
    setAiUnavailable(false);
    const draft = createEmptyResume({
      title: targetRole ? `${targetRole} Resume` : 'My Resume',
      targetRole,
      experienceLevel,
      personalInfo,
      templateId: selectedTemplate,
      summary: '',
      skills: parseList(content.skills),
      education: content.education ? [{ institution: content.education, degree: '', startDate: '', endDate: '', description: '' }] : [],
      experience: content.experience ? [{ position: targetRole, company: '', location: '', startDate: '', endDate: '', description: toHtmlList(content.experience) }] : [],
      projects: content.projects ? [{ name: 'Project', description: toHtmlList(content.projects), link: '', technologies: [] }] : [],
      certifications: parseList(content.certifications).map((name) => ({ name, issuer: '', date: '' })),
      achievements: parseList(content.achievements).map((name) => ({ name })),
    });

    try {
      const { data } = await api.post('/ai/suggest', {
        jobRole: targetRole,
        resumeContext: {
          experienceLevel,
          skills: draft.skills,
          education: content.education,
          experience: content.experience,
          projects: content.projects,
        },
      });
      draft.summary = data.summary || '';
      if (!draft.skills.length && Array.isArray(data.skills)) draft.skills = data.skills;
      if (!draft.experience.length && Array.isArray(data.bullets) && data.bullets.length) {
        draft.customSections = [{ title: 'AI starter bullets — review before using', content: toHtmlList(data.bullets) }];
      }
    } catch {
      setAiUnavailable(true);
      trackEvent('ai_generation_failed', { feature: 'onboarding' });
    } finally {
      setUploading(false);
      persistDraft(draft, 'resume_created');
    }
  };

  const handleScratchFinish = () => {
    const template = TEMPLATE_OPTIONS.find((item) => item.id === selectedTemplate);
    const draft = createEmptyResume({
      title: 'My Resume',
      templateId: selectedTemplate,
      customization: { accentColor: template?.accent || '#f97316' },
    });
    trackEvent('template_selected', { template_id: selectedTemplate, source: 'onboarding' });
    persistDraft(draft, 'scratch_builder_started');
  };

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setImportError('');
    if (file.size > 5 * 1024 * 1024) {
      setImportError('This file is larger than 5 MB. Please choose a smaller PDF or DOCX.');
      return;
    }
    const extension = file.name.toLowerCase().split('.').pop();
    if (!['pdf', 'docx'].includes(extension)) {
      setImportError('Please upload a valid PDF or DOCX file.');
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      const { data } = await api.post('/ai/import-resume', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setUploadedFile({ ...data, filename: file.name });
      setMode('review');
      trackEvent('resume_uploaded', { file_type: extension });
    } catch (error) {
      setImportError(error.response?.data?.message || 'Unable to read this file. Please upload a valid PDF or DOCX.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleImportedContinue = () => {
    if (!uploadedFile) return;
    persistDraft(createEmptyResume({ ...uploadedFile.resume, title: uploadedFile.resume.title || 'Imported Resume' }), 'resume_created');
  };

  const updatePersonalInfo = (field, value) => setPersonalInfo((previous) => ({ ...previous, [field]: value }));
  const updateContent = (field, value) => setContent((previous) => ({ ...previous, [field]: value }));

  const canContinue = mode === 'ai'
    ? (step === 1 ? targetRole.trim().length > 1 : step === 2 ? personalInfo.fullName.trim().length > 1 : step === 3 ? Boolean(experienceLevel) : true)
    : true;

  return (
    <AnimatePresence>
      {isOpen && (
        <MotionDiv className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <MotionDiv role="dialog" aria-modal="true" aria-labelledby="resume-onboarding-title" className="relative max-h-[min(860px,calc(100vh-2rem))] w-full max-w-3xl overflow-y-auto rounded-[2rem] bg-white shadow-2xl" initial={{ y: 24, scale: 0.98 }} animate={{ y: 0, scale: 1 }} exit={{ y: 24, scale: 0.98 }}>
            <button type="button" onClick={close} className="absolute right-5 top-5 z-10 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900" aria-label="Close resume onboarding"><X className="h-5 w-5" /></button>
            <div className="border-b border-slate-100 bg-gradient-to-br from-orange-50 via-white to-slate-50 px-6 pb-6 pt-8 sm:px-10 sm:pt-10">
              <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-orange-600"><Sparkles className="h-4 w-4" /> Resume builder</div>
              <h2 id="resume-onboarding-title" className="pr-10 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{mode === 'choose' ? 'Create your resume' : mode === 'review' ? 'Review imported information' : mode === 'scratch' ? 'Choose a starting template' : 'Build with AI'}</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">{mode === 'choose' ? 'Start with a guided path or jump straight into the professional editor.' : mode === 'review' ? 'We found this information. Review it now, then make any edits in the editor before saving.' : mode === 'scratch' ? 'Pick a layout now. You can change the template and styling later.' : 'Answer a few focused questions. Your answers stay reviewable and editable.'}</p>
              {mode === 'ai' && <div className="mt-6 flex items-center gap-2">{[1, 2, 3, 4].map((item) => <div key={item} className={`h-1.5 flex-1 rounded-full ${item <= step ? 'bg-orange-500' : 'bg-slate-200'}`} />)}</div>}
            </div>

            <div className="p-6 sm:p-10">
              {mode === 'choose' && (
                <div className="grid gap-4 sm:grid-cols-3">
                  <button type="button" onClick={() => openMode('ai')} className="group rounded-3xl border border-orange-200 bg-orange-50 p-5 text-left transition hover:-translate-y-1 hover:border-orange-400 hover:shadow-xl hover:shadow-orange-100">
                    <span className="mb-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white"><Sparkles className="h-6 w-6" /></span>
                    <h3 className="text-lg font-black text-slate-950">Build with AI</h3><p className="mt-2 text-sm leading-6 text-slate-500">Create a professional first draft with guided AI assistance.</p><span className="mt-5 inline-flex items-center text-sm font-black text-orange-600">Get started <ArrowRight className="ml-1 h-4 w-4 transition group-hover:translate-x-1" /></span>
                  </button>
                  <button type="button" onClick={() => openMode('scratch')} className="group rounded-3xl border border-slate-200 bg-white p-5 text-left transition hover:-translate-y-1 hover:border-slate-400 hover:shadow-xl">
                    <span className="mb-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white"><FileText className="h-6 w-6" /></span>
                    <h3 className="text-lg font-black text-slate-950">Start from Scratch</h3><p className="mt-2 text-sm leading-6 text-slate-500">Build manually with a polished editor and live preview.</p><span className="mt-5 inline-flex items-center text-sm font-black text-slate-700">Choose a template <ArrowRight className="ml-1 h-4 w-4 transition group-hover:translate-x-1" /></span>
                  </button>
                  <button type="button" onClick={() => openMode('upload')} className="group rounded-3xl border border-slate-200 bg-white p-5 text-left transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl">
                    <span className="mb-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"><Upload className="h-6 w-6" /></span>
                    <h3 className="text-lg font-black text-slate-950">Upload Existing Resume</h3><p className="mt-2 text-sm leading-6 text-slate-500">Import a PDF or DOCX and review the extracted information.</p><span className="mt-5 inline-flex items-center text-sm font-black text-blue-600">Upload file <ArrowRight className="ml-1 h-4 w-4 transition group-hover:translate-x-1" /></span>
                  </button>
                </div>
              )}

              {mode === 'scratch' && (
                <div>
                  <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{TEMPLATE_OPTIONS.map((template) => <button type="button" key={template.id} onClick={() => setSelectedTemplate(template.id)} className={`rounded-2xl border p-4 text-left transition ${selectedTemplate === template.id ? 'border-orange-500 bg-orange-50 ring-4 ring-orange-100' : 'border-slate-200 hover:border-slate-400'}`}><div className="mb-4 flex items-center justify-between"><div className="h-16 w-12 rounded border-4 border-white bg-slate-100 shadow-sm" style={{ boxShadow: `inset 7px 0 0 ${template.accent}` }} /><span className={`rounded-full px-2 py-1 text-[10px] font-black uppercase tracking-wider ${selectedTemplate === template.id ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-500'}`}>{template.category}</span></div><h3 className="font-black text-slate-900">{template.name}</h3><p className="mt-1 text-xs leading-5 text-slate-500">{template.description}</p></button>)}</div>
                  <button type="button" onClick={handleScratchFinish} className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-black text-white transition hover:bg-orange-500">Open editor <ArrowRight className="ml-2 h-4 w-4" /></button>
                </div>
              )}

              {mode === 'upload' && (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center"><input ref={fileInputRef} type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleUpload} className="hidden" /><div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-blue-600 shadow-sm"><Upload className="h-7 w-7" /></div><h3 className="text-xl font-black text-slate-950">Upload a PDF or DOCX</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">Maximum file size 5 MB. We will extract information into a reviewable draft and never overwrite an existing resume.</p><button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="mt-6 inline-flex items-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white hover:bg-orange-500 disabled:opacity-60">{uploading ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />} {uploading ? 'Reading file…' : 'Choose file'}</button>{importError && <p className="mt-4 text-sm font-bold text-red-600">{importError}</p>}</div>
              )}

              {mode === 'review' && uploadedFile && (
                <div className="space-y-5"><div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"><strong>{uploadedFile.filename}</strong> was parsed. Check the extracted information in the editor before saving.</div><div className="grid gap-4 sm:grid-cols-2">{[['Name', uploadedFile.resume.personalInfo?.fullName], ['Email', uploadedFile.resume.personalInfo?.email], ['Phone', uploadedFile.resume.personalInfo?.phone], ['Location', uploadedFile.resume.personalInfo?.address], ['LinkedIn', uploadedFile.resume.personalInfo?.linkedin], ['GitHub', uploadedFile.resume.personalInfo?.github]].map(([label, value]) => <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-[10px] font-black uppercase tracking-wider text-slate-400">{label}</p><p className="mt-1 min-h-5 text-sm font-bold text-slate-800">{value || 'Not found'}</p></div>)}</div><div className="rounded-2xl border border-slate-200 p-4"><p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Detected sections</p><p className="mt-2 text-sm font-semibold text-slate-700">{[uploadedFile.resume.summary && 'Summary', uploadedFile.resume.experience?.length && 'Experience', uploadedFile.resume.education?.length && 'Education', uploadedFile.resume.skills?.length && 'Skills', uploadedFile.resume.projects?.length && 'Projects', uploadedFile.resume.certifications?.length && 'Certifications'].filter(Boolean).join(' · ') || 'Only basic contact information was found.'}</p></div><button type="button" onClick={handleImportedContinue} className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-black text-white hover:bg-orange-500">Continue to Resume Editor <ArrowRight className="ml-2 h-4 w-4" /></button></div>
              )}

              {mode === 'ai' && (
                <div className="space-y-6">
                  {step === 1 && <div><label className={labelClass}>What job are you targeting?</label><input autoFocus value={targetRole} onChange={(event) => setTargetRole(event.target.value)} list="resume-target-roles" placeholder="e.g. Frontend Developer" className={inputClass} /><datalist id="resume-target-roles">{TARGET_ROLES.map((role) => <option key={role} value={role} />)}</datalist><div className="mt-3 flex flex-wrap gap-2">{TARGET_ROLES.slice(0, 6).map((role) => <button type="button" key={role} onClick={() => setTargetRole(role)} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700">{role}</button>)}</div></div>}
                  {step === 2 && <div><div className="mb-5 flex items-center gap-3"><div className="rounded-2xl bg-orange-50 p-3 text-orange-600"><UserRound className="h-5 w-5" /></div><div><h3 className="font-black text-slate-950">Let’s add your contact details</h3><p className="text-sm text-slate-500">Only the fields you want to include are needed.</p></div></div><div className="grid gap-4 sm:grid-cols-2">{[['fullName', 'Full name', 'Aarav Sharma'], ['email', 'Email', 'you@example.com'], ['phone', 'Phone', '+91 98765 43210'], ['address', 'Location', 'Bengaluru, India'], ['linkedin', 'LinkedIn', 'linkedin.com/in/you'], ['github', 'GitHub', 'github.com/you'], ['website', 'Portfolio', 'yourportfolio.com']].map(([field, label, placeholder]) => <div key={field} className={field === 'fullName' || field === 'address' ? 'sm:col-span-2' : ''}><label className={labelClass}>{label}{field === 'fullName' ? ' *' : ''}</label><input value={personalInfo[field]} onChange={(event) => updatePersonalInfo(field, event.target.value)} placeholder={placeholder} className={inputClass} /></div>)}</div></div>}
                  {step === 3 && <div><div className="mb-5 flex items-center gap-3"><div className="rounded-2xl bg-blue-50 p-3 text-blue-600"><BriefcaseBusiness className="h-5 w-5" /></div><div><h3 className="font-black text-slate-950">How much experience do you have?</h3><p className="text-sm text-slate-500">This helps us set the right tone for your draft.</p></div></div><div className="grid gap-3 sm:grid-cols-2">{EXPERIENCE_LEVELS.map((level) => <button type="button" key={level.id} onClick={() => setExperienceLevel(level.id)} className={`rounded-2xl border p-4 text-left ${experienceLevel === level.id ? 'border-orange-500 bg-orange-50 ring-4 ring-orange-100' : 'border-slate-200 hover:border-slate-400'}`}><div className="flex items-center justify-between"><span className="font-black text-slate-900">{level.label}</span>{experienceLevel === level.id && <Check className="h-5 w-5 text-orange-600" />}</div><p className="mt-1 text-sm text-slate-500">{level.description}</p></button>)}</div></div>}
                  {step === 4 && <div><div className="mb-5 flex items-center gap-3"><div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600"><GraduationCap className="h-5 w-5" /></div><div><h3 className="font-black text-slate-950">Add what you already know</h3><p className="text-sm text-slate-500">Optional fields are safe to skip. You can refine everything later.</p></div></div><div className="grid gap-4 sm:grid-cols-2">{[['education', 'Education', 'BCA, ABC University, 2022'], ['skills', 'Skills', 'React, Excel, Communication'], ['experience', 'Experience', 'Write a few responsibilities, one per line'], ['projects', 'Projects', 'Project name and what you built'], ['certifications', 'Certifications', 'Certification names, separated by commas'], ['achievements', 'Achievements', 'Awards or achievements, separated by commas']].map(([field, label, placeholder]) => <div key={field} className={field === 'experience' || field === 'projects' ? 'sm:col-span-2' : ''}><label className={labelClass}>{label}</label><textarea rows={field === 'experience' || field === 'projects' ? 4 : 2} value={content[field]} onChange={(event) => updateContent(field, event.target.value)} placeholder={placeholder} className={inputClass} /></div>)}</div></div>}
                  {aiUnavailable && <p className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-800">AI is temporarily unavailable. Your information is ready in the editor and you can continue manually.</p>}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-5"><button type="button" onClick={() => step === 1 ? setMode('choose') : setStep((value) => value - 1)} className="inline-flex items-center rounded-xl px-3 py-2 text-sm font-black text-slate-500 hover:bg-slate-100"><ArrowLeft className="mr-2 h-4 w-4" /> Back</button>{step < 4 ? <button type="button" disabled={!canContinue} onClick={() => setStep((value) => value + 1)} className="inline-flex items-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-40">Continue <ArrowRight className="ml-2 h-4 w-4" /></button> : <button type="button" disabled={uploading} onClick={handleAiFinish} className="inline-flex items-center rounded-xl bg-orange-500 px-5 py-3 text-sm font-black text-white hover:bg-orange-600 disabled:opacity-60">{uploading ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />} {uploading ? 'Preparing draft…' : 'Create my draft'}</button>}</div>
                </div>
              )}
            </div>
          </MotionDiv>
        </MotionDiv>
      )}
    </AnimatePresence>
  );
};

export default ResumeOnboarding;
