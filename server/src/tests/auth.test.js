import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import { connectDB, disconnectDB } from '../config/db.js';
import { User } from '../models/User.js';

describe('SkillMesh Authentication & Security Tests', () => {
  beforeAll(async () => {
    process.env.USE_IN_MEMORY_DB = 'true';
    await connectDB();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('successfully registers a student with password confirmation', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Aarav Sharma',
        email: 'aarav@mitacsc.ac.in',
        password: 'Password@123',
        confirmPassword: 'Password@123',
        department: 'Computer Applications',
        academicYear: 'TY'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.user.email).toBe('aarav@mitacsc.ac.in');
    expect(res.body.user.role).toBe('student');
    expect(res.body.user.passwordHash).toBeUndefined();
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('rejects duplicate email registration', async () => {
    await request(app).post('/api/v1/auth/register').send({
      name: 'First User',
      email: 'duplicate@mitacsc.ac.in',
      password: 'Password@123',
      confirmPassword: 'Password@123'
    });

    const res = await request(app).post('/api/v1/auth/register').send({
      name: 'Second User',
      email: 'duplicate@mitacsc.ac.in',
      password: 'Password@123',
      confirmPassword: 'Password@123'
    });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('rejects login with incorrect password', async () => {
    await request(app).post('/api/v1/auth/register').send({
      name: 'Test Student',
      email: 'test@mitacsc.ac.in',
      password: 'CorrectPassword1',
      confirmPassword: 'CorrectPassword1'
    });

    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'test@mitacsc.ac.in',
      password: 'WrongPassword'
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('enforces protected route authentication', async () => {
    const res = await request(app).get('/api/v1/users/me');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('prevents unauthorized role escalation during registration', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      name: 'Sneaky User',
      email: 'sneaky@mitacsc.ac.in',
      password: 'Password@123',
      confirmPassword: 'Password@123',
      role: 'admin' // Attempted escalation
    });

    expect(res.status).toBe(201);
    // Role MUST remain student
    expect(res.body.user.role).toBe('student');
  });

  it('authenticates and creates user via /api/v1/auth/firebase-sync', async () => {
    const res = await request(app).post('/api/v1/auth/firebase-sync').send({
      firebaseUid: 'fb-user-uid-12345',
      email: 'firebase.student@mitacsc.ac.in',
      name: 'Firebase Student',
      department: 'Computer Applications',
      academicYear: 'TY'
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.email).toBe('firebase.student@mitacsc.ac.in');
    expect(res.body.user.role).toBe('student');
    expect(res.headers['set-cookie']).toBeDefined();

    // Verify user exists in database
    const savedUser = await User.findOne({ firebaseUid: 'fb-user-uid-12345' });
    expect(savedUser).toBeDefined();
    expect(savedUser.email).toBe('firebase.student@mitacsc.ac.in');
  });

  it('links existing user to firebaseUid on /api/v1/auth/firebase-sync', async () => {
    await request(app).post('/api/v1/auth/register').send({
      name: 'Existing Student',
      email: 'existing@mitacsc.ac.in',
      password: 'Password@123',
      confirmPassword: 'Password@123'
    });

    const res = await request(app).post('/api/v1/auth/firebase-sync').send({
      firebaseUid: 'fb-new-uid-999',
      email: 'existing@mitacsc.ac.in'
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const updated = await User.findOne({ email: 'existing@mitacsc.ac.in' });
    expect(updated.firebaseUid).toBe('fb-new-uid-999');
  });
});

