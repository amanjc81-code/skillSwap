import { z } from 'zod';

export const createSessionSchema = z
  .object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(150),
    objective: z.string().min(5, 'Objective must be at least 5 characters').max(500),
    participantId: z.string().min(1, 'Partner student ID is required'),
    skillId: z.string().min(1, 'Skill ID is required'),
    connectionId: z.string().optional(),
    startTime: z.string().datetime({ message: 'Valid ISO startTime is required' }),
    endTime: z.string().datetime({ message: 'Valid ISO endTime is required' }),
    format: z.enum(['online', 'in-person', 'hybrid']).default('online'),
    meetingLocationOrLink: z.string().max(300).optional()
  })
  .refine((data) => new Date(data.startTime) < new Date(data.endTime), {
    message: 'Start time must be before end time',
    path: ['endTime']
  });

export const completeSessionSchema = z.object({
  sessionNotes: z.string().min(5, 'Session notes must be provided').max(2000),
  outcomes: z.string().min(5, 'Key learning outcomes achieved must be provided').max(2000),
  practicalDeliverableUrl: z.string().url('Must be a valid URL (GitHub, CodePen, doc)').or(z.literal('')).optional()
});

export const sessionFeedbackSchema = z.object({
  rating: z.number().int().min(1).max(5, 'Rating must be between 1 and 5'),
  clarityOfExplanation: z.number().int().min(1).max(5).default(5),
  practicalHelpfulness: z.number().int().min(1).max(5).default(5),
  comments: z.string().max(1000).optional(),
  tags: z.array(z.string()).optional()
});
