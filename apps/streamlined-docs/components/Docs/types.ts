/**
 * Shared TypeScript types for documentation components
 */

// ============================================================================
// API Metadata Types
// ============================================================================

export type APIType = 'component' | 'hook' | 'utility' | 'service' | 'primitive'

export interface APIMetadata {
  /** Unique identifier (used in URLs) */
  slug: string
  /** Display name */
  name: string
  /** API type */
  type: APIType
  /** Short description */
  description: string
  /** Category for grouping */
  category?: string
  /** Tags for filtering and search */
  tags?: string[]
  /** Status flags */
  isNew?: boolean
  isExperimental?: boolean
  isDeprecated?: boolean
  /** Package name */
  package?: string
  /** Version introduced */
  since?: string
}

// ============================================================================
// Navigation Types
// ============================================================================

export interface NavItem {
  /** Display title */
  title: string
  /** URL path */
  href?: string
  /** Child navigation items */
  items?: NavItem[]
  /** Status flags */
  isNew?: boolean
  isExperimental?: boolean
  /** Icon component */
  icon?: React.ComponentType<{ className?: string }>
  /** Description for tooltips */
  description?: string
}

export interface Breadcrumb {
  /** Display label */
  label: string
  /** URL path */
  href: string
}

// ============================================================================
// Search Types
// ============================================================================

export type SearchResultType = 'page' | 'component' | 'hook' | 'guide' | 'api'

export interface SearchResult {
  /** Unique identifier */
  id: string
  /** Result title */
  title: string
  /** Result description or excerpt */
  description?: string
  /** URL to navigate to */
  href: string
  /** Category for grouping */
  category?: string
  /** Result type */
  type?: SearchResultType
  /** Breadcrumb path */
  breadcrumb?: string[]
  /** Search relevance score (0-1) */
  score?: number
  /** Highlighted text snippets */
  highlights?: string[]
}

// ============================================================================
// Code Types
// ============================================================================

export type CodeLanguage =
  | 'typescript'
  | 'javascript'
  | 'tsx'
  | 'jsx'
  | 'json'
  | 'bash'
  | 'shell'
  | 'yaml'
  | 'markdown'
  | 'css'
  | 'scss'
  | 'html'

export interface CodeSnippet {
  /** Code content */
  code: string
  /** Programming language */
  language: CodeLanguage
  /** Optional file name */
  filename?: string
  /** Lines to highlight */
  highlightLines?: number[]
  /** Optional title */
  title?: string
}

// ============================================================================
// Documentation Types
// ============================================================================

export interface PropDefinition {
  /** Property name */
  name: string
  /** TypeScript type */
  type: string
  /** Default value */
  default?: string
  /** Is required */
  required?: boolean
  /** Description */
  description?: string
  /** Is deprecated */
  deprecated?: boolean
  /** Deprecation message */
  deprecatedMessage?: string
  /** Type link (for complex types) */
  typeLink?: string
  /** Type definition (for hover) */
  typeDefinition?: string
}

export interface Example {
  /** Example title */
  title: string
  /** Example description */
  description?: string
  /** Code snippet */
  code: CodeSnippet
  /** Live preview component */
  preview?: React.ReactNode
}

export interface RelatedAPI {
  /** API name */
  name: string
  /** URL slug */
  slug: string
  /** API type */
  type: APIType
  /** Short description */
  description?: string
}

// ============================================================================
// Page Metadata Types
// ============================================================================

export interface PageMetadata {
  /** Page title */
  title: string
  /** Page description */
  description?: string
  /** Breadcrumbs */
  breadcrumbs?: Breadcrumb[]
  /** Previous page */
  previousPage?: {
    title: string
    href: string
  }
  /** Next page */
  nextPage?: {
    title: string
    href: string
  }
  /** Last updated date */
  lastUpdated?: Date
  /** Contributors */
  contributors?: Array<{
    name: string
    avatar?: string
    url?: string
  }>
  /** Edit URL (e.g., GitHub) */
  editUrl?: string
  /** SEO metadata */
  seo?: {
    keywords?: string[]
    canonical?: string
    ogImage?: string
  }
}

// ============================================================================
// Table of Contents Types
// ============================================================================

export interface Heading {
  /** Heading ID (for anchors) */
  id: string
  /** Heading text */
  text: string
  /** Heading level (1-6) */
  level: number
}

// ============================================================================
// Component Status Types
// ============================================================================

export type ComponentStatus = 'stable' | 'beta' | 'alpha' | 'deprecated'

export interface StatusBadge {
  /** Status label */
  status: ComponentStatus
  /** Optional message */
  message?: string
  /** Version information */
  version?: string
}

// ============================================================================
// Layout Types
// ============================================================================

export interface LayoutConfig {
  /** Show sidebar */
  showSidebar?: boolean
  /** Show table of contents */
  showTableOfContents?: boolean
  /** Sidebar width */
  sidebarWidth?: string
  /** TOC width */
  tocWidth?: string
  /** Content max width */
  contentMaxWidth?: string
}

// ============================================================================
// Theme Types
// ============================================================================

export type ThemeMode = 'light' | 'dark' | 'system'

export interface ThemeConfig {
  /** Default theme mode */
  defaultMode?: ThemeMode
  /** Allow theme switching */
  allowToggle?: boolean
  /** Respect system preference */
  respectSystemPreference?: boolean
}
