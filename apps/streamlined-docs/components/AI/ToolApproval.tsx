'use client'

import React, { useState } from 'react'
import {
  Check,
  X,
  AlertTriangle,
  Clock,
  Loader2,
  Shield,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

/**
 * ToolApproval Component
 *
 * Human-in-the-loop approval interface for AI tool executions.
 * Inspired by assistant-ui and CopilotKit patterns.
 *
 * @example
 * ```tsx
 * <ToolApproval
 *   tool={{
 *     name: 'send_email',
 *     description: 'Send an email to the user',
 *     args: { to: 'user@example.com', subject: 'Hello' }
 *   }}
 *   status="approval_required"
 *   onApprove={() => executeTool()}
 *   onReject={() => cancelTool()}
 * />
 * ```
 */

export type ToolApprovalStatus =
  | 'pending'
  | 'approval_required'
  | 'approved'
  | 'rejected'
  | 'executing'
  | 'completed'
  | 'error'

export interface ToolInfo {
  /** Tool identifier */
  name: string
  /** Human-readable description */
  description?: string
  /** Tool arguments/parameters */
  args?: Record<string, unknown>
  /** Risk level for the tool */
  riskLevel?: 'low' | 'medium' | 'high'
}

export interface ToolApprovalProps {
  /** Tool information */
  tool: ToolInfo
  /** Current approval status */
  status: ToolApprovalStatus
  /** Callback when user approves the tool */
  onApprove?: () => void
  /** Callback when user rejects the tool */
  onReject?: () => void
  /** Callback when user wants to modify args before approval */
  onModify?: (modifiedArgs: Record<string, unknown>) => void
  /** Error message if status is 'error' */
  errorMessage?: string
  /** Time remaining for auto-approval (in seconds) */
  autoApproveIn?: number
  /** Whether to show the args details */
  showArgs?: boolean
  /** Additional CSS classes */
  className?: string
  /** Pass Through API for styling */
  pt?: {
    root?: React.HTMLAttributes<HTMLDivElement>
    header?: React.HTMLAttributes<HTMLDivElement>
    content?: React.HTMLAttributes<HTMLDivElement>
    actions?: React.HTMLAttributes<HTMLDivElement>
    approveButton?: React.ButtonHTMLAttributes<HTMLButtonElement>
    rejectButton?: React.ButtonHTMLAttributes<HTMLButtonElement>
  }
}

const statusConfig: Record<
  ToolApprovalStatus,
  { icon: React.ReactNode; label: string; className: string }
> = {
  pending: {
    icon: <Clock className="h-4 w-4" />,
    label: 'Pending',
    className: 'bg-muted text-muted-foreground',
  },
  approval_required: {
    icon: <AlertTriangle className="h-4 w-4" />,
    label: 'Approval Required',
    className:
      'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  },
  approved: {
    icon: <Check className="h-4 w-4" />,
    label: 'Approved',
    className:
      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  },
  rejected: {
    icon: <X className="h-4 w-4" />,
    label: 'Rejected',
    className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  },
  executing: {
    icon: <Loader2 className="h-4 w-4 animate-spin" />,
    label: 'Executing',
    className:
      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  },
  completed: {
    icon: <Check className="h-4 w-4" />,
    label: 'Completed',
    className:
      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  },
  error: {
    icon: <AlertTriangle className="h-4 w-4" />,
    label: 'Error',
    className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  },
}

const riskLevelConfig = {
  low: {
    icon: <Shield className="h-3 w-3" />,
    label: 'Low Risk',
    className: 'text-green-600 dark:text-green-400',
  },
  medium: {
    icon: <Shield className="h-3 w-3" />,
    label: 'Medium Risk',
    className: 'text-amber-600 dark:text-amber-400',
  },
  high: {
    icon: <Shield className="h-3 w-3" />,
    label: 'High Risk',
    className: 'text-red-600 dark:text-red-400',
  },
}

export function ToolApproval({
  tool,
  status,
  onApprove,
  onReject,
  onModify,
  errorMessage,
  autoApproveIn,
  showArgs = true,
  className = '',
  pt = {},
}: ToolApprovalProps) {
  const [isArgsExpanded, setIsArgsExpanded] = useState(false)
  const statusInfo = statusConfig[status]
  const riskInfo = tool.riskLevel ? riskLevelConfig[tool.riskLevel] : null

  const formatToolName = (name: string) => {
    return name
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  const formatArgs = (args: Record<string, unknown>) => {
    return JSON.stringify(args, null, 2)
  }

  return (
    <div
      className={`
        rounded-lg border bg-card overflow-hidden
        ${className}
      `}
      role="region"
      aria-label={`Tool approval: ${tool.name}`}
      {...pt.root}
    >
      {/* Header */}
      <div
        className={`
          flex items-center justify-between px-4 py-3 border-b
          ${statusInfo.className}
        `}
        {...pt.header}
      >
        <div className="flex items-center gap-2">
          {statusInfo.icon}
          <span className="font-medium">{formatToolName(tool.name)}</span>
        </div>
        <div className="flex items-center gap-2">
          {riskInfo && (
            <span
              className={`flex items-center gap-1 text-xs ${riskInfo.className}`}
            >
              {riskInfo.icon}
              {riskInfo.label}
            </span>
          )}
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-background/50">
            {statusInfo.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-3" {...pt.content}>
        {/* Description */}
        {tool.description && (
          <p className="text-sm text-muted-foreground mb-3">
            {tool.description}
          </p>
        )}

        {/* Arguments */}
        {showArgs && tool.args && Object.keys(tool.args).length > 0 && (
          <div className="mb-3">
            <button
              type="button"
              onClick={() => setIsArgsExpanded(!isArgsExpanded)}
              className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {isArgsExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              Parameters
            </button>
            {isArgsExpanded && (
              <pre className="mt-2 p-3 bg-muted rounded-md text-xs overflow-auto max-h-48">
                <code>{formatArgs(tool.args)}</code>
              </pre>
            )}
          </div>
        )}

        {/* Error Message */}
        {status === 'error' && errorMessage && (
          <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-md text-sm text-red-800 dark:text-red-400 mb-3">
            {errorMessage}
          </div>
        )}

        {/* Auto-approve countdown */}
        {status === 'approval_required' && autoApproveIn !== undefined && (
          <div className="text-xs text-muted-foreground mb-3">
            Auto-approving in {autoApproveIn} seconds...
          </div>
        )}
      </div>

      {/* Actions */}
      {status === 'approval_required' && (
        <div
          className="flex items-center justify-end gap-2 px-4 py-3 border-t bg-muted/30"
          {...pt.actions}
        >
          {onModify && (
            <button
              type="button"
              onClick={() => onModify(tool.args || {})}
              className="px-3 py-1.5 text-sm rounded-md border border-border hover:bg-muted transition-colors"
            >
              Modify
            </button>
          )}
          {onReject && (
            <button
              type="button"
              onClick={onReject}
              className="px-3 py-1.5 text-sm rounded-md bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors"
              {...pt.rejectButton}
            >
              Reject
            </button>
          )}
          {onApprove && (
            <button
              type="button"
              onClick={onApprove}
              className="px-3 py-1.5 text-sm rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors"
              {...pt.approveButton}
            >
              Approve
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default ToolApproval
