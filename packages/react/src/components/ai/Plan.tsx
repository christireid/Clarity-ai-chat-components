'use client'

/**
 * Plan Component
 *
 * A task planning display component for showing AI-generated plans,
 * to-do lists, or multi-step processes with status tracking.
 *
 * Features:
 * - Multiple variants (default, compact, timeline, kanban)
 * - Task status tracking (pending, in-progress, completed, failed)
 * - Subtask support with nesting
 * - Progress calculation
 * - Priority levels
 * - Drag-and-drop reordering (optional)
 * - Accessible with ARIA attributes
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Plan
 *   title="Implementation Plan"
 *   tasks={[
 *     { id: '1', title: 'Research', status: 'completed' },
 *     { id: '2', title: 'Design', status: 'in-progress' },
 *     { id: '3', title: 'Implement', status: 'pending' },
 *   ]}
 * />
 *
 * // With subtasks and priority
 * <Plan
 *   tasks={[
 *     {
 *       id: '1',
 *       title: 'Setup project',
 *       status: 'completed',
 *       priority: 'high',
 *       subtasks: [
 *         { id: '1a', title: 'Init repo', status: 'completed' },
 *         { id: '1b', title: 'Install deps', status: 'completed' },
 *       ],
 *     },
 *   ]}
 * />
 * ```
 */

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn, useReducedMotion } from '@clarity-chat/primitives'
import { DURATION_SECONDS, EASING_FRAMER } from '../../animations/constants'

// ============================================================================
// Types
// ============================================================================

export type PlanVariant = 'default' | 'compact' | 'timeline' | 'checklist'
export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'failed' | 'skipped'
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical'

export interface PlanTask {
  /** Unique identifier */
  id: string
  /** Task title */
  title: string
  /** Task description */
  description?: string
  /** Current status */
  status: TaskStatus
  /** Priority level */
  priority?: TaskPriority
  /** Subtasks */
  subtasks?: PlanTask[]
  /** Estimated duration (in minutes) */
  estimatedDuration?: number
  /** Actual duration (in minutes) */
  actualDuration?: number
  /** Due date */
  dueDate?: Date | string
  /** Completion percentage (0-100) */
  progress?: number
  /** Assigned to */
  assignee?: string
  /** Custom icon */
  icon?: React.ReactNode
  /** Tags/labels */
  tags?: string[]
}

export interface PlanProps {
  /** Plan title */
  title?: string
  /** Plan description */
  description?: string
  /** Array of tasks */
  tasks: PlanTask[]
  /** Visual variant */
  variant?: PlanVariant
  /** Show progress bar */
  showProgress?: boolean
  /** Show task count */
  showTaskCount?: boolean
  /** Show estimated time */
  showEstimatedTime?: boolean
  /** Allow task toggling */
  interactive?: boolean
  /** Collapse completed tasks */
  collapseCompleted?: boolean
  /** Task click handler */
  onTaskClick?: (task: PlanTask) => void
  /** Task status change handler */
  onTaskStatusChange?: (taskId: string, status: TaskStatus) => void
  /** Additional class names */
  className?: string
}

// ============================================================================
// Helper Functions
// ============================================================================

function calculateProgress(tasks: PlanTask[]): number {
  if (tasks.length === 0) return 0

  let completed = 0
  let total = 0

  const countTasks = (taskList: PlanTask[]) => {
    for (const task of taskList) {
      total += 1
      if (task.status === 'completed') {
        completed += 1
      } else if (task.progress) {
        completed += task.progress / 100
      }
      if (task.subtasks) {
        countTasks(task.subtasks)
      }
    }
  }

  countTasks(tasks)
  return Math.round((completed / total) * 100)
}

function calculateTotalTime(tasks: PlanTask[]): number {
  let total = 0
  const countTime = (taskList: PlanTask[]) => {
    for (const task of taskList) {
      total += task.estimatedDuration || 0
      if (task.subtasks) {
        countTime(task.subtasks)
      }
    }
  }
  countTime(tasks)
  return total
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

function getStatusIcon(status: TaskStatus): React.ReactNode {
  switch (status) {
    case 'completed':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )
    case 'in-progress':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      )
    case 'failed':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      )
    case 'skipped':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M5 12h14" />
        </svg>
      )
    default:
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
        </svg>
      )
  }
}

function getPriorityLabel(priority: TaskPriority): string {
  return priority.charAt(0).toUpperCase() + priority.slice(1)
}

// ============================================================================
// TaskItem Component
// ============================================================================

interface TaskItemProps {
  task: PlanTask
  variant: PlanVariant
  depth?: number
  interactive?: boolean
  onTaskClick?: (task: PlanTask) => void
  onTaskStatusChange?: (taskId: string, status: TaskStatus) => void
}

