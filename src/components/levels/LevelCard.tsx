import Link from 'next/link';
import { Check, Lock } from 'lucide-react';
import Stars from '@/components/ui/Stars';
import DifficultyBadge from '@/components/ui/DifficultyBadge';
import { cn, formatTime } from '@/lib/utils';
import type { LevelSummary } from '@/types/level';
import type { LevelProgress } from '@/types/progress';

export default function LevelCard({ level, progress, unlocked }: { level: LevelSummary; progress?: LevelProgress; unlocked: boolean }) {
  const done = !!progress?.completed;
  const body = (
    <>
      <div className="flex items-start justify-between">
        <span className="font-mono text-2xl font-bold">{String(level.number).padStart(2, '0')}</span>
        {done ? <Check size={18} className="text-ok" aria-hidden /> : !unlocked ? <Lock size={16} className="text-mute" aria-hidden /> : null}
      </div>
      <p className="mt-1 line-clamp-1 text-sm font-medium">{unlocked ? level.title : 'Locked'}</p>
      <div className="mt-2 flex items-center justify-between"><DifficultyBadge level={level.difficulty} />{done && <Stars n={progress!.stars} size={13} />}</div>
      {done && <p className="mt-2 text-xs text-mute">{progress!.attempts} attempt{progress!.attempts === 1 ? '' : 's'}{progress!.bestTimeSec != null && ` · ${formatTime(progress!.bestTimeSec)}`}</p>}
    </>
  );
  const cls = cn('block rounded-xl border p-3 transition', done ? 'border-ok/40 bg-ok/5' : unlocked ? 'border-accent/50 bg-panel/80 hover:shadow-neon' : 'cursor-not-allowed border-edge/50 bg-panel/30 opacity-60');
  const label = `Level ${level.number}, ${level.difficulty}, ${done ? `completed with ${progress!.stars} stars` : unlocked ? 'unlocked' : 'locked'}`;
  return unlocked ? <Link href={`/play/${level.number}`} className={cls} aria-label={label}>{body}</Link> : <div className={cls} aria-label={label} aria-disabled="true">{body}</div>;
}
