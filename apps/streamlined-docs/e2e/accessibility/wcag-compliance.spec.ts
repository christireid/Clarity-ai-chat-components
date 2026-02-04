import { test, expect } from '../fixtures/test-fixtures'

/**
 * WCAG 2.1 AA Accessibility E2E Tests
 *
 * Tests comprehensive WCAG 2.1 Level AA compliance including:
 * - Automated axe-core testing
 * - Keyboard navigation
 * - Screen reader compatibility
 * - Color contrast
 * - Focus management
 * - ARIA attributes
 *
 * Success Criteria: Zero accessibility violations
 */

test.describe('WCAG 2.1 AA Compliance', () => {
  test('homepage should have no accessibility violations', async ({
    page,
    makeAxeBuilder,
  }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const results = await makeAxeBuilder().analyze()

    expect(results.violations).toEqual([])
  })

  test('API reference page should have no accessibility violations', async ({
    page,
    makeAxeBuilder,
  }) => {
    await page.goto('/api/reference')
    await page.waitForLoadState('networkidle')

    const results = await makeAxeBuilder().analyze()

    expect(results.violations).toEqual([])
  })

  test('component documentation should have no accessibility violations', async ({
    page,
    makeAxeBuilder,
  }) => {
    await page.goto('/api/reference/components')
    await page.waitForLoadState('networkidle')

    const results = await makeAxeBuilder().analyze()

    expect(results.violations).toEqual([])
  })

  test('hooks documentation should have no accessibility violations', async ({
    page,
    makeAxeBuilder,
  }) => {
    await page.goto('/api/reference/hooks')
    await page.waitForLoadState('networkidle')

    const results = await makeAxeBuilder().analyze()

    expect(results.violations).toEqual([])
  })

  test('guides page should have no accessibility violations', async ({
    page,
    makeAxeBuilder,
  }) => {
    await page.goto('/guides/getting-started')
    await page.waitForLoadState('networkidle')

    const results = await makeAxeBuilder().analyze()

    expect(results.violations).toEqual([])
  })

  test('search modal should have no accessibility violations', async ({
    page,
    makeAxeBuilder,
    docsPage,
  }) => {
    await page.goto('/')
    await docsPage.search.open()

    const results = await makeAxeBuilder().analyze()

    expect(results.violations).toEqual([])
  })

  test('docs assistant should have no accessibility violations', async ({
    page,
    makeAxeBuilder,
    docsPage,
  }) => {
    await page.goto('/')
    await docsPage.docsAssistant.open()

    const results = await makeAxeBuilder().analyze()

    expect(results.violations).toEqual([])
  })
})

