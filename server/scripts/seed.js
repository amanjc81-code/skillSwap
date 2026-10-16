import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { logger } from '../src/utils/logger.js';
import { User } from '../src/models/User.js';
import { Skill } from '../src/models/Skill.js';
import { UserSkill } from '../src/models/UserSkill.js';
import { Availability } from '../src/models/Availability.js';
import { LearningConnection } from '../src/models/LearningConnection.js';
import { LearningSession } from '../src/models/LearningSession.js';
import { SessionFeedback } from '../src/models/SessionFeedback.js';
import { LearningPath } from '../src/models/LearningPath.js';
import { PracticeExercise } from '../src/models/PracticeExercise.js';
import { AssessmentAttempt } from '../src/models/AssessmentAttempt.js';

export const runSeed = async () => {
  logger.info('--- Commencing SkillMesh Database Seeding ---');
  await connectDB();

  // Clear existing collections safely
  await Promise.all([
    User.deleteMany({}),
    Skill.deleteMany({}),
    UserSkill.deleteMany({}),
    Availability.deleteMany({}),
    LearningConnection.deleteMany({}),
    LearningSession.deleteMany({}),
    SessionFeedback.deleteMany({}),
    LearningPath.deleteMany({}),
    PracticeExercise.deleteMany({}),
    AssessmentAttempt.deleteMany({})
  ]);
  logger.info('Cleared existing collections.');

  // 1. Create Core Skills Taxonomy with Prerequisites
  // Level 1 foundational skills
  const jsSkill = await Skill.create({
    name: 'JavaScript Fundamentals',
    normalizedName: 'javascript fundamentals',
    description: 'Core ECMAScript syntax, DOM manipulation, asynchronous programming, promises, and closures.',
    category: 'Programming Languages',
    approved: true
  });

  const dbFundSkill = await Skill.create({
    name: 'Database Fundamentals',
    normalizedName: 'database fundamentals',
    description: 'Relational data modeling, ACID transactions, primary/foreign keys, and normalization.',
    category: 'Databases',
    approved: true
  });

  const pythonSkill = await Skill.create({
    name: 'Python Programming',
    normalizedName: 'python programming',
    description: 'Python syntax, data structures, OOP paradigms, modules, and standard library tools.',
    category: 'Programming Languages',
    approved: true
  });

  const uiDesignSkill = await Skill.create({
    name: 'UI/UX Design & Wireframing',
    normalizedName: 'ui/ux design & wireframing',
    description: 'User-centered design principles, information architecture, wireframing, and Figma prototyping.',
    category: 'UI/UX Design',
    approved: true
  });

  // Level 2 intermediate skills
  const sqlSkill = await Skill.create({
    name: 'SQL',
    normalizedName: 'sql',
    description: 'Relational query language: complex joins, window functions, aggregations, indexing, and query tuning.',
    category: 'Databases',
    prerequisites: [dbFundSkill._id],
    approved: true
  });

  const nodeSkill = await Skill.create({
    name: 'Node.js',
    normalizedName: 'node.js',
    description: 'Server-side JavaScript runtime, event loop, streams, buffers, and npm ecosystem.',
    category: 'Web Development',
    prerequisites: [jsSkill._id],
    approved: true
  });

  const reactSkill = await Skill.create({
    name: 'React',
    normalizedName: 'react',
    description: 'Component architecture, Virtual DOM, hooks, state management, and SPA client routing.',
    category: 'Web Development',
    prerequisites: [jsSkill._id],
    approved: true
  });

  const flutterSkill = await Skill.create({
    name: 'Flutter',
    normalizedName: 'flutter',
    description: 'Cross-platform mobile UI toolkit, reactive widgets, state management, and mobile APIs.',
    category: 'Mobile Development',
    approved: true
  });

  // Level 3 advanced skills
  const expressSkill = await Skill.create({
    name: 'Express.js & REST APIs',
    normalizedName: 'express.js & rest apis',
    description: 'RESTful API architecture, middleware pipelines, authentication cookies, error handling, and security headers.',
    category: 'Web Development',
    prerequisites: [nodeSkill._id],
    relatedSkills: [reactSkill._id, sqlSkill._id],
    approved: true
  });

  const mlSkill = await Skill.create({
    name: 'Machine Learning Foundations',
    normalizedName: 'machine learning foundations',
    description: 'Supervised and unsupervised algorithms, NumPy, Pandas, Scikit-learn, and model evaluation metrics.',
    category: 'Artificial Intelligence',
    prerequisites: [pythonSkill._id],
    approved: true
  });

  logger.info('Created Skills Taxonomy and Directed Prerequisite Graph.');

  // 2. Hash Password for Demo Accounts
  const demoSalt = await bcrypt.genSalt(10);
  const studentPasswordHash = await bcrypt.hash('Student@123', demoSalt);
  const coordinatorPasswordHash = await bcrypt.hash('Coordinator@123', demoSalt);
  const adminPasswordHash = await bcrypt.hash('Admin@123', demoSalt);

  // 3. Create Users
  // Student A: Aarav Sharma (Teaches Flutter, Wants to learn SQL)
  const studentA = await User.create({
    name: 'Aarav Sharma',
    email: 'aarav.sharma@mitacsc.ac.in',
    passwordHash: studentPasswordHash,
    role: 'student',
    department: 'Computer Applications',
    academicYear: 'TY',
    bio: 'TYBCA student passionate about mobile app development in Flutter. Looking to master database queries and relational optimization.',
    profilePreferences: {
      preferredLearningFormat: 'online',
      maxWeeklyTeachingHours: 4,
      isAvailableForMatching: true
    }
  });

  // Student B: Bhavya Patel (Teaches SQL, Wants to learn Flutter) -> DIRECT RECIPROCAL MATCH with Student A!
  const studentB = await User.create({
    name: 'Bhavya Patel',
    email: 'bhavya.patel@mitacsc.ac.in',
    passwordHash: studentPasswordHash,
    role: 'student',
    department: 'Computer Applications',
    academicYear: 'TY',
    bio: 'Database enthusiast with strong relational design and SQL skills. Building a cross-platform mobile project and eager to learn Flutter.',
    profilePreferences: {
      preferredLearningFormat: 'online',
      maxWeeklyTeachingHours: 4,
      isAvailableForMatching: true
    }
  });

  // Student C: Chirag Joshi (Teaches UI/UX Design, Wants to learn Python)
  const studentC = await User.create({
    name: 'Chirag Joshi',
    email: 'chirag.joshi@mitacsc.ac.in',
    passwordHash: studentPasswordHash,
    role: 'student',
    department: 'Computer Science',
    academicYear: 'SY',
    bio: 'Figma designer and creative coder. Wanting to learn Python for backend scripting and data manipulation.',
    profilePreferences: {
      preferredLearningFormat: 'flexible',
      maxWeeklyTeachingHours: 3,
      isAvailableForMatching: true
    }
  });

  // Student D: Divya Deshmukh (Teaches Python, Wants to learn React)
  const studentD = await User.create({
    name: 'Divya Deshmukh',
    email: 'divya.deshmukh@mitacsc.ac.in',
    passwordHash: studentPasswordHash,
    role: 'student',
    department: 'Computer Applications',
    academicYear: 'TY',
    bio: 'Python and data structures programmer. Looking to learn React component design for my TYBCA semester field project.',
    profilePreferences: {
      preferredLearningFormat: 'flexible',
      maxWeeklyTeachingHours: 4,
      isAvailableForMatching: true
    }
  });

  // Student E: Eshan Kulkarni (Teaches React, Wants to learn UI/UX Design)
  // Forms 3-way cycle: C (UI/UX) -> E (React) -> D (Python) -> C (UI/UX)!
  const studentE = await User.create({
    name: 'Eshan Kulkarni',
    email: 'eshan.kulkarni@mitacsc.ac.in',
    passwordHash: studentPasswordHash,
    role: 'student',
    department: 'Computer Science',
    academicYear: 'TY',
    bio: 'Frontend engineer proficient in React. Wanting to improve visual aesthetics and design systems with UI/UX guidance.',
    profilePreferences: {
      preferredLearningFormat: 'flexible',
      maxWeeklyTeachingHours: 3,
      isAvailableForMatching: true
    }
  });

  // Coordinator
  const coordinator = await User.create({
    name: 'Prof. Anjali Mehta',
    email: 'coordinator@mitacsc.ac.in',
    passwordHash: coordinatorPasswordHash,
    role: 'coordinator',
    department: 'Faculty of Computer Applications',
    academicYear: 'N/A',
    bio: 'TYBCA Semester Project Coordinator at MIT ACSC. Monitoring peer learning engagement and capacity distribution.',
    profilePreferences: {
      isAvailableForMatching: false
    }
  });

  // Admin
  const admin = await User.create({
    name: 'SkillMesh Administrator',
    email: 'admin@mitacsc.ac.in',
    passwordHash: adminPasswordHash,
    role: 'admin',
    department: 'Information Technology Services',
    academicYear: 'N/A',
    bio: 'Platform systems administrator for SkillMesh MIT ACSC deployment.',
    profilePreferences: {
      isAvailableForMatching: false
    }
  });

  logger.info('Created Demo Users (Students A, B, C, D, E, Coordinator, Admin).');

  // 4. Assign Skills (Teach & Learn)
  // Student A: Teaches Flutter (Advanced), Learns SQL (Beginner -> Advanced)
  await UserSkill.create({
    user: studentA._id,
    skill: flutterSkill._id,
    relationshipType: 'teach',
    selfAssessedProficiency: 'advanced',
    evidenceUrl: 'https://github.com/aarav-dev/flutter-portfolio',
    teachingExperienceNotes: 'Built 3 production apps and conducted mobile workshops for juniors.',
    maxWeeklyHours: 4
  });

  await UserSkill.create({
    user: studentA._id,
    skill: sqlSkill._id,
    relationshipType: 'learn',
    selfAssessedProficiency: 'beginner',
    targetProficiency: 'advanced',
    priority: 'high',
    goalDescription: 'Master relational queries and schema normalization for TYBCA field project.'
  });

  // Student B: Teaches SQL (Advanced), Learns Flutter (Beginner -> Advanced)
  await UserSkill.create({
    user: studentB._id,
    skill: sqlSkill._id,
    relationshipType: 'teach',
    selfAssessedProficiency: 'advanced',
    evidenceUrl: 'https://github.com/bhavya-patel/database-labs',
    teachingExperienceNotes: 'Lab assistant for DBMS practicals with deep SQL knowledge.',
    maxWeeklyHours: 4
  });

  await UserSkill.create({
    user: studentB._id,
    skill: flutterSkill._id,
    relationshipType: 'learn',
    selfAssessedProficiency: 'beginner',
    targetProficiency: 'advanced',
    priority: 'high',
    goalDescription: 'Learn Flutter UI widgets and mobile state management from a peer mentor.'
  });

  // Student C: Teaches UI/UX, Learns Python
  await UserSkill.create({
    user: studentC._id,
    skill: uiDesignSkill._id,
    relationshipType: 'teach',
    selfAssessedProficiency: 'advanced',
    evidenceUrl: 'https://figma.com/@chiragdesign',
    maxWeeklyHours: 3
  });
  await UserSkill.create({
    user: studentC._id,
    skill: pythonSkill._id,
    relationshipType: 'learn',
    selfAssessedProficiency: 'beginner',
    targetProficiency: 'intermediate',
    priority: 'medium'
  });

  // Student D: Teaches Python, Learns React
  await UserSkill.create({
    user: studentD._id,
    skill: pythonSkill._id,
    relationshipType: 'teach',
    selfAssessedProficiency: 'advanced',
    evidenceUrl: 'https://github.com/divyadeshmukh/python-algorithms',
    maxWeeklyHours: 4
  });
  await UserSkill.create({
    user: studentD._id,
    skill: reactSkill._id,
    relationshipType: 'learn',
    selfAssessedProficiency: 'beginner',
    targetProficiency: 'advanced',
    priority: 'high'
  });

  // Student E: Teaches React, Learns UI/UX
  await UserSkill.create({
    user: studentE._id,
    skill: reactSkill._id,
    relationshipType: 'teach',
    selfAssessedProficiency: 'advanced',
    evidenceUrl: 'https://github.com/eshankulkarni/react-ui-components',
    maxWeeklyHours: 3
  });
  await UserSkill.create({
    user: studentE._id,
    skill: uiDesignSkill._id,
    relationshipType: 'learn',
    selfAssessedProficiency: 'beginner',
    targetProficiency: 'intermediate',
    priority: 'medium'
  });

  logger.info('Configured User Skills (Direct Reciprocal Pair: A & B; 3-Way Cycle: C, E, D).');

  // 5. Seed Weekly Availability Patterns
  // Student A: Tuesday 17:00-19:00, Thursday 17:00-19:00
  await Availability.create({
    user: studentA._id,
    timezone: 'Asia/Kolkata',
    slots: [
      { dayOfWeek: 'tuesday', startTime: '17:00', endTime: '19:00' },
      { dayOfWeek: 'thursday', startTime: '17:00', endTime: '19:00' }
    ]
  });

  // Student B: Tuesday 17:00-19:00 (OVERLAP WITH A!), Friday 16:00-18:00
  await Availability.create({
    user: studentB._id,
    timezone: 'Asia/Kolkata',
    slots: [
      { dayOfWeek: 'tuesday', startTime: '17:00', endTime: '19:00' },
      { dayOfWeek: 'friday', startTime: '16:00', endTime: '18:00' }
    ]
  });

  // Student C, D, E Availabilities
  await Availability.create({
    user: studentC._id,
    timezone: 'Asia/Kolkata',
    slots: [{ dayOfWeek: 'wednesday', startTime: '16:00', endTime: '18:00' }]
  });
  await Availability.create({
    user: studentD._id,
    timezone: 'Asia/Kolkata',
    slots: [{ dayOfWeek: 'wednesday', startTime: '16:00', endTime: '18:00' }]
  });
  await Availability.create({
    user: studentE._id,
    timezone: 'Asia/Kolkata',
    slots: [{ dayOfWeek: 'wednesday', startTime: '16:00', endTime: '18:00' }]
  });

  logger.info('Created Weekly Availabilities.');

  // 6. Seed an Active Connection and Past Completed Session for Real Progress Analytics
  const activeConnection = await LearningConnection.create({
    participants: [studentA._id, studentB._id],
    connectionType: 'reciprocal',
    primarySkillExchange: [
      { teacher: studentB._id, learner: studentA._id, skill: sqlSkill._id },
      { teacher: studentA._id, learner: studentB._id, skill: flutterSkill._id }
    ],
    status: 'active',
    sharedGoals: [
      'Master multi-table SQL queries with joins',
      'Build a working Flutter stateful widget with clean layout'
    ],
    sharedResources: [
      {
        title: 'PostgreSQL Joins Visual Explanation Guide',
        url: 'https://postgresqltutorial.com/postgresql-joins/',
        addedBy: studentB._id,
        addedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    ]
  });

  // Past Completed Session
  const completedSession = await LearningSession.create({
    title: 'Relational Schema Design & Table Normalization',
    objective: 'Learn 1NF, 2NF, and 3NF normalization rules and apply them to a peer-learning database schema.',
    participants: [
      { user: studentB._id, role: 'mentor' },
      { user: studentA._id, role: 'learner' }
    ],
    connection: activeConnection._id,
    skill: sqlSkill._id,
    startTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000),
    format: 'online',
    meetingLocationOrLink: 'https://meet.google.com/xyz-peer-learn',
    status: 'completed',
    sessionNotes:
      'Covered primary and foreign key definitions, composite keys, and avoided update anomalies by decomposing tables.',
    outcomes:
      'Aarav successfully designed an ER diagram for the SkillMesh database and wrote SQL DDL statements.',
    practicalDeliverableUrl: 'https://github.com/aarav-dev/skillmesh-schema-demo',
    completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000)
  });

  // Session Feedback
  await SessionFeedback.create({
    session: completedSession._id,
    reviewer: studentA._id,
    reviewee: studentB._id,
    rating: 5,
    clarityOfExplanation: 5,
    practicalHelpfulness: 5,
    comments:
      'Bhavya explained 3NF normalization with real college examples. Extremely helpful and clear explanation!',
    tags: ['Patient Mentor', 'Clear Explanations', 'Hands-on Practice']
  });

  // 7. Seed Learning Path & Practice Exercise
  const sqlPath = await LearningPath.create({
    user: studentA._id,
    goalSkill: sqlSkill._id,
    title: 'Relational Database & SQL Mastery Path',
    description: 'A step-by-step peer-learning journey from relational design to advanced analytical SQL queries.',
    estimatedHours: 12,
    milestones: [
      {
        order: 1,
        title: 'Relational Foundations & Schema Design',
        concepts: ['Tables & Columns', 'Primary & Foreign Keys', 'Data Types & Constraints'],
        suggestedTasks: ['Design an ER diagram for a peer-learning portal.', 'Write DDL CREATE TABLE statements.'],
        recommendedDurationHours: 3,
        isCompleted: true
      },
      {
        order: 2,
        title: 'Multi-Table Joins & Filtering Logic',
        concepts: ['INNER JOIN', 'LEFT & RIGHT OUTER JOIN', 'WHERE, GROUP BY & HAVING'],
        suggestedTasks: ['Join student records with their enrolled learning sessions.'],
        recommendedDurationHours: 4,
        isCompleted: false
      }
    ],
    isAIGenerated: false,
    aiProvider: 'deterministic-engine',
    isVerified: true
  });

  const sqlExercise = await PracticeExercise.create({
    skill: sqlSkill._id,
    title: 'College Skill Exchange Query Challenge',
    difficulty: 'intermediate',
    objective: 'Write SQL queries to join students, requested skills, and scheduled peer sessions.',
    instructions:
      'Given tables `students(id, name, department)`, `skills(id, name)`, and `sessions(id, mentor_id, learner_id, skill_id, status)`:\n1. Find all students who have mentored at least 2 completed sessions.\n2. List all skills requested by learners that currently have zero registered mentors.',
    expectedOutput:
      'A SQL script containing two queries: (1) using GROUP BY and HAVING COUNT(s.id) >= 2; (2) using LEFT JOIN with WHERE mentor.id IS NULL.',
    assessmentRubric: [
      'Correct join syntax without Cartesian product',
      'Proper use of GROUP BY and HAVING filters',
      'Clean alias naming and formatting'
    ],
    hints: [
      'Check sessions status = "completed" in your WHERE clause or JOIN predicate.',
      'Use LEFT JOIN from skills to mentor_skills and check for NULL.'
    ],
    referenceSolution:
      '-- Query 1:\nSELECT st.name, COUNT(se.id) as sessions_mentored FROM students st JOIN sessions se ON st.id = se.mentor_id WHERE se.status = "completed" GROUP BY st.id, st.name HAVING COUNT(se.id) >= 2;\n\n-- Query 2:\nSELECT sk.name FROM skills sk LEFT JOIN user_skills us ON sk.id = us.skill_id AND us.relationship_type = "teach" WHERE us.id IS NULL;',
    deterministicTests: [
      { testInput: 'GROUP BY st.id', expectedOutput: 'Aggregates by student identifier' },
      { testInput: 'HAVING COUNT(se.id) >= 2', expectedOutput: 'Filters by minimum 2 completed sessions' }
    ]
  });

  await AssessmentAttempt.create({
    user: studentA._id,
    exercise: sqlExercise._id,
    submittedNotes:
      'Completed both queries. Used INNER JOIN for query 1 and LEFT JOIN with IS NULL filter for query 2.',
    selfRating: 5,
    status: 'completed',
    completedAt: new Date()
  });

  logger.info('--- Seed Completed Successfully! ---');
  logger.info('Demo Credentials for MIT ACSC Field Project:');
  logger.info('Student A: aarav.sharma@mitacsc.ac.in | Student@123 (Teaches Flutter, Learns SQL)');
  logger.info('Student B: bhavya.patel@mitacsc.ac.in | Student@123 (Teaches SQL, Learns Flutter)');
  logger.info('Student C: chirag.joshi@mitacsc.ac.in | Student@123 (Teaches UI/UX, Learns Python)');
  logger.info('Student D: divya.deshmukh@mitacsc.ac.in | Student@123 (Teaches Python, Learns React)');
  logger.info('Student E: eshan.kulkarni@mitacsc.ac.in | Student@123 (Teaches React, Learns UI/UX)');
  logger.info('Coordinator: coordinator@mitacsc.ac.in | Coordinator@123');
  logger.info('Admin: admin@mitacsc.ac.in | Admin@123');
};

// If run directly via command line
if (process.argv[1]?.endsWith('seed.js')) {
  runSeed()
    .then(() => disconnectDB().then(() => process.exit(0)))
    .catch((err) => {
      logger.error('Seed failed:', err);
      disconnectDB().then(() => process.exit(1));
    });
}
