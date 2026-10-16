import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api.js';
import { useAuth } from '../../app/AuthContext.jsx';
import { useToast } from '../../app/ToastContext.jsx';
import { LoadingSpinner } from '../../components/LoadingSpinner.jsx';
import { Modal } from '../../components/Modal.jsx';
import { EmptyState } from '../../components/EmptyState.jsx';
import {
  Network,
  Calendar,
  Link as LinkIcon,
  Plus,
  Shield,
  ExternalLink,
  Users,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const RelationshipsPage = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Resource Modal
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceUrl, setResourceUrl] = useState('');
  const [submittingResource, setSubmittingResource] = useState(false);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      const res = await api.get('/connections/active');
      setConnections(res.connections || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  const handleAddResource = async (e) => {
    e.preventDefault();
    setSubmittingResource(true);
    try {
      await api.post(`/connections/active/${selectedConnection._id}/resources`, {
        title: resourceTitle,
        url: resourceUrl
      });
      addToast('Shared resource added to workspace.', 'success');
      setSelectedConnection(null);
      setResourceTitle('');
      setResourceUrl('');
      fetchConnections();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSubmittingResource(false);
    }
  };

  const handleBlockPartner = async (partnerId, partnerName) => {
    if (!window.confirm(`Are you sure you want to block ${partnerName}? This will prevent further sessions.`)) return;
    try {
      await api.post(`/users/block/${partnerId}`);
      addToast(`${partnerName} blocked.`, 'info');
      fetchConnections();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading your peer learning partnerships..." />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          Active Learning Partnerships
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Collaborative workspaces for accepted connections. Share learning objectives, curated links, and schedule sessions.
        </p>
      </div>

      {connections.length === 0 ? (
        <EmptyState
          icon={Network}
          title="No active partnerships yet"
          description="Send a learning partner request from Find Partners or accept pending requests on your dashboard."
          action={
            <Link to="/find-partners" className="btn btn-primary">
              Find Learning Partners
            </Link>
          }
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {connections.map((conn) => {
            const partner = conn.participants.find((p) => p._id.toString() !== user._id.toString());
            return (
              <div key={conn._id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        color: 'var(--accent-primary)'
                      }}
                    >
                      {partner?.name?.charAt(0) || 'P'}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {partner?.name}
                      </h3>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {partner?.department} • Year {partner?.academicYear}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span className="badge badge-success" style={{ textTransform: 'capitalize' }}>
                      {conn.connectionType} Partnership
                    </span>
                    <button
                      onClick={() => handleBlockPartner(partner?._id, partner?.name)}
                      className="btn btn-secondary btn-sm"
                      style={{ color: 'var(--text-muted)' }}
                      title="Block or report partner"
                    >
                      <Shield size={14} /> Block
                    </button>
                  </div>
                </div>

                {/* Agreed skill exchange terms */}
                <div
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    marginBottom: '1.25rem'
                  }}
                >
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                    Agreed Skill Exchange:
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem' }}>
                    {conn.primarySkillExchange?.map((ex, i) => (
                      <div key={i} style={{ color: 'var(--text-secondary)' }}>
                        • <strong>{ex.teacher === user._id ? 'You' : partner?.name}</strong> teaches{' '}
                        <span className="badge badge-indigo">{ex.skill?.name}</span> to{' '}
                        <strong>{ex.learner === user._id ? 'You' : partner?.name}</strong>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shared Resources list */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Shared Learning Resources & Links ({conn.sharedResources?.length || 0}):
                    </h4>
                    <button
                      onClick={() => {
                        setSelectedConnection(conn);
                        setResourceTitle('');
                        setResourceUrl('');
                      }}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.75rem' }}
                    >
                      <Plus size={12} /> Add Resource Link
                    </button>
                  </div>

                  {conn.sharedResources?.length === 0 ? (
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      No shared links added yet. Add tutorials, documentation, or code repos.
                    </p>
                  ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {conn.sharedResources.map((res, rIdx) => (
                        <a
                          key={rIdx}
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="badge badge-neutral"
                          style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', textDecoration: 'none' }}
                        >
                          <LinkIcon size={12} /> {res.title} <ExternalLink size={10} />
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <Link
                    to="/sessions"
                    state={{ partnerId: partner?._id, partnerName: partner?.name, connectionId: conn._id }}
                    className="btn btn-primary btn-sm"
                  >
                    <Calendar size={14} /> Schedule Learning Session
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Resource Modal */}
      <Modal
        isOpen={!!selectedConnection}
        onClose={() => setSelectedConnection(null)}
        title="Share Learning Resource with Partner"
      >
        <form onSubmit={handleAddResource}>
          <div className="form-group">
            <label className="form-label" htmlFor="resource-title">Resource Title</label>
            <input
              id="resource-title"
              type="text"
              className="form-input"
              placeholder="e.g. Official PostgreSQL Documentation, React Tutorial"
              value={resourceTitle}
              onChange={(e) => setResourceTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="resource-url">Resource URL</label>
            <input
              id="resource-url"
              type="url"
              className="form-input"
              placeholder="https://..."
              value={resourceUrl}
              onChange={(e) => setResourceUrl(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setSelectedConnection(null)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submittingResource}>
              {submittingResource ? 'Adding...' : 'Add Link'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
