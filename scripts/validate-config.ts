#!/usr/bin/env npx tsx
/**
 * Configuration Validator CLI
 *
 * Validates Clarity Chat project configuration for common issues.
 * Checks package.json, tsconfig.json, and other config files.
 *
 * Usage:
 *   npx tsx scripts/validate-config.ts
 *   npx tsx scripts/validate-config.ts --fix  # Auto-fix some issues
 *
 * @packageDocumentation
 */

import * as fs from 'node:fs'
import * as path from 'node:path'

// ============================================================================
// Types
// ============================================================================

interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
  fixes: string[]
}

interface ValidationContext {
  fix: boolean
  rootDir: string
}

// ============================================================================
// Utilities
// ============================================================================

/**
 * Parse JSON with comments (JSONC) safely.
 * Handles single-line (//) and multi-line comments without breaking URLs in strings.
 */
function parseJsonWithComments(content: string): Record<string, unknown> {
  // State machine to track if we're inside a string
  let result = ''
  let inString = false
  let inSingleLineComment = false
  let inMultiLineComment = false
  let i = 0

  while (i < content.length) {
    const char = content[i]
    const nextChar = content[i + 1]

    // Handle string state
    if (!inSingleLineComment && !inMultiLineComment) {
      if (char === '"' && (i === 0 || content[i - 1] !== '\\')) {
        inString = !inString
        result += char
        i++
        continue
      }
    }

    // If inside a string, just copy characters
    if (inString) {
      result += char
      i++
      continue
    }

    // Check for comment start (outside strings)
    if (!inSingleLineComment && !inMultiLineComment) {
      if (char === '/' && nextChar === '/') {
        inSingleLineComment = true
        i += 2
        continue
      }
      if (char === '/' && nextChar === '*') {
        inMultiLineComment = true
        i += 2
        continue
      }
    }

    // Handle single-line comment end
    if (inSingleLineComment) {
      if (char === '\n') {
        inSingleLineComment = false
        result += char // Keep newline for line counting in errors
      }
      i++
      continue
    }

    // Handle multi-line comment end
    if (inMultiLineComment) {
      if (char === '*' && nextChar === '/') {
        inMultiLineComment = false
        i += 2
        continue
      }
      i++
      continue
    }

    // Regular character outside comments
    result += char
    i++
  }

  // Remove trailing commas (common in tsconfig)
  result = result.replace(/,(\s*[}\]])/g, '$1')

  return JSON.parse(result)
}

// ============================================================================
// Validators
// ============================================================================

function validatePackageJson(ctx: ValidationContext): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    fixes: [],
  }

  const pkgPath = path.join(ctx.rootDir, 'package.json')

  if (!fs.existsSync(pkgPath)) {
    result.errors.push('package.json not found')
    result.valid = false
    return result
  }

  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))

    // Required fields
    if (!pkg.name) {
      result.errors.push('package.json: missing "name"')
    }
    if (!pkg.version) {
      result.errors.push('package.json: missing "version"')
    }

    // Library fields
    if (!pkg.main && !pkg.exports) {
      result.errors.push('package.json: missing "main" or "exports"')
    }
    if (!pkg.types && !pkg.typings) {
      result.warnings.push(
        'package.json: missing "types" (TypeScript declarations won\'t be found)'
      )
    }
    if (!pkg.module && !pkg.exports) {
      result.warnings.push('package.json: missing "module" (ESM entry point)')
    }

    // Exports map for modern bundlers
    if (!pkg.exports) {
      result.warnings.push(
        'package.json: missing "exports" map (recommended for modern bundlers)'
      )
    } else {
      // Check if exports has types
      if (typeof pkg.exports === 'object' && pkg.exports['.']) {
        const mainExport = pkg.exports['.']
        if (typeof mainExport === 'object' && !mainExport.types) {
          result.warnings.push(
            'package.json: exports["."] is missing "types" condition'
          )
        }
      }
    }

    // Peer dependencies for React libraries
    if (pkg.dependencies?.react && !pkg.peerDependencies?.react) {
      result.warnings.push(
        'package.json: "react" should be a peerDependency, not a dependency'
      )
    }

    // Side effects for tree-shaking
    if (pkg.sideEffects === undefined) {
      result.warnings.push(
        'package.json: missing "sideEffects" (may affect tree-shaking)'
      )
    }

    // Files array
    if (!pkg.files) {
      result.warnings.push(
        'package.json: missing "files" (npm will include everything)'
      )
    }

    // Repository and bugs
    if (!pkg.repository) {
      result.warnings.push('package.json: missing "repository"')
    }
    if (!pkg.bugs) {
      result.warnings.push('package.json: missing "bugs" URL')
    }

    // License
    if (!pkg.license) {
      result.warnings.push('package.json: missing "license"')
    }
  } catch (e) {
    result.errors.push(`package.json: ${e}`)
    result.valid = false
  }

  result.valid = result.errors.length === 0
  return result
}

