/**
 * Output formatting utilities
 * Supports multiple output modes: human-readable, JSON, quiet, verbose
 */

import chalk from 'chalk'
import { getLogger } from './logger.js'

const logger = getLogger('output')

export enum OutputMode {
  HUMAN = 'human',
  JSON = 'json',
  QUIET = 'quiet',
  VERBOSE = 'verbose',
}

let currentMode: OutputMode = OutputMode.HUMAN
let isQuiet: boolean = false
let isVerbose: boolean = false
let isJson: boolean = false

/**
 * Initialize output mode from environment or flags
 */
export function initOutputMode(options: {
  json?: boolean
  quiet?: boolean
  verbose?: boolean
}): void {
  isJson = options.json || false
  isQuiet = options.quiet || false
  isVerbose = options.verbose || false
  
  if (isJson) {
    currentMode = OutputMode.JSON
  } else if (isQuiet) {
    currentMode = OutputMode.QUIET
  } else if (isVerbose) {
    currentMode = OutputMode.VERBOSE
  } else {
    currentMode = OutputMode.HUMAN
  }
}

/**
 * Check if output should be suppressed
 */
export function shouldOutput(level: 'info' | 'warn' | 'error' | 'debug' = 'info'): boolean {
  if (isQuiet && level !== 'error') return false
  if (level === 'debug' && !isVerbose && !process.env.DEBUG) return false
  return true
}

/**
 * Output formatted message
 */
export function output(message: string, level: 'info' | 'warn' | 'error' | 'debug' = 'info'): void {
  if (!shouldOutput(level)) return
  
  if (isJson) {
    const json = {
      level,
      message,
      timestamp: new Date().toISOString(),
    }
    console.log(JSON.stringify(json))
    return
  }
  
  if (level === 'success') {
    console.log(chalk.green(`✔ ${message}`))
    return
  }
  
  const colors = {
    info: chalk.blue,
    warn: chalk.yellow,
    error: chalk.red,
    debug: chalk.magenta,
  }
  
  const icons = {
    info: 'ℹ',
    warn: '⚠',
    error: '✖',
    debug: '🐛',
  }
  
  const color = colors[level]
  const icon = icons[level]
  
  console.log(color(`${icon} ${message}`))
}

/**
 * Output JSON data
 */
export function outputJson(data: any): void {
  if (isJson || currentMode === OutputMode.JSON) {
    console.log(JSON.stringify(data, null, 2))
  } else {
    // Format as table or list for human-readable
    if (Array.isArray(data)) {
      data.forEach((item, index) => {
        console.log(chalk.cyan(`${index + 1}.`), item)
      })
    } else if (typeof data === 'object') {
      Object.entries(data).forEach(([key, value]) => {
        console.log(chalk.cyan(`${key}:`), value)
      })
    } else {
      console.log(data)
    }
  }
}

/**
 * Output table
 */
export function outputTable(
  headers: string[],
  rows: (string | number)[][],
  options: { border?: boolean } = {}
): void {
  if (isJson) {
    const data = rows.map(row => {
      const obj: Record<string, any> = {}
      headers.forEach((header, index) => {
        obj[header] = row[index]
      })
      return obj
    })
    outputJson(data)
    return
  }
  
  // Simple table formatting
  const maxWidths = headers.map((header, i) => {
    const headerWidth = header.length
    const maxRowWidth = Math.max(...rows.map(row => String(row[i] || '').length))
    return Math.max(headerWidth, maxRowWidth)
  })
  
  // Header
  const headerRow = headers.map((header, i) => 
    chalk.bold.cyan(header.padEnd(maxWidths[i]))
  ).join(' | ')
  
  if (options.border) {
    console.log(chalk.gray('─'.repeat(headerRow.length)))
  }
  
  console.log(headerRow)
  
  if (options.border) {
    console.log(chalk.gray('─'.repeat(headerRow.length)))
  }
  
  // Rows
  rows.forEach(row => {
    const rowStr = row.map((cell, i) => 
      String(cell || '').padEnd(maxWidths[i])
    ).join(' | ')
    console.log(rowStr)
  })
  
  if (options.border) {
    console.log(chalk.gray('─'.repeat(headerRow.length)))
  }
}

/**
 * Output success message
 */
export function success(message: string): void {
  if (!shouldOutput('info')) return
  if (isJson) {
    const json = {
      level: 'success',
      message,
      timestamp: new Date().toISOString(),
    }
    console.log(JSON.stringify(json))
    return
  }
  console.log(chalk.green(`✔ ${message}`))
}

/**
 * Output info message
 */
export function info(message: string): void {
  output(message, 'info')
}

/**
 * Output warning message
 */
export function warn(message: string): void {
  output(message, 'warn')
}

/**
 * Output error message
 */
export function error(message: string): void {
  output(message, 'error')
}

/**
 * Output debug message
 */
export function debug(message: string, data?: any): void {
  if (shouldOutput('debug')) {
    if (isJson) {
      outputJson({ level: 'debug', message, data })
    } else {
      logger.debug(message, data)
    }
  }
}
