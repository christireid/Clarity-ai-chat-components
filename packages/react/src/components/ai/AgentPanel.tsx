'use client'

/**
 * AgentPanel - Unified Agent Execution View
 *
 * A pre-composed panel that displays agent execution state including
 * plan steps, thinking, tool executions, and approvals. Automatically
 * connects to AgentExecutionProvider when available.
 *
 * API patterns are consistent with ClarityChatProvider and ChatComposer:
 * - `connected` prop for auto-connection to context
 * - Slot-based composition for customization
 * - Consistent event naming (on*, emit)
 * - Shared animation constants
 *
 * @example
 * ```tsx
 * // Auto-connected to AgentExecutionProvider
 * <AgentPanel connected />
 *
 * // With customization
 * <AgentPanel
 *   variant="sidebar"
 *   showPlan
 *   showThinking
 *   showTools
 * >
 *   <AgentPanel.Header>Custom Header</AgentPanel.Header>
 * </AgentPanel>
 * ```
 */

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useReducedMotion } from 'framer-motion'
import { DURATION_SECONDS, EASING_FRAMER } from '../../animations/constants'
import {
  useAgentExecution,
  useIsAgentExecutionConnected,
  type PlanStep,
  type ToolCall,
  type ThinkingStep,
  type ExecutionStatus,
} from '../../providers/AgentExecutionProvider'

// ============================================================================
// Types (Consistent with other components)
// ============================================================================

/** Panel variant */
export type AgentPanelVariant = 'sidebar' | 'inline' | 'modal' | 'compact' | 'full'

/** Panel sections that can be shown/hidden */
export type AgentPanelSection =
  | 'header'
  | 'status'
  | 'plan'
  | 'thinking'
  | 'tools'
  | 'approvals'
  | 'timeline'
  | 'footer'

/** Panel context value - consistent with ChatComposer pattern */
export interface AgentPanelContextValue {
  variant: AgentPanelVariant
  sections: Set<AgentPanelSection>
  hasSection: (section: AgentPanelSection) => boolean
  connected: boolean
  collapsed: boolean
  toggleCollapsed: () => void
  slots: Map<AgentPanelSection, React.ReactNode>
  registerSlot: (section: AgentPanelSection, content: React.ReactNode) => void
  unregisterSlot: (section: AgentPanelSection) => void
}

/** Main component props - consistent with other components */
export interface AgentPanelProps {
  children?: React.ReactNode
  /** Panel variant */
  variant?: AgentPanelVariant
  /** Auto-connect to AgentExecutionProvider (consistent with connected pattern) */
  connected?: boolean
  /** Sections to show */
  sections?: AgentPanelSection[]
  /** Show plan steps */
  showPlan?: boolean
  /** Show thinking steps */
  showThinking?: boolean
  /** Show tool executions */
  showTools?: boolean
  /** Show approval cards */
  showApprovals?: boolean
  /** Show timeline */
  showTimeline?: boolean
  /** Initially collapsed */
  defaultCollapsed?: boolean
  /** Controlled collapsed state */
  collapsed?: boolean
  /** Collapse state change callback */
  onCollapsedChange?: (collapsed: boolean) => void
  /** Custom class name */
  className?: string
  /** Custom styles */
  style?: React.CSSProperties
  /** Title for the panel */
  title?: string
  /** Max height for scrollable content */
  maxHeight?: string | number
  /** Event handlers - consistent with provider pattern */
  onStepClick?: (step: PlanStep) => void
  onToolClick?: (tool: ToolCall) => void
  onApprove?: (tool: ToolCall) => void
  onReject?: (tool: ToolCall, reason?: string) => void
}

