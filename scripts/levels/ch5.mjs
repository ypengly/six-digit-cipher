import { lv, P, pr, sum, pad, isPrime, caesar, atbash, a1z26, numWord } from './kit.mjs';

// ---- Chapter 5: The Final Cipher (levels 81-100) ----
{
  const plain = 'FACADE';
  const cipher = atbash(caesar(plain, 5));
  const exp = a1z26(plain);
  lv('Double Lock', 'Layered ciphers', `Two locks guard one word: ${cipher}.`, [
    ['Step 1: the word was first shifted forward 5 places in the alphabet, then written in a mirrored alphabet (A <-> Z, B <-> Y, ...). Undo both, in the right order.', () => true],
    ['Step 2: turn the real word into numbers (A = 1 ... I = 9). Those digits are the code.', (d) => d.every((x, i) => x === exp[i])],
  ], 'The last thing done to the word must be undone first.', 'Undo the mirror alphabet first: P becomes K. Then shift back 5.', [`Mirror undone: ${atbash(cipher)}. Shift undone: ${plain}.`, `Letters to numbers: ${exp.join('')}.`]);
}

{
  const S = 'A guard quietly polishes the silver key before dawn';
  const w = S.split(' ');
  const a = w.length, b = Math.max(...w.map((x) => x.length)), c = (a * b) / 2;
  lv('Cross Reference', 'Cross-referenced clues', 'Three clues all point at the same sentence, and at each other.', [
    ['Sentence S: "A guard quietly polishes the silver key before dawn."', null],
    ['Clue 1: The first pair is the number of words in sentence S.', (d) => pr(d, 0) === a],
    ['Clue 2: The middle pair is the number of letters in the longest word of sentence S.', (d) => pr(d, 1) === b],
    ['Clue 3: The last pair is Clue 1\'s answer times Clue 2\'s answer, divided by two.', (d) => pr(d, 2) * 2 === pr(d, 0) * pr(d, 1)],
  ], 'Clue 3 uses the answers to Clues 1 and 2.', 'Count words, find the longest word, then compute.', [`Words: ${a}. Longest word: ${b} letters.`, `${a} x ${b} / 2 = ${c}.`, `Code: ${pad(a)}${pad(b)}${pad(c)}.`]);
}

{
  const rowsA = ['■□■', '■■■', '□□■'];
  const showB = ['■■■', '■■□', '■□□']; // panel B as shown, turned a quarter turn clockwise
  const unturn = showB.map((_, r) => [...showB].map((__, c) => showB[c][2 - r]).join(''));
  const rows = (g) => g.map((r) => [...r].filter((x) => x === '■').length);
  const cols = (g) => [0, 1, 2].map((c) => g.filter((r) => r[c] === '■').length);
  const exp = [...rows(rowsA), ...cols(unturn)];
  lv('Three Panels', 'Multi-panel visual', 'Two panels (■ = filled, □ = empty) feed one code.', [
    ['Panel A is shown as it is. The first three digits are the number of filled cells in each row of Panel A, top to bottom.', (d) => d.slice(0, 3).every((x, i) => x === exp[i])],
    ['Panel B has been turned a quarter turn clockwise. Turn it back (a quarter turn counter-clockwise). The last three digits are the number of filled cells in each column of the restored Panel B, left to right.', (d) => d.slice(3).every((x, i) => x === exp[3 + i])],
  ], 'Panel A is straightforward: count per row.', 'Rotating Panel B back counter-clockwise turns its top row into the left column.', [`Rows of A: ${rows(rowsA).join(', ')}. Restored B: ${unturn.join(' / ')}. Columns of B: ${cols(unturn).join(', ')}.`, `Code: ${exp.join('')}.`],
    { visuals: [{ title: 'Panel A', lines: rowsA }, { title: 'Panel B (turned)', lines: showB }] });
}

