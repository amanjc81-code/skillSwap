import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSkillSwap } from '../../app/SkillSwapContext.jsx';
import {
  ArrowRightLeft,
  Triangle,
  Sparkles,
  Zap,
  Users,
  ShieldCheck,
  Award,
  ChevronRight,
  CheckCircle2,
  ArrowRight,
  Send
} from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useSkillSwap();

  const userFirstName = currentUser?.name ? currentUser.name.split(' ')[0] : 'You';
  const userFullName = currentUser?.name || 'You';
  const userSkill = currentUser?.teaching?.[0] || 'Full Stack';

  return (
    <div className="scrapbook-desk">
      <div style={{ maxWidth: '1180px', margin: '0 auto', position: 'relative' }}>
        
        {/* Top Zine Badge */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', padding: '0 8px' }}>
          <div style={{
            background: '#FEF08A',
            border: '2px solid #EAB308',
            borderRadius: '4px',
            padding: '6px 14px',
            transform: 'rotate(-1.5deg)',
            boxShadow: '0 8px 16px rgba(0,0,0,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '8px',
            maxWidth: '100%',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '1rem' }}>📌</span>
            <span style={{ fontFamily: 'var(--font-dela)', fontSize: 'clamp(0.68rem, 2.5vw, 0.85rem)', color: '#854D0E', lineHeight: 1.3 }}>
              CAMPUS PEER-TO-PEER SKILL EXCHANGE • NO MONEY. JUST SKILLS.
            </span>
          </div>
        </div>

        {/* HERO NOTEBOOK SHEET */}
        <div className="notebook-sheet" style={{ padding: '50px 40px 70px 48px', marginBottom: '36px' }}>
          
          {/* Chrome Binder Clip at Top Left */}
          <div className="binder-clip-top" />

          {/* =========================================================================
              HERO TOP: GREETING & ENVELOPE & POLAROID TRIANGLE
              ========================================================================= */}
          <div className="landing-hero-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '28px',
            alignItems: 'flex-start',
            marginBottom: '40px'
          }}>
            
            {/* Left Column: Bold Expressive Headline & Post-It Pitch */}
            <div className="landing-hero-left" style={{ gridColumn: 'span 6' }}>
              
              {/* Sticker Badge */}
              <div style={{ marginBottom: '14px' }}>
                <span className="sticker-badge sticker-badge-exp">
                  WELCOME TO SKILLSWAP
                </span>
              </div>

              {/* Bold Expressive Typography (From User's Image) */}
              <div style={{
                fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
                fontFamily: 'var(--font-titan)',
                color: '#1E3A8A',
                lineHeight: 1.05,
                letterSpacing: '0.02em',
                marginBottom: '4px'
              }}>
                Teach what you <span style={{ color: '#1D4ED8' }}>KNOW</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap', margin: '4px 0 10px 0' }}>
                <span style={{
                  fontFamily: 'var(--font-hand)',
                  fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
                  fontWeight: 700,
                  color: '#1E3A8A',
                  fontStyle: 'italic'
                }}>
                  and learn what you
                </span>
                <span style={{
                  fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)',
                  fontFamily: 'var(--font-dela)',
                  color: '#008744',
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                  textTransform: 'uppercase'
                }}>
                  NEED
                </span>
              </div>

              <p style={{
                fontSize: '1rem',
                lineHeight: 1.65,
                color: '#374151',
                marginBottom: '26px'
              }}>
                SkillSwap connects college students to exchange superpowers — <strong>zero money</strong>, strictly peer knowledge.
                Trade 1-to-1 directly, or unlock 3-way circular <strong>Triangle Skill Circles</strong>!
              </p>

              {/* CTAs */}
              <div className="landing-cta-row" style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '32px' }}>
                <Link
                  to="/signup"
                  style={{
                    padding: '14px 28px',
                    background: '#008744',
                    border: '3px solid #005a2d',
                    borderRadius: '6px',
                    color: '#FFF',
                    fontFamily: 'var(--font-titan)',
                    fontSize: '1rem',
                    boxShadow: '0 6px 0 #005a2d, 0 10px 20px rgba(0, 135, 68, 0.3)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    letterSpacing: '0.04em'
                  }}
                >
                  START SWAPPING <ArrowRight size={18} />
                </Link>

                <Link
                  to="/match"
                  style={{
                    padding: '14px 24px',
                    background: '#FFFFFF',
                    border: '3px solid #1E3A8A',
                    borderRadius: '6px',
                    color: '#1E3A8A',
                    fontFamily: 'var(--font-titan)',
                    fontSize: '0.95rem',
                    boxShadow: '0 6px 0 #1E3A8A',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  FIND A MATCH
                </Link>
              </div>

              {/* Yellow Post-It Note on Landing */}
              <div className="yellow-postit" style={{ transform: 'rotate(-2deg)' }}>
                <div style={{ fontFamily: 'var(--font-dela)', fontSize: '0.9rem', color: '#166534', marginBottom: '6px' }}>
                  THE PEER GUARANTEE 📌
                </div>
                <p style={{ fontSize: '0.85rem', color: '#1C1917', lineHeight: 1.5, fontFamily: 'var(--font-sans)', fontWeight: 600 }}>
                  “No boring administrative SaaS dashboards. Authentic college skill trading between peers who actually build stuff.”
                </p>
                <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                  <span className="ripped-tag ripped-blue" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>500+ Swaps</span>
                  <span className="ripped-tag ripped-yellow" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>Free Forever</span>
                </div>
              </div>
            </div>

            {/* Right Column: Tactile Pinned Triangle Diagram (The Hero Canvas) */}
            <div className="landing-hero-right" style={{ gridColumn: 'span 6', position: 'relative' }}>
              
              {/* Manila Envelope at Top Right */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '14px', position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  top: '80px',
                  right: '50px',
                  zIndex: 35,
                  textAlign: 'center'
                }}>
                  <span style={{ fontFamily: 'var(--font-hand)', fontSize: '1.3rem', color: '#DC2626', fontWeight: 700 }}>
                    Let's swap!
                  </span>
                  <div style={{ color: '#DC2626', fontSize: '1.4rem', transform: 'rotate(-30deg)', marginTop: '-8px' }}>
                    ⤴
                  </div>
                </div>

                <div className="manila-envelope" style={{ width: '230px', padding: '10px 12px 24px 12px', transform: 'rotate(2deg)' }}>
                  <div className="envelope-letter" style={{ fontSize: '0.75rem', padding: '8px 10px' }}>
                    <strong>CAMPUS DISPATCH</strong>
                    <div>{userFirstName} ↔ Rahul ↔ Anuj</div>
                    <div style={{ color: '#059669', fontWeight: 700 }}>96% Circle Synergy!</div>
                  </div>
                </div>
              </div>

              {/* TACTILE CORKBOARD / STRING TRIANGLE CANVAS */}
              <div className="triangle-corkboard-canvas" style={{
                position: 'relative',
                background: '#F7F3E3',
                border: '2px dashed #C5BC98',
                borderRadius: '8px',
                padding: '30px 14px',
                minHeight: '300px',
                width: '100%',
                overflow: 'hidden',
                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.06)'
              }}>
                <svg viewBox="0 0 460 320" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
                  <defs>
                    <filter id="heroYarnShadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="rgba(0,0,0,0.35)" />
                    </filter>
                  </defs>

                  {/* Physical Yarn Strings */}
                  <line x1="210" y1="65" x2="90" y2="250" stroke="#008744" strokeWidth="5" strokeDasharray="10 6" filter="url(#heroYarnShadow)" />
                  <line x1="110" y1="260" x2="350" y2="260" stroke="#D97706" strokeWidth="5" strokeDasharray="10 6" filter="url(#heroYarnShadow)" />
                  <line x1="360" y1="250" x2="250" y2="65" stroke="#1E3A8A" strokeWidth="5" strokeDasharray="10 6" filter="url(#heroYarnShadow)" />
                </svg>

                {/* Node 1: User (Top) */}
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  textAlign: 'center',
                  zIndex: 30
                }}>
                  <div className="polaroid-card" style={{ padding: '6px 6px 16px 6px', width: '80px', margin: '0 auto', transform: 'rotate(-2deg)' }}>
                    <div className="pushpin-3d pushpin-red" style={{ top: '-10px', left: '28px' }} />
                    <img src={currentUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80"} alt={userFullName} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover' }} />
                  </div>
                  <div style={{ fontFamily: 'var(--font-dela)', fontSize: '0.8rem', color: '#1E3A8A', marginTop: '4px' }}>
                    {userFirstName} (You)
                  </div>
                  <span className="ripped-tag ripped-blue" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
                    {userSkill} ➔
                  </span>
                </div>

                {/* Node 2: RAHUL (Bottom-Left) */}
                <div style={{
                  position: 'absolute',
                  bottom: '15px',
                  left: '4%',
                  textAlign: 'center',
                  zIndex: 30
                }}>
                  <div className="polaroid-card" style={{ padding: '6px 6px 16px 6px', width: '80px', margin: '0 auto', transform: 'rotate(3deg)' }}>
                    <div className="pushpin-3d pushpin-yellow" style={{ top: '-10px', left: '28px' }} />
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80" alt="Rahul" style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover' }} />
                  </div>
                  <div style={{ fontFamily: 'var(--font-dela)', fontSize: '0.8rem', color: '#1E3A8A', marginTop: '4px' }}>
                    Rahul
                  </div>
                  <span className="ripped-tag ripped-green" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
                    Python ➔
                  </span>
                </div>

                {/* Node 3: ANUJ (Bottom-Right) */}
                <div style={{
                  position: 'absolute',
                  bottom: '15px',
                  right: '4%',
                  textAlign: 'center',
                  zIndex: 30
                }}>
                  <div className="polaroid-card" style={{ padding: '6px 6px 16px 6px', width: '80px', margin: '0 auto', transform: 'rotate(-3deg)' }}>
                    <div className="pushpin-3d pushpin-cyan" style={{ top: '-10px', left: '28px' }} />
                    <img src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80" alt="Anuj" style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover' }} />
                  </div>
                  <div style={{ fontFamily: 'var(--font-dela)', fontSize: '0.8rem', color: '#1E3A8A', marginTop: '4px' }}>
                    Anuj
                  </div>
                  <span className="ripped-tag ripped-orange" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
                    SQL ➔
                  </span>
                </div>
              </div>

              {/* Ripped Paper Tags Banner */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '16px' }}>
                <span className="ripped-tag ripped-blue">React</span>
                <span className="ripped-tag ripped-yellow">SQL Queries</span>
                <span className="ripped-tag ripped-orange">Python Pipelines</span>
                <span className="ripped-tag ripped-green">UI/UX Figma</span>
              </div>
            </div>
          </div>

          {/* =========================================================================
              EXPLAINER SECTION: 1-TO-1 SWAP vs TRIANGLE SKILL CIRCLE
              ========================================================================= */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '24px',
            borderTop: '2px dashed #C5BC98',
            paddingTop: '36px'
          }}>
            {/* 1-to-1 Card */}
            <div style={{
              gridColumn: 'span 6',
              background: '#FFFFFF',
              border: '2px solid #E5E7EB',
              borderRadius: '6px',
              padding: '24px',
              boxShadow: '0 8px 18px rgba(0,0,0,0.06)'
            }}>
              <span className="sticker-badge sticker-badge-exp" style={{ marginBottom: '10px' }}>
                DIRECT RECIPROCAL
              </span>
              <h3 style={{ fontFamily: 'var(--font-dela)', fontSize: '1.3rem', color: '#1E3A8A', marginBottom: '8px' }}>
                1-TO-1 SKILL SWAP
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#4B5563', lineHeight: 1.6, marginBottom: '16px' }}>
                Two students exchange complementary skills directly. Student A teaches Full Stack to Student B, while Student B teaches SQL back to Student A.
              </p>
              <Link to="/match" style={{ color: '#008744', fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Find Your 1:1 Skill Twin ➔
              </Link>
            </div>

            {/* Triangle Circle Card */}
            <div style={{
              gridColumn: 'span 6',
              background: '#FFFFFF',
              border: '2px solid #008744',
              borderRadius: '6px',
              padding: '24px',
              boxShadow: '0 8px 18px rgba(0, 135, 68, 0.12)'
            }}>
              <span className="sticker-badge sticker-badge-edu" style={{ marginBottom: '10px' }}>
                CIRCULAR EXCHANGE
              </span>
              <h3 style={{ fontFamily: 'var(--font-dela)', fontSize: '1.3rem', color: '#008744', marginBottom: '8px' }}>
                TRIANGLE SKILL CIRCLE
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#4B5563', lineHeight: 1.6, marginBottom: '16px' }}>
                Can’t find an exact mutual match? SkillSwap automatically connects 3 students into a closed loop: A teaches B, B teaches C, and C teaches A!
              </p>
              <Link to="/circle/create" style={{ color: '#1E3A8A', fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Launch a 3-Person Circle ➔
              </Link>
            </div>
          </div>
        </div>

        {/* Minimal Bottom Footer */}
        <div style={{ textAlign: 'center', padding: '20px 0 40px 0', color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem', fontFamily: 'var(--font-sans)' }}>
          © {new Date().getFullYear()} SkillSwap • Designed for students worldwide • No Slop, Pure Craft
        </div>
      </div>
    </div>
  );
};
