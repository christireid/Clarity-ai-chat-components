import { Page, Locator } from '@playwright/test'

/**
 * Test Helper Utilities
 *
 * Reusable helper functions for E2E tests
 */

/**
 * Wait for network to be idle (no pending requests)
 */
export async function waitForNetworkIdle(
  page: Page,
  timeout = 10000
): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout })
}

/**
 * Wait for all images to load on the page
 */
export async function waitForImages(page: Page): Promise<void> {
  await page.evaluate(() => {
    return Promise.all(
      Array.from(document.images)
        .filter((img) => !img.complete)
        .map(
          (img) =>
            new Promise((resolve) => {
              img.addEventListener('load', resolve)
              img.addEventListener('error', resolve)
            })
        )
    )
  })
}

/**
 * Check if element is in viewport
 */
export async function isInViewport(locator: Locator): Promise<boolean> {
  return await locator.evaluate((el) => {
    const rect = el.getBoundingClientRect()
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= window.innerHeight &&
      rect.right <= window.innerWidth
    )
  })
}

/**
 * Scroll element into view
 */
export async function scrollIntoView(locator: Locator): Promise<void> {
  await locator.evaluate((el) => {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  })
}

/**
 * Get computed style property of element
 */
export async function getComputedStyle(
  locator: Locator,
  property: string
): Promise<string> {
  return await locator.evaluate((el, prop) => {
    return window.getComputedStyle(el).getPropertyValue(prop)
  }, property)
}

/**
 * Check if element has CSS class
 */
export async function hasClass(
  locator: Locator,
  className: string
): Promise<boolean> {
  const classes = await locator.getAttribute('class')
  return classes?.split(' ').includes(className) || false
}

/**
 * Wait for animation to complete
 */
export async function waitForAnimation(
  page: Page,
  duration = 500
): Promise<void> {
  await page.waitForTimeout(duration)
}

/**
 * Get all text content from locators
 */
export async function getAllTextContent(
  locators: Locator[]
): Promise<string[]> {
  const texts: string[] = []
  for (const locator of locators) {
    const text = await locator.textContent()
    if (text) texts.push(text.trim())
  }
  return texts
}

/**
 * Check if page has console errors
 */
export function collectConsoleErrors(page: Page): string[] {
  const errors: string[] = []

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text())
    }
  })

  page.on('pageerror', (error) => {
    errors.push(error.message)
  })

  return errors
}

/**
 * Mock API response
 */
export async function mockApiResponse(
  page: Page,
  url: string | RegExp,
  response: any
): Promise<void> {
  await page.route(url, (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(response),
    })
  })
}

/**
 * Wait for element to be stable (not animating)
 */
export async function waitForStable(
  locator: Locator,
  timeout = 1000
): Promise<void> {
  const start = Date.now()
  let lastRect = await locator.boundingBox()

  while (Date.now() - start < timeout) {
    await new Promise((resolve) => setTimeout(resolve, 100))
    const currentRect = await locator.boundingBox()

    if (
      lastRect &&
      currentRect &&
      lastRect.x === currentRect.x &&
      lastRect.y === currentRect.y &&
      lastRect.width === currentRect.width &&
      lastRect.height === currentRect.height
    ) {
      return
    }

    lastRect = currentRect
  }
}

/**
 * Take screenshot with timestamp
 */
export async function takeTimestampedScreenshot(
  page: Page,
  name: string
): Promise<void> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  await page.screenshot({
    path: `test-results/screenshots/${name}-${timestamp}.png`,
    fullPage: true,
  })
}

/**
 * Check if localStorage has item
 */
export async function hasLocalStorageItem(
  page: Page,
  key: string
): Promise<boolean> {
  return await page.evaluate((k) => {
    return localStorage.getItem(k) !== null
  }, key)
}

/**
 * Clear localStorage
 */
export async function clearLocalStorage(page: Page): Promise<void> {
  await page.evaluate(() => {
    localStorage.clear()
  })
}

/**
 * Get meta tag content
 */
export async function getMetaContent(
  page: Page,
  name: string
): Promise<string | null> {
  return await page.locator(`meta[name="${name}"]`).getAttribute('content')
}

/**
 * Check if page has valid JSON-LD
 */
export async function hasValidJsonLd(page: Page): Promise<boolean> {
  const jsonLd = await page
    .locator('script[type="application/ld+json"]')
    .first()

  if (!(await jsonLd.isVisible())) {
    return false
  }

  const content = await jsonLd.textContent()

  try {
    JSON.parse(content || '')
    return true
  } catch {
    return false
  }
}

/**
 * Measure page load time
 */
export async function measurePageLoad(page: Page): Promise<number> {
  return await page.evaluate(() => {
    const perfData = window.performance.timing
    return perfData.loadEventEnd - perfData.navigationStart
  })
}

/**
 * Get all links on page
 */
export async function getAllLinks(page: Page): Promise<string[]> {
  const links = await page.locator('a[href]').all()
  const hrefs: string[] = []

  for (const link of links) {
    const href = await link.getAttribute('href')
    if (href) hrefs.push(href)
  }

  return hrefs
}

/**
 * Check for broken links
 */
export async function checkBrokenLinks(
  page: Page,
  baseUrl: string
): Promise<string[]> {
  const links = await getAllLinks(page)
  const brokenLinks: string[] = []

  for (const link of links) {
    if (link.startsWith('http') || link.startsWith('//')) {
      try {
        const response = await page.request.head(link)
        if (!response.ok()) {
          brokenLinks.push(link)
        }
      } catch {
        brokenLinks.push(link)
      }
    }
  }

  return brokenLinks
}

/**
 * Wait for specific network request
 */
export async function waitForRequest(
  page: Page,
  urlPattern: string | RegExp,
  timeout = 10000
): Promise<void> {
  await page.waitForRequest(urlPattern, { timeout })
}

/**
 * Wait for specific network response
 */
export async function waitForResponse(
  page: Page,
  urlPattern: string | RegExp,
  timeout = 10000
): Promise<void> {
  await page.waitForResponse(urlPattern, { timeout })
}

/**
 * Get current route/URL
 */
export async function getCurrentRoute(page: Page): Promise<string> {
  return page.url().replace(page.context().baseURL || '', '')
}

/**
 * Check if element is focusable
 */
export async function isFocusable(locator: Locator): Promise<boolean> {
  return await locator.evaluate((el) => {
    const tabindex = el.getAttribute('tabindex')

    if (tabindex === '-1') return false
    if (tabindex && parseInt(tabindex, 10) >= 0) return true

    const focusableTags = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA']
    return focusableTags.includes(el.tagName)
  })
}

/**
 * Get ARIA role of element
 */
export async function getAriaRole(locator: Locator): Promise<string | null> {
  const explicitRole = await locator.getAttribute('role')
  if (explicitRole) return explicitRole

  return await locator.evaluate((el) => {
    // Map of implicit ARIA roles
    const implicitRoles: Record<string, string> = {
      A: 'link',
      BUTTON: 'button',
      NAV: 'navigation',
      MAIN: 'main',
      HEADER: 'banner',
      FOOTER: 'contentinfo',
      ASIDE: 'complementary',
      ARTICLE: 'article',
      SECTION: 'region',
      H1: 'heading',
      H2: 'heading',
      H3: 'heading',
      H4: 'heading',
      H5: 'heading',
      H6: 'heading',
    }

    return implicitRoles[el.tagName] || null
  })
}
