import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const GoogleAnalytics = () => {
    const location = useLocation();
    const previousPathRef = useRef(null);

    useEffect(() => {
        const pagePath = `${location.pathname}${location.search}${location.hash}`;

        // gtag.js sends the initial page view from client/index.html. Only send
        // subsequent SPA navigations here so the first page view is not doubled.
        if (previousPathRef.current === null) {
            previousPathRef.current = pagePath;
            return;
        }

        if (previousPathRef.current === pagePath) return;
        previousPathRef.current = pagePath;

        if (typeof window.gtag !== 'function') return;

        window.gtag('event', 'page_view', {
            page_title: document.title,
            page_location: window.location.href,
            page_path: pagePath,
        });
    }, [location]);

    return null;
};

export default GoogleAnalytics;
