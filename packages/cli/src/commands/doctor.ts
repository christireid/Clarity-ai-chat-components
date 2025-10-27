/**
 * doctor command - Check project health and configuration
 */

import chalk from 'chalk'
import ora from 'ora'
import path from 'path'
import fs from 'fs-extra'
import { getLogger } from '../utils/logger.js'

const logger = getLogger('doctor')

interface DoctorOptions {
  fix?: boolean
}

interface CheckResult {
  status: 'pass' | 'warn' | 'fail'
  message: string
  fix?: () => Promise<void>
}

export async function doctorCommand(options: DoctorOptions) {
  console.log('\n' + chalk.bold.cyan('🩺 Clarity Chat Health Check\n'))
  
  const cwd = process.cwd()
  const checks: Array<{ name: string; result: CheckResult }> = []

  // Check 1: package.json exists
  const spinner = ora('Checking project structure...').start()
  
  const packageJsonPath = path.join(cwd, 'package.json')
  if (await fs.pathExists(packageJsonPath)) {
    checks.push({
      name: 'package.json',
      result: { status: 'pass', message: 'Found' }
    })
  } else {
    checks.push({
      name: 'package.json',
      result: { status: 'fail', message: 'Not found - not in a Node.js project' }
    })
  }

  // Check 2: Clarity Chat dependencies
  if (await fs.pathExists(packageJsonPath)) {
    const packageJson = await fs.readJson(packageJsonPath)
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies }
    
    const hasClarityChat = Object.keys(deps).some(dep => dep.startsWith('@clarity-chat/'))
    
    if (hasClarityChat) {
      checks.push({
        name: 'Clarity Chat packages',
        result: { status: 'pass', message: 'Installed' }
      })
    } else {
      checks.push({
        name: 'Clarity Chat packages',
        result: { 
          status: 'warn', 
          message: 'Not installed - run: clarity-chat init',
          fix: async () => {
            logger.info('Run: clarity-chat init')
          }
        }
      })
    }
  }

  // Check 3: .env.local with API keys
  const envPath = path.join(cwd, '.env.local')
  if (await fs.pathExists(envPath)) {
    const envContent = await fs.readFile(envPath, 'utf-8')
    const hasKeys = /^(OPENAI_API_KEY|ANTHROPIC_API_KEY|GOOGLE_API_KEY)=.+$/m.test(envContent)
    
    if (hasKeys) {
      checks.push({
        name: 'API keys',
        result: { status: 'pass', message: 'Configured in .env.local' }
      })
    } else {
      checks.push({
        name: 'API keys',
        result: { 
          status: 'warn', 
          message: 'No keys found - add with: clarity-chat keys add' 
        }
      })
    }
  } else {
    checks.push({
      name: 'API keys',
      result: { 
        status: 'warn', 
        message: '.env.local not found',
        fix: async () => {
          await fs.writeFile(envPath, `# Clarity Chat API Keys
OPENAI_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here
GOOGLE_API_KEY=your_key_here
`, 'utf-8')
          logger.info('Created .env.local')
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
        message: 'Not found - Clarity Chat works best with Tailwind CSS' 
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
        message: 'Not found - TypeScript recommended for best experience' 
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
        message: 'Not initialized - run: git init' 
      }
    })
  }

  spinner.succeed('Health check complete\n')

  // Display results
  checks.forEach(({ name, result }) => {
    const icon = result.status === 'pass' ? '✅' : result.status === 'warn' ? '⚠️' : '❌'
    const color = result.status === 'pass' ? 'green' : result.status === 'warn' ? 'yellow' : 'red'
    
    console.log(chalk[color](`${icon} ${name}: ${result.message}`))
  })

  // Summary
  const passCount = checks.filter(c => c.result.status === 'pass').length
  const warnCount = checks.filter(c => c.result.status === 'warn').length
  const failCount = checks.filter(c => c.result.status === 'fail').length

  console.log('\n' + chalk.bold('Summary:'))
  console.log(chalk.green(`  ✅ Passed: ${passCount}`))
  if (warnCount > 0) console.log(chalk.yellow(`  ⚠️  Warnings: ${warnCount}`))
  if (failCount > 0) console.log(chalk.red(`  ❌ Failed: ${failCount}`))

  // Auto-fix if requested
  if (options.fix) {
    console.log('\n' + chalk.bold.cyan('Applying fixes...\n'))
    
    for (const { name, result } of checks) {
      if (result.fix && result.status !== 'pass') {
        const fixSpinner = ora(`Fixing ${name}...`).start()
        try {
          await result.fix()
          fixSpinner.succeed(`Fixed ${name}`)
        } catch (error) {
          fixSpinner.fail(`Failed to fix ${name}`)
          logger.error(error)
        }
      }
    }
  }

  // Exit code
  if (failCount > 0) {
    process.exit(1)
  }
}
