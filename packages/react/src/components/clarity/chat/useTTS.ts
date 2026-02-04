'use client'

import { useState, useCallback, useEffect } from 'react'

export interface UseTTSResult {
  isSpeaking: boolean
  speak: (text: string) => void
  stop: () => void
  cancel: () => void
  voices: SpeechSynthesisVoice[]
  selectedVoice: SpeechSynthesisVoice | null
  selectVoice: (name: string) => void
  isSupported: boolean
}

export function useTTS(): UseTTSResult {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoice] =
    useState<SpeechSynthesisVoice | null>(null)
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true)

      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices()
        setVoices(availableVoices)
        // Prefer a decent default (e.g., Google US English or similar)
        const defaultVoice =
          availableVoices.find(
            (v) => v.name.includes('Google') && v.lang.startsWith('en')
          ) ||
          availableVoices.find((v) => v.lang.startsWith('en')) ||
          availableVoices[0]
        setSelectedVoice(defaultVoice || null)
      }

      loadVoices()
      window.speechSynthesis.onvoiceschanged = loadVoices
    }
  }, [])

  const speak = useCallback(
    (text: string) => {
      if (!isSupported) return

      // Cancel current
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      if (selectedVoice) {
        utterance.voice = selectedVoice
      }

      // Natural parameters
      utterance.rate = 1.0
      utterance.pitch = 1.0
      utterance.volume = 1.0

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      window.speechSynthesis.speak(utterance)
    },
    [isSupported, selectedVoice]
  )

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.pause()
      setIsSpeaking(false)
    }
  }, [isSupported])

  const cancel = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }, [isSupported])

  const selectVoice = useCallback(
    (name: string) => {
      const voice = voices.find((v) => v.name === name)
      if (voice) setSelectedVoice(voice)
    },
    [voices]
  )

  return {
    isSpeaking,
    speak,
    stop,
    cancel,
    voices,
    selectedVoice,
    selectVoice,
    isSupported,
  }
}
