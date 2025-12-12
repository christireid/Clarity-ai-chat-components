'use client'

import { motion } from 'framer-motion'
import { MessageSquare, MapPin } from 'lucide-react'
import { durations } from '@/lib/animations'

interface PromptSuggestion {
  icon: string
  text: string
  category: string
}

interface HeroChatEmptyStateProps {
  suggestions: PromptSuggestion[]
  onSelectSuggestion: (text: string) => void
}

export function HeroChatEmptyState({
  suggestions,
  onSelectSuggestion,
}: HeroChatEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center h-full text-center"
      role="region"
      aria-label="Welcome message and suggestions"
    >
      <motion.div
        className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6"
        animate={{
          boxShadow: [
            '0 0 20px rgba(99, 102, 241, 0.3)',
            '0 0 40px rgba(99, 102, 241, 0.5)',
            '0 0 20px rgba(99, 102, 241, 0.3)',
          ],
        }}
        transition={{ duration: durations.slower, repeat: Infinity }}
        aria-hidden="true"
      >
        <MessageSquare className="w-10 h-10 text-white" />
      </motion.div>

      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
        Welcome to Clarity Chat
      </h2>
      <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md">
        Your AI assistant with beautiful interactive tools. Try asking about
        weather, stocks, code, locations, or tasks!
      </p>

      {/* Prompt suggestions */}
      <div
        className="grid grid-cols-2 gap-3 w-full max-w-lg"
        role="list"
        aria-label="Suggested prompts"
      >
        {suggestions.map((suggestion, i) => (
          <motion.button
            key={suggestion.text}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => onSelectSuggestion(suggestion.text)}
            className="flex items-center gap-2 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md transition-all text-left"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            role="listitem"
            aria-label={`Try: ${suggestion.text}`}
          >
            <span className="text-xl" aria-hidden="true">
              {suggestion.icon}
            </span>
            <span className="text-sm text-slate-700 dark:text-slate-300 line-clamp-1">
              {suggestion.text}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

// Default suggestions
export const PROMPT_SUGGESTIONS: PromptSuggestion[] = [
  { icon: '🌤️', text: "What's the weather in Tokyo?", category: 'weather' },
  { icon: '📈', text: "How's Apple stock doing?", category: 'stocks' },
  { icon: '💻', text: 'Show me a React useState example', category: 'code' },
  { icon: '✅', text: 'Help me plan a new project', category: 'tasks' },
  { icon: '📍', text: 'Show me the Eiffel Tower', category: 'location' },
  { icon: '🚀', text: 'What can Clarity Chat do?', category: 'info' },
]
