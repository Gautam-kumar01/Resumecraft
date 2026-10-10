import { useEffect, useRef } from 'react';

/**
 * Adsterra Native Banner (4:1 Widget Layout)
 * Placement Key: c22ba0be7de9372fb7daf72872423fb5
 * Unit ID: 31652262 (NativeBanner_1)
 */
const NativeBannerAd = ({ className = '' }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (typeof window === 'undefined' || window.__PRERENDERING__) return;

        const container = containerRef.current;
        if (!container) return;

        // Ensure container is clean before appending
        const existingScript = container.querySelector('script[src*="c22ba0be7de9372fb7daf72872423fb5"]');
        if (!existingScript) {
            const script = document.createElement('script');
            script.async = true;
            script.setAttribute('data-cfasync', 'false');
            script.src = 'https://bauval.org/21/c22ba0be7de9372fb7daf72872423fb5';
            
            try {
                container.appendChild(script);
            } catch (err) {
                console.warn('Adsterra Native Banner script load error:', err);
            }
        }
    }, []);

    return (
        <div className={`w-full my-8 flex flex-col items-center justify-center overflow-hidden ${className}`}>
            <span className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-stone-500 font-semibold mb-2 select-none">
                Advertisement
            </span>
            <div
                ref={containerRef}
                id="container-c22ba0be7de9372fb7daf72872423fb5"
                className="w-full flex justify-center items-center min-h-[90px]"
            ></div>
        </div>
    );
};

export default NativeBannerAd;
