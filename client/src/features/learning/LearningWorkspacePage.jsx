import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api.js';
import { useToast } from '../../app/ToastContext.jsx';
import { LoadingSpinner } from '../../components/LoadingSpinner.jsx';
import { Modal } from '../../components/Modal.jsx';
import {
  BookOpen,
  Sparkles,
  CheckCircle2,
  Circle,
  Code2,
  Eye,
  Check,
  Send,
  HelpCircle,
  FileCheck
} from 'lucide-react';

export const LearningWorkspacePage = () => {
  const { addToast } = useToast();

  const [skills, setSkills] = useState([]);
  const [learningPaths, setLearningPaths] = useState([]);
  const [selectedPath, setSelectedPath] = useState(null);
  const [loading, setLoading] = useState(true);

  // Generate Path Modal
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [genSkillId, setGenSkillId] = useState('');
  const [customGoal, setCustomGoal] = useState('');
  const [hoursPerWeek, setHoursPerWeek] = useState(5);
  const [generating, setGenerating] = useState(false);

  // Practice Exercise State
  const [activeExercise, setActiveExercise] = useState(null);
  const [exerciseDifficulty, setExerciseDifficulty] = useState('intermediate');
  const [generatingExercise, setGeneratingExercise] = useState(false);
  const [revealedSolution, setRevealedSolution] = useState(null);
  const [assessmentNotes, setAssessmentNotes] = useState('');
  const [submittingAssessment, setSubmittingAssessment] = useState(false);

  const fetchWorkspaceData = async () => {
    try {
      setLoading(true);
      const [skillsRes, pathsRes] = await Promise.all([
        api.get('/skills'),
        api.get('/learning/paths')
      ]);

      setSkills(skillsRes.skills || []);
      setLearningPaths(pathsRes.learningPaths || []);

      if (pathsRes.learningPaths && pathsRes.learningPaths.length > 0) {
        setSelectedPath(pathsRes.learningPaths[0]);
      }
      if (skillsRes.skills && skillsRes.skills.length > 0) {
        setGenSkillId(skillsRes.skills[0]._id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaceData();
  }, []);

  const handleGeneratePath = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const res = await api.post('/learning/paths/generate', {
        skillId: genSkillId,
        customGoal,
        availableHoursPerWeek: Number(hoursPerWeek)
      });
      addToast('Personalized learning plan ready!', 'success');
      setIsGenerateOpen(false);
      setCustomGoal('');
      fetchWorkspaceData();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleToggleMilestone = async (pathId, milestoneIndex) => {
    try {
      const res = await api.patch(`/learning/paths/${pathId}/milestones/${milestoneIndex}/toggle`);
      setSelectedPath(res.learningPath);
      setLearningPaths((prev) =>
        prev.map((p) => (p._id === res.learningPath._id ? res.learningPath : p))
      );
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleGenerateExercise = async () => {
    if (!selectedPath?.goalSkill) return;
    setGeneratingExercise(true);
    setRevealedSolution(null);
    try {
      const res = await api.post('/learning/exercises/generate', {
        skillId: selectedPath.goalSkill._id,
        difficulty: exerciseDifficulty
      });
      setActiveExercise(res.exercise);
      addToast('Practical exercise generated.', 'success');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setGeneratingExercise(false);
    }
  };

  const handleRevealSolution = async () => {
    if (!activeExercise?._id) return;
    try {
      const res = await api.get(`/learning/exercises/${activeExercise._id}/solution`);
      setRevealedSolution(res.referenceSolution);
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleSubmitAssessment = async (e) => {
    e.preventDefault();
    if (!activeExercise?._id) return;
    setSubmittingAssessment(true);
    try {
      await api.post('/learning/assessments', {
        exerciseId: activeExercise._id,
        submittedNotes: assessmentNotes,
        selfRating: 5
      });
      addToast('Practical outcome recorded in your progress profile!', 'success');
      setAssessmentNotes('');
      setActiveExercise(null);
      setRevealedSolution(null);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSubmittingAssessment(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Opening your personalized learning workspace..." />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Personalized Learning Workspace
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Structured milestones, practice exercises, and reflection deliverables
          </p>
        </div>

        <button onClick={() => setIsGenerateOpen(true)} className="btn btn-primary">
          <Sparkles size={16} /> Generate New Learning Plan
        </button>
      </div>

      {learningPaths.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
          <BookOpen size={36} color="var(--accent-primary)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            No Learning Plans Generated Yet
          </h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto 1.5rem', fontSize: '0.875rem' }}>
            Generate a step-by-step roadmap for any skill in the taxonomy. Supported by AI analysis or deterministic templates.
          </p>
          <button onClick={() => setIsGenerateOpen(true)} className="btn btn-primary">
            <Sparkles size={16} /> Generate My First Plan
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 340px) 1fr', gap: '1.5rem', alignItems: 'flex-start' }}>
          {/* Paths selector list */}
          <div className="card" style={{ padding: '1rem' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem', padding: '0 0.5rem' }}>
              Your Active Learning Roadmaps
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {learningPaths.map((lp) => {
                const isSelected = selectedPath?._id === lp._id;
                const completedCount = lp.milestones.filter((m) => m.isCompleted).length;
                return (
                  <button
                    key={lp._id}
                    onClick={() => {
                      setSelectedPath(lp);
                      setActiveExercise(null);
                      setRevealedSolution(null);
                    }}
                    style={{
                      textAlign: 'left',
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isSelected ? 'var(--bg-card-subtle)' : 'transparent',
                      border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                      {lp.goalSkill?.name}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                      <span>{lp.estimatedHours} hrs est.</span>
                      <span>{completedCount}/{lp.milestones.length} Milestones</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Path Details & Milestones Checklist */}
          {selectedPath && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {selectedPath.title}
                      </h2>
                      <span className="badge badge-indigo">
                        {selectedPath.isAIGenerated ? 'AI Generated' : 'Deterministic Curriculum'}
                      </span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                      {selectedPath.description}
                    </p>
                  </div>

                  <button onClick={handleGenerateExercise} className="btn btn-outline btn-sm">
                    <Code2 size={14} /> Practice Challenge
                  </button>
                </div>

                {/* Milestones checklist */}
                <div style={{ marginTop: '1.5rem' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                    Milestone Progress Checklist:
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {selectedPath.milestones.map((m, idx) => (
                      <div
                        key={idx}
                        style={{
                          backgroundColor: 'var(--bg-surface)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-md)',
                          padding: '1rem 1.25rem',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '1rem'
                        }}
                      >
                        <button
                          onClick={() => handleToggleMilestone(selectedPath._id, idx)}
                          style={{
                            color: m.isCompleted ? 'var(--color-success)' : 'var(--text-disabled)',
                            cursor: 'pointer',
                            marginTop: '2px'
                          }}
                          title="Toggle milestone completion"
                        >
                          {m.isCompleted ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                        </button>

                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h5
                              style={{
                                fontSize: '0.95rem',
                                fontWeight: 600,
                                color: m.isCompleted ? 'var(--text-muted)' : 'var(--text-primary)',
                                textDecoration: m.isCompleted ? 'line-through' : 'none'
                              }}
                            >
                              Milestone #{m.order}: {m.title}
                            </h5>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              ~{m.recommendedDurationHours} hrs
                            </span>
                          </div>

                          {m.concepts && m.concepts.length > 0 && (
                            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                              {m.concepts.map((c, cIdx) => (
                                <span key={cIdx} className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                                  {c}
                                </span>
                              ))}
                            </div>
                          )}

                          {m.suggestedTasks && (
                            <ul style={{ paddingLeft: '1.25rem', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                              {m.suggestedTasks.map((t, tIdx) => (
                                <li key={tIdx} style={{ marginBottom: '0.2rem' }}>{t}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Practice Exercise Card */}
              {activeExercise && (
                <div className="card" style={{ border: '1px solid var(--accent-primary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <span className="badge badge-indigo" style={{ marginBottom: '0.4rem' }}>
                        {activeExercise.difficulty} Practical Exercise
                      </span>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {activeExercise.title}
                      </h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
                        {activeExercise.objective}
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1rem',
                      fontSize: '0.85rem',
                      fontFamily: 'var(--font-mono)',
                      whiteSpace: 'pre-wrap',
                      marginBottom: '1rem',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    {activeExercise.instructions}
                  </div>

                  {activeExercise.hints && activeExercise.hints.length > 0 && (
                    <div style={{ marginBottom: '1rem', fontSize: '0.85rem' }}>
                      <strong style={{ color: 'var(--color-warning)' }}>💡 Hints:</strong>
                      <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        {activeExercise.hints.map((h, i) => (
                          <li key={i}>{h}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Reference solution reveal */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    {revealedSolution ? (
                      <div
                        style={{
                          backgroundColor: 'var(--bg-card-subtle)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-md)',
                          padding: '1rem',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.825rem',
                          color: 'var(--text-primary)',
                          whiteSpace: 'pre-wrap'
                        }}
                      >
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                          Reference Solution:
                        </div>
                        {revealedSolution}
                      </div>
                    ) : (
                      <button onClick={handleRevealSolution} className="btn btn-secondary btn-sm">
                        <Eye size={14} /> Reveal Reference Solution
                      </button>
                    )}
                  </div>

                  {/* Practical Deliverable Submission */}
                  <form onSubmit={handleSubmitAssessment} style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="deliverable-notes">Record Practical Attempt / Notes / Deliverable URL</label>
                      <textarea
                        id="deliverable-notes"
                        className="form-textarea"
                        rows="3"
                        placeholder="Paste your code solution, GitHub deliverable URL, or key reflections from your practice."
                        value={assessmentNotes}
                        onChange={(e) => setAssessmentNotes(e.target.value)}
                        required
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                      <button type="submit" className="btn btn-primary" disabled={submittingAssessment}>
                        <FileCheck size={16} />
                        {submittingAssessment ? 'Submitting...' : 'Record Practical Deliverable'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Generate Path Modal */}
      <Modal
        isOpen={isGenerateOpen}
        onClose={() => setIsGenerateOpen(false)}
        title="Generate Personalized Learning Roadmap"
      >
        <form onSubmit={handleGeneratePath}>
          <div className="form-group">
            <label className="form-label" htmlFor="gen-skill-select">Skill Focus</label>
            <select
              id="gen-skill-select"
              className="form-select"
              value={genSkillId}
              onChange={(e) => setGenSkillId(e.target.value)}
              required
            >
              {skills.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} ({s.category})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="gen-custom-goal">Your Specific Learning Objective (Optional)</label>
            <textarea
              id="gen-custom-goal"
              className="form-textarea"
              rows="2"
              placeholder="e.g. Master relational joins and normalization for TYBCA field project."
              value={customGoal}
              onChange={(e) => setCustomGoal(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="gen-hours">Available Hours Per Week</label>
            <input
              id="gen-hours"
              type="number"
              min="1"
              max="40"
              className="form-input"
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setIsGenerateOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={generating}>
              <Sparkles size={16} />
              {generating ? 'Formulating Plan...' : 'Generate Roadmap'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
