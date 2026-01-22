import { test, expect, type Page, type ConsoleMessage } from '@playwright/test'

/**
 * Smoke Tests for Clarity Chat Documentation Site
 *
 * These tests verify:
 * - All major routes return 200 status
 * - No console.error messages on any page
 * - Basic page rendering works correctly
 * - Images load without errors
 *
 * Run tests:
 *   npx playwright test apps/docs/tests/smoke/routes.spec.ts
 *
 * Prerequisites:
 *   1. Start the docs server: cd apps/docs && pnpm dev
 *   2. Install Playwright browsers: npx playwright install chromium
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

// Console error collector
interface ConsoleError {
  message: string
  url: string
}

/**
 * Attaches console error listener to page
 * Returns array that will be populated with console errors
 */
function collectConsoleErrors(page: Page): ConsoleError[] {
  const errors: ConsoleError[] = []

  page.on('console', (msg: ConsoleMessage) => {
    if (msg.type() === 'error') {
      // Filter out known non-critical errors
      const text = msg.text()

      // Skip React hydration warnings in development
      if (text.includes('Hydration') && text.includes('Warning')) return

      // Skip favicon 404s
      if (text.includes('favicon')) return

      // Skip third-party script errors
      if (text.includes('third-party') || text.includes('analytics')) return

      errors.push({
        message: text,
        url: page.url(),
      })
    }
  })

  page.on('pageerror', (error) => {
    errors.push({
      message: error.message,
      url: page.url(),
    })
  })

  return errors
}

/**
 * Checks for broken images on the page
 */
async function checkBrokenImages(page: Page): Promise<string[]> {
  const brokenImages: string[] = []

  const images = await page.locator('img').all()
  for (const img of images) {
    const naturalWidth = await img.evaluate(
      (el: HTMLImageElement) => el.naturalWidth
    )
    const src = await img.getAttribute('src')

    // naturalWidth of 0 indicates failed load
    if (naturalWidth === 0 && src) {
      brokenImages.push(src)
    }
  }

  return brokenImages
}

// =============================================================================
// ROUTE TESTS
// =============================================================================

test.describe('Critical Routes - Smoke Tests', () => {
  test('Homepage loads successfully', async ({ page }) => {
    const errors = collectConsoleErrors(page)

    const response = await page.goto(BASE_URL)

    expect(response?.status()).toBe(200)
    await expect(page).toHaveTitle(/Clarity/i)

    // Verify main content area exists
    await expect(page.locator('main').or(page.locator('[role="main"]'))).toBeVisible()

    // Check for console errors
    expect(errors).toHaveLength(0)
  })

  test('Getting Started guide loads', async ({ page }) => {
    const errors = collectConsoleErrors(page)

    const response = await page.goto(`${BASE_URL}/guides/getting-started`)

    expect(response?.status()).toBe(200)
    await page.waitForLoadState('networkidle')

    // Should have content
    await expect(page.locator('body')).not.toBeEmpty()

    expect(errors).toHaveLength(0)
  })

  test('Quick Start guide loads', async ({ page }) => {
    const errors = collectConsoleErrors(page)

    const response = await page.goto(`${BASE_URL}/guides/quick-start`)

    expect(response?.status()).toBe(200)
    await page.waitForLoadState('networkidle')

    await expect(page.locator('body')).not.toBeEmpty()

    expect(errors).toHaveLength(0)
  })

  test('Reference page loads', async ({ page }) => {
    const errors = collectConsoleErrors(page)

    const response = await page.goto(`${BASE_URL}/reference`)

    expect(response?.status()).toBe(200)
    await page.waitForLoadState('networkidle')

    await expect(page.locator('body')).not.toBeEmpty()

    expect(errors).toHaveLength(0)
  })

  test('Cookbook page loads', async ({ page }) => {
    const errors = collectConsoleErrors(page)

    const response = await page.goto(`${BASE_URL}/cookbook`)

    expect(response?.status()).toBe(200)
    await page.waitForLoadState('networkidle')

    await expect(page.locator('body')).not.toBeEmpty()

    expect(errors).toHaveLength(0)
  })
})

// =============================================================================
// COMPONENT REFERENCE PAGES
// =============================================================================

