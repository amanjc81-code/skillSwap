import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['mentor', 'learner', 'peer'],
      default: 'peer'
    }
  },
  { _id: false }
);

const learningSessionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Session title is required'],
      trim: true
    },
    objective: {
      type: String,
      required: [true, 'Learning objective is required'],
      trim: true
    },
    participants: [participantSchema],
    connection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LearningConnection'
    },
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill',
      required: true,
      index: true
    },
    startTime: {
      type: Date,
      required: true,
      index: true
    },
    endTime: {
      type: Date,
      required: true,
      index: true
    },
    format: {
      type: String,
      enum: ['online', 'in-person', 'hybrid'],
      default: 'online'
    },
    meetingLocationOrLink: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'canceled', 'rescheduled'],
      default: 'scheduled',
      index: true
    },
    sessionNotes: {
      type: String,
      default: ''
    },
    outcomes: {
      type: String,
      default: ''
    },
    practicalDeliverableUrl: {
      type: String,
      default: ''
    },
    completedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

export const LearningSession = mongoose.model('LearningSession', learningSessionSchema);
