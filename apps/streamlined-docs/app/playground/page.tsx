'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Command,
  Mic,
  Palette,
  Code2,
  Sparkles,
  Play,
  Info,
  CheckCircle2,
  AlertCircle,
  Terminal,
  Zap,
  MessageSquare,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { ScrollReveal, KineticText } from '@/components/Enhanced/ScrollReveal'
import { durations } from '@/lib/animations'
import { CodeEditorDemo } from './components/CodeEditorDemo'

export default function PlaygroundPage() {
  const [activeDemo, setActiveDemo] = useState<string>('code-editor')

  const demos = [
    {
      id: 'code-editor',
      name: 'Live Code Editor',
      icon: <Code2 className="w-5 h-5" />,
      description: 'Monaco editor with TypeScript',
    },
    {
      id: 'command-palette',
      name: 'Command Palette',
      icon: <Command className="w-5 h-5" />,
      description: 'Keyboard-first navigation',
    },
    {
      id: 'audio-recorder',
      name: 'Audio Recorder',
      icon: <Mic className="w-5 h-5" />,
      description: 'Record and playback audio',
    },
    {
      id: 'oklch-picker',
      name: 'OKLCH Color Picker',
      icon: <Palette className="w-5 h-5" />,
      description: 'Modern color space',
    },
    {
      id: 'interactive-demo',
      name: 'Interactive Examples',
      icon: <Sparkles className="w-5 h-5" />,
      description: 'Live component demos',
    },
  ]

  return (
    <div className="container-docs py-8 sm:py-12">
      {/* Hero */}
      <ScrollReveal direction="up" delay={0.1}>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800/50 rounded-full mb-6">
            <Play className="w-4 h-4 text-brand-500" />
            <span className="text-sm font-medium text-brand-600 dark:text-brand-400">
              Interactive Playground
            </span>
          </div>

          <KineticText className="text-4xl sm:text-5xl font-bold mb-4">
            Try Components Live
          </KineticText>

          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Experience real component functionality. Click, type, record, and interact with production-ready examples.
          </p>
        </div>
      </ScrollReveal>

      {/* Demo Selector */}
      <ScrollReveal direction="up" delay={0.2}>
        <div className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {demos.map((demo) => (
              <button
                key={demo.id}
                onClick={() => setActiveDemo(demo.id)}
                className={`
                  group relative p-4 rounded-xl border transition-all text-left
                  ${
                    activeDemo === demo.id
                      ? 'bg-brand-50 dark:bg-brand-950/50 border-brand-300 dark:border-brand-700 shadow-lg shadow-brand-500/10'
                      : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-brand-200 dark:hover:border-brand-800'
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`
                    p-2 rounded-lg transition-colors
                    ${
                      activeDemo === demo.id
                        ? 'bg-brand-100 dark:bg-brand-900/50 text-brand-600 dark:text-brand-400'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 group-hover:bg-brand-50 dark:group-hover:bg-brand-950/30 group-hover:text-brand-500'
                    }
                  `}
                  >
                    {demo.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-1 text-sm">{demo.name}</h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">{demo.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Demo Content */}
      <ScrollReveal direction="up" delay={0.3}>
        <div className="relative min-h-[600px]">
          <AnimatePresence mode="wait">
            {activeDemo === 'code-editor' && <CodeEditorDemo key="code-editor" />}
            {activeDemo === 'command-palette' && <CommandPaletteDemo key="command-palette" />}
            {activeDemo === 'audio-recorder' && <AudioRecorderDemo key="audio-recorder" />}
            {activeDemo === 'oklch-picker' && <OKLCHPickerDemo key="oklch-picker" />}
            {activeDemo === 'interactive-demo' && <InteractiveDemo key="interactive-demo" />}
          </AnimatePresence>
        </div>
      </ScrollReveal>

      {/* Info Banner */}
      <ScrollReveal direction="up" delay={0.4}>
        <div className="mt-12 p-6 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold mb-2 text-blue-600 dark:text-blue-400">Need Help?</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                These demos showcase production-ready components. All code is available in our documentation and can be copied directly into your project.
              </p>
              <a
                href="/get-started"
                className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                View Documentation
                <Sparkles className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  )
}

// Command Palette Demo
function CommandPaletteDemo() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)

  const commands = [
    { id: '1', icon: <Terminal className="w-4 h-4" />, label: 'Open Terminal', shortcut: '⌘T' },
    { id: '2', icon: <Code2 className="w-4 h-4" />, label: 'View Source', shortcut: '⌘U' },
    { id: '3', icon: <Sparkles className="w-4 h-4" />, label: 'New Component', shortcut: '⌘N' },
    { id: '4', icon: <Zap className="w-4 h-4" />, label: 'Run Command', shortcut: '⌘R' },
    { id: '5', icon: <MessageSquare className="w-4 h-4" />, label: 'Send Message', shortcut: '⌘Enter' },
  ]

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: durations.moderate }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Command Palette</h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            Press <kbd className="px-2 py-1 text-xs font-mono bg-neutral-100 dark:bg-neutral-800 rounded border">⌘K</kbd> or click the button to open
          </p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-brand-500 text-white rounded-lg font-medium hover:bg-brand-600 transition-colors focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          Open Palette
        </button>
      </div>

      {/* Demo Preview */}
      <div className="p-8 rounded-xl bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 border border-neutral-200 dark:border-neutral-700 min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <Command className="w-16 h-16 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" />
          <p className="text-neutral-600 dark:text-neutral-400">Click "Open Palette" to see it in action</p>
        </div>
      </div>

      {/* Command Palette Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Palette */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="fixed top-[20vh] left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 px-4"
            >
              <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
                {/* Search Input */}
                <div className="flex items-center gap-3 p-4 border-b border-neutral-200 dark:border-neutral-700">
                  <Command className="w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Type a command or search..."
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value)
                      setSelectedIndex(0)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') setIsOpen(false)
                      if (e.key === 'ArrowDown') {
                        e.preventDefault()
                        setSelectedIndex((prev) => Math.min(prev + 1, filteredCommands.length - 1))
                      }
                      if (e.key === 'ArrowUp') {
                        e.preventDefault()
                        setSelectedIndex((prev) => Math.max(prev - 1, 0))
                      }
                      if (e.key === 'Enter' && filteredCommands.length > 0) {
                        setIsOpen(false)
                        setQuery('')
                      }
                    }}
                    autoFocus
                    className="flex-1 bg-transparent border-none outline-none text-neutral-900 dark:text-white placeholder:text-neutral-400"
                  />
                </div>

                {/* Commands List */}
                <div className="max-h-[400px] overflow-y-auto p-2">
                  {filteredCommands.length === 0 ? (
                    <div className="p-8 text-center text-neutral-500">No commands found</div>
                  ) : (
                    filteredCommands.map((cmd, index) => (
                      <button
                        key={cmd.id}
                        onClick={() => {
                          setIsOpen(false)
                          setQuery('')
                        }}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`
                          w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left
                          ${
                            index === selectedIndex
                              ? 'bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400'
                              : 'hover:bg-neutral-50 dark:hover:bg-neutral-800'
                          }
                        `}
                      >
                        <div className="p-2 rounded-md bg-neutral-100 dark:bg-neutral-800">{cmd.icon}</div>
                        <span className="flex-1 font-medium">{cmd.label}</span>
                        <kbd className="px-2 py-1 text-xs font-mono bg-neutral-100 dark:bg-neutral-800 rounded border">
                          {cmd.shortcut}
                        </kbd>
                      </button>
                    ))
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center gap-4 p-3 bg-neutral-50 dark:bg-neutral-800/50 border-t border-neutral-200 dark:border-neutral-700 text-xs text-neutral-500">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white dark:bg-neutral-900 rounded border">↑↓</kbd>
                    Navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white dark:bg-neutral-900 rounded border">Enter</kbd>
                    Select
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white dark:bg-neutral-900 rounded border">Esc</kbd>
                    Close
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Audio Recorder Demo
function AudioRecorderDemo() {
  const [isRecording, setIsRecording] = useState(false)
  const [hasRecording, setHasRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [status, setStatus] = useState<'idle' | 'recording' | 'recorded' | 'playing'>('idle')

  const startRecording = () => {
    setIsRecording(true)
    setStatus('recording')
    setDuration(0)
    const interval = setInterval(() => {
      setDuration((prev) => prev + 1)
    }, 1000)

    // Auto-stop after 5 seconds for demo
    setTimeout(() => {
      clearInterval(interval)
      stopRecording()
    }, 5000)
  }

  const stopRecording = () => {
    setIsRecording(false)
    setHasRecording(true)
    setStatus('recorded')
  }

  const playRecording = () => {
    setIsPlaying(true)
    setStatus('playing')
    // Simulate playback
    setTimeout(() => {
      setIsPlaying(false)
      setStatus('recorded')
    }, duration * 1000)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: durations.moderate }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold mb-2">Audio Recorder</h2>
        <p className="text-neutral-600 dark:text-neutral-400">Record and playback audio messages</p>
      </div>

      <div className="p-8 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border border-purple-200 dark:border-purple-800/30">
        <div className="max-w-md mx-auto space-y-6">
          {/* Waveform Visualization */}
          <div className="h-32 flex items-center justify-center gap-1">
            {Array.from({ length: 32 }).map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  height: isRecording ? [8, Math.random() * 100 + 20, 8] : 8,
                }}
                transition={{
                  duration: 0.3,
                  repeat: isRecording ? Infinity : 0,
                  delay: i * 0.05,
                }}
                className={`w-1 rounded-full ${
                  isRecording ? 'bg-red-500' : isPlaying ? 'bg-green-500' : 'bg-neutral-300 dark:bg-neutral-700'
                }`}
              />
            ))}
          </div>

          {/* Status */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              {status === 'recording' && (
                <>
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-red-600 dark:text-red-400 font-medium">Recording...</span>
                </>
              )}
              {status === 'recorded' && (
                <>
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-green-600 dark:text-green-400 font-medium">Recording saved</span>
                </>
              )}
              {status === 'playing' && (
                <>
                  <Volume2 className="w-4 h-4 text-blue-500" />
                  <span className="text-blue-600 dark:text-blue-400 font-medium">Playing...</span>
                </>
              )}
              {status === 'idle' && <span className="text-neutral-500">Ready to record</span>}
            </div>
            <div className="text-2xl font-mono font-bold">{formatTime(duration)}</div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3">
            {!isRecording && !hasRecording && (
              <button
                onClick={startRecording}
                className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 transition-colors focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                <Mic className="w-5 h-5" />
                Start Recording
              </button>
            )}

            {isRecording && (
              <button
                onClick={stopRecording}
                className="flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-full font-medium hover:bg-neutral-800 transition-colors focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                Stop
              </button>
            )}

            {hasRecording && !isPlaying && (
              <>
                <button
                  onClick={playRecording}
                  className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full font-medium hover:bg-green-600 transition-colors focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  <Volume2 className="w-5 h-5" />
                  Play
                </button>
                <button
                  onClick={() => {
                    setHasRecording(false)
                    setDuration(0)
                    setStatus('idle')
                  }}
                  className="px-4 py-3 bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white rounded-full font-medium hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  Reset
                </button>
              </>
            )}

            {isPlaying && (
              <button
                onClick={() => {
                  setIsPlaying(false)
                  setStatus('recorded')
                }}
                className="flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-full font-medium hover:bg-neutral-800 transition-colors focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                <VolumeX className="w-5 h-5" />
                Stop
              </button>
            )}
          </div>

          {/* Info */}
          <div className="text-center text-xs text-neutral-500">
            {status === 'idle' && 'Click the button to start recording'}
            {status === 'recording' && 'Recording will auto-stop after 5 seconds'}
            {status === 'recorded' && 'Click play to hear your recording'}
            {status === 'playing' && 'Playing back your recording'}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// OKLCH Color Picker Demo
function OKLCHPickerDemo() {
  const [lightness, setLightness] = useState(70)
  const [chroma, setChroma] = useState(0.15)
  const [hue, setHue] = useState(250)
  const [copied, setCopied] = useState(false)

  const oklchColor = `oklch(${lightness}% ${chroma} ${hue})`

  const copyColor = async () => {
    await navigator.clipboard.writeText(oklchColor)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: durations.moderate }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold mb-2">OKLCH Color Picker</h2>
        <p className="text-neutral-600 dark:text-neutral-400">
          Modern perceptually uniform color space for better gradients and accessibility
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Color Preview */}
        <div className="space-y-4">
          <div
            className="h-64 rounded-xl border-4 border-neutral-200 dark:border-neutral-700 shadow-lg transition-all duration-300"
            style={{ backgroundColor: oklchColor }}
          />

          <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">OKLCH Value</span>
              <button
                onClick={copyColor}
                className="px-3 py-1.5 text-xs font-medium bg-brand-500 text-white rounded-md hover:bg-brand-600 transition-colors focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <code className="block p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg font-mono text-sm break-all">
              {oklchColor}
            </code>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-6">
          {/* Lightness */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Lightness</label>
              <span className="text-sm font-mono text-neutral-600 dark:text-neutral-400">{lightness}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={lightness}
              onChange={(e) => setLightness(Number(e.target.value))}
              className="w-full h-2 bg-gradient-to-r from-black to-white rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-brand-500 [&::-webkit-slider-thumb]:shadow-lg"
            />
          </div>

          {/* Chroma */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Chroma (Saturation)</label>
              <span className="text-sm font-mono text-neutral-600 dark:text-neutral-400">{chroma.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="0.4"
              step="0.01"
              value={chroma}
              onChange={(e) => setChroma(Number(e.target.value))}
              className="w-full h-2 bg-gradient-to-r from-gray-300 to-red-500 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-brand-500 [&::-webkit-slider-thumb]:shadow-lg"
            />
          </div>

          {/* Hue */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Hue</label>
              <span className="text-sm font-mono text-neutral-600 dark:text-neutral-400">{hue}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={hue}
              onChange={(e) => setHue(Number(e.target.value))}
              className="w-full h-2 bg-gradient-to-r from-red-500 via-green-500 to-blue-500 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-brand-500 [&::-webkit-slider-thumb]:shadow-lg"
            />
          </div>

          {/* Presets */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Quick Presets</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { name: 'Brand', l: 55, c: 0.2, h: 250 },
                { name: 'Success', l: 65, c: 0.19, h: 145 },
                { name: 'Warning', l: 75, c: 0.15, h: 85 },
                { name: 'Error', l: 60, c: 0.22, h: 25 },
              ].map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => {
                    setLightness(preset.l)
                    setChroma(preset.c)
                    setHue(preset.h)
                  }}
                  className="p-3 rounded-lg border-2 border-neutral-200 dark:border-neutral-700 hover:border-brand-300 dark:hover:border-brand-700 transition-colors text-xs font-medium"
                  style={{ backgroundColor: `oklch(${preset.l}% ${preset.c} ${preset.h})` }}
                >
                  <span className="text-white drop-shadow-md">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50">
            <div className="flex gap-2">
              <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-neutral-600 dark:text-neutral-400">
                OKLCH provides better perceptual uniformity than HSL, making it ideal for programmatic color generation
                and accessible color systems.
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Interactive Demo
function InteractiveDemo() {
  const [count, setCount] = useState(0)
  const [inputValue, setInputValue] = useState('')
  const [selectedOption, setSelectedOption] = useState('option1')
  const [isToggled, setIsToggled] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: durations.moderate }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold mb-2">Interactive Examples</h2>
        <p className="text-neutral-600 dark:text-neutral-400">Common UI patterns and state management</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Counter */}
        <div className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Counter
          </h3>
          <div className="space-y-4">
            <div className="text-center">
              <motion.div
                key={count}
                initial={{ scale: 1.2, color: '#6366f1' }}
                animate={{ scale: 1, color: '#000000' }}
                className="text-5xl font-bold mb-2 dark:text-white"
              >
                {count}
              </motion.div>
              <p className="text-sm text-neutral-500">Current count</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCount((c) => c - 1)}
                className="flex-1 px-4 py-2 bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-lg font-medium hover:bg-red-200 dark:hover:bg-red-950/50 transition-colors"
              >
                Decrease
              </button>
              <button
                onClick={() => setCount(0)}
                className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-lg font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={() => setCount((c) => c + 1)}
                className="flex-1 px-4 py-2 bg-green-100 dark:bg-green-950/30 text-green-600 dark:text-green-400 rounded-lg font-medium hover:bg-green-200 dark:hover:bg-green-950/50 transition-colors"
              >
                Increase
              </button>
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            Text Input
          </h3>
          <div className="space-y-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type something..."
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800 min-h-[100px]">
              {inputValue ? (
                <div>
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">Live Preview:</p>
                  <p className="text-lg font-medium">{inputValue}</p>
                  <p className="text-xs text-neutral-500 mt-2">{inputValue.length} characters</p>
                </div>
              ) : (
                <p className="text-neutral-400 text-center pt-6">Start typing to see preview</p>
              )}
            </div>
          </div>
        </div>

        {/* Radio Group */}
        <div className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            Radio Group
          </h3>
          <div className="space-y-2">
            {[
              { value: 'option1', label: 'Option One', description: 'First choice' },
              { value: 'option2', label: 'Option Two', description: 'Second choice' },
              { value: 'option3', label: 'Option Three', description: 'Third choice' },
            ].map((option) => (
              <label
                key={option.value}
                className={`
                  flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all
                  ${
                    selectedOption === option.value
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/20'
                      : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
                  }
                `}
              >
                <input
                  type="radio"
                  name="options"
                  value={option.value}
                  checked={selectedOption === option.value}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  className="mt-1 w-4 h-4 text-brand-500 focus:ring-brand-500"
                />
                <div className="flex-1">
                  <div className="font-medium">{option.label}</div>
                  <div className="text-xs text-neutral-500">{option.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Toggle Switch */}
        <div className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-purple-500" />
            Toggle Switch
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Enable Notifications</div>
                <div className="text-sm text-neutral-500">Receive updates and alerts</div>
              </div>
              <button
                onClick={() => setIsToggled(!isToggled)}
                className={`
                  relative w-14 h-8 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:outline-none
                  ${isToggled ? 'bg-brand-500' : 'bg-neutral-300 dark:bg-neutral-700'}
                `}
              >
                <motion.div
                  animate={{ x: isToggled ? 28 : 4 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                />
              </button>
            </div>

            <motion.div
              initial={false}
              animate={{ height: isToggled ? 'auto' : 0, opacity: isToggled ? 1 : 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/50">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-green-600 dark:text-green-400">
                    Notifications are now enabled. You will receive updates in real-time.
                  </div>
                </div>
              </div>
            </motion.div>

            {!isToggled && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
              >
                <div className="text-sm text-neutral-600 dark:text-neutral-400">
                  Toggle the switch to enable notifications
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
