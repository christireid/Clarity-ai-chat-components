/**
 * Analyze command - Analyze project structure and usage
 */

import chalk from 'chalk'
import ora from 'ora'
import fs from 'fs-extra'
import path from 'path'
import { glob } from 'fast-glob'

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
  const spinner = ora('Analyzing project...').start()

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
    const files = await glob(['src/**/*.{ts,tsx,js,jsx}'], {
      cwd: process.cwd(),
      ignore: ['**/node_modules/**', '**/dist/**', '**/*.test.*', '**/*.spec.*'],
    })

    result.totalFiles = files.length

    // Track component and hook usage
    const componentUsage = new Map<string, Set<string>>()
    const hookUsage = new Map<string, Set<string>>()

    // Analyze each file
    for (const file of files) {
      const content = await fs.readFile(path.join(process.cwd(), file), 'utf8')

      // Find Clarity Chat imports
      const importRegex = /import\s+{([^}]+)}\s+from\s+['"]@clarity-chat\/react['"]/g
      const matches = content.matchAll(importRegex)

      for (const match of matches) {
        const imports = match[1]
          .split(',')
          .map(i => i.trim())
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

    // Convert to result format
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
 * Display analysis results
 */
function displayResults(result: AnalysisResult) {
  console.log(chalk.blue.bold('\n📊 Project Analysis\n'))

  // Summary
  console.log(chalk.white.bold('Summary'))
  console.log(`  Total files scanned: ${chalk.cyan(result.totalFiles)}`)
  console.log(`  Total imports: ${chalk.cyan(result.totalImports)}`)
  console.log(`  Components used: ${chalk.cyan(result.components.length)}`)
  console.log(`  Hooks used: ${chalk.cyan(result.hooks.length)}`)

  // Top components
  if (result.components.length > 0) {
    console.log(chalk.white.bold('\n\nMost Used Components'))
    result.components.slice(0, 10).forEach((component, index) => {
      console.log(
        `  ${index + 1}. ${chalk.yellow(component.name)} - used in ${chalk.cyan(component.importCount)} file(s)`
      )
    })
  }

  // Top hooks
  if (result.hooks.length > 0) {
    console.log(chalk.white.bold('\n\nMost Used Hooks'))
    result.hooks.slice(0, 5).forEach((hook, index) => {
      console.log(
        `  ${index + 1}. ${chalk.yellow(hook.name)} - used in ${chalk.cyan(hook.importCount)} file(s)`
      )
    })
  }

  // Unused components warning
  if (result.unusedComponents.length > 0) {
    console.log(chalk.yellow.bold('\n\n⚠️  Unused Components'))
    result.unusedComponents.forEach(component => {
      console.log(`  ${chalk.gray(component)}`)
    })
    console.log(chalk.gray('\n  Consider removing unused dependencies to reduce bundle size.'))
  }

  // Recommendations
  if (result.recommendations.length > 0) {
    console.log(chalk.blue.bold('\n\n💡 Recommendations'))
    result.recommendations.forEach(rec => {
      console.log(`  • ${rec}`)
    })
  }

  console.log() // Empty line at end
}

/**
 * Generate detailed report
 */
async function generateReport(result: AnalysisResult) {
  const spinner = ora('Generating detailed report...').start()

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
    console.log(`  ${chalk.gray(jsonPath)}`)
    console.log(`  ${chalk.gray(mdPath)}`)
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
  console.log(chalk.blue.bold('\n🔍 Analyzing Clarity Chat Usage\n'))

  try {
    const result = await analyzeProject()
    displayResults(result)

    if (options.report) {
      await generateReport(result)
    }

    if (options.verbose) {
      console.log(chalk.gray('\n\nDetailed usage by file:'))
      result.components.forEach(component => {
        console.log(chalk.yellow(`\n${component.name}:`))
        component.files.forEach(file => {
          console.log(chalk.gray(`  ${file}`))
        })
      })
    }

    console.log(chalk.green.bold('\n✓ Analysis complete!\n'))
  } catch (error) {
    console.error(chalk.red(`\n❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`))
    process.exit(1)
  }
}

