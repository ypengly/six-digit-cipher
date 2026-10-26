'use client';
import { useEffect } from 'react';
import { useGame } from '@/store/game-store';
import { summarise, isUnlocked } from '@/lib/progression';

/** Loads the session once. Signed-in players get authoritative server progress; guests keep the local cache. */
export function useBootstrap() {
  const hydrated = useGame((s) => s.hydrated);
  const { setUser, replaceProgress, setAchievements } = useGame.getState();
  useEffect(() => {
    if (!hydrated) return;
    let alive = true;
    fetch('/api/progress', { cache: 'no-store' }).then((r) => r.json()).then((d) => {
      if (!alive) return;
      if (d.user) { setUser(d.user); replaceProgress(d.progress ?? {}); setAchievements(d.achievements ?? []); }
      else setUser(null);
    }).catch(() => undefined);
    return () => { alive = false; };
  }, [hydrated]); // eslint-disable-line react-hooks/exhaustive-deps
}

export function useProgress() {
  const progress = useGame((s) => s.progress);
  const hydrated = useGame((s) => s.hydrated);
  return { progress, hydrated, summary: summarise(progress), unlocked: (n: number) => isUnlocked(n, progress) };
}
