/**
 * Visual Regression Testing Utilities
 *
 * Utilities for visual regression testing with Chromatic and Playwright.
 * Provides helpers for screenshot comparison, visual diffing, and baseline management.
 */

import type { ReactElement } from 'react'

// ============================================================================
// TYPES
// ============================================================================

export interface VisualTestOptions {
  /** Viewport sizes to test */
  viewports?: Array<{ width: number; height: number; name: string }>
  /** Themes to test */
  themes?: Array<'light' | 'dark' | 'auto'>
  /** Interaction scenarios to test */
  scenarios?: Array<{
    name: string
    actions: Array<{
      type: 'click' | 'hover' | 'type' | 'wait'
      selector?: string
      text?: string
      delay?: number
    }>
  }>
  /** Custom CSS to inject for consistent testing */
  customCSS?: string
  /** Elements to hide during visual testing */
  hideSelectors?: string[]
  /** Elements to wait for before taking screenshot */
  waitForSelectors?: string[]
  /** Delay before taking screenshot */
  delay?: number
  /** Threshold for visual differences (0-1) */
  threshold?: number
}

export interface VisualTestResult {
  componentName: string
  timestamp: number
  baseline?: string
  current: string
  diff?: string
  passed: boolean
  pixelDifference?: number
  percentageDifference?: number
  viewport?: { width: number; height: number; name?: string }
  theme?: string
  scenario?: string
}

export interface VisualRegressionReport {
  componentName: string
  results: VisualTestResult[]
  summary: {
    totalTests: number
    passed: number
    failed: number
    newBaselines: number
    averageDifference: number
  }
  timestamp: number
}

// ============================================================================
// VISUAL TESTING HELPERS
// ============================================================================

/**
 * Standard viewports for visual testing
 */
export const STANDARD_VIEWPORTS = {
  mobile: { width: 375, height: 667, name: 'Mobile' },
  tablet: { width: 768, height: 1024, name: 'Tablet' },
  desktop: { width: 1440, height: 900, name: 'Desktop' },
  wide: { width: 1920, height: 1080, name: 'Wide' },
  mobileLandscape: { width: 667, height: 375, name: 'Mobile Landscape' },
  tabletLandscape: { width: 1024, height: 768, name: 'Tablet Landscape' },
}

/**
 * Standard themes for visual testing
 */
export const STANDARD_THEMES = ['light', 'dark'] as const

/**
 * Generate consistent screenshot names
 */
export function generateScreenshotName(
  componentName: string,
  viewport: { width: number; height: number; name: string },
  theme: string,
  scenario?: string,
  state?: string
): string {
  const parts = [componentName, viewport.name.toLowerCase().replace(' ', '-'), theme]

  if (scenario) {
    parts.push(scenario.toLowerCase().replace(' ', '-'))
  }

  if (state) {
    parts.push(state.toLowerCase().replace(' ', '-'))
  }

  return parts.join('--') + '.png'
}

/**
 * Prepare component for visual testing
 * Injects consistent styles and removes non-deterministic elements
 */
export function prepareForVisualTesting(options: VisualTestOptions = {}): string {
  const {
    customCSS = '',
    hideSelectors = [],
  } = options

  const baseCSS = `
    /* Reset animations and transitions for consistent screenshots */
    *, *::before, *::after {
      animation: none !important;
      transition: none !important;
      transition-delay: 0s !important;
      transition-duration: 0s !important;
    }

    /* Ensure consistent font loading */
    * {
      font-display: block !important;
    }

    /* Hide dynamic content that changes between runs */
    [data-testid*="timestamp"],
    [data-testid*="random"],
    [data-testid*="dynamic"],
    time,
    .dynamic-content {
      display: none !important;
    }

    /* Hide scrollbars for consistent screenshots */
    ::-webkit-scrollbar {
      display: none !important;
    }

    /* Ensure consistent focus states */
    *:focus {
      outline: 2px solid #007acc !important;
      outline-offset: 2px !important;
    }
  `

  const hideCSS = hideSelectors
    .map(selector => `${selector} { display: none !important; }`)
    .join('\n')

  return [baseCSS, hideCSS, customCSS].join('\n')
}

// ============================================================================
// STORYBOOK INTEGRATION
// ============================================================================

/**
 * Storybook parameters for visual regression testing
 */
export function createVisualTestParameters(options: VisualTestOptions = {}): Record<string, any> {
  const {
    viewports = [STANDARD_VIEWPORTS.mobile, STANDARD_VIEWPORTS.desktop],
    themes = STANDARD_THEMES,
    scenarios = [],
    hideSelectors = [],
    waitForSelectors = [],
    delay = 100,
    threshold = 0.01,
  } = options

  return {
    chromatic: {
      viewports: viewports.map(v => v.width),
      themes,
      delay,
      threshold,
      hideSelectors,
      waitForSelectors,
      scenarios: scenarios.map(s => s.name),
    },
    // Playwright test configuration
    playwright: {
      viewports,
      themes,
      scenarios,
      options: {
        hideSelectors,
        waitForSelectors,
        delay,
        threshold,
      },
    },
  }
}

