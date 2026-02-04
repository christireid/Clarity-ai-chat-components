/**
 * Hooks only test: Import custom hooks without components
 * Expected: Hook code + minimal React
 * Should NOT include: Any UI components, theme system
 */
import * as React from 'react'
import { useClarityChat, useAutoScroll } from '@clarity-ai/react'

function useTestHooks() {
  const chat = useClarityChat({
    apiKey: 'test',
    model: 'gpt-4',
  })

  const scrollRef = React.useRef(null)
  useAutoScroll(scrollRef, [chat.messages])

  return { chat, scrollRef }
}

export { useTestHooks }
