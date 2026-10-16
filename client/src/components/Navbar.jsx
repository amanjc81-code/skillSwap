import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../app/AuthContext.jsx';
import { Share2, LogOut } from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const userInitial = user?.name ? user.name[0].toUpperCase() : 'U';

  return (
    <nav
      style={{
        height: 'var(--nav-height)',
        borderBottom: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--bg-surface)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.75rem',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Link to={isAuthenticated ? '/dashboard' : '/'} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}
          >
            <Share2 size={17} />
          </div>
          <span style={{ fontSize: '1.15rem', fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--text-primary)' }}>
            Skill<span style={{ color: 'var(--accent-primary)' }}>Mesh</span>
          </span>
          <span className="badge badge-indigo" style={{ fontSize: '0.65rem', marginLeft: '0.2rem' }}>
            MIT ACSC
          </span>
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {isAuthenticated ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginRight: '0.5rem' }}>
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '1px solid var(--border-subtle)'
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-success-bg)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--accent-primary)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {userInitial}
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                  {user.name}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {user.role === 'admin'
                    ? 'Administrator'
                    : user.role === 'coordinator'
                    ? 'Faculty Coordinator'
                    : `${user.academicYear || 'Student'} • ${user.department || 'Computer Apps'}`}
                </span>
              </div>
            </div>

            <button onClick={handleLogout} className="btn btn-secondary btn-sm" title="Log Out">
              <LogOut size={13} />
              <span>Log out</span>
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link to="/login" className="btn btn-secondary btn-sm">
              Log in
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
