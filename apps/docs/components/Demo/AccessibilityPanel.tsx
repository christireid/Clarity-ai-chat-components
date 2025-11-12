'use client'

import { ChevronDown, ChevronRight, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { useState } from 'react'
import clsx from 'clsx'

interface A11yCheck {
  name: string
  status: 'pass' | 'warning' | 'info'
  message: string
  wcagLevel?: 'A' | 'AA' | 'AAA'
}

interface AccessibilityPanelProps {
  componentName?: string
  checks?: A11yCheck[]
  keyboardShortcuts?: Array<{ key: string; action: string }>
  ariaAttributes?: Record<string, string>
  className?: string
}

export function AccessibilityPanel({
  componentName = 'Component',
  checks = [],
  keyboardShortcuts = [],
  ariaAttributes = {},
  className,
}: AccessibilityPanelProps) {
  const [expanded, setExpanded] = useState(false)

  const defaultChecks: A11yCheck[] = checks.length > 0 ? checks : [
    {
      name: 'Keyboard Navigation',
      status: 'pass',
      message: 'Fully keyboard accessible',
      wcagLevel: 'A',
    },
    {
      name: 'Screen Reader Support',
      status: 'pass',
      message: 'Proper ARIA labels provided',
      wcagLevel: 'A',
    },
    {
      name: 'Color Contrast',
      status: 'pass',
      message: 'Meets WCAG AAA standards',
      wcagLevel: 'AAA',
    },
    {
      name: 'Focus Management',
      status: 'pass',
      message: 'Clear focus indicators',
      wcagLevel: 'AA',
    },
  ]

  const passCount = defaultChecks.filter((c) => c.status === 'pass').length
  const warningCount = defaultChecks.filter((c) => c.status === 'warning').length

  return (
    <div className={clsx('border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden', className)}>
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 hover:from-green-100 hover:to-blue-100 dark:hover:from-gray-700 dark:hover:to-gray-800 transition-colors"
      >
        <div className="flex items-center gap-2">
          {expanded ? (
            <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          )}
          <span className="font-semibold text-sm text-gray-900 dark:text-gray-50">
            ♿ Accessibility
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full font-medium">
            {passCount} passing
          </span>
          {warningCount > 0 && (
            <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded-full font-medium">
              {warningCount} warnings
            </span>
          )}
        </div>
      </button>

      {/* Content */}
      {expanded && (
        <div className="bg-white dark:bg-gray-950 p-4 space-y-4">
          {/* Checks */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3">
              Accessibility Checks
            </h4>
            {defaultChecks.map((check, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
              >
                {check.status === 'pass' && (
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                )}
                {check.status === 'warning' && (
                  <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                )}
                {check.status === 'info' && (
                  <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-50">
                      {check.name}
                    </span>
                    {check.wcagLevel && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-mono font-semibold">
                        WCAG {check.wcagLevel}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {check.message}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Keyboard Shortcuts */}
          {keyboardShortcuts.length > 0 && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3">
                Keyboard Shortcuts
              </h4>
              <div className="space-y-2">
                {keyboardShortcuts.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded"
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {shortcut.action}
                    </span>
                    <kbd className="px-2 py-1 text-xs font-mono font-semibold bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded shadow-sm">
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ARIA Attributes */}
          {Object.keys(ariaAttributes).length > 0 && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3">
                ARIA Attributes
              </h4>
              <div className="space-y-2">
                {Object.entries(ariaAttributes).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-start gap-2 p-2 bg-gray-50 dark:bg-gray-900 rounded"
                  >
                    <code className="text-xs font-mono text-blue-600 dark:text-blue-400 font-semibold">
                      {key}
                    </code>
                    <span className="text-xs text-gray-600 dark:text-gray-400">=</span>
                    <code className="text-xs font-mono text-gray-700 dark:text-gray-300">
                      "{value}"
                    </code>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