lv('Rules of Engagement', 'Strict constraints', 'Eight strict rules shape a single code.', [
  ['All six digits are different.', (d) => new Set(d).size === 6],
  ['Odd and even digits alternate, starting with an odd digit.', (d) => d.every((x, i) => x % 2 === (i % 2 === 0 ? 1 : 0))],
  ['No digit is larger than 8.', (d) => d.every((x) => x <= 8)],
  ['The six digits add up to 25.', (d) => sum(d) === 25],
  ['The three even digits add up to 10.', (d) => d[1] + d[3] + d[5] === 10],
  ['The odd digits increase from left to right.', (d) => d[0] < d[2] && d[2] < d[4]],
  ['Neighbouring digits differ by at least 3.', (d) => [0, 1, 2, 3, 4].every((i) => Math.abs(d[i] - d[i + 1]) >= 3)],
  ['The last digit is larger than the fourth digit.', (d) => d[5] > d[3]],
], 'The odd digits add up to 15. Which increasing triples from 1, 3, 5, 7 do that?', 'The odd digits are 3, 5, 7. Now use the neighbour rule to place the even digits.', ['Odd digits 3, 5, 7. Even digits sum to 10 from {0, 2, 8} or {0, 4, 6}.', 'Neighbour gaps force 8 between 3 and 5, and 0 or 2 between 5 and 7; the last rule picks 0 then 2.', 'Code: 385072.']);

{
  const f = (n) => (7 * n) % 10;
  lv('The Machine', 'Hidden rules', 'A machine takes a number in and prints a digit out. It always follows the same hidden rule.', [
    ['Examples: 1 -> 7, 2 -> 4, 3 -> 1, 4 -> 8, 12 -> 4, 20 -> 0.', null],
    ['Feed the machine 5, 6, 7, 8, 9 and 10. The six digits it prints, in order, are the code.', (d) => d.every((x, i) => x === f(i + 5))],
  ], 'Look at how the output changes when the input goes up by one.', 'The outputs drop by 3 (mod 10) each time: the rule multiplies by 7 and keeps the last digit.', [`Rule: last digit of 7 x n.`, `Outputs for 5 to 10: ${[5, 6, 7, 8, 9, 10].map(f).join(', ')}.`]);
}

{
  const total = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].reduce((a, n) => a + numWord(n).length, 0);
  const five = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter((n) => numWord(n).length === 5).reduce((a, b) => a + b, 0);
  const l3 = numWord(total + five).replace('-', '').length;
  lv('Spelling Sums', 'Mixed maths and language', 'Numbers can be counted by value and by spelling.', [
    ['First pair: the total number of letters used when writing out ONE, TWO, ... up to TEN in English.', (d) => pr(d, 0) === total],
    ['Middle pair: the sum of those numbers from 1 to 10 whose English names have exactly five letters.', (d) => pr(d, 1) === five],
    ['Last pair: the number of letters (no hyphen) in the English name of first pair plus middle pair.', (d) => pr(d, 2) === l3],
  ], 'Write the ten words and count: ONE has 3 letters.', 'Five-letter names: THREE, SEVEN, EIGHT.', [`Letters: ${total}. Five-letter numbers: 3 + 7 + 8 = ${five}.`, `${total} + ${five} = ${total + five}: "${numWord(total + five)}" has ${l3} letters.`]);
}

{
  const val = a1z26('LOGIC').reduce((a, b) => a + b, 0);
  const bits = val.toString(2);
  const exp = [...bits].map((b) => (b === '1' ? 7 : 2));
  lv('Three Stages', 'Layered reasoning', 'A single word passes through three machines.', [
    ['Stage 1: add up the letter values of LOGIC (A = 1 ... Z = 26).', () => true],
    ['Stage 2: write that sum in binary.', () => true],
    ['Stage 3: replace every 1 in the binary number with 7 and every 0 with 2. The result is the code.', (d) => d.length === bits.length && d.every((x, i) => x === exp[i])],
  ], 'L + O + G + I + C.', '46 in binary: 32 + 8 + 4 + 2.', [`LOGIC = ${val}.`, `${val} in binary = ${bits}.`, `Substitution gives ${exp.join('')}.`]);
}

lv('Prime Neighbours', 'Adversarial constraints', 'Six digits, a long list of possibilities, and one survivor.', [
  ['Use each digit 0, 1, 2, 3, 4, 5 exactly once.', (d) => [...d].sort().join('') === '012345'],
  ['The sum of every two neighbouring digits is a prime number.', (d) => [0, 1, 2, 3, 4].every((i) => isPrime(d[i] + d[i + 1]))],
  ['The code starts with 5 and ends with 0.', (d) => d[0] === 5 && d[5] === 0],
], 'Which digits can sit next to 1? Which can sit next to 4?', 'List allowed neighbours: 1 next to 2 or 4 only; 4 next to 1 or 3 only.', ['5 must be followed by 2 (since 5 + 0 would end too early).', 'Then 2-1, 1-4, 4-3, 3-0 all give prime sums.', 'Code: 521430.']);

