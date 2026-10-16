import { z } from 'zod';

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: z.string().email('Please enter a valid email address').toLowerCase(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Password confirmation is required'),
    department: z.string().optional().default('Computer Applications'),
    academicYear: z.enum(['FY', 'SY', 'TY', 'Final', 'N/A']).optional().default('TY'),
    preferredLearningFormat: z.enum(['online', 'in-person', 'hybrid', 'flexible']).optional().default('flexible')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address').toLowerCase(),
  password: z.string().min(1, 'Password is required')
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  department: z.string().max(100).optional(),
  academicYear: z.enum(['FY', 'SY', 'TY', 'Final', 'N/A']).optional(),
  bio: z.string().max(500).optional(),
  preferredLearningFormat: z.enum(['online', 'in-person', 'hybrid', 'flexible']).optional(),
  maxWeeklyTeachingHours: z.number().min(1).max(20).optional(),
  isAvailableForMatching: z.boolean().optional()
});

export const updateAvailabilitySchema = z.object({
  timezone: z.string().optional().default('Asia/Kolkata'),
  slots: z.array(
    z.object({
      dayOfWeek: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
      startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Start time must be in HH:mm format'),
      endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'End time must be in HH:mm format')
    })
  )
});

export const firebaseSyncSchema = z.object({
  firebaseUid: z.string().min(1, 'Firebase UID is required'),
  email: z.string().email('Valid email is required').toLowerCase(),
  name: z.string().min(1).max(100).optional(),
  department: z.string().optional(),
  academicYear: z.enum(['FY', 'SY', 'TY', 'Final', 'N/A']).optional(),
  preferredLearningFormat: z.enum(['online', 'in-person', 'hybrid', 'flexible']).optional(),
  avatarUrl: z.string().optional()
});

