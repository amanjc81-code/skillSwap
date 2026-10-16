import mongoose from 'mongoose';

const assessmentAttemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    exercise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PracticeExercise',
      required: true,
      index: true
    },
    submittedNotes: {
      type: String,
      default: ''
    },
    selfRating: {
      type: Number,
      min: 1,
      max: 5,
      default: 4
    },
    status: {
      type: String,
      enum: ['in-progress', 'completed'],
      default: 'completed'
    },
    completedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

export const AssessmentAttempt = mongoose.model('AssessmentAttempt', assessmentAttemptSchema);
