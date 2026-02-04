'use client'

/**
 * AgentExecutionProvider - Unified Agent Execution Context
 *
 * Manages all agent execution state including planning, tool calls,
 * thinking steps, approvals, and execution status. Provides a single
 * source of truth for agent-related components.
 *
 * Features:
 * - Execution lifecycle management (idle, planning, executing, complete)
 * - Plan step tracking with completion status
 * - Tool call management with approval workflow
 * - Thinking/reasoning step visualization
 * - Time tracking and estimation
 * - Event emission for external integration
 *
 * @example
 * ```tsx
 * <AgentExecutionProvider onToolApproval={(tool) => handleApproval(tool)}>
 *   <AgentPanel />
 *   <ChatInterface />
 * </AgentExecutionProvider>
 * ```
 */

import * as React from 'react'

// ============================================================================
// Types
// ============================================================================

/** Execution status */
export type ExecutionStatus =
  | 'idle'
  | 'planning'
  | 'waiting_approval'
  | 'executing'
  | 'paused'
  | 'complete'
  | 'error'
  | 'cancelled'

/** Plan step status */
export type PlanStepStatus = 'pending' | 'active' | 'complete' | 'skipped' | 'failed'

/** Tool call status */
export type ToolCallStatus =
  | 'pending'
  | 'waiting_approval'
  | 'approved'
  | 'rejected'
  | 'executing'
  | 'complete'
  | 'error'

/** Thinking step status */
export type ThinkingStepStatus = 'pending' | 'active' | 'complete'

/** Plan step definition */
export interface PlanStep {
  id: string
  title: string
  description?: string
  status: PlanStepStatus
  order: number
  toolIds?: string[]
  estimatedDuration?: number
  actualDuration?: number
  startedAt?: Date
  completedAt?: Date
  error?: string
  metadata?: Record<string, unknown>
}

/** Tool call definition */
export interface ToolCall {
  id: string
  name: string
  description?: string
  input: Record<string, unknown>
  output?: unknown
  status: ToolCallStatus
  planStepId?: string
  requiresApproval: boolean
  approvalReason?: string
  approvedBy?: string
  rejectionReason?: string
  startedAt?: Date
  completedAt?: Date
  duration?: number
  error?: string
  metadata?: Record<string, unknown>
}

/** Thinking step definition */
export interface ThinkingStep {
  id: string
  content: string
  status: ThinkingStepStatus
  timestamp: Date
  duration?: number
  metadata?: Record<string, unknown>
}

/** Execution error */
export interface ExecutionError {
  code: string
  message: string
  details?: unknown
  recoverable: boolean
  timestamp: Date
}

/** Time tracking */
export interface TimeTracking {
  startedAt: Date | null
  estimatedCompletion: Date | null
  pausedAt: Date | null
  totalPausedDuration: number
  completedAt: Date | null
}

/** Full execution state */
export interface AgentExecutionState {
  /** Unique execution ID */
  executionId: string | null
  /** Current status */
  status: ExecutionStatus
  /** Execution plan */
  plan: PlanStep[]
  /** Current step index */
  currentStepIndex: number
  /** Completed steps */
  completedSteps: PlanStep[]
  /** All tool calls */
  toolCalls: ToolCall[]
  /** Tools waiting for approval */
  pendingApprovals: ToolCall[]
  /** Active tool calls */
  activeTools: ToolCall[]
  /** Completed tool calls */
  completedTools: ToolCall[]
  /** Thinking/reasoning steps */
  thoughts: ThinkingStep[]
  /** Current active thought */
  currentThought: ThinkingStep | null
  /** Error if any */
  error: ExecutionError | null
  /** Time tracking */
  time: TimeTracking
  /** Progress percentage (0-100) */
  progress: number
  /** Custom metadata */
  metadata: Record<string, unknown>
}

/** Agent execution events */
export type AgentExecutionEventType =
  | 'execution:started'
  | 'execution:completed'
  | 'execution:error'
  | 'execution:cancelled'
  | 'execution:paused'
  | 'execution:resumed'
  | 'plan:created'
  | 'plan:step:started'
  | 'plan:step:completed'
  | 'plan:step:failed'
  | 'tool:started'
  | 'tool:completed'
  | 'tool:error'
  | 'tool:approval:requested'
  | 'tool:approved'
  | 'tool:rejected'
  | 'thinking:started'
  | 'thinking:step'
  | 'thinking:completed'

export interface AgentExecutionEvent {
  type: AgentExecutionEventType
  payload?: unknown
  timestamp: Date
}

