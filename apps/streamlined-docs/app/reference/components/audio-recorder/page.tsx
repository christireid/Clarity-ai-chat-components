'use client'

/**
 * AudioRecorder Component - API Reference Documentation
 *
 * A browser-based audio recording component with waveform visualization,
 * noise cancellation, format conversion, and Web Audio API integration.
 */

import * as React from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mic,
  ExternalLink,
  Copy,
  Check,
  ChevronRight,
  Zap,
  Waves,
  Shield,
  Accessibility,
  Play,
  StopCircle,
  Pause,
  Download,
  AlertTriangle,
  HelpCircle,
  Keyboard,
  Radio,
  Volume2,
  Clock,
  FileAudio,
  Settings,
  Activity,
  Cpu,
  Globe,
  Wand2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { durations } from '@/lib/animations'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodeBlock } from '@/components/Docs/CodeBlock'

// ISR Configuration: API documentation changes with code updates
export const revalidate = 3600

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
// Format Support Table
// ============================================================================

interface FormatDefinition {
  format: string
  codec: string
  quality: string
  support: string
}

function FormatTable({ formats }: { formats: FormatDefinition[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border/50">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50 bg-muted/20">
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Format
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Codec
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Quality
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Browser Support
            </th>
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
              <td className="px-4 py-3 font-mono text-sm text-brand-600 dark:text-brand-400">
                {format.format}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                {format.codec}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {format.quality}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {format.support}
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
  const [isRecording, setIsRecording] = React.useState(false)
  const [isPaused, setIsPaused] = React.useState(false)
  const [duration, setDuration] = React.useState(0)
  const [audioLevel, setAudioLevel] = React.useState(0)
  const [permissionGranted, setPermissionGranted] = React.useState<
    boolean | null
  >(null)
  const [recordingExists, setRecordingExists] = React.useState(false)
  const intervalRef = React.useRef<NodeJS.Timeout>()
  const levelIntervalRef = React.useRef<NodeJS.Timeout>()

  const requestPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach((track) => track.stop())
      setPermissionGranted(true)
    } catch (error) {
      setPermissionGranted(false)
    }
  }

  const startRecording = () => {
    setIsRecording(true)
    setIsPaused(false)
    setDuration(0)
    setRecordingExists(false)

    // Simulate duration timer
    intervalRef.current = setInterval(() => {
      setDuration((prev) => prev + 1)
    }, 1000)

    // Simulate audio level changes
    levelIntervalRef.current = setInterval(() => {
      setAudioLevel(Math.random() * 100)
    }, 100)
  }

  const pauseRecording = () => {
    setIsPaused(true)
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (levelIntervalRef.current) clearInterval(levelIntervalRef.current)
    setAudioLevel(0)
  }

  const resumeRecording = () => {
    setIsPaused(false)
    intervalRef.current = setInterval(() => {
      setDuration((prev) => prev + 1)
    }, 1000)
    levelIntervalRef.current = setInterval(() => {
      setAudioLevel(Math.random() * 100)
    }, 100)
  }

  const stopRecording = () => {
    setIsRecording(false)
    setIsPaused(false)
    setRecordingExists(true)
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (levelIntervalRef.current) clearInterval(levelIntervalRef.current)
    setAudioLevel(0)
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  React.useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (levelIntervalRef.current) clearInterval(levelIntervalRef.current)
    }
  }, [])

  return (
    <div className="space-y-4">
      {/* Permission Notice */}
      {permissionGranted === null && (
        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <Mic className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-semibold text-foreground mb-2">
                Microphone Permission Required
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Audio recording requires microphone access. Click below to
                grant permission.
              </p>
              <button
                onClick={requestPermission}
                className="text-sm px-4 py-2 rounded bg-brand-500 text-white hover:bg-brand-600 transition-colors"
              >
                Request Permission
              </button>
            </div>
          </div>
        </div>
      )}

      {permissionGranted === false && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
            <div>
              <h4 className="font-semibold text-foreground mb-2">
                Permission Denied
              </h4>
              <p className="text-sm text-muted-foreground">
                Please allow microphone access in your browser settings to use
                audio recording.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Demo Component */}
      {permissionGranted && (
        <div className="relative rounded-xl border border-border/50 bg-card overflow-hidden shadow-lg">
          {/* Header */}
          <div className="px-4 py-3 bg-muted/30 border-b border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">AudioRecorder Demo</span>
            </div>
            {isRecording && (
              <div className="flex items-center gap-2">
                <Radio className="w-3 h-3 text-red-500 animate-pulse" />
                <span className="text-xs text-red-500 font-medium">
                  Recording
                </span>
              </div>
            )}
          </div>

          {/* Recording Area */}
          <div className="p-6 space-y-6">
            {/* Waveform Visualization */}
            <div className="h-32 bg-muted/20 rounded-lg border border-border/50 flex items-center justify-center overflow-hidden">
              {isRecording && !isPaused ? (
                <div className="flex items-center justify-center gap-1 h-full px-4">
                  {Array.from({ length: 60 }).map((_, i) => {
                    const height = isRecording
                      ? Math.random() * 100
                      : audioLevel * Math.random()
                    return (
                      <motion.div
                        key={i}
                        className="w-1 bg-brand-500 rounded-full"
                        animate={{
                          height: `${height}%`,
                        }}
                        transition={{
                          duration: 0.15,
                          ease: 'easeInOut',
                        }}
                        viewport={{ once: true }}
                      />
                    )
                  })}
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <Waves className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">
                    {isPaused
                      ? 'Recording Paused'
                      : recordingExists
                        ? 'Recording Complete'
                        : 'Ready to Record'}
                  </p>
                </div>
              )}
            </div>

            {/* Duration Display */}
            {(isRecording || recordingExists) && (
              <div className="flex items-center justify-center gap-2 text-2xl font-mono text-foreground">
                <Clock className="w-5 h-5" />
                {formatDuration(duration)}
              </div>
            )}

            {/* Audio Level Meter */}
            {isRecording && !isPaused && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Volume2 className="w-3 h-3" />
                    Input Level
                  </span>
                  <span>{Math.round(audioLevel)}%</span>
                </div>
                <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
                    animate={{
                      width: `${audioLevel}%`,
                    }}
                    transition={{
                      duration: 0.1,
                      ease: 'easeOut',
                    }}
                    viewport={{ once: true }}
                  />
                </div>
              </div>
            )}

            {/* Control Buttons */}
            <div className="flex items-center justify-center gap-3">
              {!isRecording && !recordingExists && (
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
                  {!isPaused ? (
                    <button
                      onClick={pauseRecording}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition-colors border border-amber-200 dark:border-amber-800"
                    >
                      <Pause className="w-4 h-4" />
                      Pause
                    </button>
                  ) : (
                    <button
                      onClick={resumeRecording}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20 transition-colors border border-green-200 dark:border-green-800"
                    >
                      <Play className="w-4 h-4" />
                      Resume
                    </button>
                  )}
                  <button
                    onClick={stopRecording}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-colors border border-red-200 dark:border-red-800"
                  >
                    <StopCircle className="w-4 h-4" />
                    Stop
                  </button>
                </>
              )}

              {recordingExists && (
                <>
                  <button
                    onClick={startRecording}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 hover:bg-brand-500/20 transition-colors border border-brand-200 dark:border-brand-800"
                  >
                    <Mic className="w-4 h-4" />
                    New Recording
                  </button>
                  <button
                    onClick={() => setRecordingExists(false)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20 transition-colors border border-green-200 dark:border-green-800"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Table of Contents
// ============================================================================

const tableOfContents = [
  { id: 'overview', title: 'Overview' },
  { id: 'installation', title: 'Installation' },
  { id: 'demo', title: 'Live Demo' },
  { id: 'basic-usage', title: 'Basic Usage' },
  {
    id: 'props',
    title: 'Props Reference',
    children: [
      { id: 'recording-props', title: 'Recording Settings' },
      { id: 'format-props', title: 'Format Options' },
      { id: 'processing-props', title: 'Audio Processing' },
      { id: 'callback-props', title: 'Callbacks' },
      { id: 'ui-props', title: 'UI Configuration' },
    ],
  },
  { id: 'formats', title: 'Supported Formats' },
  {
    id: 'examples',
    title: 'Examples',
    children: [
      { id: 'example-basic', title: 'Basic Recording' },
      { id: 'example-noise-cancel', title: 'With Noise Cancellation' },
      { id: 'example-formats', title: 'Format Conversion' },
    ],
  },
  { id: 'browser-support', title: 'Browser Support' },
  { id: 'typescript', title: 'TypeScript' },
  { id: 'accessibility', title: 'Accessibility' },
  { id: 'troubleshooting', title: 'Troubleshooting' },
  { id: 'related', title: 'Related' },
]

function TableOfContents() {
  const [activeId, setActiveId] = React.useState('')

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-100px 0px -66%' }
    )

    const headings = document.querySelectorAll('section[id], div[id]')
    headings.forEach((heading) => observer.observe(heading))

    return () => observer.disconnect()
  }, [])

  return (
    <nav
      className="sticky top-24 space-y-1 text-sm"
      aria-label="Table of contents"
    >
      <p className="font-semibold text-foreground mb-3">On this page</p>
      {tableOfContents.map((item) => (
        <div key={item.id}>
          <a
            href={`#${item.id}`}
            className={cn(
              'block py-1 px-2 rounded transition-colors',
              activeId === item.id
                ? 'text-brand-600 dark:text-brand-400 bg-brand-500/10'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {item.title}
          </a>
          {item.children && (
            <div className="ml-3 mt-1 space-y-1 border-l border-border/50 pl-2">
              {item.children.map((child) => (
                <a
                  key={child.id}
                  href={`#${child.id}`}
                  className={cn(
                    'block py-0.5 text-xs transition-colors',
                    activeId === child.id
                      ? 'text-brand-600 dark:text-brand-400'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {child.title}
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  )
}

// ============================================================================
// Props Data
// ============================================================================

const recordingProps: PropDefinition[] = [
  {
    name: 'maxDuration',
    type: 'number',
    default: '300',
    description:
      'Maximum recording duration in seconds. Recording auto-stops when reached.',
  },
  {
    name: 'minDuration',
    type: 'number',
    default: '1',
    description: 'Minimum recording duration in seconds before stop is allowed.',
  },
  {
    name: 'autoStart',
    type: 'boolean',
    default: 'false',
    description:
      'Automatically start recording when component mounts (requires user gesture).',
  },
  {
    name: 'pausable',
    type: 'boolean',
    default: 'true',
    description: 'Enable pause/resume functionality during recording.',
  },
  {
    name: 'countdownDuration',
    type: 'number',
    default: '0',
    description:
      'Show countdown timer (in seconds) before recording starts. 0 disables countdown.',
  },
]

const formatProps: PropDefinition[] = [
  {
    name: 'outputFormat',
    type: "'mp3' | 'wav' | 'ogg' | 'webm' | 'flac'",
    default: "'webm'",
    description:
      'Desired output format. Actual format depends on browser support.',
  },
  {
    name: 'mimeType',
    type: 'string',
    description:
      'Override MIME type for MediaRecorder. Auto-detected if not provided.',
  },
  {
    name: 'bitrate',
    type: 'number',
    default: '128000',
    description: 'Audio bitrate in bits per second (128kbps default).',
  },
  {
    name: 'sampleRate',
    type: 'number',
    description:
      'Audio sample rate in Hz. Defaults to device sample rate (typically 48000).',
  },
  {
    name: 'channels',
    type: '1 | 2',
    default: '1',
    description: 'Number of audio channels: 1 for mono, 2 for stereo.',
  },
]

const processingProps: PropDefinition[] = [
  {
    name: 'enableNoiseCancellation',
    type: 'boolean',
    default: 'false',
    description:
      'Enable Web Audio API noise cancellation. Reduces background noise.',
  },
  {
    name: 'enableEchoCancellation',
    type: 'boolean',
    default: 'false',
    description: 'Enable echo cancellation for clearer recordings.',
  },
  {
    name: 'enableAutoGainControl',
    type: 'boolean',
    default: 'false',
    description:
      'Automatically adjust input gain to maintain consistent volume.',
  },
  {
    name: 'noiseSuppression',
    type: 'boolean',
    default: 'false',
    description:
      'Enable noise suppression using MediaStream constraints.',
  },
  {
    name: 'voiceActivityDetection',
    type: 'boolean',
    default: 'false',
    description:
      'Automatically pause recording during silence to save space.',
  },
  {
    name: 'silenceThreshold',
    type: 'number',
    default: '0.01',
    description:
      'Amplitude threshold for silence detection (0-1). Used with voiceActivityDetection.',
  },
]

const callbackProps: PropDefinition[] = [
  {
    name: 'onStart',
    type: '() => void',
    description: 'Callback when recording starts.',
  },
  {
    name: 'onStop',
    type: '(audioBlob: Blob, audioUrl: string) => void',
    description:
      'Callback when recording stops. Receives the audio Blob and object URL.',
  },
  {
    name: 'onPause',
    type: '() => void',
    description: 'Callback when recording is paused.',
  },
  {
    name: 'onResume',
    type: '() => void',
    description: 'Callback when recording is resumed.',
  },
  {
    name: 'onDataAvailable',
    type: '(data: Blob) => void',
    description:
      'Callback when audio data chunks become available during recording.',
  },
  {
    name: 'onError',
    type: '(error: Error) => void',
    description:
      'Callback when an error occurs (permission denied, unsupported format, etc.).',
  },
  {
    name: 'onDurationChange',
    type: '(duration: number) => void',
    description: 'Callback fired every second with current duration.',
  },
  {
    name: 'onAmplitudeChange',
    type: '(amplitude: number) => void',
    description:
      'Callback with current audio amplitude (0-1) for waveform visualization.',
  },
]

const uiProps: PropDefinition[] = [
  {
    name: 'showWaveform',
    type: 'boolean',
    default: 'true',
    description: 'Display real-time waveform visualization.',
  },
  {
    name: 'showDuration',
    type: 'boolean',
    default: 'true',
    description: 'Display recording duration timer.',
  },
  {
    name: 'showControls',
    type: 'boolean',
    default: 'true',
    description: 'Show built-in recording controls (start, stop, pause).',
  },
  {
    name: 'showAmplitudeMeter',
    type: 'boolean',
    default: 'true',
    description: 'Display audio input level meter.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes for the container.',
  },
  {
    name: 'theme',
    type: "'light' | 'dark' | 'auto'",
    default: "'auto'",
    description: 'Color theme for the recorder UI.',
  },
]

// ============================================================================
// Format Support Data
// ============================================================================

const supportedFormats: FormatDefinition[] = [
  {
    format: 'webm',
    codec: 'Opus',
    quality: 'High (64-512 kbps)',
    support: 'Chrome, Firefox, Edge (95%)',
  },
  {
    format: 'mp3',
    codec: 'MPEG-1 Layer 3',
    quality: 'Medium-High (128-320 kbps)',
    support: 'Universal (requires conversion)',
  },
  {
    format: 'wav',
    codec: 'PCM',
    quality: 'Lossless',
    support: 'Chrome, Firefox, Safari (90%)',
  },
  {
    format: 'ogg',
    codec: 'Vorbis/Opus',
    quality: 'High (64-500 kbps)',
    support: 'Chrome, Firefox (85%)',
  },
  {
    format: 'flac',
    codec: 'FLAC',
    quality: 'Lossless',
    support: 'Limited (requires conversion)',
  },
]

// ============================================================================
// Code Examples
// ============================================================================

const importCode = `import { AudioRecorder } from '@clarity-chat/react'
import type { AudioRecorderProps } from '@clarity-chat/react'`

const basicUsageCode = `import { AudioRecorder } from '@clarity-chat/react'

function VoiceMessageRecorder() {
  const handleStop = (audioBlob: Blob, audioUrl: string) => {
    console.log('Recording complete:', audioBlob.size, 'bytes')
    // Send audioBlob to server or use audioUrl to play
  }

  const handleError = (error: Error) => {
    console.error('Recording error:', error.message)
  }

  return (
    <AudioRecorder
      maxDuration={60}
      outputFormat="mp3"
      onStop={handleStop}
      onError={handleError}
      showWaveform={true}
      showDuration={true}
    />
  )
}`

const noiseCancellationCode = `import { AudioRecorder } from '@clarity-chat/react'

function ProfessionalRecorder() {
  const handleStop = async (audioBlob: Blob, audioUrl: string) => {
    // Upload to server
    const formData = new FormData()
    formData.append('audio', audioBlob, 'recording.webm')

    const response = await fetch('/api/upload-audio', {
      method: 'POST',
      body: formData,
    })

    const result = await response.json()
    console.log('Uploaded:', result.url)
  }

  return (
    <AudioRecorder
      outputFormat="webm"
      bitrate={256000}
      channels={1}
      enableNoiseCancellation={true}
      enableEchoCancellation={true}
      enableAutoGainControl={true}
      noiseSuppression={true}
      voiceActivityDetection={true}
      silenceThreshold={0.02}
      onStop={handleStop}
      onError={(error) => alert(error.message)}
      showWaveform={true}
      showAmplitudeMeter={true}
    />
  )
}`

const formatConversionCode = `import { AudioRecorder } from '@clarity-chat/react'

function MultiFormatRecorder() {
  const [outputFormat, setOutputFormat] = React.useState<'mp3' | 'wav' | 'ogg'>('mp3')

  const handleStop = (audioBlob: Blob, audioUrl: string) => {
    // Different handling based on format
    switch (outputFormat) {
      case 'mp3':
        // MP3 is compressed, good for storage
        uploadToServer(audioBlob, 'audio/mpeg')
        break
      case 'wav':
        // WAV is lossless, good for processing
        processAudioLocally(audioBlob)
        break
      case 'ogg':
        // OGG is efficient, good for streaming
        streamToClient(audioUrl)
        break
    }
  }

  return (
    <div className="space-y-4">
      {/* Format Selector */}
      <div className="flex gap-2">
        {(['mp3', 'wav', 'ogg'] as const).map((format) => (
          <button
            key={format}
            onClick={() => setOutputFormat(format)}
            className={\`px-3 py-1 rounded \${
              outputFormat === format ? 'bg-brand-500 text-white' : 'bg-muted'
            }\`}
          >
            {format.toUpperCase()}
          </button>
        ))}
      </div>

      <AudioRecorder
        outputFormat={outputFormat}
        bitrate={outputFormat === 'wav' ? undefined : 192000}
        sampleRate={48000}
        channels={outputFormat === 'wav' ? 2 : 1}
        onStop={handleStop}
        showWaveform={true}
      />
    </div>
  )
}`

const typescriptCode = `// AudioRecorder props
interface AudioRecorderProps {
  // Recording Settings
  maxDuration?: number // seconds, default: 300
  minDuration?: number // seconds, default: 1
  autoStart?: boolean // default: false
  pausable?: boolean // default: true
  countdownDuration?: number // seconds, default: 0

  // Format Options
  outputFormat?: 'mp3' | 'wav' | 'ogg' | 'webm' | 'flac' // default: 'webm'
  mimeType?: string
  bitrate?: number // bits/second, default: 128000
  sampleRate?: number // Hz
  channels?: 1 | 2 // default: 1 (mono)

  // Audio Processing
  enableNoiseCancellation?: boolean // default: false
  enableEchoCancellation?: boolean // default: false
  enableAutoGainControl?: boolean // default: false
  noiseSuppression?: boolean // default: false
  voiceActivityDetection?: boolean // default: false
  silenceThreshold?: number // 0-1, default: 0.01

  // Callbacks
  onStart?: () => void
  onStop?: (audioBlob: Blob, audioUrl: string) => void
  onPause?: () => void
  onResume?: () => void
  onDataAvailable?: (data: Blob) => void
  onError?: (error: Error) => void
  onDurationChange?: (duration: number) => void
  onAmplitudeChange?: (amplitude: number) => void

  // UI Configuration
  showWaveform?: boolean // default: true
  showDuration?: boolean // default: true
  showControls?: boolean // default: true
  showAmplitudeMeter?: boolean // default: true
  className?: string
  theme?: 'light' | 'dark' | 'auto' // default: 'auto'
}

// Recording state (returned by useAudioRecorder hook)
interface AudioRecorderState {
  isRecording: boolean
  isPaused: boolean
  duration: number
  amplitude: number
  audioBlob: Blob | null
  audioUrl: string | null
  error: Error | null
  startRecording: () => Promise<void>
  stopRecording: () => void
  pauseRecording: () => void
  resumeRecording: () => void
  resetRecording: () => void
}

// Example usage with hook
import { useAudioRecorder } from '@clarity-chat/react'

function CustomRecorder() {
  const {
    isRecording,
    isPaused,
    duration,
    amplitude,
    audioBlob,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
  } = useAudioRecorder({
    maxDuration: 120,
    outputFormat: 'mp3',
    enableNoiseCancellation: true,
  })

  return (
    <div>
      <p>Duration: {duration}s</p>
      <p>Amplitude: {Math.round(amplitude * 100)}%</p>
      {!isRecording && <button onClick={startRecording}>Record</button>}
      {isRecording && !isPaused && <button onClick={pauseRecording}>Pause</button>}
      {isRecording && isPaused && <button onClick={resumeRecording}>Resume</button>}
      {isRecording && <button onClick={stopRecording}>Stop</button>}
    </div>
  )
}`

// ============================================================================
// Main Page Component
// ============================================================================

export default function AudioRecorderPage() {
  return (
    <div className="min-h-screen">
      <Breadcrumbs />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8 py-8">
          {/* Main content */}
          <main className="flex-1 min-w-0 space-y-12">
            {/* Page Header */}
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: durations.moderate,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">
                  <Mic className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                      Beta
                    </span>
                    <span className="text-xs text-muted-foreground">
                      @clarity-chat/react
                    </span>
                  </div>
                </div>
              </div>

              <h1 className="text-4xl font-bold text-foreground mb-4">
                AudioRecorder
              </h1>

              <p className="text-lg text-muted-foreground max-w-3xl">
                Browser-based audio recording with waveform visualization, noise
                cancellation, and format conversion. Built on Web Audio API with
                95% browser compatibility and professional-grade audio
                processing.
              </p>
            </motion.header>

            {/* Feature highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: durations.slow,
                delay: 0.1,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {[
                {
                  icon: Waves,
                  label: 'Real-time Waveform',
                  desc: 'Visual audio feedback',
                },
                {
                  icon: Wand2,
                  label: 'Noise Cancellation',
                  desc: 'Web Audio API processing',
                },
                {
                  icon: FileAudio,
                  label: 'Multiple Formats',
                  desc: 'MP3, WAV, OGG export',
                },
                {
                  icon: Globe,
                  label: 'Browser Compatibility',
                  desc: '95% browser support',
                },
              ].map(({ icon: Icon, label, desc }) => (
                <div
                  key={label}
                  className="p-4 rounded-lg bg-muted/30 border border-border/50"
                >
                  <Icon
                    className="w-5 h-5 text-brand-500 mb-2"
                    aria-hidden="true"
                  />
                  <p className="font-medium text-foreground text-sm">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              ))}
            </motion.div>

            {/* Overview Section */}
            <Section id="overview" title="Overview">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p>
                  <code>AudioRecorder</code> is a production-ready audio
                  recording component that leverages the Web Audio API and
                  MediaRecorder API for high-quality browser-based recording.
                  Perfect for voice messages, podcasts, voice notes, and any
                  application requiring audio capture.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Key Features
                </h4>
                <ul className="space-y-2">
                  <li>
                    <strong>Real-time Waveform:</strong> Live audio
                    visualization with customizable rendering
                  </li>
                  <li>
                    <strong>Noise Processing:</strong> Built-in noise
                    cancellation, echo cancellation, and auto-gain control
                  </li>
                  <li>
                    <strong>Format Flexibility:</strong> Export to MP3, WAV,
                    OGG, WebM, or FLAC with configurable bitrate
                  </li>
                  <li>
                    <strong>Voice Activity Detection:</strong> Automatically
                    pause during silence to optimize file size
                  </li>
                  <li>
                    <strong>Pause/Resume:</strong> Full control over recording
                    sessions with pause and resume
                  </li>
                  <li>
                    <strong>Browser Native:</strong> No external dependencies,
                    works entirely in the browser
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">Use Cases</h4>
                <ul className="space-y-2">
                  <li>Voice messages in chat applications</li>
                  <li>Audio feedback and reviews</li>
                  <li>Podcast recording and editing</li>
                  <li>Voice notes and memos</li>
                  <li>Language learning pronunciation practice</li>
                  <li>Customer support voice tickets</li>
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
                Try the AudioRecorder component. Start recording to see the
                waveform visualization, audio level meter, and recording
                controls in action.
              </p>

              <LiveDemo />
            </Section>

            {/* Basic Usage Section */}
            <Section id="basic-usage" title="Basic Usage">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  AudioRecorder provides a simple API for capturing audio in
                  your application:
                </p>

                <CodeBlock
                  code={basicUsageCode}
                  language="tsx"
                  filename="VoiceMessageRecorder.tsx"
                />
              </div>
            </Section>

            {/* Props API Section */}
            <Section id="props" title="Props Reference">
              <SubSection id="recording-props" title="Recording Settings">
                <p className="text-sm text-muted-foreground mb-4">
                  Control recording behavior and duration limits:
                </p>
                <PropsTable props={recordingProps} />
              </SubSection>

              <SubSection id="format-props" title="Format Options">
                <p className="text-sm text-muted-foreground mb-4">
                  Configure output format and audio quality:
                </p>
                <PropsTable props={formatProps} />
              </SubSection>

              <SubSection id="processing-props" title="Audio Processing">
                <p className="text-sm text-muted-foreground mb-4">
                  Enable advanced audio processing features:
                </p>
                <PropsTable props={processingProps} />
              </SubSection>

              <SubSection id="callback-props" title="Callbacks">
                <p className="text-sm text-muted-foreground mb-4">
                  Handle recording events:
                </p>
                <PropsTable props={callbackProps} />
              </SubSection>

              <SubSection id="ui-props" title="UI Configuration">
                <p className="text-sm text-muted-foreground mb-4">
                  Customize the recorder interface:
                </p>
                <PropsTable props={uiProps} />
              </SubSection>
            </Section>

            {/* Supported Formats Section */}
            <Section id="formats" title="Supported Formats">
              <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
                <p>
                  AudioRecorder supports multiple audio formats with varying
                  levels of browser compatibility. The component automatically
                  detects supported formats and falls back to WebM if the
                  requested format is unavailable.
                </p>
              </div>

              <FormatTable formats={supportedFormats} />

              <div className="mt-6 p-4 rounded-lg bg-amber-500/10 border border-amber-200 dark:border-amber-800">
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  Format Compatibility Note
                </h4>
                <p className="text-sm text-muted-foreground">
                  MP3 and FLAC formats require additional processing and may not
                  be natively supported by all browsers. The component will
                  automatically convert from WebM/WAV when these formats are
                  requested. This conversion happens client-side and may add
                  slight processing time after recording stops.
                </p>
              </div>
            </Section>

            {/* Examples Section */}
            <Section id="examples" title="Examples">
              <SubSection id="example-basic" title="Basic Recording">
                <p className="text-muted-foreground mb-4">
                  Simple voice message recorder with MP3 output:
                </p>
                <CodeBlock
                  code={basicUsageCode}
                  language="tsx"
                  filename="BasicRecorder.tsx"
                />
              </SubSection>

              <SubSection
                id="example-noise-cancel"
                title="With Noise Cancellation"
              >
                <p className="text-muted-foreground mb-4">
                  Professional-grade recording with all audio processing
                  features enabled:
                </p>
                <CodeBlock
                  code={noiseCancellationCode}
                  language="tsx"
                  filename="ProfessionalRecorder.tsx"
                />
              </SubSection>

              <SubSection id="example-formats" title="Format Conversion">
                <p className="text-muted-foreground mb-4">
                  Dynamic format selection with different use cases:
                </p>
                <CodeBlock
                  code={formatConversionCode}
                  language="tsx"
                  filename="MultiFormatRecorder.tsx"
                />
              </SubSection>
            </Section>

            {/* Browser Support Section */}
            <Section id="browser-support" title="Browser Support">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <h4 className="text-lg font-semibold mb-3">
                  MediaRecorder API Support
                </h4>
                <p className="mb-4">
                  AudioRecorder uses the MediaRecorder API, which is supported
                  in:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-6">
                  {[
                    { browser: 'Chrome', version: '47+', support: '✓ Full' },
                    { browser: 'Firefox', version: '25+', support: '✓ Full' },
                    { browser: 'Safari', version: '14+', support: '✓ Full' },
                    { browser: 'Edge', version: '79+', support: '✓ Full' },
                    {
                      browser: 'Opera',
                      version: '36+',
                      support: '✓ Full',
                    },
                    {
                      browser: 'Mobile Safari',
                      version: '14+',
                      support: '✓ Full',
                    },
                    {
                      browser: 'Chrome Android',
                      version: '53+',
                      support: '✓ Full',
                    },
                    {
                      browser: 'Firefox Android',
                      version: '25+',
                      support: '✓ Full',
                    },
                  ].map(({ browser, version, support }) => (
                    <div
                      key={browser}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50"
                    >
                      <div>
                        <p className="font-medium text-foreground">{browser}</p>
                        <p className="text-xs text-muted-foreground">
                          {version}
                        </p>
                      </div>
                      <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                        {support}
                      </span>
                    </div>
                  ))}
                </div>

                <h4 className="text-lg font-semibold mb-3">
                  Feature Detection
                </h4>
                <p>
                  The component includes built-in feature detection and will
                  show an error message if the MediaRecorder API is not
                  available. You can also check support programmatically:
                </p>
              </div>

              <CodeBlock
                code={`// Check if recording is supported
const isSupported =
  typeof MediaRecorder !== 'undefined' &&
  navigator.mediaDevices &&
  navigator.mediaDevices.getUserMedia

if (isSupported) {
  // Show AudioRecorder
} else {
  // Show fallback UI
}`}
                language="tsx"
                filename="feature-detection.ts"
              />
            </Section>

            {/* TypeScript Section */}
            <Section id="typescript" title="TypeScript">
              <p className="text-muted-foreground mb-4">
                Full type definitions with hook usage example:
              </p>
              <CodeBlock
                code={typescriptCode}
                language="tsx"
                filename="types.ts"
                showLineNumbers
              />
            </Section>

            {/* Accessibility Section */}
            <Section id="accessibility" title="Accessibility">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <h4 className="text-lg font-semibold mt-6 mb-3 flex items-center gap-2">
                  <Keyboard className="w-5 h-5" aria-hidden="true" />
                  Keyboard Navigation
                </h4>
                <ul className="space-y-2">
                  <li>
                    <kbd className="px-2 py-1 rounded bg-muted text-xs">
                      Space
                    </kbd>{' '}
                    - Start/Stop recording
                  </li>
                  <li>
                    <kbd className="px-2 py-1 rounded bg-muted text-xs">P</kbd>{' '}
                    - Pause/Resume recording
                  </li>
                  <li>
                    <kbd className="px-2 py-1 rounded bg-muted text-xs">
                      Esc
                    </kbd>{' '}
                    - Cancel recording
                  </li>
                  <li>
                    All buttons are keyboard accessible with proper focus
                    indicators
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Screen Reader Support
                </h4>
                <ul className="space-y-2">
                  <li>
                    Recording state announced via <code>aria-live</code> regions
                  </li>
                  <li>Duration updates announced every 10 seconds</li>
                  <li>
                    Error messages announced with <code>role="alert"</code>
                  </li>
                  <li>All controls have descriptive ARIA labels</li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Visual Alternatives
                </h4>
                <ul className="space-y-2">
                  <li>
                    Waveform visualization is decorative and not required for
                    operation
                  </li>
                  <li>
                    Duration timer provides text alternative to visual feedback
                  </li>
                  <li>
                    Color is not the only means of conveying recording state
                  </li>
                  <li>All icons include text labels or ARIA labels</li>
                </ul>
              </div>
            </Section>

            {/* Troubleshooting Section */}
            <Section id="troubleshooting" title="Troubleshooting">
              <div className="space-y-6">
                <div className="p-4 rounded-lg border border-border/50 bg-card">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Permission denied error
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Check browser microphone permissions</li>
                        <li>Ensure site is served over HTTPS (required)</li>
                        <li>
                          Request permission with user gesture (button click)
                        </li>
                        <li>
                          Some browsers block permission on first page load
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
                        No audio in recording
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Check system microphone settings</li>
                        <li>Verify correct input device is selected</li>
                        <li>
                          Test microphone in system settings or other apps
                        </li>
                        <li>Try restarting browser</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-card">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Unsupported format error
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>
                          Not all browsers support all formats natively
                        </li>
                        <li>
                          Component will auto-fallback to WebM if format
                          unsupported
                        </li>
                        <li>Use server-side conversion for guaranteed formats</li>
                        <li>
                          Check browser compatibility table above
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-card">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Poor audio quality
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>
                          Increase <code>bitrate</code> (128000 → 256000)
                        </li>
                        <li>
                          Use higher <code>sampleRate</code> (48000Hz+)
                        </li>
                        <li>
                          Enable <code>noiseSuppression</code> and{' '}
                          <code>echoCancellation</code>
                        </li>
                        <li>
                          Use stereo (<code>channels: 2</code>) for music
                        </li>
                        <li>Consider WAV format for lossless quality</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </Section>

            {/* Related APIs Section */}
            <Section id="related" title="Related">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    name: 'VoiceInput',
                    type: 'component' as const,
                    description:
                      'Voice transcription with Web Speech API integration',
                    href: '/reference/components/voice-input',
                  },
                  {
                    name: 'AudioPlayer',
                    type: 'component' as const,
                    description: 'Audio playback with waveform and controls',
                    href: '/reference/components/audio-player',
                  },
                  {
                    name: 'useMediaRecorder',
                    type: 'hook' as const,
                    description:
                      'Low-level hook for custom audio recording implementations',
                    href: '/reference/hooks/use-media-recorder',
                  },
                  {
                    name: 'FileUpload',
                    type: 'component' as const,
                    description: 'File upload with audio format validation',
                    href: '/reference/components/file-upload',
                  },
                ].map((api) => (
                  <Link
                    key={api.name}
                    href={api.href}
                    className={cn(
                      'group p-4 rounded-lg border border-border/50',
                      'hover:border-brand-500/30 hover:shadow-sm transition-all',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                        {api.name}
                      </span>
                      <span
                        className={cn(
                          'text-xs px-2 py-0.5 rounded-full',
                          api.type === 'hook'
                            ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                            : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        )}
                      >
                        {api.type}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {api.description}
                    </p>
                  </Link>
                ))}
              </div>
            </Section>

            {/* Footer Navigation */}
            <div className="border-t border-border/50 pt-8 mt-12">
              <div className="grid gap-4 sm:grid-cols-2">
                <Link
                  href="/reference/components/voice-input"
                  className={cn(
                    'group flex items-center gap-3 p-4 rounded-lg border border-border/50',
                    'hover:border-brand-500/30 hover:shadow-sm transition-all',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'
                  )}
                >
                  <ChevronRight className="w-5 h-5 text-muted-foreground rotate-180 group-hover:text-brand-500 transition-colors" />
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Previous
                    </div>
                    <div className="font-medium text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      VoiceInput
                    </div>
                  </div>
                </Link>
                <Link
                  href="/reference/components/audio-player"
                  className={cn(
                    'group flex items-center gap-3 p-4 rounded-lg border border-border/50',
                    'hover:border-brand-500/30 hover:shadow-sm transition-all',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                    'text-right'
                  )}
                >
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground mb-1">
                      Next
                    </div>
                    <div className="font-medium text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      AudioPlayer
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-brand-500 transition-colors" />
                </Link>
              </div>
            </div>
          </main>

          {/* Table of Contents Sidebar */}
          <aside className="hidden xl:block w-64 shrink-0">
            <TableOfContents />
          </aside>
        </div>
      </div>
    </div>
  )
}
