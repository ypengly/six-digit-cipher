import { test, expect } from '@playwright/test';
import { loadAllLevels } from '../helpers';

const level1 = loadAllLevels().find((l) => l.number === 1)!;

test('landing page shows the game', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Six-Digit');
  await expect(page.getByRole('link', { name: /start new game/i })).toBeVisible();
});

test('keyboard entry, six-digit limit, wrong code, then correct code unlocks level 2', async ({ page }) => {
  await page.goto('/play/1');
  await page.keyboard.type('1234567'); // seventh digit must be ignored
  await expect(page.getByRole('group', { name: /6 of 6 digits/ })).toBeVisible();
  await page.getByRole('button', { name: /submit code/i }).click();
  await expect(page.getByText(/lock|denied|not it|recognise/i).first()).toBeVisible();
  await expect(page.locator('body')).not.toContainText(level1.answer);
  for (const d of level1.answer) await page.getByRole('button', { name: `Digit ${d}`, exact: true }).click(); // on-screen keypad
  await page.getByRole('button', { name: /submit code/i }).click();
  await expect(page.getByRole('dialog', { name: /level solved/i })).toBeVisible();
  await page.reload();
  await page.goto('/levels');
  await expect(page.getByRole('link', { name: /Level 2, .* unlocked/ })).toBeVisible(); // progress survives refresh
});

test('locked level cannot be played', async ({ page }) => {
  await page.goto('/play/5');
  await expect(page.getByRole('heading', { name: /locked/i })).toBeVisible();
});

test('API never exposes answers and admin routes reject anonymous users', async ({ request }) => {
  const r = await request.get('/api/levels/1');
  const text = await r.text();
  expect(text).not.toContain(level1.answer);
  expect(text).not.toContain('"answer"');
  expect((await request.get('/api/admin/levels')).status()).toBe(403);
  expect((await request.post('/api/admin/levels', { data: {} })).status()).toBe(403);
  expect((await request.get('/api/admin/export')).status()).toBe(403);
  const bad = await request.post('/api/submit', { data: { levelNumber: 1, code: '123' } });
  expect(bad.status()).toBe(400);
});

test('hints are revealed in order and tracked', async ({ page }) => {
  await page.goto('/play/1');
  await page.getByRole('button', { name: /reveal hint 1/i }).click();
  await expect(page.getByText('Hint 1')).toBeVisible();
  await expect(page.getByText(/2 of 3 left/)).toBeVisible();
});
