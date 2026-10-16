import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSkillSwap } from '../../app/SkillSwapContext.jsx';
import {
  Triangle,
  MessageSquare,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  LogOut,
  Send,
  Video
} from 'lucide-react';

export const CircleDetailsPage = () => {
  const navigate = useNavigate();
  const { activeCircle, addToast, setActiveModal, currentUser } = useSkillSwap();

  const userFirstName = currentUser?.name ? currentUser.name.split(' ')[0] : 'You';
  const userTeachingSkill = currentUser?.teaching?.[0] || 'Skill';
  const userLearningSkill = currentUser?.learning?.[0] || 'Skill';
  const completedCount = (activeCircle?.sessions || []).filter(s => s?.status === 'Completed').length;

  const handleLeave = () => {
    if (window.confirm('Are you sure you want to leave this circle? The other two members will be notified.')) {
      addToast('Left Skill Circle.', 'info');
      navigate('/dashboard');
    }
  };

  if (!activeCircle) {
    return (
      <div className="scrapbook-desk">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="notebook-sheet" style={{ padding: '60px 36px', textAlign: 'center', position: 'relative' }}>
            <div className="binder-clip-top" />
            <div className="pushpin-3d pushpin-red" style={{ top: '-12px', left: '50%', transform: 'translateX(-50%)' }} />
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '12px' }}>🔺</span>
            <h2 style={{ fontFamily: 'var(--font-titan)', fontSize: '2.2rem', color: '#18181B', marginBottom: '8px' }}>
              NO ACTIVE SKILL CIRCLE
            </h2>
            <p style={{ fontFamily: 'var(--font-hand)', fontSize: '1.35rem', color: '#047857', fontWeight: 700, maxWidth: '480px', margin: '0 auto 24px auto', lineHeight: 1.4 }}>
              You haven’t formed a 3-person triangle circle yet. Start a closed exchange loop: A teaches B, B teaches C, and C teaches A!
            </p>
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/circle/create" className="btn-3d-green" style={{ padding: '12px 26px', fontSize: '0.9rem' }}>
                CREATE A NEW CIRCLE ➔
              </Link>
              <Link to="/circle/suggestions" className="btn-3d-yellow" style={{ padding: '12px 24px', fontSize: '0.9rem' }}>
                EXPLORE CIRCLE SUGGESTIONS
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="scrapbook-desk">
      <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
        
        {/* Top Control Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="sticker-badge sticker-badge-exp" style={{ fontSize: '0.8rem', padding: '4px 14px' }}>
              TRIANGLE SKILL CIRCLE
            </span>
            <span style={{ color: '#FDE047', fontFamily: 'var(--font-hand)', fontSize: '1.25rem', fontWeight: 700 }}>
              Circular Learning Map ✍️
            </span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => navigate('/circle/chat')}
              style={{
                padding: '10px 18px',
                background: '#1E3A8A',
                border: '2px solid #172554',
                color: '#FFF',
                fontFamily: 'var(--font-titan)',
                fontSize: '0.82rem',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <MessageSquare size={15} /> CIRCLE CHAT (3)
            </button>
            <button
              onClick={() => navigate('/circle/sessions')}
              style={{
                padding: '10px 20px',
                background: '#008744',
                border: '2px solid #005a2d',
                color: '#FFF',
                fontFamily: 'var(--font-titan)',
                fontSize: '0.82rem',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 0 #005a2d'
              }}
            >
              <Calendar size={15} /> SESSIONS ({completedCount}/3)
            </button>
          </div>
        </div>

        {/* MAIN NOTEBOOK SHEET: TACTILE TRIANGLE STRING BOARD */}
        <div className="notebook-sheet" style={{ padding: '45px 36px 50px 42px', marginBottom: '28px' }}>
          
          <div className="binder-clip-top" />

          {/* Header Title with Bold Scrapbook Type */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
            <div>
              <div style={{
                fontFamily: 'var(--font-dela)',
                fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
                color: '#1E3A8A',
                lineHeight: 1.1
              }}>
                {activeCircle.name.toUpperCase()}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                <span className="sticker-badge sticker-badge-cert" style={{ fontSize: '0.75rem', padding: '3px 10px' }}>
                  {activeCircle.compatibility}
                </span>
                <span style={{ fontFamily: 'var(--font-hand)', fontSize: '1.25rem', color: '#15803D', fontWeight: 700 }}>
                  Three peers • Zero tuition • 100% mastery
                </span>
              </div>
            </div>

            {/* Manila Envelope Note */}
            <div className="manila-envelope" style={{ padding: '10px 14px', width: '240px', transform: 'rotate(2deg)' }}>
              <div className="envelope-letter" style={{ fontSize: '0.75rem', padding: '8px 10px' }}>
                <strong style={{ color: '#1E3A8A' }}>Circular Rule:</strong>
                <div>A teaches B ➔ B teaches C ➔ C teaches A</div>
              </div>
            </div>
          </div>

          {/* TACTILE STRING BOARD TRIANGLE CANVAS */}
          <div style={{
            position: 'relative',
            background: '#F7F3E3',
            border: '2px dashed #C5BC98',
            borderRadius: '8px',
            padding: '30px 20px',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.06)',
            marginBottom: '32px'
          }}>
            
            <svg viewBox="0 0 520 360" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
              <defs>
                {/* Yarn string shadows and glow */}
                <filter id="yarnShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="rgba(0,0,0,0.35)" />
                </filter>
              </defs>

              {/* Physical Yarn String 1: User (260, 60) -> Rahul (90, 290) [Forest Green Yarn] */}
              <line
                x1="240" y1="75"
                x2="110" y2="280"
                stroke="#008744"
                strokeWidth="5"
                strokeDasharray="10 6"
                filter="url(#yarnShadow)"
              />

              {/* Physical Yarn String 2: Rahul (90, 290) -> Anuj (430, 290) [Golden Yellow Yarn] */}
              <line
                x1="120" y1="290"
                x2="400" y2="290"
                stroke="#D97706"
                strokeWidth="5"
                strokeDasharray="10 6"
                filter="url(#yarnShadow)"
              />

              {/* Physical Yarn String 3: Anuj (430, 290) -> User (260, 60) [Navy Blue Yarn] */}
              <line
                x1="410" y1="280"
                x2="280" y2="75"
                stroke="#1E3A8A"
                strokeWidth="5"
                strokeDasharray="10 6"
                filter="url(#yarnShadow)"
              />
            </svg>

            {/* NODE 1: USER (Top) - Pinned Polaroid with 3D Red Pushpin */}
            <div style={{
              position: 'absolute',
              top: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              textAlign: 'center',
              zIndex: 30
            }}>
              <div className="polaroid-card" style={{ padding: '6px 6px 18px 6px', width: '90px', margin: '0 auto', transform: 'rotate(-2deg)' }}>
                <div className="pushpin-3d pushpin-red" style={{ top: '-10px', left: '34px' }} />
                <img
                  src={currentUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80"}
                  alt={currentUser?.name || "User"}
                  style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover' }}
                />
              </div>
              <div style={{ fontFamily: 'var(--font-dela)', fontSize: '0.85rem', color: '#1E3A8A', marginTop: '6px' }}>
                {userFirstName} (You)
              </div>
              <span className="ripped-tag ripped-blue" style={{ fontSize: '0.7rem', padding: '3px 8px' }}>
                Teaches {userTeachingSkill} ➔
              </span>
            </div>

            {/* NODE 2: RAHUL MEHTA (Bottom-Left) - Pinned Polaroid with 3D Yellow Pushpin */}
            <div style={{
              position: 'absolute',
              bottom: '15px',
              left: '5%',
              textAlign: 'center',
              zIndex: 30
            }}>
              <div className="polaroid-card" style={{ padding: '6px 6px 18px 6px', width: '90px', margin: '0 auto', transform: 'rotate(3deg)' }}>
                <div className="pushpin-3d pushpin-yellow" style={{ top: '-10px', left: '34px' }} />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80"
                  alt="Rahul"
                  style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover' }}
                />
              </div>
              <div style={{ fontFamily: 'var(--font-dela)', fontSize: '0.85rem', color: '#1E3A8A', marginTop: '6px' }}>
                Rahul Mehta
              </div>
              <span className="ripped-tag ripped-green" style={{ fontSize: '0.7rem', padding: '3px 8px' }}>
                Teaches Python ➔
              </span>
            </div>

            {/* NODE 3: ANUJ VERMA (Bottom-Right) - Pinned Polaroid with 3D Cyan Pushpin */}
            <div style={{
              position: 'absolute',
              bottom: '15px',
              right: '5%',
              textAlign: 'center',
              zIndex: 30
            }}>
              <div className="polaroid-card" style={{ padding: '6px 6px 18px 6px', width: '90px', margin: '0 auto', transform: 'rotate(-3deg)' }}>
                <div className="pushpin-3d pushpin-cyan" style={{ top: '-10px', left: '34px' }} />
                <img
                  src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80"
                  alt="Anuj"
                  style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover' }}
                />
              </div>
              <div style={{ fontFamily: 'var(--font-dela)', fontSize: '0.85rem', color: '#1E3A8A', marginTop: '6px' }}>
                Anuj Verma
              </div>
              <span className="ripped-tag ripped-orange" style={{ fontSize: '0.7rem', padding: '3px 8px' }}>
                Teaches SQL ➔
              </span>
            </div>
          </div>

          {/* LOWER SECTION: YELLOW POST-IT ROADMAP & MEMBER CARDS */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '24px',
            alignItems: 'flex-start'
          }}>
            {/* Yellow Post-it: Session Checklist */}
            <div style={{ gridColumn: 'span 5' }}>
              <span className="sticker-badge sticker-badge-exp" style={{ marginBottom: '12px' }}>
                SESSION CHECKLIST
              </span>

              <div className="yellow-postit" style={{ transform: 'rotate(-1.5deg)', marginTop: '8px' }}>
                <div style={{ fontFamily: 'var(--font-dela)', fontSize: '0.88rem', color: '#166534', marginBottom: '8px' }}>
                  CIRCULAR EXCHANGE STATUS
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>1. Anuj ➔ {userFirstName} ({userLearningSkill})</span>
                    <span style={{ color: activeCircle?.sessions?.[0]?.status === 'Completed' ? '#15803D' : '#D97706', fontWeight: 800 }}>
                      {activeCircle?.sessions?.[0]?.status === 'Completed' ? '✓ DONE' : '● PENDING'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>2. Rahul ➔ Anuj (Python)</span>
                    <span style={{ color: activeCircle?.sessions?.[1]?.status === 'Completed' ? '#15803D' : '#D97706', fontWeight: 800 }}>
                      {activeCircle?.sessions?.[1]?.status === 'Completed' ? '✓ DONE' : '● PENDING'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>3. {userFirstName} ➔ Rahul ({userTeachingSkill})</span>
                    <span style={{ color: activeCircle?.sessions?.[2]?.status === 'Completed' ? '#15803D' : '#D97706', fontWeight: 800 }}>
                      {activeCircle?.sessions?.[2]?.status === 'Completed' ? '✓ DONE' : '● PENDING'}
                    </span>
                  </div>
                </div>

                <div style={{ marginTop: '14px', borderTop: '1px dashed #CA8A04', paddingTop: '8px', fontSize: '0.78rem', color: '#713F12' }}>
                  When all 3 mark done, celebration certificate unlocks!
                </div>
              </div>
            </div>

            {/* Member Details Cards */}
            <div style={{ gridColumn: 'span 7' }}>
              <span className="sticker-badge sticker-badge-edu" style={{ marginBottom: '12px' }}>
                TRIO DIRECTORY
              </span>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                {activeCircle.members.map(member => (
                  <div
                    key={member.id}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: '4px',
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={member.avatar} alt={member.name} style={{ width: 40, height: 40, borderRadius: '50%' }} />
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#1E3A8A' }}>
                          {member.fullName}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                          {member.role}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span className="ripped-tag ripped-green" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                        Teaches {member.teachesSkill}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