/** Slot props - consistent with ChatComposer */
export interface SlotProps {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

/** Plan section props */
export interface PlanSectionProps extends SlotProps {
  steps?: PlanStep[]
  currentStepIndex?: number
  onStepClick?: (step: PlanStep) => void
  showProgress?: boolean
}

/** Thinking section props */
export interface ThinkingSectionProps extends SlotProps {
  thoughts?: ThinkingStep[]
  currentThought?: ThinkingStep | null
  maxVisible?: number
  expandable?: boolean
}

/** Tools section props */
export interface ToolsSectionProps extends SlotProps {
  tools?: ToolCall[]
  showCompleted?: boolean
  showPending?: boolean
  onToolClick?: (tool: ToolCall) => void
}

/** Approvals section props */
export interface ApprovalsSectionProps extends SlotProps {
  pendingApprovals?: ToolCall[]
  onApprove?: (tool: ToolCall) => void
  onReject?: (tool: ToolCall, reason?: string) => void
}

// ============================================================================
// Context - Consistent with ChatComposer
// ============================================================================

const AgentPanelContext = React.createContext<AgentPanelContextValue | null>(null)

/**
 * Hook to access AgentPanel context
 */
export function useAgentPanel(): AgentPanelContextValue {
  const context = React.useContext(AgentPanelContext)
  if (!context) {
    throw new Error('useAgentPanel must be used within an AgentPanel')
  }
  return context
}

/**
 * Check if inside an AgentPanel
 */
export function useIsAgentPanelChild(): boolean {
  return React.useContext(AgentPanelContext) !== null
}

// ============================================================================
// Default Sections
// ============================================================================

const DEFAULT_SECTIONS: AgentPanelSection[] = [
  'header',
  'status',
  'plan',
  'thinking',
  'tools',
  'approvals',
]

// ============================================================================
// Status Badge Component
// ============================================================================

function StatusBadge({ status }: { status: ExecutionStatus }) {
  const statusConfig: Record<ExecutionStatus, { label: string; color: string }> = {
    idle: { label: 'Idle', color: 'gray' },
    planning: { label: 'Planning', color: 'blue' },
    waiting_approval: { label: 'Awaiting Approval', color: 'yellow' },
    executing: { label: 'Executing', color: 'green' },
    paused: { label: 'Paused', color: 'orange' },
    complete: { label: 'Complete', color: 'green' },
    error: { label: 'Error', color: 'red' },
    cancelled: { label: 'Cancelled', color: 'gray' },
  }

  const config = statusConfig[status]

  return (
    <span className={`agent-panel-status-badge status-${config.color}`} data-status={status}>
      <span className="status-indicator" />
      {config.label}
    </span>
  )
}

// ============================================================================
// Plan Step Component
// ============================================================================

function PlanStepItem({
  step,
  isActive,
  onClick,
}: {
  step: PlanStep
  isActive: boolean
  onClick?: (step: PlanStep) => void
}) {
  const prefersReducedMotion = useReducedMotion()

  const statusIcons: Record<PlanStep['status'], string> = {
    pending: '○',
    active: '●',
    complete: '✓',
    skipped: '–',
    failed: '✗',
  }

  return (
    <motion.div
      className={`agent-panel-plan-step status-${step.status} ${isActive ? 'active' : ''}`}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: prefersReducedMotion ? 0 : DURATION_SECONDS.fast,
        ease: EASING_FRAMER.out,
      }}
      onClick={() => onClick?.(step)}
      role="listitem"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.(step)}
    >
      <span className={`step-status-icon status-${step.status}`}>
        {statusIcons[step.status]}
      </span>
      <div className="step-content">
        <span className="step-title">{step.title}</span>
        {step.description && <span className="step-description">{step.description}</span>}
      </div>
      {step.actualDuration && (
        <span className="step-duration">{formatDuration(step.actualDuration)}</span>
      )}
    </motion.div>
  )
}

// ============================================================================
// Thinking Step Component
// ============================================================================

