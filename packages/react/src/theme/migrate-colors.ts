/**
 * Color Token Migration Codemod
 *
 * A utility script to help migrate hardcoded color values to semantic design tokens.
 * Run via: npx ts-node packages/react/src/theme/migrate-colors.ts [path]
 *
 * @example
 * // Migrate a single file
 * npx ts-node packages/react/src/theme/migrate-colors.ts src/components/Button.tsx
 *
 * // Migrate a directory
 * npx ts-node packages/react/src/theme/migrate-colors.ts src/components/
 */

import * as fs from 'fs'
import * as path from 'path'

/**
 * Color mapping from hardcoded Tailwind colors to semantic tokens
 */
export const colorMigrationMap: Record<string, string> = {
  // Gray scale → Semantic tokens
  'bg-gray-50': 'bg-muted',
  'bg-gray-100': 'bg-muted',
  'bg-gray-200': 'bg-muted',
  'bg-gray-400': 'bg-muted-foreground/60',
  'bg-gray-500': 'bg-muted-foreground',
  'bg-gray-800': 'bg-card',
  'bg-gray-900': 'bg-background',
  'text-gray-400': 'text-muted-foreground',
  'text-gray-500': 'text-muted-foreground',
  'text-gray-600': 'text-muted-foreground',
  'text-gray-700': 'text-foreground',
  'text-gray-800': 'text-foreground',
  'text-gray-900': 'text-foreground',
  'border-gray-200': 'border-border',
  'border-gray-300': 'border-border',
  'border-gray-700': 'border-border',

  // White/Black → Card/Background
  'bg-white': 'bg-card',
  'bg-black': 'bg-background',
  'text-white': 'text-primary-foreground',
  'text-black': 'text-foreground',

  // Status colors → Semantic tokens
  'bg-green-500': 'bg-success',
  'bg-green-600': 'bg-success',
  'text-green-500': 'text-success',
  'text-green-600': 'text-success',
  'border-green-200': 'border-success/20',
  'border-green-500': 'border-success',

  'bg-red-500': 'bg-destructive',
  'bg-red-600': 'bg-destructive',
  'text-red-500': 'text-destructive',
  'text-red-600': 'text-destructive',
  'border-red-200': 'border-destructive/20',
  'border-red-500': 'border-destructive',

  'bg-yellow-500': 'bg-warning',
  'bg-yellow-600': 'bg-warning',
  'text-yellow-500': 'text-warning',
  'text-yellow-600': 'text-warning',
  'border-yellow-200': 'border-warning/20',
  'border-yellow-500': 'border-warning',

  'bg-blue-500': 'bg-primary',
  'bg-blue-600': 'bg-primary',
  'bg-blue-50': 'bg-primary/10',
  'bg-blue-100': 'bg-primary/20',
  'text-blue-500': 'text-primary',
  'text-blue-600': 'text-primary',
  'border-blue-200': 'border-primary/20',
  'border-blue-500': 'border-primary',
  'ring-blue-500': 'ring-primary',
  'focus:ring-blue-500': 'focus:ring-primary',

  // Hover states
  'hover:bg-gray-100': 'hover:bg-muted',
  'hover:bg-gray-200': 'hover:bg-muted',
  'hover:bg-gray-700': 'hover:bg-accent',
  'hover:bg-gray-800': 'hover:bg-accent',
  'hover:bg-blue-600': 'hover:bg-primary/90',
  'hover:bg-blue-700': 'hover:bg-primary/80',
  'hover:bg-green-600': 'hover:bg-success/90',
  'hover:bg-red-600': 'hover:bg-destructive/90',
}

/**
 * Patterns that should be flagged for manual review
 */
