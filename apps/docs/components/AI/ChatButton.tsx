'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, X, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatButtonProps {
  onClick: () => void
  isOpen: boolean
}

export function ChatButton({ onClick, isOpen }: ChatButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isMac, setIsMac] = useState(false)

  // Detect if user is on Mac for keyboard shortcut display
  useEffect(() => {
    setIsMac(navigator.platform.toLowerCase().includes('mac'))
  }, [])

  return (
    <div className="fixed bottom-6 right-6 z-50 group/container">
      {/* Keyboard Shortcut Tooltip - Desktop only */}
      {!isOpen && isHovered && (
        <div
          className={cn(
            'hidden lg:block',
            'absolute bottom-full right-0 mb-2',
            'px-3 py-1.5 rounded-lg',
            'bg-gray-900 dark:bg-gray-800 text-white text-xs font-medium',
            'shadow-lg border border-gray-700',
            'whitespace-nowrap',
            'animate-in fade-in slide-in-from-bottom-2 duration-200'
          )}
        >
          Press {isMac ? '⌘' : 'Ctrl'}+K
          <div className="absolute bottom-0 right-4 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900 dark:bg-gray-800 border-r border-b border-gray-700" />
        </div>
      )}

      <button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          'flex items-center gap-2 px-4 py-3 rounded-full',
          'bg-gradient-to-r from-brand-500 to-brand-600',
          'text-white font-medium text-sm',
          'shadow-lg hover:shadow-xl',
          'transition-all duration-300 ease-out',
          'hover:scale-105 active:scale-95',
          'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2',
          'group'
        )}
        aria-label={isOpen ? 'Close AI Assistant (Esc)' : `Open AI Assistant (${isMac ? 'Cmd' : 'Ctrl'}+K)`}
      >
      {/* Icon Container */}
      <div className="relative">
        {isOpen ? (
          <X className="w-5 h-5 transition-transform duration-200 group-hover:rotate-90" />
        ) : (
          <>
            <MessageSquare className="w-5 h-5" />
            {/* Sparkle indicator for AI */}
            <Sparkles
              className={cn(
                'absolute -top-1 -right-1 w-3 h-3',
                'text-yellow-300',
                'transition-opacity duration-300',
                isHovered ? 'opacity-100' : 'opacity-0'
              )}
            />
          </>
        )}
      </div>

      {/* Text Label */}
      <span
        className={cn(
          'transition-all duration-300 overflow-hidden whitespace-nowrap',
          isOpen ? 'w-0 opacity-0' : 'w-auto opacity-100'
        )}
      >
        Ask AI
      </span>

      {/* Pulse Indicator (when closed) */}
      {!isOpen && (
        <span className="absolute top-2 right-2 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
        </span>
      )}
      </button>
    </div>
  )
}
