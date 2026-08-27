import {
    Mail,
    Phone,
    MapPin,
    Linkedin,
    Github,
    Globe,
    Sparkles
} from 'lucide-react';

const cleanLink = (value = '') => value.replace(/^https?:\/\/(www\.)?/, '');

const AuroraSectionHeading = ({ children }) => (
    <div className="flex items-center gap-3 mb-4">
        <span className="h-7 w-1 rounded-full bg-orange-500" />
        <h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-900">{children}</h2>
    </div>
);

const AuroraTemplate = ({ resume, renderHTML }) => {
    const {
        personalInfo = {},
        summary,
        education = [],
        experience = [],
        skills = [],
        projects = [],
        certifications = []
    } = resume;

    const displayTitle = resume.title?.trim().toLowerCase() === 'untitled resume'
        ? ''
        : resume.title?.trim();

    const contactItems = [
        { value: personalInfo.email, icon: Mail },
        { value: personalInfo.phone, icon: Phone },
        { value: personalInfo.address, icon: MapPin },
        { value: personalInfo.linkedin, icon: Linkedin },
        { value: personalInfo.github, icon: Github },
        { value: personalInfo.website, icon: Globe }
    ].filter(item => item.value);

    return (
        <div
            id="resume-preview-aurora"
            className="bg-white min-h-full w-full text-slate-800"
            style={{ fontFamily: 'var(--font-sans)' }}
        >
            <header className="relative overflow-hidden bg-slate-950 px-12 py-10 text-white">
                <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-orange-500/20 blur-3xl" />
                <div className="absolute bottom-0 left-1/3 h-20 w-56 rounded-full bg-orange-500/10 blur-3xl" />
                <div className="relative flex items-start justify-between gap-8">
                    <div className="min-w-0">
                        <div className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-orange-300">
                            <Sparkles className="h-3.5 w-3.5" />
                            Career profile
                        </div>
                        <h1 className="break-words text-4xl font-black leading-none tracking-tight">
                            {personalInfo.fullName || 'Your Name'}
                        </h1>
                        {displayTitle && (
                            <p className="mt-3 text-sm font-bold uppercase tracking-[0.16em] text-slate-300">{displayTitle}</p>
                        )}
                    </div>
                    {personalInfo.profilePicture && (
                        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-2 border-orange-400/60 bg-white/10 p-1 shadow-xl">
                            <img src={personalInfo.profilePicture} alt="Profile" className="h-full w-full rounded-xl object-cover" />
                        </div>
                    )}
                </div>
                {contactItems.length > 0 && (
                    <div className="relative mt-8 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/15 pt-4 text-[10px] font-semibold text-slate-300">
                        {contactItems.map(({ value, icon: Icon }) => (
                            <span key={`${value}-${Icon.displayName || Icon.name}`} className="flex min-w-0 items-center gap-1.5">
                                <Icon className="h-3.5 w-3.5 shrink-0 text-orange-300" />
                                <span className="break-all">{cleanLink(value)}</span>
                            </span>
                        ))}
                    </div>
                )}
            </header>

            <div className="grid grid-cols-[1.65fr_1fr] gap-10 px-12 py-10">
                <main className="min-w-0 space-y-8">
                    {summary && (
                        <section>
                            <AuroraSectionHeading>Profile</AuroraSectionHeading>
                            <div className="text-[13px] leading-relaxed text-slate-600">
                                {renderHTML(summary, 'text-[13px] leading-relaxed text-slate-600')}
                            </div>
                        </section>
                    )}

                    {experience.length > 0 && (
                        <section>
                            <AuroraSectionHeading>Experience</AuroraSectionHeading>
                            <div className="space-y-7 border-l border-slate-200 pl-6">
                                {experience.map((job, index) => (
                                    <article key={`${job.company}-${job.position}-${index}`} className="relative">
                                        <span className="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-orange-500 ring-1 ring-orange-200" />
                                        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                                            <h3 className="text-[15px] font-black text-slate-900">{job.position || 'Role'}</h3>
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{job.startDate} — {job.endDate}</span>
                                        </div>
                                        <p className="mt-1 text-[11px] font-black uppercase tracking-wider text-orange-600">{job.company}</p>
                                        <div className="mt-2">{renderHTML(job.description, 'text-[12px] leading-relaxed text-slate-600')}</div>
                                    </article>
                                ))}
                            </div>
                        </section>
                    )}

                    {projects.length > 0 && (
                        <section>
                            <AuroraSectionHeading>Selected Projects</AuroraSectionHeading>
                            <div className="space-y-5">
                                {projects.map((project, index) => (
                                    <article key={`${project.name}-${index}`}>
                                        <h3 className="text-[14px] font-black text-slate-900">{project.name || 'Project'}</h3>
                                        {project.link && <p className="mt-1 break-all text-[10px] font-bold text-orange-600">{cleanLink(project.link)}</p>}
                                        <div className="mt-2">{renderHTML(project.description, 'text-[12px] leading-relaxed text-slate-600')}</div>
                                    </article>
                                ))}
                            </div>
                        </section>
                    )}
                </main>

                <aside className="min-w-0 space-y-8 rounded-2xl bg-slate-50 p-6">
                    {skills.length > 0 && (
                        <section>
                            <AuroraSectionHeading>Core Skills</AuroraSectionHeading>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill, index) => (
                                    <span key={`${skill}-${index}`} className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-bold text-slate-700">{skill}</span>
                                ))}
                            </div>
                        </section>
                    )}

                    {education.length > 0 && (
                        <section>
                            <AuroraSectionHeading>Education</AuroraSectionHeading>
                            <div className="space-y-5">
                                {education.map((edu, index) => (
                                    <article key={`${edu.school || edu.institution}-${index}`}>
                                        <h3 className="text-[13px] font-black text-slate-900">{edu.school || edu.institution || 'School / University'}</h3>
                                        <p className="mt-1 text-[11px] font-bold italic text-orange-600">{edu.degree}</p>
                                        <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">{edu.startDate} — {edu.endDate}</p>
                                    </article>
                                ))}
                            </div>
                        </section>
                    )}

                    {certifications.length > 0 && (
                        <section>
                            <AuroraSectionHeading>Certifications</AuroraSectionHeading>
                            <div className="space-y-4">
                                {certifications.map((cert, index) => (
                                    <article key={`${cert.name}-${index}`}>
                                        <h3 className="text-[12px] font-black text-slate-900">{cert.name}</h3>
                                        <p className="mt-1 text-[11px] font-semibold text-slate-500">{cert.issuer}</p>
                                        {cert.date && <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-orange-600">{cert.date}</p>}
                                    </article>
                                ))}
                            </div>
                        </section>
                    )}
                </aside>
            </div>
        </div>
    );
};

export default AuroraTemplate;

