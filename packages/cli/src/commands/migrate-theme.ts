/**
 * Theme Migration command - Migrate from legacy to modern theme system
 */

import chalk from 'chalk'
import prompts from 'prompts'
import fs from 'fs-extra'
import path from 'path'
import { glob } from 'glob'
import { getLogger } from '../utils/logger.js'
import { ValidationError, handleError } from '../utils/errors.js'
import { success, info, warn } from '../utils/output.js'
import { createBanner, createDivider } from '../ui/banner.js'
import { successMessage, warningMessage, infoMessage } from '../ui/messages.js'
import { createTable } from '../ui/table.js'
import { createSpinner } from '../ui/progress.js'

const logger = getLogger('migrate-theme')

/**
 * Legacy preset names that need to be migrated
 */
const LEGACY_PRESETS: Record<string, string> = {
  // Map legacy names to modern names
  light: 'default',
  dark: 'default-dark',
  midnight: 'default-dark',
  ocean: 'vibrant',
  'ocean-dark': 'vibrant-dark',
  sunset: 'vibrant',
  'sunset-dark': 'vibrant-dark',
  forest: 'neutral',
  'forest-dark': 'neutral-dark',
  minimal: 'neutral',
  'minimal-dark': 'neutral-dark',
  professional: 'default',
  'professional-dark': 'default-dark',
  accessibility: 'high-contrast',
  'accessibility-dark': 'high-contrast-dark',
}

/**
 * Modern preset names
 */
const MODERN_PRESETS = [
  'default',
  'default-dark',
  'neutral',
  'neutral-dark',
  'vibrant',
  'vibrant-dark',
  'high-contrast',
  'high-contrast-dark',
]

interface MigrationResult {
  file: string
  changes: Array<{
    line: number
    original: string
    migrated: string
    description: string
  }>
  hasBreakingChanges: boolean
}

/**
 * Scan for files that need migration
 */
async function scanForLegacyThemes(cwd: string): Promise<string[]> {
  const spinner = createSpinner('Scanning for legacy theme usage...')
  spinner.start()

  try {
    // Find all TypeScript/JavaScript files
    const files = await glob('**/*.{ts,tsx,js,jsx}', {
      cwd,
      ignore: [
        '**/node_modules/**',
        '**/dist/**',
        '**/.next/**',
        '**/build/**',
      ],
    })

    const filesToMigrate: string[] = []

    for (const file of files) {
      const fullPath = path.join(cwd, file)
      const content = await fs.readFile(fullPath, 'utf-8')

      // Check for legacy theme patterns
      const hasLegacyPatterns =
        // Legacy preset names
        Object.keys(LEGACY_PRESETS).some(
          (preset) =>
            content.includes(`preset: '${preset}'`) ||
            content.includes(`preset: "${preset}"`)
        ) ||
        // Legacy ThemeProvider import patterns
        content.includes("from '@clarity-chat/react/theme'") ||
        // Legacy theme customization patterns
        content.includes('themeConfig.colors') ||
        (content.includes('createTheme({') && content.includes('baseTheme:')) ||
        // Legacy CSS variable patterns
        content.includes('--clarity-chat-') ||
        content.includes('var(--clarity-chat-')

      if (hasLegacyPatterns) {
        filesToMigrate.push(file)
      }
    }

    spinner.succeed(
      `Found ${filesToMigrate.length} file(s) with legacy theme usage`
    )
    return filesToMigrate
  } catch (error) {
    spinner.fail('Failed to scan files')
    throw error
  }
}

/**
 * Analyze a file for specific migration needs
 */
