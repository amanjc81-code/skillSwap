import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSkillSwap } from '../../app/SkillSwapContext.jsx';
import {
  Triangle,
  Calendar,
  Send,
  Paperclip,
  CheckCircle2,
  FileText,
  ExternalLink,
  Users,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const CircleChatPage = () => {
  const navigate = useNavigate();
  const { activeCircle, sendCircleMessage, currentUser, setActiveModal } = useSkillSwap();
  const [inputVal, setInputVal] = useState('');
  const [showProgressDrawer, setShowProgressDrawer] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeCircle?.chatMessages]);

  if (!activeCircle) {
    return (
      <div className="scrapbook-desk">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="notebook-sheet" style={{ padding: '60px 36px', textAlign: 'center', position: 'relative' }}>
            <div className="binder-clip-top" />
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '12px' }}>💬</span>
            <h2 style={{ fontFamily: 'var(--font-titan)', fontSize: '2.2rem', color: '#18181B', marginBottom: '8px' }}>
              NO ACTIVE CIRCLE CHAT
            </h2>
            <p style={{ fontFamily: 'var(--font-hand)', fontSize: '1.35rem', color: '#047857', fontWeight: 700, maxWidth: '480px', margin: '0 auto 24px auto', lineHeight: 1.4 }}>
              Join or form a 3-person triangle Skill Circle to start discussing topics and sharing notes in real-time!
            </p>
            <button onClick={() => navigate('/circle/create')} className="btn-3d-green" style={{ padding: '12px 26px', fontSize: '0.9rem' }}>
              CREATE A CIRCLE ➔
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    sendCircleMessage(inputVal);
    setInputVal('');
  };

  const completedCount = (activeCircle?.sessions || []).filter(s => s.status === 'Completed').length;

  return (
    <div className="scrapbook-desk">
      <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
        {/* OPEN NOTEBOOK SHEET */}
        <div className="notebook-sheet" style={{ padding: '36px 32px 28px 36px', minHeight: '84vh', display: 'flex', flexDirection: 'column' }}>
          {/* Top Metallic Binder Clip */}
          <div className="binder-clip-top" />

          {/* CHAT HEADER: Scrapbook Bar */}
          <div style={{
            background: '#FFFFFF',
            border: '2px solid #27272A',
            borderRadius: '14px',
            padding: '16px 20px',
            boxShadow: '4px 4px 0px rgba(0,0,0,0.15)',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
            position: 'relative'
          }}>
            {/* Pushpin on header */}
            <div className="pushpin-3d pushpin-red" style={{ top: '-10px', right: '16px' }} />

            {/* Overlapping Trio Mini Polaroids */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginRight: '6px' }}>
                {activeCircle.members.map((m, i) => (
                  <div
                    key={m.id}
                    style={{
                      background: '#FFF',
                      padding: '3px 3px 8px 3px',
                      border: '1.5px solid #27272A',
                      boxShadow: '1px 2px 5px rgba(0,0,0,0.2)',
                      marginLeft: i > 0 ? '-14px' : '0',
                      transform: i === 0 ? 'rotate(-6deg)' : (i === 1 ? 'rotate(2deg)' : 'rotate(8deg)'),
                      position: 'relative',
                      zIndex: i + 1
                    }}
                  >
                    <img
                      src={m.avatar}
                      alt={m.name}
                      style={{
                        width: '38px',
                        height: '38px',
                        objectFit: 'cover',
                        display: 'block'
                      }}
                    />
                  </div>
                ))}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--font-titan)', fontSize: '1.25rem', color: '#18181B' }}>
                    {activeCircle.name.toUpperCase()}
                  </span>
                  <span className="sticker-badge sticker-badge-cert" style={{ fontSize: '0.7rem', padding: '3px 12px' }}>
                    TRIO ACTIVE
                  </span>
                </div>
                <div style={{ fontFamily: 'var(--font-hand)', fontSize: '1.15rem', color: '#047857', fontWeight: 700, marginTop: '-2px' }}>
                  {currentUser.name ? currentUser.name.split(' ')[0] : 'You'} ({currentUser.teaching?.[0] || 'Skill'}) ⇄ Rahul (Python) ⇄ Anuj (SQL) ✍️
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setShowProgressDrawer(!showProgressDrawer)}
                className="btn-3d-yellow"
                style={{ padding: '8px 16px', fontSize: '0.8rem' }}
              >
                <Triangle size={14} fill="#78350F" /> TRIO PROGRESS ({completedCount}/3)
              </button>
              <button
                type="button"
                onClick={() => setActiveModal('schedule-session')}
                className="btn-3d-green"
                style={{ padding: '8px 16px', fontSize: '0.8rem' }}
              >
                <Calendar size={14} /> SCHEDULE HOP
              </button>
            </div>
          </div>

          {/* SKILL EXCHANGE TAPE STRIP */}
          <div style={{
            background: '#FEF9C3',
            border: '2px dashed #CA8A04',
            borderRadius: '8px',
            padding: '10px 18px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            fontSize: '0.86rem',
            flexWrap: 'wrap',
            gap: '8px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
          }}>
            <span style={{ fontFamily: 'var(--font-marker)', color: '#047857' }}>
              {currentUser.name ? currentUser.name.split(' ')[0] : 'You'} ➔ Rahul ({currentUser.teaching?.[0] || 'Skill'})
            </span>
            <span style={{ color: '#D97706', fontWeight: 800 }}>•</span>
            <span style={{ fontFamily: 'var(--font-marker)', color: '#0284C7' }}>Rahul ➔ Anuj (Python)</span>
            <span style={{ color: '#D97706', fontWeight: 800 }}>•</span>
            <span style={{ fontFamily: 'var(--font-marker)', color: '#7C3AED' }}>
              Anuj ➔ {currentUser.name ? currentUser.name.split(' ')[0] : 'You'} (SQL)
            </span>
          </div>

          {/* CHAT MESSAGES BODY */}
          <div style={{ display: 'flex', flex: 1, gap: '16px', overflow: 'hidden' }}>
            {/* Messages Column */}
            <div
              style={{
                flex: 1,
                minHeight: '380px',
                maxHeight: '520px',
                overflowY: 'auto',
                background: '#FFFDF5',
                border: '2px solid #E2D9C5',
                borderRadius: '12px',
                padding: '22px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.04)'
              }}
            >
              {activeCircle.chatMessages.length === 0 ? (
                <div style={{ margin: 'auto', textAlign: 'center', padding: '30px 10px' }}>
                  <div className="yellow-postit" style={{ maxWidth: '380px', margin: '0 auto', transform: 'rotate(-1deg)' }}>
                    <div className="pushpin-3d pushpin-red" style={{ top: '-12px', left: '50%', transform: 'translateX(-50%)' }} />
                    <span style={{ fontSize: '2rem', display: 'block', marginBottom: '6px' }}>🔺</span>
                    <h3 style={{ fontFamily: 'var(--font-titan)', fontSize: '1.25rem', color: '#18181B', marginBottom: '6px' }}>
                      TRIANGLE CIRCLE CHAT
                    </h3>
                    <p style={{ fontFamily: 'var(--font-hand)', fontSize: '1.15rem', color: '#78350F', fontWeight: 700, margin: '0 auto', lineHeight: 1.35 }}>
                      Coordinate all 3 hops of your circular exchange. Say hi to your fellow peers! ✍️
                    </p>
                  </div>
                </div>
              ) : (
                activeCircle.chatMessages.map(msg => {
                const isMe = msg.senderId === currentUser.id;
                const senderMember = activeCircle.members.find(m => m.id === msg.senderId) || { name: msg.senderName, teachesSkill: 'Code' };

                return (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      alignSelf: isMe ? 'flex-end' : 'flex-start',
                      maxWidth: '75%',
                      flexDirection: isMe ? 'row-reverse' : 'row'
                    }}
                  >
                    <div style={{
                      background: '#FFF',
                      padding: '2px 2px 6px 2px',
                      border: '1.5px solid #27272A',
                      boxShadow: '1px 2px 4px rgba(0,0,0,0.15)',
                      transform: isMe ? 'rotate(3deg)' : 'rotate(-3deg)',
                      flexShrink: 0
                    }}>
                      <img
                        src={msg.avatar}
                        alt={msg.senderName}
                        style={{ width: 34, height: 34, objectFit: 'cover', display: 'block' }}
                      />
                    </div>

                    <div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '4px',
                        justifyContent: isMe ? 'flex-end' : 'flex-start'
                      }}>
                        <span style={{ fontFamily: 'var(--font-titan)', fontSize: '0.85rem', color: '#18181B' }}>
                          {msg.senderName} {isMe ? '(You)' : ''}
                        </span>
                        <span className="ripped-tag ripped-yellow" style={{ fontSize: '0.62rem', padding: '1px 8px' }}>
                          Teaches {senderMember.teachesSkill}
                        </span>
                        <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-hand)', fontWeight: 700, color: '#71717A' }}>
                          {msg.time}
                        </span>
                      </div>

                      <div style={{
                        padding: '12px 16px',
                        borderRadius: isMe ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                        background: isMe ? '#FEF08A' : '#FFFFFF',
                        color: '#18181B',
                        fontSize: '0.9rem',
                        lineHeight: 1.5,
                        border: '2px solid #27272A',
                        boxShadow: isMe ? '3px 4px 0px rgba(0, 0, 0, 0.15)' : '2px 3px 0px rgba(0, 0, 0, 0.1)',
                        fontWeight: 600
                      }}>
                        {msg.text}
                      </div>
                    </div>
                  </div>
                );
              })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* PROGRESS SIDE PANEL: Post-it Card */}
            {showProgressDrawer && (
              <div className="yellow-postit" style={{
                width: 'min(320px, 100%)',
                maxWidth: '100%',
                padding: '24px 20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '2px solid #27272A',
                boxShadow: '4px 6px 0px rgba(0,0,0,0.15)'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <Triangle size={18} fill="#78350F" color="#78350F" />
                    <h3 style={{ fontFamily: 'var(--font-titan)', fontSize: '1.1rem', color: '#78350F' }}>
                      CIRCLE SESSIONS
                    </h3>
                  </div>
                  <p style={{ fontSize: '0.85rem', fontFamily: 'var(--font-hand)', fontWeight: 700, color: '#92400E', marginBottom: '16px', lineHeight: 1.3 }}>
                    Complete all 3 circular hops to unlock the graduation celebration! 🎓
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {activeCircle.sessions.map((sess, idx) => (
                      <div key={sess.id} style={{
                        background: '#FFFFFF',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: sess.status === 'Completed' ? '2px solid #007A3D' : '2px solid #27272A',
                        boxShadow: '2px 2px 0px rgba(0,0,0,0.1)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-titan)', color: '#0284C7' }}>Hop {idx + 1}</span>
                          <span className={sess.status === 'Completed' ? 'ripped-tag ripped-green' : 'ripped-tag ripped-yellow'} style={{ fontSize: '0.62rem', padding: '1px 6px' }}>
                            {sess.status}
                          </span>
                        </div>
                        <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#18181B' }}>{sess.skill}</div>
                        <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-hand)', fontWeight: 700, color: '#71717A' }}>
                          {sess.teacher} ➔ {sess.learner}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => navigate('/circle/sessions')}
                  className="btn-3d-green"
                  style={{ width: '100%', padding: '10px', fontSize: '0.82rem', marginTop: '16px' }}
                >
                  OPEN SESSIONS HUB ➔
                </button>
              </div>
            )}
          </div>

          {/* INPUT BAR */}
          <form onSubmit={handleSend} style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '16px' }}>
            <button
              type="button"
              onClick={() => sendCircleMessage('Shared starter link: https://github.com/campus-skills/fastapi-sql-demo')}
              title="Share Repo"
              className="software-tile"
              style={{ width: '48px', height: '48px', borderRadius: '12px', flexShrink: 0, padding: 0 }}
            >
              <Paperclip size={20} color="#FFF" />
            </button>

            <input
              type="text"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder="Message ByteSwap Trio #1... (e.g. Prepping SQL queries for our session!)"
              className="scrapbook-input"
              style={{ flex: 1, height: '48px', fontSize: '0.92rem' }}
            />

            <button
              type="submit"
              className="btn-3d-green"
              style={{ width: '48px', height: '48px', padding: 0, borderRadius: '12px', flexShrink: 0 }}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
