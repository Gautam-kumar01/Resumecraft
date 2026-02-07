import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import Logo from '../components/Logo';

const Register = () => {
    const location = useLocation();
    const [formData, setFormData] = useState({
        name: '',
        email: location.state?.email || '',
        password: ''
    });
    const [otp, setOtp] = useState('');
    const [showOtp, setShowOtp] = useState(location.state?.showOtp || false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState(location.state?.showOtp ? 'Please verify your email to continue.' : '');
    const [loading, setLoading] = useState(false);

    const { register, verifyOTP, resendOTP, googleLogin } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (location.state?.email) {
            setFormData(prev => ({ ...prev, email: location.state.email }));
        }
        if (location.state?.showOtp) {
            setShowOtp(true);
        }
    }, [location.state]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = await register(formData.name, formData.email, formData.password);
            setShowOtp(true);
            setMessage(data.message || 'A verification code has been sent to your email.');
        } catch (err) {
            console.error('Frontend Registration Error:', err);
            const msg = err.response?.data?.message || err.message || 'Registration failed. Please check your internet connection or try a @gmail.com address.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await verifyOTP(formData.email, otp);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid verification code');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setError('');
        try {
            const data = await resendOTP(formData.email);
            setMessage(data.message || 'New verification code sent!');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend code');
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            await googleLogin(credentialResponse.credential);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Google login failed');
        }
    };

    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const isGoogleConfigured = googleClientId && !googleClientId.includes('PLACEHOLDER');

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-slate-100">
                <div className="text-center">
                    <div className="flex justify-center mb-6">
                        <Logo size="lg" />
                    </div>
                    <h2 className="mt-2 text-3xl font-bold text-slate-900">
                        {showOtp ? 'Verify Email' : 'Create Account'}
                    </h2>
                    <p className="mt-2 text-sm text-slate-600">
                        {showOtp ? `Enter the 6-digit code sent to ${formData.email}` : 'Start building your professional resume today'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-100 italic font-medium">
                        {error}
                    </div>
                )}

                {message && !error && (
                    <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm text-center border border-green-100">
                        {message}
                    </div>
                )}

                {!showOtp ? (
                    <>
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

                        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <input
                                        name="name"
                                        type="text"
                                        required
                                        className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary sm:text-sm transition-all"
                                        placeholder="Full Name"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <input
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
                                    <input
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

                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50"
                            >
                                {loading ? 'Sending Code...' : 'Create Account'}
                            </button>
                        </form>
                    </>
                ) : (
                    <form className="mt-6 space-y-6" onSubmit={handleVerifyOTP}>
                        <div>
                            <input
                                type="text"
                                required
                                maxLength="6"
                                className="appearance-none rounded-xl relative block w-full px-4 py-4 border border-slate-300 placeholder-slate-400 text-slate-900 text-center text-3xl font-bold tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                placeholder="000000"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                        </div>

                        <div className="space-y-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-lg shadow-slate-950/20 disabled:opacity-50"
                            >
                                {loading ? 'Verifying...' : 'Verify & Continue'}
                            </button>
                            <button
                                type="button"
                                onClick={handleResendOTP}
                                className="w-full text-center text-sm font-medium text-primary hover:text-blue-700"
                            >
                                Didn't receive code? Resend
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowOtp(false)}
                                className="w-full text-center text-xs text-slate-400 hover:text-slate-600"
                            >
                                Change email address
                            </button>
                        </div>
                    </form>
                )}

                {!showOtp && (
                    <div className="text-center text-sm">
                        <span className="text-slate-600">Already have an account? </span>
                        <Link to="/login" className="font-medium text-primary hover:text-blue-700 transition-colors">
                            Sign in
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Register;
