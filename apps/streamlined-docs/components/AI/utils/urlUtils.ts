/**
 * URL Normalization Utilities
 *
 * Functions for normalizing and generating URLs for documentation sources.
 */

/**
 * Route mappings for common documentation titles
 */
const ROUTE_MAPPINGS: Record<string, string> = {
  'getting started': '/learn',
  quickstart: '/learn',
  introduction: '/learn',
  installation: '/guides/installation',
  theme: '/guides/theming',
  styling: '/guides/theming',
  error: '/guides/error-handling',
  memory: '/guides/memory',
  hook: '/reference/hooks',
  component: '/reference/components',
  streaming: '/reference/hooks/use-streaming-sse',
  voice: '/reference/components/voice-input',
}

/**
 * Valid URL prefixes for documentation routes
 */
const VALID_PREFIXES = [
  '/learn',
  '/guides/',
  '/reference/',
  '/examples/',
  '/integrations/',
  '/tools/',
  '/blog/',
  '/enterprise/',
]

/**
 * Generate a URL from a documentation title
 */
export function generateUrlFromTitle(title: string): string {
  if (!title || title.trim() === '') {
    return '/learn'
  }

  const lowerTitle = title.toLowerCase()

  for (const [key, route] of Object.entries(ROUTE_MAPPINGS)) {
    if (lowerTitle.includes(key)) {
      return route
    }
  }

  return '/learn'
}

/**
 * Normalize a source URL, falling back to title-based generation if invalid
 */
export function normalizeSourceUrl(rawUrl: string, title: string): string {
  if (
    !rawUrl ||
    rawUrl === '#' ||
    rawUrl === 'undefined' ||
    rawUrl.trim() === ''
  ) {
    return generateUrlFromTitle(title)
  }

  if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
    return rawUrl
  }

  if (VALID_PREFIXES.some((prefix) => rawUrl.startsWith(prefix))) {
    return rawUrl
  }

  return generateUrlFromTitle(title)
}

/**
 * Normalize all markdown links in content
 */
export function normalizeLinksInContent(content: string): string {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g

  return content.replace(linkRegex, (match, text, url) => {
    if (
      url.startsWith('http://') ||
      url.startsWith('https://') ||
      url.startsWith('#')
    ) {
      return match
    }
    const normalizedUrl = normalizeSourceUrl(url, text)
    return `[${text}](${normalizedUrl})`
  })
}
