import { useState } from 'react';
import { Link } from 'react-router-dom';

const OptimizedImage = ({
    src,
    alt,
    caption,
    linkTo,
    width,
    height,
    className = '',
    figureClassName = '',
    priority = false
}) => {
    const [isLoaded, setIsLoaded] = useState(false);

    const imageContent = (
        <div className={`relative overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800 ${className}`}>
            {/* Blur placeholder */}
            <div 
                className={`absolute inset-0 bg-slate-200 dark:bg-slate-800 transition-opacity duration-700 ease-in-out ${isLoaded ? 'opacity-0' : 'opacity-100 animate-pulse'}`}
            ></div>
            
            <img
                src={src}
                alt={alt}
                width={width}
                height={height}
                loading={priority ? 'eager' : 'lazy'}
                decoding={priority ? 'sync' : 'async'}
                onLoad={() => setIsLoaded(true)}
                className={`w-full h-auto transition-opacity duration-700 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
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
