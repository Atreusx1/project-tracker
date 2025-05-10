import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const projectSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export const workSessionSchema = z.object({
  projectId: z.string(),
  description: z.string().optional(),
});
