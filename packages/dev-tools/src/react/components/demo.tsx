/**
 * Dev Tools Demo Page
 * Visual demonstration of all dev tools components
 * Used for testing and showcasing the UI
 */

'use client'

import * as React from 'react'
import { DevToolsDashboard } from './dev-tools-dashboard'
import {
  SearchIcon,
  ZapIcon,
  ClockIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  TrashIcon,
  PlayIcon,
  PauseIcon,
} from './icons'

export interface DemoPageProps {
  /** Initial theme */
  theme?: 'light' | 'dark' | 'auto'
}

/**
 * Demo Page Component
 * Showcases all dev tools components with sample data
 */
export function DemoPage({ theme = 'auto' }: DemoPageProps) {
  const [currentTheme, setCurrentTheme] = React.useState(theme)
  const [showIconsDemo, setShowIconsDemo] = React.useState(false)

  return (
    <div
      className={`dev-tools-root demo-page ${currentTheme === 'dark' ? 'dev-tools-dark' : ''}`}
    >
      {/* Demo Header */}
      <header className="demo-header">
        <div className="demo-header-content">
          <h1>Clarity Dev Tools Demo</h1>
          <p>Premium Developer Tools for AI Chat Applications</p>
        </div>
        <div className="demo-controls">
          <button
            className="dt-btn dt-btn-ghost"
            onClick={() => setShowIconsDemo(!showIconsDemo)}
          >
            {showIconsDemo ? 'Show Dashboard' : 'Show Icons'}
          </button>
          <select
            className="demo-theme-select"
            value={currentTheme}
            onChange={(e) =>
              setCurrentTheme(e.target.value as 'light' | 'dark' | 'auto')
            }
            aria-label="Select theme"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </select>
        </div>
      </header>

      {/* Main Content */}
      <main className="demo-content">
        {showIconsDemo ? (
          <IconsDemo />
        ) : (
          <DevToolsDashboard
            theme={currentTheme}
            enableKeyboardShortcuts
            showInspector
            showProfiler
            showValidation
            showTimeTravel
            showModelComparison
          />
        )}
      </main>

      {/* Features List */}
      <aside className="demo-features">
        <h2>Features</h2>
        <ul className="features-list">
          <li>
            <CheckCircleIcon size="sm" />
            <span>React 19 with useOptimistic</span>
          </li>
          <li>
            <CheckCircleIcon size="sm" />
            <span>90+ CSS Custom Properties</span>
          </li>
          <li>
            <CheckCircleIcon size="sm" />
            <span>Light &amp; Dark Mode</span>
          </li>
          <li>
            <CheckCircleIcon size="sm" />
            <span>Keyboard Navigation</span>
          </li>
          <li>
            <CheckCircleIcon size="sm" />
            <span>ARIA Accessibility</span>
          </li>
          <li>
            <CheckCircleIcon size="sm" />
            <span>Smooth Animations</span>
          </li>
          <li>
            <CheckCircleIcon size="sm" />
            <span>Error Boundaries</span>
          </li>
          <li>
            <CheckCircleIcon size="sm" />
            <span>Export Functionality</span>
          </li>
        </ul>
      </aside>
    </div>
  )
}

/**
 * Icons Demo Component
 * Showcases all available icons
 */
function IconsDemo() {
  const icons = [
    { name: 'Search', Icon: SearchIcon },
    { name: 'Zap', Icon: ZapIcon },
    { name: 'Clock', Icon: ClockIcon },
    { name: 'CheckCircle', Icon: CheckCircleIcon },
    { name: 'AlertTriangle', Icon: AlertTriangleIcon },
    { name: 'Trash', Icon: TrashIcon },
    { name: 'Play', Icon: PlayIcon },
    { name: 'Pause', Icon: PauseIcon },
  ]

  return (
    <div className="icons-demo">
      <h2>Icon Library</h2>
      <p className="icons-demo-description">
        All icons support size props (sm, md, lg, xl or custom number) and
        className.
      </p>
      <div className="icons-grid">
        {icons.map(({ name, Icon }) => (
          <div key={name} className="icon-item">
            <div className="icon-preview">
              <Icon size="lg" />
            </div>
            <span className="icon-name">{name}</span>
          </div>
        ))}
      </div>

      <h3>Icon Sizes</h3>
      <div className="icon-sizes">
        <div className="size-item">
          <SearchIcon size="sm" />
          <span>sm (14px)</span>
        </div>
        <div className="size-item">
          <SearchIcon size="md" />
          <span>md (16px)</span>
        </div>
        <div className="size-item">
          <SearchIcon size="lg" />
          <span>lg (18px)</span>
        </div>
        <div className="size-item">
          <SearchIcon size="xl" />
          <span>xl (48px)</span>
        </div>
        <div className="size-item">
          <SearchIcon size={24} />
          <span>24px</span>
        </div>
      </div>
    </div>
  )
}

/**
 * Buttons Demo Component
 */
export function ButtonsDemo() {
  return (
    <div className="buttons-demo">
      <h2>Button Variants</h2>
      <div className="button-row">
        <button className="dt-btn dt-btn-primary">Primary</button>
        <button className="dt-btn dt-btn-secondary">Secondary</button>
        <button className="dt-btn dt-btn-ghost">Ghost</button>
        <button className="dt-btn dt-btn-danger">Danger</button>
      </div>
      <div className="button-row">
        <button className="dt-btn dt-btn-primary dt-btn-sm">Small</button>
        <button className="dt-btn dt-btn-primary">Medium</button>
        <button className="dt-btn dt-btn-primary dt-btn-lg">Large</button>
      </div>
      <div className="button-row">
        <button className="dt-btn dt-btn-primary" disabled>
          Disabled
        </button>
        <button className="dt-btn dt-btn-primary">
          <ZapIcon size="sm" />
          With Icon
        </button>
        <button
          className="dt-btn dt-btn-ghost dt-btn-icon"
          aria-label="Icon only"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  )
}

/**
 * Status Badges Demo
 */
export function StatusBadgesDemo() {
  return (
    <div className="badges-demo">
      <h2>Status Badges</h2>
      <div className="badge-row">
        <span className="status-badge success">
          <CheckCircleIcon size="sm" />
          Success
        </span>
        <span className="status-badge warning">
          <AlertTriangleIcon size="sm" />
          Warning
        </span>
        <span className="status-badge error">
          <AlertTriangleIcon size="sm" />
          Error
        </span>
        <span className="status-badge pending">
          <ClockIcon size="sm" />
          Pending
        </span>
      </div>
    </div>
  )
}

export default DemoPage
