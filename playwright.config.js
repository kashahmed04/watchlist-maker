
const { defineConfig } = require('@playwright/test');
const path = require('path');

export default defineConfig({
  // Set the global timeout for tests.
  timeout: 6000, 
  // Number of retries for failed tests.
  retries: 1,    

  testDir: path.join(__dirname, 'tests/e2e'),

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
