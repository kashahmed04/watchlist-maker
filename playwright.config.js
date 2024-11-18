
// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 6000,
  retries: 1,
  // Path to the E2E tests.
  testDir: 'tests/e2e', 
  use: {
    headless: true, 
    baseURL: 'http://localhost:3000/', 
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
});