function validateTsConfig(ctx: ValidationContext): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    fixes: [],
  }

  const configPath = path.join(ctx.rootDir, 'tsconfig.json')

  if (!fs.existsSync(configPath)) {
    result.warnings.push('tsconfig.json not found (not a TypeScript project?)')
    return result
  }

  try {
    // Read and parse, handling comments in JSON
    // Use a safer approach that handles comments in tsconfig.json
    const content = fs.readFileSync(configPath, 'utf-8')
    const config = parseJsonWithComments(content)
    const opts = config.compilerOptions || {}

    // Strict mode
    if (!opts.strict) {
      result.warnings.push(
        'tsconfig.json: "strict" mode is not enabled (recommended for better type safety)'
      )
    }

    // Declaration files
    if (!opts.declaration) {
      result.errors.push(
        'tsconfig.json: "declaration" should be true (required for library types)'
      )
    }

    // Declaration maps for better DX
    if (!opts.declarationMap) {
      result.warnings.push(
        'tsconfig.json: "declarationMap" recommended for better IDE navigation'
      )
    }

    // Source maps
    if (!opts.sourceMap) {
      result.warnings.push(
        'tsconfig.json: "sourceMap" recommended for debugging'
      )
    }

    // Module resolution
    if (opts.moduleResolution === 'node') {
      result.warnings.push(
        'tsconfig.json: "moduleResolution": "bundler" recommended for modern projects'
      )
    }

    // skipLibCheck warning
    if (opts.skipLibCheck === true) {
      result.warnings.push(
        'tsconfig.json: "skipLibCheck" is true (may hide type errors in dependencies)'
      )
    }

    // JSX
    if (opts.jsx && !['react-jsx', 'react-jsxdev'].includes(opts.jsx)) {
      result.warnings.push(
        'tsconfig.json: consider "jsx": "react-jsx" for React 17+ projects'
      )
    }
  } catch (e) {
    result.errors.push(`tsconfig.json: ${e}`)
    result.valid = false
  }

  result.valid = result.errors.length === 0
  return result
}

function validateEslint(ctx: ValidationContext): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    fixes: [],
  }

  const configFiles = [
    '.eslintrc.js',
    '.eslintrc.cjs',
    '.eslintrc.json',
    '.eslintrc',
    '.eslintrc.yaml',
    '.eslintrc.yml',
    'eslint.config.js',
    'eslint.config.mjs',
    'eslint.config.cjs',
  ]

  const found = configFiles.find((f) =>
    fs.existsSync(path.join(ctx.rootDir, f))
  )

  if (!found) {
    result.warnings.push(
      'No ESLint config found (recommended for code quality)'
    )
  }

  return result
}

function validatePrettier(ctx: ValidationContext): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    fixes: [],
  }

  const configFiles = [
    '.prettierrc',
    '.prettierrc.json',
    '.prettierrc.yaml',
    '.prettierrc.yml',
    '.prettierrc.js',
    '.prettierrc.cjs',
    'prettier.config.js',
    'prettier.config.cjs',
  ]

  const found = configFiles.find((f) =>
    fs.existsSync(path.join(ctx.rootDir, f))
  )

  // Also check package.json for prettier key
  const pkgPath = path.join(ctx.rootDir, 'package.json')
  let hasPrettierInPkg = false
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
      hasPrettierInPkg = 'prettier' in pkg
    } catch {
      // Ignore
    }
  }

  if (!found && !hasPrettierInPkg) {
    result.warnings.push(
      'No Prettier config found (recommended for consistent formatting)'
    )
  }

  return result
}

function validateGitIgnore(ctx: ValidationContext): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    fixes: [],
  }

  const gitignorePath = path.join(ctx.rootDir, '.gitignore')

  if (!fs.existsSync(gitignorePath)) {
    result.warnings.push('.gitignore not found')
    return result
  }

  const content = fs.readFileSync(gitignorePath, 'utf-8')
  const requiredEntries = [
    'node_modules',
    'dist',
    '.env',
    '.env.local',
    'coverage',
  ]

  for (const entry of requiredEntries) {
    if (!content.includes(entry)) {
      result.warnings.push(`.gitignore: missing "${entry}"`)
    }
  }

  return result
}

// ============================================================================
// Main
// ============================================================================

function printResult(name: string, result: ValidationResult): void {
  const status = result.valid ? '✅' : '❌'
  console.log(`${status} ${name}`)

  for (const error of result.errors) {
    console.log(`   ❌ ${error}`)
  }
  for (const warning of result.warnings) {
    console.log(`   ⚠️  ${warning}`)
  }
  for (const fix of result.fixes) {
    console.log(`   🔧 ${fix}`)
  }
}

async function main() {
  const shouldFix = process.argv.includes('--fix')

  console.log('\n🔍 Clarity Chat Configuration Validator\n')

  const ctx: ValidationContext = {
    fix: shouldFix,
    rootDir: process.cwd(),
  }

  const validations: Array<{
    name: string
    fn: (ctx: ValidationContext) => ValidationResult
  }> = [
    { name: 'package.json', fn: validatePackageJson },
    { name: 'tsconfig.json', fn: validateTsConfig },
    { name: 'ESLint', fn: validateEslint },
    { name: 'Prettier', fn: validatePrettier },
    { name: '.gitignore', fn: validateGitIgnore },
  ]

  let allValid = true
  let totalErrors = 0
  let totalWarnings = 0

  for (const { name, fn } of validations) {
    const result = fn(ctx)
    printResult(name, result)

    if (!result.valid) allValid = false
    totalErrors += result.errors.length
    totalWarnings += result.warnings.length
  }

  console.log('\n' + '─'.repeat(50))
  console.log(
    `\n📊 Summary: ${totalErrors} error(s), ${totalWarnings} warning(s)\n`
  )

  if (allValid && totalWarnings === 0) {
    console.log('✅ All validations passed! Your configuration looks great.\n')
  } else if (allValid) {
    console.log(
      '⚠️  Configuration is valid, but there are warnings to address.\n'
    )
  } else {
    console.log('❌ Configuration has errors that should be fixed.\n')
  }

  console.log('💡 Tips:')
  console.log('   - Run with --fix to auto-fix some issues (coming soon)')
  console.log(
    '   - See https://clarity-chat.dev/setup for recommended configuration'
  )
  console.log('')

  process.exit(allValid ? 0 : 1)
}

main().catch((error) => {
  console.error('❌ Error:', error.message)
  process.exit(1)
})
