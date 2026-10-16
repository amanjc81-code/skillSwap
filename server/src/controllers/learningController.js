import { Skill } from '../models/Skill.js';
import { LearningPath } from '../models/LearningPath.js';
import { PracticeExercise } from '../models/PracticeExercise.js';
import { AssessmentAttempt } from '../models/AssessmentAttempt.js';
import { LearningSession } from '../models/LearningSession.js';
import { SessionFeedback } from '../models/SessionFeedback.js';
import { UserSkill } from '../models/UserSkill.js';
import { generatePersonalizedLearningPath, generatePracticeExercise } from '../services/aiService.js';

export const generatePath = async (req, res, next) => {
  try {
    const { skillId, customGoal, availableHoursPerWeek } = req.body;
    const skill = await Skill.findById(skillId);
    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }

    const generated = await generatePersonalizedLearningPath({
      skill,
      customGoal,
      availableHoursPerWeek: availableHoursPerWeek || 5,
      user: req.user
    });

    const learningPath = await LearningPath.create({
      user: req.user._id,
      goalSkill: skill._id,
      title: generated.title,
      description: generated.description,
      milestones: generated.milestones,
      estimatedHours: generated.estimatedHours,
      isAIGenerated: generated.isAIGenerated,
      aiProvider: generated.aiProvider,
      isVerified: generated.isVerified
    });

    const populated = await LearningPath.findById(learningPath._id).populate('goalSkill', 'name category');

    res.status(201).json({
      success: true,
      message: 'Learning path generated.',
      learningPath: populated
    });
  } catch (error) {
    next(error);
  }
};

export const getLearningPaths = async (req, res, next) => {
  try {
    const paths = await LearningPath.find({ user: req.user._id })
      .populate('goalSkill', 'name category')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      learningPaths: paths
    });
  } catch (error) {
    next(error);
  }
};

export const toggleMilestone = async (req, res, next) => {
  try {
    const { id, milestoneIndex } = req.params;
    const path = await LearningPath.findOne({ _id: id, user: req.user._id });
    if (!path) {
      return res.status(404).json({ success: false, message: 'Learning path not found' });
    }

    const idx = parseInt(milestoneIndex, 10);
    if (idx < 0 || idx >= path.milestones.length) {
      return res.status(400).json({ success: false, message: 'Invalid milestone index' });
    }

    path.milestones[idx].isCompleted = !path.milestones[idx].isCompleted;
    await path.save();

    res.status(200).json({
      success: true,
      message: 'Milestone updated.',
      learningPath: path
    });
  } catch (error) {
    next(error);
  }
};

export const createExercise = async (req, res, next) => {
  try {
    const { skillId, difficulty } = req.body;
    const skill = await Skill.findById(skillId);
    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }

    const generated = await generatePracticeExercise({
      skill,
      difficulty: difficulty || 'intermediate'
    });

    const exercise = await PracticeExercise.create(generated);
    const populated = await PracticeExercise.findById(exercise._id).populate('skill', 'name category');

    // Return without reference solution by default
    const safeExercise = populated.toObject();
    delete safeExercise.referenceSolution;

    res.status(201).json({
      success: true,
      message: 'Practice exercise ready.',
      exercise: safeExercise
    });
  } catch (error) {
    next(error);
  }
};

export const getExerciseSolution = async (req, res, next) => {
  try {
    const { id } = req.params;
    const exercise = await PracticeExercise.findById(id).select('+referenceSolution');
    if (!exercise) {
      return res.status(404).json({ success: false, message: 'Exercise not found' });
    }

    res.status(200).json({
      success: true,
      referenceSolution: exercise.referenceSolution,
      deterministicTests: exercise.deterministicTests
    });
  } catch (error) {
    next(error);
  }
};

export const submitAssessment = async (req, res, next) => {
  try {
    const { exerciseId, submittedNotes, selfRating } = req.body;

    const exercise = await PracticeExercise.findById(exerciseId);
    if (!exercise) {
      return res.status(404).json({ success: false, message: 'Exercise not found' });
    }

    const attempt = await AssessmentAttempt.create({
      user: req.user._id,
      exercise: exerciseId,
      submittedNotes: submittedNotes.trim(),
      selfRating: selfRating || 4,
      status: 'completed',
      completedAt: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Assessment attempt recorded.',
      attempt
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentProgress = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Completed sessions as learner
    const sessionsAttended = await LearningSession.countDocuments({
      'participants.user': userId,
      'participants.role': 'learner',
      status: 'completed'
    });

    // Completed sessions as mentor
    const teachingContributions = await LearningSession.countDocuments({
      'participants.user': userId,
      'participants.role': 'mentor',
      status: 'completed'
    });

    // Assessment attempts
    const assessmentsCompleted = await AssessmentAttempt.countDocuments({
      user: userId,
      status: 'completed'
    });

    // Learning paths
    const learningPaths = await LearningPath.find({ user: userId }).populate('goalSkill', 'name');
    let totalMilestones = 0;
    let completedMilestones = 0;
    learningPaths.forEach((lp) => {
      totalMilestones += lp.milestones.length;
      completedMilestones += lp.milestones.filter((m) => m.isCompleted).length;
    });

    // Feedback received
    const feedbackReceived = await SessionFeedback.find({ reviewee: userId }).populate('reviewer', 'name');
    const avgReceivedRating =
      feedbackReceived.length > 0
        ? parseFloat((feedbackReceived.reduce((acc, f) => acc + f.rating, 0) / feedbackReceived.length).toFixed(1))
        : 5.0;

    // Skills practiced
    const skillsPracticed = await LearningSession.distinct('skill', {
      'participants.user': userId,
      status: 'completed'
    });

    res.status(200).json({
      success: true,
      progress: {
        sessionsAttended,
        teachingContributions,
        assessmentsCompleted,
        skillsPracticedCount: skillsPracticed.length,
        milestonesProgress: {
          total: totalMilestones,
          completed: completedMilestones,
          percentage: totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0
        },
        feedbackStats: {
          count: feedbackReceived.length,
          averageRating: avgReceivedRating
        },
        recentFeedback: feedbackReceived.slice(0, 5)
      }
    });
  } catch (error) {
    next(error);
  }
};
