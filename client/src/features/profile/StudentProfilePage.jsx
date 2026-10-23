import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSkillSwap } from '../../app/SkillSwapContext.jsx';
import {
  ArrowLeft,Star,
  Award,
  Zap,
  CheckCircle2,
  Calendar,
  MessageSquare,
  ShieldCheck,
  Send,
  ArrowRightLeft,
  Settings,
  Heart,
  Clock,
  ExternalLink,
  Sparkles
} from 'lucide-react';

export const StudentProfilePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser, students, sessions, setActiveModal, setModalPayload } = useSkillSwap();
  const [activeTab, setActiveTab] = useState('scrapbook'); // 'scrapbook' | 'reviews' | 'sessions'

  // Resolve target student: either from route param /profile/:id or fallback to currentUser
  const targetStudent = id ? (students || []).find(s => s.id === id) : null;
  const isViewingSelf = !targetStudent || targetStudent.id === currentUser.id;

  const profileUser = isViewingSelf ? currentUser : {
    id: targetStudent.id,
    name: targetStudent.name,
    handle: targetStudent.handle || `@${targetStudent.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
    college: targetStudent.college,
    branch: targetStudent.branch || 'Computer Science & Engineering',
    email: targetStudent.email || `${targetStudent.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@campus.edu`,
    bio: targetStudent.bio,
    avatar: targetStudent.avatar,
    levelBadge: targetStudent.matchType === 'Perfect Match' ? 'PERFECT PEER MATCH ⚡' : 'VERIFIED PEER MENTOR 🎓',
    stats: {
      rating: targetStudent.rating || 4.9,
      completedSwaps: targetStudent.reviewsCount || 18,
      activeCircles: 1,
      responseRate: '100%',
      reviewsCount: targetStudent.reviewsCount || 18
    },
    teaching: targetStudent.canTeach || [],
    learning: targetStudent.wantsToLearn || [],
    availability: targetStudent.availability || targetStudent.mode || 'Both',
    preferredTimes: targetStudent.preferredTimes || ['Weekdays 5-8 PM', 'Weekends'],
    badges: ['Top Mentor ⚡', 'Campus Verified 🎓', 'Fast Responder 🚀'],
    reviews: [
      {
        id: 'rev-1',
        author: 'Aman Chauhan',
        college: 'MIT ACSC',
        skill: targetStudent.canTeach?.[0] || 'Peer Skills',
        comment: `Awesome peer session! Extremely knowledgeable in ${targetStudent.canTeach?.[0] || 'this topic'} and very patient.`
      },
      {
        id: 'rev-2',
        author: 'Rahul Sharma',
        college: 'COEP Tech',
        skill: targetStudent.canTeach?.[1] || targetStudent.canTeach?.[0] || 'Core Concepts',
        comment: 'Clear explanation with real-world examples and practical code snippets. Highly recommended for 1-to-1 swaps!'
      }
    ]
  };

  const reviewsList = profileUser.reviews || [];
  const completedSessions = sessions.filter(s => s.status === 'Completed');
  const allSkills = [...(profileUser.teaching || []), ...(profileUser.learning || [])];

  return (
    <div className="scrapbook-desk">
      <div style={{ maxWidth: '980px', margin: '0 auto', position: 'relative' }}>
        
        {/* Top Floating Control Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="sticker-badge sticker-badge-exp" style={{ fontSize: '0.8rem', padding: '4px 14px' }}>
              {isViewingSelf ? 'MY CAMPUS PASSPORT' : 'PEER PASSPORT'}
            </span>
            <span style={{ color: '#FDE047', fontFamily: 'var(--font-hand)', fontSize: '1.25rem', fontWeight: 700 }}>
              {isViewingSelf ? 'SkillSwap Peer Zine ✍️' : `${profileUser.name.split(' ')[0]}'s Peer Zine ✍️`}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {!isViewingSelf && (
              <button
                type="button"
                onClick={() => navigate('/match')}
                className="btn-secondary"
                style={{
                  background: 'rgba(255,255,255,0.18)',
                  color: '#FFF',
                  padding: '10px 18px',
                  fontSize: '0.85rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <ArrowLeft size={16} /> Back to Matches
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setModalPayload(isViewingSelf ? null : targetStudent);
                setActiveModal('swap-request');
              }}
              className="btn-lime"
              style={{
                padding: '10px 22px',
                fontSize: '0.9rem',
                fontFamily: 'var(--font-titan)',
                letterSpacing: '0.04em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <Send size={15} /> {isViewingSelf ? 'PROPOSE 1:1 SWAP' : `SWAP WITH ${profileUser.name.split(' ')[0].toUpperCase()} ⚡`}
            </button>

            {isViewingSelf && (
              <button
                type="button"
                onClick={() => navigate('/settings')}
                className="btn-secondary"
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  color: '#FFF',
                  padding: '10px 18px',
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                <Settings size={15} /> Edit
              </button>
            )}
          </div>
        </div>

        {/* MAIN NOTEBOOK / BINDER SHEET (EXACT LAYOUT FROM IMAGE) */}
        <div className="notebook-sheet" style={{ padding: '45px 36px 60px 42px' }}>
          
          {/* Chrome Binder Clip at Top Left */}
          <div className="binder-clip-top" />

          {/* =========================================================================
              HEADER SECTION: POLAROID + ENVELOPE + HERO GREETING
              ========================================================================= */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '24px',
            marginBottom: '40px',
            alignItems: 'flex-start'
          }}>
            
            {/* LEFT: Pinned Polaroid with 3D Pushpin, Clip, Star & QR Codes */}
            <div style={{ gridColumn: 'span 5', position: 'relative' }}>
              
              {/* Star Doodle in Crayon Behind Photo */}
              <svg
                className="star-doodle"
                viewBox="0 0 100 100"
                style={{
                  position: 'absolute',
                  top: '-15px',
                  right: '0px',
                  width: '80px',
                  height: '80px',
                  zIndex: 5,
                  transform: 'rotate(15deg)',
                  pointerEvents: 'none'
                }}
              >
                <polygon
                  points="50,5 64,36 98,36 70,57 81,91 50,70 19,91 30,57 2,36 36,36"
                  fill="none"
                  stroke="#FBBF24"
                  strokeWidth="5"
                  strokeLinejoin="round"
                />
              </svg>

              {/* QR Code Sticker: GitHub / Campus ID */}
              <div style={{
                position: 'absolute',
                top: '-25px',
                left: '0px',
                zIndex: 35,
                background: '#FFFFFF',
                padding: '6px 8px 8px 8px',
                borderRadius: '4px',
                boxShadow: '0 8px 18px rgba(0,0,0,0.2)',
                transform: 'rotate(-8deg)',
                textAlign: 'center'
              }}>
                {/* SVG QR Code pattern */}
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: '#000',
                  borderRadius: '2px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '2px',
                  padding: '3px'
                }}>
                  <div style={{ background: '#FFF' }} />
                  <div style={{ background: '#000' }} />
                  <div style={{ background: '#FFF' }} />
                  <div style={{ background: '#000' }} />
                  <div style={{ background: '#FFF' }} />
                  <div style={{ background: '#000' }} />
                  <div style={{ background: '#FFF' }} />
                  <div style={{ background: '#000' }} />
                  <div style={{ background: '#FFF' }} />
                </div>
                <div style={{ fontSize: '0.62rem', fontFamily: 'var(--font-marker)', color: '#18181B', marginTop: '3px' }}>
                  {profileUser.handle ? profileUser.handle.toUpperCase() : (profileUser.name ? `@${profileUser.name.toLowerCase().replace(/\s+/g, '')}` : '@STUDENT')}
                </div>
              </div>

              {/* QR Code Handwritten Note */}
              <div style={{
                position: 'absolute',
                top: '-30px',
                left: '75px',
                zIndex: 30,
                textAlign: 'left'
              }}>
                <span className="handwritten-label" style={{ color: '#15803D', fontSize: '1.2rem' }}>
                  My<br />Campus ID
                </span>
                <span style={{ fontFamily: 'var(--font-hand)', fontSize: '1.4rem', color: '#15803D', display: 'block', transform: 'rotate(-20deg)', marginTop: '-8px' }}>
                  ⤴
                </span>
              </div>

              {/* THE POLAROID PHOTO FRAME */}
              <div className="polaroid-card" style={{ transform: 'rotate(-3.5deg)', marginTop: '20px' }}>
                {/* 3D Red Pushpin on top edge */}
                <div className="pushpin-3d pushpin-red" style={{ top: '-12px', left: '42%' }} />

                <div style={{
                  width: '100%',
                  aspectRatio: '4/5',
                  overflow: 'hidden',
                  borderRadius: '2px',
                  position: 'relative',
                  background: '#18181B'
                }}>
                  <img
                    src={profileUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80'}
                    alt={profileUser.name || 'Student Profile'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />

                  {/* Gradient bottom bar inside photo */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '8px',
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                    color: '#FFF',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-marker)', color: '#A3E635' }}>
                      {profileUser.levelBadge || 'CAMPUS SWAPPER 🌱'}
                    </span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800 }}>
                      {profileUser.stats?.rating || 5.0} ★ ({profileUser.stats?.reviewsCount || 0})
                    </span>
                  </div>
                </div>

                <div style={{
                  textAlign: 'center',
                  marginTop: '10px',
                  fontFamily: 'var(--font-marker)',
                  fontSize: '0.95rem',
                  color: '#18181B'
                }}>
                  {profileUser.name || 'Campus Student'} • 2026
                </div>
              </div>

              {/* Bottom Behance / GitHub Tag with Paperclip */}
              <div style={{
                position: 'absolute',
                bottom: '-25px',
                left: '-10px',
                zIndex: 35,
                background: '#FFFFFF',
                padding: '6px 12px',
                borderRadius: '3px',
                boxShadow: '0 6px 14px rgba(0,0,0,0.18)',
                transform: 'rotate(4deg)',
                border: '1px solid #E5E7EB',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ fontSize: '1.1rem' }}>⭐</span>
                <div>
                  <div style={{ fontSize: '0.65rem', fontFamily: 'var(--font-marker)', color: '#2563EB' }}>
                    VERIFIED PEER
                  </div>
                  <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-hand)', fontWeight: 700, color: '#374151' }}>
                    {profileUser.teaching?.[0] || 'Peer Learning'} ↔ {profileUser.learning?.[0] || 'Skill Swap'}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Manila Envelope + Hero Greeting + Bio */}
            <div style={{ gridColumn: 'span 7' }}>
              
              {/* Top Manila Envelope with Letter Sliding Out */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '14px', position: 'relative' }}>
                
                {/* Hand-drawn Arrow: "Let's swap!" */}
                <div className="profile-decor-arrow" style={{
                  position: 'absolute',
                  top: '100px',
                  right: '70px',
                  zIndex: 30,
                  textAlign: 'center'
                }}>
                  <span style={{ fontFamily: 'var(--font-hand)', fontSize: '1.35rem', color: '#DC2626', fontWeight: 700 }}>
                    Let's swap!
                  </span>
                  <div style={{ color: '#DC2626', fontSize: '1.5rem', transform: 'rotate(-40deg)', marginTop: '-8px' }}>
                    ⤴
                  </div>
                </div>

                {/* The Manila Envelope */}
                <div className="manila-envelope" style={{
                  width: '270px',
                  padding: '12px 14px 28px 14px',
                  transform: 'rotate(2.5deg)'
                }}>
                  {/* Popping Letter */}
                  <div className="envelope-letter">
                    <div style={{ fontWeight: 800, color: '#1F2937', fontSize: '0.78rem', marginBottom: '2px' }}>
                      COLLEGE: {profileUser.college || 'Campus Tech University'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#4B5563', marginBottom: '2px' }}>
                      E: {profileUser.email || 'student@campus.edu'}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#6B7280' }}>
                      BRANCH: {profileUser.branch || 'Undergraduate'}
                    </div>
                  </div>
                </div>
              </div>

              {/* HERO GREETING */}
              <div style={{ marginBottom: '18px' }}>
                <div style={{
                  fontSize: 'clamp(2rem, 3.8vw, 3rem)',
                  fontFamily: 'var(--font-titan)',
                  color: '#1E3A8A',
                  lineHeight: 1.05,
                  letterSpacing: '0.02em'
                }}>
                  Hi, I'm <span style={{ color: '#1D4ED8' }}>{profileUser.name ? profileUser.name.split(' ')[0].toUpperCase() : 'STUDENT'}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap', margin: '4px 0' }}>
                  <span style={{
                    fontFamily: 'var(--font-hand)',
                    fontSize: 'clamp(1.5rem, 2.8vw, 2.2rem)',
                    fontWeight: 700,
                    color: '#1E3A8A',
                    fontStyle: 'italic'
                  }}>
                    Ready to teach
                  </span>
                  <span style={{
                    fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)',
                    fontFamily: 'var(--font-dela)',
                    color: '#008744',
                    lineHeight: 1,
                    letterSpacing: '-0.02em',
                    textTransform: 'uppercase'
                  }}>
                    {profileUser.teaching?.[0]?.toUpperCase() || 'NEW SKILLS'}
                  </span>
                </div>

                <div style={{
                  fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
                  fontFamily: 'var(--font-dela)',
                  color: '#008744',
                  lineHeight: 0.95,
                  letterSpacing: '-0.02em',
                  textTransform: 'uppercase',
                  marginBottom: '14px'
                }}>
                  {profileUser.name ? profileUser.name.split(' ').slice(1).join(' ').toUpperCase() || 'EXCHANGER' : 'SWAPPER'}
                </div>
              </div>

              {/* Bio with Bold Keyword Highlights */}
              <p style={{
                fontSize: '0.96rem',
                lineHeight: 1.65,
                color: '#374151',
                marginBottom: '22px'
              }}>
                {profileUser.bio || "Student and peer learner on campus. Ready to exchange skills without spending money. Connect with me for reciprocal 1-to-1 swaps and triangle circle sessions!"}
              </p>

              {/* Quick Reputation Badges */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {profileUser.teaching?.slice(0, 3).map((sk, i) => (
                  <span key={sk} className={`sticker-badge ${i === 0 ? 'sticker-badge-cert' : (i === 1 ? 'sticker-badge-exp' : 'sticker-badge-edu')}`} style={{ fontSize: '0.78rem', padding: '4px 12px' }}>
                    {sk.toUpperCase()} MENTOR
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* =========================================================================
              LOWER SECTION: EXPERIENCE (YELLOW POST-IT) vs EDUCATION + TORN TAGS + SOFTWARES
              ========================================================================= */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '32px',
            alignItems: 'flex-start'
          }}>
            
            {/* LEFT COLUMN: EXPERIENCE STICKER BADGE + REAL YELLOW POST-IT NOTE */}
            <div style={{ gridColumn: 'span 6' }}>
              
              {/* EXPERIENCE Oval Sticker Badge */}
              <div style={{ marginBottom: '14px' }}>
                <span className="sticker-badge sticker-badge-exp">
                  EXPERIENCE
                </span>
              </div>

              {/* The Yellow Post-It Note */}
              <div className="yellow-postit" style={{ transform: 'rotate(-1.8deg)' }}>
                <div style={{
                  fontFamily: 'var(--font-dela)',
                  fontSize: '0.92rem',
                  color: '#166534',
                  marginBottom: '4px',
                  letterSpacing: '0.02em'
                }}>
                  {profileUser.teaching?.[0] ? `${profileUser.teaching[0].toUpperCase()} PEER MENTOR` : 'CAMPUS LEARNER'}
                </div>
                <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-marker)', color: '#854D0E', marginBottom: '14px' }}>
                  (2025 - Now) • {profileUser.stats?.completedSwaps || 0} Peer Swaps
                </div>

                <div style={{
                  fontFamily: 'var(--font-dela)',
                  fontSize: '0.85rem',
                  color: '#166534',
                  marginBottom: '4px'
                }}>
                  “CAMPUS PEER NETWORK” STATUS
                </div>
                <div style={{ fontSize: '0.75rem', color: '#713F12', marginBottom: '14px', lineHeight: 1.4 }}>
                  Verified peer exchange profile on campus. Ready to teach &amp; learn without money.
                </div>

                <div style={{
                  fontFamily: 'var(--font-dela)',
                  fontSize: '0.85rem',
                  color: '#166534',
                  marginBottom: '6px'
                }}>
                  VERIFIED SWAP SESSIONS
                </div>
                
                {completedSessions.length > 0 ? (
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    fontSize: '0.82rem',
                    color: '#374151',
                    lineHeight: 1.55,
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 600
                  }}>
                    {completedSessions.map(s => (
                      <li key={s.id}>• {s.skill} (with {s.teacher.name})</li>
                    ))}
                  </ul>
                ) : (
                  <div style={{ fontSize: '0.8rem', color: '#713F12', fontStyle: 'italic', padding: '4px 0' }}>
                    • No completed swaps yet. Initiate your first peer session!
                  </div>
                )}
              </div>

              {/* CERTIFICATION Oval Sticker Badge */}
              <div style={{ marginTop: '28px', marginBottom: '12px' }}>
                <span className="sticker-badge sticker-badge-cert">
                  CERTIFICATION
                </span>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#374151', lineHeight: 1.5, paddingLeft: '6px' }}>
                <strong>“CAMPUS PEER EXCELLENCE”</strong> certified mentor (2025). Ranked in top 1% response rate and 100% mutual session completion.
              </div>

              {/* SOFTWARES Oval Sticker Badge (Exact from Image) */}
              <div style={{ marginTop: '28px', marginBottom: '14px' }}>
                <span className="sticker-badge sticker-badge-soft">
                  SOFTWARES
                </span>
              </div>

              {/* Green App Tiles Grid (Ps, Ai, Id, Lr style) */}
              <div className="software-tile-grid">
                <div className="software-tile" title="React">⚛️</div>
                <div className="software-tile" title="TypeScript">TS</div>
                <div className="software-tile" title="SQL / PostgreSQL">SQL</div>
                <div className="software-tile" title="Python">Py</div>
                <div className="software-tile" title="Figma">Fig</div>
                <div className="software-tile" title="Node.js">Node</div>
                <div className="software-tile" title="Docker">🐳</div>
              </div>
            </div>

            {/* RIGHT COLUMN: EDUCATION + TORN PAPER SKILL TAGS + REVIEWS */}
            <div style={{ gridColumn: 'span 6' }}>
              
              {/* EDUCATION Oval Sticker Badge */}
              <div style={{ marginBottom: '14px' }}>
                <span className="sticker-badge sticker-badge-edu">
                  EDUCATION
                </span>
              </div>

              <div style={{ marginBottom: '28px', paddingLeft: '4px' }}>
                <div style={{ fontFamily: 'var(--font-dela)', fontSize: '1rem', color: '#1E3A8A', marginBottom: '2px' }}>
                  {profileUser.college ? profileUser.college.toUpperCase() : 'CAMPUS COLLEGE / UNIVERSITY'}
                </div>
                <div style={{ fontSize: '0.82rem', fontFamily: 'var(--font-marker)', color: '#6B7280', marginBottom: '2px' }}>
                  (2024 - Ongoing)
                </div>
                <div style={{ fontSize: '0.88rem', color: '#374151', fontWeight: 600 }}>
                  {profileUser.branch || 'Undergraduate Student • Peer Learner'}
                </div>
              </div>

              {/* RIPPED / TORN PAPER TAPE SKILL TAGS (Exact from Image: Blue, Yellow, Orange, Green) */}
              <div style={{ marginBottom: '12px' }}>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-marker)', color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Torn Paper Skill Chips
                </span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '14px',
                marginBottom: '32px'
              }}>
                {allSkills.length > 0 ? (
                  allSkills.slice(0, 4).map((sk, idx) => {
                    const tagStyles = ['ripped-blue', 'ripped-yellow', 'ripped-orange', 'ripped-green'];
                    return (
                      <div key={sk + idx} className={`ripped-tag ${tagStyles[idx % tagStyles.length]}`} style={{ padding: '12px 14px' }}>
                        {sk.toUpperCase()}
                      </div>
                    );
                  })
                ) : (
                  <div className="ripped-tag ripped-yellow" style={{ padding: '12px 14px', gridColumn: 'span 2', textAlign: 'center' }}>
                    ADD SKILLS IN ONBOARDING OR SETTINGS
                  </div>
                )}
              </div>

              {/* PEER REVIEWS ON POST-IT STYLE CARDS */}
              <div style={{ marginBottom: '14px' }}>
                <span style={{ fontFamily: 'var(--font-hand)', fontSize: '1.4rem', color: '#15803D', fontWeight: 700 }}>
                  Peer Feedback Notes ✍️
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {reviewsList.length > 0 ? (
                  reviewsList.map(rev => (
                    <div
                      key={rev.id}
                      style={{
                        background: '#FFFFFF',
                        border: '1px solid #E5E7EB',
                        borderRadius: '4px',
                        padding: '14px 16px',
                        boxShadow: '0 6px 14px rgba(0,0,0,0.06)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#1F2937' }}>
                          {rev.author} ({rev.college})
                        </span>
                        <span style={{ color: '#EAB308', fontWeight: 800, fontSize: '0.85rem' }}>
                          ★★★★★
                        </span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700, marginBottom: '6px' }}>
                        Topic: {rev.skill}
                      </div>
                      <p style={{ fontSize: '0.82rem', color: '#4B5563', lineHeight: 1.45, fontStyle: 'italic' }}>
                        "{rev.comment}"
                      </p>
                    </div>
                  ))
                ) : (
                  <div style={{
                    background: '#FFFFFF',
                    border: '2px dashed #CBD5E1',
                    borderRadius: '6px',
                    padding: '28px 16px',
                    textAlign: 'center'
                  }}>
                    <span style={{ fontSize: '1.6rem', display: 'block', marginBottom: '6px' }}>✍️</span>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#1F2937' }}>
                      No peer reviews yet
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#6B7280', marginTop: '4px' }}>
                      Complete your first 1-to-1 swap or circle session to receive verified feedback from your study partner!
                    </div>
                  </div>
                )}
              </div>

              {/* Primary Call to Action Button */}
              <div style={{ marginTop: '28px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setModalPayload(isViewingSelf ? null : targetStudent);
                    setActiveModal('swap-request');
                  }}
                  className="btn-lime"
                  style={{
                    width: '100%',
                    padding: '14px',
                    fontSize: '1.05rem',
                    fontFamily: 'var(--font-titan)',
                    letterSpacing: '0.04em',
                    boxShadow: '0 8px 20px rgba(0, 135, 68, 0.35)',
                    cursor: 'pointer'
                  }}
                >
                  <ArrowRightLeft size={18} /> {isViewingSelf ? 'INITIATE 1-TO-1 SKILL SWAP' : `PROPOSE 1-TO-1 SWAP WITH ${profileUser.name.toUpperCase()} ⚡`}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
