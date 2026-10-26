import { lv, P, D, pr, sum, pad } from './kit.mjs';

// ---- Chapter 1: Initiation (levels 1-20) ----
lv('The Three Signals', 'Basic facts', 'An encrypted vault flickers to life and shows three signals.', [
  P(0, 64, 'First pair: the number of sides on a hexagon, followed by the number of sides on a square.'),
  P(1, 11, 'Middle pair: the smallest two-digit prime number.'),
  P(2, 6, 'Last pair: the number of hours on a clock face, minus six.'),
], 'Each clue describes one pair of digits, left to right.',
  'A hexagon has 6 sides and a square has 4. A clock face shows 12 hours. A single digit such as 6 is written 06.',
  ['A hexagon has 6 sides and a square has 4, so the first pair is 64.', 'The smallest two-digit prime is 11.', '12 - 6 = 6, written as 06.']);

lv('Seven Steps', 'Sequences', 'A counter on the wall freezes mid-count.', [
  ['The panel shows 7, 14, 21, 28. The code is the next three terms written as three pairs.', (d) => pr(d, 0) === 35 && pr(d, 1) === 42 && pr(d, 2) === 49],
], 'What is added each time?', 'The sequence rises by 7. Continue it three more times and write each term as a pair.',
  ['The sequence rises by 7 each step.', 'The next three terms are 35, 42 and 49.']);

{
  const list = [16, 25, 36, 52, 49];
  const odd = list.find((n) => !Number.isInteger(Math.sqrt(n)));
  lv('Odd One Out', 'Odd-one-out', 'Five numbered tiles hang on the door. One does not belong.', [
    ['Tiles: 16, 25, 36, 52, 49. The first pair is the tile that does not belong.', (d) => pr(d, 0) === odd],
    ['The middle pair is the digit sum of that tile, written with two digits.', (d) => pr(d, 1) === 5 + 2],
    ['The last pair is the number of tiles.', (d) => pr(d, 2) === list.length],
  ], 'Four tiles share a property. Which one breaks it?', 'Four of the tiles are perfect squares. Add the two digits of the odd tile, then count all the tiles.',
    [`Perfect squares: 16, 25, 36, 49. ${odd} is not a square.`, `Digit sum of ${odd} is 7, written 07.`, 'There are 5 tiles, written 05.']);
}

lv('Matching Pairs', 'Digit sums', 'Three identical keypads sit side by side.', [
  ['The three pairs of digits are identical.', (d) => pr(d, 0) === pr(d, 1) && pr(d, 1) === pr(d, 2)],
  ['All six digits add up to 18.', (d) => sum(d) === 18],
  ['The first digit is two more than the second digit.', (d) => d[0] === d[1] + 2],
], 'If every pair is the same, you only need to find one pair.', 'Call the pair "ab". Then three times (a + b) is 18.',
  ['The code looks like ababab, so 3 x (a + b) = 18 and a + b = 6.', 'Also a = b + 2, so b = 2 and a = 4.', 'The code is 424242.']);

{
  const rows = ['▲ ■ ● ▲ ▲', '■ ● ▲ ■ ■', '▲ ● ● ▲ ■ ▲'];
  const all = rows.join(' ').split(' ');
  const c = (s) => all.filter((x) => x === s).length;
  lv('Shape Census', 'Counting', 'Rows of glowing glyphs scroll across the panel.', [
    ['The first pair is the number of triangles (▲).', (d) => pr(d, 0) === c('▲')],
    ['The middle pair is the number of squares (■).', (d) => pr(d, 1) === c('■')],
    ['The last pair is the number of circles (●).', (d) => pr(d, 2) === c('●')],
  ], 'Count one kind of shape at a time.', 'Go row by row and keep a running total for each shape. Write single-digit totals with a leading zero.',
    [`Triangles: ${c('▲')}, squares: ${c('■')}, circles: ${c('●')}.`], { visuals: [{ title: 'Glyph rows', lines: rows }] });
}

