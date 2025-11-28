/**
 * Time-Travel Debugging for AI Chat Applications
 * Record and replay conversation states for debugging
 */

import type { TableColumn } from '../ui/table'
import { table, keyValueTable } from '../ui/table'
import { infoBox } from '../ui/box'
import chalk from 'chalk'

export interface StateSnapshot {
  id: string
  timestamp: Date
  messages: any[]
  config: any
  metadata: Record<string, any>
  label?: string
}

export interface StateTransition {
  from: string
  to: string
  action: string
  timestamp: Date
  diff: any
}

/**
 * Time-travel debugger for chat state
 */
export class TimeTravelDebugger {
  private snapshots: StateSnapshot[] = []
  private transitions: StateTransition[] = []
  private currentIndex: number = -1
  private maxSnapshots: number = 100
  // Cache for search optimization - maps snapshot ID to lowercase serialized string
  private searchIndex: Map<string, string> = new Map()

  constructor(options?: { maxSnapshots?: number }) {
    if (options?.maxSnapshots) {
      this.maxSnapshots = options.maxSnapshots
    }
  }

  /**
   * Record a state snapshot
   */
  record(messages: any[], config: any, metadata?: Record<string, any>, label?: string): string {
    const snapshot: StateSnapshot = {
      id: this.generateId(),
      timestamp: new Date(),
      messages: structuredClone(messages),
      config: structuredClone(config),
      metadata: metadata || {},
      label,
    }

    // Record transition if there's a previous state
    if (this.currentIndex >= 0) {
      const previousSnapshot = this.snapshots[this.currentIndex]
      const transition: StateTransition = {
        from: previousSnapshot.id,
        to: snapshot.id,
        action: this.inferAction(previousSnapshot, snapshot),
        timestamp: new Date(),
        diff: this.calculateDiff(previousSnapshot, snapshot),
      }
      this.transitions.push(transition)
    }

    this.snapshots.push(snapshot)
    this.currentIndex = this.snapshots.length - 1

    // Maintain max snapshots limit
    if (this.snapshots.length > this.maxSnapshots) {
      const removed = this.snapshots.shift()
      if (removed) {
        this.searchIndex.delete(removed.id)
      }
      this.currentIndex--
    }

    return snapshot.id
  }

  /**
   * Jump to a specific snapshot
   */
  jumpTo(snapshotId: string): StateSnapshot | null {
    const index = this.snapshots.findIndex(s => s.id === snapshotId)
    if (index === -1) return null

    this.currentIndex = index
    return this.snapshots[index]
  }

  /**
   * Go back N steps
   */
  goBack(steps: number = 1): StateSnapshot | null {
    const newIndex = Math.max(0, this.currentIndex - steps)
    this.currentIndex = newIndex
    return this.snapshots[newIndex]
  }

  /**
   * Go forward N steps
   */
  goForward(steps: number = 1): StateSnapshot | null {
    const newIndex = Math.min(this.snapshots.length - 1, this.currentIndex + steps)
    this.currentIndex = newIndex
    return this.snapshots[newIndex]
  }

  /**
   * Get current snapshot
   */
  getCurrent(): StateSnapshot | null {
    return this.currentIndex >= 0 ? this.snapshots[this.currentIndex] : null
  }

  /**
   * Get all snapshots
   */
  getAll(): StateSnapshot[] {
    return [...this.snapshots]
  }

  /**
   * Get snapshot timeline
   */
  getTimeline(): Array<{
    snapshot: StateSnapshot
    transition?: StateTransition
    isCurrent: boolean
  }> {
    return this.snapshots.map((snapshot, index) => ({
      snapshot,
      transition: this.transitions.find(t => t.to === snapshot.id),
      isCurrent: index === this.currentIndex,
    }))
  }

  /**
   * Search snapshots using cached search index for performance
   */
  search(query: string): StateSnapshot[] {
    const lowerQuery = query.toLowerCase()
    return this.snapshots.filter(snapshot => {
      // Check cache first
      let searchString = this.searchIndex.get(snapshot.id)
      if (!searchString) {
        // Build and cache search string
        searchString = JSON.stringify(snapshot).toLowerCase()
        this.searchIndex.set(snapshot.id, searchString)
      }
      return searchString.includes(lowerQuery)
    })
  }

  /**
   * Export session for sharing/analysis
   */
  export(): string {
    return JSON.stringify({
      snapshots: this.snapshots,
      transitions: this.transitions,
      currentIndex: this.currentIndex,
      exportedAt: new Date().toISOString(),
    }, null, 2)
  }

  /**
   * Import session
   */
  import(data: string): void {
    try {
      const parsed = JSON.parse(data)
      this.snapshots = parsed.snapshots
      this.transitions = parsed.transitions
      this.currentIndex = parsed.currentIndex
    } catch (error) {
      throw new Error('Invalid import data')
    }
  }

  /**
   * Clear all history
   */
  clear(): void {
    this.snapshots = []
    this.transitions = []
    this.currentIndex = -1
    this.searchIndex.clear()
  }

