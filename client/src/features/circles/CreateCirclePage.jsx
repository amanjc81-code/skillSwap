import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSkillSwap } from '../../app/SkillSwapContext.jsx';
import {
  Triangle,
  Sparkles,
  ArrowRight,
  Info,
  CheckCircle2,
  Users,
  Video,
  MapPin,
  Clock
} from 'lucide-react';

export const CreateCirclePage = () => {
  const navigate = useNavigate();
  const { currentUser, addToast } = useSkillSwap();

  const [circleName, setCircleName] = useState('');
  const [learnSkill, setLearnSkill] = useState(currentUser.learning?.[0] || '');
  const [teachSkill, setTeachSkill] = useState(currentUser.teaching?.[0] || '');
  const [mode, setMode] = useState('Online');
  const [preferredTime, setPreferredTime] = useState('');
  const [isFinding, setIsFinding] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsFinding(true);
    addToast('Solving campus graph for triangular match...', 'info');
    setTimeout(() => {
      setIsFinding(false);
      navigate('/circle/suggestions');
    }, 1200);
  };

  return (
    <div className="scrapbook-desk">
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <div className="notebook-sheet" style={{ padding: '40px 36px', position: 'relative' }}>
          {/* Top Chrome Binder Clip */}
          <div className="binder-clip-top" />

          {/* Header Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="sticker-badge sticker-badge-cert" style={{ fontSize: '0.72rem', padding: '3px 12px' }}>
              <Triangle size={12} fill="#0284C7" style={{ marginRight: '4px' }} /> 3-PERSON CIRCULAR EXCHANGE
            </span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-titan)', fontSize: '2.4rem', color: '#18181B', letterSpacing: '0.02em', margin: '0 0 6px 0' }}>
            CREATE A <span style={{ color: '#008744' }}>SKILL CIRCLE</span>
          </h1>

          <p style={{ fontFamily: 'var(--font-hand)', fontSize: '1.25rem', color: '#047857', fontWeight: 700, margin: '0 0 22px 0', lineHeight: 1.3 }}>
            Can’t find a direct 1:1 match? Create a triangle! <strong>A teaches B, B teaches C, and C teaches A.</strong> ✍️
          </p>

          {/* Visual Explanation Manila Envelope / Post-it */}
          <div className="yellow-postit" style={{
            padding: '20px 22px',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            border: '2px solid #27272A',
            boxShadow: '3px 4px 0px rgba(0,0,0,0.12)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: '#008744',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 3px 0 #005a2d',
              flexShrink: 0
            }}>
              <Triangle size={26} fill="#FFFFFF" />
            </div>
            <div style={{ fontSize: '0.88rem', color: '#18181B', lineHeight: 1.5, fontWeight: 600 }}>
              <strong style={{ color: '#78350F', fontFamily: 'var(--font-titan)' }}>HOW TRIANGLE CIRCLES WORK:</strong> If you teach Full Stack and want SQL, but the SQL master wants Python, our campus graph connects a 3rd student who teaches Python and wants Full Stack!
            </div>
          </div>

          {/* Form Inputs */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-titan)', fontSize: '0.85rem', color: '#18181B', marginBottom: '6px' }}>
                CIRCLE NAME / STUDY COHORT
              </label>
              <input
                type="text"
                value={circleName}
                onChange={e => setCircleName(e.target.value)}
                className="scrapbook-input"
                placeholder="e.g. FullStack ↔ Python ↔ SQL Masterminds"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-titan)', fontSize: '0.85rem', color: '#18181B', marginBottom: '6px' }}>
                  SKILL I WANT TO LEARN
                </label>
                <select
                  value={learnSkill}
                  onChange={e => setLearnSkill(e.target.value)}
                  className="scrapbook-input"
                  required
                >
                  <option value="">Select skill to learn...</option>
                  {currentUser.learning?.map(sk => (
                    <option key={`curr-l-${sk}`} value={sk}>{sk}</option>
                  ))}
                  <option value="SQL">SQL (PostgreSQL / Queries)</option>
                  <option value="Python">Python (Pandas / Automation)</option>
                  <option value="System Design">System Design & APIs</option>
                  <option value="Figma UI/UX">Figma UI/UX Design</option>
                  <option value="Video Editing">Video Editing (Premiere)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-titan)', fontSize: '0.85rem', color: '#18181B', marginBottom: '6px' }}>
                  SKILL I CAN TEACH
                </label>
                <select
                  value={teachSkill}
                  onChange={e => setTeachSkill(e.target.value)}
                  className="scrapbook-input"
                  required
                >
                  <option value="">Select skill to teach...</option>
                  {currentUser.teaching && currentUser.teaching.length > 0 ? (
                    currentUser.teaching.map(sk => (
                      <option key={`curr-t-${sk}`} value={sk}>{sk}</option>
                    ))
                  ) : (
                    <>
                      <option value="Full Stack">Full Stack Development</option>
                      <option value="React">React & Frontend</option>
                      <option value="DSA">Data Structures & Algorithms</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-titan)', fontSize: '0.85rem', color: '#18181B', marginBottom: '6px' }}>
                  PREFERRED MODE
                </label>
                <select
                  value={mode}
                  onChange={e => setMode(e.target.value)}
                  className="scrapbook-input"
                >
                  <option value="Online">Online Video Hub</option>
                  <option value="Offline">Campus Tech Hub / In-Person</option>
                  <option value="Both">Flexible (Both)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-titan)', fontSize: '0.85rem', color: '#18181B', marginBottom: '6px' }}>
                  PREFERRED TIME
                </label>
                <input
                  type="text"
                  value={preferredTime}
                  onChange={e => setPreferredTime(e.target.value)}
                  className="scrapbook-input"
                  placeholder="e.g. Evenings & Weekends"
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
              <button
                type="submit"
                disabled={isFinding}
                className="btn-3d-green"
                style={{ padding: '12px 32px', fontSize: '0.95rem' }}
              >
                {isFinding ? 'SOLVING TRIANGLE GRAPH...' : (
                  <>FIND MY CIRCLE <ArrowRight size={18} /></>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
