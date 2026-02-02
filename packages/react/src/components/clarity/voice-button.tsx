'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import { Mic, MicOff, Square, Volume2, Loader2 } from 'lucide-react'
import SpeechRecognition from 'speech-recognition'

// =============================================================================
// VOICE BUTTON - Push to talk / Toggle recording
// =============================================================================

interface VoiceButtonProps {
  onTranscript?: (transcript: string) => void
  onStart?: () => void
  onStop?: () => void
  onError?: (error: string) => void
  mode?: 'push' | 'toggle'
  language?: string
  continuous?: boolean
  interimResults?: boolean
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outline' | 'ghost' | 'secondary'
  className?: string
}

export function VoiceButton({
  onTranscript,
  onStart,
  onStop,
  onError,
  mode = 'toggle',
  language = 'en-US',
  continuous = false,
  interimResults = true,
  disabled = false,
  size = 'md',
  variant = 'outline',
  className,
}: VoiceButtonProps) {
  const [isListening, setIsListening] = React.useState(false)
  const [isSupported, setIsSupported] = React.useState(true)
  const recognitionRef = React.useRef<any | null>(null)

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition
      if (!SpeechRecognition) {
        setIsSupported(false)
        return
      }

      const recognition = new SpeechRecognition()
      recognition.continuous = continuous
      recognition.interimResults = interimResults
      recognition.lang = language

      recognition.onresult = (event) => {
        const results = Array.from(event.results)
        const transcript = results
          .map((result) => result[0].transcript)
          .join('')

        if (results[results.length - 1]?.isFinal || !interimResults) {
          onTranscript?.(transcript)
        }
      }

      recognition.onerror = (event) => {
        setIsListening(false)
        onError?.(event.error)
      }

      recognition.onend = () => {
        setIsListening(false)
        onStop?.()
      }

      recognitionRef.current = recognition
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [language, continuous, interimResults, onTranscript, onError, onStop])

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start()
        setIsListening(true)
        onStart?.()
      } catch (error) {
        onError?.('Failed to start recording')
      }
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const handleClick = () => {
    if (mode === 'toggle') {
      if (isListening) {
        stopListening()
      } else {
        startListening()
      }
    }
  }

  const handleMouseDown = () => {
    if (mode === 'push') {
      startListening()
    }
  }

  const handleMouseUp = () => {
    if (mode === 'push') {
      stopListening()
    }
  }

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

  if (!isSupported) {
    return (
      <Button
        variant={variant}
        size="icon"
        disabled
        className={cn(sizeClasses[size], className)}
        title="Voice input not supported"
      >
        <MicOff className={iconSizes[size]} />
      </Button>
    )
  }

  return (
    <Button
      variant={variant}
      size="icon"
      disabled={disabled}
      onClick={mode === 'toggle' ? handleClick : undefined}
      onMouseDown={mode === 'push' ? handleMouseDown : undefined}
      onMouseUp={mode === 'push' ? handleMouseUp : undefined}
      onMouseLeave={mode === 'push' && isListening ? handleMouseUp : undefined}
      onTouchStart={mode === 'push' ? handleMouseDown : undefined}
      onTouchEnd={mode === 'push' ? handleMouseUp : undefined}
      className={cn(
        sizeClasses[size],
        isListening &&
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        className
      )}
      title={isListening ? 'Stop recording' : 'Start recording'}
    >
      {isListening ? (
        <div className="relative">
          <Mic className={cn(iconSizes[size], 'animate-pulse')} />
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-destructive animate-pulse" />
        </div>
      ) : (
        <Mic className={iconSizes[size]} />
      )}
    </Button>
  )
}

// =============================================================================
// VOICE INPUT FIELD - Input with integrated voice
// =============================================================================

interface VoiceInputFieldProps {
  value: string
  onChange: (value: string) => void
  onSubmit?: () => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function VoiceInputField({
  value,
  onChange,
  onSubmit,
  placeholder = 'Type or speak...',
  disabled = false,
  className,
}: VoiceInputFieldProps) {
  const [isListening, setIsListening] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleTranscript = (transcript: string) => {
    onChange(transcript)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSubmit?.()
    }
  }

  return (
    <div className={cn('relative flex items-center gap-2', className)}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled || isListening}
        className="flex-1 h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
      />
      <VoiceButton
        onTranscript={handleTranscript}
        onStart={() => setIsListening(true)}
        onStop={() => setIsListening(false)}
        disabled={disabled}
        size="md"
      />
    </div>
  )
}

// =============================================================================
// VOICE VISUALIZER - Audio waveform
// =============================================================================

interface VoiceVisualizerProps {
  isActive?: boolean
  bars?: number
  color?: string
  className?: string
}

export function VoiceVisualizer({
  isActive = false,
  bars = 5,
  color,
  className,
}: VoiceVisualizerProps) {
  return (
    <div
      className={cn('flex items-center justify-center gap-1 h-8', className)}
    >
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'w-1 rounded-full transition-all duration-150',
            isActive ? 'bg-primary animate-pulse' : 'bg-muted-foreground/30'
          )}
          style={{
            height: isActive ? `${Math.random() * 24 + 8}px` : '8px',
            backgroundColor: color,
            animationDelay: `${i * 100}ms`,
          }}
        />
      ))}
    </div>
  )
}

// =============================================================================
// TEXT TO SPEECH BUTTON
// =============================================================================

interface TextToSpeechButtonProps {
  text: string
  voice?: SpeechSynthesisVoice | null
  rate?: number
  pitch?: number
  volume?: number
  onStart?: () => void
  onEnd?: () => void
  onError?: (error: string) => void
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outline' | 'ghost' | 'secondary'
  className?: string
}

