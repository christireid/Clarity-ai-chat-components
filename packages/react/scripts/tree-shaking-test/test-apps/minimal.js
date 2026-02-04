/**
 * Minimal test: Import only one small utility
 * Expected: Smallest bundle, no React, no UI components
 */
import { sanitizeInput } from '@clarity-ai/react'

const result = sanitizeInput('<script>alert("xss")</script>')
console.log('Sanitized:', result)

export { result }
