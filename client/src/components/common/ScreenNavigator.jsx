import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSkillSwap } from '../../app/SkillSwapContext.jsx';
import {
  Compass,
  Smartphone,
  Monitor,
  X,
  Search,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Layers
} from 'lucide-react';

export const ScreenNavigator = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [filterText, setFilterText] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { deviceView, setDeviceView, setActiveModal, setModalPayload, resetEntireDatabaseAndState } = useSkillSwap();

  const screens = [
    { id: 1, title: '1. Landing Page', path: '/', category: 'Auth & Marketing', badge: 'Hero Triangle' },
    { id: 2, title: '2. Signup Page', path: '/signup', category: 'Auth & Marketing', badge: 'Split View' },
    { id: 3, title: '3. Login Page', path: '/login', category: 'Auth & Marketing', badge: 'Google Auth' },
    { id: 4, title: '4. Onboarding / Profile Setup', path: '/onboarding', category: 'Auth & Marketing', badge: 'Photo & Steps' },
    { id: 5, title: '5. Dashboard', path: '/dashboard', category: 'Core App', badge: 'Study Notebook' },
    { id: 6, title: '6. Find Match (1-to-1 Swap)', path: '/match', category: 'Core App', badge: 'Tactile Cards' },
    { id: 7, title: '7. Student Profile Page', path: '/profile', category: 'Core App', badge: 'Polaroid & Zine' },
    { id: 8, title: '8. Swap Request Flow', path: '/swap-request', category: 'Core App', badge: 'Live Preview' },
    { id: 9, title: '9. Requests Inbox', path: '/inbox', category: 'Core App', badge: 'Folder Tabs' },
    { id: 10, title: '10. 1-to-1 Chat Page', path: '/chat', category: 'Sessions & Chat', badge: 'Legal Pad DM' },
    { id: 11, title: '11. Session Scheduling Page', path: '/schedule', category: 'Sessions & Chat', badge: 'Date & Time Chips' },
    { id: 12, title: '12. Sessions Timetable Page', path: '/sessions', category: 'Sessions & Chat', badge: 'Study Planner' },
    { id: 13, title: '13. Rating and Review Page', path: '/review', category: 'Sessions & Chat', badge: 'Report Card' },
    { id: 14, title: '14. Create Skill Circle', path: '/circle/create', category: 'Triangle Skill Circle', badge: 'Circle Inputs' },
    { id: 15, title: '15. Circle Suggestion Page', path: '/circle/suggestions', category: 'Triangle Skill Circle', badge: 'Yarn String Board' },
    { id: 16, title: '16. Circle Details & Visual Triangle', path: '/circle/details', category: 'Triangle Skill Circle', badge: 'Trio Details' },
    { id: 17, title: '17. Circle Group Chat', path: '/circle/chat', category: 'Triangle Skill Circle', badge: 'Trio Notes' },
    { id: 18, title: '18. Circle Sessions Roadmap', path: '/circle/sessions', category: 'Triangle Skill Circle', badge: '3-Hop Timetable' },
    { id: 19, title: '19. Notifications Bulletin', path: '/notifications', category: 'Account & Settings', badge: 'Notice Slips' },
    { id: 20, title: '20. Settings / Edit Profile', path: '/settings', category: 'Account & Settings', badge: 'Notebook Settings' }
  ];

  const filteredScreens = screens.filter(s =>
    s.title.toLowerCase().includes(filterText.toLowerCase()) ||
    s.category.toLowerCase().includes(filterText.toLowerCase()) ||
    s.badge.toLowerCase().includes(filterText.toLowerCase())
  );

  const handleNavigate = (screen) => {
    if (screen.path === '/swap-request') {
      setActiveModal('swap-request');
    } else if (screen.path === '/schedule') {
      setActiveModal('schedule-session');
    } else if (screen.path === '/review') {
      setActiveModal('rate-review');
    }
    navigate(screen.path);
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Navigator Bar (Bottom-Right on Desktop, Top-Right in Mobile-Sim) */}
      <div className="floating-screen-navigator" style={{
        position: 'fixed',
        bottom: deviceView === 'mobile-sim' ? 'auto' : '24px',
        top: deviceView === 'mobile-sim' ? '20px' : 'auto',
        right: '24px',
        zIndex: 9000,
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        {/* Device Switcher Button */}
        <button
          onClick={() => setDeviceView(deviceView === 'desktop' ? 'mobile-sim' : 'desktop')}
          className="btn-3d-yellow"
          title={deviceView === 'desktop' ? 'Switch to Mobile Simulator frame' : 'Switch to Desktop full-width'}
          style={{
            padding: '8px 16px',
            fontSize: '0.8rem'
          }}
        >
          {deviceView === 'desktop' ? (
            <>
              <Smartphone size={15} />
              <span>MOBILE SIM</span>
            </>
          ) : (
            <>
              <Monitor size={15} />
              <span>DESKTOP VIEW</span>
            </>
          )}
        </button>

        {/* 20 Screens Master Navigator Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="btn-3d-green"
          style={{
            padding: '8px 18px',
            fontSize: '0.82rem',
            gap: '8px'
          }}
        >
          <Layers size={16} />
          <span>20 SCREENS GUIDE</span>
          <span style={{
            background: '#005a2d',
            color: '#FFF',
            padding: '2px 8px',
            borderRadius: '9999px',
            fontSize: '0.7rem',
            fontWeight: 800
          }}>
            LIVE
          </span>
        </button>
      </div>

      {/* Screen Navigator Modal */}
      {isOpen && (
        <div className="scrapbook-modal-backdrop">
          <div className="scrapbook-modal-sheet" style={{
            maxWidth: '740px',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Red Pushpin */}
            <div className="pushpin-3d pushpin-red" style={{ top: '-10px', left: '24px' }} />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span className="sticker-badge sticker-badge-cert" style={{ fontSize: '0.72rem', padding: '2px 10px' }}>
                    <Sparkles size={12} style={{ marginRight: '4px' }} /> TACTILE ZINE DIRECTORY
                  </span>
                  <span className="sticker-badge sticker-badge-exp" style={{ fontSize: '0.72rem', padding: '2px 10px' }}>
                    20 / 20 SCREENS READY
                  </span>
                </div>
                <h2 style={{ fontFamily: 'var(--font-titan)', fontSize: '1.7rem', color: '#18181B', margin: '4px 0 0 0' }}>
                  SKILLSWAP SCREEN DIRECTORY
                </h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: '#F4F4F5',
                  border: '2px solid #27272A',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={18} color="#18181B" />
              </button>
            </div>

            {/* Search Input */}
            <div style={{ position: 'relative', marginBottom: '16px' }}>
              <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#71717A' }} />
              <input
                type="text"
                value={filterText}
                onChange={e => setFilterText(e.target.value)}
                placeholder="Search screens by name, category, or flow (e.g. Triangle, Chat, Onboarding)..."
                className="scrapbook-input"
                style={{ paddingLeft: '40px' }}
                autoFocus
              />
            </div>

            {/* Screens List */}
            <div style={{
              overflowY: 'auto',
              flex: 1,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '12px',
              paddingRight: '6px'
            }}>
              {filteredScreens.map(screen => {
                const isActive = location.pathname === screen.path;
                return (
                  <div
                    key={screen.id}
                    onClick={() => handleNavigate(screen)}
                    className="scrapbook-paper-card"
                    style={{
                      padding: '14px 16px',
                      cursor: 'pointer',
                      background: isActive ? '#FEF9C3' : '#FFFFFF',
                      border: isActive ? '2px solid #CA8A04' : '2px solid #27272A',
                      boxShadow: isActive ? '3px 3px 0px #CA8A04' : '2px 2px 0px rgba(0,0,0,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-titan)', color: '#007A3D', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        {screen.category}
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#18181B', marginTop: '2px' }}>
                        {screen.title}
                      </div>
                      <span className={isActive ? 'ripped-tag ripped-green' : 'ripped-tag ripped-yellow'} style={{
                        marginTop: '6px',
                        padding: '1px 8px',
                        fontSize: '0.65rem'
                      }}>
                        {screen.badge}
                      </span>
                    </div>

                    <ArrowRight size={16} color={isActive ? '#047857' : '#71717A'} />
                  </div>
                );
              })}
            </div>

            {/* Footer with Mode switch */}
            <div style={{
              marginTop: '16px',
              paddingTop: '14px',
              borderTop: '2px dashed #C4B98E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.85rem',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <span style={{ fontFamily: 'var(--font-hand)', fontSize: '1.15rem', color: '#047857', fontWeight: 700 }}>
                Tip: Toggle between <strong>Mobile Sim</strong> & <strong>Desktop View</strong> anytime! ✍️
              </span>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={() => {
                    if (window.confirm('⚠️ Are you sure you want to reset all app & database data to start fresh?')) {
                      resetEntireDatabaseAndState();
                      setIsOpen(false);
                      navigate('/onboarding');
                    }
                  }}
                  className="btn-3d-yellow"
                  style={{ padding: '6px 14px', fontSize: '0.78rem', background: '#FEE2E2', border: '2px solid #EF4444', color: '#991B1B' }}
                >
                  🗑️ RESET ALL DATA (START FRESH)
                </button>
                <button
                  onClick={() => {
                    setDeviceView(deviceView === 'desktop' ? 'mobile-sim' : 'desktop');
                    setIsOpen(false);
                  }}
                  className="btn-3d-yellow"
                  style={{ padding: '6px 14px', fontSize: '0.78rem' }}
                >
                  SWITCH TO {deviceView === 'desktop' ? 'MOBILE SIM' : 'DESKTOP'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
