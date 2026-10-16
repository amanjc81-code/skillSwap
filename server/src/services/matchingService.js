import { User } from '../models/User.js';
import { UserSkill } from '../models/UserSkill.js';
import { Availability } from '../models/Availability.js';
import { LearningConnection } from '../models/LearningConnection.js';
import { LearningSession } from '../models/LearningSession.js';

// Proficiency numerical mapping for compatibility comparisons
export const PROFICIENCY_LEVELS = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
  expert: 4
};

// Check if provider proficiency is sufficient for learner current and target level
export const isProficiencyCompatible = (providerProficiency, learnerCurrent, learnerTarget) => {
  const providerLvl = PROFICIENCY_LEVELS[providerProficiency] || 1;
  const learnerCurrentLvl = PROFICIENCY_LEVELS[learnerCurrent] || 1;
  const learnerTargetLvl = PROFICIENCY_LEVELS[learnerTarget] || learnerCurrentLvl + 1;

  // Provider must be at least as proficient as learner's current level + 1, or match learner target level
  return providerLvl > learnerCurrentLvl || (providerLvl >= learnerTargetLvl && providerLvl >= 2);
};

// Check format compatibility
export const isFormatCompatible = (formatA, formatB) => {
  if (formatA === 'flexible' || formatB === 'flexible') return true;
  if (formatA === formatB) return true;
  if (formatA === 'hybrid' || formatB === 'hybrid') return true;
  return false;
};

// Check slot overlap between two availabilities
export const calculateSlotOverlap = (slotsA = [], slotsB = []) => {
  const overlaps = [];

  for (const slotA of slotsA) {
    for (const slotB of slotsB) {
      if (slotA.dayOfWeek === slotB.dayOfWeek) {
        // Compare HH:mm
        const startA = slotA.startTime;
        const endA = slotA.endTime;
        const startB = slotB.startTime;
        const endB = slotB.endTime;

        const maxStart = startA > startB ? startA : startB;
        const minEnd = endA < endB ? endA : endB;

        if (maxStart < minEnd) {
          overlaps.push({
            dayOfWeek: slotA.dayOfWeek,
            overlapStart: maxStart,
            overlapEnd: minEnd
          });
        }
      }
    }
  }

  return overlaps;
};

