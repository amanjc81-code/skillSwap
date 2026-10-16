import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSkillSwap } from '../../app/SkillSwapContext.jsx';
import {
  ArrowRightLeft,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Zap,
  RefreshCw
} from 'lucide-react';
import { firebaseLoginWithGoogle, formatFirebaseError } from '../../lib/firebase.js';

export const SignupPage = () => {
  const navigate = useNavigate();
  const { setCurrentUser, addToast } = useSkillSwap();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Password strength logic
  const getPasswordStrength = () => {
    if (!password) return { score: 0, text: 'Enter password', color: 'var(--text-muted)' };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { score: 25, text: 'Weak', color: '#EF4444' };
    if (score === 2) return { score: 50, text: 'Fair', color: '#F59E0B' };
    if (score === 3) return { score: 75, text: 'Good', color: 'var(--cyan)' };
    return { score: 100, text: 'Super Strong 🔥', color: 'var(--lime)' };
  };

  const strength = getPasswordStrength();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please provide your full name');
      return;
    }
    if (!email.includes('@')) {
      setError('Please use a valid college or student email (.edu)');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCurrentUser(prev => ({
        ...prev,
        name,
        email,
        handle: '@' + name.toLowerCase().replace(/[\s\W]+/g, '_'),
        avatar: '', // Clear avatar so onboarding Step 2 compels photo upload!
        photoSource: null
      }));
      addToast('Welcome to SkillSwap! Next up: Upload your compulsory student photo 🔥', 'success');
      navigate('/onboarding');
    }, 600);
  };

  const handleGoogleAuth = async () => {
    setError('');
    setIsLoading(true);
    try {
      const cred = await firebaseLoginWithGoogle();
      const fbUser = cred.user;
      const photo = fbUser?.photoURL || '';
      const displayName = fbUser?.displayName || name || 'Student';
      const googleEmail = fbUser?.email || email;

      setCurrentUser(prev => ({
        ...prev,
        name: displayName,
        email: googleEmail,
        handle: '@' + displayName.toLowerCase().replace(/[\s\W]+/g, '_'),
        avatar: photo,
        photoSource: photo ? 'gmail' : null
      }));

      if (photo) {
        addToast(`Google connected! Auto-fetched photo from ${googleEmail} 📸`, 'success');
      } else {
        addToast(`Connected as ${displayName}! Step 2: Upload your compulsory photo ⚡`, 'info');
      }
      navigate('/onboarding');
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
      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative' }}>
        
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
              CAMPUS PEER-TO-PEER REGISTRATION • ZERO MONEY. 100% SKILL EXCHANGE.
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
            {/* Left Column: Scrapbook Pitch & Post-it Notes */}
            <div style={{ gridColumn: 'span 6' }}>
              <div style={{ marginBottom: '14px' }}>
                <span className="sticker-badge sticker-badge-exp" style={{ fontSize: '0.8rem', padding: '4px 14px' }}>
                  JOIN 2,400+ SWAPPERS ⚡
                </span>
              </div>

              <h1 style={{
                fontFamily: 'var(--font-dela)',
                fontSize: 'clamp(2rem, 3.8vw, 3rem)',
                color: '#1E3A8A',
                lineHeight: 1.1,
                marginBottom: '14px'
              }}>
                YOUR NEXT SKILL <span style={{ color: '#008744' }}>BESTIE</span> IS WAITING.
              </h1>

              <p style={{ color: '#374151', fontSize: '1rem', lineHeight: 1.6, marginBottom: '24px' }}>
                Trade Python for SQL, React for UI/UX, or form 3-person Triangle Skill Circles.
                Exclusively made for college peers.
              </p>

              {/* Realistic Yellow Post-it Note */}
              <div className="yellow-postit" style={{ transform: 'rotate(-2deg)', marginBottom: '28px', maxWidth: '420px' }}>
                <div className="pushpin-3d pushpin-red" style={{ top: '-10px', left: '46%' }} />
                <div style={{ fontFamily: 'var(--font-marker)', fontSize: '1.05rem', color: '#1E3A8A', marginBottom: '6px' }}>
                  CAMPUS RULE #1:
                </div>
                <div style={{ fontFamily: 'var(--font-hand)', fontSize: '1.25rem', color: '#1C1917', lineHeight: 1.3, fontWeight: 700 }}>
                  "Teach what you know, learn what you love. No money, no tutors — just students helping students."
                </div>
              </div>

              {/* Ripped Skill Tape Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                <span className="ripped-tag ripped-blue">⚛️ React</span>
                <span className="ripped-tag ripped-yellow">🗄️ SQL</span>
                <span className="ripped-tag ripped-pink">🐍 Python</span>
                <span className="ripped-tag ripped-green">🎨 Figma</span>
                <span className="ripped-tag ripped-blue">🎬 Video Edit</span>
              </div>

              {/* Verified Shield Pill */}
              <div style={{
                background: '#ECFDF5',
                border: '2px solid #059669',
                borderRadius: '8px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                maxWidth: '440px'
              }}>
                <ShieldCheck size={24} color="#059669" />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#065F46' }}>
                    Safe &amp; Verified Campus Network
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#047857' }}>
                    Requires verified student photo &amp; college credentials.
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Physical Paper Card Form */}
            <div style={{ gridColumn: 'span 6' }}>
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
                      CREATE ACCOUNT
                    </h2>
                    <span style={{ fontSize: '1.3rem' }}>✍️</span>
                  </div>
                  <p style={{ color: '#6B7280', fontSize: '0.88rem', marginTop: '2px' }}>
                    Already swapping? <Link to="/login" style={{ color: '#008744', fontWeight: 800 }}>Log in here ➔</Link>
                  </p>
                </div>

                {/* Continue with Google */}
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '13px',
                    fontSize: '0.92rem',
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
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

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '16px 0' }}>
                  <div style={{ flex: 1, height: '1.5px', background: '#E2E8F0' }} />
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 800 }}>OR EMAIL SIGNUP</span>
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
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Enter your full name"
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
                      {password && (
                        <span style={{ fontSize: '0.75rem', color: strength.color, fontWeight: 800 }}>
                          {strength.text}
                        </span>
                      )}
                    </div>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Min 6 characters..."
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

                    {password && (
                      <div style={{ width: '100%', height: '4px', background: '#E2E8F0', borderRadius: '2px', marginTop: '6px', overflow: 'hidden' }}>
                        <div style={{
                          width: `${strength.score}%`,
                          height: '100%',
                          background: strength.color,
                          transition: 'all 0.3s ease'
                        }} />
                      </div>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: '#334155', marginBottom: '5px', fontWeight: 700 }}>
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
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
                    {isLoading ? 'Creating Account...' : (
                      <>SIGN UP &amp; SET PROFILE <ArrowRight size={18} /></>
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
