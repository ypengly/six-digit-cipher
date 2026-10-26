import type { PublicLevel } from '@/types/level';
import ClueCard from './ClueCard';

export default function PuzzlePanel({ level }: { level: Pick<PublicLevel, 'story' | 'instructions' | 'clues' | 'visuals'> }) {
  return (
    <section className="space-y-5" aria-label="Puzzle">
      <p className="text-lg leading-relaxed text-ink/90">{level.story}</p>
      {level.visuals.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2" aria-label="Visual evidence">
          {level.visuals.map((v) => (
            <figure key={v.title} className="rounded-xl border border-accent2/40 bg-bg p-4">
              <figcaption className="h-label mb-2 !text-accent2">{v.title}</figcaption>
              <pre className="overflow-x-auto font-mono text-lg leading-8 text-ink" tabIndex={0}>{v.lines.join('\n')}</pre>
            </figure>
          ))}
        </div>
      )}
      <div>
        <h2 className="h-label mb-2">Clues</h2>
        <ol className="space-y-2">{level.clues.map((c, i) => <ClueCard key={c.id} clue={c} index={i} />)}</ol>
      </div>
      <p className="text-sm text-mute">{level.instructions}</p>
    </section>
  );
}
