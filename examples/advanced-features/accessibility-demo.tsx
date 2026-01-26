/**
 * Interactive Accessibility Demo
 *
 * Demonstrates accessibility patterns and utilities available
 * in the Clarity Chat component library.
 *
 * This example serves as both documentation and a testing ground
 * for accessibility features.
 */

import * as React from 'react'
import {
  accessibleClickHandler,
  useFocusTrap,
  useAutoFocus,
  useEscapeKey,
  announceToScreenReader,
} from '../utils/accessibility'
import {
  ErrorBoundary,
  LoadingSpinner,
  EmptyState,
} from '../utils/ErrorBoundary'

// =============================================================================
// Interactive Accessibility Demo
// =============================================================================

export function AccessibilityDemo() {
  return (
    <ErrorBoundary>
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <header className="border-b pb-4">
          <h1 className="text-3xl font-bold">Accessibility Demo</h1>
          <p className="text-muted-foreground mt-2">
            Interactive examples of accessibility patterns and utilities. Test
            with keyboard navigation (Tab, Enter, Space, Escape) and screen
            readers.
          </p>
        </header>

        {/* Demo Sections */}
        <AccessibleClickDemo />
        <FocusTrapDemo />
        <AutoFocusDemo />
        <EscapeKeyDemo />
        <ScreenReaderDemo />
        <KeyboardNavigationDemo />
      </div>
    </ErrorBoundary>
  )
}

// =============================================================================
// 1. Accessible Click Handler Demo
// =============================================================================

