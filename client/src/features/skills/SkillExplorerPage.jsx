import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api.js';
import { useAuth } from '../../app/AuthContext.jsx';
import { useToast } from '../../app/ToastContext.jsx';
import { LoadingSpinner } from '../../components/LoadingSpinner.jsx';
import { Modal } from '../../components/Modal.jsx';
import { SkillGraphViewer } from '../../components/SkillGraphViewer.jsx';
import { Search, Compass, Network, Award, BookOpen, Plus, Check } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Web Development',
  'Databases',
  'Programming Languages',
  'Artificial Intelligence',
  'UI/UX Design',
  'Software Engineering',
  'Mobile Development'
];

export const SkillExplorerPage = () => {
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const [skills, setSkills] = useState([]);
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [showGraph, setShowGraph] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Add skill modal
  const [selectedSkillForAction, setSelectedSkillForAction] = useState(null);
  const [modalType, setModalType] = useState('learn'); // 'teach' or 'learn'
  const [proficiency, setProficiency] = useState('beginner');
  const [targetProficiency, setTargetProficiency] = useState('advanced');
  const [priority, setPriority] = useState('high');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedCategory !== 'All') params.append('category', selectedCategory);

      const [skillsRes, graphRes] = await Promise.all([
        api.get(`/skills?${params.toString()}`),
        api.get('/skills/graph')
      ]);

      setSkills(skillsRes.skills || []);
      setGraphData(graphRes.graph || { nodes: [], edges: [] });
    } catch (err) {
      console.error('Failed to load skills:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, [selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchSkills();
  };

  const openActionModal = (skill, type) => {
    setSelectedSkillForAction(skill);
    setModalType(type);
    setProficiency(type === 'teach' ? 'intermediate' : 'beginner');
    setTargetProficiency('advanced');
    setPriority('medium');
    setEvidenceUrl('');
    setNotes('');
  };

  const handleSaveSkillEntry = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      addToast('Please log in to manage your skills.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/skills/user/my-skills', {
        skillId: selectedSkillForAction._id,
        relationshipType: modalType,
        selfAssessedProficiency: proficiency,
        targetProficiency: modalType === 'learn' ? targetProficiency : undefined,
        priority: modalType === 'learn' ? priority : undefined,
        evidenceUrl: modalType === 'teach' ? evidenceUrl : undefined,
        teachingExperienceNotes: modalType === 'teach' ? notes : undefined
      });
      addToast(`Added ${selectedSkillForAction.name} to ${modalType} skills!`, 'success');
      setSelectedSkillForAction(null);
      fetchSkills();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Header & Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            College Skill Explorer
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Discover competencies, prerequisite structures, and peer mentors across MIT ACSC
          </p>
        </div>

        <button
          onClick={() => setShowGraph(!showGraph)}
          className={`btn ${showGraph ? 'btn-primary' : 'btn-secondary'} btn-sm`}
        >
          <Network size={16} />
          {showGraph ? 'Hide Graph View' : 'Show Interactive Skill Graph'}
        </button>
      </div>

      {/* SVG Graph Viewer */}
      {showGraph && (
        <SkillGraphViewer
          nodes={graphData.nodes}
          edges={graphData.edges}
          onSelectSkill={(node) => {
            const found = skills.find((s) => s._id === node.id);
            if (found) openActionModal(found, 'learn');
          }}
        />
      )}

      {/* Category Filter Pills & Search Input */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem', maxWidth: '600px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search skills (e.g. SQL, React, Flutter, Python)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-secondary">
            <Search size={16} /> Search
          </button>
        </form>

        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: 'var(--radius-full)', fontSize: '0.8rem' }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      {loading ? (
        <LoadingSpinner message="Querying skill taxonomy..." />
      ) : skills.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          No skills found matching your search.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {skills.map((skill) => (
            <div key={skill._id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <span className="badge badge-indigo">{skill.category}</span>
                <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>👥 {skill.mentorsCount || 0} Mentors</span>
                  <span>🎯 {skill.learnersCount || 0} Learners</span>
                </div>
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                {skill.name}
              </h3>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5, flex: 1, marginBottom: '1rem' }}>
                {skill.description}
              </p>

              {skill.prerequisites && skill.prerequisites.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Prerequisites:
                  </span>
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                    {skill.prerequisites.map((p) => (
                      <span key={p._id} className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                        {p.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  onClick={() => openActionModal(skill, 'learn')}
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1 }}
                >
                  <BookOpen size={14} /> Learn
                </button>
                <button
                  onClick={() => openActionModal(skill, 'teach')}
                  className="btn btn-outline btn-sm"
                  style={{ flex: 1 }}
                >
                  <Award size={14} /> Teach
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Skill to My Competencies Modal */}
      <Modal
        isOpen={!!selectedSkillForAction}
        onClose={() => setSelectedSkillForAction(null)}
        title={
          modalType === 'teach'
            ? `Offer to Teach ${selectedSkillForAction?.name}`
            : `Set Goal to Learn ${selectedSkillForAction?.name}`
        }
      >
        <form onSubmit={handleSaveSkillEntry}>
          <div className="form-group">
            <label className="form-label" htmlFor="modal-proficiency">
              {modalType === 'teach' ? 'Your Verified / Self-Assessed Proficiency' : 'Your Current Proficiency'}
            </label>
            <select
              id="modal-proficiency"
              className="form-select"
              value={proficiency}
              onChange={(e) => setProficiency(e.target.value)}
              required
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          {modalType === 'learn' ? (
            <>
              <div className="form-group">
                <label className="form-label" htmlFor="modal-target-proficiency">Desired Target Proficiency</label>
                <select
                  id="modal-target-proficiency"
                  className="form-select"
                  value={targetProficiency}
                  onChange={(e) => setTargetProficiency(e.target.value)}
                >
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="modal-priority">Learning Priority</label>
                <select
                  id="modal-priority"
                  className="form-select"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="high">High (Immediate Semester Goal)</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label className="form-label" htmlFor="modal-evidence-url">Evidence / GitHub Portfolio Link (Optional)</label>
                <input
                  id="modal-evidence-url"
                  type="url"
                  className="form-input"
                  placeholder="https://github.com/..."
                  value={evidenceUrl}
                  onChange={(e) => setEvidenceUrl(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="modal-notes">Teaching Experience Notes</label>
                <textarea
                  id="modal-notes"
                  className="form-textarea"
                  rows="2"
                  placeholder="e.g. Conducted lab tutorials, completed course practicals with grade A."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              onClick={() => setSelectedSkillForAction(null)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : 'Add to My Profile'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
