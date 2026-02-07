
import React from 'react';
import { FileText, Sparkles, Zap } from 'lucide-react';

const Logo = ({ className = "", showText = true, size = "md" }) => {
    const sizeClasses = {
        sm: { icon: "h-4 w-4", container: "p-1", text: "text-lg", spark: "h-2 w-2" },
        md: { icon: "h-6 w-6", container: "p-2", text: "text-2xl", spark: "h-3 w-3" },
        lg: { icon: "h-10 w-10", container: "p-3", text: "text-4xl", spark: "h-5 w-5" },
        xl: { icon: "h-14 w-14", container: "p-4", text: "text-6xl", spark: "h-7 w-7" }
    };

    const currentSize = sizeClasses[size] || sizeClasses.md;

    return (
        <div className={`flex items-center space-x-3 group ${className}`}>
            {/* Visual Icon Container */}
            <div className="relative">
                <div className={`relative ${currentSize.container} rounded-2xl overflow-hidden transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                    {/* Animated Background Layers */}
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-500 via-purple-600 to-indigo-600 animate-gradient-xy"></div>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.4),transparent_70%)]"></div>

                    {/* The Main Icon */}
                    <div className="relative z-10 flex items-center justify-center">
                        <FileText className={`${currentSize.icon} text-white drop-shadow-md`} />
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden">
                        <div className="absolute -top-1 -right-1 opacity-50">
                            <div className="w-8 h-8 bg-white/20 blur-xl rounded-full"></div>
                        </div>
                    </div>
                </div>

                {/* Floating Accents */}
                <div className={`absolute -top-1 -right-1 bg-white rounded-full p-1 shadow-lg transform transition-all duration-300 group-hover:scale-125 group-hover:-translate-y-1 z-20`}>
                    <Sparkles className={`${currentSize.spark} text-rose-500 fill-rose-500`} />
                </div>

                <div className={`absolute -bottom-1 -left-1 bg-white rounded-full p-0.5 shadow-md transform transition-all duration-300 group-hover:rotate-12 z-20`}>
                    <Zap className="h-2 w-2 text-amber-500 fill-amber-500" />
                </div>
            </div>

            {/* Brand Text */}
            {showText && (
                <div className="flex flex-col">
                    <span className={`${currentSize.text} font-black tracking-tighter leading-none`}>
                        <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent group-hover:from-rose-500 group-hover:to-indigo-600 transition-all duration-500">
                            Resume
                        </span>
                        <span className="bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 bg-clip-text text-transparent italic ml-0.5">
                            Craft
                        </span>
                    </span>
                    <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-rose-500 to-indigo-600 transition-all duration-700 rounded-full mt-1"></div>
                </div>
            )}
        </div>
    );
};

export default Logo;
