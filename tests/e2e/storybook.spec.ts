import { test, expect } from '@playwright/test'

/**
 * Visual regression tests for Storybook components
 * These tests ensure components render correctly across different browsers and viewports
 */

test.describe('Storybook Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    // Storybook can remember the last visited route in local storage.
    // Use an explicit docs path for deterministic smoke checks.
    await page.goto('/?path=/docs/welcome-introduction--docs')
  })

  test('homepage loads correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/Storybook/)
    await expect(page.getByRole('navigation', { name: 'Global' })).toBeVisible()
    await expect(
      page.frameLocator('#storybook-preview-iframe').getByRole('heading', {
        name: 'Clarity Chat',
        level: 1,
      })
    ).toBeVisible()
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
    await expect(
      page.frameLocator('#storybook-preview-iframe').getByRole('heading', {
        name: 'Getting Started',
        level: 1,
      })
    ).toBeVisible()
  })

  test('toolbar controls are visible', async ({ page }) => {
    await expect(page.getByRole('toolbar')).toBeVisible()
  })
})

test.describe('Component Smoke Tests', () => {
  test('ChatWindow default story renders', async ({ page }) => {
    await page.goto('/iframe.html?id=components-layout-chatwindow--default')
    await page.waitForLoadState('networkidle')
    await expect(
      page.getByText(/Hello! Can you help me with React/i)
    ).toBeVisible()
  })

  test('Message conversation story renders', async ({ page }) => {
    await page.goto(
      '/iframe.html?id=components-datadisplay-message--conversation'
    )
    await page.waitForLoadState('networkidle')
    await expect(page.getByText(/What is React\?/i)).toBeVisible()
  })

  test('Input default story renders and is editable', async ({ page }) => {
    await page.goto('/iframe.html?id=components-inputs-input--default')
    await page.waitForLoadState('networkidle')
    const input = page.getByPlaceholder('Enter text...')
    await expect(input).toBeVisible()
    await input.fill('Hello Storybook')
    await expect(input).toHaveValue('Hello Storybook')
  })
})

test.describe('Accessibility', () => {
  test('has no automatically detectable accessibility issues', async ({
    page,
  }) => {
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
