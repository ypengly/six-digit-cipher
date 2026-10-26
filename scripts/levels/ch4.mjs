import { lv, P, D, pr, sum, pad, isPrime, isSquare, caesar, atbash, rng } from './kit.mjs';

// ---- Chapter 4: The Mind Labyrinth (levels 61-80) ----
lv('Switchboard', 'Boolean logic', 'Six switches (1 = ON, 0 = OFF) control the vault. Their gates are described below.', [
  ['Every switch is either 0 or 1.', (d) => d.every((x) => x <= 1)],
  ['Switch 1 is OFF.', (d) => d[0] === 0],
  ['Switch 2 XOR switch 3 = 0 (they match).', (d) => (d[1] ^ d[2]) === 0],
  ['Switch 3 XOR switch 4 = 1 (they differ).', (d) => (d[2] ^ d[3]) === 1],
  ['Switch 5 is NOT switch 4.', (d) => d[4] === 1 - d[3]],
  ['Switch 6 is switch 1 OR switch 4.', (d) => d[5] === (d[0] | d[3])],
  ['Exactly three switches are ON.', (d) => sum(d) === 3],
], 'Switch 1 is OFF. What does that make switch 6?', 'Everything depends on switch 2. Try it ON, then try it OFF, and count the ON switches.',
  ['If switch 2 = 1: switches 2, 3, 5 are ON, 4 and 6 are OFF: 0 1 1 0 1 0, three ON.', 'If switch 2 = 0: 0 0 0 1 0 1 has only two ON, so it fails.', 'Code: 011010.']);

{
  const words = 'SIX EIGHT TWO FOUR NINE ZERO'.split(' ');
  const dig = { ZERO: 0, ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5, SIX: 6, SEVEN: 7, EIGHT: 8, NINE: 9 };
  const enc = words.map((w) => atbash(w));
  lv('Mirror Alphabet', 'Multi-stage decoding', `A message in a mirrored alphabet appears: ${enc.join(' ')}.`, [
    ['The alphabet is mirrored (A becomes Z, B becomes Y, ...). Decode each word; each word is a number.', () => true],
    ['The code is those six numbers in order.', (d) => d.every((x, i) => x === dig[atbash(enc[i])])],
  ], 'A and Z swap, B and Y swap. What does H become?', 'H -> S, R -> I, C -> X. Do the same for every word.', [`Decoded: ${enc.map(atbash).join(', ')}.`, 'Code: 682490.']);
}

{
  const C = (n, k) => { let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i; return r; };
  const f = (n) => (n <= 1 ? 1 : n * f(n - 1));
  lv('Counting Ways', 'Combinatorics', 'The vault wants three counts.', [
    ['First pair: the number of handshakes if 12 people each shake hands once with everyone else.', (d) => pr(d, 0) === C(12, 2)],
    ['Middle pair: the number of ways to pick 2 people from 9.', (d) => pr(d, 1) === C(9, 2)],
    ['Last pair: the number of different arrangements of the letters AABB.', (d) => pr(d, 2) === f(4) / (f(2) * f(2))],
  ], 'Each handshake is a pair of people. Order within a pair does not matter.', 'Pairs from n: n(n-1)/2. Arrangements of AABB: 4! divided by 2! twice.', [`C(12,2) = ${C(12, 2)}, C(9,2) = ${C(9, 2)}, AABB arrangements = 6.`]);
}

{
  const g = [[4, 0, 7], [1, 9, 2], [8, 3, 5]];
  const rot = g.map((_, r) => g.map((__, c) => g[2 - c][r]));
  const exp = [...rot[0], ...rot[1]];
  lv('Quarter Turn', 'Spatial reasoning', 'A grid of digits will be turned by the vault.', [
    ['Rotate the grid a quarter turn clockwise. The code is the first two rows of the rotated grid, read left to right.', (d) => d.every((x, i) => x === exp[i])],
  ], 'The left column becomes the top row.', 'After a clockwise turn, the top row is the old left column read bottom to top.', [`Rotated rows: ${rot.map((r) => r.join('')).join(' / ')}.`, `Code: ${exp.join('')}.`],
    { visuals: [{ title: 'Grid', lines: g.map((r) => r.join(' ')) }] });
}

