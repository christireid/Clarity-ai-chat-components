/**
 * Interactive Playground Component
 * A sandbox for testing and experimenting with dev-tools components
 */

'use client'

import * as React from 'react'
import {
  SearchIcon,
  ZapIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  ClockIcon,
  TrashIcon,
  PlayIcon,
  PauseIcon,
  InspectorIcon,
  ProfilerIcon,
  ValidationIcon,
  TimeTravelIcon,
  ComparisonIcon,
  SettingsIcon,
  InfoIcon,
  DownloadIcon,
} from './icons'
import {
  LoadingSpinner,
  LoadingOverlay,
  LoadingSkeleton,
  LoadingButton,
} from './loading-state'
import {
  ConfirmationDialog,
  useConfirmationDialog,
} from './confirmation-dialog'
import { VirtualList } from './virtual-list'
// Import from canonical accessibility sources
import { useA11y } from '@clarity-chat/primitives'

// ============================================================================
// Playground Sections
// ============================================================================

interface SectionProps {
  title: string
  description?: string
  children: React.ReactNode
}

function PlaygroundSection({ title, description, children }: SectionProps) {
  return (
    <section className="playground-section">
      <header className="playground-section-header">
        <h2 className="playground-section-title">{title}</h2>
        {description && (
          <p className="playground-section-description">{description}</p>
        )}
      </header>
      <div className="playground-section-content">{children}</div>
    </section>
  )
}

// ============================================================================
// Icons Playground
// ============================================================================

function IconsPlayground() {
  const [size, setSize] = React.useState<'sm' | 'md' | 'lg' | 'xl'>('md')

  const icons = [
    { name: 'Search', Icon: SearchIcon },
    { name: 'Zap', Icon: ZapIcon },
    { name: 'CheckCircle', Icon: CheckCircleIcon },
    { name: 'AlertTriangle', Icon: AlertTriangleIcon },
    { name: 'Clock', Icon: ClockIcon },
    { name: 'Trash', Icon: TrashIcon },
    { name: 'Play', Icon: PlayIcon },
    { name: 'Pause', Icon: PauseIcon },
    { name: 'Inspector', Icon: InspectorIcon },
    { name: 'Profiler', Icon: ProfilerIcon },
    { name: 'Validation', Icon: ValidationIcon },
    { name: 'TimeTravel', Icon: TimeTravelIcon },
    { name: 'Comparison', Icon: ComparisonIcon },
    { name: 'Settings', Icon: SettingsIcon },
    { name: 'Info', Icon: InfoIcon },
    { name: 'Download', Icon: DownloadIcon },
  ]

  return (
    <PlaygroundSection
      title="Icons"
      description="40+ SVG icons with size variants"
    >
      <div className="playground-controls">
        <label className="playground-control">
          <span>Size:</span>
          <select
            value={size}
            onChange={(e) => setSize(e.target.value as typeof size)}
            className="playground-select"
          >
            <option value="sm">Small (14px)</option>
            <option value="md">Medium (16px)</option>
            <option value="lg">Large (18px)</option>
            <option value="xl">XL (48px)</option>
          </select>
        </label>
      </div>
      <div className="playground-icon-grid">
        {icons.map(({ name, Icon }) => (
          <div key={name} className="playground-icon-item">
            <Icon size={size} />
            <span className="playground-icon-name">{name}</span>
          </div>
        ))}
      </div>
    </PlaygroundSection>
  )
}

// ============================================================================
// Buttons Playground
// ============================================================================

function ButtonsPlayground() {
  const [isLoading, setIsLoading] = React.useState(false)

  const handleLoadingClick = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <PlaygroundSection
      title="Buttons"
      description="Button variants, sizes, and states"
    >
      <div className="playground-button-group">
        <h3>Variants</h3>
        <div className="playground-row">
          <button className="dt-btn dt-btn-primary">Primary</button>
          <button className="dt-btn dt-btn-secondary">Secondary</button>
          <button className="dt-btn dt-btn-ghost">Ghost</button>
          <button className="dt-btn dt-btn-danger">Danger</button>
        </div>
      </div>

      <div className="playground-button-group">
        <h3>Sizes</h3>
        <div className="playground-row">
          <button className="dt-btn dt-btn-primary dt-btn-sm">Small</button>
          <button className="dt-btn dt-btn-primary">Medium</button>
          <button className="dt-btn dt-btn-primary dt-btn-lg">Large</button>
        </div>
      </div>

      <div className="playground-button-group">
        <h3>States</h3>
        <div className="playground-row">
          <button className="dt-btn dt-btn-primary" disabled>
            Disabled
          </button>
          <LoadingButton
            isLoading={isLoading}
            onClick={handleLoadingClick}
            loadingText="Loading..."
          >
            Click to Load
          </LoadingButton>
        </div>
      </div>

      <div className="playground-button-group">
        <h3>With Icons</h3>
        <div className="playground-row">
          <button className="dt-btn dt-btn-primary">
            <SearchIcon size="sm" />
            Search
          </button>
          <button className="dt-btn dt-btn-secondary">
            <DownloadIcon size="sm" />
            Download
          </button>
          <button
            className="dt-btn dt-btn-ghost dt-btn-icon"
            aria-label="Settings"
          >
            <SettingsIcon />
          </button>
        </div>
      </div>
    </PlaygroundSection>
  )
}

