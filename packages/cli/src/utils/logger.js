/**
 * Logger utilities for CLI
 */

import chalk from 'chalk'
import ora from 'ora'

export const logger = {
  info: (message) => {
    console.log(chalk.blue('ℹ'), message)
  },
  
  success: (message) => {
    console.log(chalk.green('✔'), message)
  },
  
  warning: (message) => {
    console.log(chalk.yellow('⚠'), message)
  },
  
  error: (message) => {
    console.log(chalk.red('✖'), message)
  },
  
  debug: (message) => {
    if (process.env.DEBUG) {
      console.log(chalk.gray('[DEBUG]'), message)
    }
  },
  
  spinner: (message) => {
    return ora(message)
  }
}

export default logger