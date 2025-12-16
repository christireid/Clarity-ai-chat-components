'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Textarea, cn } from '@clarity-chat/primitives'
import { duration, easing, animationUtils } from '../animations/enhanced-constants'
import { MicIcon, MicOffIcon, SendIcon, PaperclipIcon, SmileIcon } from './icons'

export interface EnhancedChatInputProps {
  onSendMessage: (content: string) => void
  isLoading?: boolean
  placeholder?: string
  disabled?: boolean
  maxLength?: number
  className?: string
  /**
   * Enable voice input with waveform visualization
   */
  voiceInput?: boolean
  /**
   * Animation variant for 2025 trends
   */
  animationVariant?: 'quantum' | 'aurora' | 'glass' | 'neumorphic' | 'classic'
  /**
   * Glassmorphism intensity (0-1)
   */
  glassIntensity?: number
  /**
   * Neumorphism depth level
   */
  neumorphicDepth?: 'shallow' | 'normal' | 'deep' | 'extreme'
  /**
   * AI-powered adaptive animations
   */
  adaptiveAnimations?: boolean
  /**
   * Predictive text suggestions
   */
  predictiveText?: boolean
  /**
   * Emoji picker integration
   */
  emojiPicker?: boolean
  /**
   * File attachment support
   */
  fileAttachment?: boolean
  /**
   * Real-time typing indicators
   */
  typingIndicator?: boolean
}

/**
 * Enhanced Chat Input Component with 2025 trends
 */
