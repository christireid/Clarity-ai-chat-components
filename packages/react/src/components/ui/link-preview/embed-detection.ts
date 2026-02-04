/**
 * Rich embed detection and URL pattern matching
 */

import type { EmbedType } from './types'
import { isValidUrl } from './url-utils'

interface EmbedPattern {
  type: EmbedType
  patterns: RegExp[]
  extractId: (url: string) => string | null
}

const EMBED_PATTERNS: EmbedPattern[] = [
  {
    type: 'youtube',
    patterns: [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    ],
    extractId: (url: string) => {
      for (const pattern of EMBED_PATTERNS[0].patterns) {
        const match = url.match(pattern)
        if (match) return match[1]
      }
      return null
    },
  },
  {
    type: 'vimeo',
    patterns: [/vimeo\.com\/(\d+)/, /player\.vimeo\.com\/video\/(\d+)/],
    extractId: (url: string) => {
      const match = url.match(
        /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/
      )
      return match ? match[1] : null
    },
  },
  {
    type: 'twitter',
    patterns: [/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/],
    extractId: (url: string) => {
      const match = url.match(/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/)
      return match ? match[1] : null
    },
  },
  {
    type: 'github',
    patterns: [
      /github\.com\/([a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+)/,
      /gist\.github\.com\/([a-zA-Z0-9_-]+\/[a-zA-Z0-9]+)/,
    ],
    extractId: (url: string) => {
      const repoMatch = url.match(
        /github\.com\/([a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+)/
      )
      if (repoMatch) return repoMatch[1].replace(/\/$/, '')

      const gistMatch = url.match(
        /gist\.github\.com\/([a-zA-Z0-9_-]+\/[a-zA-Z0-9]+)/
      )
      return gistMatch ? gistMatch[1].replace(/\/$/, '') : null
    },
  },
  {
    type: 'spotify',
    patterns: [
      /open\.spotify\.com\/(track|album|playlist|artist)\/([a-zA-Z0-9]+)/,
    ],
    extractId: (url: string) => {
      const match = url.match(
        /open\.spotify\.com\/(track|album|playlist|artist)\/([a-zA-Z0-9]+)/
      )
      return match ? `${match[1]}/${match[2]}` : null
    },
  },
]

/**
 * Internal helper: detect embed type + extracted ID from URL.
 */
export function detectEmbedDetails(url: string): {
  type: EmbedType
  id: string | null
} {
  if (!isValidUrl(url)) {
    return { type: 'generic', id: null }
  }

  for (const embedPattern of EMBED_PATTERNS) {
    for (const pattern of embedPattern.patterns) {
      if (pattern.test(url)) {
        return {
          type: embedPattern.type,
          id: embedPattern.extractId(url),
        }
      }
    }
  }

  return { type: 'generic', id: null }
}

/**
 * Detects the embed type for a URL.
 */
export function detectEmbedType(url: string): EmbedType {
  return detectEmbedDetails(url).type
}