{
  const dates = [[5, 15], [5, 16], [5, 19], [6, 17], [6, 18], [7, 14], [7, 16], [8, 14], [8, 15], [8, 17]];
  const count = (list, key, v) => list.filter((x) => x[key] === v).length;
  const s1 = dates.filter(([m]) => dates.filter((x) => x[0] === m).every(([, dd]) => count(dates, 1, dd) > 1));
  const s2 = s1.filter(([, dd]) => count(s1, 1, dd) === 1);
  const s3 = s2.filter(([m]) => count(s2, 0, m) === 1);
  if (s3.length !== 1) throw new Error('birthday not unique');
  const exp = `${s1.length}${s2.length}${pad(s3[0][0])}${pad(s3[0][1])}`;
  lv('Cheryl\'s Birthday', 'Knowledge logic', 'Two friends are told one part of a secret date. Albert hears the month, Bernard the day. The possible dates: May 15, 16, 19; June 17, 18; July 14, 16; August 14, 15, 17.', [
    ['Albert: "I don\'t know the date, and I know Bernard doesn\'t either."', null],
    ['Bernard: "At first I didn\'t know, but now I do."', null],
    ['Albert: "Now I know too."', null],
    ['The code is: the number of dates left after Albert\'s first statement (one digit), the number left after Bernard\'s statement (one digit), then the secret date as month (two digits) and day (two digits).', (d) => d.join('') === exp],
  ], 'A day that appears only once would let Bernard know immediately.', 'Albert knowing that Bernard doesn\'t know means his month contains no unique day.', ['Unique days: 18 and 19, so May and June go. Five dates remain.', 'Bernard now knows, so the day cannot repeat: 14 goes. Three dates remain.', 'Albert now knows, so July 16. Code: 5 3 07 16.']);
}

{
  let sol = null;
  const letters = ['S', 'E', 'N', 'D', 'M', 'O', 'R', 'Y'];
  const used = Array(10).fill(false); const m = {};
  const go = (i) => {
    if (i === 8) { const v = (w) => [...w].reduce((a, c) => a * 10 + m[c], 0); if (m.S && m.M && v('SEND') + v('MORE') === v('MONEY')) { if (sol) throw new Error('alphametic ambiguous'); sol = { ...m }; } return; }
    for (let x = 0; x < 10; x++) if (!used[x]) { used[x] = true; m[letters[i]] = x; go(i + 1); used[x] = false; }
  };
  go(0);
  const exp = ['M', 'O', 'N', 'E', 'Y', 'D'].map((c) => sol[c]);
  lv('Sum of Letters', 'Alphametic', 'Every letter in the sum below stands for a different digit, and no number starts with 0.', [
    ['SEND + MORE = MONEY', null],
    ['The code is the digits for M, O, N, E, Y, D, in that order.', (d) => d.every((x, i) => x === exp[i])],
  ], 'MONEY has one more digit than SEND or MORE. What must M be?', 'M = 1. Then look at the thousands column to find O.', [`S=${sol.S}, E=${sol.E}, N=${sol.N}, D=${sol.D}, M=${sol.M}, O=${sol.O}, R=${sol.R}, Y=${sol.Y}.`, `Code: ${exp.join('')}.`]);
}

{
  const dec = parseInt('C0FFE', 16);
  const rev = String(dec).split('').reverse().join('');
  lv('Hex and Back', 'Base conversion', 'A hexadecimal word glows on the final panel: C0FFE.', [
    ['Convert the hexadecimal number C0FFE to ordinary decimal (A = 10, B = 11, ... F = 15).', () => true],
    ['Write the decimal digits in reverse order. That is the code.', (d) => d.join('') === rev],
  ], 'C0FFE has five hex digits. The first is worth 16^4.', 'C = 12, F = 15, E = 14. Multiply each by its power of 16 and add.', [`C0FFE = ${dec}.`, `Reversed: ${rev}.`]);
}

{
  const p = { 1: 3, 2: 1, 3: 5, 4: 2, 5: 6, 6: 4 };
  let a = [4, 8, 1, 7, 2, 9];
  for (let k = 0; k < 3; k++) { const b = Array(6).fill(0); for (let i = 1; i <= 6; i++) b[p[i] - 1] = a[i - 1]; a = b; }
  lv('Shuffle Machine', 'Permutations', 'A shuffler moves the digits of 4 8 1 7 2 9 around in a fixed pattern.', [
    ['One shuffle moves the digit in position 1 to position 3, position 2 to 1, position 3 to 5, position 4 to 2, position 5 to 6 and position 6 to 4.', null],
    ['Apply the shuffle three times in a row to 4 8 1 7 2 9. The final arrangement is the code.', (d) => d.every((x, i) => x === a[i])],
  ], 'Do one shuffle at a time on paper.', 'Follow one digit: 1 goes 1 -> 3 -> 5 -> 6 -> 4 -> 2 -> 1. The cycle has length 6.', [`After three shuffles the digits are ${a.join(' ')}.`]);
}

