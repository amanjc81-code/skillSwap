import mongoose from 'mongoose';

const userSkillSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill',
      required: true,
      index: true
    },
    relationshipType: {
      type: String,
      enum: ['teach', 'learn'],
      required: true,
      index: true
    },
    selfAssessedProficiency: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true
    },
    targetProficiency: {
      type: String,
      enum: ['intermediate', 'advanced', 'expert'],
      default: 'advanced'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    goalDescription: {
      type: String,
      trim: true,
      maxlength: 500,
      default: ''
    },
    targetDate: {
      type: Date
    },
    evidenceUrl: {
      type: String,
      trim: true,
      default: ''
    },
    teachingExperienceNotes: {
      type: String,
      trim: true,
      maxlength: 500,
      default: ''
    },
    maxWeeklyHours: {
      type: Number,
      default: 2,
      min: 1,
      max: 20
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

userSkillSchema.index({ user: 1, skill: 1, relationshipType: 1 }, { unique: true });

export const UserSkill = mongoose.model('UserSkill', userSkillSchema);
