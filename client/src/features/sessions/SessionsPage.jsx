import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSkillSwap } from '../../app/SkillSwapContext.jsx';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  CheckCircle2,
  Star,
  Plus,
  ArrowRight,
  ExternalLink,
  Award
} from 'lucide-react';

export const SessionsPage = () => {
  const navigate = useNavigate();
  const {
    sessions,
    markSessionComplete,
    setActiveModal,
    setModalPayload
  } = useSkillSwap();

  const [activeTab, setActiveTab] = useState('Upcoming'); // 'Upcoming' | 'Completed' | 'Cancelled'

  const filtered = sessions.filter(s => s.status === activeTab);

  return (
    <div className="scrapbook-desk">
      <div style={{ maxWidth: '980px', margin: '0 auto' }}>
        {/* OPEN NOTEBOOK PLANNER SHEET */}
        <div className="notebook-sheet" style={{ padding: '36px 32px 40px 36px' }}>
          {/* Top Metallic Binder Clip */}
          <div className="binder-clip-top" />

          {/* Header */}
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
                  STUDY TIMETABLE & LOGS
                </span>
              </div>
              <h1 style={{ fontFamily: 'var(--font-titan)', fontSize: '2.3rem', color: '#18181B', letterSpacing: '0.02em', margin: 0 }}>
                YOUR SESSIONS
              </h1>
              <p style={{ fontFamily: 'var(--font-hand)', fontSize: '1.2rem', color: '#047857', fontWeight: 700, margin: '4px 0 0 0' }}>
                Manage upcoming video calls, campus study sessions, and review logs ✍️
              </p>
            </div>

            <button
              onClick={() => setActiveModal('schedule-session')}
              className="btn-3d-green"
              style={{ padding: '10px 22px', fontSize: '0.88rem' }}
            >
              <Plus size={16} /> SCHEDULE NEW SESSION
            </button>
          </div>

          {/* 3D Tabs */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '26px',
            flexWrap: 'wrap'
          }}>
            {['Upcoming', 'Completed', 'Cancelled'].map(tab => {
              const count = sessions.filter(s => s.status === tab).length;
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '9999px',
                    fontSize: '0.86rem',
                    fontFamily: 'var(--font-titan)',
                    letterSpacing: '0.04em',
                    background: isActive ? '#008744' : '#FFFFFF',
                    color: isActive ? '#FFFFFF' : '#18181B',
                    border: '2px solid #27272A',
                    boxShadow: isActive ? '0 4px 0 #005a2d' : '2px 2px 0px rgba(0,0,0,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{tab.toUpperCase()}</span>
                  <span style={{
                    background: isActive ? '#005a2d' : '#F4F4F5',
                    color: isActive ? '#FFFFFF' : '#18181B',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    fontSize: '0.72rem',
                    fontWeight: 800
                  }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Sessions List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {filtered.length > 0 ? (
              filtered.map((sess, idx) => (
                <div
                  key={sess.id}
                  className="scrapbook-paper-card"
                  style={{
                    padding: '24px 26px',
                    position: 'relative'
                  }}
                >
                  {/* Pushpin at corner */}
                  <div
                    className={`pushpin-3d ${idx % 2 === 0 ? 'pushpin-red' : 'pushpin-cyan'}`}
                    style={{ top: '-10px', right: '18px' }}
                  />

                  {/* Row 1: Skill & Status */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span className="ripped-tag ripped-green" style={{ fontSize: '0.78rem', padding: '3px 12px' }}>
                          {sess.skill}
                        </span>
                        {sess.totalSessions && (
                          <span style={{ fontSize: '0.78rem', color: '#047857', fontFamily: 'var(--font-titan)' }}>
                            Session {sess.sessionIndex} of {sess.totalSessions}
                          </span>
                        )}
                      </div>
                      <h3 style={{ fontFamily: 'var(--font-titan)', fontSize: '1.3rem', color: '#18181B', margin: 0 }}>
                        {sess.skill.toUpperCase()} MASTERY
                      </h3>
                    </div>

                    <span className={sess.status === 'Upcoming' ? 'sticker-badge sticker-badge-cert' : (sess.status === 'Completed' ? 'sticker-badge sticker-badge-exp' : 'sticker-badge sticker-badge-edu')} style={{ fontSize: '0.72rem', padding: '3px 12px' }}>
                      ● {sess.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Row 2: Participants Manila Strip */}
                  <div style={{
                    background: '#FEF9C3',
                    border: '1.5px dashed #CA8A04',
                    borderRadius: '8px',
                    padding: '12px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '14px',
                    marginBottom: '16px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        background: '#FFF',
                        padding: '2px 2px 6px 2px',
                        border: '1.5px solid #27272A',
                        boxShadow: '1px 2px 4px rgba(0,0,0,0.15)',
                        transform: 'rotate(-3deg)'
                      }}>
                        <img src={sess.teacher.avatar} alt={sess.teacher.name} style={{ width: 34, height: 34, objectFit: 'cover', display: 'block' }} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: '#78350F', fontFamily: 'var(--font-titan)' }}>TEACHER</div>
                        <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#18181B' }}>{sess.teacher.name}</div>
                      </div>
                    </div>

                    <span style={{ fontFamily: 'var(--font-hand)', fontSize: '1.2rem', fontWeight: 800, color: '#92400E' }}>
                      ➔ teaching ➔
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        background: '#FFF',
                        padding: '2px 2px 6px 2px',
                        border: '1.5px solid #27272A',
                        boxShadow: '1px 2px 4px rgba(0,0,0,0.15)',
                        transform: 'rotate(3deg)'
                      }}>
                        <img src={sess.learner.avatar} alt={sess.learner.name} style={{ width: 34, height: 34, objectFit: 'cover', display: 'block' }} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: '#78350F', fontFamily: 'var(--font-titan)' }}>LEARNER</div>
                        <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#18181B' }}>{sess.learner.name}</div>
                      </div>
                    </div>
                  </div>

                  {/* Row 3: Details & Action */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.85rem', color: '#52525B', fontWeight: 600 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={15} color="#047857" /> {sess.date}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={15} color="#0284C7" /> {sess.duration}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {sess.mode.includes('Online') ? <Video size={15} color="#15803D" /> : <MapPin size={15} color="#EA580C" />}
                        {sess.mode}
                      </span>
                    </div>

                    {/* Actions depending on status */}
                    {sess.status === 'Upcoming' && (
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          type="button"
                          onClick={() => markSessionComplete(sess.id)}
                          className="btn-3d-yellow"
                          style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                        >
                          <CheckCircle2 size={15} /> MARK COMPLETE
                        </button>
                        {sess.link ? (
                          <a
                            href={sess.link}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-3d-green"
                            style={{ padding: '8px 18px', fontSize: '0.8rem', textDecoration: 'none' }}
                          >
                            <Video size={15} /> JOIN CALL
                          </a>
                        ) : (
                          <button className="btn-3d-green" style={{ padding: '8px 14px', fontSize: '0.8rem' }}>
                            VIEW LOCATION
                          </button>
                        )}
                      </div>
                    )}

                    {sess.status === 'Completed' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className="sticker-badge sticker-badge-exp" style={{ fontSize: '0.72rem', padding: '3px 12px' }}>
                          <Star size={13} fill="currentColor" style={{ marginRight: '4px' }} /> RATED 5.0 STARS
                        </span>
                        <button
                          onClick={() => {
                            setActiveModal('rate-review');
                            setModalPayload({ teacherName: sess.teacher.name, skill: sess.skill });
                          }}
                          className="btn-3d-blue"
                          style={{ padding: '6px 14px', fontSize: '0.78rem' }}
                        >
                          UPDATE REVIEW
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="yellow-postit" style={{ padding: '40px 20px', textAlign: 'center', maxWidth: '440px', margin: '20px auto', border: '2px solid #27272A' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>✨</div>
                <h3 style={{ fontFamily: 'var(--font-titan)', fontSize: '1.4rem', color: '#78350F', marginBottom: '6px' }}>
                  NO {activeTab.toUpperCase()} SESSIONS
                </h3>
                <p style={{ fontFamily: 'var(--font-hand)', fontSize: '1.2rem', color: '#92400E', fontWeight: 700, margin: '8px auto 18px auto' }}>
                  "No study sessions yet. Your peer learning era starts soon." ✍️
                </p>
                <button
                  onClick={() => setActiveModal('schedule-session')}
                  className="btn-3d-green"
                >
                  SCHEDULE A SESSION NOW
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
