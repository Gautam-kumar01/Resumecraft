import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ClipboardCheck, FileText, Lightbulb, LoaderCircle, ShieldCheck, Target, TrendingUp, XCircle } from 'lucide-react';
import SEO from '../components/SEO';

const stopWords = new Set(['about', 'after', 'again', 'being', 'could', 'from', 'have', 'into', 'more', 'other', 'their', 'there', 'these', 'they', 'this', 'that', 'with', 'your', 'will', 'would', 'years', 'using', 'work', 'team']);
const actionVerbs = ['built', 'created', 'improved', 'led', 'managed', 'designed', 'delivered', 'analyzed', 'developed', 'launched', 'reduced', 'increased', 'automated', 'implemented', 'coordinated', 'supported'];

const normalize = (value) => value.toLowerCase().replace(/[^a-z0-9+.#%$\s-]/g, ' ');
const getWords = (value) => normalize(value).split(/\s+/).filter((word) => word.length > 2 && !stopWords.has(word));

const scoreResume = (resumeText, jobDescription) => {
    const text = normalize(resumeText);
    const words = text.split(/\s+/).filter(Boolean);
    const lines = resumeText.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    const checks = [];
    const addCheck = (id, label, points, passed, good, improve) => checks.push({ id, label, points, passed, message: passed ? good : improve });

    addCheck('length', 'Focused length', 10, words.length >= 120 && words.length <= 900, 'The length is easy to scan.', 'Aim for roughly 1–2 focused pages and remove unrelated detail.');
    addCheck('contact', 'Contact details', 10, /[\w.+-]+@[\w.-]+\.[a-z]{2,}/i.test(resumeText) && /(?:\+?\d[\d\s().-]{7,}\d)/.test(resumeText), 'Email and phone details are visible.', 'Add a professional email address and reachable phone number near your name.');
    addCheck('headings', 'Standard sections', 15, /(experience|employment|work history)/.test(text) && /(education|academic)/.test(text) && /(skills|technical skills|competencies)/.test(text), 'Core resume sections are easy to identify.', 'Use clear headings such as Summary, Experience, Projects, Education, and Skills.');
    addCheck('summary', 'Professional summary', 10, /(summary|profile|objective)/.test(text) && words.length > 35, 'Your resume has an opening summary or profile.', 'Add a concise summary that names your target role and strongest evidence.');
    addCheck('bullets', 'Evidence-led bullets', 15, lines.filter((line) => /^[-•*]/.test(line)).length >= 3 && actionVerbs.some((verb) => text.includes(` ${verb} `)), 'Your experience includes action-led bullet points.', 'Rewrite tasks as action + work + outcome bullets and start them with strong verbs.');
    addCheck('impact', 'Measurable impact', 15, /\b\d+(?:\.\d+)?\s?(?:%|x|k|m|million|users|clients|projects|hours|days)\b|[$₹€]\s?\d+/i.test(resumeText), 'At least one measurable result is present.', 'Add accurate scale, time, volume, quality, or outcome details where they add context.');
    addCheck('links', 'Professional links', 5, /(linkedin\.com|github\.com|portfolio|behance\.net)/.test(text), 'A professional profile or portfolio link is included.', 'Add one maintained LinkedIn, GitHub, portfolio, or relevant work link.');

    let keywordPoints = 10;
    let keywordMessage = 'Your skills section gives the reader useful search terms.';
    if (jobDescription.trim()) {
        const resumeWords = new Set(getWords(resumeText));
        const targetWords = [...new Set(getWords(jobDescription))].filter((word) => word.length > 3);
        const matched = targetWords.filter((word) => resumeWords.has(word));
        const ratio = targetWords.length ? matched.length / Math.min(targetWords.length, 25) : 0;
        keywordPoints = Math.min(10, Math.round(ratio * 10));
        keywordMessage = `${matched.length} relevant term${matched.length === 1 ? '' : 's'} from the job description appear in your resume.`;
    }
    checks.push({ id: 'keywords', label: 'Role relevance', points: 10, passed: keywordPoints >= 7, message: keywordMessage, improve: 'Compare your resume with the target role and add only keywords supported by your real experience.' });

    addCheck('clarity', 'Readable formatting', 10, !/[|]{3,}|\t{3,}/.test(resumeText) && lines.length >= 8, 'The text looks structured enough for a first review.', 'Use short sections, consistent spacing, ordinary headings, and selectable text in the exported PDF.');
    const total = checks.reduce((sum, check) => sum + (check.passed ? check.points : Math.max(0, check.points - 2)), 0);
    const score = Math.max(0, Math.min(100, total));
    const passed = checks.filter((check) => check.passed).length;
    return { score, checks, passed, total: checks.length, wordCount: words.length };
};

const scoreLabel = (score) => {
    if (score >= 85) return { label: 'Strong foundation', color: 'text-emerald-600', ring: 'stroke-emerald-500', bg: 'bg-emerald-50' };
    if (score >= 70) return { label: 'Good start', color: 'text-orange-600', ring: 'stroke-orange-500', bg: 'bg-orange-50' };
    return { label: 'Room to improve', color: 'text-rose-600', ring: 'stroke-rose-500', bg: 'bg-rose-50' };
};

const ResumeScoreChecker = () => {
    const [resumeText, setResumeText] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [hasAnalyzed, setHasAnalyzed] = useState(false);
    const result = useMemo(() => (resumeText.trim().length >= 40 ? scoreResume(resumeText, jobDescription) : null), [resumeText, jobDescription]);
    const displayResult = hasAnalyzed ? result : null;
    const tone = displayResult ? scoreLabel(displayResult.score) : null;

    return (
        <div className="min-h-screen bg-slate-50 pb-20 pt-24 dark:bg-slate-950">
            <SEO title="Free Resume Score Checker | Instant Resume Feedback" description="Paste your resume into ResumeCraft's free Resume Score Checker for instant feedback on structure, clarity, impact, links, and role relevance." url="/resume-score-checker" keywords="resume score checker, free resume checker, resume feedback, ATS resume review" />
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-3xl text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 shadow-sm dark:bg-orange-500/15 dark:text-orange-300"><ClipboardCheck className="h-7 w-7" /></div>
                    <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-950 sm:text-6xl dark:text-white">Find out what your resume is saying.</h1>
                    <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">Paste your existing resume and get instant, practical feedback on structure, clarity, evidence, and role relevance. Your text stays in this browser for this check.</p>
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-slate-500 dark:text-slate-400"><span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald-500" /> Local first</span><span className="inline-flex items-center gap-1.5"><TrendingUp className="h-4 w-4 text-orange-500" /> Immediate feedback</span><span className="inline-flex items-center gap-1.5"><Target className="h-4 w-4 text-blue-500" /> No hiring guarantees</span></div>
                </div>

                <div className="mt-12 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
                    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/50 sm:p-7 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none" aria-labelledby="paste-resume-heading">
                        <div className="flex items-center justify-between gap-4"><div><h2 id="paste-resume-heading" className="text-xl font-black text-slate-950 dark:text-white">Paste your resume</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Plain text works best. Remove personal details if you prefer.</p></div><FileText className="h-6 w-6 text-orange-500" /></div>
                        <textarea value={resumeText} onChange={(event) => { setResumeText(event.target.value); setHasAnalyzed(false); }} placeholder="Paste your resume here...\n\nExample: Summary\nFrontend developer with..." className="mt-6 min-h-[360px] w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-900 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white" aria-label="Resume text" />
                        <div className="mt-5 rounded-2xl border border-dashed border-slate-200 p-4 dark:border-slate-700"><label htmlFor="job-description" className="text-sm font-black text-slate-900 dark:text-white">Optional: paste the job description</label><p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">This adds a simple relevance check; it does not guarantee keyword matching or an interview.</p><textarea id="job-description" value={jobDescription} onChange={(event) => { setJobDescription(event.target.value); setHasAnalyzed(false); }} placeholder="Paste target role requirements here..." className="mt-3 min-h-[120px] w-full resize-y rounded-xl border border-slate-200 bg-white p-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white" /></div>
                        <button type="button" onClick={() => setHasAnalyzed(true)} disabled={resumeText.trim().length < 40} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-4 text-sm font-black text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none dark:disabled:bg-slate-700"><ClipboardCheck className="h-5 w-5" /> Check my resume</button>
                        <p className="mt-3 text-center text-xs font-semibold text-slate-400">{resumeText.trim().length < 40 ? 'Add at least 40 characters to start.' : `${resumeText.trim().split(/\s+/).filter(Boolean).length} words ready to review.`}</p>
                    </section>

                    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/50 sm:p-7 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none" aria-live="polite" aria-labelledby="score-heading">
                        {!displayResult ? <div className="flex min-h-[620px] flex-col items-center justify-center text-center"><div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800"><LoaderCircle className="h-9 w-9" /></div><h2 id="score-heading" className="mt-6 text-2xl font-black text-slate-950 dark:text-white">Your feedback will appear here</h2><p className="mt-3 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">Paste your resume, optionally add a target job description, and select “Check my resume.”</p></div> : <div><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-widest text-slate-400">Resume score</p><h2 id="score-heading" className={`mt-2 text-2xl font-black ${tone.color}`}>{tone.label}</h2></div><div className={`relative flex h-24 w-24 items-center justify-center rounded-full ${tone.bg}`}><svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="42" fill="none" className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="8" /><circle cx="50" cy="50" r="42" fill="none" className={tone.ring} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${displayResult.score * 2.64} 264`} /></svg><span className={`text-2xl font-black ${tone.color}`}>{displayResult.score}</span></div></div><div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3"><div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800"><p className="text-2xl font-black text-slate-950 dark:text-white">{displayResult.passed}/{displayResult.total}</p><p className="mt-1 text-xs font-bold text-slate-500">Checks passed</p></div><div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800"><p className="text-2xl font-black text-slate-950 dark:text-white">{displayResult.wordCount}</p><p className="mt-1 text-xs font-bold text-slate-500">Words found</p></div><div className="col-span-2 rounded-2xl bg-slate-50 p-4 sm:col-span-1 dark:bg-slate-800"><p className="text-2xl font-black text-slate-950 dark:text-white">{jobDescription.trim() ? 'Role' : 'Core'}</p><p className="mt-1 text-xs font-bold text-slate-500">Feedback mode</p></div></div><div className="mt-8 space-y-3">{displayResult.checks.map((check) => <div key={check.id} className="rounded-2xl border border-slate-100 p-4 dark:border-slate-800"><div className="flex items-start gap-3">{check.passed ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" /> : <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />}<div><p className="text-sm font-black text-slate-900 dark:text-white">{check.label} <span className="ml-1 text-xs font-bold text-slate-400">{check.points} pts</span></p><p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{check.message}</p>{!check.passed && <p className="mt-2 flex items-start gap-1.5 text-xs font-bold leading-5 text-orange-700 dark:text-orange-300"><Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0" />{check.improve}</p>}</div></div></div>)}</div><div className="mt-8 rounded-2xl bg-orange-50 p-5 dark:bg-orange-500/10"><p className="text-sm font-black text-orange-900 dark:text-orange-200">Ready to improve the draft?</p><p className="mt-1 text-xs leading-5 text-orange-800/80 dark:text-orange-200/70">Use your feedback as a checklist, then open the editor to refine your content and preview the layout.</p><Link to="/create-resume" className="mt-4 inline-flex items-center rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-black text-white hover:bg-orange-600">Open resume editor</Link></div></div>}
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ResumeScoreChecker;
