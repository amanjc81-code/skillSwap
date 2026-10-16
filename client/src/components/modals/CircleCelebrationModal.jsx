import React from 'react';
import { useSkillSwap } from '../../app/SkillSwapContext.jsx';
import { X, Award, Sparkles, Check, Users, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CircleCelebrationModal = () => {
  const { activeModal, setActiveModal, activeCircle, currentUser } = useSkillSwap();
  const navigate = useNavigate();

  const userFirstName = currentUser?.name ? currentUser.name.split(' ')[0] : 'You';
  const teachSkill = currentUser?.teaching?.[0] || 'Full Stack';
  const learnSkill = currentUser?.learning?.[0] || 'SQL';

  if (activeModal !== 'circle-celebration') return null;

  return (
    <div className="scrapbook-modal-backdrop">
      <div className="scrapbook-modal-sheet" style={{ maxWidth: '580px', textAlign: 'center', padding: '38px 30px' }}>
        {/* Red Pushpin */}
        <div className="pushpin-3d pushpin-red" style={{ top: '-10px', left: '50%', transform: 'translateX(-50%)' }} />

        {/* Close Button */}
        <button
          onClick={() => setActiveModal(null)}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: '#F4F4F5',
            border: '2px solid #27272A',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '1px 2px 0px rgba(0,0,0,0.1)'
          }}
        >
          <X size={18} color="#18181B" />
        </button>

        {/* Celebration Trophy Badge */}
        <div style={{
          width: '84px',
          height: '84px',
          borderRadius: '50%',
          background: '#008744',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          boxShadow: '0 5px 0 #005a2d, 0 8px 16px rgba(0,0,0,0.25)',
          marginBottom: '16px'
        }}>
          <Award size={48} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
          <span className="sticker-badge sticker-badge-cert" style={{ fontSize: '0.75rem', padding: '3px 14px' }}>
            <Sparkles size={13} style={{ marginRight: '4px' }} /> GRADUATION CERTIFICATE
          </span>
        </div>

        <h1 style={{ fontFamily: 'var(--font-titan)', fontSize: '2.4rem', color: '#18181B', letterSpacing: '0.02em', margin: '4px 0 6px 0' }}>
          CIRCLE COMPLETE 🎉
        </h1>
        <p style={{
          fontSize: '1.35rem',
          fontFamily: 'var(--font-marker)',
          color: '#008744',
          margin: '0 0 22px 0'
        }}>
          Three skills exchanged. Zero money spent.
        </p>

        {/* Summary Washi Tape Card */}
        <div style={{
          background: '#FEF9C3',
          border: '2px dashed #CA8A04',
          borderRadius: '10px',
          padding: '18px 20px',
          marginBottom: '26px',
          textAlign: 'left',
          boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
        }}>
          <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-titan)', color: '#78350F', marginBottom: '12px' }}>
            EXCHANGE ACHIEVEMENTS & VERIFICATION
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.88rem', flexWrap: 'wrap', gap: '6px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#18181B' }}>
                <Check size={16} color="#008744" strokeWidth={3} /> Anuj taught {learnSkill} to {userFirstName}
              </span>
              <span className="ripped-tag ripped-green" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>Mastered 100%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.88rem', flexWrap: 'wrap', gap: '6px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#18181B' }}>
                <Check size={16} color="#0284C7" strokeWidth={3} /> Rahul taught Python to Anuj
              </span>
              <span className="ripped-tag ripped-blue" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>Mastered 100%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.88rem', flexWrap: 'wrap', gap: '6px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#18181B' }}>
                <Check size={16} color="#7C3AED" strokeWidth={3} /> {userFirstName} taught {teachSkill} to Rahul
              </span>
              <span className="ripped-tag ripped-yellow" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>Mastered 100%</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              setActiveModal(null);
              navigate('/circle/details');
            }}
            className="btn-3d-yellow"
            style={{ padding: '10px 22px', fontSize: '0.85rem' }}
          >
            VIEW CIRCLE RECAP
          </button>
          <button
            onClick={() => {
              setActiveModal(null);
              navigate('/circle/create');
            }}
            className="btn-3d-green"
            style={{ padding: '10px 24px', fontSize: '0.85rem' }}
          >
            START ANOTHER CIRCLE <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