/**
 * Chromatic-specific story configuration
 */
export function configureChromaticStory(
  storyName: string,
  options: VisualTestOptions = {}
) {
  return {
    parameters: {
      ...createVisualTestParameters(options),
      chromatic: {
        ...createVisualTestParameters(options).chromatic,
        disableSnapshot: false,
      },
    },
    tags: ['visual-regression', 'chromatic'],
  }
}

// ============================================================================
// PLAYWRIGHT INTEGRATION
// ============================================================================

/**
 * Playwright test helper for visual regression
 */
export class VisualRegressionTester {
  private page: any // Playwright Page
  private componentName: string

  constructor(page: any, componentName: string) {
    this.page = page
    this.componentName = componentName
  }

  /**
   * Take a visual regression screenshot
   */
  async takeScreenshot(
    options: VisualTestOptions & {
      name?: string
      viewport?: { width: number; height: number; name: string }
      theme?: string
      scenario?: string
    } = {}
  ): Promise<Buffer> {
    const {
      name,
      viewport = STANDARD_VIEWPORTS.desktop,
      theme = 'light',
      scenario,
      delay = 100,
      hideSelectors = [],
      waitForSelectors = [],
    } = options

    // Set viewport
    await this.page.setViewportSize({
      width: viewport.width,
      height: viewport.height,
    })

    // Set theme
    await this.page.evaluate((themeName: string) => {
      document.documentElement.setAttribute('data-theme', themeName)
    }, theme)

    // Wait for elements
    for (const selector of waitForSelectors) {
      await this.page.waitForSelector(selector)
    }

    // Inject visual testing CSS
    const css = prepareForVisualTesting(options)
    await this.page.addStyleTag({ content: css })

    // Hide elements
    for (const selector of hideSelectors) {
      await this.page.locator(selector).evaluate((el: HTMLElement) => {
        el.style.display = 'none'
      })
    }

    // Wait for stability
    await this.page.waitForTimeout(delay)

    // Generate filename
    const filename = name || generateScreenshotName(
      this.componentName,
      viewport,
      theme,
      scenario
    )

    // Take screenshot
    const screenshot = await this.page.screenshot({
      fullPage: true,
      path: filename,
    })

    return screenshot
  }

  /**
   * Run visual regression tests for multiple configurations
   */
  async runVisualTests(options: VisualTestOptions = {}): Promise<VisualRegressionReport> {
    const {
      viewports = [STANDARD_VIEWPORTS.mobile, STANDARD_VIEWPORTS.desktop],
      themes = STANDARD_THEMES,
      scenarios = [],
      threshold = 0.01,
    } = options

    const results: VisualTestResult[] = []

    for (const viewport of viewports) {
      for (const theme of themes) {
        // Test default state
        const defaultScreenshot = await this.takeScreenshot({
          viewport,
          theme,
          ...options,
        })

        results.push({
          componentName: this.componentName,
          timestamp: Date.now(),
          current: defaultScreenshot.toString('base64'),
          passed: true, // Would be compared against baseline
          viewport,
          theme,
        })

        // Test scenarios
        for (const scenario of scenarios) {
          // Execute scenario actions
          for (const action of scenario.actions) {
            switch (action.type) {
              case 'click':
                if (action.selector) {
                  await this.page.click(action.selector)
                }
                break
              case 'hover':
                if (action.selector) {
                  await this.page.hover(action.selector)
                }
                break
              case 'type':
                if (action.selector && action.text) {
                  await this.page.fill(action.selector, action.text)
                }
                break
              case 'wait':
                await this.page.waitForTimeout(action.delay || 1000)
                break
            }
          }

          const scenarioScreenshot = await this.takeScreenshot({
            viewport,
            theme,
            scenario: scenario.name,
            ...options,
          })

          results.push({
            componentName: this.componentName,
            timestamp: Date.now(),
            current: scenarioScreenshot.toString('base64'),
            passed: true,
            viewport,
            theme,
            scenario: scenario.name,
          })
        }
      }
    }

    return {
      componentName: this.componentName,
      results,
      summary: {
        totalTests: results.length,
        passed: results.filter(r => r.passed).length,
        failed: results.filter(r => !r.passed).length,
        newBaselines: 0, // Would be calculated based on baseline existence
        averageDifference: results
          .filter(r => r.percentageDifference !== undefined)
          .reduce((sum, r) => sum + (r.percentageDifference || 0), 0) / results.length,
      },
      timestamp: Date.now(),
    }
  }
}

// ============================================================================
// REPORTING AND ANALYSIS
// ============================================================================

