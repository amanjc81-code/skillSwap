import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSkillSwap } from '../../app/SkillSwapContext.jsx';
import {
  ArrowRightLeft,
  Calendar,
  Send,
  Paperclip,
  FileText,
  ExternalLink,
  CheckCheck,
  Sparkles
} from 'lucide-react';

export const DirectChatPage = () => {
  const navigate = useNavigate();
  const {
    directChatMessages,
    sendDirectMessage,
    setActiveModal,
    setModalPayload
  } = useSkillSwap();

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [directChatMessages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    sendDirectMessage(inputVal);
    setInputVal('');

    // Simulate other user typing indicator after 400ms
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
      }, 1000);
    }, 300);
  };

  const handleAttachCheatSheet = () => {
    sendDirectMessage('Here is the official cheatsheet we discussed:', {
      name: 'FullStack_Architecture_Roadmap.pdf',
      size: '2.4 MB',
      type: 'pdf'
    });
  };

  return (
    <div className="scrapbook-desk">
      <div style={{ maxWidth: '980px', margin: '0 auto' }}>
        {/* OPEN NOTEBOOK / LEGAL PAD BINDER */}
        <div className="notebook-sheet" style={{ padding: '36px 32px 28px 36px', minHeight: '84vh', display: 'flex', flexDirection: 'column' }}>
          {/* Top Chrome Binder Clip */}
          <div className="binder-clip-top" />

          {/* CHAT HEADER: Scrapbook Desk Profile Bar */}
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
            {/* Red pushpin on top right of header */}
            <div className="pushpin-3d pushpin-red" style={{ top: '-10px', right: '14px' }} />

            {/* Partner Info with Polaroid Thumbnail */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                background: '#FFF',
                padding: '4px 4px 10px 4px',
                border: '1.5px solid #27272A',
                boxShadow: '2px 3px 6px rgba(0,0,0,0.15)',
                transform: 'rotate(-3deg)',
                position: 'relative'
              }}>
                <img
                  src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&auto=format&fit=crop&q=80"
                  alt="Anuj Verma"
                  style={{ width: '48px', height: '48px', objectFit: 'cover', display: 'block' }}
                />
                <span style={{
                  position: 'absolute',
                  bottom: '2px',
                  right: '2px',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: '#10B981',
                  border: '1.5px solid #FFF'
                }} />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--font-titan)', fontSize: '1.3rem', color: '#18181B', letterSpacing: '0.02em' }}>
                    ANUJ VERMA
                  </span>
                  <span className="sticker-badge sticker-badge-exp" style={{ fontSize: '0.72rem', padding: '3px 12px' }}>
                    ACTIVE NOW
                  </span>
                </div>
                <div style={{ fontFamily: 'var(--font-hand)', fontSize: '1.15rem', color: '#047857', fontWeight: 700, marginTop: '-2px' }}>
                  IIT Delhi • Computer Science Dept ✍️
                </div>
              </div>
            </div>

            {/* Action Button: 3D Schedule Session */}
            <div>
              <button
                type="button"
                onClick={() => {
                  setModalPayload({
                    partnerName: 'Anuj Verma',
                    partnerAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&auto=format&fit=crop&q=80',
                    topic: 'SQL Query Optimization & Indexing'
                  });
                  setActiveModal('schedule-session');
                }}
                className="btn-3d-green"
                style={{ padding: '10px 20px', fontSize: '0.85rem' }}
              >
                <Calendar size={16} /> SCHEDULE SESSION
              </button>
            </div>
          </div>

          {/* ACTIVE SKILL EXCHANGE TAPE STRIP */}
          <div style={{
            background: '#FEF9C3',
            border: '2px dashed #CA8A04',
            borderRadius: '8px',
            padding: '10px 18px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.86rem',
            flexWrap: 'wrap',
            gap: '8px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontFamily: 'var(--font-hand)', fontSize: '1.1rem', fontWeight: 700, color: '#78350F' }}>
                You teach:
              </span>
              <span className="ripped-tag ripped-green" style={{ fontSize: '0.78rem', padding: '3px 12px' }}>
                {currentUser.teaching?.[0] || 'Full Stack'}
              </span>
            </div>
            <ArrowRightLeft size={18} color="#047857" />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontFamily: 'var(--font-hand)', fontSize: '1.1rem', fontWeight: 700, color: '#78350F' }}>
                Partner teaches:
              </span>
              <span className="ripped-tag ripped-blue" style={{ fontSize: '0.78rem', padding: '3px 12px' }}>
                SQL & Database
              </span>
            </div>
          </div>

          {/* MESSAGES SCROLL CONTAINER: Legal Pad Lined Journal */}
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
              marginBottom: '16px',
              boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.04)'
            }}
          >
            {directChatMessages.length === 0 ? (
              <div style={{ margin: 'auto', textAlign: 'center', padding: '30px 10px' }}>
                <div className="yellow-postit" style={{ maxWidth: '360px', margin: '0 auto', transform: 'rotate(-1.5deg)' }}>
                  <div className="pushpin-3d pushpin-red" style={{ top: '-12px', left: '50%', transform: 'translateX(-50%)' }} />
                  <span style={{ fontSize: '2rem', display: 'block', marginBottom: '8px' }}>💬</span>
                  <h3 style={{ fontFamily: 'var(--font-titan)', fontSize: '1.3rem', color: '#18181B', marginBottom: '6px' }}>
                    START CHATTING
                  </h3>
                  <p style={{ fontFamily: 'var(--font-hand)', fontSize: '1.15rem', color: '#78350F', fontWeight: 700, margin: '0 auto', lineHeight: 1.35 }}>
                    Say hello to your peer match, discuss syllabus topics, or share a study guide! ✍️
                  </p>
                </div>
              </div>
            ) : (
              directChatMessages.map((msg, index) => {
                const isMe = msg.sender === 'me' || msg.senderId === currentUser?.id || msg.sender === currentUser?.name || msg.sender === (currentUser?.name ? currentUser.name.split(' ')[0] : 'You');
                return (
                  <div
                    key={msg.id || index}
                    style={{
                      alignSelf: isMe ? 'flex-end' : 'flex-start',
                      maxWidth: '75%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isMe ? 'flex-end' : 'flex-start'
                    }}
                  >
                  <div
                    style={{
                      padding: '12px 18px',
                      borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      background: isMe ? '#FEF08A' : '#FFFFFF',
                      color: '#18181B',
                      fontSize: '0.92rem',
                      lineHeight: 1.5,
                      border: '2px solid #27272A',
                      boxShadow: isMe ? '3px 4px 0px rgba(0, 0, 0, 0.15)' : '2px 3px 0px rgba(0, 0, 0, 0.1)',
                      fontWeight: 600
                    }}
                  >
                    {msg.text}

                    {/* Resource Attachment preview */}
                    {msg.attachment && (
                      <div style={{
                        marginTop: '10px',
                        background: '#F4F4F5',
                        border: '1.5px solid #27272A',
                        borderRadius: '8px',
                        padding: '10px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        boxShadow: '1px 2px 0px rgba(0,0,0,0.1)'
                      }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          background: '#EF4444',
                          color: '#FFF',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <FileText size={20} />
                        </div>
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#18181B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {msg.attachment.name}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#71717A' }}>
                            {msg.attachment.size} • Study Document
                          </div>
                        </div>
                        <ExternalLink size={16} color="#18181B" />
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontSize: '0.75rem', fontFamily: 'var(--font-hand)', fontWeight: 700, color: '#71717A' }}>
                    <span>{msg.time}</span>
                    {isMe && <CheckCheck size={13} color="#059669" />}
                  </div>
                </div>
              );
            })
            )}

            {/* Typing indicator */}
            {isTyping && (
              <div style={{
                alignSelf: 'flex-start',
                background: '#FEF08A',
                border: '1.5px solid #27272A',
                padding: '6px 14px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '2px 2px 0px rgba(0,0,0,0.1)'
              }}>
                <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-hand)', fontWeight: 700, color: '#78350F' }}>
                  Anuj is scribbling notes...
                </span>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#059669', display: 'inline-block' }} />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* INPUT FORM BAR: Manila paper strip */}
          <form onSubmit={handleSend} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              type="button"
              onClick={handleAttachCheatSheet}
              title="Attach study sheet"
              className="software-tile"
              style={{ width: '48px', height: '48px', borderRadius: '12px', flexShrink: 0, padding: 0 }}
            >
              <Paperclip size={20} color="#FFF" />
            </button>

            <input
              type="text"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder="Write note to Anuj... (e.g. Can you explain B-Tree index depths?)"
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
