import { useEffect, useRef } from 'react';

/**
 * Adsterra Banner 728x90 Ad Unit (Leaderboard)
 * Unit ID: 31652265 (728x90_1)
 * Key: add11f92698790a65dc96618ef436f0d
 */
const Banner728x90 = ({ className = '' }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (typeof window === 'undefined' || window.__PRERENDERING__) return;

        const container = containerRef.current;
        if (!container) return;

        container.innerHTML = '';

        const iframe = document.createElement('iframe');
        iframe.width = '728';
        iframe.height = '90';
        iframe.style.border = 'none';
        iframe.style.overflow = 'hidden';
        iframe.scrolling = 'no';
        iframe.title = 'Adsterra 728x90 Banner';

        container.appendChild(iframe);

        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (iframeDoc) {
            iframeDoc.open();
            iframeDoc.write(`<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; overflow: hidden; background: transparent; }
    </style>
</head>
<body>
    <script type="text/javascript">
        atOptions = {
            'key' : 'add11f92698790a65dc96618ef436f0d',
            'format' : 'iframe',
            'height' : 90,
            'width' : 728,
            'params' : {}
        };
    </script>
    <script type="text/javascript" src="https://bauval.org/22/add11f92698790a65dc96618ef436f0d"></script>
</body>
</html>`);
            iframeDoc.close();
        }
    }, []);

    return (
        <div className={`flex flex-col items-center justify-center my-6 overflow-hidden ${className}`}>
            <span className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-stone-500 font-semibold mb-1 select-none">
                Advertisement
            </span>
            <div 
                ref={containerRef}
                className="w-[728px] h-[90px] flex items-center justify-center bg-slate-50/50 dark:bg-stone-900/40 rounded-xl overflow-hidden"
            ></div>
        </div>
    );
};

export default Banner728x90;
