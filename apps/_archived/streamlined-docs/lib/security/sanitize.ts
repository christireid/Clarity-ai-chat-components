/**
 * User Input Sanitization Module
 *
 * Provides DOMPurify-based sanitization to prevent XSS attacks,
 * SQL injection, and prompt injection attacks in user-generated content.
 *
 * SECURITY REQUIREMENTS:
 * - Strip all HTML tags from user queries
 * - Limit input length to prevent DoS
 * - Use structured prompt templates to prevent injection
 * - Validate input types and formats
 */

import DOMPurify from 'isomorphic-dompurify'

/**
 * Maximum safe query length (prevents DoS and context overflow)
 */
const MAX_QUERY_LENGTH = 500

/**
 * Maximum message length for chat inputs (4KB is reasonable for chat)
 */
const MAX_MESSAGE_LENGTH = 4096

/**
 * Sanitize user query for RAG/search operations
 *
 * SECURITY CONTROLS:
 * - Strips ALL HTML tags (XSS prevention)
 * - Removes script tags and event handlers
 * - Limits length to 500 chars (DoS prevention)
 * - Trims whitespace
 *
 * @param query - Raw user query
 * @returns Sanitized query safe for RAG/search
 */
export function sanitizeUserQuery(query: string): string {
  if (!query || typeof query !== 'string') {
    return ''
  }

  // Use DOMPurify to strip ALL HTML tags and attributes
  const cleaned = DOMPurify.sanitize(query, {
    ALLOWED_TAGS: [], // No HTML tags allowed
    ALLOWED_ATTR: [], // No attributes allowed
    KEEP_CONTENT: true, // Keep text content
    RETURN_DOM: false, // Return string
    RETURN_DOM_FRAGMENT: false,
  })

  // Truncate to maximum length and trim
  return cleaned.substring(0, MAX_QUERY_LENGTH).trim()
}

/**
 * Sanitize chat message with context preservation
 *
 * Allows basic formatting tags for better UX while maintaining security.
 * Used for chat messages that may contain markdown or basic formatting.
 *
 * SECURITY CONTROLS:
 * - Allows only safe tags (b, i, em, strong, code)
 * - Strips dangerous attributes (onclick, onerror, etc.)
 * - Limits length to 4KB
 * - Removes script tags
 *
 * @param message - Raw chat message
 * @returns Sanitized message safe for display
 */
export function sanitizeChatMessage(message: string): string {
  if (!message || typeof message !== 'string') {
    return ''
  }

  // Allow basic formatting tags but strip dangerous content
  const cleaned = DOMPurify.sanitize(message, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'code', 'pre'],
    ALLOWED_ATTR: [], // No attributes allowed (prevents onclick, etc.)
    KEEP_CONTENT: true,
  })

  // Truncate to maximum length
  return cleaned.substring(0, MAX_MESSAGE_LENGTH).trim()
}

/**
 * Create structured prompt with sanitized user input
 *
 * SECURITY: Uses template-based approach to prevent prompt injection.
 * User input is clearly separated and sanitized, preventing injection attacks.
 *
 * @param userQuery - User's question
 * @param context - Optional RAG context
 * @returns Structured prompt safe from injection
 */
export function createStructuredPrompt(
  userQuery: string,
  context?: string
): string {
  const sanitizedQuery = sanitizeUserQuery(userQuery)

  // Use clear delimiters to prevent prompt injection
  if (context) {
    return `[DOCUMENTATION CONTEXT]
${context}

[USER QUESTION]
${sanitizedQuery}

[INSTRUCTIONS]
Answer the user's question using ONLY the provided documentation context. Be concise and accurate.`
  }

  return `[USER QUESTION]
${sanitizedQuery}

[INSTRUCTIONS]
Answer the user's question about Clarity Chat. Be concise and helpful.`
}

/**
 * Validate and sanitize session ID
 *
 * SECURITY: Ensures session IDs are properly formatted UUIDs
 * to prevent injection or path traversal attacks.
 *
 * @param sessionId - Raw session ID
 * @returns Sanitized session ID or null if invalid
 */
