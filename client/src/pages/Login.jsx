import { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import SEO from '../components/SEO';
import { GoogleLogin } from '@react-oauth/google';
import Logo from '../components/Logo';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, ArrowRight, UserPlus } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, googleLogin } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/dashboard';

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await login(formData.email, formData.password);
            navigate(from, { replace: true });
        } catch (err) {
            if (err.response?.data?.notVerified) {
                navigate('/register', { state: { email: formData.email, showOtp: true } });
            } else {
                setError(err.response?.data?.message || 'Login failed');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            await googleLogin(credentialResponse.credential);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || 'Google login failed');
        }
    };

    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const isGoogleConfigured = googleClientId && !googleClientId.includes('PLACEHOLDER');

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Blobs for extra glass effect context */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-400/30 rounded-full blur-[120px] mix-blend-multiply animate-blob"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-400/30 rounded-full blur-[120px] mix-blend-multiply animate-blob animation-delay-2000"></div>
            
            <SEO 
                title="Login" 
                description="Sign in to ResumeCraft to continue building your professional resume."
            />
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full space-y-8 glass-effect p-10 rounded-3xl relative z-10"
            >
                <div className="text-center">
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex justify-center mb-6"
                    >
                        <Logo size="lg" />
                    </motion.div>
                    <h2 className="mt-2 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
                        Welcome Back
                    </h2>
                    <p className="mt-2 text-sm text-slate-600 font-medium">
                        Enter your credentials to access your workspace
                    </p>
                </div>

                {error && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-red-50/80 backdrop-blur-sm text-red-600 p-4 rounded-xl text-sm text-center border border-red-200 shadow-sm flex items-center justify-center gap-2"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                        {error}
                    </motion.div>
                )}

                {isGoogleConfigured && (
                    <div className="mt-8">
                        <div className="flex justify-center transform transition-transform hover:scale-[1.02] active:scale-[0.98]">
                            <div className="w-full">
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={() => setError('Google login failed')}
                                    useOneTap
                                    theme="filled_blue"
                                    shape="pill"
                                    width="100%" 
                                    text="continue_with"
                                />
                            </div>
                        </div>

                        <div className="relative mt-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-300/50"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white/50 backdrop-blur-md rounded-full text-slate-500 font-medium uppercase tracking-wider text-xs border border-white/40">
                                    Or continue with
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-5">
                        <div className="group">
                            <label htmlFor="email" className="sr-only">Email address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="block w-full pl-11 pr-4 py-3.5 bg-white/50 border border-slate-200/60 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 backdrop-blur-sm hover:bg-white/80"
                                    placeholder="Email address"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="group">
                            <label htmlFor="password" className="sr-only">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="block w-full pl-11 pr-4 py-3.5 bg-white/50 border border-slate-200/60 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 backdrop-blur-sm hover:bg-white/80"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded cursor-pointer"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 cursor-pointer select-none">
                                Remember me
                            </label>
                        </div>

                        <div className="text-sm">
                            <Link 
                                to="/forgot-password" 
                                className="font-medium text-[#7DD3FC] hover:text-[#38BDF8] transition-all duration-300 relative group"
                            >
                                Forgot your password?
                                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[#38BDF8] transition-all group-hover:w-full duration-300"></span>
                            </Link>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-[#6366F1] to-[#A855F7] hover:shadow-lg hover:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
                            {isLoading ? (
                                <Loader2 className="animate-spin h-5 w-5 text-white" />
                            ) : (
                                <span className="flex items-center gap-2">
                                    Sign in
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </button>
                    </div>
                </form>
                
                <div className="mt-6 text-center">
                    <p className="text-slate-600 mb-3 text-sm">Don't have an account?</p>
                    <Link 
                        to="/register" 
                        className="inline-flex items-center justify-center px-6 py-2.5 border border-slate-200/60 rounded-xl text-sm font-semibold text-slate-700 bg-white/40 hover:bg-white/80 hover:text-indigo-600 hover:border-indigo-200 transition-all duration-300 backdrop-blur-sm shadow-sm hover:shadow group w-full sm:w-auto"
                    >
                        <UserPlus className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                        Create free account
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
