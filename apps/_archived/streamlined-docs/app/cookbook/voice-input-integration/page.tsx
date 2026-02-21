/**
 * Voice Input Integration Cookbook
 *
 * Complete guide to implementing voice input in AI chat applications
 * using the Web Speech API. Covers speech recognition, audio recording,
 * transcription, and voice commands.
 *
 * Use Cases:
 * - Accessibility for users who prefer voice input
 * - Hands-free interaction in specialized environments
 * - Multilingual support with automatic language detection
 */

'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DocumentationPage } from '../../../../../components/Docs/DocumentationPage'
import { Section } from '../../../../../components/Docs/Section'
import { ServerCodeBlock } from '../../../../../components/Docs/ServerCodeBlock'
import type { TocItem } from '../../../../../components/Docs/TableOfContents'

// ISR Configuration
export const revalidate = 3600 // Revalidate every hour

// ============================================================================
// Table of Contents
// ============================================================================

const tableOfContents: TocItem[] = [
  { id: 'overview', title: 'Overview', level: 2 },
  { id: 'browser-api', title: 'Browser Speech API', level: 2 },
  { id: 'recording', title: 'Audio Recording', level: 2 },
  { id: 'transcription', title: 'Transcription Services', level: 2 },
  { id: 'voice-commands', title: 'Voice Commands', level: 2 },
  { id: 'examples', title: 'Complete Examples', level: 2 },
  { id: 'use-cases', title: 'Use Cases', level: 2 },
]

// ============================================================================
// Demo Component
// ============================================================================

