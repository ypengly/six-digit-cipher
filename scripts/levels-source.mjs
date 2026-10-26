// Authoring source for the 100 campaign levels. Answers are NEVER typed by hand:
// each answer is found by brute-forcing all 1,000,000 codes against the formal clue predicates.
import './levels/ch1.mjs';
import './levels/ch2.mjs';
import './levels/ch3.mjs';
import './levels/ch4.mjs';
import './levels/ch5.mjs';
import { defs, solve } from './levels/kit.mjs';

export const CHAPTERS = [
  { n: 1, title: 'Initiation', difficulty: 'Beginner', est: 90 },
  { n: 2, title: 'The Analyst', difficulty: 'Intermediate', est: 150 },
  { n: 3, title: 'The Deceiver', difficulty: 'Advanced', est: 240 },
  { n: 4, title: 'The Mind Labyrinth', difficulty: 'Expert', est: 360 },
  { n: 5, title: 'The Final Cipher', difficulty: 'Master', est: 540 },
];

export function buildAll() {
  if (defs.length !== 100) throw new Error(`Expected 100 level definitions, found ${defs.length}`);
  return defs.map((d, i) => {
    const number = i + 1;
    const ch = CHAPTERS[Math.floor(i / 20)];
    const preds = d.clues.filter((c) => c[1]).map((c) => c[1]);
    const sols = solve(preds, 3);
    if (sols.length !== 1) throw new Error(`Level ${number} (${d.title}): expected exactly 1 solution, found ${sols.length}: ${sols.join(', ')}`);
    const answer = sols[0];
    const decoy = d.clues.some((c) => c[0].startsWith('[UNVERIFIED]'));
    const near = answer.slice(0, 5) + String((Number(answer[5]) + 1) % 10);
    const idx = i % 20;
    return {
      id: `L${String(number).padStart(3, '0')}`,
      number,
      chapter: ch.n,
      chapterTitle: ch.title,
      title: d.title,
      difficulty: number <= 10 ? 'Beginner' : number <= 20 ? 'Intermediate' : ch.difficulty,
      category: d.cat,
      story: d.story,
      instructions: decoy
        ? 'Only clues marked VERIFIED can be trusted. Ignore every UNVERIFIED clue. Enter the six-digit code; leading zeros count.'
        : 'Use every clue. Single-digit answers inside a pair need a leading zero (6 becomes 06). Enter the six-digit code.',
      clues: d.clues.map((c, k) => ({ id: `c${k + 1}`, text: c[0], kind: c[0].startsWith('[UNVERIFIED]') ? 'decoy' : 'clue' })),
      visuals: d.visuals ?? [],
      answer,
      explanation: `${d.steps.join(' ')} The code is ${answer}.`,
      steps: d.steps,
      hints: [d.h1, d.h2, `Near the end: the code starts with ${answer.slice(0, 2)} and ends with ${answer[5]}. Work out the middle three digits yourself.`],
      estSeconds: ch.est + idx * 6,
      skills: [d.cat],
      tags: [d.cat.toLowerCase(), ch.title.toLowerCase()],
      tests: [{ code: answer, correct: true }, { code: near, correct: false }, { code: '000000', correct: answer === '000000' }],
      status: 'published',
      version: 1,
      verification: { method: 'exhaustive-solver', solutions: 1 },
    };
  });
}
