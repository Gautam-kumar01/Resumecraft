import {
  Award,
  BriefcaseBusiness,
  ChevronDown,
  ChevronUp,
  Code2,
  FileText,
  FolderKanban,
  Globe2,
  GraduationCap,
  Heart,
  Layout,
  Palette,
  Plus,
  Sparkles,
  Star,
  UserRound,
  WandSparkles,
} from 'lucide-react';
import { SECTION_DEFINITIONS } from '../data/resumeBuilder';

const ICONS = { user: UserRound, file: FileText, briefcase: BriefcaseBusiness, graduation: GraduationCap, code: Code2, folder: FolderKanban, award: Award, sparkles: Sparkles, globe: Globe2, heart: Heart, star: Star, plus: Plus };

const EDITABLE_SECTIONS = new Set(['personal', 'summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'extras']);
const EXTRA_SECTIONS = new Set(['achievements', 'languages', 'volunteer', 'interests', 'custom']);

const EditorSidebar = ({ resume, openSection, setOpenSection, setResume, activeTool, setActiveTool, saveStatus, onAddSection }) => {
  const sectionOrder = resume.sectionOrder?.length ? resume.sectionOrder : SECTION_DEFINITIONS.map((section) => section.id);
  const moveSection = (sectionId, direction) => {
    const index = sectionOrder.indexOf(sectionId);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= sectionOrder.length) return;
    const next = [...sectionOrder];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    setResume((previous) => ({ ...previous, sectionOrder: next }));
  };
  const toggleHidden = (sectionId) => setResume((previous) => ({
    ...previous,
    hiddenSections: previous.hiddenSections?.includes(sectionId)
      ? previous.hiddenSections.filter((item) => item !== sectionId)
      : [...(previous.hiddenSections || []), sectionId],
  }));
  const openSectionFor = (sectionId) => {
    setActiveTool('');
    setOpenSection(EDITABLE_SECTIONS.has(sectionId) ? sectionId : EXTRA_SECTIONS.has(sectionId) ? 'extras' : sectionId);
  };

  return (
    <aside className="hidden w-[220px] shrink-0 flex-col border-r border-slate-200 bg-white/90 p-3 lg:flex">
      <div className="mb-4 px-2 pt-1"><p className="text-[10px] font-black uppercase tracking-[0.18em] text-orange-500">Resume workspace</p><p className="mt-1 text-xs font-semibold leading-5 text-slate-500">Organize your story section by section.</p></div>
      <div className="mb-3 flex items-center justify-between px-2"><span className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Sections</span><button type="button" onClick={onAddSection} className="rounded-lg p-1 text-slate-400 hover:bg-orange-50 hover:text-orange-600" aria-label="Add custom section"><Plus className="h-4 w-4" /></button></div>
      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
        {sectionOrder.map((sectionId, index) => {
          const section = SECTION_DEFINITIONS.find((item) => item.id === sectionId);
          if (!section) return null;
          const Icon = ICONS[section.icon] || FileText;
          const isHidden = resume.hiddenSections?.includes(section.id);
          const active = (EXTRA_SECTIONS.has(section.id) ? openSection === 'extras' : openSection === section.id) && !activeTool;
          return <div key={section.id} className={`group flex items-center rounded-xl transition ${active ? 'bg-orange-50 text-orange-700' : 'text-slate-600 hover:bg-slate-50'}`}><button type="button" onClick={() => openSectionFor(section.id)} className="flex min-w-0 flex-1 items-center gap-2 px-2 py-2 text-left text-xs font-bold"><Icon className="h-4 w-4 shrink-0" /><span className="truncate">{section.shortLabel}</span>{isHidden && <span className="ml-auto text-[9px] text-slate-400">off</span>}</button><div className="hidden items-center gap-0.5 pr-1 group-hover:flex"><button type="button" onClick={() => moveSection(section.id, -1)} disabled={index === 0} className="rounded p-0.5 text-slate-400 hover:bg-white disabled:opacity-20" aria-label={`Move ${section.label} up`}><ChevronUp className="h-3 w-3" /></button><button type="button" onClick={() => moveSection(section.id, 1)} disabled={index === sectionOrder.length - 1} className="rounded p-0.5 text-slate-400 hover:bg-white disabled:opacity-20" aria-label={`Move ${section.label} down`}><ChevronDown className="h-3 w-3" /></button><button type="button" onClick={() => toggleHidden(section.id)} className="rounded px-1 text-[9px] font-black text-slate-400 hover:bg-white hover:text-slate-700" aria-label={`${isHidden ? 'Show' : 'Hide'} ${section.label}`}>{isHidden ? 'show' : 'hide'}</button></div></div>;
        })}
      </nav>
      <div className="mt-3 border-t border-slate-100 pt-3"><p className="mb-2 px-2 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Tools</p><div className="space-y-1"><button type="button" onClick={() => { setOpenSection(''); setActiveTool('customize'); }} className={`flex w-full items-center gap-2 rounded-xl px-2 py-2 text-xs font-bold ${activeTool === 'customize' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}><Palette className="h-4 w-4" /> Customize</button><button type="button" onClick={() => { setOpenSection(''); setActiveTool('copilot'); }} className={`flex w-full items-center gap-2 rounded-xl px-2 py-2 text-xs font-bold ${activeTool === 'copilot' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}><WandSparkles className="h-4 w-4" /> AI Assistant</button><button type="button" onClick={() => { setOpenSection(''); setActiveTool('ats'); }} className={`flex w-full items-center gap-2 rounded-xl px-2 py-2 text-xs font-bold ${activeTool === 'ats' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}><Sparkles className="h-4 w-4" /> ATS Score</button><button type="button" onClick={() => { setOpenSection(''); setActiveTool('matcher'); }} className={`flex w-full items-center gap-2 rounded-xl px-2 py-2 text-xs font-bold ${activeTool === 'matcher' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}><Layout className="h-4 w-4" /> Match a job</button></div><div className="mt-3 flex items-center gap-2 px-2 text-[10px] font-bold text-slate-400"><span className={`h-2 w-2 rounded-full ${saveStatus === 'Saving…' ? 'animate-pulse bg-orange-500' : 'bg-emerald-500'}`} />{saveStatus}</div></div>
    </aside>
  );
};

export default EditorSidebar;
