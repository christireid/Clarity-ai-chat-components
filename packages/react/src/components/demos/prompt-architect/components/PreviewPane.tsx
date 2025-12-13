'use client'

/**
 * PreviewPane Component
 *
 * Right pane showing the chat preview and debug views.
 */

import * as React from 'react'
import { AnimatePresence } from 'framer-motion'
import { cn } from '../../../../utils/cn'
import type {
  PreviewMessage as PreviewMessageType,
  DebugViewMode,
} from '../types'
import type { CoreMessage } from '../../../../hooks/use-chat-enhanced'
import { PreviewMessage } from './PreviewMessage'
import { DebugView } from './DebugView'

export interface PreviewPaneProps {
  /** Preview messages */
  messages: PreviewMessageType[]
  /** Whether currently streaming */
  isStreaming: boolean
  /** Streaming content */
  streamingContent: string
  /** Error message */
  error: string | null
  /** Whether debug view is shown */
  showDebugView: boolean
  /** Debug view mode */
  debugViewMode: DebugViewMode
  /** Handler to change debug mode */
  onDebugModeChange: (mode: DebugViewMode) => void
  /** Handler to toggle debug view */
  onToggleDebugView: () => void
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
  /** Messages array for API */
  messagesArray: CoreMessage[]
  /** Additional class name */
  className?: string
}

/**
 * Preview pane with messages and debug view
 */
export function PreviewPane({
  messages,
  isStreaming,
  streamingContent,
  error,
  showDebugView,
  debugViewMode,
  onDebugModeChange,
  onToggleDebugView,
  systemPromptTemplate,
  userPromptTemplate,
  compiledSystemPrompt,
  compiledUserPrompt,
  variableValues,
  messagesArray,
  className,
}: PreviewPaneProps) {
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when streaming
  React.useEffect(() => {
    if (isStreaming && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [isStreaming, streamingContent])

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="text-sm font-medium text-foreground">Preview</h3>
        <button
          type="button"
          onClick={onToggleDebugView}
          aria-pressed={showDebugView}
          aria-label={showDebugView ? 'Hide debug view' : 'Show debug view'}
          className={cn(
            'px-3 py-1 text-xs font-medium rounded-md',
            'transition-colors duration-200',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
            showDebugView
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:text-foreground'
          )}
        >
          {showDebugView ? 'Hide Debug' : 'Show Debug'}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {showDebugView ? (
          <DebugView
            mode={debugViewMode}
            onModeChange={onDebugModeChange}
            systemPromptTemplate={systemPromptTemplate}
            userPromptTemplate={userPromptTemplate}
            compiledSystemPrompt={compiledSystemPrompt}
            compiledUserPrompt={compiledUserPrompt}
            variableValues={variableValues}
            messagesArray={messagesArray}
          />
        ) : (
          <div className="space-y-4">
            {/* Empty state */}
            {messages.length === 0 && !isStreaming && (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="text-4xl mb-4">🚀</div>
                <h4 className="text-lg font-medium text-foreground mb-2">
                  Ready to Run
                </h4>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Click "Run Prompt" to see the compiled messages and get a
                  response from the AI.
                </p>
              </div>
            )}

            {/* Messages */}
            <div aria-live="polite" aria-atomic="false">
              <AnimatePresence mode="popLayout">
                {messages.map((message) => (
                  <PreviewMessage key={message.id} message={message} />
                ))}

                {/* Streaming message */}
                {isStreaming && streamingContent && (
                  <PreviewMessage
                    key="streaming"
                    message={{
                      id: 'streaming',
                      role: 'assistant',
                      content: streamingContent,
                      isCompiled: true,
                      timestamp: new Date(),
                    }}
                    isStreaming
                    streamingContent={streamingContent}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                aria-live="assertive"
                className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm"
              >
                <strong>Error:</strong> {error}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
    </div>
  )
}

export default PreviewPane
