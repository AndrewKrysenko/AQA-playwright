import { test, expect } from './fixtures.js';

test.describe('Authenticated Garage page', () => {
  test('opens the Garage page with saved session state', async ({ userGaragePage }) => {
    // 1. Access Garage through the authenticated userGaragePage fixture without logging in in the test.
    await expect(userGaragePage.page).toHaveURL(/\/panel\/garage$/);
    await expect(userGaragePage.authenticatedNotice).toBeVisible();
    await expect(userGaragePage.heading).toBeVisible();
    await expect(userGaragePage.addCarButton).toBeVisible();
  });
});
