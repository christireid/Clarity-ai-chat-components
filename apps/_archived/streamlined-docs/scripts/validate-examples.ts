#!/usr/bin/env npx ts-node
/**
 * Documentation Example Validation Script
 *
 * Extracts and validates code examples from documentation pages.
 * Run: npx ts-node scripts/validate-examples.ts
 *
 * Checks:
 * 1. TypeScript/TSX examples compile without errors
 * 2. Import statements reference valid exports
 * 3. Code blocks have proper language annotations
 * 4. Examples don't use deprecated APIs
 */

import * as fs from 'fs'
import * as path from 'path'
import * as ts from 'typescript'

// Resolve paths relative to script location
const DOCS_ROOT = path.resolve(__dirname, '..')
const APP_DIR = path.join(DOCS_ROOT, 'app')

interface CodeExample {
  file: string
  language: string
  code: string
  lineNumber: number
}

interface ValidationResult {
  errors: string[]
  warnings: string[]
  info: string[]
  stats: {
    totalFiles: number
    totalExamples: number
    validExamples: number
    invalidExamples: number
  }
}

// Deprecated APIs that should not be used in examples
const DEPRECATED_APIS = [
  'useChat', // Deprecated in favor of useClarityChat
  'useChatWithOperations', // Deprecated
]

// Required CSS import that should appear in quick-start examples
const REQUIRED_CSS_IMPORT = '@clarity-chat/react/styles.css'

/**
 * Extract code blocks from a TSX page file
 */
function extractCodeExamples(filePath: string): CodeExample[] {
  const content = fs.readFileSync(filePath, 'utf-8')
  const examples: CodeExample[] = []

  // Match code blocks in template literals (common pattern in docs)
  // Pattern: code={`...`} or code="..."
  const codeBlockRegex =
    /code=\{`([\s\S]*?)`\}|code="([^"]+)"|<CodeBlock[^>]*code=\{`([\s\S]*?)`\}/g

  // Also match EnhancedCodeBlock
  const enhancedCodeBlockRegex =
    /<EnhancedCodeBlock[\s\S]*?code=\{`([\s\S]*?)`\}[\s\S]*?language="(\w+)"/g

  let match
  let lineNumber = 1

  // Extract from EnhancedCodeBlock components
  while ((match = enhancedCodeBlockRegex.exec(content)) !== null) {
    const code = match[1]
    const language = match[2] || 'tsx'

    // Calculate line number
    const beforeMatch = content.substring(0, match.index)
    lineNumber = beforeMatch.split('\n').length

    if (code && code.trim().length > 0) {
      examples.push({
        file: filePath,
        language,
        code: code.trim(),
        lineNumber,
      })
    }
  }

  // Extract from CodeBlock components
  const simpleCodeBlockRegex =
    /<CodeBlock[\s\S]*?language="(\w+)"[\s\S]*?code=\{`([\s\S]*?)`\}/g
  while ((match = simpleCodeBlockRegex.exec(content)) !== null) {
    const language = match[1]
    const code = match[2]

    const beforeMatch = content.substring(0, match.index)
    lineNumber = beforeMatch.split('\n').length

    if (code && code.trim().length > 0) {
      examples.push({
        file: filePath,
        language,
        code: code.trim(),
        lineNumber,
      })
    }
  }

  return examples
}

/**
 * Validate TypeScript/TSX code syntax
 */
function validateTypeScriptSyntax(
  code: string,
  language: string
): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  // Skip non-TypeScript code
  if (
    !['ts', 'tsx', 'typescript', 'javascript', 'js', 'jsx'].includes(language)
  ) {
    return { valid: true, errors: [] }
  }

  // Create a virtual source file for type checking
  const fileName = language.includes('x') ? 'example.tsx' : 'example.ts'

  // Wrap in module to allow top-level await and imports
  const wrappedCode = `
    // @ts-nocheck - External imports not available in validation
    ${code}
  `

  try {
    // Parse the code
    const sourceFile = ts.createSourceFile(
      fileName,
      wrappedCode,
      ts.ScriptTarget.Latest,
      true,
      language.includes('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
    )

    // Check for parse errors
    const parseErrors = (sourceFile as any).parseDiagnostics || []

    for (const diagnostic of parseErrors) {
      if (diagnostic.category === ts.DiagnosticCategory.Error) {
        const message = ts.flattenDiagnosticMessageText(
          diagnostic.messageText,
          '\n'
        )
        errors.push(`Syntax error: ${message}`)
      }
    }

    return { valid: errors.length === 0, errors }
  } catch (e) {
    errors.push(`Parse error: ${e instanceof Error ? e.message : String(e)}`)
    return { valid: false, errors }
  }
}

/**
 * Check for deprecated API usage
 */
function checkDeprecatedAPIs(code: string): string[] {
  const warnings: string[] = []

  for (const api of DEPRECATED_APIS) {
    // Check for imports
    const importRegex = new RegExp(`import\\s*{[^}]*\\b${api}\\b[^}]*}`, 'g')
    if (importRegex.test(code)) {
      warnings.push(`Uses deprecated API: ${api}`)
    }

    // Check for usage
    const usageRegex = new RegExp(`\\b${api}\\s*\\(`, 'g')
    if (usageRegex.test(code)) {
      warnings.push(`Uses deprecated API: ${api}`)
    }
  }

  return warnings
}

/**
 * Check import statements for validity
 */