function ThinkingStepItem({ thought }: { thought: ThinkingStep }) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      className={`agent-panel-thinking-step status-${thought.status}`}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: prefersReducedMotion ? 0 : DURATION_SECONDS.fast,
        ease: EASING_FRAMER.out,
      }}
    >
      {thought.status === 'active' && <span className="thinking-indicator">💭</span>}
      <span className="thinking-content">{thought.content}</span>
    </motion.div>
  )
}

// ============================================================================
// Tool Card Component
// ============================================================================

function ToolCardItem({
  tool,
  onClick,
}: {
  tool: ToolCall
  onClick?: (tool: ToolCall) => void
}) {
  const prefersReducedMotion = useReducedMotion()

  const statusIcons: Record<ToolCall['status'], string> = {
    pending: '⏳',
    waiting_approval: '⚠️',
    approved: '✓',
    rejected: '✗',
    executing: '⚙️',
    complete: '✓',
    error: '❌',
  }

  return (
    <motion.div
      className={`agent-panel-tool-card status-${tool.status}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: prefersReducedMotion ? 0 : DURATION_SECONDS.fast,
        ease: EASING_FRAMER.out,
      }}
      onClick={() => onClick?.(tool)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.(tool)}
    >
      <div className="tool-header">
        <span className="tool-status-icon">{statusIcons[tool.status]}</span>
        <span className="tool-name">{tool.name}</span>
      </div>
      {tool.description && <p className="tool-description">{tool.description}</p>}
      {tool.duration && <span className="tool-duration">{formatDuration(tool.duration)}</span>}
    </motion.div>
  )
}

// ============================================================================
// Approval Card Component
// ============================================================================

function ApprovalCardItem({
  tool,
  onApprove,
  onReject,
}: {
  tool: ToolCall
  onApprove?: (tool: ToolCall) => void
  onReject?: (tool: ToolCall, reason?: string) => void
}) {
  const prefersReducedMotion = useReducedMotion()
  const [rejectReason, setRejectReason] = React.useState('')
  const [showRejectInput, setShowRejectInput] = React.useState(false)

  const handleReject = () => {
    if (showRejectInput) {
      onReject?.(tool, rejectReason)
      setShowRejectInput(false)
      setRejectReason('')
    } else {
      setShowRejectInput(true)
    }
  }

  return (
    <motion.div
      className="agent-panel-approval-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{
        duration: prefersReducedMotion ? 0 : DURATION_SECONDS.normal,
        ease: EASING_FRAMER.easeOut,
      }}
    >
      <div className="approval-header">
        <span className="approval-icon">⚠️</span>
        <span className="approval-title">Approval Required</span>
      </div>
      <div className="approval-content">
        <p className="approval-tool-name">{tool.name}</p>
        {tool.approvalReason && <p className="approval-reason">{tool.approvalReason}</p>}
        <div className="approval-input-preview">
          <pre>{JSON.stringify(tool.input, null, 2)}</pre>
        </div>
      </div>
      <AnimatePresence>
        {showRejectInput && (
          <motion.div
            className="approval-reject-input"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <input
              type="text"
              placeholder="Rejection reason (optional)"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="reject-reason-input"
            />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="approval-actions">
        <button
          className="approval-btn approve"
          onClick={() => onApprove?.(tool)}
          aria-label="Approve tool execution"
        >
          ✓ Approve
        </button>
        <button
          className="approval-btn reject"
          onClick={handleReject}
          aria-label={showRejectInput ? 'Confirm rejection' : 'Reject tool execution'}
        >
          ✗ {showRejectInput ? 'Confirm' : 'Reject'}
        </button>
        {showRejectInput && (
          <button
            className="approval-btn cancel"
            onClick={() => setShowRejectInput(false)}
            aria-label="Cancel rejection"
          >
            Cancel
          </button>
        )}
      </div>
    </motion.div>
  )
}

// ============================================================================
// Section Components
// ============================================================================

/**
 * Header slot - consistent with ChatComposer.Header
 */
function Header({ children, className, style }: SlotProps) {
  const { registerSlot, unregisterSlot } = useAgentPanel()

  React.useEffect(() => {
    registerSlot(
      'header',
      <div className={`agent-panel-slot-header ${className || ''}`} style={style}>
        {children}
      </div>
    )
    return () => unregisterSlot('header')
  }, [children, className, style, registerSlot, unregisterSlot])

  return null
}

/**
 * Plan section
 */
function Plan({
  children,
  className,
  style,
  steps,
  currentStepIndex = -1,
  onStepClick,
  showProgress = true,
}: PlanSectionProps) {
  const { registerSlot, unregisterSlot, connected } = useAgentPanel()
  const execution = connected ? useAgentExecution() : null

  const displaySteps = steps || execution?.plan || []
  const activeIndex = currentStepIndex >= 0 ? currentStepIndex : execution?.currentStepIndex ?? -1
  const progress = execution?.progress ?? (displaySteps.length > 0
    ? Math.round((displaySteps.filter(s => s.status === 'complete').length / displaySteps.length) * 100)
    : 0)

  React.useEffect(() => {
    if (!displaySteps.length && !children) return

    registerSlot(
      'plan',
      <div className={`agent-panel-slot-plan ${className || ''}`} style={style}>
        {children || (
          <>
            {showProgress && displaySteps.length > 0 && (
              <div className="plan-progress">
                <div className="progress-bar" style={{ width: `${progress}%` }} />
                <span className="progress-text">{progress}%</span>
              </div>
            )}
            <div className="plan-steps" role="list">
              {displaySteps.map((step, index) => (
                <PlanStepItem
                  key={step.id}
                  step={step}
                  isActive={index === activeIndex}
                  onClick={onStepClick}
                />
              ))}
            </div>
          </>
        )}
      </div>
    )
    return () => unregisterSlot('plan')
  }, [children, className, style, displaySteps, activeIndex, progress, showProgress, onStepClick, registerSlot, unregisterSlot])

  return null
}

/**
 * Thinking section
 */
function Thinking({
  children,
  className,
  style,
  thoughts,
  currentThought,
  maxVisible = 5,
  expandable = true,
}: ThinkingSectionProps) {
  const { registerSlot, unregisterSlot, connected } = useAgentPanel()
  const execution = connected ? useAgentExecution() : null
  const [expanded, setExpanded] = React.useState(false)

  const displayThoughts = thoughts || execution?.thoughts || []
  const activeThought = currentThought ?? execution?.currentThought ?? null
  const visibleThoughts = expanded
    ? displayThoughts
    : displayThoughts.slice(-maxVisible)

  React.useEffect(() => {
    if (!displayThoughts.length && !children) return

    registerSlot(
      'thinking',
      <div className={`agent-panel-slot-thinking ${className || ''}`} style={style}>
        {children || (
          <>
            {expandable && displayThoughts.length > maxVisible && (
              <button
                className="thinking-expand-btn"
                onClick={() => setExpanded(!expanded)}
                aria-expanded={expanded}
              >
                {expanded ? '▼ Show less' : `▲ Show all (${displayThoughts.length})`}
              </button>
            )}
            <div className="thinking-steps">
              {visibleThoughts.map((thought) => (
                <ThinkingStepItem key={thought.id} thought={thought} />
              ))}
              {activeThought && !visibleThoughts.includes(activeThought) && (
                <ThinkingStepItem thought={activeThought} />
              )}
            </div>
          </>
        )}
      </div>
    )
    return () => unregisterSlot('thinking')
  }, [children, className, style, displayThoughts, activeThought, visibleThoughts, expanded, expandable, maxVisible, registerSlot, unregisterSlot])

  return null
}

/**
 * Tools section
 */
function Tools({
  children,
  className,
  style,
  tools,
  showCompleted = true,
  showPending = true,
  onToolClick,
}: ToolsSectionProps) {
  const { registerSlot, unregisterSlot, connected } = useAgentPanel()
  const execution = connected ? useAgentExecution() : null

  const displayTools = tools || execution?.toolCalls || []
  const filteredTools = displayTools.filter((tool) => {
    if (!showCompleted && tool.status === 'complete') return false
    if (!showPending && tool.status === 'pending') return false
    return true
  })

  React.useEffect(() => {
    if (!filteredTools.length && !children) return

    registerSlot(
      'tools',
      <div className={`agent-panel-slot-tools ${className || ''}`} style={style}>
        {children || (
          <div className="tools-list">
            {filteredTools.map((tool) => (
              <ToolCardItem key={tool.id} tool={tool} onClick={onToolClick} />
            ))}
          </div>
        )}
      </div>
    )
    return () => unregisterSlot('tools')
  }, [children, className, style, filteredTools, onToolClick, registerSlot, unregisterSlot])

  return null
}

/**
 * Approvals section
 */
function Approvals({
  children,
  className,
  style,
  pendingApprovals,
  onApprove,
  onReject,
}: ApprovalsSectionProps) {
  const { registerSlot, unregisterSlot, connected } = useAgentPanel()
  const execution = connected ? useAgentExecution() : null

  const displayApprovals = pendingApprovals || execution?.pendingApprovals || []
  const handleApprove = onApprove || ((tool) => execution?.approveTool(tool.id))
  const handleReject = onReject || ((tool, reason) => execution?.rejectTool(tool.id, reason))

  React.useEffect(() => {
    if (!displayApprovals.length && !children) return

    registerSlot(
      'approvals',
      <div className={`agent-panel-slot-approvals ${className || ''}`} style={style}>
        {children || (
          <AnimatePresence mode="popLayout">
            {displayApprovals.map((tool) => (
              <ApprovalCardItem
                key={tool.id}
                tool={tool}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))}
          </AnimatePresence>
        )}
      </div>
    )
    return () => unregisterSlot('approvals')
  }, [children, className, style, displayApprovals, handleApprove, handleReject, registerSlot, unregisterSlot])

  return null
}

/**
 * Footer slot - consistent with ChatComposer.Footer
 */
function Footer({ children, className, style }: SlotProps) {
  const { registerSlot, unregisterSlot } = useAgentPanel()

  React.useEffect(() => {
    registerSlot(
      'footer',
      <div className={`agent-panel-slot-footer ${className || ''}`} style={style}>
        {children}
      </div>
    )
    return () => unregisterSlot('footer')
  }, [children, className, style, registerSlot, unregisterSlot])

  return null
}

// ============================================================================
// Utility Functions
// ============================================================================

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
  return `${(ms / 60000).toFixed(1)}m`
}

// ============================================================================
// Main Component
// ============================================================================

/**
 * AgentPanel - Unified agent execution view
 */
export function AgentPanel({
  children,
  variant = 'sidebar',
  connected = true,
  sections = DEFAULT_SECTIONS,
  showPlan = true,
  showThinking = true,
  showTools = true,
  showApprovals = true,
  showTimeline = false,
  defaultCollapsed = false,
  collapsed: controlledCollapsed,
  onCollapsedChange,
  className,
  style,
  title = 'Agent Execution',
  maxHeight,
  onStepClick,
  onToolClick,
  onApprove,
  onReject,
}: AgentPanelProps) {
  const prefersReducedMotion = useReducedMotion()
  const isConnected = useIsAgentExecutionConnected()
  const execution = connected && isConnected ? useAgentExecution() : null

  const [slots, setSlots] = React.useState<Map<AgentPanelSection, React.ReactNode>>(new Map())
  const [internalCollapsed, setInternalCollapsed] = React.useState(defaultCollapsed)

  const actualCollapsed = controlledCollapsed ?? internalCollapsed
  const setCollapsed = React.useCallback(
    (collapsed: boolean) => {
      setInternalCollapsed(collapsed)
      onCollapsedChange?.(collapsed)
    },
    [onCollapsedChange]
  )

  const toggleCollapsed = React.useCallback(() => {
    setCollapsed(!actualCollapsed)
  }, [actualCollapsed, setCollapsed])

  // Build sections set
  const sectionSet = React.useMemo(() => {
    const set = new Set(sections)
    if (showPlan) set.add('plan')
    if (showThinking) set.add('thinking')
    if (showTools) set.add('tools')
    if (showApprovals) set.add('approvals')
    if (showTimeline) set.add('timeline')
    return set
  }, [sections, showPlan, showThinking, showTools, showApprovals, showTimeline])

  const hasSection = React.useCallback(
    (section: AgentPanelSection) => sectionSet.has(section),
    [sectionSet]
  )

  const registerSlot = React.useCallback(
    (section: AgentPanelSection, content: React.ReactNode) => {
      setSlots((prev) => {
        const next = new Map(prev)
        next.set(section, content)
        return next
      })
    },
    []
  )

  const unregisterSlot = React.useCallback((section: AgentPanelSection) => {
    setSlots((prev) => {
      const next = new Map(prev)
      next.delete(section)
      return next
    })
  }, [])

  const contextValue: AgentPanelContextValue = React.useMemo(
    () => ({
      variant,
      sections: sectionSet,
      hasSection,
      connected: connected && isConnected,
      collapsed: actualCollapsed,
      toggleCollapsed,
      slots,
      registerSlot,
      unregisterSlot,
    }),
    [variant, sectionSet, hasSection, connected, isConnected, actualCollapsed, toggleCollapsed, slots, registerSlot, unregisterSlot]
  )

  // Animation variants
  const panelVariants = {
    expanded: {
      width: variant === 'sidebar' ? '320px' : '100%',
      opacity: 1,
      transition: {
        duration: prefersReducedMotion ? 0 : DURATION_SECONDS.normal,
        ease: EASING_FRAMER.easeOut,
      },
    },
    collapsed: {
      width: variant === 'sidebar' ? '48px' : '100%',
      opacity: 1,
      transition: {
        duration: prefersReducedMotion ? 0 : DURATION_SECONDS.fast,
        ease: EASING_FRAMER.easeIn,
      },
    },
  }

  const contentVariants = {
    visible: {
      opacity: 1,
      transition: {
        duration: prefersReducedMotion ? 0 : DURATION_SECONDS.fast,
        ease: EASING_FRAMER.easeOut,
      },
    },
    hidden: {
      opacity: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : DURATION_SECONDS.fast,
        ease: EASING_FRAMER.easeIn,
      },
    },
  }

  return (
    <AgentPanelContext.Provider value={contextValue}>
      <motion.div
        className={`agent-panel variant-${variant} ${actualCollapsed ? 'collapsed' : ''} ${className || ''}`}
        style={{ maxHeight, ...style }}
        variants={panelVariants}
        animate={actualCollapsed ? 'collapsed' : 'expanded'}
        data-variant={variant}
        data-collapsed={actualCollapsed}
        data-connected={connected && isConnected}
      >
        {/* Header */}
        <div className="agent-panel-header">
          <button
            className="collapse-btn"
            onClick={toggleCollapsed}
            aria-label={actualCollapsed ? 'Expand panel' : 'Collapse panel'}
            aria-expanded={!actualCollapsed}
          >
            {actualCollapsed ? '▶' : '◀'}
          </button>
          {!actualCollapsed && (
            <>
              <h3 className="panel-title">{title}</h3>
              {execution && <StatusBadge status={execution.status} />}
            </>
          )}
        </div>

        {/* Content */}
        <AnimatePresence>
          {!actualCollapsed && (
            <motion.div
              className="agent-panel-content"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {/* Render children to register slots */}
              {children}

              {/* Custom header slot */}
              {slots.get('header')}

              {/* Status section */}
              {hasSection('status') && execution && (
                <div className="agent-panel-section section-status">
                  <div className="status-row">
                    <span className="status-label">Progress</span>
                    <span className="status-value">{execution.progress}%</span>
                  </div>
                  {execution.time.startedAt && (
                    <div className="status-row">
                      <span className="status-label">Started</span>
                      <span className="status-value">
                        {execution.time.startedAt.toLocaleTimeString()}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Plan section */}
              {hasSection('plan') && (slots.get('plan') || (execution?.plan.length ?? 0) > 0) && (
                <div className="agent-panel-section section-plan">
                  <h4 className="section-title">Plan</h4>
                  {slots.get('plan') || (
                    <div className="plan-steps" role="list">
                      {execution?.plan.map((step, index) => (
                        <PlanStepItem
                          key={step.id}
                          step={step}
                          isActive={index === execution.currentStepIndex}
                          onClick={onStepClick}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Thinking section */}
              {hasSection('thinking') && (slots.get('thinking') || (execution?.thoughts.length ?? 0) > 0) && (
                <div className="agent-panel-section section-thinking">
                  <h4 className="section-title">Thinking</h4>
                  {slots.get('thinking') || (
                    <div className="thinking-steps">
                      {execution?.thoughts.slice(-5).map((thought) => (
                        <ThinkingStepItem key={thought.id} thought={thought} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tools section */}
              {hasSection('tools') && (slots.get('tools') || (execution?.toolCalls.length ?? 0) > 0) && (
                <div className="agent-panel-section section-tools">
                  <h4 className="section-title">Tools</h4>
                  {slots.get('tools') || (
                    <div className="tools-list">
                      {execution?.toolCalls.map((tool) => (
                        <ToolCardItem key={tool.id} tool={tool} onClick={onToolClick} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Approvals section */}
              {hasSection('approvals') && (slots.get('approvals') || (execution?.pendingApprovals.length ?? 0) > 0) && (
                <div className="agent-panel-section section-approvals">
                  <h4 className="section-title">Pending Approvals</h4>
                  {slots.get('approvals') || (
                    <AnimatePresence mode="popLayout">
                      {execution?.pendingApprovals.map((tool) => (
                        <ApprovalCardItem
                          key={tool.id}
                          tool={tool}
                          onApprove={onApprove || ((t) => execution.approveTool(t.id))}
                          onReject={onReject || ((t, r) => execution.rejectTool(t.id, r))}
                        />
                      ))}
                    </AnimatePresence>
                  )}
                </div>
              )}

              {/* Custom footer slot */}
              {slots.get('footer')}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AgentPanelContext.Provider>
  )
}

// Attach section components
AgentPanel.Header = Header
AgentPanel.Plan = Plan
AgentPanel.Thinking = Thinking
AgentPanel.Tools = Tools
AgentPanel.Approvals = Approvals
AgentPanel.Footer = Footer

// ============================================================================
// Connected Hook - Consistent with useConnected* pattern
// ============================================================================

export interface ConnectedAgentPanelProps {
  status: ExecutionStatus
  progress: number
  plan: PlanStep[]
  currentStep: PlanStep | null
  thoughts: ThinkingStep[]
  currentThought: ThinkingStep | null
  tools: ToolCall[]
  pendingApprovals: ToolCall[]
  onApprove: (toolId: string) => void
  onReject: (toolId: string, reason?: string) => void
}

/**
 * Get connected props for AgentPanel
 */
export function useConnectedAgentPanel(): ConnectedAgentPanelProps | null {
  const isConnected = useIsAgentExecutionConnected()
  if (!isConnected) return null

  const execution = useAgentExecution()

  return {
    status: execution.status,
    progress: execution.progress,
    plan: execution.plan,
    currentStep: execution.getCurrentStep(),
    thoughts: execution.thoughts,
    currentThought: execution.currentThought,
    tools: execution.toolCalls,
    pendingApprovals: execution.pendingApprovals,
    onApprove: execution.approveTool,
    onReject: execution.rejectTool,
  }
}

export default AgentPanel
