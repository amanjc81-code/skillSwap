import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../app/AuthContext.jsx';
import {
  LayoutDashboard,
  Compass,
  Award,
  Users,
  Network,
  Calendar,
  BookOpen,
  TrendingUp,
  BarChart3,
  ShieldAlert
} from 'lucide-react';

export const Sidebar = () => {
  const { isCoordinator, isAdmin } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Skill Explorer', path: '/skills', icon: Compass },
    { label: 'My Skills', path: '/my-skills', icon: Award },
    { label: 'Find Partners', path: '/find-partners', icon: Users },
    { label: 'Learning Network', path: '/connections', icon: Network },
    { label: 'Sessions', path: '/sessions', icon: Calendar },
    { label: 'Workspace', path: '/workspace', icon: BookOpen },
    { label: 'My Progress', path: '/progress', icon: TrendingUp }
  ];

  return (
    <aside
      style={{
        width: 'var(--sidebar-width)',
        backgroundColor: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.25rem 0.75rem',
        flexShrink: 0
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
        <div
          style={{
            padding: '0 0.75rem 0.5rem',
            fontSize: '0.7rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'var(--text-muted)'
          }}
        >
          Learning
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.55rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--color-success-bg)' : 'transparent',
                transition: 'all 0.15s ease'
              })}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {(isCoordinator || isAdmin) && (
        <div style={{ marginTop: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <div
            style={{
              padding: '0 0.75rem 0.5rem',
              fontSize: '0.7rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--text-muted)'
            }}
          >
            Institutional
          </div>

          <NavLink
            to="/analytics"
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.55rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              fontWeight: isActive ? 600 : 500,
              color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
              backgroundColor: isActive ? 'var(--color-success-bg)' : 'transparent',
              transition: 'all 0.15s ease'
            })}
          >
            <BarChart3 size={18} />
            <span>College Analytics</span>
          </NavLink>

          {isAdmin && (
            <NavLink
              to="/admin"
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.55rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--color-success-bg)' : 'transparent',
                transition: 'all 0.15s ease'
              })}
            >
              <ShieldAlert size={18} />
              <span>Admin Panel</span>
            </NavLink>
          )}
        </div>
      )}
    </aside>
  );
};
