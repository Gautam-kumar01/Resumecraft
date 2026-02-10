import { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import Logo from './Logo';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Loader2, ArrowRight, UserPlus, X, User } from 'lucide-react';

const LoginModal = ({ isOpen, onClose, onSuccess, initialMode = 'login', title, subtitle }) => {
    const [mode, setMode] = useState(initialMode); // 'login' or 'register'
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, register, googleLogin } = useContext(AuthContext);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            if (mode === 'login') {
                await login(formData.email, formData.password);
            } else {
                await register(formData.name, formData.email, formData.password);
                // After register, we might need to verify OTP, but for now let's assume direct login or prompt
                // However, AuthContext.register returns data but doesn't set user. 
                // We might need to auto-login or switch to login mode.
                // For "Minimal fields, fast onboarding", let's try to login immediately if backend supports it,
                // or just switch to login. 
                // Re-reading AuthContext: register returns data but doesn't login.
                // Let's just try to login immediately after register if the backend allows, 
                // or simpler: just use login.
                
                // For this specific flow "Minimal fields", usually we want auto-login.
                // But if verification is required, we should show OTP.
                // Let's assume standard flow: Register -> Login (or Auto-login if no verify).
                // If AuthContext.register doesn't login, let's call login immediately.
                await login(formData.email, formData.password);
            }
            if (onSuccess) onSuccess();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || (mode === 'login' ? 'Login failed' : 'Registration failed'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            await googleLogin(credentialResponse.credential);
            if (onSuccess) onSuccess();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Google login failed');
        }
    };

    const toggleMode = () => {
        setMode(mode === 'login' ? 'register' : 'login');
        setError('');
        setFormData({ name: '', email: '', password: '' });
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    onClick={onClose}
                ></motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50 p-8"
                >
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <Logo size="md" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">
                            {title || (mode === 'login' ? 'Welcome Back' : 'Create Account')}
                        </h2>
                        <p className="text-sm text-slate-500 mt-2">
                            {subtitle || (mode === 'login' 
                                ? 'Sign in to save and download your resume' 
                                : 'Join for free to access premium features')}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-center justify-center">
                            {error}
                        </div>
                    )}

                    <div className="mb-6">
                         <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => setError('Google login failed')}
                            useOneTap
                            theme="filled_blue"
                            shape="pill"
                            width="100%" 
                            text={mode === 'login' ? "signin_with" : "signup_with"}
                        />
                    </div>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white/0 backdrop-blur-xl px-2 text-slate-400 font-medium">
                                Or continue with email
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {mode === 'register' && (
                            <div className="relative group">
                                <User className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                />
                            </div>
                        )}
                        <div className="relative group">
                            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                            <input
                                name="email"
                                type="email"
                                required
                                placeholder="Email address"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                            <input
                                name="password"
                                type="password"
                                required
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-lg shadow-slate-900/20 flex items-center justify-center"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin h-5 w-5" />
                            ) : (
                                <>
                                    {mode === 'login' ? 'Sign In' : 'Create Account'}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-600">
                            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                            <button 
                                onClick={toggleMode}
                                className="font-bold text-primary hover:text-blue-700 transition-colors"
                            >
                                {mode === 'login' ? 'Sign up for free' : 'Log in'}
                            </button>
                        </p>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default LoginModal;