function VoiceInputDemo() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [isSupported, setIsSupported] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [language, setLanguage] = useState('en-US')
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      setIsSupported(false)
      return
    }

    // Initialize speech recognition
    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = language

    recognition.onresult = (event: any) => {
      let interim = ''
      let final = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          final += result[0].transcript + ' '
        } else {
          interim += result[0].transcript
        }
      }

      if (final) {
        setTranscript((prev) => prev + final)
        setInterimTranscript('')
      } else {
        setInterimTranscript(interim)
      }
    }

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      setError(`Error: ${event.error}`)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [language])

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return

    try {
      setError(null)
      recognitionRef.current.start()
      setIsListening(true)
    } catch (err) {
      console.error('Failed to start recognition:', err)
      setError('Failed to start voice input')
    }
  }, [])

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return

    recognitionRef.current.stop()
    setIsListening(false)
  }, [])

  const clearTranscript = useCallback(() => {
    setTranscript('')
    setInterimTranscript('')
  }, [])

  if (!isSupported) {
    return (
      <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4">
        <p className="text-sm text-yellow-600 dark:text-yellow-400">
          ⚠️ Voice input is not supported in your browser. Please use Chrome,
          Edge, or Safari for voice input functionality.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={isListening ? stopListening : startListening}
          className={`rounded-lg px-6 py-2 text-sm font-medium transition-colors ${
            isListening
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
        >
          {isListening ? (
            <>
              <span className="mr-2">⏹</span>
              Stop Listening
            </>
          ) : (
            <>
              <span className="mr-2">🎤</span>
              Start Listening
            </>
          )}
        </button>

        <button
          onClick={clearTranscript}
          disabled={!transcript && !interimTranscript}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50 disabled:hover:bg-transparent"
        >
          Clear
        </button>

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          disabled={isListening}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm disabled:opacity-50"
        >
          <option value="en-US">English (US)</option>
          <option value="en-GB">English (UK)</option>
          <option value="es-ES">Spanish</option>
          <option value="fr-FR">French</option>
          <option value="de-DE">German</option>
          <option value="zh-CN">Chinese (Mandarin)</option>
          <option value="ja-JP">Japanese</option>
        </select>
      </div>

      {/* Status */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 rounded-lg bg-green-500/10 px-4 py-2 text-sm text-green-600 dark:text-green-400"
          >
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
            </span>
            Listening...
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Transcript Display */}
      <div className="min-h-[200px] rounded-lg border border-border bg-muted/30 p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            Transcript
          </span>
          {(transcript || interimTranscript) && (
            <span className="text-xs text-muted-foreground">
              {transcript.split(' ').filter(Boolean).length} words
            </span>
          )}
        </div>
        <div className="whitespace-pre-wrap text-sm">
          {transcript}
          {interimTranscript && (
            <span className="text-muted-foreground">{interimTranscript}</span>
          )}
          {!transcript && !interimTranscript && (
            <span className="text-muted-foreground">
              Start speaking to see your words appear here...
            </span>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="rounded-lg bg-blue-500/10 p-4 text-sm">
        <p className="mb-2 font-medium text-blue-600 dark:text-blue-400">
          💡 Tips for best results:
        </p>
        <ul className="space-y-1 text-blue-600/80 dark:text-blue-400/80">
          <li>• Speak clearly and at a normal pace</li>
          <li>• Use a microphone close to your mouth</li>
          <li>• Minimize background noise</li>
          <li>• Grant microphone permissions when prompted</li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// Main Component
// ============================================================================

export default function VoiceInputIntegrationCookbook() {
  return (
    <DocumentationPage
      title="Voice Input Integration"
      description="Implement speech recognition and voice input for accessible, hands-free AI chat interactions"
      tableOfContents={tableOfContents}
    >
      {/* Overview */}
      <Section id="overview" title="Overview">
        <p>
          Voice input makes AI chat applications more accessible and enables
          hands-free interaction. This guide covers implementing speech
          recognition using the Web Speech API, audio recording, and integrating
          transcription services.
        </p>

        <div className="my-6">
          <h3 className="mb-3 text-lg font-semibold">Interactive Demo</h3>
          <VoiceInputDemo />
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="mb-2 font-semibold">What You&apos;ll Learn</h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Browser-based speech recognition with Web Speech API</li>
            <li>• Audio recording and processing</li>
            <li>
              • Cloud transcription services (OpenAI Whisper, AWS, Google)
            </li>
            <li>• Voice commands and wake words</li>
            <li>• Multilingual support</li>
            <li>• Accessibility considerations</li>
          </ul>
        </div>
      </Section>

      {/* Browser API */}
      <Section id="browser-api" title="Browser Speech API">
        <p>
          The Web Speech API provides built-in speech recognition in modern
          browsers. Best for simple use cases and when you want to minimize
          dependencies.
        </p>

        <ServerCodeBlock
          title="useVoiceInput Hook"
          language="typescript"
          code={`// hooks/useVoiceInput.ts
import { useState, useRef, useEffect, useCallback } from 'react'

interface UseVoiceInputOptions {
  language?: string
  continuous?: boolean
  interimResults?: boolean
  onResult?: (transcript: string) => void
  onError?: (error: string) => void
}

export function useVoiceInput(options: UseVoiceInputOptions = {}) {
  const {
    language = 'en-US',
    continuous = true,
    interimResults = true,
    onResult,
    onError,
  } = options

  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [isSupported, setIsSupported] = useState(true)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    // Check browser support
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      setIsSupported(false)
      return
    }

    // Initialize recognition
    const recognition = new SpeechRecognition()
    recognition.continuous = continuous
    recognition.interimResults = interimResults
    recognition.lang = language

    // Handle results
    recognition.onresult = (event: any) => {
      let interim = ''
      let final = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          final += result[0].transcript + ' '
        } else {
          interim += result[0].transcript
        }
      }

      if (final) {
        setTranscript((prev) => {
          const newTranscript = prev + final
          onResult?.(newTranscript)
          return newTranscript
        })
        setInterimTranscript('')
      } else {
        setInterimTranscript(interim)
      }
    }

    // Handle errors
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      onError?.(event.error)
      setIsListening(false)
    }

    // Handle end
    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [language, continuous, interimResults, onResult, onError])

  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListening) return

    try {
      recognitionRef.current.start()
      setIsListening(true)
    } catch (err) {
      console.error('Failed to start recognition:', err)
      onError?.('Failed to start voice input')
    }
  }, [isListening, onError])

  const stopListening = useCallback(() => {
    if (!recognitionRef.current || !isListening) return

    recognitionRef.current.stop()
    setIsListening(false)
  }, [isListening])

  const clearTranscript = useCallback(() => {
    setTranscript('')
    setInterimTranscript('')
  }, [])

  return {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    startListening,
    stopListening,
    clearTranscript,
  }
}`}
        />

        <ServerCodeBlock
          title="Voice Input Component"
          language="typescript"
          code={`// components/VoiceInput.tsx
'use client'

import { useVoiceInput } from '@/hooks/useVoiceInput'

interface VoiceInputProps {
  onTranscript: (text: string) => void
  language?: string
  className?: string
}

