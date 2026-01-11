import { test, expect } from '@playwright/test';

test.describe('Visual Regression', () => {
  test('homepage should match snapshot', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveScreenshot('homepage.png', { fullPage: true });
  });

  test('playground should match snapshot', async ({ page }) => {
    await page.goto('/playground');
    // Wait for Sandpack to load
    await page.waitForSelector('.sp-wrapper', { state: 'visible', timeout: 30000 }).catch(() => {
      console.log('Sandpack wrapper not found, proceeding with snapshot anyway');
    });
    await expect(page).toHaveScreenshot('playground.png', { fullPage: true });
  });

  test('commercial pricing should match snapshot', async ({ page }) => {
    await page.goto('/commercial/pricing');
    await expect(page).toHaveScreenshot('pricing.png', { fullPage: true });
  });
});
