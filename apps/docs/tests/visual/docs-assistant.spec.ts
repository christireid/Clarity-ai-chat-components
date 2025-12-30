import { test, expect } from '@playwright/test'

/**
 * DocsAssistant Visual Tests
 *
 * Run these tests with:
 *   npx playwright test apps/docs/tests/visual/docs-assistant.spec.ts --headed
 *
 * Prerequisites:
 *   1. Start the docs server: cd apps/docs && pnpm dev
 *   2. Install Playwright browsers: npx playwright install chromium
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

test.describe('DocsAssistant Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the docs site
    await page.goto(BASE_URL)
    // Wait for the page to load
    await page.waitForLoadState('networkidle')
  })

  test('homepage loads correctly', async ({ page }) => {
    // Take a screenshot of the homepage
    await page.screenshot({
      path: 'test-results/screenshots/homepage.png',
      fullPage: true,
    })

    // Verify the page title
    await expect(page).toHaveTitle(/Clarity/)
  })

  test('DocsAssistant chatbot opens and displays correctly', async ({
    page,
  }) => {
    // Look for the DocsAssistant trigger button (usually in bottom-right corner)
    const assistantButton = page
      .locator('[data-testid="docs-assistant-trigger"]')
      .or(
        page.locator('button:has-text("Ask AI")').or(
          page.locator('[aria-label*="assistant"]').or(
            page
              .locator('button')
              .filter({ has: page.locator('svg') })
              .last()
          )
        )
      )

    // Take screenshot before opening
    await page.screenshot({
      path: 'test-results/screenshots/before-assistant-open.png',
    })

    // Try to open the assistant
    try {
      await assistantButton.first().click({ timeout: 5000 })
      await page.waitForTimeout(500) // Wait for animation
    } catch {
      console.log('Could not find assistant button, trying keyboard shortcut')
      // Try keyboard shortcut (Cmd/Ctrl + K is common)
      await page.keyboard.press('Meta+k')
      await page.waitForTimeout(500)
    }

    // Take screenshot after opening
    await page.screenshot({
      path: 'test-results/screenshots/assistant-opened.png',
    })
  })

  test('DocsAssistant chat interaction flow', async ({ page }) => {
    // Open the assistant (adjust selector as needed)
    await page.keyboard.press('Meta+k')
    await page.waitForTimeout(500)

    // Find the input field
    const inputField = page
      .locator('input[type="text"], textarea')
      .or(
        page
          .locator('[role="textbox"]')
          .or(page.locator('[contenteditable="true"]'))
      )

    // Screenshot: Empty chat state
    await page.screenshot({
      path: 'test-results/screenshots/chat-empty-state.png',
    })

    // Type a question
    await inputField.first().fill('How do I install clarity chat?')
    await page.screenshot({
      path: 'test-results/screenshots/chat-with-input.png',
    })

    // Submit the question (Enter or click send button)
    await page.keyboard.press('Enter')

    // Wait for response (streaming may take time)
    await page.waitForTimeout(3000)

    // Screenshot: With response
    await page.screenshot({
      path: 'test-results/screenshots/chat-with-response.png',
    })
  })

  test('responsive design - mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 })

    await page.screenshot({
      path: 'test-results/screenshots/homepage-mobile.png',
      fullPage: true,
    })

    // Open assistant on mobile
    await page.keyboard.press('Meta+k')
    await page.waitForTimeout(500)

    await page.screenshot({
      path: 'test-results/screenshots/assistant-mobile.png',
    })
  })

  test('responsive design - tablet viewport', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })

    await page.screenshot({
      path: 'test-results/screenshots/homepage-tablet.png',
      fullPage: true,
    })
  })

  test('dark mode appearance', async ({ page }) => {
    // Enable dark mode via media query emulation
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.reload()
    await page.waitForLoadState('networkidle')

    await page.screenshot({
      path: 'test-results/screenshots/homepage-dark.png',
      fullPage: true,
    })

    // Open assistant in dark mode
    await page.keyboard.press('Meta+k')
    await page.waitForTimeout(500)

    await page.screenshot({
      path: 'test-results/screenshots/assistant-dark.png',
    })
  })

  test('accessibility audit', async ({ page }) => {
    // Basic accessibility checks using locators (page.accessibility is deprecated)
    // Check for main landmark
    const main = page.locator('main')
    await expect(main).toBeVisible()

    // Check for proper heading hierarchy
    const h1 = page.locator('h1').first()
    await expect(h1).toBeVisible()

    // Verify page has accessible name
    const pageTitle = await page.title()
    expect(pageTitle).toBeTruthy()

    // Check for skip link or navigation landmark
    const nav = page.locator('nav').first()
    const hasNav = await nav.isVisible().catch(() => false)
    console.log('Has navigation landmark:', hasNav)

    // Log ARIA landmarks found
    const landmarks = await page
      .locator(
        '[role="main"], [role="navigation"], [role="banner"], main, nav, header'
      )
      .count()
    console.log('ARIA landmarks found:', landmarks)
  })
})

test.describe('Documentation Pages Visual Tests', () => {
  const pages = [
    { name: 'cookbook', path: '/cookbook' },
    { name: 'quick-start', path: '/learn/quick-start' },
    { name: 'playground', path: '/playground' },
    { name: 'reference', path: '/reference' },
    { name: 'components', path: '/reference/components' },
    { name: 'hooks', path: '/reference/hooks' },
  ]

  for (const pageInfo of pages) {
    test(`${pageInfo.name} page visual check`, async ({ page }) => {
      await page.goto(`${BASE_URL}${pageInfo.path}`)
      await page.waitForLoadState('networkidle')

      await page.screenshot({
        path: `test-results/screenshots/page-${pageInfo.name}.png`,
        fullPage: true,
      })

      // Basic content check
      await expect(page.locator('body')).not.toBeEmpty()
    })
  }
})
