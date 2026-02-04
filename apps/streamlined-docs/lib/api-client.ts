/**
 * API Client Utilities
 *
 * Provides secure fetch wrapper that automatically includes CSRF tokens
 * for all mutating requests (POST, PUT, DELETE, PATCH).
 *
 * Wave 3.4 Agent 37 - Security Headers Auditor
 */

/**
 * Get CSRF token from meta tag in document head
 *
 * The token is embedded server-side during page rendering and
 * must be included in all mutating API requests.
 *
 * @returns CSRF token string or null if not found
 */
export function getCSRFToken(): string | null {
  if (typeof document === 'undefined') {
    return null
  }

  const meta = document.querySelector('meta[name="csrf-token"]')
  return meta?.getAttribute('content') || null
}

/**
 * Get session ID from cookie
 *
 * @returns Session ID string or null if not found
 */
export function getSessionId(): string | null {
  if (typeof document === 'undefined') {
    return null
  }

  const cookies = document.cookie.split(';')
  const sessionCookie = cookies.find((c) => c.trim().startsWith('sessionId='))

  if (sessionCookie) {
    return sessionCookie.split('=')[1]?.trim() || null
  }

  return null
}

/**
 * Check if request method requires CSRF protection
 *
 * @param method - HTTP method
 * @returns true if method requires CSRF token
 */
function requiresCSRFProtection(method: string): boolean {
  return ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method.toUpperCase())
}

/**
 * Secure fetch wrapper that automatically includes CSRF token
 *
 * Usage:
 * ```typescript
 * // Instead of fetch()
 * const response = await apiFetch('/api/endpoint', {
 *   method: 'POST',
 *   body: JSON.stringify({ data: 'value' }),
 *   headers: {
 *     'Content-Type': 'application/json',
 *   },
 * })
 * ```
 *
 * @param url - API endpoint URL
 * @param options - Fetch options (method, body, headers, etc.)
 * @returns Promise<Response>
 */
export async function apiFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const method = options.method || 'GET'
  const headers: HeadersInit = { ...options.headers }

  // Add CSRF token for mutating requests
  if (requiresCSRFProtection(method)) {
    const csrfToken = getCSRFToken()
    if (csrfToken) {
      // Add as header
      if (headers instanceof Headers) {
        headers.set('X-CSRF-Token', csrfToken)
      } else if (Array.isArray(headers)) {
        headers.push(['X-CSRF-Token', csrfToken])
      } else {
        headers['X-CSRF-Token'] = csrfToken
      }
    }
  }

  // Always include credentials for cookie-based auth
  const fetchOptions: RequestInit = {
    ...options,
    headers,
    credentials: options.credentials || 'same-origin',
  }

  return fetch(url, fetchOptions)
}

/**
 * Initialize session if not present
 *
 * Call this on app startup to ensure user has a session cookie.
 * This is necessary for CSRF protection to work.
 *
 * @returns Promise<void>
 */
export async function initializeSession(): Promise<void> {
  const sessionId = getSessionId()

  if (!sessionId) {
    try {
      await fetch('/api/session', {
        method: 'GET',
        credentials: 'same-origin',
      })
    } catch (error) {
      console.warn('Failed to initialize session:', error)
    }
  }
}

/**
 * JSON fetch wrapper with CSRF protection
 *
 * Automatically parses JSON responses and throws on HTTP errors.
 *
 * @param url - API endpoint URL
 * @param options - Fetch options
 * @returns Promise<T> - Parsed JSON response
 */
export async function apiJSON<T = unknown>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await apiFetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      errorData.error || `API request failed: ${response.statusText}`
    )
  }

  return response.json()
}

/**
 * Stream fetch wrapper with CSRF protection
 *
 * For streaming responses (SSE, chunked encoding).
 *
 * @param url - API endpoint URL
 * @param options - Fetch options
 * @returns Promise<ReadableStream>
 */
export async function apiStream(
  url: string,
  options: RequestInit = {}
): Promise<ReadableStream<Uint8Array>> {
  const response = await apiFetch(url, options)

  if (!response.ok) {
    throw new Error(`Stream request failed: ${response.statusText}`)
  }

  if (!response.body) {
    throw new Error('Response body is null')
  }

  return response.body
}