{
  const fin = (xs) => xs.reduce((a, x) => a * (x + 1), 1) - 1;
  const sim = (xs, r) => { const a = [...xs]; while (a.length > 1) { const i = Math.floor(r() * a.length); const x = a.splice(i, 1)[0]; const j = Math.floor(r() * a.length); const y = a.splice(j, 1)[0]; a.push(x + y + x * y); } return a[0]; };
  const r = rng(65);
  for (let k = 0; k < 20; k++) { if (sim([1, 2, 3, 4], r) !== fin([1, 2, 3, 4]) || sim([1, 1, 2, 3], r) !== fin([1, 1, 2, 3])) throw new Error('not invariant'); }
  lv('The Invariant', 'Mathematical invariants', 'A board holds numbers. A move erases two numbers a and b and writes a + b + a x b in their place. Moves repeat until one number remains.', [
    ['Board one: 1, 2, 3, 4. Board two: 1, 1, 2, 3. Whatever order you choose, the final number is always the same for a given board.', () => true],
    ['The code is board one\'s final number followed by board two\'s final number, each as three digits with leading zeros.', (d) => d[0] * 100 + d[1] * 10 + d[2] === fin([1, 2, 3, 4]) && d[3] * 100 + d[4] * 10 + d[5] === fin([1, 1, 2, 3])],
  ], 'Try the moves in two different orders on board one.', 'Notice that a + b + ab + 1 = (a + 1)(b + 1). What stays constant?', ['Product of (x + 1) over the board never changes.', 'Board one: 2 x 3 x 4 x 5 = 120, final 119. Board two: 2 x 2 x 3 x 4 = 48, final 47 = 047.', 'Code: 119047.']);
}

lv('Smudged Code', 'Incomplete evidence', 'Part of the code is smudged. Only three digits are readable: 2 _ 9 _ _ 1.', [
  ['The visible digits are in positions 1, 3 and 6: 2, 9 and 1.', (d) => d[0] === 2 && d[2] === 9 && d[5] === 1],
  ['The three missing digits are consecutive whole numbers, increasing from left to right.', (d) => d[3] === d[1] + 1 && d[4] === d[3] + 1],
  ['All six digits are different.', (d) => new Set(d).size === 6],
  ['The six digits add up to 24.', (d) => sum(d) === 24],
], 'Call the first missing digit k. What are the other two?', 'The visible digits sum to 12, so the missing ones sum to 12.', ['k + (k + 1) + (k + 2) = 12 so k = 3.', 'Missing digits 3, 4, 5. Code: 239451.']);

{
  const opp = { 1: 6, 6: 1, 2: 4, 4: 2, 3: 5, 5: 3 };
  lv('Folded Net', 'Spatial reasoning', 'A flat net of a cube is folded. Opposite faces end up at opposite sides.', [
    ['Fold the net into a cube. The code gives, for faces 1 to 6 in order, the number on the face directly opposite.', (d) => d.every((x, i) => x === opp[i + 1])],
  ], 'In a straight row of four faces, faces two apart are opposite.', 'The vertical strip 1-3-6 closes a ring with face 5: so 1 is opposite 6.', ['Opposites: 1-6, 2-4, 3-5.', 'Code: 645231.'],
    { visuals: [{ title: 'Net', lines: ['    [1]', '[2] [3] [4] [5]', '    [6]'] }] });
}

{
  const keypad = { A: 2, B: 2, C: 2, D: 3, E: 3, F: 3, G: 4, H: 4, I: 4, J: 5, K: 5, L: 5, M: 6, N: 6, O: 6, P: 7, Q: 7, R: 7, S: 7, T: 8, U: 8, V: 8, W: 9, X: 9, Y: 9, Z: 9 };
  const plain = 'CIPHER', cipher = caesar(plain, 3);
  const exp = [...plain].map((c) => keypad[c]);
  lv('Keypad Cipher', 'Layered ciphers', `A word is hidden twice over: ${cipher}.`, [
    [`Stage one: each letter of ${cipher} was moved forward 3 places. Undo it.`, () => true],
    ['Stage two: type the real word on an old phone keypad (2 = ABC, 3 = DEF, 4 = GHI, 5 = JKL, 6 = MNO, 7 = PQRS, 8 = TUV, 9 = WXYZ). The digits you would press are the code.', (d) => d.every((x, i) => x === exp[i])],
  ], 'Shift each letter back by three before anything else.', 'FLSKHU becomes CIPHER. C is on key 2.', [`${cipher} -> ${plain}.`, `Keys: ${exp.join('')}.`]);
}

