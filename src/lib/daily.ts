import { hashString, mulberry32, randInt } from './random';

export interface DailyPuzzle {
  instanceId: string;
  date: string;
  seed: number;
  title: string;
  clues: string[];
  answer: string;
  explanation: string;
}
type Test = (d: number[]) => boolean;
export interface GClue { text: string; test: Test }

const ORD = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth'];
const pairName = ['first pair', 'middle pair', 'last pair'];
const pair = (d: number[], i: number) => d[2 * i] * 10 + d[2 * i + 1];
const sum = (d: number[]) => d.reduce((a, b) => a + b, 0);
const isPrime = (n: number) => { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; };
const digitsOf = (n: number) => { const d = [0, 0, 0, 0, 0, 0]; for (let i = 5; i >= 0; i--) { d[i] = n % 10; n = (n - d[i]) / 10; } return d; };

/** Produces one clue that is TRUE for the hidden code `a`. */
function makeClue(r: () => number, a: number[]): GClue | null {
  const t = randInt(r, 0, 10);
  const i = randInt(r, 0, 5);
  let j = randInt(r, 0, 5); if (j === i) j = (j + 1) % 6;
  const p = randInt(r, 0, 2);
  switch (t) {
    case 0: { const even = a[i] % 2 === 0; return { text: `The ${ORD[i]} digit is ${even ? 'even' : 'odd'}.`, test: (d) => (d[i] % 2 === 0) === even }; }
    case 1: { const gt = a[i] > a[j]; if (a[i] === a[j]) return { text: `The ${ORD[i]} and ${ORD[j]} digits are equal.`, test: (d) => d[i] === d[j] };
      return { text: `The ${ORD[i]} digit is ${gt ? 'greater' : 'smaller'} than the ${ORD[j]} digit.`, test: (d) => (d[i] > d[j]) === gt }; }
    case 2: { const s = sum(a); return { text: `All six digits add up to ${s}.`, test: (d) => sum(d) === s }; }
    case 3: { const s = a[i] + a[j]; return { text: `The ${ORD[i]} and ${ORD[j]} digits add up to ${s}.`, test: (d) => d[i] + d[j] === s }; }
    case 4: { const ms = [3, 4, 6, 7, 9, 11, 13].filter((m) => pair(a, p) % m === 0 && pair(a, p) !== 0);
      if (!ms.length) return null; const m = ms[randInt(r, 0, ms.length - 1)];
      return { text: `The ${pairName[p]} is a multiple of ${m} (and not zero).`, test: (d) => pair(d, p) !== 0 && pair(d, p) % m === 0 }; }
    case 5: { const pr = isPrime(pair(a, p)); return { text: `The ${pairName[p]} is ${pr ? '' : 'not '}a prime number.`, test: (d) => isPrime(pair(d, p)) === pr }; }
    case 6: { const v = a[randInt(r, 0, 5)]; const k = a.filter((x) => x === v).length; return { text: `The digit ${v} appears exactly ${k} time${k === 1 ? '' : 's'}.`, test: (d) => d.filter((x) => x === v).length === k }; }
    case 7: { const mx = Math.max(...a); return { text: `The largest digit is ${mx}.`, test: (d) => Math.max(...d) === mx }; }
    case 8: { const mn = Math.min(...a); return { text: `The smallest digit is ${mn}.`, test: (d) => Math.min(...d) === mn }; }
    case 9: { const v = pair(a, p); const thr = Math.max(1, Math.min(98, v + randInt(r, -12, 12))); const gt = v > thr;
      return { text: `The ${pairName[p]} is ${gt ? 'greater' : 'less'} than ${thr}.`, test: (d) => (pair(d, p) > thr) === gt && pair(d, p) !== thr }; }
    default: { const df = a[i] - a[j]; return { text: df >= 0 ? `The ${ORD[i]} digit is ${df} more than the ${ORD[j]} digit.` : `The ${ORD[i]} digit is ${-df} less than the ${ORD[j]} digit.`, test: (d) => d[i] - d[j] === df }; }
  }
}

export function countSolutions(clues: GClue[], limit = 2): number {
  let n = 0;
  for (let x = 0; x < 1_000_000; x++) {
    const d = digitsOf(x);
    if (clues.every((c) => c.test(d))) { n++; if (n >= limit) return n; }
  }
  return n;
}

/** Deterministic: same (date, salt) always yields the same puzzle. Clues are added only while they
 *  shrink the candidate set, and the result is verified to have EXACTLY one solution. */
export function generateDailyDetailed(date: string, salt = ''): { puzzle: DailyPuzzle; clues: GClue[] } {
  for (let attempt = 0; attempt < 20; attempt++) {
    const seed = hashString(`${date}|${salt}|${attempt}`);
    const r = mulberry32(seed);
    const a = digitsOf(randInt(r, 0, 999999));
    let pool: number[] = Array.from({ length: 1_000_000 }, (_, i) => i);
    const chosen: GClue[] = [];
    let guard = 0;
    while (pool.length > 1 && guard++ < 400 && chosen.length < 14) {
      const c = makeClue(r, a);
      if (!c) continue;
      const next = pool.filter((x) => c.test(digitsOf(x)));
      if (next.length < pool.length) { chosen.push(c); pool = next; }
    }
    // Fallback: pin remaining ambiguity with plain digit clues so a puzzle is always produced.
    let k = 0;
    while (pool.length > 1 && k < 6) {
      const idx = k++;
      const c: GClue = { text: `The ${ORD[idx]} digit is ${a[idx]}.`, test: (d) => d[idx] === a[idx] };
      const next = pool.filter((x) => c.test(digitsOf(x)));
      if (next.length < pool.length) { chosen.push(c); pool = next; }
    }
    if (pool.length !== 1 || countSolutions(chosen) !== 1) continue; // reject ambiguous
    const answer = a.join('');
    return {
      clues: chosen,
      puzzle: {
        instanceId: `daily-${date}-s${seed}`, date, seed,
        title: `Daily Cipher ${date}`,
        clues: chosen.map((c) => c.text),
        answer,
        explanation: `Combine all ${chosen.length} clues: only one six-digit code satisfies every statement, and it is ${answer}.`,
      },
    };
  }
  throw new Error('Could not generate an unambiguous daily puzzle');
}
export const generateDaily = (date: string, salt = ''): DailyPuzzle => generateDailyDetailed(date, salt).puzzle;
