import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Shield, Eye, EyeOff, Lock, Mail, ArrowLeft, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('analyst@sentinel.io');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter your credentials.');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0C0C0C' }}>
      {/* Splunk gradient bar */}
      <div className="fixed top-0 left-0 right-0 z-50 splunk-gradient-bar" />

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(255,107,53,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,53,0.02) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #E8478C, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-64" style={{ background: 'linear-gradient(to top, rgba(139,20,60,0.1), transparent)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Back to landing */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm mb-8 hover:opacity-80 transition-opacity"
          style={{ color: '#8B8FA3' }}
        >
          <ArrowLeft size={16} />
          Back to home
        </button>

        {/* Card */}
        <div className="rounded-2xl p-8 border" style={{ background: 'rgba(26,26,46,0.8)', borderColor: 'rgba(255,107,53,0.12)', backdropFilter: 'blur(20px)', boxShadow: '0 0 60px rgba(255,107,53,0.06)' }}>
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg, #FF6B35, #E8478C)', boxShadow: '0 0 30px rgba(255,107,53,0.3)' }}>
              <Shield size={30} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: '#FFFFFF' }}>Sentinel</h1>
            <p className="text-sm" style={{ color: '#8B8FA3' }}>
              {forgotMode ? 'Reset your password' : 'Sign in to your SOC dashboard'}
            </p>
          </div>

          {!forgotMode ? (
            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(255,76,76,0.1)', border: '1px solid rgba(255,76,76,0.3)', color: '#FF4C4C' }}>
                  <AlertCircle size={15} />
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="splunk-subheader">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#8B8FA3' }} />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="analyst@company.io"
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: '#FFFFFF',
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = 'rgba(255,107,53,0.4)'}
                    onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="splunk-subheader">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#8B8FA3' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-12 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: '#FFFFFF',
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = 'rgba(255,107,53,0.4)'}
                    onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
                    style={{ color: '#8B8FA3' }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div className="w-4 h-4 rounded border flex items-center justify-center" style={{ borderColor: 'rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.04)' }}>
                  </div>
                  <span className="text-xs" style={{ color: '#8B8FA3' }}>Remember device</span>
                </label>
                <button
                  type="button"
                  onClick={() => setForgotMode(true)}
                  className="text-xs hover:opacity-80 transition-opacity"
                  style={{ color: '#FF6B35' }}
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-medium text-white transition-all hover:opacity-90 disabled:opacity-70 flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #FF6B35, #E8478C)', boxShadow: '0 0 30px rgba(255,107,53,0.2)' }}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Shield size={16} />
                    Sign In to Dashboard
                  </>
                )}
              </button>

              <div className="pt-2 pb-1 px-4 rounded-xl text-xs text-center" style={{ background: 'rgba(255,107,53,0.05)', border: '1px solid rgba(255,107,53,0.1)', color: '#8B8FA3' }}>
                Demo: Enter any password to log in
              </div>
            </form>
          ) : (
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="splunk-subheader">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#8B8FA3' }} />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#FFFFFF' }}
                  />
                </div>
              </div>
              <button
                className="w-full py-3.5 rounded-xl font-medium text-white"
                style={{ background: 'linear-gradient(135deg, #FF6B35, #E8478C)' }}
              >
                Send Reset Link
              </button>
              <button
                onClick={() => setForgotMode(false)}
                className="w-full text-sm text-center hover:opacity-80 transition-opacity"
                style={{ color: '#8B8FA3' }}
              >
                Back to sign in
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-xs mt-6" style={{ color: '#8B8FA3' }}>
          Protected by Sentinel · End-to-end encrypted
        </p>
      </motion.div>
    </div>
  );
}
