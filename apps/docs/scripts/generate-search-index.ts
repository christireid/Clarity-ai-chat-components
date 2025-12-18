#!/usr/bin/env tsx

/**
 * Generate Search Index
 *
 * This script scans all documentation pages and generates a comprehensive
 * search index for the SearchDialog component.
 *
 * Usage: npm run generate-search-index
 */

import fs from 'fs'
import path from 'path'
import { glob } from 'glob'

interface SearchItem {
  title: string
  type: 'component' | 'hook' | 'guide' | 'example' | 'cookbook' | 'concept' | 'deployment' | 'integration'
  href: string
  description: string
  category?: string
}

/**
 * Determine content type based on file path
 */
function getTypeFromPath(filePath: string): SearchItem['type'] {
  if (filePath.includes('/reference/components/')) return 'component'
  if (filePath.includes('/reference/hooks/')) return 'hook'
  if (filePath.includes('/examples/')) return 'example'
  if (filePath.includes('/cookbook/')) return 'cookbook'
  if (filePath.includes('/learn/concepts/')) return 'concept'
  if (filePath.includes('/learn/deployment/')) return 'deployment'
  if (filePath.includes('/integrations/')) return 'integration'
  return 'guide'
}

/**
 * Get category from path for better organization
 */
function getCategoryFromPath(filePath: string): string | undefined {
  const parts = filePath.split('/')
  const appIndex = parts.indexOf('app')
  if (appIndex !== -1 && parts.length > appIndex + 1) {
    return parts[appIndex + 1] // e.g., 'learn', 'reference', 'examples'
  }
  return undefined
}

/**
 * Extract metadata from a TypeScript file
 */
function extractMetadata(content: string): { title?: string; description?: string } {
  const metadata: { title?: string; description?: string } = {}

  // Try to extract from Next.js metadata export
  const metadataMatch = content.match(/export\s+const\s+metadata[:\s]*=\s*{([^}]*)}/s)
  if (metadataMatch) {
    const metadataContent = metadataMatch[1]

    // Extract title
    const titleMatch = metadataContent.match(/title:\s*['"]([^'"]+)['"]/s)
    if (titleMatch) {
      metadata.title = titleMatch[1]
    }

    // Extract description
    const descMatch = metadataContent.match(/description:\s*['"]([^'"]+)['"]/s)
    if (descMatch) {
      metadata.description = descMatch[1]
    }
  }

  // Fallback: Try to find title in JSX heading
  if (!metadata.title) {
    const h1Match = content.match(/<h1[^>]*>([^<]+)<\/h1>/)
    if (h1Match) {
      metadata.title = h1Match[1].trim()
    }
  }

  return metadata
}

/**
 * Convert file path to URL href
 */
function pathToHref(filePath: string): string {
  const appDir = path.join(process.cwd(), 'app')
  const relativePath = path.relative(appDir, filePath)
  const href = '/' + relativePath
    .replace(/\\/g, '/')
    .replace(/\/page\.(tsx|mdx)$/, '')
    .replace(/^\//, '')

  return href === '/' ? '/' : `/${href}`
}

/**
 * Main function to generate search index
 */
async function generateSearchIndex() {
  logger.debug('🔍 Scanning documentation pages...\n')

  const appDir = path.join(process.cwd(), 'app')
  const pattern = path.join(appDir, '**/page.{tsx,mdx}')

  const files = await glob(pattern, {
    ignore: [
      '**/node_modules/**',
      '**/.next/**',
      '**/dist/**',
    ]
  })

  logger.debug(`Found ${files.length} pages\n`)

  const searchItems: SearchItem[] = []
  const skipped: string[] = []

  for (const filePath of files) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8')
      const metadata = extractMetadata(content)

      // Skip if no title found
      if (!metadata.title) {
        skipped.push(filePath)
        continue
      }

      const type = getTypeFromPath(filePath)
      const href = pathToHref(filePath)
      const category = getCategoryFromPath(filePath)

      searchItems.push({
        title: metadata.title,
        type,
        href,
        description: metadata.description || '',
        category,
      })
    } catch (error) {
      console.error(`Error processing ${filePath}:`, error)
    }
  }

  // Sort by type, then by title
  searchItems.sort((a, b) => {
    if (a.type !== b.type) {
      const typeOrder = ['guide', 'component', 'hook', 'example', 'cookbook', 'concept', 'deployment', 'integration']
      return typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type)
    }
    return a.title.localeCompare(b.title)
  })

  // Generate TypeScript file
  const outputPath = path.join(process.cwd(), 'lib', 'search-data.ts')
  const outputDir = path.dirname(outputPath)

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  const fileContent = `/**
 * Search Index
 *
 * Auto-generated search data for the documentation site.
 * Generated on: ${new Date().toISOString()}
 * Total items: ${searchItems.length}
 *
 * DO NOT EDIT MANUALLY - Run 'npm run generate-search-index' to regenerate
 */

export interface SearchItem {
  title: string
  type: 'component' | 'hook' | 'guide' | 'example' | 'cookbook' | 'concept' | 'deployment' | 'integration'
  href: string
  description: string
  category?: string
}

export const searchData: SearchItem[] = ${JSON.stringify(searchItems, null, 2)}
`

  fs.writeFileSync(outputPath, fileContent)

  logger.debug('✅ Search index generated successfully!\n')
  logger.debug(`📊 Statistics:`)
  logger.debug(`   Total items: ${searchItems.length}`)
  logger.debug(`   Components: ${searchItems.filter(i => i.type === 'component').length}`)
  logger.debug(`   Hooks: ${searchItems.filter(i => i.type === 'hook').length}`)
  logger.debug(`   Guides: ${searchItems.filter(i => i.type === 'guide').length}`)
  logger.debug(`   Examples: ${searchItems.filter(i => i.type === 'example').length}`)
  logger.debug(`   Cookbook: ${searchItems.filter(i => i.type === 'cookbook').length}`)
  logger.debug(`   Concepts: ${searchItems.filter(i => i.type === 'concept').length}`)
  logger.debug(`   Deployment: ${searchItems.filter(i => i.type === 'deployment').length}`)
  logger.debug(`   Integrations: ${searchItems.filter(i => i.type === 'integration').length}`)
  logger.debug(`   Skipped (no title): ${skipped.length}`)
  logger.debug(`\n📁 Output: ${outputPath}`)
}

// Run the script
generateSearchIndex().catch(console.error)
