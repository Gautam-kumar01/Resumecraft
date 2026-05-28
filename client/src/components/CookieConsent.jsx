import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, X } from 'lucide-react';

const CONSENT_KEY = 'resumecraft_cookie_consent';

const hasAcceptedCookies = () => {
    if (typeof window === 'undefined') {
        return false;
    }
    try {
        return window.localStorage.getItem(CONSENT_KEY) === 'accepted';
    } catch {
        return false;
    }
};

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimatingOut, setIsAnimatingOut] = useState(false);

    useEffect(() => {
        if (!hasAcceptedCookies()) {
            // Delay to allow smooth entry animation
            const timer = setTimeout(() => setIsVisible(true), 100);
            return () => clearTimeout(timer);
        }
    }, []);

    const acceptCookies = () => {
        try {
            window.localStorage.setItem(CONSENT_KEY, 'accepted');
        } catch {
            // Consent still closes for the current session if storage is blocked.
        }
        closePopup();
    };

    const closePopup = () => {
        setIsAnimatingOut(true);
        setTimeout(() => {
            setIsVisible(false);
            setIsAnimatingOut(false);
        }, 300); // Matches the exit animation duration
    };

    if (!isVisible && !isAnimatingOut) {
        return null;
    }

    return (
        <div className="fixed inset-x-0 bottom-0 z-50 md:bottom-6 md:left-6 md:right-auto md:w-full md:max-w-[380px]">
            <div 
                className={`
                    relative mx-auto w-full overflow-hidden 
                    rounded-t-2xl border border-slate-700/50 
                    bg-slate-900/80 p-5 backdrop-blur-xl 
                    shadow-[0_8px_30px_rgb(0,0,0,0.5)] 
                    transition-all duration-300 ease-in-out md:rounded-2xl
                    ${isVisible && !isAnimatingOut ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 md:translate-y-8'}
                `}
            >
                {/* Close Button */}
                <button
                    type="button"
                    onClick={closePopup}
                    className="absolute right-4 top-4 rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                    aria-label="Close"
                >
                    <X className="h-4 w-4" />
                </button>

                <div className="flex flex-col gap-4">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 text-orange-500 ring-1 ring-orange-500/20">
                            <Cookie className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <h2 className="text-base font-semibold text-white">Cookies & Privacy</h2>
                    </div>

                    {/* Content */}
                    <p className="text-sm leading-relaxed text-slate-300">
                        ResumeCraft uses cookies to improve your experience and keep you signed in securely.
                    </p>

                    {/* Actions */}
                    <div className="mt-1 flex flex-col gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={acceptCookies}
                            className="order-1 inline-flex flex-1 items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(249,115,22,0.5)] active:scale-[0.98] sm:order-2"
                        >
                            Accept All
                        </button>
                        <Link
                            to="/cookies"
                            className="order-2 inline-flex flex-1 items-center justify-center rounded-xl border border-slate-600 bg-slate-800/50 px-4 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-700 hover:text-white sm:order-1"
                        >
                            Manage Settings
                        </Link>
                    </div>

                    {/* Footer Link */}
                    <div className="mt-1 text-center sm:text-left">
                        <Link to="/privacy" className="text-xs text-slate-400 transition-colors hover:text-orange-400 hover:underline">
                            Privacy Policy
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;
