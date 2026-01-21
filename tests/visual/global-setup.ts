/**
 * Global setup for visual regression tests
 */

import { chromium } from '@playwright/test'

async function globalSetup() {
  console.log('Setting up visual regression testing environment...')

  // Pre-warm browser for faster tests
  const browser = await chromium.launch()
  const page = await browser.newPage()

  try {
    // Pre-load Storybook to ensure it's ready
    await page.goto('http://localhost:6006', { waitUntil: 'networkidle' })

    // Wait for Storybook to fully load
    await page.waitForSelector('[data-testid="storybook-wrapper"]', {
      timeout: 30000,
    })

    console.log('Storybook is ready for visual regression testing')
  } catch (error) {
    console.warn('Failed to pre-warm Storybook:', error)
  } finally {
    await browser.close()
  }
}

export default globalSetup