lv('Chinese Remainders', 'Modular arithmetic', 'Three pairs each satisfy a system of remainder rules.', [
  ['First pair: leaves remainder 2 mod 3, remainder 3 mod 5, remainder 2 mod 7.', (d) => { const v = pr(d, 0); return v % 3 === 2 && v % 5 === 3 && v % 7 === 2; }],
  ['Middle pair: remainder 1 mod 4, remainder 2 mod 5, remainder 3 mod 7.', (d) => { const v = pr(d, 1); return v % 4 === 1 && v % 5 === 2 && v % 7 === 3; }],
  ['Last pair: remainder 4 mod 5, remainder 5 mod 6, remainder 1 mod 7.', (d) => { const v = pr(d, 2); return v % 5 === 4 && v % 6 === 5 && v % 7 === 1; }],
], 'Start with the largest modulus and list numbers with that remainder.', 'For the last pair, 4 mod 5 and 5 mod 6 together mean the number is 29 mod 30.', ['23, 17 and 29.']);

lv('Backward Chain', 'Dependency chains', 'Each digit is defined by the ones to its right. Start at the end.', [
  ['The first digit is the second plus the third, minus 4.', (d) => d[0] === d[1] + d[2] - 4],
  ['The second digit is three less than the third.', (d) => d[1] === d[2] - 3],
  ['The third digit is the fifth plus the fourth, minus the last.', (d) => d[2] === d[4] + d[3] - d[5]],
  ['The fourth digit is twice the last digit.', (d) => d[3] === 2 * d[5]],
  ['The fifth digit is the fourth plus the last.', (d) => d[4] === d[3] + d[5]],
  ['The last digit is the only even prime number.', (d) => d[5] === 2],
], 'Find the clue that does not depend on any other digit.', 'Last = 2, then fourth, then fifth, then third, second, first.', ['6th = 2, 4th = 4, 5th = 6, 3rd = 6 + 4 - 2 = 8, 2nd = 5, 1st = 5 + 8 - 4 = 9.', 'Code: 958462.']);

lv('Zigzag', 'Permutations', 'Six numbered tiles (1 to 6) must be placed in a zigzag pattern.', [
  ['The code uses each digit 1 to 6 exactly once.', (d) => [...d].sort().join('') === '123456'],
  ['The digits go up, down, up, down, up: first < second > third < fourth > fifth < sixth.', (d) => d[0] < d[1] && d[1] > d[2] && d[2] < d[3] && d[3] > d[4] && d[4] < d[5]],
  ['The first digit is 2, the third is 1, and the last is 6.', (d) => d[0] === 2 && d[2] === 1 && d[5] === 6],
  ['The second digit is exactly one more than the fourth digit.', (d) => d[1] === d[3] + 1],
], 'Place the three fixed digits first.', 'The remaining digits are 3, 4 and 5 for positions 2, 4, 5. Position 4 must beat position 5.', ['Options for (2nd, 4th, 5th): (5,4,3), (4,5,3), (3,5,4).', 'Second = fourth + 1 leaves (5,4,3).', 'Code: 251436.']);

{
  const grid = ['94173', '28605', '71492', '35826', '09361'].map((r) => [...r].map(Number));
  const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  const cells = [[2, 2]]; let r = 2, c = 2, len = 1, k = 0;
  while (cells.length < 6) { for (let rep = 0; rep < 2 && cells.length < 6; rep++) { for (let s = 0; s < len && cells.length < 6; s++) { r += dirs[k % 4][0]; c += dirs[k % 4][1]; cells.push([r, c]); } k++; } len++; }
  const exp = cells.map(([a, b]) => grid[a][b]);
  lv('Spiral Out', 'Spatial reasoning', 'A 5 x 5 grid of digits sits on the vault floor.', [
    ['Start at the centre cell. Move 1 step right, 1 step down, 2 left, 2 up, 3 right, 3 down, and so on, spiralling outward.', () => true],
    ['The code is the first six cells you stand on (including the centre), in order.', (d) => d.every((x, i) => x === exp[i])],
  ], 'Mark the centre of the 5 x 5 grid first.', 'Cells in order: centre, right, down, left, left, up.', [`Cells visited give ${exp.join('')}.`],
    { visuals: [{ title: 'Floor grid', lines: grid.map((row) => row.join(' ')) }] });
}

{
  const ls = (s) => { let o = ''; for (let i = 0; i < s.length;) { let j = i; while (s[j] === s[i]) j++; o += (j - i) + s[i]; i = j; } return o; };
  const seq = ['1']; for (let i = 0; i < 5; i++) seq.push(ls(seq[i]));
  lv('Say What You See', 'Complex sequences', 'The wall shows 1, 11, 21, 1211, 111221 and stops.', [
    ['Each term describes the previous term. The code is the next term.', (d) => d.join('') === seq[5]],
  ], 'Read 111221 aloud: "three ones, ..."', 'Group equal digits: 111, 22, 1. Describe each group.', ['111221 is three 1s, two 2s, one 1.', 'Next term: 312211.']);
}

