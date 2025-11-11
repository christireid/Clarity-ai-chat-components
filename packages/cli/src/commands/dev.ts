/**
 * dev command - Start development server with hot reload
 */

import chalk from 'chalk'
import ora from 'ora'
import { execa } from 'execa'
import open from 'open'
import { getLogger } from '../utils/logger.js'
import { ValidationError, handleError } from '../utils/errors.js'
import { PortSchema, validate } from '../utils/validation.js'
import { detectFramework, detectPackageManager } from '../utils/detect.js'
import { success, info, warn } from '../utils/output.js'
import { createBanner, createDivider } from '../ui/banner.js'
import { successMessage, infoMessage } from '../ui/messages.js'
import { createSpinner } from '../ui/progress.js'

const logger = getLogger('dev')

interface DevOptions {
  port?: string
  open?: boolean
  watch?: boolean
}

export async function devCommand(options: DevOptions) {
  try {
    // Validate port
    const port = options.port 
      ? String(validate(PortSchema, parseInt(options.port), 'Invalid port number'))
      : '3000'
    
    if (!process.argv.includes('--json') && !process.argv.includes('--quiet')) {
      console.log('\n')
      console.log(createBanner('Development Server', { gradient: 'cristal', border: true, borderColor: 'green' }))
      console.log()
    }
    
    const spinner = createSpinner('Detecting framework and package manager...', { color: 'green' })
    spinner.start()

    // Detect framework and package manager
    const cwd = process.cwd()
    const framework = await detectFramework(cwd)
    const packageManager = await detectPackageManager(cwd)

    spinner.succeed(`Detected: ${framework || 'unknown'} framework, ${packageManager} package manager`)

    // Determine dev command based on framework
    const devCommands: Record<string, string[]> = {
      nextjs: ['next', 'dev', '-p', port],
      remix: ['remix', 'dev', '--port', port],
      vite: ['vite', '--port', port],
      astro: ['astro', 'dev', '--port', port],
    }

    const devCommand = framework && devCommands[framework]
      ? devCommands[framework]
      : ['npm', 'run', 'dev']

    // Add port to env if not already in command
    const env: Record<string, string> = { ...process.env }
    if (!devCommand.includes('--port') && !devCommand.includes('-p')) {
      env.PORT = port
    }

    if (!process.argv.includes('--json') && !process.argv.includes('--quiet')) {
      console.log()
      console.log(createDivider(60, '═', 'green'))
      console.log()
      console.log(successMessage(`Server starting at: ${chalk.bold.underline.cyan(`http://localhost:${port}`)}`, {
        title: '🚀 Ready',
        borderColor: 'green',
      }))
      console.log()
      console.log(createDivider(60, '═', 'green'))
      console.log()
      console.log(chalk.gray('Press ') + chalk.bold.white('Ctrl+C') + chalk.gray(' to stop\n'))
    } else {
      info(`Starting server on port ${port}`)
    }

    // Open browser if requested
    if (options.open) {
      setTimeout(() => {
        open(`http://localhost:${port}`).catch(() => {
          warn('Failed to open browser automatically')
        })
      }, 2000)
    }

    // Start the actual dev server
    const devProcess = execa(packageManager === 'npm' ? 'npm' : packageManager, 
      packageManager === 'npm' ? ['run', 'dev'] : devCommand.slice(1), {
      stdio: 'inherit',
      env,
      cwd,
    })

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      devProcess.kill('SIGINT')
      info('Development server stopped')
      process.exit(0)
    })

    await devProcess

  } catch (error: any) {
    if (error.signal === 'SIGINT') {
      // User interrupted, exit gracefully
      info('Development server stopped')
      process.exit(0)
    }
    
    handleError(
      new ValidationError(
        'Failed to start development server',
        [
          'Check if package.json has a "dev" script',
          'Verify dependencies are installed: npm install',
          'Check if port is already in use',
          'Run: clarity-chat doctor to diagnose issues',
        ]
      )
    )
  }
}
