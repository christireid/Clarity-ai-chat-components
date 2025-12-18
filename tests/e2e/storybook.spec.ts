import { test, expect } from '@playwright/test'

/**
 * Visual regression tests for Storybook components
 * These tests ensure components render correctly across different browsers and viewports
 */

function attachPageDiagnostics(page: any) {
  // Surface runtime failures that can leave Storybook preview stuck loading.
  page.on('pageerror', (err: any) => {
    // eslint-disable-next-line no-console
    SecureLogger.error('[playwright][pageerror]', err)
  })
  page.on('console', (msg: any) => {
    if (msg.type?.() === 'error') {
      // eslint-disable-next-line no-console
      SecureLogger.error('[playwright][console.error]', msg.text?.())
    }
  })
}

test.describe('Storybook Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    attachPageDiagnostics(page)
    // Storybook can remember the last visited route in local storage.
    // Use an explicit docs path for deterministic smoke checks.
    await page.goto('/?path=/docs/welcome-introduction--docs')

    // Wait for Storybook preview to finish its initial load.
    // (The manager can render before the iframe finishes booting.)
    await expect(page.locator('#storybook-preview-iframe')).toBeVisible()
  })

  test('homepage loads correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/Storybook/)
    await expect(page.getByRole('navigation', { name: 'Global' })).toBeVisible()

    const frame = page.frameLocator('#storybook-preview-iframe')
    await expect(frame.locator('#storybook-docs')).toBeVisible({
      timeout: 30000,
    })
    await expect(
      frame.getByRole('heading', { name: /clarity chat/i, level: 1 })
    ).toBeVisible({ timeout: 30000 })
  })

  test('sidebar navigation is visible', async ({ page }) => {
    await expect(page.getByRole('navigation', { name: 'Global' })).toBeVisible()
  })

  test('can navigate to a story', async ({ page }) => {
    const nav = page.getByRole('navigation', { name: 'Global' })
    await expect(nav).toBeVisible()

    // Navigate to a known docs page (stable and fast)
    await nav.getByRole('link', { name: 'Getting Started' }).click()

    // Verify the preview iframe updates
    await expect(page.locator('#storybook-preview-iframe')).toBeVisible()
    const frame = page.frameLocator('#storybook-preview-iframe')
    await expect(frame.locator('#storybook-docs')).toBeVisible({
      timeout: 30000,
    })
    await expect(
      frame.getByRole('heading', { name: /getting started/i, level: 1 })
    ).toBeVisible({ timeout: 30000 })
  })

  test('toolbar controls are visible', async ({ page }) => {
    await expect(page.getByRole('toolbar')).toBeVisible()
  })
})

test.describe('Component Smoke Tests', () => {
  test('ChatWindow default story renders', async ({ page }) => {
    attachPageDiagnostics(page)
    await page.goto('/iframe.html?id=components-layout-chatwindow--default')
    await expect(page.locator('#storybook-root')).toBeVisible({
      timeout: 30000,
    })
    await expect(
      page.getByText(/Hello! Can you help me with React/i)
    ).toBeVisible({ timeout: 30000 })
  })

  test('Message conversation story renders', async ({ page }) => {
    attachPageDiagnostics(page)
    await page.goto(
      '/iframe.html?id=components-datadisplay-message--conversation'
    )
    await expect(page.locator('#storybook-root')).toBeVisible({
      timeout: 30000,
    })
    await expect(page.getByText(/What is React\?/i)).toBeVisible({
      timeout: 30000,
    })
  })

  test('Input default story renders and is editable', async ({ page }) => {
    attachPageDiagnostics(page)
    await page.goto('/iframe.html?id=components-inputs-input--default')
    await expect(page.locator('#storybook-root')).toBeVisible({
      timeout: 30000,
    })
    const input = page.getByPlaceholder('Enter text...')
    await expect(input).toBeVisible({ timeout: 30000 })
    await input.fill('Hello Storybook')
    // Some stories use controlled inputs that may normalize/overwrite the value.
    // For a smoke check, ensure the input remains editable and non-empty.
    await expect(input).toBeEditable()
    await expect(input).toHaveValue(/hello/i)
  })
})

test.describe('Accessibility', () => {
  test('has no automatically detectable accessibility issues', async ({
    page,
  }) => {
    attachPageDiagnostics(page)
    await page.goto('/')

    // This is a placeholder - you'd use @axe-core/playwright for real a11y testing
    // const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    // expect(accessibilityScanResults.violations).toEqual([])
  })
})

test.describe('Responsive Design', () => {
  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1920, height: 1080 },
  ]

  for (const viewport of viewports) {
    test(`renders correctly on ${viewport.name}`, async ({ page }) => {
      attachPageDiagnostics(page)
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      })
      await page.goto('/')

      // Smoke assertions only (visual baselines live in tests/visual/)
      const nav = page.getByRole('navigation', { name: 'Global' })
      if (viewport.name === 'mobile') {
        const openNav = page.getByRole('button', {
          name: /open navigation menu/i,
        })
        await expect(openNav).toBeVisible()
        await openNav.click()
      }
      await expect(nav).toBeVisible()
      await expect(page.locator('#storybook-preview-iframe')).toBeVisible()
    })
  }
})
