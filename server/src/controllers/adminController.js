import { User } from '../models/User.js';
import { Skill } from '../models/Skill.js';
import { ContentReport } from '../models/ContentReport.js';
import { hasPrerequisiteCycle, normalizeSkillName } from '../services/skillGraphService.js';

export const getUsers = async (req, res, next) => {
  try {
    const { role, status, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (role) query.role = role;
    if (status) query.accountStatus = status;
    if (search) {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const users = await User.find(query).skip(skip).limit(parseInt(limit, 10)).sort({ createdAt: -1 });
    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      users: users.map((u) => u.toSafeObject()),
      total,
      page: parseInt(page, 10),
      pages: Math.ceil(total / parseInt(limit, 10))
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'active' or 'suspended'

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin' && status === 'suspended') {
      return res.status(400).json({ success: false, message: 'Cannot suspend administrator account.' });
    }

    user.accountStatus = status;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User status updated to ${status}.`,
      user: user.toSafeObject()
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body; // 'student' | 'coordinator' | 'admin'

    if (!['student', 'coordinator', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(id, { $set: { role } }, { new: true });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: `User role updated to ${role}.`,
      user: user.toSafeObject()
    });
  } catch (error) {
    next(error);
  }
};

export const createSkill = async (req, res, next) => {
  try {
    const { name, description, category, prerequisites = [], relatedSkills = [], learningResources = [] } = req.body;

    const normalizedName = normalizeSkillName(name).toLowerCase();
    const existing = await Skill.findOne({ normalizedName });
    if (existing) {
      return res.status(409).json({ success: false, message: 'A skill with this name already exists in the graph.' });
    }

    const skill = await Skill.create({
      name: normalizeSkillName(name),
      normalizedName,
      description: description.trim(),
      category,
      prerequisites,
      relatedSkills,
      learningResources,
      approved: true,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'New skill added to SkillMesh taxonomy.',
      skill
    });
  } catch (error) {
    next(error);
  }
};

export const updateSkill = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, category, prerequisites, relatedSkills, learningResources } = req.body;

    const skill = await Skill.findById(id);
    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }

    // Check cycles if prerequisites changed
    if (prerequisites && prerequisites.length > 0) {
      for (const prereqId of prerequisites) {
        const cycle = await hasPrerequisiteCycle(skill._id, prereqId);
        if (cycle) {
          return res.status(400).json({
            success: false,
            message: 'Cycle detected! Prerequisite relationship would create a cyclical dependency in the graph.'
          });
        }
      }
      skill.prerequisites = prerequisites;
    }

    if (name) {
      skill.name = name.trim();
      skill.normalizedName = normalizeSkillName(name).toLowerCase();
    }
    if (description) skill.description = description.trim();
    if (category) skill.category = category;
    if (relatedSkills) skill.relatedSkills = relatedSkills;
    if (learningResources) skill.learningResources = learningResources;

    await skill.save();

    res.status(200).json({
      success: true,
      message: 'Skill updated successfully.',
      skill
    });
  } catch (error) {
    next(error);
  }
};

export const getReports = async (req, res, next) => {
  try {
    const reports = await ContentReport.find()
      .populate('reporter', 'name email department')
      .populate('reportedUser', 'name email department')
      .populate('resolvedBy', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      reports
    });
  } catch (error) {
    next(error);
  }
};

export const resolveReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, resolutionNotes } = req.body;

    const report = await ContentReport.findById(id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    report.status = status;
    report.resolutionNotes = resolutionNotes || '';
    report.resolvedBy = req.user._id;
    await report.save();

    res.status(200).json({
      success: true,
      message: 'Content report resolved.',
      report
    });
  } catch (error) {
    next(error);
  }
};
