'use client'

/**
 * VideoPlayer Component - API Reference Documentation
 *
 * Accessible video player with playback controls, subtitles, picture-in-picture,
 * and adaptive streaming support for professional media applications.
 */

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  PlayCircle,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  Subtitles,
  PictureInPicture,
  Download,
  SkipBack,
  SkipForward,
  Copy,
  Check,
  AlertTriangle,
  Info,
  Zap,
  Accessibility,
  Radio,
  MonitorPlay,
} from 'lucide-react'
import { cn } from '../../../../../../packages/react/src/lib/utils'
import { durations } from '../../../../lib/animations'
import { CodeBlock } from '../../../../components/Docs/CodeBlock'
import { DocumentationPage } from '../../../../components/Docs/DocumentationPage'
import type { TocItem } from '../../../../components/Docs/TableOfContents'

// ============================================================================
// Copy Button Component
// ============================================================================

function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'p-2 rounded-md hover:bg-muted/50 transition-colors',
        'text-muted-foreground hover:text-foreground',
        className
      )}
      aria-label={copied ? 'Copied' : 'Copy to clipboard'}
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </button>
  )
}

// ============================================================================
// Props Table Component
// ============================================================================

interface PropDefinition {
  name: string
  type: string
  default?: string
  required?: boolean
  description: string
  deprecated?: boolean
  deprecatedMessage?: string
}

