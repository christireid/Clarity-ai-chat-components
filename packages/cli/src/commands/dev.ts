/**
 * dev command - Start development server with hot reload
 * Enhanced with beautiful UI components
 */

import chalk from 'chalk'
import { execa } from 'execa'
import open from 'open'
import { getLogger } from '../utils/logger.js'
import { sectionHeader } from '../ui/banner.js'
import { createSpinner } from '../ui/progress.js'
import { successBox, errorBox, infoBox } from '../ui/box.js'

const logger = getLogger('dev')

interface DevOptions {
  port?: string
  open?: boolean
}

export async function devCommand(options: DevOptions) {
  const port = options.port || '3000'
  
  console.log()
  console.log(sectionHeader('🔥 Development Server'))
  console.log()

  const spinner = createSpinner('Initializing development server...')
  spinner.start()

  try {
    spinner.succeed('Development server starting')
    
    const serverUrl = `http://localhost:${port}`
    
    const infoContent = [
      chalk.bold('Server is starting...'),
      '',
      chalk.white('URL: ') + chalk.cyan(serverUrl),
      chalk.white('Status: ') + chalk.green('Starting'),
      '',
      chalk.gray('Press ') + chalk.bold('Ctrl+C') + chalk.gray(' to stop'),
    ].join('\n')

    console.log()
    console.log(infoBox(infoContent, '🚀 Server Info'))
    console.log()

    // Open browser if requested
    if (options.open) {
      setTimeout(() => {
        open(serverUrl)
        console.log(chalk.gray(`Opening browser: ${serverUrl}`))
      }, 1000)
    }

    // Start the actual dev server
    const devProcess = execa('npm', ['run', 'dev'], {
      stdio: 'inherit',
      env: { PORT: port }
    })

    await devProcess

  } catch (error) {
    spinner.fail('Failed to start development server')
    logger.error(error instanceof Error ? error : new Error(String(error)))
    console.log()
    console.log(errorBox(
      'Failed to start development server. Check the error above.',
      '✗ Error'
    ))
    console.log()
    process.exit(1)
  }
}
