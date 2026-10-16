import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSkillSwap } from '../../app/SkillSwapContext.jsx';
import {
  Sparkles,
  ArrowRightLeft,
  Triangle,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  MessageSquare,
  Award,
  Zap,
  ChevronRight,
  UserCheck,
  Video
} from 'lucide-react';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const {
    currentUser,
    students,
    activeCircle,
    sessions,
    receivedRequests,
    directChatMessages,
    setActiveModal,
    setModalPayload
  } = useSkillSwap();

  const safeSessions = sessions || [];
  const safeStudents = students || [];
  const safeRequests = receivedRequests || [];
  const safeChat = directChatMessages || [];

  const upcomingSessions = safeSessions.filter(s => s.status === 'Upcoming');
  const perfectMatches = safeStudents.filter(s => s.matchType === 'Perfect Match');
  const pendingRequestsCount = safeRequests.filter(r => (r.status || '').toLowerCase() === 'pending').length;

  const trendingSkills = [
    'React', 'SQL', 'Python', 'Figma', 'Canva', 'Video Editing', 'English Speaking', 'Excel'
  ];

  return (
    <div className="scrapbook-desk">
      <div style={{ maxWidth: '1220px', margin: '0 auto' }}>
        
        {/* Top Bento Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '24px',
          marginBottom: '28px'
        }}>
          {/* Card 1: Welcome Notebook (Span 8) */}
          <div
            className="notebook-sheet"
            style={{
              gridColumn: 'span 8',
              padding: '36px 32px',
              borderLeft: '16px solid #881337',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div className="binder-clip-top" style={{ left: '60px' }} />

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span className="sticker-badge sticker-badge-exp" style={{ fontSize: '0.78rem', padding: '4px 12px' }}>
                  LEVEL 4 SKILL GURU ⚡
                </span>
                <span style={{ fontFamily: 'var(--font-hand)', fontSize: '1.2rem', color: '#15803D', fontWeight: 700 }}>
                  {currentUser.college} ✍️
                </span>
              </div>

              <h1 style={{
                fontFamily: 'var(--font-dela)',
                fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)',
                color: '#1E3A8A',
                lineHeight: 1.15
              }}>
                HEY {currentUser.name ? currentUser.name.toUpperCase().split(' ')[0] : 'STUDENT'}! <span style={{ color: '#008744' }}>READY TO SWAP?</span>
              </h1>

              <p style={{ color: '#4B5563', fontSize: '0.98rem', maxWidth: '540px', lineHeight: 1.55, marginTop: '8px' }}>
                {upcomingSessions.length > 0 ? (
                  <>You have <strong>{upcomingSessions.length} upcoming session{upcomingSessions.length > 1 ? 's' : ''}</strong> scheduled on your timetable.</>
                ) : (
                  <>Explore campus peers or start a triangle circle to trade skills without spending money!</>
                )}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
              <Link
                to="/match"
                style={{
                  padding: '10px 22px',
                  background: '#008744',
                  border: '2px solid #005a2d',
                  borderRadius: '4px',
                  color: '#FFF',
                  fontFamily: 'var(--font-titan)',
                  fontSize: '0.88rem',
                  boxShadow: '0 4px 0 #005a2d',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Sparkles size={16} /> FIND NEW SWAP
              </Link>

              <Link
                to="/circle/details"
                style={{
                  padding: '10px 20px',
                  background: '#FACC15',
                  border: '2px solid #CA8A04',
                  borderRadius: '4px',
                  color: '#18181B',
                  fontFamily: 'var(--font-titan)',
                  fontSize: '0.88rem',
                  boxShadow: '0 4px 0 #CA8A04',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Triangle size={15} fill="#18181B" /> TRIANGLE CIRCLE
              </Link>
            </div>
          </div>

          {/* Card 2: Profile Power Post-It (Span 4) */}
          <div
            className="yellow-postit"
            style={{
              gridColumn: 'span 4',
              padding: '28px 24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              transform: 'rotate(1.5deg)'
            }}
          >
            <div style={{ position: 'relative', width: '90px', height: '90px', marginBottom: '10px' }}>
              <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <circle cx="50" cy="50" r="42" stroke="#FEF08A" strokeWidth="8" fill="none" />
                <circle
                  cx="50" cy="50" r="42"
                  stroke="#15803D"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray="264"
                  strokeDashoffset={264 - (264 * (currentUser.profileCompletion || 20)) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.4rem', fontFamily: 'var(--font-titan)', color: '#166534' }}>
                  {currentUser.profileCompletion || 20}%
                </span>
              </div>
            </div>

            <div style={{ fontFamily: 'var(--font-dela)', fontSize: '1rem', color: '#166534', marginBottom: '2px' }}>
              ZINE POWER
            </div>
            <p style={{ color: '#713F12', fontSize: '0.8rem', marginBottom: '10px' }}>
              Complete your profile and add skills to hit 100%!
            </p>
            <Link to="/settings" style={{ fontSize: '0.82rem', fontFamily: 'var(--font-hand)', fontWeight: 800, color: '#1E3A8A' }}>
              Edit Profile ➔
            </Link>
          </div>
        </div>

        {/* STATS BENTO ROW (4 TACTILE STICKER CARDS) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '18px',
          marginBottom: '32px'
        }}>
          {/* Stat 1 */}
          <div style={{
            background: '#FFFFFF',
            border: '2px solid #007A3D',
            borderRadius: '6px',
            padding: '18px 20px',
            boxShadow: '0 6px 14px rgba(0,0,0,0.1)'
          }}>
            <span className="sticker-badge sticker-badge-exp" style={{ fontSize: '0.7rem', padding: '2px 8px', marginBottom: '6px' }}>
              ACTIVE SWAPS
            </span>
            <div style={{ fontFamily: 'var(--font-dela)', fontSize: '2rem', color: '#007A3D' }}>
              {upcomingSessions.length}
            </div>
            <div style={{ fontSize: '0.78rem', fontFamily: 'var(--font-hand)', fontWeight: 700, color: '#15803D' }}>
              Scheduled sessions 📅
            </div>
          </div>

          {/* Stat 2 */}
          <div style={{
            background: '#FFFFFF',
            border: '2px solid #EA580C',
            borderRadius: '6px',
            padding: '18px 20px',
            boxShadow: '0 6px 14px rgba(0,0,0,0.1)'
          }}>
            <span className="sticker-badge sticker-badge-edu" style={{ fontSize: '0.7rem', padding: '2px 8px', marginBottom: '6px' }}>
              PENDING INBOX
            </span>
            <div style={{ fontFamily: 'var(--font-dela)', fontSize: '2rem', color: '#EA580C' }}>
              {pendingRequestsCount}
            </div>
            <Link to="/inbox" style={{ fontSize: '0.78rem', fontFamily: 'var(--font-hand)', fontWeight: 700, color: '#EA580C' }}>
              Review proposals ➔
            </Link>
          </div>

          {/* Stat 3 */}
          <div style={{
            background: '#FFFFFF',
            border: '2px solid #0284C7',
            borderRadius: '6px',
            padding: '18px 20px',
            boxShadow: '0 6px 14px rgba(0,0,0,0.1)'
          }}>
            <span className="sticker-badge sticker-badge-cert" style={{ fontSize: '0.7rem', padding: '2px 8px', marginBottom: '6px' }}>
              TRIANGLE LOOP
            </span>
            <div style={{ fontFamily: 'var(--font-dela)', fontSize: '2rem', color: '#0284C7' }}>
              {activeCircle ? '1 ACTIVE' : '0 ACTIVE'}
            </div>
            <div style={{ fontSize: '0.78rem', fontFamily: 'var(--font-hand)', fontWeight: 700, color: '#0284C7' }}>
              {activeCircle?.name || 'Campus Trio'}
            </div>
          </div>

          {/* Stat 4 */}
          <div style={{
            background: '#FFFFFF',
            border: '2px solid #CA8A04',
            borderRadius: '6px',
            padding: '18px 20px',
            boxShadow: '0 6px 14px rgba(0,0,0,0.1)'
          }}>
            <span className="sticker-badge sticker-badge-soft" style={{ fontSize: '0.7rem', padding: '2px 8px', marginBottom: '6px' }}>
              COMPLETED
            </span>
            <div style={{ fontFamily: 'var(--font-dela)', fontSize: '2rem', color: '#854D0E' }}>
              {safeSessions.filter(s => s.status === 'Completed').length} SESSIONS
            </div>
            <div style={{ fontSize: '0.78rem', fontFamily: 'var(--font-hand)', fontWeight: 700, color: '#A16207' }}>
              {currentUser?.stats?.rating || 5.0} ★ rating
            </div>
          </div>
        </div>

        {/* TWO-COLUMN MAIN WORKSPACE */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '28px',
          marginBottom: '36px'
        }}>
          {/* Left Column (Span 8): Perfect Matches & Skill Circle */}
          <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '28px' }}>
            
            {/* PERFECT MATCHES */}
            <div className="notebook-sheet" style={{ padding: '28px 26px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <div>
                  <span className="sticker-badge sticker-badge-exp" style={{ fontSize: '0.75rem', padding: '3px 10px', marginBottom: '4px' }}>
                    RECIPROCAL MATCHES
                  </span>
                  <div style={{ fontFamily: 'var(--font-dela)', fontSize: '1.25rem', color: '#1E3A8A' }}>
                    PEERS WAITING TO SWAP
                  </div>
                </div>
                <Link to="/match" style={{ fontFamily: 'var(--font-hand)', fontSize: '1.2rem', color: '#008744', fontWeight: 700 }}>
                  See all matches ➔
                </Link>
              </div>

              {perfectMatches.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '28px 16px', background: '#FEF9C3', border: '2px dashed #CA8A04', borderRadius: '8px' }}>
                  <div style={{ fontFamily: 'var(--font-titan)', fontSize: '1.05rem', color: '#18181B', marginBottom: '4px' }}>
                    NO REGISTERED PEER MATCHES YET
                  </div>
                  <p style={{ fontFamily: 'var(--font-hand)', fontSize: '1.15rem', color: '#78350F', fontWeight: 700, margin: '0 auto 12px auto', maxWidth: '420px', lineHeight: 1.3 }}>
                    As classmates register and share what they can teach, mutual swaps will appear here ✍️
                  </p>
                  <Link to="/onboarding" className="btn-3d-green" style={{ display: 'inline-block', padding: '8px 20px', fontSize: '0.8rem' }}>
                    SETUP MY SKILLS ⚡
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                  {perfectMatches.map(student => (
                    <div
                      key={student.id}
                      style={{
                        background: '#FFFFFF',
                        border: '2px solid #E5E7EB',
                        borderRadius: '4px',
                        padding: '16px',
                        boxShadow: '0 6px 12px rgba(0,0,0,0.06)'
                      }}
                    >
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '10px' }}>
                        <img src={student.avatar} alt={student.name} style={{ width: 44, height: 44, borderRadius: '50%' }} />
                        <div>
                          <div style={{ fontFamily: 'var(--font-dela)', fontSize: '0.92rem', color: '#1E3A8A' }}>{student.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{student.college}</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' }}>
                        <span className="ripped-tag ripped-green" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                          TEACHES: {student.canTeach[0]}
                        </span>
                        <span className="ripped-tag ripped-yellow" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                          WANTS: {student.wantsToLearn[0]}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setModalPayload(student);
                          setActiveModal('swap-request');
                        }}
                        style={{
                          width: '100%',
                          padding: '8px',
                          background: '#008744',
                          border: '2px solid #005a2d',
                          borderRadius: '4px',
                          color: '#FFF',
                          fontFamily: 'var(--font-titan)',
                          fontSize: '0.78rem',
                          cursor: 'pointer'
                        }}
                      >
                        PROPOSE SWAP ⚡
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ACTIVE SKILL CIRCLE CARD */}
            {activeCircle ? (
              <div className="notebook-sheet" style={{ padding: '26px', borderLeft: '14px solid #008744' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Triangle size={20} fill="#008744" color="#008744" />
                    <span style={{ fontFamily: 'var(--font-dela)', fontSize: '1.15rem', color: '#008744' }}>
                      {activeCircle.name.toUpperCase()}
                    </span>
                  </div>
                  <Link to="/circle/details" style={{ fontFamily: 'var(--font-hand)', fontSize: '1.15rem', color: '#1E3A8A', fontWeight: 700 }}>
                    Open string board ➔
                  </Link>
                </div>

                <p style={{ fontSize: '0.88rem', color: '#4B5563', lineHeight: 1.5, marginBottom: '16px' }}>
                  {activeCircle.description}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center' }}>
                  {activeCircle.members.map(m => (
                    <div key={m.id} style={{ background: '#F7F3E3', border: '1px solid #D5CCA8', borderRadius: '4px', padding: '10px 6px' }}>
                      <img src={m.avatar} alt={m.name} style={{ width: 36, height: 36, borderRadius: '50%', marginBottom: '4px' }} />
                      <div style={{ fontFamily: 'var(--font-dela)', fontSize: '0.8rem', color: '#1E3A8A' }}>{m.name}</div>
                      <div style={{ fontSize: '0.7rem', color: '#15803D', fontWeight: 700 }}>Teaches {m.teachesSkill}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="notebook-sheet" style={{ padding: '24px 26px', borderLeft: '14px solid #CA8A04' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Triangle size={18} fill="#CA8A04" color="#CA8A04" />
                    <span style={{ fontFamily: 'var(--font-dela)', fontSize: '1.05rem', color: '#854D0E' }}>
                      TRIANGLE SKILL CIRCLES (3-WAY EXCHANGE)
                    </span>
                  </div>
                  <Link to="/circle/create" style={{ fontFamily: 'var(--font-hand)', fontSize: '1.15rem', color: '#008744', fontWeight: 700 }}>
                    Create circle ➔
                  </Link>
                </div>
                <p style={{ fontSize: '0.88rem', color: '#4B5563', lineHeight: 1.5, margin: '0 0 14px 0' }}>
                  Can’t find a direct 1-to-1 match? Form a 3-student circular exchange: A teaches B, B teaches C, and C teaches A with zero money involved!
                </p>
                <Link to="/circle/create" className="btn-3d-yellow" style={{ display: 'inline-block', padding: '8px 18px', fontSize: '0.8rem' }}>
                  FORM A 3-STUDENT COHORT ⚡
                </Link>
              </div>
            )}
          </div>

          {/* Right Column (Span 4): Upcoming Session, Recent DM & Software Grid */}
          <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* UPCOMING SESSION ENVELOPE / POST-IT */}
            {upcomingSessions.length > 0 ? (
              <div className="yellow-postit" style={{ transform: 'rotate(-1deg)' }}>
                <div style={{ fontFamily: 'var(--font-dela)', fontSize: '0.9rem', color: '#166534', marginBottom: '4px' }}>
                  NEXT UPCOMING SESSION 📅
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#18181B' }}>
                  {upcomingSessions[0].skill}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#4B5563', margin: '4px 0 12px 0' }}>
                  {upcomingSessions[0].date} • Teacher: {upcomingSessions[0].teacher?.name || 'Peer Mentor'}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <a
                    href={upcomingSessions[0].link || '#'}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      flex: 1,
                      padding: '8px',
                      background: '#008744',
                      border: '2px solid #005a2d',
                      borderRadius: '4px',
                      color: '#FFF',
                      fontFamily: 'var(--font-titan)',
                      fontSize: '0.78rem',
                      textAlign: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    JOIN CALL ➔
                  </a>
                </div>
              </div>
            ) : (
              <div className="yellow-postit" style={{ transform: 'rotate(-1deg)' }}>
                <div style={{ fontFamily: 'var(--font-dela)', fontSize: '0.9rem', color: '#166534', marginBottom: '4px' }}>
                  CAMPUS STUDY PLANNER 📅
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#18181B' }}>
                  No upcoming sessions
                </div>
                <div style={{ fontSize: '0.8rem', color: '#4B5563', margin: '4px 0 12px 0' }}>
                  Lock in your first 1:1 or circle swap session to practice together!
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModal('schedule-session')}
                  className="btn-lime"
                  style={{ width: '100%', padding: '8px', fontSize: '0.8rem' }}
                >
                  SCHEDULE SESSION ➔
                </button>
              </div>
            )}

            {/* RECENT DM PREVIEW */}
            <div
              onClick={() => navigate('/chat')}
              className="notebook-sheet"
              style={{ padding: '20px', cursor: 'pointer', borderLeft: '10px solid #1E3A8A' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontFamily: 'var(--font-dela)', fontSize: '0.88rem', color: '#1E3A8A' }}>
                  DIRECT CHAT
                </span>
                <span style={{ fontSize: '0.7rem', color: '#6B7280' }}>Open ➔</span>
              </div>
              {safeChat.length > 0 ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: '#008744',
                    color: '#FFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800
                  }}>
                    💬
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#18181B' }}>
                      Latest Message
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#4B5563', fontStyle: 'italic' }}>
                      "{safeChat[safeChat.length - 1]?.text || 'Active exchange'}"
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: '0.82rem', color: '#4B5563', lineHeight: 1.4 }}>
                  No active chat messages yet. Chat with peer matches about session agendas!
                </div>
              )}
            </div>

            {/* APP TILES GRID (From Image) */}
            <div className="notebook-sheet" style={{ padding: '20px' }}>
              <span className="sticker-badge sticker-badge-soft" style={{ fontSize: '0.7rem', padding: '2px 8px', marginBottom: '10px' }}>
                CAMPUS SOFTWARES
              </span>
              <div className="software-tile-grid" style={{ marginTop: '8px' }}>
                <div className="software-tile" style={{ width: 44, height: 44, fontSize: '1.1rem' }}>⚛️</div>
                <div className="software-tile" style={{ width: 44, height: 44, fontSize: '1.1rem' }}>TS</div>
                <div className="software-tile" style={{ width: 44, height: 44, fontSize: '1.1rem' }}>SQL</div>
                <div className="software-tile" style={{ width: 44, height: 44, fontSize: '1.1rem' }}>Py</div>
                <div className="software-tile" style={{ width: 44, height: 44, fontSize: '1.1rem' }}>Fig</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
