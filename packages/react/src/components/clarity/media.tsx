'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Repeat,
  Shuffle,
  Heart,
  MoreHorizontal,
  Mic,
  MicOff,
  AudioWaveform as Waveform,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import { Button } from '@clarity-chat/primitives'
import { Slider } from '@clarity-chat/primitives'

// Audio Player Component (Spotify-like)
interface AudioTrack {
  id: string
  title: string
  artist?: string
  album?: string
  duration: number
  coverUrl?: string
  audioUrl: string
}

interface AudioPlayerProps {
  track: AudioTrack
  onNext?: () => void
  onPrevious?: () => void
  onLike?: () => void
  isLiked?: boolean
  className?: string
}

export function AudioPlayer({
  track,
  onNext,
  onPrevious,
  onLike,
  isLiked,
  className,
}: AudioPlayerProps) {
  // Defensive check for undefined track
  const safeTrack = track || {
    audioUrl: '',
    title: 'Unknown Track',
    artist: '',
    duration: 0,
    coverUrl: '',
  }

  const [isPlaying, setIsPlaying] = React.useState(false)
  const [currentTime, setCurrentTime] = React.useState(0)
  const [volume, setVolume] = React.useState(80)
  const [isMuted, setIsMuted] = React.useState(false)
  const [isRepeat, setIsRepeat] = React.useState(false)
  const [isShuffle, setIsShuffle] = React.useState(false)
  const audioRef = React.useRef<HTMLAudioElement>(null)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0])
    if (audioRef.current) {
      audioRef.current.volume = value[0] / 100
    }
    if (value[0] === 0) {
      setIsMuted(true)
    } else {
      setIsMuted(false)
    }
  }

  return (
    <div
      className={cn('rounded-lg border border-border bg-card p-4', className)}
    >
      {safeTrack.audioUrl && (
        <audio
          ref={audioRef}
          src={safeTrack.audioUrl}
          onTimeUpdate={() =>
            setCurrentTime(audioRef.current?.currentTime || 0)
          }
          onEnded={() => setIsPlaying(false)}
        />
      )}

      <div className="flex items-center gap-4">
        {/* Cover Art */}
        {safeTrack.coverUrl && (
          <div className="w-14 h-14 rounded-md overflow-hidden bg-muted shrink-0">
            <img
              src={safeTrack.coverUrl || '/placeholder.svg'}
              alt={safeTrack.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm truncate">{safeTrack.title}</h4>
          {safeTrack.artist && (
            <p className="text-xs text-muted-foreground truncate">
              {safeTrack.artist}
            </p>
          )}
        </div>

        {/* Like Button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onLike}
        >
          <Heart
            className={cn('w-4 h-4', isLiked && 'fill-red-500 text-red-500')}
          />
        </Button>
      </div>

      {/* Progress */}
      <div className="mt-4 space-y-2">
        <Slider
          value={[currentTime]}
          min={0}
          max={safeTrack.duration}
          step={1}
          onValueChange={handleTimeChange}
          className="w-full"
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(safeTrack.duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-4">
        <Button
          variant="ghost"
          size="icon"
          className={cn('h-8 w-8', isShuffle && 'text-accent')}
          onClick={() => setIsShuffle(!isShuffle)}
        >
          <Shuffle className="w-4 h-4" />
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onPrevious}
          >
            <SkipBack className="w-4 h-4" />
          </Button>

          <Button
            size="icon"
            className="h-10 w-10 rounded-full"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onNext}
          >
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className={cn('h-8 w-8', isRepeat && 'text-accent')}
          onClick={() => setIsRepeat(!isRepeat)}
        >
          <Repeat className="w-4 h-4" />
        </Button>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-2 mt-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setIsMuted(!isMuted)}
        >
          {isMuted || volume === 0 ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </Button>
        <Slider
          value={[isMuted ? 0 : volume]}
          min={0}
          max={100}
          step={1}
          onValueChange={handleVolumeChange}
          className="w-24"
        />
      </div>
    </div>
  )
}

// Microphone Input Component
interface MicrophoneInputProps {
  onTranscript?: (text: string) => void
  onStart?: () => void
  onStop?: () => void
  isListening?: boolean
  transcript?: string
  className?: string
}

export function MicrophoneInput({
  onTranscript,
  onStart,
  onStop,
  isListening = false,
  transcript,
  className,
}: MicrophoneInputProps) {
  const [visualizerBars, setVisualizerBars] = React.useState<number[]>(
    Array(20).fill(0)
  )

  React.useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setVisualizerBars(
          Array(20)
            .fill(0)
            .map(() => Math.random() * 100)
        )
      }, 100)
      return () => clearInterval(interval)
    } else {
      setVisualizerBars(Array(20).fill(0))
    }
  }, [isListening])

  return (
    <div
      className={cn('rounded-lg border border-border bg-card p-4', className)}
    >
      {/* Visualizer */}
      <div className="flex items-end justify-center gap-1 h-16 mb-4">
        {visualizerBars.map((height, i) => (
          <div
            key={i}
            className={cn(
              'w-1 rounded-full transition-all duration-100',
              isListening ? 'bg-accent' : 'bg-muted'
            )}
            style={{ height: `${Math.max(height, 10)}%` }}
          />
        ))}
      </div>

      {/* Transcript */}
      {transcript && (
        <div className="mb-4 p-3 rounded-md bg-muted/50">
          <p className="text-sm">{transcript}</p>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <Button
          size="lg"
          className={cn(
            'h-14 w-14 rounded-full',
            isListening && 'bg-red-500 hover:bg-red-600'
          )}
          onClick={isListening ? onStop : onStart}
        >
          {isListening ? (
            <MicOff className="w-6 h-6" />
          ) : (
            <Mic className="w-6 h-6" />
          )}
        </Button>
      </div>

      <p className="text-xs text-center text-muted-foreground mt-4">
        {isListening ? 'Listening...' : 'Click to start speaking'}
      </p>
    </div>
  )
}

// Image Gallery / Carousel
interface GalleryImage {
  id: string
  src: string
  alt?: string
  caption?: string
}

interface ImageGalleryProps {
  images: GalleryImage[]
  onImageClick?: (image: GalleryImage, index: number) => void
  className?: string
}

export function ImageGallery({
  images,
  onImageClick,
  className,
}: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [isFullscreen, setIsFullscreen] = React.useState(false)

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  if (images.length === 0) return null

  const currentImage = images[currentIndex]

  return (
    <>
      <div
        className={cn(
          'rounded-lg border border-border bg-card overflow-hidden',
          className
        )}
      >
        {/* Main Image */}
        <div className="relative aspect-video bg-muted">
          <img
            src={currentImage.src || '/placeholder.svg'}
            alt={currentImage.alt || 'Gallery image'}
            className="w-full h-full object-contain"
            onClick={() => onImageClick?.(currentImage, currentIndex)}
          />

          {/* Navigation */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-background/80 hover:bg-background"
                onClick={goToPrevious}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-background/80 hover:bg-background"
                onClick={goToNext}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </>
          )}

          {/* Actions */}
          <div className="absolute top-2 right-2 flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 bg-background/80 hover:bg-background"
              onClick={() => setIsFullscreen(true)}
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded-full bg-background/80 text-xs">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Caption */}
        {currentImage.caption && (
          <div className="p-3 border-t border-border">
            <p className="text-sm text-muted-foreground">
              {currentImage.caption}
            </p>
          </div>
        )}

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="p-2 border-t border-border flex gap-2 overflow-x-auto">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  'w-12 h-12 rounded-md overflow-hidden shrink-0 border-2 transition-colors',
                  index === currentIndex
                    ? 'border-accent'
                    : 'border-transparent hover:border-muted-foreground'
                )}
              >
                <img
                  src={image.src || '/placeholder.svg'}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4"
            onClick={() => setIsFullscreen(false)}
          >
            <X className="w-6 h-6" />
          </Button>

          <img
            src={currentImage.src || '/placeholder.svg'}
            alt={currentImage.alt || 'Gallery image'}
            className="max-w-full max-h-full object-contain"
          />

          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2"
                onClick={goToPrevious}
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2"
                onClick={goToNext}
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </>
          )}
        </div>
      )}
    </>
  )
}

