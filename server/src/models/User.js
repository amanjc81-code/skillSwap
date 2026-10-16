import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 100
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true
    },
    firebaseUid: {
      type: String,
      sparse: true,
      index: true
    },
    passwordHash: {
      type: String,
      required: false,
      select: false
    },
    role: {
      type: String,
      enum: ['student', 'coordinator', 'admin'],
      default: 'student',
      index: true
    },
    department: {
      type: String,
      default: 'Computer Applications',
      trim: true
    },
    academicYear: {
      type: String,
      enum: ['FY', 'SY', 'TY', 'Final', 'N/A'],
      default: 'TY'
    },
    bio: {
      type: String,
      maxlength: 500,
      default: ''
    },
    avatarUrl: {
      type: String,
      default: ''
    },
    profilePreferences: {
      preferredLearningFormat: {
        type: String,
        enum: ['online', 'in-person', 'hybrid', 'flexible'],
        default: 'flexible'
      },
      maxWeeklyTeachingHours: {
        type: Number,
        default: 4,
        min: 1,
        max: 20
      },
      isAvailableForMatching: {
        type: Boolean,
        default: true
      }
    },
    accountStatus: {
      type: String,
      enum: ['active', 'suspended'],
      default: 'active'
    },
    blockedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    timestamps: true
  }
);

userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.passwordHash);
};

userSchema.methods.toSafeObject = function () {
  const obj = this.toObject ? this.toObject() : { ...this };
  delete obj.passwordHash;
  return obj;
};

export const User = mongoose.model('User', userSchema);
