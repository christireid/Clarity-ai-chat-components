/**
 * TypeScript type definitions for llms.txt generation
 */

/**
 * Represents a single documentation page
 */
export interface DocPage {
  /** URL path relative to site root (e.g., "/learn/quick-start") */
  path: string
  /** Page title extracted from metadata or filename */
  title: string
  /** Brief description of the page content */
  description: string
  /** The category/section this page belongs to */
  category: string
  /** Full content of the page in markdown format */
  content: string
  /** Whether this page should be included in llms.txt */
  isPublic: boolean
  /** Whether this is a draft page */
  isDraft: boolean
  /** Order within its category for sorting */
  order: number
}

/**
 * Navigation item for sidebar structure
 */
export interface NavigationItem {
  /** Display title */
  title: string
  /** URL path if this is a link */
  href?: string
  /** Brief description for llms.txt */
  description?: string
  /** Child navigation items */
  items?: NavigationItem[]
  /** Whether this is an optional/advanced section */
  isOptional?: boolean
  /** Sort order */
  order?: number
}

/**
 * Navigation section for grouping related pages
 */
export interface NavigationSection {
  /** Section title (e.g., "Getting Started") */
  title: string
  /** Pages in this section */
  items: NavigationItem[]
  /** Whether this section is optional/advanced */
  isOptional?: boolean
}

/**
 * Configuration for the generation process
 */
export interface GenerationConfig {
  /** Directory containing documentation pages */
  docsDir: string
  /** Output directory for generated files */
  outputDir: string
  /** Base URL for the documentation site */
  baseUrl: string
  /** Navigation structure definition */
  navigation: NavigationSection[]
  /** Maximum tokens for llms-full.txt */
  maxTokens: number
  /** Maximum tokens for individual pages */
  maxPageTokens: number
}

/**
 * Statistics from the generation process
 */
export interface GenerationStats {
  /** Total number of pages processed */
  totalPages: number
  /** Estimated token count for llms-full.txt */
  totalTokens: number
  /** ISO timestamp of generation */
  generatedAt: string
  /** Pages that were skipped */
  skippedPages: string[]
  /** Pages that were truncated */
  truncatedPages: string[]
  /** Any warnings encountered */
  warnings: string[]
}

/**
 * Result of the generation process
 */
export interface GenerationResult {
  /** Content of llms.txt */
  llmsTxt: string
  /** Content of llms-full.txt */
  llmsFullTxt: string
  /** Map of URL path to markdown content for individual .md files */
  mdPages: Map<string, string>
  /** Statistics about the generation */
  stats: GenerationStats
}

/**
 * Extracted content from a page.tsx file
 */
export interface ExtractedPageContent {
  /** Page title from metadata or first h1 */
  title: string
  /** Page description from metadata */
  description: string
  /** Main text content extracted from JSX */
  content: string
  /** Code blocks found in the page */
  codeBlocks: CodeBlock[]
  /** Whether this appears to be a draft */
  isDraft: boolean
}

/**
 * A code block extracted from documentation
 */
export interface CodeBlock {
  /** Programming language */
  language: string
  /** Filename if specified */
  filename?: string
  /** The code content */
  code: string
}

/**
 * Page metadata from Next.js export
 */
export interface PageMetadata {
  title?: string
  description?: string
  keywords?: string[]
  draft?: boolean
}