async function analyzeFile(
  cwd: string,
  file: string
): Promise<MigrationResult> {
  const fullPath = path.join(cwd, file)
  const content = await fs.readFile(fullPath, 'utf-8')
  const lines = content.split('\n')

  const changes: MigrationResult['changes'] = []
  let hasBreakingChanges = false

  lines.forEach((line, index) => {
    const lineNum = index + 1

    // Check for legacy preset names
    for (const [legacy, modern] of Object.entries(LEGACY_PRESETS)) {
      if (
        line.includes(`preset: '${legacy}'`) ||
        line.includes(`preset: "${legacy}"`)
      ) {
        changes.push({
          line: lineNum,
          original: line.trim(),
          migrated: line
            .replace(`preset: '${legacy}'`, `preset: '${modern}'`)
            .replace(`preset: "${legacy}"`, `preset: "${modern}"`)
            .trim(),
          description: `Rename preset: ${legacy} → ${modern}`,
        })
      }
    }

    // Check for legacy CSS variable patterns
    if (line.includes('--clarity-chat-')) {
      const migrated = line.replace(/--clarity-chat-/g, '--clarity-')
      changes.push({
        line: lineNum,
        original: line.trim(),
        migrated: migrated.trim(),
        description: 'Update CSS variable prefix: --clarity-chat- → --clarity-',
      })
    }

    // Check for legacy import patterns
    if (line.includes("from '@clarity-chat/react/theme'")) {
      changes.push({
        line: lineNum,
        original: line.trim(),
        migrated: line
          .replace(
            "from '@clarity-chat/react/theme'",
            "from '@clarity-chat/react'"
          )
          .trim(),
        description: 'Update import path (theme exports are now from main)',
      })
    }

    // Check for legacy createTheme with baseTheme
    if (line.includes('createTheme(') && line.includes('baseTheme:')) {
      hasBreakingChanges = true
      changes.push({
        line: lineNum,
        original: line.trim(),
        migrated: '// TODO: Update to use extends: instead of baseTheme:',
        description:
          'Breaking: Replace baseTheme with extends (manual review needed)',
      })
    }

    // Check for direct color manipulation patterns
    if (line.includes('.colors.') && line.includes('=')) {
      hasBreakingChanges = true
      changes.push({
        line: lineNum,
        original: line.trim(),
        migrated: '// TODO: Use createTheme() colors option instead',
        description: 'Breaking: Direct color mutation no longer supported',
      })
    }
  })

  return {
    file,
    changes,
    hasBreakingChanges,
  }
}

/**
 * Apply migrations to a file
 */
async function migrateFile(
  cwd: string,
  file: string,
  result: MigrationResult,
  dryRun: boolean
): Promise<void> {
  if (dryRun) return

  const fullPath = path.join(cwd, file)
  let content = await fs.readFile(fullPath, 'utf-8')

  // Apply non-breaking changes
  for (const change of result.changes) {
    if (!change.migrated.startsWith('// TODO:')) {
      content = content.replace(change.original, change.migrated)
    }
  }

  await fs.writeFile(fullPath, content, 'utf-8')
}

/**
 * Display migration analysis
 */
function displayAnalysis(results: MigrationResult[]) {
  console.log()
  console.log(createBanner('Theme Migration Analysis', { gradient: 'rainbow' }))
  console.log()

  const totalChanges = results.reduce((acc, r) => acc + r.changes.length, 0)
  const breakingFiles = results.filter((r) => r.hasBreakingChanges).length

  console.log(chalk.bold(`  Summary:`))
  console.log(chalk.gray(`  ─────────────────────────────────────────`))
  console.log(`  📁 Files to migrate: ${chalk.cyan(results.length)}`)
  console.log(`  🔄 Total changes: ${chalk.cyan(totalChanges)}`)
  if (breakingFiles > 0) {
    console.log(
      `  ⚠️  Files with breaking changes: ${chalk.yellow(breakingFiles)}`
    )
  }
  console.log()

  // Show details per file
  for (const result of results) {
    console.log(
      chalk.bold(`  ${result.hasBreakingChanges ? '⚠️' : '📄'} ${result.file}`)
    )

    const data = result.changes.map((change) => ({
      Line: `L${change.line}`,
      Change: change.description,
    }))

    if (data.length > 0) {
      const columns = [
        { header: 'Line', key: 'Line', width: 8 },
        { header: 'Change', key: 'Change' },
      ]
      const table = createTable(data, columns, {
        headerColor: result.hasBreakingChanges ? chalk.yellow : chalk.blue,
      })
      console.log(table)
    }
    console.log()
  }
}

/**
 * Display migration guide
 */
