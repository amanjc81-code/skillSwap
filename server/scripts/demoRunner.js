import request from 'supertest';
import app from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { logger } from '../src/utils/logger.js';
import { User } from '../src/models/User.js';
import { Skill } from '../src/models/Skill.js';
import { UserSkill } from '../src/models/UserSkill.js';
import { Availability } from '../src/models/Availability.js';
import { ConnectionRequest } from '../src/models/ConnectionRequest.js';
import { LearningConnection } from '../src/models/LearningConnection.js';
import { LearningSession } from '../src/models/LearningSession.js';
import { SessionFeedback } from '../src/models/SessionFeedback.js';

export const runEndToEndScenario = async () => {
  logger.info('================================================================');
  logger.info('  STARTING SKILLMESH REQUIRED END-TO-END DEMONSTRATION');
  logger.info('================================================================');

  await connectDB();

  // Wipe clean for clean end-to-end demonstration
  await Promise.all([
    User.deleteMany({}),
    Skill.deleteMany({}),
    UserSkill.deleteMany({}),
    Availability.deleteMany({}),
    ConnectionRequest.deleteMany({}),
    LearningConnection.deleteMany({}),
    LearningSession.deleteMany({}),
    SessionFeedback.deleteMany({})
  ]);

  // Seed coordinator and skills needed for demo
  const coordinatorRes = await request(app)
    .post('/api/v1/auth/register')
    .send({
      name: 'Prof. Anjali Mehta',
      email: 'coordinator.demo@mitacsc.ac.in',
      password: 'Coordinator@123',
      confirmPassword: 'Coordinator@123',
      department: 'Computer Applications',
      academicYear: 'N/A'
    });
  // Elevate coordinator role in DB directly
  await User.findByIdAndUpdate(coordinatorRes.body.user._id, { role: 'coordinator' });

  // Get coordinator cookie
  const coordinatorCookie = coordinatorRes.headers['set-cookie'];

  // Seed Flutter and SQL skills
  const flutterSkill = await Skill.create({
    name: 'Flutter',
    normalizedName: 'flutter',
    description: 'Cross-platform mobile UI framework with Dart.',
    category: 'Mobile Development',
    approved: true
  });

  const sqlSkill = await Skill.create({
    name: 'SQL',
    normalizedName: 'sql',
    description: 'Relational database query language and schema design.',
    category: 'Databases',
    approved: true
  });

  logger.info('[STEP 0] Seeded base skills (Flutter, SQL) and College Coordinator.');

  // STEP 1: Student A registers and adds Flutter (teach) & SQL (learn)
  logger.info('[STEP 1] Student A (Aarav) registering and configuring skills...');
  const resA = await request(app)
    .post('/api/v1/auth/register')
    .send({
      name: 'Aarav Sharma',
      email: 'aarav.demo@mitacsc.ac.in',
      password: 'Password@123',
      confirmPassword: 'Password@123',
      department: 'Computer Applications',
      academicYear: 'TY',
      preferredLearningFormat: 'online'
    });
  if (!resA.body.success) throw new Error('Student A registration failed: ' + resA.body.message);
  const cookieA = resA.headers['set-cookie'];
  const userAId = resA.body.user._id;

  // Student A adds Flutter as teaching skill
  const teachSkillARes = await request(app)
    .post('/api/v1/skills/user/my-skills')
    .set('Cookie', cookieA)
    .send({
      skillId: flutterSkill._id.toString(),
      relationshipType: 'teach',
      selfAssessedProficiency: 'advanced',
      evidenceUrl: 'https://github.com/aarav/flutter-demo',
      teachingExperienceNotes: 'Conducted 2 college mobile workshops.',
      maxWeeklyHours: 4
    });
  if (!teachSkillARes.body.success) throw new Error('Aarav add teach skill failed');

  // Student A adds SQL as learning goal
  const learnSkillARes = await request(app)
    .post('/api/v1/skills/user/my-skills')
    .set('Cookie', cookieA)
    .send({
      skillId: sqlSkill._id.toString(),
      relationshipType: 'learn',
      selfAssessedProficiency: 'beginner',
      targetProficiency: 'advanced',
      priority: 'high',
      goalDescription: 'Learn SQL joins and queries for semester field project.'
    });
  if (!learnSkillARes.body.success) throw new Error('Aarav add learn skill failed');
  logger.info('  -> Student A added Teach: Flutter (advanced), Learn: SQL (beginner -> advanced).');

  // STEP 2: Student B registers and adds SQL (teach) & Flutter (learn)
  logger.info('[STEP 2] Student B (Bhavya) registering and configuring skills...');
  const resB = await request(app)
    .post('/api/v1/auth/register')
    .send({
      name: 'Bhavya Patel',
      email: 'bhavya.demo@mitacsc.ac.in',
      password: 'Password@123',
      confirmPassword: 'Password@123',
      department: 'Computer Applications',
      academicYear: 'TY',
      preferredLearningFormat: 'online'
    });
  if (!resB.body.success) throw new Error('Student B registration failed');
  const cookieB = resB.headers['set-cookie'];
  const userBId = resB.body.user._id;

  // Student B adds SQL as teaching skill
  const teachSkillBRes = await request(app)
    .post('/api/v1/skills/user/my-skills')
    .set('Cookie', cookieB)
    .send({
      skillId: sqlSkill._id.toString(),
      relationshipType: 'teach',
      selfAssessedProficiency: 'advanced',
      evidenceUrl: 'https://github.com/bhavya/sql-lab-solutions',
      teachingExperienceNotes: 'DBMS lab assistant.',
      maxWeeklyHours: 4
    });
  if (!teachSkillBRes.body.success) throw new Error('Bhavya add teach skill failed');

  // Student B adds Flutter as learning goal
  const learnSkillBRes = await request(app)
    .post('/api/v1/skills/user/my-skills')
    .set('Cookie', cookieB)
    .send({
      skillId: flutterSkill._id.toString(),
      relationshipType: 'learn',
      selfAssessedProficiency: 'beginner',
      targetProficiency: 'advanced',
      priority: 'high',
      goalDescription: 'Learn mobile app design in Flutter.'
    });
  if (!learnSkillBRes.body.success) throw new Error('Bhavya add learn skill failed');
  logger.info('  -> Student B added Teach: SQL (advanced), Learn: Flutter (beginner -> advanced).');

  // STEP 3: Both students set compatible availability
  logger.info('[STEP 3] Setting compatible availability...');
  await request(app)
    .put('/api/v1/users/me/availability')
    .set('Cookie', cookieA)
    .send({
      timezone: 'Asia/Kolkata',
      slots: [
        { dayOfWeek: 'tuesday', startTime: '17:00', endTime: '19:00' },
        { dayOfWeek: 'thursday', startTime: '17:00', endTime: '19:00' }
      ]
    });

  await request(app)
    .put('/api/v1/users/me/availability')
    .set('Cookie', cookieB)
    .send({
      timezone: 'Asia/Kolkata',
      slots: [
        { dayOfWeek: 'tuesday', startTime: '17:00', endTime: '19:00' },
        { dayOfWeek: 'friday', startTime: '16:00', endTime: '18:00' }
      ]
    });
  logger.info('  -> Both set Tuesday 17:00-19:00 slot overlap.');

  // STEP 4 & 5: Matching engine detects reciprocal compatibility & Student A views recommendation
  logger.info('[STEP 4 & 5] Running Matching Engine for Student A...');
  const matchRes = await request(app).get('/api/v1/matches').set('Cookie', cookieA);
  if (!matchRes.body.success) throw new Error('Matching call failed');

  const reciprocalMatches = matchRes.body.reciprocalMatches;
  if (reciprocalMatches.length === 0) {
    throw new Error('Expected at least 1 reciprocal match between Aarav and Bhavya!');
  }
  const topMatch = reciprocalMatches[0];
  logger.info(`  -> Detected Reciprocal Match with: ${topMatch.candidate.name}`);
  logger.info(`  -> Compatibility Score: ${topMatch.score}/100`);
  logger.info(`  -> Stored Explanations:`);
  topMatch.explanations.forEach((exp) => logger.info(`     • ${exp}`));

  // STEP 6: Student A sends a connection request to Student B
  logger.info('[STEP 6] Student A sending connection request to Student B...');
  const reqRes = await request(app)
    .post('/api/v1/connections/requests')
    .set('Cookie', cookieA)
    .send({
      recipientId: userBId,
      teachSkillId: flutterSkill._id.toString(),
      learnSkillId: sqlSkill._id.toString(),
      message: 'Hi Bhavya! I can teach you Flutter mobile UI in exchange for learning SQL joins.',
      proposalType: 'reciprocal'
    });
  if (!reqRes.body.success) throw new Error('Connection request failed: ' + reqRes.body.message);
  const connectionRequestId = reqRes.body.request._id;
  logger.info(`  -> Connection request sent! Request ID: ${connectionRequestId}`);

  // STEP 7: Student B accepts the request
  logger.info('[STEP 7] Student B accepts the request...');
  const acceptRes = await request(app)
    .post(`/api/v1/connections/requests/${connectionRequestId}/respond`)
    .set('Cookie', cookieB)
    .send({ status: 'accepted' });
  if (!acceptRes.body.success) throw new Error('Accept request failed: ' + acceptRes.body.message);
  const activeConnectionId = acceptRes.body.connection._id;
  logger.info(`  -> Request accepted! Active partnership formed: ${activeConnectionId}`);

  // STEP 8: They schedule a learning session
  logger.info('[STEP 8] Scheduling peer session for Tuesday 17:00-18:30...');
  // Next Tuesday date
  const sessionStart = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
  sessionStart.setHours(17, 0, 0, 0);
  const sessionEnd = new Date(sessionStart.getTime() + 90 * 60 * 1000); // 18:30

  const createSessionRes = await request(app)
    .post('/api/v1/sessions')
    .set('Cookie', cookieA)
    .send({
      title: 'SQL Relational Joins Practical Workshop',
      objective: 'Master INNER and LEFT OUTER joins with hands-on practice problems.',
      participantId: userBId,
      skillId: sqlSkill._id.toString(),
      connectionId: activeConnectionId,
      startTime: sessionStart.toISOString(),
      endTime: sessionEnd.toISOString(),
      format: 'online',
      meetingLocationOrLink: 'https://meet.google.com/mit-acsc-demo'
    });
  if (!createSessionRes.body.success) throw new Error('Create session failed: ' + createSessionRes.body.message);
  const sessionId = createSessionRes.body.session._id;
  logger.info(`  -> Session successfully scheduled: "${createSessionRes.body.session.title}" (ID: ${sessionId})`);

  // STEP 9: Conflicting booking rejection test
  logger.info('[STEP 9] Attempting to book an overlapping conflicting session...');
  const conflictRes = await request(app)
    .post('/api/v1/sessions')
    .set('Cookie', cookieB)
    .send({
      title: 'Conflicting Booking Attempt',
      objective: 'This booking should be rejected by the system.',
      participantId: userAId,
      skillId: flutterSkill._id.toString(),
      connectionId: activeConnectionId,
      startTime: new Date(sessionStart.getTime() + 30 * 60 * 1000).toISOString(), // 30 min overlap!
      endTime: new Date(sessionEnd.getTime() + 30 * 60 * 1000).toISOString(),
      format: 'online'
    });

  if (conflictRes.status === 409) {
    logger.info(`  -> SUCCESS! Conflicting booking properly rejected with 409: "${conflictRes.body.message}"`);
  } else {
    throw new Error(`Expected status 409 for conflicting session, but received ${conflictRes.status}`);
  }

  // STEP 10: Complete the session and submit feedback
  logger.info('[STEP 10 & 11] Completing session and recording practical learning outcomes...');
  const completeRes = await request(app)
    .post(`/api/v1/sessions/${sessionId}/complete`)
    .set('Cookie', cookieA)
    .send({
      sessionNotes: 'Covered relational tables, foreign key constraints, and multi-table joins.',
      outcomes: 'Aarav constructed working SQL queries solving library database queries.',
      practicalDeliverableUrl: 'https://github.com/aarav/sql-learning-deliverable'
    });
  if (!completeRes.body.success) throw new Error('Complete session failed: ' + completeRes.body.message);
  logger.info('  -> Session marked completed with verified practical deliverable link.');

  // Student A submits feedback for Student B
  const feedbackRes = await request(app)
    .post(`/api/v1/sessions/${sessionId}/feedback`)
    .set('Cookie', cookieA)
    .send({
      rating: 5,
      clarityOfExplanation: 5,
      practicalHelpfulness: 5,
      comments: 'Outstanding peer mentor! Bhavya explained joins with clear visual diagrams.',
      tags: ['Clear Explanations', 'Punctual', 'Practical Coding']
    });
  if (!feedbackRes.body.success) throw new Error('Feedback submission failed: ' + feedbackRes.body.message);
  logger.info('  -> Student A submitted 5-star feedback for Student B.');

  // STEP 12: Application updates student progress records
  logger.info('[STEP 12] Verifying updated student progress records...');
  const progressRes = await request(app).get('/api/v1/learning/progress').set('Cookie', cookieA);
  if (!progressRes.body.success) throw new Error('Progress fetch failed');
  logger.info(`  -> Progress for Aarav:`);
  logger.info(`     Sessions Attended: ${progressRes.body.progress.sessionsAttended}`);
  logger.info(`     Skills Practiced: ${progressRes.body.progress.skillsPracticedCount}`);

  // STEP 13: Authorized coordinator sees completed session in aggregate analytics
  logger.info('[STEP 13] Coordinator inspecting College Aggregate Analytics...');
  const overviewRes = await request(app)
    .get('/api/v1/analytics/overview')
    .set('Cookie', coordinatorCookie);
  if (!overviewRes.body.success) throw new Error('Coordinator overview analytics failed: ' + overviewRes.body.message);

  const demandRes = await request(app)
    .get('/api/v1/analytics/skill-demand')
    .set('Cookie', coordinatorCookie);
  if (!demandRes.body.success) throw new Error('Coordinator demand analytics failed');

  logger.info(`  -> College Overview Stats:`);
  logger.info(`     Total Active Students: ${overviewRes.body.stats.totalStudents}`);
  logger.info(`     Completed Peer Sessions: ${overviewRes.body.stats.totalCompletedSessions}`);
  logger.info(`     Average College Rating: ${overviewRes.body.stats.averageRating} / 5.0`);
  logger.info(`  -> Top Skill Demands: ${demandRes.body.highDemandSkills.length} skills tracked.`);

  logger.info('================================================================');
  logger.info('  SKILLMESH END-TO-END DEMONSTRATION COMPLETED SUCCESSFULLY!');
  logger.info('================================================================');
};

if (process.argv[1]?.endsWith('demoRunner.js')) {
  runEndToEndScenario()
    .then(() => disconnectDB().then(() => process.exit(0)))
    .catch((err) => {
      logger.error('Demo scenario failed:', err);
      disconnectDB().then(() => process.exit(1));
    });
}
