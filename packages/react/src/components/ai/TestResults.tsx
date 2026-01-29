'use client'

/**
 * TestResults Component
 *
 * A component for displaying test results from test runners
 * like Jest, Vitest, Mocha, etc.
 *
 * Features:
 * - Pass/fail/skip status indicators
 * - Test suite grouping
 * - Duration display
 * - Error messages and stack traces
 * - Collapsible test suites
 * - Summary statistics
 * - Accessible with ARIA attributes
 *
 * @example
 * ```tsx
 * <TestResults
 *   suites={[
 *     {
 *       name: 'utils.test.ts',
 *       tests: [
 *         { name: 'should format date', status: 'pass', duration: 5 },
 *         { name: 'should parse JSON', status: 'fail', duration: 12, error: 'Expected...' },
 *       ],
 *     },
 *   ]}
 * />
 * ```
 */

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn, useReducedMotion } from '@clarity-chat/primitives'
import { DURATION_SECONDS, EASING_FRAMER } from '../../animations/constants'

// ============================================================================
// Types
// ============================================================================

export type TestStatus = 'pass' | 'fail' | 'skip' | 'pending' | 'running'

export interface TestCase {
  /** Test name */
  name: string
  /** Test status */
  status: TestStatus
  /** Duration in milliseconds */
  duration?: number
  /** Error message (for failed tests) */
  error?: string
  /** Stack trace (for failed tests) */
  stack?: string
  /** Retry count */
  retries?: number
  /** Test file path */
  file?: string
}

export interface TestSuite {
  /** Suite name */
  name: string
  /** File path */
  file?: string
  /** Tests in this suite */
  tests: TestCase[]
  /** Nested suites */
  suites?: TestSuite[]
  /** Suite duration */
  duration?: number
  /** Whether suite is currently running */
  isRunning?: boolean
}

export interface TestResultsProps {
  /** Array of test suites */
  suites: TestSuite[]
  /** Title */
  title?: string
  /** Show summary */
  showSummary?: boolean
  /** Show durations */
  showDurations?: boolean
  /** Collapse passed suites by default */
  collapsePassedSuites?: boolean
  /** Show only failed tests */
  showOnlyFailed?: boolean
  /** Test click handler */
  onTestClick?: (test: TestCase, suite: TestSuite) => void
  /** Additional class names */
  className?: string
}

// ============================================================================
// Helper Functions
// ============================================================================

function formatDuration(ms?: number): string {
  if (ms === undefined) return ''
  if (ms < 1) return '<1ms'
  if (ms < 1000) return `${Math.round(ms)}ms`
  return `${(ms / 1000).toFixed(2)}s`
}

function getStatusIcon(status: TestStatus): React.ReactNode {
  switch (status) {
    case 'pass':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="test-icon-pass">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )
    case 'fail':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="test-icon-fail">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      )
    case 'skip':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="test-icon-skip">
          <circle cx="12" cy="12" r="10" />
          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
        </svg>
      )
    case 'pending':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="test-icon-pending">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      )
    case 'running':
      return (
        <motion.svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="test-icon-running"
          animate={{ rotate: 360 }}
          transition={{ duration: durations.slower, repeat: Infinity, ease: 'linear' }}
        >
          <circle cx="12" cy="12" r="10" opacity="0.25" />
          <path d="M12 2a10 10 0 0 1 10 10" />
        </motion.svg>
      )
  }
}

function calculateStats(suites: TestSuite[]): {
  total: number
  passed: number
  failed: number
  skipped: number
  pending: number
  duration: number
} {
  let total = 0
  let passed = 0
  let failed = 0
  let skipped = 0
  let pending = 0
  let duration = 0

  const countTests = (suiteList: TestSuite[]) => {
    suiteList.forEach((suite) => {
      suite.tests.forEach((test) => {
        total++
        duration += test.duration || 0
        switch (test.status) {
          case 'pass': passed++; break
          case 'fail': failed++; break
          case 'skip': skipped++; break
          case 'pending': pending++; break
        }
      })
      if (suite.suites) {
        countTests(suite.suites)
      }
    })
  }

  countTests(suites)
  return { total, passed, failed, skipped, pending, duration }
}

