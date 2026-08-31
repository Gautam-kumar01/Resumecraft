import {
    Mail,
    Phone,
    MapPin,
    Linkedin,
    Github,
    Globe, 
    Briefcase,
    GraduationCap,
    Award,
    User
} from 'lucide-react';
import AuroraTemplate from './templates/AuroraTemplate';

const ResumePreview = ({ resume }) => {
    if (!resume) return null;

    const { templateId = 'modern' } = resume;
    const hiddenSections = new Set(resume.hiddenSections || []);
    const personalInfo = hiddenSections.has('personal') ? {} : (resume.personalInfo || {});
    const summary = hiddenSections.has('summary') ? '' : (resume.summary || '');
    const education = hiddenSections.has('education') ? [] : (resume.education || []);
    const experience = hiddenSections.has('experience') ? [] : (resume.experience || []);
    const skills = hiddenSections.has('skills') ? [] : (resume.skills || []);
    const projects = hiddenSections.has('projects') ? [] : (resume.projects || []);
    const certifications = hiddenSections.has('certifications') ? [] : (resume.certifications || []);
    const previewResume = {
        ...resume,
        personalInfo: hiddenSections.has('personal') ? {} : personalInfo,
        summary,
        education,
        experience,
        skills,
        projects,
        certifications,
        achievements: hiddenSections.has('achievements') ? [] : (resume.achievements || []),
        languages: hiddenSections.has('languages') ? [] : (resume.languages || []),
        volunteer: hiddenSections.has('volunteer') ? [] : (resume.volunteer || []),
        interests: hiddenSections.has('interests') ? [] : (resume.interests || []),
        customSections: hiddenSections.has('custom') ? [] : (resume.customSections || []),
    };
    const displayTitle = resume.title?.trim().toLowerCase() === 'untitled resume'
        ? ''
        : resume.title?.trim();

    // Helper to render HTML from Quill Editor safely
    const renderHTML = (htmlContent, className = "text-sm") => {
        if (!htmlContent) return null;
        
        // If the content is just plain text (no HTML tags) from legacy data
        if (!htmlContent.includes('<') && !htmlContent.includes('>')) {
             let points = htmlContent.split('\n').filter(p => p.trim());
             if (points.length === 1 && htmlContent.includes('.') && htmlContent.length > 100) {
                 points = htmlContent.split('.').filter(p => p.trim().length > 10).map(p => p.trim() + '.');
             }
             return (
                 <ul className="space-y-1 text-left list-disc pl-5 max-w-full min-w-0 break-words">
                     {points.map((point, i) => (
                         <li key={i} className={className}>
                             <span>{point.trim().replace(/^[•*-]\s*/, '')}</span>
                         </li>
                     ))}
                 </ul>
             );
        }

        return (
            <div 
                className={`quill-content max-w-full min-w-0 break-words [overflow-wrap:anywhere] ${className}`} 
                dangerouslySetInnerHTML={{ __html: htmlContent }} 
            />
        );
    };

    // --- Template 1: MODERN (Original) ---
    const ModernTemplate = () => (
        <div className="bg-white p-12 w-full h-full text-slate-900" id="resume-preview-modern" style={{ wordSpacing: '0.02em', fontFamily: 'var(--font-sans)' }}>
            <header className="flex flex-row justify-between items-start gap-8 mb-10">
                <div className="flex-1">
                    <h1 className="text-4xl font-black uppercase tracking-tight mb-2 text-slate-900 leading-none">{personalInfo?.fullName || 'Your Name'}</h1>
                    {displayTitle && <p className="text-xl text-orange-600 font-bold mb-6 tracking-wide uppercase">{displayTitle}</p>}

                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-slate-500 font-semibold">
                        {personalInfo?.email && <span className="flex items-center"><Mail className="h-4 w-4 mr-2 text-orange-500" />{personalInfo.email}</span>}
                        {personalInfo?.phone && <span className="flex items-center"><Phone className="h-4 w-4 mr-2 text-orange-500" />{personalInfo.phone}</span>}
                        {personalInfo?.address && <span className="flex items-center"><MapPin className="h-4 w-4 mr-2 text-orange-500" />{personalInfo.address}</span>}
                        {personalInfo?.linkedin && <span className="flex items-center"><Linkedin className="h-4 w-4 mr-2 text-orange-500" />{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>}
                        {personalInfo?.github && <span className="flex items-center"><Github className="h-4 w-4 mr-2 text-orange-500" />{personalInfo.github.replace(/^https?:\/\/(www\.)?/, '')}</span>}
                        {personalInfo?.website && <span className="flex items-center"><Globe className="h-4 w-4 mr-2 text-orange-500" />{personalInfo.website.replace(/^https?:\/\/(www\.)?/, '')}</span>}
                    </div>
                </div>

                {personalInfo?.profilePicture && (
                    <div className="shrink-0">
                        <div className="w-28 h-28 rounded-2xl border-4 border-slate-50 shadow-xl overflow-hidden ring-1 ring-slate-200">
                            <img src={personalInfo.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                    </div>
                )}
            </header>

            <div className="grid grid-cols-3 gap-12 min-w-0">
                <div className="col-span-2 space-y-8 min-w-0">
                    {summary && (
                        <section>
                            <h2 className="text-[13px] font-black uppercase tracking-[0.15em] mb-4 text-slate-900 flex items-center">
                                <span className="w-8 h-[2px] bg-orange-500 mr-3"></span>
                                Profile
                            </h2>
                            <div className="pl-11 min-w-0 max-w-full">
                                {renderHTML(summary, "text-slate-600 text-[14px] leading-relaxed")}
                            </div>
                        </section>
                    )}

                    {experience?.length > 0 && (
                        <section>
                            <h2 className="text-[13px] font-black uppercase tracking-[0.15em] mb-6 text-slate-900 flex items-center">
                                <span className="w-8 h-[2px] bg-orange-500 mr-3"></span>
                                Experience
                            </h2>
                            <div className="space-y-8 pl-11">
                                {experience.map((job, i) => (
                                    <div key={i} className="relative">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="text-[16px] text-slate-900 font-bold tracking-tight">{job.position}</h3>
                                            <span className="text-[12px] font-bold text-slate-400 tabular-nums">{job.startDate} — {job.endDate}</span>
                                        </div>
                                        <div className="text-orange-600 font-bold mb-3 flex items-center text-[12px] uppercase tracking-wider">
                                            {job.company}
                                        </div>
                                        {renderHTML(job.description, "text-slate-600 text-[13px] leading-relaxed")}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <div className="space-y-8">
                    {education?.length > 0 && (
                        <section>
                            <h2 className="text-[13px] font-black uppercase tracking-[0.15em] mb-4 text-slate-900">Education</h2>
                            <div className="space-y-6">
                                {education.map((edu, i) => (
                                    <div key={i}>
                                        <div className="font-bold text-slate-900 text-[15px] mb-1">{edu.school}</div>
                                        <div className="text-orange-600 text-[13px] font-bold mb-1 italic">{edu.degree}</div>
                                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{edu.startDate} — {edu.endDate}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {certifications?.length > 0 && (
                        <section>
                            <h2 className="text-[13px] font-black uppercase tracking-[0.15em] mb-4 text-slate-900">Certifications</h2>
                            <div className="space-y-5">
                                {certifications.map((cert, i) => (
                                    <div key={i}>
                                        <div className="font-bold text-slate-900 text-[14px] mb-1">{cert.name}</div>
                                        <div className="text-orange-600 text-[12px] font-bold mb-1">{cert.issuer}</div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{cert.date}</div>
                                        {cert.link && <div className="text-[10px] font-bold text-slate-400 mt-1 break-all underline">{cert.link}</div>}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {projects?.length > 0 && (
                        <section>
                            <h2 className="text-[13px] font-black uppercase tracking-[0.15em] mb-4 text-slate-900">Projects</h2>
                            <div className="space-y-5">
                                {projects.map((proj, i) => (
                                    <div key={i} className="group">
                                        <div className="font-bold text-slate-900 text-[14px] mb-1 group-hover:text-orange-600 transition-colors">{proj.name}</div>
                                        {proj.link && <div className="text-[10px] font-bold text-slate-400 mb-2 break-all underline">{proj.link}</div>}
                                        {renderHTML(proj.description, "text-[12px] text-slate-600 leading-relaxed")}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {skills?.length > 0 && (
                        <section>
                            <h2 className="text-[13px] font-black uppercase tracking-[0.15em] mb-4 text-slate-900">Expertise</h2>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill, i) => (
                                    <span key={i} className="px-3 py-1.5 bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-[12px] font-bold tracking-tight">{skill}</span>
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
        <div className="bg-white w-full h-full border-t-[12px] border-orange-500 overflow-hidden" id="resume-preview-visual" style={{ fontFamily: "var(--font-sans)" }}>
            <div className="flex flex-row h-full">
                {/* Visual Sidebar */}
                <div className="w-[35%] bg-slate-900 text-white p-8 space-y-8">
                    <div className="text-center">
                        {personalInfo?.profilePicture ? (
                            <img src={personalInfo.profilePicture} className="w-32 h-32 rounded-3xl mx-auto shadow-2xl border-4 border-slate-800 object-cover mb-6 rotate-3 hover:rotate-0 transition-transform duration-500" alt="Avatar" />
                        ) : (
                            <div className="w-24 h-24 bg-slate-800 rounded-full mx-auto flex items-center justify-center mb-5">
                                <User className="h-12 w-12 text-slate-600" />
                            </div>
                        )}
                        <h1 className="text-2xl font-black uppercase tracking-wide mb-2 leading-tight">{personalInfo?.fullName || 'Your Name'}</h1>
                        <div className="h-1 w-12 bg-orange-500 mx-auto rounded-full mb-4"></div>
                        {displayTitle && <p className="text-orange-400 font-extrabold text-[11px] uppercase tracking-[0.2em] leading-relaxed">{displayTitle}</p>}
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-800 pb-2">Contact</h3>
                        <div className="space-y-4 text-[13px] text-slate-300 font-medium">
                            {personalInfo?.email && <div className="flex items-center group break-all"><div className="p-1.5 bg-slate-800 rounded-md mr-2.5 group-hover:bg-orange-500 transition-colors"><Mail className="h-3 w-3 text-white shrink-0" /></div><span>{personalInfo.email}</span></div>}
                            {personalInfo?.phone && <div className="flex items-center group"><div className="p-1.5 bg-slate-800 rounded-md mr-2.5 group-hover:bg-orange-500 transition-colors"><Phone className="h-3 w-3 text-white shrink-0" /></div>{personalInfo.phone}</div>}
                            {personalInfo?.address && <div className="flex items-center group"><div className="p-1.5 bg-slate-800 rounded-md mr-2.5 group-hover:bg-orange-500 transition-colors"><MapPin className="h-3 w-3 text-white shrink-0" /></div>{personalInfo.address}</div>}
                            {personalInfo?.linkedin && <div className="flex items-center group"><div className="p-1.5 bg-slate-800 rounded-md mr-2.5 group-hover:bg-orange-500 transition-colors"><Linkedin className="h-3 w-3 text-white shrink-0" /></div><span className="break-all">{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span></div>}
                            {personalInfo?.github && <div className="flex items-center group"><div className="p-1.5 bg-slate-800 rounded-md mr-2.5 group-hover:bg-orange-500 transition-colors"><Github className="h-3 w-3 text-white shrink-0" /></div><span className="break-all">{personalInfo.github.replace(/^https?:\/\/(www\.)?/, '')}</span></div>}
                            {personalInfo?.website && <div className="flex items-center group"><div className="p-1.5 bg-slate-800 rounded-md mr-2.5 group-hover:bg-orange-500 transition-colors"><Globe className="h-3 w-3 text-white shrink-0" /></div><span className="break-all">{personalInfo.website.replace(/^https?:\/\/(www\.)?/, '')}</span></div>}
                        </div>
                    </div>

                    {skills?.length > 0 && (
                        <div className="space-y-6">
                            <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-800 pb-2">Expertise</h3>
                            <div className="space-y-4">
                                {skills.map((skill, i) => (
                                    <div key={i} className="flex flex-col space-y-1.5">
                                        <div className="text-[12px] font-bold tracking-wide text-slate-200">{skill}</div>
                                        <div className="h-1 bg-slate-800 w-full rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-orange-600 to-orange-400 w-[85%] rounded-full"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Visual Main Content */}
                <div className="flex-1 p-10 bg-white text-slate-900">
                    <div className="space-y-8">
                        {summary && (
                            <section>
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="p-2 bg-orange-50 rounded-xl text-orange-600"><Award className="h-5 w-5" /></div>
                                    <h2 className="text-xl font-black uppercase tracking-wide text-slate-900">Profile</h2>
                                </div>
                                <div className="relative pl-4">
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 rounded-full"></div>
                                    {renderHTML(summary, "text-slate-600 text-[13px] font-medium leading-relaxed italic")}
                                </div>
                            </section>
                        )}

                        {experience?.length > 0 && (
                            <section>
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="p-2 bg-orange-50 rounded-xl text-orange-600"><Briefcase className="h-5 w-5" /></div>
                                    <h2 className="text-xl font-black uppercase tracking-wide text-slate-900">Experience</h2>
                                </div>
                                <div className="relative border-l-2 border-slate-100 ml-3 space-y-8">
                                    {experience.map((job, i) => (
                                        <div key={i} className="pl-6 relative group">
                                            <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-orange-500 group-hover:scale-125 transition-transform"></div>
                                            <div className="flex flex-col mb-3">
                                                <div className="flex justify-between items-baseline mb-0.5">
                                                    <h3 className="font-black text-[16px] text-slate-900">{job.position}</h3>
                                                    <span className="text-[10px] font-black text-orange-600 bg-orange-50 px-2 py-1 rounded-md uppercase tracking-widest">{job.startDate} — {job.endDate}</span>
                                                </div>
                                                <span className="text-[12px] font-extrabold text-slate-400 uppercase tracking-[0.1em]">{job.company}</span>
                                            </div>
                                            {renderHTML(job.description, "text-slate-600 text-[13px] leading-relaxed font-medium")}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {education?.length > 0 && (
                            <section>
                                <div className="flex items-center space-x-3 mb-5">
                                    <div className="p-2 bg-orange-50 rounded-xl text-orange-600"><GraduationCap className="h-5 w-5" /></div>
                                    <h2 className="text-xl font-black uppercase tracking-wide text-slate-900">Education</h2>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {education.map((edu, i) => (
                                        <div key={i} className="p-5 rounded-2xl bg-slate-50 border-2 border-transparent hover:border-orange-100 hover:bg-orange-50/30 transition-all">
                                            <h4 className="font-black text-[14px] text-slate-900 mb-1">{edu.school}</h4>
                                            <p className="text-slate-500 font-bold text-[13px] mb-2">{edu.degree}</p>
                                            <div className="text-[10px] font-black text-orange-500 uppercase tracking-[0.1em] bg-white inline-block px-2 py-0.5 rounded-sm shadow-sm">{edu.startDate} - {edu.endDate}</div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {certifications?.length > 0 && (
                            <section>
                                <div className="flex items-center space-x-3 mb-5">
                                    <div className="p-2 bg-orange-50 rounded-xl text-orange-600"><Award className="h-5 w-5" /></div>
                                    <h2 className="text-xl font-black uppercase tracking-wide text-slate-900">Certifications</h2>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {certifications.map((cert, i) => (
                                        <div key={i} className="p-5 rounded-2xl bg-slate-50 border-2 border-transparent hover:border-orange-100 hover:bg-orange-50/30 transition-all">
                                            <h4 className="font-black text-[14px] text-slate-900 mb-1">{cert.name}</h4>
                                            <p className="text-slate-500 font-bold text-[13px] mb-2">{cert.issuer}</p>
                                            {cert.date && <div className="text-[10px] font-black text-orange-500 uppercase tracking-[0.1em] bg-white inline-block px-2 py-0.5 rounded-sm shadow-sm">{cert.date}</div>}
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
        <div className="bg-white p-12 w-full h-full shadow-inner" id="resume-preview-elegant" style={{ fontFamily: "var(--font-serif)", wordSpacing: '0.05em' }}>
            <div className="text-center mb-10 border-b border-slate-200 pb-10">
                <h1 className="text-5xl font-black tracking-wide text-slate-900 mb-4" style={{ fontFamily: "'Georgia', serif" }}>{personalInfo?.fullName || 'Your Name'}</h1>
                <div className="flex justify-center items-center space-x-6 text-[13px] text-slate-500 italic mb-5 flex-wrap gap-y-2">
                    {personalInfo?.email && <span className="flex items-center"><Mail className="h-3.5 w-3.5 mr-1.5 text-orange-500" />{personalInfo.email}</span>}
                    {personalInfo?.phone && <span className="flex items-center"><Phone className="h-3.5 w-3.5 mr-1.5 text-orange-500" />{personalInfo.phone}</span>}
                    {personalInfo?.address && <span className="flex items-center"><MapPin className="h-3.5 w-3.5 mr-1.5 text-orange-500" />{personalInfo.address}</span>}
                    {personalInfo?.linkedin && <span className="flex items-center"><Linkedin className="h-3.5 w-3.5 mr-1.5 text-orange-500" />{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>}
                    {personalInfo?.github && <span className="flex items-center"><Github className="h-3.5 w-3.5 mr-1.5 text-orange-500" />{personalInfo.github.replace(/^https?:\/\/(www\.)?/, '')}</span>}
                    {personalInfo?.website && <span className="flex items-center"><Globe className="h-3.5 w-3.5 mr-1.5 text-orange-500" />{personalInfo.website.replace(/^https?:\/\/(www\.)?/, '')}</span>}
                </div>
                {displayTitle && <h3 className="text-[15px] text-orange-600 font-bold tracking-[0.3em] uppercase" style={{ fontFamily: "'Georgia', serif" }}>{displayTitle}</h3>}
            </div>

            <div className="space-y-10 px-4">
                {summary && (
                    <section>
                        <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] text-center mb-6 italic">Professional Narrative</h2>
                        <div className="max-w-3xl mx-auto">
                            {renderHTML(summary, "text-slate-700 text-[14px] italic leading-relaxed text-center")}
                        </div>
                    </section>
                )}

                {experience?.length > 0 && (
                    <section>
                        <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] text-center mb-8 italic">Professional Milestones</h2>
                        <div className="space-y-8">
                            {experience.map((job, i) => (
                                <div key={i} className="text-center">
                                    <div className="text-[10px] text-orange-500 font-black mb-2 uppercase tracking-widest">{job.startDate} — {job.endDate}</div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-1" style={{ fontFamily: "'Georgia', serif" }}>{job.position}</h3>
                                    <div className="text-slate-500 font-bold italic mb-4 text-[14px]">{job.company}</div>
                                    <div className="max-w-2xl mx-auto text-left inline-block">
                                        {renderHTML(job.description, "text-slate-600 text-[13px] leading-loose")}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {education?.length > 0 && (
                    <section>
                        <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] text-center mb-8 italic">Academic Foundation</h2>
                        <div className="space-y-6">
                            {education.map((edu, i) => (
                                <div key={i} className="text-center">
                                    <div className="text-[10px] text-slate-400 font-black mb-2 uppercase tracking-widest">{edu.startDate} — {edu.endDate}</div>
                                    <h3 className="text-[18px] font-bold text-slate-900 mb-1" style={{ fontFamily: "'Georgia', serif" }}>{edu.school}</h3>
                                    <div className="text-orange-600 font-bold italic text-[14px]">{edu.degree}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {certifications?.length > 0 && (
                    <section>
                        <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] text-center mb-8 italic">Certifications</h2>
                        <div className="space-y-5">
                            {certifications.map((cert, i) => (
                                <div key={i} className="text-center">
                                    {cert.date && <div className="text-[10px] text-slate-400 font-black mb-2 uppercase tracking-widest">{cert.date}</div>}
                                    <h3 className="text-[17px] font-bold text-slate-900 mb-1" style={{ fontFamily: "'Georgia', serif" }}>{cert.name}</h3>
                                    <div className="text-orange-600 font-bold italic text-[13px]">{cert.issuer}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {skills?.length > 0 && (
                    <section>
                        <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] text-center mb-6 italic">Core Competencies</h2>
                        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 max-w-2xl mx-auto">
                            {skills.map((skill, i) => (
                                <span key={i} className="text-slate-700 text-[13px] font-bold tracking-[0.1em] uppercase">{skill}</span>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );

    // --- Template 4: GOVERNMENT (Formal, Strict, Dense) ---
    const GovernmentTemplate = () => (
        <div className="bg-white p-12 w-full h-full text-black border-2 border-slate-100" id="resume-preview-government" style={{ fontFamily: "var(--font-serif)" }}>
            <div className="text-center border-b-4 border-black pb-5 mb-6">
                <h1 className="text-3xl font-bold uppercase mb-2 tracking-wide" style={{ fontFamily: "'Georgia', serif" }}>{personalInfo?.fullName || 'YOUR NAME'}</h1>
                <div className="flex justify-center flex-wrap gap-x-4 gap-y-1 text-[13px] font-medium">
                    {personalInfo?.address && <span>{personalInfo.address}</span>}
                    {personalInfo?.email && <span>{personalInfo.email}</span>}
                    {personalInfo?.phone && <span>{personalInfo.phone}</span>}
                    {personalInfo?.linkedin && <span>LINKEDIN: {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>}
                    {personalInfo?.github && <span>GITHUB: {personalInfo.github.replace(/^https?:\/\/(www\.)?/, '')}</span>}
                    {personalInfo?.website && <span>WEBSITE: {personalInfo.website.replace(/^https?:\/\/(www\.)?/, '')}</span>}
                </div>
            </div>

            <div className="space-y-6">
                {summary && (
                    <section>
                        <h2 className="text-[14px] font-black uppercase border-b-2 border-black mb-2 pb-0.5 tracking-wider">Statement of Objective</h2>
                        {renderHTML(summary, "text-[13px] text-black leading-snug")}
                    </section>
                )}

                {experience?.length > 0 && (
                    <section>
                        <h2 className="text-[14px] font-black uppercase border-b-2 border-black mb-3 pb-0.5 tracking-wider">Professional Experience</h2>
                        <div className="space-y-4">
                            {experience.map((job, i) => (
                                <div key={i}>
                                    <div className="flex justify-between font-bold text-[14px]">
                                        <span>{job.company}</span>
                                        <span className="font-medium text-[13px]">{job.startDate} - {job.endDate}</span>
                                    </div>
                                    <div className="text-[13px] italic mb-1 text-gray-800">{job.position}</div>
                                    {renderHTML(job.description, "text-[12px] text-black leading-snug")}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {education?.length > 0 && (
                    <section>
                        <h2 className="text-[14px] font-black uppercase border-b-2 border-black mb-3 pb-0.5 tracking-wider">Educational Background</h2>
                        <div className="space-y-3">
                            {education.map((edu, i) => (
                                <div key={i}>
                                    <div className="flex justify-between font-bold text-[14px]">
                                        <span>{edu.school}</span>
                                        <span className="font-medium text-[13px]">{edu.startDate} - {edu.endDate}</span>
                                    </div>
                                    <div className="text-[13px] italic text-gray-800 mt-0.5">{edu.degree}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {certifications?.length > 0 && (
                    <section>
                        <h2 className="text-[14px] font-black uppercase border-b-2 border-black mb-3 pb-0.5 tracking-wider">Certifications</h2>
                        <div className="space-y-3">
                            {certifications.map((cert, i) => (
                                <div key={i}>
                                    <div className="flex justify-between font-bold text-[14px]">
                                        <span>{cert.name}</span>
                                        <span className="font-medium text-[13px]">{cert.date}</span>
                                    </div>
                                    <div className="text-[13px] italic text-gray-800 mt-0.5">{cert.issuer}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {skills?.length > 0 && (
                    <section>
                        <h2 className="text-[14px] font-black uppercase border-b-2 border-black mb-2 pb-0.5 tracking-wider">Technical Qualifications</h2>
                        <p className="text-[13px] leading-relaxed">{skills.join(' • ')}</p>
                    </section>
                )}
            </div>
        </div>
    );

    // --- Template 5: INTERNSHIP (Education First, Clean) ---
    const InternshipTemplate = () => (
        <div className="bg-white p-10 w-full h-full" id="resume-preview-internship" style={{ fontFamily: "var(--font-sans)" }}>
            <header className="flex items-start justify-between border-b-[4px] border-orange-500 pb-6 mb-8">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 mb-1 tracking-tight">{personalInfo?.fullName || 'Your Name'}</h1>
                    {displayTitle && <p className="text-[16px] text-orange-600 font-bold uppercase">{displayTitle}</p>}
                </div>
                <div className="text-right text-[12px] text-slate-500 space-y-1 font-bold uppercase tracking-wider">
                    {personalInfo?.email && <div>{personalInfo.email}</div>}
                    {personalInfo?.phone && <div>{personalInfo.phone}</div>}
                    {personalInfo?.linkedin && <div>{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</div>}
                    {personalInfo?.github && <div>{personalInfo.github.replace(/^https?:\/\/(www\.)?/, '')}</div>}
                    {personalInfo?.website && <div>{personalInfo.website.replace(/^https?:\/\/(www\.)?/, '')}</div>}
                </div>
            </header>

            <div className="grid grid-cols-3 gap-8">
                <div className="col-span-2 space-y-8">
                    {summary && (
                        <section>
                            <h2 className="text-[13px] font-black text-slate-900 uppercase mb-4 flex items-center tracking-wider">
                                <span className="w-2 h-5 bg-orange-500 mr-3 rounded-full"></span> Profile
                            </h2>
                            <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                                {renderHTML(summary, "text-slate-600 italic font-medium text-[13px] leading-relaxed")}
                            </div>
                        </section>
                    )}

                    {education?.length > 0 && (
                        <section>
                            <h2 className="text-[13px] font-black text-slate-900 uppercase mb-4 flex items-center tracking-wider">
                                <span className="w-2 h-5 bg-orange-500 mr-3 rounded-full"></span> Education
                            </h2>
                            <div className="space-y-5">
                                {education.map((edu, i) => (
                                    <div key={i} className="relative pl-6 border-l-2 border-slate-100">
                                        <div className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-white border-2 border-orange-500"></div>
                                        <h3 className="font-black text-[15px] text-slate-900 mb-0.5">{edu.school}</h3>
                                        <div className="text-orange-600 font-extrabold text-[13px] mb-1.5 italic">{edu.degree}</div>
                                        <div className="text-[11px] font-black text-slate-400 bg-slate-50 inline-block px-2 py-0.5 rounded-sm uppercase">{edu.startDate} - {edu.endDate}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {experience?.length > 0 && (
                        <section>
                            <h2 className="text-[13px] font-black text-slate-900 uppercase mb-4 flex items-center tracking-wider">
                                <span className="w-2 h-5 bg-orange-500 mr-3 rounded-full"></span> Experience
                            </h2>
                            <div className="space-y-6">
                                {experience.map((job, i) => (
                                    <div key={i} className="pl-6 relative border-l-2 border-slate-100">
                                        <div className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-white border-2 border-orange-500"></div>
                                        <h3 className="font-black text-[15px] text-slate-900 mb-0.5">{job.position}</h3>
                                        <div className="text-slate-500 font-bold mb-2 uppercase text-[12px]">{job.company} <span className="text-orange-500 mx-2 font-black">{job.startDate} - {job.endDate}</span></div>
                                        {renderHTML(job.description, "text-[13px] text-slate-600 leading-relaxed font-medium")}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <div className="space-y-8">
                    {skills?.length > 0 && (
                        <section>
                            <h2 className="text-[13px] font-black text-slate-900 uppercase mb-4 flex items-center tracking-wider">
                                <span className="w-2 h-5 bg-orange-500 mr-3 rounded-full"></span> Skills
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill, i) => (
                                    <span key={i} className="px-3 py-1.5 bg-orange-50/50 text-orange-700 rounded-lg text-[12px] font-black border border-orange-100/50">{skill}</span>
                                ))}
                            </div>
                        </section>
                    )}

                    {certifications?.length > 0 && (
                        <section>
                            <h2 className="text-[13px] font-black text-slate-900 uppercase mb-4 flex items-center tracking-wider">
                                <span className="w-2 h-5 bg-orange-500 mr-3 rounded-full"></span> Certifications
                            </h2>
                            <div className="space-y-4">
                                {certifications.map((cert, i) => (
                                    <div key={i} className="bg-white p-4 rounded-xl border-2 border-slate-50">
                                        <h3 className="font-black text-[13px] text-slate-900 mb-1">{cert.name}</h3>
                                        <div className="text-[12px] text-slate-500 font-bold">{cert.issuer}</div>
                                        {cert.date && <div className="text-[10px] text-orange-500 font-black uppercase tracking-wider mt-1">{cert.date}</div>}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                    
                    {projects?.length > 0 && (
                        <section>
                            <h2 className="text-[13px] font-black text-slate-900 uppercase mb-4 flex items-center tracking-wider">
                                <span className="w-2 h-5 bg-orange-500 mr-3 rounded-full"></span> Projects
                            </h2>
                            <div className="space-y-4">
                                {projects.map((proj, i) => (
                                    <div key={i} className="bg-white p-4 rounded-xl border-2 border-slate-50">
                                        <h3 className="font-black text-[13px] text-slate-900 mb-1">{proj.name}</h3>
                                        {renderHTML(proj.description, "text-[12px] text-slate-600 leading-relaxed italic font-medium")}
                                    </div>
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
        <div className="bg-white p-12 w-full h-full text-slate-900" id="resume-preview-executive" style={{ fontFamily: 'var(--font-sans)' }}>
            <header className="mb-10 text-center border-b-2 border-slate-900 pb-8">
                <h1 className="text-4xl font-black uppercase tracking-tight mb-4 text-slate-900 leading-none">
                    {personalInfo?.fullName || 'Your Name'}
                </h1>
                <div className="flex justify-center flex-wrap gap-y-2 gap-x-8 text-[12px] font-bold text-slate-500 uppercase tracking-widest">
                    {personalInfo?.email && <span className="flex items-center"><Mail className="h-3.5 w-3.5 mr-2 text-orange-500" />{personalInfo.email}</span>}
                    {personalInfo?.phone && <span className="flex items-center"><Phone className="h-3.5 w-3.5 mr-2 text-orange-500" />{personalInfo.phone}</span>}
                    {personalInfo?.address && <span className="flex items-center"><MapPin className="h-3.5 w-3.5 mr-2 text-orange-500" />{personalInfo.address}</span>}
                    {personalInfo?.linkedin && <span className="flex items-center"><Linkedin className="h-3.5 w-3.5 mr-2 text-orange-500" />{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>}
                    {personalInfo?.github && <span className="flex items-center"><Github className="h-3.5 w-3.5 mr-2 text-orange-500" />{personalInfo.github.replace(/^https?:\/\/(www\.)?/, '')}</span>}
                    {personalInfo?.website && <span className="flex items-center"><Globe className="h-3.5 w-3.5 mr-2 text-orange-500" />{personalInfo.website.replace(/^https?:\/\/(www\.)?/, '')}</span>}
                </div>
            </header>

            <div className="space-y-10">
                {summary && (
                    <section>
                        <h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-orange-600 mb-4 border-b border-slate-100 pb-2">
                            Executive Summary
                        </h2>
                        <div className="pl-4">
                            {renderHTML(summary, "text-[13px] text-slate-700 leading-relaxed font-medium")}
                        </div>
                    </section>
                )}

                {experience?.length > 0 && (
                    <section>
                        <h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-orange-600 mb-6 border-b border-slate-100 pb-2">
                            Professional Experience
                        </h2>
                        <div className="space-y-8 pl-4">
                            {experience.map((job, i) => (
                                <div key={i} className="relative">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="text-[16px] font-bold text-slate-900">{job.position}</h3>
                                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded">
                                            {job.startDate} — {job.endDate}
                                        </span>
                                    </div>
                                    <div className="text-orange-600 text-[13px] font-bold mb-3 uppercase tracking-wide">
                                        {job.company}
                                    </div>
                                    <div className="pl-4 border-l-2 border-slate-100">
                                        {renderHTML(job.description, "text-[13px] text-slate-600 leading-relaxed")}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <div className="grid grid-cols-2 gap-12">
                    {education?.length > 0 && (
                        <section>
                            <h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-orange-600 mb-4 border-b border-slate-100 pb-2">
                                Education
                            </h2>
                            <div className="space-y-5 pl-4">
                                {education.map((edu, i) => (
                                    <div key={i}>
                                        <h3 className="text-[14px] font-bold text-slate-900 mb-1">{edu.school}</h3>
                                        <div className="text-slate-500 text-[12px] font-bold mb-1 italic">{edu.degree}</div>
                                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                            {edu.startDate} — {edu.endDate}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {certifications?.length > 0 && (
                        <section>
                            <h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-orange-600 mb-4 border-b border-slate-100 pb-2">
                                Certifications
                            </h2>
                            <div className="space-y-5 pl-4">
                                {certifications.map((cert, i) => (
                                    <div key={i}>
                                        <h3 className="text-[14px] font-bold text-slate-900 mb-1">{cert.name}</h3>
                                        <div className="text-slate-500 text-[12px] font-bold mb-1 italic">{cert.issuer}</div>
                                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{cert.date}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {skills?.length > 0 && (
                        <section>
                            <h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-orange-600 mb-4 border-b border-slate-100 pb-2">
                                Core Competencies
                            </h2>
                            <div className="flex flex-wrap gap-2 pl-4">
                                {skills.map((skill, i) => (
                                    <span key={i} className="px-3 py-1.5 bg-slate-50 text-slate-700 border border-slate-200 rounded text-[11px] font-bold uppercase tracking-tight">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );

    const renderAdditionalSections = () => {
        const hasAdditional = previewResume.achievements?.length || previewResume.languages?.length || previewResume.volunteer?.length || previewResume.interests?.length || previewResume.customSections?.length;
        if (!hasAdditional) return null;
        const sectionHeading = (title) => <h2 className="mb-2 mt-5 border-b-2 border-[var(--resume-accent)] pb-1 text-sm font-black uppercase tracking-wider text-slate-800">{title}</h2>;
        return <div className="bg-white px-12 pb-12 pt-2 text-sm text-slate-700">
            {previewResume.achievements?.length > 0 && <section>{sectionHeading('Achievements')}{previewResume.achievements.map((item, index) => <div key={`achievement-preview-${index}`} className="mb-2"><strong>{item.name}</strong>{item.date ? ` — ${item.date}` : ''}{item.description ? <div>{item.description}</div> : null}</div>)}</section>}
            {previewResume.languages?.length > 0 && <section>{sectionHeading('Languages')}<p>{previewResume.languages.map((item) => `${item.name}${item.proficiency ? ` (${item.proficiency})` : ''}`).join(' • ')}</p></section>}
            {previewResume.volunteer?.length > 0 && <section>{sectionHeading('Volunteer Experience')}{previewResume.volunteer.map((item, index) => <div key={`volunteer-preview-${index}`} className="mb-2"><strong>{item.role}</strong>{item.organization ? ` — ${item.organization}` : ''}{item.description ? <div>{item.description}</div> : null}</div>)}</section>}
            {previewResume.interests?.length > 0 && <section>{sectionHeading('Interests')}<p>{previewResume.interests.join(' • ')}</p></section>}
            {previewResume.customSections?.map((item, index) => <section key={`custom-preview-${index}`}>{sectionHeading(item.title || 'Additional Information')}{renderHTML(item.content, 'text-sm')}</section>)}
        </div>;
    };

    // Map template IDs to components
    const templates = {
        modern: ModernTemplate,
        visual: VisualTemplate,
        elegant: ElegantTemplate,
        government: GovernmentTemplate,
        internship: InternshipTemplate,
        executive: ExecutiveTemplate
    };

    if (templateId === 'aurora') {
        return <div className="min-h-full bg-white" style={{ fontFamily: resume.customization?.fontFamily || undefined, '--resume-accent': resume.customization?.accentColor || '#f97316' }}><AuroraTemplate resume={previewResume} renderHTML={renderHTML} />{renderAdditionalSections()}</div>;
    }

        const SelectedTemplate = templates[templateId] || ModernTemplate;
    // The existing templates are render-only functions defined in this component.
    // eslint-disable-next-line react-hooks/static-components
    return <div className="min-h-full bg-white" style={{ fontFamily: resume.customization?.fontFamily || undefined, '--resume-accent': resume.customization?.accentColor || '#f97316', lineHeight: resume.customization?.lineSpacing || undefined }}><SelectedTemplate />{renderAdditionalSections()}</div>;
};

export default ResumePreview;