lv('Three Riddles II', 'Independent deductions', 'Three independent riddles each yield a pair.', [
  ['First pair: a two-digit number whose digits add up to 11, and which is 27 less than its reversal.', (d) => { const v = pr(d, 0), a = Math.floor(v / 10), b = v % 10; return v >= 10 && a + b === 11 && b * 10 + a - v === 27; }],
  ['Middle pair: a perfect square whose two digits multiply to 18.', (d) => { const v = pr(d, 1); return v >= 10 && isSquare(v) && Math.floor(v / 10) * (v % 10) === 18; }],
  ['Last pair: the largest two-digit multiple of 13 whose digits are consecutive numbers.', (d) => { const v = pr(d, 2); const a = Math.floor(v / 10), b = v % 10; return v >= 10 && v % 13 === 0 && Math.abs(a - b) === 1 && [13, 26, 39, 52, 65, 78, 91].filter((m) => Math.abs(Math.floor(m / 10) - (m % 10)) === 1).every((m) => m <= v); }],
], 'Treat each riddle separately.', 'First: reversal minus number is 9 times the digit difference. Second: list two-digit squares. Third: list multiples of 13.', ['47 (74 - 47 = 27), 36 (3 x 6 = 18), 78.', 'Code: 47 36 78.']);

{
  const gray = (n) => n ^ (n >> 1);
  const ungray = (g) => { let n = 0; for (; g; g >>= 1) n ^= g; return n; };
  const target = [5, 0, 3, 9, 7, 2];
  const words = target.map((t) => gray(t).toString(2).padStart(4, '0'));
  lv('Gray Matter', 'Boolean logic', `A Gray-coded display flashes: ${words.join(' ')}.`, [
    ['Gray code: the first bit of the binary number is copied; each later binary bit is the previous binary bit XOR the current Gray bit.', () => true],
    ['Convert each 4-bit Gray word to ordinary binary, then to a decimal digit. The six digits are the code.', (d) => d.every((x, i) => ungray(parseInt(words[i], 2)) === x)],
  ], 'Convert the first word: 0111. The first bit is 0.', 'Binary bits: 0, then 0 XOR 1 = 1, then 1 XOR 1 = 0, then 0 XOR 1 = 1.', [`Binary words decode to ${target.join('')}.`]);
}

lv('Self-Describing', 'Self-reference', 'Each digit of the code counts something about the whole code.', [
  ['The first digit is the number of even digits in the code (0 counts as even).', (d) => d[0] === d.filter((x) => x % 2 === 0).length],
  ['The second digit is the number of odd digits in the code.', (d) => d[1] === d.filter((x) => x % 2 === 1).length],
  ['The third digit is the number of digits that are 5 or greater.', (d) => d[2] === d.filter((x) => x >= 5).length],
  ['The fourth digit is the number of zeros in the code.', (d) => d[3] === d.filter((x) => x === 0).length],
  ['The fifth digit is the number of twos in the code.', (d) => d[4] === d.filter((x) => x === 2).length],
  ['The last digit is the number of digits that are less than 3.', (d) => d[5] === d.filter((x) => x < 3).length],
], 'Even digits plus odd digits make six in total. What does that say about the first two digits?', 'The first two digits add up to 6. If no digit is 5 or more, the third digit is 0.', ['Assume 4 even, 2 odd digits; the digits are 4, 2, 0, 1, 1, 4.', 'Check each statement: 4 evens, 2 odds, no digit 5+, one zero, one two, four digits below 3.', 'Code: 420114.']);

