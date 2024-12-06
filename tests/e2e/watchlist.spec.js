
require('dotenv').config();
const { test, expect } = require('@playwright/test');
const mongoose = require('mongoose');
const models = require('../../server/models/index.js');

// Import the Account model.
const { Account } = models;

const dbURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1/WatchlistMaker';

const TEST_USERNAME = 'test_user';
const TEST_PASSWORD = 'pass';
const NEW_PASSWORD = 'new_pass';

test.describe('Watchlist Application', () => {
  // Connect to the database before running tests.
  test.beforeAll(async () => {
    try {
      await mongoose.connect(dbURI);
    } catch (error) {
      console.error('Failed to connect to the database:', error);
      throw error;
    }
  });

  // Disconnect and clean up the database after all tests.
  test.afterAll(async () => {
    try {
      await Account.deleteOne({ username: TEST_USERNAME });
      await mongoose.connection.close();
    } catch (error) {
      console.error('Failed to clean up the database:', error);
    }
  });

  test('Complete Watchlist Workflow', async ({ page }) => {
    // Signup.
    await test.step('User signup', async () => {
      await page.goto('/');
      await page.click('#signupButton');

      // Fill in signup form.
      await page.fill('#user', TEST_USERNAME);
      await page.fill('#pass', TEST_PASSWORD);
      await page.fill('#pass2', TEST_PASSWORD);
      await page.click('.formSubmit');

      // Verify signup success.
      await expect(page).toHaveURL('/maker');
      await expect(page.locator('h2')).toHaveText(`${TEST_USERNAME}'s watchlist`);
    });

    // Subscribe to premium.
    await test.step('Subscribe to premium', async () => {
      const subscriptionStatus = await page.locator('#subscribe');
      await expect(subscriptionStatus).toHaveText('Subscribe');

      // Click the subscribe button.
      await page.click('#subscribe');

      // Verify that the subscription status changes.
      await expect(subscriptionStatus).toHaveText('Unsubscribe');
    });

    // Add an item to the watchlist.
    await test.step('Add an item to the watchlist', async () => {
      await page.fill('#titleName', 'Test Item');
      await page.selectOption('#titleStatus', 'Want to Watch');
      await page.locator('input[name="rating"][value="Excellent"]').check();
      await page.click('.makeItemSubmit');

      // Check if the item exists in the list.
      const item = await page.locator('.item:has-text("Test Item")');
      await expect(item).toBeVisible();
    });

    // Delete an item from the watchlist/
    await test.step('Delete an item from the watchlist', async () => {
      const item = await page.locator('.item:has-text("Test Item")');
      await page.click('#deleteButton');

      // Verify item is deleted.
      await expect(item).not.toBeVisible();
    });

    // Change password.
    await test.step('Change password', async () => {
      await page.click('#changePassword');
      await expect(page).toHaveURL('/maker');

      await page.fill('#oldPass', TEST_PASSWORD);
      await page.fill('#pass', NEW_PASSWORD);
      await page.fill('#pass2', NEW_PASSWORD);
      await page.click('.formSubmit');

      // Verify successful password change.
      await expect(page).toHaveURL('/');
      await expect(page.locator('.formSubmit')).toBeVisible();
    });

    // Login with new password.
    await test.step('Login with new password', async () => {
      await page.fill('#user', TEST_USERNAME);
      await page.fill('#pass', NEW_PASSWORD);
      await page.click('.formSubmit');

      // Verify login success after password change.
      await expect(page).toHaveURL('/maker');
      await expect(page.locator('h2')).toHaveText(`${TEST_USERNAME}'s watchlist`);
    });

    // Logout.
    await test.step('Logout', async () => {
      await page.click('.navlink a[href="/logout"]');

      // Verify user is redirected to the login page after logging out.
      await expect(page).toHaveURL('/');
      await expect(page.locator('.formSubmit')).toBeVisible();
    });
  });
});


