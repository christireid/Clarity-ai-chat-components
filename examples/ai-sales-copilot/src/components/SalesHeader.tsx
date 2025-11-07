import { TrendingUp } from 'lucide-react'

interface SalesHeaderProps {
  onThemeChange: (theme: string) => void
  currentTheme: string
  onShowAnalytics: () => void
  totalPipeline: number
}

export function SalesHeader({ onThemeChange, currentTheme, onShowAnalytics, totalPipeline }: SalesHeaderProps) {
  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">AI Sales Copilot</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Intelligent Sales Assistant</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Pipeline</div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">
                ${(totalPipeline / 1000).toFixed(0)}K
              </div>
            </div>
            
            <button
              onClick={onShowAnalytics}
              className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors"
            >
              📊 Analytics
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
