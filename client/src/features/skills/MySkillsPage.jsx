import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api.js';
import { useToast } from '../../app/ToastContext.jsx';
import { LoadingSpinner } from '../../components/LoadingSpinner.jsx';
import { Modal } from '../../components/Modal.jsx';
import { EmptyState } from '../../components/EmptyState.jsx';
import { Award, BookOpen, Plus, Trash2, Edit2, ExternalLink, Clock, AlertCircle } from 'lucide-react';

export const MySkillsPage = () => {
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('teach'); // 'teach' or 'learn'
  const [loading, setLoading] = useState(true);
  const [teachSkills, setTeachSkills] = useState([]);
  const [learnSkills, setLearnSkills] = useState([]);
  const [allSkills, setAllSkills] = useState([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [skillId, setSkillId] = useState('');
  const [proficiency, setProficiency] = useState('intermediate');
  const [targetProficiency, setTargetProficiency] = useState('advanced');
  const [priority, setPriority] = useState('medium');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [goalDescription, setGoalDescription] = useState('');
  const [maxHours, setMaxHours] = useState(2);
  const [submitting, setSubmitting] = useState(false);

  const fetchMySkills = async () => {
    try {
      setLoading(true);
      const [myRes, skillsRes] = await Promise.all([
        api.get('/skills/user/my-skills'),
        api.get('/skills')
      ]);

      setTeachSkills(myRes.teachSkills || []);
      setLearnSkills(myRes.learnSkills || []);
      setAllSkills(skillsRes.skills || []);

      if (skillsRes.skills && skillsRes.skills.length > 0 && !skillId) {
        setSkillId(skillsRes.skills[0]._id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMySkills();
  }, []);

  const openAddModal = (tab) => {
    setEditingItem(null);
    setActiveTab(tab);
    setProficiency(tab === 'teach' ? 'intermediate' : 'beginner');
    setTargetProficiency('advanced');
    setPriority('medium');
    setEvidenceUrl('');
    setNotes('');
    setGoalDescription('');
    setMaxHours(2);
    setIsModalOpen(true);
  };

  const openEditModal = (item, type) => {
    setEditingItem(item);
    setActiveTab(type);
    setSkillId(item.skill._id);
    setProficiency(item.selfAssessedProficiency);
    setTargetProficiency(item.targetProficiency || 'advanced');
    setPriority(item.priority || 'medium');
    setEvidenceUrl(item.evidenceUrl || '');
    setNotes(item.teachingExperienceNotes || '');
    setGoalDescription(item.goalDescription || '');
    setMaxHours(item.maxWeeklyHours || 2);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this skill from your profile?')) return;
    try {
      await api.delete(`/skills/user/my-skills/${id}`);
      addToast('Skill entry removed.', 'success');
      fetchMySkills();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingItem) {
        // Update existing
        await api.patch(`/skills/user/my-skills/${editingItem._id}`, {
          selfAssessedProficiency: proficiency,
          targetProficiency: activeTab === 'learn' ? targetProficiency : undefined,
          priority: activeTab === 'learn' ? priority : undefined,
          goalDescription: activeTab === 'learn' ? goalDescription : undefined,
          evidenceUrl: activeTab === 'teach' ? evidenceUrl : undefined,
          teachingExperienceNotes: activeTab === 'teach' ? notes : undefined,
          maxWeeklyHours: activeTab === 'teach' ? Number(maxHours) : undefined
        });
        addToast('Skill updated successfully.', 'success');
      } else {
        // Create new
        await api.post('/skills/user/my-skills', {
          skillId,
          relationshipType: activeTab,
          selfAssessedProficiency: proficiency,
          targetProficiency: activeTab === 'learn' ? targetProficiency : undefined,
          priority: activeTab === 'learn' ? priority : undefined,
          goalDescription: activeTab === 'learn' ? goalDescription : undefined,
          evidenceUrl: activeTab === 'teach' ? evidenceUrl : undefined,
          teachingExperienceNotes: activeTab === 'teach' ? notes : undefined,
          maxWeeklyHours: activeTab === 'teach' ? Number(maxHours) : undefined
        });
        addToast('Skill added to profile.', 'success');
      }

      setIsModalOpen(false);
      fetchMySkills();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Retrieving your competencies..." />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            My Skills & Competencies
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Manage the skills you offer to teach and target learning goals. All levels are self-assessed unless independently verified.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => openAddModal('teach')} className="btn btn-outline btn-sm">
            <Plus size={14} /> Add Teaching Skill
          </button>
          <button onClick={() => openAddModal('learn')} className="btn btn-primary btn-sm">
            <Plus size={14} /> Add Learning Goal
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveTab('teach')}
          className={`btn btn-sm ${activeTab === 'teach' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Award size={16} /> Skills I Can Teach ({teachSkills.length})
        </button>
        <button
          onClick={() => setActiveTab('learn')}
          className={`btn btn-sm ${activeTab === 'learn' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <BookOpen size={16} /> Skills I Want to Learn ({learnSkills.length})
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'teach' ? (
        <div>
          {teachSkills.length === 0 ? (
            <EmptyState
              icon={Award}
              title="No teaching skills added yet"
              description="Share your expertise with peer students to receive reciprocal learning matches."
              action={
                <button onClick={() => openAddModal('teach')} className="btn btn-primary">
                  <Plus size={16} /> Add First Teaching Skill
                </button>
              }
            />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {teachSkills.map((ts) => (
                <div key={ts._id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <span className="badge badge-indigo">{ts.skill.category}</span>
                    <span className="badge badge-success" style={{ textTransform: 'capitalize' }}>
                      {ts.selfAssessedProficiency}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                    {ts.skill.name}
                  </h3>

                  {ts.teachingExperienceNotes && (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.75rem', flex: 1 }}>
                      "{ts.teachingExperienceNotes}"
                    </p>
                  )}

                  {ts.evidenceUrl && (
                    <a
                      href={ts.evidenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontSize: '0.8rem',
                        color: 'var(--accent-primary)',
                        marginBottom: '0.75rem'
                      }}
                    >
                      <ExternalLink size={12} /> View Portfolio / Evidence
                    </a>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    <Clock size={12} /> Max Capacity: {ts.maxWeeklyHours || 2} hrs/week
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <button
                      onClick={() => openEditModal(ts, 'teach')}
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1 }}
                    >
                      <Edit2 size={12} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(ts._id)}
                      className="btn btn-secondary btn-sm"
                      style={{ color: 'var(--color-danger)' }}
                      title="Remove"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          {learnSkills.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="No learning goals added yet"
              description="Specify which skills you need guidance with to receive peer partner recommendations."
              action={
                <button onClick={() => openAddModal('learn')} className="btn btn-primary">
                  <Plus size={16} /> Add First Learning Goal
                </button>
              }
            />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {learnSkills.map((ls) => (
                <div key={ls._id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <span className="badge badge-indigo">{ls.skill.category}</span>
                    <span
                      className={`badge ${
                        ls.priority === 'high'
                          ? 'badge-danger'
                          : ls.priority === 'medium'
                          ? 'badge-warning'
                          : 'badge-neutral'
                      }`}
                      style={{ textTransform: 'capitalize' }}
                    >
                      {ls.priority} Priority
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                    {ls.skill.name}
                  </h3>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                    Current: <strong style={{ color: 'var(--text-primary)' }}>{ls.selfAssessedProficiency}</strong> → Target:{' '}
                    <strong style={{ color: 'var(--accent-primary)' }}>{ls.targetProficiency}</strong>
                  </div>

                  {ls.goalDescription && (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem', flex: 1 }}>
                      "{ls.goalDescription}"
                    </p>
                  )}

                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <button
                      onClick={() => openEditModal(ls, 'learn')}
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1 }}
                    >
                      <Edit2 size={12} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(ls._id)}
                      className="btn btn-secondary btn-sm"
                      style={{ color: 'var(--color-danger)' }}
                      title="Remove"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          editingItem
            ? `Edit ${editingItem.skill.name}`
            : activeTab === 'teach'
            ? 'Add Skill You Can Teach'
            : 'Add Skill You Want to Learn'
        }
      >
        <form onSubmit={handleFormSubmit}>
          {!editingItem && (
            <div className="form-group">
              <label className="form-label" htmlFor="skill-select">Select Skill</label>
              <select
                id="skill-select"
                className="form-select"
                value={skillId}
                onChange={(e) => setSkillId(e.target.value)}
                required
              >
                {allSkills.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} ({s.category})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="proficiency-select">
              {activeTab === 'teach' ? 'Self-Assessed Teaching Proficiency' : 'Your Current Proficiency'}
            </label>
            <select
              id="proficiency-select"
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

          {activeTab === 'learn' ? (
            <>
              <div className="form-group">
                <label className="form-label" htmlFor="target-proficiency-select">Target Desired Proficiency</label>
                <select
                  id="target-proficiency-select"
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
                <label className="form-label" htmlFor="priority-select">Goal Priority</label>
                <select
                  id="priority-select"
                  className="form-select"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="high">High (Urgent Semester Project)</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="goal-description">Goal Description</label>
                <textarea
                  id="goal-description"
                  className="form-textarea"
                  rows="2"
                  placeholder="e.g. Master relational joins and foreign key constraints for TYBCA field project."
                  value={goalDescription}
                  onChange={(e) => setGoalDescription(e.target.value)}
                />
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label className="form-label" htmlFor="evidence-url">Portfolio / Evidence Link (Optional)</label>
                <input
                  id="evidence-url"
                  type="url"
                  className="form-input"
                  placeholder="https://github.com/your-username/repo"
                  value={evidenceUrl}
                  onChange={(e) => setEvidenceUrl(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="teaching-notes">Teaching Experience Notes (Optional)</label>
                <textarea
                  id="teaching-notes"
                  className="form-textarea"
                  rows="2"
                  placeholder="e.g. Lab tutor, conducted workshop for juniors, built production projects."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="max-capacity-hours">Max Weekly Teaching Capacity (Hours)</label>
                <input
                  id="max-capacity-hours"
                  type="number"
                  min="1"
                  max="20"
                  className="form-input"
                  value={maxHours}
                  onChange={(e) => setMaxHours(e.target.value)}
                />
              </div>
            </>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : editingItem ? 'Update Entry' : 'Add to Profile'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
