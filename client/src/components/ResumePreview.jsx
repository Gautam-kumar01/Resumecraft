
import React from 'react';

const ResumePreview = ({ resume }) => {
    if (!resume) return null;

    const { personalInfo, summary, education, experience, skills, projects } = resume;

    return (
        <div className="bg-white shadow-2xl w-full mx-auto p-12 min-h-[1000px] print:shadow-none print:w-full" id="resume-preview">
            {/* Header */}
            <header className="border-b-2 border-slate-900 pb-8 mb-8">
                <h1 className="text-4xl font-bold text-slate-900 uppercase tracking-widest mb-2">{personalInfo?.fullName || 'Your Name'}</h1>
                <p className="text-xl text-slate-600 font-light mb-6">{resume.title || 'Professional Title'}</p>

                <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                    {personalInfo?.email && (
                        <span>{personalInfo.email}</span>
                    )}
                    {personalInfo?.phone && (
                        <span className="border-l border-slate-300 pl-4">{personalInfo.phone}</span>
                    )}
                    {personalInfo?.address && (
                        <span className="border-l border-slate-300 pl-4">{personalInfo.address}</span>
                    )}
                    {personalInfo?.linkedin && (
                        <span className="border-l border-slate-300 pl-4"><a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-primary">LinkedIn</a></span>
                    )}
                    {personalInfo?.github && (
                        <span className="border-l border-slate-300 pl-4"><a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="hover:text-primary">GitHub</a></span>
                    )}
                    {personalInfo?.website && (
                        <span className="border-l border-slate-300 pl-4"><a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary">Portfolio</a></span>
                    )}
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {/* Main Column */}
                <div className="md:col-span-2 space-y-10">
                    {/* Summary */}
                    {summary && (
                        <section>
                            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 border-b border-slate-200 pb-2">Professional Summary</h2>
                            <p className="text-slate-700 leading-relaxed text-justify">
                                {summary}
                            </p>
                        </section>
                    )}

                    {/* Experience */}
                    {experience && experience.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6 border-b border-slate-200 pb-2">Work Experience</h2>
                            <div className="space-y-8">
                                {experience.map((job, index) => (
                                    <div key={index}>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="font-bold text-slate-900 text-lg">{job.position}</h3>
                                            <span className="text-sm text-slate-500 font-medium whitespace-nowrap">{job.startDate} - {job.endDate}</span>
                                        </div>
                                        <div className="text-primary font-medium mb-3">{job.company}</div>
                                        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{job.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Projects */}
                    {projects && projects.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6 border-b border-slate-200 pb-2">Projects</h2>
                            <div className="space-y-6">
                                {projects.map((project, index) => (
                                    <div key={index}>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="font-bold text-slate-900">{project.name}</h3>
                                            {project.link && (
                                                <a href={project.link} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline">View Project</a>
                                            )}
                                        </div>
                                        <p className="text-slate-700 leading-relaxed mb-2">{project.description}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {project.technologies && project.technologies.map((tech, i) => (
                                                <span key={i} className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600 font-medium">{tech}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Sidebar Column */}
                <div className="space-y-10">
                    {/* Education */}
                    {education && education.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6 border-b border-slate-200 pb-2">Education</h2>
                            <div className="space-y-6">
                                {education.map((edu, index) => (
                                    <div key={index}>
                                        <div className="font-bold text-slate-900">{edu.institution}</div>
                                        <div className="text-slate-700">{edu.degree}</div>
                                        <div className="text-sm text-slate-500 mt-1">{edu.startDate} - {edu.endDate}</div>
                                        {edu.description && <p className="text-sm text-slate-600 mt-2">{edu.description}</p>}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Skills */}
                    {skills && skills.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6 border-b border-slate-200 pb-2">Skills</h2>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill, index) => (
                                    <span key={index} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium">
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
};

export default ResumePreview;
