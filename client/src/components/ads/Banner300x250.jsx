import { useEffect, useRef } from 'react';

/**
 * Adsterra Banner 300x250 Ad Unit
 * Unit ID: 31652264 (300x250_1)
 * Key: 719685a84c676bd9e845be0d8259d58d
 */
const Banner300x250 = ({ className = '' }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (typeof window === 'undefined' || window['__PRERENDERING__']) return;

        const container = containerRef.current;
        if (!container) return;

        // Clean previous content
        container.innerHTML = '';

        // Create an isolated friendly iframe to prevent global atOptions collisions
        const iframe = document.createElement('iframe');
        iframe.width = '300';
        iframe.height = '250';
        iframe.style.border = 'none';
        iframe.style.overflow = 'hidden';
        iframe.scrolling = 'no';
        iframe.title = 'Adsterra 300x250 Banner';

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
            'key' : '719685a84c676bd9e845be0d8259d58d',
            'format' : 'iframe',
            'height' : 250,
            'width' : 300,
            'params' : {}
        };
    </script>
    <script type="text/javascript" src="https://bauval.org/22/719685a84c676bd9e845be0d8259d58d"></script>
</body>
</html>`);
            iframeDoc.close();
        }
    }, []);

    return (
        <div className={`w-full max-w-full flex flex-col items-center justify-center my-6 overflow-hidden ${className}`}>
            <span className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-stone-500 font-semibold mb-1 select-none">
                Advertisement
            </span>
            <div 
                ref={containerRef}
                className="w-[300px] max-w-full h-[250px] flex items-center justify-center bg-slate-50/50 dark:bg-stone-900/40 rounded-xl overflow-hidden"
            ></div>
        </div>
    );
};

export default Banner300x250;
