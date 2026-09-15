import { CheckCircle2, CircleAlert, TrendingUp } from 'lucide-react';

const tone = {
  strong: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  medium: 'border-amber-200 bg-amber-50 text-amber-800',
  weak: 'border-rose-200 bg-rose-50 text-rose-800'
};

export default function JobMatchScoreBreakdown({ result }) {
  if (!result) return null;
  return (
    <section className="space-y-5" aria-labelledby="match-breakdown-heading">
      <div className="flex items-end justify-between gap-4">
        <div><p className="text-xs font-black uppercase tracking-[0.2em] text-orange-600">Match report</p><h2 id="match-breakdown-heading" className="mt-2 text-2xl font-black text-slate-950">What your resume signals</h2></div>
        <div className="text-right"><div className="text-5xl font-black text-slate-950">{result.score}<span className="text-2xl text-slate-400">%</span></div><p className="text-xs font-bold text-slate-500">content alignment estimate</p></div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {result.breakdown.map(item => <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-4"><div className="flex justify-between text-sm font-bold"><span>{item.label}</span><span className="text-orange-600">{item.value}%</span></div><div className="mt-3 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-orange-500 transition-all" style={{ width: `${item.value}%` }} /></div></div>)}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className={`rounded-2xl border p-5 ${tone.strong}`}><h3 className="flex items-center gap-2 font-black"><CheckCircle2 className="h-4 w-4" /> Supported signals</h3><div className="mt-3 flex flex-wrap gap-2">{result.matched.map(x => <span key={x} className="rounded-full bg-white/70 px-2.5 py-1 text-xs font-bold">{x}</span>)}</div></div>
        <div className={`rounded-2xl border p-5 ${tone.medium}`}><h3 className="flex items-center gap-2 font-black"><TrendingUp className="h-4 w-4" /> Worth clarifying</h3><div className="mt-3 flex flex-wrap gap-2">{result.unclear.length ? result.unclear.map(x => <span key={x} className="rounded-full bg-white/70 px-2.5 py-1 text-xs font-bold">{x}</span>) : <span className="text-sm">No obvious gaps found.</span>}</div></div>
        <div className={`rounded-2xl border p-5 ${tone.weak}`}><h3 className="flex items-center gap-2 font-black"><CircleAlert className="h-4 w-4" /> Not found</h3><div className="mt-3 flex flex-wrap gap-2">{result.missing.length ? result.missing.map(x => <span key={x} className="rounded-full bg-white/70 px-2.5 py-1 text-xs font-bold">{x}</span>) : <span className="text-sm">No priority terms missing.</span>}</div></div>
      </div>
      <p className="rounded-2xl bg-slate-950 p-4 text-sm leading-6 text-slate-300"><strong className="text-white">Use this as a review aid, not a hiring prediction.</strong> Add only skills and outcomes you can honestly support with your experience or projects.</p>
    </section>
  );
}
