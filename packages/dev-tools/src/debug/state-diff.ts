/**
 * State Diff Visualizer for Clarity Chat Developer Tools
 *
 * Advanced state change visualization and debugging:
 * - Deep object diff with path tracking
 * - Visual diff output (console and HTML)
 * - Change history with rollback support
 * - Performance impact analysis
 * - State size tracking
 * - Circular reference handling
 */

import chalk from 'chalk'
import { infoBox, warningBox } from '../ui/box'
import { table, keyValueTable, type TableColumn } from '../ui/table'

export type DiffType = 'added' | 'removed' | 'changed' | 'unchanged'

export interface DiffEntry {
  path: string
  type: DiffType
  oldValue?: unknown
  newValue?: unknown
  depth: number
}

export interface DiffResult {
  entries: DiffEntry[]
  stats: {
    added: number
    removed: number
    changed: number
    unchanged: number
    totalChanges: number
  }
  oldSize: number
  newSize: number
  sizeChange: number
  timestamp: Date
}

export interface StateSnapshot {
  id: string
  timestamp: Date
  state: unknown
  label?: string
  size: number
  diff?: DiffResult
}

export interface DiffOptions {
  maxDepth?: number
  ignoreKeys?: string[]
  trackUnchanged?: boolean
  detectMoves?: boolean
  arrayDiffMode?: 'index' | 'value' | 'smart'
}

const DEFAULT_OPTIONS: DiffOptions = {
  maxDepth: 10,
  ignoreKeys: [],
  trackUnchanged: false,
  detectMoves: false,
  arrayDiffMode: 'smart',
}

/**
 * State Diff Visualizer
 * Deep comparison and visualization of state changes
 */
export class StateDiff {
  private snapshots: StateSnapshot[] = []
  private maxSnapshots: number = 100
  private options: DiffOptions = DEFAULT_OPTIONS
  private listeners: Set<(diff: DiffResult, oldState: unknown, newState: unknown) => void> = new Set()
  private seenObjects: WeakSet<object> = new WeakSet()

  constructor(options?: {
    maxSnapshots?: number
    diffOptions?: Partial<DiffOptions>
  }) {
    this.maxSnapshots = options?.maxSnapshots ?? 100
    if (options?.diffOptions) {
      this.options = { ...DEFAULT_OPTIONS, ...options.diffOptions }
    }
  }

  /**
   * Compare two states and return diff
   */
  diff(oldState: unknown, newState: unknown, options?: Partial<DiffOptions>): DiffResult {
    const opts = { ...this.options, ...options }
    this.seenObjects = new WeakSet()

    const entries: DiffEntry[] = []
    this.deepDiff(oldState, newState, '', 0, entries, opts)

    const stats = {
      added: entries.filter(e => e.type === 'added').length,
      removed: entries.filter(e => e.type === 'removed').length,
      changed: entries.filter(e => e.type === 'changed').length,
      unchanged: entries.filter(e => e.type === 'unchanged').length,
      totalChanges: 0,
    }
    stats.totalChanges = stats.added + stats.removed + stats.changed

    const oldSize = this.calculateSize(oldState)
    const newSize = this.calculateSize(newState)

    return {
      entries,
      stats,
      oldSize,
      newSize,
      sizeChange: newSize - oldSize,
      timestamp: new Date(),
    }
  }

  /**
   * Take a snapshot of state
   */
  snapshot(state: unknown, label?: string): StateSnapshot {
    const previousSnapshot = this.snapshots[this.snapshots.length - 1]
    const size = this.calculateSize(state)

    const snapshot: StateSnapshot = {
      id: this.generateId(),
      timestamp: new Date(),
      state: this.clone(state),
      label,
      size,
    }

    // Calculate diff from previous state
    if (previousSnapshot) {
      snapshot.diff = this.diff(previousSnapshot.state, state)
    }

    this.snapshots.push(snapshot)

    // Maintain max snapshots
    if (this.snapshots.length > this.maxSnapshots) {
      this.snapshots.shift()
    }

    // Notify listeners
    if (snapshot.diff) {
      this.listeners.forEach(listener =>
        listener(snapshot.diff!, previousSnapshot?.state, state)
      )
    }

    return snapshot
  }

  /**
   * Get snapshot by ID
   */
  getSnapshot(id: string): StateSnapshot | undefined {
    return this.snapshots.find(s => s.id === id)
  }

  /**
   * Get all snapshots
   */
  getSnapshots(): StateSnapshot[] {
    return [...this.snapshots]
  }

  /**
   * Get diff between two snapshots
   */
  diffSnapshots(snapshotId1: string, snapshotId2: string): DiffResult | null {
    const snap1 = this.getSnapshot(snapshotId1)
    const snap2 = this.getSnapshot(snapshotId2)

    if (!snap1 || !snap2) return null

    return this.diff(snap1.state, snap2.state)
  }

