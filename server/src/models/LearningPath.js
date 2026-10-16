import mongoose from 'mongoose';

const milestoneSchema = new mongoose.Schema(
  {
    order: { type: Number, required: true },
    title: { type: String, required: true },
    concepts: [{ type: String }],
    suggestedTasks: [{ type: String }],
    recommendedDurationHours: { type: Number, default: 2 },
    isCompleted: { type: Boolean, default: false }
  },
  { _id: false }
);

const learningPathSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    goalSkill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    milestones: [milestoneSchema],
    estimatedHours: {
      type: Number,
      default: 10
    },
    isAIGenerated: {
      type: Boolean,
      default: false
    },
    aiProvider: {
      type: String,
      default: 'deterministic-fallback'
    },
    isVerified: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export const LearningPath = mongoose.model('LearningPath', learningPathSchema);
