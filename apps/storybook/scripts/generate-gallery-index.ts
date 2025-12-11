#!/usr/bin/env npx tsx
/**
 * Component Gallery Index Generator
 *
 * Automatically generates a JSON index of all story files with their
 * metadata. This index can be used to:
 *
 * 1. Keep ComponentGallery.mdx in sync with actual stories
 * 2. Power search functionality
 * 3. Generate documentation automatically
 *
 * Usage:
 *   npx tsx scripts/generate-gallery-index.ts
 *   pnpm generate-gallery
 *
 * Output:
 *   stories/.generated/gallery-index.json
 */

import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  readdirSync,
  statSync,
} from 'fs'
import { join, relative, dirname } from 'path'

const STORIES_DIR = join(__dirname, '../stories')
const OUTPUT_DIR = join(STORIES_DIR, '.generated')
const OUTPUT_FILE = join(OUTPUT_DIR, 'gallery-index.json')

interface ComponentMeta {
  title: string
  path: string
  category: string
  subcategory?: string
  description?: string
  tags: string[]
  file: string
  isNew?: boolean
  isPopular?: boolean
  isBeta?: boolean
  isDeprecated?: boolean
}

/**
 * Recursively find all story files
 */
function findStoryFiles(dir: string): string[] {
  const files: string[] = []
  const items = readdirSync(dir)

  for (const item of items) {
    const fullPath = join(dir, item)
    const stat = statSync(fullPath)

    if (
      stat.isDirectory() &&
      item !== '.generated' &&
      item !== 'node_modules'
    ) {
      files.push(...findStoryFiles(fullPath))
    } else if (item.endsWith('.stories.tsx')) {
      files.push(fullPath)
    }
  }

  return files
}

/**
 * Extract component metadata from a story file
 */
function extractMeta(filePath: string): ComponentMeta | null {
  const content = readFileSync(filePath, 'utf-8')
  const relativePath = relative(STORIES_DIR, filePath)

  // Extract title from meta object
  const titleMatch = content.match(/title:\s*['"]([^'"]+)['"]/)
  if (!titleMatch) return null

  const title = titleMatch[1]
  const parts = title.split('/')

  // Extract description from JSDoc or component description
  const descMatch = content.match(
    /description:\s*{\s*component:\s*[`'"]([\s\S]*?)[`'"]/
  )
  let description = ''
  if (descMatch) {
    // Get first sentence or first 100 chars
    description = descMatch[1]
      .replace(/\s+/g, ' ')
      .trim()
      .split('.')[0]
      .substring(0, 100)
  }

  // Extract JSDoc description as fallback
  if (!description) {
    const jsdocMatch = content.match(/\/\*\*\s*\n\s*\*\s*\*\*([^*]+)\*\*/)
    if (jsdocMatch) {
      description = jsdocMatch[1].trim()
    }
  }

  // Extract tags from story tags or infer from content
  const tags: string[] = []
  const tagsMatch = content.match(/tags:\s*\[([^\]]+)\]/)
  if (tagsMatch) {
    const tagString = tagsMatch[1]
    const tagMatches = tagString.match(/['"]([^'"]+)['"]/g)
    if (tagMatches) {
      tags.push(
        ...tagMatches
          .map((t) => t.replace(/['"]/g, ''))
          .filter((t) => t !== 'autodocs')
      )
    }
  }

  // Infer tags from content patterns
  if (content.includes('streaming') || content.includes('Streaming'))
    tags.push('streaming')
  if (content.includes('memory') || content.includes('Memory'))
    tags.push('memory')
  if (content.includes('AI') || content.includes('ai')) tags.push('ai')
  if (content.includes('hook') || title.toLowerCase().includes('use'))
    tags.push('hook')

  // Check for badges
  const isNew = content.includes('badge-new') || content.includes('@new')
  const isPopular =
    content.includes('badge-popular') || content.includes('@popular')
  const isBeta = content.includes('badge-beta') || content.includes('@beta')
  const isDeprecated =
    content.includes('@deprecated') || content.includes('deprecated')

  // Convert title to Storybook path
  const storyPath = title.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-')

  return {
    title: parts[parts.length - 1],
    path: `?path=/docs/${storyPath}--docs`,
    category: parts[0] || 'Components',
    subcategory: parts.length > 2 ? parts[1] : undefined,
    description: description || undefined,
    tags: [...new Set(tags)],
    file: relativePath,
    isNew: isNew || undefined,
    isPopular: isPopular || undefined,
    isBeta: isBeta || undefined,
    isDeprecated: isDeprecated || undefined,
  }
}

/**
 * Group components by category
 */
function groupByCategory(
  components: ComponentMeta[]
): Record<string, ComponentMeta[]> {
  const groups: Record<string, ComponentMeta[]> = {}

  for (const component of components) {
    const key = component.subcategory
      ? `${component.category}/${component.subcategory}`
      : component.category

    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(component)
  }

  // Sort each group alphabetically
  for (const key of Object.keys(groups)) {
    groups[key].sort((a, b) => a.title.localeCompare(b.title))
  }

  return groups
}

/**
 * Generate statistics
 */
function generateStats(components: ComponentMeta[]) {
  return {
    total: components.length,
    byCategory: Object.entries(
      components.reduce(
        (acc, c) => {
          acc[c.category] = (acc[c.category] || 0) + 1
          return acc
        },
        {} as Record<string, number>
      )
    ).sort((a, b) => b[1] - a[1]),
    hooks: components.filter((c) => c.tags.includes('hook')).length,
    new: components.filter((c) => c.isNew).length,
    beta: components.filter((c) => c.isBeta).length,
    deprecated: components.filter((c) => c.isDeprecated).length,
  }
}

/**
 * Main generation function
 */
function main(): void {
  console.log('🔍 Scanning story files...\n')

  // Find all story files
  const storyFiles = findStoryFiles(STORIES_DIR)
  console.log(`📚 Found ${storyFiles.length} story files\n`)

  // Extract metadata
  const components: ComponentMeta[] = []
  let skipped = 0

  for (const file of storyFiles) {
    const meta = extractMeta(file)
    if (meta) {
      components.push(meta)
    } else {
      skipped++
    }
  }

  console.log(`✅ Extracted ${components.length} components`)
  if (skipped > 0) {
    console.log(`⚠️  Skipped ${skipped} files (no title found)`)
  }

  // Group and generate stats
  const grouped = groupByCategory(components)
  const stats = generateStats(components)

  const output = {
    generated: new Date().toISOString(),
    stats,
    categories: Object.keys(grouped).sort(),
    components: grouped,
    flat: components.sort((a, b) => a.title.localeCompare(b.title)),
  }

  // Ensure output directory exists
  mkdirSync(OUTPUT_DIR, { recursive: true })

  // Write output
  writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2))

  console.log(`\n📦 Generated: ${relative(process.cwd(), OUTPUT_FILE)}`)
  console.log('\n📊 Statistics:')
  console.log(`   Total: ${stats.total} components`)
  console.log(`   Hooks: ${stats.hooks}`)
  console.log(`   New: ${stats.new}`)
  console.log(`   Beta: ${stats.beta}`)
  console.log(`   Deprecated: ${stats.deprecated}`)
  console.log('\n📁 Categories:')
  for (const [cat, count] of stats.byCategory) {
    console.log(`   ${cat}: ${count}`)
  }
}

main()
