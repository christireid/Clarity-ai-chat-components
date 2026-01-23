/**
 * Tool Approval Dialog Component
 *
 * Pre-built UI component for tool approval flows.
 * Displays tool information and allows users to approve or reject execution.
 *
 * @module components/tool-approval
 */

import React, { useState } from 'react'
import type { ToolCallRecord } from '../../core/tool-lifecycle'
import type { ToolDefinition } from '../../types/tool-definition'

// =============================================================================
// Types
// =============================================================================

export interface ToolApprovalDialogProps {
  /** Tool call awaiting approval */
  toolCall: ToolCallRecord

  /** Tool definition (optional, for better UX) */
  toolDefinition?: ToolDefinition

  /** Called when user approves */
  onApprove: (callId: string, reason?: string) => void

  /** Called when user rejects */
  onReject: (callId: string, reason: string) => void

  /** Show detailed arguments (default: true) */
  showArguments?: boolean

  /** Show tool description (default: true) */
  showDescription?: boolean

  /** Show risk level indicator (default: true) */
  showRiskLevel?: boolean

  /** Custom className for styling */
  className?: string

  /** Custom theme */
  theme?: 'light' | 'dark' | 'auto'
}

// =============================================================================
// Component
// =============================================================================

/**
 * Tool Approval Dialog
 *
 * A pre-built dialog component for requesting user approval to execute tools.
 *
 * @example
 * ```tsx
 * const [pendingTool, setPendingTool] = useState<ToolCallRecord | null>(null)
 *
 * useEffect(() => {
 *   orchestrator.lifecycle.on('tool_pending_approval', (event) => {
 *     setPendingTool(event.call)
 *   })
 * }, [])
 *
 * return (
 *   <>
 *     <ChatInterface />
 *     {pendingTool && (
 *       <ToolApprovalDialog
 *         toolCall={pendingTool}
 *         toolDefinition={orchestrator.getTool(pendingTool.toolName)}
 *         onApprove={(callId) => {
 *           orchestrator.approveTool(callId, 'user')
 *           orchestrator.executeApprovedTool(callId)
 *           setPendingTool(null)
 *         }}
 *         onReject={(callId, reason) => {
 *           orchestrator.rejectTool(callId, reason, 'user')
 *           setPendingTool(null)
 *         }}
 *       />
 *     )}
 *   </>
 * )
 * ```
 */
