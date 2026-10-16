import mongoose from 'mongoose';
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
import { ConnectionRequest } from '../src/models/ConnectionRequest.js';
import { Notification } from '../src/models/Notification.js';
import { ContentReport } from '../src/models/ContentReport.js';

export const clearDatabase = async () => {
  try {
    logger.info('--- Connecting to SkillMesh MongoDB to wipe all data ---');
    await connectDB();

    const collections = [
      User,
      Skill,
      UserSkill,
      Availability,
      LearningConnection,
      LearningSession,
      SessionFeedback,
      LearningPath,
      PracticeExercise,
      AssessmentAttempt,
      ConnectionRequest,
      Notification,
      ContentReport
    ];

    await Promise.all(collections.map(model => model.deleteMany({})));

    logger.info('SUCCESS: All database collections have been cleared! Fresh clean slate initialized.');
    await disconnectDB();
    return { success: true, message: 'All collections cleared' };
  } catch (error) {
    logger.error('Error clearing database:', error);
    throw error;
  }
};

if (process.argv[1]?.includes('clearDatabase.js')) {
  clearDatabase()
    .then(() => {
      console.log('Database wiped clean. Starting fresh!');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Could not connect or clear database:', err.message);
      process.exit(1);
    });
}