export function VoiceInput({
  onTranscript,
  language = 'en-US',
  className = '',
}: VoiceInputProps) {
  const {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    startListening,
    stopListening,
  } = useVoiceInput({
    language,
    continuous: true,
    interimResults: true,
    onResult: onTranscript,
  })

  if (!isSupported) {
    return (
      <div className="rounded bg-yellow-500/10 px-3 py-2 text-sm text-yellow-600">
        Voice input not supported in this browser
      </div>
    )
  }

  return (
    <button
      onClick={isListening ? stopListening : startListening}
      className={\`relative rounded-lg p-2 transition-colors \${
        isListening
          ? 'bg-red-500 text-white hover:bg-red-600'
          : 'bg-muted hover:bg-muted/80'
      } \${className}\`}
      aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
    >
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
        />
      </svg>

      {isListening && (
        <span className="absolute -right-1 -top-1 flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
        </span>
      )}
    </button>
  )
}

// Usage in chat input
<div className="flex items-center gap-2">
  <input
    type="text"
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    placeholder="Type or speak your message..."
  />
  <VoiceInput
    onTranscript={(text) => setMessage(text)}
    language="en-US"
  />
  <button type="submit">Send</button>
</div>`}
        />
      </Section>

      {/* Audio Recording */}
      <Section id="recording" title="Audio Recording">
        <p>
          For more advanced use cases, record audio and send it to a
          transcription service. This provides better accuracy and supports more
          languages.
        </p>

        <ServerCodeBlock
          title="Audio Recording Hook"
          language="typescript"
          code={`// hooks/useAudioRecording.ts
import { useState, useRef, useCallback } from 'react'

interface UseAudioRecordingOptions {
  onRecordingComplete?: (blob: Blob) => void
  mimeType?: string
}

export function useAudioRecording(options: UseAudioRecordingOptions = {}) {
  const {
    onRecordingComplete,
    mimeType = 'audio/webm',
  } = options

  const [isRecording, setIsRecording] = useState(false)
  const [duration, setDuration] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout>()

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream, { mimeType })

      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType })
        onRecordingComplete?.(blob)

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      mediaRecorderRef.current = mediaRecorder
      setIsRecording(true)
      setDuration(0)

      // Start timer
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1)
      }, 1000)
    } catch (err) {
      console.error('Failed to start recording:', err)
      throw err
    }
  }, [mimeType, onRecordingComplete])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isRecording])

  const cancelRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      // Stop without calling onRecordingComplete
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
      mediaRecorderRef.current = null
      chunksRef.current = []
      setIsRecording(false)
      setDuration(0)

      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isRecording])

  return {
    isRecording,
    duration,
    startRecording,
    stopRecording,
    cancelRecording,
  }
}`}
        />
      </Section>

      {/* Transcription Services */}
      <Section id="transcription" title="Transcription Services">
        <p>
          Use cloud transcription services for better accuracy and language
          support. Popular options include OpenAI Whisper, AWS Transcribe, and
          Google Speech-to-Text.
        </p>

        <ServerCodeBlock
          title="OpenAI Whisper Transcription"
          language="typescript"
          code={`// app/api/transcribe/route.ts
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audio = formData.get('audio') as File
    const language = formData.get('language') as string | undefined

    if (!audio) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      )
    }

    // Transcribe with Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: audio,
      model: 'whisper-1',
      language: language, // Optional: 'en', 'es', 'fr', etc.
      response_format: 'verbose_json', // Includes timestamps
    })

    return NextResponse.json({
      text: transcription.text,
      language: transcription.language,
      duration: transcription.duration,
    })
  } catch (error) {
    console.error('Transcription error:', error)
    return NextResponse.json(
      { error: 'Transcription failed' },
      { status: 500 }
    )
  }
}

// Client usage
async function transcribeAudio(blob: Blob, language?: string) {
  const formData = new FormData()
  formData.append('audio', blob, 'recording.webm')
  if (language) {
    formData.append('language', language)
  }

  const response = await fetch('/api/transcribe', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Transcription failed')
  }

  return response.json()
}`}
        />

        <ServerCodeBlock
          title="Complete Voice Input with Transcription"
          language="typescript"
          code={`// components/VoiceInputWithTranscription.tsx
'use client'

import { useState } from 'react'
import { useAudioRecording } from '@/hooks/useAudioRecording'

interface VoiceInputWithTranscriptionProps {
  onTranscript: (text: string) => void
  language?: string
}

export function VoiceInputWithTranscription({
  onTranscript,
  language = 'en',
}: VoiceInputWithTranscriptionProps) {
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { isRecording, duration, startRecording, stopRecording } =
    useAudioRecording({
      onRecordingComplete: async (blob) => {
        setIsTranscribing(true)
        setError(null)

        try {
          const formData = new FormData()
          formData.append('audio', blob, 'recording.webm')
          formData.append('language', language)

          const response = await fetch('/api/transcribe', {
            method: 'POST',
            body: formData,
          })

          if (!response.ok) {
            throw new Error('Transcription failed')
          }

          const data = await response.json()
          onTranscript(data.text)
        } catch (err) {
          console.error('Transcription error:', err)
          setError('Failed to transcribe audio')
        } finally {
          setIsTranscribing(false)
        }
      },
    })

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return \`\${mins}:\${secs.toString().padStart(2, '0')}\`
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isTranscribing}
        className={\`relative rounded-lg p-2 transition-colors \${
          isRecording
            ? 'bg-red-500 text-white'
            : 'bg-muted hover:bg-muted/80'
        } disabled:opacity-50\`}
      >
        {isRecording ? '⏹' : '🎤'}
        {isRecording && (
          <span className="absolute -right-1 -top-1 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
          </span>
        )}
      </button>

      {isRecording && (
        <span className="text-sm text-muted-foreground">
          {formatDuration(duration)}
        </span>
      )}

      {isTranscribing && (
        <span className="text-sm text-muted-foreground">
          Transcribing...
        </span>
      )}

      {error && (
        <span className="text-sm text-red-500">{error}</span>
      )}
    </div>
  )
}`}
        />
      </Section>

      {/* Voice Commands */}
      <Section id="voice-commands" title="Voice Commands">
        <p>
          Implement voice commands for hands-free control of your application.
          Detect keywords and trigger actions automatically.
        </p>

        <ServerCodeBlock
          title="Voice Command Detection"
          language="typescript"
          code={`// hooks/useVoiceCommands.ts
import { useEffect } from 'react'
import { useVoiceInput } from './useVoiceInput'

interface VoiceCommand {
  keywords: string[]
  action: () => void
  caseSensitive?: boolean
}

interface UseVoiceCommandsOptions {
  commands: VoiceCommand[]
  language?: string
  enabled?: boolean
}

export function useVoiceCommands(options: UseVoiceCommandsOptions) {
  const { commands, language = 'en-US', enabled = true } = options

  const { transcript } = useVoiceInput({
    language,
    continuous: true,
    interimResults: false,
  })

  useEffect(() => {
    if (!enabled || !transcript) return

    // Check each command
    for (const command of commands) {
      const text = command.caseSensitive
        ? transcript
        : transcript.toLowerCase()

      for (const keyword of command.keywords) {
        const match = command.caseSensitive
          ? keyword
          : keyword.toLowerCase()

        if (text.includes(match)) {
          command.action()
          break
        }
      }
    }
  }, [transcript, commands, enabled])
}

// Usage
function ChatWithVoiceCommands() {
  const [messages, setMessages] = useState<Message[]>([])

  useVoiceCommands({
    commands: [
      {
        keywords: ['clear chat', 'clear messages', 'start over'],
        action: () => setMessages([]),
      },
      {
        keywords: ['scroll down', 'go to bottom'],
        action: () => window.scrollTo({ top: document.body.scrollHeight }),
      },
      {
        keywords: ['help', 'what can you do'],
        action: () => setMessages((prev) => [...prev, {
          role: 'assistant',
          content: 'I can help you with...',
        }]),
      },
    ],
    language: 'en-US',
    enabled: true,
  })

  return <div>{/* Chat UI */}</div>
}`}
        />
      </Section>

      {/* Complete Examples */}
      <Section id="examples" title="Complete Examples">
        <ServerCodeBlock
          title="Chat Input with Voice Support"
          language="typescript"
          code={`// components/ChatInputWithVoice.tsx
'use client'

import { useState } from 'react'
import { VoiceInput } from './VoiceInput'

interface ChatInputWithVoiceProps {
  onSend: (message: string) => void
  placeholder?: string
}

export function ChatInputWithVoice({
  onSend,
  placeholder = 'Type or speak your message...',
}: ChatInputWithVoiceProps) {
  const [message, setMessage] = useState('')
  const [isVoiceMode, setIsVoiceMode] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    onSend(message)
    setMessage('')
  }

  const handleVoiceTranscript = (text: string) => {
    // Append to existing message or replace
    setMessage((prev) => (prev ? \`\${prev} \${text}\` : text))
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={placeholder}
        className="flex-1 rounded-lg border border-border bg-background px-4 py-2"
      />

      <VoiceInput
        onTranscript={handleVoiceTranscript}
        language="en-US"
      />

      <button
        type="submit"
        disabled={!message.trim()}
        className="rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        Send
      </button>
    </form>
  )
}`}
        />
      </Section>

      {/* Use Cases */}
      <Section id="use-cases" title="Use Cases">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: 'Accessibility',
              description:
                'Enable users with mobility or visual impairments to interact with your application through voice',
              icon: '♿',
            },
            {
              title: 'Hands-Free Environments',
              description:
                'Perfect for medical, manufacturing, or driving scenarios where hands-free operation is required',
              icon: '🏥',
            },
            {
              title: 'Multilingual Support',
              description:
                'Support users in their native language with automatic language detection and transcription',
              icon: '🌍',
            },
          ].map((useCase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="rounded-lg border border-border bg-card p-6"
            >
              <div className="mb-3 text-3xl">{useCase.icon}</div>
              <h3 className="mb-2 font-semibold">{useCase.title}</h3>
              <p className="text-sm text-muted-foreground">
                {useCase.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Section>
    </DocumentationPage>
  )
}