function AccessibleClickDemo() {
  const [clickCount, setClickCount] = React.useState(0)
  const [selectedCard, setSelectedCard] = React.useState<string | null>(null)

  const cards = [
    {
      id: 'card-1',
      title: 'First Card',
      description: 'Click or press Enter/Space',
    },
    { id: 'card-2', title: 'Second Card', description: 'Keyboard accessible' },
    { id: 'card-3', title: 'Third Card', description: 'Focus ring visible' },
  ]

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">1. Accessible Click Handler</h2>
      <p className="text-sm text-muted-foreground">
        Makes any element keyboard-accessible with role="button", tabIndex, and
        keyboard handlers.
      </p>

      {/* Simple clickable div */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Simple Clickable Div</h3>
        <div
          {...accessibleClickHandler(() => setClickCount((c) => c + 1))}
          className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Click me ({clickCount})
        </div>
      </div>

      {/* Selectable cards */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Selectable Cards</h3>
        <div className="grid grid-cols-3 gap-4">
          {cards.map((card) => (
            <div
              key={card.id}
              {...accessibleClickHandler(() => setSelectedCard(card.id))}
              aria-pressed={selectedCard === card.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
                selectedCard === card.id
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'hover:bg-accent'
              }`}
            >
              <h4 className="font-medium">{card.title}</h4>
              <p className="text-sm opacity-80">{card.description}</p>
            </div>
          ))}
        </div>
        {selectedCard && (
          <p className="text-sm" role="status" aria-live="polite">
            Selected: {selectedCard}
          </p>
        )}
      </div>
    </section>
  )
}

// =============================================================================
// 2. Focus Trap Demo
// =============================================================================

function FocusTrapDemo() {
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const { containerRef } = useFocusTrap({
    enabled: isModalOpen,
    autoFocus: true,
    returnFocus: true,
  })
  useEscapeKey(() => setIsModalOpen(false), isModalOpen)

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">2. Focus Trap</h2>
      <p className="text-sm text-muted-foreground">
        Keeps keyboard focus within a container (essential for modals). Press
        Tab to cycle through elements, Escape to close.
      </p>

      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        Open Modal (Focus Trap Demo)
      </button>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}
          role="presentation"
        >
          <div
            ref={containerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="bg-background p-6 rounded-lg shadow-xl max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 id="modal-title" className="text-xl font-semibold">
                Focus Trap Modal
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                aria-label="Close modal"
                className="text-2xl focus:outline-none focus:ring-2 focus:ring-primary rounded"
              >
                ✕
              </button>
            </div>

            <p className="mb-4">
              Focus is trapped within this modal. Press Tab to cycle through the
              interactive elements below:
            </p>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="First input (auto-focused)"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="text"
                placeholder="Second input"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border rounded hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    announceToScreenReader('Action confirmed')
                    setIsModalOpen(false)
                  }}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  Confirm
                </button>
              </div>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              Press Escape to close
            </p>
          </div>
        </div>
      )}
    </section>
  )
}

// =============================================================================
// 3. Auto-Focus Demo
// =============================================================================

function AutoFocusDemo() {
  const [showSearch, setShowSearch] = React.useState(false)
  const inputRef = useAutoFocus<HTMLInputElement>(showSearch)

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">3. Auto-Focus</h2>
      <p className="text-sm text-muted-foreground">
        Automatically focuses an element when a condition becomes true.
      </p>

      <button
        onClick={() => setShowSearch(!showSearch)}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        {showSearch ? 'Hide Search' : 'Show Search (Auto-Focus)'}
      </button>

      {showSearch && (
        <div className="p-4 border rounded-lg">
          <label
            htmlFor="search-input"
            className="block text-sm font-medium mb-2"
          >
            Search (auto-focused when shown)
          </label>
          <input
            id="search-input"
            ref={inputRef}
            type="search"
            placeholder="Start typing to search..."
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      )}
    </section>
  )
}

// =============================================================================
// 4. Escape Key Demo
// =============================================================================

function EscapeKeyDemo() {
  const [isToastVisible, setIsToastVisible] = React.useState(false)
  useEscapeKey(() => setIsToastVisible(false), isToastVisible)

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">4. Escape Key Handler</h2>
      <p className="text-sm text-muted-foreground">
        Closes dismissible content when Escape is pressed.
      </p>

      <button
        onClick={() => setIsToastVisible(true)}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        Show Toast (Press Escape to Dismiss)
      </button>

      {isToastVisible && (
        <div
          role="alert"
          className="fixed bottom-4 right-4 bg-background border shadow-lg rounded-lg p-4 max-w-sm"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">Dismissible Toast</p>
              <p className="text-sm text-muted-foreground">
                Press Escape to close this toast.
              </p>
            </div>
            <button
              onClick={() => setIsToastVisible(false)}
              aria-label="Dismiss notification"
              className="text-xl focus:outline-none focus:ring-2 focus:ring-primary rounded"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

// =============================================================================
// 5. Screen Reader Announcements Demo
// =============================================================================

function ScreenReaderDemo() {
  const [lastAnnouncement, setLastAnnouncement] = React.useState<string | null>(
    null
  )

  const handleAnnounce = (
    message: string,
    priority: 'polite' | 'assertive'
  ) => {
    announceToScreenReader(message, priority)
    setLastAnnouncement(`[${priority}] ${message}`)
  }

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">5. Screen Reader Announcements</h2>
      <p className="text-sm text-muted-foreground">
        Announces dynamic content changes to screen readers using ARIA live
        regions.
      </p>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => handleAnnounce('Form saved successfully', 'polite')}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Announce Success (Polite)
        </button>
        <button
          onClick={() =>
            handleAnnounce('Error: Please check your input', 'assertive')
          }
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Announce Error (Assertive)
        </button>
        <button
          onClick={() =>
            handleAnnounce('Loading complete, 5 items found', 'polite')
          }
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Announce Update (Polite)
        </button>
      </div>

      {lastAnnouncement && (
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm font-medium">Last Announcement:</p>
          <p className="text-sm">{lastAnnouncement}</p>
          <p className="text-xs text-muted-foreground mt-2">
            (Screen readers will hear this, but it's hidden visually)
          </p>
        </div>
      )}
    </section>
  )
}

// =============================================================================
// 6. Keyboard Navigation Demo
// =============================================================================

function KeyboardNavigationDemo() {
  const [focusedIndex, setFocusedIndex] = React.useState(-1)
  const listRef = React.useRef<HTMLUListElement>(null)

  const items = [
    { id: 1, label: 'Home' },
    { id: 2, label: 'Products' },
    { id: 3, label: 'About' },
    { id: 4, label: 'Contact' },
  ]

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setFocusedIndex((prev) => Math.min(prev + 1, items.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setFocusedIndex((prev) => Math.max(prev - 1, 0))
        break
      case 'Home':
        e.preventDefault()
        setFocusedIndex(0)
        break
      case 'End':
        e.preventDefault()
        setFocusedIndex(items.length - 1)
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (focusedIndex >= 0) {
          announceToScreenReader(`Selected ${items[focusedIndex].label}`)
        }
        break
    }
  }

  React.useEffect(() => {
    if (focusedIndex >= 0 && listRef.current) {
      const button = listRef.current.querySelector(
        `[data-index="${focusedIndex}"]`
      ) as HTMLButtonElement | null
      button?.focus()
    }
  }, [focusedIndex])

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">
        6. Keyboard Navigation (Arrow Keys)
      </h2>
      <p className="text-sm text-muted-foreground">
        Navigate with arrow keys, Home/End for first/last item. This pattern is
        used for menus and lists.
      </p>

      <div className="p-4 border rounded-lg max-w-xs">
        <p className="text-sm font-medium mb-2">Navigation Menu</p>
        <ul
          ref={listRef}
          role="menu"
          aria-label="Navigation menu"
          onKeyDown={handleKeyDown}
          className="space-y-1"
        >
          {items.map((item, index) => (
            <li key={item.id} role="none">
              <button
                role="menuitem"
                data-index={index}
                tabIndex={index === 0 ? 0 : -1}
                className={`w-full text-left px-3 py-2 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
                  focusedIndex === index
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent'
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted-foreground mt-2">
          Use ↑↓ arrows, Home, End keys
        </p>
      </div>
    </section>
  )
}

// =============================================================================
// Exports
// =============================================================================

export default AccessibilityDemo
