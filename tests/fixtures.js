import { readFile } from 'node:fs/promises';
import { test as base, expect } from '@playwright/test';
import { authSessionStoragePath, authStatePath } from './auth-state.js';
import { GaragePage } from './pages/GaragePage.js';

export const test = base.extend({
  userGaragePage: async ({ browser }, use) => {
    const sessionState = JSON.parse(await readFile(authSessionStoragePath, 'utf8'));
    const baseURL = process.env.BASE_URL;
    if (
      !baseURL
      || sessionState.origin !== new URL(baseURL).origin
      || !sessionState.values
      || typeof sessionState.values !== 'object'
      || Array.isArray(sessionState.values)
    ) {
      throw new Error('Saved authentication session state is invalid or does not match BASE_URL.');
    }

    const context = await browser.newContext({
      baseURL,
      httpCredentials: {
        username: process.env.HTTP_USERNAME,
        password: process.env.HTTP_PASSWORD,
      },
      storageState: authStatePath,
    });
    try {
      await context.addInitScript(({ origin, values }) => {
        if (window.location.origin === origin) {
          for (const [key, value] of Object.entries(values)) {
            window.sessionStorage.setItem(key, value);
          }
        }
      }, sessionState);

      const page = await context.newPage();
      const garagePage = new GaragePage(page);
      await garagePage.open();
      await use(garagePage);
    } finally {
      await context.close();
    }
  },
});

export { expect };