lv('Three Riddles', 'Riddles', 'The vault asks three questions before it will listen.', [
  P(0, 29, 'First pair: "I have an extra day only every four years. How many days am I in February then?"'),
  P(1, 'VAULT'.length, 'Middle pair: "How many letters are in the word VAULT?"'),
  P(2, 7, 'Last pair: "How many colours are in a rainbow?"'),
], 'These are three small facts, one per pair.', 'A leap-year February has 29 days. VAULT has 5 letters, so write 05.',
  ['29 days in a leap-year February.', 'V-A-U-L-T has 5 letters: 05.', 'A rainbow has 7 colours: 07.']);

lv('Up Three, Down One', 'Sequences', 'The keypad lights flash in a strange rhythm.', [
  ['The first digit is the number of wheels on a bicycle.', (d) => d[0] === 2],
  ['Each later digit is 3 more than the digit before it, then 1 less, then 3 more, alternating (+3, -1, +3, -1, +3).', (d) => d[1] === d[0] + 3 && d[2] === d[1] - 1 && d[3] === d[2] + 3 && d[4] === d[3] - 1 && d[5] === d[4] + 3],
], 'Find the first digit, then follow the rule.', 'Start at 2. Add 3, subtract 1, and keep alternating for five steps.',
  ['A bicycle has 2 wheels.', '2, 5, 4, 7, 6, 9.']);

lv('The Mirror Lock', 'Palindromes', 'The lock reads the same in its own reflection.', [
  ['The code reads the same forwards and backwards.', (d) => d[0] === d[5] && d[1] === d[4] && d[2] === d[3]],
  ['The digits add up to 22.', (d) => sum(d) === 22],
  ['The first digit is even and the second digit is one more than the first.', (d) => d[0] % 2 === 0 && d[1] === d[0] + 1],
  ['The third digit is half of the first digit.', (d) => d[2] * 2 === d[0]],
], 'A palindrome of six digits is determined by its first three digits.', 'The digit sum is twice (first + second + third), so those three add up to 11.',
  ['Call the first digit a. Then the second is a + 1 and the third is a / 2.', 'a + (a + 1) + a/2 = 11, so a = 4.', 'The first three digits are 4, 5, 2, mirrored: 452254.']);

lv('Cube Facts', 'Basic facts', 'A glowing cube spins in the centre of the vault.', [
  ['First pair: the number of faces on a cube.', (d) => pr(d, 0) === 6],
  ['Middle pair: the number of edges on a cube.', (d) => pr(d, 1) === 12],
  ['Last pair: the number of vertices on a cube.', (d) => pr(d, 2) === 8],
], 'Picture a die.', 'A die has 6 faces, 12 edges and 8 corners. Write 6 and 8 with leading zeros.',
  ['6 faces, 12 edges, 8 vertices.', 'Code: 06 12 08.']);

{
  const A = 15 - 8 - 6, B = 15 - 3 - 5;
  lv('The Missing Numbers', 'Grids', 'A 3 x 3 grid of numbers has two scratched-out cells.', [
    ['Every row, column and diagonal of the grid adds up to the same total.', () => true],
    ['First pair: the number in the cell marked A, then the number in the cell marked B.', (d) => pr(d, 0) === A * 10 + B],
    ['Middle pair: the shared total of each row.', (d) => pr(d, 1) === 15],
    ['Last pair: the centre number, then the bottom-left number.', (d) => pr(d, 2) === 5 * 10 + 4],
  ], 'Use a complete row to find the shared total first.', 'The bottom row 4 + 9 + 2 already tells you the shared total.',
    ['The bottom row 4 + 9 + 2 gives the total 15.', 'Row 1: 8 + A + 6 = 15 so A = 1. Row 2: 3 + 5 + B = 15 so B = 7.', 'Pairs: 17, 15, 54.'],
    { visuals: [{ title: 'Grid', lines: ['8  A  6', '3  5  B', '4  9  2'] }] });
}

