import type { TestRunnerConfig } from '@storybook/test-runner'
import { checkA11y, injectAxe } from 'axe-playwright'

/**
 * Storybook Test Runner Configuration
 *
 * This configuration:
 * 1. Injects axe-core into each story page
 * 2. Runs accessibility checks after each story renders
 * 3. Fails tests if WCAG 2.1 AA violations are found
 *
 * Run with: pnpm test-storybook
 *
 * @see https://storybook.js.org/docs/writing-tests/test-runner
 * @see https://github.com/abhinaba-ghosh/axe-playwright
 */
const config: TestRunnerConfig = {
  /**
   * Hook that runs before visiting each story
   * Injects axe-core accessibility testing library
   */
  async preVisit(page) {
    await injectAxe(page)
  },

  /**
   * Hook that runs after each story renders
   * Performs accessibility audit and reports violations
   */
  async postVisit(page, context) {
    // Skip a11y checks for stories tagged with 'skip-a11y'
    if (context.tags?.includes('skip-a11y')) {
      return
    }

    await checkA11y(page, '#storybook-root', {
      detailedReport: true,
      detailedReportOptions: {
        html: true,
      },
      // WCAG 2.1 Level AA rules
      axeOptions: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
        },
      },
    })
  },

  /**
   * Tags configuration for filtering stories
   */
  tags: {
    // Skip stories tagged with 'skip-test'
    exclude: ['skip-test'],
    // Only include stories tagged with 'test' if specified
    include: [],
  },
}

export default config
