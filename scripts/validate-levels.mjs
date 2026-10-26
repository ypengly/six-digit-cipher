// Validates all 100 campaign levels and reports exactly which level fails and why.
// Checks: structure, six-digit answers (strings), hints, explanations, leak checks, test cases, and
// - most importantly - re-runs the exhaustive solver so each level provably has ONE solution
// that matches the stored answer.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { buildAll } from './levels-source.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const fail = (lv, msg) => failures.push(`Level ${lv?.number ?? '?'} ${lv?.title ? `(${lv.title})` : ''}: ${msg}`);

const stored = [];
for (let c = 1; c <= 5; c++) {
  try { stored.push(...JSON.parse(readFileSync(join(root, 'src', 'data', 'levels', `chapter-0${c}.json`), 'utf8'))); }
  catch (e) { failures.push(`chapter-0${c}.json unreadable: ${e.message}`); }
}
if (stored.length !== 100) failures.push(`Expected 100 levels, found ${stored.length}`);

const ids = new Set(), nums = new Set();
for (const l of stored) {
  if (ids.has(l.id)) fail(l, 'duplicate id'); ids.add(l.id);
  if (nums.has(l.number)) fail(l, 'duplicate number'); nums.add(l.number);
  if (l.chapter !== Math.ceil(l.number / 20)) fail(l, `chapter ${l.chapter} does not match its number`);
  if (typeof l.answer !== 'string' || !/^\d{6}$/.test(l.answer)) fail(l, `answer must be a six-digit STRING, got ${JSON.stringify(l.answer)}`);
  for (const k of ['title', 'story', 'instructions', 'explanation', 'category', 'difficulty']) if (!l[k] || String(l[k]).length < 3) fail(l, `missing ${k}`);
  if (!Array.isArray(l.clues) || !l.clues.some((c) => c.kind === 'clue')) fail(l, 'no genuine clues');
  if (!Array.isArray(l.steps) || l.steps.length < 1) fail(l, 'no solution steps');
  if (!Array.isArray(l.hints) || l.hints.length !== 3 || l.hints.some((h) => !h || h.length < 5)) fail(l, 'needs exactly 3 non-empty hints');
  const visible = [l.story, l.instructions, ...l.clues.map((c) => c.text), ...(l.visuals ?? []).flatMap((v) => v.lines)].join('\n');
  if (visible.includes(l.answer)) fail(l, 'answer string appears in player-visible text');
  if (l.hints.slice(0, 2).join('\n').includes(l.answer)) fail(l, 'answer appears in hint 1 or 2');
  if (!l.explanation.includes(l.answer)) fail(l, 'explanation does not state the code');
  if (!Array.isArray(l.tests) || l.tests.length < 2) fail(l, 'missing test cases');
  else for (const t of l.tests) if ((t.code === l.answer) !== t.correct) fail(l, `test case ${t.code} has wrong expectation`);
  if (l.clues.some((c) => c.kind === 'decoy') && !l.clues.every((c) => c.kind === 'decoy' ? c.text.startsWith('[UNVERIFIED]') : true)) fail(l, 'decoy clues must be labelled [UNVERIFIED] so red herrings are fair');
}

// Exhaustive proof of uniqueness + agreement with the stored answers.
let rebuilt = [];
try { rebuilt = buildAll(); } catch (e) { failures.push(e.message); }
for (const r of rebuilt) {
  const s = stored.find((x) => x.number === r.number);
  if (!s) { fail(r, 'missing from JSON files'); continue; }
  if (s.answer !== r.answer) fail(r, `stored answer ${s.answer} does not match the solver result ${r.answer} (run npm run levels:build)`);
}

if (failures.length) {
  console.error(`\nVALIDATION FAILED (${failures.length} problem${failures.length > 1 ? 's' : ''}):`);
  for (const f of failures) console.error(' - ' + f);
  process.exit(1);
}
console.log('All 100 levels validated:');
console.log(' - 100 unique ids and numbers, 5 chapters x 20 levels');
console.log(' - every answer is a six-digit string; every level has clues, 3 hints, steps, explanation, test cases');
console.log(' - no answer leaks into clues or early hints');
console.log(' - exhaustive search over 1,000,000 codes found exactly ONE solution per level, equal to the stored answer');
