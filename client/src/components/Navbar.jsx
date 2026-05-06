import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import { LogOut, User, Menu, X, Sun, Moon, Star, FileText } from 'lucide-react';
import Logo from './Logo';

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

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 px-4 pt-2 pb-6 shadow-xl">
                    <div className="flex flex-col space-y-4">
                        <Link
                            to="/templates"
                            className="text-slate-600 dark:text-slate-300 hover:text-orange-500 font-medium px-2 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Resume Templates
                        </Link>
                        <Link
                            to="/cover-letter-templates"
                            className="text-slate-600 dark:text-slate-300 hover:text-orange-500 font-medium px-2 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Cover Letters
                        </Link>
                        {user ? (
                            <>
                                <div className="flex items-center space-x-3 px-2 py-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                    <div className="bg-orange-500/10 p-2 rounded-full">
                                        <User className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{user.name}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                                    </div>
                                </div>
                                <Link
                                    to="/dashboard"
                                    className="text-slate-600 dark:text-slate-300 hover:text-orange-500 font-medium px-2 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-2 text-slate-500 hover:text-red-500 font-medium px-2 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors w-full text-left"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-slate-600 dark:text-slate-300 hover:text-orange-500 font-medium px-2 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/templates"
                                    className="bg-orange-500 text-white px-4 py-3 rounded-xl font-bold text-center shadow-lg shadow-orange-500/20"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
