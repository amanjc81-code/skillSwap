import React, { useState } from 'react';
import { useSkillSwap } from '../../app/SkillSwapContext.jsx';
import { X, Calendar, Clock, Video, MapPin, CheckCircle, Sparkles } from 'lucide-react';

export const ScheduleSessionModal = () => {
  const { activeModal, setActiveModal, modalPayload, scheduleNewSession } = useSkillSwap();
  const [topic, setTopic] = useState(modalPayload?.topic || '');
  const [date, setDate] = useState(modalPayload?.date || '');
  const [time, setTime] = useState(modalPayload?.time || '');
  const [duration, setDuration] = useState('60 min');
  const [mode, setMode] = useState('Online');
  const [locationOrLink, setLocationOrLink] = useState(modalPayload?.link || '');
  const [notes, setNotes] = useState('');
  const [isLockedIn, setIsLockedIn] = useState(false);

  if (activeModal !== 'schedule-session') return null;

  const partnerName = modalPayload?.partnerName || 'Peer Partner';

  const handleCreate = () => {
    setIsLockedIn(true);
    setTimeout(() => {
      scheduleNewSession({
        topic: topic || 'Skill Exchange Session',
        date,
        time,
        duration,
        mode: mode === 'Online' ? `Online (${locationOrLink || 'Meeting Link'})` : `Offline (${locationOrLink || 'Campus Hub'})`,
        partnerName,
        partnerAvatar: modalPayload?.partnerAvatar
      });
      setIsLockedIn(false);
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

        {isLockedIn ? (
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
                <CheckCircle size={36} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-titan)', fontSize: '1.6rem', color: '#18181B', marginBottom: '6px' }}>
                SESSION LOCKED IN 🔒
              </h3>
              <p style={{ fontFamily: 'var(--font-hand)', fontSize: '1.2rem', color: '#78350F', fontWeight: 700, margin: '0 auto' }}>
                See you at {time} on {date}. Calendar invite & reminder stamped to your planner! ✍️
              </p>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="sticker-badge sticker-badge-cert" style={{ fontSize: '0.72rem', padding: '2px 10px' }}>
                <Clock size={12} style={{ marginRight: '4px' }} /> SCHEDULE SESSION
              </span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-titan)', fontSize: '1.7rem', color: '#18181B', letterSpacing: '0.02em', margin: '2px 0 4px 0' }}>
              SCHEDULE WITH <span style={{ color: '#008744' }}>{partnerName.toUpperCase()}</span>
            </h2>
            <p style={{ fontFamily: 'var(--font-hand)', fontSize: '1.15rem', color: '#047857', fontWeight: 700, margin: '0 0 18px 0' }}>
              Pick a time slot that matches your college timetable ✍️
            </p>

            {/* Topic */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontFamily: 'var(--font-titan)', fontSize: '0.8rem', color: '#18181B', marginBottom: '6px' }}>
                SESSION TOPIC / GOAL
              </label>
              <input
                type="text"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                className="scrapbook-input"
                placeholder="e.g. SQL Indexing & Query Tuning"
              />
            </div>

            {/* Quick Date Chips */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontFamily: 'var(--font-titan)', fontSize: '0.8rem', color: '#18181B', marginBottom: '6px' }}>
                SELECT DAY
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['Today', 'Tomorrow', 'This Friday', 'This Saturday', 'Custom Date'].map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDate(d)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-titan)',
                      background: date === d ? '#008744' : '#FFFFFF',
                      color: date === d ? '#FFFFFF' : '#18181B',
                      border: '2px solid #27272A',
                      boxShadow: date === d ? '0 3px 0 #005a2d' : '1px 2px 0px rgba(0,0,0,0.1)',
                      cursor: 'pointer'
                    }}
                  >
                    <Calendar size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> {d.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Chips */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontFamily: 'var(--font-titan)', fontSize: '0.8rem', color: '#18181B', marginBottom: '6px' }}>
                SELECT TIME SLOT
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['4:00 PM', '5:30 PM', '6:00 PM', '8:00 PM', '9:30 PM'].map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTime(t)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-titan)',
                      background: time === t ? '#FACC15' : '#FFFFFF',
                      color: time === t ? '#78350F' : '#18181B',
                      border: '2px solid #27272A',
                      boxShadow: time === t ? '0 3px 0 #78350F' : '1px 2px 0px rgba(0,0,0,0.1)',
                      cursor: 'pointer'
                    }}
                  >
                    <Clock size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration & Mode */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-titan)', fontSize: '0.8rem', color: '#18181B', marginBottom: '6px' }}>
                  DURATION
                </label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {['30 min', '45 min', '60 min'].map(dur => (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => setDuration(dur)}
                      style={{
                        flex: 1,
                        padding: '6px 4px',
                        fontSize: '0.75rem',
                        fontFamily: 'var(--font-titan)',
                        background: duration === dur ? '#0284C7' : '#FFFFFF',
                        color: duration === dur ? '#FFFFFF' : '#18181B',
                        border: '2px solid #27272A',
                        boxShadow: duration === dur ? '0 3px 0 #075985' : '1px 2px 0px rgba(0,0,0,0.1)',
                        cursor: 'pointer'
                      }}
                    >
                      {dur}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-titan)', fontSize: '0.8rem', color: '#18181B', marginBottom: '6px' }}>
                  MODE
                </label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {['Online', 'Offline'].map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => {
                        setMode(m);
                        setLocationOrLink('');
                      }}
                      style={{
                        flex: 1,
                        padding: '6px 4px',
                        fontSize: '0.75rem',
                        fontFamily: 'var(--font-titan)',
                        background: mode === m ? '#008744' : '#FFFFFF',
                        color: mode === m ? '#FFFFFF' : '#18181B',
                        border: '2px solid #27272A',
                        boxShadow: mode === m ? '0 3px 0 #005a2d' : '1px 2px 0px rgba(0,0,0,0.1)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                      }}
                    >
                      {m === 'Online' ? <Video size={13} /> : <MapPin size={13} />} {m.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Location or Link */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontFamily: 'var(--font-titan)', fontSize: '0.8rem', color: '#18181B', marginBottom: '6px' }}>
                {mode === 'Online' ? 'MEETING LINK' : 'CAMPUS LOCATION'}
              </label>
              <input
                type="text"
                value={locationOrLink}
                onChange={e => setLocationOrLink(e.target.value)}
                className="scrapbook-input"
                placeholder={mode === 'Online' ? 'e.g. Google Meet or Discord link' : 'e.g. Campus Library or Study Room'}
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
                onClick={handleCreate}
                className="btn-3d-green"
                style={{ padding: '8px 22px', fontSize: '0.85rem' }}
              >
                <Sparkles size={15} /> LOCK IN SESSION
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
