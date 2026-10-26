import { lv, P, pr, sum, pad, caesar, a1z26, rng } from './kit.mjs';

// ---- Chapter 3: The Deceiver (levels 41-60) ----
// Clues with a null predicate are red herrings. They are always labelled in the text
// ([UNVERIFIED]) so players can tell which clues matter.
lv('The Forged Ledger', 'Red herrings', 'A ledger holds six memos. Only memos stamped VERIFIED are genuine. Forgeries are everywhere.', [
  ['[VERIFIED] The first pair is the number of letters in VAULT, multiplied by 3.', (d) => pr(d, 0) === 15],
  ['[UNVERIFIED] The first pair is 51.', null],
  ['[VERIFIED] The middle pair is two to the power of five.', (d) => pr(d, 1) === 32],
  ['[UNVERIFIED] The last digit is 9.', null],
  ['[VERIFIED] The last pair is the middle pair minus the first pair.', (d) => pr(d, 2) === pr(d, 1) - pr(d, 0)],
  ['[UNVERIFIED] The middle pair is a multiple of 7.', null],
], 'Ignore every memo that is not stamped VERIFIED.', 'Compute 5 x 3, then 2^5, then subtract.', ['5 x 3 = 15; 2^5 = 32; 32 - 15 = 17.', 'Code: 15 32 17.']);

{
  const cipher = caesar('DECIDE', 4);
  const digits = a1z26('DECIDE');
  lv('Shifted Letters', 'Cryptograms', `A cryptogram is scratched into the wall: ${cipher}.`, [
    [`Each letter of ${cipher} was moved forward 4 places in the alphabet. Undo the shift to reveal a word.`, () => true],
    ['Then replace each letter by its position in the alphabet (A = 1 ... I = 9). The result is the code.', (d) => d.every((x, i) => x === digits[i])],
  ], 'Shift each letter back by four.', 'H goes back to D. Do the same for the rest.', [`${cipher} shifted back by 4 is DECIDE.`, `D=4, E=5, C=3, I=9, D=4, E=5: ${digits.join('')}.`]);
}

lv('Mixed Bases', 'Base conversion', 'Three numbers in three number systems are carved over the door.', [
  ['First pair: octal 77, converted to ordinary decimal.', (d) => pr(d, 0) === parseInt('77', 8)],
  ['Middle pair: hexadecimal 2A, converted to decimal.', (d) => pr(d, 1) === parseInt('2A', 16)],
  ['Last pair: binary 11001, converted to decimal.', (d) => pr(d, 2) === parseInt('11001', 2)],
], 'Each digit position is worth a power of the base.', 'Octal 77 = 7 x 8 + 7. Hex 2A = 2 x 16 + 10. Binary 11001 = 16 + 8 + 1.', ['63, 42, 25.']);

{
  const msg = 'Is it a very hidden answer';
  const lens = msg.split(' ').map((w) => w.length);
  lv('Hidden in Plain Sight', 'Hidden patterns', 'The guard\'s message looks innocent. Count carefully.', [
    ['The guard says: "Is it a very hidden answer?" The code is the number of letters in each word, in order.', (d) => d.every((x, i) => x === lens[i])],
  ], 'The message has exactly six words.', 'Count the letters of each word separately. Ignore punctuation.', [`Word lengths: ${lens.join(', ')}.`]);
}

lv('Growing Gaps', 'Nested sequences', 'The wall shows 2, 3, 5, 8, 12, 17 and then stops.', [
  ['The gaps between neighbouring terms form a pattern of their own. The code is the next three terms as pairs.', (d) => pr(d, 0) === 23 && pr(d, 1) === 30 && pr(d, 2) === 38],
], 'Write down the differences between terms.', 'The differences are 1, 2, 3, 4, 5. What comes next?', ['Gaps: +6, +7, +8.', '17 + 6 = 23, 23 + 7 = 30, 30 + 8 = 38.']);

lv('Three Guards', 'Truth and lies', 'Three guards each make a statement about the first two digits. Exactly one of them is lying.', [
  ['Guard 1: "The first digit is 3."', null],
  ['Guard 2: "The second digit is 5."', null],
  ['Guard 3: "The first two digits add up to 9."', null],
  ['Exactly one of the three guards lies.', (d) => [d[0] === 3, d[1] === 5, d[0] + d[1] === 9].filter((x) => !x).length === 1],
  ['The first digit is even.', (d) => d[0] % 2 === 0],
  ['The third digit is the last digit of the product of the first two.', (d) => d[2] === (d[0] * d[1]) % 10],
  ['The fourth digit is the sum of the first two digits.', (d) => d[3] === d[0] + d[1]],
  ['The last two digits form the square of the second digit.', (d) => d[4] * 10 + d[5] === d[1] * d[1]],
], 'If the first digit is even, what does that say about Guard 1?', 'Guard 1 must be the liar, so Guards 2 and 3 tell the truth.',
  ['Even first digit means Guard 1 lies. Guards 2 and 3 are honest: second digit 5, sum 9, so the first digit is 4.', 'Third digit: 20 -> 0. Fourth: 9. Last two: 25.', 'Code: 450925.']);

