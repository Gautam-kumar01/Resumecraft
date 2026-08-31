
import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
const Onboarding = lazy(() => import('./pages/Onboarding'));
const Login = lazy(() => import('./pages/Login'));

const Register = lazy(() => import('./pages/Register'));

const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));

const ResetPassword = lazy(() => import('./pages/ResetPassword'));

const Dashboard = lazy(() => import('./pages/Dashboard'));

const Editor = lazy(() => import('./pages/Editor'));

const PublicResume = lazy(() => import('./pages/PublicResume'));

const Templates = lazy(() => import('./pages/Templates'));

const CoverLetterTemplates = lazy(() => import('./pages/CoverLetterTemplates'));

const CoverLetterEditor = lazy(() => import('./pages/CoverLetterEditor'));

const Contact = lazy(() => import('./pages/Contact'));

const Terms = lazy(() => import('./pages/Terms'));

const Privacy = lazy(() => import('./pages/Privacy'));

const CookiePolicy = lazy(() => import('./pages/CookiePolicy'));

import { AuthProvider } from './context/AuthContext';
const Resource = lazy(() => import('./pages/Resource'));

const BlogList = lazy(() => import('./pages/BlogList'));

const BlogPost = lazy(() => import('./pages/BlogPost'));

const About = lazy(() => import('./pages/About'));

import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import CookieConsent from './components/CookieConsent';
import ScrollToTop from './components/ScrollToTop';
import { GoogleOAuthProvider } from '@react-oauth/google';

const ResumeBuilderDashboard = lazy(() => import('./pages/ResumeBuilderDashboard'));

const AtsResumeCheckerPreview = lazy(() => import('./pages/AtsResumeCheckerPreview'));

const FreeResumeTemplates = lazy(() => import('./pages/FreeResumeTemplates'));

const RoleTemplate = lazy(() => import('./pages/RoleTemplate'));
const ResumeExamples = lazy(() => import('./pages/ResumeExamples'));
const TemplateLanding = lazy(() => import('./pages/TemplateLanding'));
const AudienceLanding = lazy(() => import('./pages/AudienceLanding'));
const CoverLetterExamples = lazy(() => import('./pages/CoverLetterExamples'));
const InterviewPrep = lazy(() => import('./pages/InterviewPrep'));
const Applications = lazy(() => import('./pages/Applications'));

import GoogleAnalytics from './components/GoogleAnalytics';

function App() {
  return (
    <Router>
      <GoogleAnalytics />
      <ScrollToTop />
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id'}>
        <AuthProvider>
          <div className="min-h-screen font-sans text-slate-900 relative">
            {/* Premium Background Elements */}
            <div className="premium-bg">
              <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-400/10 blur-[120px] rounded-full animate-blob"></div>
              <div className="absolute top-[20%] right-[-5%] w-[35%] h-[35%] bg-orange-300/10 blur-[100px] rounded-full animate-blob" style={{ animationDelay: '2s' }}></div>
              <div className="absolute bottom-[-10%] left-[20%] w-[30%] h-[30%] bg-orange-200/10 blur-[80px] rounded-full animate-blob" style={{ animationDelay: '4s' }}></div>
            </div>

            <Navbar />
            <main className="relative z-10">
              <Suspense fallback={null}>
                <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/create-resume" element={<Onboarding />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/cookies" element={<CookiePolicy />} />
                
                <Route path="/resume-builder-dashboard" element={<ResumeBuilderDashboard />} />
                <Route path="/ats-resume-checker-preview" element={<AtsResumeCheckerPreview />} />
                <Route path="/free-resume-templates" element={<FreeResumeTemplates />} />
                <Route path="/resume-template/:slug" element={<RoleTemplate />} />
                <Route path="/resume-examples" element={<ResumeExamples />} />
                <Route path="/resume-examples/:slug" element={<ResumeExamples />} />
                <Route path="/resume-templates" element={<TemplateLanding />} />
                <Route path="/resume-templates/:slug" element={<TemplateLanding />} />
                <Route path="/resume-builder-for-freshers" element={<AudienceLanding />} />
                <Route path="/resume-builder-for-students" element={<AudienceLanding />} />
                <Route path="/resume-builder-india" element={<AudienceLanding />} />
                <Route path="/resume-format-for-freshers" element={<AudienceLanding />} />
                <Route path="/resume-format-for-bca-students" element={<AudienceLanding />} />
                <Route path="/resume-format-for-mba-students" element={<AudienceLanding />} />
                <Route path="/resume-format-for-engineering-students" element={<AudienceLanding />} />
                <Route path="/ats-resume-for-freshers" element={<AudienceLanding />} />

                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />

                <Route path="/templates" element={<Templates />} />

                <Route path="/cover-letter-templates" element={<CoverLetterTemplates />} />
                <Route path="/cover-letter-examples" element={<CoverLetterExamples />} />
                <Route path="/cover-letter-builder/:id?" element={<ProtectedRoute><CoverLetterEditor /></ProtectedRoute>} />
                <Route path="/interview-prep" element={<InterviewPrep />} />
                <Route path="/applications" element={<Applications />} />

                <Route path="/cover-letter-editor/:id?" element={
                  <ProtectedRoute>
                    <CoverLetterEditor />
                  </ProtectedRoute>
                } />

                <Route path="/editor/:id?" element={
                  <Editor />
                } />

                <Route path="/p/:id" element={<PublicResume />} />
                <Route path="/resource/:slug" element={<Resource />} />
                <Route path="/blog" element={<BlogList />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/about" element={<About />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
            <CookieConsent />
          </div>
        </AuthProvider>
      </GoogleOAuthProvider>
    </Router>
  );
}

export default App;

