
import React from 'react';
import {
    Mail,
    Phone,
    MapPin,
    Linkedin,
    Github,
    Globe,
    Briefcase,
    GraduationCap,
    Code2,
    Award,
    Star,
    User
} from 'lucide-react';

const ResumePreview = ({ resume }) => {
    if (!resume) return null;

    const { personalInfo, summary, education, experience, skills, projects, templateId = 'modern' } = resume;

    // --- Template 1: MODERN (Original) ---
    const ModernTemplate = () => (
        <div className="bg-white p-12 min-h-[1000px]" id="resume-preview-modern" style={{ fontFamily: "'Inter', sans-serif" }}>
            <header className="border-b-2 border-slate-900 pb-8 mb-8 flex flex-row justify-between items-center gap-6 text-slate-900">
                <div className="flex-1">
                    <h1 className="text-5xl font-extrabold uppercase tracking-tight mb-2 text-slate-900">{personalInfo?.fullName || 'Your Name'}</h1>
                    {resume.title && <p className="text-xl text-orange-600 font-semibold mb-6 tracking-wide italic">{resume.title}</p>}

                    <div className="flex flex-wrap gap-4 text-sm text-slate-500 font-medium">
                        {personalInfo?.email && <span className="flex items-center"><Mail className="h-3.5 w-3.5 mr-1.5 text-orange-500" />{personalInfo.email}</span>}
                        {personalInfo?.phone && <span className="border-l border-slate-300 pl-4 flex items-center"><Phone className="h-3.5 w-3.5 mr-1.5 text-orange-500" />{personalInfo.phone}</span>}
                        {personalInfo?.address && <span className="border-l border-slate-300 pl-4 flex items-center"><MapPin className="h-3.5 w-3.5 mr-1.5 text-orange-500" />{personalInfo.address}</span>}
                    </div>
                </div>

                {personalInfo?.profilePicture && (
                    <div className="shrink-0">
                        <div className="w-36 h-36 rounded-2xl border-4 border-slate-50 shadow-2xl overflow-hidden rotate-2">
                            <img src={personalInfo.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                    </div>
                )}
            </header>

            <div className="grid grid-cols-3 gap-12">
                <div className="col-span-2 space-y-12">
                    {summary && (
                        <section>
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-4 text-orange-600 border-b-2 border-orange-100 pb-2 inline-block">Professional Summary</h2>
                            <p className="text-slate-700 leading-relaxed text-justify text-[15px] font-medium">{summary}</p>
                        </section>
                    )}

                    {experience?.length > 0 && (
                        <section>
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-6 text-orange-600 border-b-2 border-orange-100 pb-2 inline-block">Work Experience</h2>
                            <div className="space-y-10">
                                {experience.map((job, i) => (
                                    <div key={i} className="group">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="font-bold text-xl text-slate-900 group-hover:text-orange-600 transition-colors">{job.position}</h3>
                                            <span className="text-sm font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full">{job.startDate} - {job.endDate}</span>
                                        </div>
                                        <div className="text-orange-500 font-bold mb-4 flex items-center">
                                            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>
                                            {job.company}
                                        </div>
                                        <p className="text-slate-600 whitespace-pre-wrap text-[14px] leading-relaxed border-l-2 border-slate-100 pl-6 py-1">{job.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <div className="space-y-12">
                    {education?.length > 0 && (
                        <section>
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-6 text-orange-600 border-b-2 border-orange-100 pb-2 inline-block">Education</h2>
                            <div className="space-y-8">
                                {education.map((edu, i) => (
                                    <div key={i}>
                                        <div className="font-bold text-slate-900 mb-1">{edu.school}</div>
                                        <div className="text-orange-500 text-sm font-bold italic mb-2">{edu.degree}</div>
                                        <div className="text-[11px] font-black text-slate-400 uppercase tracking-tighter mb-3">{edu.startDate} - {edu.endDate}</div>
                                        {edu.description && <p className="text-[13px] text-slate-500 leading-snug">{edu.description}</p>}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {projects?.length > 0 && (
                        <section>
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-6 text-orange-600 border-b-2 border-orange-100 pb-2 inline-block">Projects</h2>
                            <div className="space-y-8">
                                {projects.map((proj, i) => (
                                    <div key={i} className="bg-slate-50/50 p-4 rounded-xl border border-slate-100/50">
                                        <div className="flex justify-between items-baseline mb-2">
                                            <div className="font-bold text-slate-900">{proj.name}</div>
                                            {proj.link && <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">{proj.link}</span>}
                                        </div>
                                        <p className="text-[13px] text-slate-600 leading-relaxed italic">{proj.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {skills?.length > 0 && (
                        <section>
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-6 text-orange-600 border-b-2 border-orange-100 pb-2 inline-block">Expertise</h2>
                            <div className="flex flex-wrap gap-2.5">
                                {skills.map((skill, i) => (
                                    <span key={i} className="px-3.5 py-1.5 bg-white text-slate-800 border border-slate-200 rounded-lg text-[13px] font-bold shadow-sm hover:border-orange-500 transition-colors">{skill}</span>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );

    // --- Template 2: VISUAL (Recruiter Eye-Catching) ---
    const VisualTemplate = () => (
        <div className="bg-white min-h-[1000px] border-t-[12px] border-orange-500 shadow-2xl overflow-hidden" id="resume-preview-visual" style={{ fontFamily: "'Inter', sans-serif" }}>
            <div className="flex flex-row h-full">
                {/* Visual Sidebar */}
                <div className="w-80 bg-slate-900 text-white p-10 space-y-12">
                    <div className="text-center">
                        {personalInfo?.profilePicture ? (
                            <img src={personalInfo.profilePicture} className="w-44 h-44 rounded-3xl mx-auto shadow-2xl border-4 border-slate-800 object-cover mb-8 rotate-3 hover:rotate-0 transition-transform duration-500" alt="Avatar" />
                        ) : (
                            <div className="w-32 h-32 bg-slate-800 rounded-full mx-auto flex items-center justify-center mb-6">
                                <User className="h-16 w-16 text-slate-600" />
                            </div>
                        )}
                        <h1 className="text-3xl font-black uppercase tracking-tighter mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>{personalInfo?.fullName || 'Your Name'}</h1>
                        <div className="h-1.5 w-16 bg-orange-500 mx-auto rounded-full mb-6"></div>
                        {resume.title && <p className="text-orange-400 font-extrabold text-[11px] uppercase tracking-[0.25em] leading-relaxed px-4">{resume.title}</p>}
                    </div>

                    <div className="space-y-8">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 border-b border-slate-800 pb-3" style={{ fontFamily: "'Montserrat', sans-serif" }}>Contact Details</h3>
                        <div className="space-y-5 text-[13px] text-slate-300 font-medium">
                            {personalInfo?.email && <div className="flex items-center group"><div className="p-2 bg-slate-800 rounded-lg mr-3 group-hover:bg-orange-500 transition-colors"><Mail className="h-3.5 w-3.5 text-white shrink-0" /></div><span className="truncate">{personalInfo.email}</span></div>}
                            {personalInfo?.phone && <div className="flex items-center group"><div className="p-2 bg-slate-800 rounded-lg mr-3 group-hover:bg-orange-500 transition-colors"><Phone className="h-3.5 w-3.5 text-white shrink-0" /></div>{personalInfo.phone}</div>}
                            {personalInfo?.linkedin && <div className="flex items-center group"><div className="p-2 bg-slate-800 rounded-lg mr-3 group-hover:bg-orange-500 transition-colors"><Linkedin className="h-3.5 w-3.5 text-white shrink-0" /></div>LinkedIn Profile</div>}
                            {personalInfo?.website && <div className="flex items-center group"><div className="p-2 bg-slate-800 rounded-lg mr-3 group-hover:bg-orange-500 transition-colors"><Globe className="h-3.5 w-3.5 text-white shrink-0" /></div>Portfolio</div>}
                        </div>
                    </div>

                    <div className="space-y-8">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 border-b border-slate-800 pb-3" style={{ fontFamily: "'Montserrat', sans-serif" }}>Expertise</h3>
                        <div className="space-y-5">
                            {skills?.map((skill, i) => (
                                <div key={i} className="flex flex-col space-y-2">
                                    <div className="flex justify-between text-[11px] font-bold tracking-wide">
                                        <span>{skill}</span>
                                        <span className="text-orange-500">Expert</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-800 w-full rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-orange-600 to-orange-400 w-[90%] rounded-full shadow-[0_0_8px_rgba(249,115,22,0.4)]"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Visual Main Content */}
                <div className="flex-1 p-14 bg-white text-slate-900">
                    <div className="space-y-14">
                        {summary && (
                            <section>
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="p-3 bg-orange-50 rounded-2xl text-orange-600 shadow-sm"><Award className="h-6 w-6" /></div>
                                    <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900" style={{ fontFamily: "'Montserrat', sans-serif" }}>Professional Profile</h2>
                                </div>
                                <div className="relative">
                                    <div className="absolute -left-6 top-0 bottom-0 w-1.5 bg-orange-500 rounded-full"></div>
                                    <p className="text-slate-600 leading-relaxed text-lg font-medium pl-4 italic">
                                        "{summary}"
                                    </p>
                                </div>
                            </section>
                        )}

                        {experience?.length > 0 && (
                            <section>
                                <div className="flex items-center space-x-4 mb-10">
                                    <div className="p-3 bg-orange-50 rounded-2xl text-orange-600 shadow-sm"><Briefcase className="h-6 w-6" /></div>
                                    <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900" style={{ fontFamily: "'Montserrat', sans-serif" }}>Experience History</h2>
                                </div>
                                <div className="relative border-l-2 border-slate-100 ml-4 space-y-14">
                                    {experience.map((job, i) => (
                                        <div key={i} className="pl-10 relative group">
                                            <div className="absolute -left-[11px] top-1.5 w-5 h-5 rounded-full bg-white border-4 border-orange-500 group-hover:scale-125 transition-transform"></div>
                                            <div className="flex flex-col mb-5">
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <h3 className="font-black text-xl text-slate-900">{job.position}</h3>
                                                    <span className="text-[11px] font-black text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg uppercase tracking-widest">{job.startDate} — {job.endDate}</span>
                                                </div>
                                                <span className="text-sm font-extrabold text-slate-400 uppercase tracking-[0.2em]">{job.company}</span>
                                            </div>
                                            <p className="text-slate-600 text-[15px] leading-relaxed whitespace-pre-wrap font-medium">{job.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {education?.length > 0 && (
                            <section>
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="p-3 bg-orange-50 rounded-2xl text-orange-600 shadow-sm"><GraduationCap className="h-6 w-6" /></div>
                                    <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900" style={{ fontFamily: "'Montserrat', sans-serif" }}>Academic Background</h2>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    {education.map((edu, i) => (
                                        <div key={i} className="p-8 rounded-3xl bg-slate-50 border-2 border-transparent hover:border-orange-100 hover:bg-orange-50/30 transition-all group">
                                            <h4 className="font-black text-lg text-slate-900 mb-1 group-hover:text-orange-600 transition-colors">{edu.school}</h4>
                                            <p className="text-slate-500 font-bold text-sm mb-3 italic">{edu.degree}</p>
                                            <div className="text-[10px] font-black text-orange-500 uppercase tracking-[0.15em] mb-4 bg-white inline-block px-3 py-1 rounded-full shadow-sm">{edu.startDate} - {edu.endDate}</div>
                                            {edu.description && <p className="text-[13px] text-slate-500 font-medium leading-relaxed line-clamp-3">{edu.description}</p>}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {projects?.length > 0 && (
                            <section>
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="p-3 bg-orange-50 rounded-2xl text-orange-600 shadow-sm"><Code2 className="h-6 w-6" /></div>
                                    <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900" style={{ fontFamily: "'Montserrat', sans-serif" }}>Key Projects</h2>
                                </div>
                                <div className="space-y-8">
                                    {projects.map((proj, i) => (
                                        <div key={i} className="p-8 rounded-3xl bg-white border-2 border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all">
                                            <div className="flex justify-between items-center mb-4">
                                                <h4 className="font-black text-xl text-slate-900">{proj.name}</h4>
                                                {proj.link && <span className="text-[10px] font-black text-white bg-orange-500 px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-orange-200">{proj.link}</span>}
                                            </div>
                                            <p className="text-slate-600 text-[15px] font-medium leading-relaxed italic">{proj.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    // --- Template 3: ELEGANT (Classic Single Column) ---
    const ElegantTemplate = () => (
        <div className="bg-white p-16 min-h-[1000px] max-w-4xl mx-auto shadow-2xl" id="resume-preview-elegant" style={{ fontFamily: "'Libre Baskerville', serif" }}>
            <div className="text-center mb-16 border-b-2 border-slate-100 pb-16">
                <h1 className="text-6xl font-black tracking-tighter text-slate-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>{personalInfo?.fullName || 'Your Name'}</h1>
                <div className="flex justify-center items-center space-x-8 text-sm text-slate-400 italic mb-8">
                    {personalInfo?.email && <span className="flex items-center"><Mail className="h-3 w-3 mr-2 text-orange-500" />{personalInfo.email}</span>}
                    {personalInfo?.phone && <span className="flex items-center"><Phone className="h-3 w-3 mr-2 text-orange-500" />{personalInfo.phone}</span>}
                    {personalInfo?.address && <span className="flex items-center"><MapPin className="h-3 w-3 mr-2 text-orange-500" />{personalInfo.address}</span>}
                </div>
                {resume.title && <h3 className="text-xl text-orange-600 font-bold tracking-[0.4em] uppercase" style={{ fontFamily: "'Playfair Display', serif" }}>{resume.title}</h3>}
            </div>

            <div className="space-y-16">
                {summary && (
                    <section>
                        <h2 className="text-xs font-black text-slate-300 uppercase tracking-[0.5em] text-center mb-10 italic">Professional Narrative</h2>
                        <p className="text-slate-700 leading-[2] text-center max-w-3xl mx-auto text-lg italic">"{summary}"</p>
                    </section>
                )}

                {experience?.length > 0 && (
                    <section>
                        <h2 className="text-xs font-black text-slate-300 uppercase tracking-[0.5em] text-center mb-12 italic">Professional Milestones</h2>
                        <div className="space-y-14">
                            {experience.map((job, i) => (
                                <div key={i} className="text-center group">
                                    <div className="text-[10px] text-orange-500 font-black mb-3 uppercase tracking-[0.3em] bg-orange-50 inline-block px-4 py-1.5 rounded-full">{job.startDate} — {job.endDate}</div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>{job.position}</h3>
                                    <div className="text-slate-400 font-bold italic mb-6 tracking-widest">{job.company}</div>
                                    <p className="text-slate-600 max-w-2xl mx-auto whitespace-pre-wrap text-[15px] leading-loose group-hover:text-slate-900 transition-colors">{job.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {education?.length > 0 && (
                    <section>
                        <h2 className="text-xs font-black text-slate-300 uppercase tracking-[0.5em] text-center mb-12 italic">Academic Foundation</h2>
                        <div className="space-y-12">
                            {education.map((edu, i) => (
                                <div key={i} className="text-center">
                                    <div className="text-[10px] text-slate-400 font-black mb-3 uppercase tracking-[0.3em]">{edu.startDate} — {edu.endDate}</div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>{edu.school}</h3>
                                    <div className="text-orange-600 font-bold italic mb-4 tracking-widest">{edu.degree}</div>
                                    {edu.description && <p className="text-slate-500 max-w-2xl mx-auto whitespace-pre-wrap text-sm leading-relaxed">{edu.description}</p>}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {projects?.length > 0 && (
                    <section>
                        <h2 className="text-xs font-black text-slate-300 uppercase tracking-[0.5em] text-center mb-12 italic">Signature Initiatives</h2>
                        <div className="space-y-12">
                            {projects.map((proj, i) => (
                                <div key={i} className="text-center group">
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{proj.name}</h3>
                                    {proj.link && <div className="text-orange-500 text-[10px] font-black uppercase tracking-widest mb-5 underline underline-offset-8">{proj.link}</div>}
                                    <p className="text-slate-600 max-w-2xl mx-auto whitespace-pre-wrap text-[15px] leading-loose italic">{proj.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {skills?.length > 0 && (
                    <section>
                        <h2 className="text-xs font-black text-slate-300 uppercase tracking-[0.5em] text-center mb-8 italic">Core Competencies</h2>
                        <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 max-w-2xl mx-auto">
                            {skills.map((skill, i) => (
                                <span key={i} className="text-slate-800 text-sm font-bold tracking-[0.2em] uppercase border-b-2 border-orange-100 pb-1 hover:border-orange-500 transition-colors cursor-default">{skill}</span>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );

    // --- Template 4: GOVERNMENT (Formal, Strict, Dense) ---
    const GovernmentTemplate = () => (
        <div className="bg-white p-14 min-h-[1000px] text-black border-[1px] border-slate-200 shadow-sm" id="resume-preview-government" style={{ fontFamily: "'Libre Baskerville', serif" }}>
            <div className="text-center border-b-4 border-black pb-6 mb-8">
                <h1 className="text-4xl font-bold uppercase mb-3 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>{personalInfo?.fullName || 'YOUR NAME'}</h1>
                <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 text-[13px] font-medium italic">
                    {personalInfo?.address && <span className="flex items-center"><MapPin className="h-3 w-3 mr-1.5" />{personalInfo.address}</span>}
                    {personalInfo?.email && <span className="flex items-center"><Mail className="h-3 w-3 mr-1.5" />{personalInfo.email}</span>}
                    {personalInfo?.phone && <span className="flex items-center"><Phone className="h-3 w-3 mr-1.5" />{personalInfo.phone}</span>}
                </div>
            </div>

            <div className="space-y-8">
                {summary && (
                    <section>
                        <h2 className="text-sm font-black uppercase border-b-2 border-black mb-3 pb-1 tracking-widest" style={{ fontFamily: "'Playfair Display', serif" }}>Statement of Objective</h2>
                        <p className="text-[14px] leading-relaxed text-justify">{summary}</p>
                    </section>
                )}

                {education?.length > 0 && (
                    <section>
                        <h2 className="text-sm font-black uppercase border-b-2 border-black mb-4 pb-1 tracking-widest" style={{ fontFamily: "'Playfair Display', serif" }}>Educational Background</h2>
                        <div className="space-y-5">
                            {education.map((edu, i) => (
                                <div key={i}>
                                    <div className="flex justify-between font-bold text-[15px]">
                                        <span>{edu.school}</span>
                                        <span className="font-medium italic text-sm">{edu.startDate} - {edu.endDate}</span>
                                    </div>
                                    <div className="text-[14px] italic text-slate-700 mt-0.5">{edu.degree}</div>
                                    {edu.description && <p className="text-[13px] mt-2 leading-relaxed text-slate-600">{edu.description}</p>}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {experience?.length > 0 && (
                    <section>
                        <h2 className="text-sm font-black uppercase border-b-2 border-black mb-4 pb-1 tracking-widest" style={{ fontFamily: "'Playfair Display', serif" }}>Professional Experience</h2>
                        <div className="space-y-6">
                            {experience.map((job, i) => (
                                <div key={i}>
                                    <div className="flex justify-between font-bold text-[15px]">
                                        <span>{job.company}</span>
                                        <span className="font-medium italic text-sm">{job.startDate} - {job.endDate}</span>
                                    </div>
                                    <div className="text-[14px] italic mb-2 text-slate-700">{job.position}</div>
                                    <p className="text-[13px] whitespace-pre-wrap leading-relaxed text-slate-600">{job.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {skills?.length > 0 && (
                    <section>
                        <h2 className="text-sm font-black uppercase border-b-2 border-black mb-3 pb-1 tracking-widest" style={{ fontFamily: "'Playfair Display', serif" }}>Technical Qualifications</h2>
                        <p className="text-[14px] leading-loose">{skills.join(' • ')}</p>
                    </section>
                )}
            </div>
        </div>
    );

    // --- Template 5: INTERNSHIP (Education First, Clean) ---
    const InternshipTemplate = () => (
        <div className="bg-white p-14 min-h-[1000px]" id="resume-preview-internship" style={{ fontFamily: "'Inter', sans-serif" }}>
            <header className="flex items-start justify-between border-b-[6px] border-orange-500 pb-8 mb-10">
                <div>
                    <h1 className="text-5xl font-black text-slate-900 mb-2 tracking-tighter">{personalInfo?.fullName || 'Your Name'}</h1>
                    {resume.title && <p className="text-xl text-orange-600 font-bold tracking-wide uppercase">{resume.title}</p>}
                </div>
                <div className="text-right text-[13px] text-slate-500 space-y-2 font-bold uppercase tracking-widest">
                    {personalInfo?.email && <div className="flex justify-end items-center group cursor-pointer hover:text-orange-600 transition-colors"><Mail className="h-3.5 w-3.5 mr-2.5 text-orange-500" />{personalInfo.email}</div>}
                    {personalInfo?.phone && <div className="flex justify-end items-center group cursor-pointer hover:text-orange-600 transition-colors"><Phone className="h-3.5 w-3.5 mr-2.5 text-orange-500" />{personalInfo.phone}</div>}
                    {personalInfo?.linkedin && <div className="flex justify-end items-center group cursor-pointer hover:text-orange-600 transition-colors"><Linkedin className="h-3.5 w-3.5 mr-2.5 text-orange-500" />LinkedIn</div>}
                    {personalInfo?.github && <div className="flex justify-end items-center group cursor-pointer hover:text-orange-600 transition-colors"><Github className="h-3.5 w-3.5 mr-2.5 text-orange-500" />Github</div>}
                </div>
            </header>

            <div className="grid grid-cols-3 gap-12">
                <div className="col-span-2 space-y-12">
                    {summary && (
                        <section>
                            <h2 className="text-sm font-black text-slate-900 uppercase mb-5 flex items-center tracking-[0.2em]">
                                <span className="w-2.5 h-6 bg-orange-500 mr-4 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.3)]"></span> Professional Narrative
                            </h2>
                            <p className="text-slate-600 leading-relaxed bg-slate-50/50 p-6 rounded-2xl border border-slate-100 italic font-medium text-[15px]">"{summary}"</p>
                        </section>
                    )}

                    {education?.length > 0 && (
                        <section>
                            <h2 className="text-sm font-black text-slate-900 uppercase mb-6 flex items-center tracking-[0.2em]">
                                <span className="w-2.5 h-6 bg-orange-500 mr-4 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.3)]"></span> Academic Foundation
                            </h2>
                            <div className="space-y-8">
                                {education.map((edu, i) => (
                                    <div key={i} className="relative pl-8 border-l-2 border-slate-100 group">
                                        <div className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-white border-2 border-orange-500 group-hover:bg-orange-500 transition-colors"></div>
                                        <h3 className="font-black text-xl text-slate-900 mb-1">{edu.school}</h3>
                                        <div className="text-orange-600 font-extrabold text-sm mb-2 italic">{edu.degree}</div>
                                        <div className="text-[11px] font-black text-slate-400 mb-4 bg-slate-50 inline-block px-3 py-1 rounded-full uppercase tracking-tighter">{edu.startDate} - {edu.endDate}</div>
                                        {edu.description && <p className="text-[14px] text-slate-500 leading-relaxed font-medium">{edu.description}</p>}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {projects?.length > 0 && (
                        <section>
                            <h2 className="text-sm font-black text-slate-900 uppercase mb-6 flex items-center tracking-[0.2em]">
                                <span className="w-2.5 h-6 bg-orange-500 mr-4 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.3)]"></span> Key Initiatives
                            </h2>
                            <div className="space-y-6">
                                {projects.map((proj, i) => (
                                    <div key={i} className="bg-white p-6 rounded-2xl border-2 border-slate-50 hover:border-orange-100 transition-all shadow-sm hover:shadow-md">
                                        <div className="flex justify-between items-center mb-3">
                                            <h3 className="font-black text-lg text-slate-900">{proj.name}</h3>
                                            {proj.link && <span className="text-[10px] font-black text-white bg-orange-500 px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">{proj.link}</span>}
                                        </div>
                                        <p className="text-[14px] text-slate-600 leading-relaxed italic font-medium">{proj.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {experience?.length > 0 && (
                        <section>
                            <h2 className="text-sm font-black text-slate-900 uppercase mb-6 flex items-center tracking-[0.2em]">
                                <span className="w-2.5 h-6 bg-orange-500 mr-4 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.3)]"></span> Professional Exposure
                            </h2>
                            <div className="space-y-8">
                                {experience.map((job, i) => (
                                    <div key={i} className="pl-6 relative border-l-2 border-slate-100 group">
                                        <div className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-white border-2 border-orange-500 group-hover:bg-orange-500 transition-colors"></div>
                                        <h3 className="font-black text-xl text-slate-900 mb-1">{job.position}</h3>
                                        <div className="text-slate-500 font-bold mb-3 uppercase tracking-widest text-sm">{job.company} <span className="text-slate-300 mx-2">/</span> <span className="text-[11px] text-orange-500 font-black">{job.startDate} - {job.endDate}</span></div>
                                        <p className="text-[14px] text-slate-600 leading-relaxed font-medium">{job.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <div className="space-y-12">
                    {skills?.length > 0 && (
                        <section>
                            <h2 className="text-sm font-black text-slate-900 uppercase mb-6 flex items-center tracking-[0.2em]">
                                <span className="w-2.5 h-6 bg-orange-500 mr-4 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.3)]"></span> Core Skills
                            </h2>
                            <div className="flex flex-wrap gap-2.5">
                                {skills.map((skill, i) => (
                                    <span key={i} className="px-4 py-2 bg-orange-50/50 text-orange-700 rounded-xl text-[13px] font-black border-2 border-orange-100/50 shadow-sm hover:scale-105 transition-transform">{skill}</span>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );

    // Render based on templateId
    switch (templateId) {
        case 'visual': return <VisualTemplate />;
        case 'elegant': return <ElegantTemplate />;
        case 'government': return <GovernmentTemplate />;
        case 'internship': return <InternshipTemplate />;
        case 'modern':
        default: return <ModernTemplate />;
    }
};

export default ResumePreview;
