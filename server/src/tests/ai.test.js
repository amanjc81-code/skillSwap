import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import { connectDB, disconnectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Skill } from '../models/Skill.js';
import { generatePersonalizedLearningPath, generatePracticeExercise } from '../services/aiService.js';

describe('SkillMesh AI & Deterministic Fallback Tests', () => {
  let userCookie;
  let testSkill;

  beforeAll(async () => {
    process.env.USE_IN_MEMORY_DB = 'true';
    await connectDB();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  beforeEach(async () => {
    await Promise.all([User.deleteMany({}), Skill.deleteMany({})]);

    const res = await request(app).post('/api/v1/auth/register').send({
      name: 'Test Student',
      email: 'student@test.com',
      password: 'Password@123',
      confirmPassword: 'Password@123'
    });
    userCookie = res.headers['set-cookie'];

    testSkill = await Skill.create({
      name: 'SQL',
      normalizedName: 'sql',
      description: 'Relational Database Queries',
      category: 'Databases'
    });
  });

  it('generates a valid structured learning path using deterministic fallback', async () => {
    const result = await generatePersonalizedLearningPath({
      skill: testSkill,
      customGoal: 'Master database design',
      availableHoursPerWeek: 5
    });

    expect(result).toHaveProperty('title');
    expect(result).toHaveProperty('milestones');
    expect(result.milestones.length).toBeGreaterThan(1);
    expect(result.milestones[0]).toHaveProperty('title');
    expect(result.milestones[0]).toHaveProperty('concepts');
    expect(result.milestones[0]).toHaveProperty('suggestedTasks');
    expect(result.aiProvider).toBe('deterministic-engine');
  });

  it('generates a practice exercise with hidden reference solution by default', async () => {
    const res = await request(app)
      .post('/api/v1/learning/exercises/generate')
      .set('Cookie', userCookie)
      .send({
        skillId: testSkill._id.toString(),
        difficulty: 'intermediate'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.exercise).toHaveProperty('objective');
    expect(res.body.exercise).toHaveProperty('instructions');
    // Critical: Reference solution must not be leaked in generation response
    expect(res.body.exercise.referenceSolution).toBeUndefined();

    // Solution must only be available when explicitly requested
    const solRes = await request(app)
      .get(`/api/v1/learning/exercises/${res.body.exercise._id}/solution`)
      .set('Cookie', userCookie);

    expect(solRes.status).toBe(200);
    expect(solRes.body).toHaveProperty('referenceSolution');
  });

  it('ensures API key is never leaked in client responses', async () => {
    const healthRes = await request(app).get('/api/v1/health');
    const bodyStr = JSON.stringify(healthRes.body);
    expect(bodyStr).not.toContain('AI_API_KEY');
    expect(bodyStr).not.toContain('JWT_SECRET');
  });
});
