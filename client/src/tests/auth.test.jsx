import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../app/AuthContext.jsx';
import { ToastProvider } from '../app/ToastContext.jsx';
import { SkillSwapProvider } from '../app/SkillSwapContext.jsx';
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
    <SkillSwapProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>{ui}</BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </SkillSwapProvider>
  );
};

describe('Frontend Authentication & Landing Components', () => {
  it('renders LoginPage with 1-click evaluation buttons', () => {
    renderWithProviders(<LoginPage />);

    expect(screen.getByText('STUDENT LOGIN')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('yourname@campus.edu')).toBeInTheDocument();
    expect(screen.getByText(/QUICK SIGN IN AS REGISTERED STUDENT/i)).toBeInTheDocument();
  });

  it('populates fields when a user types credentials', () => {
    renderWithProviders(<LoginPage />);

    const emailInput = screen.getByPlaceholderText('yourname@campus.edu');
    fireEvent.change(emailInput, { target: { value: 'aarav.sharma@mitacsc.ac.in' } });
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

    expect(screen.getByText('WELCOME TO SKILLSWAP')).toBeInTheDocument();
    expect(screen.getByText('1-TO-1 SKILL SWAP')).toBeInTheDocument();
    expect(screen.getByText('TRIANGLE SKILL CIRCLE')).toBeInTheDocument();
  });
});
