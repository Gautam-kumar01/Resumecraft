
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import PublicResume from './pages/PublicResume';
import Templates from './pages/Templates';
import CoverLetterTemplates from './pages/CoverLetterTemplates';
import CoverLetterEditor from './pages/CoverLetterEditor';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import CookiePolicy from './pages/CookiePolicy';
import { AuthProvider } from './context/AuthContext';
import Resource from './pages/Resource';
import BlogList from './pages/BlogList';
import BlogPost from './pages/BlogPost';
import About from './pages/About';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import CookieConsent from './components/CookieConsent';
import ScrollToTop from './components/ScrollToTop';
import { GoogleOAuthProvider } from '@react-oauth/google';

import ResumeBuilderDashboard from './pages/ResumeBuilderDashboard';
import AtsResumeCheckerPreview from './pages/AtsResumeCheckerPreview';
import FreeResumeTemplates from './pages/FreeResumeTemplates';

function App() {
  return (
    <Router>
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
              <Routes>
                <Route path="/" element={<Home />} />
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

                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />

                <Route path="/templates" element={<Templates />} />

                <Route path="/cover-letter-templates" element={<CoverLetterTemplates />} />

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

