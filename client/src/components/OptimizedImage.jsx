import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=800&auto=format&fit=crop';

const OptimizedImage = ({
    src,
    srcSet = undefined,
    sizes = undefined,
    alt = '',
    caption = '',
    linkTo = '',
    width = undefined,
    height = undefined,
    className = '',
    figureClassName = '',
    priority = false,
    fallbackSrc = DEFAULT_FALLBACK
}) => {
    const [imgSrc, setImgSrc] = useState(src || fallbackSrc);
    const [hasFailed, setHasFailed] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setImgSrc(src || fallbackSrc);
        setHasFailed(false);
        setIsLoaded(false);
    }, [src, fallbackSrc]);

    const handleError = () => {
        if (imgSrc !== fallbackSrc) {
            setImgSrc(fallbackSrc);
        } else {
            setHasFailed(true);
        }
    };

    const imageContent = (
        <div className={`relative overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800/80 ${className}`}>
            {!hasFailed ? (
                <img
                    src={imgSrc}
                    srcSet={srcSet}
                    sizes={sizes}
                    alt={alt}
                    width={width}
                    height={height}
                    loading={priority ? 'eager' : 'lazy'}
                    decoding="async"
                    fetchPriority={priority ? 'high' : 'low'}
                    onLoad={() => setIsLoaded(true)}
                    onError={handleError}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${
                        isLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                />
            ) : (
                <div className="w-full h-full min-h-[120px] flex flex-col items-center justify-center p-4 bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-slate-900/40 text-slate-400">
                    <svg className="w-8 h-8 text-orange-400/70 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 text-center line-clamp-1">{alt || 'Resume Template'}</span>
                </div>
            )}
        </div>
    );

    const content = linkTo ? (
        <Link to={linkTo} className="block w-full transition-transform hover:scale-[1.01]">
            {imageContent}
        </Link>
    ) : (
        imageContent
    );

    return (
        <figure className={`flex flex-col items-center justify-center gap-3 ${figureClassName}`}>
            {content}
            {caption && (
                <figcaption className="text-center text-sm font-medium text-slate-500 dark:text-slate-400 max-w-2xl px-4">
                    {caption}
                </figcaption>
            )}
        </figure>
    );
};

export default OptimizedImage;