{
  // Bridge puzzle: minimum time and number of crossings, found by exhaustive search.
  const best = (times) => {
    const n = times.length; const full = (1 << n) - 1; const INF = 1e9;
    let layer = new Map([[full * 2, 0]]); // key = mask*2 + side (side 0 = torch left)
    let bestT = INF; const counts = new Set();
    for (let step = 0; step < 11; step++) {
      const next = new Map();
      for (const [key, t] of layer) {
        const mask = key >> 1, side = key & 1;
        const here = side === 0 ? mask : full & ~mask;
        for (let a = 0; a < n; a++) if (here & (1 << a)) for (let b = a; b < n; b++) if (b === a || here & (1 << b)) {
          if (side === 1 && a !== b) continue; // only one person returns with the torch
          if (side === 0 && a === b) continue; // two cross forward
          const cost = Math.max(times[a], times[b]);
          const m2 = side === 0 ? mask & ~(1 << a) & ~(1 << b) : mask | (1 << a);
          const k2 = m2 * 2 + (1 - side); const t2 = t + cost;
          if (!next.has(k2) || next.get(k2) > t2) next.set(k2, t2);
        }
      }
      layer = next;
      const fin = layer.get(0 * 2 + 1);
      if (fin !== undefined) { if (fin < bestT) { bestT = fin; counts.clear(); counts.add(step + 1); } else if (fin === bestT) counts.add(step + 1); }
    }
    return { time: bestT, counts: [...counts] };
  };
  const A = best([1, 2, 5, 10]), B = best([1, 3, 6, 8]);
  if (A.counts.length !== 1) throw new Error('bridge crossings ambiguous');
  lv('Torch Bridge', 'Optimisation', 'Four travellers must cross a bridge at night. At most two can cross at once and they must carry the only torch. A pair moves at the speed of the slower walker. The torch must be walked back for others.', [
    ['Group A takes 1, 2, 5 and 10 minutes to cross alone. Group B takes 1, 3, 6 and 8 minutes.', () => true],
    ['First pair: the fastest total time for group A to get everyone across.', (d) => pr(d, 0) === A.time],
    ['Middle pair: the fastest total time for group B.', (d) => pr(d, 1) === B.time],
    ['Last pair: the number of one-way trips in the fastest plan for group A.', (d) => pr(d, 2) === A.counts[0]],
  ], 'Send the two fastest first. Who should bring the torch back?', 'Compare two plans: always escort with the fastest walker, versus sending the two slowest together.', [`Group A: ${A.time} minutes in ${A.counts[0]} trips (send 1+2, 1 back, 5+10, 2 back, 1+2).`, `Group B: ${B.time} minutes.`]);
}

lv('Lattice Paths', 'Combinatorics', 'A courier moves only right or down on a grid of streets.', [
  ['First pair: the number of shortest routes across a 4 x 4 block grid (4 steps right, 4 steps down).', (d) => pr(d, 0) === 70],
  ['Middle pair: the number of shortest routes across a 3 x 5 grid (5 right, 3 down).', (d) => pr(d, 1) === 56],
  ['Last pair: the number of shortest routes across a 2 x 2 grid.', (d) => pr(d, 2) === 6],
], 'Every route is an arrangement of R steps and D steps.', 'Choose which of the 8 steps are rights: C(8,4) and C(8,3).', ['C(8,4) = 70, C(8,3) = 56, C(4,2) = 6.']);

{
  const piles = [7, 9, 12]; const ns = piles.reduce((a, b) => a ^ b, 0);
  const moves = piles.map((p, i) => [i + 1, p - (p ^ ns)]).filter(([i, t]) => t > 0);
  if (moves.length !== 1) throw new Error('nim move not unique');
  lv('Nim Gate', 'Game theory', 'Three piles of stones hold 7, 9 and 12. Players take any number of stones from one pile. Whoever takes the last stone wins. You move first and want to win.', [
    ['First pair: the nim-sum (bitwise XOR) of the three pile sizes.', (d) => pr(d, 0) === ns],
    ['Middle pair: the number of the only pile (counting 1, 2, 3) where a winning move exists.', (d) => pr(d, 1) === moves[0][0]],
    ['Last pair: how many stones that winning move removes.', (d) => pr(d, 2) === moves[0][1]],
  ], 'A winning move leaves a nim-sum of zero.', '7 XOR 9 XOR 12 = 2. A pile p is a candidate if p XOR 2 is smaller than p.', [`Nim-sum = ${ns}.`, `Only pile ${moves[0][0]} works: ${piles[0]} -> ${piles[0] - moves[0][1]}.`, `Code: ${pad(ns)}${pad(moves[0][0])}${pad(moves[0][1])}.`]);
}

lv('The Labyrinth', 'Interdependent clues', 'The last gate of the chapter ties three pairs together.', [
  ['The first pair is a perfect square greater than 40.', (d) => isSquare(pr(d, 0)) && pr(d, 0) > 40],
  ['The last pair is the first pair written backwards, and it is a multiple of 23.', (d) => d[4] === d[1] && d[5] === d[0] && pr(d, 2) % 23 === 0],
  ['The middle pair is the first pair plus the last pair, divided by 11.', (d) => pr(d, 1) * 11 === pr(d, 0) + pr(d, 2)],
], 'List the squares above 40 and reverse each.', 'Squares: 49, 64, 81. Reversals: 94, 46, 18. Which is a multiple of 23?', ['46 = 2 x 23, so the first pair is 64.', '(64 + 46) / 11 = 10.', 'Code: 64 10 46.']);
