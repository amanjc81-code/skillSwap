import mongoose from 'mongoose';

const connectionRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    teachSkill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill'
    },
    learnSkill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill',
      required: true
    },
    message: {
      type: String,
      maxlength: 500,
      default: ''
    },
    proposalType: {
      type: String,
      enum: ['reciprocal', 'one-way'],
      default: 'one-way'
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'canceled'],
      default: 'pending',
      index: true
    }
  },
  {
    timestamps: true
  }
);

export const ConnectionRequest = mongoose.model('ConnectionRequest', connectionRequestSchema);
