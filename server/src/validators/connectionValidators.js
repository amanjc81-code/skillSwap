import { z } from 'zod';

export const createConnectionRequestSchema = z.object({
  recipientId: z.string().min(1, 'Recipient ID is required'),
  teachSkillId: z.string().optional(),
  learnSkillId: z.string().min(1, 'Learn Skill ID is required'),
  message: z.string().max(500).optional(),
  proposalType: z.enum(['reciprocal', 'one-way']).default('one-way')
});

export const respondConnectionRequestSchema = z.object({
  status: z.enum(['accepted', 'rejected'])
});
