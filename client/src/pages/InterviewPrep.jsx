import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import api from '../api/axios';
import { TARGET_ROLES } from '../data/resumeBuilder';
import { ArrowRight, CheckCircle2, LoaderCircle, MessageSquare, Sparkles } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

const categories = ['Technical', 'HR', 'Behavioral', 'Role-specific'];
const inputClass = 'w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100';

const InterviewPrep = () => {
  const [targetRole, setTargetRole] = useState('');
  const [category, setCategory] = useState('Behavioral');
  const [resumeContext, setResumeContext] = useState('');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [evaluations, setEvaluations] = useState({});
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(null);
  const [error, setError] = useState('');

  const generateQuestions = async () => {
    if (!targetRole.trim()) return;
    setLoading(true);
    setError('');
    setQuestions([]);
    setEvaluations({});
    try {
      const { data } = await api.post('/ai/interview-questions', { targetRole, category, resumeContext });
      setQuestions(data.questions || []);
      trackEvent('interview_questions_generated', { category });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'AI is temporarily unavailable. You can continue preparing manually.');
    } finally {
      setLoading(false);
    }
  };

  const evaluateAnswer = async (index) => {
    const answer = answers[index]?.trim();
    if (!answer || !questions[index]) return;
    setEvaluating(index);
    setError('');
    try {
      const { data } = await api.post('/ai/evaluate-interview', { targetRole, category, question: questions[index].question, answer });
      setEvaluations((previous) => ({ ...previous, [index]: data }));
      trackEvent('interview_answer_evaluated', { category });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'AI is temporarily unavailable. You can continue preparing manually.');
    } finally {
      setEvaluating(null);
    }
  };

  return <div className="min-h-screen bg-white"><SEO title="Interview Preparation" description="Practice technical, HR, behavioral, and role-specific interview questions with reviewable AI coaching." keywords="interview preparation, interview questions, AI interview practice" /><section className="bg-slate-950 px-4 py-20 text-white"><div className="mx-auto max-w-5xl"><p className="text-xs font-black uppercase tracking-[0.2em] text-orange-300">Career tools</p><h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">Practice with a clearer feedback loop</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">Choose a target role, generate questions, answer in your own words, and review coaching feedback. The tool is for practice, not a hiring prediction.</p></div></section><main className="mx-auto max-w-5xl px-4 py-12"><div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]"><section className="rounded-3xl border border-slate-200 bg-slate-50 p-6 lg:sticky lg:top-8 lg:self-start"><div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-white"><MessageSquare className="h-5 w-5" /></span><div><h2 className="font-black text-slate-950">Set up practice</h2><p className="text-xs font-semibold text-slate-500">Your answers stay in this session.</p></div></div><label className="mt-6 block text-xs font-black uppercase tracking-wider text-slate-500">Target role<input list="interview-roles" value={targetRole} onChange={(event) => setTargetRole(event.target.value)} placeholder="e.g. Data Analyst" className={`${inputClass} mt-2`} /><datalist id="interview-roles">{TARGET_ROLES.map((role) => <option key={role} value={role} />)}</datalist></label><label className="mt-4 block text-xs font-black uppercase tracking-wider text-slate-500">Question category<select value={category} onChange={(event) => setCategory(event.target.value)} className={`${inputClass} mt-2`}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label><label className="mt-4 block text-xs font-black uppercase tracking-wider text-slate-500">Optional resume context<textarea rows={5} value={resumeContext} onChange={(event) => setResumeContext(event.target.value)} placeholder="Paste a short summary of your resume for more relevant prompts." className={`${inputClass} mt-2`} /></label><button type="button" onClick={generateQuestions} disabled={loading || !targetRole.trim()} className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-slate-950 px-4 py-3.5 text-sm font-black text-white hover:bg-orange-500 disabled:opacity-50">{loading ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}{loading ? 'Generating…' : 'Generate questions'}</button><Link to="/editor" className="mt-4 inline-flex w-full items-center justify-center text-sm font-black text-orange-600">Review your resume <ArrowRight className="ml-2 h-4 w-4" /></Link></section><section>{error && <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700">{error}</div>}{!questions.length && !loading && <div className="rounded-3xl border border-dashed border-slate-300 p-10 text-center"><p className="text-lg font-black text-slate-900">Your practice questions will appear here.</p><p className="mt-2 text-sm leading-6 text-slate-500">Choose a role and category, then generate a set to begin.</p></div>}{questions.map((item, index) => <article key={`${item.question}-${index}`} className="mb-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-4"><div><span className="text-xs font-black uppercase tracking-wider text-orange-500">Question {index + 1} · {item.category || category}</span><h2 className="mt-2 text-lg font-black leading-7 text-slate-950">{item.question}</h2>{item.why && <p className="mt-2 text-xs leading-5 text-slate-500">Why it matters: {item.why}</p>}</div><span className="hidden rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-500 sm:block">Practice</span></div><textarea rows={5} value={answers[index] || ''} onChange={(event) => setAnswers((previous) => ({ ...previous, [index]: event.target.value }))} placeholder="Write your answer in your own words…" className={`${inputClass} mt-5 bg-white`} /><button type="button" onClick={() => evaluateAnswer(index)} disabled={evaluating === index || !answers[index]?.trim()} className="mt-3 inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-700 hover:border-orange-300 hover:text-orange-600 disabled:opacity-50">{evaluating === index && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}{evaluating === index ? 'Reviewing…' : 'Evaluate answer'}</button>{evaluations[index] && <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4"><div className="flex items-center justify-between"><h3 className="font-black text-emerald-950">Coaching feedback</h3><span className="rounded-full bg-white px-3 py-1 text-sm font-black text-emerald-700">{evaluations[index].score}/100</span></div>{evaluations[index].feedback && <p className="mt-3 text-sm leading-7 text-emerald-950">{evaluations[index].feedback}</p>}<div className="mt-4 grid gap-4 sm:grid-cols-2"><div><p className="text-xs font-black uppercase tracking-wider text-emerald-700">Strengths</p>{evaluations[index].strengths?.map((item) => <p key={item} className="mt-2 flex gap-2 text-sm leading-6 text-emerald-900"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0" />{item}</p>)}</div><div><p className="text-xs font-black uppercase tracking-wider text-emerald-700">Try next</p>{evaluations[index].improvements?.map((item) => <p key={item} className="mt-2 flex gap-2 text-sm leading-6 text-emerald-900"><ArrowRight className="mt-1 h-4 w-4 shrink-0" />{item}</p>)}</div></div>{evaluations[index].followUpQuestion && <p className="mt-4 border-t border-emerald-200 pt-4 text-sm font-bold text-emerald-900">Follow-up to practice: {evaluations[index].followUpQuestion}</p>}</div>}</article>)}</section></div></main></div>;
};

export default InterviewPrep;