export function EnhancedChatInput({
  onSendMessage,
  isLoading,
  placeholder = "Type your message...",
  disabled = false,
  maxLength = 4000,
  className,
  voiceInput = false,
  animationVariant = 'quantum',
  glassIntensity = 0.2,
  neumorphicDepth = 'normal',
  adaptiveAnimations = true,
  predictiveText = false,
  emojiPicker = false,
  fileAttachment = false,
  typingIndicator = false,
}: EnhancedChatInputProps) {
  const [message, setMessage] = React.useState('')
  const [isRecording, setIsRecording] = React.useState(false)
  const [audioLevel, setAudioLevel] = React.useState(0)
  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false)
  const [showPredictions, setShowPredictions] = React.useState(false)
  const [suggestions, setSuggestions] = React.useState<string[]>([])
  
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // Adaptive animation timing
  const getAdaptiveTiming = React.useCallback((baseDuration: number) => {
    if (!adaptiveAnimations) return baseDuration
    
    // Simulate AI factors
    const factors = {
      userEngagement: Math.random(),
      messageLength: message.length / maxLength,
      typingSpeed: Math.random(),
      conversationContext: Math.random(),
      timeOfDay: Math.random(),
    }
    
    return animationUtils.calculateAdaptiveDuration(baseDuration, factors)
  }, [adaptiveAnimations, message.length, maxLength])

  // Voice recording simulation
  React.useEffect(() => {
    let interval: NodeJS.Timeout
    
    if (isRecording) {
      interval = setInterval(() => {
        setAudioLevel(Math.random() * 100)
      }, 100)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRecording])

  // Predictive text simulation
  React.useEffect(() => {
    if (predictiveText && message.length > 2) {
      // Simulate AI predictions
      const mockSuggestions = [
        'What do you think about',
        'Can you help me with',
        'I would like to know',
        'How can I',
        'What is the best way to',
      ].filter(s => s.toLowerCase().includes(message.toLowerCase().slice(0, 10)))
      
      setSuggestions(mockSuggestions.slice(0, 3))
      setShowPredictions(mockSuggestions.length > 0)
    } else {
      setShowPredictions(false)
    }
  }, [message, predictiveText])

  const handleSend = React.useCallback(() => {
    if (!message.trim() || isLoading) return
    
    onSendMessage(message.trim())
    setMessage('')
    setShowPredictions(false)
  }, [message, isLoading, onSendMessage])

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }, [handleSend])

  const handleVoiceToggle = React.useCallback(() => {
    setIsRecording(!isRecording)
    if (!isRecording) {
      // Simulate voice recording start
      setAudioLevel(0)
    } else {
      // Simulate voice recording end
      setAudioLevel(0)
      // Convert voice to text (simulated)
      const voiceText = `Voice message: "${Math.random().toString(36).substring(7)}"`
      setMessage(voiceText)
    }
  }, [isRecording])

  const handleFileSelect = React.useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      // Simulate file attachment
      const fileNames = Array.from(files).map(file => file.name).join(', ')
      setMessage(`📎 Attached files: ${fileNames}`)
    }
  }, [])

  const handleEmojiSelect = React.useCallback((emoji: string) => {
    setMessage(prev => prev + emoji)
    setShowEmojiPicker(false)
  }, [])

  const handleSuggestionClick = React.useCallback((suggestion: string) => {
    setMessage(suggestion)
    setShowPredictions(false)
    textareaRef.current?.focus()
  }, [])

  // Get input styling based on animation variant
  const getInputStyling = React.useCallback(() => {
    const baseStyles = 'w-full resize-none border-0 focus:outline-none focus:ring-0'
    
    switch (animationVariant) {
      case 'glass':
        return cn(
          baseStyles,
          'bg-white/20 backdrop-blur-lg placeholder-gray-400',
          'rounded-2xl border border-white/30',
          'focus:bg-white/30 focus:border-white/50'
        )
      case 'neumorphic':
        return cn(
          baseStyles,
          'bg-gray-100 placeholder-gray-500',
          'rounded-xl shadow-neumorphic',
          'focus:shadow-neumorphic-inset'
        )
      case 'aurora':
        return cn(
          baseStyles,
          'bg-gradient-to-r from-purple-100 to-pink-100 placeholder-gray-600',
          'rounded-2xl border border-purple-200',
          'focus:from-purple-50 focus:to-pink-50 focus:border-purple-300'
        )
      default:
        return cn(
          baseStyles,
          'bg-white border border-gray-300 rounded-xl',
          'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
        )
    }
  }, [animationVariant])

  return (
    <div className={cn(
      'relative',
      animationVariant === 'glass' && 'bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-4',
      animationVariant === 'neumorphic' && 'bg-gray-100 rounded-2xl p-4 shadow-neumorphic',
      animationVariant === 'aurora' && 'bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-4',
      className
    )}>
      <div className="flex items-end gap-3">
        {/* Enhanced textarea with 2025 styling */}
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isLoading}
            maxLength={maxLength}
            className={getInputStyling()}
            rows={1}
            style={{ minHeight: '60px' }}
          />
          
          {/* Character counter */}
          {message.length > maxLength * 0.8 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute bottom-2 right-2 text-xs text-gray-500"
            >
              {message.length}/{maxLength}
            </motion.div>
          )}
          
          {/* Predictive text suggestions */}
          <AnimatePresence>
            {showPredictions && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={cn(
                  'absolute top-full left-0 right-0 mt-2 p-2 rounded-lg shadow-lg z-10',
                  animationVariant === 'glass' && 'bg-white/90 backdrop-blur-lg border border-white/30',
                  animationVariant === 'neumorphic' && 'bg-gray-50 shadow-neumorphic',
                  animationVariant === 'aurora' && 'bg-gradient-to-br from-purple-50 to-pink-50'
                )}
              >
                {suggestions.map((suggestion, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={cn(
                      'w-full text-left p-2 rounded text-sm hover:bg-gray-100 transition-colors',
                      'border-b border-gray-200 last:border-b-0'
                    )}
                  >
                    {suggestion}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Action buttons with 2025 styling */}
        <div className="flex gap-2">
          {/* File attachment */}
          {fileAttachment && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleFileSelect}
              disabled={disabled || isLoading}
              className={cn(
                'p-3 rounded-full transition-colors',
                animationVariant === 'glass' && 'bg-white/20 backdrop-blur-lg hover:bg-white/30',
                animationVariant === 'neumorphic' && 'bg-gray-200 shadow-neumorphic hover:shadow-neumorphic-inset',
                animationVariant === 'aurora' && 'bg-gradient-to-br from-purple-200 to-pink-200 hover:from-purple-300 hover:to-pink-300'
              )}
            >
              <PaperclipIcon className="w-5 h-5" />
            </motion.button>
          )}
          
          {/* Emoji picker */}
          {emojiPicker && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              disabled={disabled || isLoading}
              className={cn(
                'p-3 rounded-full transition-colors',
                animationVariant === 'glass' && 'bg-white/20 backdrop-blur-lg hover:bg-white/30',
                animationVariant === 'neumorphic' && 'bg-gray-200 shadow-neumorphic hover:shadow-neumorphic-inset',
                animationVariant === 'aurora' && 'bg-gradient-to-br from-purple-200 to-pink-200 hover:from-purple-300 hover:to-pink-300'
              )}
            >
              <SmileIcon className="w-5 h-5" />
            </motion.button>
          )}
          
          {/* Voice input */}
          {voiceInput && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleVoiceToggle}
              disabled={disabled || isLoading}
              className={cn(
                'p-3 rounded-full transition-colors relative',
                isRecording && 'bg-red-500 text-white',
                !isRecording && animationVariant === 'glass' && 'bg-white/20 backdrop-blur-lg hover:bg-white/30',
                !isRecording && animationVariant === 'neumorphic' && 'bg-gray-200 shadow-neumorphic hover:shadow-neumorphic-inset',
                !isRecording && animationVariant === 'aurora' && 'bg-gradient-to-br from-purple-200 to-pink-200 hover:from-purple-300 hover:to-pink-300'
              )}
            >
              {isRecording ? (
                <MicOffIcon className="w-5 h-5" />
              ) : (
                <MicIcon className="w-5 h-5" />
              )}
              
              {/* Voice waveform visualization */}
              {isRecording && (
                <motion.div
                  className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center gap-1">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <motion.div
                        key={i}
                        animate={{
                          height: [4, 8 + audioLevel * 0.1, 4],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                          duration: 0.5,
                          repeat: Infinity,
                          delay: i * 0.1
                        }}
                        className="w-1 bg-white rounded-full"
                      />
                    ))}
                  </div>
                  Recording...
                </motion.div>
              )}
            </motion.button>
          )}
          
          {/* Send button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!message.trim() || isLoading || disabled}
            className={cn(
              'p-3 rounded-full transition-colors',
              (!message.trim() || isLoading || disabled) && 'opacity-50 cursor-not-allowed',
              message.trim() && !isLoading && !disabled && animationVariant === 'glass' && 'bg-blue-500/80 backdrop-blur-lg hover:bg-blue-600/80 text-white',
              message.trim() && !isLoading && !disabled && animationVariant === 'neumorphic' && 'bg-blue-500 shadow-neumorphic-convex hover:bg-blue-600 text-white',
              message.trim() && !isLoading && !disabled && animationVariant === 'aurora' && 'bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
            )}
          >
            <SendIcon className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
      
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
      />
      
      {/* Emoji picker modal */}
      <AnimatePresence>
        {showEmojiPicker && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={cn(
              'absolute bottom-full left-0 mb-2 p-4 rounded-xl shadow-xl z-20',
              animationVariant === 'glass' && 'bg-white/90 backdrop-blur-lg border border-white/30',
              animationVariant === 'neumorphic' && 'bg-gray-50 shadow-neumorphic',
              animationVariant === 'aurora' && 'bg-gradient-to-br from-purple-50 to-pink-50'
            )}
          >
            <div className="grid grid-cols-8 gap-1 text-2xl">
              {['😀', '😂', '🥰', '😍', '🤔', '😎', '🤗', '😴', '🤤', '😋', '🙄', '😮', '🥳', '😇', '🤩', '🤯'].map((emoji, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.02 }}
                  onClick={() => handleEmojiSelect(emoji)}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                >
                  {emoji}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * Default export for backward compatibility
 */
export default EnhancedChatInput