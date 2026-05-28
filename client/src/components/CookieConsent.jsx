import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, ShieldCheck, X } from 'lucide-react';

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
    const [isVisible, setIsVisible] = useState(() => !hasAcceptedCookies());

    const acceptCookies = () => {
        try {
            window.localStorage.setItem(CONSENT_KEY, 'accepted');
        } catch {
            // Consent still closes for the current session if storage is blocked.
        }
        setIsVisible(false);
    };

    const dismissNotice = () => {
        setIsVisible(false);
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:px-6 sm:pb-6">
            <div className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-2xl shadow-slate-900/15 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/95 sm:p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex gap-3 text-left">
                        <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600 sm:flex">
                            <Cookie className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-orange-500 sm:hidden" aria-hidden="true" />
                                <h2 className="text-base font-bold text-slate-900 dark:text-white">Cookies Policy</h2>
                            </div>
                            <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                                ResumeCraft uses essential cookies and local storage to keep you signed in, remember your consent, and improve the resume builder experience. We do not sell your personal data.
                            </p>
                            <Link to="/cookies" className="mt-2 inline-flex text-sm font-semibold text-orange-600 hover:text-orange-700">
                                Read Cookie Policy
                            </Link>
                        </div>
                    </div>

                    <div className="flex flex-col shrink-0 items-end gap-3 sm:gap-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <button
                                type="button"
                                onClick={dismissNotice}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-700 dark:border-slate-700 dark:text-slate-300 dark:hover:text-white"
                                aria-label="Dismiss cookie notice"
                            >
                                <X className="h-4 w-4" aria-hidden="true" />
                            </button>
                            <button
                                type="button"
                                onClick={acceptCookies}
                                className="inline-flex h-10 items-center justify-center rounded-xl bg-orange-500 px-5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                            >
                                Accept Cookies
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="country-access" className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500" />
                            <label htmlFor="country-access" className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                I accept it and my resumecraft will access in all country
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;
