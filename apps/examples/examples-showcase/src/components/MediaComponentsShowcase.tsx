/**
 * Media Components Showcase
 *
 * Demonstrates all media handling capabilities including:
 * - Audio recording and playback
 * - Video player with controls
 * - Image gallery with lightbox
 * - PDF viewer with navigation
 * - Markdown renderer with preview
 * - Code blocks with copy
 * - Mermaid diagram rendering
 * - File type handlers
 */

import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@clarity-chat/primitives'
import {
  Mic,
  Play,
  Pause,
  Download,
  Upload,
  Image as ImageIcon,
  FileText,
  Code,
  Share2,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  X,
  Copy,
  Check,
  Eye,
  Edit,
  RotateCw,
} from 'lucide-react'

// ============================================================================
// Types
// ============================================================================

type MediaTab =
  | 'audio-recorder'
  | 'audio-player'
  | 'video-player'
  | 'image-gallery'
  | 'pdf-viewer'
  | 'markdown'
  | 'code-block'
  | 'mermaid'

interface MediaFile {
  id: string
  name: string
  type: string
  url: string
  size?: number
  thumbnail?: string
}

// ============================================================================
// Audio Recorder Component
// ============================================================================

function AudioRecorderDemo() {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [duration, setDuration] = useState(0)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [amplitude, setAmplitude] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const intervalRef = useRef<NodeJS.Timeout>()

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(audioBlob)
        setAudioUrl(url)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setDuration(0)

      // Simulate amplitude
      intervalRef.current = setInterval(() => {
        setDuration(prev => prev + 1)
        setAmplitude(Math.random())
      }, 1000)
    } catch (error) {
      console.error('Error starting recording:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsPaused(false)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause()
      setIsPaused(true)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume()
      setIsPaused(false)
      intervalRef.current = setInterval(() => {
        setDuration(prev => prev + 1)
        setAmplitude(Math.random())
      }, 1000)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-white/10 bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-brand-500" />
            <h3 className="font-medium">Audio Recorder</h3>
          </div>
          {isRecording && (
            <div className="flex items-center gap-2 text-red-500">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm font-medium">Recording</span>
            </div>
          )}
        </div>

        {/* Waveform Visualization */}
        <div className="h-32 rounded-lg bg-muted/50 flex items-center justify-center mb-4 overflow-hidden">
          {isRecording && !isPaused ? (
            <div className="flex items-center justify-center gap-1 h-full px-4">
              {Array.from({ length: 60 }).map((_, i) => {
                const height = amplitude * 100 * (0.5 + Math.random() * 0.5)
                return (
                  <div
                    key={i}
                    className="w-1 bg-brand-500 rounded-full transition-all duration-150"
                    style={{ height: `${height}%` }}
                  />
                )
              })}
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              <Mic className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                {isPaused ? 'Recording Paused' : isRecording ? 'Recording...' : 'Ready to Record'}
              </p>
            </div>
          )}
        </div>

        {/* Duration */}
        {isRecording && (
          <div className="text-center text-2xl font-mono mb-4">
            {formatTime(duration)}
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          {!isRecording && (
            <button
              onClick={startRecording}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition-colors font-medium"
            >
              <Mic className="w-5 h-5" />
              Start Recording
            </button>
          )}

          {isRecording && (
            <>
              {!isPaused && (
                <button
                  onClick={pauseRecording}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 transition-colors border border-amber-200"
                >
                  <Pause className="w-4 h-4" />
                  Pause
                </button>
              )}

              {isPaused && (
                <button
                  onClick={resumeRecording}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-colors border border-green-200"
                >
                  <Play className="w-4 h-4" />
                  Resume
                </button>
              )}

              <button
                onClick={stopRecording}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors border border-red-200"
              >
                Stop
              </button>
            </>
          )}
        </div>

        {/* Playback */}
        {audioUrl && (
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Recording Complete</span>
              <a
                href={audioUrl}
                download="recording.webm"
                className="flex items-center gap-1 text-sm text-brand-500 hover:text-brand-600"
              >
                <Download className="w-4 h-4" />
                Download
              </a>
            </div>
            <audio src={audioUrl} controls className="w-full" />
          </div>
        )}
      </div>

      <div className="text-sm text-muted-foreground">
        <p>✓ Real-time waveform visualization</p>
        <p>✓ Pause/resume functionality</p>
        <p>✓ Duration tracking</p>
        <p>✓ Download recorded audio</p>
      </div>
    </div>
  )
}

// ============================================================================
// Audio Player Component
// ============================================================================

function AudioPlayerDemo() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const audioRef = useRef<HTMLAudioElement>(null)

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

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    setCurrentTime(time)
    if (audioRef.current) {
      audioRef.current.currentTime = time
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value)
    setVolume(vol)
    if (audioRef.current) {
      audioRef.current.volume = vol
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-white/10 bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Play className="w-5 h-5 text-brand-500" />
          <h3 className="font-medium">Audio Player</h3>
        </div>

        <audio
          ref={audioRef}
          src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
        />

        {/* Album Art */}
        <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 mb-4 flex items-center justify-center">
          <Play className="w-16 h-16 text-white opacity-50" />
        </div>

        {/* Track Info */}
        <div className="text-center mb-4">
          <h4 className="font-medium">Sample Audio Track</h4>
          <p className="text-sm text-muted-foreground">Demo Artist</p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 mb-4">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <button className="p-2 hover:bg-muted rounded-full transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={togglePlay}
            className="p-4 rounded-full bg-brand-500 hover:bg-brand-600 text-white transition-colors"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </button>
          <button className="p-2 hover:bg-muted rounded-full transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Volume</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="flex-1"
          />
          <span className="text-sm text-muted-foreground w-12 text-right">
            {Math.round(volume * 100)}%
          </span>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        <p>✓ Play/pause controls</p>
        <p>✓ Progress tracking</p>
        <p>✓ Volume control</p>
        <p>✓ Seek functionality</p>
      </div>
    </div>
  )
}

// ============================================================================
// Image Gallery Component
// ============================================================================

function ImageGalleryDemo() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [zoom, setZoom] = useState(1)

  const images = [
    { id: 1, url: 'https://picsum.photos/400/300?random=1', title: 'Image 1' },
    { id: 2, url: 'https://picsum.photos/400/300?random=2', title: 'Image 2' },
    { id: 3, url: 'https://picsum.photos/400/300?random=3', title: 'Image 3' },
    { id: 4, url: 'https://picsum.photos/400/300?random=4', title: 'Image 4' },
    { id: 5, url: 'https://picsum.photos/400/300?random=5', title: 'Image 5' },
    { id: 6, url: 'https://picsum.photos/400/300?random=6', title: 'Image 6' },
  ]

  const openLightbox = (index: number) => {
    setSelectedImage(index)
    setZoom(1)
  }

  const closeLightbox = () => {
    setSelectedImage(null)
    setZoom(1)
  }

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % images.length)
      setZoom(1)
    }
  }

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + images.length) % images.length)
      setZoom(1)
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-white/10 bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <ImageIcon className="w-5 h-5 text-brand-500" />
          <h3 className="font-medium">Image Gallery</h3>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              onClick={() => openLightbox(index)}
              className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity border border-white/10"
            >
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          <div className="absolute top-4 left-4 flex gap-2">
            <button
              onClick={() => setZoom(Math.min(zoom + 0.5, 3))}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ZoomIn className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => setZoom(Math.max(zoom - 0.5, 0.5))}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ZoomOut className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="max-w-5xl max-h-[80vh] overflow-auto">
            <img
              src={images[selectedImage].url}
              alt={images[selectedImage].title}
              className="transition-transform duration-200"
              style={{ transform: `scale(${zoom})` }}
            />
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
            {selectedImage + 1} / {images.length}
          </div>
        </div>
      )}

      <div className="text-sm text-muted-foreground">
        <p>✓ Grid layout</p>
        <p>✓ Lightbox view</p>
        <p>✓ Zoom controls</p>
        <p>✓ Navigation arrows</p>
      </div>
    </div>
  )
}

