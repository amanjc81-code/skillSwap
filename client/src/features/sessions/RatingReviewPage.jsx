import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSkillSwap } from '../../app/SkillSwapContext.jsx';
import {
  Star,
  Heart,
  Sparkles,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const RatingReviewPage = () => {
  const navigate = useNavigate();
  const { submitReview, addToast } = useSkillSwap();

  const [teacherName, setTeacherName] = useState('');
  const [skill, setSkill] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const availableTags = [
    'Great explanation',
    'Very patient',
    'Practical examples',
    'Would learn again',
    'Saved my assignment',
    '10/10 mentor',
    'High energy'
  ];

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      submitReview({
        teacherName: teacherName || 'Peer Mentor',
        skill: skill || 'Skill Exchange',
        rating,
        tags: selectedTags,
        feedback
      });
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    }, 1000);
  };

  return (
    <div className="scrapbook-desk">
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <div className="notebook-sheet" style={{ padding: '40px 36px', position: 'relative' }}>
          {/* Top Chrome Binder Clip */}
          <div className="binder-clip-top" />

          {isSubmitted ? (
            <div style={{ textAlign: 'center', padding: '40px 10px' }}>
              <div className="yellow-postit" style={{ maxWidth: '440px', margin: '0 auto', padding: '36px 24px', border: '2px solid #27272A' }}>
                <div className="pushpin-3d pushpin-red" style={{ top: '-12px', left: '50%', transform: 'translateX(-50%)' }} />
                <div style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  background: '#DC2626',
                  color: '#FFFFFF',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 0 #991B1B',
                  marginBottom: '16px'
                }}>
                  <Heart size={36} fill="#FFFFFF" />
                </div>
                <h2 style={{ fontFamily: 'var(--font-titan)', fontSize: '1.9rem', color: '#18181B', marginBottom: '8px' }}>
                  REVIEW SENT 💜
                </h2>
                <p style={{ fontFamily: 'var(--font-hand)', fontSize: '1.25rem', color: '#78350F', fontWeight: 700, margin: '0 auto 16px auto', lineHeight: 1.4 }}>
                  Thanks for supporting peer education! Your feedback helps {teacherName || 'your peer mentor'} gain skill karma and verified status badges ✍️
                </p>
                <div className="sticker-badge sticker-badge-cert" style={{ fontSize: '0.75rem', padding: '4px 16px' }}>
                  RETURNING TO PROFILE...
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <span className="sticker-badge sticker-badge-exp" style={{ fontSize: '0.72rem', padding: '3px 14px', marginBottom: '8px' }}>
                  <Star size={12} fill="currentColor" style={{ marginRight: '4px' }} /> PEER REPORT CARD
                </span>
                <h1 style={{ fontFamily: 'var(--font-titan)', fontSize: '2.1rem', color: '#18181B', letterSpacing: '0.02em', margin: '8px 0 4px 0' }}>
                  HOW WAS LEARNING FROM <span style={{ color: '#008744' }}>{teacherName ? teacherName.toUpperCase() : 'YOUR PEER MENTOR'}</span>?
                </h1>
                <p style={{ fontFamily: 'var(--font-hand)', fontSize: '1.2rem', color: '#047857', fontWeight: 700, margin: '2px 0 0 0' }}>
                  {skill ? `Topic: ${skill} ✍️` : 'Share your verified learning experience ✍️'}
                </p>
              </div>

              {/* Mentor & Skill Inputs if not pre-set */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-titan)', fontSize: '0.8rem', color: '#18181B', marginBottom: '4px' }}>
                    PEER MENTOR NAME
                  </label>
                  <input
                    type="text"
                    value={teacherName}
                    onChange={e => setTeacherName(e.target.value)}
                    className="scrapbook-input"
                    placeholder="e.g. Enter mentor name"
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-titan)', fontSize: '0.8rem', color: '#18181B', marginBottom: '4px' }}>
                    SKILL TAUGHT
                  </label>
                  <input
                    type="text"
                    value={skill}
                    onChange={e => setSkill(e.target.value)}
                    className="scrapbook-input"
                    placeholder="e.g. React, SQL, Python"
                    required
                  />
                </div>
              </div>

              {/* Gold Star Stamp Rating */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginBottom: '28px' }}>
                {[1, 2, 3, 4, 5].map(star => {
                  const isFilled = (hoverRating || rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        transform: isFilled ? 'scale(1.2)' : 'scale(1)',
                        transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
                        color: isFilled ? '#F59E0B' : '#D1D5DB',
                        filter: isFilled ? 'drop-shadow(0 4px 6px rgba(245, 158, 11, 0.4))' : 'none',
                        padding: 0
                      }}
                    >
                      <Star size={42} fill={isFilled ? '#F59E0B' : 'none'} stroke={isFilled ? '#B45309' : '#9CA3AF'} strokeWidth={2.5} />
                    </button>
                  );
                })}
              </div>

              {/* Quick Feedback Tags */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontFamily: 'var(--font-titan)', fontSize: '0.85rem', color: '#18181B', marginBottom: '8px' }}>
                  QUICK STICKER TAGS
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {availableTags.map(tag => {
                    const active = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '9999px',
                          fontSize: '0.82rem',
                          fontFamily: 'var(--font-titan)',
                          letterSpacing: '0.03em',
                          background: active ? '#008744' : '#FFFFFF',
                          color: active ? '#FFFFFF' : '#18181B',
                          border: '2px solid #27272A',
                          boxShadow: active ? '0 3px 0 #005a2d' : '2px 2px 0px rgba(0,0,0,0.1)',
                          cursor: 'pointer'
                        }}
                      >
                        {active ? '✓ ' : '+ '}{tag.toUpperCase()}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Feedback box */}
              <div style={{ marginBottom: '26px' }}>
                <label style={{ display: 'block', fontFamily: 'var(--font-titan)', fontSize: '0.85rem', color: '#18181B', marginBottom: '8px' }}>
                  DETAILED FEEDBACK NOTES (OPTIONAL)
                </label>
                <textarea
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                  rows={4}
                  className="scrapbook-input"
                  style={{ resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => navigate('/sessions')}
                  className="btn-3d-yellow"
                  style={{ padding: '10px 22px' }}
                >
                  SKIP
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="btn-3d-green"
                  style={{ padding: '10px 28px' }}
                >
                  <Heart size={16} fill="#FFF" /> SEND REVIEW
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
