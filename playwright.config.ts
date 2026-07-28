import { defineConfig, devices } from '@playwright/test';
import { env } from './src/config/env';

export default defineConfig({
  testDir: './tests',
  testIgnore: ['**/bulkGeneratedTest.spec.ts'],
  timeout: 60_000,
  expect: {
    timeout: 15_000,
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['list'],
    ['allure-playwright', { outputFolder: 'allure-results', detail: true, suiteTitle: false }]
  ],
  use: {
    baseURL: env.baseUrl,
    headless: true,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 20_000,
    ignoreHTTPSErrors: true,
    extraHTTPHeaders: {
      Accept: 'application/json, text/plain, */*'
    }
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        browserName: 'chromium'
      }
    },
    // {
    //   name: 'firefox',
    //   use: {
    //     ...devices['Desktop Firefox'],
    //     browserName: 'firefox'
    //   }
    // },
    // {
    //   name: 'api',
    //   testMatch: /.*\/api\/.*\.spec\.ts/,
    //   use: {
    //     browserName: 'chromium'
    //   }
    // }
  ]
});
