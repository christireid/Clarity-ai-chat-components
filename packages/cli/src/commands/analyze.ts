/**
 * Analyze command - Analyze project structure and usage
 * Enhanced with beautiful UI components
 */

import chalk from 'chalk'
import fs from 'fs-extra'
import path from 'path'
import { glob } from 'fast-glob'
import { getLogger } from '../utils/logger.js'
import { sectionHeader } from '../ui/banner.js'
import { table, TableColumn, keyValueTable } from '../ui/table.js'
import { createSpinner, ProgressBar } from '../ui/progress.js'
import { successBox, infoBox } from '../ui/box.js'

const logger = getLogger('analyze')

interface AnalysisResult {
  components: ComponentUsage[]
  hooks: HookUsage[]
  totalFiles: number
  totalImports: number
  unusedComponents: string[]
  recommendations: string[]
}

interface ComponentUsage {
  name: string
  importCount: number
  files: string[]
}

interface HookUsage {
  name: string
  importCount: number
  files: string[]
}

/**
 * Analyze project for Clarity Chat usage
 */
async function analyzeProject(): Promise<AnalysisResult> {
  const spinner = createSpinner('Analyzing project...')
  spinner.start()

  try {
    const result: AnalysisResult = {
      components: [],
      hooks: [],
      totalFiles: 0,
      totalImports: 0,
      unusedComponents: [],
      recommendations: [],
    }

    // Find all source files
    spinner.text = 'Scanning source files...'
    const files = await glob(['src/**/*.{ts,tsx,js,jsx}'], {
      cwd: process.cwd(),
      ignore: ['**/node_modules/**', '**/dist/**', '**/*.test.*', '**/*.spec.*'],
    })

    result.totalFiles = files.length

    if (files.length === 0) {
      spinner.warn('No source files found')
      return result
    }

    // Track component and hook usage
    const componentUsage = new Map<string, Set<string>>()
    const hookUsage = new Map<string, Set<string>>()

    // Progress bar for file analysis
    const progressBar = new ProgressBar({
      total: files.length,
      width: 30,
      showPercentage: true,
      showCount: true,
    })

    // Analyze each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      progressBar.update(i + 1, `Analyzing ${path.basename(file)}...`)

      const content = await fs.readFile(path.join(process.cwd(), file), 'utf8')

      // Find Clarity Chat imports
      const importRegex = /import\s+{([^}]+)}\s+from\s+['"]@clarity-chat\/react['"]/g
      const matches = content.matchAll(importRegex)

      for (const match of matches) {
        const imports = match[1]
          .split(',')
          .map(i => i.trim().replace(/as\s+\w+/, '').trim())
          .filter(Boolean)

        imports.forEach(importName => {
          result.totalImports++

          // Categorize as component or hook
          if (importName.startsWith('use')) {
            if (!hookUsage.has(importName)) {
              hookUsage.set(importName, new Set())
            }
            hookUsage.get(importName)!.add(file)
          } else {
            if (!componentUsage.has(importName)) {
              componentUsage.set(importName, new Set())
            }
            componentUsage.get(importName)!.add(file)
          }
        })
      }
    }

    progressBar.complete('Analysis complete')

    // Convert to arrays
    result.components = Array.from(componentUsage.entries())
      .map(([name, files]) => ({
        name,
        importCount: files.size,
        files: Array.from(files),
      }))
      .sort((a, b) => b.importCount - a.importCount)

    result.hooks = Array.from(hookUsage.entries())
      .map(([name, files]) => ({
        name,
        importCount: files.size,
        files: Array.from(files),
      }))
      .sort((a, b) => b.importCount - a.importCount)

    // Generate recommendations
    if (result.components.length === 0 && result.hooks.length === 0) {
      result.recommendations.push(
        'No Clarity Chat components found. Run `clarity-chat add` to get started.'
      )
    } else {
      if (result.components.length < 3) {
        result.recommendations.push(
          'Consider exploring more components to enhance your UI.'
        )
      }

      // Check for common patterns
      const hasChat = result.components.some(c => c.name.includes('Chat'))
      if (!hasChat) {
        result.recommendations.push(
          'Add ChatWindow or ChatInterface for a complete chat experience.'
        )
      }

      const hasModelSelector = result.components.some(c =>
        c.name.includes('ModelSelector')
      )
      if (!hasModelSelector && hasChat) {
        result.recommendations.push(
          'Add ModelSelector to let users choose AI models.'
        )
      }
    }

    spinner.succeed('Analysis complete')
    return result
  } catch (error) {
    spinner.fail('Analysis failed')
    throw error
  }
}

/**
 * Display analysis results with beautiful formatting
 */
