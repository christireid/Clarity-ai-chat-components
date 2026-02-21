'use client'

/**
 * ExampleSection - Display runnable code examples with preview
 *
 * Features:
 * - Live code preview
 * - Tabbed interface (code/preview)
 * - Copy code button
 * - Expand/collapse
 * - Responsive design
 * - Dark mode support
 * - Fully accessible
 */

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Code2, Eye, Play, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CodeBlock } from './CodeBlock'

export interface ExampleSectionProps {
  /** Example title */
  title: string
  /** Example description */
  description?: string
  /** Code to display */
  code: string
  /** Programming language */
  language?: string
  /** Preview component */
  preview?: React.ReactNode
  /** Show preview by default */
  defaultShowPreview?: boolean
  /** Is collapsible */
  collapsible?: boolean
  /** Default collapsed state */
  defaultCollapsed?: boolean
  /** Additional CSS classes */
  className?: string
}

type Tab = 'code' | 'preview'

export function ExampleSection({
  title,
  description,
  code,
  language = 'tsx',
  preview,
  defaultShowPreview = true,
  collapsible = false,
  defaultCollapsed = false,
  className,
}: ExampleSectionProps) {
  const [activeTab, setActiveTab] = React.useState<Tab>(
    defaultShowPreview && preview ? 'preview' : 'code'
  )
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        'rounded-xl border bg-card overflow-hidden',
        'border-border/50 shadow-sm',
        className
      )}
    >
      {/* Header */}
      <div
        className={cn(
          'px-6 py-4 border-b border-border/50 bg-muted/30',
          collapsible && 'cursor-pointer hover:bg-muted/50 transition-colors'
        )}
        onClick={collapsible ? () => setIsCollapsed(!isCollapsed) : undefined}
        role={collapsible ? 'button' : undefined}
        aria-expanded={collapsible ? !isCollapsed : undefined}
        tabIndex={collapsible ? 0 : undefined}
        onKeyDown={
          collapsible
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setIsCollapsed(!isCollapsed)
                }
              }
            : undefined
        }
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              {title}
              {collapsible && (
                <motion.div
                  animate={{ rotate: isCollapsed ? 0 : 180 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                </motion.div>
              )}
            </h3>
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            )}
          </div>

          {!collapsible && preview && (
            <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
              <button
                onClick={() => setActiveTab('preview')}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all',
                  activeTab === 'preview'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                aria-label="Show preview"
                aria-pressed={activeTab === 'preview'}
              >
                <Eye className="w-4 h-4" aria-hidden="true" />
                Preview
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all',
                  activeTab === 'code'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                aria-label="Show code"
                aria-pressed={activeTab === 'code'}
              >
                <Code2 className="w-4 h-4" aria-hidden="true" />
                Code
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            {preview ? (
              <>
                <AnimatePresence mode="wait">
                  {activeTab === 'preview' ? (
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className="p-6"
                    >
                      <div className="rounded-lg border border-border/50 bg-background p-6">
                        {preview}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="code"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="p-6"
                    >
                      <CodeBlock code={code} language={language} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <div className="p-6">
                <CodeBlock code={code} language={language} />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  )
}

/**
 * ExampleGrid - Display multiple examples in a grid
 */
export interface ExampleGridProps {
  /** Examples to display */
  examples: Array<Omit<ExampleSectionProps, 'className'>>
  /** Additional CSS classes */
  className?: string
  /** Grid columns */
  columns?: 1 | 2
}

export function ExampleGrid({
  examples,
  className,
  columns = 1,
}: ExampleGridProps) {
  return (
    <div
      className={cn(
        'grid gap-6',
        columns === 2 && 'md:grid-cols-2',
        className
      )}
    >
      {examples.map((example, index) => (
        <ExampleSection
          key={index}
          {...example}
        />
      ))}
    </div>
  )
}
