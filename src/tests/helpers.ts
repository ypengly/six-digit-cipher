import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { FullLevel } from '@/types/level';

const root = join(__dirname, '..', '..');
export function loadAllLevels(): FullLevel[] {
  const out: FullLevel[] = [];
  for (let c = 1; c <= 5; c++) out.push(...(JSON.parse(readFileSync(join(root, 'src', 'data', 'levels', `chapter-0${c}.json`), 'utf8')) as FullLevel[]));
  return out;
}
export const rootDir = root;
