import { logger } from '@clarity-chat/utils/logger';
/**
 * dev command - Start development server with hot reload
 * Enhanced with beautiful UI components
 */

import pc from 'picocolors'
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

function validatePort(port: string): number {
  const portNum = parseInt(port, 10)
  if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
    throw new Error(
      `Invalid port "${port}". Port must be a number between 1 and 65535.`
    )
  }
  return portNum
}

export async function devCommand(options: DevOptions) {
  const portString = options.port || '3000'

  // Validate port before proceeding
  let port: number
  try {
    port = validatePort(portString)
  } catch (error) {
    console.log()
    console.log(
      errorBox(
        error instanceof Error ? error.message : 'Invalid port number',
        '✗ Configuration Error'
      )
    )
    console.log()
    process.exit(1)
  }

  console.log()
  console.log(sectionHeader('🔥 Development Server'))
  console.log()

  const spinner = createSpinner('Initializing development server...')
  spinner.start()

  try {
    spinner.succeed('Development server starting')

    const serverUrl = `http://localhost:${port}`

    const infoContent = [
      pc.bold('Server is starting...'),
      '',
      pc.white('URL: ') + pc.cyan(serverUrl),
      pc.white('Status: ') + pc.green('Starting'),
      '',
      pc.gray('Press ') + pc.bold('Ctrl+C') + pc.gray(' to stop'),
    ].join('\n')

    console.log()
    console.log(infoBox(infoContent, '🚀 Server Info'))
    console.log()

    // Open browser if requested
    if (options.open) {
      setTimeout(() => {
        open(serverUrl)
        console.log(pc.gray(`Opening browser: ${serverUrl}`))
      }, 1000)
    }

    // Start the actual dev server
    const devProcess = execa('npm', ['run', 'dev'], {
      stdio: 'inherit',
      env: { PORT: port.toString() },
    })

    await devProcess
  } catch (error) {
    spinner.fail('Failed to start development server')
    logger.error(error instanceof Error ? error : new Error(String(error)))
    console.log()
    console.log(
      errorBox(
        'Failed to start development server. Check the error above.',
        '✗ Error'
      )
    )
    console.log()
    process.exit(1)
  }
}
