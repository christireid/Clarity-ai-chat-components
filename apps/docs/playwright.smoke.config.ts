import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright Configuration for Documentation Smoke Tests
 *
 * Run tests:
 *   pnpm --filter @clarity-chat/docs test:smoke
 *
 * Or directly:
 *   npx playwright test --config=apps/docs/playwright.smoke.config.ts
 *
 * Prerequisites:
 *   1. Start the docs server: cd apps/docs && pnpm dev
 *   2. Or the tests will auto-start the server (slower)
 */
export default defineConfig({
  testDir: './tests/smoke',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,

  // Reporters
  reporter: [
    ['html', { open: 'never', outputFolder: 'test-results/smoke-report' }],
    ['list'],
    ['json', { outputFile: 'test-results/smoke-results.json' }],
    ...(process.env.CI ? [['github' as const]] : []),
  ],

  // Global settings
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  // Browser projects - use only Chromium for fast smoke tests
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Uncomment for full browser coverage in CI
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  // Web server configuration
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    stdout: 'pipe',
    stderr: 'pipe',
  },

  // Output directory
  outputDir: 'test-results/smoke',

  // Timeouts
  timeout: 30000,
  expect: {
    timeout: 10000,
  },
})
