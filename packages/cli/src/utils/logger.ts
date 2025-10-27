/**
 * Simple logging utility
 */

import chalk from 'chalk'

export interface Logger {
  info: (message: string, ...args: any[]) => void
  warn: (message: string, ...args: any[]) => void
  error: (message: string | Error, ...args: any[]) => void
  success: (message: string, ...args: any[]) => void
  debug: (message: string, ...args: any[]) => void
}

export function getLogger(namespace: string): Logger {
  const prefix = chalk.gray(`[${namespace}]`)

  return {
    info: (message: string, ...args: any[]) => {
      console.log(prefix, chalk.blue('ℹ'), message, ...args)
    },

    warn: (message: string, ...args: any[]) => {
      console.warn(prefix, chalk.yellow('⚠'), message, ...args)
    },

    error: (message: string | Error, ...args: any[]) => {
      const errorMessage = message instanceof Error ? message.message : message
      console.error(prefix, chalk.red('✖'), errorMessage, ...args)
      
      if (message instanceof Error && message.stack) {
        console.error(chalk.gray(message.stack))
      }
    },

    success: (message: string, ...args: any[]) => {
      console.log(prefix, chalk.green('✔'), message, ...args)
    },

    debug: (message: string, ...args: any[]) => {
      if (process.env.DEBUG) {
        console.log(prefix, chalk.magenta('🐛'), message, ...args)
      }
    },
  }
}
