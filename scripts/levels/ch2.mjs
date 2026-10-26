import { lv, P, pr, sum, pad, isPrime, nextPrime, prevPrime, nthPrime, isSquare, a1z26 } from './kit.mjs';

// ---- Chapter 2: The Analyst (levels 21-40) ----
lv('Prime Pairs', 'Primes', 'Three prime numbers are etched into the vault wall.', [
  P(0, nthPrime(10), 'First pair: the 10th prime number (2 is the 1st).'),
  P(1, prevPrime(50), 'Middle pair: the largest prime below 50.'),
  P(2, nextPrime(90), 'Last pair: the smallest prime above 90.'),
], 'List primes in order: 2, 3, 5, 7, 11, ...', 'The 10th prime is 29. Check 49 and 48 for the second clue, and 91, 92... for the third.',
  ['2,3,5,7,11,13,17,19,23,29: the 10th is 29.', '49 = 7x7, so 47 is the largest prime below 50.', '91 = 7x13, 92 to 96 are composite, so 97.']);

lv('Reflected Sums', 'Reversed digits', 'The vault displays a number and its reflection.', [
  ['The last pair is the first pair with its digits reversed.', (d) => d[4] === d[1] && d[5] === d[0]],
  ['The middle pair is the sum of the first pair and the last pair.', (d) => pr(d, 1) === pr(d, 0) + pr(d, 2)],
  ['The first pair is a multiple of 7 whose digits add up to 8.', (d) => pr(d, 0) % 7 === 0 && d[0] + d[1] === 8],
], 'List the two-digit multiples of 7 and check their digit sums.', 'Only one multiple of 7 has digit sum 8. Reverse it, then add.',
  ['Multiples of 7: ..., 28, 35, 42, ... Only 35 has digits adding to 8.', 'Reversed: 53. Sum: 35 + 53 = 88.', 'Code: 35 88 53.']);

lv('Remainders', 'Modular arithmetic', 'Each pair of the lock reacts to remainders.', [
  ['The first pair leaves remainder 3 when divided by 7, is odd, and lies between 50 and 60.', (d) => { const v = pr(d, 0); return v % 7 === 3 && v % 2 === 1 && v > 50 && v < 60; }],
  ['The middle pair leaves remainder 4 when divided by 9, is a multiple of 5, and is below 50.', (d) => { const v = pr(d, 1); return v % 9 === 4 && v % 5 === 0 && v < 50; }],
  ['The last pair leaves remainder 5 when divided by 12 and lies between 20 and 40.', (d) => { const v = pr(d, 2); return v % 12 === 5 && v > 20 && v < 40; }],
], 'Take one pair at a time and list candidates.', 'Numbers with remainder 5 mod 12 are 5, 17, 29, 41. For mod 9 remainder 4: 4, 13, 22, 31, 40, 49.',
  ['Between 50 and 60 with remainder 3 mod 7: 52, 59. Odd leaves 59.', 'Multiples of 5 below 50 with remainder 4 mod 9: 40.', '5 mod 12 between 20 and 40: 29.']);

lv('Last Train', 'Clock logic', 'A departure board is the only clue in the vault.', [
  ['The train leaves at 09:45 and the journey takes 3 hours 50 minutes.', () => true],
  ['The first pair is the arrival hour on a 24-hour clock.', (d) => pr(d, 0) === 13],
  ['The middle pair is the arrival minute.', (d) => pr(d, 1) === 35],
  ['The last pair is the last two digits of the journey length in minutes.', (d) => pr(d, 2) === 30],
], 'Add the hours and minutes separately, then carry.', '9:45 + 3:50: 45 + 50 = 95 minutes = 1 hour 35. The journey is 3 x 60 + 50 minutes.',
  ['09:45 + 3:50 = 13:35.', 'Journey: 230 minutes, so the last two digits are 30.']);

lv('The Fourth Monday', 'Calendar', 'A torn calendar page has only one clue: the 5th of this 30-day month is a Monday.', [
  ['First pair: the date of the 4th Monday.', (d) => pr(d, 0) === 26],
  ['Middle pair: the date of the last Friday.', (d) => pr(d, 1) === 30],
  ['Last pair: the number of Mondays in the month.', (d) => pr(d, 2) === 4],
], 'If the 5th is a Monday, so is every date 7 days later (and earlier).', 'Mondays: 5, 12, 19, 26. Fridays fall 4 days after Mondays.',
  ['Mondays: 5, 12, 19, 26: the 4th is 26.', 'Fridays: 2, 9, 16, 23, 30: the last is 30.', 'Four Mondays: 04.']);