lv('Fibonacci Fragment', 'Sequences', 'A torn note shows the start of a famous sequence.', [
  ['The note reads 2, 3, 5, 8, 13, 21. The code is the next three terms as pairs.', (d) => pr(d, 0) === 34 && pr(d, 1) === 55 && pr(d, 2) === 89],
], 'Look at how 5 relates to 2 and 3.', 'Each term is the sum of the two before it.',
  ['13 + 21 = 34, 21 + 34 = 55, 34 + 55 = 89.']);

lv('Pocket Change', 'Arithmetic', 'A tray of coins sits beside the lock: 4 quarters, 3 dimes, 2 nickels and 7 pennies.', [
  ['First pair: the total number of coins.', (d) => pr(d, 0) === 4 + 3 + 2 + 7],
  ['Middle pair: the total value in cents, minus 100.', (d) => pr(d, 1) === 100 + 30 + 10 + 7 - 100],
  ['Last pair: the number of dimes and nickels together.', (d) => pr(d, 2) === 5],
], 'Quarters are 25, dimes 10, nickels 5, pennies 1 cent.', 'Total value is 100 + 30 + 10 + 7 = 147 cents.',
  ['16 coins in all.', '147 - 100 = 47.', 'Dimes plus nickels: 3 + 2 = 5, written 05.']);

lv('Letter Count', 'Word puzzles', 'The vault password hint is a single long word: ENCRYPTION.', [
  ['First pair: the number of letters in ENCRYPTION.', (d) => pr(d, 0) === 10],
  ['Middle pair: the number of vowels (A, E, I, O, U) in it.', (d) => pr(d, 1) === 3],
  ['Last pair: the alphabet position of its first letter.', (d) => pr(d, 2) === 5],
], 'Spell the word out and tick off letters.', 'The vowels are E, I and O. E is the fifth letter of the alphabet.',
  ['10 letters.', 'Vowels E, I, O: 03.', 'E = 5: 05.']);

lv('Ana and Ben', 'Word problems', 'Two names are carved into the door with an age riddle.', [
  ['Ana is three times as old as Ben.', (d) => pr(d, 0) === 3 * pr(d, 1)],
  ['In six years Ana will be exactly twice as old as Ben.', (d) => pr(d, 0) + 6 === 2 * (pr(d, 1) + 6)],
  ['The code is Ana\'s age now, Ben\'s age now, then the sum of their ages in six years.', (d) => pr(d, 2) === pr(d, 0) + pr(d, 1) + 12],
], 'Let Ben be b years old. Write Ana in terms of b.', 'Solve 3b + 6 = 2(b + 6).',
  ['3b + 6 = 2b + 12 gives b = 6 and Ana = 18.', 'In six years: 24 + 12 = 36.', 'Code: 18 06 36.']);

{
  const moves = [7, -3, 12, -5, 4];
  let f = 0, hi = 0, tr = 0;
  for (const m of moves) { f += m; hi = Math.max(hi, f); tr += Math.abs(m); }
  lv('Elevator Log', 'Arithmetic', 'The vault elevator starts at floor 0. Its log lists moves: up 7, down 3, up 12, down 5, up 4.', [
    ['First pair: the floor where the elevator ends.', (d) => pr(d, 0) === f],
    ['Middle pair: the total number of floors travelled.', (d) => pr(d, 1) === tr],
    ['Last pair: the highest floor it reached.', (d) => pr(d, 2) === hi],
  ], 'Track the floor after every move.', 'Floors: 7, 4, 16, 11, 15. Distance ignores direction.',
    [`Final floor ${f}.`, `Total distance ${tr}.`, `Highest floor ${hi}.`]);
}

