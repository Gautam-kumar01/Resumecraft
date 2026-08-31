import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ResumeOnboarding from '../components/ResumeOnboarding';

const Onboarding = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = searchParams.get('mode') || 'choose';

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Premium background elements matching the main page aesthetics */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(249,115,22,0.12),transparent_40%),radial-gradient(circle_at_15%_85%,rgba(59,130,246,0.1),transparent_35%)]" />
      <div className="absolute -right-28 top-10 h-80 w-80 rounded-full bg-orange-500/5 blur-3xl" />
      <div className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-blue-500/5 blur-3xl" />
      
      <div className="relative z-10 w-full max-w-3xl flex justify-center">
        <ResumeOnboarding
          isOpen={true}
          onClose={() => navigate('/')}
          onOpenEditor={() => navigate('/editor')}
          isPage={true}
          initialMode={mode}
        />
      </div>
    </div>
  );
};

export default Onboarding;
