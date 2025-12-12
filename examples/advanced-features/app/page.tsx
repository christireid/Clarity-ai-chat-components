'use client'

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type KeyboardEvent,
} from 'react'
import { AdvancedFeaturesDemo } from '@/components/advanced-features-demo'

type TabId = 'demo' | 'suggestions' | 'battery' | 'performance'

const TABS: { id: TabId; label: string }[] = [
  { id: 'demo', label: 'Full Demo' },
  { id: 'suggestions', label: 'Suggestions' },
  { id: 'battery', label: 'Battery' },
  { id: 'performance', label: 'Performance' },
]

/**
 * Advanced Features Example
 *
 * This page demonstrates the four "Quick Win" advanced features:
 * 1. Enhanced Follow-up Suggestions (ML-ranked)
 * 2. Conversation Summarizer
 * 3. Battery-Aware Optimizations
 * 4. Performance Analytics Dashboard
 *
 * Keyboard Navigation:
 * - Arrow Left/Right: Navigate between tabs
 * - Home: Go to first tab
 * - End: Go to last tab
 * - Enter/Space: Activate focused tab
 */
export default function AdvancedFeaturesPage() {
  const [activeTab, setActiveTab] = useState<TabId>('demo')
  const [focusedIndex, setFocusedIndex] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  // Focus the tab button when focusedIndex changes
  useEffect(() => {
    tabRefs.current[focusedIndex]?.focus()
  }, [focusedIndex])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const currentIndex = TABS.findIndex((tab) => tab.id === activeTab)

      switch (event.key) {
        case 'ArrowLeft': {
          event.preventDefault()
          const prevIndex =
            currentIndex > 0 ? currentIndex - 1 : TABS.length - 1
          setFocusedIndex(prevIndex)
          break
        }
        case 'ArrowRight': {
          event.preventDefault()
          const nextIndex =
            currentIndex < TABS.length - 1 ? currentIndex + 1 : 0
          setFocusedIndex(nextIndex)
          break
        }
        case 'Home':
          event.preventDefault()
          setFocusedIndex(0)
          break
        case 'End':
          event.preventDefault()
          setFocusedIndex(TABS.length - 1)
          break
        case 'Enter':
        case ' ':
          event.preventDefault()
          setActiveTab(TABS[focusedIndex].id)
          break
      }
    },
    [activeTab, focusedIndex]
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Skip to content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg"
      >
        Skip to main content
      </a>

      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg" aria-hidden="true">
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-semibold">Advanced Features</h1>
              <p className="text-xs text-muted-foreground">
                Quick wins for production chat
              </p>
            </div>
          </div>

          {/* Tab Navigation with ARIA */}
          <nav
            role="tablist"
            aria-label="Feature demos"
            className="flex gap-1"
            onKeyDown={handleKeyDown}
          >
            {TABS.map((tab, index) => (
              <button
                key={tab.id}
                ref={(el) => {
                  tabRefs.current[index] = el
                }}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`tabpanel-${tab.id}`}
                tabIndex={activeTab === tab.id ? 0 : -1}
                onClick={() => {
                  setActiveTab(tab.id)
                  setFocusedIndex(index)
                }}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main
        id="main-content"
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
        className="container px-4 py-8"
      >
        <AdvancedFeaturesDemo activeTab={activeTab} />
      </main>

      {/* Keyboard shortcut hint */}
      <div className="fixed bottom-4 right-4 text-xs text-muted-foreground bg-card border rounded-lg px-3 py-2 shadow-sm">
        <span className="font-medium">Keyboard:</span> ← → to navigate tabs
      </div>
    </div>
  )
}
