import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Accessibility Testing Utilities',
  description: 'Automated accessibility testing, WCAG compliance checking, and color contrast analysis for inclusive chat interfaces.',
}

const accessibilityFunctionsProps: Prop[] = [
  {
    name: 'testAccessibility',
    type: '(element: HTMLElement, options?: AccessibilityTestOptions) => Promise<AccessibilityReport>',
    description: 'Run comprehensive accessibility tests on a DOM element.',
  },
  {
    name: 'assertNoAccessibilityViolations',
    type: '(report: AccessibilityReport) => void',
    description: 'Assert that no accessibility violations exist, throws on violations.',
  },
  {
    name: 'assertWCAG2_1AACompliance',
    type: '(report: AccessibilityReport) => void',
    description: 'Assert WCAG 2.1 AA compliance, throws on failures.',
  },
  {
    name: 'checkColorContrast',
    type: '(foreground: string, background: string) => ColorContrastResult',
    description: 'Check color contrast ratio between foreground and background colors.',
  },
  {
    name: 'logAccessibilityViolations',
    type: '(report: AccessibilityReport) => void',
    description: 'Log accessibility violations to console with detailed information.',
  },
  {
    name: 'generateAccessibilityReportHTML',
    type: '(report: AccessibilityReport) => string',
    description: 'Generate HTML report of accessibility test results.',
  },
  {
    name: 'useAccessibilityTesting',
    type: '(options?: AccessibilityTestOptions) => AccessibilityTestingHook',
    description: 'React hook for continuous accessibility testing during development.',
  },
]

const accessibilityOptionsProps: Prop[] = [
  {
    name: 'rules',
    type: 'AccessibilityRule[]',
    description: 'Specific accessibility rules to test against.',
  },
  {
    name: 'level',
    type: '"A" | "AA" | "AAA"',
    default: '"AA"',
    description: 'WCAG conformance level to test against.',
  },
  {
    name: 'includeBestPractices',
    type: 'boolean',
    default: 'true',
    description: 'Include additional best practice checks beyond WCAG requirements.',
  },
  {
    name: 'excludeRules',
    type: 'string[]',
    description: 'Array of rule IDs to exclude from testing.',
  },
  {
    name: 'onViolation',
    type: '(violation: AccessibilityViolation) => void',
    description: 'Callback when a violation is found.',
  },
]

