/**
 * doctor command - Check project health and configuration
 * Enhanced with beautiful UI components
 */

import chalk from 'chalk'
import path from 'path'
import fs from 'fs-extra'
import { getLogger } from '../utils/logger.js'
import { sectionHeader } from '../ui/banner.js'
import { table, TableColumn } from '../ui/table.js'
import { createSpinner } from '../ui/progress.js'
import { successBox, errorBox, warningBox, infoBox } from '../ui/box.js'

const logger = getLogger('doctor')

interface DoctorOptions {
  fix?: boolean
}

interface CheckResult {
  status: 'pass' | 'warn' | 'fail'
  message: string
  suggestion?: string
  fix?: () => Promise<void>
}

export async function doctorCommand(options: DoctorOptions) {
  console.log()
  console.log(sectionHeader('🩺 Clarity Chat Health Check'))
  console.log()
  
  const cwd = process.cwd()
  const checks: Array<{ name: string; result: CheckResult }> = []

  // Check 1: package.json exists
  const spinner = createSpinner('Checking project structure...')
  spinner.start()
  
  const packageJsonPath = path.join(cwd, 'package.json')
  if (await fs.pathExists(packageJsonPath)) {
    checks.push({
      name: 'package.json',
      result: { status: 'pass', message: 'Found' }
    })
  } else {
    checks.push({
      name: 'package.json',
      result: { 
        status: 'fail', 
        message: 'Not found',
        suggestion: 'Not in a Node.js project. Run this command from a Node.js project directory.'
      }
    })
  }

  // Check 2: Clarity Chat dependencies
  if (await fs.pathExists(packageJsonPath)) {
    const packageJson = await fs.readJson(packageJsonPath)
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies }
    
    const clarityChatDeps = Object.keys(deps).filter(dep => dep.startsWith('@clarity-chat/'))
    
    if (clarityChatDeps.length > 0) {
      checks.push({
        name: 'Clarity Chat packages',
        result: { 
          status: 'pass', 
          message: `Installed (${clarityChatDeps.length} packages)`,
          suggestion: `Found: ${clarityChatDeps.join(', ')}`
        }
      })
    } else {
      checks.push({
        name: 'Clarity Chat packages',
        result: { 
          status: 'warn', 
          message: 'Not installed',
          suggestion: 'Run: clarity-chat init',
          fix: async () => {
            logger.info('Run: clarity-chat init to install packages')
          }
        }
      })
    }
  }

  // Check 3: .env.local with API keys
  const envPath = path.join(cwd, '.env.local')
  if (await fs.pathExists(envPath)) {
    const envContent = await fs.readFile(envPath, 'utf-8')
    const keys = {
      openai: /^OPENAI_API_KEY=.+$/m.test(envContent),
      anthropic: /^ANTHROPIC_API_KEY=.+$/m.test(envContent),
      google: /^GOOGLE_API_KEY=.+$/m.test(envContent),
    }
    const keyCount = Object.values(keys).filter(Boolean).length
    
    if (keyCount > 0) {
      const configured = Object.entries(keys)
        .filter(([_, has]) => has)
        .map(([name]) => name)
        .join(', ')
      
      checks.push({
        name: 'API keys',
        result: { 
          status: 'pass', 
          message: `Configured (${keyCount}/3)`,
          suggestion: `Found: ${configured}`
        }
      })
    } else {
      checks.push({
        name: 'API keys',
        result: { 
          status: 'warn', 
          message: 'No keys found',
          suggestion: 'Add keys with: clarity-chat keys add <provider>'
        }
      })
    }
  } else {
    checks.push({
      name: 'API keys',
      result: { 
        status: 'warn', 
        message: '.env.local not found',
        suggestion: 'Create .env.local and add API keys',
        fix: async () => {
          await fs.writeFile(envPath, `# Clarity Chat API Keys
# Get your keys from:
# - OpenAI: https://platform.openai.com/api-keys
# - Anthropic: https://console.anthropic.com/
# - Google: https://makersuite.google.com/app/apikey

OPENAI_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here
GOOGLE_API_KEY=your_key_here
`, 'utf-8')
          logger.success('Created .env.local template')
        }
      }
    })
  }

  // Check 4: Tailwind CSS
  const tailwindConfigPath = path.join(cwd, 'tailwind.config.js')
  const tailwindConfigTsPath = path.join(cwd, 'tailwind.config.ts')
  
  if (await fs.pathExists(tailwindConfigPath) || await fs.pathExists(tailwindConfigTsPath)) {
    checks.push({
      name: 'Tailwind CSS',
      result: { status: 'pass', message: 'Configured' }
    })
  } else {
    checks.push({
      name: 'Tailwind CSS',
      result: { 
        status: 'warn', 
        message: 'Not found',
        suggestion: 'Clarity Chat works best with Tailwind CSS. Install: npm install -D tailwindcss'
      }
    })
  }

  // Check 5: TypeScript
  const tsconfigPath = path.join(cwd, 'tsconfig.json')
  if (await fs.pathExists(tsconfigPath)) {
    checks.push({
      name: 'TypeScript',
      result: { status: 'pass', message: 'Configured' }
    })
  } else {
    checks.push({
      name: 'TypeScript',
      result: { 
        status: 'warn', 
        message: 'Not found',
        suggestion: 'TypeScript recommended for best experience'
      }
    })
  }

  // Check 6: Git repository
  const gitPath = path.join(cwd, '.git')
  if (await fs.pathExists(gitPath)) {
    checks.push({
      name: 'Git repository',
      result: { status: 'pass', message: 'Initialized' }
    })
  } else {
    checks.push({
      name: 'Git repository',
      result: { 
        status: 'warn', 
        message: 'Not initialized',
        suggestion: 'Run: git init'
      }
    })
  }

  spinner.succeed('Health check complete')
  console.log()

  // Display results in a beautiful table
  const columns: TableColumn[] = [
    {
      header: 'Check',
      width: 25,
      color: chalk.white,
    },
    {
      header: 'Status',
      width: 12,
      align: 'center',
      color: (text: string) => {
        if (text.includes('✓')) return chalk.green(text)
        if (text.includes('⚠')) return chalk.yellow(text)
        if (text.includes('✗')) return chalk.red(text)
        return text
      },
    },
    {
      header: 'Message',
      width: 30,
    },
  ]

  const tableData = checks.map(({ name, result }) => {
    const statusIcon =
      result.status === 'pass'
        ? chalk.green('✓ Pass')
        : result.status === 'warn'
        ? chalk.yellow('⚠ Warn')
        : chalk.red('✗ Fail')

    return [name, statusIcon, result.message]
  })

  console.log(table(tableData, columns))
  console.log()

  // Summary
  const passCount = checks.filter(c => c.result.status === 'pass').length
  const warnCount = checks.filter(c => c.result.status === 'warn').length
  const failCount = checks.filter(c => c.result.status === 'fail').length
  const total = checks.length

  const summaryContent = [
    chalk.green(`✓ Passed: ${passCount}/${total}`),
    warnCount > 0 ? chalk.yellow(`⚠ Warnings: ${warnCount}/${total}`) : '',
    failCount > 0 ? chalk.red(`✗ Failed: ${failCount}/${total}`) : '',
  ].filter(Boolean).join('\n')

  if (failCount > 0) {
    console.log(errorBox(summaryContent, 'Summary'))
  } else if (warnCount > 0) {
    console.log(warningBox(summaryContent, 'Summary'))
  } else {
    console.log(successBox(summaryContent, 'Summary'))
  }

  // Show suggestions for warnings/failures
  const issues = checks.filter(c => c.result.status !== 'pass' && c.result.suggestion)
  if (issues.length > 0) {
    console.log()
    console.log(sectionHeader('💡 Suggestions'))
    issues.forEach(({ name, result }) => {
      if (result.suggestion) {
        console.log(chalk.cyan(`  • ${name}:`), result.suggestion)
      }
    })
  }

  // Auto-fix if requested
  if (options.fix) {
    console.log()
    console.log(sectionHeader('🔧 Applying Fixes'))
    
    const fixableChecks = checks.filter(c => c.result.fix && c.result.status !== 'pass')
    
    if (fixableChecks.length === 0) {
      console.log(infoBox('No automatic fixes available', 'Info'))
      return
    }

    for (const { name, result } of fixableChecks) {
      const fixSpinner = createSpinner(`Fixing ${name}...`)
      fixSpinner.start()
      try {
        await result.fix!()
        fixSpinner.succeed(`Fixed ${name}`)
      } catch (error) {
        fixSpinner.fail(`Failed to fix ${name}`)
        logger.error(error as Error)
      }
    }
    
    console.log()
    logger.success('Fixes applied! Run doctor again to verify.')
  }

  // Exit code
  if (failCount > 0) {
    process.exit(1)
  }
}
