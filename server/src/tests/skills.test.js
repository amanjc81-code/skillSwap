import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import { connectDB, disconnectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Skill } from '../models/Skill.js';
import { UserSkill } from '../models/UserSkill.js';

describe('SkillMesh Skills & Competency Tests', () => {
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
    await User.deleteMany({});
    await Skill.deleteMany({});
    await UserSkill.deleteMany({});

    // Register user
    const regRes = await request(app).post('/api/v1/auth/register').send({
      name: 'Rohan Sharma',
      email: 'rohan@mitacsc.ac.in',
      password: 'Password@123',
      confirmPassword: 'Password@123'
    });
    userCookie = regRes.headers['set-cookie'];

    // Create test skill
    testSkill = await Skill.create({
      name: 'React',
      normalizedName: 'react',
      description: 'Modern component-based UI library.',
      category: 'Web Development',
      approved: true
    });
  });

  it('allows adding a valid teaching skill', async () => {
    const res = await request(app)
      .post('/api/v1/skills/user/my-skills')
      .set('Cookie', userCookie)
      .send({
        skillId: testSkill._id.toString(),
        relationshipType: 'teach',
        selfAssessedProficiency: 'intermediate',
        maxWeeklyHours: 4
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.userSkill.selfAssessedProficiency).toBe('intermediate');
  });

  it('rejects invalid proficiency values', async () => {
    const res = await request(app)
      .post('/api/v1/skills/user/my-skills')
      .set('Cookie', userCookie)
      .send({
        skillId: testSkill._id.toString(),
        relationshipType: 'teach',
        selfAssessedProficiency: 'ninja_master' // Invalid
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('prevents adding the same skill twice in the same relationship category', async () => {
    await request(app).post('/api/v1/skills/user/my-skills').set('Cookie', userCookie).send({
      skillId: testSkill._id.toString(),
      relationshipType: 'teach',
      selfAssessedProficiency: 'intermediate'
    });

    const duplicateRes = await request(app)
      .post('/api/v1/skills/user/my-skills')
      .set('Cookie', userCookie)
      .send({
        skillId: testSkill._id.toString(),
        relationshipType: 'teach',
        selfAssessedProficiency: 'advanced'
      });

    expect(duplicateRes.status).toBe(409);
    expect(duplicateRes.body.success).toBe(false);
  });

  it('updates and deletes a user skill', async () => {
    const createRes = await request(app)
      .post('/api/v1/skills/user/my-skills')
      .set('Cookie', userCookie)
      .send({
        skillId: testSkill._id.toString(),
        relationshipType: 'learn',
        selfAssessedProficiency: 'beginner',
        targetProficiency: 'advanced',
        priority: 'high'
      });

    const userSkillId = createRes.body.userSkill._id;

    // Update
    const updateRes = await request(app)
      .patch(`/api/v1/skills/user/my-skills/${userSkillId}`)
      .set('Cookie', userCookie)
      .send({ priority: 'medium', selfAssessedProficiency: 'intermediate' });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.userSkill.priority).toBe('medium');
    expect(updateRes.body.userSkill.selfAssessedProficiency).toBe('intermediate');

    // Delete
    const deleteRes = await request(app)
      .delete(`/api/v1/skills/user/my-skills/${userSkillId}`)
      .set('Cookie', userCookie);

    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.success).toBe(true);
  });
});
