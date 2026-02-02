'use client'

import * as React from 'react'
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  Settings,
  Languages,
  RefreshCw,
  Copy,
  Check,
  ChevronDown,
  AudioWaveform as Waveform,
  Headphones,
  Radio,
  Sparkles,
  FileAudio,
  Download,
  Upload,
} from 'lucide-react'
import { Button } from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import { Slider } from '@clarity-chat/primitives'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@clarity-chat/primitives'
import { Progress } from '@clarity-chat/primitives'
import { Textarea } from '@clarity-chat/primitives'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@clarity-chat/primitives'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@clarity-chat/primitives'
import { cn } from '@clarity-chat/primitives'

// Types
export interface Voice {
  id: string
  name: string
  language: string
  gender: 'male' | 'female' | 'neutral'
  preview?: string
  provider?: string
}

export interface TranscriptionResult {
  text: string
  confidence: number
  segments?: {
    text: string
    start: number
    end: number
    confidence: number
  }[]
  language?: string
}

// Voice Selector Component
interface VoiceSelectorProps {
  voices: Voice[]
  selectedVoice?: string
  onSelect?: (voiceId: string) => void
  onPreview?: (voiceId: string) => void
}

export function VoiceSelector({
  voices,
  selectedVoice,
  onSelect,
  onPreview,
}: VoiceSelectorProps) {
  const groupedVoices = voices.reduce(
    (acc, voice) => {
      const lang = voice.language
      if (!acc[lang]) acc[lang] = []
      acc[lang].push(voice)
      return acc
    },
    {} as Record<string, Voice[]>
  )

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Voice</label>
      <Select value={selectedVoice} onValueChange={onSelect}>
        <SelectTrigger>
          <SelectValue placeholder="Select a voice" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(groupedVoices).map(([language, langVoices]) => (
            <React.Fragment key={language}>
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                {language}
              </div>
              {langVoices.map((voice) => (
                <SelectItem key={voice.id} value={voice.id}>
                  <div className="flex items-center gap-2">
                    <span>{voice.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {voice.gender}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </React.Fragment>
          ))}
        </SelectContent>
      </Select>
      {selectedVoice && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPreview?.(selectedVoice)}
          className="w-full"
        >
          <Headphones className="h-4 w-4 mr-2" />
          Preview Voice
        </Button>
      )}
    </div>
  )
}

// Speech Input Component (for voice-to-text)
interface SpeechInputProps {
  onTranscript?: (text: string) => void
  onPartialTranscript?: (text: string) => void
  language?: string
  continuous?: boolean
  placeholder?: string
}

