/**
 * Favicon component for displaying source favicons
 */

'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { SIZE_CONFIG } from '../constants'
import { getFaviconUrl } from '../utils'
import { GlobeIcon } from '../icons'
import type { SourceCitationSize } from '../types'

export interface FaviconProps {
  url: string
  favicon?: string
  size?: SourceCitationSize
  className?: string
}

export const Favicon: React.FC<FaviconProps> = ({
  url,
  favicon,
  size = 'md',
  className,
}) => {
  const [error, setError] = React.useState(false)
  const faviconUrl = getFaviconUrl(url, favicon)
  const sizeConfig = SIZE_CONFIG[size]

  if (error || !faviconUrl) {
    return (
      <div
        className={cn(
          sizeConfig.favicon,
          'flex items-center justify-center rounded bg-muted/50',
          className
        )}
      >
        <GlobeIcon size={sizeConfig.iconSize - 4} className="text-muted-foreground" />
      </div>
    )
  }

  return (
    <img
      src={faviconUrl}
      alt=""
      className={cn(sizeConfig.favicon, 'rounded object-contain', className)}
      onError={() => setError(true)}
      loading="lazy"
    />
  )
}
