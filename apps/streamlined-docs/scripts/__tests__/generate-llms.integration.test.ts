/**
 * Integration tests for llms.txt generation
 * Tests the full generation pipeline end-to-end
 */

import { describe, it, expect, beforeAll } from 'vitest'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { generateLlmsDocs } from '../generate-llms'

describe('generateLlmsDocs integration', () => {
  let result: Awaited<ReturnType<typeof generateLlmsDocs>>

  beforeAll(async () => {
    // Run full generation (takes ~2-3 seconds)
    result = await generateLlmsDocs()
  }, 30000) // 30 second timeout for generation

  describe('llms.txt output', () => {
    it('should start with correct header', () => {
      expect(result.llmsTxt).toMatch(/^# Clarity Chat\n/)
    })

    it('should contain project description blockquote', () => {
      expect(result.llmsTxt).toContain('> ')
    })

    it('should have section headers', () => {
      expect(result.llmsTxt).toContain('## Quick Start')
      expect(result.llmsTxt).toContain('## Core Concepts')
      expect(result.llmsTxt).toContain('## Main Components')
    })

    it('should have properly formatted links', () => {
      // Links should be in markdown format: [Title](url): Description
      const linkPattern = /- \[.+\]\(https:\/\/clarity-chat\.dev\/.+\): .+/
      expect(result.llmsTxt).toMatch(linkPattern)
    })

    it('should not have duplicate sections', () => {
      const sections = result.llmsTxt.match(/^## .+$/gm) || []
      const uniqueSections = new Set(sections)
      expect(sections.length).toBe(uniqueSections.size)
    })

    it('should contain AI-Optimized APIs section', () => {
      expect(result.llmsTxt).toContain('## AI-Optimized APIs')
    })

    it('should contain MCP Server configuration', () => {
      expect(result.llmsTxt).toContain('### MCP Server')
      expect(result.llmsTxt).toContain('"mcpServers"')
    })

    it('should be under 10K tokens', () => {
      const estimatedTokens = Math.ceil(result.llmsTxt.length / 4)
      expect(estimatedTokens).toBeLessThan(10000)
    })
  })

  describe('llms-full.txt output', () => {
    it('should start with documentation header', () => {
      expect(result.llmsFullTxt).toMatch(
        /^# Clarity Chat - Complete Documentation\n/
      )
    })

    it('should contain table of contents', () => {
      expect(result.llmsFullTxt).toContain('## Table of Contents')
    })

    it('should use XML-style doc delimiters', () => {
      expect(result.llmsFullTxt).toMatch(/<doc url="[^"]+" title="[^"]+">/s)
      expect(result.llmsFullTxt).toMatch(/<\/doc>/s)
    })

    it('should have properly closed doc tags', () => {
      const openTags = (result.llmsFullTxt.match(/<doc /g) || []).length
      const closeTags = (result.llmsFullTxt.match(/<\/doc>/g) || []).length
      expect(openTags).toBe(closeTags)
    })

    it('should be under 500K tokens', () => {
      const estimatedTokens = Math.ceil(result.llmsFullTxt.length / 4)
      expect(estimatedTokens).toBeLessThan(500000)
    })

    it('should contain multiple documentation pages', () => {
      const docCount = (result.llmsFullTxt.match(/<doc /g) || []).length
      expect(docCount).toBeGreaterThan(100) // Should have many pages
    })
  })

  describe('generation statistics', () => {
    it('should report total pages processed', () => {
      expect(result.stats.totalPages).toBeGreaterThan(0)
    })

    it('should report total tokens', () => {
      expect(result.stats.totalTokens).toBeGreaterThan(0)
    })

    it('should have generation timestamp', () => {
      expect(result.stats.generatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/)
    })

    it('should track skipped pages', () => {
      expect(Array.isArray(result.stats.skippedPages)).toBe(true)
    })

    it('should track truncated pages', () => {
      expect(Array.isArray(result.stats.truncatedPages)).toBe(true)
    })

    it('should track warnings', () => {
      expect(Array.isArray(result.stats.warnings)).toBe(true)
    })
  })

  describe('content quality', () => {
    it('should not contain raw JSX components in output', () => {
      // Should not have our custom JSX components in the markdown output
      expect(result.llmsFullTxt).not.toMatch(/<CodePlayground/i)
      expect(result.llmsFullTxt).not.toMatch(/<EnhancedCodeBlock/i)
      // Note: className=" may appear legitimately in code examples showing JSX
    })

    it('should not have excessive className patterns outside code blocks', () => {
      // Remove code blocks to check prose content only
      const withoutCodeBlocks = result.llmsFullTxt.replace(
        /```[\s\S]*?```/g,
        ''
      )
      // Count className occurrences in prose (some may leak but should be minimal)
      const classNameCount = (withoutCodeBlocks.match(/className="/g) || [])
        .length
      // Current baseline is ~90 due to complex JSX in enterprise pages
      // TODO: Reduce this with improved AST-based extraction (Option H)
      // For now, flag if it gets significantly worse
      expect(classNameCount).toBeLessThan(150)
    })

    it('should not have empty doc sections', () => {
      // Each doc should have some content between tags
      const emptyDocs = result.llmsFullTxt.match(/<doc[^>]*>\s*<\/doc>/g)
      expect(emptyDocs).toBeNull()
    })

    it('should contain code blocks in markdown format', () => {
      // Should have markdown code blocks, not JSX
      expect(result.llmsFullTxt).toMatch(/```\w+\n/)
    })
  })

  describe('URL consistency', () => {
    it('should use consistent base URL', () => {
      // All links should use the same base URL
      const urls = result.llmsTxt.match(/https:\/\/[^)\s]+/g) || []
      const baseUrls = urls.map((url) => new URL(url).origin)
      const uniqueBaseUrls = new Set(baseUrls)
      expect(uniqueBaseUrls.size).toBe(1)
      expect(uniqueBaseUrls.has('https://clarity-chat.dev')).toBe(true)
    })
  })
})