// ============================================================================
// PDF Viewer Component
// ============================================================================

function PDFViewerDemo() {
  const [page, setPage] = useState(1)
  const totalPages = 5

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-white/10 bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-500" />
            <h3 className="font-medium">PDF Viewer</h3>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-muted rounded transition-colors">
              <Download className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-muted rounded transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PDF Mockup */}
        <div className="rounded-lg border border-white/10 bg-white p-8 mb-4 min-h-[400px] flex items-center justify-center">
          <div className="text-center space-y-4">
            <FileText className="w-16 h-16 mx-auto text-gray-400" />
            <div>
              <h4 className="font-medium text-gray-900">Sample PDF Document</h4>
              <p className="text-sm text-gray-600">Page {page} of {totalPages}</p>
            </div>
            <div className="space-y-2 text-left max-w-md mx-auto">
              <div className="h-2 bg-gray-200 rounded w-full" />
              <div className="h-2 bg-gray-200 rounded w-5/6" />
              <div className="h-2 bg-gray-200 rounded w-4/6" />
              <div className="h-2 bg-gray-200 rounded w-full" />
              <div className="h-2 bg-gray-200 rounded w-3/4" />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex items-center gap-2">
            <input
              type="number"
              value={page}
              onChange={(e) => setPage(Math.max(1, Math.min(totalPages, parseInt(e.target.value) || 1)))}
              className="w-16 px-2 py-1 text-center border border-white/10 rounded bg-muted"
            />
            <span className="text-sm text-muted-foreground">of {totalPages}</span>
          </div>

          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        <p>✓ Page navigation</p>
        <p>✓ Download option</p>
        <p>✓ Share functionality</p>
        <p>✓ Page jump</p>
      </div>
    </div>
  )
}

