import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
    ArrowLeft, 
    Calendar, 
    Clock, 
    Share2, 
    Twitter, 
    Linkedin, 
    Link2, 
    Check, 
    ChevronLeft, 
    ChevronRight,
    BookOpen
} from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import { blogPosts } from '../data/blogPosts';
import InternalLink from '../components/InternalLink';
import Newsletter from '../components/Newsletter';
import OptimizedImage from '../components/OptimizedImage';

const BlogPost = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [scrollPercent, setScrollPercent] = useState(0);
    const [copied, setCopied] = useState(false);

    // Find current post
    const post = useMemo(() => {
        return blogPosts.find(p => p.slug === slug);
    }, [slug]);

    // Redirect to blog home if post not found
    useEffect(() => {
        if (!post) {
            navigate('/blog', { replace: true });
        }
    }, [post, navigate]);

    // Handle scroll progress
    useEffect(() => {
        const handleScroll = () => {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (docHeight > 0) {
                const scrolled = (window.scrollY / docHeight) * 100;
                setScrollPercent(scrolled);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Get current canonical URL
    const currentUrl = useMemo(() => {
        return `https://resumecraft.co.in/blog/${slug}`;
    }, [slug]);

    // Parse headings for Table of Contents
    const headings = useMemo(() => {
        if (!post) return [];
        return post.content
            .filter(block => block.type === 'heading')
            .map(block => ({
                text: block.text,
                id: block.text.toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '')
            }));
    }, [post]);

    // Previous and Next post logic
    const { prevPost, nextPost } = useMemo(() => {
        if (!post) return { prevPost: null, nextPost: null };
        const index = blogPosts.findIndex(p => p.slug === post.slug);
        return {
            prevPost: index > 0 ? blogPosts[index - 1] : null,
            nextPost: index < blogPosts.length - 1 ? blogPosts[index + 1] : null
        };
    }, [post]);

    if (!post) return null;

    // Helper to generate heading IDs matching TOC
    const getHeadingId = (text) => {
        return text.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    // Copy to clipboard handler
    const handleCopyLink = () => {
        navigator.clipboard.writeText(currentUrl).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    // Construct schemas
    const blogPostingSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.description,
        "image": post.coverImage,
        "datePublished": new Date(post.publishDate).toISOString().split('T')[0],
        "dateModified": new Date(post.updatedDate).toISOString().split('T')[0],
        "author": {
            "@type": "Person",
            "name": post.author.name,
            "jobTitle": post.author.role
        },
        "publisher": {
            "@type": "Organization",
            "name": "ResumeCraft",
            "logo": {
                "@type": "ImageObject",
                "url": "https://resumecraft.co.in/logo-dark.png"
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": currentUrl
        }
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://resumecraft.co.in/"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Blog",
                "item": "https://resumecraft.co.in/blog"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": post.title,
                "item": currentUrl
            }
        ]
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-16 pb-24 transition-colors duration-300">
            {/* SEO Tag Integrator */}
            <SEO 
                title={post.title}
                description={post.description}
                image={post.coverImage}
                url={`blog/${post.slug}`}
                type="article"
            />

            {/* Custom JSON-LD schemas injected in Helmet */}
            <Helmet>
                <script type="application/ld+json">
                    {JSON.stringify(blogPostingSchema)}
                </script>
                <script type="application/ld+json">
                    {JSON.stringify(breadcrumbSchema)}
                </script>
            </Helmet>

            {/* Reading Scroll Progress Bar */}
            <div 
                className="fixed top-[64px] left-0 h-1.5 bg-orange-500 z-[999] transition-all duration-75"
                style={{ width: `${scrollPercent}%` }}
            ></div>

            {/* Content Container */}
            <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Back to Blog Action */}
                <div className="mb-10 pt-8">
                    <Link 
                        to="/blog"
                        className="inline-flex items-center space-x-2 text-sm font-bold text-slate-500 hover:text-orange-500 transition-colors group"
                    >
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Blog</span>
                    </Link>
                </div>

                {/* Article Header */}
                <div className="max-w-4xl mx-auto text-center mb-12">
                    <span className="inline-block px-3 py-1 bg-orange-50 dark:bg-orange-950/30 text-orange-500 rounded-full text-xs font-black uppercase tracking-wider mb-6">
                        {post.category}
                    </span>
                    
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight tracking-tight max-w-3xl mx-auto">
                        {post.title}
                    </h1>

                    <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
                        {post.description}
                    </p>

                    {/* Author & Meta details */}
                    <div className="flex flex-wrap items-center justify-center gap-6 pb-8 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center space-x-3 text-left">
                            <img 
                                src={post.author.avatar} 
                                alt={post.author.name}
                                className="h-11 w-11 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-700" 
                            />
                            <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">{post.author.name}</p>
                                <p className="text-xs text-slate-400">{post.author.role}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 text-xs font-bold text-slate-400">
                            <span className="flex items-center space-x-1">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>Published: {post.publishDate}</span>
                            </span>
                            <span>•</span>
                            <span className="flex items-center space-x-1">
                                <Clock className="h-3.5 w-3.5" />
                                <span>{post.readTime}</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Banner Cover Image */}
                <div className="max-w-5xl mx-auto mb-16 rounded-[2rem] overflow-hidden shadow-2xl">
                    <OptimizedImage 
                        src={post.coverImage} 
                        alt={post.title}
                        className="w-full h-auto max-h-[500px] object-cover"
                        priority={true}
                        figureClassName="m-0 w-full"
                    />
                </div>

                {/* Blog Grid Content & Sidebar */}
                <div className="max-w-5xl mx-auto grid lg:grid-cols-12 gap-12">
                    
                    {/* Left Sticky Toolbar: Share and Table of Contents */}
                    <aside className="lg:col-span-3 lg:sticky lg:top-28 h-fit space-y-10 order-2 lg:order-1">
                        
                        {/* Table of Contents */}
                        {headings.length > 0 && (
                            <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800/80">
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1.5">
                                    <BookOpen className="h-3.5 w-3.5 text-orange-500" />
                                    On This Page
                                </h3>
                                
                                <nav className="space-y-3">
                                    {headings.map((heading) => (
                                        <a 
                                            key={heading.id} 
                                            href={`#${heading.id}`}
                                            className="block text-xs font-bold text-slate-500 hover:text-orange-500 dark:text-slate-400 dark:hover:text-orange-400 transition-colors leading-relaxed"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' });
                                            }}
                                        >
                                            {heading.text}
                                        </a>
                                    ))}
                                </nav>
                            </div>
                        )}

                        {/* Social Shares */}
                        <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800/80">
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1.5">
                                <Share2 className="h-3.5 w-3.5 text-orange-500" />
                                Share Article
                            </h3>
                            
                            <div className="flex gap-2">
                                <a 
                                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 bg-slate-50 hover:bg-orange-50 hover:text-orange-500 dark:bg-slate-800 dark:hover:bg-orange-950/20 dark:hover:text-orange-400 border border-slate-100 dark:border-slate-700 rounded-xl text-slate-400 transition-colors flex-grow flex justify-center"
                                    aria-label="Share on LinkedIn"
                                >
                                    <Linkedin className="h-4 w-4" />
                                </a>
                                <a 
                                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(post.title)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 bg-slate-50 hover:bg-orange-50 hover:text-orange-500 dark:bg-slate-800 dark:hover:bg-orange-950/20 dark:hover:text-orange-400 border border-slate-100 dark:border-slate-700 rounded-xl text-slate-400 transition-colors flex-grow flex justify-center"
                                    aria-label="Share on Twitter"
                                >
                                    <Twitter className="h-4 w-4" />
                                </a>
                                <button 
                                    onClick={handleCopyLink}
                                    className="p-3 bg-slate-50 hover:bg-orange-50 hover:text-orange-500 dark:bg-slate-800 dark:hover:bg-orange-950/20 dark:hover:text-orange-400 border border-slate-100 dark:border-slate-700 rounded-xl text-slate-400 transition-colors flex-grow flex justify-center relative"
                                    aria-label="Copy Link"
                                >
                                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Link2 className="h-4 w-4" />}
                                    {copied && (
                                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-green-500 text-white text-[9px] font-black rounded shadow-md">
                                            Copied
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Middle: Content Blocks Rendering */}
                    <div className="lg:col-span-9 order-1 lg:order-2">
                        <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:tracking-tight prose-a:text-orange-500 prose-blockquote:border-orange-500 text-slate-800 dark:text-slate-200">
                            {post.content.map((block, idx) => {
                                if (block.type === 'paragraph') {
                                    return (
                                        <p key={idx} className="text-base sm:text-lg leading-relaxed mb-6">
                                            {block.text}
                                        </p>
                                    );
                                }
                                if (block.type === 'heading') {
                                    const id = getHeadingId(block.text);
                                    return (
                                        <h2 
                                            key={idx} 
                                            id={id}
                                            className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-12 mb-6 scroll-mt-24 tracking-tight leading-snug"
                                        >
                                            {block.text}
                                        </h2>
                                    );
                                }
                                if (block.type === 'list') {
                                    return (
                                        <ul key={idx} className="list-disc pl-6 space-y-3 mb-6">
                                            {block.items.map((item, itemIdx) => {
                                                // Convert simple markdown bold markdown text **like this** into JSX
                                                const parts = item.split('**');
                                                return (
                                                    <li key={itemIdx} className="text-base sm:text-lg leading-relaxed">
                                                        {parts.map((part, partIdx) => 
                                                            partIdx % 2 === 1 ? <strong key={partIdx} className="font-bold text-slate-900 dark:text-white">{part}</strong> : part
                                                        )}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    );
                                }
                                if (block.type === 'quote') {
                                    return (
                                        <blockquote key={idx} className="border-l-4 border-orange-500 pl-6 italic my-8 text-slate-600 dark:text-slate-400">
                                            <p className="text-lg leading-relaxed mb-2">"{block.text}"</p>
                                            {block.author && (
                                                <cite className="text-xs font-bold not-italic text-slate-400 dark:text-slate-500">— {block.author}</cite>
                                            )}
                                        </blockquote>
                                    );
                                }
                                if (block.type === 'highlight') {
                                    return (
                                        <div key={idx} className="my-8 p-6 bg-orange-50 dark:bg-orange-950/20 border-l-4 border-orange-500 rounded-r-2xl">
                                            <p className="text-sm md:text-base text-orange-900 dark:text-orange-300 font-medium leading-relaxed m-0">
                                                {block.text}
                                            </p>
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </div>

                        {/* Prev / Next Article Navigation */}
                        <div className="flex flex-col sm:flex-row items-stretch gap-4 mt-16 pt-8 border-t border-slate-100 dark:border-slate-800">
                            {prevPost ? (
                                <Link 
                                    to={`/blog/${prevPost.slug}`}
                                    className="flex-1 flex gap-4 p-5 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 text-left hover:border-orange-500 transition-colors group"
                                >
                                    <ChevronLeft className="h-5 w-5 text-slate-400 group-hover:text-orange-500 shrink-0 mt-0.5" />
                                    <div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Previous Article</span>
                                        <span className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-orange-500 transition-colors">
                                            {prevPost.title}
                                        </span>
                                    </div>
                                </Link>
                            ) : <div className="flex-1 hidden sm:block"></div>}

                            {nextPost ? (
                                <Link 
                                    to={`/blog/${nextPost.slug}`}
                                    className="flex-1 flex gap-4 p-5 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 text-right justify-end hover:border-orange-500 transition-colors group"
                                >
                                    <div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Next Article</span>
                                        <span className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-orange-500 transition-colors">
                                            {nextPost.title}
                                        </span>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-orange-500 shrink-0 mt-0.5" />
                                </Link>
                            ) : <div className="flex-1 hidden sm:block"></div>}
                        </div>

                    </div>
                </div>

                {/* Bottom Recommendations */}
                <InternalLink currentSlug={post.slug} category={post.category} />

                {/* Bottom Newsletter */}
                <div className="mt-16">
                    <Newsletter />
                </div>
            </article>
        </div>
    );
};

export default BlogPost;
