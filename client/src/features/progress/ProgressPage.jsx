import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api.js';
import { LoadingSpinner } from '../../components/LoadingSpinner.jsx';
import {
  TrendingUp,
  Award,
  Users,
  CheckCircle2,
  Star,
  FileCheck,
  BookOpen,
  Calendar
} from 'lucide-react';

export const ProgressPage = () => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        const res = await api.get('/learning/progress');
        setProgress(res.progress);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Calculating validated progress records..." />;
  }

  const p = progress || {
    sessionsAttended: 0,
    teachingContributions: 0,
    assessmentsCompleted: 0,
    skillsPracticedCount: 0,
    milestonesProgress: { total: 0, completed: 0, percentage: 0 },
    feedbackStats: { count: 0, averageRating: 5.0 },
    recentFeedback: []
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          My Verified Learning Progress
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Real learning outcomes, attended peer sessions, milestone completions, and peer ratings
        </p>
      </div>

      {/* Primary KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <Users size={20} color="var(--accent-primary)" />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sessions Attended (Learner)</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {p.sessionsAttended}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verified completed sessions</span>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <Award size={20} color="var(--color-success)" />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Teaching Contributions</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {p.teachingContributions}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sessions delivered as peer mentor</span>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <FileCheck size={20} color="var(--accent-secondary)" />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Practical Deliverables</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {p.assessmentsCompleted}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Practical challenges recorded</span>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <Star size={20} color="var(--color-warning)" />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Peer Mentor Rating</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {p.feedbackStats.averageRating} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ 5.0</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Based on {p.feedbackStats.count} peer reviews
          </span>
        </div>
      </div>

      {/* Roadmaps & Milestone Progress */}
      <div className="card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Curriculum Milestone Completion
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '220px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Overall Milestones Completed</span>
              <strong style={{ color: 'var(--accent-primary)' }}>
                {p.milestonesProgress.completed} of {p.milestonesProgress.total} ({p.milestonesProgress.percentage}%)
              </strong>
            </div>
            <div
              style={{
                height: '8px',
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  width: `${p.milestonesProgress.percentage}%`,
                  height: '100%',
                  backgroundColor: 'var(--accent-primary)'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Peer Feedback Feed */}
      <div className="card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Peer Reviews & Feedback Received
        </h3>

        {p.recentFeedback.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No reviews received yet. Complete mentoring sessions to receive verified peer feedback.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {p.recentFeedback.map((fb, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    Review from {fb.reviewer?.name}
                  </span>
                  <span className="badge badge-warning" style={{ fontSize: '0.75rem' }}>
                    ★ {fb.rating}.0 / 5.0
                  </span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontStyle: 'italic', marginBottom: '0.5rem' }}>
                  "{fb.comments}"
                </p>
                {fb.tags && fb.tags.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                    {fb.tags.map((t, tIdx) => (
                      <span key={tIdx} className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
