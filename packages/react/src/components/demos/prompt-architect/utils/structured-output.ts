/**
 * Structured Output Utility
 *
 * Handles parsing and validation of structured JSON responses from LLMs
 * when the Prompt Architect Studio is in "Structured Output" mode.
 *
 * @packageDocumentation
 */

import type {
  StructuredLLMResponse,
  StructuredOutputParseResult,
} from '../types'

// =============================================================================
// JSON SCHEMA
// =============================================================================

/**
 * JSON Schema for structured output validation
 * Conforms to JSON Schema draft-07
 */
export const STRUCTURED_OUTPUT_SCHEMA = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'StructuredLLMResponse',
  description: 'Schema for structured output from the Prompt Architect Studio',
  type: 'object',
  required: ['result'],
  properties: {
    thinking: {
      type: 'string',
      description: 'The reasoning process or chain-of-thought',
    },
    result: {
      description: 'The primary result or answer',
      oneOf: [
        { type: 'string' },
        { type: 'object' },
        { type: 'array' },
        { type: 'number' },
        { type: 'boolean' },
      ],
    },
    confidence: {
      type: 'number',
      minimum: 0,
      maximum: 1,
      description: 'Confidence score from 0 to 1',
    },
    metadata: {
      type: 'object',
      description: 'Optional metadata about the response',
      properties: {
        model: { type: 'string' },
        tokensUsed: { type: 'number' },
        processingTimeMs: { type: 'number' },
      },
      additionalProperties: true,
    },
  },
  additionalProperties: true,
} as const

// =============================================================================
// PARSING
// =============================================================================

/**
 * Regular expressions for extracting JSON from various formats
 */
const JSON_EXTRACTION_PATTERNS = [
  // JSON in markdown code block with language specifier
  /```json\s*\n?([\s\S]*?)\n?\s*```/,
  // JSON in generic markdown code block
  /```\s*\n?([\s\S]*?)\n?\s*```/,
  // JSON object pattern (starts with { ends with })
  /(\{[\s\S]*\})/,
  // JSON array pattern (starts with [ ends with ])
  /(\[[\s\S]*\])/,
]

/**
 * Extract JSON string from a response that may contain markdown or other formatting
 *
 * @param rawResponse - Raw response string from LLM
 * @returns Extracted JSON string or null if not found
 */
export function extractJsonFromResponse(rawResponse: string): string | null {
  const trimmed = rawResponse.trim()

  // Try to parse as-is first
  try {
    JSON.parse(trimmed)
    return trimmed
  } catch {
    // Not valid JSON, try extraction patterns
  }

  // Try each extraction pattern
  for (const pattern of JSON_EXTRACTION_PATTERNS) {
    const match = trimmed.match(pattern)
    if (match && match[1]) {
      const extracted = match[1].trim()
      try {
        JSON.parse(extracted)
        return extracted
      } catch {
        // This pattern matched but content isn't valid JSON, continue
      }
    }
  }

  return null
}

/**
 * Parse and validate a structured output response
 *
 * @param rawResponse - Raw response string from LLM
 * @returns Parse result with success flag, data, and/or error
 *
 * @example
 * ```ts
 * const result = parseStructuredOutput('{"result": "Hello", "confidence": 0.95}')
 * if (result.success) {
 *   console.log(result.data.result) // "Hello"
 * }
 * ```
 */
export function parseStructuredOutput(
  rawResponse: string
): StructuredOutputParseResult {
  if (!rawResponse || typeof rawResponse !== 'string') {
    return {
      success: false,
      error: 'Response is empty or not a string',
    }
  }

  // Try to extract JSON
  const jsonString = extractJsonFromResponse(rawResponse)

  if (!jsonString) {
    return {
      success: false,
      error: 'Could not extract valid JSON from response',
      rawJson: rawResponse.slice(0, 500), // Include truncated raw for debugging
    }
  }

  try {
    const parsed = JSON.parse(jsonString)

    // Validate it's an object
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      return {
        success: false,
        error: 'Response must be a JSON object, not an array or primitive',
        rawJson: jsonString,
      }
    }

    // Validate required 'result' field
    if (!('result' in parsed)) {
      return {
        success: false,
        error: 'Missing required field: "result"',
        rawJson: jsonString,
      }
    }

    // Validate confidence range if present
    if ('confidence' in parsed) {
      const confidence = parsed.confidence
      if (typeof confidence !== 'number' || confidence < 0 || confidence > 1) {
        return {
          success: false,
          error: 'Field "confidence" must be a number between 0 and 1',
          rawJson: jsonString,
        }
      }
    }

    // Validate thinking field if present
    if ('thinking' in parsed && typeof parsed.thinking !== 'string') {
      return {
        success: false,
        error: 'Field "thinking" must be a string',
        rawJson: jsonString,
      }
    }

    return {
      success: true,
      data: parsed as StructuredLLMResponse,
      rawJson: jsonString,
    }
  } catch (e) {
    return {
      success: false,
      error: `JSON parsing failed: ${e instanceof Error ? e.message : 'Unknown error'}`,
      rawJson: jsonString,
    }
  }
}

// =============================================================================
// FORMATTING
// =============================================================================

/**
 * Format a structured response for display
 *
 * @param response - Parsed structured response
 * @returns Formatted display string
 */
