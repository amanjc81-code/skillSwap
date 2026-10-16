import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/AuthContext.jsx';
import { useToast } from '../../app/ToastContext.jsx';
import { UserPlus } from 'lucide-react';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: 'Computer Applications',
    academicYear: 'TY',
    preferredLearningFormat: 'flexible'
  });
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { register, loginWithGoogle } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    setSubmitting(true);
    try {
      await register(formData);
      addToast('Registration successful! Welcome to SkillMesh.', 'success');
      navigate('/onboarding');
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please verify your details.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setErrorMessage('');
    setGoogleSubmitting(true);
    try {
      await loginWithGoogle();
      addToast('Welcome to SkillMesh! Signed up with Google.', 'success');
      navigate('/onboarding');
    } catch (err) {
      setErrorMessage(err.message || 'Google sign-up failed.');
    } finally {
      setGoogleSubmitting(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '3rem 1.5rem',
        minHeight: 'calc(100vh - var(--nav-height) - 100px)'
      }}
    >
      <div style={{ width: '100%', maxWidth: '520px' }}>
        <div className="card">
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Join the Peer Learning Network
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Create your student profile to exchange skills and connect with mentors
            </p>
          </div>

          {errorMessage && (
            <div
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--color-danger-bg)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-danger)',
                fontSize: '0.85rem',
                marginBottom: '1.25rem'
              }}
            >
              {errorMessage}
            </div>
          )}

          {/* Firebase Google 1-Click Sign-Up */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={submitting || googleSubmitting}
            className="btn btn-secondary"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.65rem',
              padding: '0.75rem 1rem',
              fontWeight: 500,
              fontSize: '0.9rem',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-surface)'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            {googleSubmitting ? 'Connecting with Google...' : 'Sign up with Google'}
          </button>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              margin: '1.25rem 0',
              gap: '0.75rem'
            }}
          >
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }} />
            <span
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              or register with email
            </span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }} />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="register-name">Full Name</label>
              <input
                id="register-name"
                name="name"
                type="text"
                className="form-input"
                placeholder="Aarav Sharma"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="register-email">College Email Address</label>
              <input
                id="register-email"
                name="email"
                type="email"
                className="form-input"
                placeholder="student@mitacsc.ac.in"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="register-dept">Department</label>
                <input
                  id="register-dept"
                  name="department"
                  type="text"
                  className="form-input"
                  value={formData.department}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="register-year">Academic Year</label>
                <select
                  id="register-year"
                  name="academicYear"
                  className="form-select"
                  value={formData.academicYear}
                  onChange={handleChange}
                >
                  <option value="FY">First Year (FY)</option>
                  <option value="SY">Second Year (SY)</option>
                  <option value="TY">Third Year (TY)</option>
                  <option value="Final">Final Year</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="register-format">Preferred Learning Format</label>
              <select
                id="register-format"
                name="preferredLearningFormat"
                className="form-select"
                value={formData.preferredLearningFormat}
                onChange={handleChange}
              >
                <option value="flexible">Flexible (Online or In-Person)</option>
                <option value="online">Online Only</option>
                <option value="in-person">In-Person (Campus Lab / Library)</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="register-password">Password</label>
                <input
                  id="register-password"
                  name="password"
                  type="password"
                  className="form-input"
                  placeholder="Min 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="register-confirm-password">Confirm Password</label>
                <input
                  id="register-confirm-password"
                  name="confirmPassword"
                  type="password"
                  className="form-input"
                  placeholder="Repeat password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1rem', padding: '0.75rem' }}
              disabled={submitting || googleSubmitting}
            >
              <UserPlus size={16} />
              {submitting ? 'Creating Profile...' : 'Complete Registration'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: 500 }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