{
  const v = (w) => a1z26(w).reduce((a, b) => a + b, 0);
  lv('Letter Values', 'Letter encoding', 'The vault speaks in letters, but listens in numbers. A = 1, B = 2, ... Z = 26.', [
    ['First pair: the sum of the letter values of DOG.', (d) => pr(d, 0) === v('DOG')],
    ['Middle pair: the sum of the letter values of CAT.', (d) => pr(d, 1) === v('CAT')],
    ['Last pair: the first pair minus the middle pair.', (d) => pr(d, 2) === pr(d, 0) - pr(d, 1)],
  ], 'Convert each letter to its position in the alphabet.', 'D=4, O=15, G=7. C=3, A=1, T=20.',
    [`DOG = 4 + 15 + 7 = ${v('DOG')}.`, `CAT = 3 + 1 + 20 = ${v('CAT')}.`, `Difference: ${v('DOG') - v('CAT')}, written 02.`]);
}

lv('If and Only If', 'Conditionals', 'Each guard on the wall has a conditional statement.', [
  ['The first two digits add up to 9 and multiply to 14.', (d) => d[0] + d[1] === 9 && d[0] * d[1] === 14],
  ['If the first digit is larger than the second, the third digit is 0. Otherwise the third digit is 5.', (d) => (d[0] > d[1] ? d[2] === 0 : d[2] === 5)],
  ['The second digit is odd.', (d) => d[1] % 2 === 1],
  ['The fourth digit is the third digit minus the first digit.', (d) => d[3] === d[2] - d[0]],
  ['The last three digits count down by one, starting from the fourth digit.', (d) => d[4] === d[3] - 1 && d[5] === d[4] - 1],
], 'Which pairs of digits add to 9 and multiply to 14?', 'The pair is 2 and 7 in some order. The odd second digit settles the order.',
  ['2 and 7 fit; the second digit is odd, so the first two are 2, 7.', '2 < 7, so the third digit is 5.', 'Fourth: 5 - 2 = 3, then 2, 1. Code: 275321.']);

lv('Photo Finish', 'Ordering', 'Six runners are numbered 1 to 6. The code lists the runners in finishing order, first to last.', [
  ['Each runner 1 to 6 appears exactly once.', (d) => [...d].sort().join('') === '123456'],
  ['Runner 4 won the race.', (d) => d[0] === 4],
  ['Runner 2 finished immediately before runner 6.', (d) => d.indexOf(2) + 1 === d.indexOf(6)],
  ['Runner 5 finished ahead of runner 2.', (d) => d.indexOf(5) < d.indexOf(2)],
  ['Runner 6 finished ahead of runner 1, who finished ahead of runner 3.', (d) => d.indexOf(6) < d.indexOf(1) && d.indexOf(1) < d.indexOf(3)],
], 'Glue runners 2 and 6 together as one block.', 'Order the blocks: 5, then the 2-6 block, then 1, then 3.',
  ['Runner 4 is first.', 'Chain: 5 before (2 6) before 1 before 3.', 'Finishing order: 4 5 2 6 1 3.']);

lv('Two Truths and a Twist', 'Contradictory clues', 'Two guards speak. One of the statements looks impossible.', [
  ['Exactly one of these statements is true: (A) the first digit is 7; (B) the first digit is odd.', (d) => (d[0] === 7) !== (d[0] % 2 === 1)],
  ['The first digit is a prime number.', (d) => [2, 3, 5, 7].includes(d[0])],
  ['The first two digits add up to 10, and the second is four more than the first.', (d) => d[0] + d[1] === 10 && d[1] === d[0] + 4],
  ['The third digit is the second digit minus the first digit.', (d) => d[2] === d[1] - d[0]],
  ['The code reads the same forwards and backwards.', (d) => d[0] === d[5] && d[1] === d[4] && d[2] === d[3]],
], 'If the first digit is 7, both statements A and B are true. Is that allowed?', 'Exactly one true means the first digit is odd but not 7.',
  ['The first digit is odd, not 7, and prime: 3 or 5.', 'Sum 10 with second = first + 4: 3 and 7.', 'Third: 7 - 3 = 4. Palindrome: 374473.']);

