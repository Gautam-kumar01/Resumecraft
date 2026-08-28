import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

const MEASUREMENT_ID = 'G-H62YK4JY8Q';
const CONSENT_KEY = 'resumecraft_cookie_consent';
const SCRIPT_MARKER = 'data-resumecraft-ga';

const hasAnalyticsConsent = () => {
    if (typeof window === 'undefined') return false;
    try {
        return window.localStorage.getItem(CONSENT_KEY) === 'accepted';
    } catch {
        return false;
    }
};

const loadGoogleAnalytics = () => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    if (window.__resumeCraftGaInitialized) return;

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() {
        window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', MEASUREMENT_ID);

    if (!document.querySelector(`script[${SCRIPT_MARKER}]`)) {
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
        script.setAttribute(SCRIPT_MARKER, 'true');
        document.head.appendChild(script);
    }

    window.__resumeCraftGaInitialized = true;
};

const GoogleAnalytics = () => {
    const location = useLocation();
    const previousPathRef = useRef(null);
    const [hasConsent, setHasConsent] = useState(hasAnalyticsConsent);

    useEffect(() => {
        const handleConsent = () => setHasConsent(true);
        window.addEventListener('resumecraft:cookie-consent', handleConsent);
        return () => window.removeEventListener('resumecraft:cookie-consent', handleConsent);
    }, []);

    useEffect(() => {
        if (hasConsent) loadGoogleAnalytics();
    }, [hasConsent]);

    useEffect(() => {
        if (!hasConsent || typeof window.gtag !== 'function') return;

        const pagePath = `${location.pathname}${location.search}${location.hash}`;

        // gtag config sends the first page_view. Only send subsequent SPA
        // navigations here so the initial page view is not doubled.
        if (previousPathRef.current === null) {
            previousPathRef.current = pagePath;
            return;
        }

        if (previousPathRef.current === pagePath) return;
        previousPathRef.current = pagePath;

        window.gtag('event', 'page_view', {
            page_title: document.title,
            page_location: window.location.href,
            page_path: pagePath,
        });
    }, [hasConsent, location]);

    return null;
};

export default GoogleAnalytics;
