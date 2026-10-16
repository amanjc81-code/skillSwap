import mongoose from 'mongoose';

const sessionFeedbackSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LearningSession',
      required: true,
      index: true
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    reviewee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    clarityOfExplanation: {
      type: Number,
      min: 1,
      max: 5,
      default: 5
    },
    practicalHelpfulness: {
      type: Number,
      min: 1,
      max: 5,
      default: 5
    },
    comments: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: ''
    },
    tags: [
      {
        type: String,
        trim: true
      }
    ]
  },
  {
    timestamps: true
  }
);

sessionFeedbackSchema.index({ session: 1, reviewer: 1, reviewee: 1 }, { unique: true });

export const SessionFeedback = mongoose.model('SessionFeedback', sessionFeedbackSchema);