export default function AccessibilityTestingPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-4">
          <span>♿ Accessibility Utilities</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">Accessibility Testing</h1>
        <p className="text-xl text-muted-foreground mb-4">
          Automated accessibility testing utilities for WCAG compliance, color contrast analysis,
          and comprehensive accessibility validation for inclusive AI chat interfaces.
        </p>
        <p className="text-muted-foreground">
          <strong>Category:</strong> Quality Assurance •{' '}
          <strong>Standards:</strong> WCAG 2.1 AA/AAA •{' '}
          <strong>Impact:</strong> Inclusive Design
        </p>
      </div>

      <Callout type="info" title="Accessibility First for AI">
        <p className="mb-2">
          AI chat interfaces must be accessible to everyone. Screen readers, keyboard navigation,
          and proper contrast ratios ensure that users with disabilities can effectively use
          your AI-powered applications. These utilities help you maintain WCAG compliance
          throughout development.
        </p>
      </Callout>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Automated Accessibility Testing</h2>
        <CodePlayground
          code={`import {
  testAccessibility,
  assertNoAccessibilityViolations,
  logAccessibilityViolations
} from '@clarity-chat/react'

function AccessibleChatApp() {
  const [accessibilityReport, setAccessibilityReport] = useState(null)

  const runAccessibilityTest = async () => {
    try {
      // Test the entire chat interface
      const report = await testAccessibility(
        document.querySelector('.chat-container'),
        {
          level: 'AA',
          includeBestPractices: true,
          onViolation: (violation) => {
            console.warn('Accessibility violation:', violation)
          }
        }
      )

      setAccessibilityReport(report)

      // Log violations for debugging
      logAccessibilityViolations(report)

      // Assert no violations (throws on failure)
      assertNoAccessibilityViolations(report)

      console.log('✅ Chat interface is fully accessible!')
    } catch (error) {
      console.error('❌ Accessibility violations found:', error)
    }
  }

  return (
    <div className="chat-container">
      <ClarityChat api="/api/chat" />

      {/* Accessibility testing controls */}
      <button
        onClick={runAccessibilityTest}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        aria-label="Run accessibility test"
      >
        Test Accessibility
      </button>

      {/* Report display */}
      {accessibilityReport && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3>Accessibility Report</h3>
          <p>Violations: {accessibilityReport.violations.length}</p>
          <p>Passes: {accessibilityReport.passes.length}</p>
          <p>WCAG Level: {accessibilityReport.level}</p>
        </div>
      )}
    </div>
  )
}`}
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Comprehensive accessibility testing with detailed reporting and violation detection.
          Perfect for CI/CD integration and development-time validation.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Color Contrast Analysis</h2>
        <CodePlayground
          code={`import { checkColorContrast } from '@clarity-chat/react'

function ColorAccessibleChat() {
  const [contrastResults, setContrastResults] = useState([])

  const analyzeColors = () => {
    // Test various color combinations used in chat
    const colorPairs = [
      { fg: '#000000', bg: '#ffffff', name: 'Black on White' },
      { fg: '#ffffff', bg: '#007acc', name: 'White on Blue' },
      { fg: '#666666', bg: '#f5f5f5', name: 'Gray on Light Gray' },
      { fg: '#ffffff', bg: '#d32f2f', name: 'White on Red' },
    ]

    const results = colorPairs.map(pair => ({
      ...pair,
      ...checkColorContrast(pair.fg, pair.bg)
    }))

    setContrastResults(results)
  }

  return (
    <div>
      <ClarityChat api="/api/chat" />

      {/* Color contrast testing */}
      <button
        onClick={analyzeColors}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
      >
        Analyze Color Contrast
      </button>

      {/* Results display */}
      {contrastResults.length > 0 && (
        <div className="mt-4 space-y-2">
          <h3 className="font-semibold">Color Contrast Results</h3>
          {contrastResults.map((result, index) => (
            <div key={index} className="flex items-center space-x-4 p-2 bg-gray-50 rounded">
              <div
                className="w-8 h-8 rounded border"
                style={{ backgroundColor: result.bg, color: result.fg }}
              >
                Aa
              </div>
              <div className="flex-1">
                <div className="font-medium">{result.name}</div>
                <div className="text-sm text-gray-600">
                  Ratio: {result.ratio.toFixed(2)}:1 |
                  Normal: {result.normalText ? '✅' : '❌'} |
                  Large: {result.largeText ? '✅' : '❌'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}`}
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Automated color contrast analysis ensures your chat interface meets WCAG guidelines
          for text readability and accessibility.
        </p>

        <Callout type="info" title="WCAG Contrast Requirements">
          <ul className="list-disc list-inside">
            <li><strong>Normal Text:</strong> 4.5:1 minimum contrast ratio</li>
            <li><strong>Large Text:</strong> 3:1 minimum contrast ratio (18pt+ or 14pt+ bold)</li>
            <li><strong>Graphics/Icons:</strong> 3:1 minimum contrast ratio</li>
            <li><strong>Focus Indicators:</strong> 3:1 minimum contrast ratio</li>
          </ul>
        </Callout>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Development-Time Accessibility Monitoring</h2>
        <CodePlayground
          code={`import { useAccessibilityTesting } from '@clarity-chat/react'

function DevelopmentChatApp() {
  const {
    violations,
    isMonitoring,
    lastTestTime,
    testCount
  } = useAccessibilityTesting({
    level: 'AA',
    includeBestPractices: true,
    // Auto-test on component changes (development only)
    autoTest: process.env.NODE_ENV === 'development'
  })

  return (
    <div>
      <ClarityChat api="/api/chat" />

      {/* Development accessibility overlay */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 bg-black text-white p-3 rounded-lg text-xs font-mono z-50">
          <div>♿ Accessibility Monitor</div>
          <div>Violations: {violations.length}</div>
          <div>Tests: {testCount}</div>
          <div>Last: {lastTestTime ? new Date(lastTestTime).toLocaleTimeString() : 'Never'}</div>
          {violations.length > 0 && (
            <button
              onClick={() => console.table(violations)}
              className="mt-1 px-2 py-1 bg-red-600 text-white rounded text-xs"
            >
              View Issues
            </button>
          )}
        </div>
      )}

      {/* Violation details (development only) */}
      {process.env.NODE_ENV === 'development' && violations.length > 0 && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-300 rounded-lg p-4 max-w-sm">
          <h3 className="font-semibold text-red-800">Accessibility Issues</h3>
          <div className="mt-2 space-y-1">
            {violations.slice(0, 3).map((violation, index) => (
              <div key={index} className="text-sm text-red-700">
                • {violation.description}
              </div>
            ))}
            {violations.length > 3 && (
              <div className="text-sm text-red-600">
                ...and {violations.length - 3} more
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}`}
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Real-time accessibility monitoring during development with visual feedback
          and detailed violation reporting to catch issues early.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">WCAG Compliance Testing</h2>
        <CodePlayground
          code={`import {
  assertWCAG2_1AACompliance,
  generateAccessibilityReportHTML
} from '@clarity-chat/react'

function CompliantChatApp() {
  const [complianceReport, setComplianceReport] = useState(null)

  const runComplianceCheck = async () => {
    try {
      const report = await testAccessibility(
        document.querySelector('.chat-container'),
        { level: 'AA' }
      )

      // Assert WCAG compliance (throws on failure)
      assertWCAG2_1AACompliance(report)

      setComplianceReport({
        status: 'compliant',
        report
      })

      console.log('✅ WCAG 2.1 AA Compliant!')
    } catch (error) {
      setComplianceReport({
        status: 'violations',
        error: error.message,
        report: error.report
      })

      console.error('❌ WCAG Compliance Issues:', error.message)
    }
  }

  const exportReport = () => {
    if (complianceReport?.report) {
      const htmlReport = generateAccessibilityReportHTML(complianceReport.report)
      const blob = new Blob([htmlReport], { type: 'text/html' })
      const url = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = 'accessibility-report.html'
      a.click()

      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="chat-container">
      <ClarityChat api="/api/chat" />

      {/* Compliance testing */}
      <div className="mt-4 space-x-2">
        <button
          onClick={runComplianceCheck}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Check WCAG Compliance
        </button>

        {complianceReport && (
          <button
            onClick={exportReport}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Export Report
          </button>
        )}
      </div>

      {/* Compliance status */}
      {complianceReport && (
        <div className="mt-4 p-4 rounded-lg ${
          complianceReport.status === 'compliant'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }">
          <div className="font-semibold">
            {complianceReport.status === 'compliant'
              ? '✅ WCAG 2.1 AA Compliant'
              : '❌ Compliance Issues Found'
            }
          </div>
          {complianceReport.error && (
            <div className="mt-2 text-sm">
              {complianceReport.error}
            </div>
          )}
        </div>
      )}
    </div>
  )
}`}
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Automated WCAG compliance testing with detailed reporting and exportable
          HTML reports for accessibility audits and documentation.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Accessibility Testing in CI/CD</h2>
        <CodePlayground
          code={`// vitest.config.ts or jest.config.js
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    setupFiles: ['./tests/setup/accessibility-setup.ts'],
    globalSetup: ['./tests/setup/accessibility-global.ts'],
  },
})

// tests/setup/accessibility-setup.ts
import { beforeAll, afterAll } from 'vitest'
import { testAccessibility, assertWCAG2_1AACompliance } from '@clarity-chat/react'

beforeAll(() => {
  // Setup accessibility testing environment
})

afterAll(() => {
  // Cleanup
})

// tests/accessibility/chat-accessibility.test.tsx
import { test, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ClarityChat } from '@clarity-chat/react'
import { testAccessibility, assertWCAG2_1AACompliance } from '@clarity-chat/react'

test('ClarityChat meets WCAG 2.1 AA standards', async () => {
  const { container } = render(<ClarityChat api="/api/chat" />)

  // Wait for component to fully render
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Run accessibility tests
  const report = await testAccessibility(container, {
    level: 'AA',
    includeBestPractices: true
  })

  // Assert compliance
  assertWCAG2_1AACompliance(report)

  // Additional custom checks
  expect(report.violations).toHaveLength(0)
  expect(report.passes.length).toBeGreaterThan(10)
})

test('Color contrast meets accessibility standards', async () => {
  const { checkColorContrast } = await import('@clarity-chat/react')

  // Test critical UI colors
  const results = [
    checkColorContrast('#000000', '#ffffff'), // Black on white
    checkColorContrast('#ffffff', '#007acc'), // White on primary blue
    checkColorContrast('#666666', '#f8f9fa'), // Gray text on light background
  ]

  results.forEach(result => {
    expect(result.normalText).toBe(true)
    expect(result.largeText).toBe(true)
  })
})`}
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Integrate accessibility testing into your CI/CD pipeline with automated
          compliance checks and detailed violation reporting.
        </p>

        <Callout type="tip" title="CI/CD Integration Best Practices">
          <ul className="list-disc list-inside">
            <li>Run accessibility tests on every PR and merge</li>
            <li>Fail builds on critical accessibility violations</li>
            <li>Generate accessibility reports for each build</li>
            <li>Set up alerts for accessibility regressions</li>
            <li>Include accessibility testing in performance budgets</li>
          </ul>
        </Callout>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">API Reference</h2>

        <h3 className="text-xl font-semibold mb-4">Functions</h3>
        <PropsTable props={accessibilityFunctionsProps} />

        <h3 className="text-xl font-semibold mb-4 mt-8">Options</h3>
        <PropsTable props={accessibilityOptionsProps} />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Accessibility Guidelines</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-6">
            <h3 className="font-semibold mb-3">🎯 WCAG Principles</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li><strong>Perceivable:</strong> Information must be presentable</li>
              <li><strong>Operable:</strong> Interface elements must be usable</li>
              <li><strong>Understandable:</strong> Content must be readable</li>
              <li><strong>Robust:</strong> Content must work across technologies</li>
            </ul>
          </div>

          <div className="border rounded-lg p-6">
            <h3 className="font-semibold mb-3">🛠️ Implementation Tips</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li><strong>Semantic HTML:</strong> Use proper heading hierarchy</li>
              <li><strong>ARIA Labels:</strong> Provide context for screen readers</li>
              <li><strong>Keyboard Navigation:</strong> Test with Tab and arrow keys</li>
              <li><strong>Focus Management:</strong> Logical focus flow</li>
              <li><strong>Error Messages:</strong> Clear, contextual feedback</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Related Documentation</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/learn/accessibility"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">Accessibility Guide</h3>
            <p className="text-sm text-muted-foreground">
              Comprehensive guide to building accessible chat interfaces.
            </p>
          </Link>
          <Link
            href="/reference/utilities/performance-monitoring"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">Performance Monitoring</h3>
            <p className="text-sm text-muted-foreground">
              Monitor and optimize the performance of your chat interfaces.
            </p>
          </Link>
          <Link
            href="/reference/utilities/security"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">Security Utilities</h3>
            <p className="text-sm text-muted-foreground">
              Secure your chat applications with built-in security utilities.
            </p>
          </Link>
          <Link
            href="/reference/components/error-boundary"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">Error Boundaries</h3>
            <p className="text-sm text-muted-foreground">
              Handle errors gracefully in your React applications.
            </p>
          </Link>
        </div>
      </section>
    </div>
  )
}