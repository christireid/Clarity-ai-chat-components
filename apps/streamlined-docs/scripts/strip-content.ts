#!/usr/bin/env tsx

/**
 * Content Stripping Script for Streamlined Docs
 *
 * This script replaces all page.tsx files with minimal empty-state templates
 * while preserving routing structure and page organization.
 *
 * Phase: PHASE 1 - CONTENT STRIPPING
 */

import fs from 'fs'
import path from 'path'

const APP_DIR = path.join(__dirname, '..', 'app')
const EXCLUDED_PAGES = [
  'layout.tsx',
  'not-found.tsx',
  'error.tsx',
  'loading.tsx',
  'providers.tsx',
  'template.tsx',
]

// Template for replaced pages
const EMPTY_PAGE_TEMPLATE = `import { EmptyContentPage } from '@/components/EmptyContentPage'

export default function Page() {
  return <EmptyContentPage />
}
`

interface PageStats {
  processed: number
  skipped: number
  errors: number
  paths: string[]
}

/**
 * Recursively find all files with a given name in a directory
 */
function findFiles(dir: string, filename: string, files: string[] = []): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      // Skip node_modules and .next
      if (entry.name !== 'node_modules' && entry.name !== '.next') {
        findFiles(fullPath, filename, files)
      }
    } else if (entry.name === filename) {
      files.push(fullPath)
    }
  }

  return files
}

async function stripContent() {
  console.log('🔄 Starting content stripping process...\n')

  const stats: PageStats = {
    processed: 0,
    skipped: 0,
    errors: 0,
    paths: [],
  }

  try {
    // Find all page.tsx files
    const pageFiles = findFiles(APP_DIR, 'page.tsx')

    console.log(`📄 Found ${pageFiles.length} page files\n`)

    for (const filePath of pageFiles) {
      const relativePath = path.relative(APP_DIR, filePath)

      try {
        // Read current content
        const currentContent = fs.readFileSync(filePath, 'utf-8')

        // Check if already stripped
        if (currentContent.includes('EmptyContentPage')) {
          console.log(`⏭️  Skipped (already stripped): ${relativePath}`)
          stats.skipped++
          continue
        }

        // Replace with empty template
        fs.writeFileSync(filePath, EMPTY_PAGE_TEMPLATE, 'utf-8')

        console.log(`✅ Processed: ${relativePath}`)
        stats.processed++
        stats.paths.push(relativePath)
      } catch (error) {
        console.error(`❌ Error processing ${relativePath}:`, error)
        stats.errors++
      }
    }

    // Summary
    console.log('\n' + '='.repeat(60))
    console.log('📊 Content Stripping Summary')
    console.log('='.repeat(60))
    console.log(`✅ Processed:  ${stats.processed} files`)
    console.log(`⏭️  Skipped:    ${stats.skipped} files (already stripped)`)
    console.log(`❌ Errors:     ${stats.errors} files`)
    console.log(`📁 Total:      ${pageFiles.length} files`)
    console.log('='.repeat(60))

    // Write report
    const reportPath = path.join(__dirname, '..', '.streamlined-docs', 'content-stripping-report.json')
    fs.writeFileSync(
      reportPath,
      JSON.stringify(
        {
          timestamp: new Date().toISOString(),
          stats,
          processedFiles: stats.paths,
        },
        null,
        2
      )
    )

    console.log(`\n📝 Report saved to: ${path.relative(process.cwd(), reportPath)}`)

    if (stats.errors > 0) {
      process.exit(1)
    }
  } catch (error) {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  }
}

// Run the script
stripContent()
