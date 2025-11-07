import { Sparkles } from 'lucide-react'

interface QuickActionsProps {
  onAction: (action: string) => void
}

const quickActions = [
  '📋 Summarize all documents',
  '🔍 Find key insights',
  '📊 Generate report',
  '❓ Common questions',
]

export function QuickActions({ onAction }: QuickActionsProps) {
  return (
    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-3 h-3 text-purple-500" />
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Quick Actions</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {quickActions.map((action) => (
          <button
            key={action}
            onClick={() => onAction(action)}
            className="px-3 py-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  )
}
