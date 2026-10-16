import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSkillSwap } from '../../app/SkillSwapContext.jsx';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  Sparkles,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

export const ScheduleSessionPage = () => {
  const navigate = useNavigate();
  const { scheduleNewSession } = useSkillSwap();

  const [topic, setTopic] = useState('');
  const [partner, setPartner] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('60 min');
  const [mode, setMode] = useState('Online');
  const [linkOrLoc, setLinkOrLoc] = useState('');
  const [notes, setNotes] = useState('');
  const [isLockedIn, setIsLockedIn] = useState(false);

  const handleCreate = (e) => {
    e.preventDefault();
    setIsLockedIn(true);
    setTimeout(() => {
      scheduleNewSession({
        topic: topic || 'Skill Exchange Session',
        partnerName: partner || 'Peer Swapper',
        date,
        time,
        duration,
        mode: mode === 'Online' ? `Online (${linkOrLoc || 'Meeting Link'})` : `Offline (${linkOrLoc || 'Campus Room'})`
      });
      setTimeout(() => {
        navigate('/sessions');
      }, 1500);
    }, 1000);
  };

  return (
    <div className="scrapbook-desk">
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        <div className="notebook-sheet" style={{ padding: '40px 36px', position: 'relative' }}>
          {/* Top Chrome Binder Clip */}
          <div className="binder-clip-top" />

          {isLockedIn ? (
            <div style={{ textAlign: 'center', padding: '40px 10px' }}>
              <div className="yellow-postit" style={{ maxWidth: '440px', margin: '0 auto', padding: '36px 24px', border: '2px solid #27272A' }}>
                <div className="pushpin-3d pushpin-red" style={{ top: '-12px', left: '50%', transform: 'translateX(-50%)' }} />
                <div style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  background: '#008744',
                  color: '#FFFFFF',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 0 #005a2d',
                  marginBottom: '16px'
                }}>
                  <CheckCircle size={38} />
                </div>
                <h2 style={{ fontFamily: 'var(--font-titan)', fontSize: '1.8rem', color: '#18181B', marginBottom: '8px' }}>
                  SESSION LOCKED IN 🔒
                </h2>
                <p style={{ fontFamily: 'var(--font-hand)', fontSize: '1.25rem', color: '#78350F', fontWeight: 700, margin: '0 auto 16px auto', lineHeight: 1.4 }}>
                  See you at {time} on {date}. We have notified {partner || 'your partner'} and stamped it to your study planner! ✍️
                </p>
                <div className="sticker-badge sticker-badge-cert" style={{ fontSize: '0.75rem', padding: '4px 16px' }}>
                  REDIRECTING TO SESSIONS...
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="sticker-badge sticker-badge-cert" style={{ fontSize: '0.72rem', padding: '3px 12px' }}>
                  <Clock size={12} style={{ marginRight: '4px' }} /> LOCK IN A DATE
                </span>
              </div>
              <h1 style={{ fontFamily: 'var(--font-titan)', fontSize: '2.2rem', color: '#18181B', letterSpacing: '0.02em', margin: '0 0 6px 0' }}>
                SCHEDULE SESSION
              </h1>
              <p style={{ fontFamily: 'var(--font-hand)', fontSize: '1.2rem', color: '#047857', fontWeight: 700, margin: '0 0 24px 0' }}>
                Set up a structured exchange with your peer study partner ✍️
              </p>

              <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-titan)', fontSize: '0.85rem', color: '#18181B', marginBottom: '6px' }}>
                    SESSION TOPIC / OBJECTIVE
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    className="scrapbook-input"
                    placeholder="e.g. React Architecture, SQL Queries, or UI/UX feedback"
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-titan)', fontSize: '0.85rem', color: '#18181B', marginBottom: '6px' }}>
                    PEER STUDY PARTNER
                  </label>
                  <input
                    type="text"
                    value={partner}
                    onChange={e => setPartner(e.target.value)}
                    className="scrapbook-input"
                    placeholder="e.g. Enter student name or campus handle"
                    required
                  />
                </div>

                {/* Date Chips */}
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-titan)', fontSize: '0.85rem', color: '#18181B', marginBottom: '8px' }}>
                    PICK DAY
                  </label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {['Today', 'Tomorrow', 'This Friday', 'This Saturday', 'Next Monday'].map(d => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDate(d)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '9999px',
                          fontSize: '0.82rem',
                          fontFamily: 'var(--font-titan)',
                          letterSpacing: '0.03em',
                          background: date === d ? '#008744' : '#FFFFFF',
                          color: date === d ? '#FFFFFF' : '#18181B',
                          border: '2px solid #27272A',
                          boxShadow: date === d ? '0 3px 0 #005a2d' : '2px 2px 0px rgba(0,0,0,0.1)',
                          cursor: 'pointer'
                        }}
                      >
                        <Calendar size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> {d.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Chips */}
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-titan)', fontSize: '0.85rem', color: '#18181B', marginBottom: '8px' }}>
                    PICK TIME SLOT
                  </label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {['4:00 PM', '5:30 PM', '6:00 PM', '7:30 PM', '8:30 PM'].map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTime(t)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '9999px',
                          fontSize: '0.82rem',
                          fontFamily: 'var(--font-titan)',
                          letterSpacing: '0.03em',
                          background: time === t ? '#FACC15' : '#FFFFFF',
                          color: time === t ? '#78350F' : '#18181B',
                          border: '2px solid #27272A',
                          boxShadow: time === t ? '0 3px 0 #78350F' : '2px 2px 0px rgba(0,0,0,0.1)',
                          cursor: 'pointer'
                        }}
                      >
                        <Clock size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration & Mode */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-titan)', fontSize: '0.85rem', color: '#18181B', marginBottom: '6px' }}>
                      DURATION
                    </label>
                    <select
                      value={duration}
                      onChange={e => setDuration(e.target.value)}
                      className="scrapbook-input"
                    >
                      <option value="30 min">30 min (Quick sync)</option>
                      <option value="45 min">45 min (Standard)</option>
                      <option value="60 min">60 min (Full lesson)</option>
                      <option value="90 min">90 min (Deep dive lab)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-titan)', fontSize: '0.85rem', color: '#18181B', marginBottom: '6px' }}>
                      MODE
                    </label>
                    <select
                      value={mode}
                      onChange={e => {
                        setMode(e.target.value);
                        setLinkOrLoc('');
                      }}
                      className="scrapbook-input"
                    >
                      <option value="Online">Online (Video Call)</option>
                      <option value="Offline">In-Person (Campus Hub)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-titan)', fontSize: '0.85rem', color: '#18181B', marginBottom: '6px' }}>
                    {mode === 'Online' ? 'MEETING LINK' : 'CAMPUS LOCATION'}
                  </label>
                  <input
                    type="text"
                    value={linkOrLoc}
                    onChange={e => setLinkOrLoc(e.target.value)}
                    className="scrapbook-input"
                    placeholder={mode === 'Online' ? 'e.g. Google Meet or Discord Link' : 'e.g. Campus Library Pod 4 or Tech Hub Lab'}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-titan)', fontSize: '0.85rem', color: '#18181B', marginBottom: '6px' }}>
                    PREPARATION NOTES
                  </label>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    rows={2}
                    className="scrapbook-input"
                    placeholder="e.g. Notes on what code/questions to review or topics to focus on"
                    style={{ resize: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => navigate('/sessions')}
                    className="btn-3d-yellow"
                    style={{ padding: '10px 22px' }}
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="btn-3d-green"
                    style={{ padding: '10px 28px' }}
                  >
                    <Sparkles size={16} /> LOCK IN SESSION
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
