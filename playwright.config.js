// @ts-check
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'node:path';

const testEnv = process.env.TEST_ENV ?? 'qauto';

if (!['qauto', 'qauto2'].includes(testEnv)) {
  throw new Error('Unsupported TEST_ENV. Expected "qauto" or "qauto2".');
}

dotenv.config({ path: path.resolve(process.cwd(), `.env.${testEnv}`) });

const { BASE_URL, HTTP_USERNAME, HTTP_PASSWORD } = process.env;

if (!BASE_URL || !HTTP_USERNAME || !HTTP_PASSWORD) {
  throw new Error(`Missing BASE_URL, HTTP_USERNAME, or HTTP_PASSWORD in .env.${testEnv}.`);
}

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  timeout: 30000,

  expect: {
    timeout: 5000,
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 2 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
  baseURL: BASE_URL,
  httpCredentials: {
    username: HTTP_USERNAME,
    password: HTTP_PASSWORD,
  },

  headless: true,

  viewport: { width: 1440, height: 900 },

  screenshot: 'only-on-failure',

  video: 'retain-on-failure',

  trace: 'retain-on-failure',

  actionTimeout: 10000,
},

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
