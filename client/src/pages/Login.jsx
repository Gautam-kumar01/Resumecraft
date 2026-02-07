
import { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const { login, googleLogin } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/dashboard';

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(formData.email, formData.password);
            navigate(from, { replace: true });
        } catch (err) {
            if (err.response?.data?.notVerified) {
                navigate('/register', { state: { email: formData.email, showOtp: true } });
            } else {
                setError(err.response?.data?.message || 'Login failed');
            }
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            await googleLogin(credentialResponse.credential);
            navigate(from, { replace: true });
        } catch (err) {
            setError('Google login failed');
        }
    };

    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const isGoogleConfigured = googleClientId && !googleClientId.includes('PLACEHOLDER');

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-slate-100">
                <div className="text-center">
                    <h2 className="mt-2 text-3xl font-bold text-slate-900">Welcome</h2>
                    <p className="mt-2 text-sm text-slate-600">
                        Sign in to continue to your dashboard
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-100">
                        {error}
                    </div>
                )}

                {isGoogleConfigured && (
                    <div className="mt-8">
                        <div className="flex justify-center">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => setError('Google login failed')}
                                useOneTap
                                theme="outline"
                                shape="pill"
                                width="100%"
                            />
                        </div>

                        <div className="relative mt-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-slate-500 uppercase">Or continue with</span>
                            </div>
                        </div>
                    </div>
                )}

                {!isGoogleConfigured && (
                    <div className="mt-4 p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-[10px] text-blue-600 text-center">
                        Google Login is ready! Just add your <strong>VITE_GOOGLE_CLIENT_ID</strong> to the client .env file to enable it.
                    </div>
                )}

                <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="sr-only">Email address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary sm:text-sm transition-all"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary sm:text-sm transition-all"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-lg shadow-blue-500/30"
                        >
                            Sign in
                        </button>
                    </div>
                </form>
                <div className="text-center text-sm">
                    <span className="text-slate-600">Don't have an account? </span>
                    <Link to="/register" className="font-medium text-primary hover:text-blue-700 transition-colors">
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
