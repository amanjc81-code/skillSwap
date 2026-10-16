import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api.js';
import { useAuth } from '../../app/AuthContext.jsx';
import { useToast } from '../../app/ToastContext.jsx';
import { LoadingSpinner } from '../../components/LoadingSpinner.jsx';
import { Modal } from '../../components/Modal.jsx';
import { EmptyState } from '../../components/EmptyState.jsx';
import {
  Users,
  Share2,
  RefreshCw,
  Clock,
  Sparkles,
  Send,
  CheckCircle2,
  Info,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';

export const FindPartnersPage = () => {
  const { addToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [matches, setMatches] = useState({ reciprocalMatches: [], oneWayMatches: [], cycles: [] });
  const [activeTab, setActiveTab] = useState('reciprocal'); // 'reciprocal' | 'oneWay' | 'cycles'

  // Connect request modal state
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [proposalType, setProposalType] = useState('reciprocal');
  const [teachSkillId, setTeachSkillId] = useState('');
  const [requestMessage, setRequestMessage] = useState('');
  const [submittingRequest, setSubmittingRequest] = useState(false);

  // Match Inspection modal state
  const [inspectMatch, setInspectMatch] = useState(null);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const res = await api.get('/matches');
      setMatches(res);
      if (res.reciprocalMatches?.length === 0 && res.oneWayMatches?.length > 0) {
        setActiveTab('oneWay');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await api.post('/matches/refresh');
      setMatches(res);
      addToast('Matching engine refreshed recommendations.', 'success');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setRefreshing(false);
    }
  };

  const openConnectModal = (match) => {
    setSelectedMatch(match);
    setProposalType(match.isReciprocal ? 'reciprocal' : 'one-way');
    if (match.reciprocalSkills && match.reciprocalSkills.length > 0) {
      setTeachSkillId(match.reciprocalSkills[0].userTeachesSkill._id);
    } else {
      setTeachSkillId('');
    }
    setRequestMessage(
      match.isReciprocal
        ? `Hi ${match.candidate.name}! I noticed you want to learn ${match.reciprocalSkills[0]?.candidateWantsToLearn?.name} and can teach ${match.skillToLearn.name}. Let's exchange skills!`
        : `Hi ${match.candidate.name}! I would love to connect and learn ${match.skillToLearn.name} with you.`
    );
    setIsConnectModalOpen(true);
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();
    setSubmittingRequest(true);

    try {
      await api.post('/connections/requests', {
        recipientId: selectedMatch.candidate._id,
        learnSkillId: selectedMatch.skillToLearn._id,
        teachSkillId: proposalType === 'reciprocal' && teachSkillId ? teachSkillId : undefined,
        message: requestMessage,
        proposalType
      });
      addToast(`Connection request sent to ${selectedMatch.candidate.name}!`, 'success');
      setIsConnectModalOpen(false);
      fetchRecommendations();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSubmittingRequest(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Executing reciprocal matching engine and scoring..." />;
  }

  const reciprocalCount = matches.reciprocalMatches?.length || 0;
  const oneWayCount = matches.oneWayMatches?.length || 0;
  const cyclesCount = matches.cycles?.length || 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Find Learning Partners
            </h1>
            <span className="badge badge-indigo">
              <Sparkles size={12} /> Explainable AI Engine
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Calculated recommendations based on skill compatibility, schedule overlap, and reciprocal learning value.
          </p>
        </div>

        <button onClick={handleRefresh} className="btn btn-secondary btn-sm" disabled={refreshing}>
          <RefreshCw size={14} className={refreshing ? 'spin' : ''} />
          {refreshing ? 'Calculating...' : 'Refresh Matches'}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveTab('reciprocal')}
          className={`btn btn-sm ${activeTab === 'reciprocal' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Share2 size={16} /> Direct Reciprocal Matches ({reciprocalCount})
        </button>
        <button
          onClick={() => setActiveTab('oneWay')}
          className={`btn btn-sm ${activeTab === 'oneWay' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Users size={16} /> One-Way Mentors ({oneWayCount})
        </button>
        <button
          onClick={() => setActiveTab('cycles')}
          className={`btn btn-sm ${activeTab === 'cycles' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Layers size={16} /> Multi-Person Cycles ({cyclesCount})
        </button>
      </div>

      {/* Reciprocal Matches Tab */}
      {activeTab === 'reciprocal' && (
        <div>
          {reciprocalCount === 0 ? (
            <EmptyState
              icon={Share2}
              title="No direct reciprocal matches detected"
              description="Direct reciprocal matching requires another student to teach what you want to learn, while wanting to learn a skill you can teach."
            />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
              {matches.reciprocalMatches.map((m, idx) => (
                <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {m.candidate.name}
                      </h3>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {m.candidate.department} • Year {m.candidate.academicYear}
                      </span>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span className="badge badge-indigo" style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                        {m.score}% Match
                      </span>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Reciprocal Swap
                      </div>
                    </div>
                  </div>

                  {/* Skills Exchange Box */}
                  <div
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1rem',
                      marginBottom: '1rem',
                      fontSize: '0.85rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>They Teach You:</span>
                      <strong style={{ color: 'var(--color-success)' }}>
                        {m.skillToLearn.name} ({m.providerProficiency})
                      </strong>
                    </div>
                    {m.reciprocalSkills && m.reciprocalSkills.length > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>You Teach Them:</span>
                        <strong style={{ color: 'var(--accent-primary)' }}>
                          {m.reciprocalSkills[0].userTeachesSkill.name} ({m.reciprocalSkills[0].userProficiency})
                        </strong>
                      </div>
                    )}
                  </div>

                  {/* Stored Explanations */}
                  <div style={{ marginBottom: '1.25rem', flex: 1 }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-disabled)', textTransform: 'uppercase' }}>
                      Why Recommended (Data Justification):
                    </span>
                    <ul style={{ listStyle: 'none', paddingLeft: 0, marginTop: '0.4rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {m.explanations.map((exp, eIdx) => (
                        <li key={eIdx} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                          <CheckCircle2 size={13} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{exp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <button
                      onClick={() => setInspectMatch(m)}
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1 }}
                    >
                      <Info size={14} /> Score Breakdown
                    </button>
                    <button
                      onClick={() => openConnectModal(m)}
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1 }}
                    >
                      <Send size={14} /> Propose Exchange
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* One-Way Mentors Tab */}
      {activeTab === 'oneWay' && (
        <div>
          {oneWayCount === 0 ? (
            <EmptyState
              icon={Users}
              title="No one-way matches currently available"
              description="Add learning goals in My Skills to discover students capable of mentoring your target topics."
            />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
              {matches.oneWayMatches.map((m, idx) => (
                <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {m.candidate.name}
                      </h3>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {m.candidate.department} • Year {m.candidate.academicYear}
                      </span>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span className="badge badge-neutral" style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                        {m.score}% Match
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.85rem 1rem',
                      marginBottom: '1rem',
                      fontSize: '0.85rem'
                    }}
                  >
                    <span style={{ color: 'var(--text-muted)' }}>Offers Mentorship in: </span>
                    <strong style={{ color: 'var(--color-success)' }}>
                      {m.skillToLearn.name} ({m.providerProficiency})
                    </strong>
                  </div>

                  <div style={{ marginBottom: '1.25rem', flex: 1 }}>
                    <ul style={{ listStyle: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {m.explanations.map((exp, eIdx) => (
                        <li key={eIdx} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                          <CheckCircle2 size={13} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{exp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <button
                      onClick={() => setInspectMatch(m)}
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1 }}
                    >
                      <Info size={14} /> Score Breakdown
                    </button>
                    <button
                      onClick={() => openConnectModal(m)}
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1 }}
                    >
                      <Send size={14} /> Send Request
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Multi-Person Cycles Tab */}
      {activeTab === 'cycles' && (
        <div>
          {cyclesCount === 0 ? (
            <EmptyState
              icon={Layers}
              title="No multi-person exchange cycles discovered yet"
              description="A multi-person cycle involves 3 or more students in a closed exchange loop (e.g. A teaches B, B teaches C, C teaches A). As more students add skills, cycles emerge automatically."
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="card" style={{ backgroundColor: 'var(--bg-surface)' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  <strong>Bounded DFS Cycle Search:</strong> These proposed exchange loops allow multi-person reciprocal learning where everyone gives and receives peer assistance.
                </p>
              </div>

              {matches.cycles.map((cycle, cIdx) => (
                <div key={cIdx} className="card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <span className="badge badge-indigo">{cycle.length}-Way Exchange Cycle</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Proposed Collaborative Cluster
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {cycle.steps.map((step, sIdx) => (
                      <div
                        key={sIdx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                          backgroundColor: 'var(--bg-surface)',
                          padding: '0.85rem 1rem',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-subtle)',
                          fontSize: '0.85rem'
                        }}
                      >
                        <span style={{ fontWeight: 600, color: 'var(--accent-primary)', width: '24px' }}>
                          #{step.stepIndex}
                        </span>
                        <strong style={{ color: 'var(--text-primary)' }}>{step.giver.name}</strong>
                        <span style={{ color: 'var(--text-muted)' }}>teaches</span>
                        <span className="badge badge-success">{step.skill.name}</span>
                        <span style={{ color: 'var(--text-muted)' }}>to</span>
                        <strong style={{ color: 'var(--text-primary)' }}>{step.receiver.name}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Connection Request Proposal Modal */}
      <Modal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        title={`Connect with ${selectedMatch?.candidate?.name}`}
      >
        <form onSubmit={handleSendRequest}>
          <div style={{ marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Skill to learn:</span>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
              {selectedMatch?.skillToLearn?.name}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="proposal-type-select">Proposal Type</label>
            <select
              id="proposal-type-select"
              className="form-select"
              value={proposalType}
              onChange={(e) => setProposalType(e.target.value)}
            >
              {selectedMatch?.isReciprocal && (
                <option value="reciprocal">Reciprocal Skill Exchange (Mutual Swap)</option>
              )}
              <option value="one-way">One-Way Mentorship Request</option>
            </select>
          </div>

          {proposalType === 'reciprocal' && selectedMatch?.reciprocalSkills?.length > 0 && (
            <div className="form-group">
              <label className="form-label" htmlFor="teach-skill-select">Skill You Offer to Teach</label>
              <select
                id="teach-skill-select"
                className="form-select"
                value={teachSkillId}
                onChange={(e) => setTeachSkillId(e.target.value)}
                required
              >
                {selectedMatch.reciprocalSkills.map((r, i) => (
                  <option key={i} value={r.userTeachesSkill._id}>
                    {r.userTeachesSkill.name} ({r.userProficiency} level)
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="request-message">Introduction Note</label>
            <textarea
              id="request-message"
              className="form-textarea"
              rows="3"
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setIsConnectModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submittingRequest}>
              {submittingRequest ? 'Sending Request...' : 'Send Request'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Score Inspection Modal */}
      <Modal
        isOpen={!!inspectMatch}
        onClose={() => setInspectMatch(null)}
        title={`Matching Engine Score Breakdown: ${inspectMatch?.candidate?.name}`}
      >
        {inspectMatch && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
              <span>Total Algorithmic Score</span>
              <strong style={{ fontSize: '1.1rem', color: 'var(--accent-primary)' }}>{inspectMatch.score} / 100</strong>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Skill Compatibility (Max 40 pts)</span>
                <strong>{inspectMatch.scoreBreakdown?.skillCompatibility} pts</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Goal & Priority Weight (Max 20 pts)</span>
                <strong>{inspectMatch.scoreBreakdown?.goalPriority} pts</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Schedule Overlap (Max 15 pts)</span>
                <strong>{inspectMatch.scoreBreakdown?.availability} pts</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Learning Format Compatibility (Max 10 pts)</span>
                <strong>{inspectMatch.scoreBreakdown?.format} pts</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Reciprocal Exchange Bonus (Max 10 pts)</span>
                <strong>{inspectMatch.scoreBreakdown?.reciprocalBonus} pts</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Teaching Capacity Feasibility (Max 5 pts)</span>
                <strong>{inspectMatch.scoreBreakdown?.capacity} pts</strong>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>Data-Derived Explanations:</h4>
              <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)' }}>
                {inspectMatch.explanations?.map((exp, i) => (
                  <li key={i} style={{ marginBottom: '0.25rem' }}>{exp}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
