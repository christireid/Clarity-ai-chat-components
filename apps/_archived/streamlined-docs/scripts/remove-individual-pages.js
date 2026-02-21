#!/usr/bin/env node

/**
 * Remove Individual Pages Script
 *
 * Removes all individual component, hook, guide, tutorial, recipe, demo, and example pages
 * while keeping high-level structural pages (section pages, category pages)
 */

const fs = require('fs')
const path = require('path')

const APP_DIR = path.join(__dirname, '..', 'app')

/**
 * Find all page.tsx files recursively
 */
function findAllPages(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.next' && entry.name !== 'api') {
        findAllPages(fullPath, files)
      }
    } else if (entry.name === 'page.tsx') {
      files.push(fullPath)
    }
  }

  return files
}

/**
 * Check if a page should be kept based on directory depth
 */
function shouldKeepPage(filePath) {
  const relativePath = path.relative(APP_DIR, filePath)
  const segments = relativePath.split(path.sep)

  // Remove 'page.tsx' from segments
  segments.pop()

  // Keep homepage
  if (segments.length === 0) return true

  // Keep top-level section pages (e.g., /reference/page.tsx, /guides/page.tsx)
  if (segments.length === 1) return true

  // For reference section, keep category pages but remove individual items
  if (segments[0] === 'reference') {
    // Keep /reference/components/page.tsx (category page)
    if (segments.length === 2) return true
    // Remove /reference/components/avatar/page.tsx (individual page)
    if (segments.length === 3) return false
  }

  // For guides, keep only hub page
  if (segments[0] === 'guides') {
    // Keep /guides/page.tsx
    if (segments.length === 1) return true
    // Remove /guides/streaming/page.tsx
    return false
  }

  // For cookbook, keep only hub page
  if (segments[0] === 'cookbook') {
    if (segments.length === 1) return true
    return false
  }

  // For demos, keep only hub page
  if (segments[0] === 'demos') {
    if (segments.length === 1) return true
    return false
  }

  // For examples, keep only hub page
  if (segments[0] === 'examples') {
    if (segments.length === 1) return true
    return false
  }

  // For learn section
  if (segments[0] === 'learn') {
    // Keep /learn/page.tsx
    if (segments.length === 1) return true
    // Keep /learn/tutorials/page.tsx, /learn/concepts/page.tsx (category pages)
    if (segments.length === 2) return true
    // Remove /learn/tutorials/building-first-chatbot/page.tsx
    return false
  }

  // Keep special top-level pages
  const topLevelKeep = [
    'about',
    'contributing',
    'changelog',
    'license',
    'compare',
    'playground',
    'enterprise',
    'enterprise-standalone',
    'why-clarity',
    'commercial',
    'research',
    'tools',
    'examples-catalog',
    'playground-demo',
    'integrations',
  ]

  if (topLevelKeep.includes(segments[0])) {
    // Keep only top-level pages for these sections
    return segments.length === 1
  }

  // Default: keep (for safety)
  return true
}

/**
 * Check if a directory is empty or only contains non-content files
 */
function isEmptyOrLayoutOnly(dir) {
  if (!fs.existsSync(dir)) return true

  const entries = fs.readdirSync(dir)
  const contentFiles = entries.filter(
    f => !['layout.tsx', 'layout.ts', 'error.tsx', 'loading.tsx', 'not-found.tsx'].includes(f)
  )

  // Check if remaining items are all directories
  for (const file of contentFiles) {
    const fullPath = path.join(dir, file)
    const stat = fs.statSync(fullPath)
    if (!stat.isDirectory()) {
      return false // Has a real file
    }
  }

  return true
}

/**
 * Remove empty directories recursively
 */
function removeEmptyDirs(dir) {
  if (!fs.existsSync(dir) || dir === APP_DIR) return

  const entries = fs.readdirSync(dir, { withFileTypes: true })

  // First, recurse into subdirectories
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const fullPath = path.join(dir, entry.name)
      removeEmptyDirs(fullPath)
    }
  }

  // Then check if this directory is now empty
  if (isEmptyOrLayoutOnly(dir)) {
    const relativePath = path.relative(APP_DIR, dir)
    console.log(`🗑️  Removing empty directory: ${relativePath}`)
    fs.rmSync(dir, { recursive: true, force: true })
  }
}

function main() {
  console.log('🔍 Finding all page.tsx files...\n')

  const allPages = findAllPages(APP_DIR)
  const stats = {
    total: allPages.length,
    kept: 0,
    removed: 0,
    removedPaths: [],
  }

  console.log(`📄 Found ${allPages.length} page files\n`)

  // Process each page
  for (const filePath of allPages) {
    const relativePath = path.relative(APP_DIR, filePath)

    if (shouldKeepPage(filePath)) {
      console.log(`✅ Keeping: ${relativePath}`)
      stats.kept++
    } else {
      console.log(`❌ Removing: ${relativePath}`)
      fs.unlinkSync(filePath)
      stats.removed++
      stats.removedPaths.push(relativePath)
    }
  }

  // Remove empty directories
  console.log('\n🧹 Cleaning up empty directories...\n')
  removeEmptyDirs(APP_DIR)

  // Summary
  console.log('\n' + '='.repeat(60))
  console.log('📊 Removal Summary')
  console.log('='.repeat(60))
  console.log(`✅ Kept:     ${stats.kept} pages`)
  console.log(`❌ Removed:  ${stats.removed} pages`)
  console.log(`📁 Total:    ${stats.total} pages`)
  console.log(`📉 Reduction: ${((stats.removed / stats.total) * 100).toFixed(1)}%`)
  console.log('='.repeat(60))

  // Write report
  const reportPath = path.join(
    __dirname,
    '..',
    '.streamlined-docs',
    'individual-pages-removal-report.json'
  )
  fs.writeFileSync(
    reportPath,
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        stats: {
          total: stats.total,
          kept: stats.kept,
          removed: stats.removed,
        },
        removedPaths: stats.removedPaths.slice(0, 100), // First 100 for brevity
      },
      null,
      2
    )
  )

  console.log(`\n📝 Report saved to: ${path.relative(process.cwd(), reportPath)}`)
}

main()
