/**
 * Tool Invocation Card Component
 * 
 * Displays function/tool calls with approval flow and result visualization
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import type { ToolCall } from '../adapters/types'

export type ToolStatus = 'pending' | 'approved' | 'rejected' | 'executing' | 'success' | 'error'

export interface ToolInvocationCardProps {
  /** Tool call data */
  toolCall: ToolCall
  /** Current status */
  status?: ToolStatus
  /** Tool execution result */
  result?: any
  /** Error message if execution failed */
  error?: string
  /** Whether to show approval buttons */
  requiresApproval?: boolean
  /** Callback when tool is approved */
  onApprove?: (toolCall: ToolCall) => void
  /** Callback when tool is rejected */
  onReject?: (toolCall: ToolCall) => void
  /** Callback to retry failed tool */
  onRetry?: (toolCall: ToolCall) => void
  /** Show formatted JSON for arguments */
  formatArguments?: boolean
  /** Show result in expandable section */
  expandableResult?: boolean
  /** Additional CSS class */
  className?: string
}

export function ToolInvocationCard({
  toolCall,
  status = 'pending',
  result,
  error,
  requiresApproval = false,
  onApprove,
  onReject,
  onRetry,
  formatArguments = true,
  expandableResult = true,
  className = ''
}: ToolInvocationCardProps) {
  const [isResultExpanded, setIsResultExpanded] = React.useState(false)
  
  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20'
      case 'approved':
        return 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20'
      case 'rejected':
        return 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
      case 'executing':
        return 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20'
      case 'success':
        return 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
      case 'error':
        return 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'
      default:
        return 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
    }
  }
  
  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return (
          <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        )
      case 'executing':
        return (
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )
      case 'success':
        return (
          <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )
      case 'error':
        return (
          <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        )
      case 'rejected':
        return (
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
          </svg>
        )
      default:
        return (
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6z" clipRule="evenodd" />
          </svg>
        )
    }
  }
  
  const getStatusLabel = () => {
    switch (status) {
      case 'pending':
        return 'Awaiting approval'
      case 'approved':
        return 'Approved'
      case 'rejected':
        return 'Rejected'
      case 'executing':
        return 'Executing...'
      case 'success':
        return 'Completed'
      case 'error':
        return 'Failed'
      default:
        return 'Unknown'
    }
  }
  
  const parseArguments = () => {
    try {
      const parsed = JSON.parse(toolCall.function.arguments)
      return formatArguments ? JSON.stringify(parsed, null, 2) : toolCall.function.arguments
    } catch {
      return toolCall.function.arguments
    }
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border rounded-lg overflow-hidden ${getStatusColor()} ${className}`}
    >
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {getStatusIcon()}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  {toolCall.function.name}
                </h4>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  {getStatusLabel()}
                </span>
              </div>
              
              {/* Arguments */}
              <div className="mt-2">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Arguments:</p>
                <pre className="bg-white dark:bg-gray-900 p-2 rounded text-xs overflow-x-auto border border-gray-200 dark:border-gray-700">
                  <code className="text-gray-800 dark:text-gray-200">{parseArguments()}</code>
                </pre>
              </div>
            </div>
          </div>
          
          {/* Approval Buttons */}
          {requiresApproval && status === 'pending' && (
            <div className="flex gap-2 flex-shrink-0">
              {onApprove && (
                <button
                  onClick={() => onApprove(toolCall)}
                  className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                >
                  Approve
                </button>
              )}
              {onReject && (
                <button
                  onClick={() => onReject(toolCall)}
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md transition-colors"
                >
                  Reject
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Result Section */}
      {(result || error) && (
        <div className="border-t border-gray-200 dark:border-gray-700">
          {expandableResult ? (
            <>
              <button
                onClick={() => setIsResultExpanded(!isResultExpanded)}
                className="w-full px-4 py-2 flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <span>{error ? 'Error Details' : 'Result'}</span>
                <svg
                  className={`w-4 h-4 transition-transform ${isResultExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isResultExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-4 pb-4"
                >
                  <pre className="bg-white dark:bg-gray-900 p-3 rounded text-sm overflow-x-auto border border-gray-200 dark:border-gray-700">
                    <code className={error ? 'text-red-600 dark:text-red-400' : 'text-gray-800 dark:text-gray-200'}>
                      {error || (typeof result === 'string' ? result : JSON.stringify(result, null, 2))}
                    </code>
                  </pre>
                  {error && onRetry && (
                    <button
                      onClick={() => onRetry(toolCall)}
                      className="mt-2 px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                    >
                      Retry
                    </button>
                  )}
                </motion.div>
              )}
            </>
          ) : (
            <div className="px-4 py-3">
              <pre className="bg-white dark:bg-gray-900 p-3 rounded text-sm overflow-x-auto border border-gray-200 dark:border-gray-700">
                <code className={error ? 'text-red-600 dark:text-red-400' : 'text-gray-800 dark:text-gray-200'}>
                  {error || (typeof result === 'string' ? result : JSON.stringify(result, null, 2))}
                </code>
              </pre>
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}
