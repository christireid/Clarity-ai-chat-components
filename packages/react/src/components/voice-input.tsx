import * as React from 'react'
import { useVoiceInput } from '../hooks/use-voice-input'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Voice input component props
 */
export interface VoiceInputProps {
  /** Callback when transcript is finalized */
  onTranscript: (transcript: string) => void
  
  /** Language code (e.g., 'en-US', 'es-ES') */
  lang?: string
  
  /** Show real-time interim results */
  showInterim?: boolean
  
  /** Auto-submit on speech end */
  autoSubmit?: boolean
  
  /** Button size */
  size?: 'sm' | 'md' | 'lg'
  
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'ghost'
  
  /** Custom icon when not listening */
  icon?: React.ReactNode
  
  /** Custom icon when listening */
  listeningIcon?: React.ReactNode
  
  /** Show tooltip */
  showTooltip?: boolean
  
  /** Tooltip text */
  tooltipText?: string
  
  /** Disabled state */
  disabled?: boolean
  
  /** Custom CSS class */
  className?: string
  
  /** Callback when listening starts */
  onStart?: () => void
  
  /** Callback when listening stops */
  onStop?: () => void
  
  /** Callback on error */
  onError?: (error: string) => void
}

/**
 * Size styles
 */
const sizeStyles = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
}

/**
 * Variant styles
 */
const variantStyles = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100',
  ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400',
}

/**
 * Production-ready Voice Input component with Web Speech API.
 * 
 * **Features:**
 * - One-click voice recording
 * - Real-time transcription display
 * - Visual feedback (pulse animation)
 * - Auto-submit on speech end
 * - Multi-language support
 * - Error handling with user feedback
 * - Accessibility support
 * 
 * **Use Cases:**
 * - Voice message input
 * - Hands-free chat
 * - Accessibility feature
 * - Mobile-friendly input
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <VoiceInput
 *   onTranscript={(text) => {
 *     console.log('Voice input:', text)
 *     sendMessage(text)
 *   }}
 * />
 * 
 * // With custom styling
 * <VoiceInput
 *   onTranscript={handleVoiceInput}
 *   size="lg"
 *   variant="primary"
 *   showInterim={true}
 *   autoSubmit={true}
 * />
 * 
 * // Multi-language
 * <VoiceInput
 *   onTranscript={handleInput}
 *   lang="es-ES"
 *   tooltipText="Habla en español"
 * />
 * 
 * // With callbacks
 * <VoiceInput
 *   onTranscript={handleInput}
 *   onStart={() => console.log('Started listening')}
 *   onStop={() => console.log('Stopped listening')}
 *   onError={(err) => console.error('Voice error:', err)}
 * />
 * ```
 */
