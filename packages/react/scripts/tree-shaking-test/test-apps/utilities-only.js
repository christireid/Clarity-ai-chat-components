/**
 * Utilities only test: Import utility functions
 * Expected: Minimal bundle, no React, no components
 * Should NOT include: React, any UI code, hooks
 */
import {
  sanitizeInput,
  truncateText,
  formatTokenCount,
} from '@clarity-ai/react'

const safe = sanitizeInput('<b>test</b>')
const short = truncateText('very long text here', 10)
const tokens = formatTokenCount(1500)

console.log({ safe, short, tokens })

export { safe, short, tokens }
