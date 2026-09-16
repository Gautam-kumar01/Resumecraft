import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, CheckCircle2, FileText, Search, Sparkles, Target } from 'lucide-react';
import SEO from '../components/SEO';

const pages = {
  '/job-description-matcher': {
    title: 'Job Description Resume Matcher',
    meta: 'Compare your resume with a job description, find evidence gaps, save a tailored version, and prepare a more relevant application with ResumeCraft.',
    eyebrow: 'Resume-to-job matching',
    intro: 'See how your resume connects to the job before you apply.',
    body: 'ResumeCraft Job Match helps you compare the evidence you already have with a target job description. Review matched terms, missing areas, and practical next steps without inventing skills or promising a hiring result.',
    steps: ['Paste your resume evidence', 'Add the target job description', 'Review the explainable match breakdown', 'Save a tailored version and cover letter'],
    cta: 'Open Job Match workspace',
    href: '/job-match',
    icon: Target,
    keywords: 'job description matcher, resume job matcher, resume keyword match, tailor resume to job description'
  },
  '/fresher-resume-builder': {
    title: 'Fresher Resume Builder',
    meta: 'Create a fresher resume with projects, education, internships, skills, and achievement examples. Start with a clear ATS-readable format on ResumeCraft.',
    eyebrow: 'For students and freshers',
    intro: 'Turn education and potential into credible resume evidence.',
    body: 'A strong fresher resume does not need years of employment. It needs clear projects, coursework, internships, skills, leadership, and proof of how you applied what you learned. Use ResumeCraft to organize those details into a readable first resume.',
    steps: ['Choose a fresher-friendly structure', 'Add projects, coursework, and skills', 'Write evidence-based bullet points', 'Review the resume before exporting'],
    cta: 'Build a fresher resume',
    href: '/resume-builder-for-freshers',
    icon: Sparkles,
    keywords: 'fresher resume builder, student resume maker, first job resume, resume for freshers'
  },
  '/resume-guide/software-engineer': {
    title: 'Software Engineer Resume Guide',
    meta: 'Learn how to write a software engineer resume with projects, technical skills, APIs, systems, testing, and measurable engineering evidence.',
    eyebrow: 'Role guide · Software Engineering',
    intro: 'Show what you built, how it worked, and why it mattered.',
    body: 'Software engineering resumes are strongest when they connect technologies to outcomes. Focus on shipped features, systems, APIs, debugging, tests, collaboration, and the scale or reliability improvements you can honestly support.',
    steps: ['Lead with your strongest engineering evidence', 'Group skills by practical experience', 'Describe projects with action and outcome', 'Match the resume to the role description'],
    cta: 'Use the Software Engineer template',
    href: '/resume-template/software-engineer',
    icon: FileText,
    keywords: 'software engineer resume, software developer resume, backend resume, frontend engineer resume'
  },
  '/resume-guide/data-analyst': {
    title: 'Data Analyst Resume Guide',
    meta: 'Build a data analyst resume with SQL, dashboards, reporting, experimentation, business questions, and clear analytical outcomes.',
    eyebrow: 'Role guide · Analytics',
    intro: 'Make your analysis easy for a hiring team to understand.',
    body: 'A data analyst resume should connect tools such as SQL, spreadsheets, Python, visualization, or experimentation to decisions and outcomes. Explain the question, the analysis, and what changed because of your work.',
    steps: ['Name the business question', 'Show your analysis method and tools', 'Connect dashboards to decisions', 'Prioritize evidence relevant to the role'],
    cta: 'Use the Data Analyst template',
    href: '/resume-template/data-analyst',
    icon: Search,
    keywords: 'data analyst resume, SQL analyst resume, business analyst resume, data analyst CV'
  },
  '/resume-guide/marketing': {
    title: 'Marketing Resume Guide',
    meta: 'Write a marketing resume with campaigns, content, SEO, performance channels, audience insights, and measurable outcomes.',
    eyebrow: 'Role guide · Marketing',
    intro: 'Turn campaigns and customer insight into clear business impact.',
    body: 'Marketing resumes work best when they explain the audience, channel, campaign action, and result. Include the work you actually owned across content, SEO, lifecycle, paid media, research, partnerships, or brand.',
    steps: ['Define the audience or market', 'Describe the campaign or channel', 'Use honest performance evidence', 'Tailor the language to the marketing role'],
    cta: 'Use the Marketing Manager template',
    href: '/resume-template/marketing-manager',
    icon: FileText,
    keywords: 'marketing resume, digital marketing resume, marketing manager resume, SEO marketing CV'
  }
};

