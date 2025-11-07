import type { Deal } from '../types'

interface PipelineViewProps {
  deals: Deal[]
}

const stages = ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won']

export function PipelineView({ deals }: PipelineViewProps) {
  const dealsByStage = stages.map((stage) => ({
    stage,
    deals: deals.filter((d) => d.stage === stage),
    value: deals.filter((d) => d.stage === stage).reduce((sum, d) => sum + d.value, 0),
  }))

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📊 Sales Pipeline</h2>
      
      <div className="grid grid-cols-5 gap-4">
        {dealsByStage.map(({ stage, deals, value }) => (
          <div key={stage} className="text-center">
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg p-4 border border-blue-300/30 dark:border-blue-700/30">
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                {stage}
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {deals.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                ${(value / 1000).toFixed(0)}K
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
