
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { 
    FileText, 
    Cpu, 
    Eye, 
    MessageSquare, 
    Globe, 
    BarChart3,
    Target,
    GraduationCap,
    Mail,
    Phone,
    MapPin,
    Twitter,
    Linkedin,
    Github,
    Facebook
} from 'lucide-react';

const Footer = () => {
    return (
        <footer className="border-t border-[#ebdcd0] bg-[#faf2ea] pb-12 pt-20 text-[#42291a] dark:border-[#331c10] dark:bg-[#1a0f08] dark:text-[#d8c2b2]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
                    <div className="col-span-2">
                        <div className="mb-6 flex items-center gap-3"><Logo size="md" /><span className="rounded-full bg-orange-100/90 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-orange-800 dark:bg-orange-500/15 dark:text-orange-300">Build with confidence</span></div>
                        <p className="max-w-xs mb-8 text-[#5c3a24] dark:text-[#b5927c] leading-relaxed">
                            An AI-assisted resume builder with professional templates, live editing, resume feedback, and practical career tools for students and job seekers.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <a href="https://twitter.com/Imgautam_001" target="_blank" rel="noopener noreferrer" aria-label="ResumeCraft on Twitter" className="h-10 w-10 bg-[#f2e5d8] dark:bg-[#2a190f] border border-[#e2d0c0] dark:border-[#42291a] rounded-xl flex items-center justify-center text-[#5c3a24] hover:text-orange-600 dark:text-[#d8c2b2] hover:border-orange-500/50 transition-all">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="https://www.linkedin.com/posts/imgautam01" target="_blank" rel="noopener noreferrer" aria-label="Gautam Kumar on LinkedIn" className="h-10 w-10 bg-[#f2e5d8] dark:bg-[#2a190f] border border-[#e2d0c0] dark:border-[#42291a] rounded-xl flex items-center justify-center text-[#5c3a24] hover:text-orange-600 dark:text-[#d8c2b2] hover:border-orange-500/50 transition-all">
                                <Linkedin className="h-5 w-5" />
                            </a>
                            <a href="https://www.facebook.com/profile.php?id=100070090665121" target="_blank" rel="noopener noreferrer" aria-label="ResumeCraft on Facebook" className="h-10 w-10 bg-[#f2e5d8] dark:bg-[#2a190f] border border-[#e2d0c0] dark:border-[#42291a] rounded-xl flex items-center justify-center text-[#5c3a24] hover:text-orange-600 dark:text-[#d8c2b2] hover:border-orange-500/50 transition-all">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="https://github.com/Gautam-kumar01/" target="_blank" rel="noopener noreferrer" aria-label="ResumeCraft on GitHub" className="h-10 w-10 bg-[#f2e5d8] dark:bg-[#2a190f] border border-[#e2d0c0] dark:border-[#42291a] rounded-xl flex items-center justify-center text-[#5c3a24] hover:text-orange-600 dark:text-[#d8c2b2] hover:border-orange-500/50 transition-all">
                                <Github className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="mb-6 text-xs font-black uppercase tracking-[0.18em] text-[#1c1008] dark:text-white">Build & improve</h4>
                        <ul className="space-y-4 text-sm text-[#5c3a24] dark:text-[#c4a997]">
                            <li>
                                <Link to="/templates" className="flex items-center space-x-2 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                                    <FileText className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                    <span>Resume Templates</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/templates" className="flex items-center space-x-2 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                                    <Cpu className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                    <span>Enhance with AI</span>
                                </Link>
                            </li>
                            <li>
                                    <Link to="/resume-score-checker" className="flex items-center space-x-2 font-bold text-orange-700 transition-colors hover:text-orange-800 dark:text-orange-300 dark:hover:text-orange-200">
                                    <Eye className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                    <span>Resume Score Checker</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/cover-letter-templates" className="flex items-center space-x-2 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                                    <MessageSquare className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                    <span>AI Cover Letter</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/dashboard" className="flex items-center space-x-2 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                                    <Globe className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                    <span>Resume Website</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/applications" className="flex items-center space-x-2 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                                    <BarChart3 className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                    <span>Application Tracker</span>
                                </Link>
                            </li>
                            <li><Link to="/job-description-matcher" className="flex items-center space-x-2 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"><Target className="h-4 w-4 text-orange-600 dark:text-orange-400" /><span>Job Description Matcher</span></Link></li>
                            <li><Link to="/fresher-resume-builder" className="flex items-center space-x-2 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"><GraduationCap className="h-4 w-4 text-orange-600 dark:text-orange-400" /><span>Fresher Resume Builder</span></Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-6 text-xs font-black uppercase tracking-[0.18em] text-[#1c1008] dark:text-white">Learn & explore</h4>
                        <ul className="space-y-4 text-sm text-[#5c3a24] dark:text-[#c4a997]">
                            <li><Link to="/blog" className="hover:text-orange-600 dark:hover:text-orange-400 font-bold transition-colors">Resume & Career Blog</Link></li>
                            <li><Link to="/resource/resume-formats" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">Resume Formats</Link></li>
                            <li><Link to="/resource/resume-examples" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">Resume Examples</Link></li>
                            <li><Link to="/resource/how-to-write-a-resume" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">How to Write a Resume</Link></li>
                            <li><Link to="/resource/career-advice" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">Career Advice</Link></li>
                            <li><Link to="/resource/interview-tips" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">Interview Tips</Link></li>
                            <li><Link to="/interview-prep/software-engineer" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">Tech Interview Guides</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-6 text-xs font-black uppercase tracking-[0.18em] text-[#1c1008] dark:text-white">Support</h4>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start space-x-3 text-[#5c3a24] dark:text-[#c4a997]">
                                <Mail className="h-5 w-5 text-orange-600 dark:text-orange-400 shrink-0" />
                                <a href="mailto:support.resumecraft@gmail.com" className="hover:text-orange-600 dark:hover:text-orange-400 font-medium transition-colors">support.resumecraft@gmail.com</a>
                            </li>
                            <li className="flex items-start space-x-3 text-[#785038] dark:text-[#9e7d69] text-xs">
                                <span>Find practical guidance for your resume and career questions.</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-[#ebdcd0] pt-10 dark:border-[#331c10]">
                    <div className="flex flex-col md:flex-row justify-between items-center text-sm gap-6">
                        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-[#785038] dark:text-[#9e7d69]">
                            <p>© 2026 ResumeCraft. All rights reserved.</p>
                            <div className="flex gap-6">
                                <Link to="/privacy" className="hover:text-[#1c1008] dark:hover:text-white transition-colors">Privacy Policy</Link>
                                <Link to="/terms" className="hover:text-[#1c1008] dark:hover:text-white transition-colors">Terms of Service</Link>
                                <Link to="/cookies" className="hover:text-[#1c1008] dark:hover:text-white transition-colors">Cookie Policy</Link>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 text-[#785038] dark:text-[#9e7d69] text-xs">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></span>
                            <span>ResumeCraft is ready to help</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
