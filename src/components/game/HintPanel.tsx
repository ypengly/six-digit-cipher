'use client';
import { Lightbulb } from 'lucide-react';
import { HINT_ALLOWANCE } from '@/lib/scoring';

interface Props { hints: string[]; used: number; onReveal: () => void; busy: boolean; hintCount: number }

export default function HintPanel({ hints, used, onReveal, busy, hintCount }: Props) {
  const remaining = Math.max(0, Math.min(HINT_ALLOWANCE, hintCount) - used);
  return (
    <section aria-label="Hints" className="card p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="h-label flex items-center gap-2"><Lightbulb size={14} aria-hidden /> Hints</h2>
        <span className="text-xs text-mute" aria-live="polite">{remaining} of {hintCount} left</span>
      </div>
      <ol className="mt-3 space-y-2">
        {hints.map((h, i) => <li key={i} className="rounded-lg border border-accent2/30 bg-accent2/5 p-3 text-sm"><span className="mr-2 font-mono text-accent2">Hint {i + 1}</span>{h}</li>)}
      </ol>
      <button type="button" className="btn-ghost mt-3 w-full" disabled={busy || remaining === 0} onClick={onReveal}>
        {remaining === 0 ? 'No hints left' : used === 0 ? 'Reveal hint 1 (costs a star chance)' : `Reveal hint ${used + 1}`}
      </button>
      <p className="mt-2 text-xs text-mute">Hints are revealed in order. Using any hint rules out 3 stars; using all {hintCount} limits you to 1 star.</p>
    </section>
  );
}
