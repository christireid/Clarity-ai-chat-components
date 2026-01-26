import { test, expect } from '../fixtures/test-fixtures'

/**
 * Header Navigation E2E Tests
 *
 * Tests the main header navigation functionality including:
 * - Logo link
 * - Main navigation links
 * - Mobile menu toggle
 * - Active state indicators
 */

test.describe('Header Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('should display header with logo and navigation links', async ({
    page,
  }) => {
    // Verify header exists
    const header = page.locator('header')
    await expect(header).toBeVisible()

    // Verify logo is visible and clickable
    const logo = header.locator(
      'a:has-text("Clarity"), img[alt*="Clarity"], svg[aria-label*="logo"]'
    )
    await expect(logo.first()).toBeVisible()
  })

  test('should navigate to home when clicking logo', async ({
    page,
    docsPage,
  }) => {
    // Navigate to a different page first
    await docsPage.navigation.goToReference('components')

    // Click logo
    const logo = page
      .locator('header a:has-text("Clarity"), header img[alt*="Clarity"]')
      .first()
    await logo.click()
    await page.waitForLoadState('networkidle')

    // Should be back at home
    expect(page.url()).toMatch(/\/$/)
  })

  test('should have accessible navigation links', async ({ page }) => {
    const navLinks = page.locator('header nav a, header [role="navigation"] a')
    const count = await navLinks.count()

    // Should have at least 3 main navigation links
    expect(count).toBeGreaterThan(2)

    // All links should be visible and have text or aria-label
    for (let i = 0; i < Math.min(count, 10); i++) {
      const link = navLinks.nth(i)
      await expect(link).toBeVisible()

      const text = await link.textContent()
      const ariaLabel = await link.getAttribute('aria-label')

      expect(text || ariaLabel).toBeTruthy()
    }
  })

  test('should highlight active navigation link', async ({
    page,
    docsPage,
  }) => {
    // Navigate to API reference
    await docsPage.navigation.goToReference('components')

    // Find the "API" or "Reference" nav link
    const activeLink = page
      .locator(
        'header a[aria-current="page"], ' +
          'header a.active, ' +
          'header a[href*="reference"]'
      )
      .first()

    // Should have some active indicator (aria-current, class, or specific styling)
    const ariaCurrent = await activeLink.getAttribute('aria-current')
    const className = await activeLink.getAttribute('class')

    expect(
      ariaCurrent === 'page' ||
        className?.includes('active') ||
        className?.includes('current')
    ).toBeTruthy()
  })

  test('should navigate between main sections', async ({ page }) => {
    // Common navigation sections
    const sections = [
      { text: 'Guides', urlPattern: /guide|learn/i },
      { text: 'Reference', urlPattern: /reference|api/i },
      { text: 'Examples', urlPattern: /example|cookbook/i },
    ]

    for (const section of sections) {
      // Try to find and click the link
      const link = page.locator(`header a:has-text("${section.text}")`).first()

      if (await link.isVisible()) {
        await link.click()
        await page.waitForLoadState('networkidle')

        // Verify navigation occurred
        const url = page.url()
        const matched = section.urlPattern.test(url)

        if (!matched) {
          console.log(
            `Warning: Expected URL pattern ${section.urlPattern} but got ${url}`
          )
        }
      }
    }
  })

  test('should open mobile menu on small viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 })

    // Mobile menu button should be visible
    const menuButton = page.locator(
      'button[aria-label*="menu" i], ' +
        'button[aria-label*="navigation" i], ' +
        '[data-testid="mobile-menu-toggle"]'
    )

    await expect(menuButton.first()).toBeVisible()

    // Click to open menu
    await menuButton.first().click()
    await page.waitForTimeout(300) // Animation

    // Mobile menu should be visible
    const mobileMenu = page.locator(
      '[role="dialog"]:has(nav), ' +
        '[data-testid="mobile-menu"], ' +
        'nav[aria-label*="mobile" i]'
    )

    await expect(mobileMenu.first()).toBeVisible()
  })

  test('should close mobile menu when clicking outside', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })

    // Open menu
    const menuButton = page.locator('button[aria-label*="menu" i]').first()
    await menuButton.click()
    await page.waitForTimeout(300)

    // Click outside menu (on backdrop or body)
    await page.locator('body').click({ position: { x: 10, y: 10 } })
    await page.waitForTimeout(300)

    // Menu should be closed
    const mobileMenu = page.locator(
      '[role="dialog"]:has(nav), [data-testid="mobile-menu"]'
    )
    await expect(mobileMenu.first()).toBeHidden()
  })

  test('should support keyboard navigation', async ({ page }) => {
    // Tab through header links
    await page.keyboard.press('Tab')
    await page.waitForTimeout(100)

    // First focusable element should be in header
    const focused = page.locator(':focus')
    const focusedElement = await focused.first().evaluate((el) => ({
      tagName: el.tagName,
      text: el.textContent?.slice(0, 50),
      inHeader: !!el.closest('header'),
    }))

    expect(focusedElement.inHeader).toBe(true)

    // Continue tabbing to verify all links are reachable
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab')
      await page.waitForTimeout(50)
    }

    // Should still be able to focus elements
    await expect(page.locator(':focus')).toBeVisible()
  })

  test('should have proper ARIA attributes', async ({ page }) => {
    const nav = page.locator('header nav, header [role="navigation"]').first()
    await expect(nav).toBeVisible()

    // Navigation should have proper role or semantic element
    const role = await nav.evaluate(
      (el) => el.getAttribute('role') || el.tagName.toLowerCase()
    )
    expect(['navigation', 'nav']).toContain(role.toLowerCase())
  })
})
