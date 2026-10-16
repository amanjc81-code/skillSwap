import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import { connectDB, disconnectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Skill } from '../models/Skill.js';
import { LearningSession } from '../models/LearningSession.js';

describe('SkillMesh Sessions & Scheduling Tests', () => {
  let userACookie, userBCookie;
  let userAId, userBId;
  let testSkill;

  beforeAll(async () => {
    process.env.USE_IN_MEMORY_DB = 'true';
    await connectDB();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  beforeEach(async () => {
    await Promise.all([User.deleteMany({}), Skill.deleteMany({}), LearningSession.deleteMany({})]);

    const resA = await request(app).post('/api/v1/auth/register').send({
      name: 'User A',
      email: 'usera@test.com',
      password: 'Password@123',
      confirmPassword: 'Password@123'
    });
    userACookie = resA.headers['set-cookie'];
    userAId = resA.body.user._id;

    const resB = await request(app).post('/api/v1/auth/register').send({
      name: 'User B',
      email: 'userb@test.com',
      password: 'Password@123',
      confirmPassword: 'Password@123'
    });
    userBCookie = resB.headers['set-cookie'];
    userBId = resB.body.user._id;

    testSkill = await Skill.create({
      name: 'SQL',
      normalizedName: 'sql',
      description: 'Relational Database Queries',
      category: 'Databases'
    });
  });

  it('creates a valid scheduled session', async () => {
    const startTime = new Date(Date.now() + 86400000).toISOString();
    const endTime = new Date(Date.now() + 86400000 + 3600000).toISOString();

    const res = await request(app)
      .post('/api/v1/sessions')
      .set('Cookie', userACookie)
      .send({
        title: 'SQL Joins Session',
        objective: 'Learn INNER JOIN and LEFT JOIN',
        participantId: userBId,
        skillId: testSkill._id.toString(),
        startTime,
        endTime,
        format: 'online'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.session.status).toBe('scheduled');
  });

  it('rejects conflicting overlapping bookings with status 409', async () => {
    const baseTime = Date.now() + 86400000;
    const start1 = new Date(baseTime).toISOString();
    const end1 = new Date(baseTime + 3600000).toISOString();

    // First session
    await request(app).post('/api/v1/sessions').set('Cookie', userACookie).send({
      title: 'First Session',
      objective: 'Objective 1',
      participantId: userBId,
      skillId: testSkill._id.toString(),
      startTime: start1,
      endTime: end1
    });

    // Overlapping attempt (30 mins into the first session)
    const start2 = new Date(baseTime + 1800000).toISOString();
    const end2 = new Date(baseTime + 5400000).toISOString();

    const conflictRes = await request(app).post('/api/v1/sessions').set('Cookie', userBCookie).send({
      title: 'Conflicting Session',
      objective: 'Objective 2',
      participantId: userAId,
      skillId: testSkill._id.toString(),
      startTime: start2,
      endTime: end2
    });

    expect(conflictRes.status).toBe(409);
    expect(conflictRes.body.message).toContain('Booking conflict');
  });

  it('completes a session and submits feedback', async () => {
    const start = new Date(Date.now() - 7200000).toISOString();
    const end = new Date(Date.now() - 3600000).toISOString();

    const sessionRes = await request(app).post('/api/v1/sessions').set('Cookie', userACookie).send({
      title: 'Completed Workshop',
      objective: 'Mastering SQL queries',
      participantId: userBId,
      skillId: testSkill._id.toString(),
      startTime: start,
      endTime: end
    });

    const sessionId = sessionRes.body.session._id;

    // Complete session
    const completeRes = await request(app)
      .post(`/api/v1/sessions/${sessionId}/complete`)
      .set('Cookie', userACookie)
      .send({
        sessionNotes: 'Covered all required relational concepts.',
        outcomes: 'Constructed working SQL statements.',
        practicalDeliverableUrl: 'https://github.com/test/deliverable'
      });

    expect(completeRes.status).toBe(200);
    expect(completeRes.body.session.status).toBe('completed');

    // Submit feedback
    const feedbackRes = await request(app)
      .post(`/api/v1/sessions/${sessionId}/feedback`)
      .set('Cookie', userACookie)
      .send({
        rating: 5,
        clarityOfExplanation: 5,
        practicalHelpfulness: 5,
        comments: 'Excellent session!',
        tags: ['Punctual', 'Clear']
      });

    expect(feedbackRes.status).toBe(201);
    expect(feedbackRes.body.success).toBe(true);
  });
});
