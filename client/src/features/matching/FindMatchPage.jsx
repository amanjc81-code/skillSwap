import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSkillSwap } from '../../app/SkillSwapContext.jsx';
import {
  Search,
  Filter,
  Sparkles,
  Star,
  ArrowRightLeft,
  Info,
  CheckCircle2,
  Send,
  MapPin,
  Clock,
  ChevronDown
} from 'lucide-react';

export const FindMatchPage = () => {
  const navigate = useNavigate();
  const { students, setActiveModal, setModalPayload } = useSkillSwap();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkillFilter, setSelectedSkillFilter] = useState('All');
  const [selectedCollegeFilter, setSelectedCollegeFilter] = useState('All');
  const [selectedModeFilter, setSelectedModeFilter] = useState('All');
  const [selectedMatchFilter, setSelectedMatchFilter] = useState('All');

  // Filter logic
  const filteredStudents = students.filter(student => {
    const matchesQuery =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.canTeach.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      student.wantsToLearn.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      student.college.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSkill =
      selectedSkillFilter === 'All' ||
      student.canTeach.includes(selectedSkillFilter) ||
      student.wantsToLearn.includes(selectedSkillFilter);

    const matchesCollege =
      selectedCollegeFilter === 'All' ||
      student.college.includes(selectedCollegeFilter);

    const matchesMode =
      selectedModeFilter === 'All' ||
      student.mode === selectedModeFilter ||
      student.mode === 'Both';

    const matchesType =
      selectedMatchFilter === 'All' ||
      student.matchType === selectedMatchFilter;

    return matchesQuery && matchesSkill && matchesCollege && matchesMode && matchesType;
  });

  return (
    <div className="scrapbook-desk">
      <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
        
        {/* Top Header Banner */}
        <div style={{
          background: '#FBF8EE',
          borderRadius: '8px',
          padding: '28px 32px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.45)',
          borderLeft: '16px solid #881337',
          marginBottom: '28px',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="sticker-badge sticker-badge-exp" style={{ fontSize: '0.78rem', padding: '4px 12px' }}>
                  PEER DIRECTORY
                </span>
                <span style={{ fontFamily: 'var(--font-hand)', fontSize: '1.3rem', color: '#15803D', fontWeight: 700 }}>
                  Find your skill twin ✍️
                </span>
              </div>
              <h1 style={{
                fontFamily: 'var(--font-dela)',
                fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
                color: '#1E3A8A',
                lineHeight: 1.15
              }}>
                DISCOVER CAMPUS <span style={{ color: '#008744' }}>MATCHES</span>
              </h1>
              <p style={{ color: '#4B5563', fontSize: '0.95rem', maxWidth: '640px', marginTop: '6px' }}>
                They teach what you want to learn, and they want to learn what you know. Zero cash involved!
              </p>
            </div>

            {/* Hand-drawn Callout Badge */}
            <div style={{
              background: '#FEF08A',
              border: '2px solid #EAB308',
              borderRadius: '4px',
              padding: '10px 14px',
              transform: 'rotate(2deg)',
              boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-marker)', color: '#78350F' }}>
                RECIPROCAL EXCHANGE
              </div>
              <div style={{ fontFamily: 'var(--font-hand)', fontSize: '1.2rem', color: '#15803D', fontWeight: 700 }}>
                100% Value • Zero Cash
              </div>
            </div>
          </div>

          {/* Search Bar on Paper */}
          <div style={{ position: 'relative', marginTop: '24px' }}>
            <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#6B7280' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="What do you want to learn? (e.g. SQL, Python, UI/UX, C++, Docker...)"
              style={{
                width: '100%',
                padding: '15px 18px 15px 50px',
                fontSize: '1rem',
                borderRadius: '6px',
                border: '2px solid #1E3A8A',
                background: '#FFFFFF',
                color: '#18181B',
                fontFamily: 'var(--font-sans)',
                fontWeight: 600,
                outline: 'none',
                boxShadow: '0 4px 10px rgba(0,0,0,0.06)'
              }}
            />
          </div>

          {/* Filter Chips Bar */}
          <div style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingTop: '16px',
            scrollbarWidth: 'none'
          }}>
            {['All', 'Perfect Match', 'Strong Match', 'Partial Match'].map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedMatchFilter(type)}
                className={`sticker-badge ${selectedMatchFilter === type ? 'sticker-badge-exp' : 'sticker-badge-edu'}`}
                style={{
                  padding: '4px 14px',
                  fontSize: '0.78rem',
                  opacity: selectedMatchFilter === type ? 1 : 0.75
                }}
              >
                {type === 'Perfect Match' && '⚡ '}
                {type}
              </button>
            ))}

            <div style={{ width: '1px', height: '24px', background: '#D1D5DB', alignSelf: 'center' }} />

            {['SQL', 'Python', 'React', 'UI/UX', 'C++'].map(skill => (
              <button
                key={skill}
                type="button"
                onClick={() => setSelectedSkillFilter(selectedSkillFilter === skill ? 'All' : skill)}
                className="ripped-tag ripped-blue"
                style={{
                  padding: '4px 12px',
                  fontSize: '0.75rem',
                  opacity: selectedSkillFilter === skill ? 1 : 0.65
                }}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        {/* Match Result Cards in Scrapbook Collage Style */}
        {filteredStudents.length === 0 ? (
          <div style={{
            background: '#FEF9C3',
            border: '2px dashed #CA8A04',
            borderRadius: '12px',
            padding: '48px 24px',
            textAlign: 'center',
            position: 'relative'
          }}>
            <div className="pushpin-3d pushpin-red" style={{ top: '-12px', left: '50%', transform: 'translateX(-50%)' }} />
            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '8px' }}>🌱</span>
            <h3 style={{ fontFamily: 'var(--font-titan)', fontSize: '1.4rem', color: '#18181B', marginBottom: '6px' }}>
              NO PEER MATCHES REGISTERED YET
            </h3>
            <p style={{ fontFamily: 'var(--font-hand)', fontSize: '1.25rem', color: '#78350F', fontWeight: 700, maxWidth: '440px', margin: '0 auto 18px auto', lineHeight: 1.35 }}>
              Your platform is fresh and clean! Once fellow students sign up and list what they can teach, their mutual cards will appear here.
            </p>
            <a href="/onboarding" className="btn-3d-green" style={{ display: 'inline-block', padding: '10px 24px', fontSize: '0.85rem' }}>
              UPDATE MY SKILLS ⚡
            </a>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '28px'
          }}>
            {filteredStudents.map((student, idx) => {
              const isPerfect = student.matchType === 'Perfect Match';
              const tilt = (idx % 2 === 0 ? '-2deg' : '2deg');

            return (
              <div
                key={student.id}
                className="notebook-sheet"
                style={{
                  padding: '26px 22px',
                  borderLeft: isPerfect ? '14px solid #008744' : '14px solid #1E3A8A',
                  transform: `rotate(${tilt})`,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative'
                }}
              >
                {/* 3D Pushpin on Card Header */}
                <div
                  className={`pushpin-3d ${isPerfect ? 'pushpin-red' : 'pushpin-cyan'}`}
                  style={{ top: '-10px', right: '30px' }}
                />

                <div>
                  {/* Header with Photo & Name */}
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '16px' }}>
                    {/* Mini Polaroid Frame */}
                    <div className="polaroid-card" style={{ padding: '6px 6px 18px 6px', transform: 'rotate(-3deg)', width: '74px', flexShrink: 0 }}>
                      <img
                        src={student.avatar}
                        alt={student.name}
                        style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover' }}
                      />
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div
                            onClick={() => navigate('/profile')}
                            style={{
                              fontFamily: 'var(--font-dela)',
                              fontSize: '1.15rem',
                              color: '#1E3A8A',
                              cursor: 'pointer'
                            }}
                          >
                            {student.name}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#4B5563', fontWeight: 600 }}>
                            {student.college}
                          </div>
                        </div>

                        {/* Match Badge */}
                        <span
                          className={`sticker-badge ${isPerfect ? 'sticker-badge-exp' : 'sticker-badge-cert'}`}
                          style={{ fontSize: '0.72rem', padding: '3px 10px' }}
                        >
                          {student.compatibility}%
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.75rem', color: '#6B7280', marginTop: '6px' }}>
                        <span style={{ color: '#EAB308', fontWeight: 800 }}>★ {student.rating}</span>
                        <span>•</span>
                        <span>{student.mode} Mode</span>
                      </div>
                    </div>
                  </div>

                  {/* Yellow Post-it style bio snippet */}
                  <div style={{
                    background: '#FEF08A',
                    padding: '12px 14px',
                    borderRadius: '2px',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
                    marginBottom: '16px',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.84rem',
                    color: '#1C1917',
                    lineHeight: 1.45,
                    borderLeft: '4px solid #EAB308'
                  }}>
                    "{student.bio}"
                  </div>

                  {/* Torn Tape Skill Chips (CAN TEACH / WANTS TO LEARN) */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-marker)', color: '#15803D', marginBottom: '4px' }}>
                        CAN TEACH
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {student.canTeach.map(sk => (
                          <span key={sk} className="ripped-tag ripped-green" style={{ fontSize: '0.75rem', padding: '3px 10px' }}>
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-marker)', color: '#1E3A8A', marginBottom: '4px' }}>
                        WANTS TO LEARN
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {student.wantsToLearn.map(sk => (
                          <span key={sk} className="ripped-tag ripped-yellow" style={{ fontSize: '0.75rem', padding: '3px 10px' }}>
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div style={{ display: 'flex', gap: '10px', borderTop: '1px dashed #D1D5DB', paddingTop: '14px' }}>
                  <button
                    type="button"
                    onClick={() => navigate('/profile')}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      background: '#FFFFFF',
                      border: '2px solid #374151',
                      borderRadius: '4px',
                      fontFamily: 'var(--font-titan)',
                      fontSize: '0.8rem',
                      color: '#374151',
                      cursor: 'pointer'
                    }}
                  >
                    VIEW ZINE
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setModalPayload(student);
                      setActiveModal('swap-request');
                    }}
                    style={{
                      flex: 1.3,
                      padding: '8px 14px',
                      background: '#008744',
                      border: '2px solid #005a2d',
                      borderRadius: '4px',
                      fontFamily: 'var(--font-titan)',
                      fontSize: '0.82rem',
                      color: '#FFFFFF',
                      boxShadow: '0 4px 0 #005a2d',
                      cursor: 'pointer'
                    }}
                  >
                    PROPOSE SWAP ⚡
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      </div>
    </div>
  );
};
