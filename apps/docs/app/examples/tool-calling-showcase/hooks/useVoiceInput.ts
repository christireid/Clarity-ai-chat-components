'use client'

/**
 * useVoiceInput Hook
 *
 * Provides voice input capabilities using the Web Speech API.
 * Supports continuous listening, interim results, and language selection.
 */

import { useState, useCallback, useRef, useEffect } from 'react'

// Web Speech API types (not included in standard TypeScript lib)
interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number
  readonly results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string
  readonly message: string
}

interface SpeechRecognition extends EventTarget {
  lang: string
  continuous: boolean
  interimResults: boolean
  onstart: ((this: SpeechRecognition, ev: Event) => void) | null
  onend: ((this: SpeechRecognition, ev: Event) => void) | null
  onerror:
    | ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void)
    | null
  onresult:
    | ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void)
    | null
  start(): void
  stop(): void
  abort(): void
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }
}

interface UseVoiceInputOptions {
  language?: string
  continuous?: boolean
  interimResults?: boolean
  onResult?: (transcript: string, isFinal: boolean) => void
  onError?: (error: string) => void
  onEnd?: () => void
}

interface UseVoiceInputReturn {
  isListening: boolean
  isSupported: boolean
  transcript: string
  interimTranscript: string
  error: string | null
  start: () => void
  stop: () => void
  toggle: () => void
  reset: () => void
}

// Check if Speech Recognition is available
function getSpeechRecognition(): SpeechRecognitionConstructor | null {
  if (typeof window === 'undefined') return null

  return window.SpeechRecognition || window.webkitSpeechRecognition || null
}

export function useVoiceInput(
  options: UseVoiceInputOptions = {}
): UseVoiceInputReturn {
  const {
    language = 'en-US',
    continuous = false,
    interimResults = true,
    onResult,
    onError,
    onEnd,
  } = options

  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const isSupported =
    typeof window !== 'undefined' && getSpeechRecognition() !== null

  // Initialize recognition
  useEffect(() => {
    const SpeechRecognitionClass = getSpeechRecognition()
    if (!SpeechRecognitionClass) return

    const recognition = new SpeechRecognitionClass()
    recognition.lang = language
    recognition.continuous = continuous
    recognition.interimResults = interimResults

    recognition.onstart = () => {
      setIsListening(true)
      setError(null)
    }

    recognition.onend = () => {
      setIsListening(false)
      onEnd?.()
    }

    recognition.onerror = (event) => {
      const errorMessages: Record<string, string> = {
        'no-speech': 'No speech detected. Please try again.',
        'audio-capture': 'Microphone not available. Please check permissions.',
        'not-allowed':
          'Microphone access denied. Please allow microphone access.',
        network: 'Network error. Please check your connection.',
        aborted: 'Speech recognition was aborted.',
        'language-not-supported': 'Language not supported.',
      }

      const message =
        errorMessages[event.error] || `Speech recognition error: ${event.error}`
      setError(message)
      setIsListening(false)
      onError?.(message)
    }

    recognition.onresult = (event) => {
      let finalTranscript = ''
      let interim = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalTranscript += result[0].transcript
        } else {
          interim += result[0].transcript
        }
      }

      if (finalTranscript) {
        setTranscript((prev) => prev + finalTranscript)
        onResult?.(finalTranscript, true)
      }

      setInterimTranscript(interim)
      if (interim) {
        onResult?.(interim, false)
      }
    }

    recognitionRef.current = recognition

    return () => {
      recognition.abort()
    }
  }, [language, continuous, interimResults, onResult, onError, onEnd])

  // Start listening
  const start = useCallback(() => {
    if (!recognitionRef.current || isListening) return

    try {
      setError(null)
      setInterimTranscript('')
      recognitionRef.current.start()
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Failed to start speech recognition'
      setError(message)
      onError?.(message)
    }
  }, [isListening, onError])

  // Stop listening
  const stop = useCallback(() => {
    if (!recognitionRef.current || !isListening) return

    try {
      recognitionRef.current.stop()
    } catch {
      // Ignore errors when stopping
    }
  }, [isListening])

  // Toggle listening
  const toggle = useCallback(() => {
    if (isListening) {
      stop()
    } else {
      start()
    }
  }, [isListening, start, stop])

  // Reset state
  const reset = useCallback(() => {
    stop()
    setTranscript('')
    setInterimTranscript('')
    setError(null)
  }, [stop])

  return {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    error,
    start,
    stop,
    toggle,
    reset,
  }
}