const related = [
  ['/resume-score-checker', 'Resume Score Checker'],
  ['/resume-examples', 'Resume Examples'],
  ['/blog', 'Resume & Career Blog'],
  ['/job-match', 'Job Match Workspace'],
  ['/create-resume', 'Create a Resume']
];

export default function SeoLanding() {
  const config = pages[useLocation().pathname] || pages['/job-description-matcher'];
  const Icon = config.icon;
  return <>
    <SEO title={config.title} description={config.meta} keywords={config.keywords} canonical={`https://resumecraft.co.in${useLocation().pathname}`} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
      '@context': 'https://schema.org', '@type': 'Article', headline: config.title, description: config.meta,
      mainEntityOfPage: `https://resumecraft.co.in${useLocation().pathname}`, author: { '@type': 'Organization', name: 'ResumeCraft' }, publisher: { '@type': 'Organization', name: 'ResumeCraft' }
    }) }} />
    <main className="bg-white text-slate-900">
      <section className="relative overflow-hidden bg-slate-950 px-4 py-20 text-white sm:px-6 lg:py-28"><div className="absolute -right-20 -top-28 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl" /><div className="relative mx-auto max-w-5xl"><div className="flex items-center gap-3 text-sm font-black uppercase tracking-[0.2em] text-orange-300"><Icon className="h-5 w-5" />{config.eyebrow}</div><h1 className="mt-6 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">{config.intro}</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">{config.body}</p><div className="mt-9 flex flex-wrap gap-3"><Link to={config.href} className="inline-flex items-center rounded-2xl bg-orange-500 px-5 py-3.5 text-sm font-black text-white hover:bg-orange-400">{config.cta}<ArrowRight className="ml-2 h-4 w-4" /></Link><Link to="/templates" className="rounded-2xl border border-white/20 px-5 py-3.5 text-sm font-black text-white hover:bg-white/10">Browse templates</Link></div></div></section>
      <section className="mx-auto grid max-w-5xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[.85fr_1.15fr] lg:py-24"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-orange-600">A practical process</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Build evidence readers can review quickly.</h2><p className="mt-5 leading-7 text-slate-600">Use clear headings, specific context, and honest outcomes. ResumeCraft gives you tools and templates; you decide which claims are accurate and worth including.</p></div><div className="space-y-4">{config.steps.map((step, i) => <div key={step} className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-black text-white">{i + 1}</span><p className="pt-1 font-bold text-slate-800">{step}</p></div>)}</div></section>
      <section className="bg-orange-50 px-4 py-16 sm:px-6 lg:py-20"><div className="mx-auto max-w-5xl"><h2 className="text-3xl font-black tracking-tight">Explore more career tools</h2><div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{related.map(([href, label]) => <Link key={href} to={href} className="rounded-2xl border border-orange-100 bg-white p-4 text-sm font-black text-slate-800 transition hover:-translate-y-0.5 hover:border-orange-300"><CheckCircle2 className="mb-3 h-5 w-5 text-orange-500" />{label}</Link>)}</div></div></section>
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:py-20"><h2 className="text-3xl font-black tracking-tight">Questions people ask</h2><div className="mt-7 grid gap-4 md:grid-cols-3">{[['What makes a resume ATS-readable?', 'Clear headings, ordinary text, consistent dates, and evidence that is easy to parse. No resume format guarantees a hiring result.'], ['Should I include every skill?', 'Prioritize skills you can support with a project, course, work example, or other honest evidence.'], ['Can I tailor one resume for every job?', 'A strong master resume is useful, but a focused version should emphasize the evidence most relevant to each role.']].map(([q, a]) => <div key={q} className="rounded-2xl border border-slate-200 p-5"><h3 className="font-black">{q}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{a}</p></div>)}</div></section>
    </main>
  </>;
}