test.describe('Component Reference Pages', () => {
  const componentPages = [
    '/reference/components/error-boundary',
    '/reference/components/token-counter',
    '/reference/components/settings-panel',
    '/reference/components/drawer',
  ]

  for (const route of componentPages) {
    test(`${route} loads without errors`, async ({ page }) => {
      const errors = collectConsoleErrors(page)

      const response = await page.goto(`${BASE_URL}${route}`)

      expect(response?.status()).toBe(200)
      await page.waitForLoadState('networkidle')

      // Should have content
      await expect(page.locator('body')).not.toBeEmpty()

      // Check for console errors
      expect(errors).toHaveLength(0)
    })
  }
})

// =============================================================================
// HOOKS REFERENCE PAGES
// =============================================================================

test.describe('Hooks Reference Pages', () => {
  const hookPages = [
    '/reference/hooks/use-performance',
    '/reference/hooks/use-throttle',
    '/reference/hooks/use-toggle',
    '/reference/hooks/use-window-size',
  ]

  for (const route of hookPages) {
    test(`${route} loads without errors`, async ({ page }) => {
      const errors = collectConsoleErrors(page)

      const response = await page.goto(`${BASE_URL}${route}`)

      expect(response?.status()).toBe(200)
      await page.waitForLoadState('networkidle')

      await expect(page.locator('body')).not.toBeEmpty()

      expect(errors).toHaveLength(0)
    })
  }
})

// =============================================================================
// API REFERENCE PAGES
// =============================================================================

test.describe('API Reference Pages', () => {
  const apiPages = [
    '/reference/api/components',
    '/reference/api/hooks',
    '/reference/api/types',
  ]

  for (const route of apiPages) {
    test(`${route} loads without errors`, async ({ page }) => {
      const errors = collectConsoleErrors(page)

      const response = await page.goto(`${BASE_URL}${route}`)

      expect(response?.status()).toBe(200)
      await page.waitForLoadState('networkidle')

      await expect(page.locator('body')).not.toBeEmpty()

      expect(errors).toHaveLength(0)
    })
  }
})

// =============================================================================
// GUIDES PAGES
// =============================================================================

test.describe('Guide Pages', () => {
  const guidePages = [
    '/guides/installation',
    '/guides/theming',
    '/guides/error-handling',
    '/guides/best-practices',
  ]

  for (const route of guidePages) {
    test(`${route} loads without errors`, async ({ page }) => {
      const errors = collectConsoleErrors(page)

      const response = await page.goto(`${BASE_URL}${route}`)

      expect(response?.status()).toBe(200)
      await page.waitForLoadState('networkidle')

      await expect(page.locator('body')).not.toBeEmpty()

      expect(errors).toHaveLength(0)
    })
  }
})

// =============================================================================
// EXAMPLE PAGES
// =============================================================================

test.describe('Example Pages', () => {
  const examplePages = [
    '/examples/simple-chat',
    '/examples/code-assistant',
    '/examples/model-switching',
  ]

  for (const route of examplePages) {
    test(`${route} loads without errors`, async ({ page }) => {
      const errors = collectConsoleErrors(page)

      const response = await page.goto(`${BASE_URL}${route}`)

      expect(response?.status()).toBe(200)
      await page.waitForLoadState('networkidle')

      await expect(page.locator('body')).not.toBeEmpty()

      expect(errors).toHaveLength(0)
    })
  }
})

// =============================================================================
// ENTERPRISE PAGES
// =============================================================================

test.describe('Enterprise Pages', () => {
  test('Enterprise page loads', async ({ page }) => {
    const errors = collectConsoleErrors(page)

    const response = await page.goto(`${BASE_URL}/enterprise`)

    expect(response?.status()).toBe(200)
    await page.waitForLoadState('networkidle')

    await expect(page.locator('body')).not.toBeEmpty()

    expect(errors).toHaveLength(0)
  })

  test('Commercial page loads', async ({ page }) => {
    const errors = collectConsoleErrors(page)

    const response = await page.goto(`${BASE_URL}/commercial`)

    expect(response?.status()).toBe(200)
    await page.waitForLoadState('networkidle')

    await expect(page.locator('body')).not.toBeEmpty()

    expect(errors).toHaveLength(0)
  })
})

