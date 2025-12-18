'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Badge, cn } from '@clarity-chat/primitives'
import { useVoiceInput } from '../hooks/use-voice-input'
import { useQuantumVoice, type QuantumVoiceState } from '../hooks/use-quantum-voice'
import type { ReactNode } from 'react'

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
  icon?: ReactNode

  /** Custom icon when listening */
  listeningIcon?: ReactNode

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

  /** Quantum voice enhancement state */
  quantumVoice?: QuantumVoiceState

  /** Enable quantum voice features */
  enableQuantumVoice?: boolean

  /** Quantum voice features configuration */
  quantumFeatures?: Partial<{
    realTimeProcessing: boolean
    adaptiveRecognition: boolean
    noiseCancellation: boolean
    emotionDetection: boolean
    accentAdaptation: boolean
    quantumEnhancements: boolean
  }>
}

/**
 * Variant to button variant mapping
 */
const variantMap = {
  primary: 'default' as const,
  secondary: 'secondary' as const,
  ghost: 'ghost' as const,
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
 *     logger.debug('Voice input:', text)
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
 *   onStart={() => logger.debug('Started listening')}
 *   onStop={() => logger.debug('Stopped listening')}
 *   onError={(err) => logger.logger.error('Voice error:', err)}
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
  quantumVoice,
  enableQuantumVoice = false,
  quantumFeatures,
}: VoiceInputProps) {
  const [showTranscript, setShowTranscript] = React.useState(false)
  const lastFinalTranscriptRef = React.useRef('')

  // Initialize quantum voice if enabled
  const quantumVoiceState = useQuantumVoice({
    enabled: enableQuantumVoice,
    features: quantumFeatures,
    onProcessingStart: () => {
      console.log('Quantum voice processing started')
    },
    onProcessingEnd: () => {
      console.log('Quantum voice processing completed')
    },
    onEmotionChange: (emotion) => {
      console.log('Emotion detected:', emotion)
      // Could adjust UI based on emotion
    },
  })

  const voiceQuantum = quantumVoice || quantumVoiceState

  // React 19: Config object with callbacks - compiler intelligently handles
  // Note: In production, consider keeping useMemo if this causes re-initialization issues
  const voiceConfig = {
    lang,
    continuous: false,
    interimResults: showInterim,
    autoStopTimeout: autoSubmit ? 2000 : 0,
    onTranscript: (text: string, isFinal: boolean) => {
      if (isFinal) {
        lastFinalTranscriptRef.current = text
        if (autoSubmit) {
          onTranscript(text)
          // Reset handled in handleToggle
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
    onError: (error: string) => {
      setShowTranscript(false)
      onError?.(error)
    },
  }

  const voice = useVoiceInput(voiceConfig)

  /**
   * Toggle listening - memoized to prevent recreation
   */
  // React 19: Compiler optimizes - no useCallback needed
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
   * Manual submit - memoized to prevent recreation
   */
  // React 19: Compiler optimizes
  const handleSubmit = () => {
    if (voice.transcript) {
      onTranscript(voice.transcript)
      voice.resetTranscript()
      voice.stopListening()
      setShowTranscript(false)
    }
  }

  /**
   * Cancel - memoized to prevent recreation
   */
  // React 19: Compiler optimizes
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
      <div className="relative">
        <Button
          size={size === 'sm' ? 'icon' : size === 'lg' ? 'lg' : 'icon'}
          variant={variant === 'primary' ? 'default' : variant === 'secondary' ? 'secondary' : 'ghost'}
          onClick={handleToggle}
          disabled={disabled}
          className={cn(
            'rounded-full transition-all duration-200',
            voice.isListening && [
              'bg-destructive text-destructive-foreground',
              'shadow-[0_0_20px_-4px_hsl(var(--destructive)/0.5)]',
              'scale-105',
            ],
            !voice.isListening && 'hover:scale-105',
            className
          )}
          aria-label={voice.isListening ? 'Stop recording' : tooltipText || 'Start voice input'}
          title={voice.isListening ? 'Stop recording' : tooltipText}
        >
          {/* Enhanced pulse animation when listening */}
          {voice.isListening && (
            <>
              <motion.div
                className="absolute inset-0 rounded-full bg-destructive"
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 1.8, opacity: 0 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
              />
              <motion.div
                className="absolute inset-0 rounded-full bg-destructive"
                initial={{ scale: 1, opacity: 0.3 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: [0.25, 0.1, 0.25, 1],
                  delay: 0.5,
                }}
              />
            </>
          )}

          {/* Icon */}
          <span className="relative z-10">
            {voice.isListening
              ? listeningIcon || (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <rect x="7" y="6" width="2" height="8" rx="1" />
                    <rect x="11" y="6" width="2" height="8" rx="1" />
                  </svg>
                )
              : icon || (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z" />
                    <path d="M5.5 9.643a.75.75 0 00-1.5 0V10c0 3.06 2.29 5.585 5.25 5.954V17.5h-1.5a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-1.5v-1.546A6.001 6.001 0 0016 10v-.357a.75.75 0 00-1.5 0V10a4.5 4.5 0 01-9 0v-.357z" />
                  </svg>
                )}
          </span>
        </Button>
      </div>

      {/* Transcript popup */}
      <AnimatePresence>
        {showTranscript && (voice.transcript || voice.isListening) && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ 
              // Framer Motion 12: Spring entrance for voice panel
              type: 'spring',
              damping: 20,
              stiffness: 300,
            }}
            className="absolute bottom-full right-0 mb-2 min-w-[280px] max-w-md p-4 bg-card/95 border border-border/40 shadow-xl rounded-2xl z-[var(--z-popover)] backdrop-blur-lg"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                {voice.isListening && (
                  <Badge variant="destructive" pulse>
                    Recording
                  </Badge>
                )}
                {!voice.isListening && (
                  <span className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z" />
                    </svg>
                    Voice Input
                  </span>
                )}
                {quantumVoiceState.isEnhanced && (
                  <Badge variant="outline" className="text-xs">
                    Quantum
                  </Badge>
                )}
              </div>

              <Button
                size="sm"
                variant="ghost"
                onClick={handleCancel}
                className="h-6 w-6 p-0"
                aria-label="Cancel"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Button>
            </div>

            {/* Waveform visualization when listening */}
            {voice.isListening && (
              <div className="mb-3 flex items-center justify-center gap-1.5 h-12">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={cn(
                      "w-1 rounded-full",
                      quantumVoiceState.isEnhanced ? "bg-quantum-primary" : "bg-destructive"
                    )}
                    animate={{
                      height: voiceQuantum.features.quantumEnhancements 
                        ? [`${12 + Math.random() * 8}px`, `${32 + Math.random() * 16}px`, `${12 + Math.random() * 8}px`]
                        : ['12px', '32px', '12px'],
                    }}
                    transition={{
                      duration: quantumVoiceState.features.realTimeProcessing ? 0.4 : 0.8,
                      repeat: Infinity,
                      ease: quantumVoiceState.features.quantumEnhancements ? [0.16, 1, 0.3, 1] : [0.25, 0.1, 0.25, 1],
                      delay: quantumVoiceState.features.quantumEnhancements ? i * 0.05 : i * 0.1,
                    }}
                  />
                ))}
              </div>
            )}

            {/* Transcript text */}
            <div className="mb-3 min-h-[60px] max-h-[120px] overflow-y-auto p-3 bg-muted/30 border border-border/40 rounded-xl">
              {voice.transcript ? (
                <p className="text-sm text-foreground">
                  {voice.finalTranscript && (
                    <span className="font-medium">{voice.finalTranscript}</span>
                  )}
                  {voice.interimTranscript && (
                    <span className="text-muted-foreground italic">
                      {' '}
                      {voice.interimTranscript}
                    </span>
                  )}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Start speaking...
                </p>
              )}
            </div>

            {/* Error message */}
            {voice.error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-3 p-3 bg-destructive/10 border border-destructive/30 rounded-xl">
                <div className="flex items-start gap-2">
                  <svg
                    className="h-4 w-4 text-destructive shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-sm text-destructive">{voice.error}</p>
                </div>
              </motion.div>
            )}

            {/* Actions */}
            {!autoSubmit && voice.transcript && (
              <div className="flex gap-2.5">
                <Button size="sm" onClick={handleSubmit} className="flex-1">
                  Send
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            )}

            {/* Confidence indicator */}
            {voice.confidence > 0 && (
              <div className="mt-3 pt-3 border-t border-border/40 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    Confidence
                  </span>
                  <Badge
                    variant={
                      voice.confidence >= 0.8
                        ? 'success'
                        : voice.confidence >= 0.5
                          ? 'warning'
                          : 'secondary'
                    }
                  >
                    {Math.round(voice.confidence * 100)}%
                  </Badge>
                </div>
                <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-green-500/80 to-green-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${voice.confidence * 100}%` }}
                    transition={{ 
                      // Framer Motion 12: Spring confidence bar
                      type: 'spring',
                      damping: 28,
                      stiffness: 250,
                    }}
                  />
                </div>
                {quantumVoiceState.isEnhanced && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">
                        Processing
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {Math.round(quantumVoiceState.processingSpeed)}ms
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">
                        Emotion
                      </span>
                      <Badge variant="outline" className="text-xs capitalize">
                        {quantumVoiceState.emotion}
                      </Badge>
                    </div>
                  </>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tooltip */}
      {showTooltip && !voice.isListening && !showTranscript && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-foreground text-background text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
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
    <div
      className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${className}`}
    >
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