/** Context value */
export interface AgentExecutionContextValue extends AgentExecutionState {
  // Actions
  /** Start a new execution */
  startExecution: (executionId?: string, metadata?: Record<string, unknown>) => void
  /** Cancel execution */
  cancelExecution: (reason?: string) => void
  /** Pause execution */
  pauseExecution: () => void
  /** Resume execution */
  resumeExecution: () => void
  /** Complete execution */
  completeExecution: (result?: unknown) => void
  /** Set error */
  setError: (error: ExecutionError) => void
  /** Clear error */
  clearError: () => void

  // Plan management
  /** Set execution plan */
  setPlan: (steps: Omit<PlanStep, 'status' | 'order'>[]) => void
  /** Start a plan step */
  startStep: (stepId: string) => void
  /** Complete a plan step */
  completeStep: (stepId: string, result?: unknown) => void
  /** Fail a plan step */
  failStep: (stepId: string, error: string) => void
  /** Skip a plan step */
  skipStep: (stepId: string, reason?: string) => void

  // Tool management
  /** Add a tool call */
  addToolCall: (tool: Omit<ToolCall, 'id' | 'status' | 'startedAt'>) => string
  /** Start a tool execution */
  startTool: (toolId: string) => void
  /** Complete a tool execution */
  completeTool: (toolId: string, output: unknown) => void
  /** Fail a tool execution */
  failTool: (toolId: string, error: string) => void
  /** Request tool approval */
  requestApproval: (toolId: string, reason?: string) => void
  /** Approve a tool */
  approveTool: (toolId: string, approvedBy?: string) => void
  /** Reject a tool */
  rejectTool: (toolId: string, reason?: string) => void

  // Thinking management
  /** Start thinking */
  startThinking: () => void
  /** Add thinking step */
  addThought: (content: string, metadata?: Record<string, unknown>) => void
  /** Complete thinking */
  completeThinking: () => void

  // Event system
  /** Emit an event */
  emit: (type: AgentExecutionEventType, payload?: unknown) => void
  /** Subscribe to events */
  on: (type: AgentExecutionEventType, handler: (event: AgentExecutionEvent) => void) => () => void
  /** Subscribe to all events */
  onAny: (handler: (event: AgentExecutionEvent) => void) => () => void

  // Utilities
  /** Reset to initial state */
  reset: () => void
  /** Get current step */
  getCurrentStep: () => PlanStep | null
  /** Check if can proceed */
  canProceed: () => boolean
  /** Get execution summary */
  getSummary: () => ExecutionSummary
}

export interface ExecutionSummary {
  executionId: string | null
  status: ExecutionStatus
  totalSteps: number
  completedSteps: number
  totalTools: number
  successfulTools: number
  failedTools: number
  totalThoughts: number
  duration: number
  progress: number
}

/** Provider props */
export interface AgentExecutionProviderProps {
  children: React.ReactNode
  /** Initial state */
  initialState?: Partial<AgentExecutionState>
  /** Called when tool needs approval */
  onToolApproval?: (tool: ToolCall) => void
  /** Called on status change */
  onStatusChange?: (status: ExecutionStatus, prevStatus: ExecutionStatus) => void
  /** Called on any event */
  onEvent?: (event: AgentExecutionEvent) => void
  /** Auto-approve tools that don't require approval */
  autoApproveSafe?: boolean
}

// ============================================================================
// Initial State
// ============================================================================

const initialState: AgentExecutionState = {
  executionId: null,
  status: 'idle',
  plan: [],
  currentStepIndex: -1,
  completedSteps: [],
  toolCalls: [],
  pendingApprovals: [],
  activeTools: [],
  completedTools: [],
  thoughts: [],
  currentThought: null,
  error: null,
  time: {
    startedAt: null,
    estimatedCompletion: null,
    pausedAt: null,
    totalPausedDuration: 0,
    completedAt: null,
  },
  progress: 0,
  metadata: {},
}

// ============================================================================
// Context
// ============================================================================

const AgentExecutionContext = React.createContext<AgentExecutionContextValue | null>(null)

// ============================================================================
// Hook
// ============================================================================

/**
 * Access agent execution context
 */
export function useAgentExecution(): AgentExecutionContextValue {
  const context = React.useContext(AgentExecutionContext)
  if (!context) {
    throw new Error('useAgentExecution must be used within AgentExecutionProvider')
  }
  return context
}

/**
 * Check if inside AgentExecutionProvider
 */
