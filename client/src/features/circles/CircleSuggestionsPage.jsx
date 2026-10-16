import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSkillSwap } from '../../app/SkillSwapContext.jsx';
import {
  Triangle,
  Sparkles,
  Send,
  CheckCircle2,
  Users,
  ArrowRight,
  ShieldCheck,
  Zap,
  Star
} from 'lucide-react';

export const CircleSuggestionsPage = () => {
  const navigate = useNavigate();
  const { addToast, currentUser } = useSkillSwap();
  const [invitesSent, setInvitesSent] = useState(false);

  const userFirstName = currentUser?.name ? currentUser.name.split(' ')[0] : 'You';
  const userFullName = currentUser?.name || 'You';
  const teachSkill = currentUser?.teaching?.[0] || 'Full Stack';
  const learnSkill = currentUser?.learning?.[0] || 'SQL';

  const handleSendInvites = () => {
    setInvitesSent(true);
    addToast('Circle invites dispatched to Anuj & Rahul! 🚀', 'success');
    setTimeout(() => {
      navigate('/circle/details');
    }, 1500);
  };

  return (
    <div className="scrapbook-desk">
      <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
        <div className="notebook-sheet" style={{ padding: '40px 36px', position: 'relative' }}>
          {/* Top Chrome Binder Clip */}
          <div className="binder-clip-top" />

          {/* Top Header */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="sticker-badge sticker-badge-cert" style={{ fontSize: '0.72rem', padding: '3px 12px' }}>
                <Sparkles size={12} style={{ marginRight: '4px' }} /> GRAPH MATCH ALGORITHM
              </span>
              <span className="sticker-badge sticker-badge-exp" style={{ fontSize: '0.72rem', padding: '3px 12px' }}>
                96% CIRCLE SYNERGY 🔥
              </span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-titan)', fontSize: 'clamp(2rem, 3.5vw, 2.7rem)', color: '#18181B', letterSpacing: '0.02em', margin: '4px 0 6px 0' }}>
              TRIANGLE CIRCLE <span style={{ color: '#008744' }}>SUGGESTION</span>
            </h1>
            <p style={{ fontFamily: 'var(--font-hand)', fontSize: '1.25rem', color: '#047857', fontWeight: 700, maxWidth: '620px', margin: '0 auto' }}>
              Three students solve each other's skill deficits in an optimal closed circular exchange ✍️
            </p>
          </div>

          {/* CENTRAL DETECTIVE BLUEPRINT BOARD */}
          <div style={{
            background: '#FFFDF5',
            border: '2px solid #27272A',
            borderRadius: '16px',
            padding: '32px 20px',
            boxShadow: '4px 4px 0px rgba(0,0,0,0.15)',
            marginBottom: '32px',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '16px',
              left: '20px',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-titan)',
              color: '#047857',
              letterSpacing: '0.05em',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Triangle size={14} fill="#047857" /> 3-WAY EXCHANGE LOOP BLUEPRINT
            </div>

            {/* SVG Canvas for Detective String Board */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '580px', margin: '20px auto 0 auto' }}>
              <svg viewBox="0 0 520 380" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
                {/* Red Yarn Lines with drop shadows */}
                <line
                  x1="260" y1="90"
                  x2="130" y2="290"
                  stroke="#DC2626"
                  strokeWidth="4"
                  strokeDasharray="6 6"
                  style={{ filter: 'drop-shadow(2px 3px 2px rgba(0,0,0,0.2))' }}
                />

                <line
                  x1="130" y1="290"
                  x2="390" y2="290"
                  stroke="#DC2626"
                  strokeWidth="4"
                  strokeDasharray="6 6"
                  style={{ filter: 'drop-shadow(2px 3px 2px rgba(0,0,0,0.2))' }}
                />

                <line
                  x1="390" y1="290"
                  x2="260" y2="90"
                  stroke="#DC2626"
                  strokeWidth="4"
                  strokeDasharray="6 6"
                  style={{ filter: 'drop-shadow(2px 3px 2px rgba(0,0,0,0.2))' }}
                />

                {/* User Polaroid Node (Top) */}
                <g transform="translate(260, 80)">
                  <foreignObject x="-44" y="-44" width="88" height="88">
                    <div style={{
                      background: '#FFF',
                      padding: '4px 4px 10px 4px',
                      border: '2px solid #27272A',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.25)',
                      transform: 'rotate(-2deg)',
                      position: 'relative'
                    }}>
                      <div className="pushpin-3d pushpin-red" style={{ top: '-10px', left: '50%', transform: 'translateX(-50%)', width: 20, height: 20 }} />
                      <img
                        src={currentUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80"}
                        alt={userFullName}
                        style={{ width: '100%', height: '54px', objectFit: 'cover', display: 'block' }}
                      />
                    </div>
                  </foreignObject>
                </g>

                {/* Rahul Polaroid Node (Bottom Left) */}
                <g transform="translate(130, 280)">
                  <foreignObject x="-44" y="-44" width="88" height="88">
                    <div style={{
                      background: '#FFF',
                      padding: '4px 4px 10px 4px',
                      border: '2px solid #27272A',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.25)',
                      transform: 'rotate(3deg)',
                      position: 'relative'
                    }}>
                      <div className="pushpin-3d pushpin-yellow" style={{ top: '-10px', left: '50%', transform: 'translateX(-50%)', width: 20, height: 20 }} />
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80"
                        alt="Rahul"
                        style={{ width: '100%', height: '54px', objectFit: 'cover', display: 'block' }}
                      />
                    </div>
                  </foreignObject>
                </g>

                {/* Anuj Polaroid Node (Bottom Right) */}
                <g transform="translate(390, 280)">
                  <foreignObject x="-44" y="-44" width="88" height="88">
                    <div style={{
                      background: '#FFF',
                      padding: '4px 4px 10px 4px',
                      border: '2px solid #27272A',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.25)',
                      transform: 'rotate(-4deg)',
                      position: 'relative'
                    }}>
                      <div className="pushpin-3d pushpin-cyan" style={{ top: '-10px', left: '50%', transform: 'translateX(-50%)', width: 20, height: 20 }} />
                      <img
                        src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80"
                        alt="Anuj"
                        style={{ width: '100%', height: '54px', objectFit: 'cover', display: 'block' }}
                      />
                    </div>
                  </foreignObject>
                </g>
              </svg>

              {/* Floating Flow Pills */}
              <div style={{
                position: 'absolute',
                top: '-5px',
                left: '50%',
                transform: 'translateX(-50%)',
                textAlign: 'center'
              }}>
                <div style={{ fontFamily: 'var(--font-titan)', fontSize: '0.95rem', color: '#18181B' }}>{userFirstName} (You)</div>
                <span className="ripped-tag ripped-green" style={{ fontSize: '0.72rem', padding: '2px 10px', marginTop: '2px' }}>
                  Teaches {teachSkill} ➔
                </span>
              </div>

              <div style={{
                position: 'absolute',
                bottom: '-28px',
                left: '10%',
                textAlign: 'center'
              }}>
                <div style={{ fontFamily: 'var(--font-titan)', fontSize: '0.95rem', color: '#18181B' }}>Rahul</div>
                <span className="ripped-tag ripped-blue" style={{ fontSize: '0.72rem', padding: '2px 10px', marginTop: '2px' }}>
                  Teaches Python ➔
                </span>
              </div>

              <div style={{
                position: 'absolute',
                bottom: '-28px',
                right: '10%',
                textAlign: 'center'
              }}>
                <div style={{ fontFamily: 'var(--font-titan)', fontSize: '0.95rem', color: '#18181B' }}>Anuj</div>
                <span className="ripped-tag ripped-yellow" style={{ fontSize: '0.72rem', padding: '2px 10px', marginTop: '2px' }}>
                  Teaches SQL ➔
                </span>
              </div>
            </div>

            {/* Circular Explanation Washi Tape Flow */}
            <div style={{
              marginTop: '56px',
              background: '#FEF9C3',
              border: '2px dashed #CA8A04',
              borderRadius: '10px',
              padding: '16px 20px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '14px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="sticker-badge sticker-badge-cert" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>HOP 1</span>
                <span style={{ fontSize: '0.85rem', color: '#18181B', fontWeight: 600 }}>
                  <strong>{userFirstName}</strong> teaches <strong>{teachSkill}</strong> ➔ Rahul
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="sticker-badge sticker-badge-exp" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>HOP 2</span>
                <span style={{ fontSize: '0.85rem', color: '#18181B', fontWeight: 600 }}>
                  <strong>Rahul</strong> teaches <strong>Python</strong> ➔ Anuj
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="sticker-badge sticker-badge-edu" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>HOP 3</span>
                <span style={{ fontSize: '0.85rem', color: '#18181B', fontWeight: 600 }}>
                  <strong>Anuj</strong> teaches <strong>{learnSkill}</strong> ➔ {userFirstName}
                </span>
              </div>
            </div>
          </div>

          {/* MEMBER CARDS */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            marginBottom: '32px'
          }}>
            {/* Member 1: User */}
            <div className="scrapbook-paper-card" style={{ padding: '22px' }}>
              <div className="pushpin-3d pushpin-red" style={{ top: '-10px', right: '14px', width: 22, height: 22 }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{
                  background: '#FFF',
                  padding: '2px 2px 6px 2px',
                  border: '1.5px solid #27272A',
                  transform: 'rotate(-2deg)'
                }}>
                  <img src={currentUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80"} alt={userFullName} style={{ width: 44, height: 44, objectFit: 'cover' }} />
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-titan)', fontSize: '1.05rem', color: '#18181B' }}>{userFullName.toUpperCase()} (YOU)</div>
                  <div style={{ fontFamily: 'var(--font-hand)', fontSize: '1rem', color: '#047857', fontWeight: 700 }}>{currentUser.college || 'Campus'} • {currentUser.branch || 'Member'}</div>
                </div>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#007A3D', fontWeight: 800, marginBottom: '4px' }}>
                TEACHING: {teachSkill}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#0284C7', fontWeight: 800, marginBottom: '12px' }}>
                LEARNING: {learnSkill}
              </div>
              <span className="sticker-badge sticker-badge-exp" style={{ width: '100%', justifyContent: 'center', fontSize: '0.72rem' }}>
                ✓ READY & INITIATING
              </span>
            </div>

            {/* Member 2: Anuj */}
            <div className="scrapbook-paper-card" style={{ padding: '22px' }}>
              <div className="pushpin-3d pushpin-cyan" style={{ top: '-10px', right: '14px', width: 22, height: 22 }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{
                  background: '#FFF',
                  padding: '2px 2px 6px 2px',
                  border: '1.5px solid #27272A',
                  transform: 'rotate(2deg)'
                }}>
                  <img src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&auto=format&fit=crop&q=80" alt="Anuj" style={{ width: 44, height: 44, objectFit: 'cover' }} />
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-titan)', fontSize: '1.05rem', color: '#18181B' }}>ANUJ VERMA</div>
                  <div style={{ fontFamily: 'var(--font-hand)', fontSize: '1rem', color: '#047857', fontWeight: 700 }}>IIT Delhi • 3rd Year</div>
                </div>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#0284C7', fontWeight: 800, marginBottom: '4px' }}>
                TEACHING: SQL & PostgreSQL
              </div>
              <div style={{ fontSize: '0.82rem', color: '#7C3AED', fontWeight: 800, marginBottom: '12px' }}>
                LEARNING: Python Automation
              </div>
              <span className="sticker-badge sticker-badge-cert" style={{ width: '100%', justifyContent: 'center', fontSize: '0.72rem' }}>
                {invitesSent ? '⚡ INVITE DISPATCHED' : 'MATCHED • READY FOR INVITE'}
              </span>
            </div>

            {/* Member 3: Rahul */}
            <div className="scrapbook-paper-card" style={{ padding: '22px' }}>
              <div className="pushpin-3d pushpin-yellow" style={{ top: '-10px', right: '14px', width: 22, height: 22 }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{
                  background: '#FFF',
                  padding: '2px 2px 6px 2px',
                  border: '1.5px solid #27272A',
                  transform: 'rotate(-3deg)'
                }}>
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80" alt="Rahul" style={{ width: 44, height: 44, objectFit: 'cover' }} />
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-titan)', fontSize: '1.05rem', color: '#18181B' }}>RAHUL MEHTA</div>
                  <div style={{ fontFamily: 'var(--font-hand)', fontSize: '1rem', color: '#047857', fontWeight: 700 }}>IIIT Hyderabad • 2nd Year</div>
                </div>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#EA580C', fontWeight: 800, marginBottom: '4px' }}>
                TEACHING: Python Pipelines
              </div>
              <div style={{ fontSize: '0.82rem', color: '#007A3D', fontWeight: 800, marginBottom: '12px' }}>
                LEARNING: Full Stack
              </div>
              <span className="sticker-badge sticker-badge-edu" style={{ width: '100%', justifyContent: 'center', fontSize: '0.72rem' }}>
                {invitesSent ? '⚡ INVITE DISPATCHED' : 'MATCHED • READY FOR INVITE'}
              </span>
            </div>
          </div>

          {/* CTA BUTTON */}
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={handleSendInvites}
              className="btn-3d-green"
              style={{ padding: '14px 44px', fontSize: '1rem' }}
            >
              <Send size={18} /> SEND CIRCLE INVITES TO BOTH PEERS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
