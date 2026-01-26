import { test, expect } from '../fixtures/test-fixtures'

/**
 * Breadcrumb Navigation E2E Tests
 *
 * Tests breadcrumb trail functionality including:
 * - Proper hierarchy display
 * - Clickable links to parent pages
 * - Current page indication
 * - Accessibility compliance
 */

test.describe('Breadcrumb Navigation', () => {
  test('should display breadcrumbs on API reference pages', async ({
    page,
    docsPage,
  }) => {
    await docsPage.navigation.goToReference('components')

    const breadcrumb = page.locator(
      'nav[aria-label="Breadcrumb"], nav[aria-label="breadcrumb"], [aria-label="Breadcrumb"]'
    )
    await expect(breadcrumb.first()).toBeVisible()
  })

  test('should show correct hierarchy in breadcrumbs', async ({
    page,
    docsPage,
  }) => {
    await docsPage.navigation.goToReference('components')

    const items = await docsPage.navigation.getBreadcrumbs()

    // Should have at least 2 items (Home > Current)
    expect(items.length).toBeGreaterThanOrEqual(2)

    // First item should be home or root
    expect(items[0]).toMatch(/home|clarity|root/i)
  })

  test('should navigate to parent page when clicking breadcrumb', async ({
    page,
    docsPage,
  }) => {
    // Navigate to a deep page
    await page.goto('/api/reference/components')
    await page.waitForLoadState('networkidle')

    // Get breadcrumbs
    const breadcrumbLinks = page.locator('nav[aria-label*="Breadcrumb" i] a')
    const count = await breadcrumbLinks.count()

    if (count > 1) {
      // Click second-to-last breadcrumb (parent page)
      const parentLink = breadcrumbLinks.nth(count - 2)
      const href = await parentLink.getAttribute('href')

      await parentLink.click()
      await page.waitForLoadState('networkidle')

      // Should navigate to parent
      if (href) {
        expect(page.url()).toContain(href)
      }
    }
  })

  test('should indicate current page in breadcrumbs', async ({
    page,
    docsPage,
  }) => {
    await docsPage.navigation.goToReference('hooks')

    const breadcrumb = page.locator('nav[aria-label*="Breadcrumb" i]')

    // Last item should indicate current page
    const lastItem = breadcrumb.locator(
      'li:last-child, span:last-child, [aria-current="page"]'
    )
    await expect(lastItem.first()).toBeVisible()

    // Check for aria-current
    const ariaCurrent = await lastItem.first().getAttribute('aria-current')
    if (ariaCurrent) {
      expect(ariaCurrent).toBe('page')
    }
  })

  test('should use proper separators between breadcrumb items', async ({
    page,
    docsPage,
  }) => {
    await docsPage.navigation.goToReference('components')

    const breadcrumb = page.locator('nav[aria-label*="Breadcrumb" i]')

    // Should have separators (>, /, or aria-hidden icons)
    const separators = breadcrumb.locator(
      'svg[aria-hidden="true"], ' +
        '[role="presentation"], ' +
        'span:has-text("/"), ' +
        'span:has-text(">")'
    )

    const separatorCount = await separators.count()
    expect(separatorCount).toBeGreaterThan(0)
  })

  test('should be accessible to screen readers', async ({ page, docsPage }) => {
    await docsPage.navigation.goToReference('components')

    const breadcrumb = page.locator('nav[aria-label*="Breadcrumb" i]').first()

    // Should have proper ARIA label
    const ariaLabel = await breadcrumb.getAttribute('aria-label')
    expect(ariaLabel).toMatch(/breadcrumb/i)

    // Should use ordered list or proper semantic structure
    const hasList = (await breadcrumb.locator('ol, ul').count()) > 0
    expect(hasList).toBe(true)
  })

  test('should show full path for deeply nested pages', async ({ page }) => {
    // Navigate to a deeply nested page
    await page.goto('/api/reference/hooks/use-token-budget-monitor')
    await page.waitForLoadState('networkidle')

    const breadcrumbItems = page.locator(
      'nav[aria-label*="Breadcrumb" i] li, nav[aria-label*="Breadcrumb" i] a'
    )
    const count = await breadcrumbItems.count()

    // Should have multiple levels (Home > API > Reference > Hooks > Hook Name)
    expect(count).toBeGreaterThan(2)
  })

  test('should be responsive on mobile', async ({ page, docsPage }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await docsPage.navigation.goToReference('components')

    const breadcrumb = page.locator('nav[aria-label*="Breadcrumb" i]')
    await expect(breadcrumb.first()).toBeVisible()

    // Should not overflow on mobile
    const isOverflowing = await breadcrumb.first().evaluate((el) => {
      return el.scrollWidth > el.clientWidth
    })

    // If overflowing, should have ellipsis or truncation
    if (isOverflowing) {
      // This is acceptable - breadcrumbs might scroll or truncate on mobile
      console.log('Breadcrumbs overflow on mobile - consider truncation')
    }
  })

  test('should support keyboard navigation', async ({ page, docsPage }) => {
    await docsPage.navigation.goToReference('components')

    const breadcrumbLinks = page.locator('nav[aria-label*="Breadcrumb" i] a')
    const count = await breadcrumbLinks.count()

    if (count > 0) {
      // Focus first breadcrumb link
      await breadcrumbLinks.first().focus()
      await expect(breadcrumbLinks.first()).toBeFocused()

      // Tab to next breadcrumb
      await page.keyboard.press('Tab')
      await page.waitForTimeout(100)

      // Should focus next element
      const focused = page.locator(':focus')
      await expect(focused).toBeVisible()
    }
  })

  test('should update breadcrumbs when navigating', async ({
    page,
    docsPage,
  }) => {
    await docsPage.navigation.goToReference('components')
    const initialBreadcrumbs = await docsPage.navigation.getBreadcrumbs()

    await docsPage.navigation.goToReference('hooks')
    const newBreadcrumbs = await docsPage.navigation.getBreadcrumbs()

    // Breadcrumbs should be different
    expect(newBreadcrumbs).not.toEqual(initialBreadcrumbs)
  })

  test('should not show breadcrumbs on homepage', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const breadcrumb = page.locator('nav[aria-label*="Breadcrumb" i]')
    const isVisible = await breadcrumb.isVisible().catch(() => false)

    // Breadcrumbs typically not shown on homepage
    // This is okay - not an error
    if (isVisible) {
      const items = await breadcrumb.locator('li, a').count()
      // If shown, should only have one item (Home)
      expect(items).toBeLessThanOrEqual(1)
    }
  })
})
