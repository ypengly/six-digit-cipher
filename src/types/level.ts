export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | 'Master';
export type LevelStatus = 'draft' | 'published' | 'archived';

export interface Clue { id: string; text: string; kind: 'clue' | 'decoy' }
export interface Visual { title: string; lines: string[] }

/** Everything about a level, including secrets. Server-only. */
export interface FullLevel {
  id: string;
  number: number;
  chapter: number;
  chapterTitle: string;
  title: string;
  difficulty: Difficulty;
  category: string;
  story: string;
  instructions: string;
  clues: Clue[];
  visuals: Visual[];
  answer: string;
  explanation: string;
  steps: string[];
  hints: string[];
  estSeconds: number;
  skills: string[];
  tags: string[];
  tests: { code: string; correct: boolean }[];
  altAnswers?: string[];
  status: LevelStatus;
  version: number;
}

/** What the browser is allowed to see before a level is solved. */
export interface PublicLevel {
  number: number;
  chapter: number;
  chapterTitle: string;
  title: string;
  difficulty: Difficulty;
  category: string;
  story: string;
  instructions: string;
  clues: Clue[];
  visuals: Visual[];
  estSeconds: number;
  hintCount: number;
}

export interface LevelSummary {
  number: number;
  chapter: number;
  title: string;
  difficulty: Difficulty;
  category: string;
  estSeconds: number;
}