  /**
   * Get statistics
   */
  getStats(): {
    totalSnapshots: number
    totalTransitions: number
    timeSpan: number
    averageMessageCount: number
    actionCounts: Record<string, number>
  } {
    const actionCounts: Record<string, number> = {}
    this.transitions.forEach(t => {
      actionCounts[t.action] = (actionCounts[t.action] || 0) + 1
    })

    const timeSpan = this.snapshots.length > 1
      ? this.snapshots[this.snapshots.length - 1].timestamp.getTime() - 
        this.snapshots[0].timestamp.getTime()
      : 0

    const averageMessageCount = this.snapshots.length > 0
      ? this.snapshots.reduce((sum, s) => sum + s.messages.length, 0) / this.snapshots.length
      : 0

    return {
      totalSnapshots: this.snapshots.length,
      totalTransitions: this.transitions.length,
      timeSpan,
      averageMessageCount,
      actionCounts,
    }
  }

  /**
   * Private: Generate unique ID
   */
  private generateId(): string {
    return `snapshot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Private: Infer action from state changes
   */
  private inferAction(prev: StateSnapshot, curr: StateSnapshot): string {
    if (curr.messages.length > prev.messages.length) {
      return 'MESSAGE_ADDED'
    }
    if (curr.messages.length < prev.messages.length) {
      return 'MESSAGE_REMOVED'
    }
    if (JSON.stringify(curr.config) !== JSON.stringify(prev.config)) {
      return 'CONFIG_CHANGED'
    }
    return 'STATE_UPDATED'
  }

  /**
   * Private: Calculate diff between snapshots
   */
  private calculateDiff(prev: StateSnapshot, curr: StateSnapshot): any {
    const diff: any = {}

    // Message diff
    if (curr.messages.length !== prev.messages.length) {
      diff.messages = {
        added: curr.messages.length - prev.messages.length,
        total: curr.messages.length,
      }
    }

    // Config diff
    const prevConfig = JSON.stringify(prev.config)
    const currConfig = JSON.stringify(curr.config)
    if (prevConfig !== currConfig) {
      diff.config = {
        changed: true,
        keys: Object.keys(curr.config).filter(
          key => JSON.stringify(curr.config[key]) !== JSON.stringify(prev.config[key])
        ),
      }
    }

    return diff
  }
}

/**
 * React Hook for time-travel debugging
 */
export function createTimeTravelHook(timeTravel: TimeTravelDebugger) {
  return {
    record: (messages: any[], config: any, label?: string) => {
      return timeTravel.record(messages, config, {}, label)
    },
    
    goBack: () => timeTravel.goBack(),
    goForward: () => timeTravel.goForward(),
    jumpTo: (id: string) => timeTravel.jumpTo(id),
    
    getCurrent: () => timeTravel.getCurrent(),
    getTimeline: () => timeTravel.getTimeline(),
    
    export: () => timeTravel.export(),
    import: (data: string) => timeTravel.import(data),
  }
}

/**
 * Visual timeline renderer with beautiful formatting
 */
export function renderTimeline(timeTravel: TimeTravelDebugger): string {
  const timeline = timeTravel.getTimeline()
  const output: string[] = []

  // Header
  output.push('')
  output.push(infoBox('Time-Travel Debugger Timeline', '⏱️  Timeline'))
  output.push('')

  if (timeline.length === 0) {
    output.push(chalk.gray('No snapshots recorded yet.'))
    output.push('')
    return output.join('\n')
  }

  // Timeline table
  const columns: TableColumn[] = [
    { header: '#', width: 4, align: 'right' },
    { header: 'Time', width: 12, color: chalk.gray },
    { header: 'Label', width: 20, color: chalk.yellow },
    { header: 'Messages', width: 10, align: 'center', color: chalk.cyan },
    { header: 'Action', width: 20 },
    { header: 'Status', width: 10, align: 'center' },
  ]

  const tableData = timeline.map((entry, index) => {
    const { snapshot, transition, isCurrent } = entry
    const time = snapshot.timestamp.toLocaleTimeString()
    const label = snapshot.label || snapshot.id.substring(0, 12)
    const action = transition?.action || '—'
    const status = isCurrent ? chalk.green('▶ Current') : chalk.gray('○')

    return [
      index.toString(),
      time,
      label,
      snapshot.messages.length.toString(),
      action,
      status,
    ]
  })

  output.push(table(tableData, columns))
  output.push('')

  // Current snapshot details
  const current = timeline.find(e => e.isCurrent)
  if (current) {
    const details: Record<string, string> = {
      'Snapshot ID': chalk.gray(current.snapshot.id.substring(0, 20) + '...'),
      'Messages': chalk.cyan(current.snapshot.messages.length.toString()),
      'Config Keys': chalk.cyan(Object.keys(current.snapshot.config).length.toString()),
    }

    if (current.snapshot.label) {
      details['Label'] = chalk.yellow(current.snapshot.label)
    }

    output.push(infoBox(keyValueTable(details), '📍 Current Snapshot'))
    output.push('')
  }

  // Statistics
  const stats = timeTravel.getStats()
  const statsData: Record<string, string> = {
    'Total Snapshots': chalk.cyan(stats.totalSnapshots.toString()),
    'Total Transitions': chalk.cyan(stats.totalTransitions.toString()),
    'Time Span': chalk.cyan(`${Math.round(stats.timeSpan / 1000)}s`),
    'Avg Messages': chalk.cyan(stats.averageMessageCount.toFixed(1)),
  }

  output.push(infoBox(keyValueTable(statsData), '📊 Statistics'))
  output.push('')

  return output.join('\n')
}