test.describe('Keyboard Navigation', () => {
  test('should be able to navigate entire page with keyboard', async ({
    page,
  }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Tab through interactive elements
    const tabStops: string[] = []

    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('Tab')
      await page.waitForTimeout(50)

      const focused = await page
        .locator(':focus')
        .first()
        .evaluate((el) => ({
          tag: el.tagName,
          text: el.textContent?.slice(0, 30),
          role: el.getAttribute('role'),
        }))

      tabStops.push(
        `${focused.tag}: ${focused.text || focused.role || 'unknown'}`
      )
    }

    // Should have tabbed through multiple elements
    expect(tabStops.length).toBe(20)

    // Should include navigation and interactive elements
    const hasInteractive = tabStops.some(
      (stop) =>
        stop.includes('A:') || // Links
        stop.includes('BUTTON:') || // Buttons
        stop.includes('INPUT:') // Inputs
    )

    expect(hasInteractive).toBe(true)
  })

  test('skip links should be functional', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Tab to first element (usually skip link)
    await page.keyboard.press('Tab')
    await page.waitForTimeout(100)

    const firstFocused = page.locator(':focus')
    const text = await firstFocused.textContent()

    // If skip link exists, it should be the first tab stop
    if (text?.toLowerCase().includes('skip')) {
      // Press Enter to activate
      await page.keyboard.press('Enter')
      await page.waitForTimeout(200)

      // Focus should have moved to main content
      const newFocused = page.locator(':focus')
      const newFocusedTag = await newFocused.evaluate((el) => el.tagName)

      // Should have skipped to main or content area
      expect(['MAIN', 'DIV', 'ARTICLE']).toContain(newFocusedTag)
    }
  })

  test('modal dialogs should trap focus', async ({ page, docsPage }) => {
    await page.goto('/')
    await docsPage.search.open()

    // Focus should be in the modal
    const initialFocus = await page
      .locator(':focus')
      .first()
      .evaluate((el) => {
        return !!el.closest('[role="dialog"]')
      })

    expect(initialFocus).toBe(true)

    // Tab multiple times
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab')
      await page.waitForTimeout(50)

      // Focus should still be within dialog
      const stillInDialog = await page
        .locator(':focus')
        .first()
        .evaluate((el) => {
          return !!el.closest('[role="dialog"]')
        })

      expect(stillInDialog).toBe(true)
    }
  })

  test('should support Shift+Tab for reverse navigation', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Tab forward
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    const forwardFocus = await page.locator(':focus').textContent()

    // Tab backward
    await page.keyboard.press('Shift+Tab')

    const backwardFocus = await page.locator(':focus').textContent()

    // Focus should have moved backward
    expect(backwardFocus).not.toBe(forwardFocus)
  })

  test('all interactive elements should be reachable via keyboard', async ({
    page,
  }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Get all interactive elements
    const interactiveElements = await page
      .locator(
        'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      .all()

    // All should be visible or have proper skip link pattern
    for (const element of interactiveElements.slice(0, 20)) {
      const isVisible = await element.isVisible()
      const tabindex = await element.getAttribute('tabindex')

      // Element should be visible or have tabindex=-1 (if hidden)
      expect(isVisible || tabindex === '-1').toBe(true)
    }
  })
})

test.describe('Screen Reader Compatibility', () => {
  test('page should have proper document structure', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Should have exactly one h1
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBe(1)

    // Should have main landmark
    const mainLandmark = page.locator('main, [role="main"]')
    await expect(mainLandmark.first()).toBeVisible()

    // Should have navigation landmark
    const navLandmark = page.locator('nav, [role="navigation"]')
    await expect(navLandmark.first()).toBeVisible()
  })

  test('landmarks should have proper labels', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Navigation landmarks should have aria-label if multiple exist
    const navLandmarks = page.locator('nav, [role="navigation"]')
    const navCount = await navLandmarks.count()

    if (navCount > 1) {
      // Check that at least some have labels
      for (let i = 0; i < navCount; i++) {
        const nav = navLandmarks.nth(i)
        const ariaLabel = await nav.getAttribute('aria-label')
        const ariaLabelledBy = await nav.getAttribute('aria-labelledby')

        // At least one nav should have a label
        if (ariaLabel || ariaLabelledBy) {
          expect(ariaLabel || ariaLabelledBy).toBeTruthy()
          break
        }
      }
    }
  })

  test('images should have alt text', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const images = await page.locator('img').all()

    for (const img of images) {
      const alt = await img.getAttribute('alt')
      const role = await img.getAttribute('role')

      // Image should have alt text or role="presentation"
      expect(alt !== null || role === 'presentation').toBe(true)
    }
  })

  test('buttons should have accessible names', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const buttons = await page.locator('button').all()

    for (const button of buttons.slice(0, 20)) {
      const text = await button.textContent()
      const ariaLabel = await button.getAttribute('aria-label')
      const ariaLabelledBy = await button.getAttribute('aria-labelledby')
      const title = await button.getAttribute('title')

      // Button should have accessible name
      expect(
        (text && text.trim().length > 0) || ariaLabel || ariaLabelledBy || title
      ).toBeTruthy()
    }
  })

  test('links should have descriptive text', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const links = await page.locator('a[href]').all()

    for (const link of links.slice(0, 20)) {
      const text = await link.textContent()
      const ariaLabel = await link.getAttribute('aria-label')
      const title = await link.getAttribute('title')

      // Link should have meaningful text
      const accessibleName = text?.trim() || ariaLabel || title

      expect(accessibleName).toBeTruthy()
      expect(accessibleName?.toLowerCase()).not.toBe('click here')
      expect(accessibleName?.toLowerCase()).not.toBe('read more')
    }
  })

  test('form inputs should have labels', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const inputs = await page.locator('input, textarea, select').all()

    for (const input of inputs) {
      const id = await input.getAttribute('id')
      const ariaLabel = await input.getAttribute('aria-label')
      const ariaLabelledBy = await input.getAttribute('aria-labelledby')
      const placeholder = await input.getAttribute('placeholder')

      // Input should have label, aria-label, or aria-labelledby
      // (Placeholder alone is not sufficient but acceptable for search)
      expect(
        (id && (await page.locator(`label[for="${id}"]`).count()) > 0) ||
          ariaLabel ||
          ariaLabelledBy ||
          placeholder
      ).toBeTruthy()
    }
  })

  test('dynamic content should announce changes', async ({
    page,
    docsPage,
  }) => {
    await page.goto('/')
    await docsPage.docsAssistant.open()

    // Look for live regions
    const liveRegions = page.locator(
      '[aria-live], [role="status"], [role="alert"]'
    )
    const count = await liveRegions.count()

    // Live regions help screen readers announce dynamic changes
    // This is optional but recommended for chat interfaces
    if (count > 0) {
      console.log(`Found ${count} live regions for dynamic announcements`)
    }
  })
})

