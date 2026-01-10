'use client'

import { useRef, KeyboardEvent } from 'react'
import { motion } from 'framer-motion'
import { Send, Mic, MicOff, Paperclip, Loader2 } from 'lucide-react'
import { durations } from '@/lib/animations'

interface HeroChatInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  isStreaming: boolean
  isRecording: boolean
  onToggleVoice: () => void
  maxLength?: number
  placeholder?: string
  onAttachment?: () => void
}

export function HeroChatInput({
  value,
  onChange,
  onSubmit,
  isStreaming,
  isRecording,
  onToggleVoice,
  maxLength = 4096,
  placeholder = 'Ask me anything... (Press / for commands)',
  onAttachment,
}: HeroChatInputProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSubmit()
    }
  }

  return (
    <div
      className="relative z-10 p-4 border-t border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl"
      role="form"
      aria-label="Chat input"
    >
      <div className="flex items-end gap-3">
        {/* Attachment button */}
        {onAttachment && (
          <motion.button
            onClick={onAttachment}
            className="p-2.5 min-w-[44px] min-h-[44px] rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:outline-none"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Attach file"
            aria-label="Attach file"
          >
            <Paperclip className="w-5 h-5 text-slate-500" aria-hidden="true" />
          </motion.button>
        )}

        {/* Input field */}
        <div className="flex-1 relative">
          <label htmlFor="hero-chat-input" className="sr-only">
            Type your message
          </label>
          <textarea
            id="hero-chat-input"
            ref={inputRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            maxLength={maxLength}
            className="w-full px-4 py-3.5 pr-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 transition-all"
            style={{ minHeight: '52px', maxHeight: '120px' }}
            aria-describedby="char-count"
            disabled={isStreaming}
            data-chat-input
          />
          <div
            id="char-count"
            className="absolute right-3 bottom-2.5 text-xs text-slate-400"
            aria-live="polite"
          >
            {value.length > 0 && `${value.length}/${maxLength}`}
          </div>
        </div>

        {/* Voice input */}
        <motion.button
          onClick={onToggleVoice}
          className={`p-2.5 min-w-[44px] min-h-[44px] rounded-xl transition-colors flex items-center justify-center focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:outline-none ${
            isRecording
              ? 'bg-red-500 text-white'
              : 'hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
          transition={
            isRecording ? { duration: durations.slower, repeat: Infinity } : {}
          }
          aria-label={isRecording ? 'Stop recording' : 'Start voice input'}
          aria-pressed={isRecording}
        >
          {isRecording ? (
            <MicOff className="w-5 h-5" aria-hidden="true" />
          ) : (
            <Mic className="w-5 h-5 text-slate-500" aria-hidden="true" />
          )}
        </motion.button>

        {/* Send button */}
        <motion.button
          onClick={onSubmit}
          disabled={!value.trim() || isStreaming}
          className="p-2.5 min-w-[44px] min-h-[44px] rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:outline-none"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={isStreaming ? 'Sending message...' : 'Send message'}
          aria-disabled={!value.trim() || isStreaming}
        >
          {isStreaming ? (
            <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
          ) : (
            <Send className="w-5 h-5" aria-hidden="true" />
          )}
        </motion.button>
      </div>

      {/* Keyboard hints */}
      <div
        className="flex items-center justify-center gap-4 mt-3 text-xs text-slate-400"
        aria-label="Keyboard shortcuts"
      >
        <span>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
            Enter
          </kbd>{' '}
          to send
        </span>
        <span>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
            Shift+Enter
          </kbd>{' '}
          for new line
        </span>
        <span>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
            ⌘K
          </kbd>{' '}
          commands
        </span>
      </div>
    </div>
  )
}
