import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSkillSwap } from '../../app/SkillSwapContext.jsx';
import {
  Inbox,
  ArrowRightLeft,
  Check,
  X,
  User,
  Clock,
  Sparkles,
  Send,
  MessageSquare
} from 'lucide-react';

export const RequestsInboxPage = () => {
  const navigate = useNavigate();
  const {
    receivedRequests,
    sentRequests,
    acceptRequest,
    rejectRequest
  } = useSkillSwap();

  const [activeTab, setActiveTab] = useState('received'); // 'received' | 'sent'

  const getStatusPill = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span style={{
            background: 'rgba(245, 158, 11, 0.15)',
            color: '#FBBF24',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.04em'
          }}>
            ● Pending
          </span>
        );
      case 'accepted':
        return (
          <span style={{
            background: 'rgba(163, 230, 53, 0.15)',
            color: 'var(--lime)',
            border: '1px solid rgba(163, 230, 53, 0.35)',
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.04em'
          }}>
            ✓ Accepted
          </span>
        );
      case 'rejected':
        return (
          <span style={{
            background: 'rgba(239, 68, 68, 0.15)',
            color: '#F87171',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.04em'
          }}>
            ✕ Rejected
          </span>
        );
      case 'completed':
        return (
          <span style={{
            background: 'rgba(139, 92, 246, 0.15)',
            color: '#C4B5FD',
            border: '1px solid rgba(139, 92, 246, 0.35)',
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.04em'
          }}>
            ★ Completed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="scrapbook-desk">
      <div style={{ maxWidth: '980px', margin: '0 auto', position: 'relative' }}>
        
        {/* Top Zine Badge */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <div style={{
            background: '#FEF08A',
            border: '2px solid #EAB308',
            borderRadius: '4px',
            padding: '6px 18px',
            transform: 'rotate(-1.5deg)',
            boxShadow: '0 8px 16px rgba(0,0,0,0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '1rem' }}>📌</span>
            <span style={{ fontFamily: 'var(--font-dela)', fontSize: '0.82rem', color: '#854D0E' }}>
              CAMPUS PROPOSAL INBOX • INCOMING &amp; OUTGOING PEER INVITATIONS
            </span>
          </div>
        </div>

        {/* Notebook Binder Sheet */}
        <div className="notebook-sheet" style={{ padding: '44px 38px 54px 44px' }}>
          
          {/* Chrome Binder Clip at Top */}
          <div className="binder-clip-top" />

          {/* Top Header */}
          <div style={{ marginBottom: '26px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="sticker-badge sticker-badge-exp" style={{ fontSize: '0.78rem', padding: '4px 14px' }}>
                <Inbox size={13} /> SWAP ACTIVITY &amp; INBOX
              </span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-dela)', fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)', color: '#1E3A8A' }}>
              REQUESTS <span style={{ color: '#008744' }}>INBOX</span>
            </h1>
            <p style={{ color: '#4B5563', fontSize: '0.95rem', marginTop: '4px' }}>
              Review inbound swap invitations from campus peers or check the status of your sent invites.
            </p>
          </div>

          {/* Tabs Switcher as 3D Folder Tabs */}
          <div style={{
            display: 'flex',
            gap: '12px',
            borderBottom: '2px solid #E2E8F0',
            paddingBottom: '16px',
            marginBottom: '26px'
          }}>
            <button
              type="button"
              onClick={() => setActiveTab('received')}
              style={{
                padding: '10px 22px',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontFamily: 'var(--font-titan)',
                background: activeTab === 'received' ? '#008744' : '#FFFFFF',
                color: activeTab === 'received' ? '#FFFFFF' : '#1E3A8A',
                border: activeTab === 'received' ? '2.5px solid #005a2d' : '2px solid #CBD5E1',
                boxShadow: activeTab === 'received' ? '0 4px 0 #005a2d' : '0 2px 4px rgba(0,0,0,0.05)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <span>RECEIVED PROPOSALS</span>
              <span style={{
                background: activeTab === 'received' ? 'rgba(255, 255, 255, 0.25)' : '#E2E8F0',
                padding: '2px 8px',
                borderRadius: '999px',
                fontSize: '0.75rem'
              }}>
                {receivedRequests.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('sent')}
              style={{
                padding: '10px 22px',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontFamily: 'var(--font-titan)',
                background: activeTab === 'sent' ? '#1E3A8A' : '#FFFFFF',
                color: activeTab === 'sent' ? '#FFFFFF' : '#1E3A8A',
                border: activeTab === 'sent' ? '2.5px solid #172554' : '2px solid #CBD5E1',
                boxShadow: activeTab === 'sent' ? '0 4px 0 #172554' : '0 2px 4px rgba(0,0,0,0.05)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <span>SENT INVITES</span>
              <span style={{
                background: activeTab === 'sent' ? 'rgba(255, 255, 255, 0.25)' : '#E2E8F0',
                padding: '2px 8px',
                borderRadius: '999px',
                fontSize: '0.75rem'
              }}>
                {sentRequests.length}
              </span>
            </button>
          </div>

          {/* RECEIVED REQUESTS LIST */}
          {activeTab === 'received' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {receivedRequests.length > 0 ? (
                receivedRequests.map(req => (
                  <div
                    key={req.id}
                    style={{
                      background: '#FFFFFF',
                      border: '2.5px solid #1E3A8A',
                      borderRadius: '10px',
                      padding: '24px',
                      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                      position: 'relative'
                    }}
                  >
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <img
                          src={req.sender.avatar}
                          alt={req.sender.name}
                          style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #008744' }}
                        />
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0F172A' }}>{req.sender.name}</div>
                          <div style={{ fontSize: '0.82rem', color: '#64748B' }}>{req.sender.college}</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '0.78rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                          <Clock size={13} /> {req.time}
                        </span>
                        {getStatusPill(req.status)}
                      </div>
                    </div>

                    {/* Skill trade banner */}
                    <div style={{
                      background: '#F8FAFC',
                      border: '1.5px solid #E2E8F0',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '10px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 600 }}>They will teach:</span>
                        <span className="ripped-tag ripped-green" style={{ fontSize: '0.78rem', padding: '3px 12px' }}>
                          {req.teachSkill}
                        </span>
                      </div>
                      <ArrowRightLeft size={16} color="#008744" />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 600 }}>They want to learn:</span>
                        <span className="ripped-tag ripped-blue" style={{ fontSize: '0.78rem', padding: '3px 12px' }}>
                          {req.learnSkill}
                        </span>
                      </div>
                    </div>

                    {/* Message note */}
                    <div style={{
                      background: '#FEF08A',
                      border: '1px solid #FDE047',
                      borderRadius: '6px',
                      padding: '12px 16px',
                      fontFamily: 'var(--font-hand)',
                      fontSize: '1.15rem',
                      color: '#1C1917',
                      fontWeight: 700,
                      lineHeight: 1.3
                    }}>
                      "{req.message}"
                    </div>

                    {/* Action buttons */}
                    {req.status === 'pending' && (
                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={() => navigate('/profile')}
                          style={{
                            padding: '8px 16px',
                            background: '#FFFFFF',
                            border: '2px solid #CBD5E1',
                            borderRadius: '6px',
                            fontSize: '0.85rem',
                            fontFamily: 'var(--font-titan)',
                            color: '#334155',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <User size={14} /> VIEW PROFILE
                        </button>
                        <button
                          type="button"
                          onClick={() => rejectRequest(req.id)}
                          style={{
                            padding: '8px 16px',
                            background: '#FEF2F2',
                            border: '2px solid #FCA5A5',
                            borderRadius: '6px',
                            fontSize: '0.85rem',
                            fontFamily: 'var(--font-titan)',
                            color: '#DC2626',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <X size={15} /> DECLINE
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            acceptRequest(req.id);
                            setTimeout(() => navigate('/chat'), 800);
                          }}
                          style={{
                            padding: '8px 22px',
                            background: '#008744',
                            border: '2.5px solid #005a2d',
                            borderRadius: '6px',
                            fontSize: '0.88rem',
                            fontFamily: 'var(--font-titan)',
                            color: '#FFFFFF',
                            boxShadow: '0 3px 0 #005a2d',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <Check size={16} /> ACCEPT &amp; START CHAT ⚡
                        </button>
                      </div>
                    )}

                    {req.status === 'accepted' && (
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          onClick={() => navigate('/chat')}
                          style={{
                            padding: '8px 20px',
                            background: '#008744',
                            border: '2px solid #005a2d',
                            borderRadius: '6px',
                            color: '#FFF',
                            fontFamily: 'var(--font-titan)',
                            fontSize: '0.85rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer'
                          }}
                        >
                          <MessageSquare size={15} /> OPEN CONVERSATION
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div style={{
                  background: '#FFFFFF',
                  border: '2.5px dashed #CBD5E1',
                  borderRadius: '10px',
                  padding: '60px 20px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🌱</div>
                  <h3 style={{ fontFamily: 'var(--font-dela)', fontSize: '1.3rem', color: '#1E3A8A' }}>NO REQUESTS YET</h3>
                  <p style={{ color: '#64748B', fontSize: '0.92rem', margin: '6px auto 18px auto' }}>
                    Go find your skill twin or propose a swap from student discovery!
                  </p>
                  <button
                    onClick={() => navigate('/match')}
                    style={{
                      padding: '10px 24px',
                      background: '#008744',
                      border: '2px solid #005a2d',
                      borderRadius: '6px',
                      color: '#FFF',
                      fontFamily: 'var(--font-titan)',
                      cursor: 'pointer'
                    }}
                  >
                    BROWSE MATCHES ➔
                  </button>
                </div>
              )}
            </div>
          )}

          {/* SENT REQUESTS LIST */}
          {activeTab === 'sent' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {sentRequests.length > 0 ? (
                sentRequests.map(req => (
                  <div
                    key={req.id}
                    style={{
                      background: '#FFFFFF',
                      border: '2.5px solid #1E3A8A',
                      borderRadius: '10px',
                      padding: '24px',
                      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={req.receiver.avatar}
                          alt={req.receiver.name}
                          style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #1E3A8A' }}
                        />
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0F172A' }}>
                            To: {req.receiver.name}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                            {req.receiver.college} • Sent {req.time}
                          </div>
                        </div>
                      </div>

                      {getStatusPill(req.status)}
                    </div>

                    <div style={{ fontSize: '0.9rem', color: '#334155' }}>
                      You offered <strong style={{ color: '#008744' }}>{req.teachSkill}</strong> in exchange for <strong style={{ color: '#1E3A8A' }}>{req.learnSkill}</strong>.
                    </div>

                    <div style={{
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderRadius: '6px',
                      padding: '10px 14px',
                      fontSize: '0.88rem',
                      color: '#475569',
                      fontStyle: 'italic'
                    }}>
                      "{req.message}"
                    </div>

                    {req.status === 'accepted' && (
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                        <button
                          type="button"
                          onClick={() => navigate('/chat')}
                          style={{
                            padding: '8px 18px',
                            background: '#008744',
                            border: '2px solid #005a2d',
                            borderRadius: '6px',
                            color: '#FFF',
                            fontFamily: 'var(--font-titan)',
                            fontSize: '0.85rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          <MessageSquare size={14} /> OPEN DIRECT CHAT
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div style={{
                  background: '#FFFFFF',
                  border: '2.5px dashed #CBD5E1',
                  borderRadius: '10px',
                  padding: '60px 20px',
                  textAlign: 'center'
                }}>
                  <p style={{ color: '#64748B' }}>No sent swap requests.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