// Main recommendation generator for a user
export const getRecommendationsForUser = async (userId, options = {}) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const userLearnSkills = await UserSkill.find({ user: userId, relationshipType: 'learn' }).populate('skill');
  const userTeachSkills = await UserSkill.find({ user: userId, relationshipType: 'teach' }).populate('skill');
  const userAvailability = await Availability.findOne({ user: userId });

  if (userLearnSkills.length === 0) {
    return {
      reciprocalMatches: [],
      oneWayMatches: [],
      cycles: [],
      message: 'Add skills you want to learn in My Skills to receive partner recommendations.'
    };
  }

  // Find users blocked by or who blocked the current user
  const blockedByUser = user.blockedUsers || [];
  const blockedCurrent = await User.find({ blockedUsers: userId }).select('_id');
  const allBlockedIds = new Set([
    userId.toString(),
    ...blockedByUser.map((id) => id.toString()),
    ...blockedCurrent.map((u) => u._id.toString())
  ]);

  // Find existing active connections
  const existingConnections = await LearningConnection.find({
    participants: userId,
    status: 'active'
  }).select('participants');

  const activeConnectedUserIds = new Set();
  existingConnections.forEach((conn) => {
    conn.participants.forEach((p) => {
      if (p.toString() !== userId.toString()) {
        activeConnectedUserIds.add(p.toString());
      }
    });
  });

  // Target skill IDs user wants to learn
  const learnSkillIds = userLearnSkills.map((ls) => ls.skill._id.toString());
  const teachSkillMap = new Map();
  userTeachSkills.forEach((ts) => {
    teachSkillMap.set(ts.skill._id.toString(), ts);
  });

  // Find all candidate teachers who can teach any of the skills the user wants to learn
  const candidateTeacherSkills = await UserSkill.find({
    skill: { $in: learnSkillIds },
    relationshipType: 'teach',
    user: { $nin: Array.from(allBlockedIds) }
  })
    .populate('user')
    .populate('skill');

  // Group candidate teachers by user ID
  const candidateMap = new Map();
  for (const cts of candidateTeacherSkills) {
    const candidateId = cts.user._id.toString();

    // Skip if active connected (unless requested to re-evaluate)
    if (activeConnectedUserIds.has(candidateId)) continue;
    if (cts.user.accountStatus === 'suspended') continue;
    if (cts.user.profilePreferences?.isAvailableForMatching === false) continue;

    if (!candidateMap.has(candidateId)) {
      candidateMap.set(candidateId, {
        candidateUser: cts.user,
        candidateTeachSkills: [],
        candidateLearnSkills: [],
        availability: null
      });
    }
    candidateMap.get(candidateId).candidateTeachSkills.push(cts);
  }

  // Populate candidate learn skills & availability
  const candidateIds = Array.from(candidateMap.keys());
  if (candidateIds.length === 0) {
    return {
      reciprocalMatches: [],
      oneWayMatches: [],
      cycles: []
    };
  }

  const [allCandidateLearnSkills, allCandidateAvailabilities] = await Promise.all([
    UserSkill.find({ user: { $in: candidateIds }, relationshipType: 'learn' }).populate('skill'),
    Availability.find({ user: { $in: candidateIds } })
  ]);

  allCandidateLearnSkills.forEach((cls) => {
    const cid = cls.user.toString();
    if (candidateMap.has(cid)) {
      candidateMap.get(cid).candidateLearnSkills.push(cls);
    }
  });

  allCandidateAvailabilities.forEach((cav) => {
    const cid = cav.user.toString();
    if (candidateMap.has(cid)) {
      candidateMap.get(cid).availability = cav;
    }
  });

  const reciprocalMatches = [];
  const oneWayMatches = [];

  // Evaluate each candidate
  for (const [candidateId, data] of candidateMap.entries()) {
    const candidateUser = data.candidateUser;
    const matchedTeachSkills = data.candidateTeachSkills; // Skills candidate teaches that user wants to learn
    const candidateLearnSkills = data.candidateLearnSkills;

    // Check candidate teaching capacity (scheduled upcoming sessions this week)
    const upcomingSessionsCount = await LearningSession.countDocuments({
      'participants.user': candidateId,
      'participants.role': 'mentor',
      status: { $in: ['scheduled', 'rescheduled'] },
      startTime: { $gte: new Date(), $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
    });

    const maxWeeklyHours = candidateUser.profilePreferences?.maxWeeklyTeachingHours || 4;
    const capacityRemaining = Math.max(0, maxWeeklyHours - upcomingSessionsCount * 1.5);
    if (capacityRemaining <= 0) {
      continue; // Skip if over capacity
    }

    // Evaluate matching skills
    for (const cts of matchedTeachSkills) {
      const userGoal = userLearnSkills.find((uls) => uls.skill._id.toString() === cts.skill._id.toString());
      if (!userGoal) continue;

      // Eligibility check
      const proficiencyValid = isProficiencyCompatible(
        cts.selfAssessedProficiency,
        userGoal.selfAssessedProficiency,
        userGoal.targetProficiency
      );
      if (!proficiencyValid) continue;

      // Check slot overlaps
      const userSlots = userAvailability?.slots || [];
      const candidateSlots = data.availability?.slots || [];
      const slotOverlaps = calculateSlotOverlap(userSlots, candidateSlots);

      // Check format compatibility
      const userFormat = user.profilePreferences?.preferredLearningFormat || 'flexible';
      const candidateFormat = candidateUser.profilePreferences?.preferredLearningFormat || 'flexible';
      const formatValid = isFormatCompatible(userFormat, candidateFormat);

      // Check reciprocal match: does candidate want to learn any skill current user can teach?
      const reciprocalSkills = [];
      for (const cls of candidateLearnSkills) {
        const uTeach = teachSkillMap.get(cls.skill._id.toString());
        if (uTeach) {
          const uProfValid = isProficiencyCompatible(
            uTeach.selfAssessedProficiency,
            cls.selfAssessedProficiency,
            cls.targetProficiency
          );
          if (uProfValid) {
            reciprocalSkills.push({
              userTeachesSkill: uTeach.skill,
              userProficiency: uTeach.selfAssessedProficiency,
              candidateWantsToLearn: cls.skill,
              candidateCurrentLevel: cls.selfAssessedProficiency,
              candidateTargetLevel: cls.targetProficiency
            });
          }
        }
      }

      const isReciprocal = reciprocalSkills.length > 0;

      // Scoring Model
      // 1. Skill Compatibility (40 pts)
      const providerLvl = PROFICIENCY_LEVELS[cts.selfAssessedProficiency] || 1;
      const learnerCurrentLvl = PROFICIENCY_LEVELS[userGoal.selfAssessedProficiency] || 1;
      const skillScore = Math.min(40, Math.round(20 + ((providerLvl - learnerCurrentLvl) / 2) * 20));

      // 2. Goal and Priority Compatibility (20 pts)
      let goalScore = 10;
      if (userGoal.priority === 'high') goalScore += 10;
      else if (userGoal.priority === 'medium') goalScore += 6;
      else goalScore += 3;

      // 3. Availability Compatibility (15 pts)
      let availScore = 0;
      if (slotOverlaps.length > 0) {
        availScore = Math.min(15, 8 + slotOverlaps.length * 3.5);
      } else if (userSlots.length === 0 || candidateSlots.length === 0) {
        // Insufficient schedule data: neutral partial score
        availScore = 6;
      }

      // 4. Learning Format Compatibility (10 pts)
      let formatScore = 0;
      if (userFormat === candidateFormat && userFormat !== 'flexible') {
        formatScore = 10;
      } else if (formatValid) {
        formatScore = 8;
      } else {
        formatScore = 2;
      }

      // 5. Reciprocal Exchange Value (10 pts)
      const reciprocalScore = isReciprocal ? 10 : 0;

      // 6. Practical Feasibility and Capacity (5 pts)
      const capacityScore = Math.min(5, Math.round((capacityRemaining / maxWeeklyHours) * 5));

      const totalScore = Math.round(
        skillScore + goalScore + availScore + formatScore + reciprocalScore + capacityScore
      );

      // Structured Explanations derived from actual data
      const explanations = [];
      explanations.push(
        `This student can teach ${cts.skill.name} (${cts.selfAssessedProficiency} level), which matches your learning goal.`
      );

      if (isReciprocal) {
        const swapSkillNames = reciprocalSkills.map((r) => r.userTeachesSkill.name).join(', ');
        explanations.push(
          `Direct Reciprocal Match: You can teach ${swapSkillNames}, which this student wants to learn!`
        );
      }

      if (formatValid) {
        explanations.push(
          `Preferred learning format aligns (${candidateFormat === 'flexible' ? 'Flexible' : candidateFormat.toUpperCase()}).`
        );
      }

      if (slotOverlaps.length > 0) {
        const firstOverlap = slotOverlaps[0];
        const dayCapitalized = firstOverlap.dayOfWeek.charAt(0).toUpperCase() + firstOverlap.dayOfWeek.slice(1);
        explanations.push(
          `Availability overlaps on ${dayCapitalized} (${firstOverlap.overlapStart} - ${firstOverlap.overlapEnd}).`
        );
      } else if (userSlots.length === 0) {
        explanations.push('Set your weekly availability in your profile to find overlapping time slots.');
      } else if (candidateSlots.length === 0) {
        explanations.push('Student has not set exact weekly slots yet, but remains open for scheduling.');
      }

      const matchItem = {
        candidate: {
          _id: candidateUser._id,
          name: candidateUser.name,
          department: candidateUser.department,
          academicYear: candidateUser.academicYear,
          avatarUrl: candidateUser.avatarUrl,
          bio: candidateUser.bio
        },
        skillToLearn: {
          _id: cts.skill._id,
          name: cts.skill.name,
          category: cts.skill.category
        },
        providerProficiency: cts.selfAssessedProficiency,
        evidenceUrl: cts.evidenceUrl,
        teachingExperienceNotes: cts.teachingExperienceNotes,
        score: totalScore,
        scoreBreakdown: {
          skillCompatibility: skillScore,
          goalPriority: goalScore,
          availability: availScore,
          format: formatScore,
          reciprocalBonus: reciprocalScore,
          capacity: capacityScore
        },
        isReciprocal,
        reciprocalSkills,
        slotOverlaps,
        explanations
      };

      if (isReciprocal) {
        reciprocalMatches.push(matchItem);
      } else {
        oneWayMatches.push(matchItem);
      }
    }
  }

  // Sort descending by score
  reciprocalMatches.sort((a, b) => b.score - a.score);
  oneWayMatches.sort((a, b) => b.score - a.score);

  // Search for multi-person cycles (e.g. 3-way cycles: User -> B -> C -> User)
  const cycles = await findMultiPersonCycles(userId);

  return {
    reciprocalMatches,
    oneWayMatches,
    cycles
  };
};