export function ToolApprovalDialog({
  toolCall,
  toolDefinition,
  onApprove,
  onReject,
  showArguments = true,
  showDescription = true,
  showRiskLevel = true,
  className = '',
  theme = 'auto',
}: ToolApprovalDialogProps): React.ReactElement {
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectInput, setShowRejectInput] = useState(false)

  const riskLevel = determineRiskLevel(toolCall, toolDefinition)

  const handleApprove = () => {
    onApprove(toolCall.id)
  }

  const handleReject = () => {
    const reason = rejectReason.trim() || 'User declined'
    onReject(toolCall.id, reason)
  }

  return (
    <div className={`tool-approval-dialog ${className}`} data-theme={theme}>
      {/* Overlay */}
      <div className="tool-approval-overlay" />

      {/* Dialog */}
      <div className="tool-approval-content">
        {/* Header */}
        <div className="tool-approval-header">
          <h2>Tool Approval Required</h2>
          {showRiskLevel && (
            <span
              className={`tool-approval-risk tool-approval-risk-${riskLevel}`}
            >
              {riskLevel.toUpperCase()}
            </span>
          )}
        </div>

        {/* Tool Info */}
        <div className="tool-approval-body">
          <div className="tool-approval-section">
            <h3>Tool</h3>
            <div className="tool-approval-tool-name">{toolCall.toolName}</div>
          </div>

          {showDescription && toolDefinition?.description && (
            <div className="tool-approval-section">
              <h3>Description</h3>
              <p className="tool-approval-description">
                {toolDefinition.description}
              </p>
            </div>
          )}

          {showArguments && Object.keys(toolCall.args).length > 0 && (
            <div className="tool-approval-section">
              <h3>Arguments</h3>
              <pre className="tool-approval-args">
                {JSON.stringify(toolCall.args, null, 2)}
              </pre>
            </div>
          )}

          <div className="tool-approval-section">
            <h3>What will this do?</h3>
            <p className="tool-approval-explanation">
              {generateExplanation(toolCall, toolDefinition)}
            </p>
          </div>
        </div>

        {/* Reject Input (if showing) */}
        {showRejectInput && (
          <div className="tool-approval-reject-input">
            <label htmlFor="reject-reason">
              Reason for rejection (optional):
            </label>
            <input
              id="reject-reason"
              type="text"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Why are you rejecting this tool?"
              autoFocus
            />
          </div>
        )}

        {/* Actions */}
        <div className="tool-approval-actions">
          {!showRejectInput ? (
            <>
              <button
                className="tool-approval-button tool-approval-button-reject"
                onClick={() => setShowRejectInput(true)}
              >
                Reject
              </button>
              <button
                className="tool-approval-button tool-approval-button-approve"
                onClick={handleApprove}
              >
                Approve
              </button>
            </>
          ) : (
            <>
              <button
                className="tool-approval-button tool-approval-button-secondary"
                onClick={() => setShowRejectInput(false)}
              >
                Cancel
              </button>
              <button
                className="tool-approval-button tool-approval-button-reject"
                onClick={handleReject}
              >
                Confirm Rejection
              </button>
            </>
          )}
        </div>
      </div>

      <style>{`
        .tool-approval-dialog {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .tool-approval-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
        }

        .tool-approval-content {
          position: relative;
          background: white;
          border-radius: 12px;
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        [data-theme='dark'] .tool-approval-content {
          background: #1f2937;
          color: #f9fafb;
        }

        .tool-approval-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }

        [data-theme='dark'] .tool-approval-header {
          border-bottom-color: #374151;
        }

        .tool-approval-header h2 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .tool-approval-risk {
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .tool-approval-risk-low {
          background: #d1fae5;
          color: #065f46;
        }

        .tool-approval-risk-medium {
          background: #fef3c7;
          color: #92400e;
        }

        .tool-approval-risk-high {
          background: #fee2e2;
          color: #991b1b;
        }

        .tool-approval-body {
          padding: 1.5rem;
        }

        .tool-approval-section {
          margin-bottom: 1.5rem;
        }

        .tool-approval-section:last-child {
          margin-bottom: 0;
        }

        .tool-approval-section h3 {
          margin: 0 0 0.5rem 0;
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: uppercase;
          color: #6b7280;
        }

        [data-theme='dark'] .tool-approval-section h3 {
          color: #9ca3af;
        }

        .tool-approval-tool-name {
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 1.125rem;
          font-weight: 600;
          color: #1f2937;
        }

        [data-theme='dark'] .tool-approval-tool-name {
          color: #f9fafb;
        }

        .tool-approval-description {
          margin: 0;
          color: #4b5563;
          line-height: 1.6;
        }

        [data-theme='dark'] .tool-approval-description {
          color: #d1d5db;
        }

        .tool-approval-args {
          margin: 0;
          padding: 1rem;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.875rem;
          overflow-x: auto;
        }

        [data-theme='dark'] .tool-approval-args {
          background: #111827;
          border-color: #374151;
          color: #f9fafb;
        }

        .tool-approval-explanation {
          margin: 0;
          color: #374151;
          line-height: 1.6;
        }

        [data-theme='dark'] .tool-approval-explanation {
          color: #e5e7eb;
        }

        .tool-approval-reject-input {
          padding: 0 1.5rem 1.5rem 1.5rem;
        }

        .tool-approval-reject-input label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
        }

        [data-theme='dark'] .tool-approval-reject-input label {
          color: #d1d5db;
        }

        .tool-approval-reject-input input {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 0.875rem;
        }

        [data-theme='dark'] .tool-approval-reject-input input {
          background: #111827;
          border-color: #374151;
          color: #f9fafb;
        }

        .tool-approval-reject-input input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .tool-approval-actions {
          display: flex;
          gap: 0.75rem;
          padding: 1.5rem;
          border-top: 1px solid #e5e7eb;
        }

        [data-theme='dark'] .tool-approval-actions {
          border-top-color: #374151;
        }

        .tool-approval-button {
          flex: 1;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tool-approval-button:hover {
          transform: translateY(-1px);
        }

        .tool-approval-button:active {
          transform: translateY(0);
        }

        .tool-approval-button-approve {
          background: #10b981;
          color: white;
        }

        .tool-approval-button-approve:hover {
          background: #059669;
        }

        .tool-approval-button-reject {
          background: #ef4444;
          color: white;
        }

        .tool-approval-button-reject:hover {
          background: #dc2626;
        }

        .tool-approval-button-secondary {
          background: #e5e7eb;
          color: #374151;
        }

        [data-theme='dark'] .tool-approval-button-secondary {
          background: #374151;
          color: #e5e7eb;
        }

        .tool-approval-button-secondary:hover {
          background: #d1d5db;
        }

        [data-theme='dark'] .tool-approval-button-secondary:hover {
          background: #4b5563;
        }
      `}</style>
    </div>
  )
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Determine risk level of a tool call
 */
function determineRiskLevel(
  toolCall: ToolCallRecord,
  toolDefinition?: ToolDefinition
): 'low' | 'medium' | 'high' {
  const toolName = toolCall.toolName.toLowerCase()

  // High risk tools
  const highRiskKeywords = [
    'delete',
    'remove',
    'drop',
    'destroy',
    'execute',
    'eval',
    'system',
  ]
  if (highRiskKeywords.some((keyword) => toolName.includes(keyword))) {
    return 'high'
  }

  // Medium risk tools
  const mediumRiskKeywords = [
    'write',
    'update',
    'modify',
    'create',
    'send',
    'email',
    'database',
  ]
  if (mediumRiskKeywords.some((keyword) => toolName.includes(keyword))) {
    return 'medium'
  }

  // Tool explicitly requires approval = at least medium risk
  if (toolDefinition?.requiresApproval) {
    return 'medium'
  }

  return 'low'
}

/**
 * Generate human-readable explanation of what the tool will do
 */
function generateExplanation(
  toolCall: ToolCallRecord,
  toolDefinition?: ToolDefinition
): string {
  const toolName = toolCall.toolName
  const args = toolCall.args

  // Try to generate contextual explanation
  if (toolName.includes('weather')) {
    return `This will fetch current weather information for ${args.location || 'the specified location'}.`
  }

  if (toolName.includes('calculate') || toolName.includes('math')) {
    return `This will perform a calculation: ${args.expression || args.operation || 'the requested operation'}.`
  }

  if (toolName.includes('search')) {
    return `This will search for: "${args.query || args.q || 'the specified query'}".`
  }

  if (toolName.includes('database') || toolName.includes('query')) {
    return `This will execute a database query. Please review the arguments carefully.`
  }

  if (toolName.includes('email') || toolName.includes('send')) {
    return `This will send an email to ${args.to || args.recipient || 'the specified recipient'}.`
  }

  if (toolName.includes('file') || toolName.includes('write')) {
    return `This will write to a file: ${args.path || args.filename || 'the specified file'}.`
  }

  // Fallback to description or generic explanation
  if (toolDefinition?.description) {
    return toolDefinition.description
  }

  return `This will execute the "${toolName}" tool with the provided arguments.`
}
