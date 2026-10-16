import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { connectDB, disconnectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Skill } from '../models/Skill.js';
import { UserSkill } from '../models/UserSkill.js';
import { Availability } from '../models/Availability.js';
import { getRecommendationsForUser, findMultiPersonCycles } from '../services/matchingService.js';

describe('SkillMesh Reciprocal Matching Engine Tests', () => {
  let userA, userB, userC, userD;
  let flutterSkill, sqlSkill, pythonSkill, reactSkill;

  beforeAll(async () => {
    process.env.USE_IN_MEMORY_DB = 'true';
    await connectDB();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  beforeEach(async () => {
    await Promise.all([
      User.deleteMany({}),
      Skill.deleteMany({}),
      UserSkill.deleteMany({}),
      Availability.deleteMany({})
    ]);

    flutterSkill = await Skill.create({
      name: 'Flutter',
      normalizedName: 'flutter',
      description: 'Mobile framework',
      category: 'Mobile Development'
    });

    sqlSkill = await Skill.create({
      name: 'SQL',
      normalizedName: 'sql',
      description: 'Relational query language',
      category: 'Databases'
    });

    pythonSkill = await Skill.create({
      name: 'Python',
      normalizedName: 'python',
      description: 'Programming language',
      category: 'Programming Languages'
    });

    reactSkill = await Skill.create({
      name: 'React',
      normalizedName: 'react',
      description: 'Web UI library',
      category: 'Web Development'
    });

    // Create User A
    userA = await User.create({
      name: 'User A',
      email: 'usera@test.com',
      passwordHash: 'dummy',
      role: 'student',
      profilePreferences: { preferredLearningFormat: 'online', maxWeeklyTeachingHours: 4 }
    });

    // Create User B
    userB = await User.create({
      name: 'User B',
      email: 'userb@test.com',
      passwordHash: 'dummy',
      role: 'student',
      profilePreferences: { preferredLearningFormat: 'online', maxWeeklyTeachingHours: 4 }
    });
  });

  it('detects a direct reciprocal match with detailed explanation', async () => {
    // User A teaches Flutter, wants to learn SQL
    await UserSkill.create({
      user: userA._id,
      skill: flutterSkill._id,
      relationshipType: 'teach',
      selfAssessedProficiency: 'advanced'
    });
    await UserSkill.create({
      user: userA._id,
      skill: sqlSkill._id,
      relationshipType: 'learn',
      selfAssessedProficiency: 'beginner',
      targetProficiency: 'advanced'
    });

    // User B teaches SQL, wants to learn Flutter
    await UserSkill.create({
      user: userB._id,
      skill: sqlSkill._id,
      relationshipType: 'teach',
      selfAssessedProficiency: 'advanced'
    });
    await UserSkill.create({
      user: userB._id,
      skill: flutterSkill._id,
      relationshipType: 'learn',
      selfAssessedProficiency: 'beginner',
      targetProficiency: 'advanced'
    });

    // Matching slot
    await Availability.create({
      user: userA._id,
      slots: [{ dayOfWeek: 'tuesday', startTime: '17:00', endTime: '19:00' }]
    });
    await Availability.create({
      user: userB._id,
      slots: [{ dayOfWeek: 'tuesday', startTime: '17:00', endTime: '19:00' }]
    });

    const recommendations = await getRecommendationsForUser(userA._id);

    expect(recommendations.reciprocalMatches.length).toBe(1);
    const match = recommendations.reciprocalMatches[0];
    expect(match.candidate._id.toString()).toBe(userB._id.toString());
    expect(match.isReciprocal).toBe(true);
    expect(match.score).toBeGreaterThan(70);
    expect(match.explanations.some((e) => e.includes('Direct Reciprocal Match'))).toBe(true);
    expect(match.explanations.some((e) => e.includes('Tuesday'))).toBe(true);
  });

  it('excludes candidates with incompatible proficiency (beginner cannot mentor advanced)', async () => {
    // User A wants to learn SQL (is beginner, wants advanced)
    await UserSkill.create({
      user: userA._id,
      skill: sqlSkill._id,
      relationshipType: 'learn',
      selfAssessedProficiency: 'intermediate',
      targetProficiency: 'advanced'
    });

    // User B only has beginner proficiency in SQL
    await UserSkill.create({
      user: userB._id,
      skill: sqlSkill._id,
      relationshipType: 'teach',
      selfAssessedProficiency: 'beginner' // Incompatible!
    });

    const recommendations = await getRecommendationsForUser(userA._id);
    expect(recommendations.reciprocalMatches.length).toBe(0);
    expect(recommendations.oneWayMatches.length).toBe(0);
  });

  it('excludes blocked users from recommendations', async () => {
    await UserSkill.create({
      user: userA._id,
      skill: sqlSkill._id,
      relationshipType: 'learn',
      selfAssessedProficiency: 'beginner',
      targetProficiency: 'advanced'
    });
    await UserSkill.create({
      user: userB._id,
      skill: sqlSkill._id,
      relationshipType: 'teach',
      selfAssessedProficiency: 'advanced'
    });

    // User A blocks User B
    userA.blockedUsers = [userB._id];
    await userA.save();

    const recommendations = await getRecommendationsForUser(userA._id);
    expect(recommendations.oneWayMatches.length).toBe(0);
    expect(recommendations.reciprocalMatches.length).toBe(0);
  });

  it('discovers multi-person exchange cycles (A -> B -> C -> A)', async () => {
    userC = await User.create({
      name: 'User C',
      email: 'userc@test.com',
      passwordHash: 'dummy',
      role: 'student'
    });

    // User A teaches Flutter, wants Python
    await UserSkill.create({ user: userA._id, skill: flutterSkill._id, relationshipType: 'teach', selfAssessedProficiency: 'advanced' });
    await UserSkill.create({ user: userA._id, skill: pythonSkill._id, relationshipType: 'learn', selfAssessedProficiency: 'beginner', targetProficiency: 'advanced' });

    // User B teaches Python, wants React
    await UserSkill.create({ user: userB._id, skill: pythonSkill._id, relationshipType: 'teach', selfAssessedProficiency: 'advanced' });
    await UserSkill.create({ user: userB._id, skill: reactSkill._id, relationshipType: 'learn', selfAssessedProficiency: 'beginner', targetProficiency: 'advanced' });

    // User C teaches React, wants Flutter
    await UserSkill.create({ user: userC._id, skill: reactSkill._id, relationshipType: 'teach', selfAssessedProficiency: 'advanced' });
    await UserSkill.create({ user: userC._id, skill: flutterSkill._id, relationshipType: 'learn', selfAssessedProficiency: 'beginner', targetProficiency: 'advanced' });

    const cycles = await findMultiPersonCycles(userA._id, 3);
    expect(cycles.length).toBeGreaterThan(0);
    expect(cycles[0].length).toBe(3);
  });
});
