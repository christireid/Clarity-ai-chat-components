import * as React from 'react'

/**
 * Voice recognition state
 */
export interface VoiceInputState {
  /** Whether voice recognition is currently listening */
  isListening: boolean
  /** Current transcript (interim + final) */
  transcript: string
  /** Final transcript (confirmed text) */
  finalTranscript: string
  /** Interim transcript (real-time, may change) */
  interimTranscript: string
  /** Whether speech recognition is supported */
  isSupported: boolean
  /** Error message if any */
  error: string | null
  /** Confidence score (0-1) of last recognition */
  confidence: number
}

/**
 * Voice recognition options
 */
export interface UseVoiceInputOptions {
  /** Language code (e.g., 'en-US', 'es-ES') */
  lang?: string
  /** Continuous listening mode */
  continuous?: boolean
  /** Return interim results */
  interimResults?: boolean
  /** Maximum alternatives to return */
  maxAlternatives?: number
  /** Auto-stop after silence (ms) */
  autoStopTimeout?: number
  /** Callback when transcript updates */
  onTranscript?: (transcript: string, isFinal: boolean) => void
  /** Callback when speech starts */
  onSpeechStart?: () => void
  /** Callback when speech ends */
  onSpeechEnd?: () => void
  /** Callback on error */
  onError?: (error: string) => void
}

/**
 * Get browser speech recognition API
 */
function getSpeechRecognition(): typeof SpeechRecognition | null {
  if (typeof window === 'undefined') return null
  
  return (
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition ||
    null
  )
}

/**
 * Production-ready voice input hook with Web Speech API.
 * 
 * **Features:**
 * - Real-time speech-to-text
 * - Continuous and single-shot modes
 * - Interim and final transcripts
 * - Multi-language support
 * - Confidence scores
 * - Auto-stop on silence
 * - Browser compatibility detection
 * 
 * **Browser Support:**
 * - ✅ Chrome/Edge (best support)
 * - ✅ Safari (iOS 14.5+, macOS 14.3+)
 * - ❌ Firefox (not yet supported)
 * - ❌ Mobile Firefox/Samsung Internet
 * 
 * **Use Cases:**
 * - Voice-to-text input for chat
 * - Voice commands
 * - Accessibility features
 * - Hands-free operation
 * 
 * @example
 * ```tsx
 * // Basic usage
 * function VoiceButton() {
 *   const {
 *     isListening,
 *     transcript,
 *     startListening,
 *     stopListening,
 *     isSupported
 *   } = useVoiceInput()
 *   
 *   if (!isSupported) {
 *     return <div>Voice input not supported</div>
 *   }
 *   
 *   return (
 *     <div>
 *       <button onClick={isListening ? stopListening : startListening}>
 *         {isListening ? 'Stop' : 'Start'} Listening
 *       </button>
 *       <p>{transcript}</p>
 *     </div>
 *   )
 * }
 * 
 * // Continuous mode with callbacks
 * function VoiceChat() {
 *   const [messages, setMessages] = useState<string[]>([])
 *   
 *   const voice = useVoiceInput({
 *     continuous: true,
 *     interimResults: true,
 *     onTranscript: (text, isFinal) => {
 *       if (isFinal) {
 *         setMessages(prev => [...prev, text])
 *       }
 *     }
 *   })
 *   
 *   return <div>...</div>
 * }
 * 
 * // Multi-language support
 * function MultilingualVoice() {
 *   const [lang, setLang] = useState('en-US')
 *   
 *   const voice = useVoiceInput({
 *     lang,
 *     continuous: true,
 *     autoStopTimeout: 3000
 *   })
 *   
 *   return (
 *     <div>
 *       <select value={lang} onChange={e => setLang(e.target.value)}>
 *         <option value="en-US">English (US)</option>
 *         <option value="es-ES">Spanish</option>
 *         <option value="fr-FR">French</option>
 *         <option value="zh-CN">Chinese</option>
 *       </select>
 *     </div>
 *   )
 * }
 * ```
 */
