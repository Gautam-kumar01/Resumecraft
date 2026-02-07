
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import PublicResume from './pages/PublicResume';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  return (
    <Router>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id'}>
        <AuthProvider>
          <div className="min-h-screen font-sans text-slate-900 relative">
            {/* Premium Background Elements */}
            <div className="premium-bg">
              <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/10 blur-[120px] rounded-full animate-blob"></div>
              <div className="absolute top-[20%] right-[-5%] w-[35%] h-[35%] bg-purple-400/10 blur-[100px] rounded-full animate-blob" style={{ animationDelay: '2s' }}></div>
              <div className="absolute bottom-[-10%] left-[20%] w-[30%] h-[30%] bg-sky-400/10 blur-[80px] rounded-full animate-blob" style={{ animationDelay: '4s' }}></div>
            </div>

            <Navbar />
            <main className="relative z-10">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />

                <Route path="/editor/:id?" element={
                  <ProtectedRoute>
                    <Editor />
                  </ProtectedRoute>
                } />

                <Route path="/p/:id" element={<PublicResume />} />
              </Routes>
            </main>
          </div>
        </AuthProvider>
      </GoogleOAuthProvider>
    </Router>
  );
}

export default App;

