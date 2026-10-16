import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSkillSwap } from '../../app/SkillSwapContext.jsx';
import {
  Bell,
  ArrowRightLeft,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Triangle,
  Calendar,
  Star,
  Award,
  Check,
  ChevronRight
} from 'lucide-react';

export const NotificationsPage = () => {
  const navigate = useNavigate();
  const { notifications, markAllNotificationsRead } = useSkillSwap();

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'swap-request':
        return { icon: ArrowRightLeft, color: '#FFFFFF', bg: '#0284C7' };
      case 'request-accepted':
        return { icon: CheckCircle2, color: '#FFFFFF', bg: '#008744' };
      case 'request-rejected':
        return { icon: XCircle, color: '#FFFFFF', bg: '#DC2626' };
      case 'circle-match':
      case 'circle-invite':
        return { icon: Triangle, color: '#FFFFFF', bg: '#F59E0B' };
      case 'session-scheduled':
      case 'session-completed':
        return { icon: Calendar, color: '#FFFFFF', bg: '#7C3AED' };
      case 'message':
        return { icon: MessageSquare, color: '#FFFFFF', bg: '#EA580C' };
      case 'review':
        return { icon: Star, color: '#FFFFFF', bg: '#F59E0B' };
      case 'level-up':
        return { icon: Award, color: '#FFFFFF', bg: '#008744' };
      default:
        return { icon: Bell, color: '#FFFFFF', bg: '#0284C7' };
    }
  };

  return (
    <div className="scrapbook-desk">
      <div style={{ maxWidth: '820px', margin: '0 auto' }}>
        <div className="notebook-sheet" style={{ padding: '36px 32px 40px 36px', position: 'relative' }}>
          {/* Top Chrome Binder Clip */}
          <div className="binder-clip-top" />

          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '26px',
            flexWrap: 'wrap',
            gap: '14px',
            borderBottom: '2px dashed #C4B98E',
            paddingBottom: '20px'
          }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="sticker-badge sticker-badge-cert" style={{ fontSize: '0.72rem', padding: '3px 12px' }}>
                  <Bell size={12} style={{ marginRight: '4px' }} /> CAMPUS BULLETIN & ACTIVITY
                </span>
              </div>
              <h1 style={{ fontFamily: 'var(--font-titan)', fontSize: '2.3rem', color: '#18181B', letterSpacing: '0.02em', margin: 0 }}>
                NOTIFICATIONS
              </h1>
              <p style={{ fontFamily: 'var(--font-hand)', fontSize: '1.2rem', color: '#047857', fontWeight: 700, margin: '4px 0 0 0' }}>
                Real-time updates on skill swaps, circle matches, and study invites ✍️
              </p>
            </div>

            <button
              onClick={markAllNotificationsRead}
              className="btn-3d-yellow"
              style={{ padding: '8px 18px', fontSize: '0.82rem' }}
            >
              <Check size={14} /> MARK ALL READ
            </button>
          </div>

          {/* Notifications List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {notifications.length === 0 ? (
              <div className="yellow-postit" style={{ padding: '40px 20px', textAlign: 'center', maxWidth: '440px', margin: '20px auto', border: '2px solid #27272A' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📬</div>
                <h3 style={{ fontFamily: 'var(--font-titan)', fontSize: '1.4rem', color: '#78350F', marginBottom: '6px' }}>
                  ALL CAUGHT UP!
                </h3>
                <p style={{ fontFamily: 'var(--font-hand)', fontSize: '1.2rem', color: '#92400E', fontWeight: 700, margin: '8px auto' }}>
                  No new notifications right now. Swap requests and session updates will appear here! ✍️
                </p>
              </div>
            ) : (
              notifications.map(item => {
                const { icon: Icon, color, bg } = getNotificationIcon(item.type);

              return (
                <div
                  key={item.id}
                  onClick={() => item.link && navigate(item.link)}
                  className="scrapbook-paper-card"
                  style={{
                    padding: '18px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    cursor: item.link ? 'pointer' : 'default',
                    background: item.unread ? '#FEF9C3' : '#FFFFFF',
                    border: item.unread ? '2px solid #CA8A04' : '2px solid #27272A',
                    boxShadow: item.unread ? '3px 4px 0px #CA8A04' : '3px 3px 0px rgba(0,0,0,0.1)',
                    transition: 'transform 0.15s ease'
                  }}
                >
                  {/* Type Icon 3D Stamp */}
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: color,
                    flexShrink: 0,
                    boxShadow: '0 3px 0 rgba(0,0,0,0.25)',
                    border: '1.5px solid rgba(0,0,0,0.15)'
                  }}>
                    <Icon size={20} fill={item.type === 'circle-match' ? color : 'none'} />
                  </div>

                  {/* Message Details */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px', flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'var(--font-titan)', fontSize: '1rem', color: '#18181B' }}>
                        {item.title}
                      </span>
                      {item.unread && (
                        <span className="ripped-tag ripped-green" style={{ fontSize: '0.65rem', padding: '1px 8px' }}>
                          NEW NOTICE
                        </span>
                      )}
                    </div>
                    <p style={{ color: '#3F3F46', fontSize: '0.88rem', lineHeight: 1.4, margin: '2px 0 0 0', fontWeight: 600 }}>
                      {item.message}
                    </p>
                    <div style={{ fontSize: '0.78rem', fontFamily: 'var(--font-hand)', fontWeight: 700, color: '#71717A', marginTop: '4px' }}>
                      {item.time} ✍️
                    </div>
                  </div>

                  {item.link && (
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: '#F4F4F5',
                      border: '1.5px solid #27272A',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <ChevronRight size={18} color="#18181B" />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
        </div>
      </div>
    </div>
  );
};