export function useIsAgentExecutionConnected(): boolean {
  return React.useContext(AgentExecutionContext) !== null
}

// ============================================================================
// Selectors
// ============================================================================

/**
 * Select only plan-related state
 */
export function useAgentPlan() {
  const { plan, currentStepIndex, completedSteps, getCurrentStep } = useAgentExecution()
  return { plan, currentStepIndex, completedSteps, currentStep: getCurrentStep() }
}

/**
 * Select only tool-related state
 */
export function useAgentTools() {
  const {
    toolCalls,
    pendingApprovals,
    activeTools,
    completedTools,
    approveTool,
    rejectTool,
  } = useAgentExecution()
  return { toolCalls, pendingApprovals, activeTools, completedTools, approveTool, rejectTool }
}

/**
 * Select only thinking-related state
 */
export function useAgentThinking() {
  const { thoughts, currentThought, startThinking, addThought, completeThinking } =
    useAgentExecution()
  return { thoughts, currentThought, startThinking, addThought, completeThinking }
}

/**
 * Select only status-related state
 */
export function useAgentStatus() {
  const { status, progress, error, time, canProceed } = useAgentExecution()
  return { status, progress, error, time, canProceed: canProceed() }
}

// ============================================================================
// Provider
// ============================================================================

/**
 * AgentExecutionProvider - Provides unified agent execution context
 */