export function formatStructuredResponse(
  response: StructuredLLMResponse
): string {
  const parts: string[] = []

  // Thinking section
  if (response.thinking) {
    parts.push('💭 **Thinking:**')
    parts.push(response.thinking)
    parts.push('')
  }

  // Result section
  parts.push('✅ **Result:**')
  if (typeof response.result === 'object') {
    parts.push('```json')
    parts.push(JSON.stringify(response.result, null, 2))
    parts.push('```')
  } else {
    parts.push(String(response.result))
  }

  // Confidence section
  if (response.confidence !== undefined) {
    parts.push('')
    const confidencePercent = Math.round(response.confidence * 100)
    const confidenceBar = generateConfidenceBar(response.confidence)
    parts.push(`📊 **Confidence:** ${confidencePercent}% ${confidenceBar}`)
  }

  // Metadata section
  if (response.metadata && Object.keys(response.metadata).length > 0) {
    parts.push('')
    parts.push('📋 **Metadata:**')
    for (const [key, value] of Object.entries(response.metadata)) {
      parts.push(`  - ${formatMetadataKey(key)}: ${value}`)
    }
  }

  return parts.join('\n')
}

/**
 * Generate a visual confidence bar
 */
function generateConfidenceBar(confidence: number): string {
  const filled = Math.round(confidence * 10)
  const empty = 10 - filled
  return `[${'█'.repeat(filled)}${'░'.repeat(empty)}]`
}

/**
 * Format a metadata key for display
 */
function formatMetadataKey(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase())
    .trim()
}

// =============================================================================
// VALIDATION HELPERS
// =============================================================================

/**
 * Check if a string looks like it might be JSON
 *
 * @param str - String to check
 * @returns True if string starts with { or [
 */
export function looksLikeJson(str: string): boolean {
  const trimmed = str.trim()
  return trimmed.startsWith('{') || trimmed.startsWith('[')
}

/**
 * Check if a response appears to be in structured format
 *
 * @param response - Response string to check
 * @returns True if response appears to be structured JSON
 */
export function isStructuredResponse(response: string): boolean {
  const result = parseStructuredOutput(response)
  return result.success
}

/**
 * Validate that a result matches expected type
 *
 * @param result - Result value from structured response
 * @param expectedType - Expected type
 * @returns Validation result
 */
export function validateResultType(
  result: unknown,
  expectedType: 'string' | 'object' | 'array' | 'number' | 'boolean'
): { valid: boolean; error?: string } {
  const actualType = Array.isArray(result) ? 'array' : typeof result

  if (actualType !== expectedType) {
    return {
      valid: false,
      error: `Expected result of type "${expectedType}", got "${actualType}"`,
    }
  }

  return { valid: true }
}

// =============================================================================
// RESPONSE BUILDERS
// =============================================================================

/**
 * Create a mock structured response for testing/preview
 *
 * @param result - The result value
 * @param options - Optional fields
 * @returns Formatted JSON string
 */
export function createMockStructuredResponse(
  result: string | Record<string, unknown> | unknown[],
  options?: {
    thinking?: string
    confidence?: number
    metadata?: Record<string, unknown>
  }
): string {
  const response: StructuredLLMResponse = {
    result,
    ...options,
  }

  return JSON.stringify(response, null, 2)
}

/**
 * Create an error response in structured format
 *
 * @param error - Error message
 * @returns Formatted JSON string
 */
export function createErrorStructuredResponse(error: string): string {
  const response: StructuredLLMResponse = {
    result: null as unknown as string,
    thinking: `Error occurred: ${error}`,
    confidence: 0,
    metadata: {
      error: true,
      errorMessage: error,
    },
  }

  return JSON.stringify(response, null, 2)
}

// =============================================================================
// STREAMING SUPPORT
// =============================================================================

/**
 * State for accumulating streamed JSON
 */
export interface StreamingJsonState {
  buffer: string
  isComplete: boolean
  partialParse: Partial<StructuredLLMResponse> | null
  error: string | null
}

/**
 * Create initial streaming state
 */
export function createStreamingState(): StreamingJsonState {
  return {
    buffer: '',
    isComplete: false,
    partialParse: null,
    error: null,
  }
}

/**
 * Update streaming state with new chunk
 *
 * @param state - Current streaming state
 * @param chunk - New content chunk
 * @returns Updated state
 */
export function updateStreamingState(
  state: StreamingJsonState,
  chunk: string
): StreamingJsonState {
  const newBuffer = state.buffer + chunk

  // Try to parse accumulated buffer
  try {
    const parsed = JSON.parse(newBuffer)

    // Successfully parsed complete JSON
    return {
      buffer: newBuffer,
      isComplete: true,
      partialParse: parsed as StructuredLLMResponse,
      error: null,
    }
  } catch {
    // Not complete yet, try to extract partial data
    const partialParse = tryPartialParse(newBuffer)

    return {
      buffer: newBuffer,
      isComplete: false,
      partialParse,
      error: null,
    }
  }
}

/**
 * Attempt to extract partial data from incomplete JSON
 */
function tryPartialParse(
  buffer: string
): Partial<StructuredLLMResponse> | null {
  const partial: Partial<StructuredLLMResponse> = {}

  // Try to extract thinking field
  const thinkingMatch = buffer.match(/"thinking"\s*:\s*"([^"]*)/i)
  if (thinkingMatch) {
    partial.thinking = thinkingMatch[1]
  }

  // Try to extract result field (string value)
  const resultMatch = buffer.match(/"result"\s*:\s*"([^"]*)/i)
  if (resultMatch) {
    partial.result = resultMatch[1]
  }

  // Try to extract confidence
  const confidenceMatch = buffer.match(/"confidence"\s*:\s*([0-9.]+)/i)
  if (confidenceMatch) {
    const confidence = parseFloat(confidenceMatch[1])
    if (!isNaN(confidence)) {
      partial.confidence = confidence
    }
  }

  return Object.keys(partial).length > 0 ? partial : null
}
