import { test, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { authSessionStoragePath, authStatePath } from './auth-state.js';

test('authenticate guest and save storage state', async ({ page }) => {
  // 1. Open QAuto at its configured baseURL; HTTP Basic credentials are supplied by Playwright config.
  await page.goto('/');

  // 2. Log in using the application's Guest log in control.
  await page.getByRole('button', { name: 'Guest log in' }).click();
  await expect(page).toHaveURL(/\/panel\/garage$/);
  await expect(page.getByRole('heading', { name: 'Garage' })).toBeVisible();

  const sessionStorageValues = await page.evaluate(() => {
    const values = {};
    for (let index = 0; index < window.sessionStorage.length; index += 1) {
      const key = window.sessionStorage.key(index);
      if (key !== null) {
        values[key] = window.sessionStorage.getItem(key);
      }
    }
    return values;
  });
  expect(Object.keys(sessionStorageValues)).not.toHaveLength(0);

  // 3. Persist authentication only after the application confirms the Garage page is loaded.
  await mkdir(path.dirname(authStatePath), { recursive: true });
  await writeFile(
    authSessionStoragePath,
    JSON.stringify({ origin: new URL(process.env.BASE_URL).origin, values: sessionStorageValues }, null, 2),
  );
  await page.context().storageState({ path: authStatePath });
});
