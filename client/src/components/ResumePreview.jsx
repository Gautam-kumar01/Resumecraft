
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
        <div className="bg-white p-12 min-h-[1000px] font-sans" id="resume-preview">
            <header className="border-b-2 border-slate-900 pb-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-slate-900">
                <div className="flex-1">
                    <h1 className="text-4xl font-bold uppercase tracking-widest mb-2">{personalInfo?.fullName || 'Your Name'}</h1>
                    <p className="text-xl text-slate-600 font-light mb-6">{resume.title || 'Professional Title'}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                        {personalInfo?.email && <span className="flex items-center"><Mail className="h-3 w-3 mr-1" />{personalInfo.email}</span>}
                        {personalInfo?.phone && <span className="border-l border-slate-300 pl-4 flex items-center"><Phone className="h-3 w-3 mr-1" />{personalInfo.phone}</span>}
                        {personalInfo?.address && <span className="border-l border-slate-300 pl-4 flex items-center"><MapPin className="h-3 w-3 mr-1" />{personalInfo.address}</span>}
                    </div>
                </div>

                {personalInfo?.profilePicture && (
                    <div className="shrink-0">
                        <div className="w-32 h-32 rounded-full border-4 border-slate-100 shadow-lg overflow-hidden">
                            <img src={personalInfo.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                    </div>
                )}
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="md:col-span-2 space-y-10">
                    {summary && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-widest mb-4 border-b border-slate-200 pb-2">Professional Summary</h2>
                            <p className="text-slate-700 leading-relaxed text-justify">{summary}</p>
                        </section>
                    )}

                    {experience?.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-slate-200 pb-2">Work Experience</h2>
                            <div className="space-y-8">
                                {experience.map((job, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="font-bold text-lg">{job.position}</h3>
                                            <span className="text-sm text-slate-500">{job.startDate} - {job.endDate}</span>
                                        </div>
                                        <div className="text-indigo-600 font-medium mb-3">{job.company}</div>
                                        <p className="text-slate-700 whitespace-pre-wrap">{job.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <div className="space-y-10">
                    {education?.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-slate-200 pb-2">Education</h2>
                            <div className="space-y-6">
                                {education.map((edu, i) => (
                                    <div key={i}>
                                        <div className="font-bold">{edu.institution}</div>
                                        <div className="text-slate-700">{edu.degree}</div>
                                        <div className="text-sm text-slate-500 mt-1">{edu.startDate} - {edu.endDate}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {skills?.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-slate-200 pb-2">Skills</h2>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill, i) => (
                                    <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium">{skill}</span>
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
        <div className="bg-white min-h-[1000px] border-t-[12px] border-rose-500 font-sans shadow-2xl overflow-hidden" id="resume-preview">
            <div className="flex flex-col md:flex-row h-full">
                {/* Visual Sidebar */}
                <div className="w-full md:w-80 bg-slate-900 text-white p-10 space-y-12">
                    <div className="text-center">
                        {personalInfo?.profilePicture ? (
                            <img src={personalInfo.profilePicture} className="w-40 h-40 rounded-3xl mx-auto shadow-2xl border-4 border-slate-800 object-cover mb-6 rotate-3 hover:rotate-0 transition-transform" alt="Avatar" />
                        ) : (
                            <div className="w-32 h-32 bg-slate-800 rounded-full mx-auto flex items-center justify-center mb-6">
                                <User className="h-16 w-16 text-slate-600" />
                            </div>
                        )}
                        <h1 className="text-2xl font-black uppercase tracking-tighter mb-1">{personalInfo?.fullName || 'Your Name'}</h1>
                        <div className="h-1 w-12 bg-rose-500 mx-auto rounded-full mb-4"></div>
                        <p className="text-rose-400 font-bold text-xs uppercase tracking-widest">{resume.title || 'Specialist'}</p>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Contact Details</h3>
                        <div className="space-y-4 text-sm text-slate-300">
                            {personalInfo?.email && <div className="flex items-center"><Mail className="h-4 w-4 mr-3 text-rose-500 shrink-0" />{personalInfo.email}</div>}
                            {personalInfo?.phone && <div className="flex items-center"><Phone className="h-4 w-4 mr-3 text-rose-500 shrink-0" />{personalInfo.phone}</div>}
                            {personalInfo?.linkedin && <div className="flex items-center"><Linkedin className="h-4 w-4 mr-3 text-rose-500 shrink-0" />LinkedIn Profile</div>}
                            {personalInfo?.website && <div className="flex items-center"><Globe className="h-4 w-4 mr-3 text-rose-500 shrink-0" />Portfolio</div>}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Expertise</h3>
                        <div className="space-y-3">
                            {skills?.map((skill, i) => (
                                <div key={i} className="flex flex-col space-y-1.5">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span>{skill}</span>
                                        <span className="text-rose-500">95%</span>
                                    </div>
                                    <div className="h-1 bg-slate-800 w-full rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-rose-500 to-rose-400 w-[95%]"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Visual Main Content */}
                <div className="flex-1 p-12 bg-white text-slate-900">
                    <div className="space-y-12">
                        {summary && (
                            <section>
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="p-2 bg-rose-50 rounded-xl text-rose-500"><Award className="h-5 w-5" /></div>
                                    <h2 className="text-xl font-black uppercase tracking-tight">Professional Profile</h2>
                                </div>
                                <p className="text-slate-600 leading-relaxed italic border-l-4 border-rose-500 pl-6 py-2 bg-slate-50">
                                    {summary}
                                </p>
                            </section>
                        )}

                        {experience?.length > 0 && (
                            <section>
                                <div className="flex items-center space-x-3 mb-8">
                                    <div className="p-2 bg-rose-50 rounded-xl text-rose-500"><Briefcase className="h-5 w-5" /></div>
                                    <h2 className="text-xl font-black uppercase tracking-tight">Experience History</h2>
                                </div>
                                <div className="relative border-l-2 border-slate-100 ml-3 space-y-12">
                                    {experience.map((job, i) => (
                                        <div key={i} className="pl-8 relative">
                                            <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-rose-500 border-4 border-white"></div>
                                            <div className="flex flex-col mb-4">
                                                <div className="flex justify-between items-baseline">
                                                    <h3 className="font-black text-lg text-slate-900">{job.position}</h3>
                                                    <span className="text-xs font-black text-rose-500 bg-rose-50 px-2 py-1 rounded">{job.startDate} — {job.endDate}</span>
                                                </div>
                                                <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">{job.company}</span>
                                            </div>
                                            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{job.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {education?.length > 0 && (
                            <section>
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="p-2 bg-indigo-50 rounded-xl text-indigo-500"><GraduationCap className="h-5 w-5" /></div>
                                    <h2 className="text-xl font-black uppercase tracking-tight">Academic Background</h2>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {education.map((edu, i) => (
                                        <div key={i} className="p-6 rounded-2xl bg-indigo-50/50 border border-indigo-100/50">
                                            <h4 className="font-bold text-slate-900">{edu.institution}</h4>
                                            <p className="text-slate-600 text-sm mb-2">{edu.degree}</p>
                                            <div className="text-[10px] font-black text-indigo-600 uppercase tracking-tighter">{edu.startDate} - {edu.endDate}</div>
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
        <div className="bg-white p-12 min-h-[1000px] font-serif max-w-4xl mx-auto shadow-2xl" id="resume-preview">
            <div className="text-center mb-12 border-b-2 border-slate-200 pb-12">
                <h1 className="text-5xl font-light tracking-tight text-slate-900 mb-4">{personalInfo?.fullName || 'Your Name'}</h1>
                <div className="flex justify-center space-x-6 text-sm text-slate-500 italic mb-6">
                    {personalInfo?.email && <span>{personalInfo.email}</span>}
                    {personalInfo?.phone && <span>·</span>}
                    {personalInfo?.phone && <span>{personalInfo.phone}</span>}
                    {personalInfo?.address && <span>·</span>}
                    {personalInfo?.address && <span>{personalInfo.address}</span>}
                </div>
                <h3 className="text-xl text-slate-400 font-light tracking-[0.3em] uppercase">{resume.title || 'Professional Title'}</h3>
            </div>

            <div className="space-y-12">
                {summary && (
                    <section>
                        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-[0.4em] text-center mb-8 italic">About</h2>
                        <p className="text-slate-700 leading-relaxed text-center max-w-2xl mx-auto leading-loose">{summary}</p>
                    </section>
                )}

                {experience?.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-[0.4em] text-center mb-8 italic">Career Path</h2>
                        <div className="space-y-10">
                            {experience.map((job, i) => (
                                <div key={i} className="text-center">
                                    <div className="text-xs text-slate-400 font-black mb-2 uppercase tracking-widest">{job.startDate} — {job.endDate}</div>
                                    <h3 className="text-xl font-bold text-slate-900">{job.position}</h3>
                                    <div className="text-indigo-600 font-medium italic mb-4">{job.company}</div>
                                    <p className="text-slate-600 max-w-xl mx-auto whitespace-pre-wrap text-sm leading-relaxed">{job.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {skills?.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-[0.4em] text-center mb-6 italic">Signature Skills</h2>
                        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 max-w-xl mx-auto">
                            {skills.map((skill, i) => (
                                <span key={i} className="text-slate-700 text-sm font-bold tracking-widest uppercase">{skill}</span>
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
        case 'modern':
        default: return <ModernTemplate />;
    }
};

export default ResumePreview;
