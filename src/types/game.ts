import type { LevelProgress } from './progress';

export type SubmitResult =
  | { ok: true; correct: false; message: string; attempts?: number }
  | {
      ok: true;
      correct: true;
      explanation: string;
      steps: string[];
      stars: number;
      score: number;
      attempts: number;
      hintsUsed: number;
      elapsedSec: number;
      progress: LevelProgress;
      newlyUnlocked: number | null;
      newAchievements: string[];
    }
  | { ok: false; error: string; retryAfterSec?: number };