{
  const sol = [];
  for (let a = 0; a < 10; a++) for (let b = 0; b < 10; b++) for (let c = 0; c < 10; c++) for (let e = 0; e < 10; e++)
    if (3 * a === 9 && a + b === 8 && b * c === 10 && e - c === 5) sol.push({ a, b, c, e });
  const { a: dm, b: tr, c: ci, e: sq } = sol[0];
  if (sol.length !== 1) throw new Error('symbols not unique');
  lv('Symbol Swap', 'Symbol substitution', 'Four glyphs stand for four different single-digit numbers.', [
    ['◆ + ◆ + ◆ = 9', null], ['◆ + ▲ = 8', null], ['▲ x ● = 10', null], ['■ - ● = 5', null],
    ['The code is the glyph sequence ■ ◆ ▲ ● ● ◆ translated into digits.', (d) => d[0] === sq && d[1] === dm && d[2] === tr && d[3] === ci && d[4] === ci && d[5] === dm],
  ], 'Solve ◆ first: three of them make 9.', '◆ = 3, so ▲ = 5. Then ● and ■ follow.', [`◆=${dm}, ▲=${tr}, ●=${ci}, ■=${sq}.`, `Code: ${[sq, dm, tr, ci, ci, dm].join('')}.`]);
}

lv('Mini Sudoku', 'Constraint satisfaction', 'A 4 x 4 grid must hold 1 to 4 in every row, column and 2 x 2 box.', [
  ['Fill the blanks (_) so every row, every column and every 2 x 2 box contains 1, 2, 3 and 4 once.', (d) => {
    const g = [[1, d[1], 3, d[4]], [d[0], 4, 1, d[5]], [2, 1, d[3], 3], [4, d[2], 2, 1]];
    if (d.some((x) => x < 1 || x > 4)) return false;
    for (let i = 0; i < 4; i++) {
      if (new Set(g[i]).size !== 4) return false;
      if (new Set([g[0][i], g[1][i], g[2][i], g[3][i]]).size !== 4) return false;
    }
    for (const [r, c] of [[0, 0], [0, 2], [2, 0], [2, 2]]) if (new Set([g[r][c], g[r][c + 1], g[r + 1][c], g[r + 1][c + 1]]).size !== 4) return false;
    return true;
  }],
  ['The code is the six blanks read column by column, each column top to bottom, columns left to right.', () => true],
], 'Start with the row that has two blanks and the column that constrains them.', 'Row 1 needs 2 and 4, but the 4 in column 2 forbids 4 in the second cell.',
  ['Solution grid rows: 1234 / 3412 / 2143 / 4321.', 'Reading blanks by column: 3 | 2, 3 | 4 | 4, 2.', 'Code: 323442.'],
  { visuals: [{ title: 'Grid', lines: ['1 _ 3 _', '_ 4 1 _', '2 1 _ 3', '4 _ 2 1'] }] });

lv('Order of Operations', 'Order of operations', 'The vault applies multiplication before addition, and the rules matter.', [
  ['First pair: 8 + 4 x 3.', (d) => pr(d, 0) === 8 + 4 * 3],
  ['Middle pair: (8 + 4) x 3.', (d) => pr(d, 1) === (8 + 4) * 3],
  ['Last pair: 2 + 3^2 x 2 - 4 / 2.', (d) => pr(d, 2) === 2 + 3 ** 2 * 2 - 4 / 2],
], 'Brackets first, then powers, then multiplication and division, then addition and subtraction.', '3^2 = 9, then 9 x 2 = 18, then 4 / 2 = 2.', ['8 + 12 = 20.', '12 x 3 = 36.', '2 + 18 - 2 = 18.']);

lv('Digit Chain', 'Rule chains', 'Each digit depends on the ones before it.', [
  ['The first digit is the number of vertices of a tetrahedron.', (d) => d[0] === 4],
  ['The second digit is twice the first digit, minus 3.', (d) => d[1] === 2 * d[0] - 3],
  ['The third digit is the remainder when the sum of the first two digits is divided by 7.', (d) => d[2] === (d[0] + d[1]) % 7],
  ['The fourth digit is the last digit of the second digit times the third digit.', (d) => d[3] === (d[1] * d[2]) % 10],
  ['The fifth digit is the difference between the first and fourth digits (ignoring sign) plus the third digit.', (d) => d[4] === Math.abs(d[0] - d[3]) + d[2]],
  ['The last digit is the last digit of the sum of all five earlier digits.', (d) => d[5] === (d[0] + d[1] + d[2] + d[3] + d[4]) % 10],
], 'A tetrahedron has 4 corners. Build from the left.', '4, then 2 x 4 - 3 = 5, then (4 + 5) mod 7.', ['4, 5, 2, 0, 6, 7.', 'Code: 452067.']);

