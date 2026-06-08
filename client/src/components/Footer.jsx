
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { 
    FileText, 
    Cpu, 
    Eye, 
    MessageSquare, 
    Globe, 
    BarChart3,
    Mail,
    Phone,
    MapPin,
    Twitter,
    Linkedin,
    Youtube,
    Github
} from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-slate-900 pt-24 pb-12 border-t border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
                    <div className="col-span-2">
                        <Logo size="md" className="mb-6" />
                        <p className="max-w-xs mb-8 text-slate-500 dark:text-slate-400 leading-relaxed">
                            The world's most intuitive resume builder designed to help you land your dream job at record speed.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="h-10 w-10 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl flex items-center justify-center text-slate-400 hover:text-orange-500 hover:border-orange-500/30 transition-all">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="h-10 w-10 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl flex items-center justify-center text-slate-400 hover:text-orange-500 hover:border-orange-500/30 transition-all">
                                <Linkedin className="h-5 w-5" />
                            </a>
                            <a href="#" className="h-10 w-10 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl flex items-center justify-center text-slate-400 hover:text-orange-500 hover:border-orange-500/30 transition-all">
                                <Youtube className="h-5 w-5" />
                            </a>
                            <a href="#" className="h-10 w-10 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl flex items-center justify-center text-slate-400 hover:text-orange-500 hover:border-orange-500/30 transition-all">
                                <Github className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider text-xs">Features</h4>
                        <ul className="space-y-4 text-sm">
                            <li>
                                <Link to="/templates" className="flex items-center space-x-2 hover:text-orange-500 transition-colors">
                                    <FileText className="h-4 w-4" />
                                    <span>35+ Templates</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/templates" className="flex items-center space-x-2 hover:text-orange-500 transition-colors">
                                    <Cpu className="h-4 w-4" />
                                    <span>Enhance with AI</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/templates" className="flex items-center space-x-2 hover:text-orange-500 transition-colors">
                                    <Eye className="h-4 w-4" />
                                    <span>Resume Review</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/cover-letter-templates" className="flex items-center space-x-2 hover:text-orange-500 transition-colors">
                                    <MessageSquare className="h-4 w-4" />
                                    <span>AI Cover Letter</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/dashboard" className="flex items-center space-x-2 hover:text-orange-500 transition-colors">
                                    <Globe className="h-4 w-4" />
                                    <span>Resume Website</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/dashboard" className="flex items-center space-x-2 hover:text-orange-500 transition-colors">
                                    <BarChart3 className="h-4 w-4" />
                                    <span>Resume Tracking</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider text-xs">Resources</h4>
                        <ul className="space-y-4 text-sm">
                            <li><Link to="/blog" className="hover:text-orange-500 font-bold transition-colors">Resume & Career Blog</Link></li>
                            <li><Link to="/resource/resume-formats" className="hover:text-orange-500 transition-colors">Resume Formats</Link></li>
                            <li><Link to="/resource/resume-examples" className="hover:text-orange-500 transition-colors">Resume Examples</Link></li>
                            <li><Link to="/resource/how-to-write-a-resume" className="hover:text-orange-500 transition-colors">How to Write a Resume</Link></li>
                            <li><Link to="/resource/career-advice" className="hover:text-orange-500 transition-colors">Career Advice</Link></li>
                            <li><Link to="/resource/interview-tips" className="hover:text-orange-500 transition-colors">Interview Tips</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider text-xs">Support</h4>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start space-x-3 text-slate-500 dark:text-slate-400">
                                <Mail className="h-5 w-5 text-orange-500 shrink-0" />
                                <a href="mailto:support.resumecraft@gmail.com" className="hover:text-orange-500 transition-colors">support.resumecraft@gmail.com</a>
                            </li>
                            <li className="flex items-start space-x-3 text-slate-500 dark:text-slate-400 text-xs">
                                <span>Get 24/7 assistance with your resume and career questions.</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-12 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex flex-col md:flex-row justify-between items-center text-sm gap-6">
                        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-slate-400">
                            <p>© 2026 ResumeCraft. All rights reserved.</p>
                            <div className="flex gap-6">
                                <Link to="/privacy" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy Policy</Link>
                                <Link to="/terms" className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms of Service</Link>
                                <Link to="/cookies" className="hover:text-slate-900 dark:hover:text-white transition-colors">Cookie Policy</Link>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 text-slate-400 text-xs">
                            <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span>System Status: Operational</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
