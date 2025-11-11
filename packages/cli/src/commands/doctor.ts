/**
 * doctor command - Check project health and configuration
 */

import chalk from 'chalk'
import ora from 'ora'
import path from 'path'
import fs from 'fs-extra'
import { getLogger } from '../utils/logger.js'
import { ValidationError, ConfigError, handleError } from '../utils/errors.js'
import { loadConfig } from '../utils/config.js'
import { detectFramework, detectPackageManager, isTypeScriptProject, hasTailwind } from '../utils/detect.js'
import { success, info, warn, error, outputJson, outputTable } from '../utils/output.js'
import { ensureEnvInGitignore } from '../utils/security.js'

const logger = getLogger('doctor')

interface DoctorOptions {
  fix?: boolean
}

interface CheckResult {
  status: 'pass' | 'warn' | 'fail'
  message: string
  fix?: () => Promise<void>
  category: string
  severity: 'critical' | 'warning' | 'info'
}

export async function doctorCommand(options: DoctorOptions) {
  try {
    if (!process.argv.includes('--json') && !process.argv.includes('--quiet')) {
      console.log('\n' + chalk.bold.cyan('🩺 Clarity Chat Health Check\n'))
    }
    
    const cwd = process.cwd()
    const checks: Array<{ name: string; result: CheckResult }> = []
    
    // Load config to check configuration
    let config
    try {
      config = await loadConfig(cwd)
    } catch (err) {
      logger.debug('Config not found or invalid', err)
    }

    // Check 1: package.json exists
    const spinner = ora('Checking project structure...').start()
    
    const packageJsonPath = path.join(cwd, 'package.json')
    if (await fs.pathExists(packageJsonPath)) {
      checks.push({
        name: 'package.json',
        result: { 
          status: 'pass', 
          message: 'Found',
          category: 'Project Structure',
          severity: 'info'
        }
      })
    } else {
      checks.push({
        name: 'package.json',
        result: { 
          status: 'fail', 
          message: 'Not found - not in a Node.js project',
          category: 'Project Structure',
          severity: 'critical'
        }
      })
      spinner.fail('Project structure check failed')
      if (process.argv.includes('--json')) {
        outputJson({ checks, summary: { pass: 0, warn: 0, fail: 1 } })
      }
      process.exit(1)
    }

    // Check 2: Clarity Chat dependencies
    const packageJson = await fs.readJson(packageJsonPath)
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies }
    
    const clarityChatPackages = Object.keys(deps).filter(dep => dep.startsWith('@clarity-chat/'))
    const hasClarityChat = clarityChatPackages.length > 0
    
    if (hasClarityChat) {
      checks.push({
        name: 'Clarity Chat packages',
        result: { 
          status: 'pass', 
          message: `Installed (${clarityChatPackages.length} packages)`,
          category: 'Dependencies',
          severity: 'info'
        }
      })
    } else {
      checks.push({
        name: 'Clarity Chat packages',
        result: { 
          status: 'warn', 
          message: 'Not installed - run: clarity-chat init',
          category: 'Dependencies',
          severity: 'warning',
          fix: async () => {
            info('Run: clarity-chat init to install packages')
          }
        }
      })
    }
    
    // Check 2.5: Framework detection
    const detectedFramework = await detectFramework(cwd)
    if (detectedFramework) {
      checks.push({
        name: 'Framework detection',
        result: {
          status: 'pass',
          message: `Detected: ${detectedFramework}`,
          category: 'Project Structure',
          severity: 'info'
        }
      })
    }
    
    // Check 2.6: Package manager detection
    const packageManager = await detectPackageManager(cwd)
    checks.push({
      name: 'Package manager',
      result: {
        status: 'pass',
        message: `Detected: ${packageManager}`,
        category: 'Project Structure',
        severity: 'info'
      }
    })

    // Check 3: .env.local with API keys
    const envPath = path.join(cwd, '.env.local')
    if (await fs.pathExists(envPath)) {
      const envContent = await fs.readFile(envPath, 'utf-8')
      const keyPattern = /^(OPENAI_API_KEY|ANTHROPIC_API_KEY|GOOGLE_API_KEY)=(.+)$/m
      const matches = envContent.match(keyPattern)
      const hasValidKeys = matches && matches[2] && !matches[2].includes('your_') && !matches[2].includes('_key_here')
      
      if (hasValidKeys) {
        const configuredKeys = (envContent.match(/^(OPENAI_API_KEY|ANTHROPIC_API_KEY|GOOGLE_API_KEY)=/gm) || []).length
        checks.push({
          name: 'API keys',
          result: { 
            status: 'pass', 
            message: `Configured (${configuredKeys} keys found)`,
            category: 'Configuration',
            severity: 'info'
          }
        })
      } else {
        checks.push({
          name: 'API keys',
          result: { 
            status: 'warn', 
            message: 'No valid keys found - add with: clarity-chat keys add',
            category: 'Configuration',
            severity: 'warning'
          }
        })
      }
      
      // Check if .env.local is in .gitignore
      const gitignorePath = path.join(cwd, '.gitignore')
      if (await fs.pathExists(gitignorePath)) {
        const gitignoreContent = await fs.readFile(gitignorePath, 'utf-8')
        if (gitignoreContent.includes('.env.local')) {
          checks.push({
            name: '.env.local in .gitignore',
            result: {
              status: 'pass',
              message: 'Protected from git',
              category: 'Security',
              severity: 'info'
            }
          })
        } else {
          checks.push({
            name: '.env.local in .gitignore',
            result: {
              status: 'warn',
              message: 'Not in .gitignore - security risk',
              category: 'Security',
              severity: 'warning',
              fix: async () => {
                await ensureEnvInGitignore(cwd)
                success('Added .env.local to .gitignore')
              }
            }
          })
        }
      }
    } else {
      checks.push({
        name: 'API keys',
        result: { 
          status: 'warn', 
          message: '.env.local not found',
          category: 'Configuration',
          severity: 'warning',
          fix: async () => {
            await fs.writeFile(envPath, `# Clarity Chat API Keys
OPENAI_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here
GOOGLE_API_KEY=your_key_here
`, 'utf-8')
            await ensureEnvInGitignore(cwd)
            success('Created .env.local and added to .gitignore')
          }
        }
      })
    }

    // Check 4: Tailwind CSS
    const hasTailwindConfig = await hasTailwind(cwd)
    if (hasTailwindConfig) {
      checks.push({
        name: 'Tailwind CSS',
        result: { 
          status: 'pass', 
          message: 'Configured',
          category: 'Styling',
          severity: 'info'
        }
      })
    } else {
      checks.push({
        name: 'Tailwind CSS',
        result: { 
          status: 'warn', 
          message: 'Not found - Clarity Chat works best with Tailwind CSS',
          category: 'Styling',
          severity: 'warning'
        }
      })
    }

    // Check 5: TypeScript
    const hasTypeScript = await isTypeScriptProject(cwd)
    if (hasTypeScript) {
      checks.push({
        name: 'TypeScript',
        result: { 
          status: 'pass', 
          message: 'Configured',
          category: 'Language',
          severity: 'info'
        }
      })
    } else {
      checks.push({
        name: 'TypeScript',
        result: { 
          status: 'warn', 
          message: 'Not found - TypeScript recommended for best experience',
          category: 'Language',
          severity: 'warning'
        }
      })
    }
    
    // Check 5.5: Config file
    if (config) {
      checks.push({
        name: 'Config file',
        result: {
          status: 'pass',
          message: 'Found clarity-chat.config.js',
          category: 'Configuration',
          severity: 'info'
        }
      })
    } else {
      checks.push({
        name: 'Config file',
        result: {
          status: 'info',
          message: 'No config file (using defaults)',
          category: 'Configuration',
          severity: 'info'
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

    // Group checks by category
    const checksByCategory = checks.reduce((acc, check) => {
      const category = check.result.category || 'Other'
      if (!acc[category]) acc[category] = []
      acc[category].push(check)
      return acc
    }, {} as Record<string, typeof checks>)

    // Display results
    if (process.argv.includes('--json')) {
      const summary = {
        pass: checks.filter(c => c.result.status === 'pass').length,
        warn: checks.filter(c => c.result.status === 'warn').length,
        fail: checks.filter(c => c.result.status === 'fail').length,
        checks: checks.map(c => ({
          name: c.name,
          status: c.result.status,
          message: c.result.message,
          category: c.result.category,
          severity: c.result.severity,
        })),
      }
      outputJson(summary)
      return
    }

    // Display by category
    Object.entries(checksByCategory).forEach(([category, categoryChecks]) => {
      if (!process.argv.includes('--quiet')) {
        console.log(chalk.bold.cyan(`\n${category}:`))
      }
      categoryChecks.forEach(({ name, result }) => {
        const icon = result.status === 'pass' ? '✅' : result.status === 'warn' ? '⚠️' : '❌'
        const color = result.status === 'pass' ? 'green' : result.status === 'warn' ? 'yellow' : 'red'
        
        if (result.status === 'pass') {
          success(`${name}: ${result.message}`)
        } else if (result.status === 'warn') {
          warn(`${name}: ${result.message}`)
        } else {
          error(`${name}: ${result.message}`)
        }
      })
    })

    // Summary
    const passCount = checks.filter(c => c.result.status === 'pass').length
    const warnCount = checks.filter(c => c.result.status === 'warn').length
    const failCount = checks.filter(c => c.result.status === 'fail').length

    console.log('\n' + chalk.bold('Summary:'))
    success(`Passed: ${passCount}`)
    if (warnCount > 0) warn(`Warnings: ${warnCount}`)
    if (failCount > 0) error(`Failed: ${failCount}`)

    // Auto-fix if requested
    if (options.fix) {
      if (!process.argv.includes('--json') && !process.argv.includes('--quiet')) {
        console.log('\n' + chalk.bold.cyan('Applying fixes...\n'))
      }
      
      const fixableChecks = checks.filter(c => c.result.fix && c.result.status !== 'pass')
      
      if (fixableChecks.length === 0) {
        info('No fixes available')
      } else {
        for (const { name, result } of fixableChecks) {
          const fixSpinner = ora(`Fixing ${name}...`).start()
          try {
            await result.fix!()
            fixSpinner.succeed(`Fixed ${name}`)
            success(`Fixed: ${name}`)
          } catch (err) {
            fixSpinner.fail(`Failed to fix ${name}`)
            logger.error(err)
            error(`Failed to fix: ${name}`)
          }
        }
      }
    }

    // Exit code
    if (failCount > 0) {
      process.exit(1)
    }
  } catch (error) {
    handleError(error)
  }
}