{
  const secret = '804913';
  const S = [...secret].map(Number);
  const bulls = (a, b) => { let c = 0; for (let i = 0; i < 6; i++) if (a[i] === b[i]) c++; return c; };
  let pool = [];
  for (let n = 0; n < 1e6; n++) { const s = String(n).padStart(6, '0'); if (new Set(s).size === 6) pool.push([...s].map(Number)); }
  const r = rng(51); const guesses = [];
  while (pool.length > 1 && guesses.length < 14) {
    let best = null, bs = Infinity;
    for (let t = 0; t < 12; t++) {
      const g = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => r() - 0.5).slice(0, 6);
      const b = Array(7).fill(0); for (const c of pool) b[bulls(g, c)]++;
      const sc = Math.max(...b); if (sc < bs) { bs = sc; best = g; }
    }
    const fb = bulls(best, S); pool = pool.filter((c) => bulls(best, c) === fb); guesses.push([best, fb]);
  }
  if (pool.length !== 1) throw new Error('mastermind did not converge');
  lv('Hit Count', 'Deduction', 'A code-breaking machine logged earlier attempts. Each shows how many digits were correct AND in the right place.', [
    ['The code uses six different digits.', (d) => new Set(d).size === 6],
    ...guesses.map(([g, fb], i) => [`Attempt ${i + 1}: ${g.join('')}  ->  ${fb} digit${fb === 1 ? ' is' : 's are'} in the right place.`, (d) => bulls(g, d) === fb]),
  ], 'Attempts with 0 hits tell you which digits are NOT in which positions.', 'Combine attempts: a position can only hold one digit, and all six digits differ.',
    [`The code consistent with every attempt is ${secret}.`, 'Eliminate digits per position using the 0-hit attempts, then count hits in the others.']);
}

lv('Roman Numerals', 'Symbol substitution', 'Roman inscriptions cover the vault walls.', [
  ['First pair: XLVII.', (d) => pr(d, 0) === 47],
  ['Middle pair: LXXXIII.', (d) => pr(d, 1) === 83],
  ['Last pair: the last two digits of the year MMXXIV.', (d) => pr(d, 2) === 24],
], 'XL = 40, L = 50, X = 10, C = 100, M = 1000.', 'XLVII = 40 + 5 + 2. LXXXIII = 50 + 30 + 3. MMXXIV = 2000 + 24.', ['47, 83, 24.']);

{
  // Islanders: knight (always truthful) or knave (always lies). A digit is 0 for a knave, or the islander's position (1..6) for a knight.
  const ok = (d) => {
    const k = [];
    for (let i = 0; i < 6; i++) { if (d[i] !== 0 && d[i] !== i + 1) return false; k.push(d[i] !== 0); }
    // island 1 (A,B,C): A: "A and B are the same type"; B: "C is a knave"; C: "A is a knight"
    const a = k.slice(0, 3);
    const s1 = [a[0] === a[1], !a[2], a[0]];
    // island 2 (D,E,F): D: "F is a knave"; E: "D and F are the same type"; F: "E is a knight"
    const b = k.slice(3);
    const s2 = [!b[2], b[0] === b[2], b[1]];
    return [...s1, ...s2].every((x, i) => x === k[i]);
  };
  lv('Knights and Knaves', 'Truth and lies', 'Six islanders (A to F) are either knights, who always tell the truth, or knaves, who always lie.', [
    ['Island one. A says: "A and B are the same type." B says: "C is a knave." C says: "A is a knight."', null],
    ['Island two. D says: "F is a knave." E says: "D and F are the same type." F says: "E is a knight."', null],
    ['The code has one digit per islander, in order A to F. A knave\'s digit is 0. A knight\'s digit is the islander\'s place in the list (A = 1, B = 2, ... F = 6).', ok],
  ], 'Work out island one on its own: assume A is a knight and see what happens.', 'Whatever A is, B turns out to be a knight. Then C is a knave, and A must be a knave too.',
    ['Island one: A knave, B knight, C knave. Island two: D knight, E knave, F knave.', 'Digits: A=0, B=2, C=0, D=4, E=0, F=0.', 'Code: 020400.']);
}

lv('Product of Pairs', 'Number theory', 'Two sealed numbers multiply to a famous value.', [
  ['The first pair times the middle pair equals 1296.', (d) => pr(d, 0) * pr(d, 1) === 1296],
  ['The middle pair is four times the first pair.', (d) => pr(d, 1) === 4 * pr(d, 0)],
  ['The last pair is the number of positive divisors of 1296.', (d) => pr(d, 2) === 25],
], 'Replace the middle pair by 4 x first.', 'So 4 x first^2 = 1296. For divisors, factor 1296 = 6^4.', ['first^2 = 324, first = 18, middle = 72.', '1296 = 2^4 x 3^4 has 5 x 5 = 25 divisors.']);