lv('Factor Tree', 'Prime factorisation', 'A tree of factors grows from the number 360.', [
  ['The first three digits are the number 360.', (d) => d[0] === 3 && d[1] === 6 && d[2] === 0],
  ['The last three digits are the exponents of 2, 3 and 5 in the prime factorisation of 360, in that order.', (d) => d[3] === 3 && d[4] === 2 && d[5] === 1],
], 'Divide 360 by 2 until you cannot, then by 3, then by 5.', '360 = 8 x 45 = 8 x 9 x 5.',
  ['360 = 2^3 x 3^2 x 5^1.', 'Code: 360 then 3, 2, 1.']);

{
  let n = 58, steps = 0;
  const rev = (x) => Number(String(x).split('').reverse().join(''));
  while (n !== rev(n)) { n += rev(n); steps++; }
  lv('Reverse and Add', 'Reversed digits', 'The vault runs an old routine: take a number, reverse it and add.', [
    ['Start with 58. Reverse it and add. Repeat on the result until you get a palindrome.', () => true],
    ['The first three digits are the palindrome you reach.', (d) => d[0] * 100 + d[1] * 10 + d[2] === n],
    ['The last three digits are the number of additions you made, with leading zeros.', (d) => d[3] * 100 + d[4] * 10 + d[5] === steps],
  ], 'Do the first addition: 58 + 85.', '143 is not a palindrome. Reverse it and add again.',
    [`58 + 85 = 143; 143 + 341 = ${n}.`, `That took ${steps} additions: 00${steps}.`]);
}

{
  const wd = (s, k) => ((((s - 1 + k) % 7) + 7) % 7) + 1;
  lv('Weekday Arithmetic', 'Modular arithmetic', 'Days are numbered Monday = 1 up to Sunday = 7.', [
    ['First pair: the weekday number 100 days after a Wednesday.', (d) => pr(d, 0) === wd(3, 100)],
    ['Middle pair: the weekday number 365 days after a Sunday.', (d) => pr(d, 1) === wd(7, 365)],
    ['Last pair: the weekday number 1000 days before a Friday.', (d) => pr(d, 2) === wd(5, -1000)],
  ], 'Weekdays repeat every 7 days, so only the remainder mod 7 matters.', '100 mod 7 = 2, 365 mod 7 = 1, 1000 mod 7 = 6.',
    [`100 days after Wednesday: ${wd(3, 100)}.`, `365 days after Sunday: ${wd(7, 365)}.`, `1000 days before Friday: ${wd(5, -1000)}.`]);
}

{
  const key = 'ENCRYPT';
  const word = 'ENTREE';
  const digits = [...word].map((c) => key.indexOf(c) + 1);
  lv('Keyed Word', 'Letter encoding', 'A key table translates letters to digits: E=1, N=2, C=3, R=4, Y=5, P=6, T=7.', [
    ['The code spells the word ENTREE using the key table.', (d) => d.every((x, i) => x === digits[i])],
  ], 'Translate letter by letter.', 'E=1, N=2, T=7, R=4, E=1, E=1.', [`ENTREE becomes ${digits.join('')}.`]);
}

lv('Sum and Difference', 'Algebra', 'The vault shows two sealed numbers and their relationships.', [
  ['The first pair plus the middle pair equals 100.', (d) => pr(d, 0) + pr(d, 1) === 100],
  ['The first pair minus the middle pair equals 36.', (d) => pr(d, 0) - pr(d, 1) === 36],
  ['The last pair is the last two digits of the product of the first and middle pairs.', (d) => pr(d, 2) === (pr(d, 0) * pr(d, 1)) % 100],
], 'Add the two equations.', 'Adding gives 2 x first = 136.', ['First = 68, middle = 32.', '68 x 32 = 2176, so the last pair is 76.']);

lv('Fractions of Things', 'Fractions', 'Three sealed jars hold fractions of quantities.', [
  ['First pair: three eighths of 64.', (d) => pr(d, 0) === (3 * 64) / 8],
  ['Middle pair: 40 percent of 95.', (d) => pr(d, 1) === 0.4 * 95],
  ['Last pair: one seventh of 343.', (d) => pr(d, 2) === 343 / 7],
], 'Divide first, then multiply.', '64 / 8 = 8 and 95 / 5 = 19.', ['3 x 8 = 24.', '2 x 19 = 38.', '343 / 7 = 49.']);

{
  let p = 12; const out = [];
  for (const [off, on] of [[5, 8], [9, 3], [2, 14]]) { p = p - off + on; out.push(p); }
  lv('Bus Route', 'Word problems', 'A bus starts with 12 passengers. At stop 1, 5 get off and 8 get on. At stop 2, 9 get off and 3 get on. At stop 3, 2 get off and 14 get on.', [
    ['The three pairs are the number of passengers after stops 1, 2 and 3.', (d) => pr(d, 0) === out[0] && pr(d, 1) === out[1] && pr(d, 2) === out[2]],
  ], 'Update the running total after each stop.', 'Subtract those getting off, add those getting on.', [`Totals: ${out.join(', ')}.`]);
}

