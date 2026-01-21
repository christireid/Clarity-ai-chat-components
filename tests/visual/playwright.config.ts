/**
 * Playwright configuration for visual regression testing
 */

import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,

  // Reporter to use
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }],
  ],

  // Shared settings for all the projects below
  use: {
    // Base URL to use in actions like `await page.goto('/')`
    baseURL: 'http://localhost:6006',

    // Collect trace when retrying the failed test
    trace: 'on-first-retry',

    // Take screenshot on failure
    screenshot: 'only-on-failure',
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'visual-regression-chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Configure for visual regression
        viewport: { width: 1440, height: 900 },
        deviceScaleFactor: 1,
        // Disable animations for consistent screenshots
        reducedMotion: 'reduce',
      },
      testMatch: '**/visual/**/*.spec.ts',
    },
    {
      name: 'visual-regression-firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1440, height: 900 },
        deviceScaleFactor: 1,
        reducedMotion: 'reduce',
      },
      testMatch: '**/visual/**/*.spec.ts',
    },
    {
      name: 'visual-regression-webkit',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1440, height: 900 },
        deviceScaleFactor: 1,
        reducedMotion: 'reduce',
      },
      testMatch: '**/visual/**/*.spec.ts',
    },

    // Mobile visual regression tests
    {
      name: 'visual-regression-mobile',
      use: {
        ...devices['iPhone 13'],
        deviceScaleFactor: 1,
        reducedMotion: 'reduce',
      },
      testMatch: '**/visual/**/*.spec.ts',
    },
    {
      name: 'visual-regression-tablet',
      use: {
        ...devices['iPad Pro'],
        deviceScaleFactor: 1,
        reducedMotion: 'reduce',
      },
      testMatch: '**/visual/**/*.spec.ts',
    },
  ],

  // Run your local dev server before starting the tests
  webServer: {
    command: 'pnpm --filter @clarity-chat/storybook dev',
    port: 6006,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },

  // Global setup and teardown
  globalSetup: require.resolve('./global-setup'),
  globalTeardown: require.resolve('./global-teardown'),

  // Test configuration
  expect: {
    // Timeout for assertions
    timeout: 5000,
    // Custom matchers for visual regression
    toMatchSnapshot: {
      threshold: 0.01, // 1% difference threshold
      maxDiffPixels: 100,
    },
  },
})