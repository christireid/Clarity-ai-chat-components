/**
 * Analyze command - Analyze project structure and usage
 */

import pc from 'picocolors'
import ora from 'ora'
import fs from 'fs-extra'
import path from 'path'
import fastGlob from 'fast-glob'
import { getLogger } from '../utils/logger.js'
import { handleError } from '../utils/errors.js'
import {
  success,
  info,
  warn,
  outputJson,
  outputTable,
} from '../utils/output.js'
import { createBanner, createDivider } from '../ui/banner.js'
import { successMessage, infoMessage } from '../ui/messages.js'
import { createTable } from '../ui/table.js'
import { createSpinner } from '../ui/progress.js'


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
    const files = await fastGlob(['src/**/*.{ts,tsx,js,jsx}'], {
      cwd: process.cwd(),
      ignore: [
        '**/node_modules/**',
        '**/dist/**',
        '**/*.test.*',
        '**/*.spec.*',
      ],
    })

    result.totalFiles = files.length

    // Track component and hook usage
    const componentUsage = new Map<string, Set<string>>()
    const hookUsage = new Map<string, Set<string>>()

    // Analyze each file
    for (const file of files) {
      const content = await fs.readFile(path.join(process.cwd(), file), 'utf8')

      // Find Clarity Chat imports
      const importRegex =
        /import\s+{([^}]+)}\s+from\s+['"]@clarity-chat\/react['"]/g
      const matches = content.matchAll(importRegex)

      for (const match of matches) {
        const imports = match[1]
          .split(',')
          .map((i) => i.trim())
          .filter(Boolean)

        imports.forEach((importName) => {
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
      const hasChat = result.components.some((c) => c.name.includes('Chat'))
      if (!hasChat) {
        result.recommendations.push(
          'Add ChatWindow or ChatInterface for a complete chat experience.'
        )
      }

      const hasModelSelector = result.components.some((c) =>
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
async function displayResults(result: AnalysisResult) {
  if (process.argv.includes('--json') || process.argv.includes('--quiet')) {
    // Simple output for JSON/quiet mode
    console.log(pc.bold(pc.blue('\n📊 Project Analysis\n')))
    console.log(`Total files scanned: ${pc.cyan(result.totalFiles)}`)
    console.log(`Total imports: ${pc.cyan(result.totalImports)}`)
    console.log(`Components used: ${pc.cyan(result.components.length)}`)
    console.log(`Hooks used: ${pc.cyan(result.hooks.length)}`)
    return
  }

  console.log()
  console.log(createDivider(undefined, 60))
  console.log()

  // Summary table
  const summaryData = [
    { Metric: 'Total files scanned', Value: result.totalFiles.toString() },
    { Metric: 'Total imports', Value: result.totalImports.toString() },
    { Metric: 'Components used', Value: result.components.length.toString() },
    { Metric: 'Hooks used', Value: result.hooks.length.toString() },
  ]
  const summaryColumns = [
    { header: 'Metric', key: 'Metric', width: 25 },
    { header: 'Value', key: 'Value' },
  ]
  const summaryTable = createTable(summaryData, summaryColumns, {
    headerColor: pc.blue,
  })
  console.log(summaryTable)
  console.log()

  // Top components table
  if (result.components.length > 0) {
    console.log(pc.bold(pc.cyan('  Most Used Components')))
    console.log(createDivider(undefined, 50))
    const componentData = result.components
      .slice(0, 10)
      .map((component, index) => ({
        Component: `${index + 1}. ${component.name}`,
        Usage: `used in ${component.importCount} file(s)`,
      }))
    const componentColumns = [
      { header: 'Component', key: 'Component', width: 30 },
      { header: 'Usage', key: 'Usage' },
    ]
    const componentTable = createTable(componentData, componentColumns, {
      headerColor: pc.cyan,
      compact: true,
    })
    console.log(componentTable)
    console.log()
  }

  // Top hooks table
  if (result.hooks.length > 0) {
    console.log(pc.bold(pc.cyan('  Most Used Hooks')))
    console.log(createDivider(undefined, 50))
    const hookData = result.hooks.slice(0, 5).map((hook, index) => ({
      Hook: `${index + 1}. ${hook.name}`,
      Usage: `used in ${hook.importCount} file(s)`,
    }))
    const hookColumns = [
      { header: 'Hook', key: 'Hook', width: 30 },
      { header: 'Usage', key: 'Usage' },
    ]
    const hookTable = createTable(hookData, hookColumns, {
      headerColor: pc.cyan,
      compact: true,
    })
    console.log(hookTable)
    console.log()
  }

  // Unused components warning
  if (result.unusedComponents.length > 0) {
    console.log()
    console.log(pc.bold(pc.yellow('  ⚠️  Unused Components')))
    console.log(createDivider(undefined, 50))
    result.unusedComponents.forEach((component) => {
      console.log(pc.gray(`    • ${component}`))
    })
    console.log(
      pc.gray(
        '\n    Consider removing unused dependencies to reduce bundle size.'
      )
    )
    console.log()
  }

  // Recommendations
  if (result.recommendations.length > 0) {
    console.log()
    console.log(pc.bold(pc.cyan('  💡 Recommendations')))
    console.log(createDivider(undefined, 50))
    result.recommendations.forEach((rec) => {
      console.log(pc.gray(`    • ${rec}`))
    })
    console.log()
  }

  console.log(createDivider(undefined, 60))
  console.log()
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

    spinner.succeed(`Reports saved to ${pc.cyan('clarity-reports/')}`)
    console.log(`  ${pc.gray(jsonPath)}`)
    console.log(`  ${pc.gray(mdPath)}`)
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

${
  result.recommendations.length > 0
    ? `
## Recommendations

${result.recommendations.map((r) => `- ${r}`).join('\n')}
`
    : ''
}

---

Generated by Clarity Chat CLI
`
}

/**
 * Main analyze command
 */
export async function analyzeCommand(options: {
  report?: boolean
  verbose?: boolean
}) {
  try {
    if (!process.argv.includes('--json') && !process.argv.includes('--quiet')) {
      console.log('\n')
      console.log(createBanner('Project Analysis', { gradient: 'atlas' }))
      console.log()
    }

    const result = await analyzeProject()

    if (process.argv.includes('--json')) {
      outputJson(result)
      return
    }

    await displayResults(result)

    if (options.report) {
      await generateReport(result)
    }

    if (options.verbose) {
      info('\nDetailed usage by file:')
      result.components.forEach((component) => {
        console.log(pc.yellow(`\n${component.name}:`))
        component.files.forEach((file) => {
          console.log(pc.gray(`  ${file}`))
        })
      })
    }

    if (!process.argv.includes('--json') && !process.argv.includes('--quiet')) {
      console.log()
      console.log(
        successMessage('Analysis complete!', {
          title: '✅ Complete',
          borderColor: 'green',
        })
      )
    } else {
      success('Analysis complete!')
    }
  } catch (error) {
    handleError(error)
  }
}
