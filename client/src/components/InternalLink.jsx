import { Link } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';
import { ArrowRight, Clock, User } from 'lucide-react';
import OptimizedImage from './OptimizedImage';

const InternalLink = ({ currentSlug, category, limit = 3 }) => {
    // Filter out current post and find posts in the same category or with matching tags
    const relatedPosts = blogPosts
        .filter(post => post.slug !== currentSlug)
        .sort((a, b) => {
            // Priority 1: Same category
            if (a.category === category && b.category !== category) return -1;
            if (b.category === category && a.category !== category) return 1;
            return 0;
        })
        .slice(0, limit);

    if (relatedPosts.length === 0) return null;

    return (
        <div className="mt-16 pt-16 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">
                Recommended Reading
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((post) => (
                    <Link 
                        key={post.slug} 
                        to={`/blog/${post.slug}`}
                        className="group flex flex-col bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all"
                    >
                        <div className="relative aspect-[16/9] w-full overflow-hidden">
                            <OptimizedImage 
                                src={post.coverImage} 
                                alt={post.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                figureClassName="m-0 w-full h-full"
                            />
                            <div className="absolute top-3 left-3 bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md">
                                {post.category}
                            </div>
                        </div>

                        <div className="p-6 flex-grow flex flex-col">
                            <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors line-clamp-2 mb-2 leading-snug">
                                {post.title}
                            </h4>
                            
                            <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2 mb-6 flex-grow leading-relaxed">
                                {post.description}
                            </p>

                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50 dark:border-slate-800 text-[11px] font-bold text-slate-400">
                                <span className="flex items-center space-x-1">
                                    <Clock className="h-3 w-3" />
                                    <span>{post.readTime}</span>
                                </span>
                                <span className="flex items-center space-x-1 group-hover:text-orange-500 transition-colors">
                                    <span>Read Article</span>
                                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default InternalLink;
