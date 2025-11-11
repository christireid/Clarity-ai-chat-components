/**
 * Enhanced logging utility with beautiful formatting
 * Inspired by modern CLIs like Vercel, Next.js, and Turbo
 */

import chalk from 'chalk'
import { dim, bold, italic } from 'chalk'

export interface Logger {
  info: (message: string, ...args: any[]) => void
  warn: (message: string, ...args: any[]) => void
  error: (message: string | Error, ...args: any[]) => void
  success: (message: string, ...args: any[]) => void
  debug: (message: string, ...args: any[]) => void
  step: (step: number, total: number, message: string) => void
  section: (title: string) => void
  blank: () => void
}

const ICONS = {
  info: 'ℹ',
  success: '✓',
  warn: '⚠',
  error: '✖',
  debug: '🐛',
  step: '→',
} as const

const COLORS = {
  info: chalk.cyan,
  success: chalk.green,
  warn: chalk.yellow,
  error: chalk.red,
  debug: chalk.magenta,
  step: chalk.blue,
} as const

export function getLogger(namespace?: string): Logger {
  const prefix = namespace ? dim(`[${namespace}]`) : ''

  return {
    info: (message: string, ...args: any[]) => {
      const icon = COLORS.info(ICONS.info)
      const formatted = namespace 
        ? `${prefix} ${icon} ${message}`
        : `${icon} ${message}`
      console.log(formatted, ...args)
    },

    warn: (message: string, ...args: any[]) => {
      const icon = COLORS.warn(ICONS.warn)
      const formatted = namespace
        ? `${prefix} ${icon} ${bold(COLORS.warn(message))}`
        : `${icon} ${bold(COLORS.warn(message))}`
      console.warn(formatted, ...args)
    },

    error: (message: string | Error, ...args: any[]) => {
      const errorMessage = message instanceof Error ? message.message : message
      const icon = COLORS.error(ICONS.error)
      const formatted = namespace
        ? `${prefix} ${icon} ${bold(COLORS.error(errorMessage))}`
        : `${icon} ${bold(COLORS.error(errorMessage))}`
      console.error(formatted, ...args)
      
      if (message instanceof Error && message.stack && process.env.DEBUG) {
        console.error(dim(message.stack))
      }
    },

    success: (message: string, ...args: any[]) => {
      const icon = COLORS.success(ICONS.success)
      const formatted = namespace
        ? `${prefix} ${icon} ${COLORS.success(message)}`
        : `${icon} ${COLORS.success(message)}`
      console.log(formatted, ...args)
    },

    debug: (message: string, ...args: any[]) => {
      if (process.env.DEBUG) {
        const icon = COLORS.debug(ICONS.debug)
        const formatted = namespace
          ? `${prefix} ${icon} ${dim(message)}`
          : `${icon} ${dim(message)}`
        console.log(formatted, ...args)
      }
    },

    step: (step: number, total: number, message: string) => {
      const stepText = dim(`[${step}/${total}]`)
      const icon = COLORS.step(ICONS.step)
      const formatted = namespace
        ? `${prefix} ${stepText} ${icon} ${message}`
        : `${stepText} ${icon} ${message}`
      console.log(formatted)
    },

    section: (title: string) => {
      console.log()
      console.log(bold(COLORS.info(title)))
      console.log(dim('─'.repeat(Math.min(title.length + 4, 60))))
    },

    blank: () => {
      console.log()
    },
  }
}

/**
 * Create a formatted message with consistent styling
 */
export function formatMessage(
  type: 'info' | 'success' | 'warn' | 'error',
  message: string
): string {
  const icon = COLORS[type](ICONS[type])
  return `${icon} ${message}`
}

/**
 * Create a success message
 */
export function success(message: string): string {
  return formatMessage('success', COLORS.success(message))
}

/**
 * Create an error message
 */
export function error(message: string): string {
  return formatMessage('error', bold(COLORS.error(message)))
}

/**
 * Create a warning message
 */
export function warn(message: string): string {
  return formatMessage('warn', bold(COLORS.warn(message)))
}

/**
 * Create an info message
 */
export function info(message: string): string {
  return formatMessage('info', message)
}
