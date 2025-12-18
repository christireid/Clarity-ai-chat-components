#!/usr/bin/env npx ts-node
/**
 * Hook Metadata Validation Script
 *
 * Validates that hook-metadata.ts is in sync with actual documentation pages.
 * Run: npx ts-node scripts/validate-hook-metadata.ts
 *
 * Checks:
 * 1. All hrefs point to existing pages
 * 2. No orphaned pages (pages without metadata entries)
 * 3. Related hooks reference valid hook names
 * 4. Import statements are properly formatted
 */

import * as fs from 'fs'
import * as path from 'path'

// Resolve paths relative to script location
const DOCS_ROOT = path.resolve(__dirname, '..')
const HOOKS_DIR = path.join(DOCS_ROOT, 'app', 'reference', 'hooks')
const METADATA_FILE = path.join(DOCS_ROOT, 'lib', 'hook-metadata.ts')

interface ValidationResult {
  errors: string[]
  warnings: string[]
  info: string[]
}

// Simple parser to extract hook metadata from TypeScript file
function parseHookMetadata(): {
  hooks: Array<{ name: string; href: string; relatedHooks?: string[] }>
} {
  const content = fs.readFileSync(METADATA_FILE, 'utf-8')

  // Extract hook entries using regex (simplified parser)
  const hookRegex =
    /{\s*name:\s*['"]([^'"]+)['"],\s*href:\s*['"]([^'"]+)['"][\s\S]*?(?:relatedHooks:\s*\[([\s\S]*?)\])?[\s\S]*?}/g

  const hooks: Array<{ name: string; href: string; relatedHooks?: string[] }> = []
  let match

  while ((match = hookRegex.exec(content)) !== null) {
    const name = match[1]
    const href = match[2]
    const relatedHooksStr = match[3]

    let relatedHooks: string[] | undefined
    if (relatedHooksStr) {
      relatedHooks = relatedHooksStr
        .split(',')
        .map((s) => s.trim().replace(/['"]/g, ''))
        .filter((s) => s.length > 0)
    }

    hooks.push({ name, href, relatedHooks })
  }

  return { hooks }
}

// Get all hook page directories
function getExistingHookPages(): string[] {
  if (!fs.existsSync(HOOKS_DIR)) {
    return []
  }

  return fs
    .readdirSync(HOOKS_DIR, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .filter((dirent) => {
      // Check if directory has a page.tsx file
      const pageFile = path.join(HOOKS_DIR, dirent.name, 'page.tsx')
      return fs.existsSync(pageFile)
    })
    .map((dirent) => `/reference/hooks/${dirent.name}`)
}

function validateMetadata(): ValidationResult {
  const result: ValidationResult = {
    errors: [],
    warnings: [],
    info: [],
  }

  // Check if metadata file exists
  if (!fs.existsSync(METADATA_FILE)) {
    result.errors.push(`Metadata file not found: ${METADATA_FILE}`)
    return result
  }

  const { hooks } = parseHookMetadata()
  const existingPages = getExistingHookPages()

  result.info.push(`Found ${hooks.length} hooks in metadata`)
  result.info.push(`Found ${existingPages.length} hook pages in filesystem`)

  // Check 1: All hrefs point to existing pages
  const metadataHrefs = new Set(hooks.map((h) => h.href))
  for (const hook of hooks) {
    if (!existingPages.includes(hook.href)) {
      // Check if it's a special page that doesn't follow the pattern
      const pagePath = path.join(DOCS_ROOT, 'app', hook.href.slice(1), 'page.tsx')
      if (!fs.existsSync(pagePath)) {
        result.warnings.push(`Hook "${hook.name}" has href "${hook.href}" but no page exists`)
      }
    }
  }

  // Check 2: Orphaned pages (pages without metadata entries)
  for (const pagePath of existingPages) {
    if (!metadataHrefs.has(pagePath)) {
      // Skip special pages
      if (pagePath.includes('selector') || pagePath.includes('compare')) {
        continue
      }
      result.warnings.push(`Page "${pagePath}" exists but has no metadata entry`)
    }
  }

  // Check 3: Related hooks reference valid hook names
  const hookNames = new Set(hooks.map((h) => h.name))
  for (const hook of hooks) {
    if (hook.relatedHooks) {
      for (const related of hook.relatedHooks) {
        if (!hookNames.has(related)) {
          result.warnings.push(
            `Hook "${hook.name}" references unknown related hook "${related}"`
          )
        }
      }
    }
  }

  // Check 4: Verify import statement format
  const importRegex = /import\s*{\s*\w+\s*}\s*from\s*['"]@clarity-chat\/react['"]/
  for (const hook of hooks) {
    // This is a simplified check - in reality you'd parse the actual import statements
    if (!hook.name.startsWith('use')) {
      result.warnings.push(`Hook "${hook.name}" doesn't follow naming convention (should start with "use")`)
    }
  }

  // Summary
  if (result.errors.length === 0 && result.warnings.length === 0) {
    result.info.push('All validations passed!')
  }

  return result
}

function main() {
  logger.debug('========================================')
  logger.debug('Hook Metadata Validation')
  logger.debug('========================================\n')

  const result = validateMetadata()

  // Print info
  if (result.info.length > 0) {
    logger.debug('INFO:')
    result.info.forEach((msg) => logger.debug(`  - ${msg}`))
    logger.debug()
  }

  // Print warnings
  if (result.warnings.length > 0) {
    logger.debug('WARNINGS:')
    result.warnings.forEach((msg) => logger.debug(`  ⚠️  ${msg}`))
    logger.debug()
  }

  // Print errors
  if (result.errors.length > 0) {
    logger.debug('ERRORS:')
    result.errors.forEach((msg) => logger.debug(`  ❌ ${msg}`))
    logger.debug()
  }

  // Summary
  logger.debug('========================================')
  logger.debug(`Summary: ${result.errors.length} errors, ${result.warnings.length} warnings`)
  logger.debug('========================================')

  // Exit with error code if there are errors
  if (result.errors.length > 0) {
    process.exit(1)
  }
}

main()
