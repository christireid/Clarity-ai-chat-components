/**
 * PromptComposer Component
 *
 * Main component for progressive disclosure prompt input with token optimization.
 */

'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { glassVariants } from '@clarity-chat/primitives/glass-variants'
import { usePromptComposer } from '../../hooks/prompt-composer'
import { TokenBudgetIndicator } from './TokenBudgetIndicator'
import { ContextItemCard } from './ContextItemCard'
import { ContextMentionInput } from './ContextMentionInput'
import { CommandPalette } from './CommandPalette'
import { AttachmentManager } from './AttachmentManager'
import { InlineVoiceInput } from '../input/VoiceInput'
import type {
  PromptComposerConfig,
  ContextItem,
  Suggestion,
  Command,
  Attachment,
} from '../../hooks/prompt-composer/types'

export interface PromptComposerProps
  extends Omit<PromptComposerConfig, 'api'> {
  api: string
  placeholder?: string
  className?: string
  showTokenBudget?: boolean
  showTokenSavings?: boolean
  showContextBreakdown?: boolean
  suggestions?: Suggestion[]
  onSuggestionClick?: (suggestion: Suggestion) => void
  commands?: Command[]
  onCommandExecute?: (command: Command, args?: string) => void
}

/**
 * Production-ready PromptComposer with progressive disclosure
 *
 * **Features:**
 * - Progressive context expansion (90% token savings)
 * - Token budget visualization
 * - Context item management with @mentions
 * - Smart suggestion chips
 * - Auto-expanding textarea
 * - Drag-drop file attachments
 *
 * @example
 * ```tsx
 * <PromptComposer
 *   api="/api/chat"
 *   tokenBudget={8000}
 *   placeholder="Ask anything..."
 *   showTokenBudget
 *   showTokenSavings
 *   onSubmit={(message) => console.log(message)}
 * />
 * ```
 */
