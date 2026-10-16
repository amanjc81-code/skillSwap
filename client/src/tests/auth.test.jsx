import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../app/AuthContext.jsx';
import { ToastProvider } from '../app/ToastContext.jsx';
import { LoginPage } from '../features/auth/LoginPage.jsx';
import { RegisterPage } from '../features/auth/RegisterPage.jsx';
import { LandingPage } from '../features/landing/LandingPage.jsx';

// Mock api fetch calls
vi.mock('../lib/api.js', () => ({
  api: {
    get: vi.fn().mockResolvedValue({ success: true, user: null }),
    post: vi.fn().mockResolvedValue({ success: true, user: { name: 'Demo Student' } })
  }
}));

const renderWithProviders = (ui) => {
  return render(
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>{ui}</BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
};

describe('Frontend Authentication & Landing Components', () => {
  it('renders LoginPage with 1-click evaluation buttons', () => {
    renderWithProviders(<LoginPage />);

    expect(screen.getByText('Log In to SkillMesh')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('student@mitacsc.ac.in')).toBeInTheDocument();
    expect(screen.getByText('1-Click Demo Evaluation Accounts')).toBeInTheDocument();
    expect(screen.getByText(/Aarav/)).toBeInTheDocument();
  });

  it('populates fields when a demo quick-fill button is clicked', () => {
    renderWithProviders(<LoginPage />);

    const aaravBtn = screen.getByText(/Aarav/);
    fireEvent.click(aaravBtn);

    const emailInput = screen.getByPlaceholderText('student@mitacsc.ac.in');
    expect(emailInput.value).toBe('aarav.sharma@mitacsc.ac.in');
  });

  it('renders RegisterPage and shows error on mismatched passwords', async () => {
    renderWithProviders(<RegisterPage />);

    expect(screen.getByText('Join the Peer Learning Network')).toBeInTheDocument();

    const nameInput = screen.getByPlaceholderText('Aarav Sharma');
    const emailInput = screen.getByPlaceholderText('student@mitacsc.ac.in');
    const passInput = screen.getByPlaceholderText('Min 6 characters');
    const confirmInput = screen.getByPlaceholderText('Repeat password');
    const submitBtn = screen.getByRole('button', { name: /Complete Registration/i });

    fireEvent.change(nameInput, { target: { value: 'Chirag Joshi' } });
    fireEvent.change(emailInput, { target: { value: 'chirag@mitacsc.ac.in' } });
    fireEvent.change(passInput, { target: { value: 'Password@123' } });
    fireEvent.change(confirmInput, { target: { value: 'WrongMismatch@123' } });

    fireEvent.click(submitBtn);

    expect(await screen.findByText('Passwords do not match')).toBeInTheDocument();
  });

  it('renders LandingPage showcasing reciprocal exchange', () => {
    renderWithProviders(<LandingPage />);

    expect(screen.getByText(/Peer Learning Powered by an Intelligent/i)).toBeInTheDocument();
    expect(screen.getByText(/97% Compatibility/i)).toBeInTheDocument();
    expect(screen.getByText(/How Reciprocal Matching Works/i)).toBeInTheDocument();
  });
});
