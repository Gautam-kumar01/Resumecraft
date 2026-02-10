import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { LogOut, User, Menu, X } from 'lucide-react';
import Logo from './Logo';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMenuOpen(false);
    };

    return (
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link to="/">
                        <Logo size="md" />
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-6">
                        {user ? (
                            <>
                                <Link to="/dashboard" className="text-slate-600 hover:text-primary transition-colors font-medium">
                                    Dashboard
                                </Link>
                                <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-200">
                                    <div className="flex items-center space-x-2 text-slate-500">
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
                                <Link to="/login" className="text-slate-600 hover:text-primary transition-colors font-medium">
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-primary hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-medium transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-slate-600 hover:text-slate-900 p-2"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-6 shadow-xl">
                    <div className="flex flex-col space-y-4">
                        {user ? (
                            <>
                                <div className="flex items-center space-x-3 px-2 py-3 bg-slate-50 rounded-lg">
                                    <div className="bg-primary/10 p-2 rounded-full">
                                        <User className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">{user.name}</p>
                                        <p className="text-xs text-slate-500">{user.email}</p>
                                    </div>
                                </div>
                                <Link 
                                    to="/dashboard" 
                                    className="text-slate-600 hover:text-primary font-medium px-2 py-2 hover:bg-slate-50 rounded-lg transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-2 text-slate-500 hover:text-red-500 font-medium px-2 py-2 hover:bg-red-50 rounded-lg transition-colors w-full text-left"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link 
                                    to="/login" 
                                    className="text-slate-600 hover:text-primary font-medium px-2 py-2 hover:bg-slate-50 rounded-lg transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-primary text-white px-4 py-3 rounded-xl font-bold text-center shadow-lg shadow-primary/20"
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
