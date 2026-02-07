
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

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
          <Navbar />
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
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
