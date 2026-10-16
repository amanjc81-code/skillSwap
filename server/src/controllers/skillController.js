import { Skill } from '../models/Skill.js';
import { UserSkill } from '../models/UserSkill.js';
import {
  getSkillGraphVisualData,
  detectMissingPrerequisites,
  normalizeSkillName
} from '../services/skillGraphService.js';

export const getAllSkills = async (req, res, next) => {
  try {
    const { search, category } = req.query;
    const query = { approved: true };

    if (search) {
      query.name = { $regex: search.trim(), $options: 'i' };
    }
    if (category && category !== 'All') {
      query.category = category;
    }

    const skills = await Skill.find(query)
      .populate('prerequisites', 'name category')
      .populate('relatedSkills', 'name category')
      .sort({ name: 1 })
      .lean();

    // Attach mentor and learner counts to each skill
    const skillIds = skills.map((s) => s._id);
    const counts = await UserSkill.aggregate([
      { $match: { skill: { $in: skillIds } } },
      {
        $group: {
          _id: '$skill',
          mentorsCount: { $sum: { $cond: [{ $eq: ['$relationshipType', 'teach'] }, 1, 0] } },
          learnersCount: { $sum: { $cond: [{ $eq: ['$relationshipType', 'learn'] }, 1, 0] } }
        }
      }
    ]);

    const countMap = new Map();
    counts.forEach((c) => {
      countMap.set(c._id.toString(), c);
    });

    const enriched = skills.map((s) => {
      const c = countMap.get(s._id.toString()) || { mentorsCount: 0, learnersCount: 0 };
      return {
        ...s,
        mentorsCount: c.mentorsCount,
        learnersCount: c.learnersCount
      };
    });

    res.status(200).json({
      success: true,
      skills: enriched
    });
  } catch (error) {
    next(error);
  }
};

export const getSkillById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const skill = await Skill.findById(id)
      .populate('prerequisites', 'name category description')
      .populate('relatedSkills', 'name category description');

    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }

    // Check missing prerequisites if authenticated
    let missingPrerequisites = [];
    if (req.user) {
      missingPrerequisites = await detectMissingPrerequisites(req.user._id, skill._id);
    }

    // Find available peer mentors for this skill
    const mentors = await UserSkill.find({
      skill: skill._id,
      relationshipType: 'teach'
    })
      .populate('user', 'name department academicYear avatarUrl bio profilePreferences')
      .limit(10);

    res.status(200).json({
      success: true,
      skill,
      missingPrerequisites,
      mentors
    });
  } catch (error) {
    next(error);
  }
};

export const getSkillGraph = async (req, res, next) => {
  try {
    const graphData = await getSkillGraphVisualData();
    res.status(200).json({
      success: true,
      graph: graphData
    });
  } catch (error) {
    next(error);
  }
};

export const getMySkills = async (req, res, next) => {
  try {
    const teachSkills = await UserSkill.find({ user: req.user._id, relationshipType: 'teach' })
      .populate('skill')
      .sort({ createdAt: -1 });

    const learnSkills = await UserSkill.find({ user: req.user._id, relationshipType: 'learn' })
      .populate('skill')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      teachSkills,
      learnSkills
    });
  } catch (error) {
    next(error);
  }
};

export const addUserSkill = async (req, res, next) => {
  try {
    const {
      skillId,
      relationshipType,
      selfAssessedProficiency,
      targetProficiency,
      priority,
      goalDescription,
      targetDate,
      evidenceUrl,
      teachingExperienceNotes,
      maxWeeklyHours
    } = req.body;

    const skill = await Skill.findById(skillId);
    if (!skill) {
      return res.status(404).json({ success: false, message: 'Selected skill does not exist' });
    }

    // Check duplicate
    const existing = await UserSkill.findOne({
      user: req.user._id,
      skill: skillId,
      relationshipType
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: `You already have ${skill.name} in your ${relationshipType} skills.`
      });
    }

    const userSkill = await UserSkill.create({
      user: req.user._id,
      skill: skillId,
      relationshipType,
      selfAssessedProficiency,
      targetProficiency: relationshipType === 'learn' ? targetProficiency || 'advanced' : undefined,
      priority: relationshipType === 'learn' ? priority || 'medium' : undefined,
      goalDescription: goalDescription || '',
      targetDate: targetDate ? new Date(targetDate) : undefined,
      evidenceUrl: evidenceUrl || '',
      teachingExperienceNotes: teachingExperienceNotes || '',
      maxWeeklyHours: maxWeeklyHours || 2
    });

    const populated = await UserSkill.findById(userSkill._id).populate('skill');

    res.status(201).json({
      success: true,
      message: `${skill.name} added to your ${relationshipType} skills.`,
      userSkill: populated
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserSkill = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userSkill = await UserSkill.findOne({ _id: id, user: req.user._id });

    if (!userSkill) {
      return res.status(404).json({ success: false, message: 'Skill entry not found' });
    }

    const {
      selfAssessedProficiency,
      targetProficiency,
      priority,
      goalDescription,
      targetDate,
      evidenceUrl,
      teachingExperienceNotes,
      maxWeeklyHours
    } = req.body;

    if (selfAssessedProficiency) userSkill.selfAssessedProficiency = selfAssessedProficiency;
    if (targetProficiency) userSkill.targetProficiency = targetProficiency;
    if (priority) userSkill.priority = priority;
    if (goalDescription !== undefined) userSkill.goalDescription = goalDescription;
    if (targetDate !== undefined) userSkill.targetDate = targetDate ? new Date(targetDate) : null;
    if (evidenceUrl !== undefined) userSkill.evidenceUrl = evidenceUrl;
    if (teachingExperienceNotes !== undefined) userSkill.teachingExperienceNotes = teachingExperienceNotes;
    if (maxWeeklyHours !== undefined) userSkill.maxWeeklyHours = maxWeeklyHours;

    await userSkill.save();
    const populated = await UserSkill.findById(userSkill._id).populate('skill');

    res.status(200).json({
      success: true,
      message: 'Skill entry updated.',
      userSkill: populated
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUserSkill = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await UserSkill.findOneAndDelete({ _id: id, user: req.user._id });

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Skill entry not found or unauthorized' });
    }

    res.status(200).json({
      success: true,
      message: 'Skill entry removed.'
    });
  } catch (error) {
    next(error);
  }
};
