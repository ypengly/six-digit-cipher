'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { LevelProgress, ProgressMap, Settings } from '@/types/progress';

export interface AccountUser { id: string; email: string; displayName: string; role: 'PLAYER' | 'ADMIN' }
const EMPTY: LevelProgress = { completed: false, stars: 0, attempts: 0, hintsUsed: 0, bestTimeSec: null, score: 0 };

interface GameState {
  hydrated: boolean;
  user: AccountUser | null;
  /** Guest progress is cached here (localStorage). Signed-in players overwrite it from the server. */
  progress: ProgressMap;
  settings: Settings;
  notes: Record<number, string>;
  dailySolved: string[];
  achievements: string[];
  setHydrated: () => void;
  setUser: (u: AccountUser | null) => void;
  replaceProgress: (p: ProgressMap) => void;
  patchLevel: (n: number, patch: Partial<LevelProgress>) => void;
  setLevel: (n: number, p: LevelProgress) => void;
  setSettings: (s: Partial<Settings>) => void;
  setNote: (n: number, text: string) => void;
  addDaily: (date: string) => void;
  addAchievements: (ids: string[]) => void;
  setAchievements: (ids: string[]) => void;
  resetGuest: () => void;
}

export const useGame = create<GameState>()(
  persist(
    (set) => ({
      hydrated: false, user: null, progress: {}, notes: {}, dailySolved: [], achievements: [],
      settings: { sound: true, music: false, animations: true, reducedMotion: false, theme: 'dark' },
      setHydrated: () => set({ hydrated: true }),
      setUser: (user) => set({ user }),
      replaceProgress: (progress) => set({ progress }),
      patchLevel: (n, patch) => set((s) => ({ progress: { ...s.progress, [n]: { ...(s.progress[n] ?? EMPTY), ...patch } } })),
      setLevel: (n, p) => set((s) => ({ progress: { ...s.progress, [n]: p } })),
      setSettings: (p) => set((s) => ({ settings: { ...s.settings, ...p } })),
      setNote: (n, text) => set((s) => ({ notes: { ...s.notes, [n]: text } })),
      addDaily: (date) => set((s) => ({ dailySolved: s.dailySolved.includes(date) ? s.dailySolved : [...s.dailySolved, date] })),
      addAchievements: (ids) => set((s) => ({ achievements: Array.from(new Set([...s.achievements, ...ids])) })),
      setAchievements: (achievements) => set({ achievements }),
      resetGuest: () => set({ progress: {}, notes: {}, dailySolved: [], achievements: [] }),
    }),
    {
      name: 'sdc-v1',
      storage: createJSONStorage(() => localStorage),
      // Only non-sensitive data is cached. No answers or secrets ever reach the browser before solving.
      partialize: (s) => ({ progress: s.progress, settings: s.settings, notes: s.notes, dailySolved: s.dailySolved, achievements: s.achievements }),
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    },
  ),
);
export const emptyProgress = EMPTY;