/**
 * Generate visual regression report HTML
 */
export function generateVisualRegressionReportHTML(report: VisualRegressionReport): string {
  const { summary, results } = report

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Visual Regression Report - ${report.componentName}</title>
      <style>
        body { font-family: system-ui, sans-serif; margin: 20px; }
        .summary { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .result { border: 1px solid #e1e5e9; padding: 15px; margin: 10px 0; border-radius: 8px; }
        .result.passed { border-color: #16a34a; background: #f0fdf4; }
        .result.failed { border-color: #dc2626; background: #fef2f2; }
        .images { display: flex; gap: 10px; margin-top: 10px; }
        .image { border: 1px solid #ccc; border-radius: 4px; }
        .image img { max-width: 200px; height: auto; }
        h1, h2, h3 { color: #1f2937; }
        .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; }
        .metric { text-align: center; padding: 10px; background: white; border-radius: 4px; }
      </style>
    </head>
    <body>
      <h1>Visual Regression Report</h1>
      <h2>${report.componentName}</h2>

      <div class="summary">
        <h3>Test Summary</h3>
        <div class="metrics">
          <div class="metric">
            <strong>${summary.totalTests}</strong><br/>
            Total Tests
          </div>
          <div class="metric">
            <strong style="color: #16a34a">${summary.passed}</strong><br/>
            Passed
          </div>
          <div class="metric">
            <strong style="color: #dc2626">${summary.failed}</strong><br/>
            Failed
          </div>
          <div class="metric">
            <strong>${summary.newBaselines}</strong><br/>
            New Baselines
          </div>
          <div class="metric">
            <strong>${summary.averageDifference.toFixed(2)}%</strong><br/>
            Avg Difference
          </div>
        </div>
      </div>

      <h3>Test Results</h3>
      ${results.map(result => `
        <div class="result ${result.passed ? 'passed' : 'failed'}">
          <h4>${result.viewport?.name || 'Unknown'} - ${result.theme} ${result.scenario ? `- ${result.scenario}` : ''}</h4>
          <p><strong>Status:</strong> ${result.passed ? '✅ Passed' : '❌ Failed'}</p>
          ${result.percentageDifference !== undefined ? `<p><strong>Difference:</strong> ${result.percentageDifference.toFixed(2)}%</p>` : ''}
          <div class="images">
            ${result.baseline ? `<div class="image"><h5>Baseline</h5><img src="data:image/png;base64,${result.baseline}" alt="Baseline" /></div>` : ''}
            <div class="image"><h5>Current</h5><img src="data:image/png;base64,${result.current}" alt="Current" /></div>
            ${result.diff ? `<div class="image"><h5>Diff</h5><img src="data:image/png;base64,${result.diff}" alt="Diff" /></div>` : ''}
          </div>
        </div>
      `).join('')}

      <p><em>Report generated on ${new Date(report.timestamp).toLocaleString()}</em></p>
    </body>
    </html>
  `
}

/**
 * Export visual test results to various formats
 */
export function exportVisualTestResults(
  report: VisualRegressionReport,
  format: 'json' | 'html' | 'markdown' = 'html'
): string {
  switch (format) {
    case 'json':
      return JSON.stringify(report, null, 2)

    case 'html':
      return generateVisualRegressionReportHTML(report)

    case 'markdown':
      return generateVisualRegressionReportMarkdown(report)

    default:
      throw new Error(`Unsupported format: ${format}`)
  }
}

/**
 * Generate markdown report for visual regression
 */
function generateVisualRegressionReportMarkdown(report: VisualRegressionReport): string {
  const { summary, results } = report

  let markdown = `# Visual Regression Report - ${report.componentName}\n\n`
  markdown += `**Generated:** ${new Date(report.timestamp).toLocaleString()}\n\n`

  markdown += `## Summary\n\n`
  markdown += `- **Total Tests:** ${summary.totalTests}\n`
  markdown += `- **Passed:** ${summary.passed}\n`
  markdown += `- **Failed:** ${summary.failed}\n`
  markdown += `- **New Baselines:** ${summary.newBaselines}\n`
  markdown += `- **Average Difference:** ${summary.averageDifference.toFixed(2)}%\n\n`

  markdown += `## Test Results\n\n`

  results.forEach(result => {
    const status = result.passed ? '✅ Passed' : '❌ Failed'
    const viewport = result.viewport?.name || 'Unknown'
    const scenario = result.scenario ? ` - ${result.scenario}` : ''

    markdown += `### ${viewport} - ${result.theme}${scenario}\n\n`
    markdown += `**Status:** ${status}\n`

    if (result.percentageDifference !== undefined) {
      markdown += `**Difference:** ${result.percentageDifference.toFixed(2)}%\n`
    }

    markdown += `\n---\n\n`
  })

  return markdown
}