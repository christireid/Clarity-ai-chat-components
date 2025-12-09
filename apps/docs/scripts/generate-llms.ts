#!/usr/bin/env tsx
/**
 * Generate AI-optimized documentation files
 *
 * This script generates:
 * - llms.txt: Concise navigation file with site structure
 * - llms-full.txt: Complete documentation in a single file
 *
 * Usage:
 *   pnpm run generate:llms
 *   tsx scripts/generate-llms.ts
 */

import { readFile, writeFile, mkdir, access } from 'fs/promises'
import { join, relative, dirname } from 'path'
import { glob } from 'glob'
import {
  navigationConfig,
  projectDescription,
  mcpServerConfig,
  mcpTools,
  BASE_URL,
} from './navigation-config'
import {
  extractPageContent,
  contentToMarkdown,
  estimateTokens,
} from './lib/content-extractor'
import type {
  GenerationResult,
  GenerationStats,
  NavigationSection,
  NavigationItem,
  DocPage,
  CategoryMetrics,
  FileSizeMetrics,
} from './types'

// Configuration
const DOCS_DIR = join(process.cwd(), 'app')
const OUTPUT_DIR = join(process.cwd(), 'public')
const MAX_TOKENS = 500000
const MAX_PAGE_TOKENS = 50000

// Command line arguments
const args = process.argv.slice(2)
const DRY_RUN = args.includes('--dry-run') || args.includes('--preview')
const VERBOSE = args.includes('--verbose') || args.includes('-v')

/**
 * Format bytes to human-readable string
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Calculate file size metrics
 */
function calculateFileSizeMetrics(
  llmsTxt: string,
  llmsFullTxt: string
): FileSizeMetrics {
  const llmsTxtBytes = Buffer.byteLength(llmsTxt, 'utf-8')
  const llmsFullTxtBytes = Buffer.byteLength(llmsFullTxt, 'utf-8')
  return {
    llmsTxtBytes,
    llmsFullTxtBytes,
    llmsTxtHuman: formatBytes(llmsTxtBytes),
    llmsFullTxtHuman: formatBytes(llmsFullTxtBytes),
  }
}

/**
 * Print metrics dashboard to console
 */
function printMetricsDashboard(stats: GenerationStats): void {
  console.log('')
  console.log(
    '╔══════════════════════════════════════════════════════════════╗'
  )
  console.log(
    '║                    📊 METRICS DASHBOARD                      ║'
  )
  console.log(
    '╠══════════════════════════════════════════════════════════════╣'
  )

  // File sizes
  if (stats.fileSizes) {
    console.log(
      '║  📦 FILE SIZES                                               ║'
    )
    console.log(
      `║     llms.txt:      ${stats.fileSizes.llmsTxtHuman.padEnd(12)} (${stats.llmsTxtTokens?.toLocaleString() || 'N/A'} tokens)`.padEnd(
        65
      ) + '║'
    )
    console.log(
      `║     llms-full.txt: ${stats.fileSizes.llmsFullTxtHuman.padEnd(12)} (${stats.totalTokens.toLocaleString()} tokens)`.padEnd(
        65
      ) + '║'
    )
    console.log(
      '╠──────────────────────────────────────────────────────────────╣'
    )
  }

  // Page statistics
  console.log(
    '║  📄 PAGE STATISTICS                                          ║'
  )
  console.log(
    `║     Total pages processed: ${stats.totalPages.toString().padEnd(6)}                          ║`
  )
  console.log(
    `║     Skipped (drafts):      ${stats.skippedPages.length.toString().padEnd(6)}                          ║`
  )
  console.log(
    `║     Truncated (too long):  ${stats.truncatedPages.length.toString().padEnd(6)}                          ║`
  )

  // Category breakdown
  if (stats.categoryMetrics && stats.categoryMetrics.length > 0) {
    console.log(
      '╠──────────────────────────────────────────────────────────────╣'
    )
    console.log(
      '║  📁 TOKEN DISTRIBUTION BY CATEGORY                          ║'
    )
    console.log(
      '║                                                              ║'
    )

    // Sort by token count descending
    const sorted = [...stats.categoryMetrics].sort(
      (a, b) => b.tokenCount - a.tokenCount
    )

    for (const cat of sorted.slice(0, 10)) {
      const bar = '█'.repeat(Math.round(cat.tokenPercentage / 5))
      const barPadded = bar.padEnd(20)
      const line = `║     ${cat.category.padEnd(12)} ${barPadded} ${cat.tokenPercentage.toFixed(1).padStart(5)}% (${cat.tokenCount.toLocaleString()} tokens)`
      console.log(line.padEnd(65) + '║')
    }

    if (sorted.length > 10) {
      console.log(
        `║     ... and ${sorted.length - 10} more categories`.padEnd(65) + '║'
      )
    }
  }

  // Warnings summary
  if (stats.warnings.length > 0) {
    console.log(
      '╠──────────────────────────────────────────────────────────────╣'
    )
    console.log(`║  ⚠️  ${stats.warnings.length} WARNING(S)`.padEnd(64) + '║')
  }

  console.log(
    '╚══════════════════════════════════════════════════════════════╝'
  )
}