function PropsTable({
  props,
  title,
}: {
  props: PropDefinition[]
  title?: string
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border/50">
      {title && (
        <div className="px-4 py-3 bg-muted/30 border-b border-border/50">
          <h4 className="font-semibold text-foreground">{title}</h4>
        </div>
      )}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50 bg-muted/20">
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Name
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Type
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Default
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop, index) => (
            <tr
              key={prop.name}
              className={cn(
                'border-b border-border/30 last:border-b-0',
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/10',
                prop.deprecated && 'opacity-60'
              )}
            >
              <td className="px-4 py-3 font-mono text-sm">
                <span
                  className={cn(
                    'text-brand-600 dark:text-brand-400',
                    prop.deprecated && 'line-through'
                  )}
                >
                  {prop.name}
                </span>
                {prop.required && (
                  <span className="ml-1 text-red-500" title="Required">
                    *
                  </span>
                )}
                {prop.deprecated && (
                  <span className="ml-2 px-1.5 py-0.5 text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded">
                    deprecated
                  </span>
                )}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground max-w-[200px] break-words">
                {prop.type}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-neutral-500">
                {prop.default || '-'}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {prop.description}
                {prop.deprecatedMessage && (
                  <span className="block mt-1 text-xs text-amber-600 dark:text-amber-400">
                    {prop.deprecatedMessage}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ============================================================================
// Section Components
// ============================================================================

function Section({
  id,
  title,
  children,
  className,
}: {
  id: string
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section id={id} className={cn('scroll-mt-24', className)}>
      <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
        <a
          href={`#${id}`}
          className="hover:text-brand-500 transition-colors group"
        >
          {title}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
            #
          </span>
        </a>
      </h2>
      {children}
    </section>
  )
}

function SubSection({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: React.ReactNode
}) {
  return (
    <div id={id} className="scroll-mt-24 mt-8">
      <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
        <a
          href={`#${id}`}
          className="hover:text-brand-500 transition-colors group"
        >
          {title}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-base">
            #
          </span>
        </a>
      </h3>
      {children}
    </div>
  )
}

// ============================================================================
// Live Demo Component
// ============================================================================

function LiveDemo() {
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [currentTime, setCurrentTime] = React.useState(0)
  const [duration, setDuration] = React.useState(120) // 2 minutes demo
  const [volume, setVolume] = React.useState(0.7)
  const [isMuted, setIsMuted] = React.useState(false)
  const [showSubtitles, setShowSubtitles] = React.useState(false)
  const [quality, setQuality] = React.useState<'auto' | '1080p' | '720p' | '480p'>('auto')
  const [playbackRate, setPlaybackRate] = React.useState(1)
  const intervalRef = React.useRef<NodeJS.Timeout>()

  React.useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false)
            return 0
          }
          return prev + 0.1
        })
      }, 100)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, duration])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progress = (currentTime / duration) * 100

  return (
    <div className="space-y-4">
      {/* Demo Video Player */}
      <div className="relative rounded-xl border border-border/50 bg-black overflow-hidden shadow-2xl aspect-video">
        {/* Video Area */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900/20 to-blue-900/20">
          <motion.div
            animate={{ scale: isPlaying ? [1, 1.05, 1] : 1 }}
            transition={{ duration: 2, repeat: isPlaying ? Infinity : 0 }}
            className="text-center"
          >
            <PlayCircle className="w-24 h-24 text-white/50 mx-auto mb-4" />
            <p className="text-white/70 text-sm">Demo Video Player</p>
            <p className="text-white/50 text-xs mt-1">
              {isPlaying ? 'Playing...' : 'Paused'}
            </p>
          </motion.div>
        </div>

        {/* Subtitles */}
        <AnimatePresence>
          {showSubtitles && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-20 left-0 right-0 flex justify-center px-4"
            >
              <div className="bg-black/80 text-white px-4 py-2 rounded text-sm max-w-2xl text-center">
                This is a sample subtitle demonstrating WebVTT support.
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          {/* Progress Bar */}
          <div className="mb-3">
            <div className="flex items-center gap-2 text-xs text-white/70 mb-1">
              <span>{formatTime(currentTime)}</span>
              <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-brand-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center gap-2">
            {/* Play/Pause */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>

            {/* Skip Back */}
            <button
              onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
              aria-label="Skip back 10 seconds"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            {/* Skip Forward */}
            <button
              onClick={() => setCurrentTime(Math.min(duration, currentTime + 10))}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
              aria-label="Skip forward 10 seconds"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {/* Volume */}
            <div className="flex items-center gap-2 ml-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value))
                  setIsMuted(false)
                }}
                className="w-20 accent-brand-500"
                aria-label="Volume"
              />
            </div>

            <div className="flex-1" />

            {/* Playback Speed */}
            <select
              value={playbackRate}
              onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
              className="px-2 py-1 rounded bg-white/10 text-white text-xs border border-white/20"
            >
              <option value="0.5">0.5x</option>
              <option value="0.75">0.75x</option>
              <option value="1">1x</option>
              <option value="1.25">1.25x</option>
              <option value="1.5">1.5x</option>
              <option value="2">2x</option>
            </select>

            {/* Quality */}
            <select
              value={quality}
              onChange={(e) => setQuality(e.target.value as any)}
              className="px-2 py-1 rounded bg-white/10 text-white text-xs border border-white/20"
            >
              <option value="auto">Auto</option>
              <option value="1080p">1080p</option>
              <option value="720p">720p</option>
              <option value="480p">480p</option>
            </select>

            {/* Subtitles */}
            <button
              onClick={() => setShowSubtitles(!showSubtitles)}
              className={cn(
                'p-2 rounded-lg hover:bg-white/10 transition-colors',
                showSubtitles ? 'text-brand-400' : 'text-white'
              )}
              aria-label="Toggle subtitles"
            >
              <Subtitles className="w-4 h-4" />
            </button>

            {/* Picture-in-Picture */}
            <button
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
              aria-label="Picture in Picture"
            >
              <PictureInPicture className="w-4 h-4" />
            </button>

            {/* Fullscreen */}
            <button
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
              aria-label="Fullscreen"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Demo Info */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
          <p className="text-xs text-muted-foreground mb-1">Playback Rate</p>
          <p className="text-sm font-semibold text-foreground">{playbackRate}x</p>
        </div>
        <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
          <p className="text-xs text-muted-foreground mb-1">Quality</p>
          <p className="text-sm font-semibold text-foreground">{quality}</p>
        </div>
        <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
          <p className="text-xs text-muted-foreground mb-1">Volume</p>
          <p className="text-sm font-semibold text-foreground">
            {isMuted ? 'Muted' : `${Math.round(volume * 100)}%`}
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Format Support Table Component
// ============================================================================

function FormatSupportTable() {
  const formats = [
    { format: 'MP4', container: 'MP4', video: 'H.264, H.265', audio: 'AAC, MP3', support: 'Excellent' },
    { format: 'WebM', container: 'WebM', video: 'VP8, VP9, AV1', audio: 'Vorbis, Opus', support: 'Good' },
    { format: 'HLS', container: 'M3U8', video: 'H.264, H.265', audio: 'AAC', support: 'Excellent' },
    { format: 'DASH', container: 'MPD', video: 'H.264, VP9', audio: 'AAC, Opus', support: 'Good' },
    { format: 'OGG', container: 'OGG', video: 'Theora', audio: 'Vorbis', support: 'Limited' },
  ]

  return (
    <div className="overflow-x-auto rounded-lg border border-border/50">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50 bg-muted/20">
            <th className="px-4 py-3 text-left font-semibold text-foreground">Format</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Container</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Video Codecs</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Audio Codecs</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Browser Support</th>
          </tr>
        </thead>
        <tbody>
          {formats.map((format, index) => (
            <tr
              key={format.format}
              className={cn(
                'border-b border-border/30 last:border-b-0',
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/10'
              )}
            >
              <td className="px-4 py-3 font-semibold text-foreground">{format.format}</td>
              <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{format.container}</td>
              <td className="px-4 py-3 text-muted-foreground text-xs">{format.video}</td>
              <td className="px-4 py-3 text-muted-foreground text-xs">{format.audio}</td>
              <td className="px-4 py-3">
                <span
                  className={cn(
                    'px-2 py-0.5 rounded-full text-xs font-medium',
                    format.support === 'Excellent'
                      ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                      : format.support === 'Good'
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  )}
                >
                  {format.support}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ============================================================================
// Props Data
// ============================================================================

const coreProps: PropDefinition[] = [
  {
    name: 'src',
    type: 'string | string[]',
    required: true,
    description: 'Video source URL(s). Array for multiple quality options.',
  },
  {
    name: 'poster',
    type: 'string',
    description: 'Poster image URL to display before video loads.',
  },
  {
    name: 'autoplay',
    type: 'boolean',
    default: 'false',
    description: 'Auto-play video when loaded (requires muted in most browsers).',
  },
  {
    name: 'muted',
    type: 'boolean',
    default: 'false',
    description: 'Start video muted.',
  },
  {
    name: 'loop',
    type: 'boolean',
    default: 'false',
    description: 'Loop video playback.',
  },
  {
    name: 'controls',
    type: 'boolean',
    default: 'true',
    description: 'Show custom video controls.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes.',
  },
]

const playbackProps: PropDefinition[] = [
  {
    name: 'defaultPlaybackRate',
    type: 'number',
    default: '1',
    description: 'Default playback speed (0.5, 0.75, 1, 1.25, 1.5, 2).',
  },
  {
    name: 'defaultVolume',
    type: 'number',
    default: '0.7',
    description: 'Default volume level (0-1).',
  },
  {
    name: 'skipInterval',
    type: 'number',
    default: '10',
    description: 'Seconds to skip forward/backward.',
  },
  {
    name: 'seekStep',
    type: 'number',
    default: '5',
    description: 'Seconds to seek with arrow keys.',
  },
]

const subtitleProps: PropDefinition[] = [
  {
    name: 'subtitles',
    type: 'SubtitleTrack[]',
    default: '[]',
    description: 'WebVTT subtitle tracks.',
  },
  {
    name: 'defaultSubtitleLanguage',
    type: 'string',
    description: 'Default subtitle language code (e.g., "en", "es").',
  },
  {
    name: 'subtitleStyle',
    type: 'CSSProperties',
    description: 'Custom subtitle styling.',
  },
]

const streamingProps: PropDefinition[] = [
  {
    name: 'streaming',
    type: "'hls' | 'dash' | 'progressive'",
    default: "'progressive'",
    description: 'Streaming protocol for adaptive bitrate.',
  },
  {
    name: 'qualities',
    type: 'QualityLevel[]',
    description: 'Available quality levels for adaptive streaming.',
  },
  {
    name: 'autoQuality',
    type: 'boolean',
    default: 'true',
    description: 'Automatically select quality based on bandwidth.',
  },
  {
    name: 'bufferLength',
    type: 'number',
    default: '30',
    description: 'Buffer length in seconds for streaming.',
  },
]

const callbackProps: PropDefinition[] = [
  {
    name: 'onPlay',
    type: '() => void',
    description: 'Callback when video starts playing.',
  },
  {
    name: 'onPause',
    type: '() => void',
    description: 'Callback when video is paused.',
  },
  {
    name: 'onEnded',
    type: '() => void',
    description: 'Callback when video finishes playing.',
  },
  {
    name: 'onTimeUpdate',
    type: '(currentTime: number, duration: number) => void',
    description: 'Callback on playback time update.',
  },
  {
    name: 'onVolumeChange',
    type: '(volume: number, muted: boolean) => void',
    description: 'Callback when volume changes.',
  },
  {
    name: 'onError',
    type: '(error: MediaError) => void',
    description: 'Callback on playback error.',
  },
  {
    name: 'onQualityChange',
    type: '(quality: string) => void',
    description: 'Callback when video quality changes.',
  },
]

const featureProps: PropDefinition[] = [
  {
    name: 'enablePiP',
    type: 'boolean',
    default: 'true',
    description: 'Enable Picture-in-Picture mode.',
  },
  {
    name: 'enableFullscreen',
    type: 'boolean',
    default: 'true',
    description: 'Enable fullscreen mode.',
  },
  {
    name: 'enableKeyboardShortcuts',
    type: 'boolean',
    default: 'true',
    description: 'Enable keyboard controls (Space, Arrow keys, etc.).',
  },
  {
    name: 'enableDownload',
    type: 'boolean',
    default: 'false',
    description: 'Show download button.',
  },
  {
    name: 'enableScreenshot',
    type: 'boolean',
    default: 'false',
    description: 'Enable video screenshot capture.',
  },
]

// ============================================================================
// Code Examples
// ============================================================================

const importCode = `import { VideoPlayer } from '@clarity-chat/react'
import type { VideoPlayerProps, SubtitleTrack, QualityLevel } from '@clarity-chat/react'`

const basicUsageCode = `import { VideoPlayer } from '@clarity-chat/react'

function VideoDemo() {
  return (
    <VideoPlayer
      src="/videos/demo.mp4"
      poster="/images/poster.jpg"
      controls={true}
      autoplay={false}
    />
  )
}`

const withSubtitlesCode = `import { VideoPlayer } from '@clarity-chat/react'
import type { SubtitleTrack } from '@clarity-chat/react'

function VideoWithSubtitles() {
  const subtitles: SubtitleTrack[] = [
    {
      src: '/subtitles/en.vtt',
      label: 'English',
      language: 'en',
      default: true,
    },
    {
      src: '/subtitles/es.vtt',
      label: 'Español',
      language: 'es',
    },
    {
      src: '/subtitles/fr.vtt',
      label: 'Français',
      language: 'fr',
    },
  ]

  return (
    <VideoPlayer
      src="/videos/lecture.mp4"
      subtitles={subtitles}
      defaultSubtitleLanguage="en"
    />
  )
}`

const pipCode = `import { VideoPlayer } from '@clarity-chat/react'

function VideoWithPiP() {
  const handlePiPEnter = () => {
    console.log('Entered Picture-in-Picture mode')
  }

  const handlePiPExit = () => {
    console.log('Exited Picture-in-Picture mode')
  }

  return (
    <VideoPlayer
      src="/videos/tutorial.mp4"
      enablePiP={true}
      onEnterPiP={handlePiPEnter}
      onExitPiP={handlePiPExit}
    />
  )
}`

const adaptiveStreamingCode = `import { VideoPlayer } from '@clarity-chat/react'
import type { QualityLevel } from '@clarity-chat/react'

function AdaptiveVideoPlayer() {
  const qualities: QualityLevel[] = [
    { label: '1080p', src: '/videos/1080p.m3u8', bitrate: 5000 },
    { label: '720p', src: '/videos/720p.m3u8', bitrate: 2500 },
    { label: '480p', src: '/videos/480p.m3u8', bitrate: 1000 },
    { label: '360p', src: '/videos/360p.m3u8', bitrate: 500 },
  ]

  const handleQualityChange = (quality: string) => {
    console.log('Quality changed to:', quality)
  }

  return (
    <VideoPlayer
      src="/videos/master.m3u8"
      streaming="hls"
      qualities={qualities}
      autoQuality={true}
      onQualityChange={handleQualityChange}
    />
  )
}`

const callbacksCode = `import { VideoPlayer } from '@clarity-chat/react'
import { useState } from 'react'

function TrackedVideoPlayer() {
  const [watchTime, setWatchTime] = useState(0)
  const [completed, setCompleted] = useState(false)

  const handleTimeUpdate = (currentTime: number, duration: number) => {
    setWatchTime(currentTime)

    // Track 90% completion
    if (currentTime / duration > 0.9 && !completed) {
      setCompleted(true)
      analytics.track('video_completed', { duration })
    }
  }

  const handleError = (error: MediaError) => {
    console.error('Video error:', error.message)
    // Send to error tracking service
  }

  return (
    <div>
      <VideoPlayer
        src="/videos/course.mp4"
        onTimeUpdate={handleTimeUpdate}
        onError={handleError}
        onEnded={() => console.log('Video finished')}
      />
      <div className="mt-4 text-sm text-muted-foreground">
        Watch time: {Math.floor(watchTime)}s
        {completed && ' • Completed ✓'}
      </div>
    </div>
  )
}`

const typescriptCode = `// VideoPlayer props
interface VideoPlayerProps {
  // Core
  src: string | string[]
  poster?: string
  autoplay?: boolean
  muted?: boolean
  loop?: boolean
  controls?: boolean
  className?: string

  // Playback
  defaultPlaybackRate?: number // 0.5-2
  defaultVolume?: number // 0-1
  skipInterval?: number
  seekStep?: number

  // Subtitles
  subtitles?: SubtitleTrack[]
  defaultSubtitleLanguage?: string
  subtitleStyle?: React.CSSProperties

  // Streaming
  streaming?: 'hls' | 'dash' | 'progressive'
  qualities?: QualityLevel[]
  autoQuality?: boolean
  bufferLength?: number

  // Features
  enablePiP?: boolean
  enableFullscreen?: boolean
  enableKeyboardShortcuts?: boolean
  enableDownload?: boolean
  enableScreenshot?: boolean

  // Callbacks
  onPlay?: () => void
  onPause?: () => void
  onEnded?: () => void
  onTimeUpdate?: (currentTime: number, duration: number) => void
  onVolumeChange?: (volume: number, muted: boolean) => void
  onError?: (error: MediaError) => void
  onQualityChange?: (quality: string) => void
  onEnterPiP?: () => void
  onExitPiP?: () => void
}

// Subtitle track definition
interface SubtitleTrack {
  src: string // WebVTT file URL
  label: string // Display name
  language: string // ISO 639-1 code
  default?: boolean
}

// Quality level for adaptive streaming
interface QualityLevel {
  label: string // e.g., "1080p", "720p"
  src: string // Stream URL
  bitrate: number // Bitrate in kbps
}

// Media error type
interface MediaError {
  code: number
  message: string
  MEDIA_ERR_ABORTED: 1
  MEDIA_ERR_NETWORK: 2
  MEDIA_ERR_DECODE: 3
  MEDIA_ERR_SRC_NOT_SUPPORTED: 4
}`

// ============================================================================
// Main Page Component
// ============================================================================

export default function VideoPlayerPage() {
  const tableOfContents: TocItem[] = [
    { id: 'overview', title: 'Overview' },
    { id: 'installation', title: 'Installation' },
    { id: 'demo', title: 'Live Demo' },
    { id: 'formats', title: 'Supported Formats' },
    { id: 'basic-usage', title: 'Basic Usage' },
    {
      id: 'props',
      title: 'Props Reference',
      children: [
        { id: 'core-props', title: 'Core Props' },
        { id: 'playback-props', title: 'Playback Settings' },
        { id: 'subtitle-props', title: 'Subtitle Configuration' },
        { id: 'streaming-props', title: 'Streaming Options' },
        { id: 'callback-props', title: 'Callbacks' },
        { id: 'feature-props', title: 'Feature Toggles' },
      ],
    },
    {
      id: 'examples',
      title: 'Examples',
      children: [
        { id: 'example-basic', title: 'Basic Player' },
        { id: 'example-subtitles', title: 'With Subtitles' },
        { id: 'example-pip', title: 'Picture-in-Picture' },
        { id: 'example-adaptive', title: 'Adaptive Streaming' },
        { id: 'example-callbacks', title: 'With Callbacks' },
      ],
    },
    { id: 'performance', title: 'Performance' },
    { id: 'accessibility', title: 'Accessibility' },
    { id: 'keyboard-shortcuts', title: 'Keyboard Shortcuts' },
    { id: 'typescript', title: 'TypeScript' },
    { id: 'troubleshooting', title: 'Troubleshooting' },
    { id: 'related', title: 'Related' },
  ]

  return (
    <DocumentationPage
      title="VideoPlayer"
      description="Accessible video player with playback controls, subtitles, picture-in-picture, and adaptive streaming support for professional media applications."
      icon={PlayCircle}
      badges={[{ label: 'Stable', variant: 'stable' }]}
      packageName="@clarity-chat/react"
      features={[
        {
          icon: Radio,
          label: 'Adaptive Streaming',
          description: 'HLS and DASH support',
        },
        {
          icon: Subtitles,
          label: 'Subtitles/Captions',
          description: 'WebVTT subtitle support',
        },
        {
          icon: MonitorPlay,
          label: 'Picture-in-Picture',
          description: 'Native PiP mode',
        },
        {
          icon: Accessibility,
          label: 'Keyboard Controls',
          description: 'Full keyboard accessibility',
        },
      ]}
      tableOfContents={tableOfContents}
      relatedAPIs={[
        {
          name: 'AudioPlayer',
          type: 'component',
          description: 'Audio-only player with waveform visualization',
          href: '/reference/components/audio-player',
        },
        {
          name: 'MediaControls',
          type: 'component',
          description: 'Reusable media control components',
          href: '/reference/components/media-controls',
        },
        {
          name: 'useVideoPlayer',
          type: 'hook',
          description: 'Low-level video player hook',
          href: '/reference/hooks/use-video-player',
        },
      ]}
      footerNavigation={[
        {
          label: 'AudioPlayer',
          href: '/reference/components/audio-player',
          direction: 'previous',
        },
        {
          label: 'MediaControls',
          href: '/reference/components/media-controls',
          direction: 'next',
        },
      ]}
    >
      {/* Overview Section */}
      <Section id="overview" title="Overview">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            <code>VideoPlayer</code> is a production-ready video player component
            with modern features like adaptive streaming, subtitles,
            picture-in-picture, and comprehensive accessibility support. It provides
            a polished media experience with custom controls, keyboard shortcuts,
            and performance optimization.
          </p>

          <h4 className="text-lg font-semibold mt-6 mb-3">Key Features</h4>
          <ul className="space-y-2">
            <li>
              <strong>Adaptive Streaming:</strong> HLS and DASH support for
              automatic quality adjustment based on bandwidth
            </li>
            <li>
              <strong>Subtitle Support:</strong> WebVTT subtitles with
              multi-language support and custom styling
            </li>
            <li>
              <strong>Picture-in-Picture:</strong> Native browser PiP support for
              multitasking
            </li>
            <li>
              <strong>Custom Controls:</strong> Beautiful, responsive controls with
              progress bar, volume slider, and quality selector
            </li>
            <li>
              <strong>Keyboard Navigation:</strong> Full keyboard control with
              standard media shortcuts
            </li>
            <li>
              <strong>Performance:</strong> Lazy loading, buffering optimization,
              and bandwidth detection
            </li>
            <li>
              <strong>Accessibility:</strong> WCAG 2.1 AA compliant with ARIA
              labels and screen reader support
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-6 mb-3">Use Cases</h4>
          <ul className="space-y-2">
            <li>Educational platforms with lecture recordings</li>
            <li>Video tutorials and documentation</li>
            <li>Live streaming events and webinars</li>
            <li>Product demos and marketing videos</li>
            <li>Training and onboarding materials</li>
          </ul>
        </div>
      </Section>

      {/* Installation Section */}
      <Section id="installation" title="Installation">
        <div className="space-y-4">
          <CodeBlock
            code="npm install @clarity-chat/react"
            language="bash"
            filename="Terminal"
            showDownloadButton={false}
          />

          <p className="text-muted-foreground">Import the component:</p>

          <CodeBlock
            code={importCode}
            language="tsx"
            filename="App.tsx"
            showDownloadButton={false}
          />
        </div>
      </Section>

      {/* Live Demo Section */}
      <Section id="demo" title="Live Demo">
        <p className="text-muted-foreground mb-6">
          Try the VideoPlayer component. Play, pause, adjust volume, change
          playback speed, and toggle subtitles.
        </p>

        <LiveDemo />
      </Section>

      {/* Supported Formats Section */}
      <Section id="formats" title="Supported Formats">
        <p className="text-muted-foreground mb-6">
          VideoPlayer supports multiple video formats and streaming protocols:
        </p>

        <FormatSupportTable />

        <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-semibold text-foreground mb-2">
                Format Recommendations
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>
                  <strong>MP4 (H.264 + AAC):</strong> Best browser compatibility,
                  recommended for progressive download
                </li>
                <li>
                  <strong>HLS (M3U8):</strong> Best for adaptive streaming, iOS
                  compatibility
                </li>
                <li>
                  <strong>DASH (MPD):</strong> Alternative for adaptive streaming,
                  better codec flexibility
                </li>
                <li>
                  <strong>WebM (VP9 + Opus):</strong> Good compression, limited
                  Safari support
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* Basic Usage Section */}
      <Section id="basic-usage" title="Basic Usage">
        <div className="space-y-4">
          <p className="text-muted-foreground">
            The simplest usage requires only a video source:
          </p>

          <CodeBlock
            code={basicUsageCode}
            language="tsx"
            filename="VideoDemo.tsx"
          />
        </div>
      </Section>

      {/* Props API Section */}
      <Section id="props" title="Props Reference">
        <SubSection id="core-props" title="Core Props">
          <PropsTable props={coreProps} />
        </SubSection>

        <SubSection id="playback-props" title="Playback Settings">
          <p className="text-sm text-muted-foreground mb-4">
            Configure playback behavior:
          </p>
          <PropsTable props={playbackProps} />
        </SubSection>

        <SubSection id="subtitle-props" title="Subtitle Configuration">
          <p className="text-sm text-muted-foreground mb-4">
            Add subtitle tracks with WebVTT:
          </p>
          <PropsTable props={subtitleProps} />
        </SubSection>

        <SubSection id="streaming-props" title="Streaming Options">
          <p className="text-sm text-muted-foreground mb-4">
            Configure adaptive streaming:
          </p>
          <PropsTable props={streamingProps} />
        </SubSection>

        <SubSection id="callback-props" title="Callbacks">
          <p className="text-sm text-muted-foreground mb-4">
            Handle playback events:
          </p>
          <PropsTable props={callbackProps} />
        </SubSection>

        <SubSection id="feature-props" title="Feature Toggles">
          <p className="text-sm text-muted-foreground mb-4">
            Enable/disable specific features:
          </p>
          <PropsTable props={featureProps} />
        </SubSection>
      </Section>

      {/* Examples Section */}
      <Section id="examples" title="Examples">
        <SubSection id="example-basic" title="Basic Player">
          <p className="text-muted-foreground mb-4">
            Simple video player with default controls:
          </p>
          <CodeBlock code={basicUsageCode} language="tsx" filename="Basic.tsx" />
        </SubSection>

        <SubSection id="example-subtitles" title="With Subtitles">
          <p className="text-muted-foreground mb-4">
            Add multi-language subtitle support:
          </p>
          <CodeBlock
            code={withSubtitlesCode}
            language="tsx"
            filename="Subtitles.tsx"
          />
        </SubSection>

        <SubSection id="example-pip" title="Picture-in-Picture">
          <p className="text-muted-foreground mb-4">
            Enable Picture-in-Picture mode:
          </p>
          <CodeBlock code={pipCode} language="tsx" filename="PiP.tsx" />
        </SubSection>

        <SubSection id="example-adaptive" title="Adaptive Streaming">
          <p className="text-muted-foreground mb-4">
            HLS adaptive bitrate streaming:
          </p>
          <CodeBlock
            code={adaptiveStreamingCode}
            language="tsx"
            filename="Adaptive.tsx"
          />
        </SubSection>

        <SubSection id="example-callbacks" title="With Callbacks">
          <p className="text-muted-foreground mb-4">
            Track playback events and analytics:
          </p>
          <CodeBlock
            code={callbacksCode}
            language="tsx"
            filename="Tracked.tsx"
          />
        </SubSection>
      </Section>

      {/* Performance Section */}
      <Section id="performance" title="Performance">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h4 className="text-lg font-semibold mt-6 mb-3">
            Streaming Optimization
          </h4>
          <ul className="space-y-2">
            <li>
              <strong>Adaptive Bitrate:</strong> Automatically adjusts quality
              based on available bandwidth
            </li>
            <li>
              <strong>Buffer Management:</strong> 30-second default buffer prevents
              stuttering
            </li>
            <li>
              <strong>Lazy Loading:</strong> Player initializes only when in
              viewport
            </li>
            <li>
              <strong>Bandwidth Detection:</strong> Measures connection speed for
              optimal quality selection
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-6 mb-3">Best Practices</h4>
          <ul className="space-y-2">
            <li>
              Use HLS or DASH for videos longer than 5 minutes for adaptive
              quality
            </li>
            <li>
              Provide multiple quality levels (360p, 480p, 720p, 1080p) for best
              experience
            </li>
            <li>
              Optimize video files: H.264 High Profile, AAC audio, 2-pass encoding
            </li>
            <li>Use CDN for video delivery to reduce latency</li>
            <li>Enable CORS headers for cross-origin subtitle files</li>
          </ul>

          <h4 className="text-lg font-semibold mt-6 mb-3">Bundle Impact</h4>
          <p>
            VideoPlayer adds approximately 45 KB (gzipped) to your bundle. HLS.js
            and Dash.js are loaded dynamically only when needed.
          </p>
        </div>
      </Section>

      {/* Accessibility Section */}
      <Section id="accessibility" title="Accessibility">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h4 className="text-lg font-semibold mt-6 mb-3">WCAG Compliance</h4>
          <p>
            VideoPlayer meets WCAG 2.1 Level AA requirements for media players:
          </p>
          <ul className="space-y-2">
            <li>
              <strong>1.2.2:</strong> Captions/subtitles support (WebVTT)
            </li>
            <li>
              <strong>2.1.1:</strong> Full keyboard navigation
            </li>
            <li>
              <strong>2.4.7:</strong> Visible focus indicators on all controls
            </li>
            <li>
              <strong>4.1.2:</strong> ARIA labels for all interactive elements
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-6 mb-3">
            Screen Reader Support
          </h4>
          <ul className="space-y-2">
            <li>All controls have descriptive ARIA labels</li>
            <li>Playback state changes are announced</li>
            <li>Time updates announced at 10-second intervals</li>
            <li>Error messages use role="alert" for immediate announcement</li>
          </ul>

          <h4 className="text-lg font-semibold mt-6 mb-3">
            Reduced Motion
          </h4>
          <p>
            Respects <code>prefers-reduced-motion</code>. When enabled, control
            animations are disabled and transitions are instant.
          </p>
        </div>
      </Section>

      {/* Keyboard Shortcuts Section */}
      <Section id="keyboard-shortcuts" title="Keyboard Shortcuts">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <h4 className="font-semibold text-foreground mb-3">Playback</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-3">
                <kbd className="px-2 py-1 rounded bg-muted font-mono text-xs">
                  Space
                </kbd>
                <span className="text-muted-foreground">Play / Pause</span>
              </li>
              <li className="flex items-center gap-3">
                <kbd className="px-2 py-1 rounded bg-muted font-mono text-xs">K</kbd>
                <span className="text-muted-foreground">Play / Pause</span>
              </li>
              <li className="flex items-center gap-3">
                <kbd className="px-2 py-1 rounded bg-muted font-mono text-xs">
                  Left Arrow
                </kbd>
                <span className="text-muted-foreground">Seek backward 5s</span>
              </li>
              <li className="flex items-center gap-3">
                <kbd className="px-2 py-1 rounded bg-muted font-mono text-xs">
                  Right Arrow
                </kbd>
                <span className="text-muted-foreground">Seek forward 5s</span>
              </li>
              <li className="flex items-center gap-3">
                <kbd className="px-2 py-1 rounded bg-muted font-mono text-xs">J</kbd>
                <span className="text-muted-foreground">Rewind 10s</span>
              </li>
              <li className="flex items-center gap-3">
                <kbd className="px-2 py-1 rounded bg-muted font-mono text-xs">L</kbd>
                <span className="text-muted-foreground">Fast forward 10s</span>
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <h4 className="font-semibold text-foreground mb-3">Controls</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-3">
                <kbd className="px-2 py-1 rounded bg-muted font-mono text-xs">
                  Up Arrow
                </kbd>
                <span className="text-muted-foreground">Volume up 10%</span>
              </li>
              <li className="flex items-center gap-3">
                <kbd className="px-2 py-1 rounded bg-muted font-mono text-xs">
                  Down Arrow
                </kbd>
                <span className="text-muted-foreground">Volume down 10%</span>
              </li>
              <li className="flex items-center gap-3">
                <kbd className="px-2 py-1 rounded bg-muted font-mono text-xs">M</kbd>
                <span className="text-muted-foreground">Mute / Unmute</span>
              </li>
              <li className="flex items-center gap-3">
                <kbd className="px-2 py-1 rounded bg-muted font-mono text-xs">F</kbd>
                <span className="text-muted-foreground">Fullscreen</span>
              </li>
              <li className="flex items-center gap-3">
                <kbd className="px-2 py-1 rounded bg-muted font-mono text-xs">C</kbd>
                <span className="text-muted-foreground">Toggle subtitles</span>
              </li>
              <li className="flex items-center gap-3">
                <kbd className="px-2 py-1 rounded bg-muted font-mono text-xs">
                  Shift + &lt;
                </kbd>
                <span className="text-muted-foreground">Decrease speed</span>
              </li>
              <li className="flex items-center gap-3">
                <kbd className="px-2 py-1 rounded bg-muted font-mono text-xs">
                  Shift + &gt;
                </kbd>
                <span className="text-muted-foreground">Increase speed</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* TypeScript Section */}
      <Section id="typescript" title="TypeScript">
        <p className="text-muted-foreground mb-4">Full type definitions:</p>
        <CodeBlock
          code={typescriptCode}
          language="tsx"
          filename="types.ts"
          showLineNumbers
        />
      </Section>

      {/* Troubleshooting Section */}
      <Section id="troubleshooting" title="Troubleshooting">
        <div className="space-y-6">
          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Video won't play
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Check video format compatibility with target browsers</li>
                  <li>Verify CORS headers are set on video server</li>
                  <li>
                    Ensure HTTPS is used (required for some features like PiP)
                  </li>
                  <li>Check browser console for media errors</li>
                  <li>Test with a different video to rule out encoding issues</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Buffering/stuttering issues
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Increase buffer length: bufferLength={`{60}`}</li>
                  <li>Use adaptive streaming (HLS/DASH) instead of progressive</li>
                  <li>Reduce default quality for slower connections</li>
                  <li>Enable auto quality: autoQuality={`{true}`}</li>
                  <li>Check CDN performance and network latency</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Subtitles not appearing
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Verify WebVTT file format is correct</li>
                  <li>Check CORS headers on subtitle file server</li>
                  <li>Ensure subtitle file encoding is UTF-8</li>
                  <li>Test subtitle URL is accessible directly</li>
                  <li>
                    Validate WebVTT syntax with online validator
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Picture-in-Picture not working
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>PiP requires HTTPS in most browsers</li>
                  <li>
                    Check browser support (not available in Firefox Android)
                  </li>
                  <li>Ensure enablePiP={`{true}`} is set</li>
                  <li>Video must be playing to enter PiP mode</li>
                  <li>Some browsers require user gesture to activate PiP</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </DocumentationPage>
  )
}
