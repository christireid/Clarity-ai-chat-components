'use client'

import { WeatherCard, StockChart, CodeSandbox, TaskList } from './tools'

interface ToolResultData {
  ui: string
  data: Record<string, unknown>
}

interface ToolUIRegistryProps {
  toolResult: ToolResultData
}

/**
 * Tool UI Registry
 *
 * Maps tool result UI types to React components.
 * This is the bridge between Gemini's function calls and beautiful UI.
 */
export function ToolUIRegistry({ toolResult }: ToolUIRegistryProps) {
  const { ui, data } = toolResult

  switch (ui) {
    case 'weather-card':
      return (
        <WeatherCard
          city={data.city as string}
          country={data.country as string | undefined}
          temperature={data.temperature as number}
          condition={data.condition as string}
          humidity={data.humidity as number | undefined}
          windSpeed={data.windSpeed as number | undefined}
          forecast={data.forecast as Array<{
            day: string
            high: number
            low: number
            condition: string
          }> | undefined}
        />
      )

    case 'stock-chart':
      return (
        <StockChart
          symbol={data.symbol as string}
          companyName={data.companyName as string}
          currentPrice={data.currentPrice as number}
          changePercent={data.changePercent as number}
          changeAmount={data.changeAmount as number | undefined}
          marketCap={data.marketCap as string | undefined}
          volume={data.volume as string | undefined}
          dataPoints={data.dataPoints as Array<{ date: string; price: number }> | undefined}
        />
      )

    case 'code-sandbox':
      return (
        <CodeSandbox
          title={data.title as string | undefined}
          language={data.language as string}
          code={data.code as string}
          description={data.description as string | undefined}
          executable={data.executable as boolean | undefined}
          highlightLines={data.highlightLines as number[] | undefined}
        />
      )

    case 'task-list':
      return (
        <TaskList
          title={data.title as string | undefined}
          description={data.description as string | undefined}
          tasks={data.tasks as Array<{
            id: string
            text: string
            completed: boolean
            priority?: 'low' | 'medium' | 'high'
          }>}
          showProgress={data.showProgress as boolean | undefined}
        />
      )

    case 'error':
      return (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
          <p className="text-red-700 dark:text-red-400">
            {(data.error as string) || 'An error occurred with the tool'}
          </p>
        </div>
      )

    default:
      return (
        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Unknown tool UI type: {ui}
          </p>
          <pre className="mt-2 text-xs text-slate-500 overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )
  }
}
