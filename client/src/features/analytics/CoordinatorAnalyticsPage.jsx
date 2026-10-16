import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api.js';
import { useToast } from '../../app/ToastContext.jsx';
import { LoadingSpinner } from '../../components/LoadingSpinner.jsx';
import { Modal } from '../../components/Modal.jsx';
import {
  BarChart3,
  Download,
  AlertTriangle,
  Users,
  Award,
  CheckCircle2,
  Plus,
  ShieldCheck
} from 'lucide-react';

export const CoordinatorAnalyticsPage = () => {
  const { addToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [demandData, setDemandData] = useState({ skillStats: [], insufficientSupportSkills: [] });
  const [trends, setTrends] = useState(null);

  // New Skill Modal
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [newSkill, setNewSkill] = useState({
    name: '',
    category: 'Web Development',
    description: ''
  });
  const [creatingSkill, setCreatingSkill] = useState(false);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [overviewRes, demandRes, trendsRes] = await Promise.all([
        api.get('/analytics/overview'),
        api.get('/analytics/skill-demand'),
        api.get('/analytics/session-outcomes')
      ]);

      setStats(overviewRes.stats);
      setDemandData(demandRes);
      setTrends(trendsRes.trends);
    } catch (err) {
      console.error(err);
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleExportReport = async () => {
    try {
      const report = await api.get('/analytics/export');
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `skillmesh-college-report-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      addToast('Privacy-safe aggregate report exported.', 'success');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleCreateSkillSubmit = async (e) => {
    e.preventDefault();
    setCreatingSkill(true);
    try {
      await api.post('/admin/skills', {
        name: newSkill.name,
        category: newSkill.category,
        description: newSkill.description
      });
      addToast(`Added ${newSkill.name} to approved taxonomy.`, 'success');
      setIsSkillModalOpen(false);
      setNewSkill({ name: '', category: 'Web Development', description: '' });
      fetchAnalytics();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setCreatingSkill(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Aggregating college peer learning metrics..." />;
  }

  const s = stats || {
    totalStudents: 0,
    totalSkills: 0,
    totalCompletedSessions: 0,
    totalScheduledSessions: 0,
    averageRating: 4.8
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Faculty Coordinator Analytics
            </h1>
            <span className="badge badge-indigo">
              <ShieldCheck size={13} /> Privacy-Safe Aggregate Data
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Departmental peer learning volume, teaching capacities, and skill support deficits at MIT ACSC
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => setIsSkillModalOpen(true)} className="btn btn-secondary btn-sm">
            <Plus size={14} /> Add Approved Skill
          </button>
          <button onClick={handleExportReport} className="btn btn-primary btn-sm">
            <Download size={14} /> Export Privacy-Safe Report
          </button>
        </div>
      </div>

      {/* College KPI Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
        <div className="card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
            Active Registered Students
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {s.totalStudents}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Computer Applications & Science</span>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
            Approved Skills in Taxonomy
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
            {s.totalSkills}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Across 8 academic domains</span>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
            Completed Peer Sessions
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-success)' }}>
            {s.totalCompletedSessions}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verified practical outcomes</span>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
            College Peer Rating Average
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-warning)' }}>
            {s.averageRating} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ 5.0</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Overall mentorship satisfaction</span>
        </div>
      </div>

      {/* Skills with Insufficient Peer Support Warning */}
      {demandData.insufficientSupportSkills?.length > 0 && (
        <div
          className="card"
          style={{
            backgroundColor: 'rgba(245, 158, 11, 0.05)',
            border: '1px solid rgba(245, 158, 11, 0.3)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <AlertTriangle size={20} color="var(--color-warning)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-warning)' }}>
              Skills with Insufficient Peer Support (Teaching Deficit)
            </h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            These skills have student demand from learners, but zero or insufficient active mentors. Faculty workshops
            or targeted peer recruitment are recommended:
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {demandData.insufficientSupportSkills.map((sk) => (
              <div
                key={sk.skillId}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.65rem 1rem',
                  fontSize: '0.85rem'
                }}
              >
                <strong style={{ color: 'var(--text-primary)' }}>{sk.skillName}</strong>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {sk.learnerCount} Learners vs {sk.mentorCount} Mentors (Deficit: {sk.deficit})
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Aggregate Demand and Capacity Breakdown Table */}
      <div className="card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Aggregate Skill Demand vs Teaching Capacity
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Skill Name</th>
                <th style={{ padding: '0.75rem 1rem' }}>Category</th>
                <th style={{ padding: '0.75rem 1rem' }}>Learner Demand</th>
                <th style={{ padding: '0.75rem 1rem' }}>Teaching Capacity</th>
                <th style={{ padding: '0.75rem 1rem' }}>Total Weekly Capacity</th>
                <th style={{ padding: '0.75rem 1rem' }}>Support Ratio</th>
              </tr>
            </thead>
            <tbody>
              {demandData.skillStats?.map((row) => (
                <tr
                  key={row.skillId}
                  style={{ borderBottom: '1px solid var(--border-subtle)' }}
                >
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {row.skillName}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span className="badge badge-indigo">{row.category}</span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>
                    {row.learnerCount} Students
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>
                    {row.mentorCount} Mentors
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>
                    {row.totalCapacityHours} hrs/wk
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span
                      className={`badge ${
                        row.supportRatio >= 80
                          ? 'badge-success'
                          : row.supportRatio >= 40
                          ? 'badge-warning'
                          : 'badge-danger'
                      }`}
                    >
                      {Math.round(row.supportRatio)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Skill to Taxonomy Modal */}
      <Modal
        isOpen={isSkillModalOpen}
        onClose={() => setIsSkillModalOpen(false)}
        title="Add Approved Skill to Curriculum Taxonomy"
      >
        <form onSubmit={handleCreateSkillSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="new-skill-name">Skill Name</label>
            <input
              id="new-skill-name"
              type="text"
              className="form-input"
              placeholder="e.g. Next.js, Docker, FastAPI"
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="new-skill-category">Domain Category</label>
            <select
              id="new-skill-category"
              className="form-select"
              value={newSkill.category}
              onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
            >
              <option value="Web Development">Web Development</option>
              <option value="Databases">Databases</option>
              <option value="Programming Languages">Programming Languages</option>
              <option value="Artificial Intelligence">Artificial Intelligence</option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="Software Engineering">Software Engineering</option>
              <option value="Cloud & DevOps">Cloud & DevOps</option>
              <option value="Mobile Development">Mobile Development</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="new-skill-description">Description & Academic Relevance</label>
            <textarea
              id="new-skill-description"
              className="form-textarea"
              rows="3"
              placeholder="Detail the technical concepts and relevance for MIT ACSC computer students."
              value={newSkill.description}
              onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setIsSkillModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={creatingSkill}>
              {creatingSkill ? 'Adding...' : 'Add to Taxonomy'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
