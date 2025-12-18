#!/usr/bin/env npx ts-node
/**
 * Batch Add FeedbackWidget to Hook Pages
 *
 * This script automatically adds FeedbackWidget to all hook documentation pages
 * that don't already have it.
 *
 * Run: npx tsx scripts/add-feedback-widget.ts
 */

import * as fs from 'fs'
import * as path from 'path'

const HOOKS_DIR = path.resolve(__dirname, '..', 'app', 'reference', 'hooks')

interface UpdateResult {
  file: string
  status: 'updated' | 'skipped' | 'error'
  message?: string
}

function getPageId(dirName: string): string {
  // Convert directory name to page ID
  // e.g., "use-clarity-chat" -> "use-clarity-chat"
  return dirName
}

function addFeedbackWidget(filePath: string): UpdateResult {
  const fileName = path.basename(path.dirname(filePath))

  try {
    let content = fs.readFileSync(filePath, 'utf-8')

    // Skip if already has FeedbackWidget
    if (content.includes('FeedbackWidget')) {
      return {
        file: fileName,
        status: 'skipped',
        message: 'Already has FeedbackWidget',
      }
    }

    // Skip special pages (selector, compare, graph)
    if (['selector', 'compare', 'graph'].includes(fileName)) {
      return {
        file: fileName,
        status: 'skipped',
        message: 'Special page (not a hook)',
      }
    }

    // Check if it's a valid hook page (should have 'use-' prefix)
    if (!fileName.startsWith('use-')) {
      return {
        file: fileName,
        status: 'skipped',
        message: 'Not a hook page',
      }
    }

    // Add import if not present
    const importStatement = `import { FeedbackWidget } from '@/components/FeedbackWidget'`

    if (!content.includes(importStatement)) {
      // Find the last import statement and add after it
      const importRegex = /^import\s+.*$/gm
      const imports = [...content.matchAll(importRegex)]

      if (imports.length > 0) {
        const lastImport = imports[imports.length - 1]
        const insertPos = (lastImport.index ?? 0) + lastImport[0].length
        content =
          content.slice(0, insertPos) +
          '\n' +
          importStatement +
          content.slice(insertPos)
      } else {
        // No imports, add at top
        content = importStatement + '\n\n' + content
      }
    }

    // Find the closing tag of the main content container
    // Look for patterns like </main>, </div>, or last closing tag before export
    const pageId = getPageId(fileName)

    // Pattern to find before the last closing div/main before return ends
    // We'll insert FeedbackWidget before the last </div> or </main> in the return statement

    // Try to find the footer links pattern first
    const footerPattern =
      /(\s*<div className="mt-8 pt-8 border-t[\s\S]*?<\/div>)\s*(<\/div>\s*\))/
    const footerMatch = content.match(footerPattern)

    if (footerMatch) {
      // Insert FeedbackWidget after footer links
      const feedbackCode = `\n\n      {/* Feedback Widget */}\n      <FeedbackWidget pageId="${pageId}" className="mt-12" />`
      content = content.replace(
        footerPattern,
        `$1${feedbackCode}\n    $2`
      )
    } else {
      // Try to find the last </div> before the closing parenthesis of return
      // This is a simplified approach

      // Find the return statement
      const returnMatch = content.match(/return\s*\(\s*</)
      if (returnMatch) {
        // Count backwards from end to find where to insert
        // Look for pattern like: </main>\n  )\n} or </div>\n  )\n}

        const endPattern = /(\s*<\/(?:div|main|section)>)(\s*\)\s*\}?\s*$)/
        const endMatch = content.match(endPattern)

        if (endMatch) {
          const feedbackCode = `\n\n      {/* Feedback Widget */}\n      <FeedbackWidget pageId="${pageId}" className="mt-12" />`
          content = content.replace(endPattern, `${feedbackCode}$1$2`)
        } else {
          return {
            file: fileName,
            status: 'error',
            message: 'Could not find insertion point',
          }
        }
      } else {
        return {
          file: fileName,
          status: 'error',
          message: 'Could not find return statement',
        }
      }
    }

    // Write the updated content
    fs.writeFileSync(filePath, content, 'utf-8')

    return {
      file: fileName,
      status: 'updated',
    }
  } catch (error) {
    return {
      file: fileName,
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

function main() {
  logger.debug('========================================')
  logger.debug('Adding FeedbackWidget to Hook Pages')
  logger.debug('========================================\n')

  const results: UpdateResult[] = []

  // Get all hook directories
  const dirs = fs.readdirSync(HOOKS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)

  for (const dir of dirs) {
    const pagePath = path.join(HOOKS_DIR, dir, 'page.tsx')

    if (fs.existsSync(pagePath)) {
      const result = addFeedbackWidget(pagePath)
      results.push(result)
    }
  }

  // Print results
  const updated = results.filter((r) => r.status === 'updated')
  const skipped = results.filter((r) => r.status === 'skipped')
  const errors = results.filter((r) => r.status === 'error')

  if (updated.length > 0) {
    logger.debug('UPDATED:')
    updated.forEach((r) => logger.debug(`  ✅ ${r.file}`))
    logger.debug()
  }

  if (skipped.length > 0) {
    logger.debug('SKIPPED:')
    skipped.forEach((r) => logger.debug(`  ⏭️  ${r.file}: ${r.message}`))
    logger.debug()
  }

  if (errors.length > 0) {
    logger.debug('ERRORS:')
    errors.forEach((r) => logger.debug(`  ❌ ${r.file}: ${r.message}`))
    logger.debug()
  }

  logger.debug('========================================')
  logger.debug(`Summary: ${updated.length} updated, ${skipped.length} skipped, ${errors.length} errors`)
  logger.debug('========================================')

  if (errors.length > 0) {
    process.exit(1)
  }
}

main()
