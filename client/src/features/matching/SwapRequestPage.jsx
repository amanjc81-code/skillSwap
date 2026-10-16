import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSkillSwap } from '../../app/SkillSwapContext.jsx';
import {
  ArrowRightLeft,
  Sparkles,
  Send,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export const SwapRequestPage = () => {
  const navigate = useNavigate();
  const { currentUser, sendSwapRequest, students } = useSkillSwap();

  const targetStudent = students[0]; // First directory student
  const [teachSkill, setTeachSkill] = useState(currentUser.teaching?.[0] || '');
  const [learnSkill, setLearnSkill] = useState(targetStudent?.canTeach?.[0] || '');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSend = () => {
    setIsSent(true);
    setTimeout(() => {
      sendSwapRequest({
        student: targetStudent,
        teachSkill,
        learnSkill,
        message
      });
      setTimeout(() => {
        navigate('/inbox');
      }, 1500);
    }, 1000);
  };

  if (!targetStudent) {
    return (
      <div className="scrapbook-desk">
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div className="notebook-sheet" style={{ padding: '60px 36px', textAlign: 'center', position: 'relative' }}>
            <div className="binder-clip-top" />
            <div className="pushpin-3d pushpin-red" style={{ top: '-12px', left: '50%', transform: 'translateX(-50%)' }} />
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '12px' }}>🤝</span>
            <h2 style={{ fontFamily: 'var(--font-titan)', fontSize: '2.2rem', color: '#18181B', marginBottom: '8px' }}>
              NO PARTNER SELECTED
            </h2>
            <p style={{ fontFamily: 'var(--font-hand)', fontSize: '1.3rem', color: '#047857', fontWeight: 700, maxWidth: '440px', margin: '0 auto 24px auto', lineHeight: 1.4 }}>
              Select a peer student from Find Matches or Student Directory to propose a direct skill swap!
            </p>
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
              <button onClick={() => navigate('/match')} className="btn-3d-green" style={{ padding: '12px 26px', fontSize: '0.9rem' }}>
                BROWSE PEER MATCHES ➔
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="scrapbook-desk">
      <div style={{ maxWidth: '840px', margin: '0 auto', position: 'relative' }}>
        
        {/* Top Zine Badge */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px' }}>
          <div style={{
            background: '#FEF08A',
            border: '2px solid #EAB308',
            borderRadius: '4px',
            padding: '5px 16px',
            transform: 'rotate(-1deg)',
            boxShadow: '0 6px 14px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '1rem' }}>📌</span>
            <span style={{ fontFamily: 'var(--font-dela)', fontSize: '0.8rem', color: '#854D0E' }}>
              CAMPUS PROPOSAL NOTE • DIRECT 1-TO-1 MUTUAL LEARNING CONTRACT
            </span>
          </div>
        </div>

        {/* Notebook Sheet */}
        <div className="notebook-sheet" style={{ padding: '44px 38px 52px 44px' }}>
          
          {/* Chrome Binder Clip at Top */}
          <div className="binder-clip-top" />

          {isSent ? (
            <div style={{ textAlign: 'center', padding: '40px 10px' }} className="animate-pop-in">
              <div style={{
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                background: '#ECFDF5',
                border: '3px solid #059669',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#059669',
                boxShadow: '0 8px 20px rgba(5, 150, 105, 0.25)',
                marginBottom: '20px'
              }}>
                <CheckCircle2 size={48} />
              </div>
              <h2 style={{ fontFamily: 'var(--font-dela)', fontSize: '2.2rem', color: '#1E3A8A', marginBottom: '8px' }}>
                REQUEST SENT ⚡
              </h2>
              <p style={{ color: '#4B5563', fontSize: '1.05rem', maxWidth: '440px', margin: '0 auto 24px auto', lineHeight: 1.5 }}>
                Waiting for <strong>{targetStudent.name}</strong> to accept. We dispatched a physical alert to their campus inbox!
              </p>
              <span className="sticker-badge sticker-badge-exp" style={{ fontSize: '0.85rem', padding: '6px 18px' }}>
                Redirecting to Requests Inbox...
              </span>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <span className="sticker-badge sticker-badge-exp" style={{ fontSize: '0.78rem', padding: '4px 14px' }}>
                  <ArrowRightLeft size={13} /> 1-TO-1 RECIPROCAL PROPOSAL
                </span>
                <span style={{ fontFamily: 'var(--font-hand)', fontSize: '1.2rem', color: '#15803D', fontWeight: 700 }}>
                  Zero Money Exchange ✍️
                </span>
              </div>

              <h1 style={{ fontFamily: 'var(--font-dela)', fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)', color: '#1E3A8A', marginBottom: '8px' }}>
                PROPOSE A SKILL SWAP WITH <span style={{ color: '#008744' }}>{targetStudent.name}</span>
              </h1>
              <p style={{ color: '#4B5563', fontSize: '0.95rem', marginBottom: '28px' }}>
                No money involved. Teach what you know, learn what you need in return.
              </p>

              {/* Live Exchange Preview Inside Crisp Card */}
              <div style={{
                background: '#FFFFFF',
                border: '3px solid #1E3A8A',
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '26px',
                boxShadow: '0 10px 24px rgba(0,0,0,0.08), 0 4px 0 #1E3A8A'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ fontFamily: 'var(--font-titan)', fontSize: '0.88rem', letterSpacing: '0.04em', color: '#1E3A8A' }}>
                    MUTUAL EXCHANGE PREVIEW
                  </div>
                  <span style={{ fontSize: '1.2rem' }}>🔄</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={currentUser.avatar} alt="You" style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', border: '2px solid #008744' }} />
                      <span style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.95rem' }}>{currentUser.name} (You)</span>
                    </div>
                    <span style={{ color: '#64748B', fontWeight: 700, fontSize: '0.88rem' }}>teaches</span>
                    <span className="ripped-tag ripped-green">{teachSkill}</span>
                    <span style={{ color: '#64748B', fontWeight: 700, fontSize: '0.88rem' }}>➔ {targetStudent.name.split(' ')[0]}</span>
                  </div>

                  <div style={{ height: '2px', background: '#E2E8F0' }} />

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={targetStudent.avatar} alt={targetStudent.name} style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', border: '2px solid #1E3A8A' }} />
                      <span style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.95rem' }}>{targetStudent.name}</span>
                    </div>
                    <span style={{ color: '#64748B', fontWeight: 700, fontSize: '0.88rem' }}>teaches</span>
                    <span className="ripped-tag ripped-blue">{learnSkill}</span>
                    <span style={{ color: '#64748B', fontWeight: 700, fontSize: '0.88rem' }}>➔ You</span>
                  </div>
                </div>
              </div>

              {/* Skill Pickers */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '22px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#15803D', marginBottom: '8px', fontWeight: 800 }}>
                    You Teach (Your Superpower)
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {currentUser.teaching && currentUser.teaching.length > 0 ? (
                      currentUser.teaching.map(skill => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => setTeachSkill(skill)}
                          style={{
                            padding: '7px 14px',
                            fontSize: '0.82rem',
                            fontFamily: 'var(--font-sans)',
                            fontWeight: 700,
                            borderRadius: '6px',
                            background: teachSkill === skill ? '#008744' : '#F8FAFC',
                            border: teachSkill === skill ? '2px solid #005a2d' : '2px solid #CBD5E1',
                            color: teachSkill === skill ? '#FFFFFF' : '#334155',
                            boxShadow: teachSkill === skill ? '0 3px 0 #005a2d' : 'none',
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
                        placeholder="Type skill you can teach (e.g. Web Dev, Python)..."
                        className="scrapbook-input"
                        style={{ width: '100%' }}
                      />
                    )}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#1E3A8A', marginBottom: '8px', fontWeight: 800 }}>
                    You Learn (Their Expertise)
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {targetStudent.canTeach.map(skill => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => setLearnSkill(skill)}
                        style={{
                          padding: '7px 14px',
                          fontSize: '0.82rem',
                          fontFamily: 'var(--font-sans)',
                          fontWeight: 700,
                          borderRadius: '6px',
                          background: learnSkill === skill ? '#1E3A8A' : '#F8FAFC',
                          border: learnSkill === skill ? '2px solid #172554' : '2px solid #CBD5E1',
                          color: learnSkill === skill ? '#FFFFFF' : '#334155',
                          boxShadow: learnSkill === skill ? '0 3px 0 #172554' : 'none',
                          cursor: 'pointer'
                        }}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Custom Personal Message */}
              <div style={{ marginBottom: '28px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#334155', marginBottom: '8px', fontWeight: 800 }}>
                  Personal Swap Pitch Note ✍️
                </label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={3}
                  placeholder="e.g. Introduce yourself and what topics you want to practice or collaborate on..."
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    background: '#F8FAFC',
                    border: '2px solid #CBD5E1',
                    borderRadius: '8px',
                    color: '#0F172A',
                    fontSize: '0.92rem',
                    fontWeight: 500,
                    outline: 'none',
                    resize: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '14px', justifyContent: 'flex-end', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => navigate('/match')}
                  style={{
                    padding: '12px 22px',
                    background: '#FFFFFF',
                    border: '2px solid #CBD5E1',
                    borderRadius: '8px',
                    color: '#475569',
                    fontFamily: 'var(--font-titan)',
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                  }}
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  onClick={handleSend}
                  style={{
                    padding: '12px 28px',
                    background: '#008744',
                    border: '3px solid #005a2d',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-titan)',
                    fontSize: '0.95rem',
                    boxShadow: '0 4px 0 #005a2d',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Send size={16} /> SEND PROPOSAL ⚡
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

