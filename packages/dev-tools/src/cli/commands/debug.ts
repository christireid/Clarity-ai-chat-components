/**
 * Debug command
 *
 * Debugging utilities for Clarity Chat applications
 */

import { Command } from 'commander'
import { createLogger, type LogLevel } from '../../debug/logger'
import { successBox, infoBox, warningBox } from '../../ui/box'
import { keyValueTable } from '../../ui/table'
import { sleep } from '@clarity-chat/utils'
import chalk from 'chalk'

export const debugCommand = new Command('debug').description(
  'Debug utilities for Clarity Chat applications'
)

// Subcommand: env - Display environment info
debugCommand
  .command('env')
  .description('Display current environment information')
  .option('--json', 'Output as JSON')
  .action((options) => {
    const envInfo: Record<string, string> = {
      'Node Version': process.version,
      Platform: process.platform,
      Architecture: process.arch,
      'Working Directory': process.cwd(),
      NODE_ENV: process.env.NODE_ENV || '(not set)',
      LOG_LEVEL: process.env.LOG_LEVEL || '(not set)',
    }

    // Check for API keys (masked)
    const apiKeys = [
      { env: 'OPENAI_API_KEY', name: 'OpenAI' },
      { env: 'ANTHROPIC_API_KEY', name: 'Anthropic' },
      { env: 'GOOGLE_API_KEY', name: 'Google AI' },
    ]

    for (const key of apiKeys) {
      const value = process.env[key.env]
      if (value) {
        envInfo[`${key.name} API Key`] =
          `${value.slice(0, 8)}...${value.slice(-4)} (${value.length} chars)`
      } else {
        envInfo[`${key.name} API Key`] = chalk.dim('(not set)')
      }
    }

    if (options.json) {
      // For JSON, don't show partial key values
      const jsonOutput: Record<string, string | boolean> = {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        cwd: process.cwd(),
        nodeEnv: process.env.NODE_ENV || '',
        logLevel: process.env.LOG_LEVEL || '',
        hasOpenAIKey: !!process.env.OPENAI_API_KEY,
        hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
        hasGoogleKey: !!process.env.GOOGLE_API_KEY,
      }
      console.debug(JSON.stringify(jsonOutput, null, 2))
    } else {
      console.debug()
      console.debug(infoBox(keyValueTable(envInfo), 'Environment Information'))
      console.debug()
    }
  })

// Subcommand: log - Test logging
debugCommand
  .command('log')
  .description('Test the logging system')
  .option(
    '-l, --level <level>',
    'Log level (trace, debug, info, warn, error)',
    'info'
  )
  .option(
    '-m, --message <message>',
    'Custom message to log',
    'Test log message'
  )
  .action((options) => {
    const logger = createLogger({
      level: options.level as LogLevel,
      timestamps: true,
      colors: true,
    })

    console.debug()
    console.debug(chalk.bold.blue('Testing logger at all levels...'))
    console.debug()

    logger.trace('This is a trace message', { detail: 'finest level' })
    console.debug('This is a debug message', { detail: 'debugging info' })
    console.info('This is an info message', { detail: 'general info' })
    console.warn('This is a warning message', { detail: 'something to watch' })
    console.error('This is an error message', { detail: 'something went wrong' })

    console.debug()
    console.debug(chalk.bold.blue('Custom message:'))
    console.info(options.message, { level: options.level })

    console.debug()
    console.debug(successBox(`Logger test complete at level: ${options.level}`))
    console.debug()
  })

// Subcommand: timing - Test timing utilities
debugCommand
  .command('timing')
  .description('Test timing/performance utilities')
  .option('-d, --delay <ms>', 'Simulated delay in milliseconds', '100')
  .action(async (options) => {
    const logger = createLogger({ level: 'debug' })
    const delay = parseInt(options.delay)

    console.debug()
    console.debug(chalk.bold.blue(`Testing timing with ${delay}ms delay...`))
    console.debug()

    logger.time('Operation 1')
    await sleep(delay)
    logger.timeEnd('Operation 1')

    logger.time('Operation 2')
    await sleep(delay * 2)
    logger.timeEnd('Operation 2')

    logger.time('Nested operations')
    logger.time('Sub-operation A')
    await sleep(delay / 2)
    logger.timeEnd('Sub-operation A')
    logger.time('Sub-operation B')
    await sleep(delay / 2)
    logger.timeEnd('Sub-operation B')
    logger.timeEnd('Nested operations')

    console.debug()
    console.debug(successBox('Timing test complete'))
    console.debug()
  })

// Subcommand: request - Simulate API request debugging
debugCommand
  .command('request')
  .description('Debug a simulated API request')
  .option(
    '-p, --provider <provider>',
    'AI provider (openai, anthropic, google)',
    'openai'
  )
  .option('-m, --model <model>', 'Model name', 'gpt-4-turbo')
  .action((options) => {
    const logger = createLogger({
      level: 'debug',
      prefix: `[${options.provider}]`,
    })

    console.debug()
    console.debug(chalk.bold.blue('Simulating API request debugging...'))
    console.debug()

    // Simulate request lifecycle
    logger.time('Total Request')

    console.info('Preparing request', {
      provider: options.provider,
      model: options.model,
    })

    console.debug('Request headers', {
      'Content-Type': 'application/json',
      Authorization: 'Bearer sk-***',
    })

    console.debug('Request body', {
      model: options.model,
      messages: [{ role: 'user', content: 'Hello!' }],
      max_tokens: 100,
    })

    // Simulate response
    console.info('Received response', {
      status: 200,
      latency: '245ms',
    })

    console.debug('Response body', {
      id: 'chatcmpl-abc123',
      model: options.model,
      usage: {
        prompt_tokens: 10,
        completion_tokens: 25,
        total_tokens: 35,
      },
    })

    logger.timeEnd('Total Request')

    // Summary
    const summary: Record<string, string> = {
      Provider: options.provider,
      Model: options.model,
      Status: chalk.green('200 OK'),
      Tokens: '35 total (10 prompt + 25 completion)',
      'Estimated Cost': '$0.001',
    }

    console.debug()
    console.debug(infoBox(keyValueTable(summary), 'Request Summary'))
    console.debug()
  })

// sleep is now imported from @clarity-chat/utils
