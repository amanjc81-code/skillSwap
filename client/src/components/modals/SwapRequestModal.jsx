import React, { useState } from 'react';
import { useSkillSwap } from '../../app/SkillSwapContext.jsx';
import { X, ArrowRightLeft, Sparkles, CheckCircle2, Send } from 'lucide-react';

export const SwapRequestModal = () => {
  const { activeModal, setActiveModal, modalPayload, sendSwapRequest, currentUser } = useSkillSwap();
  const [teachSkill, setTeachSkill] = useState(currentUser.teaching?.[0] || '');
  const [learnSkill, setLearnSkill] = useState(modalPayload?.canTeach?.[0] || '');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  if (activeModal !== 'swap-request') return null;

  const targetStudent = modalPayload || {
    id: 'anuj-02',
    name: 'Anuj Verma',
    college: 'IIT Delhi',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&auto=format&fit=crop&q=80',
    canTeach: ['SQL', 'PostgreSQL', 'Database Design'],
    wantsToLearn: ['React', 'Full Stack', 'Next.js']
  };

  const handleSend = () => {
    setIsSent(true);
    setTimeout(() => {
      sendSwapRequest({
        student: targetStudent,
        teachSkill,
        learnSkill,
        message
      });
      setIsSent(false);
      setActiveModal(null);
    }, 1200);
  };

  return (
    <div className="scrapbook-modal-backdrop">
      <div className="scrapbook-modal-sheet" style={{ maxWidth: '560px' }}>
        {/* Red Pushpin */}
        <div className="pushpin-3d pushpin-red" style={{ top: '-10px', left: '24px' }} />

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

        {isSent ? (
          <div style={{ textAlign: 'center', padding: '30px 10px' }}>
            <div className="yellow-postit" style={{ maxWidth: '400px', margin: '0 auto', padding: '30px 20px', border: '2px solid #27272A' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#008744',
                color: '#FFF',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 0 #005a2d',
                marginBottom: '14px'
              }}>
                <CheckCircle2 size={36} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-titan)', fontSize: '1.6rem', color: '#18181B', marginBottom: '6px' }}>
                REQUEST DISPATCHED ⚡
              </h3>
              <p style={{ fontFamily: 'var(--font-hand)', fontSize: '1.2rem', color: '#78350F', fontWeight: 700, margin: '0 auto' }}>
                Waiting for {targetStudent.name} to accept. We will notify you once they match back! ✍️
              </p>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="sticker-badge sticker-badge-cert" style={{ fontSize: '0.72rem', padding: '2px 10px' }}>
                <ArrowRightLeft size={12} style={{ marginRight: '4px' }} /> 1-TO-1 SKILL SWAP
              </span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-titan)', fontSize: '1.7rem', color: '#18181B', letterSpacing: '0.02em', margin: '2px 0 4px 0' }}>
              SWAP SKILLS WITH <span style={{ color: '#008744' }}>{targetStudent.name.toUpperCase()}</span>
            </h2>
            <p style={{ fontFamily: 'var(--font-hand)', fontSize: '1.15rem', color: '#047857', fontWeight: 700, margin: '0 0 18px 0' }}>
              No money involved. Teach what you excel at, learn what you need ✍️
            </p>

            {/* Live Exchange Preview Paper Card */}
            <div style={{
              background: '#FEF9C3',
              border: '2px dashed #CA8A04',
              borderRadius: '8px',
              padding: '14px',
              marginBottom: '18px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
              <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-titan)', color: '#78350F', marginBottom: '10px' }}>
                LIVE EXCHANGE PREVIEW
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.88rem', flexWrap: 'wrap', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img src={currentUser.avatar} alt="You" style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid #27272A' }} />
                    <span style={{ fontWeight: 800, color: '#18181B' }}>{currentUser.name} (You)</span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-hand)', fontSize: '1rem', fontWeight: 700, color: '#78350F' }}>teaches</span>
                  <span className="ripped-tag ripped-green" style={{ padding: '2px 8px', fontSize: '0.72rem' }}>{teachSkill}</span>
                  <span style={{ color: '#52525B', fontSize: '0.8rem', fontWeight: 700 }}>➔ {targetStudent.name.split(' ')[0]}</span>
                </div>

                <div style={{ height: '1px', background: '#EAB308' }} />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.88rem', flexWrap: 'wrap', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img src={targetStudent.avatar} alt={targetStudent.name} style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid #27272A' }} />
                    <span style={{ fontWeight: 800, color: '#18181B' }}>{targetStudent.name}</span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-hand)', fontSize: '1rem', fontWeight: 700, color: '#78350F' }}>teaches</span>
                  <span className="ripped-tag ripped-blue" style={{ padding: '2px 8px', fontSize: '0.72rem' }}>{learnSkill}</span>
                  <span style={{ color: '#52525B', fontSize: '0.8rem', fontWeight: 700 }}>➔ You</span>
                </div>
              </div>
            </div>

            {/* Skill Selectors */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-titan)', fontSize: '0.8rem', color: '#18181B', marginBottom: '6px' }}>
                  YOU TEACH (YOUR SKILL)
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {currentUser.teaching && currentUser.teaching.length > 0 ? (
                    currentUser.teaching.map(skill => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => setTeachSkill(skill)}
                        style={{
                          padding: '5px 12px',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontFamily: 'var(--font-titan)',
                          background: teachSkill === skill ? '#008744' : '#FFFFFF',
                          color: teachSkill === skill ? '#FFFFFF' : '#18181B',
                          border: '2px solid #27272A',
                          boxShadow: teachSkill === skill ? '0 3px 0 #005a2d' : '1px 2px 0px rgba(0,0,0,0.1)',
                          cursor: 'pointer'
                        }}
                      >
                        {skill}
                      </button>
                    ))
                  ) : (
                    <input
                      type="text"
                      value={teachSkill}
                      onChange={e => setTeachSkill(e.target.value)}
                      placeholder="Skill you can teach..."
                      className="scrapbook-input"
                      style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                    />
                  )}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-titan)', fontSize: '0.8rem', color: '#18181B', marginBottom: '6px' }}>
                  YOU LEARN (THEIR SKILL)
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {(targetStudent.canTeach || ['SQL', 'PostgreSQL']).map(skill => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => setLearnSkill(skill)}
                      style={{
                        padding: '5px 12px',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontFamily: 'var(--font-titan)',
                        background: learnSkill === skill ? '#0284C7' : '#FFFFFF',
                        color: learnSkill === skill ? '#FFFFFF' : '#18181B',
                        border: '2px solid #27272A',
                        boxShadow: learnSkill === skill ? '0 3px 0 #075985' : '1px 2px 0px rgba(0,0,0,0.1)',
                        cursor: 'pointer'
                      }}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Note Input */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontFamily: 'var(--font-titan)', fontSize: '0.8rem', color: '#18181B', marginBottom: '6px' }}>
                SWAP PITCH MESSAGE
              </label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={3}
                className="scrapbook-input"
                placeholder="Suggest a fun topic or your upcoming project goal..."
                style={{ resize: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="btn-3d-yellow"
                style={{ padding: '8px 18px', fontSize: '0.82rem' }}
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleSend}
                className="btn-3d-green"
                style={{ padding: '8px 22px', fontSize: '0.85rem' }}
              >
                <Send size={15} /> SEND REQUEST
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
