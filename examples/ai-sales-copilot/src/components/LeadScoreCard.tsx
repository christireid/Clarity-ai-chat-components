interface LeadScoreCardProps {
  score: number
  sentiment: any
  factors: Array<{ name: string; score: number }>
}

export function LeadScoreCard({ score, sentiment, factors }: LeadScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600 dark:text-green-400'
    if (score >= 40) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">🎯 Lead Score</h3>
      
      <div className="text-center mb-4">
        <div className={`text-4xl font-bold ${getScoreColor(score)}`}>{score}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">out of 100</div>
      </div>

      <div className="space-y-3">
        {factors.map((factor) => (
          <div key={factor.name}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">{factor.name}</span>
              <span className="font-medium text-gray-900 dark:text-white">{factor.score}%</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${getScoreColor(factor.score).replace('text-', 'bg-')}`}
                style={{ width: `${factor.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
