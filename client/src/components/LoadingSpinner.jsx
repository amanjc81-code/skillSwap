import React from 'react';

export const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1rem',
        gap: '1rem',
        color: 'var(--text-muted)'
      }}
    >
      <div
        style={{
          width: '36px',
          height: '36px',
          border: '3px solid var(--border-subtle)',
          borderTopColor: 'var(--accent-primary)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }}
      />
      <span style={{ fontSize: '0.875rem' }}>{message}</span>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
