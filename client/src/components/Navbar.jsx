
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { FileText, LogOut, User } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="bg-rose-500/10 p-2 rounded-lg">
                            <FileText className="h-6 w-6 text-rose-500" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                            ResumeCraft
                        </span>
                    </Link>

                    <div className="flex items-center space-x-6">
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
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
