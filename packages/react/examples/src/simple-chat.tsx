/**
 * Simple Chat Example - The Easiest Way to Get Started
 * 
 * This example shows the absolute minimum code needed to get a
 * fully functional AI chat interface running.
 * 
 * Copy this → paste → you're done.
 */

import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

export function SimpleChat() {
  return <ClarityChat api="/api/chat" />
}

/**
 * That's it! ✨
 * 
 * You now have:
 * - Full chat interface
 * - Streaming support
 * - Error handling
 * - Loading states
 * - Beautiful UI
 * - WCAG AA accessibility
 * - Mobile responsive
 * 
 * Want more? See the other examples:
 * - With memory: examples/clarity-chat-with-memory-example.tsx
 * - With customization: examples/advanced-clarity-chat-example.tsx
 */
