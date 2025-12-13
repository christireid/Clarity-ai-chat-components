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

/**
 * SVG Icons for tabs - inline for bundle size optimization
 */
const Icons = {
  Inspector: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  ),
  Profiler: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  Validation: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  ),
  TimeTravel: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Comparison: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 3h5v5" />
      <path d="M8 3H3v5" />
      <path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3" />
      <path d="m15 9 6-6" />
    </svg>
  ),
  Keyboard: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" ry="2" />
      <path d="M6 8h.001" />
      <path d="M10 8h.001" />
      <path d="M14 8h.001" />
      <path d="M18 8h.001" />
      <path d="M8 12h.001" />
      <path d="M12 12h.001" />
      <path d="M16 12h.001" />
      <path d="M7 16h10" />
    </svg>
  ),
}

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
      availableTabs.push({
        id: 'inspector',
        label: 'API Inspector',
        icon: <Icons.Inspector />,
        shortcut: '1',
        description: 'Monitor and debug API calls in real-time',
      })
    }
    if (showProfiler) {
      availableTabs.push({
        id: 'profiler',
        label: 'Profiler',
        icon: <Icons.Profiler />,
        shortcut: '2',
        description: 'Track performance metrics and bottlenecks',
      })
    }
    if (showValidation) {
      availableTabs.push({
        id: 'validation',
        label: 'Validation',
        icon: <Icons.Validation />,
        shortcut: '3',
        description: 'Validate configuration and API keys',
      })
    }
    if (showTimeTravel) {
      availableTabs.push({
        id: 'time-travel',
        label: 'Time Travel',
        icon: <Icons.TimeTravel />,
        shortcut: '4',
        description: 'Debug state changes with time-travel',
      })
    }
    if (showModelComparison) {
      availableTabs.push({
        id: 'model-comparison',
        label: 'Model Comparison',
        icon: <Icons.Comparison />,
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
            <Icons.Keyboard />
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
                {tab.id === 'inspector' && <APIInspectorPanel />}
                {tab.id === 'profiler' && <ProfilerPanel />}
                {tab.id === 'validation' && <ValidationForm type="env" />}
                {tab.id === 'time-travel' && <TimeTravelPanel />}
                {tab.id === 'model-comparison' && <ModelComparisonPanel />}
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
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
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