export const reviewPatterns = [
  // Arbitrary color values
  /bg-\[#[0-9a-fA-F]+\]/g,
  /text-\[#[0-9a-fA-F]+\]/g,
  /border-\[#[0-9a-fA-F]+\]/g,

  // RGB/RGBA values
  /rgb\(\d+,\s*\d+,\s*\d+\)/g,
  /rgba\(\d+,\s*\d+,\s*\d+,\s*[\d.]+\)/g,

  // HSL values (not using CSS variables)
  /hsl\(\d+,\s*\d+%?,\s*\d+%?\)/g,

  // Inline style colors
  /style=\{[^}]*color:/g,
  /style=\{[^}]*backgroundColor:/g,
]

export interface MigrationResult {
  file: string
  changes: Array<{
    line: number
    original: string
    migrated: string
  }>
  reviewNeeded: Array<{
    line: number
    content: string
    reason: string
  }>
}

/**
 * Migrate colors in a single line of code
 */
export function migrateLine(line: string): {
  migrated: string
  changed: boolean
} {
  let migrated = line
  let changed = false

  for (const [original, replacement] of Object.entries(colorMigrationMap)) {
    // Match whole class names only (with word boundaries)
    const regex = new RegExp(`\\b${escapeRegex(original)}\\b`, 'g')
    if (regex.test(migrated)) {
      migrated = migrated.replace(regex, replacement)
      changed = true
    }
  }

  return { migrated, changed }
}

/**
 * Check if a line needs manual review
 */
export function checkForReview(
  line: string,
  lineNumber: number
): Array<{ line: number; content: string; reason: string }> {
  const issues: Array<{ line: number; content: string; reason: string }> = []

  for (const pattern of reviewPatterns) {
    const matches = line.match(pattern)
    if (matches) {
      issues.push({
        line: lineNumber,
        content: line.trim(),
        reason: `Found hardcoded color: ${matches.join(', ')}`,
      })
    }
  }

  return issues
}

/**
 * Migrate a single file
 */
export function migrateFile(filePath: string, dryRun = true): MigrationResult {
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')

  const result: MigrationResult = {
    file: filePath,
    changes: [],
    reviewNeeded: [],
  }

  const migratedLines: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const lineNumber = i + 1

    // Check for patterns needing manual review
    const reviews = checkForReview(line, lineNumber)
    result.reviewNeeded.push(...reviews)

    // Attempt automatic migration
    const { migrated, changed } = migrateLine(line)

    if (changed) {
      result.changes.push({
        line: lineNumber,
        original: line,
        migrated: migrated,
      })
    }

    migratedLines.push(migrated)
  }

  // Write changes if not a dry run
  if (!dryRun && result.changes.length > 0) {
    fs.writeFileSync(filePath, migratedLines.join('\n'))
  }

  return result
}

/**
 * Migrate all files in a directory
 */
export function migrateDirectory(
  dirPath: string,
  dryRun = true
): MigrationResult[] {
  const results: MigrationResult[] = []
  const extensions = ['.tsx', '.ts', '.jsx', '.js']

  function walkDir(dir: string) {
    const files = fs.readdirSync(dir)

    for (const file of files) {
      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)

      if (stat.isDirectory()) {
        // Skip node_modules and hidden directories
        if (!file.startsWith('.') && file !== 'node_modules') {
          walkDir(filePath)
        }
      } else if (extensions.some((ext) => file.endsWith(ext))) {
        const result = migrateFile(filePath, dryRun)
        if (result.changes.length > 0 || result.reviewNeeded.length > 0) {
          results.push(result)
        }
      }
    }
  }

  walkDir(dirPath)
  return results
}

/**
 * Generate a migration report
 */
export function generateReport(results: MigrationResult[]): string {
  const lines: string[] = [
    '# Color Token Migration Report',
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
  ]

  let totalChanges = 0
  let totalReviews = 0

  for (const result of results) {
    totalChanges += result.changes.length
    totalReviews += result.reviewNeeded.length
  }

  lines.push(`## Summary`)
  lines.push('')
  lines.push(`- Files analyzed: ${results.length}`)
  lines.push(`- Automatic migrations: ${totalChanges}`)
  lines.push(`- Items needing review: ${totalReviews}`)
  lines.push('')

  if (totalChanges > 0) {
    lines.push('## Automatic Migrations')
    lines.push('')

    for (const result of results) {
      if (result.changes.length > 0) {
        lines.push(`### ${result.file}`)
        lines.push('')

        for (const change of result.changes) {
          lines.push(`**Line ${change.line}:**`)
          lines.push('```diff')
          lines.push(`- ${change.original.trim()}`)
          lines.push(`+ ${change.migrated.trim()}`)
          lines.push('```')
          lines.push('')
        }
      }
    }
  }

  if (totalReviews > 0) {
    lines.push('## Items Needing Manual Review')
    lines.push('')

    for (const result of results) {
      if (result.reviewNeeded.length > 0) {
        lines.push(`### ${result.file}`)
        lines.push('')

        for (const review of result.reviewNeeded) {
          lines.push(`- **Line ${review.line}**: ${review.reason}`)
          lines.push(`  \`${review.content}\``)
          lines.push('')
        }
      }
    }
  }

  return lines.join('\n')
}

/**
 * Escape special regex characters in a string
 */
function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// CLI entry point
if (require.main === module) {
  const args = process.argv.slice(2)
  const dryRun = !args.includes('--apply')
  const targetPath = args.find((arg) => !arg.startsWith('--')) || '.'

  console.log(`\n🎨 Color Token Migration Tool`)
  console.log(`${'─'.repeat(40)}`)
  console.log(
    `Mode: ${dryRun ? 'Dry Run (use --apply to write changes)' : 'Apply Changes'}`
  )
  console.log(`Target: ${targetPath}`)
  console.log('')

  const stat = fs.statSync(targetPath)
  const results = stat.isDirectory()
    ? migrateDirectory(targetPath, dryRun)
    : [migrateFile(targetPath, dryRun)]

  const report = generateReport(results)
  console.log(report)

  if (dryRun && results.some((r) => r.changes.length > 0)) {
    console.log('\n💡 Run with --apply to apply these changes')
  }
}