export function TextToSpeechButton({
  text,
  voice,
  rate = 1,
  pitch = 1,
  volume = 1,
  onStart,
  onEnd,
  onError,
  size = 'md',
  variant = 'ghost',
  className,
}: TextToSpeechButtonProps) {
  const [isSpeaking, setIsSpeaking] = React.useState(false)
  const [isSupported, setIsSupported] = React.useState(true)
  const utteranceRef = React.useRef<SpeechSynthesisUtterance | null>(null)

  React.useEffect(() => {
    if (typeof window !== 'undefined' && !window.speechSynthesis) {
      setIsSupported(false)
    }
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const speak = () => {
    if (!window.speechSynthesis || !text) return

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    if (voice) utterance.voice = voice
    utterance.rate = rate
    utterance.pitch = pitch
    utterance.volume = volume

    utterance.onstart = () => {
      setIsSpeaking(true)
      onStart?.()
    }

    utterance.onend = () => {
      setIsSpeaking(false)
      onEnd?.()
    }

    utterance.onerror = (event) => {
      setIsSpeaking(false)
      onError?.(event.error)
    }

    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }

  const stop = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  const sizeClasses = {
    sm: 'h-7 w-7',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  }

  const iconSizes = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  if (!isSupported) {
    return null
  }

  return (
    <Button
      variant={variant}
      size="icon"
      onClick={isSpeaking ? stop : speak}
      className={cn(sizeClasses[size], className)}
      title={isSpeaking ? 'Stop speaking' : 'Read aloud'}
    >
      {isSpeaking ? (
        <Square className={iconSizes[size]} />
      ) : (
        <Volume2 className={iconSizes[size]} />
      )}
    </Button>
  )
}

// =============================================================================
// VOICE RECORDER - Full recording interface
// =============================================================================

interface VoiceRecorderProps {
  onRecordingComplete?: (blob: Blob, duration: number) => void
  onTranscript?: (transcript: string) => void
  maxDuration?: number // seconds
  transcribe?: boolean
  className?: string
}

export function VoiceRecorder({
  onRecordingComplete,
  onTranscript,
  maxDuration = 120,
  transcribe = false,
  className,
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = React.useState(false)
  const [duration, setDuration] = React.useState(0)
  const [audioUrl, setAudioUrl] = React.useState<string | null>(null)
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null)
  const chunksRef = React.useRef<Blob[]>([])
  const timerRef = React.useRef<NodeJS.Timeout | null>(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        onRecordingComplete?.(blob, duration)

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setDuration(0)
      setAudioUrl(null)

      // Start timer
      timerRef.current = setInterval(() => {
        setDuration((d) => {
          if (d >= maxDuration) {
            stopRecording()
            return d
          }
          return d + 1
        })
      }, 1000)
    } catch (error) {
      console.error('Failed to start recording:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [audioUrl])

  return (
    <div
      className={cn(
        'flex items-center gap-4 p-4 rounded-lg border border-border bg-card',
        className
      )}
    >
      {/* Record Button */}
      <Button
        variant={isRecording ? 'destructive' : 'default'}
        size="icon"
        className="h-12 w-12 rounded-full"
        onClick={isRecording ? stopRecording : startRecording}
      >
        {isRecording ? (
          <Square className="h-5 w-5" />
        ) : (
          <Mic className="h-5 w-5" />
        )}
      </Button>

      {/* Status */}
      <div className="flex-1">
        {isRecording ? (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
              <span className="text-sm font-medium">Recording...</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{formatTime(duration)}</span>
              <span>/</span>
              <span>{formatTime(maxDuration)}</span>
            </div>
            {/* Progress bar */}
            <div className="h-1 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-destructive transition-all"
                style={{ width: `${(duration / maxDuration) * 100}%` }}
              />
            </div>
          </div>
        ) : audioUrl ? (
          <div className="space-y-2">
            <p className="text-sm font-medium">Recording complete</p>
            <audio src={audioUrl} controls className="w-full h-8" />
          </div>
        ) : (
          <div>
            <p className="text-sm font-medium">Press to record</p>
            <p className="text-xs text-muted-foreground">
              Max {formatTime(maxDuration)}
            </p>
          </div>
        )}
      </div>

      {/* Visualizer */}
      {isRecording && <VoiceVisualizer isActive bars={7} />}
    </div>
  )
}

// =============================================================================
// USE VOICE HOOK
// =============================================================================

interface UseVoiceOptions {
  language?: string
  continuous?: boolean
  interimResults?: boolean
}

export function useVoice(options: UseVoiceOptions = {}) {
  const {
    language = 'en-US',
    continuous = false,
    interimResults = true,
  } = options
  const [isListening, setIsListening] = React.useState(false)
  const [transcript, setTranscript] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const [isSupported, setIsSupported] = React.useState(true)
  const recognitionRef = React.useRef<any | null>(null)

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition
      if (!SpeechRecognition) {
        setIsSupported(false)
        return
      }

      const recognition = new SpeechRecognition()
      recognition.continuous = continuous
      recognition.interimResults = interimResults
      recognition.lang = language

      recognition.onresult = (event) => {
        const results = Array.from(event.results)
        const text = results.map((result) => result[0].transcript).join('')
        setTranscript(text)
      }

      recognition.onerror = (event) => {
        setIsListening(false)
        setError(event.error)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [language, continuous, interimResults])

  const startListening = React.useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setTranscript('')
      setError(null)
      try {
        recognitionRef.current.start()
        setIsListening(true)
      } catch {
        setError('Failed to start')
      }
    }
  }, [isListening])

  const stopListening = React.useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }, [isListening])

  const resetTranscript = React.useCallback(() => {
    setTranscript('')
  }, [])

  return {
    isListening,
    transcript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  }
}
