
import { test, expect } from '@playwright/test';

test.describe('Watchlist Application', () => {
  test('Login and add an item to the watchlist', async ({ page }) => {

    // Navigate to login.
    await page.goto('/login');
    
    // Fill in login form.
    const username = await page.fill('#user', 'e');
    await page.fill('#pass', 'eee');
    await page.click('#loginButton');
    
    // Verify login success.
    await expect(page).toHaveURL('/maker');
    await expect(page.locator('h2')).toHaveText(`${username}'s watchlist`);

    // Add an item to the watchlist.
    await page.fill('#titleName', 'Test Item');
    await page.selectOption('#status', 'Want to Watch');
    await page.locator('input[name="rating"][value="Excellent]').check();
    await page.click('.makeItemSubmit');

    // Check item exists in the list.
    const item = await page.locator('.item:has-text("Test Item")');
    await expect(item).toBeVisible();
  });
});