lv('Magic Digits', 'Constraint grids', 'A 3 x 3 magic square uses each digit 1 to 9 once, and every row, column and diagonal adds up to the same number. Three cells are known.', [
  ['Complete the square. The code is the six blank cells read left to right, top to bottom.', (d) => {
    const g = [[2, d[0], 6], [d[1], d[2], d[3]], [d[4], 3, d[5]]];
    const flat = g.flat(); if (new Set(flat).size !== 9 || flat.some((x) => x < 1 || x > 9)) return false;
    const L = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    return L.every(([a, b, c]) => flat[a] + flat[b] + flat[c] === 15);
  }],
], 'The magic total of a 3 x 3 square with 1 to 9 is 15.', 'The top row is 2, ?, 6 so the middle top cell must be 7. The centre must be 5.', ['Top row 2, 7, 6. Centre 5.', 'Square: 2 7 6 / 9 5 1 / 4 3 8.', 'Blanks in order: 7, 9, 5, 1, 4, 8.'],
  { visuals: [{ title: 'Square', lines: ['2 _ 6', '_ _ _', '_ 3 _'] }] });

lv('Seating Plan', 'Constraint satisfaction', 'Six guests, A to F, must be seated in seats 1 to 6. The code gives the seat number of A, then B, then C, then D, then E, then F.', [
  ['B sits in the last seat (seat 6).', (d) => d[1] === 6],
  ['A sits in an odd-numbered seat, and D sits in the seat directly after A.', (d) => d[0] % 2 === 1 && d[3] === d[0] + 1],
  ['E sits directly between C and A (all three side by side).', (d) => Math.abs(d[2] - d[0]) === 2 && d[4] * 2 === d[2] + d[0]],
  ['F sits somewhere after D.', (d) => d[5] > d[3]],
  ['Every seat is used exactly once.', (d) => [...d].sort().join('') === '123456'],
], 'Treat "A then D" as a block, and "C, E, A" as another.', 'D directly after A means E cannot be on A\'s right. So the order is C, E, A, D.', ['Block: C E A D. B takes seat 6, so the block fits seats 1-4 or 2-5.', 'F must be after D, so the block is in seats 1-4 and F sits in seat 5.', 'Seats: A3, B6, C1, D4, E2, F5. Code: 361425.']);

lv('Rule Table', 'Hidden rules', 'A table links two inputs to an output with one consistent rule.', [
  ['(1, 2) -> 3,  (2, 3) -> 7,  (3, 4) -> 13,  (4, 5) -> 21', null],
  ['The code lists the outputs for (5, 6), (6, 7) and (7, 8), each as a pair.', (d) => pr(d, 0) === 31 && pr(d, 1) === 43 && pr(d, 2) === 57],
], 'Compare each output with the first input squared.', 'Output = first input squared plus second input.', ['5^2 + 6 = 31, 6^2 + 7 = 43, 7^2 + 8 = 57.']);

{
  const seg = [6, 2, 5, 5, 4, 5, 6, 3, 7, 6];
  lv('Seven-Segment Ghost', 'Constraint satisfaction', 'A seven-segment display flickers. You can only tell how many segments are lit per digit: 6, 2, 5, 5, 6, 3 (in order).', [
    ['The display shows 6, 2, 5, 5, 6 and 3 lit segments for the six digits. (Digit 0 uses 6, 1 uses 2, 2, 3 and 5 use 5, 4 uses 4, 6 and 9 use 6, 7 uses 3, 8 uses 7.)', (d) => d.every((x, i) => seg[x] === [6, 2, 5, 5, 6, 3][i])],
    ['All six digits are different.', (d) => new Set(d).size === 6],
    ['The code contains exactly one even digit.', (d) => d.filter((x) => x % 2 === 0).length === 1],
    ['The digits add up to 31.', (d) => sum(d) === 31],
    ['The fifth digit is greater than the first.', (d) => d[4] > d[0]],
    ['The third digit is smaller than the fourth.', (d) => d[2] < d[3]],
  ], 'Only digit 1 uses 2 segments, and only 7 uses 3.', 'The second digit is 1 and the last is 7. The other digits come from {0, 6, 9} and {2, 3, 5}.', ['Digit 2 = 1, digit 6 = 7. Positions 1 and 5 are from {0, 6, 9}; positions 3 and 4 from {2, 3, 5}.', 'Sum gives 3 and 5 in the middle (increasing), and 6, 9 on the outside.', 'Code: 613597.']);
}

