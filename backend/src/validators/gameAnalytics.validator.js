import { z } from 'zod';

export const saveScoreSchema = z.object({
  gameId: z.string().min(1, 'Game ID is required'),
  score: z.number({ required_error: 'Score is required' }),
  duration: z.number().optional(),
  details: z.record(z.any()).optional()
});
