export interface LevelProgress {
  completed: boolean;
  stars: number;
  attempts: number;
  hintsUsed: number;
  bestTimeSec: number | null;
  score: number;
}
export type ProgressMap = Record<number, LevelProgress>;

export interface Summary {
  completedCount: number;
  totalStars: number;
  totalAttempts: number;
  totalHints: number;
  bestStreak: number;
}

export interface Settings {
  sound: boolean;
  music: boolean;
  animations: boolean;
  reducedMotion: boolean;
  theme: 'dark' | 'light';
}
