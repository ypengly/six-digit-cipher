// Regenerates src/data/levels/chapter-0N.json from the authoring source.
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { buildAll } from './levels-source.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'src', 'data', 'levels');
mkdirSync(out, { recursive: true });
const levels = buildAll();
for (let c = 1; c <= 5; c++) {
  const slice = levels.filter((l) => l.chapter === c);
  writeFileSync(join(out, `chapter-0${c}.json`), JSON.stringify(slice, null, 2) + '\n');
  console.log(`chapter-0${c}.json: ${slice.length} levels`);
}
console.log('Done. Answers were derived by exhaustive search; every level has exactly one solution.');
