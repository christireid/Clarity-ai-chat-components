/**
 * Visual Regression Tests
 *
 * Tests for visual consistency across components
 */

import { test, expect } from '@playwright/test'

test.describe('Button Visual Regression', () => {
  test('should match button variants', async ({ page }) => {
    await page.goto('/iframe.html?id=primitives-button-essentials--variants')
    await page.waitForLoadState('networkidle')

    // Take screenshot
    await expect(page).toHaveScreenshot('button-variants.png', {
      maxDiffPixels: 100,
    })
  })

  test('should match button hover states', async ({ page }) => {
    await page.goto('/iframe.html?id=primitives-button-essentials--default')
    const button = page.getByRole('button').first()

    // Hover and capture
    await button.hover()
    await expect(page).toHaveScreenshot('button-hover.png', {
      maxDiffPixels: 100,
    })
  })

  test('should match button focus states', async ({ page }) => {
    await page.goto('/iframe.html?id=primitives-button-essentials--default')
    const button = page.getByRole('button').first()

    // Focus and capture
    await button.focus()
    await expect(page).toHaveScreenshot('button-focus.png', {
      maxDiffPixels: 100,
    })
  })
})

test.describe('Input Visual Regression', () => {
  test('should match input states', async ({ page }) => {
    await page.goto('/iframe.html?id=components-inputs-input--states')
    await page.waitForLoadState('networkidle')

    await expect(page).toHaveScreenshot('input-states.png', {
      maxDiffPixels: 100,
    })
  })

  test('should match input focus ring', async ({ page }) => {
    await page.goto('/iframe.html?id=components-inputs-input--default')
    const input = page.getByRole('textbox').first()

    await input.focus()
    await expect(page).toHaveScreenshot('input-focus.png', {
      maxDiffPixels: 100,
    })
  })
})

test.describe('Card Visual Regression', () => {
  test('should match card variants', async ({ page }) => {
    await page.goto('/iframe.html?id=components-datadisplay-card--stats-card')
    await page.waitForLoadState('networkidle')

    await expect(page).toHaveScreenshot('card-variants.png', {
      maxDiffPixels: 100,
    })
  })

  test('should match interactive card hover', async ({ page }) => {
    await page.goto(
      '/iframe.html?id=components-datadisplay-card--chat-preview-card'
    )
    const card = page.locator('.cursor-pointer').first()

    await card.hover()
    await expect(page).toHaveScreenshot('card-hover.png', {
      maxDiffPixels: 100,
    })
  })
})

test.describe('Dialog Visual Regression', () => {
  test('should match dialog overlay', async ({ page }) => {
    await page.goto('/iframe.html?id=components-layout-dialog--default')

    // Open dialog
    await page.getByRole('button', { name: /open/i }).click()
    await page.waitForSelector('[role="dialog"]')

    await expect(page).toHaveScreenshot('dialog-open.png', {
      maxDiffPixels: 100,
    })
  })
})

test.describe('Message Visual Regression', () => {
  test('should match message bubbles', async ({ page }) => {
    await page.goto(
      '/iframe.html?id=components-datadisplay-message--user-message'
    )
    await page.waitForLoadState('networkidle')

    await expect(page).toHaveScreenshot('message-variants.png', {
      maxDiffPixels: 100,
    })
  })

  test('should match user vs assistant messages', async ({ page }) => {
    await page.goto(
      '/iframe.html?id=components-datadisplay-message--conversation'
    )
    await page.waitForLoadState('networkidle')

    await expect(page).toHaveScreenshot('message-conversation.png', {
      maxDiffPixels: 100,
    })
  })
})

test.describe('Foundation Visual Regression', () => {
  test('should match theme selector', async ({ page }) => {
    await page.goto('/iframe.html?id=foundation-theme-selector--default')
    await page.waitForLoadState('networkidle')

    await expect(page).toHaveScreenshot('theme-selector.png', {
      maxDiffPixels: 100,
    })
  })
})

test.describe('Dark Mode Visual Regression', () => {
  test('should match dark mode components', async ({ page }) => {
    await page.goto(
      '/iframe.html?id=primitives-button-essentials--variants&globals=themeMode:dark'
    )
    await page.waitForLoadState('networkidle')

    await expect(page).toHaveScreenshot('button-dark-mode.png', {
      maxDiffPixels: 100,
    })
  })
})

test.describe('Responsive Visual Regression', () => {
  test('should match mobile layout', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/iframe.html?id=components-layout-chatwindow--mobile-view')
    await page.waitForLoadState('networkidle')

    await expect(page).toHaveScreenshot('mobile-layout.png', {
      maxDiffPixels: 100,
    })
  })

  test('should match tablet layout', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/iframe.html?id=components-layout-chatwindow--default')
    await page.waitForLoadState('networkidle')

    await expect(page).toHaveScreenshot('tablet-layout.png', {
      maxDiffPixels: 100,
    })
  })
})
