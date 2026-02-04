/**
 * Request Validation Utilities
 *
 * Provides type-safe request validation using Zod schemas.
 * Ensures data integrity and prevents malformed data from reaching API handlers.
 *
 * @module validation
 */

import { z, ZodError, type ZodSchema } from 'zod'
import { NextResponse } from 'next/server'

/**
 * Validation result for successful validation
 */
export interface ValidationSuccess<T> {
  success: true
  data: T
}

/**
 * Validation result for failed validation
 */
export interface ValidationFailure {
  success: false
  error: ZodError
}

/**
 * Union type for validation results
 */
export type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure

/**
 * Validate request body against Zod schema
 *
 * @example
 * ```ts
 * const result = await validateRequestBody(request, mySchema)
 * if (!result.success) {
 *   return validationErrorResponse(result.error)
 * }
 * const { data } = result
 * ```
 */
export async function validateRequestBody<T>(
  request: Request,
  schema: ZodSchema<T>
): Promise<ValidationResult<T>> {
  try {
    const body = await request.json()
    const data = schema.parse(body)
    return { success: true, data }
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error }
    }
    // Re-throw non-Zod errors (e.g., JSON parse errors)
    throw error
  }
}

/**
 * Validate query parameters against Zod schema
 *
 * @example
 * ```ts
 * const { searchParams } = new URL(request.url)
 * const result = validateQueryParams(searchParams, mySchema)
 * if (!result.success) {
 *   return validationErrorResponse(result.error)
 * }
 * ```
 */
export function validateQueryParams<T>(
  searchParams: URLSearchParams,
  schema: ZodSchema<T>
): ValidationResult<T> {
  try {
    const params = Object.fromEntries(searchParams.entries())
    const data = schema.parse(params)
    return { success: true, data }
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error }
    }
    throw error
  }
}

/**
 * Formatted validation error for API responses
 */
export interface FormattedValidationError {
  error: 'Validation failed'
  issues: Array<{
    path: string
    message: string
    code: string
  }>
}

/**
 * Format Zod errors for API response
 *
 * Transforms Zod error details into a user-friendly format
 * suitable for API error responses.
 */
export function formatValidationErrors(error: ZodError): FormattedValidationError {
  return {
    error: 'Validation failed',
    issues: error.issues.map((issue) => ({
      path: issue.path.join('.') || 'root',
      message: issue.message,
      code: issue.code,
    })),
  }
}

/**
 * Create 422 Unprocessable Entity response for validation errors
 *
 * Returns a properly formatted validation error response with
 * 422 status code (Unprocessable Entity) as per RFC 4918.
 *
 * @example
 * ```ts
 * if (!validation.success) {
 *   return validationErrorResponse(validation.error)
 * }
 * ```
 */
export function validationErrorResponse(error: ZodError): NextResponse {
  return NextResponse.json(formatValidationErrors(error), {
    status: 422,
    headers: {
      'Content-Type': 'application/json',
    }
  })
}

/**
 * Common validation schemas for reuse across endpoints
 */
export const commonSchemas = {
  /**
   * UUID validation (v4)
   */
  uuid: z.string().uuid('Invalid UUID format'),

  /**
   * Session ID (UUID)
   */
  sessionId: z.string().uuid('Invalid session ID'),

  /**
   * User ID (alphanumeric with hyphens)
   */
  userId: z.string().regex(/^[a-zA-Z0-9-]+$/, 'Invalid user ID format'),

  /**
   * URL validation
   */
  url: z.string().url('Invalid URL format'),

  /**
   * Email validation
   */
  email: z.string().email('Invalid email address'),

  /**
   * Pagination limit (1-100)
   */
  paginationLimit: z.coerce.number().int().min(1).max(100).default(10),

  /**
   * Pagination offset (0+)
   */
  paginationOffset: z.coerce.number().int().min(0).default(0),

  /**
   * Timestamp (ISO 8601)
   */
  timestamp: z.string().datetime('Invalid timestamp format'),

  /**
   * Token count (positive integer)
   */
  tokenCount: z.number().int().positive('Token count must be positive'),

  /**
   * Temperature (0-1)
   */
  temperature: z.number().min(0).max(1, 'Temperature must be between 0 and 1'),

  /**
   * Max tokens (1-128000)
   */
  maxTokens: z.number().int().min(1).max(128000, 'Max tokens must be between 1 and 128000'),
}

/**
 * Validate and sanitize a string input
 *
 * Combines validation with trimming and optional transformation.
 */
export function validateString(
  minLength: number = 1,
  maxLength: number = 1000,
  errorMessage?: string
) {
  return z
    .string()
    .min(minLength, errorMessage || `Must be at least ${minLength} characters`)
    .max(maxLength, errorMessage || `Must be less than ${maxLength} characters`)
    .trim()
}

/**
 * Validate an array with length constraints
 */
export function validateArray<T>(
  itemSchema: ZodSchema<T>,
  minLength: number = 0,
  maxLength: number = 100
) {
  return z
    .array(itemSchema)
    .min(minLength, `Array must contain at least ${minLength} items`)
    .max(maxLength, `Array cannot contain more than ${maxLength} items`)
}

/**
 * Create a validation middleware wrapper for API routes
 *
 * @example
 * ```ts
 * export const POST = withValidation(myRequestSchema, async (request, data) => {
 *   // data is typed and validated
 *   return NextResponse.json({ success: true })
 * })
 * ```
 */
export function withValidation<T>(
  schema: ZodSchema<T>,
  handler: (request: Request, data: T) => Promise<Response>
) {
  return async (request: Request): Promise<Response> => {
    const validation = await validateRequestBody(request, schema)

    if (!validation.success) {
      return validationErrorResponse(validation.error)
    }

    return handler(request, validation.data)
  }
}

/**
 * Validate response data before sending
 *
 * Ensures API responses match expected schema.
 * Throws error in development, logs warning in production.
 */
export function validateResponse<T>(
  data: unknown,
  schema: ZodSchema<T>
): T {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof ZodError) {
      const isDev = process.env.NODE_ENV === 'development'

      if (isDev) {
        // In development, throw to catch schema mismatches early
        throw new Error(
          `Response validation failed:\n${formatValidationErrors(error).issues
            .map((i) => `  - ${i.path}: ${i.message}`)
            .join('\n')}`
        )
      } else {
        // In production, log and return data anyway (may be partial)
        console.error('Response validation warning:', formatValidationErrors(error))
        return data as T
      }
    }
    throw error
  }
}
