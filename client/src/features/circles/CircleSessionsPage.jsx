import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSkillSwap } from '../../app/SkillSwapContext.jsx';
import {
  Triangle,
  Calendar,
  Clock,
  Video,
  CheckCircle2,
  Award,
  Sparkles,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

export const CircleSessionsPage = () => {
  const navigate = useNavigate();
  const {
    currentUser,
    activeCircle,
    markCircleSessionComplete,
    setActiveModal
  } = useSkillSwap();

  if (!activeCircle) {
    return (
      <div className="scrapbook-desk">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="notebook-sheet" style={{ padding: '60px 36px', textAlign: 'center', position: 'relative' }}>
            <div className="binder-clip-top" />
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '12px' }}>📅</span>
            <h2 style={{ fontFamily: 'var(--font-titan)', fontSize: '2.2rem', color: '#18181B', marginBottom: '8px' }}>
              NO CIRCLE SESSIONS SCHEDULED
            </h2>
            <p style={{ fontFamily: 'var(--font-hand)', fontSize: '1.35rem', color: '#047857', fontWeight: 700, maxWidth: '480px', margin: '0 auto 24px auto', lineHeight: 1.4 }}>
              Join or form a triangle Skill Circle to schedule your 3-hop exchange sessions!
            </p>
            <button onClick={() => navigate('/circle/create')} className="btn-3d-green" style={{ padding: '12px 26px', fontSize: '0.9rem' }}>
              START A SKILL CIRCLE ➔
            </button>
          </div>
        </div>
      </div>
    );
  }

  const allComplete = (activeCircle?.sessions?.length || 0) > 0 && activeCircle.sessions.every(s => s.status === 'Completed');

  const handleResetSessions = () => {
    // Allows easy demo testing of the celebration modal again
    activeCircle.sessions.forEach(s => s.status = 'Upcoming');
    navigate('/circle/details');
  };

  return (
    <div className="scrapbook-desk">
      <div style={{ maxWidth: '980px', margin: '0 auto' }}>
        <div className="notebook-sheet" style={{ padding: '36px 32px 40px 36px', position: 'relative' }}>
          {/* Top Chrome Binder Clip */}
          <div className="binder-clip-top" />

          {/* Top Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '26px',
            flexWrap: 'wrap',
            gap: '16px',
            borderBottom: '2px dashed #C4B98E',
            paddingBottom: '20px'
          }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="sticker-badge sticker-badge-cert" style={{ fontSize: '0.72rem', padding: '3px 12px' }}>
                  <Triangle size={12} fill="#0284C7" style={{ marginRight: '4px' }} /> 3-HOP EXCHANGE TIMETABLE
                </span>
              </div>
              <h1 style={{ fontFamily: 'var(--font-titan)', fontSize: '2.3rem', color: '#18181B', letterSpacing: '0.02em', margin: 0 }}>
                CIRCLE SESSIONS ROADMAP
              </h1>
              <p style={{ fontFamily: 'var(--font-hand)', fontSize: '1.2rem', color: '#047857', fontWeight: 700, margin: '4px 0 0 0' }}>
                {activeCircle.name} • Everyone teaches 1 session and receives 1 session ✍️
              </p>
            </div>

            {allComplete ? (
              <button
                onClick={() => setActiveModal('circle-celebration')}
                className="btn-3d-green animate-pulse-glow"
                style={{ padding: '10px 22px', fontSize: '0.88rem' }}
              >
                <Award size={18} /> VIEW CELEBRATION MODAL 🎉
              </button>
            ) : (
              <button
                onClick={() => {
                  activeCircle.sessions.forEach(s => markCircleSessionComplete(s.id));
                }}
                className="btn-3d-yellow"
                style={{ padding: '10px 20px', fontSize: '0.82rem' }}
              >
                <Sparkles size={15} /> COMPLETE ALL (DEMO TEST)
              </button>
            )}
          </div>

          {/* ALL COMPLETE CELEBRATION HERO BANNER */}
          {allComplete && (
            <div className="yellow-postit" style={{
              padding: '32px 28px',
              border: '2px solid #27272A',
              boxShadow: '4px 6px 0px rgba(0,0,0,0.15)',
              textAlign: 'center',
              marginBottom: '32px',
              position: 'relative'
            }}>
              <div className="pushpin-3d pushpin-red" style={{ top: '-12px', left: '50%', transform: 'translateX(-50%)' }} />

              <div style={{
                width: '74px',
                height: '74px',
                borderRadius: '50%',
                background: '#008744',
                color: '#FFFFFF',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                boxShadow: '0 4px 0 #005a2d'
              }}>
                <Award size={42} />
              </div>

              <h2 style={{ fontFamily: 'var(--font-titan)', fontSize: '2.2rem', color: '#18181B', marginBottom: '6px' }}>
                CIRCLE COMPLETE 🎉
              </h2>
              <p style={{
                fontSize: '1.3rem',
                fontFamily: 'var(--font-marker)',
                color: '#008744',
                marginBottom: '12px'
              }}>
                Three skills exchanged. Zero money spent.
              </p>
              <p style={{ fontFamily: 'var(--font-hand)', fontSize: '1.25rem', color: '#78350F', fontWeight: 700, maxWidth: '520px', margin: '0 auto 20px auto', lineHeight: 1.4 }}>
                Congratulations {currentUser.name ? currentUser.name.split(' ')[0] : 'You'}, Rahul, and Anuj! You have successfully finished the entire triangular peer learning loop ✍️
              </p>

              <button
                onClick={() => setActiveModal('circle-celebration')}
                className="btn-3d-green"
                style={{ padding: '12px 28px', fontSize: '0.9rem' }}
              >
                OPEN GRADUATION CERTIFICATE 🏆
              </button>
            </div>
          )}

          {/* THREE SEPARATE SESSIONS CARDS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {activeCircle.sessions.map((sess, idx) => {
              const isDone = sess.status === 'Completed';

              return (
                <div
                  key={sess.id}
                  className="scrapbook-paper-card"
                  style={{
                    padding: '26px 28px',
                    position: 'relative'
                  }}
                >
                  {/* Pushpin */}
                  <div
                    className={`pushpin-3d ${idx === 0 ? 'pushpin-red' : (idx === 1 ? 'pushpin-yellow' : 'pushpin-cyan')}`}
                    style={{ top: '-10px', right: '18px' }}
                  />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span className="sticker-badge sticker-badge-cert" style={{ fontSize: '0.72rem', padding: '3px 10px' }}>
                          CIRCULAR HOP #{idx + 1}
                        </span>
                        <span className="ripped-tag ripped-green" style={{ fontSize: '0.72rem', padding: '2px 10px' }}>
                          Skill: {sess.skill}
                        </span>
                      </div>
                      <h3 style={{ fontFamily: 'var(--font-titan)', fontSize: '1.3rem', color: '#18181B', margin: 0 }}>
                        {sess.title.toUpperCase()}
                      </h3>
                    </div>

                    <span className={isDone ? 'sticker-badge sticker-badge-exp' : 'sticker-badge sticker-badge-edu'} style={{ fontSize: '0.72rem', padding: '3px 12px' }}>
                      {isDone ? '✓ COMPLETED' : '● SCHEDULED'}
                    </span>
                  </div>

                  {/* Participants Strip */}
                  <div style={{
                    background: '#FEF9C3',
                    border: '1.5px dashed #CA8A04',
                    borderRadius: '8px',
                    padding: '12px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                    marginBottom: '16px'
                  }}>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: '#78350F', fontFamily: 'var(--font-titan)' }}>TEACHER</span>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#18181B' }}>{sess.teacher}</div>
                    </div>

                    <span style={{ fontFamily: 'var(--font-hand)', fontSize: '1.15rem', fontWeight: 800, color: '#92400E' }}>
                      ➔ teaches {sess.skill} ➔
                    </span>

                    <div>
                      <span style={{ fontSize: '0.7rem', color: '#78350F', fontFamily: 'var(--font-titan)' }}>LEARNER</span>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#18181B' }}>{sess.learner}</div>
                    </div>
                  </div>

                  {/* Time, Mode, and Mark Complete Action */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.85rem', color: '#52525B', fontWeight: 600 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={15} color="#047857" /> {sess.date}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={15} color="#0284C7" /> {sess.duration}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Video size={15} color="#15803D" /> {sess.mode}
                      </span>
                    </div>

                    <div>
                      {isDone ? (
                        <span className="sticker-badge sticker-badge-exp" style={{ fontSize: '0.75rem', padding: '4px 14px' }}>
                          <CheckCircle2 size={15} style={{ marginRight: '4px' }} /> VERIFIED COMPLETED
                        </span>
                      ) : (
                        <button
                          onClick={() => markCircleSessionComplete(sess.id)}
                          className="btn-3d-green"
                          style={{ padding: '8px 18px', fontSize: '0.82rem' }}
                        >
                          <CheckCircle2 size={15} /> MARK COMPLETE
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
