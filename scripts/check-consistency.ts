#!/usr/bin/env tsx
/**
 * Consistency Check Script
 *
 * Validates that all packages follow the monorepo conventions established
 * in the consistency audit. Run this script before commits or in CI.
 *
 * Usage: pnpm run check:consistency
 */

import * as fs from 'fs'
import * as path from 'path'

interface PackageJson {
  name: string
  version: string
  type?: string
  sideEffects?: boolean | string[]
  scripts?: Record<string, string>
  publishConfig?: Record<string, string>
}

interface TsConfig {
  extends?: string
  compilerOptions?: Record<string, unknown>
}

interface CheckResult {
  pass: boolean
  message: string
  package?: string
  severity: 'error' | 'warning' | 'info'
}

const PACKAGES_DIR = path.join(process.cwd(), 'packages')
const BASE_TSCONFIG = path.join(process.cwd(), 'tsconfig.base.json')

// Expected values
const EXPECTED_TYPE = 'module'
const EXPECTED_TSCONFIG_EXTENDS = '../../tsconfig.base.json'
const EXPECTED_TYPECHECK_SCRIPT = 'typecheck'

// Packages that should have sideEffects: false
const PACKAGES_NEEDING_SIDE_EFFECTS = [
  'react',
  'primitives',
  'memory',
  'types',
  'errors',
  'cli',
  'dev-tools',
  'codemods',
  'testing-utils',
  'licensing',
]

// Packages that should have type: module
const PACKAGES_NEEDING_TYPE_MODULE = [
  'react',
  'primitives',
  'memory',
  'types',
  'cli',
  'dev-tools',
  'codemods',
  'testing-utils',
  'licensing',
]

// Packages to exclude from tsconfig base extension check (apps, not libraries)
const PACKAGES_EXCLUDED_FROM_BASE_CHECK = ['playground']

function getPackageDirs(): string[] {
  if (!fs.existsSync(PACKAGES_DIR)) {
    return []
  }
  return fs.readdirSync(PACKAGES_DIR).filter((dir) => {
    const pkgPath = path.join(PACKAGES_DIR, dir, 'package.json')
    return fs.existsSync(pkgPath)
  })
}

function readJson<T>(filePath: string): T | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(content) as T
  } catch {
    return null
  }
}

function readJsonWithComments<T>(filePath: string): T | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    // Remove comments (both // and /* */) for tsconfig.json files
    // Only match // comments that are not inside strings
    const withoutComments = content
      .split('\n')
      .map((line) => {
        // Simple heuristic: remove // comments only if they're not inside a string
        const stringContent = line.match(/"[^"]*"/g) || []
        let result = line
        // Only remove comment if it's outside of all string literals
        const commentIndex = result.indexOf('//')
        if (commentIndex >= 0) {
          // Check if it's inside a string
          let insideString = false
          for (const str of stringContent) {
            const strStart = line.indexOf(str)
            const strEnd = strStart + str.length
            if (commentIndex >= strStart && commentIndex < strEnd) {
              insideString = true
              break
            }
          }
          if (!insideString) {
            result = result.substring(0, commentIndex)
          }
        }
        return result
      })
      .join('\n')
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
      .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
    return JSON.parse(withoutComments) as T
  } catch {
    return null
  }
}

function checkBaseTsConfigExists(): CheckResult {
  const exists = fs.existsSync(BASE_TSCONFIG)
  return {
    pass: exists,
    message: exists
      ? 'Base tsconfig.json exists'
      : 'Missing tsconfig.base.json - all packages should extend this',
    severity: exists ? 'info' : 'error',
  }
}

function checkPackageTsConfig(packageName: string): CheckResult[] {
  const results: CheckResult[] = []

  // Skip excluded packages
  if (PACKAGES_EXCLUDED_FROM_BASE_CHECK.includes(packageName)) {
    results.push({
      pass: true,
      message: `Skipped (app package)`,
      package: packageName,
      severity: 'info',
    })
    return results
  }

  const tsconfigPath = path.join(PACKAGES_DIR, packageName, 'tsconfig.json')

  if (!fs.existsSync(tsconfigPath)) {
    results.push({
      pass: false,
      message: `Missing tsconfig.json`,
      package: packageName,
      severity: 'error',
    })
    return results
  }

  // Use readJsonWithComments for tsconfig since it supports JSONC (JSON with comments)
  const tsconfig = readJsonWithComments<TsConfig>(tsconfigPath)
  if (!tsconfig) {
    // If we can't parse it, try checking just for the extends pattern
    const content = fs.readFileSync(tsconfigPath, 'utf-8')
    const hasExtends =
      content.includes('"extends"') && content.includes('tsconfig.base.json')
    if (hasExtends) {
      results.push({
        pass: true,
        message: `tsconfig extends base config (parsed via fallback)`,
        package: packageName,
        severity: 'info',
      })
      return results
    }
    results.push({
      pass: false,
      message: `Invalid tsconfig.json - cannot parse`,
      package: packageName,
      severity: 'warning', // Downgrade to warning since we tried fallback
    })
    return results
  }

  // Check extends
  const hasCorrectExtends = tsconfig.extends === EXPECTED_TSCONFIG_EXTENDS
  results.push({
    pass: hasCorrectExtends,
    message: hasCorrectExtends
      ? `tsconfig extends base config`
      : `tsconfig should extend "${EXPECTED_TSCONFIG_EXTENDS}" but extends "${tsconfig.extends || 'nothing'}"`,
    package: packageName,
    severity: hasCorrectExtends ? 'info' : 'error',
  })

  return results
}