// Multi-person cycle search: A -> B -> C -> A
export const findMultiPersonCycles = async (currentUserId, maxDepth = 3) => {
  try {
    const currentIdStr = currentUserId.toString();

    // Fetch all active teach & learn relationships for active students
    const activeUserSkills = await UserSkill.find({})
      .populate('user', 'name department academicYear accountStatus')
      .populate('skill', 'name category');

    // Build directed exchange graph:
    // Directed edge from Teacher U1 to Learner U2 for skill S if U1 teaches S and U2 wants to learn S
    const teachMap = new Map(); // skillId -> [ { userId, user, proficiency } ]
    const learnMap = new Map(); // skillId -> [ { userId, user, proficiency } ]

    for (const us of activeUserSkills) {
      if (!us.user || us.user.accountStatus === 'suspended') continue;
      const sId = us.skill._id.toString();
      const uId = us.user._id.toString();

      if (us.relationshipType === 'teach') {
        if (!teachMap.has(sId)) teachMap.set(sId, []);
        teachMap.get(sId).push({
          userId: uId,
          user: us.user,
          skill: us.skill,
          proficiency: us.selfAssessedProficiency
        });
      } else if (us.relationshipType === 'learn') {
        if (!learnMap.has(sId)) learnMap.set(sId, []);
        learnMap.get(sId).push({
          userId: uId,
          user: us.user,
          skill: us.skill,
          proficiency: us.selfAssessedProficiency,
          targetProficiency: us.targetProficiency
        });
      }
    }

    // Adjacency list: u1 -> [ { toUserId, toUser, teachSkill, proficiencyValid } ]
    const adj = new Map();

    for (const [sId, teachers] of teachMap.entries()) {
      const learners = learnMap.get(sId) || [];
      for (const t of teachers) {
        for (const l of learners) {
          if (t.userId === l.userId) continue;

          const valid = isProficiencyCompatible(t.proficiency, l.proficiency, l.targetProficiency);
          if (!valid) continue;

          if (!adj.has(t.userId)) adj.set(t.userId, []);
          adj.get(t.userId).push({
            toUserId: l.userId,
            toUser: l.user,
            skill: t.skill,
            fromUser: t.user
          });
        }
      }
    }

    // Bounded DFS cycle detection starting from currentUserId
    const foundCycles = [];
    const visitedInPath = [];

    const dfs = (uId, path) => {
      if (path.length > maxDepth) return;

      const neighbors = adj.get(uId) || [];
      for (const edge of neighbors) {
        if (edge.toUserId === currentIdStr) {
          // Found cycle back to current user!
          if (path.length >= 2) {
            // Must have at least 3 participants for multi-person cycle (2-way is direct reciprocal)
            const cycleEdges = [...path, edge];
            foundCycles.push({
              length: cycleEdges.length,
              steps: cycleEdges.map((e, idx) => ({
                stepIndex: idx + 1,
                giver: { id: e.fromUser._id, name: e.fromUser.name },
                receiver: { id: e.toUser._id, name: e.toUser.name },
                skill: { id: e.skill._id, name: e.skill.name }
              }))
            });
          }
        } else if (!path.some((p) => p.toUserId === edge.toUserId)) {
          dfs(edge.toUserId, [...path, edge]);
        }
      }
    };

    dfs(currentIdStr, []);

    // Deduplicate and limit to top 5 cycles
    return foundCycles.slice(0, 5);
  } catch (err) {
    return [];
  }
};
