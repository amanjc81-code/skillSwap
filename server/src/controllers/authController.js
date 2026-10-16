import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Availability } from '../models/Availability.js';
import { signToken, setAuthCookie, clearAuthCookie } from '../utils/jwt.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password, department, academicYear, preferredLearningFormat } = req.body;

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Hardcode role to student to prevent unauthorized role escalation
    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: 'student',
      department: department || 'Computer Applications',
      academicYear: academicYear || 'TY',
      profilePreferences: {
        preferredLearningFormat: preferredLearningFormat || 'flexible',
        maxWeeklyTeachingHours: 4,
        isAvailableForMatching: true
      }
    });

    // Create default availability container
    await Availability.create({
      user: newUser._id,
      timezone: 'Asia/Kolkata',
      slots: []
    });

    const token = signToken({ userId: newUser._id, role: newUser.role });
    setAuthCookie(res, token);

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to SkillMesh.',
      user: newUser.toSafeObject()
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    if (user.accountStatus === 'suspended') {
      return res.status(403).json({
        success: false,
        message: 'Your account is suspended. Please contact the administrator.'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const token = signToken({ userId: user._id, role: user.role });
    setAuthCookie(res, token);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      user: user.toSafeObject()
    });
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res) => {
  clearAuthCookie(res);
  res.status(200).json({
    success: true,
    message: 'Logged out successfully.'
  });
};

export const getMe = async (req, res, next) => {
  try {
    const availability = await Availability.findOne({ user: req.user._id });
    res.status(200).json({
      success: true,
      user: req.user.toSafeObject(),
      availability: availability || { slots: [] }
    });
  } catch (error) {
    next(error);
  }
};

export const firebaseSync = async (req, res, next) => {
  try {
    const { firebaseUid, email, name, department, academicYear, preferredLearningFormat, avatarUrl } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    let user = await User.findOne({
      $or: [
        { firebaseUid },
        { email: normalizedEmail }
      ]
    });

    if (user) {
      if (!user.firebaseUid) {
        user.firebaseUid = firebaseUid;
      }
      if (avatarUrl && !user.avatarUrl) {
        user.avatarUrl = avatarUrl;
      }
      if (name && (!user.name || user.name === 'Student')) {
        user.name = name.trim();
      }
      await user.save();
    } else {
      user = await User.create({
        firebaseUid,
        name: (name || normalizedEmail.split('@')[0] || 'Student').trim(),
        email: normalizedEmail,
        role: 'student',
        department: department || 'Computer Applications',
        academicYear: academicYear || 'TY',
        avatarUrl: avatarUrl || '',
        profilePreferences: {
          preferredLearningFormat: preferredLearningFormat || 'flexible',
          maxWeeklyTeachingHours: 4,
          isAvailableForMatching: true
        }
      });

      await Availability.create({
        user: user._id,
        timezone: 'Asia/Kolkata',
        slots: []
      });
    }

    if (user.accountStatus === 'suspended') {
      return res.status(403).json({
        success: false,
        message: 'Your account is suspended. Please contact the administrator.'
      });
    }

    const token = signToken({ userId: user._id, role: user.role });
    setAuthCookie(res, token);

    res.status(200).json({
      success: true,
      message: 'Authenticated successfully via Firebase.',
      user: user.toSafeObject()
    });
  } catch (error) {
    next(error);
  }
};

