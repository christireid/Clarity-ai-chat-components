import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@clarity-chat/primitives'
import { ANIMATION_DURATION, ANIMATION_EASING } from '../animations/constants'

export interface KeyboardShortcut {
  keys: string[]
  description: string
  category?: string
}

export interface KeyboardHintProps {
  shortcuts: KeyboardShortcut[]
  visible: boolean
  onClose?: () => void
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center'
  className?: string
}

const positionClasses = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
}

export const KeyboardHint = React.forwardRef<HTMLDivElement, KeyboardHintProps>(
  ({ shortcuts, visible, onClose, position = 'bottom-right', className }, ref) => {
    // Group shortcuts by category
    const groupedShortcuts = React.useMemo(() => {
      const groups: Record<string, KeyboardShortcut[]> = {}
      
      shortcuts.forEach(shortcut => {
        const category = shortcut.category || 'General'
        if (!groups[category]) {
          groups[category] = []
        }
        groups[category].push(shortcut)
      })
      
      return groups
    }, [shortcuts])

    return (
      <AnimatePresence>
        {visible && (
          <>
            {/* Backdrop (only for center position) */}
            {position === 'center' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              />
            )}

            {/* Keyboard Hints Panel */}
            <motion.div
              ref={ref}
              initial={{ opacity: 0, scale: 0.9, y: position.includes('bottom') ? 20 : -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: position.includes('bottom') ? 20 : -20 }}
              transition={{
                duration: ANIMATION_DURATION.normal / 1000,
                ease: ANIMATION_EASING.out,
              }}
              className={cn(
                'fixed bg-background border rounded-lg shadow-xl z-50',
                'max-w-md max-h-[80vh] overflow-hidden flex flex-col',
                positionClasses[position],
                className
              )}
            >
              {/* Header */}
              <div className="px-4 py-3 border-b flex items-center justify-between bg-muted/50">
                <motion.h3
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="font-semibold"
                >
                  Keyboard Shortcuts
                </motion.h3>
                {onClose && (
                  <motion.button
                    onClick={onClose}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1 rounded hover:bg-muted transition-colors"
                    aria-label="Close"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      />
                    </svg>
                  </motion.button>
                )}
              </div>

              {/* Shortcuts List */}
              <div className="overflow-y-auto flex-1 p-4">
                <div className="space-y-4">
                  {Object.entries(groupedShortcuts).map(([category, categoryShortcuts], groupIndex) => (
                    <motion.div
                      key={category}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: groupIndex * 0.05 + 0.1 }}
                    >
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                        {category}
                      </div>
                      <div className="space-y-2">
                        {categoryShortcuts.map((shortcut, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: groupIndex * 0.05 + index * 0.03 + 0.15 }}
                            whileHover={{ x: 4, scale: 1.02 }}
                            className="flex items-center justify-between gap-4 p-2 rounded hover:bg-muted transition-all"
                          >
                            <span className="text-sm">{shortcut.description}</span>
                            <div className="flex gap-1 flex-shrink-0">
                              {shortcut.keys.map((key, keyIndex) => (
                                <React.Fragment key={keyIndex}>
                                  {keyIndex > 0 && (
                                    <span className="text-muted-foreground px-1">+</span>
                                  )}
                                  <motion.kbd
                                    whileHover={{ scale: 1.1 }}
                                    className={cn(
                                      'px-2 py-1 text-xs font-mono rounded border',
                                      'bg-muted border-border shadow-sm',
                                      'inline-flex items-center justify-center min-w-[24px]'
                                    )}
                                  >
                                    {key}
                                  </motion.kbd>
                                </React.Fragment>
                              ))}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="px-4 py-3 border-t text-xs text-muted-foreground bg-muted/50"
              >
                Press{' '}
                <kbd className="px-1.5 py-0.5 bg-background rounded border mx-1">?</kbd> to
                toggle this panel
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    )
  }
)

KeyboardHint.displayName = 'KeyboardHint'

// Hook for managing keyboard shortcuts
export interface UseKeyboardShortcutsOptions {
  shortcuts: Record<string, () => void>
  enabled?: boolean
}

export const useKeyboardShortcuts = ({ shortcuts, enabled = true }: UseKeyboardShortcutsOptions) => {
  React.useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Build the key combination string
      const parts: string[] = []
      if (e.ctrlKey || e.metaKey) parts.push('ctrl')
      if (e.altKey) parts.push('alt')
      if (e.shiftKey) parts.push('shift')
      
      // Add the actual key
      const key = e.key.toLowerCase()
      if (!['control', 'alt', 'shift', 'meta'].includes(key)) {
        parts.push(key)
      }

      const combination = parts.join('+')

      // Execute the matching shortcut
      if (shortcuts[combination]) {
        e.preventDefault()
        shortcuts[combination]()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts, enabled])
}
