import { useState } from 'react';
import { Link } from 'react-router-dom';

const OptimizedImage = ({
    src,
    srcSet = undefined,
    sizes = undefined,
    alt,
    caption = '',
    linkTo = '',
    width = undefined,
    height = undefined,
    className = '',
    figureClassName = '',
    priority = false
}) => {
    const imageContent = (
        <div className={`relative overflow-hidden rounded-xl ${priority ? '' : 'bg-slate-200 dark:bg-slate-800'} ${className}`}>
            <img
                src={src}
                srcSet={srcSet}
                sizes={sizes}
                alt={alt}
                width={width}
                height={height}
                loading={priority ? 'eager' : 'lazy'}
                decoding="async"
                fetchPriority={priority ? 'high' : 'low'}
                className="w-full h-auto object-cover"
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
