/**
 * Theme Validation command - Validate theme configurations
 */

import pc from 'picocolors'
import fs from 'fs-extra'
import path from 'path'
import fastGlob from 'fast-glob'
import { getLogger } from '../utils/logger.js'
import { ValidationError, handleError } from '../utils/errors.js'
import { success, info, warn } from '../utils/output.js'
import { createBanner, createDivider } from '../ui/banner.js'
import { successMessage, warningMessage, errorMessage } from '../ui/messages.js'
import { createTable } from '../ui/table.js'
import { createSpinner } from '../ui/progress.js'

const logger = getLogger('validate-theme')

/**
 * Required color tokens in a theme
 */
const REQUIRED_COLOR_TOKENS = [
  'primary',
  'primaryForeground',
  'background',
  'foreground',
  'card',
  'cardForeground',
  'muted',
  'mutedForeground',
  'border',
  'destructive',
  'destructiveForeground',
]

/**
 * Optional but recommended color tokens
 */
const RECOMMENDED_COLOR_TOKENS = [
  'secondary',
  'secondaryForeground',
  'accent',
  'accentForeground',
  'popover',
  'popoverForeground',
  'ring',
  'warning',
  'success',
  'info',
]

/**
 * Valid HSL format pattern
 */
const HSL_PATTERN = /^\d{1,3}\s+\d{1,3}%\s+\d{1,3}%$/

/**
 * Valid theme mode values
 */
const VALID_MODES = ['light', 'dark']

/**
 * Valid preset names
 */
const VALID_PRESETS = [
  'default',
  'default-dark',
  'neutral',
  'neutral-dark',
  'vibrant',
  'vibrant-dark',
  'high-contrast',
  'high-contrast-dark',
]

interface ValidationIssue {
  type: 'error' | 'warning' | 'info'
  message: string
  file?: string
  line?: number
  fix?: string
}

interface ValidationResult {
  file: string
  issues: ValidationIssue[]
  isValid: boolean
  score: number // 0-100
}

/**
 * Parse HSL string and validate values
 */
function validateHSL(
  hslString: string,
  tokenName: string
): ValidationIssue | null {
  if (!HSL_PATTERN.test(hslString)) {
    return {
      type: 'error',
      message: `Invalid HSL format for ${tokenName}: "${hslString}"`,
      fix: `Use format "H S% L%" (e.g., "239 84% 56%")`,
    }
  }

  const parts = hslString.split(/\s+/)
  const h = parseInt(parts[0], 10)
  const s = parseInt(parts[1], 10)
  const l = parseInt(parts[2], 10)

  if (h < 0 || h > 360) {
    return {
      type: 'error',
      message: `Invalid hue value for ${tokenName}: ${h} (must be 0-360)`,
    }
  }

  if (s < 0 || s > 100) {
    return {
      type: 'error',
      message: `Invalid saturation value for ${tokenName}: ${s}% (must be 0-100%)`,
    }
  }

  if (l < 0 || l > 100) {
    return {
      type: 'error',
      message: `Invalid lightness value for ${tokenName}: ${l}% (must be 0-100%)`,
    }
  }

  return null
}

/**
 * Calculate WCAG contrast ratio
 */
function getContrastRatio(bg: string, fg: string): number {
  const getLuminance = (hsl: string): number => {
    const parts = hsl.split(/\s+/)
    const h = parseInt(parts[0], 10)
    const s = parseInt(parts[1], 10) / 100
    const l = parseInt(parts[2], 10) / 100

    const c = (1 - Math.abs(2 * l - 1)) * s
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
    const m = l - c / 2

    let r = 0,
      g = 0,
      b = 0

    if (h < 60) {
      r = c
      g = x
    } else if (h < 120) {
      r = x
      g = c
    } else if (h < 180) {
      g = c
      b = x
    } else if (h < 240) {
      g = x
      b = c
    } else if (h < 300) {
      r = x
      b = c
    } else {
      r = c
      b = x
    }

    r += m
    g += m
    b += m

    const toLinear = (v: number) =>
      v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)

    return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
  }

  const l1 = getLuminance(bg)
  const l2 = getLuminance(fg)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)

  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Validate theme colors for WCAG compliance
 */
