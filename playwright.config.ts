import { defineConfig, devices } from '@playwright/test';

import { STORAGE_STATE_PATH } from './e2e/constants';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:8081',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'auth-setup',
      testMatch: /auth\.setup\.ts/,
    },
    {
      name: 'chromium',
      testIgnore: /auth\.setup\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: STORAGE_STATE_PATH,
      },
      dependencies: ['auth-setup'],
    },
  ],
  webServer: {
    command: 'yarn web',
    url: 'http://localhost:8081',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
