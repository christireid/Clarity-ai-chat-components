/**
 * Developer Tools Dashboard
 * Comprehensive dashboard combining all dev tools components
 * React 19 component showcasing all features
 */

'use client'

import * as React from 'react'
import { APIInspectorPanel } from './api-inspector-panel'
import { ProfilerPanel } from './profiler-panel'
import { ValidationForm } from './validation-form'
import { TimeTravelPanel } from './time-travel-panel'
import { ModelComparisonPanel } from './model-comparison-panel'

export interface DevToolsDashboardProps {
  className?: string
  defaultTab?: 'inspector' | 'profiler' | 'validation' | 'time-travel' | 'model-comparison'
  showInspector?: boolean
  showProfiler?: boolean
  showValidation?: boolean
  showTimeTravel?: boolean
  showModelComparison?: boolean
}

type Tab = 'inspector' | 'profiler' | 'validation' | 'time-travel' | 'model-comparison'

/**
 * Developer Tools Dashboard Component
 * Combines all dev tools in a tabbed interface
 */
export function DevToolsDashboard({
  className,
  defaultTab = 'inspector',
  showInspector = true,
  showProfiler = true,
  showValidation = true,
  showTimeTravel = true,
  showModelComparison = true,
}: DevToolsDashboardProps) {
  const [activeTab, setActiveTab] = React.useState<Tab>(defaultTab)

  const tabs = React.useMemo(() => {
    const availableTabs: Array<{ id: Tab; label: string; icon: string }> = []
    
    if (showInspector) {
      availableTabs.push({ id: 'inspector', label: 'API Inspector', icon: '🔍' })
    }
    if (showProfiler) {
      availableTabs.push({ id: 'profiler', label: 'Profiler', icon: '⚡' })
    }
    if (showValidation) {
      availableTabs.push({ id: 'validation', label: 'Validation', icon: '✅' })
    }
    if (showTimeTravel) {
      availableTabs.push({ id: 'time-travel', label: 'Time Travel', icon: '⏮️' })
    }
    if (showModelComparison) {
      availableTabs.push({ id: 'model-comparison', label: 'Model Comparison', icon: '⚖️' })
    }
    
    return availableTabs
  }, [showInspector, showProfiler, showValidation, showTimeTravel, showModelComparison])

  return (
    <div className={className} data-testid="dev-tools-dashboard">
      <div className="dev-tools-header">
        <h1>Developer Tools Dashboard</h1>
        <p className="dev-tools-subtitle">
          React 19 powered developer tools for AI chat applications
        </p>
      </div>

      <div className="dev-tools-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`dev-tools-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            type="button"
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="dev-tools-content">
        {activeTab === 'inspector' && showInspector && (
          <div className="dev-tools-panel">
            <APIInspectorPanel />
          </div>
        )}

        {activeTab === 'profiler' && showProfiler && (
          <div className="dev-tools-panel">
            <ProfilerPanel />
          </div>
        )}

        {activeTab === 'validation' && showValidation && (
          <div className="dev-tools-panel">
            <ValidationForm type="env" />
          </div>
        )}

        {activeTab === 'time-travel' && showTimeTravel && (
          <div className="dev-tools-panel">
            <TimeTravelPanel />
          </div>
        )}

        {activeTab === 'model-comparison' && showModelComparison && (
          <div className="dev-tools-panel">
            <ModelComparisonPanel />
          </div>
        )}
      </div>

      <div className="dev-tools-footer">
        <p className="dev-tools-info">
          Powered by React 19 • Using useOptimistic for real-time updates
        </p>
      </div>
    </div>
  )
}