/**
 * Check if a directory exists
 */
async function directoryExists(path: string): Promise<boolean> {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

/**
 * Validate that required directories exist
 */
async function validateDirectories(): Promise<void> {
  if (!(await directoryExists(DOCS_DIR))) {
    throw new Error(
      `Documentation directory not found: ${DOCS_DIR}\n` +
        `Make sure to run this script from apps/docs directory.`
    )
  }

  // Create output directory if it doesn't exist
  if (!(await directoryExists(OUTPUT_DIR))) {
    await mkdir(OUTPUT_DIR, { recursive: true })
    console.log(`📁 Created output directory: ${OUTPUT_DIR}`)
  }
}

/**
 * Generate the llms.txt navigation file
 */
function generateLlmsTxt(navigation: NavigationSection[]): string {
  const lines: string[] = []

  // Header
  lines.push('# Clarity Chat')
  lines.push('')
  lines.push(`> ${projectDescription.split('\n')[0]}`)
  lines.push('')
  lines.push(projectDescription.split('\n').slice(1).join('\n').trim())
  lines.push('')

  // Navigation sections
  for (const section of navigation) {
    lines.push(`## ${section.title}`)
    lines.push('')

    for (const item of section.items) {
      if (item.href) {
        const url = `${BASE_URL}${item.href}`
        const description = item.description || item.title
        lines.push(`- [${item.title}](${url}): ${description}`)
      }
    }
    lines.push('')
  }

  // AI-Optimized APIs section
  lines.push('## AI-Optimized APIs')
  lines.push('')
  lines.push(
    'Programmatic access to Clarity Chat documentation for AI systems and RAG applications:'
  )
  lines.push('')
  lines.push(
    `- [Components API](${BASE_URL}/api/ai/components): JSON endpoint with all component documentation`
  )
  lines.push(
    `- [Hooks API](${BASE_URL}/api/ai/hooks): JSON endpoint with all hook documentation`
  )
  lines.push(
    `- [Search API](${BASE_URL}/api/ai/search): Full-text search across all documentation`
  )
  lines.push(
    `- [Health API](${BASE_URL}/api/ai/health): API health and status monitoring`
  )
  lines.push(
    `- [OpenAPI Spec](${BASE_URL}/openapi.json): Full OpenAPI 3.0 specification`
  )
  lines.push('')

  // MCP Server section
  lines.push('### MCP Server')
  lines.push('')
  lines.push(
    'Model Context Protocol server for Claude Code and other AI tools:'
  )
  lines.push('')
  lines.push('```json')
  lines.push(mcpServerConfig)
  lines.push('```')
  lines.push('')
  lines.push(
    `Available MCP tools: ${mcpTools.map((t) => `\`${t}\``).join(', ')}`
  )
  lines.push('')

  return lines.join('\n')
}

/**
 * Discover all page.tsx files in the docs app
 */
async function discoverPages(): Promise<string[]> {
  const pattern = join(DOCS_DIR, '**/page.tsx')
  const files = await glob(pattern, {
    ignore: ['**/node_modules/**', '**/_*/**'],
  })
  return files.sort()
}

/**
 * Convert file path to URL path
 */
function filePathToUrlPath(filePath: string): string {
  const relativePath = relative(DOCS_DIR, filePath)
  // Remove page.tsx and convert to URL path
  let urlPath =
    '/' + relativePath.replace(/\/page\.tsx$/, '').replace(/\\/g, '/')

  // Handle dynamic routes - skip them
  if (urlPath.includes('[')) {
    return ''
  }

  // Handle root path
  if (urlPath === '/') {
    return '/'
  }

  return urlPath
}

/**
 * Get category from URL path
 */
function getCategoryFromPath(urlPath: string): string {
  const parts = urlPath.split('/').filter(Boolean)
  if (parts.length === 0) return 'Home'
  const category = parts[0]
  return category.charAt(0).toUpperCase() + category.slice(1)
}

/**
 * Extract all hrefs from navigation config
 */
function getNavigationHrefs(navigation: NavigationSection[]): Set<string> {
  const hrefs = new Set<string>()
  for (const section of navigation) {
    for (const item of section.items) {
      if (item.href) {
        hrefs.add(item.href)
      }
    }
  }
  return hrefs
}

/**
 * Validate navigation config against discovered pages
 * Reports pages that exist but aren't in navigation (potential drift)
 */
function validateNavigationCoverage(
  discoveredPages: string[],
  navigation: NavigationSection[],
  stats: GenerationStats
): void {
  const navHrefs = getNavigationHrefs(navigation)
  const discoveredPaths = new Set<string>()

  // Convert file paths to URL paths
  for (const filePath of discoveredPages) {
    const urlPath = filePathToUrlPath(filePath)
    if (urlPath && urlPath !== '/') {
      discoveredPaths.add(urlPath)
    }
  }

  // Find pages in navigation that don't exist (broken links)
  const brokenLinks: string[] = []
  for (const href of navHrefs) {
    // Skip external links and API routes
    if (href.startsWith('/api/') || href.startsWith('http')) {
      continue
    }
    if (!discoveredPaths.has(href)) {
      brokenLinks.push(href)
    }
  }

  if (brokenLinks.length > 0) {
    stats.warnings.push(
      `Navigation contains ${brokenLinks.length} links to non-existent pages`
    )
    // Log first few for visibility
    for (const link of brokenLinks.slice(0, 5)) {
      stats.warnings.push(`  - Broken link: ${link}`)
    }
  }

  // Find important pages not in navigation (potential drift)
  // Only check main documentation paths, skip special routes
  const importantPrefixes = [
    '/learn/',
    '/reference/',
    '/guides/',
    '/cookbook/',
    '/examples/',
  ]
  const undocumented: string[] = []

  for (const path of discoveredPaths) {
    const isImportant = importantPrefixes.some((prefix) =>
      path.startsWith(prefix)
    )
    if (isImportant && !navHrefs.has(path)) {
      undocumented.push(path)
    }
  }

  if (undocumented.length > 0 && undocumented.length <= 20) {
    // Only warn if reasonable number (not a full restructure)
    stats.warnings.push(
      `${undocumented.length} documentation pages not in navigation config (may need to update navigation-config.ts)`
    )
  }
}

/**
 * Validate navigation item descriptions for quality
 */
function validateDescriptions(
  navigation: NavigationSection[],
  stats: GenerationStats
): void {
  const issues: string[] = []

  // Generic/unhelpful description patterns
  const genericPatterns = [
    /^documentation for/i,
    /^the .+ component$/i,
    /^a component that/i,
    /^this (page|component|hook)/i,
  ]

  for (const section of navigation) {
    for (const item of section.items) {
      const desc = item.description || ''

      // Check for missing descriptions
      if (!desc || desc.trim() === '') {
        issues.push(`Missing description: ${item.title}`)
        continue
      }

      // Check for too-short descriptions (less than 15 chars)
      if (desc.length < 15) {
        issues.push(
          `Description too short (${desc.length} chars): ${item.title}`
        )
      }

      // Check for too-long descriptions (over 100 chars)
      if (desc.length > 100) {
        issues.push(
          `Description too long (${desc.length} chars): ${item.title}`
        )
      }

      // Check for generic descriptions
      for (const pattern of genericPatterns) {
        if (pattern.test(desc)) {
          issues.push(`Generic description: "${desc}" for ${item.title}`)
          break
        }
      }
    }
  }

  if (issues.length > 0) {
    stats.warnings.push(`${issues.length} description quality issues found`)
    // Show first few issues
    for (const issue of issues.slice(0, 5)) {
      stats.warnings.push(`  - ${issue}`)
    }
    if (issues.length > 5) {
      stats.warnings.push(`  ... and ${issues.length - 5} more`)
    }
  }
}

/**
 * Generate the llms-full.txt complete documentation file
 */
async function generateLlmsFullTxt(
  pages: string[],
  stats: GenerationStats
): Promise<string> {
  const lines: string[] = []

  // Header
  lines.push('# Clarity Chat - Complete Documentation')
  lines.push('')
  lines.push(`> ${projectDescription.split('\n')[0]}`)
  lines.push('')
  lines.push(
    'This document contains the complete documentation for Clarity Chat in a single file optimized for AI consumption.'
  )
  lines.push('')
  lines.push('---')
  lines.push('')

  // Table of contents
  lines.push('## Table of Contents')
  lines.push('')

  const pageContents: {
    urlPath: string
    title: string
    content: string
    category: string
    tokens: number
  }[] = []
  let totalTokens = 0
  const categoryTokens: Map<string, { count: number; tokens: number }> =
    new Map()

  // Process each page
  for (const filePath of pages) {
    const urlPath = filePathToUrlPath(filePath)
    if (!urlPath) continue // Skip dynamic routes

    try {
      const extracted = await extractPageContent(filePath)

      // Skip draft pages
      if (extracted.isDraft) {
        stats.skippedPages.push(urlPath)
        continue
      }

      const markdown = contentToMarkdown(extracted)
      const pageTokens = estimateTokens(markdown)

      // Check if we'd exceed the limit
      if (totalTokens + pageTokens > MAX_TOKENS) {
        stats.warnings.push(`Reached token limit at ${urlPath}`)
        break
      }

      // Truncate if single page is too large
      let finalContent = markdown
      let finalTokens = pageTokens
      if (pageTokens > MAX_PAGE_TOKENS) {
        const truncatedLength = MAX_PAGE_TOKENS * 4
        finalContent =
          markdown.slice(0, truncatedLength) +
          '\n\n[Content truncated due to length]'
        finalTokens = estimateTokens(finalContent)
        stats.truncatedPages.push(urlPath)
      }

      const category = getCategoryFromPath(urlPath)
      pageContents.push({
        urlPath,
        title: extracted.title,
        content: finalContent,
        category,
        tokens: finalTokens,
      })

      // Track category metrics
      const existing = categoryTokens.get(category) || { count: 0, tokens: 0 }
      categoryTokens.set(category, {
        count: existing.count + 1,
        tokens: existing.tokens + finalTokens,
      })

      totalTokens += finalTokens
      stats.totalPages++
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      stats.warnings.push(`Failed to process ${urlPath}: ${errorMessage}`)
    }
  }

  // Calculate category metrics with percentages
  stats.categoryMetrics = Array.from(categoryTokens.entries()).map(
    ([category, data]) => ({
      category,
      pageCount: data.count,
      tokenCount: data.tokens,
      tokenPercentage: totalTokens > 0 ? (data.tokens / totalTokens) * 100 : 0,
    })
  )

  // Build TOC
  let tocIndex = 1
  for (const page of pageContents) {
    const anchor = page.urlPath.replace(/\//g, '-').replace(/^-/, '')
    lines.push(`${tocIndex}. [${page.title}](#${anchor})`)
    tocIndex++
  }
  lines.push('')
  lines.push('---')
  lines.push('')

  // Add page contents with XML-style delimiters (Claude-optimized)
  for (const page of pageContents) {
    lines.push(`<doc url="${page.urlPath}" title="${page.title}">`)
    lines.push(page.content)
    lines.push('</doc>')
    lines.push('')
  }

  stats.totalTokens = totalTokens
  return lines.join('\n')
}

