#!/usr/bin/env node
/**
 * Master Documentation Sync Script
 *
 * Orchestrates complete documentation synchronization.
 * Run: pnpm doc:sync
 *
 * @module scripts/sync-all-docs
 */

import * as fs from 'fs'
import * as path from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT_DIR = path.resolve(__dirname, '..')

interface ExportInfo {
  name: string
  type: 'function' | 'class' | 'type' | 'interface' | 'const' | 'hook'
  description: string
  sourceFile: string
}

/**
 * Step 1: Extract all exports from index.ts
 */
function extractExports(): ExportInfo[] {
  const exports: ExportInfo[] = []
  const indexPath = path.join(ROOT_DIR, 'src', 'index.ts')

  if (!fs.existsSync(indexPath)) {
    console.log('  No src/index.ts found')
    return exports
  }

  const content = fs.readFileSync(indexPath, 'utf8')

  // Find re-exports
  const reExportRegex =
    /export\s+\{\s*([^}]+)\s*\}\s+from\s+['"]\.\/([^'"]+)['"]/g
  let match

  while ((match = reExportRegex.exec(content)) !== null) {
    const exportList = match[1]
    const sourceFile = match[2]

    const names = exportList.split(',').map((s) => {
      const parts = s.trim().split(/\s+as\s+/)
      return parts[parts.length - 1]
    })

    for (const name of names) {
      if (!name) continue

      // Determine type from name conventions
      let type: ExportInfo['type'] = 'const'
      if (name.startsWith('use')) {
        type = 'hook'
      } else if (name[0] === name[0].toUpperCase()) {
        if (
          name.endsWith('Options') ||
          name.endsWith('Config') ||
          name.endsWith('Result') ||
          name.endsWith('Props')
        ) {
          type = 'interface'
        } else {
          type = 'class'
        }
      } else if (name.includes('Type') || name.includes('Level')) {
        type = 'type'
      }

      exports.push({
        name,
        type,
        description: '', // Will be filled from JSDoc
        sourceFile: `src/${sourceFile}.ts`,
      })
    }
  }

  return exports
}

/**
 * Step 2: Generate API Overview table for README
 */
function generateApiTable(exports: ExportInfo[]): string {
  const hooks = exports.filter((e) => e.type === 'hook')
  const classes = exports.filter((e) => e.type === 'class')
  const functions = exports.filter(
    (e) => e.type === 'function' || e.type === 'const'
  )
  const types = exports.filter(
    (e) => e.type === 'type' || e.type === 'interface'
  )

  let table = '## API Overview\n\n'

  if (hooks.length > 0) {
    table += '### React Hooks\n\n'
    table += '| Hook | Description |\n'
    table += '|------|-------------|\n'
    for (const hook of hooks) {
      table += `| \`${hook.name}\` | ${hook.description || 'See documentation'} |\n`
    }
    table += '\n'
  }

  if (classes.length > 0) {
    table += '### Classes\n\n'
    table += '| Class | Description |\n'
    table += '|-------|-------------|\n'
    for (const cls of classes.slice(0, 10)) {
      // Limit to top 10
      table += `| \`${cls.name}\` | ${cls.description || 'See documentation'} |\n`
    }
    table += '\n'
  }

  return table
}

/**
 * Step 3: Sync JSDoc comments
 */
function syncJSDocInFile(filePath: string): number {
  if (!fs.existsSync(filePath)) return 0

  let content = fs.readFileSync(filePath, 'utf8')
  let fixes = 0

  // Find functions without JSDoc
  const funcRegex =
    /(?<!\/\*\*[\s\S]*?\*\/\s*)export\s+(async\s+)?function\s+(\w+)/g
  const matches = [...content.matchAll(funcRegex)]

  for (const match of matches) {
    const funcName = match[2]
    console.log(`    Warning: ${funcName} has no JSDoc`)
    fixes++
  }

  return fixes
}

/**
 * Step 4: Verify examples compile
 */
function verifyExamples(): boolean {
  const examplesDir = path.join(ROOT_DIR, 'examples')

  if (!fs.existsSync(examplesDir)) {
    console.log('  No examples directory found')
    return true
  }

  try {
    // Run TypeScript check on examples
    execSync('pnpm tsc --noEmit examples/*.ts examples/*.tsx 2>&1', {
      cwd: ROOT_DIR,
      stdio: 'pipe',
    })
    return true
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'stdout' in error) {
      console.log('  Example compilation warnings:')
      console.log(
        `    ${String((error as { stdout?: Buffer }).stdout).slice(0, 500)}`
      )
    }
    return false
  }
}

/**
 * Main sync function
 */
async function main() {
  console.log('==============================================')
  console.log('       DOCUMENTATION SYNC COMMANDER          ')
  console.log('==============================================')
  console.log('')

  // Step 1: Extract exports
  console.log('Step 1: Extracting exports from index.ts...')
  const exports = extractExports()
  console.log(`  Found ${exports.length} exports`)
  console.log('')

  // Step 2: Check JSDoc
  console.log('Step 2: Checking JSDoc comments...')
  const srcDir = path.join(ROOT_DIR, 'src')
  let totalJSDocIssues = 0

  const checkDir = (dir: string) => {
    if (!fs.existsSync(dir)) return
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory() && !entry.name.startsWith('__')) {
        checkDir(fullPath)
      } else if (entry.name.endsWith('.ts') && !entry.name.includes('.test.')) {
        totalJSDocIssues += syncJSDocInFile(fullPath)
      }
    }
  }
  checkDir(srcDir)

  if (totalJSDocIssues === 0) {
    console.log('  All functions have JSDoc')
  }
  console.log('')

  // Step 3: Verify examples
  console.log('Step 3: Verifying examples compile...')
  const examplesOk = verifyExamples()
  if (examplesOk) {
    console.log('  All examples compile successfully')
  }
  console.log('')

  // Step 4: Run tests
  console.log('Step 4: Running tests...')
  try {
    execSync('pnpm test --run 2>&1', { cwd: ROOT_DIR, stdio: 'pipe' })
    console.log('  All tests pass')
  } catch {
    console.log('  Some tests failed - review needed')
  }
  console.log('')

  // Summary
  console.log('==============================================')
  if (totalJSDocIssues === 0 && examplesOk) {
    console.log('   DOCUMENTATION SYNC COMPLETE            ')
  } else {
    console.log('   DOCUMENTATION SYNC NEEDS ATTENTION     ')
    console.log(`   - JSDoc issues: ${totalJSDocIssues}`)
    console.log(`   - Examples: ${examplesOk ? 'OK' : 'Need fixes'}`)
  }
  console.log('==============================================')
}

main().catch(console.error)
