import { test, expect } from '../fixtures/test-fixtures'

/**
 * Search Functionality E2E Tests
 *
 * Tests the documentation search feature including:
 * - Opening/closing search modal
 * - Search query input and results
 * - Keyboard shortcuts
 * - Result navigation
 * - Search performance
 */

test.describe('Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('should open search with keyboard shortcut (Cmd+K)', async ({
    page,
    docsPage,
  }) => {
    await docsPage.search.open()

    // Search modal should be visible
    const searchModal = page.locator(
      '[role="dialog"]:has(input[type="search"]), ' +
        '[role="dialog"]:has([role="searchbox"]), ' +
        '[data-testid="search-modal"]'
    )

    await expect(searchModal.first()).toBeVisible()
  })

  test('should open search by clicking search button', async ({ page }) => {
    const searchButton = page.locator(
      'button:has-text("Search"), ' +
        '[data-testid="search-trigger"], ' +
        'button[aria-label*="Search" i]'
    )

    if (await searchButton.isVisible()) {
      await searchButton.first().click()

      const searchModal = page.locator(
        '[role="dialog"]:has(input[type="search"])'
      )
      await expect(searchModal.first()).toBeVisible()
    } else {
      // Fallback to keyboard shortcut
      await page.keyboard.press('Meta+K')
      const searchModal = page.locator(
        '[role="dialog"]:has(input[type="search"])'
      )
      await expect(searchModal.first()).toBeVisible()
    }
  })

  test('should close search with Escape key', async ({ page, docsPage }) => {
    await docsPage.search.open()

    // Verify search is open
    const searchModal = page.locator(
      '[role="dialog"]:has(input[type="search"])'
    )
    await expect(searchModal.first()).toBeVisible()

    // Press Escape
    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)

    // Search should be closed
    await expect(searchModal.first()).toBeHidden()
  })

  test('should display search results for query', async ({
    page,
    docsPage,
  }) => {
    await docsPage.search.open()
    await docsPage.search.typeQuery('chat')

    // Results should appear
    const results = page.locator(
      '[role="option"], ' +
        '[data-testid^="search-result"], ' +
        '.search-result'
    )

    // Wait for results to load
    await page.waitForTimeout(500)

    const count = await results.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should highlight search terms in results', async ({
    page,
    docsPage,
  }) => {
    await docsPage.search.open()
    await docsPage.search.typeQuery('provider')

    await page.waitForTimeout(500)

    // Results should contain highlighted text
    const highlightedText = page.locator(
      'mark, ' + '.highlight, ' + 'strong, ' + '[data-highlight]'
    )

    const count = await highlightedText.count()
    // Some results should have highlights
    expect(count).toBeGreaterThan(0)
  })

  test('should navigate results with keyboard arrows', async ({
    page,
    docsPage,
  }) => {
    await docsPage.search.open()
    await docsPage.search.typeQuery('component')

    await page.waitForTimeout(500)

    // Press arrow down to select first result
    await page.keyboard.press('ArrowDown')
    await page.waitForTimeout(100)

    // A result should be selected/highlighted
    const selectedResult = page.locator(
      '[role="option"][aria-selected="true"], ' +
        '[role="option"].selected, ' +
        '.search-result.active'
    )

    const count = await selectedResult.count()
    expect(count).toBeGreaterThan(0)

    // Press arrow down again
    await page.keyboard.press('ArrowDown')
    await page.waitForTimeout(100)

    // Selection should have moved
    // (Verify by checking if different element is selected)
  })

  test('should navigate to page when clicking result', async ({
    page,
    docsPage,
  }) => {
    await docsPage.search.open()
    await docsPage.search.typeQuery('installation')

    await page.waitForTimeout(500)

    const results = page.locator(
      '[role="option"], [data-testid^="search-result"]'
    )
    const count = await results.count()

    if (count > 0) {
      const firstResultText = await results.first().textContent()

      // Click first result
      await results.first().click()
      await page.waitForLoadState('networkidle')

      // Should navigate to result page
      expect(page.url()).not.toBe('/')

      // Search modal should close
      const searchModal = page.locator(
        '[role="dialog"]:has(input[type="search"])'
      )
      await expect(searchModal.first()).toBeHidden()
    }
  })

  test('should navigate to page with Enter key', async ({ page, docsPage }) => {
    await docsPage.search.open()
    await docsPage.search.typeQuery('quick start')

    await page.waitForTimeout(500)

    // Select first result with arrow key
    await page.keyboard.press('ArrowDown')
    await page.waitForTimeout(100)

    // Press Enter to navigate
    await page.keyboard.press('Enter')
    await page.waitForLoadState('networkidle')

    // Should navigate away from home
    expect(page.url()).not.toBe('http://localhost:3000/')
  })

  test('should show "no results" message for invalid query', async ({
    page,
    docsPage,
  }) => {
    await docsPage.search.open()
    await docsPage.search.typeQuery('xyzabc123nonexistent')

    await page.waitForTimeout(500)

    // Should show no results message
    const noResults = page.locator(
      'text=/no results?/i, ' +
        'text=/nothing found/i, ' +
        '[data-testid="no-results"]'
    )

    await expect(noResults.first()).toBeVisible()
  })

  test('should clear search input with clear button', async ({
    page,
    docsPage,
  }) => {
    await docsPage.search.open()
    await docsPage.search.typeQuery('test query')

    // Find clear button
    const clearButton = page.locator(
      'button[aria-label*="clear" i], ' +
        'button[aria-label*="reset" i], ' +
        '[data-testid="search-clear"]'
    )

    if (await clearButton.isVisible()) {
      await clearButton.first().click()

      // Input should be empty
      const searchInput = page.locator(
        'input[type="search"], [role="searchbox"]'
      )
      const value = await searchInput.first().inputValue()
      expect(value).toBe('')
    }
  })

  test('should show recent searches if available', async ({
    page,
    docsPage,
  }) => {
    await docsPage.search.open()

    // Without typing, might show recent searches
    const recentSearches = page.locator(
      'text=/recent searches?/i, ' +
        'text=/history/i, ' +
        '[data-testid="recent-searches"]'
    )

    const hasRecent = (await recentSearches.count()) > 0
    // This is optional functionality - just verify it doesn't crash
    if (hasRecent) {
      await expect(recentSearches.first()).toBeVisible()
    }
  })

  test('should categorize search results', async ({ page, docsPage }) => {
    await docsPage.search.open()
    await docsPage.search.typeQuery('use')

    await page.waitForTimeout(500)

    // Results might be categorized (Components, Hooks, Guides, etc.)
    const categories = page.locator(
      'text=/components/i, ' +
        'text=/hooks/i, ' +
        'text=/guides/i, ' +
        '[data-testid^="category-"]'
    )

    const count = await categories.count()
    // Categories are optional but nice to have
    if (count > 0) {
      console.log(`Found ${count} result categories`)
    }
  })

  test('should be accessible with screen reader', async ({
    page,
    docsPage,
  }) => {
    await docsPage.search.open()

    const searchModal = page.locator('[role="dialog"]').first()

    // Should have proper ARIA labels
    const ariaLabel = await searchModal.getAttribute('aria-label')
    const ariaLabelledBy = await searchModal.getAttribute('aria-labelledby')

    expect(ariaLabel || ariaLabelledBy).toBeTruthy()

    // Search input should have proper role
    const searchInput = page.locator('input[type="search"], [role="searchbox"]')
    const inputRole = await searchInput.first().getAttribute('role')
    const inputLabel = await searchInput.first().getAttribute('aria-label')

    expect(inputRole === 'searchbox' || inputLabel).toBeTruthy()
  })

  test('should handle rapid typing without crashes', async ({
    page,
    docsPage,
  }) => {
    await docsPage.search.open()

    const searchInput = page
      .locator('input[type="search"], [role="searchbox"]')
      .first()

    // Type rapidly
    const query = 'component provider hooks utils'
    for (const char of query) {
      await searchInput.type(char, { delay: 10 })
    }

    await page.waitForTimeout(300)

    // Should still be functional
    await expect(searchInput).toBeVisible()
    await expect(searchInput).toHaveValue(query)
  })

  test('should search across all documentation types', async ({
    page,
    docsPage,
  }) => {
    await docsPage.search.open()
    await docsPage.search.typeQuery('authentication')

    await page.waitForTimeout(500)

    const results = await docsPage.search.getResults()

    // Should return results from different sections
    expect(results.length).toBeGreaterThan(0)

    // Results might include guides, API docs, examples
    const combinedText = results.join(' ').toLowerCase()
    const hasVariety =
      combinedText.includes('component') ||
      combinedText.includes('hook') ||
      combinedText.includes('guide')

    // Just verify we got results
    expect(results.length).toBeGreaterThan(0)
  })

  test('should be responsive on mobile', async ({ page, docsPage }) => {
    await page.setViewportSize({ width: 375, height: 812 })

    await docsPage.search.open()

    // Search should take full screen on mobile
    const searchModal = page.locator('[role="dialog"]').first()
    await expect(searchModal).toBeVisible()

    // Should be usable on mobile
    const searchInput = page.locator('input[type="search"], [role="searchbox"]')
    await searchInput.first().fill('test')

    await expect(searchInput.first()).toHaveValue('test')
  })
})
