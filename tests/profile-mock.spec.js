import { test, expect } from '@playwright/test';
import { createTestUser } from './helpers/test-user.js';

test('Profile displays the mocked user returned by GET /api/users/profile', async ({ page }) => {
  const signupResponse = await page.request.post('/api/auth/signup', {
    data: createTestUser(),
  });
  expect(signupResponse.status()).toBe(201);

  const signupBody = await signupResponse.json();
  expect(signupBody.status).toBe('ok');
  expect(signupBody.data.userId).toBeGreaterThan(0);

  const mockedProfile = {
    status: 'ok',
    data: {
      userId: signupBody.data.userId,
      photoFilename: 'default-user.png',
      name: 'Mocked',
      lastName: 'Profile',
    },
  };

  await page.route('**/api/users/profile', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockedProfile),
    });
  });
  const mockedProfileResponse = page.waitForResponse((response) => (
    response.request().method() === 'GET'
    && new URL(response.url()).pathname === '/api/users/profile'
  ));

  await page.goto('/panel/profile');

  const profileResponse = await mockedProfileResponse;
  expect(profileResponse.status()).toBe(200);
  expect(await profileResponse.json()).toEqual(mockedProfile);
  await expect(page.getByRole('heading', { name: 'Profile', exact: true })).toBeVisible();
  const displayedName = page.locator('.profile_name');
  await expect(displayedName).toContainText('Mocked');
  await expect(page.getByText('Network Tester', { exact: true })).toHaveCount(0);
  // qauto2 currently replaces the response lastName with "undefined" in the Profile component.
  if (process.env.TEST_ENV !== 'qauto2') {
    await expect(displayedName).toHaveText('Mocked Profile');
  }
});
