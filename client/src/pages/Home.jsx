
import { Link } from 'react-router-dom';
import { FileText, CheckCircle, Download, Share2 } from 'lucide-react';

const Home = () => {
    return (
        <div className="bg-slate-50">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-16 pb-32 space-y-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-8">
                            Build Your Professional <br />
                            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                Resume in Minutes
                            </span>
                        </h1>
                        <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                            Create a polished, ATS-friendly resume with our easy-to-use builder.
                            Choose from professional templates and download instantly.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to="/register"
                                className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-blue-700 text-white rounded-full font-semibold text-lg transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1"
                            >
                                Create My Resume
                            </Link>
                            <Link
                                to="/login"
                                className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-full font-semibold text-lg transition-all"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900">Everything you need to land your dream job</h2>
                        <p className="mt-4 text-lg text-slate-600">Simple, powerful tools to help you stand out.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            {
                                icon: <FileText className="h-8 w-8 text-primary" />,
                                title: "Professional Templates",
                                description: "Choose from a variety of clean, modern templates designed by HR experts."
                            },
                            {
                                icon: <Download className="h-8 w-8 text-primary" />,
                                title: "Instant Download",
                                description: "Export your resume as a high-quality PDF, ready for printing or emailing."
                            },
                            {
                                icon: <Share2 className="h-8 w-8 text-primary" />,
                                title: "Public Portfolio",
                                description: "Share your resume with a unique link. Perfect for LinkedIn and social media."
                            }
                        ].map((feature, index) => (
                            <div key={index} className="p-8 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100">
                                <div className="bg-white p-3 rounded-xl w-fit shadow-sm mb-6">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p>&copy; {new Date().getFullYear()} ResumeCraft. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
