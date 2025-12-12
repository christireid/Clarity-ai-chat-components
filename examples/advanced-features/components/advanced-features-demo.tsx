'use client'

import { useState, useEffect } from 'react'

interface Props {
  activeTab: 'demo' | 'suggestions' | 'battery' | 'performance'
}

// =============================================================================
// Enhanced Suggestions Demo
// =============================================================================

function EnhancedSuggestionsDemo() {
  const [suggestions] = useState([
    { text: 'Explain this concept in simpler terms', confidence: 0.92, category: 'clarify' },
    { text: 'Can you provide an example?', confidence: 0.88, category: 'example' },
    { text: 'What are the best practices?', confidence: 0.85, category: 'best-practices' },
    { text: 'How does this compare to alternatives?', confidence: 0.78, category: 'compare' },
  ])

  return (
    <div className="space-y-6">
      <div className="p-6 bg-card border rounded-lg">
        <h3 className="text-lg font-semibold mb-4">ML-Ranked Suggestions</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Suggestions are ranked by confidence based on conversation context,
          user history, and engagement patterns.
        </p>

        <div className="space-y-2">
          {suggestions.map((suggestion, i) => (
            <button
              key={i}
              className="w-full p-3 text-left bg-muted hover:bg-muted/80 rounded-lg transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">
                  {suggestion.category === 'clarify' && '💡'}
                  {suggestion.category === 'example' && '📝'}
                  {suggestion.category === 'best-practices' && '⭐'}
                  {suggestion.category === 'compare' && '⚖️'}
                </span>
                <span className="text-sm">{suggestion.text}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {Math.round(suggestion.confidence * 100)}% match
                </span>
                <div
                  className="w-16 h-1.5 bg-muted-foreground/20 rounded-full overflow-hidden"
                >
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${suggestion.confidence * 100}%` }}
                  />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-card border rounded-lg">
          <h4 className="font-medium mb-2">Click-Through Rate</h4>
          <p className="text-3xl font-bold text-primary">24.5%</p>
          <p className="text-xs text-muted-foreground">+150% vs baseline</p>
        </div>
        <div className="p-4 bg-card border rounded-lg">
          <h4 className="font-medium mb-2">Avg Relevance</h4>
          <p className="text-3xl font-bold text-primary">0.86</p>
          <p className="text-xs text-muted-foreground">ML model confidence</p>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// Battery Aware Demo
// =============================================================================

function BatteryAwareDemo() {
  const [batteryLevel, setBatteryLevel] = useState(0.65)
  const [isCharging, setIsCharging] = useState(false)

  const recommendations = batteryLevel < 0.2
    ? { level: 'aggressive', disableAnimations: true, updateInterval: 2000 }
    : batteryLevel < 0.5
    ? { level: 'moderate', disableAnimations: false, updateInterval: 1000 }
    : { level: 'none', disableAnimations: false, updateInterval: 500 }

  return (
    <div className="space-y-6">
      <div className="p-6 bg-card border rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Battery Status</h3>

        {/* Battery simulation controls */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Simulate Battery Level: {Math.round(batteryLevel * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={batteryLevel * 100}
            onChange={(e) => setBatteryLevel(parseInt(e.target.value) / 100)}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Critical (5%)</span>
            <span>Low (20%)</span>
            <span>Medium (50%)</span>
            <span>Full (100%)</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            id="charging"
            checked={isCharging}
            onChange={(e) => setIsCharging(e.target.checked)}
            className="rounded"
          />
          <label htmlFor="charging" className="text-sm">Charging</label>
        </div>

        {/* Battery indicator */}
        <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
          <div className={`w-12 h-6 border-2 rounded-sm relative ${
            batteryLevel < 0.2 ? 'border-red-500' : 'border-green-500'
          }`}>
            <div
              className={`absolute inset-0.5 rounded-sm transition-all ${
                batteryLevel < 0.2 ? 'bg-red-500' : 'bg-green-500'
              }`}
              style={{ width: `${batteryLevel * 100}%` }}
            />
            <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-3 bg-current rounded-r-sm" />
          </div>
          <div>
            <p className="font-medium">{Math.round(batteryLevel * 100)}%</p>
            <p className="text-xs text-muted-foreground">
              {isCharging ? 'Charging' : batteryLevel < 0.2 ? 'Low battery' : 'On battery'}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 bg-card border rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Active Optimizations</h3>
        <div className="space-y-3">
          <div className={`flex items-center justify-between p-3 rounded-lg ${
            recommendations.disableAnimations ? 'bg-yellow-100 dark:bg-yellow-900/20' : 'bg-muted'
          }`}>
            <span className="text-sm">Animations</span>
            <span className={`text-sm font-medium ${
              recommendations.disableAnimations ? 'text-yellow-700 dark:text-yellow-400' : 'text-green-600'
            }`}>
              {recommendations.disableAnimations ? 'Disabled' : 'Enabled'}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <span className="text-sm">Update Interval</span>
            <span className="text-sm font-medium">{recommendations.updateInterval}ms</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <span className="text-sm">Optimization Level</span>
            <span className={`text-sm font-medium px-2 py-0.5 rounded ${
              recommendations.level === 'aggressive' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
              recommendations.level === 'moderate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
              'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
            }`}>
              {recommendations.level}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// Performance Dashboard Demo
// =============================================================================

function PerformanceDashboardDemo() {
  const [fps, setFps] = useState(60)
  const [memory, setMemory] = useState({ used: 45, limit: 100 })

  // Simulate performance metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setFps(55 + Math.random() * 10)
      setMemory(prev => ({
        ...prev,
        used: Math.min(prev.limit, 40 + Math.random() * 20)
      }))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const webVitals = [
    { name: 'LCP', value: 1.8, unit: 's', status: 'good' },
    { name: 'FID', value: 12, unit: 'ms', status: 'good' },
    { name: 'CLS', value: 0.05, unit: '', status: 'good' },
    { name: 'TTFB', value: 180, unit: 'ms', status: 'needs-improvement' },
  ]

  return (
    <div className="space-y-6">
      {/* Web Vitals */}
      <div className="p-6 bg-card border rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Core Web Vitals</h3>
        <div className="grid grid-cols-4 gap-4">
          {webVitals.map((vital) => (
            <div key={vital.name} className="text-center p-4 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">{vital.name}</p>
              <p className="text-2xl font-bold">{vital.value}{vital.unit}</p>
              <span className={`text-xs px-2 py-0.5 rounded ${
                vital.status === 'good'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
              }`}>
                {vital.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Real-time metrics */}
      <div className="grid grid-cols-2 gap-6">
        <div className="p-6 bg-card border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">FPS Monitor</h3>
          <div className="flex items-end gap-2 h-32">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="flex-1 bg-primary/80 rounded-t transition-all"
                style={{
                  height: `${(55 + Math.sin(i * 0.5) * 5) / 60 * 100}%`,
                }}
              />
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Current FPS</span>
            <span className={`text-2xl font-bold ${
              fps >= 55 ? 'text-green-600' : fps >= 30 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {Math.round(fps)}
            </span>
          </div>
        </div>

        <div className="p-6 bg-card border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Memory Usage</h3>
          <div className="relative h-32 flex items-center justify-center">
            <svg className="w-28 h-28 transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r="48"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-muted"
              />
              <circle
                cx="56"
                cy="56"
                r="48"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={`${(memory.used / memory.limit) * 301.59} 301.59`}
                className="text-primary"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold">{Math.round(memory.used)}%</span>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              {Math.round(memory.used * 10)}MB / {memory.limit * 10}MB
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// Full Demo
// =============================================================================

function FullDemo() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <EnhancedSuggestionsDemo />
      </div>
      <div className="space-y-6">
        <BatteryAwareDemo />
      </div>
      <div className="lg:col-span-2">
        <PerformanceDashboardDemo />
      </div>
    </div>
  )
}

// =============================================================================
// Main Export
// =============================================================================

export function AdvancedFeaturesDemo({ activeTab }: Props) {
  switch (activeTab) {
    case 'suggestions':
      return <EnhancedSuggestionsDemo />
    case 'battery':
      return <BatteryAwareDemo />
    case 'performance':
      return <PerformanceDashboardDemo />
    default:
      return <FullDemo />
  }
}
