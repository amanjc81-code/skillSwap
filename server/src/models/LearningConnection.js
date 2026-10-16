import mongoose from 'mongoose';

const learningConnectionSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
      }
    ],
    connectionType: {
      type: String,
      enum: ['reciprocal', 'one-way'],
      default: 'reciprocal'
    },
    primarySkillExchange: [
      {
        teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        learner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        skill: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill', required: true }
      }
    ],
    status: {
      type: String,
      enum: ['active', 'paused', 'completed', 'blocked'],
      default: 'active',
      index: true
    },
    sharedGoals: [
      {
        type: String,
        trim: true
      }
    ],
    sharedResources: [
      {
        title: { type: String, required: true },
        url: { type: String, required: true },
        addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        addedAt: { type: Date, default: Date.now }
      }
    ],
    sessionNotesHistory: [
      {
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  {
    timestamps: true
  }
);

export const LearningConnection = mongoose.model('LearningConnection', learningConnectionSchema);
