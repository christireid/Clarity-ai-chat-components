/**
 * Performance Monitoring Dashboard
 * 
 * Real-time performance monitoring for components
 */

import { useState, useEffect } from 'react'
import { Button, Card, Input } from '@clarity-chat/primitives'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface PerformanceMetric {
  component: string
  renderTime: number
  memoryUsed: number
  timestamp: number
}

interface BenchmarkResult {
  component: string
  avgRenderTime: number
  minRenderTime: number
  maxRenderTime: number
  avgMemory: number
  iterations: number
}

const PERFORMANCE_BUDGETS = {
  Button: 16,
  Input: 16,
  Card: 16,
  Message: 33,
  ChatWindow: 50,
  ChatInput: 33,
}

export default function App() {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([])
  const [benchmarks, setBenchmarks] = useState<BenchmarkResult[]>([])
  const [selectedComponent, setSelectedComponent] = useState('Button')
  const [isRunning, setIsRunning] = useState(false)

  const components = Object.keys(PERFORMANCE_BUDGETS)

  const runBenchmark = async (component: string) => {
    setIsRunning(true)
    const iterations = 100
    const results: number[] = []
    const memoryResults: number[] = []

    for (let i = 0; i < iterations; i++) {
      const startTime = performance.now()
      const startMemory = (performance as any).memory?.usedJSHeapSize || 0

      // Simulate component render
      await new Promise(resolve => setTimeout(resolve, Math.random() * 20))

      const endTime = performance.now()
      const endMemory = (performance as any).memory?.usedJSHeapSize || 0

      results.push(endTime - startTime)
      memoryResults.push(endMemory - startMemory)

      // Add to metrics for live chart
      setMetrics(prev => [...prev, {
        component,
        renderTime: endTime - startTime,
        memoryUsed: endMemory - startMemory,
        timestamp: Date.now(),
      }].slice(-50))
    }

    const benchmark: BenchmarkResult = {
      component,
      avgRenderTime: results.reduce((a, b) => a + b, 0) / iterations,
      minRenderTime: Math.min(...results),
      maxRenderTime: Math.max(...results),
      avgMemory: memoryResults.reduce((a, b) => a + b, 0) / iterations,
      iterations,
    }

    setBenchmarks(prev => {
      const filtered = prev.filter(b => b.component !== component)
      return [...filtered, benchmark]
    })

    setIsRunning(false)
  }

  const runAllBenchmarks = async () => {
    for (const component of components) {
      await runBenchmark(component)
    }
  }

  const getStatus = (component: string, renderTime: number) => {
    const budget = PERFORMANCE_BUDGETS[component as keyof typeof PERFORMANCE_BUDGETS]
    if (renderTime <= budget) return 'good'
    if (renderTime <= budget * 1.5) return 'warning'
    return 'poor'
  }

  const exportData = () => {
    const data = {
      metrics,
      benchmarks,
      timestamp: new Date().toISOString(),
      budgets: PERFORMANCE_BUDGETS,
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `performance-report-${Date.now()}.json`
    a.click()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Performance Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Real-time component performance monitoring
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Controls */}
        <Card className="p-6">
          <div className="flex flex-wrap items-center gap-4">
            <select
              value={selectedComponent}
              onChange={(e) => setSelectedComponent(e.target.value)}
              className="px-4 py-2 rounded-md ring-1 ring-border/50 bg-background"
            >
              {components.map(comp => (
                <option key={comp} value={comp}>{comp}</option>
              ))}
            </select>
            <Button 
              onClick={() => runBenchmark(selectedComponent)} 
              disabled={isRunning}
            >
              {isRunning ? 'Running...' : 'Run Benchmark'}
            </Button>
            <Button 
              onClick={runAllBenchmarks} 
              variant="outline"
              disabled={isRunning}
            >
              Run All
            </Button>
            <Button onClick={exportData} variant="ghost">
              Export Data
            </Button>
          </div>
        </Card>

        {/* Live Metrics Chart */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Live Render Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(value) => new Date(value).toLocaleTimeString()}
              />
              <YAxis label={{ value: 'Render Time (ms)', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleTimeString()}
                formatter={(value: number) => `${value.toFixed(2)}ms`}
              />
              <Legend />
              <Line type="monotone" dataKey="renderTime" stroke="#3b82f6" name="Render Time" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Benchmark Results */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Benchmark Results</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={benchmarks}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="component" />
              <YAxis label={{ value: 'Avg Render Time (ms)', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value: number) => `${value.toFixed(2)}ms`} />
              <Legend />
              <Bar dataKey="avgRenderTime" fill="#3b82f6" name="Avg Render Time" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Performance Budget Status */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Performance Budget Status</h2>
          <div className="space-y-3">
            {benchmarks.map(benchmark => {
              const budget = PERFORMANCE_BUDGETS[benchmark.component as keyof typeof PERFORMANCE_BUDGETS]
              const status = getStatus(benchmark.component, benchmark.avgRenderTime)
              const percentage = (benchmark.avgRenderTime / budget) * 100

              return (
                <div key={benchmark.component} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{benchmark.component}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {benchmark.avgRenderTime.toFixed(2)}ms / {budget}ms
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        status === 'good' ? 'bg-green-500/10 text-green-600' :
                        status === 'warning' ? 'bg-yellow-500/10 text-yellow-600' :
                        'bg-red-500/10 text-red-600'
                      }`}>
                        {status === 'good' ? '✓ Good' : status === 'warning' ? '⚠ Warning' : '✗ Poor'}
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        status === 'good' ? 'bg-green-500' :
                        status === 'warning' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Detailed Stats */}
        {benchmarks.length > 0 && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Detailed Statistics</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-2 px-4">Component</th>
                    <th className="text-right py-2 px-4">Avg Time</th>
                    <th className="text-right py-2 px-4">Min Time</th>
                    <th className="text-right py-2 px-4">Max Time</th>
                    <th className="text-right py-2 px-4">Avg Memory</th>
                    <th className="text-right py-2 px-4">Iterations</th>
                  </tr>
                </thead>
                <tbody>
                  {benchmarks.map(benchmark => (
                    <tr key={benchmark.component} className="border-b border-border/30">
                      <td className="py-2 px-4 font-medium">{benchmark.component}</td>
                      <td className="text-right py-2 px-4">{benchmark.avgRenderTime.toFixed(2)}ms</td>
                      <td className="text-right py-2 px-4">{benchmark.minRenderTime.toFixed(2)}ms</td>
                      <td className="text-right py-2 px-4">{benchmark.maxRenderTime.toFixed(2)}ms</td>
                      <td className="text-right py-2 px-4">{(benchmark.avgMemory / 1024).toFixed(2)}KB</td>
                      <td className="text-right py-2 px-4">{benchmark.iterations}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
