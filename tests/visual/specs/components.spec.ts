import { SecureLogger } from '@/lib/security/secureLogger';
import { SecureLogger } from '@/lib/security/secureLogger';
import { SecureLogger } from '@/lib/security/secureLogger';
/**
 * Visual Regression Tests
 *
 * Tests for visual consistency across components
 */

import { test, expect } from '@playwright/test'

function attachPageDiagnostics(page: any) {
  // Helps debug cases where Storybook keeps #storybook-root hidden due to runtime errors.
  page.on('pageerror', (err: any) => {
    // eslint-disable-next-line no-console
    SecureLogger.error('[playwright-visual][pageerror]', err)
  })
  page.on('console', (msg: any) => {
    if (msg.type?.() === 'error') {
      // eslint-disable-next-line no-console
      SecureLogger.error('[playwright-visual][console.error]', msg.text?.())
    }
  })
}

async function waitForStoryReady(page: any) {
  attachPageDiagnostics(page)
  // Storybook iframe keeps the root nodes hidden until the story is fully loaded.
  await expect(page.locator('#storybook-root')).toBeVisible({ timeout: 30000 })
  await expect(page.locator('#storybook-root *').first()).toBeVisible({
    timeout: 30000,
  })
}

test.describe('Button Visual Regression', () => {
  test('should match button variants', async ({ page }) => {
    await page.goto('/iframe.html?id=primitives-button-essentials--variants')
    await waitForStoryReady(page)

    // Take screenshot
    await expect(page).toHaveScreenshot('button-variants.png', {
      maxDiffPixels: 100,
    })
  })

  test('should match button hover states', async ({ page }) => {
    await page.goto('/iframe.html?id=primitives-button-essentials--default')
    await waitForStoryReady(page)
    const button = page.getByRole('button').first()

    // Hover and capture
    await button.hover()
    await expect(page).toHaveScreenshot('button-hover.png', {
      maxDiffPixels: 100,
    })
  })

  test('should match button focus states', async ({ page }) => {
    await page.goto('/iframe.html?id=primitives-button-essentials--default')
    await waitForStoryReady(page)
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
    await waitForStoryReady(page)

    await expect(page).toHaveScreenshot('input-states.png', {
      maxDiffPixels: 100,
    })
  })

  test('should match input focus ring', async ({ page }) => {
    await page.goto('/iframe.html?id=components-inputs-input--default')
    await waitForStoryReady(page)
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
    await waitForStoryReady(page)

    await expect(page).toHaveScreenshot('card-variants.png', {
      maxDiffPixels: 100,
    })
  })

  test('should match interactive card hover', async ({ page }) => {
    await page.goto(
      '/iframe.html?id=components-datadisplay-card--chat-preview-card'
    )
    await waitForStoryReady(page)
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
    await waitForStoryReady(page)

    // Open dialog
    await page.getByRole('button', { name: /open dialog/i }).click()
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 30000 })

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
    await waitForStoryReady(page)

    await expect(page).toHaveScreenshot('message-variants.png', {
      maxDiffPixels: 100,
    })
  })

  test('should match user vs assistant messages', async ({ page }) => {
    await page.goto(
      '/iframe.html?id=components-datadisplay-message--conversation'
    )
    await waitForStoryReady(page)

    await expect(page).toHaveScreenshot('message-conversation.png', {
      maxDiffPixels: 100,
    })
  })
})

test.describe('Foundation Visual Regression', () => {
  test('should match theme selector', async ({ page }) => {
    await page.goto('/iframe.html?id=foundation-themeselector--gallery')
    await waitForStoryReady(page)

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
    await waitForStoryReady(page)

    await expect(page).toHaveScreenshot('button-dark-mode.png', {
      maxDiffPixels: 100,
    })
  })
})

test.describe('Responsive Visual Regression', () => {
  test('should match mobile layout', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/iframe.html?id=components-layout-chatwindow--mobile-view')
    await waitForStoryReady(page)

    await expect(page).toHaveScreenshot('mobile-layout.png', {
      maxDiffPixels: 100,
    })
  })

  test('should match tablet layout', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/iframe.html?id=components-layout-chatwindow--default')
    await waitForStoryReady(page)

    await expect(page).toHaveScreenshot('tablet-layout.png', {
      maxDiffPixels: 100,
    })
  })
})