export function SpeechInput({
  onTranscript,
  onPartialTranscript,
  language = 'en-US',
  continuous = false,
  placeholder = 'Click the microphone to start speaking...',
}: SpeechInputProps) {
  const [isListening, setIsListening] = React.useState(false)
  const [transcript, setTranscript] = React.useState('')
  const [partialTranscript, setPartialTranscript] = React.useState('')
  const [audioLevel, setAudioLevel] = React.useState(0)

  // Simulated audio level animation
  React.useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setAudioLevel(Math.random() * 100)
      }, 100)
      return () => clearInterval(interval)
    }
    setAudioLevel(0)
  }, [isListening])

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false)
      if (transcript) {
        onTranscript?.(transcript)
      }
    } else {
      setIsListening(true)
      setTranscript('')
      setPartialTranscript('')
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Textarea
          value={transcript || partialTranscript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder={placeholder}
          className="min-h-[120px] pr-12 resize-none"
          readOnly={isListening}
        />
        <Button
          variant={isListening ? 'destructive' : 'outline'}
          size="icon"
          className="absolute right-2 bottom-2"
          onClick={toggleListening}
        >
          {isListening ? (
            <MicOff className="h-4 w-4" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
        </Button>
      </div>

      {isListening && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
          <div className="relative">
            <Radio className="h-5 w-5 text-destructive animate-pulse" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium">Listening...</span>
              <Badge variant="outline" className="text-xs">
                {language}
              </Badge>
            </div>
            <div className="h-2 bg-background rounded-full overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-100"
                style={{ width: `${audioLevel}%` }}
              />
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsListening(false)}
          >
            <Square className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

// Transcription Result Display
interface TranscriptionDisplayProps {
  result: TranscriptionResult
  onCopy?: () => void
  onRetry?: () => void
  showSegments?: boolean
}

export function TranscriptionDisplay({
  result,
  onCopy,
  onRetry,
  showSegments = false,
}: TranscriptionDisplayProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result.text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    onCopy?.()
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">Transcription</CardTitle>
            <Badge variant="outline" className="text-xs">
              {(result.confidence * 100).toFixed(0)}% confidence
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onRetry}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {result.language && (
          <CardDescription className="flex items-center gap-1">
            <Languages className="h-3 w-3" />
            Detected: {result.language}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed">{result.text}</p>

        {showSegments && result.segments && result.segments.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              Segments
            </p>
            <div className="space-y-1">
              {result.segments.map((segment, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  <span className="text-muted-foreground w-16 shrink-0">
                    {segment.start.toFixed(1)}s
                  </span>
                  <span className="flex-1">{segment.text}</span>
                  <span className="text-muted-foreground">
                    {(segment.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Text-to-Speech Component
interface TextToSpeechProps {
  text?: string
  voices?: Voice[]
  selectedVoice?: string
  onVoiceChange?: (voiceId: string) => void
  onSpeak?: (text: string, voiceId: string) => void
}

export function TextToSpeech({
  text = '',
  voices = [],
  selectedVoice,
  onVoiceChange,
  onSpeak,
}: TextToSpeechProps) {
  const [inputText, setInputText] = React.useState(text)
  const [isSpeaking, setIsSpeaking] = React.useState(false)
  const [speed, setSpeed] = React.useState([1])
  const [pitch, setPitch] = React.useState([1])

  const handleSpeak = () => {
    if (!inputText.trim() || !selectedVoice) return
    setIsSpeaking(true)
    onSpeak?.(inputText, selectedVoice)
    // Simulated stop after 3 seconds
    setTimeout(() => setIsSpeaking(false), 3000)
  }

  return (
    <div className="space-y-4">
      <Textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Enter text to convert to speech..."
        className="min-h-[120px] resize-none"
      />

      {voices.length > 0 && (
        <VoiceSelector
          voices={voices}
          selectedVoice={selectedVoice}
          onSelect={onVoiceChange}
        />
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Speed</label>
            <span className="text-sm text-muted-foreground">
              {speed[0].toFixed(1)}x
            </span>
          </div>
          <Slider
            value={speed}
            min={0.5}
            max={2}
            step={0.1}
            onValueChange={setSpeed}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Pitch</label>
            <span className="text-sm text-muted-foreground">
              {pitch[0].toFixed(1)}
            </span>
          </div>
          <Slider
            value={pitch}
            min={0.5}
            max={2}
            step={0.1}
            onValueChange={setPitch}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          onClick={handleSpeak}
          disabled={!inputText.trim() || !selectedVoice}
          className="flex-1"
        >
          {isSpeaking ? (
            <>
              <Pause className="h-4 w-4 mr-2" />
              Stop
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Speak
            </>
          )}
        </Button>
        <Button variant="outline" disabled={!inputText.trim()}>
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      </div>

      {isSpeaking && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
          <Volume2 className="h-5 w-5 text-accent animate-pulse" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-accent rounded-full transition-all duration-100"
                  style={{
                    height: `${Math.random() * 16 + 4}px`,
                    opacity: 0.5 + Math.random() * 0.5,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Audio Transcription Uploader
interface AudioTranscriberProps {
  onTranscribe?: (file: File) => void
  onResult?: (result: TranscriptionResult) => void
  isProcessing?: boolean
  progress?: number
}

export function AudioTranscriber({
  onTranscribe,
  onResult,
  isProcessing = false,
  progress = 0,
}: AudioTranscriberProps) {
  const [dragActive, setDragActive] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith('audio/')) {
        onTranscribe?.(file)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onTranscribe?.(e.target.files[0])
    }
  }

  return (
    <div className="space-y-4">
      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
          dragActive ? 'border-accent bg-accent/5' : 'border-muted',
          isProcessing && 'pointer-events-none opacity-50'
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <FileAudio className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-sm font-medium mb-1">
          Drop an audio file here or{' '}
          <button
            type="button"
            className="text-accent underline"
            onClick={() => inputRef.current?.click()}
          >
            browse
          </button>
        </p>
        <p className="text-xs text-muted-foreground">
          Supports MP3, WAV, M4A, FLAC
        </p>
      </div>

      {isProcessing && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Transcribing...</span>
            <span className="text-muted-foreground">{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>
      )}
    </div>
  )
}

// Compact Mic Button (for inline use)
interface MicButtonProps {
  isListening?: boolean
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'ghost' | 'outline'
}

export function MicButton({
  isListening = false,
  onClick,
  size = 'md',
  variant = 'default',
}: MicButtonProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  }

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }

  return (
    <Button
      variant={isListening ? 'destructive' : variant}
      size="icon"
      className={cn(sizeClasses[size], isListening && 'animate-pulse')}
      onClick={onClick}
    >
      {isListening ? (
        <MicOff className={iconSizes[size]} />
      ) : (
        <Mic className={iconSizes[size]} />
      )}
    </Button>
  )
}