// =============================================================================
// IMAGE LOADING TESTS
// =============================================================================

test.describe('Image Loading', () => {
  test('Homepage has no broken images', async ({ page }) => {
    await page.goto(BASE_URL)
    await page.waitForLoadState('networkidle')

    const brokenImages = await checkBrokenImages(page)

    expect(brokenImages).toHaveLength(0)
  })

  test('Getting Started page has no broken images', async ({ page }) => {
    await page.goto(`${BASE_URL}/guides/getting-started`)
    await page.waitForLoadState('networkidle')

    const brokenImages = await checkBrokenImages(page)

    expect(brokenImages).toHaveLength(0)
  })
})

// =============================================================================
// NAVIGATION TESTS
// =============================================================================

test.describe('Navigation', () => {
  test('Main navigation is visible on homepage', async ({ page }) => {
    await page.goto(BASE_URL)
    await page.waitForLoadState('networkidle')

    // Should have some form of navigation
    const nav = page.locator('nav').or(page.locator('[role="navigation"]'))
    await expect(nav.first()).toBeVisible()
  })

  test('Can navigate from homepage to guides', async ({ page }) => {
    await page.goto(BASE_URL)
    await page.waitForLoadState('networkidle')

    // Try to find and click a guides link
    const guidesLink = page
      .locator('a[href*="guide"]')
      .or(page.locator('a:has-text("Guide")'))
      .or(page.locator('a:has-text("Getting Started")'))

    const firstLink = guidesLink.first()
    if (await firstLink.isVisible()) {
      await firstLink.click()
      await page.waitForLoadState('networkidle')

      // Should have navigated somewhere
      expect(page.url()).not.toBe(BASE_URL)
    }
  })
})

// =============================================================================
// ACCESSIBILITY SMOKE TESTS
// =============================================================================

test.describe('Basic Accessibility', () => {
  test('Homepage has heading hierarchy', async ({ page }) => {
    await page.goto(BASE_URL)
    await page.waitForLoadState('networkidle')

    // Should have at least one h1
    const h1 = page.locator('h1')
    await expect(h1.first()).toBeVisible()
  })

  test('Homepage has main landmark', async ({ page }) => {
    await page.goto(BASE_URL)
    await page.waitForLoadState('networkidle')

    // Should have main content area
    const main = page.locator('main').or(page.locator('[role="main"]'))
    await expect(main.first()).toBeVisible()
  })

  test('Interactive elements are keyboard accessible', async ({ page }) => {
    await page.goto(BASE_URL)
    await page.waitForLoadState('networkidle')

    // Press Tab and verify focus is visible
    await page.keyboard.press('Tab')

    // Check that something is focused
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
  })
})

// =============================================================================
// RESPONSIVE DESIGN SMOKE TESTS
// =============================================================================

test.describe('Responsive Design', () => {
  test('Homepage renders on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })

    const response = await page.goto(BASE_URL)

    expect(response?.status()).toBe(200)
    await page.waitForLoadState('networkidle')

    // Page should still have content
    await expect(page.locator('body')).not.toBeEmpty()
  })

  test('Homepage renders on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })

    const response = await page.goto(BASE_URL)

    expect(response?.status()).toBe(200)
    await page.waitForLoadState('networkidle')

    await expect(page.locator('body')).not.toBeEmpty()
  })

  test('Homepage renders on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })

    const response = await page.goto(BASE_URL)

    expect(response?.status()).toBe(200)
    await page.waitForLoadState('networkidle')

    await expect(page.locator('body')).not.toBeEmpty()
  })
})

// =============================================================================
// PERFORMANCE SMOKE TESTS
// =============================================================================

test.describe('Performance', () => {
  test('Homepage loads within acceptable time', async ({ page }) => {
    const startTime = Date.now()

    await page.goto(BASE_URL)
    await page.waitForLoadState('domcontentloaded')

    const loadTime = Date.now() - startTime

    // Should load DOM within 10 seconds (generous for CI)
    expect(loadTime).toBeLessThan(10000)
  })
})
