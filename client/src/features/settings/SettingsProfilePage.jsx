import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSkillSwap } from '../../app/SkillSwapContext.jsx';
import {
  User,
  Settings,
  Bell,
  Shield,
  Link as LinkIcon,
  LogOut,
  Camera,
  Check,
  Save,
  Sparkles,
  Upload,
  RefreshCw,
  AlertCircle,
  Trash2
} from 'lucide-react';
import { firebaseLoginWithGoogle, formatFirebaseError } from '../../lib/firebase.js';

export const SettingsProfilePage = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser, addToast, resetEntireDatabaseAndState } = useSkillSwap();

  const [activeSection, setActiveSection] = useState('profile'); // 'profile' | 'skills' | 'availability' | 'notifications' | 'privacy' | 'accounts'

  // Profile fields
  const [name, setName] = useState(currentUser.name || '');
  const [college, setCollege] = useState(currentUser.college || '');
  const [branch, setBranch] = useState(currentUser.branch || '');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [avatar, setAvatar] = useState(currentUser.avatar || '');
  const [isFetchingGoogle, setIsFetchingGoogle] = useState(false);
  const fileInputRef = useRef(null);

  // Notifications toggles
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [notifCircle, setNotifCircle] = useState(true);
  const [notifSound, setNotifSound] = useState(false);

  // Privacy toggles
  const [campusOnly, setCampusOnly] = useState(true);
  const [showRating, setShowRating] = useState(true);
  const [activityStatus, setActivityStatus] = useState(true);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('Invalid file format. Please upload an image.', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      addToast('File too large (max 5MB limit).', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setAvatar(dataUrl);
      setCurrentUser(prev => ({ ...prev, avatar: dataUrl, photoSource: 'upload' }));
      addToast(`Profile photo updated from device (${file.name})! 📸`, 'success');
    };
    reader.onerror = () => {
      addToast('Error reading image file.', 'error');
    };
    reader.readAsDataURL(file);
  };

  const handleFetchGooglePhoto = async () => {
    setIsFetchingGoogle(true);
    try {
      const cred = await firebaseLoginWithGoogle();
      const fbUser = cred.user;
      if (fbUser?.photoURL) {
        setAvatar(fbUser.photoURL);
        setCurrentUser(prev => ({
          ...prev,
          avatar: fbUser.photoURL,
          photoSource: 'gmail',
          email: fbUser.email || prev.email
        }));
        addToast(`Fetched Gmail profile photo from ${fbUser.email}! 📸`, 'success');
      } else {
        addToast('No profile photo found on this Google account. Please upload from device.', 'info');
      }
    } catch (err) {
      const msg = formatFirebaseError(err);
      if (err.code !== 'auth/popup-closed-by-user') {
        addToast(msg, 'error');
      }
    } finally {
      setIsFetchingGoogle(false);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setCurrentUser(prev => ({
      ...prev,
      name,
      college,
      branch,
      bio,
      avatar
    }));
    addToast('Profile changes saved successfully! ✨', 'success');
  };

  const handleLogout = () => {
    if (window.confirm('Log out of SkillSwap?')) {
      addToast('Logged out. See you next time!', 'info');
      navigate('/login');
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
            transform: 'rotate(-1deg)',
            boxShadow: '0 8px 16px rgba(0,0,0,0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '1rem' }}>📌</span>
            <span style={{ fontFamily: 'var(--font-dela)', fontSize: '0.82rem', color: '#854D0E' }}>
              CAMPUS STUDENT PASSPORT &amp; SETTINGS • CUSTOMIZE YOUR PEER IDENTITY
            </span>
          </div>
        </div>

        {/* Notebook Binder Sheet */}
        <div className="notebook-sheet" style={{ padding: '44px 38px 54px 44px' }}>
          
          {/* Chrome Binder Clip at Top */}
          <div className="binder-clip-top" />

          {/* Header */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="sticker-badge sticker-badge-exp" style={{ fontSize: '0.78rem', padding: '4px 14px' }}>
                ACCOUNT SETTINGS ⚙️
              </span>
              <span style={{ fontFamily: 'var(--font-hand)', fontSize: '1.2rem', color: '#15803D', fontWeight: 700 }}>
                {currentUser.college} ✍️
              </span>
            </div>

            <h1 style={{ fontFamily: 'var(--font-dela)', fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)', color: '#1E3A8A' }}>
              MANAGE YOUR <span style={{ color: '#008744' }}>STUDENT PASSPORT</span>
            </h1>
            <p style={{ color: '#4B5563', fontSize: '0.95rem', marginTop: '4px' }}>
              Manage your verified profile, skills to teach/learn, availability, and privacy controls.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '24px'
          }}>
            {/* Navigation Tabs (Span 4) */}
            <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { id: 'profile', label: 'Edit Profile', icon: User },
                { id: 'skills', label: 'Skills & Mastery', icon: Sparkles },
                { id: 'availability', label: 'Availability & Mode', icon: Settings },
                { id: 'notifications', label: 'Notifications', icon: Bell },
                { id: 'privacy', label: 'Privacy & Security', icon: Shield },
                { id: 'accounts', label: 'Connected Accounts', icon: LinkIcon }
              ].map(sec => {
                const Icon = sec.icon;
                const isAct = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => setActiveSection(sec.id)}
                    style={{
                      padding: '13px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      border: isAct ? '2.5px solid #005a2d' : '2px solid #CBD5E1',
                      background: isAct ? '#008744' : '#FFFFFF',
                      color: isAct ? '#FFFFFF' : '#1E3A8A',
                      fontFamily: 'var(--font-titan)',
                      fontSize: '0.9rem',
                      letterSpacing: '0.02em',
                      boxShadow: isAct ? '0 4px 0 #005a2d' : '0 2px 4px rgba(0,0,0,0.04)',
                      textAlign: 'left',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Icon size={18} color={isAct ? '#FFFFFF' : '#1E3A8A'} />
                    <span>{sec.label}</span>
                  </button>
                );
              })}

              <div style={{ height: '2px', background: '#E2E8F0', margin: '8px 0' }} />

              <button
                type="button"
                onClick={handleLogout}
                style={{
                  padding: '12px 18px',
                  fontSize: '0.88rem',
                  fontFamily: 'var(--font-titan)',
                  color: '#DC2626',
                  background: '#FEF2F2',
                  border: '2px solid #FCA5A5',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}
              >
                <LogOut size={16} /> LOG OUT OF SKILLSWAP
              </button>

              <button
                type="button"
                onClick={() => {
                  if (window.confirm('⚠️ Are you sure you want to remove all database & app data and start completely fresh? This cannot be undone.')) {
                    resetEntireDatabaseAndState();
                    navigate('/onboarding');
                  }
                }}
                style={{
                  padding: '12px 18px',
                  fontSize: '0.84rem',
                  fontFamily: 'var(--font-titan)',
                  color: '#991B1B',
                  background: '#FEE2E2',
                  border: '2px solid #EF4444',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  boxShadow: '0 3px 0 #991B1B',
                  marginTop: '4px'
                }}
              >
                <Trash2 size={16} /> RESET ALL DATA (START FRESH)
              </button>
            </div>

            {/* Content Pane (Span 8) */}
            <div style={{ gridColumn: 'span 8' }}>
              {/* PROFILE SECTION */}
              {activeSection === 'profile' && (
                <div style={{
                  background: '#FFFFFF',
                  border: '3px solid #1E3A8A',
                  borderRadius: '12px',
                  padding: '30px',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.08), 0 4px 0 #1E3A8A'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                    <h2 style={{ fontFamily: 'var(--font-titan)', fontSize: '1.4rem', color: '#1E3A8A' }}>
                      EDIT PROFILE INFORMATION
                    </h2>
                    <span style={{ fontSize: '1.2rem' }}>📸</span>
                  </div>

                  {/* Hidden file input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />

                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px', flexWrap: 'wrap' }}>
                    <div className="polaroid-card" style={{ width: '100px', padding: '6px 6px 16px 6px', transform: 'rotate(-2deg)' }}>
                      <div className="pushpin-3d pushpin-red" style={{ top: '-8px', left: '40%' }} />
                      <div style={{ width: '100%', height: '90px', borderRadius: '2px', overflow: 'hidden', background: '#111' }}>
                        <img src={avatar || currentUser.avatar} alt={currentUser.name || 'User Profile'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          style={{
                            padding: '9px 18px',
                            background: '#008744',
                            border: '2px solid #005a2d',
                            color: '#FFF',
                            borderRadius: '6px',
                            fontFamily: 'var(--font-titan)',
                            fontSize: '0.82rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: '0 3px 0 #005a2d',
                            cursor: 'pointer'
                          }}
                        >
                          <Upload size={14} /> Upload from Device
                        </button>

                        <button
                          type="button"
                          onClick={handleFetchGooglePhoto}
                          disabled={isFetchingGoogle}
                          style={{
                            padding: '9px 16px',
                            background: '#F8FAFC',
                            border: '2px solid #CBD5E1',
                            borderRadius: '6px',
                            color: '#1E293B',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer'
                          }}
                        >
                          {isFetchingGoogle ? (
                            <><RefreshCw size={14} className="animate-spin" /> Fetching...</>
                          ) : (
                            <>
                              <svg width="14" height="14" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z" />
                                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24Z" />
                                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15Z" />
                                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z" />
                              </svg>
                              Fetch from Google/Gmail
                            </>
                          )}
                        </button>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                        JPG, PNG or GIF up to 5MB • Compulsory profile photo
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', color: '#334155', marginBottom: '5px', fontWeight: 700 }}>
                        Display Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          background: '#F8FAFC',
                          border: '2px solid #CBD5E1',
                          borderRadius: '6px',
                          color: '#0F172A',
                          fontSize: '0.9rem',
                          fontWeight: 500,
                          outline: 'none'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', color: '#334155', marginBottom: '5px', fontWeight: 700 }}>
                        College / Campus
                      </label>
                      <input
                        type="text"
                        value={college}
                        onChange={e => setCollege(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          background: '#F8FAFC',
                          border: '2px solid #CBD5E1',
                          borderRadius: '6px',
                          color: '#0F172A',
                          fontSize: '0.9rem',
                          fontWeight: 500,
                          outline: 'none'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', color: '#334155', marginBottom: '5px', fontWeight: 700 }}>
                        Branch &amp; Year
                      </label>
                      <input
                        type="text"
                        value={branch}
                        onChange={e => setBranch(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          background: '#F8FAFC',
                          border: '2px solid #CBD5E1',
                          borderRadius: '6px',
                          color: '#0F172A',
                          fontSize: '0.9rem',
                          fontWeight: 500,
                          outline: 'none'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', color: '#334155', marginBottom: '5px', fontWeight: 700 }}>
                        Bio
                      </label>
                      <textarea
                        value={bio}
                        onChange={e => setBio(e.target.value)}
                        rows={3}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          background: '#F8FAFC',
                          border: '2px solid #CBD5E1',
                          borderRadius: '6px',
                          color: '#0F172A',
                          fontSize: '0.9rem',
                          fontWeight: 500,
                          outline: 'none',
                          resize: 'none'
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                      <button
                        type="submit"
                        style={{
                          padding: '12px 24px',
                          background: '#008744',
                          border: '3px solid #005a2d',
                          borderRadius: '6px',
                          color: '#FFF',
                          fontFamily: 'var(--font-titan)',
                          fontSize: '0.95rem',
                          boxShadow: '0 4px 0 #005a2d',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <Save size={16} /> SAVE CHANGES
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* SKILLS SECTION */}
              {activeSection === 'skills' && (
                <div style={{
                  background: '#FFFFFF',
                  border: '3px solid #1E3A8A',
                  borderRadius: '12px',
                  padding: '30px',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.08), 0 4px 0 #1E3A8A'
                }}>
                  <h2 style={{ fontFamily: 'var(--font-titan)', fontSize: '1.4rem', color: '#1E3A8A', marginBottom: '20px' }}>
                    MANAGE YOUR SKILLS &amp; MASTERY
                  </h2>

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#15803D', marginBottom: '10px', fontWeight: 800 }}>
                      Skills You Can Teach
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {currentUser.teaching.map(sk => (
                        <span key={sk} className="ripped-tag ripped-green" style={{ cursor: 'pointer' }}>
                          ✓ {sk} ✕
                        </span>
                      ))}
                      <button
                        onClick={() => addToast('Added new teaching skill!', 'success')}
                        className="sticker-badge sticker-badge-exp"
                        style={{ fontSize: '0.78rem', padding: '4px 12px' }}
                      >
                        + Add More
                      </button>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#1D4ED8', marginBottom: '10px', fontWeight: 800 }}>
                      Skills You Want to Learn
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {currentUser.learning.map(sk => (
                        <span key={sk} className="ripped-tag ripped-blue" style={{ cursor: 'pointer' }}>
                          🎯 {sk} ✕
                        </span>
                      ))}
                      <button
                        onClick={() => addToast('Added new learning goal!', 'success')}
                        className="sticker-badge sticker-badge-cert"
                        style={{ fontSize: '0.78rem', padding: '4px 12px' }}
                      >
                        + Add More
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* NOTIFICATIONS SECTION */}
              {activeSection === 'notifications' && (
                <div style={{
                  background: '#FFFFFF',
                  border: '3px solid #1E3A8A',
                  borderRadius: '12px',
                  padding: '30px',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.08), 0 4px 0 #1E3A8A'
                }}>
                  <h2 style={{ fontFamily: 'var(--font-titan)', fontSize: '1.4rem', color: '#1E3A8A', marginBottom: '20px' }}>
                    NOTIFICATION PREFERENCES
                  </h2>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 800, color: '#0F172A' }}>Email Notifications</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Get notified for swap invites &amp; session bookings</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifEmail}
                        onChange={e => setNotifEmail(e.target.checked)}
                        style={{ width: 22, height: 22, accentColor: '#008744', cursor: 'pointer' }}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 800, color: '#0F172A' }}>In-App Push Alerts</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Real-time chat messages and triangle formation updates</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifPush}
                        onChange={e => setNotifPush(e.target.checked)}
                        style={{ width: 22, height: 22, accentColor: '#008744', cursor: 'pointer' }}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 800, color: '#0F172A' }}>Skill Circle Broadcasts</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748B' }}>When your triangle completes a full circular loop</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifCircle}
                        onChange={e => setNotifCircle(e.target.checked)}
                        style={{ width: 22, height: 22, accentColor: '#008744', cursor: 'pointer' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* PRIVACY SECTION */}
              {activeSection === 'privacy' && (
                <div style={{
                  background: '#FFFFFF',
                  border: '3px solid #1E3A8A',
                  borderRadius: '12px',
                  padding: '30px',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.08), 0 4px 0 #1E3A8A'
                }}>
                  <h2 style={{ fontFamily: 'var(--font-titan)', fontSize: '1.4rem', color: '#1E3A8A', marginBottom: '20px' }}>
                    PRIVACY &amp; CAMPUS VISIBILITY
                  </h2>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 800, color: '#0F172A' }}>Verified Students Only</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Restrict swap visibility to verified .edu email holders</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={campusOnly}
                        onChange={e => setCampusOnly(e.target.checked)}
                        style={{ width: 22, height: 22, accentColor: '#008744', cursor: 'pointer' }}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 800, color: '#0F172A' }}>Public Reputation &amp; Reviews</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Display your 4.9 ★ rating and feedback on discovery</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={showRating}
                        onChange={e => setShowRating(e.target.checked)}
                        style={{ width: 22, height: 22, accentColor: '#008744', cursor: 'pointer' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* CONNECTED ACCOUNTS */}
              {activeSection === 'accounts' && (
                <div style={{
                  background: '#FFFFFF',
                  border: '3px solid #1E3A8A',
                  borderRadius: '12px',
                  padding: '30px',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.08), 0 4px 0 #1E3A8A'
                }}>
                  <h2 style={{ fontFamily: 'var(--font-titan)', fontSize: '1.4rem', color: '#1E3A8A', marginBottom: '20px' }}>
                    CONNECTED ACCOUNTS
                  </h2>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC', border: '1.5px solid #E2E8F0', padding: '14px', borderRadius: '8px' }}>
                      <div>
                        <div style={{ fontWeight: 800, color: '#0F172A' }}>Google Campus Auth (.edu)</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Connected as {currentUser.email}</div>
                      </div>
                      <span className="sticker-badge sticker-badge-exp" style={{ fontSize: '0.72rem', padding: '3px 10px' }}>Connected ✓</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC', border: '1.5px solid #E2E8F0', padding: '14px', borderRadius: '8px' }}>
                      <div>
                        <div style={{ fontWeight: 800, color: '#0F172A' }}>GitHub Integration</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Show repositories &amp; proof of work</div>
                      </div>
                      <button style={{ padding: '6px 14px', fontSize: '0.8rem', background: '#FFFFFF', border: '2px solid #CBD5E1', borderRadius: '6px', fontFamily: 'var(--font-titan)', color: '#1E293B', cursor: 'pointer' }}>
                        CONNECT GITHUB
                      </button>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC', border: '1.5px solid #E2E8F0', padding: '14px', borderRadius: '8px' }}>
                      <div>
                        <div style={{ fontWeight: 800, color: '#0F172A' }}>Discord Voice Hub</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Hop on study channels with peer swappers</div>
                      </div>
                      <button style={{ padding: '6px 14px', fontSize: '0.8rem', background: '#FFFFFF', border: '2px solid #CBD5E1', borderRadius: '6px', fontFamily: 'var(--font-titan)', color: '#1E293B', cursor: 'pointer' }}>
                        CONNECT DISCORD
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
