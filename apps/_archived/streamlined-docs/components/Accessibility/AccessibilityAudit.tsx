/**
 * Accessibility Audit Component
 * Development tool for checking WCAG compliance
 * Only rendered in development mode
 */

'use client'

import { useEffect, useState } from 'react'
import { checkColorContrast } from '@/lib/accessibility'

interface AccessibilityIssue {
  type: 'error' | 'warning' | 'info'
  rule: string
  message: string
  element?: HTMLElement
  wcagLevel: 'A' | 'AA' | 'AAA'
}

export function AccessibilityAudit() {
  const [issues, setIssues] = useState<AccessibilityIssue[]>([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV !== 'development') return

    const runAudit = () => {
      const foundIssues: AccessibilityIssue[] = []

      // Check for missing alt text on images
      document.querySelectorAll('img').forEach((img) => {
        if (!img.hasAttribute('alt')) {
          foundIssues.push({
            type: 'error',
            rule: 'WCAG 1.1.1',
            message: `Image missing alt text: ${img.src}`,
            element: img,
            wcagLevel: 'A',
          })
        }
      })

      // Check for missing form labels
      document.querySelectorAll('input, select, textarea').forEach((input) => {
        const hasLabel =
          input.hasAttribute('aria-label') ||
          input.hasAttribute('aria-labelledby') ||
          (input.id && document.querySelector(`label[for="${input.id}"]`))

        if (!hasLabel) {
          foundIssues.push({
            type: 'error',
            rule: 'WCAG 3.3.2',
            message: `Form input missing accessible label`,
            element: input as HTMLElement,
            wcagLevel: 'A',
          })
        }
      })

      // Check for empty buttons
      document.querySelectorAll('button').forEach((button) => {
        const hasAccessibleName =
          button.textContent?.trim() ||
          button.hasAttribute('aria-label') ||
          button.hasAttribute('aria-labelledby')

        if (!hasAccessibleName) {
          foundIssues.push({
            type: 'error',
            rule: 'WCAG 4.1.2',
            message: 'Button has no accessible name',
            element: button,
            wcagLevel: 'A',
          })
        }
      })

      // Check for empty links
      document.querySelectorAll('a').forEach((link) => {
        const hasAccessibleName =
          link.textContent?.trim() ||
          link.hasAttribute('aria-label') ||
          link.hasAttribute('aria-labelledby')

        if (!hasAccessibleName && link.hasAttribute('href')) {
          foundIssues.push({
            type: 'error',
            rule: 'WCAG 2.4.4',
            message: 'Link has no accessible name',
            element: link,
            wcagLevel: 'A',
          })
        }
      })

      // Check heading hierarchy
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
      let lastLevel = 0

      headings.forEach((heading) => {
        const level = parseInt(heading.tagName.substring(1))

        if (level - lastLevel > 1) {
          foundIssues.push({
            type: 'warning',
            rule: 'WCAG 1.3.1',
            message: `Heading level skipped from h${lastLevel} to h${level}`,
            element: heading as HTMLElement,
            wcagLevel: 'A',
          })
        }

        lastLevel = level
      })

      // Check for duplicate IDs
      const ids = new Map<string, number>()
      document.querySelectorAll('[id]').forEach((el) => {
        const id = el.id
        if (id) {
          ids.set(id, (ids.get(id) || 0) + 1)
        }
      })

      ids.forEach((count, id) => {
        if (count > 1) {
          foundIssues.push({
            type: 'error',
            rule: 'WCAG 4.1.1',
            message: `Duplicate ID found: ${id} (${count} instances)`,
            wcagLevel: 'A',
          })
        }
      })

      // Check for ARIA issues
      document.querySelectorAll('[role]').forEach((el) => {
        const role = el.getAttribute('role')

        // Check for invalid roles
        const validRoles = [
          'alert', 'alertdialog', 'application', 'article', 'banner', 'button',
          'cell', 'checkbox', 'columnheader', 'combobox', 'complementary',
          'contentinfo', 'definition', 'dialog', 'directory', 'document',
          'feed', 'figure', 'form', 'grid', 'gridcell', 'group', 'heading',
          'img', 'link', 'list', 'listbox', 'listitem', 'main', 'menu',
          'menubar', 'menuitem', 'menuitemcheckbox', 'menuitemradio',
          'navigation', 'none', 'note', 'option', 'presentation',
          'progressbar', 'radio', 'radiogroup', 'region', 'row', 'rowgroup',
          'rowheader', 'search', 'searchbox', 'separator', 'slider',
          'spinbutton', 'status', 'switch', 'tab', 'table', 'tablist',
          'tabpanel', 'term', 'textbox', 'timer', 'toolbar', 'tooltip',
          'tree', 'treegrid', 'treeitem',
        ]

        if (role && !validRoles.includes(role)) {
          foundIssues.push({
            type: 'error',
            rule: 'WCAG 4.1.2',
            message: `Invalid ARIA role: ${role}`,
            element: el as HTMLElement,
            wcagLevel: 'A',
          })
        }
      })

      // Check for keyboard focusability
      document.querySelectorAll('[onclick], [ng-click]').forEach((el) => {
        const tagName = el.tagName.toLowerCase()
        if (!['a', 'button', 'input', 'select', 'textarea'].includes(tagName)) {
          const hasTabIndex = el.hasAttribute('tabindex')
          const hasRole = el.hasAttribute('role')

          if (!hasTabIndex || !hasRole) {
            foundIssues.push({
              type: 'warning',
              rule: 'WCAG 2.1.1',
              message: 'Interactive element may not be keyboard accessible',
              element: el as HTMLElement,
              wcagLevel: 'A',
            })
          }
        }
      })

      setIssues(foundIssues)
    }

    // Run initial audit
    runAudit()

    // Re-run on mutations
    const observer = new MutationObserver(runAudit)
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    })

    return () => observer.disconnect()
  }, [])

  // Don't render in production
  if (process.env.NODE_ENV !== 'development') return null

  return (
    <>
      {/* Floating audit button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 left-4 z-[9999] bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-purple-700 transition-colors"
        aria-label={`Accessibility audit (${issues.length} issues found)`}
        title={`Accessibility audit: ${issues.length} issues`}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
      </button>

      {/* Audit panel */}
      {isVisible && (
        <div className="fixed bottom-20 left-4 z-[9999] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl w-96 max-h-[70vh] overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Accessibility Audit
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {issues.length} issues
              </span>
              <button
                onClick={() => setIsVisible(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                aria-label="Close"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[calc(70vh-60px)]">
            {issues.length === 0 ? (
              <div className="p-8 text-center text-gray-600 dark:text-gray-400">
                <svg
                  className="w-12 h-12 mx-auto mb-3 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="font-medium">No issues found!</p>
                <p className="text-sm mt-1">Page is accessible</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {issues.map((issue, index) => (
                  <div
                    key={index}
                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                    onClick={() => {
                      if (issue.element) {
                        issue.element.scrollIntoView({ behavior: 'smooth', block: 'center' })
                        issue.element.style.outline = '3px solid red'
                        setTimeout(() => {
                          issue.element!.style.outline = ''
                        }, 2000)
                      }
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex-shrink-0 w-2 h-2 mt-2 rounded-full ${
                          issue.type === 'error'
                            ? 'bg-red-500'
                            : issue.type === 'warning'
                            ? 'bg-yellow-500'
                            : 'bg-blue-500'
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono text-gray-600 dark:text-gray-400">
                            {issue.rule}
                          </span>
                          <span className="text-xs px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-gray-600 dark:text-gray-400">
                            {issue.wcagLevel}
                          </span>
                        </div>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {issue.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
