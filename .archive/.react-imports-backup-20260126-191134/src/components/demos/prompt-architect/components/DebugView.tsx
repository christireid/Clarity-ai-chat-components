'use client'

/**
 * DebugView Component
 *
 * Toggle between template, compiled, and raw JSON views.
 */

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import type { DebugViewMode } from '../types'
import type { CoreMessage } from '../../../../hooks/chat/use-chat-enhanced'
import { generateDiff } from '../utils/template-compiler'
import { CopyButton } from './CopyButton'

export interface DebugViewProps {
  /** Current view mode */
  mode: DebugViewMode
  /** Handler to change mode */
  onModeChange: (mode: DebugViewMode) => void
  /** System prompt template */
  systemPromptTemplate: string
  /** User prompt template */
  userPromptTemplate: string
  /** Compiled system prompt */
  compiledSystemPrompt: string
  /** Compiled user prompt */
  compiledUserPrompt: string
  /** Variable values */
  variableValues: Record<string, string>
  /** Messages array for raw view */
  messagesArray: CoreMessage[]
  /** Additional class name */
  className?: string
}

/**
 * View mode tabs
 */
const VIEW_MODES: { mode: DebugViewMode; label: string }[] = [
  { mode: 'template', label: 'Template' },
  { mode: 'compiled', label: 'Compiled' },
  { mode: 'raw', label: 'Raw JSON' },
]

/**
 * Render diff segments with highlighting
 */
const DiffRenderer = React.memo(function DiffRenderer({
  template,
  values,
}: {
  template: string
  values: Record<string, string>
}) {
  const segments = React.useMemo(
    () => generateDiff(template, values),
    [template, values]
  )

  return (
    <div className="font-mono text-sm whitespace-pre-wrap break-words">
      {segments.map((segment, index) => {
        if (segment.type === 'value') {
          return (
            <span
              key={index}
              className="bg-green-500/20 text-green-700 dark:text-green-300 rounded px-0.5"
              title={`Variable: ${segment.variableName}`}
            >
              {segment.content}
            </span>
          )
        }
        if (segment.type === 'variable') {
          return (
            <span
              key={index}
              className="text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 rounded px-0.5"
            >
              {segment.content}
            </span>
          )
        }
        return <span key={index}>{segment.content}</span>
      })}
    </div>
  )
})

/**
 * Debug view with mode switcher
 */
export const DebugView = React.memo(function DebugView({
  mode,
  onModeChange,
  systemPromptTemplate,
  userPromptTemplate,
  compiledSystemPrompt,
  compiledUserPrompt,
  variableValues,
  messagesArray,
  className,
}: DebugViewProps) {
  // Memoize JSON string to avoid recalculation on every render
  const messagesJson = React.useMemo(
    () => JSON.stringify(messagesArray, null, 2),
    [messagesArray]
  )

  return (
    <div className={cn('space-y-4', className)}>
      {/* Mode switcher */}
      <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
        {VIEW_MODES.map(({ mode: m, label }) => (
          <button
            key={m}
            type="button"
            onClick={() => onModeChange(m)}
            className={cn(
              'flex-1 px-3 py-1.5 text-xs font-medium rounded-md',
              'transition-colors duration-200',
              mode === m
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-4 max-h-[500px] overflow-auto">
        {mode === 'template' && (
          <>
            {/* System prompt template */}
            {systemPromptTemplate && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase">
                  System Prompt Template
                </h4>
                <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50">
                  <pre className="font-mono text-sm whitespace-pre-wrap break-words text-foreground">
                    {systemPromptTemplate}
                  </pre>
                </div>
              </div>
            )}

            {/* User prompt template */}
            {userPromptTemplate && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase">
                  User Prompt Template
                </h4>
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50">
                  <pre className="font-mono text-sm whitespace-pre-wrap break-words text-foreground">
                    {userPromptTemplate}
                  </pre>
                </div>
              </div>
            )}
          </>
        )}

        {mode === 'compiled' && (
          <>
            {/* Compiled system prompt */}
            {compiledSystemPrompt && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase">
                    Compiled System Prompt
                  </h4>
                  <CopyButton
                    text={compiledSystemPrompt}
                    label="Copy system prompt"
                  />
                </div>
                <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50">
                  <DiffRenderer
                    template={systemPromptTemplate}
                    values={variableValues}
                  />
                </div>
              </div>
            )}

            {/* Compiled user prompt */}
            {compiledUserPrompt && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase">
                    Compiled User Prompt
                  </h4>
                  <CopyButton
                    text={compiledUserPrompt}
                    label="Copy user prompt"
                  />
                </div>
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50">
                  <DiffRenderer
                    template={userPromptTemplate}
                    values={variableValues}
                  />
                </div>
              </div>
            )}
          </>
        )}

        {mode === 'raw' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase">
                API Messages Array
              </h4>
              <CopyButton text={messagesJson} label="Copy JSON" />
            </div>
            <div className="p-3 rounded-lg bg-muted/50 border border-border overflow-auto">
              <pre className="font-mono text-xs text-foreground">
                {messagesJson}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
})

export default DebugView
