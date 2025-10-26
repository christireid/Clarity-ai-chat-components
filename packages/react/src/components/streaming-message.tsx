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
          <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto text-sm">
            <code>{JSON.stringify(parsed, null, 2)}</code>
          </pre>
          {remainder && (
            <div className="text-gray-600 dark:text-gray-400 font-mono text-sm">
              {remainder}
              {isStreaming && <span className="animate-pulse">▋</span>}
            </div>
          )}
        </div>
      )
    }
    
    return (
      <div className="prose dark:prose-invert max-w-none">
        <p className="whitespace-pre-wrap">
          {displayedContent}
          {isStreaming && <span className="inline-block animate-pulse ml-1">▋</span>}
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
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
        >
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <h4 className="font-medium text-red-800 dark:text-red-200">Error</h4>
              <p className="mt-1 text-sm text-red-700 dark:text-red-300">{error}</p>
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
          className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
            <div className="flex-1 space-y-2">
              <h4 className="font-medium text-blue-900 dark:text-blue-100">Thinking...</h4>
              {thinkingSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-sm text-blue-800 dark:text-blue-200 flex items-center gap-2"
                >
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {step}
                </motion.div>
              ))}
              {currentThinkingStep && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2"
                >
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
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
                className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                      </svg>
                      <h4 className="font-medium text-purple-900 dark:text-purple-100">
                        {tool.function.name}
                      </h4>
                    </div>
                    <pre className="bg-white dark:bg-gray-900 p-3 rounded text-sm overflow-x-auto">
                      <code className="text-purple-800 dark:text-purple-200">
                        {tool.function.arguments}
                      </code>
                    </pre>
                  </div>
                  {(onToolApprove || onToolReject) && (
                    <div className="flex gap-2 flex-shrink-0">
                      {onToolApprove && (
                        <button
                          onClick={() => onToolApprove(tool)}
                          className="px-3 py-1 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors"
                        >
                          Approve
                        </button>
                      )}
                      {onToolReject && (
                        <button
                          onClick={() => onToolReject(tool)}
                          className="px-3 py-1 text-sm font-medium text-purple-700 dark:text-purple-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-purple-300 dark:border-purple-700 rounded-md transition-colors"
                        >
                          Reject
                        </button>
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
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Sources</h4>
          <div className="grid gap-2">
            <AnimatePresence>
              {citations.map((citation, index) => (
                <motion.div
                  key={citation.id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3"
                >
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h5 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                          {citation.source}
                        </h5>
                        {citation.confidence !== undefined && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {Math.round(citation.confidence * 100)}%
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
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
