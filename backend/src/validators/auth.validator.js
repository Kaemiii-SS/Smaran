import { z } from 'zod';

// Validation for registration
export const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  name: z.string().min(2, 'Name is required'),
  email: z.email({ error: 'Invalid email format' }),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['Patient', 'Caretaker'])
});

// Validation for login
export const loginSchema = z.object({
  email: z.email({ error: 'Invalid email format' }),
  password: z.string().min(1, 'Password is required')
});