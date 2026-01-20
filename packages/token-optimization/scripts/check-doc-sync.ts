#!/usr/bin/env node
/**
 * Documentation Sync Checker
 *
 * Pre-commit hook to detect documentation that needs updating.
 * Run: pnpm doc:check
 *
 * @module scripts/check-doc-sync
 */

import * as fs from 'fs'
import * as path from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT_DIR = path.resolve(__dirname, '..')

interface DriftItem {
  file: string
  symbol: string
  issue:
    | 'missing_param'
    | 'extra_param'
    | 'wrong_type'
    | 'missing_jsdoc'
    | 'stale_example'
  details: string
}

/**
 * Parse JSDoc from a source file
 */
function parseJSDoc(
  content: string
): Map<string, { params: string[]; returns: string | null }> {
  const docs = new Map<string, { params: string[]; returns: string | null }>()

  const jsdocRegex =
    /\/\*\*[\s\S]*?\*\/\s*export\s+(async\s+)?function\s+(\w+)\s*[<(]/g
  let match

  while ((match = jsdocRegex.exec(content)) !== null) {
    const funcName = match[2]
    const jsdocBlock = match[0].match(/\/\*\*[\s\S]*?\*\//)?.[0] || ''

    const params = [...jsdocBlock.matchAll(/@param\s+(?:\{[^}]+\}\s+)?(\w+)/g)]
      .map((m) => m[1])
      .filter((p): p is string => p !== undefined)

    const returnsMatch = jsdocBlock.match(/@returns?\s+(?:\{([^}]+)\})?/)
    const returns = returnsMatch?.[1] || null

    docs.set(funcName, { params, returns })
  }

  return docs
}

/**
 * Parse function signatures from a source file
 */
function parseFunctionSignatures(
  content: string
): Map<string, { params: string[]; returnType: string | null }> {
  const signatures = new Map<
    string,
    { params: string[]; returnType: string | null }
  >()

  const funcRegex =
    /export\s+(async\s+)?function\s+(\w+)\s*(?:<[^>]*>)?\s*\(([^)]*)\)(?:\s*:\s*([^\s{]+))?/g
  let match

  while ((match = funcRegex.exec(content)) !== null) {
    const funcName = match[2]
    const paramsStr = match[3]
    const returnType = match[4] || null

    const params = paramsStr
      .split(',')
      .map((p) => p.split(':')[0]?.trim().replace('?', ''))
      .filter((p) => p && p.length > 0)

    signatures.set(funcName, { params, returnType })
  }

  return signatures
}

/**
 * Detect parameter drift between JSDoc and function signatures
 */
function detectParameterDrift(filePath: string): DriftItem[] {
  const drift: DriftItem[] = []
  const content = fs.readFileSync(filePath, 'utf8')

  const jsdocs = parseJSDoc(content)
  const signatures = parseFunctionSignatures(content)

  for (const [funcName, sig] of signatures) {
    const doc = jsdocs.get(funcName)

    if (!doc) {
      // No JSDoc at all
      if (sig.params.length > 0 || sig.returnType) {
        drift.push({
          file: filePath,
          symbol: funcName,
          issue: 'missing_jsdoc',
          details: `Function "${funcName}" is exported but has no JSDoc documentation`,
        })
      }
      continue
    }

    // Check for missing documented params
    for (const param of sig.params) {
      if (!doc.params.includes(param)) {
        drift.push({
          file: filePath,
          symbol: funcName,
          issue: 'missing_param',
          details: `Parameter "${param}" in "${funcName}" is not documented in JSDoc`,
        })
      }
    }

    // Check for extra documented params (renamed or removed)
    for (const docParam of doc.params) {
      if (!sig.params.includes(docParam)) {
        drift.push({
          file: filePath,
          symbol: funcName,
          issue: 'extra_param',
          details: `JSDoc documents "${docParam}" in "${funcName}" but parameter doesn't exist in code`,
        })
      }
    }
  }

  return drift
}

/**
 * Check if README examples use valid imports
 */
function checkReadmeExamples(): DriftItem[] {
  const drift: DriftItem[] = []
  const readmePath = path.join(ROOT_DIR, 'README.md')

  if (!fs.existsSync(readmePath)) {
    return drift
  }

  const readme = fs.readFileSync(readmePath, 'utf8')
  const codeBlocks = readme.match(/```typescript[\s\S]*?```/g) || []

  // Get all exports from index.ts
  const indexPath = path.join(ROOT_DIR, 'src', 'index.ts')
  if (!fs.existsSync(indexPath)) {
    return drift
  }

  const indexContent = fs.readFileSync(indexPath, 'utf8')
  const exportMatches = indexContent.matchAll(
    /export\s+\{\s*([^}]+)\s*\}\s+from/g
  )
  const exports = new Set<string>()

  for (const match of exportMatches) {
    const exportList = match[1]
    const names = exportList.split(',').map((s) => s.trim().split(' as ')[0])
    names.forEach((n) => n && exports.add(n))
  }

  // Check each code block for imports
  codeBlocks.forEach((block, index) => {
    const imports = block.match(
      /import\s+\{([^}]+)\}\s+from\s+['"]@clarity-chat\/token-optimization['"]/
    )
    if (imports) {
      const importedNames = imports[1].split(',').map((s) => s.trim())
      for (const name of importedNames) {
        if (!exports.has(name)) {
          drift.push({
            file: 'README.md',
            symbol: `Code block ${index + 1}`,
            issue: 'stale_example',
            details: `README imports "${name}" but it's not exported from package`,
          })
        }
      }
    }
  })

  return drift
}

/**
 * Run all drift detection checks
 */
async function detectAllDrift(): Promise<DriftItem[]> {
  const allDrift: DriftItem[] = []

  // Find all source files
  const srcDir = path.join(ROOT_DIR, 'src')
  const sourceFiles = findSourceFiles(srcDir)

  // Check each source file for JSDoc drift
  for (const file of sourceFiles) {
    // Skip test files and internal files
    if (file.includes('__tests__') || file.includes('.test.')) {
      continue
    }
    allDrift.push(...detectParameterDrift(file))
  }

  // Check README examples
  allDrift.push(...checkReadmeExamples())

  return allDrift
}

/**
 * Find all TypeScript source files
 */
function findSourceFiles(dir: string): string[] {
  const files: string[] = []

  if (!fs.existsSync(dir)) {
    return files
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...findSourceFiles(fullPath))
    } else if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
      files.push(fullPath)
    }
  }

  return files
}

/**
 * Main function
 */
async function main() {
  console.log('Checking documentation sync...\n')

  const drift = await detectAllDrift()

  if (drift.length === 0) {
    console.log('All documentation is in sync!')
    process.exit(0)
  }

  console.log(`Found ${drift.length} documentation drift items:\n`)

  // Group by file
  const byFile = new Map<string, DriftItem[]>()
  for (const item of drift) {
    const existing = byFile.get(item.file) || []
    existing.push(item)
    byFile.set(item.file, existing)
  }

  for (const [file, items] of byFile) {
    const relPath = path.relative(ROOT_DIR, file)
    console.log(`${relPath}:`)
    for (const item of items) {
      console.log(`  - [${item.issue}] ${item.symbol}: ${item.details}`)
    }
    console.log('')
  }

  console.log('Run `pnpm doc:sync` to auto-fix or update manually.')
  process.exit(1)
}

main().catch(console.error)
