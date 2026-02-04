'use client'

import { useState, useEffect, useCallback } from 'react'

export interface UseVoiceResult {
  isListening: boolean
  transcript: string
  startListening: () => void
  stopListening: () => void
  resetTranscript: () => void
  error: string | null
  isSupported: boolean
}

export function useVoice(): UseVoiceResult {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [recognition, setRecognition] = useState<any>(null)
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition

      if (SpeechRecognition) {
        setIsSupported(true)
        const recognitionInstance = new SpeechRecognition()
        recognitionInstance.continuous = true
        recognitionInstance.interimResults = true
        recognitionInstance.lang = 'en-US'

        recognitionInstance.onstart = () => {
          setIsListening(true)
          setError(null)
        }

        recognitionInstance.onend = () => {
          setIsListening(false)
        }

        recognitionInstance.onerror = (event: any) => {
          console.error('Speech recognition error', event.error)
          setError(event.error)
          setIsListening(false)
        }

        recognitionInstance.onresult = (event: any) => {
          let interimTranscript = ''
          let finalTranscript = ''

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript
            } else {
              interimTranscript += event.results[i][0].transcript
            }
          }

          setTranscript((prev) => {
            // Basic logic to append final chunks, but for this simple hook,
            // we might just want to show what's currently being said.
            // A more complex implementation would handle deduplication.
            return finalTranscript + interimTranscript
          })
        }

        setRecognition(recognitionInstance)
      } else {
        setIsSupported(false)
        setError('Browser does not support Speech Recognition')
      }
    }
  }, [])

  const startListening = useCallback(() => {
    if (recognition && !isListening) {
      try {
        recognition.start()
      } catch (e) {
        console.error(e)
      }
    }
  }, [recognition, isListening])

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop()
    }
  }, [recognition, isListening])

  const resetTranscript = useCallback(() => {
    setTranscript('')
  }, [])

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    error,
    isSupported,
  }
}
