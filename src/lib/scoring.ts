/** Documented scoring rules (shown to players on the Settings and Results pages):
 *  3 stars: no hints AND solved within the level's target time.
 *  2 stars: some hints used (but not all) OR the target time was exceeded.
 *  1 star : all hints were used.
 *  Score: 1000 base, -150 per hint, -20 per wrong attempt, -1 per 3 seconds over target (never below 100). */
export const HINT_ALLOWANCE = 3;

export function computeStars(hintsUsed: number, elapsedSec: number, targetSec: number): 1 | 2 | 3 {
  if (hintsUsed >= HINT_ALLOWANCE) return 1;
  if (hintsUsed === 0 && elapsedSec <= targetSec) return 3;
  return 2;
}

export function computeScore(hintsUsed: number, wrongAttempts: number, elapsedSec: number, targetSec: number): number {
  const over = Math.max(0, elapsedSec - targetSec);
  return Math.max(100, 1000 - 150 * hintsUsed - 20 * wrongAttempts - Math.floor(over / 3));
}