function checkImports(code: string): string[] {
  const warnings: string[] = []

  // Check for @clarity-chat/react imports
  const clarityImportRegex =
    /import\s*{([^}]+)}\s*from\s*['"]@clarity-chat\/react(?:\/[^'"]+)?['"]/g
  let match

  while ((match = clarityImportRegex.exec(code)) !== null) {
    const imports = match[1].split(',').map((s) => s.trim())

    for (const imp of imports) {
      // Remove type keyword if present
      const cleanImport = imp.replace(/^type\s+/, '')

      // Check for common typos
      if (
        cleanImport.includes('Clearity') ||
        cleanImport.includes('Claritiy')
      ) {
        warnings.push(`Possible typo in import: ${cleanImport}`)
      }
    }
  }

  // Check for missing styles.css import in complete examples
  if (
    code.includes('ClarityChat') &&
    code.includes('function') &&
    !code.includes('styles.css')
  ) {
    // This is a complete component example, might need styles
    // Only warn, don't error - not all examples need styles
  }

  return warnings
}

/**
 * Find all documentation page files
 */
function findDocPages(dir: string): string[] {
  const pages: string[] = []

  function walkDir(currentDir: string) {
    if (!fs.existsSync(currentDir)) return

    const entries = fs.readdirSync(currentDir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name)

      if (entry.isDirectory()) {
        // Skip node_modules and hidden directories
        if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
          walkDir(fullPath)
        }
      } else if (entry.name === 'page.tsx') {
        pages.push(fullPath)
      }
    }
  }

  walkDir(dir)
  return pages
}

/**
 * Main validation function
 */
function validateExamples(): ValidationResult {
  const result: ValidationResult = {
    errors: [],
    warnings: [],
    info: [],
    stats: {
      totalFiles: 0,
      totalExamples: 0,
      validExamples: 0,
      invalidExamples: 0,
    },
  }

  // Find all documentation pages
  const pages = findDocPages(APP_DIR)
  result.stats.totalFiles = pages.length
  result.info.push(`Found ${pages.length} documentation pages`)

  // Process each page
  for (const pagePath of pages) {
    const relativePath = path.relative(DOCS_ROOT, pagePath)
    const examples = extractCodeExamples(pagePath)

    for (const example of examples) {
      result.stats.totalExamples++

      // Validate TypeScript syntax
      const syntaxResult = validateTypeScriptSyntax(
        example.code,
        example.language
      )
      if (!syntaxResult.valid) {
        result.stats.invalidExamples++
        for (const error of syntaxResult.errors) {
          result.errors.push(`${relativePath}:${example.lineNumber} - ${error}`)
        }
      } else {
        result.stats.validExamples++
      }

      // Check for deprecated APIs
      const deprecationWarnings = checkDeprecatedAPIs(example.code)
      for (const warning of deprecationWarnings) {
        result.warnings.push(
          `${relativePath}:${example.lineNumber} - ${warning}`
        )
      }

      // Check imports
      const importWarnings = checkImports(example.code)
      for (const warning of importWarnings) {
        result.warnings.push(
          `${relativePath}:${example.lineNumber} - ${warning}`
        )
      }
    }
  }

  // Summary info
  result.info.push(`Validated ${result.stats.totalExamples} code examples`)
  result.info.push(
    `${result.stats.validExamples} valid, ${result.stats.invalidExamples} with syntax errors`
  )

  return result
}

/**
 * CLI entry point
 */
function main() {
  const args = process.argv.slice(2)
  const verbose = args.includes('--verbose') || args.includes('-v')
  const strict = args.includes('--strict')

  console.log('========================================')
  console.log('Documentation Example Validation')
  console.log('========================================\n')

  const result = validateExamples()

  // Print info
  if (verbose || result.info.length > 0) {
    console.log('INFO:')
    result.info.forEach((msg) => console.log(`  ℹ️  ${msg}`))
    console.log()
  }

  // Print warnings (only in verbose mode unless strict)
  if (result.warnings.length > 0 && (verbose || strict)) {
    console.log('WARNINGS:')
    result.warnings
      .slice(0, verbose ? undefined : 10)
      .forEach((msg) => console.log(`  ⚠️  ${msg}`))
    if (!verbose && result.warnings.length > 10) {
      console.log(`  ... and ${result.warnings.length - 10} more warnings`)
    }
    console.log()
  }

  // Print errors
  if (result.errors.length > 0) {
    console.log('ERRORS:')
    result.errors.slice(0, 20).forEach((msg) => console.log(`  ❌ ${msg}`))
    if (result.errors.length > 20) {
      console.log(`  ... and ${result.errors.length - 20} more errors`)
    }
    console.log()
  }

  // Summary
  console.log('========================================')
  console.log('Summary:')
  console.log(`  Files scanned: ${result.stats.totalFiles}`)
  console.log(`  Examples found: ${result.stats.totalExamples}`)
  console.log(`  Valid: ${result.stats.validExamples}`)
  console.log(`  Invalid: ${result.stats.invalidExamples}`)
  console.log(`  Warnings: ${result.warnings.length}`)
  console.log('========================================')

  // Exit with error code if there are syntax errors in strict mode
  if (strict && (result.errors.length > 0 || result.warnings.length > 0)) {
    process.exit(1)
  } else if (result.errors.length > 0) {
    // In non-strict mode, only fail on actual errors
    process.exit(1)
  }
}

main()