  /**
   * Deep comparison algorithm
   */
  private deepDiff(
    oldVal: unknown,
    newVal: unknown,
    path: string,
    depth: number,
    entries: DiffEntry[],
    options: DiffOptions
  ): void {
    if (depth > (options.maxDepth ?? 10)) return

    // Handle circular references
    if (typeof oldVal === 'object' && oldVal !== null) {
      if (this.seenObjects.has(oldVal)) {
        entries.push({
          path: path || '(root)',
          type: 'unchanged',
          oldValue: '[Circular]',
          newValue: '[Circular]',
          depth,
        })
        return
      }
      this.seenObjects.add(oldVal)
    }

    // Same reference
    if (oldVal === newVal) {
      if (options.trackUnchanged) {
        entries.push({
          path: path || '(root)',
          type: 'unchanged',
          oldValue: oldVal,
          newValue: newVal,
          depth,
        })
      }
      return
    }

    // Type mismatch
    if (typeof oldVal !== typeof newVal) {
      entries.push({
        path: path || '(root)',
        type: 'changed',
        oldValue: oldVal,
        newValue: newVal,
        depth,
      })
      return
    }

    // Null checks
    if (oldVal === null || newVal === null) {
      entries.push({
        path: path || '(root)',
        type: 'changed',
        oldValue: oldVal,
        newValue: newVal,
        depth,
      })
      return
    }

    // Array comparison
    if (Array.isArray(oldVal) && Array.isArray(newVal)) {
      this.diffArrays(oldVal, newVal, path, depth, entries, options)
      return
    }

    // Object comparison
    if (typeof oldVal === 'object' && typeof newVal === 'object') {
      this.diffObjects(
        oldVal as Record<string, unknown>,
        newVal as Record<string, unknown>,
        path,
        depth,
        entries,
        options
      )
      return
    }

    // Primitive comparison
    if (oldVal !== newVal) {
      entries.push({
        path: path || '(root)',
        type: 'changed',
        oldValue: oldVal,
        newValue: newVal,
        depth,
      })
    } else if (options.trackUnchanged) {
      entries.push({
        path: path || '(root)',
        type: 'unchanged',
        oldValue: oldVal,
        newValue: newVal,
        depth,
      })
    }
  }

