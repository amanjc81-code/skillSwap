import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../app/AuthContext.jsx';
import { ToastProvider } from '../app/ToastContext.jsx';
import { FindPartnersPage } from '../features/matching/FindPartnersPage.jsx';
import * as apiModule from '../lib/api.js';

vi.mock('../lib/api.js', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn()
  }
}));

const mockMatchesData = {
  reciprocalMatches: [
    {
      candidate: {
        _id: 'userB123',
        name: 'Bhavya Patel',
        department: 'Computer Applications',
        academicYear: 'TY'
      },
      skillToLearn: { _id: 'sql123', name: 'SQL', category: 'Databases' },
      providerProficiency: 'advanced',
      score: 97,
      isReciprocal: true,
      reciprocalSkills: [
        {
          userTeachesSkill: { _id: 'flutter123', name: 'Flutter' },
          userProficiency: 'advanced',
          candidateWantsToLearn: { _id: 'flutter123', name: 'Flutter' }
        }
      ],
      explanations: [
        'This student can teach SQL (advanced level), which matches your learning goal.',
        'Direct Reciprocal Match: You can teach Flutter, which this student wants to learn!'
      ]
    }
  ],
  oneWayMatches: [],
  cycles: []
};

const renderWithProviders = (ui) => {
  return render(
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>{ui}</BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
};

describe('Frontend Matching & Recommendation Components', () => {
  it('renders FindPartnersPage and displays reciprocal recommendation card', async () => {
    vi.spyOn(apiModule.api, 'get').mockImplementation((url) => {
      if (url.includes('/auth/me')) {
        return Promise.resolve({ success: true, user: { _id: 'userA123', name: 'Aarav' } });
      }
      if (url.includes('/matches')) {
        return Promise.resolve(mockMatchesData);
      }
      return Promise.resolve({});
    });

    renderWithProviders(<FindPartnersPage />);

    expect(await screen.findByText('Find Learning Partners')).toBeInTheDocument();
    expect(await screen.findByText('Bhavya Patel')).toBeInTheDocument();
    expect(screen.getByText('97% Match')).toBeInTheDocument();
    expect(
      screen.getByText(/Direct Reciprocal Match: You can teach Flutter/i)
    ).toBeInTheDocument();
  });

  it('opens propose exchange modal when button is clicked', async () => {
    vi.spyOn(apiModule.api, 'get').mockImplementation((url) => {
      if (url.includes('/auth/me')) {
        return Promise.resolve({ success: true, user: { _id: 'userA123', name: 'Aarav' } });
      }
      if (url.includes('/matches')) {
        return Promise.resolve(mockMatchesData);
      }
      return Promise.resolve({});
    });

    renderWithProviders(<FindPartnersPage />);

    const proposeBtn = await screen.findByRole('button', { name: /Propose Exchange/i });
    fireEvent.click(proposeBtn);

    expect(screen.getByText(/Connect with Bhavya Patel/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Send Request/i })).toBeInTheDocument();
  });
});
