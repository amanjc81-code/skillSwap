import { Skill } from '../models/Skill.js';
import { UserSkill } from '../models/UserSkill.js';

export const canonicalAliases = {
  js: 'JavaScript',
  javascript: 'JavaScript',
  ts: 'TypeScript',
  typescript: 'TypeScript',
  py: 'Python',
  python: 'Python',
  react: 'React',
  reactjs: 'React',
  'react.js': 'React',
  node: 'Node.js',
  nodejs: 'Node.js',
  'node.js': 'Node.js',
  express: 'Express.js',
  expressjs: 'Express.js',
  'express.js': 'Express.js',
  mongo: 'MongoDB',
  mongodb: 'MongoDB',
  sql: 'SQL',
  postgres: 'PostgreSQL',
  postgresql: 'PostgreSQL',
  flutter: 'Flutter',
  docker: 'Docker',
  git: 'Git & GitHub',
  github: 'Git & GitHub'
};

export const normalizeSkillName = (input) => {
  if (!input) return '';
  const trimmed = input.trim().toLowerCase();
  return canonicalAliases[trimmed] || input.trim();
};

export const hasPrerequisiteCycle = async (targetSkillId, proposedPrereqId) => {
  if (targetSkillId.toString() === proposedPrereqId.toString()) {
    return true;
  }

  // BFS / DFS starting from proposedPrereqId to see if targetSkillId is already an ancestor
  const visited = new Set();
  const queue = [proposedPrereqId.toString()];

  while (queue.length > 0) {
    const currentId = queue.shift();
    if (currentId === targetSkillId.toString()) {
      return true;
    }
    if (!visited.has(currentId)) {
      visited.add(currentId);
      const skill = await Skill.findById(currentId).select('prerequisites');
      if (skill && skill.prerequisites) {
        for (const prereq of skill.prerequisites) {
          queue.push(prereq.toString());
        }
      }
    }
  }

  return false;
};

export const getPrerequisitesForSkill = async (skillId, recursive = true) => {
  const skill = await Skill.findById(skillId).populate('prerequisites');
  if (!skill) return [];

  if (!recursive) {
    return skill.prerequisites || [];
  }

  const allPrereqs = new Map();
  const traverse = async (currentSkill) => {
    if (!currentSkill.prerequisites) return;
    for (const p of currentSkill.prerequisites) {
      const pid = p._id ? p._id.toString() : p.toString();
      if (!allPrereqs.has(pid)) {
        const fullSkill = p.name ? p : await Skill.findById(pid).populate('prerequisites');
        if (fullSkill) {
          allPrereqs.set(pid, fullSkill);
          await traverse(fullSkill);
        }
      }
    }
  };

  await traverse(skill);
  return Array.from(allPrereqs.values());
};

export const detectMissingPrerequisites = async (userId, targetSkillId) => {
  const allPrereqs = await getPrerequisitesForSkill(targetSkillId, true);
  if (allPrereqs.length === 0) {
    return [];
  }

  // Find user's known skills (teach relationships or advanced learn)
  const userKnownSkills = await UserSkill.find({
    user: userId,
    $or: [
      { relationshipType: 'teach' },
      { relationshipType: 'learn', selfAssessedProficiency: { $in: ['intermediate', 'advanced'] } }
    ]
  }).select('skill');

  const knownSkillIds = new Set(userKnownSkills.map((us) => us.skill.toString()));

  const missing = allPrereqs.filter((prereq) => !knownSkillIds.has(prereq._id.toString()));
  return missing;
};

export const getSkillGraphVisualData = async () => {
  const skills = await Skill.find({ approved: true })
    .populate('prerequisites', 'name category')
    .populate('relatedSkills', 'name category')
    .lean();

  const nodes = skills.map((s) => ({
    id: s._id.toString(),
    name: s.name,
    category: s.category,
    description: s.description,
    prerequisiteCount: s.prerequisites ? s.prerequisites.length : 0
  }));

  const edges = [];
  skills.forEach((s) => {
    if (s.prerequisites && s.prerequisites.length > 0) {
      s.prerequisites.forEach((p) => {
        edges.push({
          source: p._id.toString(),
          target: s._id.toString(),
          type: 'prerequisite',
          label: 'Prerequisite of'
        });
      });
    }
    if (s.relatedSkills && s.relatedSkills.length > 0) {
      s.relatedSkills.forEach((r) => {
        // Prevent duplicate undirected visual edge
        const source = s._id.toString();
        const target = r._id.toString();
        if (source < target) {
          edges.push({
            source,
            target,
            type: 'related',
            label: 'Related to'
          });
        }
      });
    }
  });

  return { nodes, edges };
};
