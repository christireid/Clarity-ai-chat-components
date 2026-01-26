import { test as base, Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

/**
 * Custom Playwright Test Fixtures
 *
 * Provides:
 * - DocsPage: Page object model for documentation site
 * - makeAxeBuilder: Accessibility testing helper
 */

export interface DocsPage {
  page: Page
  navigation: {
    clickHeaderLink: (text: string) => Promise<void>
    clickSidebarLink: (text: string) => Promise<void>
    getBreadcrumbs: () => Promise<string[]>
    goToReference: (category: string) => Promise<void>
  }
  search: {
    open: () => Promise<void>
    typeQuery: (query: string) => Promise<void>
    selectResult: (index: number) => Promise<void>
    getResults: () => Promise<string[]>
  }
  docsAssistant: {
    open: () => Promise<void>
    close: () => Promise<void>
    sendMessage: (message: string) => Promise<void>
    waitForResponse: () => Promise<void>
    getMessages: () => Promise<string[]>
  }
}

/**
 * Creates a DocsPage fixture with helper methods
 */
async function createDocsPage(page: Page): Promise<DocsPage> {
  return {
    page,

    // Navigation helpers
    navigation: {
      async clickHeaderLink(text: string) {
        await page.locator(`header a:has-text("${text}")`).first().click()
        await page.waitForLoadState('networkidle')
      },

      async clickSidebarLink(text: string) {
        await page
          .locator(`aside a:has-text("${text}"), nav a:has-text("${text}")`)
          .first()
          .click()
        await page.waitForLoadState('networkidle')
      },

      async getBreadcrumbs() {
        const breadcrumb = page.locator(
          'nav[aria-label="Breadcrumb"], [aria-label="breadcrumb"]'
        )
        const items = await breadcrumb.locator('a, span').allTextContents()
        return items.filter((text) => text.trim().length > 0)
      },

      async goToReference(category: string) {
        await page.goto(`/api/reference/${category}`)
        await page.waitForLoadState('networkidle')
      },
    },

    // Search helpers
    search: {
      async open() {
        // Try common search shortcuts
        try {
          await page.keyboard.press('Meta+K')
          await page.waitForTimeout(500)
        } catch {
          // Try clicking search button
          const searchButton = page.locator(
            '[data-testid="search-trigger"], button:has-text("Search")'
          )
          await searchButton.first().click()
        }
      },

      async typeQuery(query: string) {
        const searchInput = page.locator(
          'input[type="search"], input[placeholder*="Search"], [role="searchbox"]'
        )
        await searchInput.first().fill(query)
        await page.waitForTimeout(300) // Debounce
      },

      async selectResult(index: number) {
        const results = page.locator(
          '[role="option"], [data-testid^="search-result"]'
        )
        await results.nth(index).click()
      },

      async getResults() {
        const results = page.locator(
          '[role="option"], [data-testid^="search-result"]'
        )
        const count = await results.count()
        const texts: string[] = []
        for (let i = 0; i < Math.min(count, 10); i++) {
          texts.push((await results.nth(i).textContent()) || '')
        }
        return texts
      },
    },

    // DocsAssistant helpers
    docsAssistant: {
      async open() {
        // Try keyboard shortcut first
        try {
          await page.keyboard.press('Meta+Shift+K')
          await page.waitForTimeout(500)
        } catch {
          // Try clicking assistant button
          const assistantButton = page.locator(
            '[data-testid="docs-assistant-trigger"], ' +
              'button:has-text("Ask AI"), ' +
              '[aria-label*="assistant" i]'
          )
          await assistantButton.first().click({ timeout: 5000 })
          await page.waitForTimeout(500)
        }

        // Verify chat is open
        await page.waitForSelector(
          '[data-testid="docs-assistant-panel"], ' +
            '[role="dialog"]:has-text("AI"), ' +
            '.chat-container',
          { timeout: 5000 }
        )
      },

      async close() {
        const closeButton = page.locator(
          '[data-testid="docs-assistant-close"], button[aria-label="Close"]'
        )
        await closeButton.first().click()
      },

      async sendMessage(message: string) {
        const input = page.locator(
          '[data-testid="chat-input"], ' +
            'textarea[placeholder*="Ask"], ' +
            'input[placeholder*="Ask"]'
        )
        await input.first().fill(message)
        await page.keyboard.press('Enter')
      },

      async waitForResponse() {
        // Wait for streaming to complete
        await page.waitForTimeout(2000)

        // Wait for loading indicators to disappear
        const loadingIndicators = page.locator(
          '[data-testid="loading"], ' + '.loading, ' + '[aria-busy="true"]'
        )
        await loadingIndicators
          .first()
          .waitFor({ state: 'hidden', timeout: 30000 })
          .catch(() => {
            // Timeout is okay - response might already be complete
          })
      },

      async getMessages() {
        const messages = page.locator('[data-testid^="message-"], .message')
        const count = await messages.count()
        const texts: string[] = []
        for (let i = 0; i < count; i++) {
          const text = await messages.nth(i).textContent()
          if (text) texts.push(text.trim())
        }
        return texts
      },
    },
  }
}

/**
 * Extended test with custom fixtures
 */
export const test = base.extend<{
  docsPage: DocsPage
  makeAxeBuilder: () => AxeBuilder
}>({
  docsPage: async ({ page }, use) => {
    const docsPage = await createDocsPage(page)
    // eslint-disable-next-line react-hooks/rules-of-hooks -- Playwright fixture, not React Hook
    await use(docsPage)
  },

  makeAxeBuilder: async ({ page }, use) => {
    const makeAxeBuilder = () =>
      new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .exclude('#third-party-ads') // Exclude third-party content we don't control
    // eslint-disable-next-line react-hooks/rules-of-hooks -- Playwright fixture, not React Hook
    await use(makeAxeBuilder)
  },
})

export { expect } from '@playwright/test'