lv('Latin Square', 'Constraint grids', 'A 3 x 3 grid must contain 1, 2 and 3 once in every row and column.', [
  ['Fill the blanks (marked _) so each row and each column contains 1, 2 and 3 once.', (d) => {
    const g = [[1, d[0], d[1]], [d[2], 3, d[3]], [d[4], d[5], 2]];
    if (d.some((x) => x < 1 || x > 3)) return false;
    for (let i = 0; i < 3; i++) {
      if (new Set(g[i]).size !== 3) return false;
      if (new Set([g[0][i], g[1][i], g[2][i]]).size !== 3) return false;
    }
    return true;
  }],
  ['The code is the six blanks read left to right, top to bottom.', () => true],
], 'The first row already has a 1. What can the middle cell of the top row be if the centre is 3?', 'The top row needs 2 and 3. The column through the centre contains a 3.',
  ['Top row: 1, 2, 3 (the 3 can\'t sit above the central 3).', 'Middle row: 2, 3, 1. Bottom row: 3, 1, 2.', 'Blanks in order: 2, 3, 2, 1, 3, 1.'],
  { visuals: [{ title: 'Grid', lines: ['1 _ _', '_ 3 _', '_ _ 2'] }] });

{
  const rev = (n) => Number(String(n).split('').reverse().join(''));
  const emirp = (n) => isPrime(n) && isPrime(rev(n)) && rev(n) !== n;
  let a = 89; while (!emirp(a)) a--;
  let b = 31; while (!emirp(b)) b++;
  lv('Mirror Primes', 'Primes', 'Some primes stay prime in the mirror: 13 and 31, 17 and 71.', [
    ['An emirp is a prime that is a different prime when its digits are reversed.', () => true],
    ['First pair: the largest two-digit emirp below 90.', (d) => pr(d, 0) === a],
    ['Middle pair: the smallest emirp above 30.', (d) => pr(d, 1) === b],
    ['Last pair: the first pair minus the middle pair.', (d) => pr(d, 2) === a - b],
  ], 'Start at 89 and walk downward, testing the reversal.', '89 reversed is 98, which is even. Keep going.',
    [`The largest emirp below 90 is ${a}.`, `The smallest above 30 is ${b}.`, `${a} - ${b} = ${a - b}.`]);
}

lv('Balance Scale', 'Algebra', 'A scale shows animals balancing against each other.', [
  ['A cat weighs as much as three mice.', (d) => pr(d, 1) === 3 * pr(d, 0)],
  ['A dog weighs as much as two cats.', (d) => pr(d, 2) === 2 * pr(d, 1)],
  ['One dog, one cat and one mouse together weigh 70 grams.', (d) => pr(d, 0) + pr(d, 1) + pr(d, 2) === 70],
  ['The code lists the weight of a mouse, a cat and a dog in grams, as pairs.', () => true],
], 'Measure everything in mice.', 'Dog = 6 mice, cat = 3 mice, mouse = 1 mouse, so 10 mice = 70 g.', ['1 mouse = 7 g, cat = 21 g, dog = 42 g.']);

lv('The Analyst\'s Gate', 'Multi-clue deduction', 'Chapter two closes with a gate that tests primes, squares and differences together.', [
  ['The first pair and its reversal are both prime, they add up to 110, and the first pair is greater than 50.', (d) => { const v = pr(d, 0); const r = (v % 10) * 10 + Math.floor(v / 10); return isPrime(v) && isPrime(r) && v + r === 110 && v > 50; }],
  ['The middle pair is a multiple of 7, one less than a perfect square, and greater than 40.', (d) => { const v = pr(d, 1); return v % 7 === 0 && isSquare(v + 1) && v > 40; }],
  ['The last pair is the first pair minus the middle pair.', (d) => pr(d, 2) === pr(d, 0) - pr(d, 1)],
], 'A number and its reversal add to 11 times the digit sum.', 'The digits of the first pair add up to 10. Candidates: 37 and 73.',
  ['11 x (a + b) = 110 so a + b = 10; prime pairs: 37/73. Greater than 50: 73.', 'n^2 - 1 divisible by 7 and above 40: 63 (=64-1).', '73 - 63 = 10. Code: 73 63 10.']);
