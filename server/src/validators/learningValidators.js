import { z } from 'zod';

export const generateLearningPathSchema = z.object({
  skillId: z.string().min(1, 'Skill ID is required'),
  customGoal: z.string().max(500).optional(),
  availableHoursPerWeek: z.number().min(1).max(40).optional().default(5)
});

export const generateExerciseSchema = z.object({
  skillId: z.string().min(1, 'Skill ID is required'),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('intermediate')
});

export const submitAssessmentSchema = z.object({
  exerciseId: z.string().min(1, 'Exercise ID is required'),
  submittedNotes: z.string().min(5, 'Notes or code explanation required').max(3000),
  selfRating: z.number().int().min(1).max(5).default(4)
});