export function useVoiceInput(options: UseVoiceInputOptions = {}) {
  const {
    lang = 'en-US',
    continuous = false,
    interimResults = true,
    maxAlternatives = 1,
    autoStopTimeout = 0,
    onTranscript,
    onSpeechStart,
    onSpeechEnd,
    onError,
  } = options

  const [state, setState] = React.useState<VoiceInputState>(() => {
    const SpeechRecognition = getSpeechRecognition()
    return {
      isListening: false,
      transcript: '',
      finalTranscript: '',
      interimTranscript: '',
      isSupported: SpeechRecognition !== null,
      error: null,
      confidence: 0,
    }
  })

  const recognitionRef = React.useRef<any>(null)
  const autoStopTimeoutRef = React.useRef<NodeJS.Timeout>()

  /**
   * Initialize speech recognition
   */
  const initRecognition = React.useCallback(() => {
    const SpeechRecognition = getSpeechRecognition()
    if (!SpeechRecognition || recognitionRef.current) return

    const recognition = new SpeechRecognition()
    recognition.lang = lang
    recognition.continuous = continuous
    recognition.interimResults = interimResults
    recognition.maxAlternatives = maxAlternatives

    // Handle results
    recognition.onresult = (event: any) => {
      let interimTranscript = ''
      let finalTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        const transcript = result[0].transcript
        const confidence = result[0].confidence

        if (result.isFinal) {
          finalTranscript += transcript
          setState((prev) => ({
            ...prev,
            finalTranscript: prev.finalTranscript + transcript,
            transcript: prev.finalTranscript + transcript,
            confidence,
            error: null,
          }))
          onTranscript?.(transcript, true)
        } else {
          interimTranscript += transcript
          setState((prev) => ({
            ...prev,
            interimTranscript,
            transcript: prev.finalTranscript + interimTranscript,
            error: null,
          }))
          onTranscript?.(interimTranscript, false)
        }
      }

      // Reset auto-stop timer on new results
      if (autoStopTimeout > 0) {
        if (autoStopTimeoutRef.current) {
          clearTimeout(autoStopTimeoutRef.current)
        }
        autoStopTimeoutRef.current = setTimeout(() => {
          stopListening()
        }, autoStopTimeout)
      }
    }

    // Handle speech start
    recognition.onspeechstart = () => {
      onSpeechStart?.()
    }

    // Handle speech end
    recognition.onspeechend = () => {
      onSpeechEnd?.()
      
      if (!continuous) {
        stopListening()
      }
    }

    // Handle errors
    recognition.onerror = (event: any) => {
      let errorMessage = 'Speech recognition error'
      
      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No speech detected'
          break
        case 'audio-capture':
          errorMessage = 'No microphone found'
          break
        case 'not-allowed':
          errorMessage = 'Microphone permission denied'
          break
        case 'network':
          errorMessage = 'Network error occurred'
          break
        case 'aborted':
          errorMessage = 'Recognition aborted'
          break
        default:
          errorMessage = `Recognition error: ${event.error}`
      }

      setState((prev) => ({
        ...prev,
        error: errorMessage,
        isListening: false,
      }))

      onError?.(errorMessage)
    }

    // Handle end
    recognition.onend = () => {
      setState((prev) => ({
        ...prev,
        isListening: false,
        interimTranscript: '',
      }))

      if (autoStopTimeoutRef.current) {
        clearTimeout(autoStopTimeoutRef.current)
      }
    }

    recognitionRef.current = recognition
  }, [
    lang,
    continuous,
    interimResults,
    maxAlternatives,
    autoStopTimeout,
    onTranscript,
    onSpeechStart,
    onSpeechEnd,
    onError,
  ])

  /**
   * Start listening
   */
  const startListening = React.useCallback(() => {
    if (!state.isSupported) {
      const errorMsg = 'Speech recognition not supported in this browser'
      setState((prev) => ({ ...prev, error: errorMsg }))
      onError?.(errorMsg)
      return
    }

    if (!recognitionRef.current) {
      initRecognition()
    }

    if (recognitionRef.current && !state.isListening) {
      try {
        recognitionRef.current.start()
        setState((prev) => ({
          ...prev,
          isListening: true,
          error: null,
        }))
      } catch (error) {
        if (error instanceof Error && error.message.includes('already started')) {
          // Recognition is already running, just update state
          setState((prev) => ({ ...prev, isListening: true }))
        } else {
          const errorMsg = 'Failed to start speech recognition'
          setState((prev) => ({ ...prev, error: errorMsg }))
          onError?.(errorMsg)
        }
      }
    }
  }, [state.isSupported, state.isListening, initRecognition, onError])

  /**
   * Stop listening
   */
  const stopListening = React.useCallback(() => {
    if (recognitionRef.current && state.isListening) {
      recognitionRef.current.stop()
      setState((prev) => ({
        ...prev,
        isListening: false,
        interimTranscript: '',
      }))

      if (autoStopTimeoutRef.current) {
        clearTimeout(autoStopTimeoutRef.current)
      }
    }
  }, [state.isListening])

  /**
   * Reset transcript
   */
  const resetTranscript = React.useCallback(() => {
    setState((prev) => ({
      ...prev,
      transcript: '',
      finalTranscript: '',
      interimTranscript: '',
      error: null,
    }))
  }, [])

  /**
   * Cleanup on unmount
   */
  React.useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
        recognitionRef.current = null
      }
      if (autoStopTimeoutRef.current) {
        clearTimeout(autoStopTimeoutRef.current)
      }
    }
  }, [])

  /**
   * Reinitialize when options change
   */
  React.useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
      if (state.isListening) {
        initRecognition()
        // Will auto-restart via the recognition reference
      }
    }
  }, [lang, continuous, interimResults, maxAlternatives])

  return {
    ...state,
    startListening,
    stopListening,
    resetTranscript,
  }
}

/**
 * Simplified voice input hook for basic use cases
 * Automatically manages start/stop state
 */
export function useSimpleVoiceInput(lang: string = 'en-US') {
  const [isActive, setIsActive] = React.useState(false)
  const [transcript, setTranscript] = React.useState('')

  const voice = useVoiceInput({
    lang,
    continuous: false,
    interimResults: true,
    onTranscript: (text, isFinal) => {
      if (isFinal) {
        setTranscript(text)
        setIsActive(false)
      }
    },
  })

  const toggle = React.useCallback(() => {
    if (isActive) {
      voice.stopListening()
      setIsActive(false)
    } else {
      voice.resetTranscript()
      voice.startListening()
      setIsActive(true)
    }
  }, [isActive, voice])

  return {
    isActive,
    transcript: transcript || voice.transcript,
    toggle,
    isSupported: voice.isSupported,
    error: voice.error,
  }
}
