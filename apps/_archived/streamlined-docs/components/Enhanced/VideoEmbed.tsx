'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface VideoEmbedProps {
  /** Video URL (YouTube, Vimeo, or direct video) */
  src: string
  /** Thumbnail image URL (optional, will use platform default if not provided) */
  thumbnail?: string
  /** Video title */
  title: string
  /** Aspect ratio */
  aspectRatio?: '16/9' | '4/3' | '1/1' | '21/9'
  /** Autoplay when clicked */
  autoplay?: boolean
  /** Show controls */
  controls?: boolean
  /** Lazy load the iframe */
  lazyLoad?: boolean
  className?: string
}

type Platform = 'youtube' | 'vimeo' | 'direct'

export function VideoEmbed({
  src,
  thumbnail,
  title,
  aspectRatio = '16/9',
  autoplay = true,
  controls = true,
  lazyLoad = true,
  className,
}: VideoEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [platform, videoId] = parseVideoUrl(src)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Generate embed URL
  const embedUrl = getEmbedUrl(platform, videoId, autoplay, controls)

  // Generate thumbnail
  const thumbnailUrl =
    thumbnail || getDefaultThumbnail(platform, videoId)

  const handlePlay = () => {
    setIsLoading(true)
    setIsPlaying(true)
  }

  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  const aspectRatioClasses = {
    '16/9': 'aspect-video',
    '4/3': 'aspect-[4/3]',
    '1/1': 'aspect-square',
    '21/9': 'aspect-[21/9]',
  }

  return (
    <div
      className={cn(
        'relative rounded-xl overflow-hidden bg-neutral-900',
        aspectRatioClasses[aspectRatio],
        className
      )}
    >
      {!isPlaying ? (
        <motion.button
          onClick={handlePlay}
          className="absolute inset-0 group cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          aria-label={`Play video: ${title}`}
        >
          {/* Thumbnail */}
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="flex items-center justify-center w-20 h-20 rounded-full bg-white/90 backdrop-blur-sm shadow-xl"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Play className="w-8 h-8 text-neutral-900 ml-1" fill="currentColor" />
            </motion.div>
          </div>

          {/* Title */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-semibold text-lg drop-shadow-lg">
              {title}
            </h3>
          </div>

          {/* Hover Glow */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-t from-brand-500/20 to-transparent" />
          </div>
        </motion.button>
      ) : (
        <>
          {/* Loading Spinner */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
              <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
            </div>
          )}

          {/* Video Iframe */}
          <iframe
            ref={iframeRef}
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading={lazyLoad ? 'lazy' : 'eager'}
            onLoad={handleIframeLoad}
            className="absolute inset-0 w-full h-full"
          />
        </>
      )}
    </div>
  )
}

// Parse video URL to determine platform and video ID
function parseVideoUrl(url: string): [Platform, string] {
  // YouTube
  const youtubeRegex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/
  const youtubeMatch = url.match(youtubeRegex)
  if (youtubeMatch) {
    return ['youtube', youtubeMatch[1]]
  }

  // Vimeo
  const vimeoRegex = /(?:vimeo\.com\/)([0-9]+)/
  const vimeoMatch = url.match(vimeoRegex)
  if (vimeoMatch) {
    return ['vimeo', vimeoMatch[1]]
  }

  // Direct video
  return ['direct', url]
}

// Get embed URL for platform
function getEmbedUrl(
  platform: Platform,
  videoId: string,
  autoplay: boolean,
  controls: boolean
): string {
  const autoplayParam = autoplay ? '1' : '0'
  const controlsParam = controls ? '1' : '0'

  switch (platform) {
    case 'youtube':
      return `https://www.youtube.com/embed/${videoId}?autoplay=${autoplayParam}&controls=${controlsParam}&modestbranding=1&rel=0`
    case 'vimeo':
      return `https://player.vimeo.com/video/${videoId}?autoplay=${autoplayParam}&controls=${controlsParam}`
    case 'direct':
      return videoId
  }
}

// Get default thumbnail from platform
function getDefaultThumbnail(platform: Platform, videoId: string): string {
  switch (platform) {
    case 'youtube':
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    case 'vimeo':
      // Vimeo requires API call for thumbnail, use placeholder
      return `https://placehold.co/1280x720/1a1a1a/white?text=Vimeo+Video`
    case 'direct':
      return `https://placehold.co/1280x720/1a1a1a/white?text=Video`
  }
}