function getSuiteStatus(suite: TestSuite): TestStatus {
  if (suite.isRunning) return 'running'
  const hasFailure = suite.tests.some((t) => t.status === 'fail')
  if (hasFailure) return 'fail'
  const allPassed = suite.tests.every((t) => t.status === 'pass' || t.status === 'skip')
  if (allPassed) return 'pass'
  return 'pending'
}

// ============================================================================
// TestCase Component
// ============================================================================

interface TestCaseItemProps {
  test: TestCase
  suite: TestSuite
  showDurations: boolean
  onTestClick?: (test: TestCase, suite: TestSuite) => void
}

function TestCaseItem({ test, suite, showDurations, onTestClick }: TestCaseItemProps) {
  const prefersReducedMotion = useReducedMotion()
  const [showError, setShowError] = React.useState(test.status === 'fail')

  return (
    <motion.div
      className={cn('test-case', `test-case-${test.status}`)}
      initial={prefersReducedMotion ? {} : { opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: DURATION_SECONDS.fast }}
    >
      <div
        className="test-case-header"
        onClick={() => {
          if (test.error) setShowError(!showError)
          onTestClick?.(test, suite)
        }}
        role={onTestClick || test.error ? 'button' : undefined}
        tabIndex={onTestClick || test.error ? 0 : undefined}
      >
        <span className="test-case-status">
          {getStatusIcon(test.status)}
        </span>
        <span className="test-case-name">{test.name}</span>
        {showDurations && test.duration !== undefined && (
          <span className="test-case-duration">
            {formatDuration(test.duration)}
          </span>
        )}
        {test.retries && test.retries > 0 && (
          <span className="test-case-retries">
            {test.retries} retr{test.retries === 1 ? 'y' : 'ies'}
          </span>
        )}
      </div>

      {/* Error details */}
      <AnimatePresence>
        {showError && test.error && (
          <motion.div
            className="test-case-error"
            initial={prefersReducedMotion ? {} : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={prefersReducedMotion ? {} : { height: 0, opacity: 0 }}
            transition={{ duration: DURATION_SECONDS.fast }}
          >
            <pre className="test-case-error-message">{test.error}</pre>
            {test.stack && (
              <pre className="test-case-stack">{test.stack}</pre>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ============================================================================
// TestSuite Component
// ============================================================================

interface TestSuiteItemProps {
  suite: TestSuite
  depth: number
  showDurations: boolean
  collapsePassedSuites: boolean
  showOnlyFailed: boolean
  onTestClick?: (test: TestCase, suite: TestSuite) => void
}

function TestSuiteItem({
  suite,
  depth,
  showDurations,
  collapsePassedSuites,
  showOnlyFailed,
  onTestClick,
}: TestSuiteItemProps) {
  const prefersReducedMotion = useReducedMotion()
  const suiteStatus = getSuiteStatus(suite)
  const [isExpanded, setIsExpanded] = React.useState(
    !collapsePassedSuites || suiteStatus !== 'pass'
  )

  const visibleTests = showOnlyFailed
    ? suite.tests.filter((t) => t.status === 'fail')
    : suite.tests

  const passedCount = suite.tests.filter((t) => t.status === 'pass').length
  const failedCount = suite.tests.filter((t) => t.status === 'fail').length

  return (
    <motion.div
      className={cn('test-suite', `test-suite-${suiteStatus}`)}
      style={{ marginLeft: depth > 0 ? '16px' : 0 }}
      initial={prefersReducedMotion ? {} : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: DURATION_SECONDS.fast }}
    >
      {/* Suite header */}
      <button
        type="button"
        className="test-suite-header"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <motion.span
          className="test-suite-arrow"
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: DURATION_SECONDS.fast }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </motion.span>

        <span className="test-suite-status">
          {getStatusIcon(suiteStatus)}
        </span>

        <span className="test-suite-name">{suite.name}</span>

        <span className="test-suite-counts">
          {failedCount > 0 && (
            <span className="test-suite-count test-suite-count-fail">
              {failedCount} failed
            </span>
          )}
          {passedCount > 0 && (
            <span className="test-suite-count test-suite-count-pass">
              {passedCount} passed
            </span>
          )}
        </span>

        {showDurations && suite.duration !== undefined && (
          <span className="test-suite-duration">
            {formatDuration(suite.duration)}
          </span>
        )}
      </button>

      {/* Suite content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="test-suite-content"
            initial={prefersReducedMotion ? {} : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={prefersReducedMotion ? {} : { height: 0, opacity: 0 }}
            transition={{ duration: DURATION_SECONDS.fast }}
          >
            {visibleTests.map((test, index) => (
              <TestCaseItem
                key={`${test.name}-${index}`}
                test={test}
                suite={suite}
                showDurations={showDurations}
                onTestClick={onTestClick}
              />
            ))}

            {suite.suites?.map((nestedSuite, index) => (
              <TestSuiteItem
                key={`${nestedSuite.name}-${index}`}
                suite={nestedSuite}
                depth={depth + 1}
                showDurations={showDurations}
                collapsePassedSuites={collapsePassedSuites}
                showOnlyFailed={showOnlyFailed}
                onTestClick={onTestClick}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ============================================================================
// TestResults Component
// ============================================================================

export function TestResults({
  suites,
  title,
  showSummary = true,
  showDurations = true,
  collapsePassedSuites = false,
  showOnlyFailed = false,
  onTestClick,
  className,
}: TestResultsProps) {
  const prefersReducedMotion = useReducedMotion()
  const stats = React.useMemo(() => calculateStats(suites), [suites])
  const allPassed = stats.failed === 0 && stats.total > 0

  return (
    <motion.div
      className={cn(
        'test-results',
        allPassed && 'test-results-passed',
        stats.failed > 0 && 'test-results-failed',
        className
      )}
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: DURATION_SECONDS.normal,
        ease: EASING_FRAMER.standard,
      }}
      role="region"
      aria-label={title || 'Test results'}
    >
      {/* Header */}
      <div className="test-results-header">
        {title && <h3 className="test-results-title">{title}</h3>}

        {/* Summary */}
        {showSummary && (
          <div className="test-results-summary">
            <span className={cn('test-results-stat', stats.passed > 0 && 'test-results-stat-pass')}>
              {stats.passed} passed
            </span>
            <span className={cn('test-results-stat', stats.failed > 0 && 'test-results-stat-fail')}>
              {stats.failed} failed
            </span>
            {stats.skipped > 0 && (
              <span className="test-results-stat test-results-stat-skip">
                {stats.skipped} skipped
              </span>
            )}
            <span className="test-results-stat test-results-stat-total">
              {stats.total} total
            </span>
            {showDurations && (
              <span className="test-results-duration">
                {formatDuration(stats.duration)}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Progress bar */}
      {showSummary && stats.total > 0 && (
        <div className="test-results-progress">
          <motion.div
            className="test-results-progress-pass"
            initial={{ width: 0 }}
            animate={{ width: `${(stats.passed / stats.total) * 100}%` }}
            transition={{ duration: DURATION_SECONDS.slow }}
          />
          <motion.div
            className="test-results-progress-fail"
            initial={{ width: 0 }}
            animate={{ width: `${(stats.failed / stats.total) * 100}%` }}
            transition={{ duration: DURATION_SECONDS.slow, delay: 0.1 }}
          />
          <motion.div
            className="test-results-progress-skip"
            initial={{ width: 0 }}
            animate={{ width: `${(stats.skipped / stats.total) * 100}%` }}
            transition={{ duration: DURATION_SECONDS.slow, delay: 0.2 }}
          />
        </div>
      )}

      {/* Suites */}
      <div className="test-results-suites">
        {suites.map((suite, index) => (
          <TestSuiteItem
            key={`${suite.name}-${index}`}
            suite={suite}
            depth={0}
            showDurations={showDurations}
            collapsePassedSuites={collapsePassedSuites}
            showOnlyFailed={showOnlyFailed}
            onTestClick={onTestClick}
          />
        ))}
      </div>
    </motion.div>
  )
}

export default TestResults
