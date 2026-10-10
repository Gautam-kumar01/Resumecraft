import { useEffect } from 'react';

/**
 * Social Bar Ad Unit
 */
const SocialBarAd = () => {
    useEffect(() => {
        if (typeof window === 'undefined' || window['__PRERENDERING__']) return;

        const scriptId = 'sb-unit-script';
        if (document.getElementById(scriptId)) return;

        try {
            const script = document.createElement('script');
            script.id = scriptId;
            script.setAttribute('data-cfasync', 'false');
            script.src = 'https://bauval.org/14/dbac3011d3b87d29a2b2afc310847c33';
            script.async = true;

            document.body.appendChild(script);
        } catch (err) {
            console.warn('Social Bar script load error:', err);
        }
    }, []);

    return null;
};

export default SocialBarAd;
