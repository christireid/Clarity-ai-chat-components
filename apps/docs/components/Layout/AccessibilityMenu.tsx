'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { Eye, EyeOff, Volume2, VolumeX, Zap, ZapOff, X } from 'lucide-react'
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
  const menuRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

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

  // Focus management - store previous focus and return on close
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement
      // Focus the close button when menu opens
      setTimeout(() => closeButtonRef.current?.focus(), 100)
    } else if (previousActiveElement.current) {
      previousActiveElement.current.focus()
    }
  }, [isOpen])

  // Focus trap within the menu
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen || !menuRef.current) return

    if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
      return
    }

    if (e.key === 'Tab') {
      const focusableElements = menuRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault()
        lastElement?.focus()
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault()
        firstElement?.focus()
      }
    }
  }, [isOpen, onClose])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

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
        <>
          {/* Backdrop for click-outside-to-close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/20"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="accessibility-menu-title"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-20 right-4 z-50 w-80 bg-bg-primary border border-border rounded-xl shadow-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 id="accessibility-menu-title" className="text-lg font-semibold">
                Accessibility Options
              </h2>
              <button
                ref={closeButtonRef}
                onClick={onClose}
                className="p-2 rounded-md hover:bg-bg-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
                aria-label="Close accessibility menu"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

          <div className="space-y-4" role="group" aria-label="Accessibility settings">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" aria-hidden="true" />
                <span id="high-contrast-label" className="text-sm font-medium">High Contrast</span>
              </div>
              <button
                role="switch"
                aria-checked={highContrast}
                aria-labelledby="high-contrast-label"
                onClick={() =>
                  toggleFeature('highContrast', highContrast, setHighContrast)
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${
                  highContrast ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                    highContrast ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ZapOff className="w-4 h-4" aria-hidden="true" />
                <span id="reduced-motion-label" className="text-sm font-medium">Reduced Motion</span>
              </div>
              <button
                role="switch"
                aria-checked={reducedMotion}
                aria-labelledby="reduced-motion-label"
                onClick={() =>
                  toggleFeature(
                    'reducedMotion',
                    reducedMotion,
                    setReducedMotion
                  )
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${
                  reducedMotion ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                    reducedMotion ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold" aria-hidden="true">A</span>
                <span id="larger-text-label" className="text-sm font-medium">Larger Text</span>
              </div>
              <button
                role="switch"
                aria-checked={largerText}
                aria-labelledby="larger-text-label"
                onClick={() =>
                  toggleFeature('largerText', largerText, setLargerText)
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${
                  largerText ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                    largerText ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4" aria-hidden="true" />
                <span id="screen-reader-label" className="text-sm font-medium">Screen Reader Mode</span>
              </div>
              <button
                role="switch"
                aria-checked={screenReaderMode}
                aria-labelledby="screen-reader-label"
                onClick={() =>
                  toggleFeature(
                    'screenReaderMode',
                    screenReaderMode,
                    setScreenReaderMode
                  )
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${
                  screenReaderMode ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
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
        </>
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
