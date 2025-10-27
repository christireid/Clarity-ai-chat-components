/**
 * dev command - Start development server with hot reload
 */

import chalk from 'chalk'
import ora from 'ora'
import { execa } from 'execa'
import open from 'open'
import { getLogger } from '../utils/logger.js'

const logger = getLogger('dev')

interface DevOptions {
  port?: string
  open?: boolean
}

export async function devCommand(options: DevOptions) {
  const port = options.port || '3000'
  
  console.log('\n' + chalk.bold.cyan('🔥 Starting development server...\n'))
  
  const spinner = ora('Initializing...').start()

  try {
    spinner.succeed('Development server starting')
    
    console.log(chalk.gray('─'.repeat(60)))
    console.log(chalk.bold.green(`✅ Server running at: `) + chalk.cyan(`http://localhost:${port}`))
    console.log(chalk.gray('─'.repeat(60)))
    console.log(chalk.gray('\nPress Ctrl+C to stop\n'))

    // Open browser if requested
    if (options.open) {
      setTimeout(() => {
        open(`http://localhost:${port}`)
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
    logger.error(error)
    process.exit(1)
  }
}
