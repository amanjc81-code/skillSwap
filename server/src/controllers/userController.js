import { User } from '../models/User.js';
import { UserSkill } from '../models/UserSkill.js';
import { Availability } from '../models/Availability.js';
import { LearningSession } from '../models/LearningSession.js';
import { clearAuthCookie } from '../utils/jwt.js';

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const teachSkills = await UserSkill.find({ user: req.user._id, relationshipType: 'teach' }).populate('skill');
    const learnSkills = await UserSkill.find({ user: req.user._id, relationshipType: 'learn' }).populate('skill');
    const availability = await Availability.findOne({ user: req.user._id });

    // Calculate profile completion percentage
    let completedPoints = 0;
    if (user.name) completedPoints += 20;
    if (user.bio) completedPoints += 20;
    if (teachSkills.length > 0) completedPoints += 20;
    if (learnSkills.length > 0) completedPoints += 20;
    if (availability && availability.slots.length > 0) completedPoints += 20;

    res.status(200).json({
      success: true,
      user: user.toSafeObject(),
      teachSkills,
      learnSkills,
      availability: availability || { slots: [] },
      profileCompletion: completedPoints
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, department, academicYear, bio, preferredLearningFormat, maxWeeklyTeachingHours, isAvailableForMatching } =
      req.body;

    const updates = {};
    if (name) updates.name = name.trim();
    if (department) updates.department = department.trim();
    if (academicYear) updates.academicYear = academicYear;
    if (bio !== undefined) updates.bio = bio;

    if (preferredLearningFormat || maxWeeklyTeachingHours !== undefined || isAvailableForMatching !== undefined) {
      updates.profilePreferences = {
        ...req.user.profilePreferences,
        ...(preferredLearningFormat ? { preferredLearningFormat } : {}),
        ...(maxWeeklyTeachingHours !== undefined ? { maxWeeklyTeachingHours } : {}),
        ...(isAvailableForMatching !== undefined ? { isAvailableForMatching } : {})
      };
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, { $set: updates }, { new: true, runValidators: true });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: updatedUser.toSafeObject()
    });
  } catch (error) {
    next(error);
  }
};

export const updateAvailability = async (req, res, next) => {
  try {
    const { timezone, slots } = req.body;

    const availability = await Availability.findOneAndUpdate(
      { user: req.user._id },
      {
        $set: {
          timezone: timezone || 'Asia/Kolkata',
          slots: slots || []
        }
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'Weekly availability updated.',
      availability
    });
  } catch (error) {
    next(error);
  }
};

export const blockUser = async (req, res, next) => {
  try {
    const { targetUserId } = req.params;
    if (targetUserId === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot block yourself.' });
    }

    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { blockedUsers: targetUserId }
    });

    res.status(200).json({
      success: true,
      message: 'User has been blocked from matching and sessions.'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Remove user skills, availability, and user record
    await Promise.all([
      UserSkill.deleteMany({ user: userId }),
      Availability.deleteMany({ user: userId }),
      User.findByIdAndDelete(userId)
    ]);

    clearAuthCookie(res);
    res.status(200).json({
      success: true,
      message: 'Account deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};
