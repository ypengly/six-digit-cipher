import { z } from 'zod';

export const codeSchema = z.string().regex(/^\d{6}$/, 'Code must be exactly six digits');

export const submitSchema = z.object({
  levelNumber: z.number().int().min(1).max(100).optional(),
  daily: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  code: codeSchema,
  elapsedSec: z.number().int().min(0).max(86400).default(0),
  hintsUsed: z.number().int().min(0).max(3).default(0), // guests only; ignored for signed-in players
  attempts: z.number().int().min(0).max(10000).default(0), // guests only
}).refine((v) => (v.levelNumber !== undefined) !== (v.daily !== undefined), { message: 'Provide levelNumber or daily' });

export const hintSchema = z.object({ levelNumber: z.number().int().min(1).max(100), index: z.number().int().min(0).max(2) });

export const registerSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(160),
  displayName: z.string().trim().min(2).max(30),
  password: z.string().min(10, 'Use at least 10 characters').max(128),
});
export const loginSchema = z.object({ email: z.string().trim().toLowerCase().email(), password: z.string().min(1).max(128) });

const clue = z.object({ id: z.string().min(1), text: z.string().min(3).max(600), kind: z.enum(['clue', 'decoy']) });
export const levelInputSchema = z.object({
  id: z.string().min(1).max(40).optional(),
  number: z.number().int().min(1).max(500),
  chapter: z.number().int().min(1).max(20),
  chapterTitle: z.string().min(2).max(60),
  title: z.string().min(2).max(80),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert', 'Master']),
  category: z.string().min(2).max(60),
  story: z.string().min(5).max(800),
  instructions: z.string().min(5).max(800),
  clues: z.array(clue).min(1).max(20),
  visuals: z.array(z.object({ title: z.string().max(60), lines: z.array(z.string().max(80)).max(20) })).default([]),
  answer: codeSchema,
  explanation: z.string().min(10).max(3000),
  steps: z.array(z.string().min(2).max(500)).min(1).max(12),
  hints: z.array(z.string().min(3).max(600)).min(1).max(3),
  estSeconds: z.number().int().min(10).max(7200),
  skills: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  tests: z.array(z.object({ code: codeSchema, correct: z.boolean() })).default([]),
  altAnswers: z.array(codeSchema).max(5).optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  version: z.number().int().min(1).default(1),
});
export type LevelInput = z.infer<typeof levelInputSchema>;

export const reorderSchema = z.object({ order: z.array(z.string().min(1).max(40)).min(1).max(500) });
export const challengeSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  title: z.string().min(2).max(80),
  clues: z.array(z.string().min(3).max(400)).min(1).max(12),
  answer: codeSchema,
  explanation: z.string().min(5).max(2000),
});