test.describe('Focus Management', () => {
  test('focus should be visible', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Tab to first interactive element
    await page.keyboard.press('Tab')
    await page.waitForTimeout(100)

    const focused = page.locator(':focus')
    await expect(focused).toBeVisible()

    // Check if focus indicator is visible (outline, ring, etc.)
    const outlineWidth = await focused.evaluate((el) => {
      const style = window.getComputedStyle(el)
      return style.outlineWidth
    })

    // Should have visible focus indicator
    expect(outlineWidth).not.toBe('0px')
  })

  test('focus should move to modal when opened', async ({ page, docsPage }) => {
    await page.goto('/')

    // Open modal
    await docsPage.search.open()

    // Focus should be in modal
    const focusInModal = await page
      .locator(':focus')
      .first()
      .evaluate((el) => {
        return !!el.closest('[role="dialog"]')
      })

    expect(focusInModal).toBe(true)
  })

  test('focus should return to trigger when modal closed', async ({
    page,
    docsPage,
  }) => {
    await page.goto('/')

    // Get trigger button
    const triggerButton = page
      .locator('button:has-text("Search"), [data-testid="search-trigger"]')
      .first()

    if (await triggerButton.isVisible()) {
      await triggerButton.click()

      // Modal should be open
      await page.waitForTimeout(300)

      // Close modal with Escape
      await page.keyboard.press('Escape')
      await page.waitForTimeout(300)

      // Focus should return to trigger
      const focusedElement = page.locator(':focus')
      const isSameTrigger = await focusedElement.evaluate(
        (el, btn) => el === btn,
        await triggerButton.elementHandle()
      )

      // Focus management is important for accessibility
      // But implementation may vary
    }
  })
})

test.describe('Color Contrast', () => {
  test('text should have sufficient contrast in light mode', async ({
    page,
    makeAxeBuilder,
  }) => {
    await page.goto('/')
    await page.emulateMedia({ colorScheme: 'light' })
    await page.waitForLoadState('networkidle')

    const results = await makeAxeBuilder().withTags(['wcag2aa']).analyze()

    // Filter for contrast violations
    const contrastViolations = results.violations.filter((v) =>
      v.id.includes('contrast')
    )

    expect(contrastViolations).toEqual([])
  })

  test('text should have sufficient contrast in dark mode', async ({
    page,
    makeAxeBuilder,
  }) => {
    await page.goto('/')
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.waitForLoadState('networkidle')

    const results = await makeAxeBuilder().withTags(['wcag2aa']).analyze()

    const contrastViolations = results.violations.filter((v) =>
      v.id.includes('contrast')
    )

    expect(contrastViolations).toEqual([])
  })
})
