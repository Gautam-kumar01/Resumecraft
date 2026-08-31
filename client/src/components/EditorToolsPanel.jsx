import { useState } from 'react';
import { Check, ChevronDown, ChevronUp, LoaderCircle, RotateCcw, Sparkles, WandSparkles } from 'lucide-react';
import api from '../api/axios';
import { trackEvent } from '../utils/analytics';

const ACTIONS = ['Improve', 'ATS Optimize', 'Make Professional', 'Make Concise', 'Add Metrics', 'Rewrite'];
const inputClass = 'w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100';
const smallButton = 'rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-600 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700 disabled:opacity-50';

const Metric = ({ label, value }) => <div className="rounded-2xl border border-slate-200 bg-white p-3"><p className="text-[10px] font-black uppercase tracking-wider text-slate-400">{label}</p><p className="mt-1 text-2xl font-black text-slate-950">{value}%</p></div>;

const EditorToolsPanel = ({ activeTool, resume, setResume, onResetCustomization }) => {
  const [copilotText, setCopilotText] = useState('');
  const [copilotResult, setCopilotResult] = useState(null);
  const [copilotLoading, setCopilotLoading] = useState(false);
  const [summaryOptions, setSummaryOptions] = useState([]);
  const [skillsResult, setSkillsResult] = useState(null);
  const [ats, setAts] = useState(null);
  const [atsLoading, setAtsLoading] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [match, setMatch] = useState(null);
  const [matchLoading, setMatchLoading] = useState(false);
  const [tailor, setTailor] = useState(null);
  const [tailorLoading, setTailorLoading] = useState(false);

  const runCopilot = async (action) => {
    const text = copilotText.trim();
    if (!text) return;
    setCopilotLoading(true);
    setCopilotResult(null);
    try {
      const { data } = await api.post('/ai/improve-text', { text, action, section: 'resume', resumeContext: resume });
      setCopilotResult(data);
      trackEvent('ai_improvement_used', { action });
    } catch (error) {
      setCopilotResult({ error: error.response?.data?.message || 'AI is temporarily unavailable. You can continue editing manually.' });
    } finally {
      setCopilotLoading(false);
    }
  };

  const generateSummaryOptions = async () => {
    setCopilotLoading(true);
    try {
      const { data } = await api.post('/ai/summary-options', { targetRole: resume.targetRole || 'the target role', experienceLevel: resume.experienceLevel, skills: resume.skills, experience: resume.experience, projects: resume.projects });
      setSummaryOptions(data.options || []);
    } catch (error) {
      setCopilotResult({ error: error.response?.data?.message || 'AI is temporarily unavailable. You can continue editing manually.' });
    } finally {
      setCopilotLoading(false);
    }
  };

  const generateSkills = async () => {
    setCopilotLoading(true);
    try {
      const { data } = await api.post('/ai/suggest-skills', { targetRole: resume.targetRole, currentSkills: resume.skills });
      setSkillsResult(data);
    } catch (error) {
      setCopilotResult({ error: error.response?.data?.message || 'AI is temporarily unavailable. You can continue editing manually.' });
    } finally {
      setCopilotLoading(false);
    }
  };

  const analyze = async () => {
    setAtsLoading(true);
    try {
      const { data } = await api.post('/ai/analyze-ats', { resume });
      setAts(data);
      trackEvent('ats_check_completed', { score: data.score });
    } catch (error) {
      setAts({ error: error.response?.data?.message || 'Unable to analyze this resume right now.' });
    } finally {
      setAtsLoading(false);
    }
  };

  const runMatch = async () => {
    if (!jobDescription.trim()) return;
    setMatchLoading(true);
    setTailor(null);
    try {
      const { data } = await api.post('/ai/match-job', { resume, jobDescription });
      setMatch(data);
      trackEvent('job_match_completed', { score: data.score });
    } catch (error) {
      setMatch({ error: error.response?.data?.message || 'Unable to match this job description right now.' });
    } finally {
      setMatchLoading(false);
    }
  };

  const runTailor = async () => {
    if (!jobDescription.trim()) return;
    setTailorLoading(true);
    try {
      const { data } = await api.post('/ai/tailor-resume', { resume, jobDescription });
      setTailor(data);
    } catch (error) {
      setTailor({ error: error.response?.data?.message || 'AI is temporarily unavailable. You can continue editing manually.' });
    } finally {
      setTailorLoading(false);
    }
  };

  const applySummary = (summary) => setResume((previous) => ({ ...previous, summary }));
  const addSkills = (skills) => setResume((previous) => ({ ...previous, skills: [...new Set([...(previous.skills || []), ...skills])] }));

  if (activeTool === 'customize') {
    const customization = resume.customization || {};
    const setCustomization = (field, value) => setResume((previous) => ({ ...previous, customization: { ...(previous.customization || {}), [field]: value } }));
    return <div className="space-y-5"><div><p className="text-xs font-black uppercase tracking-[0.16em] text-orange-500">Design controls</p><h3 className="mt-1 text-2xl font-black text-slate-950">Make it yours</h3><p className="mt-2 text-sm leading-6 text-slate-500">These settings affect the live preview and are saved with the resume.</p></div><div className="grid gap-4 sm:grid-cols-2"><label className="text-xs font-black text-slate-500">Font<select value={customization.fontFamily || 'Inter'} onChange={(event) => setCustomization('fontFamily', event.target.value)} className={`${inputClass} mt-1`}><option>Inter</option><option>Arial</option><option>Georgia</option><option>Trebuchet MS</option></select></label><label className="text-xs font-black text-slate-500">Accent color<div className="mt-1 flex items-center gap-3"><input type="color" value={customization.accentColor || '#f97316'} onChange={(event) => setCustomization('accentColor', event.target.value)} className="h-12 w-16 rounded-xl border border-slate-200 bg-white p-1" /><input value={customization.accentColor || '#f97316'} onChange={(event) => setCustomization('accentColor', event.target.value)} className={`${inputClass} flex-1`} /></div></label><label className="text-xs font-black text-slate-500">Font size <input type="range" min="11" max="18" value={customization.fontSize || 14} onChange={(event) => setCustomization('fontSize', Number(event.target.value))} className="mt-3 w-full accent-orange-500" /><span className="text-slate-900">{customization.fontSize || 14}px</span></label><label className="text-xs font-black text-slate-500">Heading size <input type="range" min="10" max="20" value={customization.headingSize || 13} onChange={(event) => setCustomization('headingSize', Number(event.target.value))} className="mt-3 w-full accent-orange-500" /><span className="text-slate-900">{customization.headingSize || 13}px</span></label><label className="text-xs font-black text-slate-500">Line spacing <input type="range" min="1.1" max="1.9" step="0.05" value={customization.lineSpacing || 1.45} onChange={(event) => setCustomization('lineSpacing', Number(event.target.value))} className="mt-3 w-full accent-orange-500" /><span className="text-slate-900">{customization.lineSpacing || 1.45}</span></label><label className="text-xs font-black text-slate-500">Section spacing <input type="range" min="8" max="36" value={customization.sectionSpacing || 20} onChange={(event) => setCustomization('sectionSpacing', Number(event.target.value))} className="mt-3 w-full accent-orange-500" /><span className="text-slate-900">{customization.sectionSpacing || 20}px</span></label></div><button type="button" onClick={onResetCustomization} className={smallButton}><RotateCcw className="mr-2 inline h-3.5 w-3.5" /> Reset customization</button></div>;
  }

  if (activeTool === 'ats') return <div className="space-y-5"><div><p className="text-xs font-black uppercase tracking-[0.16em] text-orange-500">Resume health</p><h3 className="mt-1 text-2xl font-black text-slate-950">ATS score</h3><p className="mt-2 text-sm leading-6 text-slate-500">A transparent checklist for structure, keywords, formatting, readability, and impact. It is guidance, not a guarantee.</p></div><button type="button" onClick={analyze} disabled={atsLoading} className="inline-flex items-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white hover:bg-orange-500 disabled:opacity-60">{atsLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />} {atsLoading ? 'Analyzing…' : 'Analyze my resume'}</button>{ats?.error && <p className="rounded-2xl bg-red-50 p-3 text-sm font-bold text-red-700">{ats.error}</p>}{ats && !ats.error && <><div className="flex items-center gap-5 rounded-3xl border border-orange-100 bg-orange-50 p-5"><div className="flex h-24 w-24 items-center justify-center rounded-full border-8 border-orange-200 text-3xl font-black text-orange-600">{ats.score}</div><div><p className="text-lg font-black text-orange-950">Resume guidance score</p><p className="mt-1 text-sm text-orange-800">Use the recommendations as a review list, not as a pass/fail result.</p></div></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-5"><Metric label="Sections" value={ats.metrics.sections} /><Metric label="Keywords" value={ats.metrics.keywords} /><Metric label="Formatting" value={ats.metrics.formatting} /><Metric label="Readable" value={ats.metrics.readability} /><Metric label="Impact" value={ats.metrics.impact} /></div><div><h4 className="mb-2 font-black text-slate-900">Recommendations</h4>{ats.recommendations?.length ? <div className="space-y-2">{ats.recommendations.map((item) => <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-3"><p className="text-sm font-black text-slate-900">{item.title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{item.detail}</p></div>)}</div> : <p className="text-sm font-semibold text-emerald-700">No immediate recommendations from this checklist.</p>}</div></>}</div>;

  if (activeTool === 'matcher') return <div className="space-y-5"><div><p className="text-xs font-black uppercase tracking-[0.16em] text-orange-500">Job targeting</p><h3 className="mt-1 text-2xl font-black text-slate-950">Match resume to a job</h3><p className="mt-2 text-sm leading-6 text-slate-500">Paste a job description to see keywords to review. Suggestions never add skills or experience automatically.</p></div><textarea rows={8} value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} placeholder="Paste the job description here…" className={inputClass} /><div className="flex flex-wrap gap-2"><button type="button" onClick={runMatch} disabled={matchLoading || !jobDescription.trim()} className="inline-flex items-center rounded-xl bg-slate-950 px-4 py-3 text-sm font-black text-white hover:bg-orange-500 disabled:opacity-50">{matchLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />} {matchLoading ? 'Matching…' : 'Match resume'}</button><button type="button" onClick={runTailor} disabled={tailorLoading || !jobDescription.trim()} className={smallButton}>{tailorLoading && <LoaderCircle className="mr-2 inline h-3.5 w-3.5 animate-spin" />} Tailor with AI</button></div>{match?.error && <p className="rounded-2xl bg-red-50 p-3 text-sm font-bold text-red-700">{match.error}</p>}{match && !match.error && <div className="space-y-4"><div className="rounded-3xl border border-blue-100 bg-blue-50 p-5"><p className="text-xs font-black uppercase tracking-wider text-blue-500">Match score</p><p className="mt-1 text-4xl font-black text-blue-950">{match.score}%</p><p className="mt-1 text-xs font-semibold text-blue-800">Based on overlapping terms in the current resume and the pasted description.</p></div><div className="grid gap-4 sm:grid-cols-2"><div><h4 className="mb-2 text-sm font-black text-emerald-700">Matched skills</h4><div className="flex flex-wrap gap-2">{match.matchedSkills?.map((item) => <span key={item} className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">✓ {item}</span>)}</div></div><div><h4 className="mb-2 text-sm font-black text-amber-700">Review missing terms</h4><div className="flex flex-wrap gap-2">{match.missingSkills?.map((item) => <span key={item} className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800">⚠ {item}</span>)}</div></div></div></div>}{tailor?.error && <p className="rounded-2xl bg-red-50 p-3 text-sm font-bold text-red-700">{tailor.error}</p>}{tailor && !tailor.error && <div className="space-y-3 rounded-3xl border border-orange-100 bg-orange-50 p-5"><div className="flex items-center justify-between"><h4 className="font-black text-orange-950">Review tailoring suggestions</h4><span className="text-xs font-bold text-orange-700">Nothing applied</span></div>{tailor.summarySuggestion && <div className="rounded-2xl bg-white p-3"><p className="text-xs font-black uppercase tracking-wider text-slate-400">Summary suggestion</p><p className="mt-2 text-sm leading-6 text-slate-700">{tailor.summarySuggestion}</p><button type="button" onClick={() => applySummary(tailor.summarySuggestion)} className={`${smallButton} mt-3`}><Check className="mr-1 inline h-3.5 w-3.5" /> Apply summary</button></div>}{tailor.bulletSuggestions?.map((item, index) => <div key={`${item.original}-${index}`} className="rounded-2xl bg-white p-3"><p className="text-xs font-black uppercase tracking-wider text-slate-400">Bullet suggestion</p><p className="mt-1 text-xs text-slate-400">Original: {item.original}</p><p className="mt-2 text-sm font-semibold leading-6 text-slate-700">{item.suggestion}</p><p className="mt-1 text-xs text-slate-500">{item.reason}</p></div>)}<p className="text-xs font-semibold leading-5 text-orange-800">{tailor.notes}</p></div>}</div>;

  return <div className="space-y-6"><div><p className="text-xs font-black uppercase tracking-[0.16em] text-orange-500">Writing assistant</p><h3 className="mt-1 text-2xl font-black text-slate-950">AI copilot</h3><p className="mt-2 text-sm leading-6 text-slate-500">Use your own facts as the source of truth. Every suggestion is reviewable before you apply it.</p></div><div><label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">Paste a sentence or bullet</label><textarea rows={5} value={copilotText} onChange={(event) => setCopilotText(event.target.value)} placeholder="Worked on website using React." className={inputClass} /><div className="mt-3 flex flex-wrap gap-2">{ACTIONS.map((action) => <button type="button" key={action} onClick={() => runCopilot(action)} disabled={copilotLoading || !copilotText.trim()} className={smallButton}>{action}</button>)}{copilotLoading && <LoaderCircle className="h-5 w-5 animate-spin self-center text-orange-500" />}</div></div>{copilotResult?.error && <p className="rounded-2xl bg-red-50 p-3 text-sm font-bold text-red-700">{copilotResult.error}</p>}{copilotResult?.result && <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5"><div className="flex items-center justify-between"><h4 className="font-black text-emerald-950">Review suggestion</h4><span className="text-xs font-bold text-emerald-700">Not applied</span></div><p className="mt-3 text-sm leading-6 text-emerald-900">{copilotResult.result}</p><button type="button" onClick={() => setCopilotText(copilotResult.result)} className="mt-4 rounded-xl bg-emerald-700 px-3 py-2 text-xs font-black text-white hover:bg-emerald-800">Use in editor</button></div>}<div className="rounded-3xl border border-slate-200 bg-slate-50 p-5"><div className="flex items-start justify-between gap-4"><div><h4 className="font-black text-slate-950">Professional summary</h4><p className="mt-1 text-xs leading-5 text-slate-500">Generate 2–3 options using your current role, skills, experience, and projects.</p></div><button type="button" onClick={generateSummaryOptions} disabled={copilotLoading} className={smallButton}><Sparkles className="mr-1 inline h-3.5 w-3.5" /> Generate with AI</button></div>{summaryOptions.map((option, index) => <div key={`${option}-${index}`} className="mt-3 rounded-2xl bg-white p-3"><p className="text-sm leading-6 text-slate-700">{option}</p><button type="button" onClick={() => applySummary(option)} className={`${smallButton} mt-2`}>Use this option</button></div>)}</div><div className="rounded-3xl border border-slate-200 bg-slate-50 p-5"><div className="flex items-start justify-between gap-4"><div><h4 className="font-black text-slate-950">Skills suggestions</h4><p className="mt-1 text-xs leading-5 text-slate-500">Suggestions are never added automatically. Approve only skills you genuinely have.</p></div><button type="button" onClick={generateSkills} disabled={copilotLoading || !resume.targetRole} className={smallButton}><WandSparkles className="mr-1 inline h-3.5 w-3.5" /> Suggest skills</button></div>{skillsResult && <div className="mt-4 space-y-3">{Object.entries(skillsResult).map(([group, values]) => values?.length ? <div key={group}><p className="text-[10px] font-black uppercase tracking-wider text-slate-400">{group.replace(/([A-Z])/g, ' $1')}</p><div className="mt-2 flex flex-wrap gap-2">{values.map((skill) => <button type="button" key={skill} onClick={() => addSkills([skill])} className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-orange-50 hover:text-orange-700">+ {skill}</button>)}</div></div> : null)}</div>}</div></div>;
};

export default EditorToolsPanel;
