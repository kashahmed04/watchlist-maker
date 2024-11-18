
// playwright.config.js
// are comments ok in this file and watchlist.spec file****
import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 5000,
  retries: 1,
  // Path to the E2E tests.
  testDir: 'tests/e2e', 
  use: {
    // Run in headless mode, can set to false to see the tests run.
    headless: true, 
    // Replace with the server URL.
    baseURL: 'http://localhost:3000/', 
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
    {
      name: 'firefox',
      use: { browserName: 'firefox' },
    },
    {
      name: 'webkit',
      use: { browserName: 'webkit' },
    },
  ],
});
