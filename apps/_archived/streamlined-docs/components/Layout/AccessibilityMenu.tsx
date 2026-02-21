'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { Eye, EyeOff, Volume2, VolumeX, Zap, ZapOff, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from '@/lib/toast'
import { cn } from '@/lib/utils'

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
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'fixed top-20 right-4 z-50 w-80 max-w-[calc(100vw-2rem)] rounded-xl p-6',
              'bg-bg-primary dark:bg-gray-900/95',
              // Multi-layer shadow system with green accessibility accent
              'shadow-[0_4px_12px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.06),0_16px_48px_rgba(0,0,0,0.04)]',
              'dark:shadow-[0_4px_12px_rgba(0,0,0,0.3),0_8px_24px_rgba(0,0,0,0.25),0_16px_48px_rgba(34,197,94,0.1)]'
            )}
          >
            {/* Premium gradient border */}
            <div
              className="absolute inset-0 rounded-xl pointer-events-none"
              style={{
                padding: '1px',
                background: 'linear-gradient(135deg, rgba(34,197,94,0.4) 0%, rgba(59,130,246,0.25) 50%, rgba(34,197,94,0.35) 100%)',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
              }}
              aria-hidden="true"
            />
            <div className="relative z-10 flex items-center justify-between mb-4">
              <h2 id="accessibility-menu-title" className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                Accessibility Options
              </h2>
              <button
                ref={closeButtonRef}
                onClick={onClose}
                className={cn(
                  'p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg transition-all duration-300',
                  'hover:bg-gray-100 dark:hover:bg-gray-800',
                  'hover:shadow-[0_0_12px_rgba(34,197,94,0.2)]',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2'
                )}
                aria-label="Close accessibility menu"
              >
                <X className="w-4 h-4 text-gray-600 dark:text-gray-400" aria-hidden="true" />
              </button>
            </div>

          <div className="relative z-10 space-y-4" role="group" aria-label="Accessibility settings">
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
                className={`relative inline-flex h-7 w-12 min-w-[48px] items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${
                  highContrast ? 'bg-brand-600' : 'bg-gray-200 dark:bg-gray-600'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
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
                className={`relative inline-flex h-7 w-12 min-w-[48px] items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${
                  reducedMotion ? 'bg-brand-600' : 'bg-gray-200 dark:bg-gray-600'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
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
                className={`relative inline-flex h-7 w-12 min-w-[48px] items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${
                  largerText ? 'bg-brand-600' : 'bg-gray-200 dark:bg-gray-600'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
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
                className={`relative inline-flex h-7 w-12 min-w-[48px] items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${
                  screenReaderMode ? 'bg-brand-600' : 'bg-gray-200 dark:bg-gray-600'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                    screenReaderMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="relative z-10 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700/50">
            <p className="text-xs text-gray-500 dark:text-gray-400">
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
      className={cn(
        'p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg transition-all duration-300',
        'hover:bg-gray-100 dark:hover:bg-gray-800',
        'hover:shadow-[0_0_12px_rgba(34,197,94,0.15)]',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500'
      )}
      aria-label="Open accessibility menu"
      title="Accessibility options"
    >
      <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400 transition-colors duration-300 group-hover:text-green-600 dark:group-hover:text-green-400" />
    </button>
  )
}