export function PromptComposer({
  api,
  placeholder = 'Ask anything...',
  className,
  showTokenBudget = true,
  showTokenSavings = false,
  showContextBreakdown = false,
  suggestions = [],
  onSuggestionClick,
  commands = [],
  onCommandExecute,
  ...config
}: PromptComposerProps) {
  const composer = usePromptComposer({
    api,
    ...config,
  })

  const { state, actions, ref } = composer

  // Command palette state
  const [selectedCommandIndex, setSelectedCommandIndex] = React.useState(0)
  const [commandQuery, setCommandQuery] = React.useState('')

  // Auto-resize textarea
  React.useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto'
      ref.current.style.height = `${ref.current.scrollHeight}px`
    }
  }, [state.value, ref])

  // Detect /slash commands
  React.useEffect(() => {
    if (commands.length === 0) return

    // Check if value starts with / (slash command)
    const slashMatch = state.value.match(/^\/(\w*)/)
    if (slashMatch) {
      const query = slashMatch[1] || ''
      setCommandQuery(query)
      actions.toggleCommands()
    } else if (state.showCommands) {
      actions.toggleCommands()
    }
  }, [state.value, commands.length, state.showCommands, actions])

  // Reset selected command when query changes
  React.useEffect(() => {
    setSelectedCommandIndex(0)
  }, [commandQuery])

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Command palette navigation
    if (state.showCommands) {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedCommandIndex((prev) => Math.min(prev + 1, commands.length - 1))
          return
        case 'ArrowUp':
          e.preventDefault()
          setSelectedCommandIndex((prev) => Math.max(prev - 1, 0))
          return
        case 'Enter':
          e.preventDefault()
          const selectedCmd = commands[selectedCommandIndex]
          if (selectedCmd) {
            handleCommandExecute(selectedCmd)
          }
          return
        case 'Escape':
          e.preventDefault()
          actions.toggleCommands()
          return
      }
    }

    // Submit on Enter (unless Shift is held)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      actions.submit()
    }

    // Close suggestions on Escape
    if (e.key === 'Escape' && state.showSuggestions) {
      e.preventDefault()
      actions.toggleSuggestions()
    }
  }

  // Handle command execution
  const handleCommandExecute = React.useCallback(
    (command: Command, args?: string) => {
      // Execute command
      actions.executeCommand(command)

      // Clear input (remove /command)
      actions.setValue('')

      // Call external handler if provided
      onCommandExecute?.(command, args)
    },
    [actions, onCommandExecute]
  )

  return (
    <div
      className={cn(
        'relative space-y-3',
        'transition-all duration-300',
        state.isExpanded && 'space-y-4',
        className
      )}
    >
      {/* Suggestions (shown when focused and empty) */}
      {state.showSuggestions && suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          {suggestions.slice(0, 6).map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => {
                actions.applySuggestion(suggestion)
                onSuggestionClick?.(suggestion)
              }}
              className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full transition-colors"
            >
              {suggestion.icon && <span className="mr-1">{suggestion.icon}</span>}
              {suggestion.text}
            </button>
          ))}
        </div>
      )}

      {/* Context Items & Attachments (shown when added) */}
      {(state.contextItems.length > 0 || state.attachments.length > 0) && (
        <div
          className={cn(
            'space-y-3 animate-in fade-in slide-in-from-top-2 duration-200',
            state.isExpanded &&
              cn(
                'p-3 rounded-lg',
                glassVariants({
                  intensity: 'medium',
                  border: 'light',
                })
              )
          )}
        >
          {/* Context Items */}
          {state.contextItems.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Context Items ({state.contextItems.length})
                </span>
                {showTokenBudget && (
                  <span className="text-xs text-gray-500 dark:text-gray-500 font-mono">
                    {state.contextItems
                      .reduce((sum, item) => sum + item.tokens.summary, 0)
                      .toLocaleString()}{' '}
                    tokens
                  </span>
                )}
              </div>
              <div className="space-y-2">
                {state.contextItems.map((item) => (
                  <ContextItemCard
                    key={item.id}
                    item={item}
                    currentLevel="summary"
                    onExpand={(level) => actions.expandContext(item.id, level)}
                    onRemove={() => actions.removeContext(item.id)}
                    compact={!state.isExpanded}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Attachments */}
          {state.attachments.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Attachments ({state.attachments.length})
                </span>
              </div>
              <AttachmentManager
                attachments={state.attachments}
                onChange={(newAttachments) => {
                  // Update by removing and re-adding
                  state.attachments.forEach((a) => actions.removeAttachment(a.id))
                  newAttachments.forEach((a) => {
                    // Convert to File and add
                    const file = new File([], a.name, { type: 'application/octet-stream' })
                    actions.addAttachment(file)
                  })
                }}
                maxFiles={
                  typeof config.features?.attachments === 'object'
                    ? config.features.attachments.maxFiles
                    : 5
                }
                maxFileSize={
                  typeof config.features?.attachments === 'object'
                    ? config.features.attachments.maxSize
                    : 10 * 1024 * 1024
                }
                onUpload={
                  typeof config.features?.attachments === 'object'
                    ? config.features.attachments.uploadHandler
                    : undefined
                }
                compact={!state.isExpanded}
              />
            </div>
          )}
        </div>
      )}

      {/* Main Input Area */}
      <div
        className={cn(
          'relative rounded-lg',
          'focus-within:ring-2 focus-within:ring-blue-500/20',
          'transition-all duration-200',
          glassVariants({
            intensity: 'medium',
            border: 'light',
          }),
          state.isExpanded && 'border-gray-300 dark:border-gray-600'
        )}
      >
        {/* Command Palette (shown when /command is typed) */}
        {state.showCommands && commands.length > 0 && (
          <CommandPalette
            commands={commands}
            categories={
              typeof config.features?.commands === 'object'
                ? config.features.commands.categories
                : undefined
            }
            query={commandQuery}
            selectedIndex={selectedCommandIndex}
            onExecute={handleCommandExecute}
            onSelectionChange={setSelectedCommandIndex}
            onClose={() => actions.toggleCommands()}
            fuzzySearch={
              typeof config.features?.commands === 'object'
                ? config.features.commands.fuzzySearch
                : true
            }
          />
        )}
        {/* Context Mention Input (if context feature enabled) */}
        {config.features?.context !== false &&
        typeof config.features?.context === 'object' &&
        config.features.context.providers ? (
          <ContextMentionInput
            value={state.value}
            onChange={(newValue, contextItems) => {
              actions.setValue(newValue)
              // Add any new context items
              contextItems.forEach((item) => {
                if (!state.contextItems.some((existing) => existing.id === item.id)) {
                  actions.addContext(item)
                }
              })
            }}
            providers={config.features.context.providers}
            placeholder={placeholder}
            disabled={state.isSubmitting}
            tokenBudget={state.tokenBudget}
            currentTokens={state.totalTokens}
            onSubmit={() => actions.submit()}
            onFocus={() => actions.focus()}
            onBlur={() => actions.blur()}
            className={cn(
              state.isExpanded && 'min-h-[120px]',
              state.isSubmitting && 'opacity-50 cursor-not-allowed'
            )}
          />
        ) : (
          /* Fallback: Basic Textarea */
          <textarea
            ref={ref}
            value={state.value}
            onChange={(e) => actions.setValue(e.target.value)}
            onFocus={() => actions.focus()}
            onBlur={() => actions.blur()}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={state.isSubmitting}
            className={cn(
              'w-full p-3 bg-transparent resize-none',
              'text-gray-900 dark:text-gray-100',
              'placeholder:text-gray-400 dark:placeholder:text-gray-600',
              'focus:outline-none',
              'min-h-[52px]',
              state.isExpanded && 'min-h-[120px]',
              state.isSubmitting && 'opacity-50 cursor-not-allowed'
            )}
            rows={state.isExpanded ? 4 : 1}
          />
        )}

        {/* Actions Bar */}
        <div
          className={cn(
            'flex items-center justify-between px-3 pb-2',
            'border-t border-gray-100 dark:border-gray-800',
            !state.isExpanded && 'pt-2'
          )}
        >
          {/* Left Actions */}
          <div className="flex items-center gap-1">
            {/* File Upload */}
            {config.features?.attachments !== false && (
              <AttachmentManager
                attachments={state.attachments}
                onChange={(newAttachments) => {
                  // Clear existing and add new
                  const removed = state.attachments.filter(
                    (a) => !newAttachments.find((na) => na.id === a.id)
                  )
                  removed.forEach((a) => actions.removeAttachment(a.id))

                  const added = newAttachments.filter(
                    (na) => !state.attachments.find((a) => a.id === na.id)
                  )
                  added.forEach(async (a) => {
                    // Create a dummy file for the attachment
                    const response = await fetch(a.url)
                    const blob = await response.blob()
                    const file = new File([blob], a.name, { type: blob.type })
                    await actions.addAttachment(file)
                  })
                }}
                maxFiles={
                  typeof config.features?.attachments === 'object'
                    ? config.features.attachments.maxFiles
                    : 5
                }
                maxFileSize={
                  typeof config.features?.attachments === 'object'
                    ? config.features.attachments.maxSize
                    : 10 * 1024 * 1024
                }
                acceptedTypes={
                  typeof config.features?.attachments === 'object'
                    ? config.features.attachments.acceptedTypes
                    : undefined
                }
                onUpload={
                  typeof config.features?.attachments === 'object'
                    ? config.features.attachments.uploadHandler
                    : undefined
                }
              />
            )}

            {/* Voice Input */}
            {config.features?.voice !== false && (
              <InlineVoiceInput
                value={state.value}
                onChange={(newValue) => actions.setValue(newValue)}
                lang={
                  typeof config.features?.voice === 'object'
                    ? config.features.voice.lang
                    : 'en-US'
                }
                position="outside"
              />
            )}

            {/* Settings */}
            {state.isExpanded && config.features?.settings !== false && (
              <button
                type="button"
                onClick={() => actions.toggleSettings()}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                aria-label="Settings"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.34 1.804A1 1 0 019.32 1h1.36a1 1 0 01.98.804l.295 1.473c.497.144.971.342 1.416.587l1.25-.834a1 1 0 011.262.125l.962.962a1 1 0 01.125 1.262l-.834 1.25c.245.445.443.919.587 1.416l1.473.294a1 1 0 01.804.98v1.361a1 1 0 01-.804.98l-1.473.295a6.95 6.95 0 01-.587 1.416l.834 1.25a1 1 0 01-.125 1.262l-.962.962a1 1 0 01-1.262.125l-1.25-.834a6.953 6.953 0 01-1.416.587l-.294 1.473a1 1 0 01-.98.804H9.32a1 1 0 01-.98-.804l-.295-1.473a6.957 6.957 0 01-1.416-.587l-1.25.834a1 1 0 01-1.262-.125l-.962-.962a1 1 0 01-.125-1.262l.834-1.25a6.957 6.957 0 01-.587-1.416l-1.473-.294A1 1 0 011 10.68V9.32a1 1 0 01.804-.98l1.473-.295c.144-.497.342-.971.587-1.416l-.834-1.25a1 1 0 01.125-1.262l.962-.962A1 1 0 015.38 3.03l1.25.834a6.957 6.957 0 011.416-.587l.294-1.473zM13 10a3 3 0 11-6 0 3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Token Budget (compact) */}
            {showTokenBudget && !state.isExpanded && (
              <span
                className={cn(
                  'text-xs font-mono',
                  state.tokenUsage < 0.6 && 'text-green-600 dark:text-green-400',
                  state.tokenUsage >= 0.6 &&
                    state.tokenUsage < 0.8 &&
                    'text-yellow-600 dark:text-yellow-400',
                  state.tokenUsage >= 0.8 && 'text-red-600 dark:text-red-400'
                )}
              >
                {state.totalTokens}/{state.tokenBudget}
              </span>
            )}

            {/* Submit Button */}
            <button
              type="button"
              onClick={() => actions.submit()}
              disabled={
                state.isSubmitting ||
                (!state.value.trim() && state.attachments.length === 0)
              }
              className={cn(
                'px-4 py-2 rounded-lg font-medium transition-colors',
                'bg-blue-600 hover:bg-blue-700 text-white',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                state.isSubmitting && 'animate-pulse'
              )}
            >
              {state.isSubmitting ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      </div>

      {/* Token Budget Indicator (expanded view) */}
      {showTokenBudget && state.isExpanded && (
        <TokenBudgetIndicator
          current={state.totalTokens}
          max={state.tokenBudget}
          contextItems={state.contextItems}
          showSavings={showTokenSavings}
          showBreakdown={showContextBreakdown}
          className="animate-in fade-in slide-in-from-bottom-2 duration-200"
        />
      )}

      {/* Error Display */}
      {state.error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg text-sm animate-in fade-in slide-in-from-bottom-2 duration-200">
          {state.error.message}
        </div>
      )}
    </div>
  )
}

PromptComposer.displayName = 'PromptComposer'