function TaskItem({
  task,
  variant,
  depth = 0,
  interactive = false,
  onTaskClick,
  onTaskStatusChange,
}: TaskItemProps) {
  const prefersReducedMotion = useReducedMotion()
  const [isExpanded, setIsExpanded] = React.useState(true)
  const hasSubtasks = task.subtasks && task.subtasks.length > 0

  const handleClick = () => {
    if (onTaskClick) {
      onTaskClick(task)
    }
  }

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (interactive && onTaskStatusChange) {
      const nextStatus: TaskStatus =
        task.status === 'completed' ? 'pending' : 'completed'
      onTaskStatusChange(task.id, nextStatus)
    }
  }

  const handleExpandToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsExpanded(!isExpanded)
  }

  return (
    <motion.div
      className={cn(
        'plan-task',
        `plan-task-${task.status}`,
        task.priority && `plan-task-priority-${task.priority}`,
        depth > 0 && 'plan-task-subtask'
      )}
      style={{ '--task-depth': depth } as React.CSSProperties}
      initial={prefersReducedMotion ? {} : { opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: DURATION_SECONDS.fast,
        ease: EASING_FRAMER.standard,
      }}
    >
      <div
        className="plan-task-content"
        onClick={handleClick}
        role={onTaskClick ? 'button' : undefined}
        tabIndex={onTaskClick ? 0 : undefined}
      >
        {/* Status indicator / checkbox */}
        <button
          type="button"
          className={cn(
            'plan-task-status',
            interactive && 'plan-task-status-interactive'
          )}
          onClick={handleToggle}
          aria-label={`Mark as ${task.status === 'completed' ? 'pending' : 'completed'}`}
          disabled={!interactive}
        >
          {getStatusIcon(task.status)}
        </button>

        {/* Task info */}
        <div className="plan-task-info">
          <div className="plan-task-header">
            <span className={cn(
              'plan-task-title',
              task.status === 'completed' && 'plan-task-title-completed'
            )}>
              {task.title}
            </span>

            {task.priority && variant !== 'compact' && (
              <span className={cn('plan-task-priority', `plan-task-priority-${task.priority}`)}>
                {getPriorityLabel(task.priority)}
              </span>
            )}

            {task.estimatedDuration && variant !== 'compact' && (
              <span className="plan-task-duration">
                {formatDuration(task.estimatedDuration)}
              </span>
            )}
          </div>

          {task.description && variant !== 'compact' && (
            <p className="plan-task-description">{task.description}</p>
          )}

          {task.tags && task.tags.length > 0 && variant !== 'compact' && (
            <div className="plan-task-tags">
              {task.tags.map((tag) => (
                <span key={tag} className="plan-task-tag">{tag}</span>
              ))}
            </div>
          )}

          {/* Progress bar for in-progress tasks */}
          {task.status === 'in-progress' && task.progress !== undefined && (
            <div className="plan-task-progress">
              <div
                className="plan-task-progress-bar"
                style={{ width: `${task.progress}%` }}
              />
              <span className="plan-task-progress-text">{task.progress}%</span>
            </div>
          )}
        </div>

        {/* Expand/collapse for subtasks */}
        {hasSubtasks && (
          <button
            type="button"
            className="plan-task-expand"
            onClick={handleExpandToggle}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? 'Collapse subtasks' : 'Expand subtasks'}
          >
            <motion.svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: DURATION_SECONDS.fast }}
            >
              <polyline points="9 18 15 12 9 6" />
            </motion.svg>
          </button>
        )}
      </div>

      {/* Subtasks */}
      <AnimatePresence>
        {hasSubtasks && isExpanded && (
          <motion.div
            className="plan-task-subtasks"
            initial={prefersReducedMotion ? {} : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={prefersReducedMotion ? {} : { height: 0, opacity: 0 }}
            transition={{ duration: DURATION_SECONDS.normal }}
          >
            {task.subtasks!.map((subtask) => (
              <TaskItem
                key={subtask.id}
                task={subtask}
                variant={variant}
                depth={depth + 1}
                interactive={interactive}
                onTaskClick={onTaskClick}
                onTaskStatusChange={onTaskStatusChange}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ============================================================================
// Plan Component
// ============================================================================

export function Plan({
  title,
  description,
  tasks,
  variant = 'default',
  showProgress = true,
  showTaskCount = true,
  showEstimatedTime = true,
  interactive = false,
  collapseCompleted = false,
  onTaskClick,
  onTaskStatusChange,
  className,
}: PlanProps) {
  const prefersReducedMotion = useReducedMotion()
  const progress = calculateProgress(tasks)
  const totalTime = calculateTotalTime(tasks)
  const completedCount = tasks.filter((t) => t.status === 'completed').length

  const displayTasks = collapseCompleted
    ? tasks.filter((t) => t.status !== 'completed')
    : tasks

  const completedTasks = collapseCompleted
    ? tasks.filter((t) => t.status === 'completed')
    : []

  return (
    <motion.div
      className={cn('plan', `plan-${variant}`, className)}
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: DURATION_SECONDS.normal,
        ease: EASING_FRAMER.standard,
      }}
      role="region"
      aria-label={title || 'Plan'}
    >
      {/* Header */}
      {(title || showProgress || showTaskCount) && (
        <div className="plan-header">
          <div className="plan-header-info">
            {title && <h3 className="plan-title">{title}</h3>}
            {description && <p className="plan-description">{description}</p>}
          </div>

          <div className="plan-header-meta">
            {showTaskCount && (
              <span className="plan-task-count">
                {completedCount}/{tasks.length} tasks
              </span>
            )}
            {showEstimatedTime && totalTime > 0 && (
              <span className="plan-estimated-time">
                ~{formatDuration(totalTime)}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Progress bar */}
      {showProgress && (
        <div className="plan-progress-container">
          <div className="plan-progress-bar">
            <motion.div
              className="plan-progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{
                duration: prefersReducedMotion ? 0 : DURATION_SECONDS.slow,
                ease: EASING_FRAMER.standard,
              }}
            />
          </div>
          <span className="plan-progress-text">{progress}%</span>
        </div>
      )}

      {/* Task list */}
      <div className="plan-tasks" role="list">
        <AnimatePresence mode="popLayout">
          {displayTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              variant={variant}
              interactive={interactive}
              onTaskClick={onTaskClick}
              onTaskStatusChange={onTaskStatusChange}
            />
          ))}
        </AnimatePresence>

        {/* Collapsed completed section */}
        {collapseCompleted && completedTasks.length > 0 && (
          <details className="plan-completed-section">
            <summary className="plan-completed-summary">
              {completedTasks.length} completed task{completedTasks.length > 1 ? 's' : ''}
            </summary>
            <div className="plan-completed-tasks">
              {completedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  variant={variant}
                  interactive={interactive}
                  onTaskClick={onTaskClick}
                  onTaskStatusChange={onTaskStatusChange}
                />
              ))}
            </div>
          </details>
        )}
      </div>
    </motion.div>
  )
}

// ============================================================================
// usePlan Hook
// ============================================================================

export interface UsePlanOptions {
  /** Initial tasks */
  initialTasks?: PlanTask[]
}

export interface UsePlanReturn {
  /** Current tasks */
  tasks: PlanTask[]
  /** Add a task */
  addTask: (task: PlanTask) => void
  /** Remove a task */
  removeTask: (taskId: string) => void
  /** Update task status */
  updateStatus: (taskId: string, status: TaskStatus) => void
  /** Update task */
  updateTask: (taskId: string, updates: Partial<PlanTask>) => void
  /** Reorder tasks */
  reorderTasks: (fromIndex: number, toIndex: number) => void
  /** Get progress percentage */
  getProgress: () => number
  /** Clear all tasks */
  clear: () => void
  /** Set all tasks */
  setTasks: (tasks: PlanTask[]) => void
}

export function usePlan(options: UsePlanOptions = {}): UsePlanReturn {
  const { initialTasks = [] } = options
  const [tasks, setTasks] = React.useState<PlanTask[]>(initialTasks)

  const addTask = React.useCallback((task: PlanTask) => {
    setTasks((prev) => [...prev, task])
  }, [])

  const removeTask = React.useCallback((taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId))
  }, [])

  const updateStatus = React.useCallback((taskId: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status } : t))
    )
  }, [])

  const updateTask = React.useCallback(
    (taskId: string, updates: Partial<PlanTask>) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t))
      )
    },
    []
  )

  const reorderTasks = React.useCallback((fromIndex: number, toIndex: number) => {
    setTasks((prev) => {
      const newTasks = [...prev]
      const [removed] = newTasks.splice(fromIndex, 1)
      newTasks.splice(toIndex, 0, removed)
      return newTasks
    })
  }, [])

  const getProgress = React.useCallback(() => calculateProgress(tasks), [tasks])

  const clear = React.useCallback(() => {
    setTasks([])
  }, [])

  return {
    tasks,
    addTask,
    removeTask,
    updateStatus,
    updateTask,
    reorderTasks,
    getProgress,
    clear,
    setTasks,
  }
}

export default Plan
