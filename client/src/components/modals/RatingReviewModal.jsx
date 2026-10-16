import React, { useState } from 'react';
import { useSkillSwap } from '../../app/SkillSwapContext.jsx';
import { X, Star, Heart, CheckCircle2 } from 'lucide-react';

export const RatingReviewModal = () => {
  const { activeModal, setActiveModal, modalPayload, submitReview } = useSkillSwap();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (activeModal !== 'rate-review') return null;

  const teacherName = modalPayload?.teacherName || 'Peer Mentor';
  const skill = modalPayload?.skill || 'Skill Exchange';

  const availableTags = [
    'Great explanation',
    'Very patient',
    'Practical examples',
    'Would learn again',
    'Saved my assignment',
    'High energy'
  ];

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    setTimeout(() => {
      submitReview({
        teacherName,
        rating,
        tags: selectedTags,
        feedback
      });
      setIsSubmitted(false);
      setActiveModal(null);
    }, 1200);
  };

  return (
    <div className="scrapbook-modal-backdrop">
      <div className="scrapbook-modal-sheet" style={{ maxWidth: '540px' }}>
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

        {isSubmitted ? (
          <div style={{ textAlign: 'center', padding: '30px 10px' }}>
            <div className="yellow-postit" style={{ maxWidth: '400px', margin: '0 auto', padding: '30px 20px', border: '2px solid #27272A' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#DC2626',
                color: '#FFF',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 0 #991B1B',
                marginBottom: '14px'
              }}>
                <Heart size={36} fill="#FFF" />
              </div>
              <h3 style={{ fontFamily: 'var(--font-titan)', fontSize: '1.6rem', color: '#18181B', marginBottom: '6px' }}>
                REVIEW SENT 💜
              </h3>
              <p style={{ fontFamily: 'var(--font-hand)', fontSize: '1.2rem', color: '#78350F', fontWeight: 700, margin: '0 auto' }}>
                Thanks for helping the community grow! Your feedback helps {teacherName} gain skill karma & badges ✍️
              </p>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '18px' }}>
              <span className="sticker-badge sticker-badge-exp" style={{ fontSize: '0.72rem', padding: '2px 12px', marginBottom: '6px' }}>
                <Star size={12} fill="currentColor" style={{ marginRight: '4px' }} /> PEER REPORT CARD
              </span>
              <h2 style={{ fontFamily: 'var(--font-titan)', fontSize: '1.7rem', color: '#18181B', letterSpacing: '0.02em', margin: '4px 0 2px 0' }}>
                HOW WAS LEARNING FROM <span style={{ color: '#008744' }}>{teacherName.toUpperCase()}</span>?
              </h2>
              <p style={{ fontFamily: 'var(--font-hand)', fontSize: '1.15rem', color: '#047857', fontWeight: 700, margin: 0 }}>
                Topic: {skill} ✍️
              </p>
            </div>

            {/* Star Rating */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '22px' }}>
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
                      transition: 'all 0.15s ease',
                      color: isFilled ? '#F59E0B' : '#D1D5DB',
                      filter: isFilled ? 'drop-shadow(0 4px 6px rgba(245, 158, 11, 0.4))' : 'none',
                      padding: 0
                    }}
                  >
                    <Star size={36} fill={isFilled ? '#F59E0B' : 'none'} stroke={isFilled ? '#B45309' : '#9CA3AF'} strokeWidth={2.5} />
                  </button>
                );
              })}
            </div>

            {/* Quick Tags */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontFamily: 'var(--font-titan)', fontSize: '0.8rem', color: '#18181B', marginBottom: '6px' }}>
                QUICK STICKER TAGS
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {availableTags.map(tag => {
                  const active = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      style={{
                        padding: '5px 12px',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontFamily: 'var(--font-titan)',
                        background: active ? '#008744' : '#FFFFFF',
                        color: active ? '#FFFFFF' : '#18181B',
                        border: '2px solid #27272A',
                        boxShadow: active ? '0 3px 0 #005a2d' : '1px 2px 0px rgba(0,0,0,0.1)',
                        cursor: 'pointer'
                      }}
                    >
                      {active ? '✓ ' : '+ '}{tag.toUpperCase()}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Feedback textarea */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontFamily: 'var(--font-titan)', fontSize: '0.8rem', color: '#18181B', marginBottom: '6px' }}>
                WRITTEN FEEDBACK (OPTIONAL)
              </label>
              <textarea
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                rows={3}
                className="scrapbook-input"
                placeholder="What made this peer session super helpful?"
                style={{ resize: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="btn-3d-yellow"
                style={{ padding: '8px 18px', fontSize: '0.82rem' }}
              >
                SKIP
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="btn-3d-green"
                style={{ padding: '8px 22px', fontSize: '0.85rem' }}
              >
                <Heart size={15} fill="#FFF" /> SEND REVIEW
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
