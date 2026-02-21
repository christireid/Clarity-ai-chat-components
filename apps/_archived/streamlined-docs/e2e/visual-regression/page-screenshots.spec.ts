import { test, expect } from '../fixtures/test-fixtures'

/**
 * Visual Regression Tests
 *
 * Takes screenshots of all major pages and compares with baselines.
 * Helps detect unintended visual changes.
 *
 * To update baselines:
 *   npx playwright test --update-snapshots
 *
 * Note: Visual tests are browser-specific. Run separately for each browser.
 */

test.describe('Visual Regression - Main Pages', () => {
  test('homepage should match baseline', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Wait for animations to complete
    await page.waitForTimeout(500)

    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
      maxDiffPixels: 100, // Allow minor differences
    })
  })

  test('API reference page should match baseline', async ({ page }) => {
    await page.goto('/api/reference')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)

    await expect(page).toHaveScreenshot('api-reference.png', {
      fullPage: true,
      maxDiffPixels: 100,
    })
  })

  test('components page should match baseline', async ({ page }) => {
    await page.goto('/api/reference/components')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)

    await expect(page).toHaveScreenshot('components-page.png', {
      fullPage: true,
      maxDiffPixels: 100,
    })
  })

  test('hooks page should match baseline', async ({ page }) => {
    await page.goto('/api/reference/hooks')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)

    await expect(page).toHaveScreenshot('hooks-page.png', {
      fullPage: true,
      maxDiffPixels: 100,
    })
  })

  test('getting started guide should match baseline', async ({ page }) => {
    await page.goto('/guides/getting-started')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)

    await expect(page).toHaveScreenshot('getting-started.png', {
      fullPage: true,
      maxDiffPixels: 100,
    })
  })

  test('cookbook page should match baseline', async ({ page }) => {
    await page.goto('/cookbook')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)

    await expect(page).toHaveScreenshot('cookbook.png', {
      fullPage: true,
      maxDiffPixels: 100,
    })
  })
})

test.describe('Visual Regression - Components', () => {
  test('header should match baseline', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const header = page.locator('header')
    await expect(header).toHaveScreenshot('header.png', {
      maxDiffPixels: 50,
    })
  })

  test('sidebar should match baseline', async ({ page }) => {
    await page.goto('/api/reference')
    await page.waitForLoadState('networkidle')

    const sidebar = page.locator('aside, [role="complementary"]').first()
    await expect(sidebar).toHaveScreenshot('sidebar.png', {
      maxDiffPixels: 50,
    })
  })

  test('search modal should match baseline', async ({ page, docsPage }) => {
    await page.goto('/')
    await docsPage.search.open()
    await page.waitForTimeout(300)

    const searchModal = page.locator('[role="dialog"]').first()
    await expect(searchModal).toHaveScreenshot('search-modal.png', {
      maxDiffPixels: 50,
    })
  })

  test('docs assistant should match baseline', async ({ page, docsPage }) => {
    await page.goto('/')
    await docsPage.docsAssistant.open()
    await page.waitForTimeout(300)

    const chatPanel = page
      .locator('[data-testid="docs-assistant-panel"], [role="dialog"]')
      .first()
    await expect(chatPanel).toHaveScreenshot('docs-assistant.png', {
      maxDiffPixels: 50,
    })
  })

  test('code block should match baseline', async ({ page }) => {
    await page.goto('/guides/getting-started')
    await page.waitForLoadState('networkidle')

    const codeBlock = page.locator('pre code').first()
    if (await codeBlock.isVisible()) {
      await expect(codeBlock).toHaveScreenshot('code-block.png', {
        maxDiffPixels: 20,
      })
    }
  })
})

test.describe('Visual Regression - Responsive', () => {
  test('homepage mobile should match baseline', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)

    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      fullPage: true,
      maxDiffPixels: 100,
    })
  })

  test('homepage tablet should match baseline', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)

    await expect(page).toHaveScreenshot('homepage-tablet.png', {
      fullPage: true,
      maxDiffPixels: 100,
    })
  })

  test('API reference mobile should match baseline', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/api/reference')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)

    await expect(page).toHaveScreenshot('api-reference-mobile.png', {
      fullPage: true,
      maxDiffPixels: 100,
    })
  })
})

test.describe('Visual Regression - Themes', () => {
  test('homepage dark mode should match baseline', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)

    await expect(page).toHaveScreenshot('homepage-dark.png', {
      fullPage: true,
      maxDiffPixels: 100,
    })
  })

  test('API reference dark mode should match baseline', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto('/api/reference')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)

    await expect(page).toHaveScreenshot('api-reference-dark.png', {
      fullPage: true,
      maxDiffPixels: 100,
    })
  })

  test('search modal dark mode should match baseline', async ({
    page,
    docsPage,
  }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto('/')
    await docsPage.search.open()
    await page.waitForTimeout(300)

    const searchModal = page.locator('[role="dialog"]').first()
    await expect(searchModal).toHaveScreenshot('search-modal-dark.png', {
      maxDiffPixels: 50,
    })
  })
})

test.describe('Visual Regression - States', () => {
  test('search with results should match baseline', async ({
    page,
    docsPage,
  }) => {
    await page.goto('/')
    await docsPage.search.open()
    await docsPage.search.typeQuery('component')
    await page.waitForTimeout(500)

    const searchModal = page.locator('[role="dialog"]').first()
    await expect(searchModal).toHaveScreenshot('search-with-results.png', {
      maxDiffPixels: 100,
    })
  })

  test('search with no results should match baseline', async ({
    page,
    docsPage,
  }) => {
    await page.goto('/')
    await docsPage.search.open()
    await docsPage.search.typeQuery('xyznonexistent123')
    await page.waitForTimeout(500)

    const searchModal = page.locator('[role="dialog"]').first()
    await expect(searchModal).toHaveScreenshot('search-no-results.png', {
      maxDiffPixels: 50,
    })
  })

  test('button hover state should match baseline', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const button = page.locator('button, a.button').first()
    await button.hover()
    await page.waitForTimeout(200)

    await expect(button).toHaveScreenshot('button-hover.png', {
      maxDiffPixels: 20,
    })
  })

  test('button focus state should match baseline', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const button = page.locator('button').first()
    await button.focus()
    await page.waitForTimeout(200)

    await expect(button).toHaveScreenshot('button-focus.png', {
      maxDiffPixels: 20,
    })
  })
})

test.describe('Visual Regression - Specific Components', () => {
  test('breadcrumbs should match baseline', async ({ page }) => {
    await page.goto('/api/reference/hooks/use-token-budget-monitor')
    await page.waitForLoadState('networkidle')

    const breadcrumbs = page.locator('nav[aria-label*="Breadcrumb" i]').first()
    if (await breadcrumbs.isVisible()) {
      await expect(breadcrumbs).toHaveScreenshot('breadcrumbs.png', {
        maxDiffPixels: 20,
      })
    }
  })

  test('table of contents should match baseline', async ({ page }) => {
    await page.goto('/guides/getting-started')
    await page.waitForLoadState('networkidle')

    const toc = page
      .locator(
        'nav:has-text("On this page"), [data-testid="table-of-contents"]'
      )
      .first()
    if (await toc.isVisible()) {
      await expect(toc).toHaveScreenshot('table-of-contents.png', {
        maxDiffPixels: 50,
      })
    }
  })

  test('footer should match baseline', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const footer = page.locator('footer').first()
    if (await footer.isVisible()) {
      await expect(footer).toHaveScreenshot('footer.png', {
        maxDiffPixels: 50,
      })
    }
  })
})
