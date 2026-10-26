import type { Clue } from '@/types/level';
import { cn } from '@/lib/utils';

export default function ClueCard({ clue, index }: { clue: Clue; index: number }) {
  const decoy = clue.kind === 'decoy';
  return (
    <li className={cn('flex gap-3 rounded-xl border p-3 text-[15px] leading-relaxed', decoy ? 'border-bad/40 bg-bad/5 text-mute line-through decoration-bad/50' : 'border-edge bg-bg/60 text-ink')}>
      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md bg-panel font-mono text-xs text-accent" aria-hidden>{index + 1}</span>
      <span>{clue.text}</span>
    </li>
  );
}