function displayMigrationGuide() {
  console.log()
  console.log(createDivider('Migration Guide', 60))
  console.log()

  console.log(chalk.bold('  Modern Theme API:'))
  console.log()
  console.log(chalk.gray('  // Before (legacy)'))
  console.log(
    chalk.red(`  import { ThemeProvider } from '@clarity-chat/react/theme'`)
  )
  console.log(chalk.red(`  <ThemeProvider defaultTheme={{ preset: 'ocean' }}>`))
  console.log()
  console.log(chalk.gray('  // After (modern)'))
  console.log(
    chalk.green(`  import { ThemeProvider } from '@clarity-chat/react'`)
  )
  console.log(
    chalk.green(`  <ThemeProvider defaultTheme={{ preset: 'vibrant' }}>`)
  )
  console.log()

  console.log(chalk.bold('  Creating Custom Themes:'))
  console.log()
  console.log(chalk.gray('  // Before (legacy)'))
  console.log(
    chalk.red(`  const theme = createTheme({ baseTheme: 'light', ... })`)
  )
  console.log()
  console.log(chalk.gray('  // After (modern)'))
  console.log(chalk.green(`  const theme = createTheme({`))
  console.log(chalk.green(`    extends: 'default',`))
  console.log(chalk.green(`    brandColor: '#6366f1',`))
  console.log(chalk.green(`    radius: 'md',`))
  console.log(chalk.green(`  })`))
  console.log()

  console.log(chalk.bold('  Available Modern Presets:'))
  console.log()
  MODERN_PRESETS.forEach((preset) => {
    console.log(chalk.cyan(`    • ${preset}`))
  })
  console.log()
}

/**
 * Main migrate-theme command
 */
export async function migrateThemeCommand(options: {
  path?: string
  dryRun?: boolean
  interactive?: boolean
  yes?: boolean
}) {
  try {
    const cwd = options.path || process.cwd()

    if (!process.argv.includes('--json') && !process.argv.includes('--quiet')) {
      console.log()
      console.log(chalk.blue.bold('🎨 Clarity Chat Theme Migration Tool'))
      console.log(chalk.gray('   Migrate from legacy to modern theme system'))
      console.log()
    }

    // Scan for legacy themes
    const filesToMigrate = await scanForLegacyThemes(cwd)

    if (filesToMigrate.length === 0) {
      console.log()
      console.log(
        successMessage('No legacy theme usage found!', {
          title: '✨ Up to date',
          borderColor: 'green',
        })
      )
      console.log()
      console.log(
        chalk.gray('Your project is already using the modern theme system.')
      )
      return
    }

    // Analyze each file
    const spinner = createSpinner('Analyzing migration requirements...')
    spinner.start()

    const results: MigrationResult[] = []
    for (const file of filesToMigrate) {
      const result = await analyzeFile(cwd, file)
      if (result.changes.length > 0) {
        results.push(result)
      }
    }

    spinner.succeed('Analysis complete')

    if (results.length === 0) {
      console.log()
      console.log(
        successMessage('No migrations needed!', {
          title: '✨ Complete',
          borderColor: 'green',
        })
      )
      return
    }

    // Display analysis
    displayAnalysis(results)

    // Display migration guide
    displayMigrationGuide()

    // Dry run mode
    if (options.dryRun) {
      console.log()
      console.log(
        infoMessage('Dry run complete - no files modified', {
          title: '📝 Dry Run',
          borderColor: 'blue',
        })
      )
      console.log(chalk.gray('Run without --dry-run to apply changes.'))
      return
    }

    // Check for breaking changes
    const hasBreaking = results.some((r) => r.hasBreakingChanges)
    if (hasBreaking) {
      console.log()
      console.log(
        warningMessage(
          'Some files have breaking changes that require manual review.',
          {
            title: '⚠️  Breaking Changes',
            borderColor: 'yellow',
          }
        )
      )
    }

    // Confirm migration
    if (!options.yes) {
      const { confirm } = await prompts({
        type: 'confirm',
        name: 'confirm',
        message: `Apply ${results.reduce((a, r) => a + r.changes.filter((c) => !c.migrated.startsWith('// TODO:')).length, 0)} automatic migration(s)?`,
        initial: true,
      })

      if (!confirm) {
        console.log(chalk.gray('\nMigration cancelled'))
        return
      }
    }

    // Apply migrations
    const migrateSpinner = createSpinner('Applying migrations...')
    migrateSpinner.start()

    for (const result of results) {
      await migrateFile(cwd, result.file, result, false)
    }

    migrateSpinner.succeed('Migrations applied successfully!')

    // Final summary
    console.log()
    console.log(
      successMessage('Theme migration complete!', {
        title: '✨ Complete',
        borderColor: 'green',
      })
    )

    if (hasBreaking) {
      console.log()
      console.log(chalk.yellow.bold('Next steps:'))
      console.log(chalk.gray('  1. Review files marked with // TODO: comments'))
      console.log(chalk.gray('  2. Test your theme in the browser'))
      console.log(
        chalk.gray('  3. Run `npx @clarity-chat/cli doctor` to verify')
      )
    }
  } catch (error) {
    handleError(error)
  }
}
