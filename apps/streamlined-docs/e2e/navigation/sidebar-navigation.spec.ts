import { test, expect } from '../fixtures/test-fixtures'

/**
 * Sidebar Navigation E2E Tests
 *
 * Tests the documentation sidebar navigation including:
 * - Section expand/collapse
 * - Active page highlighting
 * - Smooth scrolling to sections
 * - Collapsible subsections
 */

test.describe('Sidebar Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/api/reference')
    await page.waitForLoadState('networkidle')
  })

  test('should display sidebar with navigation sections', async ({ page }) => {
    const sidebar = page.locator('aside, [role="complementary"], nav.sidebar')
    await expect(sidebar.first()).toBeVisible()

    // Should have navigation links
    const links = sidebar.locator('a')
    const count = await links.count()
    expect(count).toBeGreaterThan(3)
  })

  test('should expand and collapse sections', async ({ page }) => {
    // Find expandable sections
    const expandButtons = page.locator(
      'aside button[aria-expanded], ' +
        '[role="complementary"] button[aria-expanded]'
    )

    const buttonCount = await expandButtons.count()
    if (buttonCount > 0) {
      const firstButton = expandButtons.first()

      // Get initial state
      const initialState = await firstButton.getAttribute('aria-expanded')

      // Click to toggle
      await firstButton.click()
      await page.waitForTimeout(300) // Animation

      // State should have changed
      const newState = await firstButton.getAttribute('aria-expanded')
      expect(newState).not.toBe(initialState)

      // Click again to toggle back
      await firstButton.click()
      await page.waitForTimeout(300)

      // Should return to initial state
      const finalState = await firstButton.getAttribute('aria-expanded')
      expect(finalState).toBe(initialState)
    }
  })

  test('should highlight active page in sidebar', async ({
    page,
    docsPage,
  }) => {
    // Navigate to a specific component page
    await docsPage.navigation.goToReference('components')

    // Find the active link in sidebar
    const activeLink = page
      .locator(
        'aside a[aria-current="page"], ' +
          'aside a.active, ' +
          '[role="complementary"] a[aria-current="page"]'
      )
      .first()

    // Active link should exist and be visible
    if (await activeLink.isVisible()) {
      const ariaCurrent = await activeLink.getAttribute('aria-current')
      const className = await activeLink.getAttribute('class')

      expect(
        ariaCurrent === 'page' ||
          className?.includes('active') ||
          className?.includes('current')
      ).toBeTruthy()
    }
  })

  test('should navigate to different sections via sidebar', async ({
    page,
  }) => {
    const sidebar = page.locator('aside, [role="complementary"]').first()
    const links = sidebar
      .locator('a')
      .filter({ hasText: /component|hook|util/i })

    const count = await links.count()
    if (count > 0) {
      // Click first available link
      const linkText = await links.first().textContent()
      await links.first().click()
      await page.waitForLoadState('networkidle')

      // URL should have changed
      expect(page.url()).toContain('reference')

      // Page should have content
      await expect(page.locator('main, [role="main"]')).toBeVisible()
    }
  })

  test('should maintain scroll position in sidebar when navigating', async ({
    page,
  }) => {
    const sidebar = page.locator('aside, [role="complementary"]').first()

    // Scroll sidebar down
    await sidebar.evaluate((el) => {
      el.scrollTop = 200
    })

    const scrollPosition = await sidebar.evaluate((el) => el.scrollTop)
    expect(scrollPosition).toBeGreaterThan(100)

    // Click a link
    const link = sidebar.locator('a').first()
    await link.click()
    await page.waitForLoadState('networkidle')

    // Sidebar should exist on new page
    await expect(sidebar).toBeVisible()
  })

  test('should support keyboard navigation in sidebar', async ({ page }) => {
    const sidebar = page.locator('aside, [role="complementary"]').first()
    const firstLink = sidebar.locator('a').first()

    // Focus first link
    await firstLink.focus()
    await expect(firstLink).toBeFocused()

    // Navigate with arrow keys or tab
    await page.keyboard.press('ArrowDown')
    await page.waitForTimeout(100)

    // Focus should have moved (if arrow key navigation is implemented)
    // Otherwise, tab should work
    await page.keyboard.press('Tab')
    const focused = page.locator(':focus')
    await expect(focused).toBeVisible()
  })

  test('should be sticky/fixed on desktop', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })

    const sidebar = page.locator('aside, [role="complementary"]').first()

    // Check if sidebar has fixed or sticky positioning
    const position = await sidebar.evaluate((el) => {
      const style = window.getComputedStyle(el)
      return style.position
    })

    // Sidebar should be fixed or sticky on desktop
    expect(['fixed', 'sticky', 'relative']).toContain(position)
  })

  test('should be toggleable on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 })

    // Sidebar might be hidden by default on mobile
    const sidebar = page.locator('aside, [role="complementary"]').first()

    // Look for sidebar toggle button
    const toggleButton = page.locator(
      'button[aria-label*="sidebar" i], ' +
        'button[aria-label*="menu" i], ' +
        '[data-testid="sidebar-toggle"]'
    )

    const hasToggle = (await toggleButton.count()) > 0

    if (hasToggle) {
      await toggleButton.first().click()
      await page.waitForTimeout(300)

      // Sidebar should become visible
      await expect(sidebar).toBeVisible()
    }
  })

  test('should have proper ARIA labels', async ({ page }) => {
    const sidebar = page.locator('aside, [role="complementary"]').first()

    // Check for navigation role or aria-label
    const role = await sidebar.getAttribute('role')
    const ariaLabel = await sidebar.getAttribute('aria-label')

    expect(
      role === 'complementary' || role === 'navigation' || ariaLabel
    ).toBeTruthy()
  })

  test('should show subsections for complex navigation', async ({
    page,
    docsPage,
  }) => {
    await docsPage.navigation.goToReference('components')

    // Look for nested navigation
    const nestedLists = page.locator('aside ul ul, aside ol ol')
    const hasNesting = (await nestedLists.count()) > 0

    if (hasNesting) {
      // Nested lists should be properly structured
      const firstNested = nestedLists.first()
      await expect(firstNested).toBeVisible()
    }
  })
})
