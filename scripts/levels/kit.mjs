// Shared helpers for authoring levels. Every clue is a [text, predicate] pair.
// The predicate is the formal version of the clue. The solver brute-forces all
// 1,000,000 codes, and a level is only valid when exactly ONE code satisfies every predicate.
export const defs = [];
export const pr = (d, i) => d[2 * i] * 10 + d[2 * i + 1];
export const sum = (d) => d.reduce((a, b) => a + b, 0);
export const num = (d) => d.reduce((a, b) => a * 10 + b, 0);
export const pad = (n, w = 2) => String(n).padStart(w, '0');
export const isPrime = (n) => { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; };
export const nextPrime = (n) => { let x = n + 1; while (!isPrime(x)) x++; return x; };
export const prevPrime = (n) => { let x = n - 1; while (!isPrime(x)) x--; return x; };
export const nthPrime = (k) => { let c = 0, x = 1; while (c < k) { x++; if (isPrime(x)) c++; } return x; };
export const isSquare = (n) => n >= 0 && Number.isInteger(Math.sqrt(n));
export const P = (i, v, t) => [t, (d) => pr(d, i) === v];
export const D = (i, v, t) => [t, (d) => d[i] === v];
export const caesar = (s, k) => s.replace(/[A-Z]/g, (c) => String.fromCharCode(((c.charCodeAt(0) - 65 + k + 26) % 26) + 65));
export const atbash = (s) => s.replace(/[A-Z]/g, (c) => String.fromCharCode(90 - (c.charCodeAt(0) - 65)));
export const a1z26 = (s) => [...s].map((c) => c.charCodeAt(0) - 64);
export const lv = (title, cat, story, clues, h1, h2, steps, opts = {}) =>
  defs.push({ title, cat, story, clues, h1, h2, steps, ...opts });

export function solve(preds, limit = 2) {
  const d = [0, 0, 0, 0, 0, 0];
  const out = [];
  for (d[0] = 0; d[0] < 10; d[0]++)
    for (d[1] = 0; d[1] < 10; d[1]++)
      for (d[2] = 0; d[2] < 10; d[2]++)
        for (d[3] = 0; d[3] < 10; d[3]++)
          for (d[4] = 0; d[4] < 10; d[4]++)
            for (d[5] = 0; d[5] < 10; d[5]++) {
              let ok = true;
              for (let k = 0; k < preds.length; k++) if (!preds[k](d)) { ok = false; break; }
              if (ok) { out.push(d.join('')); if (out.length >= limit) return out; }
            }
  return out;
}

// Seeded RNG (mulberry32) for generators that must stay reproducible.
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const words = ['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
const tens = ['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
export const numWord = (n) => (n < 20 ? words[n] : tens[Math.floor(n / 10)] + (n % 10 ? '-' + words[n % 10] : ''));
