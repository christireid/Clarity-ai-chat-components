import { getLogger } from '../../debug/logger'

const logger = getLogger('cli-check')

/**
 * Check command
 *
 * Quick health checks for Clarity Chat projects
 */

import { Command } from 'commander'
import { existsSync, readFileSync } from 'fs'
import { join } from 'path'
import { successBox, errorBox, warningBox, infoBox } from '../../ui/box'
import { table, type TableColumn } from '../../ui/table'
import chalk from 'chalk'

interface CheckResult {
  name: string
  status: 'pass' | 'fail' | 'warn'
  message: string
}

export const checkCommand = new Command('check')
  .description('Run health checks on your Clarity Chat project')
  .option('-d, --dir <directory>', 'Project directory to check', process.cwd())
  .option('--json', 'Output results as JSON')
  .action((options) => {
    const dir = options.dir
    const results: CheckResult[] = []

    logger.debug()
    logger.debug(chalk.bold.blue(`Checking project: ${dir}`))
    logger.debug()

    // Check package.json exists
    const packageJsonPath = join(dir, 'package.json')
    if (existsSync(packageJsonPath)) {
      results.push({
        name: 'package.json',
        status: 'pass',
        message: 'Found',
      })

      // Check for AI SDK dependencies
      try {
        const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
        const deps = { ...pkg.dependencies, ...pkg.devDependencies }

        const aiDeps = [
          { name: 'openai', display: 'OpenAI SDK' },
          { name: '@anthropic-ai/sdk', display: 'Anthropic SDK' },
          { name: '@google/generative-ai', display: 'Google AI SDK' },
        ]

        const foundDeps = aiDeps.filter((d) => deps[d.name])

        if (foundDeps.length === 0) {
          results.push({
            name: 'AI SDKs',
            status: 'warn',
            message: 'No AI provider SDKs found in dependencies',
          })
        } else {
          results.push({
            name: 'AI SDKs',
            status: 'pass',
            message: foundDeps.map((d) => d.display).join(', '),
          })
        }

        // Check TypeScript
        if (deps.typescript) {
          results.push({
            name: 'TypeScript',
            status: 'pass',
            message: `v${deps.typescript.replace('^', '').replace('~', '')}`,
          })
        } else {
          results.push({
            name: 'TypeScript',
            status: 'warn',
            message: 'Not installed (recommended)',
          })
        }
      } catch {
        results.push({
          name: 'package.json',
          status: 'fail',
          message: 'Failed to parse package.json',
        })
      }
    } else {
      results.push({
        name: 'package.json',
        status: 'fail',
        message: 'Not found',
      })
    }

    // Check .env.local exists
    const envPaths = ['.env.local', '.env', '.env.development']
    const foundEnv = envPaths.find((p) => existsSync(join(dir, p)))

    if (foundEnv) {
      results.push({
        name: 'Environment file',
        status: 'pass',
        message: `Found ${foundEnv}`,
      })

      // Check for API key placeholders
      try {
        const envContent = readFileSync(join(dir, foundEnv), 'utf-8')
        const hasPlaceholder =
          envContent.includes('your-api-key') ||
          envContent.includes('sk-xxx') ||
          envContent.includes('YOUR_')

        if (hasPlaceholder) {
          results.push({
            name: 'API Keys',
            status: 'warn',
            message: 'Placeholder values detected - update with real keys',
          })
        }
      } catch {
        // Ignore read errors
      }
    } else {
      results.push({
        name: 'Environment file',
        status: 'warn',
        message: 'No .env file found (create .env.local)',
      })
    }

    // Check tsconfig.json
    const tsconfigPath = join(dir, 'tsconfig.json')
    if (existsSync(tsconfigPath)) {
      results.push({
        name: 'tsconfig.json',
        status: 'pass',
        message: 'Found',
      })

      try {
        const tsconfig = JSON.parse(readFileSync(tsconfigPath, 'utf-8'))
        const strict = tsconfig.compilerOptions?.strict

        if (!strict) {
          results.push({
            name: 'TypeScript strict mode',
            status: 'warn',
            message: 'Consider enabling strict mode',
          })
        }
      } catch {
        // Ignore parse errors
      }
    }

    // Check .gitignore
    const gitignorePath = join(dir, '.gitignore')
    if (existsSync(gitignorePath)) {
      try {
        const gitignore = readFileSync(gitignorePath, 'utf-8')

        if (!gitignore.includes('.env')) {
          results.push({
            name: '.gitignore',
            status: 'warn',
            message: '.env files not ignored - add to prevent secrets leak',
          })
        } else {
          results.push({
            name: '.gitignore',
            status: 'pass',
            message: 'Environment files are ignored',
          })
        }
      } catch {
        // Ignore read errors
      }
    }

    // Output results
    if (options.json) {
      logger.debug(JSON.stringify(results, null, 2))
    } else {
      const columns: TableColumn[] = [
        { header: 'Check', width: 25 },
        { header: 'Status', width: 10, align: 'center' },
        { header: 'Details', width: 45 },
      ]

      const data = results.map((r) => [
        r.name,
        r.status === 'pass'
          ? chalk.green('✓ PASS')
          : r.status === 'fail'
            ? chalk.red('✗ FAIL')
            : chalk.yellow('⚠ WARN'),
        r.message,
      ])

      logger.debug(table(data, columns))
      logger.debug()

      // Summary
      const passCount = results.filter((r) => r.status === 'pass').length
      const failCount = results.filter((r) => r.status === 'fail').length
      const warnCount = results.filter((r) => r.status === 'warn').length

      const summary = `Passed: ${passCount}, Warnings: ${warnCount}, Failed: ${failCount}`

      if (failCount > 0) {
        logger.debug(errorBox(summary, 'Check Results'))
      } else if (warnCount > 0) {
        logger.debug(warningBox(summary, 'Check Results'))
      } else {
        logger.debug(successBox(summary, 'Check Results'))
      }
      logger.debug()
    }

    process.exit(results.some((r) => r.status === 'fail') ? 1 : 0)
  })
