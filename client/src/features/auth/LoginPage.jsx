import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSkillSwap } from '../../app/SkillSwapContext.jsx';
import {
  ArrowRightLeft,
  Sparkles,
  Zap,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw
} from 'lucide-react';
import { firebaseLoginWithGoogle, formatFirebaseError } from '../../lib/firebase.js';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser, addToast } = useSkillSwap();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      addToast(`Welcome back, ${currentUser.name || 'Student'}! Ready to level up 🚀`, 'success');
      navigate('/dashboard');
    }, 700);
  };

  const handleDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      addToast(`Logged in as ${currentUser.name || 'Student'} ⚡`, 'success');
      navigate('/dashboard');
    }, 500);
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      const cred = await firebaseLoginWithGoogle();
      const fbUser = cred.user;
      const photo = fbUser?.photoURL || '';
      const displayName = fbUser?.displayName || 'Student';
      const googleEmail = fbUser?.email || '';

      setCurrentUser(prev => ({
        ...prev,
        name: displayName || prev.name,
        email: googleEmail || prev.email,
        handle: '@' + displayName.toLowerCase().replace(/[\s\W]+/g, '_'),
        avatar: photo || prev.avatar,
        photoSource: photo ? 'gmail' : prev.photoSource
      }));

      if (photo) {
        addToast(`Welcome back, ${displayName}! Auto-fetched your Gmail photo 📸`, 'success');
      } else {
        addToast(`Welcome back, ${displayName}! Logged in via Google ⚡`, 'success');
      }
      navigate('/dashboard');
    } catch (err) {
      const msg = formatFirebaseError(err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(msg);
        addToast(msg, 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="scrapbook-desk">
      <div style={{ maxWidth: '1050px', margin: '0 auto', position: 'relative' }}>
        
        {/* Top Zine Badge */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <div style={{
            background: '#FEF08A',
            border: '2px solid #EAB308',
            borderRadius: '4px',
            padding: '6px 18px',
            transform: 'rotate(-1.5deg)',
            boxShadow: '0 8px 16px rgba(0,0,0,0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '1rem' }}>📌</span>
            <span style={{ fontFamily: 'var(--font-dela)', fontSize: '0.82rem', color: '#854D0E' }}>
              CAMPUS STUDENT LOGIN • RETURN TO YOUR ONGOING PEER SWAPS
            </span>
          </div>
        </div>

        {/* Notebook Binder Sheet */}
        <div className="notebook-sheet" style={{ padding: '48px 40px 60px 48px' }}>
          
          {/* Chrome Binder Clip at Top */}
          <div className="binder-clip-top" />

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '36px',
            alignItems: 'center'
          }}>
            {/* Left Column: Branding, Polaroid & Pulse Post-It */}
            <div className="auth-pitch-col" style={{ gridColumn: 'span 6' }}>
              <div style={{ marginBottom: '14px' }}>
                <span className="sticker-badge sticker-badge-exp" style={{ fontSize: '0.8rem', padding: '4px 14px' }}>
                  LEVEL UP TOGETHER ⚡
                </span>
              </div>

              <h1 style={{
                fontFamily: 'var(--font-dela)',
                fontSize: 'clamp(2rem, 3.8vw, 3rem)',
                color: '#1E3A8A',
                lineHeight: 1.1,
                marginBottom: '14px'
              }}>
                WELCOME BACK TO YOUR <span style={{ color: '#008744' }}>SKILL HUB</span>.
              </h1>

              <p style={{ color: '#374151', fontSize: '1rem', lineHeight: 1.6, marginBottom: '24px' }}>
                Pick up where you left off. Upcoming SQL sessions, pending triangle circles, and direct peer chats are waiting for you.
              </p>

              {/* Tilted Polaroid & Post-It Cluster */}
              <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: '20px' }}>
                {/* Polaroid Preview */}
                <div className="polaroid-card" style={{ width: '150px', transform: 'rotate(-3deg)' }}>
                  <div className="pushpin-3d pushpin-red" style={{ top: '-10px', left: '42%' }} />
                  <div style={{ width: '100%', height: '130px', background: '#111', borderRadius: '2px', overflow: 'hidden' }}>
                    <img
                      src={currentUser.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80"}
                      alt="Student"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ marginTop: '6px', fontFamily: 'var(--font-hand)', fontSize: '0.95rem', color: '#15803D', fontWeight: 700, textAlign: 'center' }}>
                    {currentUser.name || 'Campus Student'} ⚡
                  </div>
                </div>

                {/* Yellow Post-it Note: Campus Pulse */}
                <div className="yellow-postit" style={{ flex: 1, minWidth: '190px', transform: 'rotate(2deg)' }}>
                  <div className="pushpin-3d pushpin-yellow" style={{ top: '-8px', right: '14px' }} />
                  <div style={{ fontFamily: 'var(--font-marker)', fontSize: '0.9rem', color: '#1E3A8A', marginBottom: '4px' }}>
                    CAMPUS PULSE 📈
                  </div>
                  <div style={{ fontSize: '1.4rem', fontFamily: 'var(--font-dela)', color: '#008744', lineHeight: 1 }}>
                    18 Swaps
                  </div>
                  <div style={{ fontFamily: 'var(--font-hand)', fontSize: '1.15rem', color: '#374151', marginTop: '4px', fontWeight: 700 }}>
                    Active across college labs &amp; study pods today!
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Physical Paper Login Card */}
            <div className="auth-card-col" style={{ gridColumn: 'span 6' }}>
              <div style={{
                background: '#FFFFFF',
                border: '3px solid #1E3A8A',
                borderRadius: '12px',
                padding: '36px 32px',
                boxShadow: '0 16px 32px rgba(0, 0, 0, 0.15), 0 6px 0 #1E3A8A'
              }}>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontFamily: 'var(--font-titan)', fontSize: '1.8rem', color: '#1E3A8A', letterSpacing: '0.02em' }}>
                      STUDENT LOGIN
                    </h2>
                    <span style={{ fontSize: '1.3rem' }}>🔐</span>
                  </div>
                  <p style={{ color: '#6B7280', fontSize: '0.88rem', marginTop: '2px' }}>
                    New to SkillSwap? <Link to="/signup" style={{ color: '#008744', fontWeight: 800 }}>Create account here ➔</Link>
                  </p>
                </div>

                {/* Quick Demo One-Click Login */}
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '0.9rem',
                    fontFamily: 'var(--font-titan)',
                    background: '#FDE047',
                    border: '2.5px solid #15803D',
                    color: '#15803D',
                    borderRadius: '8px',
                    boxShadow: '0 4px 0 #15803D',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginBottom: '14px',
                    letterSpacing: '0.03em'
                  }}
                >
                  <Zap size={16} /> QUICK SIGN IN AS REGISTERED STUDENT
                </button>

                {/* Google Auth with Gmail Profile Photo Auto-Fetch */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '0.9rem',
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    background: '#F8FAFC',
                    border: '2px solid #CBD5E1',
                    borderRadius: '8px',
                    color: '#1E293B',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
                    marginBottom: '18px'
                  }}
                >
                  {isLoading ? (
                    <><RefreshCw size={18} className="animate-spin" /> Connecting to Google...</>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z" />
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24Z" />
                        <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15Z" />
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z" />
                      </svg>
                      Continue with Google (.edu)
                    </>
                  )}
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '14px 0' }}>
                  <div style={{ flex: 1, height: '1.5px', background: '#E2E8F0' }} />
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 800 }}>OR EMAIL LOGIN</span>
                  <div style={{ flex: 1, height: '1.5px', background: '#E2E8F0' }} />
                </div>

                {error && (
                  <div style={{
                    background: '#FEF2F2',
                    border: '1.5px solid #F87171',
                    borderRadius: '6px',
                    padding: '10px 14px',
                    fontSize: '0.85rem',
                    color: '#B91C1C',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '16px'
                  }}>
                    <AlertCircle size={16} color="#DC2626" /> {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: '#334155', marginBottom: '5px', fontWeight: 700 }}>
                      College Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="yourname@campus.edu"
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        background: '#F8FAFC',
                        border: '2px solid #CBD5E1',
                        borderRadius: '6px',
                        color: '#0F172A',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        outline: 'none'
                      }}
                      required
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                      <label style={{ fontSize: '0.82rem', color: '#334155', fontWeight: 700 }}>
                        Password
                      </label>
                      <a href="#forgot" onClick={(e) => { e.preventDefault(); addToast('Reset link sent to your college inbox!', 'info'); }} style={{ fontSize: '0.78rem', color: '#008744', fontWeight: 700 }}>
                        Forgot password?
                      </a>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Your password"
                        style={{
                          width: '100%',
                          padding: '11px 44px 11px 14px',
                          background: '#F8FAFC',
                          border: '2px solid #CBD5E1',
                          borderRadius: '6px',
                          color: '#0F172A',
                          fontSize: '0.9rem',
                          fontWeight: 500,
                          outline: 'none'
                        }}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: '#64748B'
                        }}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: '#008744',
                      border: '3px solid #005a2d',
                      borderRadius: '8px',
                      color: '#FFFFFF',
                      fontFamily: 'var(--font-titan)',
                      fontSize: '1rem',
                      letterSpacing: '0.04em',
                      boxShadow: '0 5px 0 #005a2d',
                      cursor: 'pointer',
                      marginTop: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    {isLoading ? 'Verifying...' : (
                      <>LOG IN TO SKILLSWAP <ArrowRight size={18} /></>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
