'use client'

import { useEffect, useState } from 'react'
import { Eye, EyeOff, Volume2, VolumeX, Zap, ZapOff } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from '@/lib/toast'

interface AccessibilityMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function AccessibilityMenu({ isOpen, onClose }: AccessibilityMenuProps) {
  const [highContrast, setHighContrast] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [largerText, setLargerText] = useState(false)
  const [screenReaderMode, setScreenReaderMode] = useState(false)

  useEffect(() => {
    // Check system preferences
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast')
      toast.success('High contrast mode enabled')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }
  }, [highContrast])

  useEffect(() => {
    if (reducedMotion) {
      document.documentElement.classList.add('reduced-motion')
      toast.success('Reduced motion enabled')
    } else {
      document.documentElement.classList.remove('reduced-motion')
    }
  }, [reducedMotion])

  useEffect(() => {
    if (largerText) {
      document.documentElement.classList.add('larger-text')
      toast.success('Larger text enabled')
    } else {
      document.documentElement.classList.remove('larger-text')
    }
  }, [largerText])

  useEffect(() => {
    if (screenReaderMode) {
      document.documentElement.classList.add('screen-reader-mode')
      toast.success('Screen reader optimizations enabled')
    } else {
      document.documentElement.classList.remove('screen-reader-mode')
    }
  }, [screenReaderMode])

  const toggleFeature = (
    feature: string,
    currentState: boolean,
    setter: (value: boolean) => void
  ) => {
    setter(!currentState)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed top-20 right-4 z-50 w-80 bg-bg-primary border border-border rounded-xl shadow-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Accessibility Options</h3>
            <button
              onClick={onClose}
              className="p-1 rounded-md hover:bg-bg-secondary transition-colors"
              aria-label="Close accessibility menu"
            >
              <EyeOff className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span className="text-sm font-medium">High Contrast</span>
              </div>
              <button
                onClick={() =>
                  toggleFeature('highContrast', highContrast, setHighContrast)
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  highContrast ? 'bg-blue-600' : 'bg-gray-200'
                }`}
                aria-label="Toggle high contrast mode"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    highContrast ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ZapOff className="w-4 h-4" />
                <span className="text-sm font-medium">Reduced Motion</span>
              </div>
              <button
                onClick={() =>
                  toggleFeature(
                    'reducedMotion',
                    reducedMotion,
                    setReducedMotion
                  )
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  reducedMotion ? 'bg-blue-600' : 'bg-gray-200'
                }`}
                aria-label="Toggle reduced motion"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    reducedMotion ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">A</span>
                <span className="text-sm font-medium">Larger Text</span>
              </div>
              <button
                onClick={() =>
                  toggleFeature('largerText', largerText, setLargerText)
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  largerText ? 'bg-blue-600' : 'bg-gray-200'
                }`}
                aria-label="Toggle larger text"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    largerText ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                <span className="text-sm font-medium">Screen Reader Mode</span>
              </div>
              <button
                onClick={() =>
                  toggleFeature(
                    'screenReaderMode',
                    screenReaderMode,
                    setScreenReaderMode
                  )
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  screenReaderMode ? 'bg-blue-600' : 'bg-gray-200'
                }`}
                aria-label="Toggle screen reader mode"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    screenReaderMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-xs text-text-secondary">
              These settings are saved in your browser and will persist across
              sessions.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function AccessibilityButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-md hover:bg-bg-secondary transition-colors"
      aria-label="Open accessibility menu"
      title="Accessibility options"
    >
      <Eye className="w-4 h-4" />
    </button>
  )
}
