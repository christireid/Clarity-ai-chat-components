/**
 * Streaming Message Component
 * 
 * Displays AI responses with support for:
 * - Token-by-token streaming
 * - Partial JSON rendering
 * - Tool call visualization
 * - Thinking steps
 * - Citations
 * - Error states
 */

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Badge } from '@clarity-chat/primitives'
import type { ToolCall, Citation } from '../adapters/types'

export interface StreamingMessageProps {
  /** Accumulated message content */
  content: string
  /** Whether streaming is in progress */
  isStreaming?: boolean
  /** Tool calls made during streaming */
  toolCalls?: ToolCall[]
  /** Citations/sources */
  citations?: Citation[]
  /** Thinking steps (chain-of-thought) */
  thinkingSteps?: string[]
  /** Current thinking step being processed */
  currentThinkingStep?: string
  /** Error message if streaming failed */
  error?: string
  /** Show thinking steps */
  showThinking?: boolean
  /** Show citations inline */
  showCitations?: boolean
  /** Show tool calls */
  showTools?: boolean
  /** Callback when tool needs approval */
  onToolApprove?: (toolCall: ToolCall) => void
  /** Callback when tool is rejected */
  onToolReject?: (toolCall: ToolCall) => void
  /** Additional CSS class */
  className?: string
}

export function StreamingMessage({
  content,
  isStreaming = false,
  toolCalls = [],
  citations = [],
  thinkingSteps = [],
  currentThinkingStep,
  error,
  showThinking = true,
  showCitations = true,
  showTools = true,
  onToolApprove,
  onToolReject,
  className = ''
}: StreamingMessageProps) {
  const [displayedContent, setDisplayedContent] = React.useState('')
  const [isVisible, setIsVisible] = React.useState(false)
  
  // Animate content appearance
  React.useEffect(() => {
    setIsVisible(true)
    setDisplayedContent(content)
  }, [content])
  
  // Parse partial JSON safely
  const parsePartialJSON = (text: string): { parsed: any; remainder: string } => {
    try {
      const parsed = JSON.parse(text)
      return { parsed, remainder: '' }
    } catch (e) {
      // Try to find the last complete JSON object
      let lastBrace = text.lastIndexOf('}')
      while (lastBrace > 0) {
        try {
          const candidate = text.slice(0, lastBrace + 1)
          const parsed = JSON.parse(candidate)
          return { parsed, remainder: text.slice(lastBrace + 1) }
        } catch {
          lastBrace = text.lastIndexOf('}', lastBrace - 1)
        }
      }
      return { parsed: null, remainder: text }
    }
  }
  
  const renderContent = () => {
    const { parsed, remainder } = parsePartialJSON(displayedContent)
    
    if (parsed) {
      return (
        <div className="space-y-2">
          <pre className="bg-muted border rounded-lg p-3 overflow-x-auto text-sm">
            <code className="text-foreground">{JSON.stringify(parsed, null, 2)}</code>
          </pre>
          {remainder && (
            <div className="text-muted-foreground font-mono text-sm">
              {remainder}
              {isStreaming && (
                <motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="inline-block ml-1"
                >
                  ▋
                </motion.span>
              )}
            </div>
          )}
        </div>
      )
    }
    
    return (
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <p className="whitespace-pre-wrap text-foreground">
          {displayedContent}
          {isStreaming && (
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="inline-block ml-1"
            >
              ▋
            </motion.span>
          )}
        </p>
      </div>
    )
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 10 }}
      transition={{ duration: 0.2 }}
      className={`space-y-4 ${className}`}
    >
      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-destructive/5 border border-destructive/20 rounded-xl p-4 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <h4 className="font-semibold text-foreground">Error</h4>
              <p className="mt-1 text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Thinking Steps */}
      {showThinking && (thinkingSteps.length > 0 || currentThinkingStep) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-info/5 border border-info/20 rounded-xl p-4 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-[hsl(var(--info))] animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
            <div className="flex-1 space-y-2">
              <h4 className="font-semibold text-foreground">Thinking...</h4>
              {thinkingSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-sm text-muted-foreground flex items-center gap-2"
                >
                  <svg className="w-4 h-4 text-[hsl(var(--success))]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {step}
                </motion.div>
              ))}
              {currentThinkingStep && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-muted-foreground flex items-center gap-2"
                >
                  <div className="w-4 h-4 border-2 border-[hsl(var(--info))] border-t-transparent rounded-full animate-spin" />
                  {currentThinkingStep}
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Tool Calls */}
      {showTools && toolCalls.length > 0 && (
        <div className="space-y-2">
          <AnimatePresence>
            {toolCalls.map((tool, index) => (
              <motion.div
                key={tool.id || index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ delay: index * 0.1 }}
                className="bg-accent/50 border rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                      </div>
                      <h4 className="font-semibold text-foreground">
                        {tool.function.name}
                      </h4>
                      <Badge variant="info">Tool Call</Badge>
                    </div>
                    <pre className="bg-muted/50 border p-3 rounded-lg text-sm overflow-x-auto">
                      <code className="text-foreground font-mono">
                        {tool.function.arguments}
                      </code>
                    </pre>
                  </div>
                  {(onToolApprove || onToolReject) && (
                    <div className="flex gap-2 flex-shrink-0">
                      {onToolApprove && (
                        <Button
                          size="sm"
                          onClick={() => onToolApprove(tool)}
                        >
                          Approve
                        </Button>
                      )}
                      {onToolReject && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onToolReject(tool)}
                        >
                          Reject
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      
      {/* Message Content */}
      {displayedContent && renderContent()}
      
      {/* Citations */}
      {showCitations && citations.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
            </svg>
            <h4 className="text-sm font-semibold text-foreground">Sources</h4>
            <Badge variant="secondary">{citations.length}</Badge>
          </div>
          <div className="grid gap-2">
            <AnimatePresence>
              {citations.map((citation, index) => (
                <motion.div
                  key={citation.id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-muted/50 border rounded-xl p-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h5 className="font-semibold text-foreground truncate">
                          {citation.source}
                        </h5>
                        {citation.confidence !== undefined && (
                          <Badge 
                            variant={citation.confidence >= 0.9 ? 'success' : citation.confidence >= 0.7 ? 'info' : 'warning'}
                          >
                            {Math.round(citation.confidence * 100)}%
                          </Badge>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {citation.chunkText}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </motion.div>
  )
}
