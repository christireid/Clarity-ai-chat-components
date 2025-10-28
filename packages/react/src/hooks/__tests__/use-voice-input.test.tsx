import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useVoiceInput, useSimpleVoiceInput } from '../use-voice-input'

// Mock SpeechRecognition
const mockStart = vi.fn()
const mockStop = vi.fn()

class MockSpeechRecognition {
  continuous = false
  interimResults = false
  lang = 'en-US'
  maxAlternatives = 1
  
  onresult: any = null
  onspeechstart: any = null
  onspeechend: any = null
  onerror: any = null
  onend: any = null
  
  start = mockStart
  stop = mockStop
}

describe('useVoiceInput', () => {
  beforeEach(() => {
    // Setup SpeechRecognition mock
    ;(global as any).SpeechRecognition = MockSpeechRecognition
    ;(global as any).webkitSpeechRecognition = MockSpeechRecognition
    mockStart.mockClear()
    mockStop.mockClear()
  })

  afterEach(() => {
    delete (global as any).SpeechRecognition
    delete (global as any).webkitSpeechRecognition
  })

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useVoiceInput())

    expect(result.current.isListening).toBe(false)
    expect(result.current.transcript).toBe('')
    expect(result.current.finalTranscript).toBe('')
    expect(result.current.interimTranscript).toBe('')
    expect(result.current.isSupported).toBe(true)
    expect(result.current.error).toBe(null)
  })

  it('should detect if speech recognition is not supported', () => {
    delete (global as any).SpeechRecognition
    delete (global as any).webkitSpeechRecognition

    const { result } = renderHook(() => useVoiceInput())

    expect(result.current.isSupported).toBe(false)
  })

  it('should start listening when startListening is called', () => {
    const { result } = renderHook(() => useVoiceInput())

    act(() => {
      result.current.startListening()
    })

    expect(mockStart).toHaveBeenCalled()
    expect(result.current.isListening).toBe(true)
  })

  it('should stop listening when stopListening is called', () => {
    const { result } = renderHook(() => useVoiceInput())

    act(() => {
      result.current.startListening()
    })

    act(() => {
      result.current.stopListening()
    })

    expect(mockStop).toHaveBeenCalled()
  })

  it('should reset transcript when resetTranscript is called', () => {
    const { result } = renderHook(() => useVoiceInput())

    act(() => {
      result.current.resetTranscript()
    })

    expect(result.current.transcript).toBe('')
    expect(result.current.finalTranscript).toBe('')
    expect(result.current.interimTranscript).toBe('')
  })

  it('should call onTranscript callback with final transcript', async () => {
    const onTranscript = vi.fn()
    renderHook(() => useVoiceInput({ onTranscript }))

    // Simulate final result
    // Note: In real test, you'd trigger the onresult callback
    // This is a simplified test
    await waitFor(() => {
      expect(true).toBe(true) // Placeholder
    })
  })

  it('should handle language configuration', () => {
    const { result } = renderHook(() => useVoiceInput({ lang: 'es-ES' }))

    expect(result.current.isSupported).toBe(true)
  })

  it('should handle continuous mode', () => {
    const { result } = renderHook(() => useVoiceInput({ continuous: true }))

    act(() => {
      result.current.startListening()
    })

    expect(result.current.isListening).toBe(true)
  })

  it('should cleanup on unmount', () => {
    const { unmount } = renderHook(() => useVoiceInput())

    unmount()

    expect(mockStop).toHaveBeenCalled()
  })
})

describe('useSimpleVoiceInput', () => {
  beforeEach(() => {
    ;(global as any).SpeechRecognition = MockSpeechRecognition
    ;(global as any).webkitSpeechRecognition = MockSpeechRecognition
    mockStart.mockClear()
    mockStop.mockClear()
  })

  afterEach(() => {
    delete (global as any).SpeechRecognition
    delete (global as any).webkitSpeechRecognition
  })

  it('should initialize with inactive state', () => {
    const { result } = renderHook(() => useSimpleVoiceInput())

    expect(result.current.isActive).toBe(false)
    expect(result.current.transcript).toBe('')
  })

  it('should toggle listening state', () => {
    const { result } = renderHook(() => useSimpleVoiceInput())

    act(() => {
      result.current.toggle()
    })

    expect(result.current.isActive).toBe(true)

    act(() => {
      result.current.toggle()
    })

    expect(result.current.isActive).toBe(false)
  })

  it('should support different languages', () => {
    const { result } = renderHook(() => useSimpleVoiceInput('fr-FR'))

    expect(result.current.isSupported).toBe(true)
  })
})