export function AgentExecutionProvider({
  children,
  initialState: initialStateProp,
  onToolApproval,
  onStatusChange,
  onEvent,
  autoApproveSafe = true,
}: AgentExecutionProviderProps) {
  const [state, setState] = React.useState<AgentExecutionState>(() => ({
    ...initialState,
    ...initialStateProp,
  }))

  const eventHandlersRef = React.useRef<Map<string, Set<(event: AgentExecutionEvent) => void>>>(
    new Map()
  )
  const anyEventHandlersRef = React.useRef<Set<(event: AgentExecutionEvent) => void>>(new Set())
  const prevStatusRef = React.useRef<ExecutionStatus>(state.status)

  // Generate unique IDs
  const generateId = React.useCallback(() => {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  }, [])

  // Calculate progress
  const calculateProgress = React.useCallback((s: AgentExecutionState): number => {
    if (s.plan.length === 0) return 0
    const completed = s.completedSteps.length
    return Math.round((completed / s.plan.length) * 100)
  }, [])

  // Emit event
  const emit = React.useCallback(
    (type: AgentExecutionEventType, payload?: unknown) => {
      const event: AgentExecutionEvent = {
        type,
        payload,
        timestamp: new Date(),
      }

      // Call type-specific handlers
      const handlers = eventHandlersRef.current.get(type)
      if (handlers) {
        handlers.forEach((handler) => handler(event))
      }

      // Call any-event handlers
      anyEventHandlersRef.current.forEach((handler) => handler(event))

      // Call external handler
      onEvent?.(event)
    },
    [onEvent]
  )

  // Subscribe to events
  const on = React.useCallback(
    (type: AgentExecutionEventType, handler: (event: AgentExecutionEvent) => void) => {
      if (!eventHandlersRef.current.has(type)) {
        eventHandlersRef.current.set(type, new Set())
      }
      eventHandlersRef.current.get(type)!.add(handler)

      return () => {
        eventHandlersRef.current.get(type)?.delete(handler)
      }
    },
    []
  )

  const onAny = React.useCallback((handler: (event: AgentExecutionEvent) => void) => {
    anyEventHandlersRef.current.add(handler)
    return () => {
      anyEventHandlersRef.current.delete(handler)
    }
  }, [])

  // Status change detection
  React.useEffect(() => {
    if (state.status !== prevStatusRef.current) {
      onStatusChange?.(state.status, prevStatusRef.current)
      prevStatusRef.current = state.status
    }
  }, [state.status, onStatusChange])

  // Execution actions
  const startExecution = React.useCallback(
    (executionId?: string, metadata?: Record<string, unknown>) => {
      const id = executionId || generateId()
      setState((prev) => ({
        ...prev,
        executionId: id,
        status: 'planning',
        time: { ...prev.time, startedAt: new Date() },
        metadata: { ...prev.metadata, ...metadata },
      }))
      emit('execution:started', { executionId: id })
    },
    [generateId, emit]
  )

  const cancelExecution = React.useCallback(
    (reason?: string) => {
      setState((prev) => ({
        ...prev,
        status: 'cancelled',
        time: { ...prev.time, completedAt: new Date() },
      }))
      emit('execution:cancelled', { reason })
    },
    [emit]
  )

  const pauseExecution = React.useCallback(() => {
    setState((prev) => ({
      ...prev,
      status: 'paused',
      time: { ...prev.time, pausedAt: new Date() },
    }))
    emit('execution:paused')
  }, [emit])

  const resumeExecution = React.useCallback(() => {
    setState((prev) => {
      const pausedDuration = prev.time.pausedAt
        ? Date.now() - prev.time.pausedAt.getTime()
        : 0
      return {
        ...prev,
        status: 'executing',
        time: {
          ...prev.time,
          pausedAt: null,
          totalPausedDuration: prev.time.totalPausedDuration + pausedDuration,
        },
      }
    })
    emit('execution:resumed')
  }, [emit])

  const completeExecution = React.useCallback(
    (result?: unknown) => {
      setState((prev) => ({
        ...prev,
        status: 'complete',
        progress: 100,
        time: { ...prev.time, completedAt: new Date() },
        metadata: { ...prev.metadata, result },
      }))
      emit('execution:completed', { result })
    },
    [emit]
  )

  const setError = React.useCallback(
    (error: ExecutionError) => {
      setState((prev) => ({ ...prev, status: 'error', error }))
      emit('execution:error', { error })
    },
    [emit]
  )

  const clearError = React.useCallback(() => {
    setState((prev) => ({ ...prev, error: null }))
  }, [])

  // Plan management
  const setPlan = React.useCallback(
    (steps: Omit<PlanStep, 'status' | 'order'>[]) => {
      const plan: PlanStep[] = steps.map((step, index) => ({
        ...step,
        status: 'pending' as const,
        order: index,
      }))
      setState((prev) => ({
        ...prev,
        plan,
        currentStepIndex: -1,
        completedSteps: [],
      }))
      emit('plan:created', { plan })
    },
    [emit]
  )

  const startStep = React.useCallback(
    (stepId: string) => {
      setState((prev) => {
        const stepIndex = prev.plan.findIndex((s) => s.id === stepId)
        if (stepIndex === -1) return prev

        const plan = [...prev.plan]
        plan[stepIndex] = {
          ...plan[stepIndex],
          status: 'active',
          startedAt: new Date(),
        }

        return {
          ...prev,
          plan,
          currentStepIndex: stepIndex,
          status: 'executing',
        }
      })
      emit('plan:step:started', { stepId })
    },
    [emit]
  )

  const completeStep = React.useCallback(
    (stepId: string, result?: unknown) => {
      setState((prev) => {
        const stepIndex = prev.plan.findIndex((s) => s.id === stepId)
        if (stepIndex === -1) return prev

        const plan = [...prev.plan]
        const step = {
          ...plan[stepIndex],
          status: 'complete' as const,
          completedAt: new Date(),
          actualDuration: plan[stepIndex].startedAt
            ? Date.now() - plan[stepIndex].startedAt!.getTime()
            : undefined,
          metadata: { ...plan[stepIndex].metadata, result },
        }
        plan[stepIndex] = step

        const completedSteps = [...prev.completedSteps, step]
        const progress = calculateProgress({ ...prev, completedSteps })

        return {
          ...prev,
          plan,
          completedSteps,
          progress,
        }
      })
      emit('plan:step:completed', { stepId, result })
    },
    [calculateProgress, emit]
  )

  const failStep = React.useCallback(
    (stepId: string, error: string) => {
      setState((prev) => {
        const stepIndex = prev.plan.findIndex((s) => s.id === stepId)
        if (stepIndex === -1) return prev

        const plan = [...prev.plan]
        plan[stepIndex] = {
          ...plan[stepIndex],
          status: 'failed',
          error,
          completedAt: new Date(),
        }

        return { ...prev, plan }
      })
      emit('plan:step:failed', { stepId, error })
    },
    [emit]
  )

  const skipStep = React.useCallback(
    (stepId: string, reason?: string) => {
      setState((prev) => {
        const stepIndex = prev.plan.findIndex((s) => s.id === stepId)
        if (stepIndex === -1) return prev

        const plan = [...prev.plan]
        plan[stepIndex] = {
          ...plan[stepIndex],
          status: 'skipped',
          metadata: { ...plan[stepIndex].metadata, skipReason: reason },
        }

        return { ...prev, plan }
      })
    },
    []
  )

  // Tool management
  const addToolCall = React.useCallback(
    (tool: Omit<ToolCall, 'id' | 'status' | 'startedAt'>): string => {
      const id = generateId()
      const newTool: ToolCall = {
        ...tool,
        id,
        status: tool.requiresApproval ? 'pending' : 'pending',
        startedAt: new Date(),
      }

      setState((prev) => ({
        ...prev,
        toolCalls: [...prev.toolCalls, newTool],
      }))

      // Auto-request approval or auto-approve
      if (tool.requiresApproval) {
        setTimeout(() => requestApproval(id, tool.approvalReason), 0)
      } else if (autoApproveSafe) {
        setTimeout(() => approveTool(id), 0)
      }

      return id
    },
    [generateId, autoApproveSafe]
  )

  const startTool = React.useCallback(
    (toolId: string) => {
      setState((prev) => {
        const toolIndex = prev.toolCalls.findIndex((t) => t.id === toolId)
        if (toolIndex === -1) return prev

        const toolCalls = [...prev.toolCalls]
        const tool = { ...toolCalls[toolIndex], status: 'executing' as const }
        toolCalls[toolIndex] = tool

        return {
          ...prev,
          toolCalls,
          activeTools: [...prev.activeTools, tool],
        }
      })
      emit('tool:started', { toolId })
    },
    [emit]
  )

  const completeTool = React.useCallback(
    (toolId: string, output: unknown) => {
      setState((prev) => {
        const toolIndex = prev.toolCalls.findIndex((t) => t.id === toolId)
        if (toolIndex === -1) return prev

        const toolCalls = [...prev.toolCalls]
        const tool = {
          ...toolCalls[toolIndex],
          status: 'complete' as const,
          output,
          completedAt: new Date(),
          duration: toolCalls[toolIndex].startedAt
            ? Date.now() - toolCalls[toolIndex].startedAt!.getTime()
            : undefined,
        }
        toolCalls[toolIndex] = tool

        return {
          ...prev,
          toolCalls,
          activeTools: prev.activeTools.filter((t) => t.id !== toolId),
          completedTools: [...prev.completedTools, tool],
        }
      })
      emit('tool:completed', { toolId, output })
    },
    [emit]
  )

  const failTool = React.useCallback(
    (toolId: string, error: string) => {
      setState((prev) => {
        const toolIndex = prev.toolCalls.findIndex((t) => t.id === toolId)
        if (toolIndex === -1) return prev

        const toolCalls = [...prev.toolCalls]
        toolCalls[toolIndex] = {
          ...toolCalls[toolIndex],
          status: 'error',
          error,
          completedAt: new Date(),
        }

        return {
          ...prev,
          toolCalls,
          activeTools: prev.activeTools.filter((t) => t.id !== toolId),
        }
      })
      emit('tool:error', { toolId, error })
    },
    [emit]
  )

  const requestApproval = React.useCallback(
    (toolId: string, reason?: string) => {
      setState((prev) => {
        const toolIndex = prev.toolCalls.findIndex((t) => t.id === toolId)
        if (toolIndex === -1) return prev

        const toolCalls = [...prev.toolCalls]
        const tool = {
          ...toolCalls[toolIndex],
          status: 'waiting_approval' as const,
          approvalReason: reason,
        }
        toolCalls[toolIndex] = tool

        return {
          ...prev,
          toolCalls,
          pendingApprovals: [...prev.pendingApprovals, tool],
          status: 'waiting_approval',
        }
      })
      emit('tool:approval:requested', { toolId, reason })

      // Notify external handler
      const tool = state.toolCalls.find((t) => t.id === toolId)
      if (tool) {
        onToolApproval?.({ ...tool, status: 'waiting_approval' })
      }
    },
    [emit, state.toolCalls, onToolApproval]
  )

  const approveTool = React.useCallback(
    (toolId: string, approvedBy?: string) => {
      setState((prev) => {
        const toolIndex = prev.toolCalls.findIndex((t) => t.id === toolId)
        if (toolIndex === -1) return prev

        const toolCalls = [...prev.toolCalls]
        toolCalls[toolIndex] = {
          ...toolCalls[toolIndex],
          status: 'approved',
          approvedBy,
        }

        const pendingApprovals = prev.pendingApprovals.filter((t) => t.id !== toolId)
        const status =
          pendingApprovals.length > 0 ? 'waiting_approval' : 'executing'

        return {
          ...prev,
          toolCalls,
          pendingApprovals,
          status,
        }
      })
      emit('tool:approved', { toolId, approvedBy })

      // Auto-start the tool
      setTimeout(() => startTool(toolId), 0)
    },
    [emit, startTool]
  )

  const rejectTool = React.useCallback(
    (toolId: string, reason?: string) => {
      setState((prev) => {
        const toolIndex = prev.toolCalls.findIndex((t) => t.id === toolId)
        if (toolIndex === -1) return prev

        const toolCalls = [...prev.toolCalls]
        toolCalls[toolIndex] = {
          ...toolCalls[toolIndex],
          status: 'rejected',
          rejectionReason: reason,
        }

        const pendingApprovals = prev.pendingApprovals.filter((t) => t.id !== toolId)
        const status =
          pendingApprovals.length > 0 ? 'waiting_approval' : 'executing'

        return {
          ...prev,
          toolCalls,
          pendingApprovals,
          status,
        }
      })
      emit('tool:rejected', { toolId, reason })
    },
    [emit]
  )

  // Thinking management
  const startThinking = React.useCallback(() => {
    emit('thinking:started')
  }, [emit])

  const addThought = React.useCallback(
    (content: string, metadata?: Record<string, unknown>) => {
      const thought: ThinkingStep = {
        id: generateId(),
        content,
        status: 'active',
        timestamp: new Date(),
        metadata,
      }

      setState((prev) => {
        // Mark previous thoughts as complete
        const thoughts = prev.thoughts.map((t) =>
          t.status === 'active' ? { ...t, status: 'complete' as const } : t
        )

        return {
          ...prev,
          thoughts: [...thoughts, thought],
          currentThought: thought,
        }
      })
      emit('thinking:step', { thought })
    },
    [generateId, emit]
  )

  const completeThinking = React.useCallback(() => {
    setState((prev) => ({
      ...prev,
      thoughts: prev.thoughts.map((t) =>
        t.status === 'active' ? { ...t, status: 'complete' as const } : t
      ),
      currentThought: null,
    }))
    emit('thinking:completed')
  }, [emit])

  // Utilities
  const reset = React.useCallback(() => {
    setState({ ...initialState, ...initialStateProp })
  }, [initialStateProp])

  const getCurrentStep = React.useCallback((): PlanStep | null => {
    if (state.currentStepIndex < 0 || state.currentStepIndex >= state.plan.length) {
      return null
    }
    return state.plan[state.currentStepIndex]
  }, [state.currentStepIndex, state.plan])

  const canProceed = React.useCallback((): boolean => {
    return (
      state.status !== 'error' &&
      state.status !== 'cancelled' &&
      state.status !== 'complete' &&
      state.pendingApprovals.length === 0
    )
  }, [state.status, state.pendingApprovals])

  const getSummary = React.useCallback((): ExecutionSummary => {
    const duration = state.time.startedAt
      ? (state.time.completedAt?.getTime() || Date.now()) -
        state.time.startedAt.getTime() -
        state.time.totalPausedDuration
      : 0

    return {
      executionId: state.executionId,
      status: state.status,
      totalSteps: state.plan.length,
      completedSteps: state.completedSteps.length,
      totalTools: state.toolCalls.length,
      successfulTools: state.completedTools.length,
      failedTools: state.toolCalls.filter((t) => t.status === 'error').length,
      totalThoughts: state.thoughts.length,
      duration,
      progress: state.progress,
    }
  }, [state])

  const contextValue: AgentExecutionContextValue = React.useMemo(
    () => ({
      ...state,
      startExecution,
      cancelExecution,
      pauseExecution,
      resumeExecution,
      completeExecution,
      setError,
      clearError,
      setPlan,
      startStep,
      completeStep,
      failStep,
      skipStep,
      addToolCall,
      startTool,
      completeTool,
      failTool,
      requestApproval,
      approveTool,
      rejectTool,
      startThinking,
      addThought,
      completeThinking,
      emit,
      on,
      onAny,
      reset,
      getCurrentStep,
      canProceed,
      getSummary,
    }),
    [
      state,
      startExecution,
      cancelExecution,
      pauseExecution,
      resumeExecution,
      completeExecution,
      setError,
      clearError,
      setPlan,
      startStep,
      completeStep,
      failStep,
      skipStep,
      addToolCall,
      startTool,
      completeTool,
      failTool,
      requestApproval,
      approveTool,
      rejectTool,
      startThinking,
      addThought,
      completeThinking,
      emit,
      on,
      onAny,
      reset,
      getCurrentStep,
      canProceed,
      getSummary,
    ]
  )

  return (
    <AgentExecutionContext.Provider value={contextValue}>
      {children}
    </AgentExecutionContext.Provider>
  )
}

export default AgentExecutionProvider