// ============================================================================
// Loading States Playground
// ============================================================================

function LoadingPlayground() {
  const [showOverlay, setShowOverlay] = React.useState(false)

  return (
    <PlaygroundSection
      title="Loading States"
      description="Spinners, overlays, and skeletons"
    >
      <div className="playground-loading-group">
        <h3>Spinners</h3>
        <div className="playground-row">
          <div className="playground-item">
            <LoadingSpinner size="sm" />
            <span>Small</span>
          </div>
          <div className="playground-item">
            <LoadingSpinner size="md" />
            <span>Medium</span>
          </div>
          <div className="playground-item">
            <LoadingSpinner size="lg" />
            <span>Large</span>
          </div>
        </div>
      </div>

      <div className="playground-loading-group">
        <h3>Skeletons</h3>
        <div className="playground-skeleton-demo">
          <LoadingSkeleton width="60%" height="1.5em" />
          <LoadingSkeleton lines={3} />
          <LoadingSkeleton width={100} height={100} radius="lg" />
        </div>
      </div>

      <div className="playground-loading-group">
        <h3>Loading Overlay</h3>
        <button
          className="dt-btn dt-btn-primary"
          onClick={() => setShowOverlay(true)}
        >
          Show Overlay (3s)
        </button>
        {showOverlay && (
          <LoadingOverlay isLoading={showOverlay} message="Processing...">
            <div className="playground-overlay-content">
              <p>This content is behind the overlay</p>
            </div>
          </LoadingOverlay>
        )}
        {showOverlay && setTimeout(() => setShowOverlay(false), 3000) && null}
      </div>
    </PlaygroundSection>
  )
}

// ============================================================================
// Dialog Playground
// ============================================================================

function DialogPlayground() {
  const [showDefault, setShowDefault] = React.useState(false)
  const [showDanger, setShowDanger] = React.useState(false)

  const dangerDialog = useConfirmationDialog({
    onConfirm: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500))
    },
  })

  return (
    <PlaygroundSection
      title="Confirmation Dialogs"
      description="Modal dialogs for confirming actions"
    >
      <div className="playground-row">
        <button
          className="dt-btn dt-btn-primary"
          onClick={() => setShowDefault(true)}
        >
          Default Dialog
        </button>
        <button className="dt-btn dt-btn-danger" onClick={dangerDialog.open}>
          Danger Dialog
        </button>
      </div>

      <ConfirmationDialog
        isOpen={showDefault}
        onClose={() => setShowDefault(false)}
        onConfirm={() => setShowDefault(false)}
        title="Confirm Action"
        message="Are you sure you want to proceed with this action?"
      />

      <ConfirmationDialog
        {...dangerDialog.dialogProps}
        title="Delete Item"
        message="This action cannot be undone. Are you sure you want to delete this item permanently?"
        variant="danger"
        confirmText="Delete"
      />
    </PlaygroundSection>
  )
}

// ============================================================================
// Virtual List Playground
// ============================================================================

function VirtualListPlayground() {
  const [itemCount, setItemCount] = React.useState(1000)
  const items = React.useMemo(
    () =>
      Array.from({ length: itemCount }, (_, i) => ({
        id: i,
        name: `Item ${i + 1}`,
        description: `This is the description for item ${i + 1}`,
      })),
    [itemCount]
  )

  return (
    <PlaygroundSection
      title="Virtual List"
      description="Efficient rendering for large lists"
    >
      <div className="playground-controls">
        <label className="playground-control">
          <span>Item Count:</span>
          <select
            value={itemCount}
            onChange={(e) => setItemCount(Number(e.target.value))}
            className="playground-select"
          >
            <option value={100}>100 items</option>
            <option value={1000}>1,000 items</option>
            <option value={10000}>10,000 items</option>
            <option value={100000}>100,000 items</option>
          </select>
        </label>
      </div>
      <div className="playground-virtual-list-container">
        <VirtualList
          items={items}
          itemHeight={60}
          containerHeight={300}
          renderItem={(item) => (
            <div className="playground-list-item">
              <strong>{item.name}</strong>
              <span>{item.description}</span>
            </div>
          )}
          getKey={(item) => item.id}
        />
      </div>
      <p className="playground-note">
        Only visible items are rendered. Try scrolling with{' '}
        {itemCount.toLocaleString()} items!
      </p>
    </PlaygroundSection>
  )
}

// ============================================================================
// Accessibility Playground
// ============================================================================

