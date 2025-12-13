/**
 * Developer Tools Dashboard
 * Premium dashboard combining all dev tools components
 * React 19 component with accessibility, keyboard navigation, and delightful UX
 */

'use client'

import * as React from 'react'
import { APIInspectorPanel } from './api-inspector-panel'
import { ProfilerPanel } from './profiler-panel'
import { ValidationForm } from './validation-form'
import { TimeTravelPanel } from './time-travel-panel'
import { ModelComparisonPanel } from './model-comparison-panel'
import { PanelErrorBoundary } from './error-boundary'
import {
  InspectorIcon,
  ProfilerIcon,
  ValidationIcon,
  TimeTravelIcon,
  ComparisonIcon,
  KeyboardIcon,
  CloseIcon,
} from './icons'

export interface DevToolsDashboardProps {
  /** Additional CSS classes */
  className?: string
  /** Default active tab */
  defaultTab?:
    | 'inspector'
    | 'profiler'
    | 'validation'
    | 'time-travel'
    | 'model-comparison'
  /** Show API Inspector tab */
  showInspector?: boolean
  /** Show Profiler tab */
  showProfiler?: boolean
  /** Show Validation tab */
  showValidation?: boolean
  /** Show Time Travel tab */
  showTimeTravel?: boolean
  /** Show Model Comparison tab */
  showModelComparison?: boolean
  /** Theme mode - auto follows system preference */
  theme?: 'light' | 'dark' | 'auto'
  /** Callback when tab changes */
  onTabChange?: (tab: Tab) => void
  /** Enable keyboard shortcuts */
  enableKeyboardShortcuts?: boolean
  /** Compact mode for smaller viewports */
  compact?: boolean
}

type Tab =
  | 'inspector'
  | 'profiler'
  | 'validation'
  | 'time-travel'
  | 'model-comparison'

interface TabConfig {
  id: Tab
  label: string
  icon: React.ReactNode
  shortcut: string
  description: string
}

// Tab icon mapping using shared icons
const TabIcons = {
  inspector: InspectorIcon,
  profiler: ProfilerIcon,
  validation: ValidationIcon,
  'time-travel': TimeTravelIcon,
  'model-comparison': ComparisonIcon,
} as const

/**
 * Developer Tools Dashboard Component
 * A premium, accessible dashboard combining all dev tools
 */
