import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSkillSwap } from '../../app/SkillSwapContext.jsx';
import {
  Sparkles,
  Search,
  Bell,
  ArrowRightLeft,
  Triangle,
  MessageSquare,
  Calendar,
  Compass,
  Inbox,
  User,
  Settings,
  LogOut,
  ChevronDown,
  ExternalLink,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const Navbar = () => {
  const { currentUser, notifications, receivedRequests, deviceView, addToast } = useSkillSwap();
  const location = useLocation();
  const navigate = useNavigate();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const [avatarLoadError, setAvatarLoadError] = useState(false);

  const unreadCount = notifications?.filter(n => n.unread)?.length || 0;
  const pendingRequestsCount = receivedRequests?.filter(r => r.status === 'Pending')?.length || 0;

  // Don't show top navbar navigation links on auth or onboarding
  const isAuthPage = ['/signup', '/login', '/onboarding'].includes(location.pathname);

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setIsProfileMenuOpen(false);
  }, [location.pathname]);

  const handleNavigate = (path) => {
    setIsProfileMenuOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    setIsProfileMenuOpen(false);
    addToast('Logged out of session. See you next swap! 👋', 'info');
    navigate('/login');
  };

  return (
    <header className="app-navbar-header" style={{
      height: 'var(--top-nav-height)',
      borderBottom: '2px solid rgba(0, 135, 68, 0.4)',
      background: 'rgba(14, 44, 30, 0.96)',
      backdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      flexShrink: 0,
      boxShadow: '0 4px 20px rgba(0,0,0,0.35)'
    }}>
      <div style={{
        maxWidth: '1360px',
        width: '100%',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '8px',
            background: '#008744',
            border: '2px solid #005a2d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 0 #005a2d'
          }}>
            <ArrowRightLeft size={20} color="#FFFFFF" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="navbar-brand-title" style={{ fontFamily: 'var(--font-dela)', fontWeight: 800, fontSize: '1.25rem', letterSpacing: '0.02em', color: '#FFF' }}>
              SKILL<span style={{ color: '#FACC15' }}>SWAP</span>
            </span>
            <span className="navbar-brand-subtitle" style={{ fontSize: '0.65rem', color: '#A7F3D0', fontFamily: 'var(--font-hand)', fontWeight: 700, marginTop: '-4px' }}>
              Campus Zine & Peer Learning ✍️
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links (Only shown when not auth page and not in mobile sim view) */}
        {!isAuthPage && deviceView !== 'mobile-sim' && (
          <nav className="desktop-nav-links" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(0, 0, 0, 0.25)',
            padding: '6px 10px',
            borderRadius: '9999px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <Link
              to="/dashboard"
              style={{
                padding: '7px 16px',
                borderRadius: '9999px',
                fontSize: '0.84rem',
                fontFamily: 'var(--font-titan)',
                letterSpacing: '0.04em',
                color: location.pathname === '/dashboard' ? '#FFF' : '#D1D5DB',
                background: location.pathname === '/dashboard' ? '#008744' : 'transparent',
                border: location.pathname === '/dashboard' ? '2px solid #005a2d' : '2px solid transparent',
                boxShadow: location.pathname === '/dashboard' ? '0 3px 0 #005a2d' : 'none',
                textDecoration: 'none'
              }}
            >
              DASHBOARD
            </Link>

            <Link
              to="/match"
              style={{
                padding: '7px 16px',
                borderRadius: '9999px',
                fontSize: '0.84rem',
                fontFamily: 'var(--font-titan)',
                letterSpacing: '0.04em',
                color: location.pathname === '/match' ? '#FFF' : '#D1D5DB',
                background: location.pathname === '/match' ? '#1E3A8A' : 'transparent',
                border: location.pathname === '/match' ? '2px solid #172554' : '2px solid transparent',
                boxShadow: location.pathname === '/match' ? '0 3px 0 #172554' : 'none',
                textDecoration: 'none'
              }}
            >
              FIND MATCH (1:1)
            </Link>

            <Link
              to="/circle/details"
              style={{
                padding: '7px 16px',
                borderRadius: '9999px',
                fontSize: '0.84rem',
                fontFamily: 'var(--font-titan)',
                letterSpacing: '0.04em',
                color: location.pathname.startsWith('/circle') ? '#18181B' : '#D1D5DB',
                background: location.pathname.startsWith('/circle') ? '#FACC15' : 'transparent',
                border: location.pathname.startsWith('/circle') ? '2px solid #CA8A04' : '2px solid transparent',
                boxShadow: location.pathname.startsWith('/circle') ? '0 3px 0 #CA8A04' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                textDecoration: 'none'
              }}
            >
              <Triangle size={13} fill="currentColor" /> SKILL CIRCLES
            </Link>

            <Link
              to="/sessions"
              style={{
                padding: '7px 16px',
                borderRadius: '9999px',
                fontSize: '0.84rem',
                fontFamily: 'var(--font-titan)',
                letterSpacing: '0.04em',
                color: location.pathname === '/sessions' ? '#FFF' : '#D1D5DB',
                background: location.pathname === '/sessions' ? '#EA580C' : 'transparent',
                border: location.pathname === '/sessions' ? '2px solid #C2410C' : '2px solid transparent',
                boxShadow: location.pathname === '/sessions' ? '0 3px 0 #C2410C' : 'none',
                textDecoration: 'none'
              }}
            >
              SESSIONS
            </Link>

            <Link
              to="/profile"
              style={{
                padding: '7px 16px',
                borderRadius: '9999px',
                fontSize: '0.84rem',
                fontFamily: 'var(--font-titan)',
                letterSpacing: '0.04em',
                color: location.pathname === '/profile' ? '#FFF' : '#D1D5DB',
                background: location.pathname === '/profile' ? '#0284C7' : 'transparent',
                border: location.pathname === '/profile' ? '2px solid #0369A1' : '2px solid transparent',
                boxShadow: location.pathname === '/profile' ? '0 3px 0 #0369A1' : 'none',
                textDecoration: 'none'
              }}
            >
              MY ZINE
            </Link>
          </nav>
        )}

        {/* Right Action Icons & Interactive Profile Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          {!isAuthPage && (
            <>
              {/* Quick Search (Only on desktop full-width) */}
              {deviceView !== 'mobile-sim' && (
                <div
                  onClick={() => navigate('/match')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    padding: '7px 14px',
                    borderRadius: 'var(--radius-full)',
                    color: '#D1D5DB',
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                  className="desktop-search-trigger"
                >
                  <Search size={15} />
                  <span>Search skills...</span>
                  <span style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.08)', padding: '2px 6px', borderRadius: '4px' }}>⌘K</span>
                </div>
              )}

              {/* Chat Icon */}
              <Link
                to="/chat"
                title="Direct Messages"
                style={{
                  position: 'relative',
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: location.pathname === '/chat' ? 'rgba(34, 211, 238, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                  border: location.pathname === '/chat' ? '2px solid var(--cyan)' : '1px solid rgba(255, 255, 255, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: location.pathname === '/chat' ? 'var(--cyan)' : '#E5E7EB',
                  textDecoration: 'none',
                  cursor: 'pointer'
                }}
              >
                <MessageSquare size={17} />
              </Link>

              {/* Notifications with Red Dot */}
              <Link
                to="/notifications"
                title="Notifications Bulletin"
                style={{
                  position: 'relative',
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: location.pathname === '/notifications' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                  border: location.pathname === '/notifications' ? '2px solid var(--violet)' : '1px solid rgba(255, 255, 255, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: location.pathname === '/notifications' ? 'var(--violet)' : '#E5E7EB',
                  textDecoration: 'none',
                  cursor: 'pointer'
                }}
              >
                <Bell size={17} />
                {unreadCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '6px',
                      right: '6px',
                      width: '9px',
                      height: '9px',
                      background: '#EF4444',
                      borderRadius: '50%',
                      boxShadow: '0 0 8px #EF4444'
                    }}
                  />
                )}
              </Link>

              {/* User Avatar with Tactile Profile Dropdown Trigger */}
              <div ref={profileMenuRef} style={{ position: 'relative' }}>
                <button
                  id="top-profile-btn"
                  onClick={() => setIsProfileMenuOpen(prev => !prev)}
                  title="Open User Profile & Settings"
                  aria-label="User Profile Menu"
                  aria-expanded={isProfileMenuOpen}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '3px 8px 3px 4px',
                    borderRadius: '9999px',
                    background: isProfileMenuOpen ? 'rgba(250, 204, 21, 0.18)' : 'rgba(255, 255, 255, 0.06)',
                    border: isProfileMenuOpen ? '2px solid #FACC15' : '2px solid rgba(255, 255, 255, 0.18)',
                    cursor: 'pointer',
                    boxShadow: isProfileMenuOpen ? '0 0 14px rgba(250, 204, 21, 0.45)' : '0 2px 6px rgba(0,0,0,0.2)',
                    transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                    outline: 'none'
                  }}
                >
                  {/* Avatar Icon / Picture */}
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #008744 0%, #005a2d 100%)',
                      border: '2px solid #FEF08A',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      position: 'relative',
                      flexShrink: 0
                    }}
                  >
                    {currentUser?.avatar && !avatarLoadError ? (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name || 'User Profile'}
                        onError={() => setAvatarLoadError(true)}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FEF08A',
                        fontWeight: 800,
                        fontFamily: 'var(--font-titan)',
                        fontSize: '0.9rem'
                      }}>
                        {currentUser?.name ? currentUser.name.trim().charAt(0).toUpperCase() : <User size={16} color="#FEF08A" />}
                      </div>
                    )}

                    {/* Online active indicator dot */}
                    <span style={{
                      position: 'absolute',
                      bottom: '0px',
                      right: '0px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#10B981',
                      border: '1.5px solid #0E2C1E'
                    }} />
                  </div>

                  {/* Dropdown Chevron */}
                  <ChevronDown
                    size={14}
                    color="#FEF08A"
                    style={{
                      transform: isProfileMenuOpen ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  />
                </button>

                {/* Tactile Scrapbook Profile Dropdown Menu */}
                {isProfileMenuOpen && (
                  <div
                    className="animate-pop-in"
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 12px)',
                      right: 0,
                      width: '285px',
                      maxWidth: 'calc(100vw - 24px)',
                      background: '#FBF8EE',
                      border: '2px solid #27272A',
                      borderRadius: '12px',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.6), 4px 5px 0px rgba(0,0,0,0.25)',
                      padding: '16px',
                      zIndex: 2000,
                      color: '#18181B'
                    }}
                  >
                    {/* Top tape sticker accent */}
                    <div style={{
                      position: 'absolute',
                      top: '-10px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '80px',
                      height: '18px',
                      background: 'rgba(254, 240, 138, 0.95)',
                      borderLeft: '2px dashed rgba(0, 0, 0, 0.2)',
                      borderRight: '2px dashed rgba(0, 0, 0, 0.2)',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }} />

                    {/* User Identity Card (Clicking opens /profile) */}
                    <div
                      onClick={() => handleNavigate('/profile')}
                      style={{
                        background: '#FEF9C3',
                        border: '2px solid #CA8A04',
                        boxShadow: '2px 2px 0px #CA8A04',
                        borderRadius: '10px',
                        padding: '12px',
                        cursor: 'pointer',
                        marginBottom: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        transition: 'transform 0.15s ease'
                      }}
                    >
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '50%',
                          background: '#008744',
                          border: '2px solid #005a2d',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          flexShrink: 0
                        }}
                      >
                        {currentUser?.avatar && !avatarLoadError ? (
                          <img
                            src={currentUser.avatar}
                            alt={currentUser.name || 'User Profile'}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <span style={{ color: '#FFF', fontWeight: 800, fontFamily: 'var(--font-titan)', fontSize: '1.05rem' }}>
                            {currentUser?.name ? currentUser.name.trim().charAt(0).toUpperCase() : 'U'}
                          </span>
                        )}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontWeight: 800,
                          fontSize: '0.92rem',
                          color: '#18181B',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {currentUser?.name || 'Student Explorer'}
                        </div>
                        <div style={{
                          fontSize: '0.72rem',
                          color: '#71717A',
                          fontFamily: 'var(--font-sans)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          @{currentUser?.handle || 'campus_learner'} • {currentUser?.college || 'Campus Member'}
                        </div>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          marginTop: '4px',
                          background: '#DCFCE7',
                          color: '#166534',
                          padding: '1px 7px',
                          borderRadius: '9999px',
                          fontSize: '0.66rem',
                          fontWeight: 700
                        }}>
                          <ShieldCheck size={11} /> {currentUser?.levelBadge || 'Campus Explorer 🌱'}
                        </div>
                      </div>
                    </div>

                    {/* Navigation Items List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {/* My Profile */}
                      <button
                        onClick={() => handleNavigate('/profile')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '9px 12px',
                          borderRadius: '8px',
                          border: '1px solid transparent',
                          background: location.pathname === '/profile' ? 'rgba(0, 135, 68, 0.12)' : 'transparent',
                          color: '#18181B',
                          fontWeight: 700,
                          fontSize: '0.88rem',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'background 0.12s ease'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.06)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = location.pathname === '/profile' ? 'rgba(0, 135, 68, 0.12)' : 'transparent'; }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                          <User size={16} color="#008744" />
                          <span>My Profile (Campus Zine)</span>
                        </div>
                        <span style={{ fontSize: '0.7rem', color: '#008744', fontWeight: 800 }}>VIEW ➔</span>
                      </button>

                      {/* Edit Profile & Settings */}
                      <button
                        onClick={() => handleNavigate('/settings')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '9px',
                          padding: '9px 12px',
                          borderRadius: '8px',
                          border: '1px solid transparent',
                          background: location.pathname === '/settings' ? 'rgba(0, 135, 68, 0.12)' : 'transparent',
                          color: '#18181B',
                          fontWeight: 700,
                          fontSize: '0.88rem',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'background 0.12s ease'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.06)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = location.pathname === '/settings' ? 'rgba(0, 135, 68, 0.12)' : 'transparent'; }}
                      >
                        <Settings size={16} color="#2563EB" />
                        <span>Edit Profile & Settings</span>
                      </button>

                      {/* Requests Inbox */}
                      <button
                        onClick={() => handleNavigate('/inbox')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '9px 12px',
                          borderRadius: '8px',
                          border: '1px solid transparent',
                          background: location.pathname === '/inbox' ? 'rgba(0, 135, 68, 0.12)' : 'transparent',
                          color: '#18181B',
                          fontWeight: 700,
                          fontSize: '0.88rem',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'background 0.12s ease'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.06)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = location.pathname === '/inbox' ? 'rgba(0, 135, 68, 0.12)' : 'transparent'; }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                          <Inbox size={16} color="#D97706" />
                          <span>Requests Inbox</span>
                        </div>
                        {pendingRequestsCount > 0 && (
                          <span style={{
                            background: '#EA580C',
                            color: '#FFF',
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            padding: '1px 6px',
                            borderRadius: '9999px'
                          }}>
                            {pendingRequestsCount} new
                          </span>
                        )}
                      </button>

                      {/* Scheduled Sessions */}
                      <button
                        onClick={() => handleNavigate('/sessions')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '9px',
                          padding: '9px 12px',
                          borderRadius: '8px',
                          border: '1px solid transparent',
                          background: location.pathname === '/sessions' ? 'rgba(0, 135, 68, 0.12)' : 'transparent',
                          color: '#18181B',
                          fontWeight: 700,
                          fontSize: '0.88rem',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'background 0.12s ease'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.06)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = location.pathname === '/sessions' ? 'rgba(0, 135, 68, 0.12)' : 'transparent'; }}
                      >
                        <Calendar size={16} color="#059669" />
                        <span>My Study Sessions</span>
                      </button>

                      {/* Notifications Bulletin */}
                      <button
                        onClick={() => handleNavigate('/notifications')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '9px 12px',
                          borderRadius: '8px',
                          border: '1px solid transparent',
                          background: location.pathname === '/notifications' ? 'rgba(0, 135, 68, 0.12)' : 'transparent',
                          color: '#18181B',
                          fontWeight: 700,
                          fontSize: '0.88rem',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'background 0.12s ease'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.06)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = location.pathname === '/notifications' ? 'rgba(0, 135, 68, 0.12)' : 'transparent'; }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                          <Bell size={16} color="#7C3AED" />
                          <span>Notifications</span>
                        </div>
                        {unreadCount > 0 && (
                          <span style={{
                            background: '#EF4444',
                            color: '#FFF',
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            padding: '1px 6px',
                            borderRadius: '9999px'
                          }}>
                            {unreadCount}
                          </span>
                        )}
                      </button>
                    </div>

                    {/* Dotted separator */}
                    <div style={{ borderTop: '2px dashed #C4B98E', margin: '10px 0' }} />

                    {/* Logout Option */}
                    <button
                      onClick={handleLogout}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '9px',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        border: '1px solid #FECACA',
                        background: '#FEF2F2',
                        color: '#B91C1C',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background 0.12s ease'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#FEE2E2'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = '#FEF2F2'; }}
                    >
                      <LogOut size={15} color="#DC2626" />
                      <span>Log Out / Switch Account</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {isAuthPage && (
            <div className="auth-nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              {location.pathname === '/signup' ? (
                <Link
                  to="/login"
                  className="btn-secondary"
                  style={{
                    padding: '6px 14px',
                    fontSize: '0.82rem',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    borderRadius: '9999px',
                    border: '1.5px solid rgba(255,255,255,0.2)',
                    color: '#FFF',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  Log In
                </Link>
              ) : (
                <Link
                  to="/signup"
                  className="btn-primary"
                  style={{
                    padding: '6px 14px',
                    fontSize: '0.82rem',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    borderRadius: '9999px',
                    background: '#008744',
                    border: '1.5px solid #005a2d',
                    color: '#FFF',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  Get Started
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
