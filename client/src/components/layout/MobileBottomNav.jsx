import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Sparkles, Triangle, MessageSquare, User, ArrowRightLeft } from 'lucide-react';
import { useSkillSwap } from '../../app/SkillSwapContext.jsx';

export const MobileBottomNav = () => {
  const location = useLocation();
  const { deviceView } = useSkillSwap();

  // Hide bottom nav on landing / auth / onboarding if necessary
  const hidePaths = ['/signup', '/login', '/onboarding'];
  if (hidePaths.includes(location.pathname)) return null;

  const navItems = [
    { label: 'Home', path: '/dashboard', icon: Home, color: 'var(--violet)' },
    { label: 'Match', path: '/match', icon: Sparkles, color: 'var(--cyan)' },
    { label: 'Circles', path: '/circle/details', icon: Triangle, color: 'var(--lime)' },
    { label: 'Chats', path: '/chat', icon: MessageSquare, color: 'var(--pink)' },
    { label: 'Profile', path: '/profile', icon: User, color: 'var(--orange)' }
  ];

  return (
    <nav
      className="mobile-bottom-nav"
      style={{
        position: deviceView === 'mobile-sim' ? 'sticky' : 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 'var(--bottom-nav-height)',
        background: 'rgba(14, 44, 30, 0.98)',
        backdropFilter: 'blur(25px)',
        WebkitBackdropFilter: 'blur(25px)',
        borderTop: '2px solid rgba(0, 135, 68, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0 10px',
        zIndex: 500,
        boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.7)'
      }}
    >
      {navItems.map(item => {
        const Icon = item.icon;
        const isActive = location.pathname.startsWith(item.path);

        return (
          <NavLink
            key={item.label}
            to={item.path}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-lg)',
              color: isActive ? item.color : 'var(--text-muted)',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              position: 'relative'
            }}
          >
            {isActive && (
              <span
                style={{
                  position: 'absolute',
                  top: '-8px',
                  width: '20px',
                  height: '3px',
                  borderRadius: '3px',
                  background: item.color,
                  boxShadow: `0 0 10px ${item.color}`
                }}
              />
            )}
            <Icon
              size={20}
              strokeWidth={isActive ? 2.5 : 2}
              style={{
                filter: isActive ? `drop-shadow(0 0 8px ${item.color})` : 'none',
                transform: isActive ? 'scale(1.1)' : 'scale(1)',
                transition: 'transform 0.2s ease'
              }}
            />
            <span style={{ fontSize: '0.7rem', fontWeight: isActive ? 700 : 500 }}>
              {item.label}
            </span>
          </NavLink>
        );
      })}
    </nav>
  );
};
