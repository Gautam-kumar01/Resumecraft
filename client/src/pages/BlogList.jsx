import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, Clock, Calendar, ArrowRight, CornerDownRight, FilterX } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import { blogPosts } from '../data/blogPosts';
import Newsletter from '../components/Newsletter';
import OptimizedImage from '../components/OptimizedImage';

const BlogList = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Extract all unique categories dynamically
    const categories = useMemo(() => {
        const unique = new Set(blogPosts.map(p => p.category));
        return ['All', ...Array.from(unique)];
    }, []);

    // Filter blog posts based on search query and category
    const filteredPosts = useMemo(() => {
        return blogPosts.filter(post => {
            const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
            const matchesSearch = searchQuery === '' || 
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesCategory && matchesSearch;
        });
    }, [searchQuery, selectedCategory]);

    // Find the featured post
    const featuredPost = useMemo(() => {
        return blogPosts.find(p => p.featured) || blogPosts[0];
    }, []);

    // Other posts (excluding the featured one)
    const otherPosts = useMemo(() => {
        return blogPosts.filter(p => p.slug !== featuredPost?.slug);
    }, [featuredPost]);

    // Popular posts (simulated for UI showcase - picking 3 posts)
    const popularPosts = useMemo(() => {
        return blogPosts.slice(0, 3);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-16 pb-24 transition-colors duration-300">
            <SEO 
                title="Resume & Career Blog"
                description="Expert tips, ATS optimization templates, LinkedIn branding strategies, and career guides to help you land your dream job."
                url="/blog"
            />

            {/* Glassmorphic Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative rounded-[2.5rem] bg-gradient-to-br from-white/80 to-slate-50/50 dark:from-slate-800/80 dark:to-slate-900/50 backdrop-blur-xl border border-white dark:border-slate-800 shadow-2xl p-8 md:p-16 overflow-hidden"
                >
                    {/* Glow Accents */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-300/5 rounded-full blur-3xl -ml-20 -mb-20"></div>

                    <div className="relative z-10 max-w-3xl">
                        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-orange-50 dark:bg-orange-950/30 text-orange-500 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                            <BookOpen className="h-3.5 w-3.5" />
                            <span>ResumeCraft Resources</span>
                        </div>
                        
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-[1.1]">
                            Resume & <span className="text-orange-500">Career Insights</span>
                        </h1>
                        
                        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
                            Discover expert resume tips, ATS compliance guidelines, LinkedIn profile optimization strategies, and professional career advice.
                        </p>

                        {/* Integrated Search Box */}
                        <div className="relative max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <input 
                                type="text"
                                placeholder="Search articles, tags, or advice..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 shadow-md focus:shadow-lg transition-all"
                            />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Category Filtering Pills */}
                <div className="flex flex-wrap gap-2.5 mb-12 border-b border-slate-100 dark:border-slate-800 pb-6">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                                selectedCategory === category
                                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-800 hover:border-orange-500/30'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Spotlights and Post grids */}
                {filteredPosts.length === 0 ? (
                    /* Empty State UI */
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20 bg-white dark:bg-slate-800/40 rounded-3xl border border-slate-100 dark:border-slate-800 max-w-xl mx-auto mb-16"
                    >
                        <div className="inline-flex p-4 bg-orange-50 dark:bg-orange-950/30 text-orange-500 rounded-full mb-6">
                            <FilterX className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Articles Found</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto mb-8">
                            We couldn't find any articles matching "{searchQuery}" under the selected category.
                        </p>
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedCategory('All');
                            }}
                            className="bg-slate-900 hover:bg-slate-800 dark:bg-orange-500 dark:hover:bg-orange-600 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-md"
                        >
                            Clear Filters & View All
                        </button>
                    </motion.div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-12 mb-16">
                        
                        {/* Left & Middle: Article Streams */}
                        <div className="lg:col-span-2 space-y-12">
                            
                            {/* Featured Spotlight (only visible on "All" category and no search query) */}
                            {selectedCategory === 'All' && !searchQuery && featuredPost && (
                                <div className="space-y-6">
                                    <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                        <CornerDownRight className="h-4 w-4 text-orange-500" />
                                        Featured Spotlight
                                    </h2>
                                    
                                    <motion.div 
                                        whileHover={{ y: -4 }}
                                        className="group bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-800/80 overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300"
                                    >
                                        <Link to={`/blog/${featuredPost.slug}`} className="block relative aspect-[21/9] overflow-hidden">
                                            <OptimizedImage 
                                                src={featuredPost.coverImage} 
                                                alt={featuredPost.title}
                                                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                                                priority={true}
                                                figureClassName="m-0 w-full h-full"
                                            />
                                            <div className="absolute top-4 left-4 bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-sm">
                                                {featuredPost.category}
                                            </div>
                                        </Link>

                                        <div className="p-8 md:p-10">
                                            <div className="flex items-center space-x-4 text-xs font-bold text-slate-400 mb-4">
                                                <span className="flex items-center space-x-1">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    <span>{featuredPost.publishDate}</span>
                                                </span>
                                                <span>•</span>
                                                <span className="flex items-center space-x-1">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    <span>{featuredPost.readTime}</span>
                                                </span>
                                            </div>

                                            <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-4 leading-tight group-hover:text-orange-500 transition-colors">
                                                <Link to={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link>
                                            </h3>
                                            
                                            <p className="text-slate-500 dark:text-slate-400 mb-8 line-clamp-3 leading-relaxed">
                                                {featuredPost.description}
                                            </p>

                                            <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
                                                <div className="flex items-center space-x-3">
                                                    <img 
                                                        src={featuredPost.author.avatar} 
                                                        alt={featuredPost.author.name}
                                                        className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-700" 
                                                    />
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{featuredPost.author.name}</p>
                                                        <p className="text-xs text-slate-400">{featuredPost.author.role}</p>
                                                    </div>
                                                </div>

                                                <Link 
                                                    to={`/blog/${featuredPost.slug}`}
                                                    className="inline-flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-md"
                                                >
                                                    <span>Read Article</span>
                                                    <ArrowRight className="h-3.5 w-3.5" />
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            )}

                            {/* Responsive Article Grid */}
                            <div className="space-y-6">
                                <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                    <CornerDownRight className="h-4 w-4 text-orange-500" />
                                    {selectedCategory === 'All' && !searchQuery ? 'Latest Articles' : 'Search Results'}
                                </h2>
                                
                                <div className="grid sm:grid-cols-2 gap-6">
                                    {(selectedCategory === 'All' && !searchQuery ? otherPosts : filteredPosts).map((post) => (
                                        <motion.div 
                                            key={post.slug}
                                            whileHover={{ y: -4 }}
                                            className="group bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                                        >
                                            <Link to={`/blog/${post.slug}`} className="block relative aspect-[16/10] overflow-hidden">
                                                <OptimizedImage 
                                                    src={post.coverImage} 
                                                    alt={post.title}
                                                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                                                    figureClassName="m-0 w-full h-full"
                                                />
                                                <div className="absolute top-3 left-3 bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md shadow-sm">
                                                    {post.category}
                                                </div>
                                            </Link>

                                            <div className="p-6 flex-grow flex flex-col">
                                                <div className="flex items-center space-x-3 text-[11px] font-bold text-slate-400 mb-3">
                                                    <span>{post.publishDate}</span>
                                                    <span>•</span>
                                                    <span>{post.readTime}</span>
                                                </div>

                                                <h3 className="font-black text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors line-clamp-2 mb-3 leading-snug">
                                                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                                                </h3>

                                                <p className="text-slate-500 dark:text-slate-400 text-xs mb-6 line-clamp-2 leading-relaxed flex-grow">
                                                    {post.description}
                                                </p>

                                                <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800/80">
                                                    <div className="flex items-center space-x-2">
                                                        <img 
                                                            src={post.author.avatar} 
                                                            alt={post.author.name}
                                                            className="h-7 w-7 rounded-full object-cover ring-1 ring-slate-100 dark:ring-slate-700" 
                                                        />
                                                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{post.author.name}</span>
                                                    </div>
                                                    <Link 
                                                        to={`/blog/${post.slug}`}
                                                        className="text-xs font-black text-orange-500 group-hover:text-orange-600 flex items-center space-x-1"
                                                    >
                                                        <span>Read</span>
                                                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Sidebar (Popular Articles / Filters / Newsletter Card) */}
                        <div className="space-y-12">
                            
                            {/* Popular Posts */}
                            <div className="bg-white dark:bg-slate-800/50 rounded-3xl p-6 border border-slate-100 dark:border-slate-800">
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                                    <CornerDownRight className="h-4 w-4 text-orange-500" />
                                    Popular Articles
                                </h3>

                                <div className="space-y-6">
                                    {popularPosts.map((post, idx) => (
                                        <Link 
                                            key={post.slug} 
                                            to={`/blog/${post.slug}`} 
                                            className="group flex gap-4 items-start pb-6 last:pb-0 border-b border-slate-50 dark:border-slate-800/50 last:border-b-0"
                                        >
                                            <span className="text-2xl font-black text-slate-200 dark:text-slate-700 group-hover:text-orange-500 transition-colors shrink-0">
                                                {String(idx + 1).padStart(2, '0')}
                                            </span>
                                            <div>
                                                <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors line-clamp-2 leading-snug mb-1">
                                                    {post.title}
                                                </h4>
                                                <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-400">
                                                    <span>{post.category}</span>
                                                    <span>•</span>
                                                    <span>{post.readTime}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Tags list */}
                            <div className="bg-white dark:bg-slate-800/50 rounded-3xl p-6 border border-slate-100 dark:border-slate-800">
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                    <CornerDownRight className="h-4 w-4 text-orange-500" />
                                    Filter by Tag
                                </h3>

                                <div className="flex flex-wrap gap-1.5">
                                    {Array.from(new Set(blogPosts.flatMap(p => p.tags))).map((tag) => (
                                        <button
                                            key={tag}
                                            onClick={() => setSearchQuery(tag)}
                                            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-orange-950/20 hover:text-orange-500 border border-slate-100 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-500 dark:text-slate-400 transition-colors"
                                        >
                                            #{tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Bottom Newsletter Signup Container */}
                <div className="mt-20">
                    <Newsletter />
                </div>
            </div>
        </div>
    );
};

export default BlogList;