// Video Player
interface VideoPlayerProps {
  src: string
  poster?: string
  title?: string
  className?: string
}

export function VideoPlayer({
  src,
  poster,
  title,
  className,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [currentTime, setCurrentTime] = React.useState(0)
  const [duration, setDuration] = React.useState(0)
  const [isFullscreen, setIsFullscreen] = React.useState(false)
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (!isFullscreen) {
        containerRef.current.requestFullscreen()
      } else {
        document.exitFullscreen()
      }
      setIsFullscreen(!isFullscreen)
    }
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative rounded-lg overflow-hidden bg-black group',
        className
      )}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full"
        onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
        onEnded={() => setIsPlaying(false)}
        onClick={togglePlay}
      />

      {/* Controls Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Progress Bar */}
        <div className="px-4 pb-2">
          <Slider
            value={[currentTime]}
            min={0}
            max={duration}
            step={0.1}
            onValueChange={(value) => {
              if (videoRef.current) {
                videoRef.current.currentTime = value[0]
              }
            }}
            className="w-full"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between px-4 pb-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>
            <span className="text-xs text-white">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/20"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Play Button Overlay (when paused) */}
      {!isPlaying && (
        <button
          className="absolute inset-0 flex items-center justify-center"
          onClick={togglePlay}
        >
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Play className="w-8 h-8 text-white ml-1" />
          </div>
        </button>
      )}
    </div>
  )
}

// Voice Selector
interface Voice {
  id: string
  name: string
  language: string
  gender: 'male' | 'female' | 'neutral'
  preview?: string
}

interface VoiceSelectorProps {
  voices: Voice[]
  selectedVoice?: string
  onSelect: (voice: Voice) => void
  className?: string
}

export function VoiceSelector({
  voices,
  selectedVoice,
  onSelect,
  className,
}: VoiceSelectorProps) {
  const [playingId, setPlayingId] = React.useState<string | null>(null)

  const playPreview = (voice: Voice) => {
    if (voice.preview) {
      const audio = new Audio(voice.preview)
      setPlayingId(voice.id)
      audio.play()
      audio.onended = () => setPlayingId(null)
    }
  }

  return (
    <div className={cn('space-y-2', className)}>
      {voices.map((voice) => (
        <button
          key={voice.id}
          onClick={() => onSelect(voice)}
          className={cn(
            'w-full flex items-center justify-between p-3 rounded-lg border transition-colors',
            selectedVoice === voice.id
              ? 'border-accent bg-accent/10'
              : 'border-border hover:bg-muted/50'
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center',
                voice.gender === 'male' && 'bg-blue-500/10 text-blue-500',
                voice.gender === 'female' && 'bg-pink-500/10 text-pink-500',
                voice.gender === 'neutral' && 'bg-purple-500/10 text-purple-500'
              )}
            >
              <Mic className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="font-medium text-sm block">{voice.name}</span>
              <span className="text-xs text-muted-foreground">
                {voice.language}
              </span>
            </div>
          </div>

          {voice.preview && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation()
                playPreview(voice)
              }}
            >
              {playingId === voice.id ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>
          )}
        </button>
      ))}
    </div>
  )
}
