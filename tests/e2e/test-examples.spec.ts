import { test } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Examples Pages Screenshots', () => {
  test('1. Examples landing page with categories', async ({ page }) => {
    await page.goto(`${BASE_URL}/examples`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: 'screenshots/examples-1-landing-page.png',
      fullPage: true
    });
    console.log('Screenshot 1: Examples landing page captured');
  });

  test('2. Featured tool-calling showcase card', async ({ page }) => {
    await page.goto(`${BASE_URL}/examples`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);

    // Look for the tool-calling showcase card
    const toolCallingCard = page.locator('text=Tool Calling').first();
    if (await toolCallingCard.isVisible()) {
      await toolCallingCard.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
    }

    await page.screenshot({
      path: 'screenshots/examples-2-tool-calling-card.png',
      fullPage: false
    });
    console.log('Screenshot 2: Tool-calling showcase card captured');
  });

  test('3. Simple Chat example page', async ({ page }) => {
    await page.goto(`${BASE_URL}/examples`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);

    // Click on Simple Chat example
    const simpleChatLink = page.locator('a[href*="simple-chat"], text=Simple Chat').first();
    if (await simpleChatLink.isVisible()) {
      await simpleChatLink.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
    } else {
      // Navigate directly
      await page.goto(`${BASE_URL}/examples/simple-chat`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);
    }

    await page.screenshot({
      path: 'screenshots/examples-3-simple-chat.png',
      fullPage: true
    });
    console.log('Screenshot 3: Simple Chat example captured');
  });

  test('4. Themed Chat example page', async ({ page }) => {
    await page.goto(`${BASE_URL}/examples`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);

    // Click on Themed Chat example
    const themedChatLink = page.locator('a[href*="themed-chat"], text=Themed Chat').first();
    if (await themedChatLink.isVisible()) {
      await themedChatLink.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
    } else {
      // Navigate directly
      await page.goto(`${BASE_URL}/examples/themed-chat`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);
    }

    await page.screenshot({
      path: 'screenshots/examples-4-themed-chat.png',
      fullPage: true
    });
    console.log('Screenshot 4: Themed Chat example captured');
  });

  test('5. Tool Calling Showcase example page', async ({ page }) => {
    await page.goto(`${BASE_URL}/examples/tool-calling-showcase`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    await page.screenshot({
      path: 'screenshots/examples-5-tool-calling-showcase.png',
      fullPage: true
    });
    console.log('Screenshot 5: Tool Calling Showcase captured');
  });
});