/**
 * Main generation function
 */
async function generateLlmsDocs(): Promise<GenerationResult> {
  console.log('🚀 Starting llms.txt generation...')
  if (DRY_RUN) {
    console.log('🔍 DRY RUN MODE - no files will be written')
  }
  console.log(`📁 Docs directory: ${DOCS_DIR}`)
  console.log(`📂 Output directory: ${OUTPUT_DIR}`)
  console.log('')

  // Validate directories exist
  await validateDirectories()

  const stats: GenerationStats = {
    totalPages: 0,
    totalTokens: 0,
    generatedAt: new Date().toISOString(),
    skippedPages: [],
    truncatedPages: [],
    warnings: [],
  }

  // Discover pages
  console.log('🔍 Discovering documentation pages...')
  const pages = await discoverPages()
  console.log(`   Found ${pages.length} page files`)

  // Validate navigation coverage
  console.log('🔗 Validating navigation config...')
  validateNavigationCoverage(pages, navigationConfig, stats)
  validateDescriptions(navigationConfig, stats)

  // Generate llms.txt
  console.log('📝 Generating llms.txt...')
  const llmsTxt = generateLlmsTxt(navigationConfig)
  stats.llmsTxtTokens = estimateTokens(llmsTxt)
  console.log(`   Generated ${stats.llmsTxtTokens} estimated tokens`)

  // Generate llms-full.txt
  console.log('📄 Generating llms-full.txt...')
  const llmsFullTxt = await generateLlmsFullTxt(pages, stats)
  console.log(`   Processed ${stats.totalPages} pages`)
  console.log(`   Generated ${stats.totalTokens} estimated tokens`)

  // Calculate file size metrics
  stats.fileSizes = calculateFileSizeMetrics(llmsTxt, llmsFullTxt)

  // Write output files (skip in dry-run mode)
  if (DRY_RUN) {
    console.log('💾 Would write output files (dry-run):')
    console.log('   📄 llms.txt')
    console.log('   📄 llms-full.txt')
    console.log('   📄 llms-metrics.json')
  } else {
    console.log('💾 Writing output files...')
    await writeFile(join(OUTPUT_DIR, 'llms.txt'), llmsTxt, 'utf-8')
    await writeFile(join(OUTPUT_DIR, 'llms-full.txt'), llmsFullTxt, 'utf-8')
    console.log('   ✅ llms.txt')
    console.log('   ✅ llms-full.txt')

    // Write metrics JSON for CI/CD tracking
    const metricsJson = JSON.stringify(
      {
        generatedAt: stats.generatedAt,
        totalPages: stats.totalPages,
        totalTokens: stats.totalTokens,
        llmsTxtTokens: stats.llmsTxtTokens,
        fileSizes: stats.fileSizes,
        categoryMetrics: stats.categoryMetrics,
        skippedCount: stats.skippedPages.length,
        truncatedCount: stats.truncatedPages.length,
        warningCount: stats.warnings.length,
      },
      null,
      2
    )
    await writeFile(join(OUTPUT_DIR, 'llms-metrics.json'), metricsJson, 'utf-8')
    console.log('   ✅ llms-metrics.json')
  }

  // Print metrics dashboard
  printMetricsDashboard(stats)

  // Print warnings if any
  if (stats.warnings.length > 0) {
    console.log('')
    console.log('⚠️  Warnings:')
    for (const warning of stats.warnings.slice(0, 10)) {
      console.log(`   - ${warning}`)
    }
    if (stats.warnings.length > 10) {
      console.log(`   ... and ${stats.warnings.length - 10} more`)
    }
  }

  console.log('')
  if (DRY_RUN) {
    console.log('✨ Dry run complete! No files were modified.')
  } else {
    console.log('✨ Generation complete!')
  }

  return {
    llmsTxt,
    llmsFullTxt,
    mdPages: new Map(), // Individual .md routes handled separately
    stats,
  }
}

// Run if executed directly
if (process.argv[1]?.includes('generate-llms')) {
  generateLlmsDocs()
    .then((result) => {
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Generation failed:', error)
      process.exit(1)
    })
}

export { generateLlmsDocs }
