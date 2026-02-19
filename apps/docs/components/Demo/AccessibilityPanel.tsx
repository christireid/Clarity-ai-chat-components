'use client'

import { ChevronDown, ChevronRight, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

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
      message: 'Meets WCAG AA standards with AAA targets',
      wcagLevel: 'AA',
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
    <div
      className={cn(
        'group/a11y relative rounded-xl overflow-hidden transition-all duration-300',
        // Multi-layer shadow system
        'shadow-[0_2px_8px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.04)]',
        'dark:shadow-[0_2px_8px_rgba(0,0,0,0.2),0_4px_16px_rgba(0,0,0,0.15)]',
        expanded && 'shadow-[0_4px_12px_rgba(34,197,94,0.1),0_8px_24px_rgba(34,197,94,0.08)]',
        expanded && 'dark:shadow-[0_4px_12px_rgba(34,197,94,0.15),0_8px_24px_rgba(34,197,94,0.1)]',
        className
      )}
    >
      {/* Gradient border */}
      <div
        className={cn(
          'absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-300',
          expanded ? 'opacity-100' : 'opacity-50'
        )}
        style={{
          padding: '1px',
          background: expanded
            ? 'linear-gradient(135deg, rgba(34,197,94,0.5) 0%, rgba(59,130,246,0.3) 50%, rgba(34,197,94,0.4) 100%)'
            : 'linear-gradient(135deg, rgba(34,197,94,0.25) 0%, rgba(59,130,246,0.15) 50%, rgba(34,197,94,0.2) 100%)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
        aria-hidden="true"
      />
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={cn(
          'relative z-10 w-full flex items-center justify-between px-4 py-3 transition-all duration-300',
          'bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-800/80 dark:to-gray-900/80',
          'hover:from-green-100 hover:to-blue-100 dark:hover:from-gray-700/80 dark:hover:to-gray-800/80',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-green-500'
        )}
      >
        <div className="flex items-center gap-2">
          <div className={cn(
            'w-6 h-6 rounded-md flex items-center justify-center transition-all duration-300',
            expanded
              ? 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
          )}>
            {expanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </div>
          <span className={cn(
            'font-semibold text-sm transition-colors duration-300',
            expanded ? 'text-green-700 dark:text-green-300' : 'text-gray-900 dark:text-gray-50'
          )}>
            ♿ Accessibility
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn(
            'text-xs px-2.5 py-1 rounded-full font-medium transition-all duration-300',
            'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
            expanded && 'shadow-[0_0_12px_rgba(34,197,94,0.3)]'
          )}>
            {passCount} passing
          </span>
          {warningCount > 0 && (
            <span className={cn(
              'text-xs px-2.5 py-1 rounded-full font-medium transition-all duration-300',
              'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300',
              expanded && 'shadow-[0_0_12px_rgba(234,179,8,0.3)]'
            )}>
              {warningCount} warnings
            </span>
          )}
        </div>
      </button>

      {/* Content */}
      {expanded && (
        <div className="relative z-10 bg-white dark:bg-gray-950/95 p-4 space-y-4">
          {/* Checks */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3">
              Accessibility Checks
            </h4>
            {defaultChecks.map((check, index) => (
              <div
                key={index}
                className={cn(
                  'group/check flex items-start gap-3 p-3 rounded-lg transition-all duration-300',
                  'bg-gray-50 dark:bg-gray-900/50',
                  'hover:shadow-sm',
                  check.status === 'pass' && 'hover:bg-green-50/50 dark:hover:bg-green-900/20',
                  check.status === 'warning' && 'hover:bg-yellow-50/50 dark:hover:bg-yellow-900/20',
                  check.status === 'info' && 'hover:bg-blue-50/50 dark:hover:bg-blue-900/20'
                )}
              >
                {check.status === 'pass' && (
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5 transition-transform duration-300 group-hover/check:scale-110" />
                )}
                {check.status === 'warning' && (
                  <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5 transition-transform duration-300 group-hover/check:scale-110" />
                )}
                {check.status === 'info' && (
                  <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5 transition-transform duration-300 group-hover/check:scale-110" />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-50">
                      {check.name}
                    </span>
                    {check.wcagLevel && (
                      <span className={cn(
                        'text-xs px-2 py-0.5 rounded-full font-mono font-semibold transition-all duration-300',
                        'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
                        'group-hover/check:shadow-[0_0_8px_rgba(59,130,246,0.3)]'
                      )}>
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