function displayResults(result: AnalysisResult) {
  console.log()
  console.log(sectionHeader('📊 Project Analysis'))
  console.log()

  // Summary box
  const summaryData = {
    'Files Scanned': chalk.cyan(result.totalFiles.toString()),
    'Total Imports': chalk.cyan(result.totalImports.toString()),
    'Components Used': chalk.cyan(result.components.length.toString()),
    'Hooks Used': chalk.cyan(result.hooks.length.toString()),
  }

  console.log(infoBox(keyValueTable(summaryData), 'Summary'))
  console.log()

  // Top components table
  if (result.components.length > 0) {
    const componentColumns: TableColumn[] = [
      { header: '#', width: 4, align: 'right' },
      { header: 'Component', width: 30, color: chalk.yellow },
      { header: 'Files', width: 8, align: 'center', color: chalk.cyan },
      { header: 'Usage', width: 20 },
    ]

    const componentData = result.components.slice(0, 10).map((component, index) => {
      const usageBar = '█'.repeat(Math.min(component.importCount, 20))
      return [
        (index + 1).toString(),
        component.name,
        component.importCount.toString(),
        chalk.green(usageBar),
      ]
    })

    console.log(sectionHeader('🏆 Most Used Components'))
    console.log(table(componentData, componentColumns))
    console.log()
  }

  // Top hooks table
  if (result.hooks.length > 0) {
    const hookColumns: TableColumn[] = [
      { header: '#', width: 4, align: 'right' },
      { header: 'Hook', width: 30, color: chalk.magenta },
      { header: 'Files', width: 8, align: 'center', color: chalk.cyan },
      { header: 'Usage', width: 20 },
    ]

    const hookData = result.hooks.slice(0, 10).map((hook, index) => {
      const usageBar = '█'.repeat(Math.min(hook.importCount, 20))
      return [
        (index + 1).toString(),
        hook.name,
        hook.importCount.toString(),
        chalk.green(usageBar),
      ]
    })

    console.log(sectionHeader('🎣 Most Used Hooks'))
    console.log(table(hookData, hookColumns))
    console.log()
  }

  // Unused components warning
  if (result.unusedComponents.length > 0) {
    console.log(sectionHeader('⚠️  Unused Components'))
    result.unusedComponents.forEach(component => {
      console.log(chalk.gray(`  • ${component}`))
    })
    console.log(chalk.gray('\n  Consider removing unused dependencies to reduce bundle size.'))
    console.log()
  }

  // Recommendations
  if (result.recommendations.length > 0) {
    console.log(sectionHeader('💡 Recommendations'))
    result.recommendations.forEach(rec => {
      console.log(chalk.cyan(`  • ${rec}`))
    })
    console.log()
  }
}

/**
 * Generate detailed report
 */
async function generateReport(result: AnalysisResult) {
  const spinner = createSpinner('Generating detailed report...')
  spinner.start()

  try {
    const reportDir = path.join(process.cwd(), 'clarity-reports')
    await fs.ensureDir(reportDir)

    // JSON report
    const jsonPath = path.join(reportDir, 'analysis.json')
    await fs.writeJSON(jsonPath, result, { spaces: 2 })

    // Markdown report
    const mdPath = path.join(reportDir, 'analysis.md')
    const markdown = generateMarkdownReport(result)
    await fs.writeFile(mdPath, markdown)

    spinner.succeed(`Reports saved to ${chalk.cyan('clarity-reports/')}`)
    console.log(chalk.gray(`  ${jsonPath}`))
    console.log(chalk.gray(`  ${mdPath}`))
  } catch (error) {
    spinner.fail('Failed to generate report')
    throw error
  }
}

/**
 * Generate markdown report
 */
function generateMarkdownReport(result: AnalysisResult): string {
  return `# Clarity Chat Analysis Report

Generated: ${new Date().toISOString()}

## Summary

- **Total Files Scanned**: ${result.totalFiles}
- **Total Imports**: ${result.totalImports}
- **Components Used**: ${result.components.length}
- **Hooks Used**: ${result.hooks.length}

## Component Usage

${result.components.map((c, i) => `${i + 1}. **${c.name}** - used in ${c.importCount} file(s)`).join('\n')}

## Hook Usage

${result.hooks.map((h, i) => `${i + 1}. **${h.name}** - used in ${h.importCount} file(s)`).join('\n')}

${result.recommendations.length > 0 ? `
## Recommendations

${result.recommendations.map(r => `- ${r}`).join('\n')}
` : ''}

---

Generated by Clarity Chat CLI
`
}

/**
 * Main analyze command
 */
export async function analyzeCommand(options: { report?: boolean; verbose?: boolean }) {
  console.log()
  console.log(sectionHeader('🔍 Analyzing Clarity Chat Usage'))
  console.log()

  try {
    const result = await analyzeProject()
    displayResults(result)

    if (options.report) {
      await generateReport(result)
    }

    if (options.verbose) {
      console.log()
      console.log(sectionHeader('📁 Detailed Usage by File'))
      result.components.forEach(component => {
        console.log(chalk.yellow(`\n${component.name}:`))
        component.files.forEach(file => {
          console.log(chalk.gray(`  ${file}`))
        })
      })
      console.log()
    }

    console.log(successBox('Analysis complete!', '✓ Success'))
    console.log()
  } catch (error) {
    logger.error(error as Error)
    process.exit(1)
  }
}
