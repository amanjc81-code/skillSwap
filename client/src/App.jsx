import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SkillSwapProvider, useSkillSwap } from './app/SkillSwapContext.jsx';
import { Navbar } from './components/layout/Navbar.jsx';
import { MobileBottomNav } from './components/layout/MobileBottomNav.jsx';
import { ScreenNavigator } from './components/common/ScreenNavigator.jsx';

// Interactive Modals
import { SwapRequestModal } from './components/modals/SwapRequestModal.jsx';
import { ScheduleSessionModal } from './components/modals/ScheduleSessionModal.jsx';
import { RatingReviewModal } from './components/modals/RatingReviewModal.jsx';
import { CircleCelebrationModal } from './components/modals/CircleCelebrationModal.jsx';

// All 20 High-Fidelity Screens
import { LandingPage } from './features/landing/LandingPage.jsx';
import { SignupPage } from './features/auth/SignupPage.jsx';
import { LoginPage } from './features/auth/LoginPage.jsx';
import { OnboardingPage } from './features/onboarding/OnboardingPage.jsx';
import { DashboardPage } from './features/dashboard/DashboardPage.jsx';
import { FindMatchPage } from './features/matching/FindMatchPage.jsx';
import { StudentProfilePage } from './features/profile/StudentProfilePage.jsx';
import { SwapRequestPage } from './features/matching/SwapRequestPage.jsx';
import { RequestsInboxPage } from './features/matching/RequestsInboxPage.jsx';
import { DirectChatPage } from './features/chat/DirectChatPage.jsx';
import { ScheduleSessionPage } from './features/sessions/ScheduleSessionPage.jsx';
import { SessionsPage } from './features/sessions/SessionsPage.jsx';
import { RatingReviewPage } from './features/sessions/RatingReviewPage.jsx';
import { CreateCirclePage } from './features/circles/CreateCirclePage.jsx';
import { CircleSuggestionsPage } from './features/circles/CircleSuggestionsPage.jsx';
import { CircleDetailsPage } from './features/circles/CircleDetailsPage.jsx';
import { CircleChatPage } from './features/circles/CircleChatPage.jsx';
import { CircleSessionsPage } from './features/circles/CircleSessionsPage.jsx';
import { NotificationsPage } from './features/notifications/NotificationsPage.jsx';
import { SettingsProfilePage } from './features/settings/SettingsProfilePage.jsx';

// Toast Notification Container
// Toast Notification Container: Yellow Post-it Sticker Style
const ToastContainer = () => {
  const { toasts } = useSkillSwap();
  if (!toasts || toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 100000,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      pointerEvents: 'none'
    }}>
      {toasts.map(t => (
        <div
          key={t.id}
          className="animate-pop-in"
          style={{
            background: t.type === 'success' ? '#FEF08A' : (t.type === 'error' ? '#FEE2E2' : '#E0F2FE'),
            border: `2px solid #27272A`,
            boxShadow: `3px 4px 0px rgba(0,0,0,0.15)`,
            padding: '10px 18px',
            borderRadius: '8px',
            color: '#18181B',
            fontSize: '0.88rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            position: 'relative'
          }}
        >
          <span style={{ fontSize: '1rem' }}>{t.type === 'success' ? '📌' : (t.type === 'error' ? '⚠️' : '💡')}</span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
};

// Main App Container with Mobile Simulator Frame support
const AppContent = () => {
  const { deviceView } = useSkillSwap();

  if (deviceView === 'mobile-sim') {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0d2d1e',
        backgroundImage: 'repeating-linear-gradient(90deg, #092317 0px, #092317 28px, #123e2a 28px, #123e2a 30px, #071c12 30px, #071c12 32px)',
        padding: '30px 10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Device Mode Notice */}
        <div style={{
          textAlign: 'center',
          marginBottom: '14px',
          color: '#FEF08A',
          fontFamily: 'var(--font-hand)',
          fontSize: '1.2rem',
          fontWeight: 700
        }}>
          📱 <strong>Mobile Simulator View (iPhone 16 Pro mockup)</strong> • Tap <strong>Desktop View</strong> in the bottom right to expand ✍️
        </div>

        {/* Mobile Viewport Bezel */}
        <div className="mobile-simulator-viewport" style={{ boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 0 4px #27272A' }}>
          {/* Dynamic Island */}
          <div className="mobile-island">
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#111' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#222' }} />
          </div>

          <div style={{ minHeight: '880px', display: 'flex', flexDirection: 'column', background: '#123e2a' }}>
            <Navbar />
            <div style={{ flex: 1, paddingBottom: '70px' }}>
              <AppRoutes />
            </div>
            <MobileBottomNav />
          </div>
        </div>
      </div>
    );
  }

  // Fluid Desktop View
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <AppRoutes />
      </main>
      <MobileBottomNav />
    </div>
  );
};

// Application Routes
const AppRoutes = () => {
  return (
    <Routes>
      {/* 1. Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* 2. Signup Page */}
      <Route path="/signup" element={<SignupPage />} />

      {/* 3. Login Page */}
      <Route path="/login" element={<LoginPage />} />

      {/* 4. Onboarding / Profile Setup */}
      <Route path="/onboarding" element={<OnboardingPage />} />

      {/* 5. Dashboard */}
      <Route path="/dashboard" element={<DashboardPage />} />

      {/* 6. Find Match Page (1-to-1) */}
      <Route path="/match" element={<FindMatchPage />} />

      {/* 7. Student Profile Page */}
      <Route path="/profile" element={<StudentProfilePage />} />
      <Route path="/profile/:id" element={<StudentProfilePage />} />

      {/* 8. Swap Request Flow */}
      <Route path="/swap-request" element={<SwapRequestPage />} />

      {/* 9. Requests Inbox */}
      <Route path="/inbox" element={<RequestsInboxPage />} />

      {/* 10. 1-to-1 Chat Page */}
      <Route path="/chat" element={<DirectChatPage />} />

      {/* 11. Session Scheduling Modal/Page */}
      <Route path="/schedule" element={<ScheduleSessionPage />} />

      {/* 12. Sessions Page */}
      <Route path="/sessions" element={<SessionsPage />} />

      {/* 13. Rating and Review Modal/Page */}
      <Route path="/review" element={<RatingReviewPage />} />

      {/* 14. Create Skill Circle Page */}
      <Route path="/circle/create" element={<CreateCirclePage />} />

      {/* 15. Triangle Circle Suggestion Page */}
      <Route path="/circle/suggestions" element={<CircleSuggestionsPage />} />

      {/* 16. Circle Details Page with Visual Triangle */}
      <Route path="/circle/details" element={<CircleDetailsPage />} />

      {/* 17. Circle Group Chat */}
      <Route path="/circle/chat" element={<CircleChatPage />} />

      {/* 18. Circle Sessions Page */}
      <Route path="/circle/sessions" element={<CircleSessionsPage />} />

      {/* 19. Notifications Page */}
      <Route path="/notifications" element={<NotificationsPage />} />

      {/* 20. Settings / Edit Profile Page */}
      <Route path="/settings" element={<SettingsProfilePage />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export const App = () => {
  return (
    <SkillSwapProvider>
      <BrowserRouter>
        <AppContent />

        {/* Global Interactive Modals */}
        <SwapRequestModal />
        <ScheduleSessionModal />
        <RatingReviewModal />
        <CircleCelebrationModal />

        {/* Quick 20 Screens Floating Directory & Device Switcher */}
        <ScreenNavigator />

        {/* Toast Alerts */}
        <ToastContainer />
      </BrowserRouter>
    </SkillSwapProvider>
  );
};

export default App;