function validateContrast(colors: Record<string, string>): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  const contrastPairs = [
    { bg: 'background', fg: 'foreground', minRatio: 4.5, label: 'text' },
    { bg: 'background', fg: 'primary', minRatio: 4.5, label: 'primary text' },
    {
      bg: 'background',
      fg: 'mutedForeground',
      minRatio: 4.5,
      label: 'muted text',
    },
    { bg: 'card', fg: 'cardForeground', minRatio: 4.5, label: 'card text' },
    {
      bg: 'primary',
      fg: 'primaryForeground',
      minRatio: 4.5,
      label: 'primary button',
    },
    {
      bg: 'destructive',
      fg: 'destructiveForeground',
      minRatio: 4.5,
      label: 'destructive button',
    },
  ]

  for (const pair of contrastPairs) {
    if (colors[pair.bg] && colors[pair.fg]) {
      const ratio = getContrastRatio(colors[pair.bg], colors[pair.fg])

      if (ratio < pair.minRatio) {
        issues.push({
          type: 'error',
          message: `Low contrast for ${pair.label}: ${ratio.toFixed(2)}:1 (minimum ${pair.minRatio}:1 for WCAG AA)`,
          fix: `Increase contrast between ${pair.bg} and ${pair.fg}`,
        })
      } else if (ratio < 7) {
        issues.push({
          type: 'info',
          message: `${pair.label} contrast: ${ratio.toFixed(2)}:1 (AA compliant, AAA requires 7:1)`,
        })
      }
    }
  }

  return issues
}

/**
 * Validate theme structure
 */
