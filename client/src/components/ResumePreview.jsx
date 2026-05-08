
import React from 'react';
import {
    Mail,
    Phone,
    MapPin,
    Linkedin ,
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

    // Helper to render summary as points
    const renderSummaryPoints = (text, className = "resume-text text-[14px]", bulletColor = "bg-orange-500") => {
        if (!text) return null;
        
        // Split by newlines first. If it's just one line, try splitting by dots to create points.
        let points = text.split('\n').filter(p => p.trim());
        
        if (points.length === 1 && text.includes('.') && text.length > 100) {
            points = text.split('.').filter(p => p.trim().length > 10).map(p => p.trim() + '.');
        }

        return (
            <ul className="space-y-2 text-left">
                {points.map((point, i) => (
                    <li key={i} className={`flex items-start ${className}`}>
                        <span className={`w-1.5 h-1.5 ${bulletColor} rounded-full mt-1.5 mr-3 shrink-0`}></span>
                        <span>{point.trim().replace(/^[•\-\*]\s*/, '')}</span>
                    </li>
                ))}
            </ul>
        );
    };

    // --- Template 1: MODERN (Original) ---
    const ModernTemplate = () => (
        <div className="bg-white p-8 min-h-[1000px]" id="resume-preview-modern" style={{ wordSpacing: '0.02em' }}>
            <header className="border-b-2 border-slate-900 pb-6 mb-6 flex flex-row justify-between items-center gap-6 text-slate-900">
                <div className="flex-1">
                    <h1 className="text-4xl font-black uppercase tracking-wide mb-1 text-slate-900 leading-tight">{personalInfo?.fullName || 'Your Name'}</h1>
                    {resume.title && <p className="text-lg text-orange-600 font-bold mb-4 tracking-widest italic uppercase">{resume.title}</p>}

                    <div className="flex flex-wrap gap-4 text-[15px] text-slate-500 font-semibold tracking-wide">
                        {personalInfo?.email && <span className="flex items-center"><Mail className="h-3 w-3 mr-1.5 text-orange-500" />{personalInfo.email}</span>}
                        {personalInfo?.phone && <span className="border-l border-slate-300 pl-4 flex items-center"><Phone className="h-3 w-3 mr-1.5 text-orange-500" />{personalInfo.phone}</span>}
                        {personalInfo?.address && <span className="border-l border-slate-300 pl-4 flex items-center"><MapPin className="h-3 w-3 mr-1.5 text-orange-500" />{personalInfo.address}</span>}
                    </div>
                </div>

                {personalInfo?.profilePicture && (
                    <div className="shrink-0">
                        <div className="w-28 h-28 rounded-2xl border-4 border-slate-50 shadow-xl overflow-hidden rotate-2">
                            <img src={personalInfo.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                    </div>
                )}
            </header>

            <div className="grid grid-cols-3 gap-8">
                <div className="col-span-2 space-y-8">
                    {summary && (
                        <section>
                            <h2 className="resume-heading text-[12px] uppercase tracking-[0.2em] mb-3 text-orange-600 border-b border-orange-100 pb-1 inline-block">Professional Summary</h2>
                            {renderSummaryPoints(summary)}
                        </section>
                    )}

                    {experience?.length > 0 && (
                        <section>
                            <h2 className="resume-heading text-[12px] uppercase tracking-[0.2em] mb-4 text-orange-600 border-b border-orange-100 pb-1 inline-block">Work Experience</h2>
                            <div className="space-y-6">
                                {experience.map((job, i) => (
                                    <div key={i} className="group">
                                        <div className="flex justify-between items-baseline mb-0.5">
                                            <h3 className={`resume-heading ${job.position.length > 40 ? 'text-lg' : 'text-lg'} text-slate-900 group-hover:text-orange-600 transition-colors tracking-wide leading-snug`}>{job.position}</h3>
                                            <span className="resume-text text-[13px] font-bold text-slate-400 bg-slate-50 px-2.5 py-0.5 rounded-full shrink-0 ml-4">{job.startDate} - {job.endDate}</span>
                                        </div>
                                        <div className="resume-heading text-orange-500 font-bold mb-2 flex items-center tracking-wider uppercase text-[12px]">
                                            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>
                                            {job.company}
                                        </div>
                                        <p className="resume-text text-slate-600 whitespace-pre-wrap text-[14px] border-l-2 border-slate-100 pl-4 py-0.5">{job.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <div className="space-y-8">
                    {education?.length > 0 && (
                        <section>
                            <h2 className="text-[12px] font-black uppercase tracking-[0.2em] mb-4 text-orange-600 border-b border-orange-100 pb-1 inline-block">Education</h2>
                            <div className="space-y-6">
                                {education.map((edu, i) => (
                                    <div key={i}>
                                        <div className="font-bold text-slate-900 text-base mb-0.5 tracking-wide">{edu.school}</div>
                                        <div className="text-orange-500 text-sm font-bold italic mb-1 tracking-wide">{edu.degree}</div>
                                        <div className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-2">{edu.startDate} - {edu.endDate}</div>
                                        {edu.description && <p className="text-[14px] text-slate-500 leading-snug">{edu.description}</p>}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {projects?.length > 0 && (
                        <section>
                            <h2 className="text-[12px] font-black uppercase tracking-[0.2em] mb-4 text-orange-600 border-b border-orange-100 pb-1 inline-block">Projects</h2>
                            <div className="space-y-6">
                                {projects.map((proj, i) => (
                                    <div key={i} className="bg-slate-50/50 p-3 rounded-xl border border-slate-100/50">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <div className="font-bold text-slate-900 text-base tracking-wide">{proj.name}</div>
                                            {proj.link && <span className="text-[11px] font-bold text-orange-600 uppercase tracking-widest">{proj.link}</span>}
                                        </div>
                                        <p className="text-[14px] text-slate-600 leading-relaxed italic">{proj.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {skills?.length > 0 && (
                        <section>
                            <h2 className="text-[12px] font-black uppercase tracking-[0.2em] mb-4 text-orange-600 border-b border-orange-100 pb-1 inline-block">Expertise</h2>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill, i) => (
                                    <span key={i} className="px-3 py-1 bg-slate-50 text-slate-700 border border-slate-200 rounded-md text-[13px] font-bold shadow-sm hover:border-orange-500 hover:bg-white transition-all tracking-wide">{skill}</span>
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
        <div className="bg-white min-h-[1000px] border-t-[12px] border-orange-500 shadow-2xl overflow-hidden" id="resume-preview-visual" style={{ fontFamily: "var(--font-sans)" }}>
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
                        <h1 className="text-3xl font-black uppercase tracking-wide mb-2 leading-tight" style={{ fontFamily: "'Roboto', Arial, sans-serif" }}>{personalInfo?.fullName || 'Your Name'}</h1>
                        <div className="h-1.5 w-16 bg-orange-500 mx-auto rounded-full mb-6"></div>
                        {resume.title && <p className="text-orange-400 font-extrabold text-[13px] uppercase tracking-[0.25em] leading-relaxed px-4">{resume.title}</p>}
                    </div>

                    <div className="space-y-8">
                        <h3 className="text-[12px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-800 pb-3" style={{ fontFamily: "'Roboto', Arial, sans-serif" }}>Contact Details</h3>
                        <div className="space-y-5 text-[15px] text-slate-300 font-medium">
                            {personalInfo?.email && <div className="flex items-center group"><div className="p-2 bg-slate-800 rounded-lg mr-3 group-hover:bg-orange-500 transition-colors"><Mail className="h-3.5 w-3.5 text-white shrink-0" /></div><span className="truncate">{personalInfo.email}</span></div>}
                            {personalInfo?.phone && <div className="flex items-center group"><div className="p-2 bg-slate-800 rounded-lg mr-3 group-hover:bg-orange-500 transition-colors"><Phone className="h-3.5 w-3.5 text-white shrink-0" /></div>{personalInfo.phone}</div>}
                            {personalInfo?.linkedin && <div className="flex items-center group"><div className="p-2 bg-slate-800 rounded-lg mr-3 group-hover:bg-orange-500 transition-colors"><Linkedin className="h-3.5 w-3.5 text-white shrink-0" /></div>LinkedIn Profile</div>}
                            {personalInfo?.website && <div className="flex items-center group"><div className="p-2 bg-slate-800 rounded-lg mr-3 group-hover:bg-orange-500 transition-colors"><Globe className="h-3.5 w-3.5 text-white shrink-0" /></div>Portfolio</div>}
                        </div>
                    </div>

                    <div className="space-y-8">
                        <h3 className="text-[12px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-800 pb-3" style={{ fontFamily: "'Roboto', Arial, sans-serif" }}>Expertise</h3>
                        <div className="space-y-5">
                            {skills?.map((skill, i) => (
                                <div key={i} className="flex flex-col space-y-2">
                                    <div className="flex justify-between text-[13px] font-bold tracking-wide">
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
                                    <h2 className="text-2xl font-black uppercase tracking-normal text-slate-900" style={{ fontFamily: "'Roboto', Arial, sans-serif" }}>Professional Profile</h2>
                                </div>
                                <div className="relative pl-4">
                                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-orange-500 rounded-full"></div>
                                    {renderSummaryPoints(summary, "text-slate-600 text-[17px] font-medium leading-relaxed italic")}
                                </div>
                            </section>
                        )}

                        {experience?.length > 0 && (
                            <section>
                                <div className="flex items-center space-x-4 mb-10">
                                    <div className="p-3 bg-orange-50 rounded-2xl text-orange-600 shadow-sm"><Briefcase className="h-6 w-6" /></div>
                                    <h2 className="text-2xl font-black uppercase tracking-normal text-slate-900" style={{ fontFamily: "'Roboto', Arial, sans-serif" }}>Experience History</h2>
                                </div>
                                <div className="relative border-l-2 border-slate-100 ml-4 space-y-14">
                                    {experience.map((job, i) => (
                                        <div key={i} className="pl-10 relative group">
                                            <div className="absolute -left-[11px] top-1.5 w-5 h-5 rounded-full bg-white border-4 border-orange-500 group-hover:scale-125 transition-transform"></div>
                                            <div className="flex flex-col mb-5">
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <h3 className="font-black text-xl text-slate-900">{job.position}</h3>
                                                    <span className="text-[13px] font-black text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg uppercase tracking-widest">{job.startDate} — {job.endDate}</span>
                                                </div>
                                                <span className="text-base font-extrabold text-slate-400 uppercase tracking-[0.2em]">{job.company}</span>
                                            </div>
                                            <p className="text-slate-600 text-[17px] leading-relaxed whitespace-pre-wrap font-medium">{job.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {education?.length > 0 && (
                            <section>
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="p-3 bg-orange-50 rounded-2xl text-orange-600 shadow-sm"><GraduationCap className="h-6 w-6" /></div>
                                    <h2 className="text-2xl font-black uppercase tracking-normal text-slate-900" style={{ fontFamily: "'Roboto', Arial, sans-serif" }}>Academic Background</h2>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    {education.map((edu, i) => (
                                        <div key={i} className="p-8 rounded-3xl bg-slate-50 border-2 border-transparent hover:border-orange-100 hover:bg-orange-50/30 transition-all group">
                                            <h4 className="font-black text-lg text-slate-900 mb-1 group-hover:text-orange-600 transition-colors">{edu.school}</h4>
                                            <p className="text-slate-500 font-bold text-base mb-3 italic">{edu.degree}</p>
                                            <div className="text-[12px] font-black text-orange-500 uppercase tracking-[0.15em] mb-4 bg-white inline-block px-3 py-1 rounded-full shadow-sm">{edu.startDate} - {edu.endDate}</div>
                                            {edu.description && <p className="text-[15px] text-slate-500 font-medium leading-relaxed line-clamp-3">{edu.description}</p>}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {projects?.length > 0 && (
                            <section>
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="p-3 bg-orange-50 rounded-2xl text-orange-600 shadow-sm"><Code2 className="h-6 w-6" /></div>
                                    <h2 className="text-2xl font-black uppercase tracking-normal text-slate-900" style={{ fontFamily: "'Roboto', Arial, sans-serif" }}>Key Projects</h2>
                                </div>
                                <div className="space-y-8">
                                    {projects.map((proj, i) => (
                                        <div key={i} className="p-8 rounded-3xl bg-white border-2 border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all">
                                            <div className="flex justify-between items-center mb-4">
                                                <h4 className="font-black text-xl text-slate-900">{proj.name}</h4>
                                                {proj.link && <span className="text-[12px] font-black text-white bg-orange-500 px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-orange-200">{proj.link}</span>}
                                            </div>
                                            <p className="text-slate-600 text-[17px] font-medium leading-relaxed italic">{proj.description}</p>
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
        <div className="bg-white p-16 min-h-[1000px] max-w-4xl mx-auto shadow-2xl" id="resume-preview-elegant" style={{ fontFamily: "var(--font-serif)", wordSpacing: '0.05em' }}>
            <div className="text-center mb-16 border-b-2 border-slate-100 pb-16">
                <h1 className="text-6xl font-black tracking-wide text-slate-900 mb-6" style={{ fontFamily: "'Georgia', serif" }}>{personalInfo?.fullName || 'Your Name'}</h1>
                <div className="flex justify-center items-center space-x-8 text-base text-slate-400 italic mb-8">
                    {personalInfo?.email && <span className="flex items-center"><Mail className="h-3 w-3 mr-2 text-orange-500" />{personalInfo.email}</span>}
                    {personalInfo?.phone && <span className="flex items-center"><Phone className="h-3 w-3 mr-2 text-orange-500" />{personalInfo.phone}</span>}
                    {personalInfo?.address && <span className="flex items-center"><MapPin className="h-3 w-3 mr-2 text-orange-500" />{personalInfo.address}</span>}
                </div>
                {resume.title && <h3 className="text-xl text-orange-600 font-bold tracking-[0.4em] uppercase" style={{ fontFamily: "'Georgia', serif" }}>{resume.title}</h3>}
            </div>

            <div className="space-y-16">
                {summary && (
                    <section>
                        <h2 className="text-sm font-black text-slate-300 uppercase tracking-[0.5em] text-center mb-10 italic">Professional Narrative</h2>
                        <div className="max-w-3xl mx-auto">
                            {renderSummaryPoints(summary, "text-slate-700 text-lg italic")}
                        </div>
                    </section>
                )}

                {experience?.length > 0 && (
                    <section>
                        <h2 className="text-sm font-black text-slate-300 uppercase tracking-[0.5em] text-center mb-12 italic">Professional Milestones</h2>
                        <div className="space-y-14">
                            {experience.map((job, i) => (
                                <div key={i} className="text-center group">
                                    <div className="text-[12px] text-orange-500 font-black mb-3 uppercase tracking-widest bg-orange-50 inline-block px-4 py-1.5 rounded-full">{job.startDate} — {job.endDate}</div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-1" style={{ fontFamily: "'Georgia', serif" }}>{job.position}</h3>
                                    <div className="text-slate-400 font-bold italic mb-6 tracking-widest">{job.company}</div>
                                    <p className="text-slate-600 max-w-2xl mx-auto whitespace-pre-wrap text-[17px] leading-loose group-hover:text-slate-900 transition-colors">{job.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {education?.length > 0 && (
                    <section>
                        <h2 className="text-sm font-black text-slate-300 uppercase tracking-[0.5em] text-center mb-12 italic">Academic Foundation</h2>
                        <div className="space-y-12">
                            {education.map((edu, i) => (
                                <div key={i} className="text-center">
                                    <div className="text-[12px] text-slate-400 font-black mb-3 uppercase tracking-widest">{edu.startDate} — {edu.endDate}</div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-1" style={{ fontFamily: "'Georgia', serif" }}>{edu.school}</h3>
                                    <div className="text-orange-600 font-bold italic mb-4 tracking-widest">{edu.degree}</div>
                                    {edu.description && <p className="text-slate-500 max-w-2xl mx-auto whitespace-pre-wrap text-base leading-relaxed">{edu.description}</p>}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {projects?.length > 0 && (
                    <section>
                        <h2 className="text-sm font-black text-slate-300 uppercase tracking-[0.5em] text-center mb-12 italic">Signature Initiatives</h2>
                        <div className="space-y-12">
                            {projects.map((proj, i) => (
                                <div key={i} className="text-center group">
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2" style={{ fontFamily: "'Georgia', serif" }}>{proj.name}</h3>
                                    {proj.link && <div className="text-orange-500 text-[12px] font-black uppercase tracking-widest mb-5 underline underline-offset-8">{proj.link}</div>}
                                    <p className="text-slate-600 max-w-2xl mx-auto whitespace-pre-wrap text-[17px] leading-loose italic">{proj.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {skills?.length > 0 && (
                    <section>
                        <h2 className="text-sm font-black text-slate-300 uppercase tracking-[0.5em] text-center mb-8 italic">Core Competencies</h2>
                        <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 max-w-2xl mx-auto">
                            {skills.map((skill, i) => (
                                <span key={i} className="text-slate-800 text-base font-bold tracking-[0.2em] uppercase border-b-2 border-orange-100 pb-1 hover:border-orange-500 transition-colors cursor-default">{skill}</span>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );

    // --- Template 4: GOVERNMENT (Formal, Strict, Dense) ---
    const GovernmentTemplate = () => (
        <div className="bg-white p-14 min-h-[1000px] text-black border-[1px] border-slate-200 shadow-sm" id="resume-preview-government" style={{ fontFamily: "var(--font-serif)", wordSpacing: '0.05em' }}>
            <div className="text-center border-b-4 border-black pb-6 mb-8">
                <h1 className="text-4xl font-bold uppercase mb-3 tracking-wide" style={{ fontFamily: "'Georgia', serif" }}>{personalInfo?.fullName || 'YOUR NAME'}</h1>
                <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 text-[15px] font-medium italic">
                    {personalInfo?.address && <span className="flex items-center"><MapPin className="h-3 w-3 mr-1.5" />{personalInfo.address}</span>}
                    {personalInfo?.email && <span className="flex items-center"><Mail className="h-3 w-3 mr-1.5" />{personalInfo.email}</span>}
                    {personalInfo?.phone && <span className="flex items-center"><Phone className="h-3 w-3 mr-1.5" />{personalInfo.phone}</span>}
                </div>
            </div>

            <div className="space-y-8">
                {summary && (
                    <section>
                        <h2 className="text-base font-black uppercase border-b-2 border-black mb-3 pb-1 tracking-widest" style={{ fontFamily: "'Georgia', serif" }}>Statement of Objective</h2>
                        <div className="max-w-none">
                            {renderSummaryPoints(summary, "text-[16px] text-black", "bg-black")}
                        </div>
                    </section>
                )}

                {education?.length > 0 && (
                    <section>
                        <h2 className="text-base font-black uppercase border-b-2 border-black mb-4 pb-1 tracking-widest" style={{ fontFamily: "'Georgia', serif" }}>Educational Background</h2>
                        <div className="space-y-5">
                            {education.map((edu, i) => (
                                <div key={i}>
                                    <div className="flex justify-between font-bold text-[17px]">
                                        <span>{edu.school}</span>
                                        <span className="font-medium italic text-base">{edu.startDate} - {edu.endDate}</span>
                                    </div>
                                    <div className="text-[16px] italic text-slate-700 mt-0.5">{edu.degree}</div>
                                    {edu.description && <p className="text-[15px] mt-2 leading-relaxed text-slate-600">{edu.description}</p>}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {experience?.length > 0 && (
                    <section>
                        <h2 className="text-base font-black uppercase border-b-2 border-black mb-4 pb-1 tracking-widest" style={{ fontFamily: "'Georgia', serif" }}>Professional Experience</h2>
                        <div className="space-y-6">
                            {experience.map((job, i) => (
                                <div key={i}>
                                    <div className="flex justify-between font-bold text-[17px]">
                                        <span>{job.company}</span>
                                        <span className="font-medium italic text-base">{job.startDate} - {job.endDate}</span>
                                    </div>
                                    <div className="text-[16px] italic mb-2 text-slate-700">{job.position}</div>
                                    <p className="text-[15px] whitespace-pre-wrap leading-relaxed text-slate-600">{job.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {skills?.length > 0 && (
                    <section>
                        <h2 className="text-base font-black uppercase border-b-2 border-black mb-3 pb-1 tracking-widest" style={{ fontFamily: "'Georgia', serif" }}>Technical Qualifications</h2>
                        <p className="text-[16px] leading-loose">{skills.join(' • ')}</p>
                    </section>
                )}
            </div>
        </div>
    );

    // --- Template 5: INTERNSHIP (Education First, Clean) ---
    const InternshipTemplate = () => (
        <div className="bg-white p-14 min-h-[1000px]" id="resume-preview-internship" style={{ fontFamily: "var(--font-sans)", wordSpacing: '0.05em' }}>
            <header className="flex items-start justify-between border-b-[6px] border-orange-500 pb-8 mb-10">
                <div>
                    <h1 className="text-5xl font-black text-slate-900 mb-2 tracking-wide">{personalInfo?.fullName || 'Your Name'}</h1>
                    {resume.title && <p className="text-xl text-orange-600 font-bold tracking-wide uppercase">{resume.title}</p>}
                </div>
                <div className="text-right text-[15px] text-slate-500 space-y-2 font-bold uppercase tracking-widest">
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
                            <h2 className="text-base font-black text-slate-900 uppercase mb-5 flex items-center tracking-[0.2em]">
                                <span className="w-2.5 h-6 bg-orange-500 mr-4 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.3)]"></span> Professional Narrative
                            </h2>
                            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                                {renderSummaryPoints(summary, "text-slate-600 italic font-medium text-[17px]")}
                            </div>
                        </section>
                    )}

                    {education?.length > 0 && (
                        <section>
                            <h2 className="text-base font-black text-slate-900 uppercase mb-6 flex items-center tracking-[0.2em]">
                                <span className="w-2.5 h-6 bg-orange-500 mr-4 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.3)]"></span> Academic Foundation
                            </h2>
                            <div className="space-y-8">
                                {education.map((edu, i) => (
                                    <div key={i} className="relative pl-8 border-l-2 border-slate-100 group">
                                        <div className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-white border-2 border-orange-500 group-hover:bg-orange-500 transition-colors"></div>
                                        <h3 className="font-black text-xl text-slate-900 mb-1">{edu.school}</h3>
                                        <div className="text-orange-600 font-extrabold text-base mb-2 italic">{edu.degree}</div>
                                        <div className="text-[13px] font-black text-slate-400 mb-4 bg-slate-50 inline-block px-3 py-1 rounded-full uppercase tracking-normal">{edu.startDate} - {edu.endDate}</div>
                                        {edu.description && <p className="text-[16px] text-slate-500 leading-relaxed font-medium">{edu.description}</p>}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {projects?.length > 0 && (
                        <section>
                            <h2 className="text-base font-black text-slate-900 uppercase mb-6 flex items-center tracking-[0.2em]">
                                <span className="w-2.5 h-6 bg-orange-500 mr-4 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.3)]"></span> Key Initiatives
                            </h2>
                            <div className="space-y-6">
                                {projects.map((proj, i) => (
                                    <div key={i} className="bg-white p-6 rounded-2xl border-2 border-slate-50 hover:border-orange-100 transition-all shadow-sm hover:shadow-md">
                                        <div className="flex justify-between items-center mb-3">
                                            <h3 className="font-black text-lg text-slate-900">{proj.name}</h3>
                                            {proj.link && <span className="text-[12px] font-black text-white bg-orange-500 px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">{proj.link}</span>}
                                        </div>
                                        <p className="text-[16px] text-slate-600 leading-relaxed italic font-medium">{proj.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {experience?.length > 0 && (
                        <section>
                            <h2 className="text-base font-black text-slate-900 uppercase mb-6 flex items-center tracking-[0.2em]">
                                <span className="w-2.5 h-6 bg-orange-500 mr-4 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.3)]"></span> Professional Exposure
                            </h2>
                            <div className="space-y-8">
                                {experience.map((job, i) => (
                                    <div key={i} className="pl-6 relative border-l-2 border-slate-100 group">
                                        <div className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-white border-2 border-orange-500 group-hover:bg-orange-500 transition-colors"></div>
                                        <h3 className="font-black text-xl text-slate-900 mb-1">{job.position}</h3>
                                        <div className="text-slate-500 font-bold mb-3 uppercase tracking-widest text-base">{job.company} <span className="text-slate-300 mx-2">/</span> <span className="text-[13px] text-orange-500 font-black">{job.startDate} - {job.endDate}</span></div>
                                        <p className="text-[16px] text-slate-600 leading-relaxed font-medium">{job.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <div className="space-y-12">
                    {skills?.length > 0 && (
                        <section>
                            <h2 className="text-base font-black text-slate-900 uppercase mb-6 flex items-center tracking-[0.2em]">
                                <span className="w-2.5 h-6 bg-orange-500 mr-4 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.3)]"></span> Core Skills
                            </h2>
                            <div className="flex flex-wrap gap-2.5">
                                {skills.map((skill, i) => (
                                    <span key={i} className="px-4 py-2 bg-orange-50/50 text-orange-700 rounded-xl text-[15px] font-black border-2 border-orange-100/50 shadow-sm hover:scale-105 transition-transform">{skill}</span>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );

    // --- Template 6: EXECUTIVE (ATS Friendly, Corporate) ---
    const ExecutiveTemplate = () => (
        <div className="bg-white p-12 min-h-[1123px] max-w-[794px] mx-auto" id="resume-preview-executive" style={{ color: "var(--color-executive-primary)" }}>
            {/* Header */}
            <header className="mb-8 border-b-2 border-executive-primary pb-8">
                <h1 className="resume-heading text-3xl uppercase tracking-tight mb-2" style={{ color: "var(--color-executive-primary)" }}>
                    {personalInfo?.fullName || 'Your Name'}
                </h1>
                <div className="resume-text flex flex-wrap gap-y-2 gap-x-6 text-[12px] font-medium text-executive-secondary mb-4">
                    {personalInfo?.email && <span className="flex items-center"><Mail className="h-3.5 w-3.5 mr-2 text-executive-accent" />{personalInfo.email}</span>}
                    {personalInfo?.phone && <span className="flex items-center"><Phone className="h-3.5 w-3.5 mr-2 text-executive-accent" />{personalInfo.phone}</span>}
                    {personalInfo?.address && <span className="flex items-center"><MapPin className="h-3.5 w-3.5 mr-2 text-executive-accent" />{personalInfo.address}</span>}
                    {personalInfo?.linkedin && <span className="flex items-center"><Linkedin className="h-3.5 w-3.5 mr-2 text-executive-accent" />LinkedIn</span>}
                </div>
                {resume.title && (
                    <div className="resume-heading inline-block bg-executive-primary text-white px-4 py-1.5 rounded-sm text-[11px] uppercase tracking-[0.2em]">
                        {resume.title}
                    </div>
                )}
            </header>

            <div className="space-y-8">
                {/* Summary */}
                {summary && (
                    <section>
                        <h2 className="resume-heading text-[13px] uppercase tracking-[0.2em] text-executive-accent mb-4 border-b border-executive-border pb-2">
                            Professional Summary
                        </h2>
                        <div className="resume-text text-[12px] leading-[1.6] text-executive-primary">
                            {renderSummaryPoints(summary, "resume-text text-executive-primary text-[12px] leading-[1.6]", "bg-executive-primary")}
                        </div>
                    </section>
                )}

                {/* Experience */}
                {experience?.length > 0 && (
                    <section>
                        <h2 className="resume-heading text-[13px] uppercase tracking-[0.2em] text-executive-accent mb-6 border-b border-executive-border pb-2">
                            Professional Experience
                        </h2>
                        <div className="space-y-6">
                            {experience.map((job, i) => (
                                <div key={i} className="relative pl-0">
                                    <div className="flex justify-between items-baseline mb-1.5">
                                        <h3 className="resume-heading text-[15px] text-executive-primary">{job.position}</h3>
                                        <span className="resume-text text-[11px] font-bold text-executive-secondary bg-slate-50 px-3 py-1 rounded-md border border-executive-border">
                                            {job.startDate} — {job.endDate}
                                        </span>
                                    </div>
                                    <div className="resume-heading text-executive-accent text-[13px] mb-3 uppercase tracking-wider">
                                        {job.company}
                                    </div>
                                    <p className="resume-text text-[12px] text-executive-primary whitespace-pre-wrap pl-4 border-l-2 border-executive-border">
                                        {job.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <div className="grid grid-cols-2 gap-12">
                    {/* Education */}
                    {education?.length > 0 && (
                        <section>
                            <h2 className="resume-heading text-[13px] uppercase tracking-[0.2em] text-executive-accent mb-6 border-b border-executive-border pb-2">
                                Education
                            </h2>
                            <div className="space-y-5">
                                {education.map((edu, i) => (
                                    <div key={i}>
                                        <h3 className="resume-heading text-[14px] text-executive-primary mb-1">{edu.school}</h3>
                                        <div className="resume-text text-executive-secondary text-[12px] font-bold mb-1">{edu.degree}</div>
                                        <div className="resume-text text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                                            {edu.startDate} — {edu.endDate}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Skills */}
                    {skills?.length > 0 && (
                        <section>
                            <h2 className="resume-heading text-[13px] uppercase tracking-[0.2em] text-executive-accent mb-6 border-b border-executive-border pb-2">
                                Technical Expertise
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill, i) => (
                                    <span key={i} className="resume-text px-3 py-1.5 bg-white text-executive-primary border border-executive-border rounded-md text-[11px] font-bold shadow-sm hover:border-executive-accent transition-colors tracking-wide">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Projects */}
                {projects?.length > 0 && (
                    <section>
                        <h2 className="resume-heading text-[13px] uppercase tracking-[0.2em] text-executive-accent mb-6 border-b border-executive-border pb-2">
                            Signature Projects
                        </h2>
                        <div className="grid grid-cols-1 gap-4">
                            {projects.map((proj, i) => (
                                <div key={i} className="p-4 bg-slate-50/50 rounded-lg border border-executive-border group hover:bg-white transition-colors">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="resume-heading text-[14px] text-executive-primary">{proj.name}</h4>
                                        {proj.link && <span className="resume-text text-[10px] text-executive-accent uppercase tracking-widest">{proj.link}</span>}
                                    </div>
                                    <p className="resume-text text-[12px] text-executive-secondary italic">
                                        {proj.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );

    // Render based on templateId
    switch (templateId) {
        case 'visual': return <VisualTemplate />;
        case 'elegant': return <ElegantTemplate />;
        case 'government': return <GovernmentTemplate />;
        case 'internship': return <InternshipTemplate />;
        case 'executive': return <ExecutiveTemplate />;
        case 'modern':
        default: return <ModernTemplate />;
    }
};

export default ResumePreview;
