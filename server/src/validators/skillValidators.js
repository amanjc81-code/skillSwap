import { z } from 'zod';

export const createUserSkillSchema = z.object({
  skillId: z.string().min(1, 'Skill ID is required'),
  relationshipType: z.enum(['teach', 'learn'], {
    required_error: 'Relationship type must be either teach or learn'
  }),
  selfAssessedProficiency: z.enum(['beginner', 'intermediate', 'advanced'], {
    required_error: 'Proficiency must be beginner, intermediate, or advanced'
  }),
  targetProficiency: z.enum(['intermediate', 'advanced', 'expert']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  goalDescription: z.string().max(500).optional(),
  targetDate: z.string().optional(),
  evidenceUrl: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  teachingExperienceNotes: z.string().max(500).optional(),
  maxWeeklyHours: z.number().min(1).max(20).optional()
});

export const updateUserSkillSchema = z.object({
  selfAssessedProficiency: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  targetProficiency: z.enum(['intermediate', 'advanced', 'expert']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  goalDescription: z.string().max(500).optional(),
  targetDate: z.string().optional(),
  evidenceUrl: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  teachingExperienceNotes: z.string().max(500).optional(),
  maxWeeklyHours: z.number().min(1).max(20).optional()
});

export const createSkillAdminSchema = z.object({
  name: z.string().min(2, 'Skill name must be at least 2 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  category: z.enum([
    'Web Development',
    'Databases',
    'Programming Languages',
    'Artificial Intelligence',
    'UI/UX Design',
    'Software Engineering',
    'Cloud & DevOps',
    'Mobile Development'
  ]),
  prerequisites: z.array(z.string()).optional(),
  relatedSkills: z.array(z.string()).optional(),
  learningResources: z
    .array(
      z.object({
        title: z.string(),
        url: z.string().url(),
        type: z.enum(['documentation', 'tutorial', 'course', 'article']).default('documentation')
      })
    )
    .optional()
});
