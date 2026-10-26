'use client';
import { Trophy, Lock } from 'lucide-react';
import { ACHIEVEMENTS } from '@/data/achievements';
import { useGame } from '@/store/game-store';
import { evaluateAchievements } from '@/data/achievements';
import { cn } from '@/lib/utils';

export default function AchievementList() {
  const progress = useGame((s) => s.progress);
  const daily = useGame((s) => s.dailySolved.length);
  const stored = useGame((s) => s.achievements);
  const earned = new Set([...stored, ...evaluateAchievements(progress, { daily })]);
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {ACHIEVEMENTS.map((a) => {
        const has = earned.has(a.id);
        return (
          <li key={a.id} className={cn('card flex items-start gap-3 p-4', has ? 'shadow-violet' : 'opacity-60')}>
            <span className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-lg', has ? 'bg-accent2/20 text-accent2' : 'bg-bg text-mute')}>{has ? <Trophy size={18} aria-hidden /> : <Lock size={16} aria-hidden />}</span>
            <div><h3 className="font-semibold">{a.name}<span className="sr-only">{has ? ' (unlocked)' : ' (locked)'}</span></h3><p className="text-sm text-mute">{a.description}</p></div>
          </li>
        );
      })}
    </ul>
  );
}
