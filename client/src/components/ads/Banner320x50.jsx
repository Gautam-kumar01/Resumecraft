import { useEffect, useRef } from 'react';

/**
 * Adsterra Banner 320x50 Ad Unit (Mobile Leaderboard)
 * Unit ID: 31652266 (320x50_1)
 * Key: f8e3e8a2d00ee8eda4ad8ed952064c61
 */
const Banner320x50 = ({ className = '' }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (typeof window === 'undefined' || window['__PRERENDERING__']) return;

        const container = containerRef.current;
        if (!container) return;

        container.innerHTML = '';

        const iframe = document.createElement('iframe');
        iframe.width = '320';
        iframe.height = '50';
        iframe.style.border = 'none';
        iframe.style.overflow = 'hidden';
        iframe.scrolling = 'no';
        iframe.title = 'Adsterra 320x50 Banner';

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
            'key' : 'f8e3e8a2d00ee8eda4ad8ed952064c61',
            'format' : 'iframe',
            'height' : 50,
            'width' : 320,
            'params' : {}
        };
    </script>
    <script type="text/javascript" src="https://bauval.org/22/f8e3e8a2d00ee8eda4ad8ed952064c61"></script>
</body>
</html>`);
            iframeDoc.close();
        }
    }, []);

    return (
        <div className={`w-full max-w-full flex flex-col items-center justify-center my-4 overflow-hidden ${className}`}>
            <span className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-stone-500 font-semibold mb-1 select-none">
                Advertisement
            </span>
            <div 
                ref={containerRef}
                className="w-[320px] max-w-full h-[50px] flex items-center justify-center bg-slate-50/50 dark:bg-stone-900/40 rounded-xl overflow-hidden"
            ></div>
        </div>
    );
};

export default Banner320x50;