lv('Between the Twins', 'Primes', 'Twin primes are primes that differ by 2, such as 41 and 43.', [
  ['Find the first three twin-prime pairs where both primes are above 40.', () => true],
  ['The code is the number sitting exactly between the two primes of each pair, as pairs.', (d) => pr(d, 0) === 42 && pr(d, 1) === 60 && pr(d, 2) === 72],
], 'Start with 41 and 43, then look for the next pair.', 'Twin pairs above 40: (41, 43), (59, 61), (71, 73).', ['Middles: 42, 60, 72.']);

{
  const sq = ['VAULT', 'BCDEF', 'GHIKM', 'NOPQR', 'SWXYZ'];
  const coord = (ch) => { for (let r = 0; r < 5; r++) { const c = sq[r].indexOf(ch); if (c >= 0) return (r + 1) * 10 + (c + 1); } };
  const word = 'HOP', cipher = caesar(word, 3);
  const exp = [...word].map(coord).join('');
  lv('Polybius Vault', 'Layered ciphers', `A keyed grid and a shifted word: ${cipher}.`, [
    [`Step 1: ${cipher} was shifted forward 3 places. Undo the shift.`, () => true],
    ['Step 2: find each letter of the real word in the grid. Write its row number then its column number (rows and columns are numbered 1 to 5). Join the pairs to make the code.', (d) => d.join('') === exp],
  ], 'First recover the word.', 'KRS shifted back 3 is HOP. H is in the third row, second column.', [`Word: ${word}.`, `H = ${coord('H')}, O = ${coord('O')}, P = ${coord('P')}. Code: ${exp}.`],
    { visuals: [{ title: 'Grid (I and J share a cell)', lines: sq.map((r) => [...r].join(' ')) }] });
}

{
  const A = [3, 5, 0, 4, 1, 2]; const out = []; let i = 0; const seen = new Set();
  while (!seen.has(i)) { seen.add(i); out.push(A[i]); i = A[i]; }
  lv('Pointer Chain', 'Hidden rules', 'Six cells hold the numbers 3, 5, 0, 4, 1, 2 in positions 0 to 5.', [
    ['Every number is a pointer to the position it names.', null],
    ['Start at position 0. Read the number there, then jump to the position it points to. Keep going until you are about to revisit a position. The numbers you read, in order, are the code.', (d) => d.every((x, k) => x === out[k])],
  ], 'Position 0 holds 3. Where does that send you?', 'Positions visited: 0, 3, 4, 1, 5, 2.', [`Numbers read: ${out.join(', ')}.`]);
}

{
  const word = caesar('VHYHQ', -3);
  lv('The Final Cipher', 'Master puzzle', 'The last vault door has four chambers, and each one tests a different skill from your journey.', [
    ['Chamber of Ciphers: undo a shift of 3 on VHYHQ. The word names a number. That number is the first digit.', (d) => word === 'SEVEN' && d[0] === 7],
    ['Chamber of Sequences: continue 7, 11, 19, 35, ... by one term. Digits two and three are that term (two digits).', (d) => pr(d, 0) !== 0 && d[1] * 10 + d[2] === 67],
    ['Chamber of Bases: digits four and five are the value of hexadecimal 1F in ordinary decimal.', (d) => d[3] * 10 + d[4] === parseInt('1F', 16)],
    ['Chamber of Logic: the last digit is the number of TRUE statements among these four: (i) the first digit is prime; (ii) the second digit is larger than the third; (iii) the fourth and fifth digits add up to 4; (iv) the code reads the same backwards.', (d) => {
      const t = [isPrime(d[0]), d[1] > d[2], d[3] + d[4] === 4, d[0] === d[5] && d[1] === d[4] && d[2] === d[3]].filter(Boolean).length; return d[5] === t; }],
  ], 'Each chamber fixes a different part of the code. Do them in order.', 'Sequence gaps double: +4, +8, +16, so the next gap is +32. 1F in hex is 16 + 15.', ['SEVEN gives 7.', '35 + 32 = 67; hex 1F = 31.', 'True statements: (i) yes, (ii) no, (iii) yes, (iv) no, so 2. Code: 767312.']);
}