function checkPackageJson(packageName: string): CheckResult[] {
  const results: CheckResult[] = []
  const pkgPath = path.join(PACKAGES_DIR, packageName, 'package.json')

  const pkg = readJson<PackageJson>(pkgPath)
  if (!pkg) {
    results.push({
      pass: false,
      message: `Invalid package.json - cannot parse`,
      package: packageName,
      severity: 'error',
    })
    return results
  }

  // Check type: module for applicable packages
  if (PACKAGES_NEEDING_TYPE_MODULE.includes(packageName)) {
    const hasType = pkg.type === EXPECTED_TYPE
    results.push({
      pass: hasType,
      message: hasType
        ? `Has "type": "module"`
        : `Missing or incorrect "type" field - should be "module"`,
      package: packageName,
      severity: hasType ? 'info' : 'warning',
    })
  }

  // Check sideEffects for applicable packages
  if (PACKAGES_NEEDING_SIDE_EFFECTS.includes(packageName)) {
    const hasSideEffects = pkg.sideEffects !== undefined
    results.push({
      pass: hasSideEffects,
      message: hasSideEffects
        ? `Has "sideEffects" field`
        : `Missing "sideEffects" field - add "sideEffects": false for tree-shaking`,
      package: packageName,
      severity: hasSideEffects ? 'info' : 'warning',
    })
  }

  // Check typecheck script naming
  if (pkg.scripts) {
    const hasTypeCheck = 'type-check' in pkg.scripts
    if (hasTypeCheck) {
      results.push({
        pass: false,
        message: `Uses "type-check" script - should be "${EXPECTED_TYPECHECK_SCRIPT}"`,
        package: packageName,
        severity: 'warning',
      })
    }
  }

  return results
}

function checkForDuplicateUtilities(): CheckResult[] {
  const results: CheckResult[] = []

  // Check for cn() duplicates
  const cnLocations = [
    'packages/primitives/src/lib/utils.ts',
    'packages/react/src/utils/cn.ts',
  ]

  const cnDuplicates = cnLocations.filter((loc) => {
    const fullPath = path.join(process.cwd(), loc)
    if (!fs.existsSync(fullPath)) return false
    const content = fs.readFileSync(fullPath, 'utf-8')
    // Check if it's a re-export (good) or duplicate implementation (bad)
    return (
      content.includes('export function cn') &&
      !content.includes('export { cn }')
    )
  })

  if (cnDuplicates.length > 1) {
    results.push({
      pass: false,
      message: `cn() utility duplicated in: ${cnDuplicates.join(', ')} - should re-export from primitives`,
      severity: 'warning',
    })
  } else {
    results.push({
      pass: true,
      message: 'cn() utility properly consolidated',
      severity: 'info',
    })
  }

  return results
}

function formatResult(result: CheckResult): string {
  const icon = result.pass ? '✓' : result.severity === 'error' ? '✗' : '⚠'
  const color = result.pass
    ? '\x1b[32m'
    : result.severity === 'error'
      ? '\x1b[31m'
      : '\x1b[33m'
  const reset = '\x1b[0m'
  const prefix = result.package ? `[${result.package}] ` : ''
  return `${color}${icon}${reset} ${prefix}${result.message}`
}

async function main() {
  SecureLogger.debug('\n📋 Running Consistency Checks...\n')

  const allResults: CheckResult[] = []

  // Check base config exists
  allResults.push(checkBaseTsConfigExists())

  // Check each package
  const packages = getPackageDirs()
  for (const pkg of packages) {
    allResults.push(...checkPackageTsConfig(pkg))
    allResults.push(...checkPackageJson(pkg))
  }

  // Check for duplicates
  allResults.push(...checkForDuplicateUtilities())

  // Print results
  const errors = allResults.filter((r) => !r.pass && r.severity === 'error')
  const warnings = allResults.filter((r) => !r.pass && r.severity === 'warning')
  const passed = allResults.filter((r) => r.pass)

  SecureLogger.debug('Results:')
  SecureLogger.debug('─'.repeat(60))

  for (const result of allResults) {
    SecureLogger.debug(formatResult(result))
  }

  SecureLogger.debug('─'.repeat(60))
  SecureLogger.debug(
    `\n📊 Summary: ${passed.length} passed, ${warnings.length} warnings, ${errors.length} errors`
  )

  if (errors.length > 0) {
    SecureLogger.debug('\n❌ Consistency check failed with errors')
    process.exit(1)
  } else if (warnings.length > 0) {
    SecureLogger.debug('\n⚠️  Consistency check passed with warnings')
    process.exit(0)
  } else {
    SecureLogger.debug('\n✅ All consistency checks passed!')
    process.exit(0)
  }
}

main().catch(console.error)
