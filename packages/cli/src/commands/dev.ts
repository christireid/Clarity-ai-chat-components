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
      console.log('\n' + chalk.bold.cyan('🔥 Starting development server...\n'))
    }
    
    const spinner = ora('Detecting framework and package manager...').start()

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
      console.log(chalk.gray('─'.repeat(60)))
      success(`Server starting at: http://localhost:${port}`)
      console.log(chalk.gray('─'.repeat(60)))
      console.log(chalk.gray('\nPress Ctrl+C to stop\n'))
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
