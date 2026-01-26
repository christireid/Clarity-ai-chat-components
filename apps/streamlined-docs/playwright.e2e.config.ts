import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright Configuration for Comprehensive E2E Tests
 *
 * Includes:
 * - Navigation testing
 * - Search functionality
 * - DocsAssistant chat
 * - Visual regression testing
 * - Accessibility testing (WCAG 2.1 AA)
 * - Mobile responsive testing
 *
 * Run all tests:
 *   npx playwright test --config=playwright.e2e.config.ts
 *
 * Run specific suite:
 *   npx playwright test e2e/navigation
 *   npx playwright test e2e/accessibility
 *
 * Update visual snapshots:
 *   npx playwright test --update-snapshots
 *
 * Run with UI:
 *   npx playwright test --ui
 */
export default defineConfig({
  testDir: './e2e',

  // Test settings
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,

  // Timeouts
  timeout: 60000, // 60s per test
  expect: {
    timeout: 15000, // 15s for assertions
  },

  // Reporters
  reporter: [
    [
      'html',
      {
        open: 'never',
        outputFolder: 'playwright-report',
      },
    ],
    ['list'],
    [
      'json',
      {
        outputFile: 'test-results/e2e-results.json',
      },
    ],
    ...(process.env.CI
      ? ([
          ['junit', { outputFile: 'test-results/junit.xml' }],
          ['github'],
        ] as const)
      : []),
  ],

  // Global settings
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',

    // Tracing & debugging
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    // Timeouts
    actionTimeout: 10000,
    navigationTimeout: 30000,

    // Browser context
    locale: 'en-US',
    timezoneId: 'America/New_York',

    // Accessibility testing
    // Note: axe-core will be integrated via test helpers
  },

  // Browser projects
  projects: [
    // Desktop browsers
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 },
      },
    },

    // Mobile browsers
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 5'],
      },
    },
    {
      name: 'mobile-safari',
      use: {
        ...devices['iPhone 12'],
      },
    },

    // Tablet
    {
      name: 'tablet',
      use: {
        ...devices['iPad Pro'],
      },
    },
  ],

  // Web server configuration
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000, // 2 minutes to start
    stdout: 'pipe',
    stderr: 'pipe',
  },

  // Output directory
  outputDir: 'test-results/e2e',

  // Snapshot settings
  snapshotDir: 'e2e/__snapshots__',
  snapshotPathTemplate:
    '{snapshotDir}/{testFileDir}/{testFileName}-snapshots/{arg}{-projectName}{-snapshotSuffix}{ext}',
})
