/**
 * Visual regression tests for EnhancedMarkdownRenderer component
 */

import { test, expect } from '@playwright/test'
import {
  VisualRegressionTester,
  STANDARD_VIEWPORTS,
  STANDARD_THEMES,
  createVisualTestParameters,
} from '@clarity-chat/react/utils/visual-regression'

test.describe('EnhancedMarkdownRenderer - Visual Regression', () => {
  let tester: VisualRegressionTester

  test.beforeEach(async ({ page }) => {
    tester = new VisualRegressionTester(page, 'EnhancedMarkdownRenderer')

    // Navigate to the component story
    await page.goto('http://localhost:6006/?path=/story/components-ai-enhancedmarkdownrenderer--default')
    await page.waitForSelector('[data-testid="storybook-preview-wrapper"]')
  })

  test.describe('Default State', () => {
    for (const viewport of [STANDARD_VIEWPORTS.mobile, STANDARD_VIEWPORTS.desktop]) {
      for (const theme of STANDARD_THEMES) {
        test(`should match baseline - ${viewport.name} - ${theme}`, async ({ page }) => {
          // Set theme
          await page.evaluate((themeName: string) => {
            document.documentElement.setAttribute('data-theme', themeName)
          }, theme)

          // Set viewport
          await page.setViewportSize({
            width: viewport.width,
            height: viewport.height,
          })

          // Wait for content to render
          await page.waitForSelector('[data-testid*="markdown"]')

          // Take screenshot
          const screenshot = await page.screenshot({
            fullPage: false, // Only the component area
            clip: await page.locator('[data-testid="storybook-preview-wrapper"]').boundingBox() || undefined,
          })

          // Compare with baseline
          await expect(screenshot).toMatchSnapshot({
            name: `enhanced-markdown-renderer--default--${viewport.name.toLowerCase().replace(' ', '-')}--${theme}.png`,
            threshold: 0.01, // 1% difference allowed
          })
        })
      }
    }
  })

  test.describe('With Code Blocks', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to code block story
      await page.goto('http://localhost:6006/?path=/story/components-ai-enhancedmarkdownrenderer--with-code-blocks')
      await page.waitForSelector('[data-testid="storybook-preview-wrapper"]')
    })

    for (const viewport of [STANDARD_VIEWPORTS.mobile, STANDARD_VIEWPORTS.desktop]) {
      test(`should match baseline with syntax highlighting - ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize({
          width: viewport.width,
          height: viewport.height,
        })

        // Wait for syntax highlighting to apply
        await page.waitForSelector('.hljs')

        const screenshot = await page.screenshot({
          fullPage: false,
          clip: await page.locator('[data-testid="storybook-preview-wrapper"]').boundingBox() || undefined,
        })

        await expect(screenshot).toMatchSnapshot({
          name: `enhanced-markdown-renderer--code-blocks--${viewport.name.toLowerCase().replace(' ', '-')}.png`,
          threshold: 0.01,
        })
      })
    }
  })

  test.describe('With Math Rendering', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to math story
      await page.goto('http://localhost:6006/?path=/story/components-ai-enhancedmarkdownrenderer--with-math')
      await page.waitForSelector('[data-testid="storybook-preview-wrapper"]')
    })

    test('should match baseline with KaTeX rendering', async ({ page }) => {
      // Wait for KaTeX to render
      await page.waitForSelector('.katex')

      const screenshot = await page.screenshot({
        fullPage: false,
        clip: await page.locator('[data-testid="storybook-preview-wrapper"]').boundingBox() || undefined,
      })

      await expect(screenshot).toMatchSnapshot({
        name: 'enhanced-markdown-renderer--math--desktop.png',
        threshold: 0.01,
      })
    })
  })

  test.describe('Interactive States', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('http://localhost:6006/?path=/story/components-ai-enhancedmarkdownrenderer--with-copy-buttons')
      await page.waitForSelector('[data-testid="storybook-preview-wrapper"]')
    })

    test('should match baseline with copy button hover', async ({ page }) => {
      // Hover over copy button
      await page.locator('[data-testid="copy-button"]').first().hover()

      // Wait for hover state
      await page.waitForTimeout(100)

      const screenshot = await page.screenshot({
        fullPage: false,
        clip: await page.locator('[data-testid="storybook-preview-wrapper"]').boundingBox() || undefined,
      })

      await expect(screenshot).toMatchSnapshot({
        name: 'enhanced-markdown-renderer--copy-hover--desktop.png',
        threshold: 0.01,
      })
    })

    test('should match baseline with copy button focus', async ({ page }) => {
      // Focus copy button
      await page.locator('[data-testid="copy-button"]').first().focus()

      const screenshot = await page.screenshot({
        fullPage: false,
        clip: await page.locator('[data-testid="storybook-preview-wrapper"]').boundingBox() || undefined,
      })

      await expect(screenshot).toMatchSnapshot({
        name: 'enhanced-markdown-renderer--copy-focus--desktop.png',
        threshold: 0.01,
      })
    })
  })

  test.describe('Loading States', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('http://localhost:6006/?path=/story/components-ai-enhancedmarkdownrenderer--streaming')
      await page.waitForSelector('[data-testid="storybook-preview-wrapper"]')
    })

    test('should match baseline during streaming', async ({ page }) => {
      // Wait for streaming animation to be visible
      await page.waitForSelector('[data-testid="streaming-cursor"]')

      const screenshot = await page.screenshot({
        fullPage: false,
        clip: await page.locator('[data-testid="storybook-preview-wrapper"]').boundingBox() || undefined,
      })

      await expect(screenshot).toMatchSnapshot({
        name: 'enhanced-markdown-renderer--streaming--desktop.png',
        threshold: 0.05, // Allow more tolerance for animations
      })
    })
  })

  test.describe('Error States', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('http://localhost:6006/?path=/story/components-ai-enhancedmarkdownrenderer--error-state')
      await page.waitForSelector('[data-testid="storybook-preview-wrapper"]')
    })

    test('should match baseline with error display', async ({ page }) => {
      const screenshot = await page.screenshot({
        fullPage: false,
        clip: await page.locator('[data-testid="storybook-preview-wrapper"]').boundingBox() || undefined,
      })

      await expect(screenshot).toMatchSnapshot({
        name: 'enhanced-markdown-renderer--error--desktop.png',
        threshold: 0.01,
      })
    })
  })
})