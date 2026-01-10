'use client'

import { motion } from 'framer-motion'
import { Sun, Moon, Monitor, Command, Sparkles, Menu } from 'lucide-react'
import { durations } from '@/lib/animations'

type Theme = 'light' | 'dark' | 'system'

interface HeroChatHeaderProps {
  theme: Theme
  onCycleTheme: () => void
  onOpenCommandPalette: () => void
  onOpenSidebar: () => void
  shortcutDisplay?: string
  conversationCount?: number
}

export function HeroChatHeader({
  theme,
  onCycleTheme,
  onOpenCommandPalette,
  onOpenSidebar,
  shortcutDisplay = '⌘K',
  conversationCount = 0,
}: HeroChatHeaderProps) {
  return (
    <header
      className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl"
      role="banner"
    >
      <div className="flex items-center gap-3">
        {/* Sidebar toggle */}
        <motion.button
          onClick={onOpenSidebar}
          className="p-2.5 min-w-[44px] min-h-[44px] rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative flex items-center justify-center focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:outline-none"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Open conversation history"
        >
          <Menu className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          {conversationCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-500 text-white text-xs flex items-center justify-center">
              {conversationCount > 9 ? '9+' : conversationCount}
            </span>
          )}
        </motion.button>

        <motion.div
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: durations.slower, repeat: Infinity }}
          aria-hidden="true"
        >
          <Sparkles className="w-5 h-5 text-white" />
        </motion.div>
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">
            Clarity Chat
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Powered by Gemini
          </p>
        </div>
      </div>

      <div
        className="flex items-center gap-2"
        role="toolbar"
        aria-label="Chat controls"
      >
        {/* Theme toggle */}
        <motion.button
          onClick={onCycleTheme}
          className="p-2.5 min-w-[44px] min-h-[44px] rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:outline-none"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={`Theme: ${theme}`}
          aria-label={`Current theme: ${theme}. Click to change theme.`}
        >
          {theme === 'light' && (
            <Sun className="w-5 h-5 text-slate-600" aria-hidden="true" />
          )}
          {theme === 'dark' && (
            <Moon className="w-5 h-5 text-slate-400" aria-hidden="true" />
          )}
          {theme === 'system' && (
            <Monitor className="w-5 h-5 text-slate-500" aria-hidden="true" />
          )}
        </motion.button>

        {/* Command palette trigger */}
        <motion.button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:outline-none"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          aria-label={`Open command palette (${shortcutDisplay})`}
        >
          <Command className="w-4 h-4 text-slate-500" aria-hidden="true" />
          <span className="text-sm text-slate-600 dark:text-slate-400">
            {shortcutDisplay.replace('⌘', '')}
          </span>
        </motion.button>
      </div>
    </header>
  )
}