lv('Twin Sets', 'Logic', 'Three pairs of digits must be arranged along six slots.', [
  ['The code uses the digits 1, 1, 2, 2, 3, 3 exactly once each.', (d) => [...d].sort().join('') === '112233'],
  ['No two equal digits are next to each other.', (d) => d[0] !== d[1] && d[1] !== d[2] && d[2] !== d[3] && d[3] !== d[4] && d[4] !== d[5]],
  ['The code starts with 1 and ends with 2.', (d) => d[0] === 1 && d[5] === 2],
  ['The two 3s are exactly three places apart.', (d) => { const i = d.indexOf(3); return d[i + 3] === 3; }],
  ['The two 1s are exactly two places apart.', (d) => { const i = d.indexOf(1); return d[i + 2] === 1; }],
], 'Place the fixed digits first: 1 at the start, 2 at the end.', 'Which positions can two 3s occupy if they are three apart and the ends are taken?',
  ['Positions 1 and 6 are taken, so the 3s must be in positions 2 and 5.', 'The remaining 1 and 2 go in positions 3 and 4. The 1s are two apart, so 1 is in position 3.', 'Code: 1 3 1 2 3 2.']);

lv('Dice Tower', 'Spatial', 'Three dice are stacked on the vault ledge.', [
  ['The tops of the three dice show 2, 5 and 3. On a die, opposite faces always add up to 7.', () => true],
  ['The code is the three top faces, then the three hidden bottom faces of the same dice in the same order.', (d) => d[0] === 2 && d[1] === 5 && d[2] === 3 && d[3] === 7 - 2 && d[4] === 7 - 5 && d[5] === 7 - 3],
], 'Which number is opposite 2?', 'Bottom = 7 minus top for each die.', ['Bottoms: 5, 2, 4.', 'Code: 253524.']);

{
  const list = [5, 8, 3, 6, 1, 4];
  const odds = list.filter((x) => x % 2), evens = list.filter((x) => x % 2 === 0).reverse();
  const exp = [...odds, ...evens];
  lv('Sorting Gate', 'Sorting', 'A conveyor belt carries six numbers past the lock: 5, 8, 3, 6, 1, 4.', [
    ['The first three digits are the odd numbers in the order they appear.', (d) => d[0] === odds[0] && d[1] === odds[1] && d[2] === odds[2]],
    ['The last three digits are the even numbers in reverse order of appearance.', (d) => d[3] === evens[0] && d[4] === evens[1] && d[5] === evens[2]],
  ], 'Split the belt into odd and even numbers.', 'Odds keep their order; evens are reversed.', [`Odds in order: ${odds.join(', ')}.`, `Evens reversed: ${evens.join(', ')}.`, `Code: ${exp.join('')}.`]);
}

lv('Quick Sums', 'Arithmetic', 'The vault checks your mental arithmetic.', [
  ['First pair: 7 x 8.', (d) => pr(d, 0) === 56],
  ['Middle pair: 100 - 37.', (d) => pr(d, 1) === 63],
  ['Last pair: 3 x 3, written with two digits.', (d) => pr(d, 2) === 9],
], 'Three small calculations.', 'Single-digit answers need a leading zero.', ['56, 63 and 09.']);

lv('The Gatekeeper', 'Rule chains', 'The first chapter ends with a guard who only speaks in rules.', [
  ['The first digit is the number of sides on a triangle.', (d) => d[0] === 3],
  ['The second digit is the number of wheels on a unicycle.', (d) => d[1] === 1],
  ['Every later digit is the last digit of the sum of the two digits before it.', (d) => [2, 3, 4, 5].every((i) => d[i] === (d[i - 1] + d[i - 2]) % 10)],
], 'The first two digits come from facts, the rest from a rule.', 'The rule is like Fibonacci but only the last digit is kept.',
  ['3 and 1 start the code.', '3+1=4, 1+4=5, 4+5=9, 5+9=14 so 4.', 'Code: 314594.']);
