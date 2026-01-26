'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import type { RichEmbedPublicProps } from './types'
import { detectEmbedDetails } from './embed-detection'
import { isValidUrl, sanitizeUrl } from './url-utils'

/**
 * RichEmbed component (public) - renders an iframe for supported providers,
 * otherwise falls back to a safe link.
 */
export function RichEmbed({ url, embedType, className }: RichEmbedPublicProps) {
  let { id } = detectEmbedDetails(url)
  const safeUrl = sanitizeUrl(url)

  const type = embedType === 'default' ? 'generic' : embedType

  // Some tests/callers provide non-canonical IDs; fall back to parsing.
  if (!id && isValidUrl(url)) {
    try {
      const parsed = new URL(url)
      if (type === 'youtube') {
        id = parsed.searchParams.get('v')
      }
    } catch {
      // ignore
    }
  }

  if (!id || type === 'generic') {
    return (
      <a
        href={safeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'inline-flex items-center gap-1.5 text-sm text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded',
          className
        )}
      >
        {url}
      </a>
    )
  }

  switch (type) {
    case 'youtube':
      return (
        <iframe
          className={cn('w-full aspect-video rounded-lg', className)}
          src={`https://www.youtube.com/embed/${id}`}
          title="YouTube video"
          role="presentation"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )
    case 'vimeo':
      return (
        <iframe
          className={cn('w-full aspect-video rounded-lg', className)}
          src={`https://player.vimeo.com/video/${id}`}
          title="Vimeo video"
          role="presentation"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      )
    case 'spotify':
      return (
        <iframe
          className={cn('w-full rounded-lg', className)}
          src={`https://open.spotify.com/embed/${id}`}
          title="Spotify"
          role="presentation"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      )
    default:
      return (
        <a
          href={safeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'inline-flex items-center gap-1.5 text-sm text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded',
            className
          )}
        >
          {url}
        </a>
      )
  }
}

RichEmbed.displayName = 'RichEmbed'
