'use client';
import Link from 'next/link';
import { Play, RotateCcw, Trophy } from 'lucide-react';
import { useGame } from '@/store/game-store';
import { highestUnlocked, summarise } from '@/lib/progression';
import { ACHIEVEMENTS, evaluateAchievements } from '@/data/achievements';

export default function LandingActions() {
  const progress = useGame((s) => s.progress);
  const hydrated = useGame((s) => s.hydrated);
  const stored = useGame((s) => s.achievements);
  const sum = summarise(progress);
  const has = hydrated && Object.values(progress).some((p) => p.completed || p.attempts > 0 || p.hintsUsed > 0);
  const best = Math.max(0, ...Object.values(progress).map((p) => p.score));
  const ach = new Set([...stored, ...evaluateAchievements(progress)]).size;
  return (
    <div className="mt-7">
      <div className="flex flex-wrap gap-3">
        <Link href="/play/1" className="btn-primary !px-6 !py-3 text-base"><Play size={18} aria-hidden /> Start new game</Link>
        {has && <Link href={`/play/${highestUnlocked(progress)}`} className="btn-violet !px-6 !py-3 text-base"><RotateCcw size={18} aria-hidden /> Continue (Level {highestUnlocked(progress)})</Link>}
      </div>
      {has && (
        <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-mute">
          <span>{sum.completedCount}/100 solved</span><span>{sum.totalStars} stars</span>
          {best > 0 && <span>Best score {best}</span>}
          <span className="inline-flex items-center gap-1"><Trophy size={14} aria-hidden /> {ach}/{ACHIEVEMENTS.length} achievements</span>
        </p>
      )}
      <p className="mt-3 text-xs text-mute">Starting a new game keeps your saved progress. Reset it any time in Settings.</p>
    </div>
  );
}
