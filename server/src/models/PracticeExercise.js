import mongoose from 'mongoose';

const practiceExerciseSchema = new mongoose.Schema(
  {
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate',
      index: true
    },
    objective: {
      type: String,
      required: true
    },
    instructions: {
      type: String,
      required: true
    },
    expectedOutput: {
      type: String,
      default: ''
    },
    assessmentRubric: [
      {
        type: String
      }
    ],
    hints: [
      {
        type: String
      }
    ],
    referenceSolution: {
      type: String,
      default: ''
    },
    deterministicTests: [
      {
        testInput: { type: String },
        expectedOutput: { type: String }
      }
    ],
    isAIGenerated: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export const PracticeExercise = mongoose.model('PracticeExercise', practiceExerciseSchema);
