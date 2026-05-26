import React, { useState, useEffect } from 'react';
import { User, Lock, Mail, Shield } from 'lucide-react';

export default function AuthScreen({ onLoginSuccess, onSkip }) {
  const [authType, setAuthType] = useState('login');
  const [roleType, setRoleType] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [meshGradient, setMeshGradient] = useState('');

  // Atmospheric mouse tracking for the background mesh as requested in screen 5
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      setMeshGradient(`
        radial-gradient(at ${x * 100}% ${y * 100}%, #1a1d27 0%, transparent 50%),
        radial-gradient(at 100% 100%, #122131 0%, transparent 50%),
        radial-gradient(at 50% 0%, #32009a 0%, transparent 40%)
      `);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleAuthAction = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      alert('Please enter your campus email.');
      return;
    }

    if (!password.trim()) {
      alert('Please enter your password.');
      return;
    }

    if (authType === 'signup' && password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const baseUrl = import.meta.env.VITE_API_URL || 'https://anonymousapp-bn6c.onrender.com';
    const endpoint = `${baseUrl}/api/auth/${roleType}/${authType}`;
    const payload = {
      email: email.trim(),
      password: password.trim(),
      ...(authType === 'signup' ? { confirmPassword: confirmPassword.trim() } : {})
    };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || 'Authentication failed.');
        return;
      }

      onLoginSuccess(result);
    } catch (error) {
      console.error('Auth error:', error);
      alert('Unable to reach the backend auth server.');
    }
  };


  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-4 overflow-hidden py-16">

      {/* Mesh Background */}
      <div
        className="absolute inset-0 bg-mesh pointer-events-none transition-all duration-300"
        style={{
          backgroundImage: meshGradient || `
            radial-gradient(at 20% 20%, #1a1d27 0%, transparent 50%),
            radial-gradient(at 100% 100%, #122131 0%, transparent 50%),
            radial-gradient(at 50% 0%, #32009a 0%, transparent 40%)
          `,
          opacity: 0.5
        }}
      />

      {/* Dynamic atmospheric grid overlays */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Brand Header */}
      <div className="flex items-center gap-2 mb-8 z-10 select-none animate-fade-in">
        <Shield className="w-7 h-7 text-[#cabeff] fill-[#cabeff]/14" />
        <span className="font-bold text-2xl text-[#cabeff] tracking-tighter">HushCampus</span>
      </div>

      <div className="w-full max-w-[440px] z-10">

        {/* Main Authentication Card */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/15 backdrop-blur-lg flex flex-col gap-6">

          <div className="flex flex-col gap-3 min-h-[70px]">
            <div>
              <h1 className="text-2xl font-bold text-[#d4e4fa] tracking-tight">
                {authType === 'login' ? `${roleType === 'student' ? 'Student' : 'Moderator'} Login` : `${roleType === 'student' ? 'Student' : 'Moderator'} Signup`}
              </h1>
              <p className="text-xs text-[#c9c4d8] leading-relaxed">
                {authType === 'login'
                  ? `Sign in to your ${roleType} account and access the anonymous campus feed.`
                  : `Create a ${roleType} account and connect securely with anonymous campus posts.`}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRoleType('student')}
                className={`text-xs px-3 py-2 rounded-full transition-all ${roleType === 'student' ? 'bg-[#cabeff] text-[#32009a]' : 'bg-white/5 text-[#d4e4fa] hover:bg-white/10'}`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setRoleType('moderator')}
                className={`text-xs px-3 py-2 rounded-full transition-all ${roleType === 'moderator' ? 'bg-[#cabeff] text-[#32009a]' : 'bg-white/5 text-[#d4e4fa] hover:bg-white/10'}`}
              >
                Moderator
              </button>
            </div>

            <p className="text-[10px] text-[#c9c4d8]">
              Your campus email is used only for verification; display name remains anonymous.
            </p>
          </div>

          <form onSubmit={handleAuthAction} className="flex flex-col gap-4">

            {/* Email input field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-[#c9c4d8] uppercase tracking-wider ml-1">
                University Email
              </label>
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  className="w-full bg-[#0d1c2d] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#d4e4fa] placeholder-[#c9c4d8]/40 focus:outline-none focus:border-[#cabeff] transition-all"
                />
                <Mail className="w-4 h-4 absolute right-3.5 top-3.5 text-[#c9c4d8]/40 group-focus-within:text-[#cabeff] transition-colors" />
              </div>
            </div>

            {/* Password input field */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[11px] font-bold text-[#c9c4d8] uppercase tracking-wider">
                  Password
                </label>
                {authType === 'login' && (
                  <button
                    type="button"
                    onClick={() => alert("Keep it simple! You can log in using any passwords or click the Quick Access keys below.")}
                    className="text-xs text-[#cabeff] hover:underline"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0d1c2d] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#d4e4fa] placeholder-[#c9c4d8]/40 focus:outline-none focus:border-[#cabeff] transition-all"
                />
                <Lock className="w-4 h-4 absolute right-3.5 top-3.5 text-[#c9c4d8]/40 group-focus-within:text-[#cabeff] transition-colors" />
              </div>
            </div>

            {/* Confirmation password signup list item */}
            {authType === 'signup' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-[#c9c4d8] uppercase tracking-wider ml-1">
                  Confirm Password
                </label>
                <div className="relative group">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#0d1c2d] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#d4e4fa] placeholder-[#c9c4d8]/40 focus:outline-none focus:border-[#cabeff] transition-all"
                  />
                  <Lock className="w-4 h-4 absolute right-3.5 top-3.5 text-[#c9c4d8]/40 group-focus-within:text-[#cabeff] transition-colors" />
                </div>
              </div>
            )}

            {/* Guideline checklist toggle */}
            {authType === 'signup' && (
              <div className="flex items-start gap-2.5 mt-1 px-1">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 bg-[#0d1c2d] rounded border-white/10 text-[#cabeff] focus:ring-[#cabeff]"
                />
                <label htmlFor="agreeTerms" className="text-xs text-[#c9c4d8] leading-tight select-none">
                  I agree to campus community guidelines and respect anonymous privacy.
                </label>
              </div>
            )}

            {/* Form execution trigger */}
            <button
              type="submit"
              className="w-full bg-[#cabeff] text-[#32009a] font-semibold text-sm py-3.5 rounded-xl mt-2 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-[#cabeff]/15 cursor-pointer"
            >
              {authType === 'login' ? 'Login' : 'Create Account'}
            </button>
          </form>

          <div className="text-[10px] text-[#c9c4d8] mb-4">
            Use your campus email or register a new account to join the anonymous campus feed.
          </div>

          {/* Account tab selectors */}
          <div className="text-center pt-2 flex flex-col gap-2">
            <p className="text-xs text-[#c9c4d8]">
              {authType === 'login' ? "Don't have an account?" : 'Already a member?'}
              <button
                type="button"
                onClick={() => setAuthType(authType === 'login' ? 'signup' : 'login')}
                className="text-[#cabeff] font-semibold text-xs ml-1.5 hover:underline cursor-pointer"
              >
                {authType === 'login' ? 'Sign up' : 'Login'}
              </button>
            </p>
            <div className="text-xs text-[#c9c4d8]/60 mt-1 border-t border-white/5 pt-2">
              or{' '}
              <button
                type="button"
                onClick={onSkip}
                className="text-[#cabeff]/80 font-medium hover:underline hover:text-[#cabeff] cursor-pointer"
              >
                Continue as Guest
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Decorative footer details matching mockup exactly */}
      <div className="fixed bottom-0 left-0 w-full p-6 flex justify-between items-end opacity-20 pointer-events-none text-[#d4e4fa] select-none">
        <div className="max-w-[180px]">
          <div className="w-10 h-10 rounded-full border border-[#cabeff] mb-2 animate-pulse" />
          <p className="text-[10px] font-bold tracking-wider uppercase text-[#cabeff]">SECURE ENCRYPTION ACTIVE</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold tracking-wider uppercase">VERSION 2.0.4 - "PHANTOM"</p>
        </div>
      </div>

    </div>
  );
}