export function VoiceInput({
  onTranscript,
  lang = 'en-US',
  showInterim = true,
  autoSubmit = true,
  size = 'md',
  variant = 'ghost',
  icon,
  listeningIcon,
  showTooltip = true,
  tooltipText = 'Click to speak',
  disabled = false,
  className = '',
  onStart,
  onStop,
  onError,
}: VoiceInputProps) {
  const [showTranscript, setShowTranscript] = React.useState(false)
  const lastFinalTranscriptRef = React.useRef('')

  const voice = useVoiceInput({
    lang,
    continuous: false,
    interimResults: showInterim,
    autoStopTimeout: autoSubmit ? 2000 : 0,
    onTranscript: (text, isFinal) => {
      if (isFinal) {
        lastFinalTranscriptRef.current = text
        if (autoSubmit) {
          onTranscript(text)
          voice.resetTranscript()
          setShowTranscript(false)
        }
      }
    },
    onSpeechStart: () => {
      setShowTranscript(true)
      onStart?.()
    },
    onSpeechEnd: () => {
      onStop?.()
    },
    onError: (error) => {
      setShowTranscript(false)
      onError?.(error)
    },
  })

  /**
   * Toggle listening
   */
  const handleToggle = () => {
    if (voice.isListening) {
      voice.stopListening()
      
      // Submit final transcript if not auto-submit
      if (!autoSubmit && voice.finalTranscript) {
        onTranscript(voice.finalTranscript)
      }
      
      setShowTranscript(false)
    } else {
      voice.resetTranscript()
      voice.startListening()
    }
  }

  /**
   * Manual submit
   */
  const handleSubmit = () => {
    if (voice.transcript) {
      onTranscript(voice.transcript)
      voice.resetTranscript()
      voice.stopListening()
      setShowTranscript(false)
    }
  }

  /**
   * Cancel
   */
  const handleCancel = () => {
    voice.stopListening()
    voice.resetTranscript()
    setShowTranscript(false)
  }

  if (!voice.isSupported) {
    return (
      <div className="text-sm text-gray-500 dark:text-gray-500">
        Voice input not supported in this browser
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Voice button */}
      <button
        onClick={handleToggle}
        disabled={disabled}
        className={`
          relative rounded-full flex items-center justify-center
          transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          ${sizeStyles[size]}
          ${voice.isListening ? 'bg-red-500 hover:bg-red-600 text-white' : variantStyles[variant]}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${className}
        `}
        aria-label={voice.isListening ? 'Stop recording' : 'Start recording'}
        title={voice.isListening ? 'Stop recording' : tooltipText}
      >
        {/* Pulse animation when listening */}
        {voice.isListening && (
          <motion.div
            className="absolute inset-0 rounded-full bg-red-500"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        )}

        {/* Icon */}
        <span className="relative z-10">
          {voice.isListening ? (
            listeningIcon || (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <rect x="7" y="6" width="2" height="8" rx="1" />
                <rect x="11" y="6" width="2" height="8" rx="1" />
              </svg>
            )
          ) : (
            icon || (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z" />
                <path d="M5.5 9.643a.75.75 0 00-1.5 0V10c0 3.06 2.29 5.585 5.25 5.954V17.5h-1.5a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-1.5v-1.546A6.001 6.001 0 0016 10v-.357a.75.75 0 00-1.5 0V10a4.5 4.5 0 01-9 0v-.357z" />
              </svg>
            )
          )}
        </span>
      </button>

      {/* Transcript popup */}
      <AnimatePresence>
        {showTranscript && (voice.transcript || voice.isListening) && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full right-0 mb-2 min-w-[280px] max-w-md p-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {voice.isListening && (
                  <motion.div
                    className="w-2 h-2 bg-red-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {voice.isListening ? 'Listening...' : 'Voice Input'}
                </span>
              </div>
              
              <button
                onClick={handleCancel}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                aria-label="Cancel"
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Transcript text */}
            <div className="mb-3 min-h-[60px] max-h-[120px] overflow-y-auto">
              {voice.transcript ? (
                <p className="text-sm text-gray-900 dark:text-gray-100">
                  {voice.finalTranscript && (
                    <span className="font-medium">{voice.finalTranscript}</span>
                  )}
                  {voice.interimTranscript && (
                    <span className="text-gray-500 dark:text-gray-500 italic">
                      {voice.interimTranscript}
                    </span>
                  )}
                </p>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-500 italic">
                  Start speaking...
                </p>
              )}
            </div>

            {/* Error message */}
            {voice.error && (
              <div className="mb-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-sm text-red-700 dark:text-red-400">
                {voice.error}
              </div>
            )}

            {/* Actions */}
            {!autoSubmit && voice.transcript && (
              <div className="flex gap-2">
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                >
                  Send
                </button>
                <button
                  onClick={handleCancel}
                  className="px-3 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 text-sm rounded transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Confidence indicator */}
            {voice.confidence > 0 && (
              <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                  <span>Confidence</span>
                  <span>{Math.round(voice.confidence * 100)}%</span>
                </div>
                <div className="mt-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all duration-300"
                    style={{ width: `${voice.confidence * 100}%` }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tooltip */}
      {showTooltip && !voice.isListening && !showTranscript && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {tooltipText}
        </div>
      )}
    </div>
  )
}

/**
 * Inline voice input component
 * Integrates with text input fields
 */
export interface InlineVoiceInputProps {
  /** Current input value */
  value: string
  
  /** Callback when value changes */
  onChange: (value: string) => void
  
  /** Language code */
  lang?: string
  
  /** Show in input field */
  position?: 'inside' | 'outside'
  
  /** Custom CSS class */
  className?: string
}

export function InlineVoiceInput({
  value,
  onChange,
  lang = 'en-US',
  position = 'inside',
  className = '',
}: InlineVoiceInputProps) {
  const handleTranscript = (transcript: string) => {
    // Append to existing value or replace
    const newValue = value ? `${value} ${transcript}` : transcript
    onChange(newValue)
  }

  if (position === 'outside') {
    return (
      <VoiceInput
        onTranscript={handleTranscript}
        lang={lang}
        size="md"
        variant="ghost"
        showInterim={true}
        autoSubmit={true}
        className={className}
      />
    )
  }

  return (
    <div className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${className}`}>
      <VoiceInput
        onTranscript={handleTranscript}
        lang={lang}
        size="sm"
        variant="ghost"
        showInterim={true}
        autoSubmit={true}
      />
    </div>
  )
}
