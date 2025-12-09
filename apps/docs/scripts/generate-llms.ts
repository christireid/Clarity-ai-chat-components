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

import { readFile, writeFile, readdir, stat } from 'fs/promises'
import { join, relative } from 'path'
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
} from './types'

// Configuration
const DOCS_DIR = join(process.cwd(), 'app')
const OUTPUT_DIR = join(process.cwd(), 'public')
const MAX_TOKENS = 500000
const MAX_PAGE_TOKENS = 50000

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

  const pageContents: { urlPath: string; title: string; content: string }[] = []
  let totalTokens = 0

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
      if (pageTokens > MAX_PAGE_TOKENS) {
        const truncatedLength = MAX_PAGE_TOKENS * 4
        finalContent =
          markdown.slice(0, truncatedLength) +
          '\n\n[Content truncated due to length]'
        stats.truncatedPages.push(urlPath)
      }

      pageContents.push({
        urlPath,
        title: extracted.title,
        content: finalContent,
      })

      totalTokens += estimateTokens(finalContent)
      stats.totalPages++
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      stats.warnings.push(`Failed to process ${urlPath}: ${errorMessage}`)
    }
  }

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
  console.log(`📁 Docs directory: ${DOCS_DIR}`)
  console.log(`📂 Output directory: ${OUTPUT_DIR}`)
  console.log('')

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

  // Generate llms.txt
  console.log('📝 Generating llms.txt...')
  const llmsTxt = generateLlmsTxt(navigationConfig)
  console.log(`   Generated ${estimateTokens(llmsTxt)} estimated tokens`)

  // Generate llms-full.txt
  console.log('📄 Generating llms-full.txt...')
  const llmsFullTxt = await generateLlmsFullTxt(pages, stats)
  console.log(`   Processed ${stats.totalPages} pages`)
  console.log(`   Generated ${stats.totalTokens} estimated tokens`)

  // Write output files
  console.log('💾 Writing output files...')
  await writeFile(join(OUTPUT_DIR, 'llms.txt'), llmsTxt, 'utf-8')
  await writeFile(join(OUTPUT_DIR, 'llms-full.txt'), llmsFullTxt, 'utf-8')
  console.log('   ✅ llms.txt')
  console.log('   ✅ llms-full.txt')

  // Report stats
  console.log('')
  console.log('📊 Generation Statistics:')
  console.log(`   Total pages: ${stats.totalPages}`)
  console.log(`   Total tokens: ${stats.totalTokens}`)
  console.log(`   Skipped pages: ${stats.skippedPages.length}`)
  console.log(`   Truncated pages: ${stats.truncatedPages.length}`)

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
  console.log('✨ Generation complete!')

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
