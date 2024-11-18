
import { test, expect } from '@playwright/test';

test.describe('Watchlist Application', () => {
  test('Sign up, subscribe, add an item to the watchlist, delete item, change password, and login/logout', async ({ page }) => {

    // Navigate to signup.
    await page.goto('/');
    await page.click('#signupButton');

    // Fill in signup form.
    await page.fill('#user', 'username');
    await page.fill('#pass', 'pass');
    await page.fill('#pass2', 'pass');
    await page.click('.formSubmit');
    
    // Verify signup success.
    await expect(page).toHaveURL('/maker');
    await expect(page.locator('h2')).toHaveText(`username's watchlist`);

    // Verify the initial subscription status.
    const subscriptionStatus = await page.locator('#subscribe'); 
    await expect(subscriptionStatus).toHaveText('Subscribe'); 
     
    // Simulate clicking the subscribe button.
    await page.click('#subscribe'); 
     
    // Verify that the subscription status changes.
    await expect(subscriptionStatus).toHaveText('Unsubscribe'); 

    // Add an item to the watchlist.
    await page.fill('#titleName', 'Test Item');
    await page.selectOption('#titleStatus', 'Want to Watch');
    await page.locator('input[name="rating"][value="Excellent"]').check();
    await page.click('.makeItemSubmit');

    // Check if the item exists in the list.
    const item = await page.locator('.item:has-text("Test Item")');
    await expect(item).toBeVisible();

    // Delete item from watchlist.
    await page.click('#deleteButton'); 

    // Verify item is deleted.
    await expect(item).not.toBeVisible(); 

    // Navigate to the change password page.
    await page.click('#changePassword'); 
    await expect(page).toHaveURL('/maker'); 
  
    // Fill in the change password form.
    await page.fill('#oldPass', 'pass'); 
    await page.fill('#pass', 'e'); 
    await page.fill('#pass2', 'e'); 
    await page.click('.formSubmit'); 
      
    // Verify successful password change.
    await expect(page).toHaveURL('/'); 
    await expect(page.locator('.formSubmit')).toBeVisible();
    
    // Log in again with the new password.
    await page.fill('#user', 'username'); 
    await page.fill('#pass', 'e');  
    await page.click('.formSubmit');
    
    // Verify login success after password change.
    await expect(page).toHaveURL('/maker');
    await expect(page.locator('h2')).toHaveText(`username's watchlist`);

    // Logout.
    await page.click('.navlink a[href="/logout"]');  

    // Verify that the user is redirected to the login page after logging out.
    await expect(page).toHaveURL('/'); 
    await expect(page.locator('.formSubmit')).toBeVisible(); 

  });
});