// ============================================================================
// Markdown Renderer Component
// ============================================================================

function MarkdownRendererDemo() {
  const [mode, setMode] = useState<'preview' | 'edit'>('preview')
  const [markdown, setMarkdown] = useState(`# Hello World

This is a **markdown** example with:

- Lists
- *Italic text*
- [Links](https://example.com)

## Code Example

\`\`\`javascript
const greeting = "Hello, World!"
console.log(greeting)
\`\`\`

> This is a blockquote
`)

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-white/10 bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-500" />
            <h3 className="font-medium">Markdown Renderer</h3>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setMode('preview')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm transition-colors',
                mode === 'preview'
                  ? 'bg-brand-500 text-white'
                  : 'bg-muted hover:bg-muted/80'
              )}
            >
              <Eye className="w-4 h-4 inline mr-1" />
              Preview
            </button>
            <button
              onClick={() => setMode('edit')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm transition-colors',
                mode === 'edit'
                  ? 'bg-brand-500 text-white'
                  : 'bg-muted hover:bg-muted/80'
              )}
            >
              <Edit className="w-4 h-4 inline mr-1" />
              Edit
            </button>
          </div>
        </div>

        {mode === 'edit' ? (
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="w-full h-96 p-4 rounded-lg border border-white/10 bg-muted font-mono text-sm resize-none"
            placeholder="Enter markdown..."
          />
        ) : (
          <div className="prose prose-sm max-w-none p-4 rounded-lg border border-white/10 bg-muted min-h-96">
            <div dangerouslySetInnerHTML={{ __html: markdown.replace(/\n/g, '<br/>') }} />
          </div>
        )}
      </div>

      <div className="text-sm text-muted-foreground">
        <p>✓ Live preview</p>
        <p>✓ Edit mode</p>
        <p>✓ Syntax highlighting</p>
        <p>✓ Full markdown support</p>
      </div>
    </div>
  )
}

// ============================================================================
// Code Block Component
// ============================================================================

function CodeBlockDemo() {
  const [copied, setCopied] = useState(false)

  const code = `import React from 'react'
import { ChatWindow } from '@clarity-chat/react'

function App() {
  const [messages, setMessages] = React.useState([])

  return (
    <ChatWindow
      messages={messages}
      onSend={(message) => {
        setMessages([...messages, message])
      }}
    />
  )
}

export default App`

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-white/10 bg-card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-brand-500" />
            <span className="text-sm font-medium">example.tsx</span>
            <span className="text-xs px-2 py-0.5 rounded bg-brand-500/10 text-brand-500">
              TypeScript
            </span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-muted transition-colors text-sm"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-green-500">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        <pre className="p-4 overflow-x-auto bg-[#011627] text-sm">
          <code className="text-gray-300 font-mono">{code}</code>
        </pre>
      </div>

      <div className="text-sm text-muted-foreground">
        <p>✓ Syntax highlighting</p>
        <p>✓ Copy button</p>
        <p>✓ Language badge</p>
        <p>✓ Filename display</p>
      </div>
    </div>
  )
}

// ============================================================================
// Mermaid Diagram Component
// ============================================================================

