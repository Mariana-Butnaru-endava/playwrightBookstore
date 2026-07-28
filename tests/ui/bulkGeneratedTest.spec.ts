import { test, expect } from '@playwright/test';

test.skip('test', async ({ page }) => {
  await page.goto('https://demoqa.com/profile');
  await page.getByRole('link', { name: 'login', exact: true }).click();
  await page.getByRole('textbox', { name: 'UserName' }).click();
  await page.getByRole('textbox', { name: 'UserName' }).fill('autouser_1780572714181_qfbynzc2');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('Password123!');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('button', { name: 'Go To Book Store' }).click();
  await page.getByRole('link', { name: 'You Don\'t Know JS' }).click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Add To Your Collection' }).click();
  await page.getByRole('button', { name: 'Back To Book Store' }).click();
  await page.getByRole('link', { name: 'Programming JavaScript' }).click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Add To Your Collection' }).click();
  await page.goto('https://demoqa.com/profile');
  await expect(page.locator('tbody')).toContainText('You Don\'t Know JS');
  await expect(page.locator('[id="see-book-Programming JavaScript Applications"]')).toContainText('Programming JavaScript Applications');
  await page.getByRole('button', { name: 'Delete All Books' }).click();
  await page.getByRole('button', { name: 'OK', exact: true }).click();
  await page.getByRole('button', { name: 'Close' }).click();
  await page.getByRole('button', { name: 'Go To Book Store' }).click();
  await page.getByRole('link', { name: 'Eloquent JavaScript, Second' }).click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Add To Your Collection' }).click();
  await page.goto('https://demoqa.com/profile');
  await expect(page.locator('[id="see-book-Eloquent JavaScript, Second Edition"]')).toContainText('Eloquent JavaScript, Second Edition');
  await page.getByRole('button', { name: 'Logout' }).click();
});