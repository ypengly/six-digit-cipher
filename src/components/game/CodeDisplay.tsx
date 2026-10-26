import { cn } from '@/lib/utils';

/** Exactly six slots. The value is a STRING so leading zeros survive (004281 stays 004281). */
export default function CodeDisplay({ value, shake, state }: { value: string; shake?: boolean; state?: 'idle' | 'ok' | 'bad' }) {
  return (
    <div role="group" aria-label={`Six digit code. ${value.length} of 6 digits entered.`} className={cn('flex justify-center gap-2 sm:gap-3', shake && 'shake')}>
      {Array.from({ length: 6 }, (_, i) => {
        const ch = value[i];
        return (
          <div key={i} aria-label={`Digit ${i + 1}: ${ch ?? 'empty'}`}
            className={cn('grid h-14 w-11 place-items-center rounded-lg border bg-bg font-mono text-3xl sm:h-16 sm:w-14',
              state === 'ok' ? 'border-ok text-ok' : state === 'bad' ? 'border-bad text-bad' : ch ? 'border-accent text-accent shadow-neon' : value.length === i ? 'border-accent2 pulse-glow' : 'border-edge text-mute')}>
            {ch ?? <span className="text-edge">·</span>}
          </div>
        );
      })}
      <p className="sr-only" aria-live="polite">{value.length ? `${value.length} digits entered` : 'Code is empty'}</p>
    </div>
  );
}
