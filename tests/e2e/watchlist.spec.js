
import { test, expect } from '@playwright/test';

test.describe('Watchlist Application', () => {
  test('Login and add an item to the watchlist', async ({ page }) => {

    // Navigate to login.
    await page.goto('/login');
    
    // Fill in login form.
    await page.fill('#user', 'e');
    await page.fill('#pass', 'eee');
    await page.click('.formSubmit');
    
    // Verify login success.
    await expect(page).toHaveURL('/maker');
    await expect(page.locator('h2')).toHaveText(`e's watchlist`);

    // Verify the initial subscription status
    const subscriptionStatus = await page.locator('#subscribe'); 
    await expect(subscriptionStatus).toHaveText('Subscribe'); 
     
    // Simulate clicking the subscribe button
    await page.click('#subscribe'); 
     
    // Verify that the subscription status changes
    await expect(subscriptionStatus).toHaveText('Unsubscribe'); 

    // Add an item to the watchlist.
    await page.fill('#titleName', 'Test Item');
    await page.selectOption('#status', 'Want to Watch');
    await page.locator('input[name="rating"][value="Excellent"]').check();
    await page.click('.makeItemSubmit');

    // Check item exists in the list.
    const item = await page.locator('.item:has-text("Test Item")');
    await expect(item).toBeVisible();

    // Delete item from watchlist
    await page.click('#delete-button'); 

    // Verify item is deleted.
    await expect(item).not.toBeVisible(); 

    //Navigate to the "Change Password" page
    await page.click('#changePassword'); 
    await expect(page).toHaveURL('/changePassword'); // Make sure we are on the change password page
  
    //Fill in the change password form
    await page.fill('#oldPass', 'eee'); // Current password field
    await page.fill('#pass', 'e'); // New password field
    await page.fill('#pass2', 'e'); // Confirm password field
    await page.click('.formSubmit'); // Submit the form
      
    // Verify successful password change.
    await expect(page).toHaveURL('/login'); // The user should be redirected to login page after password change
    await expect(page.locator('.formSubmit')).toBeVisible();
    
    // Log in again with the new password
    await page.fill('#user', 'e');  // Username is the same
    await page.fill('#pass', 'e');  // New password
    await page.click('.formSubmit');
    
    // Verify login success after password change
    await expect(page).toHaveURL('/maker');
    await expect(page.locator('h2')).toHaveText(`e's watchlist`);

    // Logout
    await page.click('.navlink a[href="/logout"]');  // Click the logout button (change the selector if necessary)

    // Verify that the user is redirected to the login page after logging out
    await expect(page).toHaveURL('/login'); 
    await expect(page.locator('.formSubmit')).toBeVisible(); // Ensure login button is visible after logout

  });
});