export function DevToolsDashboard({
  className,
  defaultTab = 'inspector',
  showInspector = true,
  showProfiler = true,
  showValidation = true,
  showTimeTravel = true,
  showModelComparison = true,
  theme = 'auto',
  onTabChange,
  enableKeyboardShortcuts = true,
  compact = false,
}: DevToolsDashboardProps) {
  const [activeTab, setActiveTab] = React.useState<Tab>(defaultTab)
  const [showShortcuts, setShowShortcuts] = React.useState(false)
  const tabListRef = React.useRef<HTMLDivElement>(null)
  const tabRefs = React.useRef<Map<Tab, HTMLButtonElement>>(new Map())

  // Build available tabs
  const tabs = React.useMemo<TabConfig[]>(() => {
    const availableTabs: TabConfig[] = []

    if (showInspector) {
      const Icon = TabIcons.inspector
      availableTabs.push({
        id: 'inspector',
        label: 'API Inspector',
        icon: <Icon size="lg" />,
        shortcut: '1',
        description: 'Monitor and debug API calls in real-time',
      })
    }
    if (showProfiler) {
      const Icon = TabIcons.profiler
      availableTabs.push({
        id: 'profiler',
        label: 'Profiler',
        icon: <Icon size="lg" />,
        shortcut: '2',
        description: 'Track performance metrics and bottlenecks',
      })
    }
    if (showValidation) {
      const Icon = TabIcons.validation
      availableTabs.push({
        id: 'validation',
        label: 'Validation',
        icon: <Icon size="lg" />,
        shortcut: '3',
        description: 'Validate configuration and API keys',
      })
    }
    if (showTimeTravel) {
      const Icon = TabIcons['time-travel']
      availableTabs.push({
        id: 'time-travel',
        label: 'Time Travel',
        icon: <Icon size="lg" />,
        shortcut: '4',
        description: 'Debug state changes with time-travel',
      })
    }
    if (showModelComparison) {
      const Icon = TabIcons['model-comparison']
      availableTabs.push({
        id: 'model-comparison',
        label: 'Model Comparison',
        icon: <Icon size="lg" />,
        shortcut: '5',
        description: 'Compare AI model responses and costs',
      })
    }

    return availableTabs
  }, [
    showInspector,
    showProfiler,
    showValidation,
    showTimeTravel,
    showModelComparison,
  ])

  // Handle tab change
  const handleTabChange = React.useCallback(
    (tab: Tab) => {
      setActiveTab(tab)
      onTabChange?.(tab)
    },
    [onTabChange]
  )

  // Keyboard navigation
  React.useEffect(() => {
    if (!enableKeyboardShortcuts) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      // Number shortcuts (1-5)
      if (e.key >= '1' && e.key <= '5') {
        const index = parseInt(e.key) - 1
        if (tabs[index]) {
          e.preventDefault()
          handleTabChange(tabs[index].id)
          tabRefs.current.get(tabs[index].id)?.focus()
        }
      }

      // ? to show shortcuts
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        setShowShortcuts((prev) => !prev)
      }

      // Escape to close shortcuts
      if (e.key === 'Escape' && showShortcuts) {
        setShowShortcuts(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [enableKeyboardShortcuts, tabs, handleTabChange, showShortcuts])

  // Arrow key navigation within tabs
  const handleTabKeyDown = React.useCallback(
    (e: React.KeyboardEvent, currentIndex: number) => {
      let newIndex = currentIndex

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1
          break
        case 'ArrowRight':
          e.preventDefault()
          newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0
          break
        case 'Home':
          e.preventDefault()
          newIndex = 0
          break
        case 'End':
          e.preventDefault()
          newIndex = tabs.length - 1
          break
        default:
          return
      }

      const newTab = tabs[newIndex]
      if (newTab) {
        handleTabChange(newTab.id)
        tabRefs.current.get(newTab.id)?.focus()
      }
    },
    [tabs, handleTabChange]
  )

  // Theme class
  const themeClass =
    theme === 'auto' ? '' : theme === 'dark' ? 'dev-tools-dark' : ''

  return (
    <div
      className={`dev-tools-root dev-tools-dashboard ${themeClass} ${compact ? 'dev-tools-compact' : ''} ${className || ''}`}
      data-testid="dev-tools-dashboard"
    >
      {/* Skip link for accessibility */}
      <a href="#dev-tools-content" className="skip-link">
        Skip to content
      </a>

      {/* Header */}
      <header className="dev-tools-header">
        <div className="dev-tools-header-content">
          <h1>Developer Tools</h1>
          <p className="dev-tools-subtitle">AI Chat Development Suite</p>
        </div>
        {enableKeyboardShortcuts && (
          <button
            className="dt-btn dt-btn-ghost keyboard-hint"
            onClick={() => setShowShortcuts((prev) => !prev)}
            aria-label="Show keyboard shortcuts"
            title="Keyboard shortcuts (?)"
          >
            <KeyboardIcon size="sm" />
            <span className="keyboard-hint-text">?</span>
          </button>
        )}
      </header>

      {/* Tab navigation */}
      <nav className="dev-tools-tabs" aria-label="Developer tools tabs">
        <div
          ref={tabListRef}
          role="tablist"
          aria-label="Developer tool panels"
          className="dev-tools-tablist"
        >
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              ref={(el) => {
                if (el) tabRefs.current.set(tab.id, el)
              }}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
              tabIndex={activeTab === tab.id ? 0 : -1}
              className={`dev-tools-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => handleTabChange(tab.id)}
              onKeyDown={(e) => handleTabKeyDown(e, index)}
            >
              <span className="tab-icon" aria-hidden="true">
                {tab.icon}
              </span>
              <span className="tab-label">{tab.label}</span>
              {enableKeyboardShortcuts && !compact && (
                <kbd className="tab-shortcut" aria-hidden="true">
                  {tab.shortcut}
                </kbd>
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Main content */}
      <main id="dev-tools-content" className="dev-tools-content">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            role="tabpanel"
            id={`panel-${tab.id}`}
            aria-labelledby={`tab-${tab.id}`}
            hidden={activeTab !== tab.id}
            tabIndex={0}
            className="dev-tools-panel"
          >
            {activeTab === tab.id && (
              <>
                {tab.id === 'inspector' && (
                  <PanelErrorBoundary panelName="API Inspector">
                    <APIInspectorPanel />
                  </PanelErrorBoundary>
                )}
                {tab.id === 'profiler' && (
                  <PanelErrorBoundary panelName="Profiler">
                    <ProfilerPanel />
                  </PanelErrorBoundary>
                )}
                {tab.id === 'validation' && (
                  <PanelErrorBoundary panelName="Validation">
                    <ValidationForm type="env" />
                  </PanelErrorBoundary>
                )}
                {tab.id === 'time-travel' && (
                  <PanelErrorBoundary panelName="Time Travel">
                    <TimeTravelPanel />
                  </PanelErrorBoundary>
                )}
                {tab.id === 'model-comparison' && (
                  <PanelErrorBoundary panelName="Model Comparison">
                    <ModelComparisonPanel />
                  </PanelErrorBoundary>
                )}
              </>
            )}
          </div>
        ))}
      </main>

      {/* Footer */}
      <footer className="dev-tools-footer">
        <p className="dev-tools-info">
          <span>Clarity Dev Tools</span>
          <span className="footer-separator">•</span>
          <span>React 19</span>
          <span className="footer-separator">•</span>
          <span>Optimistic Updates</span>
        </p>
      </footer>

      {/* Keyboard shortcuts modal */}
      {showShortcuts && (
        <div
          className="shortcuts-overlay"
          onClick={() => setShowShortcuts(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="shortcuts-title"
        >
          <div className="shortcuts-modal" onClick={(e) => e.stopPropagation()}>
            <header className="shortcuts-header">
              <h2 id="shortcuts-title">Keyboard Shortcuts</h2>
              <button
                className="dt-btn dt-btn-ghost dt-btn-icon"
                onClick={() => setShowShortcuts(false)}
                aria-label="Close shortcuts"
              >
                <CloseIcon size={20} />
              </button>
            </header>
            <div className="shortcuts-content">
              <div className="shortcuts-group">
                <h3>Navigation</h3>
                <ul className="shortcuts-list">
                  {tabs.map((tab) => (
                    <li key={tab.id} className="shortcut-item">
                      <kbd>{tab.shortcut}</kbd>
                      <span>{tab.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="shortcuts-group">
                <h3>General</h3>
                <ul className="shortcuts-list">
                  <li className="shortcut-item">
                    <kbd>?</kbd>
                    <span>Toggle shortcuts</span>
                  </li>
                  <li className="shortcut-item">
                    <kbd>Esc</kbd>
                    <span>Close dialog</span>
                  </li>
                  <li className="shortcut-item">
                    <kbd>←</kbd> <kbd>→</kbd>
                    <span>Navigate tabs</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
