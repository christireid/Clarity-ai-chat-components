'use client'

import dynamic from 'next/dynamic'

// Lazy load components that need client-side interactivity
const MobileBottomNav = dynamic(() =>
  import('@/components/Enhanced/MobileBottomNav').then((mod) => ({
    default: mod.MobileBottomNav,
  }))
)

const FloatingActionButton = dynamic(() =>
  import('@/components/Enhanced/FloatingActionButton').then((mod) => ({
    default: mod.FloatingActionButton,
  }))
)

/**
 * ClientLayout - Wrapper for client-side interactive components
 *
 * This component handles all client-side event handlers that cannot be
 * defined in Server Components.
 */
export function ClientLayout() {
  const handleSearchClick = () => {
    // Trigger search dialog (handled by Navigation component via window event)
    const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true })
    window.dispatchEvent(event)
  }

  const handleShortcutsClick = () => {
    const event = new KeyboardEvent('keydown', { key: '?' })
    window.dispatchEvent(event)
  }

  const handleAIClick = () => {
    // Trigger AI assistant (Cmd+.)
    const event = new KeyboardEvent('keydown', { key: '.', metaKey: true })
    window.dispatchEvent(event)
  }

  return (
    <>
      <MobileBottomNav />
      <FloatingActionButton
        onSearchClick={handleSearchClick}
        onShortcutsClick={handleShortcutsClick}
        onAIClick={handleAIClick}
      />
    </>
  )
}
