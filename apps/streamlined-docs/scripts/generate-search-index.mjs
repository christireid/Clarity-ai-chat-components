#!/usr/bin/env node

/**
 * Generate Search Index
 *
 * This script scans all documentation pages and generates a comprehensive
 * search index for the SearchDialog component.
 *
 * Usage: node scripts/generate-search-index.mjs
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { glob } from 'glob'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Determine content type based on file path
 */
function getTypeFromPath(filePath) {
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
function getCategoryFromPath(filePath) {
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
function extractMetadata(content) {
  const metadata = {}

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
 * Decode HTML entities in text
 */
function decodeHtmlEntities(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
}

/**
 * Check if a path is a dynamic route (contains brackets)
 */
function isDynamicRoute(filePath) {
  return filePath.includes('[') || filePath.includes(']')
}

/**
 * Check if a title contains template variables
 */
function hasTemplateVariables(title) {
  return /\{[^}]+\}/.test(title)
}

/**
 * Convert file path to URL href
 */
function pathToHref(filePath, appDir) {
  const relativePath = path.relative(appDir, filePath)
  const href = relativePath
    .replace(/\\/g, '/')
    .replace(/\/page\.(tsx|mdx)$/, '')
    .replace(/^\/+/, '') // Remove leading slashes

  return href === '' ? '/' : `/${href}`
}

/**
 * Main function to generate search index
 */
async function generateSearchIndex() {
  console.log('🔍 Scanning documentation pages...\n')

  const rootDir = path.resolve(__dirname, '..')
  const appDir = path.join(rootDir, 'app')
  const pattern = path.join(appDir, '**/page.{tsx,mdx}')

  const files = await glob(pattern, {
    ignore: [
      '**/node_modules/**',
      '**/.next/**',
      '**/dist/**',
    ]
  })

  console.log(`Found ${files.length} pages\n`)

  const searchItems = []
  const skipped = []

  for (const filePath of files) {
    try {
      // Skip dynamic routes (containing brackets)
      if (isDynamicRoute(filePath)) {
        skipped.push({ path: filePath, reason: 'dynamic route' })
        continue
      }

      const content = fs.readFileSync(filePath, 'utf-8')
      const metadata = extractMetadata(content)

      // Skip if no title found
      if (!metadata.title) {
        skipped.push({ path: filePath, reason: 'no title' })
        continue
      }

      // Skip if title contains template variables like {post.title}
      if (hasTemplateVariables(metadata.title)) {
        skipped.push({ path: filePath, reason: 'template variable in title' })
        continue
      }

      const type = getTypeFromPath(filePath)
      const href = pathToHref(filePath, appDir)
      const category = getCategoryFromPath(filePath)

      // Decode HTML entities in title and description
      const cleanTitle = decodeHtmlEntities(metadata.title)
      const cleanDescription = metadata.description
        ? decodeHtmlEntities(metadata.description)
        : ''

      searchItems.push({
        title: cleanTitle,
        type,
        href,
        description: cleanDescription,
        ...(category && { category }),
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
  const outputPath = path.join(rootDir, 'lib', 'search-data.ts')
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
 * DO NOT EDIT MANUALLY - Run 'node scripts/generate-search-index.mjs' to regenerate
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

  console.log('✅ Search index generated successfully!\n')
  console.log(`📊 Statistics:`)
  console.log(`   Total items: ${searchItems.length}`)
  console.log(`   Components: ${searchItems.filter(i => i.type === 'component').length}`)
  console.log(`   Hooks: ${searchItems.filter(i => i.type === 'hook').length}`)
  console.log(`   Guides: ${searchItems.filter(i => i.type === 'guide').length}`)
  console.log(`   Examples: ${searchItems.filter(i => i.type === 'example').length}`)
  console.log(`   Cookbook: ${searchItems.filter(i => i.type === 'cookbook').length}`)
  console.log(`   Concepts: ${searchItems.filter(i => i.type === 'concept').length}`)
  console.log(`   Deployment: ${searchItems.filter(i => i.type === 'deployment').length}`)
  console.log(`   Integrations: ${searchItems.filter(i => i.type === 'integration').length}`)
  console.log(`\n🚫 Skipped: ${skipped.length}`)
  const skippedByReason = skipped.reduce((acc, item) => {
    acc[item.reason] = (acc[item.reason] || 0) + 1
    return acc
  }, {})
  Object.entries(skippedByReason).forEach(([reason, count]) => {
    console.log(`   - ${reason}: ${count}`)
  })
  console.log(`\n📁 Output: ${outputPath}`)
}

// Run the script
generateSearchIndex().catch(console.error)
