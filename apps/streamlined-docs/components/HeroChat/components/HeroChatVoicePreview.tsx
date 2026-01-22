'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, AlertCircle } from 'lucide-react'
import { durations } from '@/lib/animations'

interface HeroChatVoicePreviewProps {
  isRecording: boolean
  transcript: string
  isSupported: boolean
  permissionDenied?: boolean
  onStop: () => void
  onRetry?: () => void
}

export function HeroChatVoicePreview({
  isRecording,
  transcript,
  isSupported,
  permissionDenied = false,
  onStop,
  onRetry,
}: HeroChatVoicePreviewProps) {
  if (!isSupported) {
    return <VoiceNotSupported />
  }

  if (permissionDenied) {
    return <VoicePermissionDenied onRetry={onRetry} />
  }

  return (
    <AnimatePresence>
      {isRecording && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute bottom-full left-0 right-0 mb-2 mx-4"
        >
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-4">
            {/* Recording indicator */}
            <div className="flex items-center gap-3 mb-3">
              <motion.div
                className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: durations.slower, repeat: Infinity }}
              >
                <Mic className="w-5 h-5 text-white" />
              </motion.div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  Listening...
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Speak clearly into your microphone
                </p>
              </div>
              <motion.button
                onClick={onStop}
                className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Stop recording"
              >
                <MicOff className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Waveform visualization */}
            <div className="flex items-center justify-center gap-1 h-8 mb-3">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-indigo-500 rounded-full"
                  animate={{
                    height: [8, 16 + Math.random() * 16, 8],
                  }}
                  transition={{
                    duration: 0.5 + Math.random() * 0.3,
                    repeat: Infinity,
                    delay: i * 0.05,
                  }}
                />
              ))}
            </div>

            {/* Live transcript */}
            <div className="relative">
              <div className="min-h-[40px] p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                {transcript ? (
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {transcript}
                    <motion.span
                      className="inline-block w-0.5 h-4 bg-indigo-500 ml-1"
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{
                        duration: durations.slower,
                        repeat: Infinity,
                      }}
                    />
                  </p>
                ) : (
                  <p className="text-sm text-slate-400 dark:text-slate-500 italic">
                    Your words will appear here...
                  </p>
                )}
              </div>
            </div>

            {/* Hint */}
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 text-center">
              Press{' '}
              <kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-700">
                Esc
              </kbd>{' '}
              or click the mic to stop
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function VoiceNotSupported() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute bottom-full left-0 right-0 mb-2 mx-4"
    >
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
              Voice input not supported
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
              Your browser doesn&apos;t support speech recognition. Try Chrome,
              Edge, or Safari.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function VoicePermissionDenied({ onRetry }: { onRetry?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute bottom-full left-0 right-0 mb-2 mx-4"
    >
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <MicOff className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800 dark:text-red-200">
              Microphone access denied
            </p>
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
              Please allow microphone access in your browser settings and try
              again.
            </p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="mt-2 text-xs font-medium text-red-700 dark:text-red-300 underline hover:no-underline"
              >
                Try again
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