lv('Letter Equations', 'Algebra', 'Six letters stand for six digits.', [
  ['A + B = 11', null], ['B + C = 9', null], ['C + D = 8', null], ['D + E = 10', null], ['E + F = 13', null], ['F = 7', null],
  ['The code is the digits of A, B, C, D, E, F in that order.', (d) => d[0] + d[1] === 11 && d[1] + d[2] === 9 && d[2] + d[3] === 8 && d[3] + d[4] === 10 && d[4] + d[5] === 13 && d[5] === 7],
], 'F is known, so work backwards.', 'E = 13 - 7 = 6, then D = 10 - 6.', ['F=7, E=6, D=4, C=4, B=5, A=6.', 'Code: 654467.']);

{
  const noise = 'ab3de7fo2gi9hu4ij1ka5ez8pa6';
  const vals = [...noise.matchAll(/[aeiou](\d)/g)].map((m) => Number(m[1]));
  lv('Noise Filter', 'Hidden patterns', 'A string of random characters scrolls past: ab3de7fo2gi9hu4ij1ka5ez8pa6', [
    ['Only digits that come immediately after a vowel (a, e, i, o, u) belong to the code. Take them in order.', (d) => d.every((x, i) => x === vals[i])],
  ], 'Ignore digits that follow a consonant.', 'Scan for a vowel followed directly by a digit.', [`Digits after vowels: ${vals.join(', ')}.`]);
}

lv('Calculator Trail', 'Multi-step calculation', 'The vault gives a starting number and a list of instructions.', [
  ['Start with 7. Multiply by 8. That result is the first pair.', (d) => pr(d, 0) === 56],
  ['Subtract 6, then divide by 5. That result is the middle pair.', (d) => pr(d, 1) === 10],
  ['Square the middle pair, then subtract the first pair. That result is the last pair.', (d) => pr(d, 2) === 44],
], 'Follow the instructions in order.', '56 - 6 = 50, 50 / 5 = 10, 10^2 = 100.', ['56, 10, and 100 - 56 = 44.']);

lv('Triangular Vault', 'Sequences', 'Triangular numbers are 1, 3, 6, 10, 15, 21, ... Each is the sum of 1 up to n.', [
  ['First pair: the 8th triangular number.', (d) => pr(d, 0) === 36],
  ['Middle pair: the 10th triangular number.', (d) => pr(d, 1) === 55],
  ['Last pair: the 12th triangular number minus the 9th.', (d) => pr(d, 2) === 78 - 45],
], 'The nth triangular number is n(n+1)/2.', 'T12 - T9 = 10 + 11 + 12.', ['T8 = 36, T10 = 55, T12 - T9 = 33.']);

lv('Two Voices', 'Interleaved sequences', 'Two sequences are woven together: 2, 100, 4, 90, 8, 80, 16, 70, ...', [
  ['Every other term belongs to the same sequence. The code is the next three terms as pairs.', (d) => pr(d, 0) === 32 && pr(d, 1) === 60 && pr(d, 2) === 64],
], 'Separate odd-numbered terms from even-numbered terms.', 'One sequence doubles. The other drops by 10.', ['Doubling: 2, 4, 8, 16, 32, 64. Decreasing: 100, 90, 80, 70, 60.', 'Next terms: 32, 60, 64.']);

{
  const word = caesar('WKUHH', -3);
  lv('The Deceiver', 'Multi-step deception', 'The last gate of the chapter is guarded by a master of misdirection. Trust only what is VERIFIED.', [
    ['[VERIFIED] Undo a shift of 3 on WKUHH. The word names a number. The first pair is that number times nine.', (d) => word === 'THREE' && pr(d, 0) === 27],
    ['[VERIFIED] The middle pair is binary 101101 minus the first pair.', (d) => pr(d, 1) === parseInt('101101', 2) - pr(d, 0)],
    ['[VERIFIED] The last pair is the number of letters in the decoded word, times the middle pair.', (d) => pr(d, 2) === 5 * pr(d, 1)],
    ['[UNVERIFIED] The code ends with a 5.', null],
    ['[UNVERIFIED] The first pair is 36.', null],
  ], 'Decode the word first. It names a number.', 'THREE is 3. Binary 101101 is 32 + 8 + 4 + 1.', ['WKUHH shifted back 3 is THREE, so the first pair is 3 x 9 = 27.', '101101 is 45, so the middle pair is 45 - 27 = 18.', 'THREE has 5 letters: 5 x 18 = 90. Code: 27 18 90.']);
}
