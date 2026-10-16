import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true
    },
    normalizedName: {
      type: String,
      required: [true, 'Normalized skill name is required'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true
    },
    description: {
      type: String,
      required: [true, 'Skill description is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Web Development',
        'Databases',
        'Programming Languages',
        'Artificial Intelligence',
        'UI/UX Design',
        'Software Engineering',
        'Cloud & DevOps',
        'Mobile Development'
      ],
      index: true
    },
    prerequisites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill'
      }
    ],
    relatedSkills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill'
      }
    ],
    learningResources: [
      {
        title: { type: String, required: true },
        url: { type: String, required: true },
        type: { type: String, enum: ['documentation', 'tutorial', 'course', 'article'], default: 'documentation' }
      }
    ],
    approved: {
      type: Boolean,
      default: true,
      index: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

export const Skill = mongoose.model('Skill', skillSchema);