export function sanitizeSessionId(
  sessionId: string | undefined
): string | null {
  if (!sessionId || typeof sessionId !== 'string') {
    return null
  }

  // Only allow valid UUID format (prevents path traversal)
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

  if (uuidRegex.test(sessionId)) {
    return sessionId.toLowerCase()
  }

  return null
}

/**
 * Sanitize user ID for logging and tracking
 *
 * SECURITY: Validates user ID format to prevent injection attacks
 * in analytics and logging systems.
 *
 * @param userId - Raw user ID
 * @returns Sanitized user ID or 'anonymous'
 */
export function sanitizeUserId(userId: string | undefined): string {
  if (!userId || typeof userId !== 'string') {
    return 'anonymous'
  }

  // Remove any potentially dangerous characters
  const cleaned = userId.replace(/[^a-zA-Z0-9_-]/g, '')

  // Limit length
  return cleaned.substring(0, 64) || 'anonymous'
}

/**
 * Validate input length
 *
 * @param input - Input string
 * @param maxLength - Maximum allowed length
 * @returns Validation result
 */
export function validateInputLength(
  input: string,
  maxLength: number = MAX_MESSAGE_LENGTH
): { valid: boolean; error?: string } {
  if (!input || typeof input !== 'string') {
    return { valid: false, error: 'Input must be a string' }
  }

  if (input.length > maxLength) {
    return {
      valid: false,
      error: `Input exceeds maximum length of ${maxLength} characters`,
    }
  }

  return { valid: true }
}

/**
 * Detect and prevent common injection patterns
 *
 * SECURITY: Additional layer to detect SQL injection, command injection,
 * and prompt injection patterns.
 *
 * @param input - User input
 * @returns Detection result with pattern details
 */
export function detectInjectionPatterns(input: string): {
  detected: boolean
  patterns: string[]
} {
  const patterns: Array<{ name: string; regex: RegExp }> = [
    // SQL Injection
    {
      name: 'SQL Injection',
      regex:
        /(\b(select|insert|update|delete|drop|union|exec|script)\b.*\b(from|into|table|database)\b)/gi,
    },
    // Command Injection
    {
      name: 'Command Injection',
      regex: /[;&|`$(){}[\]<>]/g,
    },
    // Prompt Injection (common patterns)
    {
      name: 'Prompt Injection',
      regex:
        /(ignore previous instructions|disregard all|forget everything before|new instructions|system prompt|you are now)/gi,
    },
    // Path Traversal
    {
      name: 'Path Traversal',
      regex: /\.\.[\/\\]/g,
    },
  ]

  const detected: string[] = []

  for (const pattern of patterns) {
    if (pattern.regex.test(input)) {
      detected.push(pattern.name)
    }
  }

  return {
    detected: detected.length > 0,
    patterns: detected,
  }
}

/**
 * Comprehensive input sanitization with validation
 *
 * Applies all security checks and returns sanitized input or error.
 *
 * @param input - Raw user input
 * @param type - Input type for context-specific sanitization
 * @returns Result with sanitized input or error
 */
export function sanitizeInput(
  input: string,
  type: 'query' | 'message' | 'sessionId' | 'userId' = 'message'
): { sanitized: string | null; error?: string } {
  // Check for injection patterns
  const injectionCheck = detectInjectionPatterns(input)
  if (injectionCheck.detected) {
    return {
      sanitized: null,
      error: `Potentially malicious input detected: ${injectionCheck.patterns.join(', ')}`,
    }
  }

  // Type-specific sanitization
  switch (type) {
    case 'query':
      return { sanitized: sanitizeUserQuery(input) }
    case 'message':
      return { sanitized: sanitizeChatMessage(input) }
    case 'sessionId':
      return { sanitized: sanitizeSessionId(input) }
    case 'userId':
      return { sanitized: sanitizeUserId(input) }
    default:
      return { sanitized: sanitizeChatMessage(input) }
  }
}

/**
 * Export constants for use in tests and other modules
 */
export const SANITIZATION_CONSTANTS = {
  MAX_QUERY_LENGTH,
  MAX_MESSAGE_LENGTH,
}
