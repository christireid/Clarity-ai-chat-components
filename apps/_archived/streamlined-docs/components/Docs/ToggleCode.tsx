'use client'

/**
 * ToggleCode - Show/hide code sections with smooth animations
 *
 * Features:
 * - Expandable/collapsible code
 * - Smooth animations
 * - Configurable default state
 * - Dark mode support
 * - Fully accessible
 */

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Code2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CodeBlock } from './CodeBlock'

export interface ToggleCodeProps {
  /** Code content */
  code: string
  /** Programming language */
  language: string
  /** Section title */
  title?: string
  /** Default expanded state */
  defaultExpanded?: boolean
  /** Additional CSS classes */
  className?: string
  /** Show line numbers */
  showLineNumbers?: boolean
  /** File name */
  filename?: string
}

export function ToggleCode({
  code,
  language,
  title = 'View code',
  defaultExpanded = false,
  className,
  showLineNumbers = false,
  filename,
}: ToggleCodeProps) {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded)

  return (
    <div className={cn('rounded-lg border border-border/50 overflow-hidden', className)}>
      {/* Toggle button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'w-full flex items-center justify-between gap-3 px-4 py-3',
          'bg-muted/30 hover:bg-muted/50 transition-colors',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-inset'
        )}
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
          <span className="text-sm font-medium text-foreground">{title}</span>
          {filename && (
            <span className="text-xs text-muted-foreground">({filename})</span>
          )}
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <ChevronDown className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
        </motion.div>
      </button>

      {/* Code content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-border/50">
              <CodeBlock
                code={code}
                language={language}
                showLineNumbers={showLineNumbers}
                filename={filename}
                className="border-0 rounded-none"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * ToggleCodeGroup - Multiple toggleable code sections
 */
export interface ToggleCodeGroupProps {
  /** Code sections */
  sections: Array<{
    title: string
    code: string
    language: string
    filename?: string
  }>
  /** Allow multiple sections to be expanded */
  allowMultiple?: boolean
  /** Additional CSS classes */
  className?: string
}

export function ToggleCodeGroup({
  sections,
  allowMultiple = false,
  className,
}: ToggleCodeGroupProps) {
  const [expandedIndices, setExpandedIndices] = React.useState<Set<number>>(new Set())

  const toggleSection = React.useCallback(
    (index: number) => {
      setExpandedIndices((prev) => {
        const next = new Set(prev)
        if (next.has(index)) {
          next.delete(index)
        } else {
          if (!allowMultiple) {
            next.clear()
          }
          next.add(index)
        }
        return next
      })
    },
    [allowMultiple]
  )

  return (
    <div className={cn('space-y-3', className)}>
      {sections.map((section, index) => {
        const isExpanded = expandedIndices.has(index)

        return (
          <div
            key={index}
            className="rounded-lg border border-border/50 overflow-hidden"
          >
            <button
              onClick={() => toggleSection(index)}
              className={cn(
                'w-full flex items-center justify-between gap-3 px-4 py-3',
                'bg-muted/30 hover:bg-muted/50 transition-colors',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-inset'
              )}
              aria-expanded={isExpanded}
            >
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                <span className="text-sm font-medium text-foreground">
                  {section.title}
                </span>
                {section.filename && (
                  <span className="text-xs text-muted-foreground">
                    ({section.filename})
                  </span>
                )}
              </div>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <ChevronDown className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-border/50">
                    <CodeBlock
                      code={section.code}
                      language={section.language}
                      filename={section.filename}
                      className="border-0 rounded-none"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
