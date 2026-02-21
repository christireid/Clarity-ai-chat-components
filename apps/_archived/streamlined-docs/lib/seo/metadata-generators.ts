/**
 * SEO Metadata Generators
 *
 * Dynamic metadata generation for all API documentation pages.
 * Provides unique titles, descriptions, OpenGraph, and Twitter cards
 * for optimal search engine and social media visibility.
 */

import { Metadata } from 'next'
import { HookMetadata, ComponentMetadata } from '@/lib/hook-metadata'

const BASE_URL = 'https://clarity-chat.dev'
const SITE_NAME = 'Clarity Chat UI'
const TWITTER_HANDLE = '@claritychat'

interface SEOConfig {
  title: string
  description: string
  url: string
  type?: 'website' | 'article'
  keywords?: string[]
  image?: string
  section?: string
}

/**
 * Generate complete metadata object from SEO config
 */
function generateMetadataFromConfig(config: SEOConfig): Metadata {
  const fullTitle = `${config.title} | ${SITE_NAME}`
  const fullUrl = `${BASE_URL}${config.url}`

  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    openGraph: {
      title: config.title,
      description: config.description,
      url: fullUrl,
      siteName: SITE_NAME,
      type: config.type || 'website',
      ...(config.section && { section: config.section }),
      images: config.image
        ? [
            {
              url: config.image,
              width: 1200,
              height: 630,
              alt: config.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
      creator: TWITTER_HANDLE,
      ...(config.image && { images: [config.image] }),
    },
    alternates: {
      canonical: fullUrl,
    },
  }
}

/**
 * Generate metadata for a hook documentation page
 */
export function generateHookMetadata(hook: HookMetadata): Metadata {
  // Create rich description with use cases and related hooks
  let description = hook.description

  if (hook.useCases && hook.useCases.length > 0) {
    description += `. Use for: ${hook.useCases.slice(0, 2).join(', ')}`
  }

  if (hook.relatedHooks && hook.relatedHooks.length > 0) {
    description += `. Related: ${hook.relatedHooks.slice(0, 2).join(', ')}`
  }

  // Extract unique keywords from tags and name
  const keywords = [
    'react hook',
    hook.name,
    ...hook.tags,
    'typescript',
    'clarity chat',
  ]

  return generateMetadataFromConfig({
    title: `${hook.name} - React Hook`,
    description,
    url: hook.href,
    type: 'article',
    section: 'Hooks',
    keywords,
  })
}

/**
 * Generate metadata for a component documentation page
 */
export function generateComponentMetadata(
  component: ComponentMetadata
): Metadata {
  const description = `${component.description}. Props: ${component.props}. Import from @clarity-chat/react`

  const keywords = [
    'react component',
    component.name,
    ...component.tags,
    'typescript',
    'clarity chat',
    'ui component',
  ]

  return generateMetadataFromConfig({
    title: `${component.name} - React Component`,
    description,
    url: component.href,
    type: 'article',
    section: 'Components',
    keywords,
  })
}

/**
 * Generate metadata for utility documentation page
 */
export function generateUtilityMetadata(params: {
  name: string
  description: string
  category: string
  href: string
  tags?: string[]
}): Metadata {
  const keywords = [
    'utility',
    'helper function',
    params.name,
    ...(params.tags || []),
    'typescript',
    'clarity chat',
  ]

  return generateMetadataFromConfig({
    title: `${params.name} - Utility`,
    description: params.description,
    url: params.href,
    type: 'article',
    section: 'Utilities',
    keywords,
  })
}

/**
 * Generate metadata for category/overview pages
 */
export function generateCategoryMetadata(params: {
  name: string
  description: string
  href: string
  count?: number
  keywords?: string[]
}): Metadata {
  let description = params.description
  if (params.count) {
    description += ` (${params.count} items)`
  }

  return generateMetadataFromConfig({
    title: params.name,
    description,
    url: params.href,
    type: 'website',
    keywords: params.keywords || [],
  })
}

/**
 * Generate metadata for guide/tutorial pages
 */
export function generateGuideMetadata(params: {
  title: string
  description: string
  href: string
  category?: string
  keywords?: string[]
}): Metadata {
  return generateMetadataFromConfig({
    title: params.title,
    description: params.description,
    url: params.href,
    type: 'article',
    section: params.category || 'Guides',
    keywords: params.keywords || [],
  })
}

/**
 * Generate metadata for example/demo pages
 */
export function generateExampleMetadata(params: {
  title: string
  description: string
  href: string
  features?: string[]
}): Metadata {
  let description = params.description
  if (params.features && params.features.length > 0) {
    description += `. Demonstrates: ${params.features.join(', ')}`
  }

  return generateMetadataFromConfig({
    title: params.title,
    description,
    url: params.href,
    type: 'article',
    section: 'Examples',
    keywords: ['example', 'demo', 'code sample', ...(params.features || [])],
  })
}

/**
 * Generate breadcrumb items for structured data
 */
export interface BreadcrumbItem {
  name: string
  url: string
}

export function generateBreadcrumbs(path: string): BreadcrumbItem[] {
  const segments = path.split('/').filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = [{ name: 'Home', url: BASE_URL }]

  let currentPath = ''
  for (const segment of segments) {
    currentPath += `/${segment}`
    // Convert kebab-case to Title Case
    const name = segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

    breadcrumbs.push({
      name,
      url: `${BASE_URL}${currentPath}`,
    })
  }

  return breadcrumbs
}

/**
 * Validate metadata completeness
 */
export function validateMetadata(metadata: Metadata): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!metadata.title) {
    errors.push('Missing title')
  } else if (typeof metadata.title === 'string' && metadata.title.length < 10) {
    errors.push('Title too short (minimum 10 characters)')
  } else if (typeof metadata.title === 'string' && metadata.title.length > 60) {
    errors.push('Title too long (maximum 60 characters recommended)')
  }

  if (!metadata.description) {
    errors.push('Missing description')
  } else if (metadata.description.length < 50) {
    errors.push('Description too short (minimum 50 characters)')
  } else if (metadata.description.length > 160) {
    errors.push('Description too long (maximum 160 characters recommended)')
  }

  if (!metadata.openGraph) {
    errors.push('Missing OpenGraph metadata')
  }

  if (!metadata.twitter) {
    errors.push('Missing Twitter metadata')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
