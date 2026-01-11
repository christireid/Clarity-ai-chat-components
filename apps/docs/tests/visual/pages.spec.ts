import { test, expect } from '@playwright/test'

test.describe('Visual Regression', () => {
  test('homepage should match snapshot', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveScreenshot('homepage.png', { fullPage: true })
  })

  test('playground should match snapshot', async ({ page }) => {
    await page.goto('/playground')
    // Wait for Sandpack to load (fail if not found within timeout)
    await page.waitForSelector('.sp-wrapper', {
      state: 'visible',
      timeout: 30000,
    })
    // Give it a small buffer for the iframe content to render initial state
    await page.waitForTimeout(1000)
    await expect(page).toHaveScreenshot('playground.png', { fullPage: true })
  })

  test('commercial pricing should match snapshot', async ({ page }) => {
    await page.goto('/commercial/pricing')
    await expect(page).toHaveScreenshot('pricing.png', { fullPage: true })
  })
})
