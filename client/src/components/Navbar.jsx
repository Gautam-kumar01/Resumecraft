import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import { LogOut, User, Menu, X, Sun, Moon, Star, FileText, Mail } from 'lucide-react';
import Logo from './Logo';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDark, setIsDark] = useState(() => {
        return localStorage.getItem('theme') === 'dark' || 
               (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    });

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMenuOpen(false);
    };

    const [activeDropdown, setActiveDropdown] = useState(null);

    return (
        <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link to="/">
                        <Logo size="md" />
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-2">
                        {/* Resume Dropdown */}
                        <div 
                            className="relative group"
                            onMouseEnter={() => setActiveDropdown('resume')}
                            onMouseLeave={() => setActiveDropdown(null)}
                        >
                            <button className="flex items-center space-x-1 px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-orange-500 transition-colors font-medium">
                                <span>Resume</span>
                                <Menu className={`h-4 w-4 transition-transform duration-300 ${activeDropdown === 'resume' ? 'rotate-180' : ''}`} />
                            </button>
                            
                            <div className={`absolute top-full left-0 w-[450px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl rounded-2xl p-6 transition-all duration-300 transform origin-top-left ${activeDropdown === 'resume' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <Link to="/templates" className="flex items-start space-x-3 group/item">
                                            <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg group-hover/item:bg-orange-500 transition-colors">
                                                <FileText className="h-5 w-5 text-orange-600 dark:text-orange-400 group-hover/item:text-white" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 dark:text-white group-hover/item:text-orange-500 transition-colors">Resume Templates</h4>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">Choose a polished resume template to stand out.</p>
                                            </div>
                                        </Link>
                                        <Link to="/resource/resume-formats" className="flex items-start space-x-3 group/item">
                                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg group-hover/item:bg-blue-500 transition-colors">
                                                <Menu className="h-5 w-5 text-blue-600 dark:text-blue-400 group-hover/item:text-white" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 dark:text-white group-hover/item:text-blue-500 transition-colors">Resume Formats</h4>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">Learn the best practices for resume formatting.</p>
                                            </div>
                                        </Link>
                                    </div>
                                    <div className="space-y-6">
                                        <Link to="/templates" className="flex items-start space-x-3 group/item">
                                            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg group-hover/item:bg-green-500 transition-colors">
                                                <Star className="h-5 w-5 text-green-600 dark:text-green-400 group-hover/item:text-white" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 dark:text-white group-hover/item:text-green-500 transition-colors">Resume Examples</h4>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">Get inspired with sample resumes for various careers.</p>
                                            </div>
                                        </Link>
                                        <Link to="/resource/how-to-write-a-resume" className="flex items-start space-x-3 group/item">
                                            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg group-hover/item:bg-purple-500 transition-colors">
                                                <X className="h-5 w-5 text-purple-600 dark:text-purple-400 group-hover/item:text-white" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 dark:text-white group-hover/item:text-purple-500 transition-colors">How To Write A Resume</h4>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">Learn how to write a show-stopping resume.</p>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Cover Letter Dropdown */}
                        <div 
                            className="relative group"
                            onMouseEnter={() => setActiveDropdown('coverletter')}
                            onMouseLeave={() => setActiveDropdown(null)}
                        >
                            <button className="flex items-center space-x-1 px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-orange-500 transition-colors font-medium">
                                <span>Cover Letter</span>
                                <Menu className={`h-4 w-4 transition-transform duration-300 ${activeDropdown === 'coverletter' ? 'rotate-180' : ''}`} />
                            </button>
                            
                            <div className={`absolute top-full left-0 w-[450px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl rounded-2xl p-6 transition-all duration-300 transform origin-top-left ${activeDropdown === 'coverletter' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <Link to="/cover-letter-templates" className="flex items-start space-x-3 group/item">
                                            <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg group-hover/item:bg-orange-500 transition-colors">
                                                <FileText className="h-5 w-5 text-orange-600 dark:text-orange-400 group-hover/item:text-white" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 dark:text-white group-hover/item:text-orange-500 transition-colors">Cover Letter Templates</h4>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">Choose a polished cover letter template.</p>
                                            </div>
                                        </Link>
                                        <Link to="/resource/resume-formats" className="flex items-start space-x-3 group/item">
                                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg group-hover/item:bg-blue-500 transition-colors">
                                                <Menu className="h-5 w-5 text-blue-600 dark:text-blue-400 group-hover/item:text-white" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 dark:text-white group-hover/item:text-blue-500 transition-colors">Cover Letter Formats</h4>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">Learn the best practices for cover letter formatting.</p>
                                            </div>
                                        </Link>
                                    </div>
                                    <div className="space-y-6">
                                        <Link to="/cover-letter-templates" className="flex items-start space-x-3 group/item">
                                            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg group-hover/item:bg-green-500 transition-colors">
                                                <Star className="h-5 w-5 text-green-600 dark:text-green-400 group-hover/item:text-white" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 dark:text-white group-hover/item:text-green-500 transition-colors">Cover Letter Examples</h4>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">Get inspired with sample cover letters.</p>
                                            </div>
                                        </Link>
                                        <Link to="/resource/how-to-write-a-resume" className="flex items-start space-x-3 group/item">
                                            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg group-hover/item:bg-purple-500 transition-colors">
                                                <X className="h-5 w-5 text-purple-600 dark:text-purple-400 group-hover/item:text-white" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 dark:text-white group-hover/item:text-purple-500 transition-colors">How To Write A Cover Letter</h4>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">Learn how to write a show-stopping cover letter.</p>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tips Dropdown */}
                        <div 
                            className="relative group"
                            onMouseEnter={() => setActiveDropdown('tips')}
                            onMouseLeave={() => setActiveDropdown(null)}
                        >
                            <button className="flex items-center space-x-1 px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-orange-500 transition-colors font-medium">
                                <span>Tips</span>
                                <Menu className={`h-4 w-4 transition-transform duration-300 ${activeDropdown === 'tips' ? 'rotate-180' : ''}`} />
                            </button>
                            
                            <div className={`absolute top-full left-0 w-[250px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl rounded-2xl p-4 transition-all duration-300 transform origin-top-left ${activeDropdown === 'tips' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                                <ul className="space-y-1">
                                    <li><Link to="/resource/career-advice" className="block px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-500 rounded-lg transition-colors">Career Advice</Link></li>
                                    <li><Link to="/resource/interview-tips" className="block px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-500 rounded-lg transition-colors">Interview Tips</Link></li>
                                    <li><Link to="/resource/career-advice" className="block px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-500 rounded-lg transition-colors">Job Search Strategy</Link></li>
                                </ul>
                            </div>
                        </div>

                        <Link to="/about" className="text-slate-600 dark:text-slate-300 hover:text-orange-500 transition-colors font-medium px-4">
                            About Us
                        </Link>

                        <Link to="/contact" className="text-slate-600 dark:text-slate-300 hover:text-orange-500 transition-colors font-medium px-4">
                            Contact Us
                        </Link>
                        
                        {/* Dark Mode Toggle */}
                        <button
                            onClick={() => setIsDark(!isDark)}
                            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all duration-300 ml-2"
                            aria-label="Toggle Dark Mode"
                        >
                            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>
                        
                        {user ? (
                            <>
                                <Link to="/dashboard" className="text-slate-600 dark:text-slate-300 hover:text-orange-500 transition-colors font-medium px-4">
                                    Dashboard
                                </Link>
                                <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-200 dark:border-slate-800">
                                    <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
                                        <User className="h-4 w-4" />
                                        <span className="text-sm">{user.name}</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center space-x-1 text-slate-500 hover:text-red-500 transition-colors"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        <span className="text-sm font-medium">Logout</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-slate-600 dark:text-slate-300 hover:text-orange-500 transition-colors font-medium px-4">
                                    Login
                                </Link>
                                <Link
                                    to="/templates"
                                    className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-full font-medium transition-all shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center space-x-2 md:hidden">
                        <button
                            onClick={() => setIsDark(!isDark)}
                            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
                        >
                            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white p-2"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden"
                        />
                        <motion.div 
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 bottom-0 w-[80%] max-w-sm bg-white dark:bg-slate-900 z-50 md:hidden shadow-2xl overflow-y-auto"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-8">
                                    <Logo size="sm" />
                                    <button onClick={() => setIsMenuOpen(false)} className="p-2 text-slate-500">
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {/* User Section */}
                                    {user ? (
                                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                                            <div className="flex items-center space-x-3 mb-4">
                                                <div className="bg-orange-500 text-white p-2 rounded-full">
                                                    <User className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[150px]">{user.name}</p>
                                                    <p className="text-xs text-slate-500 truncate max-w-[150px]">{user.email}</p>
                                                </div>
                                            </div>
                                            <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="block w-full text-center py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300">
                                                Dashboard
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-3">
                                            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="py-3 text-center border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-600 dark:text-slate-400 text-sm">
                                                Login
                                            </Link>
                                            <Link to="/templates" onClick={() => setIsMenuOpen(false)} className="py-3 text-center bg-orange-500 text-white rounded-xl font-bold text-sm">
                                                Join Free
                                            </Link>
                                        </div>
                                    )}

                                    {/* Links */}
                                    <nav className="space-y-2">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 mb-2">Main Menu</p>
                                        <Link to="/templates" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-3 p-3 hover:bg-orange-50 dark:hover:bg-orange-900/10 rounded-xl text-slate-700 dark:text-slate-300 font-bold">
                                            <FileText className="h-5 w-5 text-orange-500" />
                                            <span>Resume Templates</span>
                                        </Link>
                                        <Link to="/cover-letter-templates" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-3 p-3 hover:bg-orange-50 dark:hover:bg-orange-900/10 rounded-xl text-slate-700 dark:text-slate-300 font-bold">
                                            <Star className="h-5 w-5 text-orange-500" />
                                            <span>Cover Letters</span>
                                        </Link>
                                        <Link to="/about" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-3 p-3 hover:bg-orange-50 dark:hover:bg-orange-900/10 rounded-xl text-slate-700 dark:text-slate-300 font-bold">
                                            <User className="h-5 w-5 text-orange-500" />
                                            <span>About Us</span>
                                        </Link>
                                        <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-3 p-3 hover:bg-orange-50 dark:hover:bg-orange-900/10 rounded-xl text-slate-700 dark:text-slate-300 font-bold">
                                            <Mail className="h-5 w-5 text-orange-500" />
                                            <span>Contact Support</span>
                                        </Link>
                                    </nav>

                                    <nav className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 mb-2">Resources</p>
                                        <Link to="/resource/resume-formats" onClick={() => setIsMenuOpen(false)} className="block p-3 text-slate-600 dark:text-slate-400 text-sm font-medium">Resume Formats</Link>
                                        <Link to="/resource/career-advice" onClick={() => setIsMenuOpen(false)} className="block p-3 text-slate-600 dark:text-slate-400 text-sm font-medium">Career Advice</Link>
                                        <Link to="/resource/interview-tips" onClick={() => setIsMenuOpen(false)} className="block p-3 text-slate-600 dark:text-slate-400 text-sm font-medium">Interview Tips</Link>
                                    </nav>

                                    {user && (
                                        <button 
                                            onClick={handleLogout}
                                            className="w-full flex items-center space-x-3 p-3 text-red-500 font-bold mt-8 border-t border-slate-100 dark:border-slate-800"
                                        >
                                            <LogOut className="h-5 w-5" />
                                            <span>Sign Out</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