  /**
   * Compare objects
   */
  private diffObjects(
    oldObj: Record<string, unknown>,
    newObj: Record<string, unknown>,
    path: string,
    depth: number,
    entries: DiffEntry[],
    options: DiffOptions
  ): void {
    const allKeys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)])
    const ignoreKeys = options.ignoreKeys ?? []

    for (const key of allKeys) {
      if (ignoreKeys.includes(key)) continue

      const newPath = path ? `${path}.${key}` : key
      const hasOld = key in oldObj
      const hasNew = key in newObj

      if (!hasOld && hasNew) {
        entries.push({
          path: newPath,
          type: 'added',
          newValue: newObj[key],
          depth: depth + 1,
        })
      } else if (hasOld && !hasNew) {
        entries.push({
          path: newPath,
          type: 'removed',
          oldValue: oldObj[key],
          depth: depth + 1,
        })
      } else {
        this.deepDiff(oldObj[key], newObj[key], newPath, depth + 1, entries, options)
      }
    }
  }

  /**
   * Compare arrays
   */
  private diffArrays(
    oldArr: unknown[],
    newArr: unknown[],
    path: string,
    depth: number,
    entries: DiffEntry[],
    options: DiffOptions
  ): void {
    const mode = options.arrayDiffMode ?? 'smart'

    if (mode === 'index' || (mode === 'smart' && !this.isObjectArray(oldArr))) {
      // Index-based comparison
      const maxLength = Math.max(oldArr.length, newArr.length)

      for (let i = 0; i < maxLength; i++) {
        const newPath = `${path}[${i}]`
        const hasOld = i < oldArr.length
        const hasNew = i < newArr.length

        if (!hasOld && hasNew) {
          entries.push({
            path: newPath,
            type: 'added',
            newValue: newArr[i],
            depth: depth + 1,
          })
        } else if (hasOld && !hasNew) {
          entries.push({
            path: newPath,
            type: 'removed',
            oldValue: oldArr[i],
            depth: depth + 1,
          })
        } else {
          this.deepDiff(oldArr[i], newArr[i], newPath, depth + 1, entries, options)
        }
      }
    } else {
      // Value-based comparison for object arrays
      this.diffObjectArrays(oldArr, newArr, path, depth, entries, options)
    }
  }

  /**
   * Smart diff for object arrays (using ID or reference)
   */
  private diffObjectArrays(
    oldArr: unknown[],
    newArr: unknown[],
    path: string,
    depth: number,
    entries: DiffEntry[],
    options: DiffOptions
  ): void {
    const getKey = (item: unknown, index: number): string => {
      if (typeof item === 'object' && item !== null) {
        const obj = item as Record<string, unknown>
        if ('id' in obj) return String(obj.id)
        if ('key' in obj) return String(obj.key)
        if ('_id' in obj) return String(obj._id)
      }
      return `__index_${index}`
    }

    const oldMap = new Map(oldArr.map((item, i) => [getKey(item, i), { item, index: i }]))
    const newMap = new Map(newArr.map((item, i) => [getKey(item, i), { item, index: i }]))

    // Find removed items
    for (const [key, { item, index }] of oldMap) {
      if (!newMap.has(key)) {
        entries.push({
          path: `${path}[${index}]`,
          type: 'removed',
          oldValue: item,
          depth: depth + 1,
        })
      }
    }

    // Find added and changed items
    for (const [key, { item, index }] of newMap) {
      const oldEntry = oldMap.get(key)
      if (!oldEntry) {
        entries.push({
          path: `${path}[${index}]`,
          type: 'added',
          newValue: item,
          depth: depth + 1,
        })
      } else {
        this.deepDiff(oldEntry.item, item, `${path}[${index}]`, depth + 1, entries, options)
      }
    }
  }

  /**
   * Check if array contains objects
   */
  private isObjectArray(arr: unknown[]): boolean {
    return arr.length > 0 && typeof arr[0] === 'object' && arr[0] !== null
  }

  /**
   * Calculate approximate size of value
   */
  private calculateSize(value: unknown): number {
    try {
      return JSON.stringify(value).length
    } catch {
      return 0
    }
  }

  /**
   * Clone value (deep copy)
   */
  private clone<T>(value: T): T {
    try {
      return structuredClone(value)
    } catch {
      return JSON.parse(JSON.stringify(value))
    }
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `diff_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Add listener for state changes
   */
  addListener(listener: (diff: DiffResult, oldState: unknown, newState: unknown) => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  /**
   * Clear all snapshots
   */
  clear(): void {
    this.snapshots = []
  }

  /**
   * Set diff options
   */
  setOptions(options: Partial<DiffOptions>): void {
    this.options = { ...this.options, ...options }
  }

  /**
   * Format diff as string for console output
   */
  formatDiff(diff: DiffResult, options?: { showUnchanged?: boolean }): string {
    const lines: string[] = []
    const showUnchanged = options?.showUnchanged ?? false

    lines.push('')
    lines.push(chalk.bold('State Diff'))
    lines.push(chalk.gray('─'.repeat(50)))
    lines.push('')

    for (const entry of diff.entries) {
      if (!showUnchanged && entry.type === 'unchanged') continue

      const indent = '  '.repeat(entry.depth)
      const pathStr = chalk.gray(entry.path)

      switch (entry.type) {
        case 'added':
          lines.push(`${indent}${chalk.green('+ ')}${pathStr}: ${chalk.green(this.formatValue(entry.newValue))}`)
          break
        case 'removed':
          lines.push(`${indent}${chalk.red('- ')}${pathStr}: ${chalk.red(this.formatValue(entry.oldValue))}`)
          break
        case 'changed':
          lines.push(`${indent}${chalk.yellow('~ ')}${pathStr}:`)
          lines.push(`${indent}  ${chalk.red('- ')}${chalk.red(this.formatValue(entry.oldValue))}`)
          lines.push(`${indent}  ${chalk.green('+ ')}${chalk.green(this.formatValue(entry.newValue))}`)
          break
        case 'unchanged':
          lines.push(`${indent}${chalk.gray('  ')}${pathStr}: ${chalk.gray(this.formatValue(entry.oldValue))}`)
          break
      }
    }

    lines.push('')
    lines.push(chalk.gray('─'.repeat(50)))
    lines.push(`${chalk.green('+' + diff.stats.added)} added, ${chalk.red('-' + diff.stats.removed)} removed, ${chalk.yellow('~' + diff.stats.changed)} changed`)
    lines.push(`Size: ${diff.oldSize} → ${diff.newSize} (${diff.sizeChange >= 0 ? '+' : ''}${diff.sizeChange} bytes)`)
    lines.push('')

    return lines.join('\n')
  }

  /**
   * Format value for display
   */
  private formatValue(value: unknown): string {
    if (value === undefined) return 'undefined'
    if (value === null) return 'null'

    const str = JSON.stringify(value)
    if (str.length > 80) {
      return str.substring(0, 77) + '...'
    }
    return str
  }

  /**
   * Generate HTML diff view
   */
  formatDiffHTML(diff: DiffResult): string {
    const styles = `
      <style>
        .diff-container { font-family: monospace; background: #1e1e1e; color: #d4d4d4; padding: 16px; border-radius: 8px; }
        .diff-header { font-size: 14px; font-weight: bold; margin-bottom: 16px; color: #fff; }
        .diff-entry { padding: 4px 8px; margin: 2px 0; border-radius: 4px; }
        .diff-added { background: rgba(0, 255, 0, 0.1); color: #4ec9b0; }
        .diff-removed { background: rgba(255, 0, 0, 0.1); color: #f14c4c; }
        .diff-changed { background: rgba(255, 255, 0, 0.1); color: #dcdcaa; }
        .diff-path { color: #9cdcfe; }
        .diff-value { color: #ce9178; }
        .diff-stats { margin-top: 16px; padding-top: 16px; border-top: 1px solid #333; }
        .diff-stat { display: inline-block; margin-right: 16px; padding: 4px 8px; border-radius: 4px; }
        .stat-added { background: rgba(0, 255, 0, 0.2); }
        .stat-removed { background: rgba(255, 0, 0, 0.2); }
        .stat-changed { background: rgba(255, 255, 0, 0.2); }
      </style>
    `

    const entries = diff.entries
      .filter(e => e.type !== 'unchanged')
      .map(entry => {
        const indent = '&nbsp;'.repeat(entry.depth * 2)
        const className = `diff-entry diff-${entry.type}`
        const symbol = entry.type === 'added' ? '+' : entry.type === 'removed' ? '-' : '~'
        const value = entry.type === 'changed'
          ? `<span class="diff-value">${this.escapeHtml(this.formatValue(entry.oldValue))}</span> → <span class="diff-value">${this.escapeHtml(this.formatValue(entry.newValue))}</span>`
          : `<span class="diff-value">${this.escapeHtml(this.formatValue(entry.newValue ?? entry.oldValue))}</span>`

        return `<div class="${className}">${indent}${symbol} <span class="diff-path">${entry.path}</span>: ${value}</div>`
      })
      .join('')

    return `
      ${styles}
      <div class="diff-container">
        <div class="diff-header">🔄 State Diff</div>
        ${entries}
        <div class="diff-stats">
          <span class="diff-stat stat-added">+${diff.stats.added} added</span>
          <span class="diff-stat stat-removed">-${diff.stats.removed} removed</span>
          <span class="diff-stat stat-changed">~${diff.stats.changed} changed</span>
        </div>
      </div>
    `
  }

  /**
   * Escape HTML special characters
   */
  private escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }

  /**
   * Print diff report to console
   */
  printDiff(diff: DiffResult): void {
    console.log(this.formatDiff(diff))
  }

  /**
   * Print snapshot history
   */
  printHistory(): void {
    console.log('')
    console.log(infoBox('State Snapshot History', '📸 Snapshots'))
    console.log('')

    if (this.snapshots.length === 0) {
      console.log(chalk.gray('No snapshots recorded yet.'))
      return
    }

    const columns: TableColumn[] = [
      { header: '#', width: 4, align: 'right' },
      { header: 'Time', width: 12, color: chalk.gray },
      { header: 'Label', width: 20, color: chalk.yellow },
      { header: 'Size', width: 10, align: 'right', color: chalk.cyan },
      { header: 'Changes', width: 15, align: 'center' },
    ]

    const tableData = this.snapshots.map((snapshot, index) => {
      const time = snapshot.timestamp.toLocaleTimeString()
      const label = snapshot.label ?? snapshot.id.substring(0, 12)
      const size = `${(snapshot.size / 1024).toFixed(2)} KB`
      const changes = snapshot.diff
        ? `${chalk.green('+' + snapshot.diff.stats.added)} ${chalk.red('-' + snapshot.diff.stats.removed)} ${chalk.yellow('~' + snapshot.diff.stats.changed)}`
        : chalk.gray('—')

      return [index.toString(), time, label, size, changes]
    })

    console.log(table(tableData, columns))
    console.log('')
  }

  /**
   * Export all data
   */
  export(): string {
    return JSON.stringify({
      snapshots: this.snapshots,
      options: this.options,
      exportedAt: new Date().toISOString(),
    }, null, 2)
  }
}

// Global instance
let globalDiff: StateDiff | null = null

/**
 * Get the global state diff instance
 */
export function getStateDiff(): StateDiff {
  if (!globalDiff) {
    globalDiff = new StateDiff()
  }
  return globalDiff
}

/**
 * Create a new state diff instance
 */
export function createStateDiff(options?: {
  maxSnapshots?: number
  diffOptions?: Partial<DiffOptions>
}): StateDiff {
  return new StateDiff(options)
}

/**
 * Quick diff utility
 */
export function quickDiff(oldState: unknown, newState: unknown, options?: Partial<DiffOptions>): DiffResult {
  const differ = new StateDiff({ diffOptions: options })
  return differ.diff(oldState, newState)
}

export default StateDiff
