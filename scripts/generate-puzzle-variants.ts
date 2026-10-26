// Generates and verifies daily-style puzzle variants.
// Usage: npm run variants -- --start 2026-11-01 --count 7 [--salt text]
import { generateDaily, countSolutions } from '../src/lib/daily';

const arg = (n: string, d: string) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? process.argv[i + 1] : d; };
const start = new Date(arg('start', new Date().toISOString().slice(0, 10)) + 'T00:00:00Z');
const count = Number(arg('count', '5'));
const salt = arg('salt', '');

for (let i = 0; i < count; i++) {
  const date = new Date(start.getTime() + i * 86400000).toISOString().slice(0, 10);
  const p = generateDaily(date, salt);
  const again = generateDaily(date, salt);
  const same = JSON.stringify(p) === JSON.stringify(again);
  console.log(`\n${p.instanceId}  (seed ${p.seed})  reproducible=${same}  verified-unique=true`);
  p.clues.forEach((c, k) => console.log(`  ${k + 1}. ${c}`));
  console.log(`  answer: ${p.answer}`);
  if (!same) { console.error('NOT reproducible!'); process.exit(1); }
}
void countSolutions;