function AccessibilityPlayground() {
  const { announce } = useA11y()
  const [lastAnnouncement, setLastAnnouncement] = React.useState('')

  const handleAnnounce = (message: string, level: 'polite' | 'assertive') => {
    announce(message, { assertive: level === 'assertive' })
    setLastAnnouncement(`${level}: "${message}"`)
  }

  return (
    <PlaygroundSection
      title="Accessibility"
      description="Screen reader and keyboard navigation utilities"
    >
      <div className="playground-a11y-group">
        <h3>Screen Reader Announcements</h3>
        <div className="playground-row">
          <button
            className="dt-btn dt-btn-primary"
            onClick={() =>
              handleAnnounce('Action completed successfully', 'polite')
            }
          >
            Polite Announcement
          </button>
          <button
            className="dt-btn dt-btn-danger"
            onClick={() =>
              handleAnnounce('Error: Something went wrong!', 'assertive')
            }
          >
            Assertive Announcement
          </button>
        </div>
        {lastAnnouncement && (
          <p className="playground-note">Last: {lastAnnouncement}</p>
        )}
      </div>

      <div className="playground-a11y-group">
        <h3>Skip Link Demo</h3>
        <p className="playground-note">
          Press Tab to reveal the skip link (visible only on focus)
        </p>
        <a
          href="#playground-main"
          className="skip-link"
          style={{
            position: 'absolute',
            left: '-10000px',
            top: 'auto',
            width: '1px',
            height: '1px',
          }}
          onFocus={(e) => {
            e.target.style.left = '6px'
            e.target.style.top = '7px'
            e.target.style.width = 'auto'
            e.target.style.height = 'auto'
          }}
          onBlur={(e) => {
            e.target.style.left = '-10000px'
            e.target.style.top = 'auto'
            e.target.style.width = '1px'
            e.target.style.height = '1px'
          }}
        >
          Skip to main content
        </a>
      </div>

      <div className="playground-a11y-group">
        <h3>Keyboard Navigation</h3>
        <p className="playground-note">
          Use Arrow keys, Home, and End to navigate the list below
        </p>
        <KeyboardNavDemo />
      </div>
    </PlaygroundSection>
  )
}

function KeyboardNavDemo() {
  const [selected, setSelected] = React.useState(0)
  const items = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry']

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelected((s) => (s + 1) % items.length)
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelected((s) => (s - 1 + items.length) % items.length)
        break
      case 'Home':
        e.preventDefault()
        setSelected(0)
        break
      case 'End':
        e.preventDefault()
        setSelected(items.length - 1)
        break
    }
  }

  return (
    <ul
      role="listbox"
      className="playground-keyboard-nav-list"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-activedescendant={`item-${selected}`}
    >
      {items.map((item, i) => (
        <li
          key={item}
          id={`item-${i}`}
          role="option"
          aria-selected={i === selected}
          className={`playground-keyboard-nav-item ${i === selected ? 'selected' : ''}`}
          onClick={() => setSelected(i)}
        >
          {item}
        </li>
      ))}
    </ul>
  )
}

// ============================================================================
// Status Badges Playground
// ============================================================================

function BadgesPlayground() {
  return (
    <PlaygroundSection
      title="Status Badges"
      description="Status indicators with semantic colors"
    >
      <div className="playground-row">
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
        <span className="status-badge info">
          <InfoIcon size="sm" />
          Info
        </span>
      </div>
    </PlaygroundSection>
  )
}

// ============================================================================
// Main Playground Component
// ============================================================================

export interface PlaygroundProps {
  /** Theme mode */
  theme?: 'light' | 'dark' | 'auto'
  /** Additional CSS class */
  className?: string
}

/**
 * Interactive Playground for testing dev-tools components
 */
export function Playground({ theme = 'auto', className }: PlaygroundProps) {
  const [currentTheme, setCurrentTheme] = React.useState(theme)

  const containerClass = [
    'playground',
    currentTheme === 'dark' ? 'dev-tools-dark' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={containerClass} id="playground-main">
      <a
        href="#playground-main"
        className="skip-link"
        style={{
          position: 'absolute',
          left: '-10000px',
          width: '1px',
          height: '1px',
        }}
      >
        Skip to playground content
      </a>

      <header className="playground-header">
        <div className="playground-header-content">
          <h1 className="playground-title">
            <ZapIcon size="lg" />
            Component Playground
          </h1>
          <p className="playground-subtitle">
            Interactive sandbox for Clarity Dev Tools components
          </p>
        </div>
        <div className="playground-theme-toggle">
          <label htmlFor="theme-select">Theme:</label>
          <select
            id="theme-select"
            value={currentTheme}
            onChange={(e) =>
              setCurrentTheme(e.target.value as typeof currentTheme)
            }
            className="playground-select"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </select>
        </div>
      </header>

      <main className="playground-main">
        <IconsPlayground />
        <ButtonsPlayground />
        <BadgesPlayground />
        <LoadingPlayground />
        <DialogPlayground />
        <VirtualListPlayground />
        <AccessibilityPlayground />
      </main>

      <footer className="playground-footer">
        <p>
          Clarity Dev Tools - {new Date().getFullYear()} - 144+ Tests Passing
        </p>
      </footer>
    </div>
  )
}

export default Playground
