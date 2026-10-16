import { LearningSession } from '../models/LearningSession.js';
import { SessionFeedback } from '../models/SessionFeedback.js';
import { Notification } from '../models/Notification.js';
import { User } from '../models/User.js';

export const createSession = async (req, res, next) => {
  try {
    const {
      title,
      objective,
      participantId,
      skillId,
      connectionId,
      startTime,
      endTime,
      format,
      meetingLocationOrLink
    } = req.body;

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) {
      return res.status(400).json({ success: false, message: 'Session start time must be before end time.' });
    }

    if (participantId === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot schedule a peer session with yourself.' });
    }

    // Check conflicting bookings for either student
    const existingConflict = await LearningSession.findOne({
      status: { $in: ['scheduled', 'rescheduled'] },
      $or: [
        { 'participants.user': req.user._id },
        { 'participants.user': participantId }
      ],
      $and: [
        { startTime: { $lt: end } },
        { endTime: { $gt: start } }
      ]
    }).populate('participants.user', 'name');

    if (existingConflict) {
      return res.status(409).json({
        success: false,
        message: 'Booking conflict detected. One of the students already has an active session during this time slot.'
      });
    }

    const session = await LearningSession.create({
      title: title.trim(),
      objective: objective.trim(),
      skill: skillId,
      connection: connectionId || undefined,
      participants: [
        { user: req.user._id, role: 'mentor' },
        { user: participantId, role: 'learner' }
      ],
      startTime: start,
      endTime: end,
      format: format || 'online',
      meetingLocationOrLink: meetingLocationOrLink || '',
      status: 'scheduled'
    });

    // Notify partner student
    await Notification.create({
      recipient: participantId,
      type: 'session_scheduled',
      title: 'New Session Scheduled',
      message: `${req.user.name} scheduled a peer session: "${title}" for ${start.toLocaleDateString()}.`,
      link: '/sessions'
    });

    const populated = await LearningSession.findById(session._id)
      .populate('participants.user', 'name department academicYear avatarUrl')
      .populate('skill', 'name category');

    res.status(201).json({
      success: true,
      message: 'Learning session scheduled successfully.',
      session: populated
    });
  } catch (error) {
    next(error);
  }
};

export const getSessions = async (req, res, next) => {
  try {
    const { status, filter } = req.query;
    const query = {
      'participants.user': req.user._id
    };

    if (status) {
      query.status = status;
    } else if (filter === 'upcoming') {
      query.status = { $in: ['scheduled', 'rescheduled'] };
      query.endTime = { $gte: new Date() };
    } else if (filter === 'completed') {
      query.status = 'completed';
    }

    const sessions = await LearningSession.find(query)
      .populate('participants.user', 'name department academicYear avatarUrl email')
      .populate('skill', 'name category')
      .sort({ startTime: -1 });

    res.status(200).json({
      success: true,
      sessions
    });
  } catch (error) {
    next(error);
  }
};

export const getSessionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const session = await LearningSession.findOne({
      _id: id,
      'participants.user': req.user._id
    })
      .populate('participants.user', 'name department academicYear avatarUrl bio')
      .populate('skill', 'name category description')
      .populate('connection');

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found or unauthorized' });
    }

    const feedbacks = await SessionFeedback.find({ session: session._id })
      .populate('reviewer', 'name')
      .populate('reviewee', 'name');

    res.status(200).json({
      success: true,
      session,
      feedbacks
    });
  } catch (error) {
    next(error);
  }
};

export const completeSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { sessionNotes, outcomes, practicalDeliverableUrl } = req.body;

    const session = await LearningSession.findOne({
      _id: id,
      'participants.user': req.user._id
    });

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found or unauthorized' });
    }

    session.status = 'completed';
    session.sessionNotes = sessionNotes || session.sessionNotes;
    session.outcomes = outcomes || session.outcomes;
    session.practicalDeliverableUrl = practicalDeliverableUrl || session.practicalDeliverableUrl;
    session.completedAt = new Date();

    await session.save();

    // Notify other participant
    const otherParticipant = session.participants.find((p) => p.user.toString() !== req.user._id.toString());
    if (otherParticipant) {
      await Notification.create({
        recipient: otherParticipant.user,
        type: 'session_completed',
        title: 'Session Marked Completed',
        message: `${req.user.name} recorded completion and outcomes for "${session.title}". Please submit your feedback!`,
        link: `/sessions/${session._id}`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Session marked as completed. Progress records updated.',
      session
    });
  } catch (error) {
    next(error);
  }
};

export const cancelSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    const session = await LearningSession.findOne({
      _id: id,
      'participants.user': req.user._id
    });

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found or unauthorized' });
    }

    session.status = 'canceled';
    await session.save();

    res.status(200).json({
      success: true,
      message: 'Session has been canceled.',
      session
    });
  } catch (error) {
    next(error);
  }
};

export const submitFeedback = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, clarityOfExplanation, practicalHelpfulness, comments, tags } = req.body;

    const session = await LearningSession.findOne({
      _id: id,
      'participants.user': req.user._id
    });

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found or unauthorized' });
    }

    if (session.status !== 'completed') {
      return res.status(400).json({ success: false, message: 'Feedback can only be submitted for completed sessions.' });
    }

    // Determine reviewee
    const partner = session.participants.find((p) => p.user.toString() !== req.user._id.toString());
    if (!partner) {
      return res.status(400).json({ success: false, message: 'Partner participant not found.' });
    }

    // Check duplicate feedback
    const existing = await SessionFeedback.findOne({
      session: session._id,
      reviewer: req.user._id,
      reviewee: partner.user
    });

    if (existing) {
      return res.status(409).json({ success: false, message: 'You have already submitted feedback for this session.' });
    }

    const feedback = await SessionFeedback.create({
      session: session._id,
      reviewer: req.user._id,
      reviewee: partner.user,
      rating,
      clarityOfExplanation: clarityOfExplanation || 5,
      practicalHelpfulness: practicalHelpfulness || 5,
      comments: comments || '',
      tags: tags || []
    });

    // Notify reviewee
    await Notification.create({
      recipient: partner.user,
      type: 'feedback_received',
      title: 'Peer Feedback Received',
      message: `${req.user.name} submitted a ${rating}-star review for your session "${session.title}".`,
      link: `/sessions/${session._id}`
    });

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully.',
      feedback
    });
  } catch (error) {
    next(error);
  }
};
