#!/usr/bin/env npx tsx
/**
 * Story Link Validator
 *
 * Validates that all story links in MDX documentation files point to
 * actual existing stories. Helps catch broken links before they reach production.
 *
 * Usage:
 *   npx tsx scripts/validate-story-links.ts
 *   pnpm validate-links
 *
 * Exit codes:
 *   0 - All links valid
 *   1 - Broken links found
 */

import { readFileSync, readdirSync, statSync } from 'fs'
import { join, relative } from 'path'

const STORIES_DIR = join(__dirname, '../stories')
const LINK_PATTERN = /\?path=\/(?:docs|story)\/([a-z0-9-]+)--([a-z0-9-]+)/gi
const STORY_TITLE_PATTERN = /title:\s*['"]([^'"]+)['"]/g
const META_TITLE_PATTERN = /<Meta\s+title=["']([^"']+)["']/g

interface ValidationResult {
  file: string
  brokenLinks: Array<{
    link: string
    expectedPath: string
  }>
}

/**
 * Recursively find all files matching a pattern
 */
function findFiles(dir: string, pattern: RegExp): string[] {
  const files: string[] = []

  const items = readdirSync(dir)
  for (const item of items) {
    const fullPath = join(dir, item)
    const stat = statSync(fullPath)

    if (stat.isDirectory()) {
      files.push(...findFiles(fullPath, pattern))
    } else if (pattern.test(item)) {
      files.push(fullPath)
    }
  }

  return files
}

/**
 * Extract story paths from .stories.tsx files
 * Converts title like "Components/Inputs/Button" to "components-inputs-button"
 */
function extractStoryPaths(storyFiles: string[]): Set<string> {
  const paths = new Set<string>()

  for (const file of storyFiles) {
    const content = readFileSync(file, 'utf-8')

    // Extract title from meta object
    const titleMatches = [...content.matchAll(STORY_TITLE_PATTERN)]
    for (const match of titleMatches) {
      const title = match[1]
      // Convert "Components/Inputs/Button" to "components-inputs-button"
      const normalizedPath = title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/\//g, '-')
      paths.add(normalizedPath)
    }
  }

  return paths
}

/**
 * Extract documentation paths from .mdx files
 * Converts Meta title to expected path format
 */
function extractMdxPaths(mdxFiles: string[]): Set<string> {
  const paths = new Set<string>()

  for (const file of mdxFiles) {
    const content = readFileSync(file, 'utf-8')

    // Extract title from <Meta title="..." />
    const metaMatches = [...content.matchAll(META_TITLE_PATTERN)]
    for (const match of metaMatches) {
      const title = match[1]
      // Convert "Hooks/Overview" to "hooks-overview"
      const normalizedPath = title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/\//g, '-')
      paths.add(normalizedPath)
    }
  }

  return paths
}

/**
 * Extract links from MDX files and validate them
 */
function validateMdxLinks(
  mdxFiles: string[],
  validPaths: Set<string>
): ValidationResult[] {
  const results: ValidationResult[] = []

  for (const file of mdxFiles) {
    const content = readFileSync(file, 'utf-8')
    const brokenLinks: ValidationResult['brokenLinks'] = []

    // Find all story links
    const linkMatches = [...content.matchAll(LINK_PATTERN)]
    for (const match of linkMatches) {
      const fullMatch = match[0]
      const storyPath = match[1] // e.g., "components-inputs-button"

      // Check if this path exists in our valid paths
      // We check if any valid path starts with the linked path
      // This handles cases where the link is to a component but stories have variants
      const isValid = [...validPaths].some(
        (validPath) =>
          validPath === storyPath || validPath.startsWith(storyPath + '-')
      )

      if (!isValid) {
        brokenLinks.push({
          link: fullMatch,
          expectedPath: storyPath,
        })
      }
    }

    if (brokenLinks.length > 0) {
      results.push({
        file: relative(STORIES_DIR, file),
        brokenLinks,
      })
    }
  }

  return results
}

/**
 * Main validation function
 */
function main(): void {
  console.log('🔍 Validating story links...\n')

  // Find all story and MDX files
  const storyFiles = findFiles(STORIES_DIR, /\.stories\.tsx$/)
  const mdxFiles = findFiles(STORIES_DIR, /\.mdx$/)

  console.log(`📚 Found ${storyFiles.length} story files`)
  console.log(`📄 Found ${mdxFiles.length} MDX files\n`)

  // Extract valid paths
  const storyPaths = extractStoryPaths(storyFiles)
  const mdxPaths = extractMdxPaths(mdxFiles)
  const allValidPaths = new Set([...storyPaths, ...mdxPaths])

  console.log(`✅ Found ${allValidPaths.size} valid story/doc paths\n`)

  // Validate links
  const validationResults = validateMdxLinks(mdxFiles, allValidPaths)

  if (validationResults.length === 0) {
    console.log('✅ All story links are valid!\n')
    process.exit(0)
  }

  // Report broken links
  console.log('❌ Found broken links:\n')

  let totalBroken = 0
  for (const result of validationResults) {
    console.log(`📄 ${result.file}:`)
    for (const broken of result.brokenLinks) {
      console.log(`   ❌ ${broken.link}`)
      console.log(`      Expected path: ${broken.expectedPath}`)
      totalBroken++
    }
    console.log('')
  }

  console.log(`\n💔 Total broken links: ${totalBroken}`)
  console.log('\nTo fix:')
  console.log('1. Check the story path matches the title in the story file')
  console.log('2. Ensure the story file exists')
  console.log(
    '3. Run `pnpm dev` and verify the path in the Storybook sidebar\n'
  )

  process.exit(1)
}

main()
