import Link from 'next/link';
import { Brain, KeyRound, Lightbulb, Star } from 'lucide-react';
import VaultAnimation from '@/components/ui/VaultAnimation';
import PageContainer from '@/components/layout/PageContainer';
import LandingActions from '@/components/game/LandingActions';

const chapters = [
  ['1', 'Initiation', 'Levels 1-20', 'Beginner to Intermediate', 'Sequences, riddles, counting, first multi-clue reasoning.'],
  ['2', 'The Analyst', 'Levels 21-40', 'Intermediate', 'Primes, modular arithmetic, calendars, ciphers, ordering.'],
  ['3', 'The Deceiver', 'Levels 41-60', 'Advanced', 'Red herrings, truth and lies, base conversion, cryptograms.'],
  ['4', 'The Mind Labyrinth', 'Levels 61-80', 'Expert', 'Boolean logic, spatial puzzles, invariants, layered decoding.'],
  ['5', 'The Final Cipher', 'Levels 81-100', 'Master', 'Cross-referenced clues, hidden rules, a final multi-stage lock.'],
];

export default function Landing() {
  return (
    <PageContainer>
      <section className="grid items-center gap-10 py-6 md:grid-cols-2">
        <div>
          <p className="h-label">Classified · Vault Protocol 100</p>
          <h1 className="mt-3 font-display text-5xl font-extrabold leading-[1.05] sm:text-6xl">The Six-Digit <span className="text-accent">Cipher</span></h1>
          <p className="mt-2 text-xl text-accent2">100 Levels of IQ</p>
          <p className="mt-5 max-w-prose text-lg leading-relaxed text-ink/85">You wake inside a sealed digital vault. Every door is guarded by a six-digit passcode, and every passcode hides inside a puzzle. Read the clues. Trust your reasoning. Ninety-nine doors stand between you and the last one.</p>
          <LandingActions />
        </div>
        <VaultAnimation />
      </section>

      <section aria-labelledby="how" className="mt-14">
        <h2 id="how" className="font-display text-2xl font-bold">How to play</h2>
        <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[[Brain, 'Read the clues', 'Each level gives a story, clues and sometimes a visual. Work out the digits.'], [KeyRound, 'Enter six digits', 'Use the keypad or your keyboard. Leading zeros count: 004281 is valid.'], [Lightbulb, 'Use hints wisely', 'Three hints per level, revealed in order. They cost stars, not the level.'], [Star, 'Earn stars', 'Three stars: no hints and under the target time. Details are in Settings.']].map(([Icon, t, d], i) => {
            const I = Icon as typeof Brain;
            return <li key={i} className="card p-4"><I className="text-accent" size={22} aria-hidden /><h3 className="mt-2 font-semibold">{t as string}</h3><p className="mt-1 text-sm text-mute">{d as string}</p></li>;
          })}
        </ol>
      </section>

      <section aria-labelledby="diff" className="mt-14">
        <h2 id="diff" className="font-display text-2xl font-bold">Difficulty overview · 100 levels</h2>
        <ul className="mt-4 space-y-2">
          {chapters.map(([n, t, r, d, desc]) => (
            <li key={n} className="card flex flex-wrap items-center gap-x-4 gap-y-1 p-4">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-bg font-mono text-accent">{n}</span>
              <div className="min-w-[10rem]"><p className="font-semibold">{t}</p><p className="text-xs text-mute">{r} · {d}</p></div>
              <p className="text-sm text-ink/80 sm:ml-auto sm:max-w-md">{desc}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-center"><Link href="/levels" className="btn-ghost">Browse all levels</Link></p>
      </section>
    </PageContainer>
  );
}