function validateThemeStructure(content: string): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  // Check for required sections
  if (!content.includes('colors')) {
    issues.push({
      type: 'error',
      message: 'Missing "colors" configuration',
    })
  }

  // Check for proper mode setting
  if (content.includes('mode:') || content.includes('mode :')) {
    const modeMatch = content.match(/mode\s*:\s*['"](\w+)['"]/)
    if (modeMatch && !VALID_MODES.includes(modeMatch[1])) {
      issues.push({
        type: 'error',
        message: `Invalid mode: "${modeMatch[1]}"`,
        fix: `Use one of: ${VALID_MODES.join(', ')}`,
      })
    }
  }

  // Check for preset usage
  const presetMatch = content.match(/preset\s*:\s*['"]([^'"]+)['"]/)
  if (presetMatch && !VALID_PRESETS.includes(presetMatch[1])) {
    issues.push({
      type: 'warning',
      message: `Unknown preset: "${presetMatch[1]}"`,
      fix: `Use one of: ${VALID_PRESETS.join(', ')}`,
    })
  }

  return issues
}

/**
 * Scan for theme files and validate them
 */
async function scanAndValidateThemes(cwd: string): Promise<ValidationResult[]> {
  const spinner = createSpinner('Scanning for theme configurations...')
  spinner.start()

  try {
    // Find all TypeScript/JavaScript files that might contain theme config
    const files = await fastGlob('**/*.{ts,tsx,js,jsx}', {
      cwd,
      ignore: [
        '**/node_modules/**',
        '**/dist/**',
        '**/.next/**',
        '**/build/**',
      ],
    })

    const results: ValidationResult[] = []

    for (const file of files) {
      const fullPath = path.join(cwd, file)
      const content = await fs.readFile(fullPath, 'utf-8')

      // Check if file contains theme-related code
      const hasThemeCode =
        content.includes('ThemeProvider') ||
        content.includes('createTheme') ||
        content.includes('colors:') ||
        content.includes('preset:')

      if (!hasThemeCode) continue

      const issues: ValidationIssue[] = []

      // Validate structure
      issues.push(...validateThemeStructure(content))

      // Try to extract and validate color values
      const colorMatches = content.matchAll(
        /(\w+):\s*['"](\d{1,3}\s+\d{1,3}%\s+\d{1,3}%)['"]/g
      )
      const colors: Record<string, string> = {}

      for (const match of colorMatches) {
        const [, tokenName, hslValue] = match
        colors[tokenName] = hslValue

        const hslIssue = validateHSL(hslValue, tokenName)
        if (hslIssue) {
          hslIssue.file = file
          issues.push(hslIssue)
        }
      }

      // Check for required tokens
      if (Object.keys(colors).length > 0) {
        for (const token of REQUIRED_COLOR_TOKENS) {
          if (!colors[token] && content.includes('colors:')) {
            issues.push({
              type: 'warning',
              message: `Missing recommended color token: ${token}`,
              file,
            })
          }
        }

        // Validate contrast ratios
        const contrastIssues = validateContrast(colors)
        for (const issue of contrastIssues) {
          issue.file = file
        }
        issues.push(...contrastIssues)
      }

      if (issues.length > 0) {
        const errorCount = issues.filter((i) => i.type === 'error').length
        const warningCount = issues.filter((i) => i.type === 'warning').length
        const score = Math.max(0, 100 - errorCount * 20 - warningCount * 5)

        results.push({
          file,
          issues,
          isValid: errorCount === 0,
          score,
        })
      }
    }

    spinner.succeed(`Found ${results.length} file(s) with theme configurations`)
    return results
  } catch (error) {
    spinner.fail('Failed to scan files')
    throw error
  }
}

/**
 * Display validation results
 */
function displayResults(results: ValidationResult[]) {
  console.log()
  console.log(createBanner('Theme Validation Report', { gradient: 'rainbow' }))
  console.log()

  const totalIssues = results.reduce((acc, r) => acc + r.issues.length, 0)
  const totalErrors = results.reduce(
    (acc, r) => acc + r.issues.filter((i) => i.type === 'error').length,
    0
  )
  const totalWarnings = results.reduce(
    (acc, r) => acc + r.issues.filter((i) => i.type === 'warning').length,
    0
  )
  const avgScore =
    results.length > 0
      ? Math.round(
          results.reduce((acc, r) => acc + r.score, 0) / results.length
        )
      : 100

  console.log(pc.bold(`  Summary:`))
  console.log(pc.gray(`  ─────────────────────────────────────────`))
  console.log(`  📁 Files analyzed: ${pc.cyan(results.length)}`)
  console.log(`  ❌ Errors: ${pc.red(totalErrors)}`)
  console.log(`  ⚠️  Warnings: ${pc.yellow(totalWarnings)}`)
  console.log(
    `  📊 Average score: ${avgScore >= 80 ? pc.green(avgScore) : avgScore >= 60 ? pc.yellow(avgScore) : pc.red(avgScore)}/100`
  )
  console.log()

  // Show details per file
  for (const result of results) {
    const scoreColor =
      result.score >= 80 ? pc.green : result.score >= 60 ? pc.yellow : pc.red

    console.log(
      pc.bold(
        `  ${result.isValid ? '✅' : '❌'} ${result.file} (Score: ${scoreColor(result.score)})`
      )
    )

    const data = result.issues.map((issue) => ({
      Type:
        issue.type === 'error'
          ? pc.red('error')
          : issue.type === 'warning'
            ? pc.yellow('warn')
            : pc.blue('info'),
      Message: issue.message,
      Fix: issue.fix || '',
    }))

    if (data.length > 0) {
      const columns = [
        { header: 'Type', key: 'Type', width: 8 },
        { header: 'Message', key: 'Message' },
        { header: 'Fix', key: 'Fix' },
      ]
      const table = createTable(data, columns, {
        headerColor: pc.blue,
      })
      console.log(table)
    }
    console.log()
  }
}

/**
 * Main validate-theme command
 */
export async function validateThemeCommand(options: {
  path?: string
  strict?: boolean
  json?: boolean
}) {
  try {
    const cwd = options.path || process.cwd()

    if (!process.argv.includes('--json') && !process.argv.includes('--quiet')) {
      console.log()
      console.log(pc.bold(pc.blue('🎨 Clarity Chat Theme Validator')))
      console.log(pc.gray('   Validate theme configurations and accessibility'))
      console.log()
    }

    // Scan and validate themes
    const results = await scanAndValidateThemes(cwd)

    if (results.length === 0) {
      console.log()
      console.log(
        successMessage('No theme configurations found to validate!', {
          title: '✨ Complete',
          borderColor: 'green',
        })
      )
      return
    }

    // Display results
    if (options.json) {
      console.log(JSON.stringify(results, null, 2))
    } else {
      displayResults(results)
    }

    // Check if strict mode and has errors
    const hasErrors = results.some((r) => !r.isValid)
    if (options.strict && hasErrors) {
      console.log()
      console.log(
        errorMessage('Validation failed in strict mode', {
          title: '❌ Errors Found',
          borderColor: 'red',
        })
      )
      process.exit(1)
    }

    // Final message
    if (!hasErrors) {
      console.log()
      console.log(
        successMessage('All theme configurations are valid!', {
          title: '✨ Passed',
          borderColor: 'green',
        })
      )
    }
  } catch (error) {
    handleError(error)
  }
}