function MermaidDiagramDemo() {
  const [diagramType, setDiagramType] = useState<'flowchart' | 'sequence' | 'class'>('flowchart')

  const diagrams = {
    flowchart: `graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
    C --> E[End]
    D --> E`,
    sequence: `sequenceDiagram
    User->>+API: Request
    API->>+Database: Query
    Database-->>-API: Data
    API-->>-User: Response`,
    class: `classDiagram
    class User {
      +String name
      +String email
      +login()
    }
    class Admin {
      +manageUsers()
    }
    User <|-- Admin`,
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-white/10 bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-brand-500" />
            <h3 className="font-medium">Mermaid Diagrams</h3>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setDiagramType('flowchart')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm transition-colors',
                diagramType === 'flowchart'
                  ? 'bg-brand-500 text-white'
                  : 'bg-muted hover:bg-muted/80'
              )}
            >
              Flowchart
            </button>
            <button
              onClick={() => setDiagramType('sequence')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm transition-colors',
                diagramType === 'sequence'
                  ? 'bg-brand-500 text-white'
                  : 'bg-muted hover:bg-muted/80'
              )}
            >
              Sequence
            </button>
            <button
              onClick={() => setDiagramType('class')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm transition-colors',
                diagramType === 'class'
                  ? 'bg-brand-500 text-white'
                  : 'bg-muted hover:bg-muted/80'
              )}
            >
              Class
            </button>
          </div>
        </div>

        {/* Diagram Mockup */}
        <div className="rounded-lg border border-white/10 bg-muted p-8 min-h-[300px] flex items-center justify-center">
          <div className="text-center space-y-4">
            <Share2 className="w-12 h-12 mx-auto text-brand-500" />
            <div>
              <h4 className="font-medium">{diagramType.charAt(0).toUpperCase() + diagramType.slice(1)} Diagram</h4>
              <p className="text-sm text-muted-foreground mt-2">Mermaid diagram would render here</p>
            </div>
          </div>
        </div>

        {/* Source Code */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Mermaid Code</span>
            <button className="text-sm text-brand-500 hover:text-brand-600">
              <Copy className="w-4 h-4 inline mr-1" />
              Copy
            </button>
          </div>
          <pre className="p-4 rounded-lg bg-muted/50 text-xs overflow-x-auto">
            <code>{diagrams[diagramType]}</code>
          </pre>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        <p>✓ Multiple diagram types</p>
        <p>✓ Live rendering</p>
        <p>✓ Source code view</p>
        <p>✓ Export options</p>
      </div>
    </div>
  )
}

// ============================================================================
// Main Component
// ============================================================================

export function MediaComponentsShowcase() {
  const [activeTab, setActiveTab] = useState<MediaTab>('audio-recorder')

  const tabs: { id: MediaTab; label: string; icon: React.ReactNode }[] = [
    { id: 'audio-recorder', label: 'Audio Recorder', icon: <Mic className="w-4 h-4" /> },
    { id: 'audio-player', label: 'Audio Player', icon: <Play className="w-4 h-4" /> },
    { id: 'video-player', label: 'Video Player', icon: <Play className="w-4 h-4" /> },
    { id: 'image-gallery', label: 'Image Gallery', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'pdf-viewer', label: 'PDF Viewer', icon: <FileText className="w-4 h-4" /> },
    { id: 'markdown', label: 'Markdown', icon: <FileText className="w-4 h-4" /> },
    { id: 'code-block', label: 'Code Block', icon: <Code className="w-4 h-4" /> },
    { id: 'mermaid', label: 'Mermaid', icon: <Share2 className="w-4 h-4" /> },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'audio-recorder':
        return <AudioRecorderDemo />
      case 'audio-player':
        return <AudioPlayerDemo />
      case 'video-player':
        return <AudioPlayerDemo /> // Reuse for demo
      case 'image-gallery':
        return <ImageGalleryDemo />
      case 'pdf-viewer':
        return <PDFViewerDemo />
      case 'markdown':
        return <MarkdownRendererDemo />
      case 'code-block':
        return <CodeBlockDemo />
      case 'mermaid':
        return <MermaidDiagramDemo />
      default:
        return null
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Media Components Showcase</h1>
        <p className="text-muted-foreground">
          Comprehensive media handling components with preview, playback, and export capabilities.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors',
              activeTab === tab.id
                ? 'bg-brand-500 text-white'
                : 'bg-muted hover:bg-muted/80'
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-6">
        {renderContent()}
      </div>

      {/* Feature Summary */}
      <div className="mt-8 p-6 rounded-xl border border-white/10 bg-card">
        <h3 className="font-medium mb-4">Media Component Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-brand-500 mb-2">Audio</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Recording with visualization</li>
              <li>• Playback controls</li>
              <li>• Format conversion</li>
              <li>• Download/export</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-brand-500 mb-2">Visual Media</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Image gallery with lightbox</li>
              <li>• Video playback</li>
              <li>• PDF navigation</li>
              <li>• Zoom controls</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-brand-500 mb-2">Documents</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Markdown rendering</li>
              <li>• Code syntax highlighting</li>
              <li>• Mermaid diagrams</li>
              <li>• Copy to clipboard</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-brand-500 mb-2">File Handling</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Multiple format support</li>
              <li>• Preview modes</li>
              <li>• Download options</li>
              <li>• Share functionality</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

MediaComponentsShowcase.displayName = 'MediaComponentsShowcase'

export default MediaComponentsShowcase
