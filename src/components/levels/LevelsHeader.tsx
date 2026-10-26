'use client';
import LevelProgress from '@/components/game/LevelProgress';
import { useGame } from '@/store/game-store';
import { campaignPercent, summarise } from '@/lib/progression';

export default function LevelsHeader() {
  const progress = useGame((s) => s.progress);
  const s = summarise(progress);
  return (
    <header className="mb-8">
      <h1 className="font-display text-4xl font-bold">Levels</h1>
      <p className="mt-1 text-mute">{s.completedCount} of 100 solved · {s.totalStars} stars. Solve a level to unlock the next.</p>
      <div className="mt-4 max-w-md"><LevelProgress percent={campaignPercent(progress)} /></div>
    </header>
  );
}
