/**
 * URL State Management Utilities
 *
 * Uses lz-string for efficient compression of playground state into shareable URLs.
 * Follows the same pattern as TypeScript Playground and other industry-standard tools.
 */

import LZString from 'lz-string'
import type { PlaygroundState, PlaygroundSettings } from '../types'

const URL_CODE_PARAM = 'code'
const URL_STATE_PARAM = 'state'
const URL_TEMPLATE_PARAM = 'template'
const URL_THEME_PARAM = 'theme'

// Maximum URL length (most browsers support ~2000 characters)
const MAX_URL_LENGTH = 2000

const DEFAULT_SETTINGS: PlaygroundSettings = {
  autoRun: true,
  lineNumbers: true,
  fontSize: 14,
  tabSize: 2,
  wordWrap: false,
  minimap: false,
}

/**
 * Compresses a string using lz-string for URL-safe encoding
 */
export function compress(str: string): string {
  return LZString.compressToEncodedURIComponent(str)
}

/**
 * Decompresses a URL-safe lz-string encoded string
 */
export function decompress(compressed: string): string | null {
  try {
    return LZString.decompressFromEncodedURIComponent(compressed)
  } catch {
    return null
  }
}

/**
 * Encodes playground state into a shareable URL
 */
export function encodePlaygroundState(state: PlaygroundState): string {
  const stateToEncode = {
    code: state.code,
    templateId: state.templateId,
    theme: state.theme,
    settings: state.settings,
  }

  const json = JSON.stringify(stateToEncode)
  return compress(json)
}

/**
 * Decodes playground state from URL parameter
 */
export function decodePlaygroundState(encoded: string): PlaygroundState | null {
  try {
    const json = decompress(encoded)
    if (!json) return null

    const parsed = JSON.parse(json)
    return {
      code: parsed.code || '',
      templateId: parsed.templateId,
      theme: parsed.theme || 'light',
      settings: {
        ...DEFAULT_SETTINGS,
        ...parsed.settings,
      },
    }
  } catch {
    return null
  }
}

/**
 * Creates a shareable URL from playground state
 */
export function createShareableUrl(
  state: PlaygroundState,
  baseUrl?: string
): { url: string; shortened: boolean } {
  const base = baseUrl || window.location.origin + window.location.pathname
  const encoded = encodePlaygroundState(state)
  const fullUrl = `${base}?${URL_STATE_PARAM}=${encoded}`

  // Check if URL is too long
  if (fullUrl.length > MAX_URL_LENGTH) {
    // Try encoding just the code
    const codeOnly = compress(state.code)
    const shorterUrl = `${base}?${URL_CODE_PARAM}=${codeOnly}`

    if (shorterUrl.length <= MAX_URL_LENGTH) {
      return { url: shorterUrl, shortened: true }
    }

    // Still too long, return what we have with a warning
    return { url: fullUrl, shortened: false }
  }

  return { url: fullUrl, shortened: false }
}

/**
 * Parses playground state from current URL
 */
export function parseUrlState(): Partial<PlaygroundState> | null {
  if (typeof window === 'undefined') return null

  const params = new URLSearchParams(window.location.search)

  // Try full state parameter first
  const stateParam = params.get(URL_STATE_PARAM)
  if (stateParam) {
    const state = decodePlaygroundState(stateParam)
    if (state) return state
  }

  // Try code-only parameter (legacy/short URL)
  const codeParam = params.get(URL_CODE_PARAM)
  if (codeParam) {
    const code = decompress(codeParam)
    if (code) {
      return {
        code,
        theme: (params.get(URL_THEME_PARAM) as 'light' | 'dark') || 'light',
        settings: DEFAULT_SETTINGS,
      }
    }

    // Try base64 decoding (legacy format)
    try {
      const decoded = atob(decodeURIComponent(codeParam))
      return {
        code: decoded,
        theme: 'light',
        settings: DEFAULT_SETTINGS,
      }
    } catch {
      // Not valid base64
    }
  }

  // Try template parameter
  const templateParam = params.get(URL_TEMPLATE_PARAM)
  if (templateParam) {
    return {
      templateId: templateParam,
      theme: (params.get(URL_THEME_PARAM) as 'light' | 'dark') || 'light',
      settings: DEFAULT_SETTINGS,
    }
  }

  return null
}

/**
 * Updates the browser URL without triggering navigation
 */
export function updateUrlState(state: PlaygroundState): void {
  if (typeof window === 'undefined') return

  const { url } = createShareableUrl(state)

  try {
    window.history.replaceState({ playgroundState: state }, '', url)
  } catch {
    // Silently fail if history API is not available
  }
}

/**
 * Clears playground state from URL
 */
export function clearUrlState(): void {
  if (typeof window === 'undefined') return

  try {
    const url = window.location.origin + window.location.pathname
    window.history.replaceState({}, '', url)
  } catch {
    // Silently fail
  }
}

/**
 * Copies a shareable URL to clipboard
 */
export async function copyShareableUrl(state: PlaygroundState): Promise<{
  success: boolean
  url: string
  warning?: string
}> {
  const { url, shortened } = createShareableUrl(state)

  try {
    await navigator.clipboard.writeText(url)
    return {
      success: true,
      url,
      warning: shortened
        ? 'URL was shortened. Some settings may not be preserved.'
        : undefined,
    }
  } catch {
    return {
      success: false,
      url,
      warning: 'Failed to copy to clipboard. Please copy manually.',
    }
  }
}

/**
 * Estimates the compression ratio for given code
 */
export function estimateCompressionRatio(code: string): {
  original: number
  compressed: number
  ratio: number
} {
  const compressed = compress(code)
  return {
    original: code.length,
    compressed: compressed.length,
    ratio: compressed.length / code.length,
  }
}

/**
 * Checks if a URL is shareable (within length limits)
 */
export function isShareable(state: PlaygroundState): boolean {
  const { url } = createShareableUrl(state)
  return url.length <= MAX_URL_LENGTH
}
