'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import { Slider } from '@clarity-chat/primitives'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@clarity-chat/primitives'
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Volume1,
  SkipBack,
  SkipForward,
  Loader2,
  AlertCircle,
  RotateCcw,
  Download,
} from 'lucide-react'

// ============================================================================
// TYPES
// ============================================================================

export type AudioStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error'

export interface AudioPlayerProps {
  src: string
  title?: string
  subtitle?: string
  autoPlay?: boolean
  loop?: boolean
  showVolumeControl?: boolean
  showProgressBar?: boolean
  showTimeDisplay?: boolean
  showDownload?: boolean
  variant?: 'default' | 'compact' | 'minimal' | 'card'
  size?: 'sm' | 'md' | 'lg'
  onPlay?: () => void
  onPause?: () => void
  onEnded?: () => void
  onError?: (error: Error) => void
  onTimeUpdate?: (currentTime: number, duration: number) => void
  className?: string
}

// ============================================================================
// AUDIO PLAYER
// ============================================================================

export function AudioPlayer({
  src,
  title,
  subtitle,
  autoPlay = false,
  loop = false,
  showVolumeControl = true,
  showProgressBar = true,
  showTimeDisplay = true,
  showDownload = false,
  variant = 'default',
  size = 'md',
  onPlay,
  onPause,
  onEnded,
  onError,
  onTimeUpdate,
  className,
}: AudioPlayerProps) {
  const audioRef = React.useRef<HTMLAudioElement>(null)
  const [status, setStatus] = React.useState<AudioStatus>('idle')
  const [currentTime, setCurrentTime] = React.useState(0)
  const [duration, setDuration] = React.useState(0)
  const [volume, setVolume] = React.useState(1)
  const [isMuted, setIsMuted] = React.useState(false)

  // Load audio metadata
  React.useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
      if (autoPlay) {
        audio.play().catch(() => setStatus('error'))
      }
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
      onTimeUpdate?.(audio.currentTime, audio.duration)
    }

    const handlePlay = () => {
      setStatus('playing')
      onPlay?.()
    }

    const handlePause = () => {
      setStatus('paused')
      onPause?.()
    }

    const handleEnded = () => {
      setStatus('paused')
      setCurrentTime(0)
      onEnded?.()
    }

    const handleError = () => {
      setStatus('error')
      onError?.(new Error('Failed to load audio'))
    }

    const handleWaiting = () => {
      setStatus('loading')
    }

    const handleCanPlay = () => {
      if (status === 'loading') {
        setStatus('paused')
      }
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)
    audio.addEventListener('waiting', handleWaiting)
    audio.addEventListener('canplay', handleCanPlay)

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
      audio.removeEventListener('waiting', handleWaiting)
      audio.removeEventListener('canplay', handleCanPlay)
    }
  }, [src, autoPlay, onPlay, onPause, onEnded, onError, onTimeUpdate, status])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (status === 'playing') {
      audio.pause()
    } else {
      audio.play().catch(() => setStatus('error'))
    }
  }

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = value[0]
    setCurrentTime(value[0])
  }

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current
    if (!audio) return
    const newVolume = value[0]
    audio.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isMuted) {
      audio.volume = volume || 1
      setIsMuted(false)
    } else {
      audio.volume = 0
      setIsMuted(true)
    }
  }

  const skip = (seconds: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = Math.max(
      0,
      Math.min(audio.currentTime + seconds, duration)
    )
  }

  const retry = () => {
    const audio = audioRef.current
    if (!audio) return
    setStatus('loading')
    audio.load()
    audio.play().catch(() => setStatus('error'))
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const sizeClasses = {
    sm: { button: 'h-7 w-7', icon: 'w-3.5 h-3.5', text: 'text-xs' },
    md: { button: 'h-8 w-8', icon: 'w-4 h-4', text: 'text-sm' },
    lg: { button: 'h-10 w-10', icon: 'w-5 h-5', text: 'text-base' },
  }

  const sizes = sizeClasses[size]

  const VolumeIcon = isMuted ? VolumeX : volume < 0.5 ? Volume1 : Volume2

  const PlayIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className={cn(sizes.icon, 'animate-spin')} />
      case 'playing':
        return <Pause className={sizes.icon} />
      case 'error':
        return <AlertCircle className={cn(sizes.icon, 'text-destructive')} />
      default:
        return <Play className={sizes.icon} />
    }
  }

  // Minimal variant - just play button
  if (variant === 'minimal') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={status === 'error' ? retry : togglePlay}
              disabled={status === 'loading'}
              className={cn(sizes.button, className)}
            >
              <audio ref={audioRef} src={src} loop={loop} preload="metadata" />
              <PlayIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {status === 'error'
              ? 'Retry'
              : status === 'playing'
                ? 'Pause'
                : 'Play'}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <audio ref={audioRef} src={src} loop={loop} preload="metadata" />

        <Button
          variant="ghost"
          size="icon"
          onClick={status === 'error' ? retry : togglePlay}
          disabled={status === 'loading'}
          className={sizes.button}
        >
          <PlayIcon />
        </Button>

        {showProgressBar && (
          <div className="flex-1 flex items-center gap-2">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              onValueChange={handleSeek}
              className="flex-1"
              disabled={status === 'error'}
            />
            {showTimeDisplay && (
              <span
                className={cn('text-muted-foreground tabular-nums', sizes.text)}
              >
                {formatTime(currentTime)}
              </span>
            )}
          </div>
        )}
      </div>
    )
  }

  // Card variant
  if (variant === 'card') {
    return (
      <div
        className={cn(
          'rounded-lg p-4 space-y-3',

          // Glassmorphism: Subtle intensity for media viewers
          'backdrop-blur-sm bg-card/60',
          'border border-border/[0.12]',

          // Hover glow
          'transition-all duration-300',
          'hover:shadow-[0_0_20px_rgba(129,140,248,0.1)]',
          'hover:border-border/[0.16]',

          className
        )}
      >
        <audio ref={audioRef} src={src} loop={loop} preload="metadata" />

        {/* Title */}
        {(title || subtitle) && (
          <div>
            {title && (
              <h4 className={cn('font-medium', sizes.text)}>{title}</h4>
            )}
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
        )}

        {/* Progress bar */}
        {showProgressBar && (
          <div className="space-y-1">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              onValueChange={handleSeek}
              disabled={status === 'error'}
            />
            {showTimeDisplay && (
              <div className="flex justify-between text-xs text-muted-foreground tabular-nums">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            )}
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => skip(-10)}
              className={sizes.button}
              disabled={status === 'error'}
            >
              <SkipBack className={sizes.icon} />
            </Button>

            <Button
              variant="default"
              size="icon"
              onClick={status === 'error' ? retry : togglePlay}
              disabled={status === 'loading'}
              className={cn(sizes.button, 'rounded-full')}
            >
              <PlayIcon />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => skip(10)}
              className={sizes.button}
              disabled={status === 'error'}
            >
              <SkipForward className={sizes.icon} />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {showVolumeControl && (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                  className={sizes.button}
                >
                  <VolumeIcon className={sizes.icon} />
                </Button>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={1}
                  step={0.1}
                  onValueChange={handleVolumeChange}
                  className="w-20"
                />
              </div>
            )}

            {showDownload && (
              <Button
                variant="ghost"
                size="icon"
                asChild
                className={sizes.button}
              >
                <a href={src} download>
                  <Download className={sizes.icon} />
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Default variant
  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg',

        // Glassmorphism: Subtle intensity for media viewers
        'backdrop-blur-sm bg-muted/60',
        'border border-border/[0.12]',

        // Hover state
        'transition-all duration-300',
        'hover:border-border/[0.16]',

        className
      )}
    >
      <audio ref={audioRef} src={src} loop={loop} preload="metadata" />

      {/* Play button */}
      <Button
        variant="default"
        size="icon"
        onClick={status === 'error' ? retry : togglePlay}
        disabled={status === 'loading'}
        className={cn(sizes.button, 'rounded-full flex-shrink-0')}
      >
        <PlayIcon />
      </Button>

      {/* Progress and info */}
      <div className="flex-1 min-w-0 space-y-1">
        {title && (
          <p className={cn('font-medium truncate', sizes.text)}>{title}</p>
        )}

        {showProgressBar && (
          <div className="flex items-center gap-2">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              onValueChange={handleSeek}
              className="flex-1"
              disabled={status === 'error'}
            />
            {showTimeDisplay && (
              <span className="text-xs text-muted-foreground tabular-nums flex-shrink-0">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Volume */}
      {showVolumeControl && (
        <div className="flex items-center gap-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className={sizes.button}
          >
            <VolumeIcon className={sizes.icon} />
          </Button>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// AUDIO ACTION BUTTON - For message actions
// ============================================================================

export interface AudioActionButtonProps {
  status?: 'default' | 'loading' | 'playing' | 'error'
  onClick?: () => void
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
}

export function AudioActionButton({
  status = 'default',
  onClick,
  size = 'sm',
  className,
}: AudioActionButtonProps) {
  const sizeClasses = {
    xs: { button: 'h-6 w-6', icon: 'w-3 h-3' },
    sm: { button: 'h-7 w-7', icon: 'w-3.5 h-3.5' },
    md: { button: 'h-8 w-8', icon: 'w-4 h-4' },
    lg: { button: 'h-9 w-9', icon: 'w-5 h-5' },
  }

  const sizes = sizeClasses[size]

  const Icon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className={cn(sizes.icon, 'animate-spin')} />
      case 'playing':
        return <Pause className={sizes.icon} />
      case 'error':
        return <AlertCircle className={cn(sizes.icon, 'text-destructive')} />
      default:
        return <Volume2 className={sizes.icon} />
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClick}
            disabled={status === 'loading'}
            className={cn(sizes.button, className)}
          >
            <Icon />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {status === 'error'
            ? 'Error'
            : status === 'playing'
              ? 'Stop'
              : status === 'loading'
                ? 'Loading...'
                : 'Play audio'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// ============================================================================
// EXPORTS
// ============================================================================

export default AudioPlayer
