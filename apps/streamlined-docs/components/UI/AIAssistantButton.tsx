'use client'

import { Sparkles } from 'lucide-react'
import { toast } from '@clarity-chat/react'

export function AIAssistantButton() {
  return (
    <button
      className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-lg font-medium border border-neutral-200 dark:border-neutral-800 hover:border-brand-300 dark:hover:border-brand-700 transition-all hover:-translate-y-1"
      onClick={() => {
        // Trigger the DocsAssistant via keyboard event
        const event = new KeyboardEvent('keydown', { key: '.', metaKey: true })
        window.dispatchEvent(event)
        toast.info('Press Cmd+. to open the AI documentation assistant')
      }}
    >
      <Sparkles className="w-4 h-4" />
      Ask AI Assistant
    </button>
  )
}
